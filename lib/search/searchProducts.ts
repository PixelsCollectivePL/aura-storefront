import type { Product } from "@/types/product";

const MAX_RESULTS = 6;

/**
 * Filter products by a free-text query.
 * Matches against: shortName, title, origin, taste notes, and tags.
 *
 * [shopify-ready]: replace call-sites with Shopify Storefront API
 *   `products(query: $q)` or `predictiveSearch` query so this
 *   utility becomes the mock-only fallback.
 */
export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return products
    .filter(
      (p) =>
        p.shortName.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.notes.some((n) => n.toLowerCase().includes(q)) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
    )
    .slice(0, MAX_RESULTS);
}
