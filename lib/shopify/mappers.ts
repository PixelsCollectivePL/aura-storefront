/**
 * Shopify → Aura mapping helpers (scaffold).
 *
 * Converts Shopify Storefront API shapes into the app's own `Product` /
 * `CartLine` models, so UI components never need to know about Shopify.
 *
 * These functions are pure and dependency-free, but are NOT yet called
 * anywhere — the data seam (lib/mock/products.ts) still serves mock data.
 * See docs/SHOPIFY_INTEGRATION_PLAN.md.
 */

import type { Product, CurrencyCode } from "@/types/product";
import type { CartLine } from "@/lib/cart/cart-context";
import type {
  ShopifyProduct,
  ShopifyMetafield,
  ShopifyCartLine,
} from "./types";

/** Pull a single metafield value by key from the flat metafields array. */
function metafield(
  fields: Array<ShopifyMetafield | null>,
  key: string
): string | undefined {
  return fields.find((f) => f?.key === key)?.value ?? undefined;
}

/** Shopify `list.single_line_text_field` values arrive as JSON arrays. */
function metafieldList(
  fields: Array<ShopifyMetafield | null>,
  key: string
): string[] {
  const raw = metafield(fields, key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [raw];
  } catch {
    return [raw];
  }
}

/**
 * Map a Shopify product onto the app `Product` type.
 *
 * KNOWN GAP — variants: the app currently models variants as two separate
 * axes (`sizeOptions` + `grindOptions`). Shopify exposes a single flat
 * `variants` array keyed off `options`. Until the app adopts a real
 * `variants` model, this mapper derives the size/grind axes from
 * `product.options` by name. See SHOPIFY_INTEGRATION_PLAN.md §"Variants".
 */
export function mapShopifyProduct(node: ShopifyProduct): Product {
  const mf = node.metafields ?? [];
  const sizeOption = node.options.find((o) => /wag|size|gram/i.test(o.name));
  const grindOption = node.options.find((o) => /miel|grind/i.test(o.name));
  const minPrice = node.priceRange.minVariantPrice;

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    shortName: node.title, // [shopify-ready]: derive or use a metafield
    description: node.description,
    origin: metafield(mf, "origin") ?? "",
    notes: metafieldList(mf, "tasting_notes"),
    lotCode: metafield(mf, "lot_code") ?? "",
    price: {
      amount: Number(minPrice.amount),
      currencyCode: minPrice.currencyCode as CurrencyCode,
    },
    roastLevel: metafield(mf, "roast_level") ?? "",
    process: metafield(mf, "process"),
    altitude: metafield(mf, "altitude"),
    varietal: metafield(mf, "varietal"),
    producer: metafield(mf, "producer"),
    harvestYear: metafield(mf, "harvest_year"),
    recommendedBrew: metafield(mf, "brewing_methods"),
    availableForSale: node.availableForSale,
    grindOptions: grindOption?.values ?? [],
    sizeOptions: (sizeOption?.values ?? []).map((label) => ({
      label,
      weight: label.replace(/[^0-9]/g, ""),
    })),
    images: (node.images?.edges ?? []).map(({ node: img }) => ({
      src: img.url,
      alt: img.altText ?? node.title,
    })),
    tags: node.tags,
  };
}

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
