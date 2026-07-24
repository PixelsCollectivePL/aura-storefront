import type { Metadata } from "next";
import { ProductsBrowser } from "@/components/product/ProductsBrowser";
import { getProducts } from "@/lib/shopify";
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
  const products = await getProducts({ first: 50 });

  return <ProductsBrowser products={products} />;
}
