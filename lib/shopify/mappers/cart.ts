/**
 * Shopify → Aura cart mapping.
 *
 * Not yet wired up — the cart still runs on in-memory mock state.
 * Lands in Sprint 2 (Cart + Checkout). Kept here so the shape is settled
 * and the Sprint 2 diff stays small.
 */

import type { CartLine } from "@/lib/cart/cart-context";
import type { ShopifyCartLine } from "../types";

/** Map a Shopify cart line onto the app `CartLine` type. */
export function mapShopifyCartLine(node: ShopifyCartLine): CartLine {
  const m = node.merchandise;
  return {
    id: node.id,
    productId: m.product.handle,
    variantId: m.id,
    handle: m.product.handle,
    title: m.product.title,
    variantTitle: m.title,
    image: {
      src: m.product.featuredImage?.url ?? "",
      alt: m.product.featuredImage?.altText ?? m.product.title,
    },
    price: Number(m.price.amount),
    currencyCode: m.price.currencyCode,
    quantity: node.quantity,
  };
}
