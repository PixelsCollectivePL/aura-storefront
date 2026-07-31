import type { Metadata } from "next";
import { ProductsBrowser } from "@/components/product/ProductsBrowser";
import { getCollections, getProducts } from "@/lib/shopify";
import { buildCategoryOptions } from "@/lib/product/categories";
import { CONTENT } from "@/lib/content/pl";

const { listing: l, meta } = CONTENT;

export const metadata: Metadata = {
  title: `${l.heading} — ${meta.siteTitle}`,
  description: l.description,
};

/**
 * /produkty — product listing.
 *
 * Server Component: fetches the catalogue from Shopify (private token
 * stays on the server) and hands it to the client browser component,
 * which owns filter/sort state.
 *
 * Freshness comes from the fetch-level cache tags in `lib/shopify/client`
 * — no route-level `revalidate` needed, and a future webhook calling
 * `revalidateTag("shopify:products")` invalidates this page too.
 */
export default async function ProduktyPage() {
  // Both reads degrade to empty rather than throwing, so a Shopify outage
  // renders the empty state instead of a 500.
  const [products, collections] = await Promise.all([
    getProducts({ first: 50 }),
    getCollections(),
  ]);

  const allLabel = l.categories.find((c) => c.value === "all")?.label ?? "Wszystko";

  return (
    <ProductsBrowser
      products={products}
      categories={buildCategoryOptions(collections, allLabel)}
    />
  );
}
