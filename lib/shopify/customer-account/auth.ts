/**
 * OAuth 2.0 Authorization Code flow with PKCE, confidential client.
 *
 * SERVER-ONLY. The token exchange sends the client secret; it must never
 * run in the browser or in Edge middleware.
 *
 * The store's discovery document advertises
 * `token_endpoint_auth_methods_supported: ["client_secret_basic"]`, so
 * credentials go in an `Authorization: Basic` header rather than the body.
 */

import {
  createPublicKey,
  verify as verifySignature,
  type JsonWebKey as NodeJsonWebKey,
} from "node:crypto";

import { CustomerAuthError } from "./errors";
import { safeEqual } from "./crypto";
import {
  CUSTOMER_ACCOUNT_SCOPES,
  getClientId,
  getClientSecret,
  getRedirectUri,
} from "./config";
import type { CustomerAccountEndpoints } from "./discovery";
import type { CustomerSession } from "./session";

export interface AuthorizationUrlParams {
  authorizationEndpoint: string;
  clientId: string;
  redirectUri: string;
  state: string;
  nonce: string;
  codeChallenge: string;
  scopes?: readonly string[];
}

/**
 * Build the URL we send the customer to.
 *
 * Pure — no env, no network — so the query string can be asserted in tests.
 */
export function buildAuthorizationUrl({
  authorizationEndpoint,
  clientId,
  redirectUri,
  state,
  nonce,
  codeChallenge,
  scopes = CUSTOMER_ACCOUNT_SCOPES,
}: AuthorizationUrlParams): string {
  const url = new URL(authorizationEndpoint);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

/** Logout URL for Shopify's own session. Pure. */
export function buildLogoutUrl({
  logoutEndpoint,
  idToken,
  postLogoutRedirectUri,
}: {
  logoutEndpoint: string;
  idToken?: string;
  postLogoutRedirectUri: string;
}): string {
  const url = new URL(logoutEndpoint);
  // Without the hint Shopify cannot tell which session to end, and the
  // customer stays logged in on Shopify's side.
  if (idToken) url.searchParams.set("id_token_hint", idToken);
  url.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);
  return url.toString();
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  id_token?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

/** Claims we read out of the id token. Never trusted for authorization. */
interface IdTokenClaims {
  nonce?: string;
  sub?: string;
  email?: string;
  sid?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
}

interface IdTokenHeader {
  alg?: string;
  kid?: string;
  typ?: string;
}

type ShopifyJwk = NodeJsonWebKey & {
  kid?: string;
  alg?: string;
  use?: string;
};

let jwksCache: { uri: string; keys: ShopifyJwk[]; expiresAt: number } | null = null;
const JWKS_CACHE_MS = 60 * 60 * 1000;

export function clearAuthJwksCache(): void {
  jwksCache = null;
}

function decodeJwtPart<T>(value: string): T {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
  } catch {
    throw new CustomerAuthError(
      "token_exchange_failed",
      "Shopify zwróciło niepoprawny id_token."
    );
  }
}

async function getJwks(uri: string): Promise<ShopifyJwk[]> {
  if (!uri) {
    throw new CustomerAuthError(
      "discovery_failed",
      "Discovery OpenID nie zwróciło `jwks_uri`."
    );
  }
  if (jwksCache?.uri === uri && Date.now() < jwksCache.expiresAt) {
    return jwksCache.keys;
  }
  let response: Response;
  try {
    response = await fetch(uri, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch (error) {
    throw new CustomerAuthError(
      "token_exchange_failed",
      `Nie udało się pobrać kluczy podpisu Shopify: ${
        error instanceof Error ? error.message : "nieznany błąd"
      }.`
    );
  }
  if (!response.ok) {
    throw new CustomerAuthError(
      "token_exchange_failed",
      `Shopify JWKS zwróciło HTTP ${response.status}.`
    );
  }
  const body = (await response.json()) as { keys?: ShopifyJwk[] };
  if (!Array.isArray(body.keys) || body.keys.length === 0) {
    throw new CustomerAuthError(
      "token_exchange_failed",
      "Shopify JWKS nie zawiera kluczy podpisu."
    );
  }
  jwksCache = { uri, keys: body.keys, expiresAt: Date.now() + JWKS_CACHE_MS };
  return body.keys;
}

/**
 * Verify the OpenID token before reading even display-only claims from it.
 * Signature keys and issuer come from discovery, never from the token itself.
 */
export async function verifyIdToken({
  idToken,
  endpoints,
  expectedNonce,
  now = Date.now(),
}: {
  idToken: string;
  endpoints: CustomerAccountEndpoints;
  expectedNonce?: string;
  now?: number;
}): Promise<IdTokenClaims> {
  const parts = idToken.split(".");
  if (parts.length !== 3) {
    throw new CustomerAuthError(
      "token_exchange_failed",
      "Shopify zwróciło id_token w niepoprawnym formacie."
    );
  }
  const header = decodeJwtPart<IdTokenHeader>(parts[0]);
  const claims = decodeJwtPart<IdTokenClaims>(parts[1]);
  if (header.alg !== "RS256" || !header.kid) {
    throw new CustomerAuthError(
      "token_exchange_failed",
      "id_token używa niedozwolonego algorytmu podpisu."
    );
  }

  const keys = await getJwks(endpoints.jwksUri);
  const jwk = keys.find(
    (candidate) => candidate.kid === header.kid && candidate.kty === "RSA"
  );
  if (!jwk) {
    throw new CustomerAuthError(
      "token_exchange_failed",
      "Nie znaleziono klucza podpisu id_token."
    );
  }
  const verified = verifySignature(
    "RSA-SHA256",
    Buffer.from(`${parts[0]}.${parts[1]}`),
    createPublicKey({ key: jwk, format: "jwk" }),
    Buffer.from(parts[2], "base64url")
  );
  if (!verified) {
    throw new CustomerAuthError(
      "token_exchange_failed",
      "Podpis id_token jest nieprawidłowy."
    );
  }

  const nowSeconds = Math.floor(now / 1000);
  const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (claims.iss !== endpoints.issuer || !audience.includes(getClientId())) {
    throw new CustomerAuthError(
      "token_exchange_failed",
      "Issuer lub audience id_token nie zgadza się z konfiguracją."
    );
  }
  if (!claims.exp || claims.exp <= nowSeconds) {
    throw new CustomerAuthError(
      "token_exchange_failed",
      "id_token wygasł."
    );
  }
  if (claims.iat && claims.iat > nowSeconds + 60) {
    throw new CustomerAuthError(
      "token_exchange_failed",
      "id_token ma nieprawidłowy czas wystawienia."
    );
  }
  if (expectedNonce && (!claims.nonce || !safeEqual(claims.nonce, expectedNonce))) {
    throw new CustomerAuthError(
      "invalid_state",
      "Nonce w id_token nie zgadza się z żądaniem logowania."
    );
  }
  return claims;
}

async function postToken(
  tokenEndpoint: string,
  body: URLSearchParams
): Promise<TokenResponse> {
  // Standard base64 — HTTP Basic, not base64url.
  const credentials = Buffer.from(
    `${getClientId()}:${getClientSecret()}`
  ).toString("base64");

  let res: Response;
  try {
    res = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
      body,
      cache: "no-store",
    });
  } catch (err) {
    throw new CustomerAuthError(
      "token_exchange_failed",
      `Nie udało się połączyć z endpointem tokenu: ${
        err instanceof Error ? err.message : "nieznany błąd"
      }`
    );
  }

  const text = await res.text();
  let parsed: TokenResponse;
  try {
    parsed = JSON.parse(text) as TokenResponse;
  } catch {
    throw new CustomerAuthError(
      "token_exchange_failed",
      `Endpoint tokenu zwrócił odpowiedź spoza JSON (HTTP ${res.status}).`
    );
  }

  if (!res.ok || !parsed.access_token) {
    // Shopify's error payload never echoes the secret or the code.
    const detail =
      parsed.error_description || parsed.error || "brak access_token";
    throw new CustomerAuthError(
      "token_exchange_failed",
      `Wymiana tokenu odrzucona (HTTP ${res.status}): ${detail}`
    );
  }

  return parsed;
}

function toSession(token: TokenResponse, claims: IdTokenClaims = {}): CustomerSession {
  const lifetime = typeof token.expires_in === "number" ? token.expires_in : 3600;

  return {
    accessToken: token.access_token!,
    refreshToken: token.refresh_token ?? "",
    expiresAt: Date.now() + lifetime * 1000,
    idToken: token.id_token,
    sub: claims.sub,
    email: claims.email,
    sid: claims.sid,
  };
}

/**
 * Exchange an authorization code for tokens.
 *
 * `expectedNonce` is checked against the id token's `nonce` claim. State
 * protects the redirect; nonce protects the *token* — it proves the id
 * token belongs to the authorization request we started, not a replayed one.
 */
export async function exchangeCodeForSession({
  endpoints,
  code,
  codeVerifier,
  expectedNonce,
}: {
  endpoints: CustomerAccountEndpoints;
  code: string;
  codeVerifier: string;
  expectedNonce: string;
}): Promise<CustomerSession> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: getClientId(),
    redirect_uri: getRedirectUri(),
    code,
    code_verifier: codeVerifier,
  });

  const token = await postToken(endpoints.tokenEndpoint, body);

  if (!token.id_token) {
    throw new CustomerAuthError(
      "token_exchange_failed",
      "Shopify nie zwróciło wymaganego id_token."
    );
  }
  const claims = await verifyIdToken({
    idToken: token.id_token,
    endpoints,
    expectedNonce,
  });
  return toSession(token, claims);
}

/**
 * Refresh an access token.
 *
 * Shopify may or may not rotate the refresh token; when it does not, we keep
 * the previous one rather than storing an empty string and locking the
 * customer out at the next refresh.
 */
export async function refreshSession({
  endpoints,
  refreshToken,
}: {
  endpoints: CustomerAccountEndpoints;
  refreshToken: string;
}): Promise<CustomerSession> {
  if (!refreshToken) {
    throw new CustomerAuthError(
      "refresh_failed",
      "Brak refresh tokenu w sesji.",
      401
    );
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: getClientId(),
    refresh_token: refreshToken,
  });

  let token: TokenResponse;
  try {
    token = await postToken(endpoints.tokenEndpoint, body);
  } catch (err) {
    // A rejected refresh token is not a server fault — the session is simply
    // over, and the customer has to log in again.
    throw new CustomerAuthError(
      "refresh_failed",
      err instanceof Error ? err.message : "Odświeżenie tokenu nie powiodło się.",
      401
    );
  }

  const claims = token.id_token
    ? await verifyIdToken({ idToken: token.id_token, endpoints })
    : {};
  const session = toSession(token, claims);
  if (!session.refreshToken) session.refreshToken = refreshToken;
  return session;
}
