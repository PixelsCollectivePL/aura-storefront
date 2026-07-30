/**
 * Endpoint discovery for Shopify Customer Accounts.
 *
 * Shopify's own recommendation is to discover these rather than hardcode
 * them, and the chain starts from nothing but the store domain:
 *
 *   1. https://<store>.myshopify.com/.well-known/customer-account-api
 *        → { graphql_api, mcp_api }
 *      `graphql_api` embeds both the shop id and the current API version:
 *        https://shopify.com/<shopId>/account/customer/api/<version>/graphql
 *
 *   2. https://shopify.com/authentication/<shopId>/.well-known/openid-configuration
 *        → authorization_endpoint, token_endpoint, end_session_endpoint, jwks_uri
 *
 * Nothing here is guessed: the shape above was verified against the live
 * store before this module was written.
 *
 * Individual endpoints can still be pinned via env vars as an escape hatch
 * (see `.env.example`), but discovery is the default because a hardcoded
 * host goes stale when Shopify rotates it — and the shop id is not
 * something anyone should be pasting into config by hand.
 */

import { CustomerAuthError } from "./errors";
import { getStoreDomain, getApiVersionOverride } from "./config";

export interface CustomerAccountEndpoints {
  /** Numeric shop id, extracted from the GraphQL endpoint. */
  shopId: string;
  /** Customer Account GraphQL endpoint. */
  graphqlApi: string;
  /** API version the endpoint is pinned to. */
  apiVersion: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  logoutEndpoint: string;
  jwksUri: string;
  issuer: string;
  scopesSupported: string[];
}

/**
 * Cache the resolved endpoints in module scope.
 *
 * These change roughly never, and on Vercel each instance holds its own
 * copy — so the cost is one extra pair of requests per cold start, not per
 * customer.
 */
let cached: { value: CustomerAccountEndpoints; expiresAt: number } | null = null;
let inFlight: Promise<CustomerAccountEndpoints> | null = null;

const CACHE_TTL_MS = 60 * 60 * 1000; // 1h

/** Drop the cache. For tests and diagnostics. */
export function clearDiscoveryCache(): void {
  cached = null;
  inFlight = null;
}

/**
 * Pull the shop id and API version out of the GraphQL endpoint URL.
 *
 * Exported for tests: this is the one piece of string surgery in the chain
 * and the piece most likely to break if Shopify changes the URL shape.
 */
export function parseGraphqlApi(url: string): {
  shopId: string;
  apiVersion: string;
} {
  // https://shopify.com/107230986579/account/customer/api/2026-07/graphql
  const match = url.match(
    /^https:\/\/shopify\.com\/(\d+)\/account\/customer\/api\/([^/]+)\/graphql/
  );
  if (!match) {
    throw new CustomerAuthError(
      "discovery_failed",
      "Nie rozpoznano formatu adresu Customer Account API zwróconego przez Shopify."
    );
  }
  return { shopId: match[1], apiVersion: match[2] };
}

async function fetchJson<T>(url: string, label: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Discovery is cached in-process; don't also cache it in the data cache,
      // or a stale entry outlives the process that could refresh it.
      cache: "no-store",
    });
  } catch (err) {
    throw new CustomerAuthError(
      "discovery_failed",
      `${label}: brak połączenia (${
        err instanceof Error ? err.message : "nieznany błąd"
      }).`
    );
  }

  if (!res.ok) {
    throw new CustomerAuthError(
      "discovery_failed",
      `${label}: Shopify zwróciło HTTP ${res.status}.`
    );
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new CustomerAuthError(
      "discovery_failed",
      `${label}: odpowiedź nie jest poprawnym JSON-em.`
    );
  }
}

/** Env overrides win over discovery, when explicitly set. */
function withOverrides(
  resolved: CustomerAccountEndpoints
): CustomerAccountEndpoints {
  const env = process.env;
  return {
    ...resolved,
    authorizationEndpoint:
      env.SHOPIFY_CUSTOMER_ACCOUNT_AUTHORIZATION_ENDPOINT?.trim() ||
      resolved.authorizationEndpoint,
    tokenEndpoint:
      env.SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_ENDPOINT?.trim() ||
      resolved.tokenEndpoint,
    logoutEndpoint:
      env.SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_ENDPOINT?.trim() ||
      resolved.logoutEndpoint,
    graphqlApi:
      env.SHOPIFY_CUSTOMER_ACCOUNT_API_ENDPOINT?.trim() || resolved.graphqlApi,
  };
}

async function resolve(): Promise<CustomerAccountEndpoints> {
  const domain = getStoreDomain();

  const accountApi = await fetchJson<{ graphql_api?: string }>(
    `https://${domain}/.well-known/customer-account-api`,
    "Discovery Customer Account API"
  );

  if (!accountApi.graphql_api) {
    throw new CustomerAuthError(
      "discovery_failed",
      "Discovery nie zwróciło `graphql_api`. Sprawdź, czy sklep ma włączone nowe konta klientów."
    );
  }

  const { shopId, apiVersion } = parseGraphqlApi(accountApi.graphql_api);

  const oidc = await fetchJson<{
    issuer?: string;
    authorization_endpoint?: string;
    token_endpoint?: string;
    end_session_endpoint?: string;
    jwks_uri?: string;
    scopes_supported?: string[];
  }>(
    `https://shopify.com/authentication/${shopId}/.well-known/openid-configuration`,
    "Discovery OpenID"
  );

  const missing = (
    [
      ["authorization_endpoint", oidc.authorization_endpoint],
      ["token_endpoint", oidc.token_endpoint],
      ["end_session_endpoint", oidc.end_session_endpoint],
    ] as const
  )
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length) {
    throw new CustomerAuthError(
      "discovery_failed",
      `Discovery OpenID nie zwróciło: ${missing.join(", ")}.`
    );
  }

  // A version override re-points the GraphQL endpoint but never the OAuth
  // endpoints, which are version-independent.
  const version = getApiVersionOverride() ?? apiVersion;
  const graphqlApi = `https://shopify.com/${shopId}/account/customer/api/${version}/graphql`;

  return withOverrides({
    shopId,
    graphqlApi,
    apiVersion: version,
    authorizationEndpoint: oidc.authorization_endpoint!,
    tokenEndpoint: oidc.token_endpoint!,
    logoutEndpoint: oidc.end_session_endpoint!,
    jwksUri: oidc.jwks_uri ?? "",
    issuer: oidc.issuer ?? `https://shopify.com/authentication/${shopId}`,
    scopesSupported: oidc.scopes_supported ?? [],
  });
}

/**
 * Resolved endpoints, cached for an hour. Concurrent callers on a cold
 * instance share one round trip.
 */
export async function getCustomerAccountEndpoints(): Promise<CustomerAccountEndpoints> {
  if (cached && Date.now() < cached.expiresAt) return cached.value;

  if (!inFlight) {
    inFlight = resolve()
      .then((value) => {
        cached = { value, expiresAt: Date.now() + CACHE_TTL_MS };
        return value;
      })
      .finally(() => {
        inFlight = null;
      });
  }

  return inFlight;
}
