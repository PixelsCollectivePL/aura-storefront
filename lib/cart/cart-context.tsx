"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  fetchCartAction,
  addToCartAction,
  updateCartLineAction,
  removeCartLineAction,
  applyDiscountCodeAction,
  checkoutAction,
} from "@/app/actions/cart";
import { showToast } from "@/lib/toast/toast";
import type { Product, ProductVariant } from "@/types/product";
import type { Cart, CartDiscountCode, CartLine, CartResult } from "@/types/cart";

const MAX_LINE_QUANTITY = 10;
const FREE_SHIPPING_THRESHOLD = 150;

/** Shared empty array, so an empty cart keeps a stable identity. */
const EMPTY_LINES: CartLine[] = [];
const EMPTY_DISCOUNTS: CartDiscountCode[] = [];

/**
 * Cart state, backed by the Shopify Cart API.
 *
 * Shopify is the source of truth. This context is a thin client cache over
 * it: every mutation goes through a Server Action and the returned cart
 * replaces local state wholesale, so quantities, prices and availability
 * can never drift from what checkout will charge.
 *
 * ── Hydration ────────────────────────────────────────────────────────
 * The cart is fetched once on mount rather than rendered on the server.
 * That is a deliberate trade: reading the `cartId` cookie during layout
 * render would opt the entire storefront out of static generation. The
 * cost is that the header badge starts at 0 for one paint.
 *
 * ── Optimistic updates ───────────────────────────────────────────────
 * Quantity changes and removals apply locally first, because the stepper
 * has to feel instant. Adds do not: the line id comes from Shopify, so
 * there is nothing to key an optimistic line on. The drawer opens
 * immediately regardless, and shows the pending state.
 */

export type { CartLine };

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  /** Shopify-hosted checkout URL. Prefer `checkout()` over using it directly. */
  checkoutUrl: string | null;
  /** Discount codes on the cart, with Shopify's verdict on each. */
  discountCodes: CartDiscountCode[];
  /** True while any cart mutation is in flight. */
  isPending: boolean;
  /** True once the initial cart fetch has resolved. */
  isHydrated: boolean;
  /** Last customer-facing failure, or `null`. Also raised as a toast. */
  error: string | null;

  /** Resolves `true` when Shopify accepted the line. */
  addToCart: (
    product: Product,
    variant: ProductVariant,
    qty?: number
  ) => Promise<boolean>;
  updateCartLine: (lineId: string, quantity: number) => Promise<void>;
  removeCartLine: (lineId: string) => Promise<void>;
  applyDiscountCode: (code: string) => Promise<void>;
  /** Re-reads the cart, then redirects to Shopify checkout. */
  checkout: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from the HttpOnly cookie once on mount.
  useEffect(() => {
    let active = true;
    fetchCartAction()
      .then((result) => {
        if (!active) return;
        if (result.cart) setCart(result.cart);
        if (result.error) setError(result.error);
      })
      .catch(() => {
        // A failed hydration must not break the page — the shopper simply
        // starts with an empty cart and the next mutation retries.
        if (active) setError(null);
      })
      .finally(() => {
        if (active) setIsHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  /** Apply a Server Action result: adopt the cart, surface any failure. */
  const applyResult = useCallback((result: CartResult) => {
    if (result.cart) setCart(result.cart);
    if (result.error) {
      setError(result.error);
      showToast(result.error);
    } else {
      setError(null);
    }
  }, []);

  /**
   * Run a mutation with the pending flag held for its duration.
   * Resolves `true` only when Shopify accepted the change — callers use
   * that to decide whether to claim success in the UI.
   */
  const run = useCallback(
    async (op: () => Promise<CartResult>): Promise<boolean> => {
      setIsPending(true);
      try {
        const result = await op();
        applyResult(result);
        return !result.error;
      } catch {
        const message =
          "Nie udało się połączyć z koszykiem. Sprawdź połączenie i spróbuj ponownie.";
        setError(message);
        showToast(message);
        return false;
      } finally {
        setIsPending(false);
      }
    },
    [applyResult]
  );

  const addToCart = useCallback(
    async (product: Product, variant: ProductVariant, qty = 1) => {
      if (!variant?.variantId) return false;
      const quantity = Math.min(MAX_LINE_QUANTITY, Math.max(1, qty));
      return run(() => addToCartAction(variant.variantId, quantity));
    },
    [run]
  );

  const updateCartLine = useCallback(
    async (lineId: string, quantity: number) => {
      const clamped = Math.min(MAX_LINE_QUANTITY, quantity);

      // Optimistic: the stepper must not wait for a round trip.
      setCart((prev) =>
        prev
          ? {
              ...prev,
              lines:
                clamped <= 0
                  ? prev.lines.filter((l) => l.id !== lineId)
                  : prev.lines.map((l) =>
                      l.id === lineId ? { ...l, quantity: clamped } : l
                    ),
            }
          : prev
      );

      await run(() => updateCartLineAction(lineId, clamped));
    },
    [run]
  );

  const removeCartLine = useCallback(
    async (lineId: string) => {
      setCart((prev) =>
        prev ? { ...prev, lines: prev.lines.filter((l) => l.id !== lineId) } : prev
      );
      await run(() => removeCartLineAction(lineId));
    },
    [run]
  );

  const applyDiscountCode = useCallback(
    async (code: string) => {
      await run(() => applyDiscountCodeAction(code));
    },
    [run]
  );

  const checkout = useCallback(async () => {
    setIsPending(true);
    setError(null);
    try {
      // On success this never returns — the action issues a redirect.
      const result = await checkoutAction();
      applyResult(result);
    } catch (err) {
      // Next signals redirects by throwing; that is the success path.
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")
      ) {
        throw err;
      }
      const message = "Nie udało się otworzyć kasy. Spróbuj ponownie.";
      setError(message);
      showToast(message);
    } finally {
      setIsPending(false);
    }
  }, [applyResult]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // Memoised so the empty-cart case doesn't hand out a fresh `[]` on every
  // render and invalidate every downstream memo.
  const lines = useMemo(() => cart?.lines ?? EMPTY_LINES, [cart?.lines]);

  // Derived locally rather than read from Shopify's totals, so optimistic
  // quantity changes move the free-shipping bar in the same frame.
  const count = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines]
  );
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      isOpen,
      count,
      subtotal,
      checkoutUrl: cart?.checkoutUrl ?? null,
      discountCodes: cart?.discountCodes ?? EMPTY_DISCOUNTS,
      isPending,
      isHydrated,
      error,
      addToCart,
      updateCartLine,
      removeCartLine,
      applyDiscountCode,
      checkout,
      openCart,
      closeCart,
    }),
    [
      lines,
      isOpen,
      count,
      subtotal,
      cart?.checkoutUrl,
      cart?.discountCodes,
      isPending,
      isHydrated,
      error,
      addToCart,
      updateCartLine,
      removeCartLine,
      applyDiscountCode,
      checkout,
      openCart,
      closeCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export { FREE_SHIPPING_THRESHOLD, MAX_LINE_QUANTITY };
