/**
 * Shopify Admin API — transport layer.
 *
 * SERVER-ONLY. Holds the app's client secret and mints short-lived Admin
 * access tokens. Never import from a Client Component.
 *
 * Completely independent of the Storefront layer (`lib/shopify/client.ts`):
 * different endpoint, different auth header, different token lifecycle.
 *
 * ── Auth model ───────────────────────────────────────────────────────
 * Apps created in the Shopify Dev Dashboard cannot reveal a long-lived
 * Admin token in any UI — that flow belonged to admin-created custom
 * apps, which Shopify has since closed to new apps. Instead we exchange
 * client credentials for a token that expires in ~24h, and refresh it
 * ourselves. See `getShopifyAdminAccessToken()`.
 *
 * Requires the app and the store to belong to the same Shopify
 * organization; `client_credentials` is rejected otherwise.
 *
 * Reads only:
 *   process.env.SHOPIFY_STORE_DOMAIN
 *   process.env.SHOPIFY_ADMIN_CLIENT_ID
 *   process.env.SHOPIFY_ADMIN_CLIENT_SECRET
 *   process.env.SHOPIFY_ADMIN_API_VERSION  (optional override)
 */

const DEFAULT_ADMIN_API_VERSION = "2025-10";

/**
 * Refresh this many seconds before the token actually expires.
 *
 * Covers clock skew between us and Shopify plus the duration of an
 * in-flight request, so a token can never expire mid-call.
 */
const TOKEN_REFRESH_MARGIN_SECONDS = 120;

/* ─── Errors ──────────────────────────────────────────────────────────── */

/** Transport / auth / GraphQL-level failure. Never carries credentials. */
export class AdminApiError extends Error {
  readonly status: number;
  readonly graphQLErrors: Array<{ message: string }> | null;

  constructor(
    message: string,
    status: number,
    graphQLErrors: Array<{ message: string }> | null = null
  ) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.graphQLErrors = graphQLErrors;
  }
}

/* ─── Config ──────────────────────────────────────────────────────────── */

export function isAdminApiConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN?.trim() &&
      process.env.SHOPIFY_ADMIN_CLIENT_ID?.trim() &&
      process.env.SHOPIFY_ADMIN_CLIENT_SECRET?.trim()
  );
}

/** Strip protocol / trailing slash so the env var is forgiving of format. */
function normalizeDomain(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

function getDomain(): string {
  return normalizeDomain(process.env.SHOPIFY_STORE_DOMAIN ?? "");
}

export function getAdminApiVersion(): string {
  return (
    process.env.SHOPIFY_ADMIN_API_VERSION?.trim() || DEFAULT_ADMIN_API_VERSION
  );
}

/** Throws if called anywhere the client secret must not exist. */
function assertServerOnly(): void {
  if (typeof window !== "undefined") {
    throw new AdminApiError(
      "lib/shopify/admin is server-only and must not run in the browser.",
      0
    );
  }
}

/* ─── Token cache ─────────────────────────────────────────────────────── */

interface CachedToken {
  token: string;
  /** Epoch ms after which the token must be replaced. */
  refreshAfter: number;
}

/**
 * Module-scoped cache.
 *
 * On Vercel each serverless instance keeps its own copy, so a warm
 * instance reuses the token across requests and a cold start mints a
 * fresh one. That is the intended trade-off: no shared store, no token
 * ever written to disk or to an env var.
 */
let cachedToken: CachedToken | null = null;

/**
 * De-duplicates concurrent refreshes.
 *
 * Without this, N simultaneous requests on a cold instance would each
 * fire their own token exchange against Shopify.
 */
let inFlightRefresh: Promise<string> | null = null;

/** Drop the cached token. Exposed for diagnostics and tests. */
export function clearAdminTokenCache(): void {
  cachedToken = null;
  inFlightRefresh = null;
}

/** Cache state — never includes the token itself. */
export function getAdminTokenCacheStatus(): {
  cached: boolean;
  refreshAfter: string | null;
  secondsUntilRefresh: number | null;
} {
  if (!cachedToken) {
    return { cached: false, refreshAfter: null, secondsUntilRefresh: null };
  }
  return {
    cached: true,
    refreshAfter: new Date(cachedToken.refreshAfter).toISOString(),
    secondsUntilRefresh: Math.max(
      0,
      Math.round((cachedToken.refreshAfter - Date.now()) / 1000)
    ),
  };
}

async function requestNewToken(): Promise<string> {
  const domain = getDomain();
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID!;
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET!;

  let res: Response;
  try {
    res = await fetch(`https://${domain}/admin/oauth/access_token`, {
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
    throw new AdminApiError(
      `Nie udało się połączyć z Shopify: ${
        err instanceof Error ? err.message : "nieznany błąd sieci"
      }`,
      0
    );
  }

  const text = await res.text();

  let body: {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  try {
    body = JSON.parse(text);
  } catch {
    throw new AdminApiError(
      "Odpowiedź na żądanie tokenu nie jest poprawnym JSON-em.",
      res.status
    );
  }

  if (!res.ok || !body.access_token) {
    // Shopify's error payload never echoes the submitted secret.
    const detail =
      body.error_description || body.error || "brak access_token w odpowiedzi";
    throw new AdminApiError(
      `Nie udało się uzyskać tokenu Admin API: ${detail}`,
      res.status
    );
  }

  const lifetimeSeconds =
    typeof body.expires_in === "number" ? body.expires_in : 3600;

  cachedToken = {
    token: body.access_token,
    refreshAfter:
      Date.now() +
      Math.max(0, lifetimeSeconds - TOKEN_REFRESH_MARGIN_SECONDS) * 1000,
  };

  return cachedToken.token;
}

/**
 * Return a valid Admin API access token, minting one if needed.
 *
 * The token is kept in memory only. It is never logged, never returned
 * by any diagnostic surface, and never persisted.
 *
 * @throws {AdminApiError} when unconfigured or the exchange fails.
 */
export async function getShopifyAdminAccessToken(): Promise<string> {
  assertServerOnly();

  if (!isAdminApiConfigured()) {
    throw new AdminApiError(
      "Admin API nie jest skonfigurowane — brak SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_CLIENT_ID lub SHOPIFY_ADMIN_CLIENT_SECRET.",
      0
    );
  }

  if (cachedToken && Date.now() < cachedToken.refreshAfter) {
    return cachedToken.token;
  }

  // Collapse concurrent refreshes onto one upstream exchange.
  if (!inFlightRefresh) {
    inFlightRefresh = requestNewToken().finally(() => {
      inFlightRefresh = null;
    });
  }

  return inFlightRefresh;
}

/* ─── GraphQL ─────────────────────────────────────────────────────────── */

export interface AdminGraphqlArgs<TVariables> {
  query: string;
  variables?: TVariables;
}

/**
 * Execute an Admin GraphQL operation.
 *
 * Always uncached — Admin reads back state we may have just written, and
 * every write must reach Shopify.
 *
 * @throws {AdminApiError} on transport failure, non-2xx, or a top-level
 *         GraphQL `errors` payload. Note that `userErrors` inside a
 *         mutation payload are NOT thrown — callers inspect them.
 */
export async function adminGraphqlRequest<
  TData,
  TVariables = Record<string, unknown>,
>({ query, variables }: AdminGraphqlArgs<TVariables>): Promise<TData> {
  assertServerOnly();

  const token = await getShopifyAdminAccessToken();
  const domain = getDomain();
  const url = `https://${domain}/admin/api/${getAdminApiVersion()}/graphql.json`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Admin API header. Storefront uses a different one entirely.
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
  } catch (err) {
    throw new AdminApiError(
      `Admin API nieosiągalne: ${
        err instanceof Error ? err.message : "nieznany błąd sieci"
      }`,
      0
    );
  }

  // A revoked/expired token surfaces as 401. Drop the cache so the next
  // call mints a fresh one instead of replaying a dead token.
  if (res.status === 401) {
    clearAdminTokenCache();
    throw new AdminApiError(
      "Admin API odrzuciło token (401). Cache tokenu wyczyszczony — ponów żądanie.",
      401
    );
  }

  const text = await res.text();

  let body: { data?: TData; errors?: Array<{ message: string }> };
  try {
    body = JSON.parse(text);
  } catch {
    throw new AdminApiError(
      `Admin API zwróciło odpowiedź spoza JSON (HTTP ${res.status}).`,
      res.status
    );
  }

  if (!res.ok) {
    throw new AdminApiError(`Admin API zwróciło HTTP ${res.status}.`, res.status);
  }

  if (body.errors?.length) {
    throw new AdminApiError(
      `Błąd GraphQL: ${body.errors.map((e) => e.message).join("; ")}`,
      res.status,
      body.errors
    );
  }

  if (!body.data) {
    throw new AdminApiError("Admin API zwróciło pustą odpowiedź.", res.status);
  }

  return body.data;
}
