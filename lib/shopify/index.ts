/**
 * Catalogue data layer — the public surface pages import.
 *
 * SERVER-ONLY (transitively: `client.ts` holds the private token).
 * Call these from Server Components, Route Handlers or Server Actions.
 *
 * ── Failure policy ───────────────────────────────────────────────────
 * List reads never throw. A Shopify outage or a misconfigured env
 * degrades to an empty catalogue with a visible empty state, rather than
 * taking down the whole page. Errors are surfaced through
 * `console.error` (message only — never env values) so they show up in
 * Vercel logs.
 *
 * `getProductByHandle` returns `null` for a missing handle so the PDP can
 * call `notFound()` and render a real 404.
 *
 * ── Mock fallback ────────────────────────────────────────────────────
 * Mock fixtures are OFF by default and never stand in for live data in
 * production. They are opt-in via `AURA_USE_MOCK_CATALOG=true`, purely
 * for local/visual work while the Shopify catalogue is empty.
 */

import {
  shopifyFetch,
  isShopifyConfigured,
  SHOPIFY_TAGS,
  ShopifyError,
} from "./client";
import {
  PRODUCTS_QUERY,
  COLLECTION_PRODUCTS_QUERY,
  PRODUCT_HANDLES_QUERY,
} from "./queries/products";
import { PRODUCT_BY_HANDLE_QUERY } from "./queries/product";
import { COLLECTIONS_QUERY } from "./queries/collections";
import { mapShopifyProduct, mapShopifyCollection } from "./mappers/product";
import type {
  ProductsQueryResult,
  ProductByHandleQueryResult,
  ProductHandlesQueryResult,
  CollectionProductsQueryResult,
  CollectionsQueryResult,
} from "./types";
import type { Product, Collection } from "@/types/product";

export { isShopifyConfigured, SHOPIFY_TAGS, ShopifyError };

/**
 * Whether to serve mock fixtures instead of Shopify.
 *
 * Requires an explicit opt-in AND a non-production environment, so a
 * stray env var can never surface fake products to real customers.
 */
function shouldUseMockCatalog(): boolean {
  return (
    process.env.AURA_USE_MOCK_CATALOG === "true" &&
    process.env.NODE_ENV !== "production"
  );
}

/** Log a failure without ever touching env values. */
function logFailure(operation: string, err: unknown): void {
  const detail =
    err instanceof ShopifyError
      ? `${err.message}${err.status ? ` (HTTP ${err.status})` : ""}`
      : err instanceof Error
        ? err.message
        : "nieznany błąd";
  console.error(`[aura/shopify] ${operation} nie powiodło się: ${detail}`);
}

/* ─── Products ────────────────────────────────────────────────────────── */

export interface GetProductsOptions {
  /** Max products to return. Storefront API caps this at 250. */
  first?: number;
  /** Shopify search syntax, e.g. `tag:filter available_for_sale:true`. */
  query?: string;
}

/**
 * All products for list views (PLP, homepage shelf, search).
 * Returns `[]` when the catalogue is empty, unconfigured, or unreachable.
 */
export async function getProducts(
  options: GetProductsOptions = {}
): Promise<Product[]> {
  const { first = 50, query } = options;

  if (shouldUseMockCatalog()) {
    const { MOCK_PRODUCTS } = await import("@/lib/mock/products");
    return MOCK_PRODUCTS.slice(0, first);
  }

  if (!isShopifyConfigured()) return [];

  try {
    const data = await shopifyFetch<ProductsQueryResult>({
      query: PRODUCTS_QUERY,
      variables: { first, query },
      tags: [SHOPIFY_TAGS.all, SHOPIFY_TAGS.products],
    });
    return (data.products?.nodes ?? []).map(mapShopifyProduct);
  } catch (err) {
    logFailure("getProducts", err);
    return [];
  }
}

/**
 * Single product by handle.
 * Returns `null` when not found — callers should `notFound()`.
 */
export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  if (!handle) return null;

  if (shouldUseMockCatalog()) {
    const { getProduct } = await import("@/lib/mock/products");
    return getProduct(handle) ?? null;
  }

  if (!isShopifyConfigured()) return null;

  try {
    const data = await shopifyFetch<ProductByHandleQueryResult>({
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
      tags: [
        SHOPIFY_TAGS.all,
        SHOPIFY_TAGS.products,
        SHOPIFY_TAGS.product(handle),
      ],
    });
    return data.product ? mapShopifyProduct(data.product) : null;
  } catch (err) {
    logFailure(`getProductByHandle(${handle})`, err);
    return null;
  }
}

/**
 * Handles only — for `generateStaticParams`.
 * Returning `[]` is safe: Next falls back to on-demand rendering.
 */
export async function getProductHandles(): Promise<string[]> {
  if (shouldUseMockCatalog()) {
    const { MOCK_PRODUCTS } = await import("@/lib/mock/products");
    return MOCK_PRODUCTS.map((p) => p.handle);
  }

  if (!isShopifyConfigured()) return [];

  try {
    const data = await shopifyFetch<ProductHandlesQueryResult>({
      query: PRODUCT_HANDLES_QUERY,
      variables: { first: 250 },
      tags: [SHOPIFY_TAGS.all, SHOPIFY_TAGS.products],
    });
    return (data.products?.nodes ?? []).map((n) => n.handle);
  } catch (err) {
    logFailure("getProductHandles", err);
    return [];
  }
}

/**
 * Products for the homepage shelf.
 *
 * Prefers a Shopify collection named `featured`; falls back to the first
 * N products so the shelf is never empty just because the merchant
 * hasn't created that collection yet.
 */
export async function getFeaturedProducts(count = 4): Promise<Product[]> {
  if (shouldUseMockCatalog()) {
    const { getFeaturedProducts: mockFeatured } = await import(
      "@/lib/mock/products"
    );
    return mockFeatured(count);
  }

  if (!isShopifyConfigured()) return [];

  try {
    const data = await shopifyFetch<CollectionProductsQueryResult>({
      query: COLLECTION_PRODUCTS_QUERY,
      variables: { handle: "featured", first: count },
      tags: [SHOPIFY_TAGS.all, SHOPIFY_TAGS.products, SHOPIFY_TAGS.collections],
    });
    const nodes = data.collection?.products?.nodes ?? [];
    if (nodes.length > 0) return nodes.map(mapShopifyProduct);
  } catch (err) {
    logFailure("getFeaturedProducts(collection:featured)", err);
  }

  // Fallback: first N products.
  const all = await getProducts({ first: count });
  return all.slice(0, count);
}

/* ─── Collections ─────────────────────────────────────────────────────── */

/** All collections. Returns `[]` on any failure. */
export async function getCollections(): Promise<Collection[]> {
  if (shouldUseMockCatalog()) return [];
  if (!isShopifyConfigured()) return [];

  try {
    const data = await shopifyFetch<CollectionsQueryResult>({
      query: COLLECTIONS_QUERY,
      variables: { first: 20 },
      tags: [SHOPIFY_TAGS.all, SHOPIFY_TAGS.collections],
    });
    return (data.collections?.nodes ?? []).map(mapShopifyCollection);
  } catch (err) {
    logFailure("getCollections", err);
    return [];
  }
}
