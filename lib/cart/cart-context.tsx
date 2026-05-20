"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Product } from "@/types/product";

const MAX_LINE_QUANTITY = 10;

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartLine[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  addItem: (product: Product) => void;
  removeItem: (handle: string) => void;
  updateQuantity: (handle: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((line) => line.product.handle === product.handle);
      if (existing) {
        return prev.map((line) =>
          line.product.handle === product.handle
            ? { ...line, quantity: Math.min(MAX_LINE_QUANTITY, line.quantity + 1) }
            : line
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((handle: string) => {
    setItems((prev) => prev.filter((line) => line.product.handle !== handle));
  }, []);

  const updateQuantity = useCallback((handle: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((line) => line.product.handle !== handle);
      return prev.map((line) =>
        line.product.handle === handle
          ? { ...line, quantity: Math.min(MAX_LINE_QUANTITY, quantity) }
          : line
      );
    });
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const count = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, line) => sum + line.product.price.amount * line.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      count,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      openCart,
      closeCart,
    }),
    [items, isOpen, count, subtotal, addItem, removeItem, updateQuantity, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
