/**
 * Shopify → Aura product mapping.
 *
 * The single place that knows the Storefront API response shape. UI
 * components consume `Product` from `types/product.ts` and stay unaware
 * that Shopify exists — swapping the backend means rewriting this file
 * and nothing else.
 *
 * Pure and dependency-free.
 */

import type {
  Product,
  ProductVariant,
  ProductImage,
  ProductPrice,
  CurrencyCode,
  Collection,
} from "@/types/product";
import type {
  ShopifyProduct,
  ShopifyProductDetail,
  ShopifyProductVariant,
  ShopifyMetafield,
  ShopifyImage,
  ShopifyMoney,
  ShopifyCollection,
} from "../types";

/* ─── Primitives ──────────────────────────────────────────────────────── */

function toPrice(money: ShopifyMoney | null | undefined): ProductPrice | undefined {
  if (!money) return undefined;
  const amount = Number(money.amount);
  if (!Number.isFinite(amount)) return undefined;
  return {
    amount,
    currencyCode: money.currencyCode as CurrencyCode,
  };
}

function toImage(
  img: ShopifyImage | null | undefined,
  fallbackAlt: string
): ProductImage | undefined {
  if (!img?.url) return undefined;
  return { src: img.url, alt: img.altText ?? fallbackAlt };
}

/* ─── Metafields ──────────────────────────────────────────────────────── */

/**
 * Shopify returns metafields as a positional array matching the requested
 * `identifiers`, with `null` in every slot the merchant hasn't filled in.
 */
function metafield(
  fields: Array<ShopifyMetafield | null> | null | undefined,
  key: string
): string | undefined {
  const value = fields?.find((f) => f?.key === key)?.value;
  return value?.trim() ? value : undefined;
}

/** `list.*` metafields arrive as a JSON-encoded array. */
function metafieldList(
  fields: Array<ShopifyMetafield | null> | null | undefined,
  key: string
): string[] {
  const raw = metafield(fields, key);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // Not JSON — fall through to comma-splitting below.
  }
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function metafieldBool(
  fields: Array<ShopifyMetafield | null> | null | undefined,
  key: string
): boolean | undefined {
  const raw = metafield(fields, key);
  if (raw === undefined) return undefined;
  return raw === "true" || raw === "1";
}

/**
 * Brewing recipes, stored as a JSON metafield:
 *   [{ "method": "V60", "recipe": "15g · 250g · 92°C · 2:45" }]
 * Malformed data is dropped rather than crashing the page.
 */
function parseBrewing(
  fields: Array<ShopifyMetafield | null> | null | undefined
): Product["brewing"] {
  const raw = metafield(fields, "brewing");
  if (!raw) return undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return undefined;
    const rows = parsed
      .filter(
        (r): r is { method: string; recipe: string } =>
          typeof r === "object" &&
          r !== null &&
          typeof (r as { method?: unknown }).method === "string" &&
          typeof (r as { recipe?: unknown }).recipe === "string"
      )
      .map((r) => ({ method: r.method, recipe: r.recipe }));
    return rows.length ? rows : undefined;
  } catch {
    return undefined;
  }
}

/* ─── Variants & options ──────────────────────────────────────────────── */

function mapVariant(
  node: ShopifyProductVariant,
  productTitle: string
): ProductVariant {
  const price = toPrice(node.price) ?? { amount: 0, currencyCode: "PLN" };
  return {
    variantId: node.id,
    title: node.title,
    price,
    compareAtPrice: toPrice(node.compareAtPrice),
    selectedOptions: node.selectedOptions ?? [],
    availableForSale: node.availableForSale,
    quantityAvailable: node.quantityAvailable ?? undefined,
    image: toImage(node.image, productTitle),
  };
}

/**
 * The Aura UI models two independent axes (`sizeOptions`, `grindOptions`)
 * while Shopify exposes a generic `options` array. We match by name so a
 * merchant can label them naturally in Polish or English.
 *
 * If a merchant uses different names, the axes come back empty and the UI
 * degrades to a single default variant — it does not break.
 */
const SIZE_OPTION_RE = /wag|size|gram|ilo/i;
const GRIND_OPTION_RE = /miel|grind|mielen/i;

/* ─── Product ─────────────────────────────────────────────────────────── */

/**
 * Map a Shopify product (card or detail shape) onto the app `Product`.
 *
 * Everything Shopify-native (title, price, images, variants, options,
 * availability, collections, tags) maps directly. Coffee-specific fields
 * (origin, lot code, roast level, tasting notes...) come from `custom.*`
 * metafields and degrade to sensible empty values when unset — a product
 * created in Shopify with nothing but a title and price still renders.
 */
export function mapShopifyProduct(
  node: ShopifyProduct | ShopifyProductDetail
): Product {
  const mf = node.metafields ?? [];
  const variants = (node.variants?.nodes ?? []).map((v) =>
    mapVariant(v, node.title)
  );

  const sizeOption = node.options?.find((o) => SIZE_OPTION_RE.test(o.name));
  const grindOption = node.options?.find((o) => GRIND_OPTION_RE.test(o.name));

  const images = (node.images?.nodes ?? [])
    .map((img) => toImage(img, node.title))
    .filter((img): img is ProductImage => Boolean(img));

  const featuredImage = toImage(node.featuredImage, node.title);

  // Ensure the featured image leads the gallery without being duplicated.
  const gallery = featuredImage
    ? [featuredImage, ...images.filter((i) => i.src !== featuredImage.src)]
    : images;

  const collections = (node.collections?.nodes ?? []).map((c) => ({
    handle: c.handle,
    title: c.title,
  }));

  const price =
    toPrice(node.priceRange?.minVariantPrice) ??
    variants[0]?.price ?? { amount: 0, currencyCode: "PLN" };

  const detail = node as Partial<ShopifyProductDetail>;

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    shortName: metafield(mf, "short_name") ?? node.title,
    description: node.description,
    descriptionHtml: detail.descriptionHtml,

    price,
    compareAtPrice: toPrice(node.compareAtPriceRange?.minVariantPrice),

    // ── Coffee specifics (metafields) ──
    origin: metafield(mf, "origin") ?? "",
    notes: metafieldList(mf, "tasting_notes"),
    lotCode: metafield(mf, "lot_code") ?? "",
    roastLevel: metafield(mf, "roast_level") ?? "",
    process: metafield(mf, "process"),
    altitude: metafield(mf, "altitude"),
    varietal: metafield(mf, "varietal"),
    producer: metafield(mf, "producer"),
    harvestYear: metafield(mf, "harvest_year"),
    recommendedBrew: metafield(mf, "recommended_brew"),
    brewing: parseBrewing(mf),
    isNew: metafieldBool(mf, "is_new"),

    // ── Availability & variants ──
    availableForSale: node.availableForSale,
    quantityAvailable: variants.reduce(
      (sum, v) => sum + (v.quantityAvailable ?? 0),
      0
    ),
    variants,
    options: node.options ?? [],
    grindOptions: grindOption?.values ?? [],
    sizeOptions: (sizeOption?.values ?? []).map((label) => ({
      label,
      weight: label.replace(/[^0-9]/g, ""),
    })),
    // Carry the merchant's own axis names through: variant resolution
    // matches `variant.selectedOptions` by name, and those names are
    // whatever the merchant typed in Shopify Admin.
    sizeOptionName: sizeOption?.name,
    grindOptionName: grindOption?.name,

    // ── Media ──
    featuredImage,
    images: gallery,

    // ── Taxonomy ──
    tags: node.tags ?? [],
    productType: node.productType || undefined,
    vendor: node.vendor || undefined,
    collections,
    collection: collections[0]?.handle,
  };
}

/** Map a Shopify collection onto the app `Collection` type. */
export function mapShopifyCollection(node: ShopifyCollection): Collection {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description || undefined,
    image: toImage(node.image, node.title),
  };
}
