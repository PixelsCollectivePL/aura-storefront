import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic endpoint — live Shopify Storefront API connectivity test.
 *
 * Performs ONE GraphQL request against the shop using the *private*
 * Storefront token (server-side only, never exposed to the browser).
 *
 * Reads exclusively:
 *   - process.env.SHOPIFY_STORE_DOMAIN
 *   - process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
 *   - process.env.SHOPIFY_STOREFRONT_API_VERSION  (optional override)
 *
 * The token is never logged, never returned, and never included in any
 * error payload.
 *
 * ⚠️ DELETE THIS ROUTE once Sprint 0 verification is done.
 *    Tracked in docs/INTEGRATION_ROADMAP.md (Sprint 0 checklist).
 */

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Shopify ships a new Storefront API version quarterly and supports each
 * for 12 months. Overridable via env so a version mismatch can be fixed
 * without a redeploy.
 */
const DEFAULT_API_VERSION = "2025-10";

const SHOP_QUERY = /* GraphQL */ `
  query ShopName {
    shop {
      name
    }
  }
`;

const PRODUCTS_QUERY = /* GraphQL */ `
  query FirstProducts {
    products(first: 3) {
      nodes {
        id
        title
        handle
      }
    }
  }
`;

interface GraphQLError {
  message: string;
  extensions?: Record<string, unknown>;
}

interface GraphQLBody<T> {
  data?: T | null;
  errors?: GraphQLError[];
}

/** Strip protocol / trailing slash so the env var is forgiving of format. */
function normalizeDomain(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

async function storefrontRequest<T>(
  endpoint: string,
  token: string,
  query: string
): Promise<{
  ok: boolean;
  httpStatus: number;
  body: GraphQLBody<T> | null;
  rawSnippet?: string;
}> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Private (server-side) Storefront tokens use this header.
      // Public tokens would use "X-Shopify-Storefront-Access-Token".
      "Shopify-Storefront-Private-Token": token,
    },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  const text = await res.text();

  let body: GraphQLBody<T> | null = null;
  try {
    body = JSON.parse(text) as GraphQLBody<T>;
  } catch {
    // Non-JSON response (HTML error page, proxy error, etc.)
    return {
      ok: false,
      httpStatus: res.status,
      body: null,
      // Truncated so we never dump a full page into the response.
      rawSnippet: text.slice(0, 300),
    };
  }

  return { ok: res.ok, httpStatus: res.status, body };
}

export async function GET() {
  const domainRaw = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  const apiVersion =
    process.env.SHOPIFY_STOREFRONT_API_VERSION?.trim() || DEFAULT_API_VERSION;

  const noStore = { "Cache-Control": "no-store, max-age=0" };

  // ── Guard: env vars present ────────────────────────────────────────
  if (!domainRaw?.trim() || !token?.trim()) {
    return NextResponse.json(
      {
        ok: false,
        stage: "env",
        error: "Brak wymaganych zmiennych środowiskowych.",
        missing: {
          SHOPIFY_STORE_DOMAIN: !domainRaw?.trim(),
          SHOPIFY_STOREFRONT_PRIVATE_TOKEN: !token?.trim(),
        },
      },
      { status: 500, headers: noStore }
    );
  }

  const domain = normalizeDomain(domainRaw);
  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  try {
    // ── Attempt 1: shop { name } ─────────────────────────────────────
    const shopAttempt = await storefrontRequest<{ shop: { name: string } }>(
      endpoint,
      token,
      SHOP_QUERY
    );

    if (shopAttempt.ok && shopAttempt.body?.data?.shop && !shopAttempt.body.errors?.length) {
      return NextResponse.json(
        {
          ok: true,
          stage: "shop",
          apiVersion,
          domain,
          data: shopAttempt.body.data,
        },
        { headers: noStore }
      );
    }

    // ── Attempt 2: fallback to products(first: 3) ────────────────────
    const productsAttempt = await storefrontRequest<{
      products: { nodes: Array<{ id: string; title: string; handle: string }> };
    }>(endpoint, token, PRODUCTS_QUERY);

    if (
      productsAttempt.ok &&
      productsAttempt.body?.data?.products &&
      !productsAttempt.body.errors?.length
    ) {
      return NextResponse.json(
        {
          ok: true,
          stage: "products",
          apiVersion,
          domain,
          note: "Pole `shop` niedostępne — użyto zapytania products(first: 3).",
          shopQueryErrors: shopAttempt.body?.errors ?? null,
          data: productsAttempt.body.data,
        },
        { headers: noStore }
      );
    }

    // ── Both attempts failed — report readable diagnostics ───────────
    return NextResponse.json(
      {
        ok: false,
        stage: "graphql",
        apiVersion,
        domain,
        error: "Shopify odrzucił oba zapytania.",
        shopAttempt: {
          httpStatus: shopAttempt.httpStatus,
          errors: shopAttempt.body?.errors ?? null,
          rawSnippet: shopAttempt.rawSnippet ?? null,
        },
        productsAttempt: {
          httpStatus: productsAttempt.httpStatus,
          errors: productsAttempt.body?.errors ?? null,
          rawSnippet: productsAttempt.rawSnippet ?? null,
        },
        hint:
          productsAttempt.httpStatus === 401 || productsAttempt.httpStatus === 403
            ? "401/403 → token nieprawidłowy, odwołany, albo to token publiczny (wtedy nagłówek musi być X-Shopify-Storefront-Access-Token)."
            : productsAttempt.httpStatus === 404
              ? `404 → sprawdź domenę (${domain}) lub wersję API (${apiVersion}). Ustaw SHOPIFY_STOREFRONT_API_VERSION jeśli ta wersja jest już nieobsługiwana.`
              : null,
      },
      { status: 502, headers: noStore }
    );
  } catch (err) {
    // Network / DNS / TLS failure — never surface the token.
    return NextResponse.json(
      {
        ok: false,
        stage: "network",
        apiVersion,
        domain,
        error: "Nie udało się połączyć z Shopify.",
        detail: err instanceof Error ? err.message : "Nieznany błąd.",
      },
      { status: 502, headers: noStore }
    );
  }
}
