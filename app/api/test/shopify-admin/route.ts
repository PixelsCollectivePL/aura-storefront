import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic endpoint — Shopify Admin API configuration check.
 *
 * Runs the full Dev Dashboard workflow end to end:
 *   1. env      — required variables present
 *   2. token    — client_credentials grant → Admin API access token
 *   3. graphql  — { shop { name id } }
 *   4. products — { products(first: 3) { nodes { id title status } } }
 *
 * Read-only. Executes no mutations and changes nothing in the store.
 *
 * Reads only:
 *   process.env.SHOPIFY_STORE_DOMAIN
 *   process.env.SHOPIFY_ADMIN_CLIENT_ID
 *   process.env.SHOPIFY_ADMIN_CLIENT_SECRET
 *   process.env.SHOPIFY_ADMIN_API_VERSION  (optional override)
 *
 * NEVER returns or logs: client secret, client id, access token.
 * Granted scopes ARE returned — they are not credentials and are the
 * point of this check.
 *
 * ⚠️ DELETE THIS ROUTE once Admin API setup is verified.
 *    Tracked in docs/INTEGRATION_ROADMAP.md.
 */

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Admin API ships quarterly, each version supported 12 months. */
const DEFAULT_ADMIN_API_VERSION = "2025-10";

const SHOP_QUERY = /* GraphQL */ `
  query DiagnosticShop {
    shop {
      name
      id
    }
  }
`;

const PRODUCTS_QUERY = /* GraphQL */ `
  query DiagnosticProducts {
    products(first: 3) {
      nodes {
        id
        title
        status
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
  errors?: GraphQLError[] | null;
  rawSnippet?: string;
  networkError?: string;
}

/** Strip protocol / trailing slash so the env var is forgiving of format. */
function normalizeDomain(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

/* ─── Step 2: client_credentials grant ──────────────────────────────── */

interface TokenSuccess {
  ok: true;
  accessToken: string;
  scopes: string[];
  expiresInSeconds: number | null;
  expiresAt: string | null;
}

interface TokenFailure {
  ok: false;
  httpStatus: number;
  error: string;
  rawSnippet?: string;
}

async function exchangeToken(
  domain: string,
  clientId: string,
  clientSecret: string
): Promise<TokenSuccess | TokenFailure> {
  const url = `https://${domain}/admin/oauth/access_token`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      cache: "no-store",
    });
  } catch (err) {
    return {
      ok: false,
      httpStatus: 0,
      error: `Nie udało się połączyć z ${domain}: ${
        err instanceof Error ? err.message : "nieznany błąd sieci"
      }`,
    };
  }

  const text = await res.text();

  let body: {
    access_token?: string;
    scope?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  try {
    body = JSON.parse(text);
  } catch {
    return {
      ok: false,
      httpStatus: res.status,
      error: "Odpowiedź nie jest poprawnym JSON-em.",
      rawSnippet: text.slice(0, 300),
    };
  }

  if (!res.ok || !body.access_token) {
    // Shopify returns { error, error_description } — safe to surface,
    // it never echoes the submitted secret.
    const detail =
      body.error_description || body.error || "brak access_token w odpowiedzi";
    return {
      ok: false,
      httpStatus: res.status,
      error: `Wymiana credentiali nie powiodła się: ${detail}`,
    };
  }

  const expiresIn =
    typeof body.expires_in === "number" ? body.expires_in : null;

  return {
    ok: true,
    accessToken: body.access_token,
    scopes: (body.scope ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    expiresInSeconds: expiresIn,
    expiresAt: expiresIn
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : null,
  };
}

/* ─── Steps 3 & 4: Admin GraphQL ────────────────────────────────────── */

async function adminGraphQL<T>(
  domain: string,
  apiVersion: string,
  accessToken: string,
  query: string
): Promise<CheckResult<T>> {
  const url = `https://${domain}/admin/api/${apiVersion}/graphql.json`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Admin API uses this header. (Storefront uses
        // Shopify-Storefront-Private-Token — different API, different header.)
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });
  } catch (err) {
    return {
      ok: false,
      httpStatus: 0,
      networkError: err instanceof Error ? err.message : "nieznany błąd sieci",
    };
  }

  const text = await res.text();

  let body: GraphQLBody<T>;
  try {
    body = JSON.parse(text) as GraphQLBody<T>;
  } catch {
    return {
      ok: false,
      httpStatus: res.status,
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

/* ─── Capability analysis ───────────────────────────────────────────── */

const CAPABILITY_MAP: Array<{ key: string; read: string; write: string }> = [
  { key: "products", read: "read_products", write: "write_products" },
  { key: "inventory", read: "read_inventory", write: "write_inventory" },
  { key: "orders", read: "read_orders", write: "write_orders" },
  { key: "customers", read: "read_customers", write: "write_customers" },
  { key: "content", read: "read_content", write: "write_content" },
  {
    key: "publications",
    read: "read_publications",
    write: "write_publications",
  },
];

function analyzeCapabilities(scopes: string[]) {
  const set = new Set(scopes);
  const result: Record<string, { read: boolean; write: boolean }> = {};
  for (const { key, read, write } of CAPABILITY_MAP) {
    // A write_* scope implies read_* on the Admin API.
    const canWrite = set.has(write);
    result[key] = { read: set.has(read) || canWrite, write: canWrite };
  }
  return result;
}

/* ─── Handler ───────────────────────────────────────────────────────── */

export async function GET() {
  const noStore = { "Cache-Control": "no-store, max-age=0" };

  const domainRaw = process.env.SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;
  const apiVersion =
    process.env.SHOPIFY_ADMIN_API_VERSION?.trim() || DEFAULT_ADMIN_API_VERSION;

  // ── Step 1: env presence ─────────────────────────────────────────
  const envPresence = {
    SHOPIFY_STORE_DOMAIN: Boolean(domainRaw?.trim()),
    SHOPIFY_ADMIN_CLIENT_ID: Boolean(clientId?.trim()),
    SHOPIFY_ADMIN_CLIENT_SECRET: Boolean(clientSecret?.trim()),
  };
  const envOk = Object.values(envPresence).every(Boolean);

  if (!envOk) {
    return NextResponse.json(
      {
        ok: false,
        apiVersion,
        checks: {
          env: {
            ok: false,
            present: envPresence,
            hint: "Uzupełnij brakujące zmienne w Vercel → Project Settings → Environment Variables, następnie wykonaj redeploy (zmiana zmiennej nie uruchamia go automatycznie).",
          },
          token: { ok: false, skipped: "brak wymaganych zmiennych" },
          graphql: { ok: false, skipped: "brak tokenu" },
          products: { ok: false, skipped: "brak tokenu" },
        },
      },
      { status: 500, headers: noStore }
    );
  }

  const domain = normalizeDomain(domainRaw!);

  if (!/\.myshopify\.com$/i.test(domain)) {
    return NextResponse.json(
      {
        ok: false,
        apiVersion,
        domain,
        checks: {
          env: {
            ok: false,
            present: envPresence,
            error:
              "SHOPIFY_STORE_DOMAIN nie wygląda na domenę sklepu Shopify (oczekiwano `*.myshopify.com`).",
          },
          token: { ok: false, skipped: "niepoprawna domena" },
          graphql: { ok: false, skipped: "brak tokenu" },
          products: { ok: false, skipped: "brak tokenu" },
        },
      },
      { status: 500, headers: noStore }
    );
  }

  // ── Step 2: token ────────────────────────────────────────────────
  const token = await exchangeToken(domain, clientId!, clientSecret!);

  if (!token.ok) {
    return NextResponse.json(
      {
        ok: false,
        apiVersion,
        domain,
        checks: {
          env: { ok: true, present: envPresence },
          token: {
            ok: false,
            httpStatus: token.httpStatus,
            error: token.error,
            rawSnippet: token.rawSnippet,
            hint:
              token.httpStatus === 400 || token.httpStatus === 401
                ? "400/401 → sprawdź Client ID / Client secret (Dev Dashboard → aplikacja → Settings). Upewnij się też, że aplikacja jest ZAINSTALOWANA w tym sklepie oraz że aplikacja i sklep należą do tej samej organizacji Shopify — client_credentials działa tylko wtedy."
                : token.httpStatus === 404
                  ? `404 → sprawdź domenę (${domain}).`
                  : null,
          },
          graphql: { ok: false, skipped: "nie uzyskano tokenu" },
          products: { ok: false, skipped: "nie uzyskano tokenu" },
        },
      },
      { status: 502, headers: noStore }
    );
  }

  // ── Steps 3 & 4: GraphQL ─────────────────────────────────────────
  const shop = await adminGraphQL<{ shop: { name: string; id: string } }>(
    domain,
    apiVersion,
    token.accessToken,
    SHOP_QUERY
  );

  const products = await adminGraphQL<{
    products: {
      nodes: Array<{ id: string; title: string; status: string }>;
    };
  }>(domain, apiVersion, token.accessToken, PRODUCTS_QUERY);

  const productNodes = products.data?.products?.nodes ?? [];
  const capabilities = analyzeCapabilities(token.scopes);

  const emptyCatalogueNote =
    products.ok && productNodes.length === 0
      ? "Token ma dostęp do katalogu, ale w sklepie nie ma jeszcze produktów. Uwaga: Admin API — inaczej niż Storefront — zwraca także produkty w statusie DRAFT, więc katalog jest faktycznie pusty."
      : null;

  const allOk = shop.ok && products.ok;

  return NextResponse.json(
    {
      ok: allOk,
      apiVersion,
      domain,
      checks: {
        env: { ok: true, present: envPresence },
        token: {
          ok: true,
          scopes: token.scopes,
          scopeCount: token.scopes.length,
          expiresInSeconds: token.expiresInSeconds,
          expiresAt: token.expiresAt,
          note: "Token uzyskany przez client_credentials. Wygasa — kod produkcyjny musi go cache'ować i odświeżać.",
        },
        graphql: {
          ok: shop.ok,
          httpStatus: shop.httpStatus,
          data: shop.ok ? shop.data : undefined,
          errors: shop.errors ?? undefined,
          rawSnippet: shop.rawSnippet ?? undefined,
          networkError: shop.networkError ?? undefined,
        },
        products: {
          ok: products.ok,
          httpStatus: products.httpStatus,
          count: products.ok ? productNodes.length : undefined,
          data: products.ok ? productNodes : undefined,
          errors: products.errors ?? undefined,
          rawSnippet: products.rawSnippet ?? undefined,
          networkError: products.networkError ?? undefined,
          note: emptyCatalogueNote ?? undefined,
          hint:
            !products.ok && !capabilities.products.read
              ? "Brak zakresu `read_products`. Dodaj go w Dev Dashboard → aplikacja → Versions → app scopes, wydaj nową wersję, a następnie ponów instalację aplikacji w sklepie."
              : undefined,
        },
      },
      capabilities,
      /** Read-only diagnostic — no mutations were executed. */
      mutationsExecuted: false,
    },
    { status: allOk ? 200 : 502, headers: noStore }
  );
}
