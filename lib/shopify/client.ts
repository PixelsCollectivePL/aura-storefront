/**
 * Shopify Storefront API — fetch client (STUB).
 *
 * This is intentionally NOT implemented. It reads no environment variables,
 * holds no tokens, and makes no network requests. Calling `shopifyFetch`
 * throws — this guarantees that nothing accidentally depends on a live
 * Shopify connection before the integration PR.
 *
 * Integration (see docs/SHOPIFY_INTEGRATION_PLAN.md):
 *   1. Add env vars SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN.
 *   2. Replace the body of `shopifyFetch` with a real POST to
 *      `https://{domain}/api/{version}/graphql.json`.
 *   3. Send header `X-Shopify-Storefront-Access-Token`.
 */

import type { ShopifyGraphQLResponse } from "./types";

export interface ShopifyFetchArgs<TVariables> {
  query: string;
  variables?: TVariables;
}

/**
 * STUB — not implemented. Replace with a real Storefront GraphQL request
 * during the Shopify integration PR.
 */
export async function shopifyFetch<TData, TVariables = Record<string, unknown>>(
  args: ShopifyFetchArgs<TVariables>
): Promise<ShopifyGraphQLResponse<TData>> {
  const operation = args.query.trim().split(/\s+/).slice(0, 3).join(" ");
  throw new Error(
    `lib/shopify/client.ts: shopifyFetch is not implemented (operation: "${operation}"). ` +
      "Shopify integration has not been wired up yet — see " +
      "docs/SHOPIFY_INTEGRATION_PLAN.md."
  );
}
