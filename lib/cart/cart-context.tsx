"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { formatVariantTitle } from "@/lib/product/variant";
import type { Product, ProductVariant } from "@/types/product";

const MAX_LINE_QUANTITY = 10;
const FREE_SHIPPING_THRESHOLD = 150;

// [shopify-ready]: swap this shape for Shopify CartLine gql fragment
export interface CartLine {
  id: string;              // local: "line-N", shopify: gid://shopify/CartLine/...
  productId: string;       // product.handle,   shopify: Product.id
  /**
   * Shopify `ProductVariant.id` — the `merchandiseId` of a cart line.
   * Always the real catalogue identifier: callers pass a resolved
   * `ProductVariant`, never a title string we composed ourselves.
   */
  variantId: string;
  handle: string;
  title: string;
  variantTitle: string;    // "200g · Ziarna"
  image: { src: string; alt: string };
  price: number;
  currencyCode: string;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  checkoutUrl: string | null; // [shopify-ready]: Shopify cart.checkoutUrl
  /**
   * Add a resolved variant to the cart.
   *
   * [shopify-ready]: maps to `cartLinesAdd({ merchandiseId: variant.variantId,
   * quantity })`. The variant must come from the catalogue (see
   * `lib/product/variant.ts`) — there is deliberately no overload that
   * accepts a product alone, because that would require inventing an id.
   */
  addToCart: (product: Product, variant: ProductVariant, qty?: number) => void;
  // [shopify-ready]: map updateCartLine → cartLinesUpdate mutation
  updateCartLine: (id: string, quantity: number) => void;
  // [shopify-ready]: map removeCartLine → cartLinesRemove mutation
  removeCartLine: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const lineCounter = 0;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const counterRef = useRef(lineCounter);

  const addToCart = useCallback(
    (product: Product, variant: ProductVariant, qty = 1) => {
      const variantId = variant.variantId;
      if (!variantId) return; // nothing purchasable — never guess an id

      const image = variant.image ?? product.featuredImage;

      setLines((prev) => {
        const existing = prev.find((l) => l.variantId === variantId);
        if (existing) {
          return prev.map((l) =>
            l.variantId === variantId
              ? { ...l, quantity: Math.min(MAX_LINE_QUANTITY, l.quantity + qty) }
              : l
          );
        }
        counterRef.current += 1;
        const newLine: CartLine = {
          id: `line-${counterRef.current}`,
          productId: product.handle,
          variantId,
          handle: product.handle,
          title: product.shortName,
          variantTitle: formatVariantTitle(variant),
          image: {
            src: image?.src ?? "",
            alt: image?.alt ?? product.shortName,
          },
          // Per-variant price — the product-level price is only a "from" value.
          price: variant.price.amount,
          currencyCode: variant.price.currencyCode,
          quantity: Math.min(MAX_LINE_QUANTITY, qty),
        };
        return [...prev, newLine];
      });
    },
    []
  );

  const updateCartLine = useCallback((id: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) return prev.filter((l) => l.id !== id);
      return prev.map((l) =>
        l.id === id ? { ...l, quantity: Math.min(MAX_LINE_QUANTITY, quantity) } : l
      );
    });
  }, []);

  const removeCartLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

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
      checkoutUrl: null, // [shopify-ready]: set from Shopify cart mutation response
      addToCart,
      updateCartLine,
      removeCartLine,
      openCart,
      closeCart,
    }),
    [lines, isOpen, count, subtotal, addToCart, updateCartLine, removeCartLine, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export { FREE_SHIPPING_THRESHOLD };
