"use client";

import { CartReceiptPage } from "@/components/cart/CartReceiptPage";

/**
 * /koszyk — Cart page (V2 Receipt / Paragon).
 *
 * Layout: see components/cart/CartReceiptPage.tsx.
 * Design source: design-reference/claude-design-v2.1/cart-receipt/.
 * Cart state: useCart() from @/lib/cart/cart-context (Shopify-ready model).
 * Checkout: placeholder until Shopify Storefront API is wired up.
 */
export default function KoszykPage() {
  return <CartReceiptPage />;
}
