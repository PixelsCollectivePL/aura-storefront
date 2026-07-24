import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic endpoint — Shopify Storefront API access test.
 *
 * Runs TWO independent GraphQL checks and reports each separately:
 *   1. `shop { name }`            — basic connectivity + token validity
 *   2. `products(first: 3)`       — product catalogue read scope
 *
 * Both run on every request, because succeeding at (1) does not imply
 * (2): Storefront API gates the catalogue behind a separate scope
 * (`unauthenticated_read_product_listings`).
 *
 * Reads exclusively:
 *   - process.env.SHOPIFY_STORE_DOMAIN
 *   - process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
 *   - process.env.SHOPIFY_STOREFRONT_API_VERSION  (optional override)
 *
 * The token is never logged, never returned, and never included in any
 * error payload. Shopify's own error objects ARE returned in full, as
 * they carry the actionable diagnostics and contain no credentials.
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
        availableForSale
      }
    }
  }
`;

interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
}

interface GraphQLBody<T> {
  data?: T | null;
  errors?: GraphQLError[];
}

interface CheckResult<T> {
  ok: boolean;
  httpStatus: number;
  data?: T | null;
  /** Shopify's raw error objects, returned verbatim. */
  errors?: GraphQLError[] | null;
  /** Present only when the response was not valid JSON. */
  rawSnippet?: string;
  /** Present only when the request itself failed (DNS/TLS/timeout). */
  networkError?: string;
}

/** Strip protocol / trailing slash so the env var is forgiving of format. */
function normalizeDomain(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

async function runCheck<T>(
  endpoint: string,
  token: string,
  query: string
): Promise<CheckResult<T>> {
  let res: Response;
  try {
    res = await fetch(endpoint, {
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
  } catch (err) {
    return {
      ok: false,
      httpStatus: 0,
      networkError: err instanceof Error ? err.message : "Nieznany błąd sieci.",
    };
  }

  const text = await res.text();

  let body: GraphQLBody<T>;
  try {
    body = JSON.parse(text) as GraphQLBody<T>;
  } catch {
    // Non-JSON response (HTML error page, proxy error, wrong host, ...)
    return {
      ok: false,
      httpStatus: res.status,
      // Truncated so we never dump a full page into the response.
      rawSnippet: text.slice(0, 300),
    };
  }

  const hasErrors = Array.isArray(body.errors) && body.errors.length > 0;

  return {
    ok: res.ok && !hasErrors && body.data != null,
    httpStatus: res.status,
    data: body.data ?? null,
    errors: hasErrors ? body.errors! : null,
  };
}

/** Actionable hint derived from a failed check. */
function hintFor(check: CheckResult<unknown>, domain: string, apiVersion: string): string | null {
  if (check.networkError) {
    return `Nie udało się nawiązać połączenia z ${domain}. Sprawdź domenę i dostępność sieci.`;
  }
  if (check.httpStatus === 401 || check.httpStatus === 403) {
    return "401/403 → token nieprawidłowy, odwołany, albo to token publiczny (wtedy nagłówek musi brzmieć X-Shopify-Storefront-Access-Token).";
  }
  if (check.httpStatus === 404) {
    return `404 → sprawdź domenę (${domain}) lub wersję API (${apiVersion}). Ustaw SHOPIFY_STOREFRONT_API_VERSION jeśli ta wersja wypadła z okna wsparcia.`;
  }
  if (check.httpStatus === 430 || check.httpStatus === 429) {
    return "429/430 → limit zapytań Storefront API. Odczekaj chwilę i powtórz.";
  }
  const msg = check.errors?.map((e) => e.message).join(" ").toLowerCase() ?? "";
  if (msg.includes("access denied") || msg.includes("not approved") || msg.includes("scope")) {
    return "Brak zakresu uprawnień. W Custom App (Shopify admin → Settings → Apps and sales channels → Develop apps) zaznacz `unauthenticated_read_product_listings` dla Storefront API i wygeneruj token ponownie.";
  }
  return null;
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

  // ── Guard: domain must look like a Shopify host ────────────────────
  // Catches the classic mistake of pointing this at the storefront's own
  // deployment URL, which makes the app silently request itself.
  if (!/\.myshopify\.com$/i.test(domain)) {
    return NextResponse.json(
      {
        ok: false,
        stage: "env",
        domain,
        error:
          "SHOPIFY_STORE_DOMAIN nie wygląda na domenę sklepu Shopify (oczekiwano `*.myshopify.com`).",
        hint: "Znajdziesz ją w Shopify admin → Settings → Domains, albo w URL panelu: admin.shopify.com/store/<nazwa>.",
      },
      { status: 500, headers: noStore }
    );
  }

  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  // ── Run both checks ────────────────────────────────────────────────
  const shop = await runCheck<{ shop: { name: string } }>(
    endpoint,
    token,
    SHOP_QUERY
  );

  const products = await runCheck<{
    products: {
      nodes: Array<{
        id: string;
        title: string;
        handle: string;
        availableForSale: boolean;
      }>;
    };
  }>(endpoint, token, PRODUCTS_QUERY);

  const productNodes = products.data?.products?.nodes ?? [];
  const productCount = productNodes.length;

  // An empty result is NOT an error — but it is a distinct, important
  // signal worth calling out explicitly.
  const emptyCatalogueNote =
    products.ok && productCount === 0
      ? "Token ma dostęp do katalogu, ale zapytanie zwróciło 0 produktów. Sprawdź czy w sklepie są produkty ORAZ czy są opublikowane w kanale sprzedaży powiązanym z tą aplikacją (Shopify admin → produkt → Publishing)."
      : null;

  const allOk = shop.ok && products.ok;

  return NextResponse.json(
    {
      ok: allOk,
      apiVersion,
      domain,
      checks: {
        shop: {
          ok: shop.ok,
          httpStatus: shop.httpStatus,
          data: shop.ok ? shop.data : undefined,
          errors: shop.errors ?? undefined,
          rawSnippet: shop.rawSnippet ?? undefined,
          networkError: shop.networkError ?? undefined,
          hint: shop.ok ? undefined : hintFor(shop, domain, apiVersion) ?? undefined,
        },
        products: {
          ok: products.ok,
          httpStatus: products.httpStatus,
          count: products.ok ? productCount : undefined,
          data: products.ok ? products.data : undefined,
          errors: products.errors ?? undefined,
          rawSnippet: products.rawSnippet ?? undefined,
          networkError: products.networkError ?? undefined,
          note: emptyCatalogueNote ?? undefined,
          hint: products.ok ? undefined : hintFor(products, domain, apiVersion) ?? undefined,
        },
      },
    },
    { status: allOk ? 200 : 502, headers: noStore }
  );
}
