"use server";

/**
 * Cart Server Actions — the only bridge between the client cart and Shopify.
 *
 * Why Server Actions rather than Route Handlers: the private Storefront
 * token must stay on the server, the `cartId` cookie must be HttpOnly, and
 * both need to be set from the same request that mutates the cart. Actions
 * give us all three without inventing an internal REST layer.
 *
 * ── What the browser never sees ──────────────────────────────────────
 * The Storefront token, and the cart id. The id is a bearer capability:
 * anyone holding it can read and modify that cart, so it lives in an
 * HttpOnly cookie and is never returned to the client. The client only
 * ever receives the mapped `Cart`.
 */

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  getCart,
  createCart,
  addCartLines,
  updateCartLineQuantity,
  removeCartLines,
  setCartDiscountCodes,
  setCartBuyerIdentity,
  type CartContext,
} from "@/lib/shopify/cart";
import type { CartResult } from "@/types/cart";
import { getValidCustomerSession } from "@/lib/shopify/customer-account/client";
import { readSession } from "@/lib/shopify/customer-account/session";
import { getCustomerOrder } from "@/lib/shopify/customer-account/account-data";
import { getVariantsByIds } from "@/lib/shopify/variants";
import { planReorderLines } from "@/lib/account/reorder";

const CART_COOKIE = "aura_cart_id";

/**
 * 30 days. Long enough that a shopper who leaves and comes back next week
 * still finds their coffee, short enough that a shared computer forgets.
 * Shopify's own cart expiry (10 days idle) is the real ceiling; if the cart
 * is gone we simply start a new one.
 */
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const EMPTY: CartResult = { cart: null, error: null };

async function readCartId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

async function writeCartId(cartId: string): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}

async function clearCartId(): Promise<void> {
  const store = await cookies();
  store.delete(CART_COOKIE);
}

/**
 * Buyer IP for `Shopify-Storefront-Buyer-IP`.
 *
 * On Vercel the client address is the first entry of `x-forwarded-for`;
 * later entries are proxies. `x-real-ip` is the fallback.
 */
async function cartContext(): Promise<CartContext> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return { buyerIp: forwarded || h.get("x-real-ip") || undefined };
}

/**
 * Persist whatever cart a mutation produced, and drop a dead cookie.
 *
 * A cart id can change under us (Shopify may return a new cart), so the
 * cookie is rewritten from the response rather than assumed stable.
 */
async function syncCookie(result: CartResult): Promise<CartResult> {
  if (result.cart?.id) {
    await writeCartId(result.cart.id);
  } else if (!result.error) {
    // No cart and no failure → the cart is genuinely gone.
    await clearCartId();
  }
  return result;
}

/* ─── Read ────────────────────────────────────────────────────────────── */

/**
 * Current cart for this browser. Called once on mount to hydrate the
 * client context, which is what keeps every page statically renderable —
 * reading cookies in the layout would make the whole storefront dynamic.
 */
export async function fetchCartAction(): Promise<CartResult> {
  const cartId = await readCartId();
  if (!cartId) return EMPTY;

  const result = await getCart(cartId, await cartContext());

  // Expired or already ordered: forget it silently, the shopper starts fresh.
  if (!result.cart && !result.error) await clearCartId();

  return result;
}

/* ─── Write ───────────────────────────────────────────────────────────── */

/**
 * Add a variant, creating the cart on first add.
 *
 * `merchandiseId` must be a real `gid://shopify/ProductVariant/...` —
 * resolved by `lib/product/variant.ts`, never composed from a title.
 */
export async function addToCartAction(
  merchandiseId: string,
  quantity = 1
): Promise<CartResult> {
  if (!merchandiseId.startsWith("gid://shopify/ProductVariant/")) {
    console.error(
      `[aura/cart] addToCartAction odrzucone: "${merchandiseId}" nie jest GID wariantu.`
    );
    return { cart: null, error: "Nie rozpoznano wariantu produktu." };
  }

  const ctx = await cartContext();
  const lines = [{ merchandiseId, quantity }];
  const cartId = await readCartId();

  if (!cartId) {
    return syncCookie(await createCart(lines, ctx));
  }

  const result = await addCartLines(cartId, lines, ctx);

  // The stored cart expired between visits — create a new one rather than
  // dropping the customer's click on the floor.
  if (!result.cart && !result.error) {
    return syncCookie(await createCart(lines, ctx));
  }

  return syncCookie(result);
}

export interface ReorderResult extends CartResult {
  addedCount: number;
  skipped: string[];
}

/** Rebuild an old order from current variants and current Shopify prices. */
export async function reorderAction(orderId: string): Promise<ReorderResult> {
  const empty = { cart: null, addedCount: 0, skipped: [] };
  if (!/^gid:\/\/shopify\/Order\/\d+$/.test(orderId)) {
    return { ...empty, error: "Nie rozpoznano zamówienia." };
  }

  try {
    // Refreshing here is safe: Server Actions are allowed to update cookies.
    await getValidCustomerSession();
    const order = await getCustomerOrder(orderId);
    if (!order) return { ...empty, error: "Nie znaleziono zamówienia." };

    const ctx = await cartContext();
    const historical = order.items.filter((item) => item.variantId);
    const current = await getVariantsByIds(
      historical.map((item) => item.variantId),
      ctx.buyerIp
    );
    const { lines, skipped } = planReorderLines(historical, current);

    if (lines.length === 0) {
      return {
        ...empty,
        skipped,
        error: "Żaden wariant z tego zamówienia nie jest obecnie dostępny.",
      };
    }

    const cartId = await readCartId();
    let result = cartId
      ? await addCartLines(cartId, lines, ctx)
      : await createCart(lines, ctx);
    if (cartId && !result.cart && !result.error) result = await createCart(lines, ctx);
    result = await syncCookie(result);
    return {
      ...result,
      addedCount: result.error ? 0 : lines.reduce((sum, line) => sum + line.quantity, 0),
      skipped,
    };
  } catch (error) {
    console.error(
      `[aura/cart] reorderAction nie powiodło się: ${error instanceof Error ? error.message : "nieznany błąd"}`
    );
    return { ...empty, error: "Nie udało się ponowić zamówienia. Spróbuj ponownie." };
  }
}

/** Set a line's quantity. `0` removes it, matching the UI's stepper. */
export async function updateCartLineAction(
  lineId: string,
  quantity: number
): Promise<CartResult> {
  const cartId = await readCartId();
  if (!cartId) return EMPTY;

  const ctx = await cartContext();
  const result =
    quantity <= 0
      ? await removeCartLines(cartId, [lineId], ctx)
      : await updateCartLineQuantity(cartId, lineId, quantity, ctx);

  return syncCookie(result);
}

export async function removeCartLineAction(
  lineId: string
): Promise<CartResult> {
  const cartId = await readCartId();
  if (!cartId) return EMPTY;

  return syncCookie(await removeCartLines(cartId, [lineId], await cartContext()));
}

/**
 * Apply a discount code.
 *
 * Shopify accepts unknown codes without complaint and marks them
 * `applicable: false`, so success here does not mean the code worked —
 * the caller inspects `cart.discountCodes`.
 */
export async function applyDiscountCodeAction(
  code: string
): Promise<CartResult> {
  const cartId = await readCartId();
  if (!cartId) return { cart: null, error: "Koszyk jest pusty." };

  const trimmed = code.trim();
  const result = await setCartDiscountCodes(
    cartId,
    trimmed ? [trimmed] : [],
    await cartContext()
  );

  // An inapplicable code is deliberately NOT reported as `error`.
  //
  // `error` means the operation failed — network, GraphQL, permissions — and
  // the cart context turns it into a toast. A code Shopify accepted but
  // marked `applicable: false` is a business outcome, not a failure: the
  // request worked and the cart is exactly what Shopify says it is. It is
  // reported once, inline next to the field, from `cart.discountCodes`.
  //
  // Returning both produced two different explanations of one event — a
  // toast saying "nieprawidłowy" and inline text saying "nie jest dostępny
  // dla tego koszyka" — which is worse than either alone.
  return syncCookie(result);
}

/* ─── Checkout hand-off ───────────────────────────────────────────────── */

/**
 * Send the shopper to Shopify-hosted checkout.
 *
 * The cart is re-read first, on purpose: `checkoutUrl` carries a required
 * `key` parameter and can go stale, and this is also the last chance to
 * notice the cart expired. The URL is used exactly as Shopify returns it —
 * never rebuilt by hand.
 *
 * If a Customer Account session exists, its current access token is attached
 * to buyerIdentity before obtaining the final checkout URL. The token never
 * leaves the server action.
 */
export async function checkoutAction(): Promise<CartResult> {
  const cartId = await readCartId();
  if (!cartId) return { cart: null, error: "Koszyk jest pusty." };

  const ctx = await cartContext();
  const existingCustomerSession = await readSession();

  if (existingCustomerSession) {
    try {
      const customerSession = await getValidCustomerSession();
      const identityResult = await setCartBuyerIdentity(
        cartId,
        customerSession.accessToken,
        ctx
      );
      if (identityResult.error) return identityResult;
      if (!identityResult.cart) {
        await clearCartId();
        return { cart: null, error: "Koszyk wygasł. Dodaj produkty ponownie." };
      }
    } catch (error) {
      console.error(
        `[aura/cart] Nie udało się odświeżyć sesji klienta przed checkoutem: ${
          error instanceof Error ? error.message : "nieznany błąd"
        }`
      );
      return {
        cart: null,
        error: "Sesja klienta wygasła. Zaloguj się ponownie przed przejściem do kasy.",
      };
    }
  }

  // Re-read after buyerIdentity update. Shopify recommends obtaining the
  // checkout URL immediately before navigation and with the same buyer IP.
  const { cart, error } = await getCart(cartId, ctx);

  if (error) return { cart, error };

  if (!cart) {
    await clearCartId();
    return {
      cart: null,
      error: "Koszyk wygasł. Dodaj produkty ponownie.",
    };
  }

  if (cart.lines.length === 0) {
    return { cart, error: "Koszyk jest pusty." };
  }

  if (!cart.checkoutUrl) {
    console.error("[aura/cart] checkoutAction: Shopify nie zwróciło checkoutUrl.");
    return { cart, error: "Kasa jest chwilowo niedostępna. Spróbuj ponownie." };
  }

  // Throws internally — must be outside any try/catch.
  redirect(cart.checkoutUrl);
}
