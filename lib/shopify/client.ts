/**
 * Shopify Storefront API — GraphQL client.
 *
 * SERVER-ONLY. Uses the *private* Storefront token, which must never reach
 * the browser. There is a runtime guard below, but the real protection is
 * discipline: only import this from Server Components, Route Handlers or
 * Server Actions.
 *
 * Caching model (Next.js 16, Cache Components NOT enabled):
 *   `fetch` is uncached by default in this version — caching must be opted
 *   into explicitly via `next: { revalidate, tags }`. Every query here sets
 *   both, so that:
 *     - content refreshes on its own after `revalidate` seconds, and
 *     - a future Shopify webhook can call `revalidateTag(...)` for instant
 *       invalidation without touching this file.
 *
 * Reads only:
 *   process.env.SHOPIFY_STORE_DOMAIN
 *   process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
 *   process.env.SHOPIFY_STOREFRONT_API_VERSION  (optional override)
 */

import type { ShopifyGraphQLResponse } from "./types";

/**
 * Shopify ships a Storefront API version quarterly and supports each for
 * 12 months. Overridable via env so a version rollover never requires a
 * code change.
 */
const DEFAULT_API_VERSION = "2025-10";

/**
 * Default cache lifetime for catalogue data, in seconds.
 *
 * 60s is a deliberate middle ground: edits made in Shopify Admin show up
 * on the storefront within a minute without a deploy, while a traffic
 * spike still collapses onto a single upstream request per minute.
 * Webhook-driven `revalidateTag` (Sprint 2+) will make this a safety net
 * rather than the primary freshness mechanism.
 */
export const CATALOG_REVALIDATE_SECONDS = 60;

/** Cache tags — the invalidation surface for future Shopify webhooks. */
export const SHOPIFY_TAGS = {
  /** Everything Shopify. Nuclear option. */
  all: "shopify",
  /** Any product list (PLP, homepage shelf, search). */
  products: "shopify:products",
  /** A single product, by handle. */
  product: (handle: string) => `shopify:product:${handle}`,
  /** Collection list / collection membership. */
  collections: "shopify:collections",
} as const;

/** Thrown for any non-recoverable Storefront API failure. */
export class ShopifyError extends Error {
  readonly status: number;
  readonly graphQLErrors: Array<{ message: string }> | null;

  constructor(
    message: string,
    status: number,
    graphQLErrors: Array<{ message: string }> | null = null
  ) {
    super(message);
    this.name = "ShopifyError";
    this.status = status;
    this.graphQLErrors = graphQLErrors;
  }
}

/**
 * Whether Shopify credentials are present.
 *
 * Callers use this to decide between live data and a graceful empty state,
 * so a missing/misconfigured environment degrades instead of crashing the
 * whole render.
 */
export function isShopifyConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN?.trim() &&
      process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim()
  );
}

/** Strip protocol / trailing slash so the env var is forgiving of format. */
function normalizeDomain(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

function getEndpoint(): string {
  const domain = normalizeDomain(process.env.SHOPIFY_STORE_DOMAIN ?? "");
  const version =
    process.env.SHOPIFY_STOREFRONT_API_VERSION?.trim() || DEFAULT_API_VERSION;
  return `https://${domain}/api/${version}/graphql.json`;
}

export interface ShopifyFetchArgs<TVariables> {
  query: string;
  variables?: TVariables;
  /** Cache tags for on-demand revalidation. */
  tags?: string[];
  /** Seconds; `false` disables caching for this request. */
  revalidate?: number | false;
  /**
   * Buyer's IP address, forwarded as `Shopify-Storefront-Buyer-IP`.
   *
   * Required for server-side cart/checkout calls: without it Shopify sees
   * our server's IP for every shopper, which skews fraud analysis and risks
   * rate-limiting the whole storefront as one client. Ignored when absent.
   */
  buyerIp?: string;
}

/**
 * Execute a Storefront GraphQL request.
 *
 * @throws {ShopifyError} on missing config, transport failure, non-2xx
 *         response, or a GraphQL `errors` payload.
 */
export async function shopifyFetch<TData, TVariables = Record<string, unknown>>({
  query,
  variables,
  tags = [SHOPIFY_TAGS.all],
  revalidate = CATALOG_REVALIDATE_SECONDS,
  buyerIp,
}: ShopifyFetchArgs<TVariables>): Promise<TData> {
  // Guard: this module must never execute in the browser — the private
  // token would be exposed in the client bundle.
  if (typeof window !== "undefined") {
    throw new ShopifyError(
      "lib/shopify/client.ts is server-only and must not run in the browser.",
      0
    );
  }

  if (!isShopifyConfigured()) {
    throw new ShopifyError(
      "Shopify nie jest skonfigurowany — brak SHOPIFY_STORE_DOMAIN lub SHOPIFY_STOREFRONT_PRIVATE_TOKEN.",
      0
    );
  }

  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN!;

  let res: Response;
  try {
    res = await fetch(getEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Private (server-side) Storefront tokens use this header.
        // Public tokens would use "X-Shopify-Storefront-Access-Token".
        "Shopify-Storefront-Private-Token": token,
        ...(buyerIp ? { "Shopify-Storefront-Buyer-IP": buyerIp } : {}),
      },
      body: JSON.stringify({ query, variables }),
      // Next 16: fetch is uncached unless told otherwise.
      next:
        revalidate === false
          ? { tags, revalidate: 0 }
          : { tags, revalidate },
    });
  } catch (err) {
    throw new ShopifyError(
      `Storefront API nieosiągalne: ${
        err instanceof Error ? err.message : "nieznany błąd sieci"
      }`,
      0
    );
  }

  if (!res.ok) {
    throw new ShopifyError(
      `Storefront API zwróciło HTTP ${res.status}.`,
      res.status
    );
  }

  const body = (await res.json()) as ShopifyGraphQLResponse<TData>;

  if (body.errors?.length) {
    throw new ShopifyError(
      `Błąd GraphQL: ${body.errors.map((e) => e.message).join("; ")}`,
      res.status,
      body.errors
    );
  }

  if (!body.data) {
    throw new ShopifyError("Storefront API zwróciło pustą odpowiedź.", res.status);
  }

  return body.data;
}
