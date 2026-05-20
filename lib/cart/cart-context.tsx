"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { Product } from "@/types/product";

const MAX_LINE_QUANTITY = 10;
const FREE_SHIPPING_THRESHOLD = 150;

// [shopify-ready]: swap this shape for Shopify CartLine gql fragment
export interface CartLine {
  id: string;              // local: "line-N", shopify: gid://shopify/CartLine/...
  productId: string;       // product.handle,   shopify: Product.id
  variantId: string;       // `${handle}::${variantTitle}`, shopify: ProductVariant.id
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
  // [shopify-ready]: map addToCart → cartLinesAdd mutation
  addToCart: (product: Product, variantTitle?: string, qty?: number) => void;
  // [shopify-ready]: map updateCartLine → cartLinesUpdate mutation
  updateCartLine: (id: string, quantity: number) => void;
  // [shopify-ready]: map removeCartLine → cartLinesRemove mutation
  removeCartLine: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

let lineCounter = 0;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const counterRef = useRef(lineCounter);

  const addToCart = useCallback(
    (product: Product, variantTitle = "Standard", qty = 1) => {
      const variantId = `${product.handle}::${variantTitle}`;
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
          variantTitle,
          image: { src: "", alt: product.shortName },
          price: product.price.amount,
          currencyCode: product.price.currencyCode,
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
