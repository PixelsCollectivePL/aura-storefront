/**
 * Shopify → Aura cart mapping.
 *
 * The single place that knows the Cart API response shape. Components see
 * `Cart` / `CartLine` from `types/cart.ts` and stay unaware of Shopify.
 *
 * Pure and dependency-free.
 */

import type { Cart, CartLine } from "@/types/cart";
import type { ShopifyCart, ShopifyCartLine } from "../types";

/** Shopify returns money as a decimal string; the UI works in numbers. */
function toAmount(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * "500g · Ziarno" from the variant's selected options, falling back to
 * Shopify's own variant title when a product has no option axes.
 *
 * Mirrors `formatVariantTitle` in `lib/product/variant.ts`, so a line looks
 * the same whether it was just added or re-read from Shopify.
 */
function variantLabel(node: ShopifyCartLine): string {
  const fromOptions = (node.merchandise.selectedOptions ?? [])
    .map((o) => o.value.trim())
    .filter(Boolean)
    .join(" · ");
  return fromOptions || node.merchandise.title;
}

/** Map a Shopify cart line onto the app `CartLine` type. */
export function mapShopifyCartLine(node: ShopifyCartLine): CartLine {
  const m = node.merchandise;
  // Variant image wins over the product's featured image — a merchant who
  // photographed each grind expects to see that photo in the cart.
  const image = m.image ?? m.product.featuredImage;

  return {
    id: node.id,
    productId: m.product.handle,
    variantId: m.id,
    handle: m.product.handle,
    title: m.product.metafield?.value?.trim() || m.product.title,
    variantTitle: variantLabel(node),
    image: {
      src: image?.url ?? "",
      alt: image?.altText ?? m.product.title,
    },
    price: toAmount(m.price?.amount),
    currencyCode: m.price?.currencyCode ?? "PLN",
    quantity: node.quantity,
    availableForSale: m.availableForSale,
    quantityAvailable: m.quantityAvailable ?? undefined,
  };
}

/** Map a whole Shopify cart onto the app `Cart` type. */
export function mapShopifyCart(node: ShopifyCart): Cart {
  const lines = (node.lines?.nodes ?? []).map(mapShopifyCartLine);

  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity,
    subtotal: toAmount(node.cost?.subtotalAmount?.amount),
    total: toAmount(node.cost?.totalAmount?.amount),
    currencyCode:
      node.cost?.totalAmount?.currencyCode ?? lines[0]?.currencyCode ?? "PLN",
    discountCodes: node.discountCodes ?? [],
    lines,
  };
}
