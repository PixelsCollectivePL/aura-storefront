/**
 * Cart data layer — Shopify Cart API.
 *
 * SERVER-ONLY (transitively: `client.ts` holds the private token). Call
 * from Server Actions or Route Handlers.
 *
 * ── Failure policy: the opposite of the catalogue ─────────────────────
 * The catalogue degrades silently to `[]`, because a shop with no visible
 * products still renders. A cart must NOT do that: a dropped add-to-cart
 * or a swallowed quantity change loses a sale and, worse, looks like it
 * worked. Every function here returns `{ cart, error }` and the caller is
 * expected to surface `error` to the customer.
 *
 * That distinction is deliberate. A permission or schema problem here
 * shows up as a visible message instead of an empty cart — the exact
 * failure mode that hid a missing scope in the catalogue for five days.
 *
 * ── Cart lifetime ────────────────────────────────────────────────────
 * Shopify carts expire (10 days idle, and they vanish once the order is
 * placed). A `cart(id:)` query for a dead cart returns `null`, not an
 * error — `getCart` reports that as `null` with no error so the caller can
 * quietly start a new one.
 */

import { shopifyFetch, ShopifyError } from "../client";
import { mapShopifyCart } from "../mappers/cart";
import {
  CART_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_DISCOUNT_CODES_UPDATE_MUTATION,
} from "./operations";
import type {
  CartQueryResult,
  CartCreateResult,
  CartLinesAddResult,
  CartLinesUpdateResult,
  CartLinesRemoveResult,
  CartDiscountCodesUpdateResult,
  ShopifyCartMutationPayload,
} from "../types";
import type { Cart, CartResult } from "@/types/cart";

/** Cart reads and writes are never cached — the cart is per-shopper state. */
const NO_CACHE = { revalidate: false as const, tags: [] as string[] };

/** What every function here needs: the buyer's IP, when we know it. */
export interface CartContext {
  buyerIp?: string;
}

const GENERIC_ERROR =
  "Nie udało się zaktualizować koszyka. Odśwież stronę i spróbuj ponownie.";

/**
 * Turn a thrown transport/GraphQL failure into a customer-facing message,
 * while logging the technical detail for Vercel.
 *
 * Permission and schema failures are logged at a louder level than
 * outages, because they never fix themselves.
 */
function describeFailure(operation: string, err: unknown): string {
  if (err instanceof ShopifyError) {
    const graphQL = err.graphQLErrors?.map((e) => e.message).join("; ") ?? "";
    const isAccessProblem = /access denied|required access|scope/i.test(graphQL);

    if (isAccessProblem) {
      console.error(
        `[aura/cart] KONFIGURACJA: ${operation} odrzucone przez Shopify z powodu uprawnień. ${graphQL}`
      );
      return "Koszyk jest chwilowo niedostępny z powodu konfiguracji sklepu. Pracujemy nad tym.";
    }

    console.error(`[aura/cart] ${operation} nie powiodło się: ${err.message}`);
    return GENERIC_ERROR;
  }

  console.error(
    `[aura/cart] ${operation} nie powiodło się: ${
      err instanceof Error ? err.message : "nieznany błąd"
    }`
  );
  return GENERIC_ERROR;
}

/**
 * Normalise a mutation payload.
 *
 * `userErrors` are business rejections (sold out, over stock, unknown
 * variant) delivered with HTTP 200. Shopify's messages are English; we
 * pass the first one through rather than inventing a translation, because
 * a wrong guess about *why* the line was rejected is worse than English.
 */
function readMutation(
  operation: string,
  payload: ShopifyCartMutationPayload | undefined
): CartResult {
  if (!payload) {
    console.error(`[aura/cart] ${operation}: brak payloadu w odpowiedzi.`);
    return { cart: null, error: GENERIC_ERROR };
  }

  const cart = payload.cart ? mapShopifyCart(payload.cart) : null;

  if (payload.userErrors?.length) {
    const first = payload.userErrors[0];
    console.error(
      `[aura/cart] ${operation} userErrors: ${payload.userErrors
        .map((e) => `${e.code ?? "?"}: ${e.message}`)
        .join(" | ")}`
    );
    return { cart, error: first.message || GENERIC_ERROR };
  }

  return { cart, error: null };
}

/* ─── Read ────────────────────────────────────────────────────────────── */

/**
 * Fetch a cart by id.
 *
 * `{ cart: null, error: null }` means the cart no longer exists — expired,
 * or already converted into an order. Callers should drop the stored id.
 */
export async function getCart(
  cartId: string,
  ctx: CartContext = {}
): Promise<CartResult> {
  if (!cartId) return { cart: null, error: null };

  try {
    const data = await shopifyFetch<CartQueryResult>({
      query: CART_QUERY,
      variables: { id: cartId },
      buyerIp: ctx.buyerIp,
      ...NO_CACHE,
    });
    return { cart: data.cart ? mapShopifyCart(data.cart) : null, error: null };
  } catch (err) {
    return { cart: null, error: describeFailure("getCart", err) };
  }
}

/* ─── Write ───────────────────────────────────────────────────────────── */

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

/** Create a cart, optionally with its first lines. */
export async function createCart(
  lines: CartLineInput[] = [],
  ctx: CartContext = {}
): Promise<CartResult> {
  try {
    const data = await shopifyFetch<CartCreateResult>({
      query: CART_CREATE_MUTATION,
      variables: { lines },
      buyerIp: ctx.buyerIp,
      ...NO_CACHE,
    });
    return readMutation("cartCreate", data.cartCreate);
  } catch (err) {
    return { cart: null, error: describeFailure("cartCreate", err) };
  }
}

/** Add lines to an existing cart. Shopify merges duplicate variants itself. */
export async function addCartLines(
  cartId: string,
  lines: CartLineInput[],
  ctx: CartContext = {}
): Promise<CartResult> {
  try {
    const data = await shopifyFetch<CartLinesAddResult>({
      query: CART_LINES_ADD_MUTATION,
      variables: { cartId, lines },
      buyerIp: ctx.buyerIp,
      ...NO_CACHE,
    });
    return readMutation("cartLinesAdd", data.cartLinesAdd);
  } catch (err) {
    return { cart: null, error: describeFailure("cartLinesAdd", err) };
  }
}

/** Set the quantity of an existing line. */
export async function updateCartLineQuantity(
  cartId: string,
  lineId: string,
  quantity: number,
  ctx: CartContext = {}
): Promise<CartResult> {
  try {
    const data = await shopifyFetch<CartLinesUpdateResult>({
      query: CART_LINES_UPDATE_MUTATION,
      variables: { cartId, lines: [{ id: lineId, quantity }] },
      buyerIp: ctx.buyerIp,
      ...NO_CACHE,
    });
    return readMutation("cartLinesUpdate", data.cartLinesUpdate);
  } catch (err) {
    return { cart: null, error: describeFailure("cartLinesUpdate", err) };
  }
}

/** Remove lines outright. */
export async function removeCartLines(
  cartId: string,
  lineIds: string[],
  ctx: CartContext = {}
): Promise<CartResult> {
  try {
    const data = await shopifyFetch<CartLinesRemoveResult>({
      query: CART_LINES_REMOVE_MUTATION,
      variables: { cartId, lineIds },
      buyerIp: ctx.buyerIp,
      ...NO_CACHE,
    });
    return readMutation("cartLinesRemove", data.cartLinesRemove);
  } catch (err) {
    return { cart: null, error: describeFailure("cartLinesRemove", err) };
  }
}

/**
 * Replace the cart's discount codes.
 *
 * Shopify accepts an unknown code without failing: the code comes back
 * with `applicable: false`. Callers must check that flag rather than
 * assuming success — see `types/cart.ts`.
 */
export async function setCartDiscountCodes(
  cartId: string,
  discountCodes: string[],
  ctx: CartContext = {}
): Promise<CartResult> {
  try {
    const data = await shopifyFetch<CartDiscountCodesUpdateResult>({
      query: CART_DISCOUNT_CODES_UPDATE_MUTATION,
      variables: { cartId, discountCodes },
      buyerIp: ctx.buyerIp,
      ...NO_CACHE,
    });
    return readMutation(
      "cartDiscountCodesUpdate",
      data.cartDiscountCodesUpdate
    );
  } catch (err) {
    return {
      cart: null,
      error: describeFailure("cartDiscountCodesUpdate", err),
    };
  }
}

export type { Cart };
