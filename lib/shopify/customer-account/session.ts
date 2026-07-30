/**
 * Customer session — signed, HttpOnly cookies.
 *
 * SERVER-ONLY.
 *
 * Two cookies, deliberately separate:
 *
 *   `aura_customer`  — the session. Access token, refresh token, expiry.
 *                      Lives as long as the refresh token is useful.
 *   `aura_oauth`     — one OAuth round trip. State, nonce, PKCE verifier and
 *                      where to return to. Deleted the moment the callback
 *                      consumes it, and expires in minutes.
 *
 * Keeping them apart means a stalled or replayed login attempt can never
 * touch an established session, and the short-lived cookie carries no
 * credentials at all.
 *
 * Tokens are never exposed to the browser: no `document.cookie` access
 * (HttpOnly), no token in any response body, no token in a URL. The client
 * only ever learns *whether* it is logged in — see the `session` route.
 */

import { cookies } from "next/headers";

import { getSessionSecret } from "./config";
import { OAUTH_COOKIE, SESSION_COOKIE } from "./cookie-names";
import { openPayload, sealPayload } from "./crypto";

export { OAUTH_COOKIE, SESSION_COOKIE } from "./cookie-names";

/** The OAuth transaction lives only as long as a login attempt plausibly takes. */
const OAUTH_COOKIE_MAX_AGE = 60 * 10; // 10 min

/**
 * Session cookie lifetime.
 *
 * Not the access-token lifetime — that is minutes and is refreshed
 * server-side. This is how long we keep the refresh token available before
 * the customer has to log in again.
 */
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

/**
 * Refresh this many seconds before the access token actually expires, to
 * cover clock skew plus the duration of an in-flight request.
 */
export const TOKEN_REFRESH_MARGIN_SECONDS = 120;

export interface CustomerSession {
  accessToken: string;
  refreshToken: string;
  /** Epoch ms when the access token expires. */
  expiresAt: number;
  /** Needed as `id_token_hint` to log out of Shopify's own session. */
  idToken?: string;
  /** OpenID subject — stable customer identifier. */
  sub?: string;
  email?: string;
  /** Shopify session id from the id token, useful for debugging. */
  sid?: string;
}

export interface OAuthTransaction {
  state: string;
  nonce: string;
  codeVerifier: string;
  /** Path to return to after login. Always relative — never an open redirect. */
  returnTo: string;
  createdAt: number;
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    // Lax, not Strict: the callback is a top-level cross-site GET coming back
    // from Shopify, and Strict would withhold the cookie exactly then.
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

/* ─── OAuth transaction ───────────────────────────────────────────────── */

export async function saveOAuthTransaction(tx: OAuthTransaction): Promise<void> {
  const store = await cookies();
  store.set(
    OAUTH_COOKIE,
    sealPayload(tx, getSessionSecret()),
    cookieOptions(OAUTH_COOKIE_MAX_AGE)
  );
}

export async function readOAuthTransaction(): Promise<OAuthTransaction | null> {
  const store = await cookies();
  return openPayload<OAuthTransaction>(
    store.get(OAUTH_COOKIE)?.value,
    getSessionSecret()
  );
}

export async function clearOAuthTransaction(): Promise<void> {
  const store = await cookies();
  store.delete(OAUTH_COOKIE);
}

/* ─── Session ─────────────────────────────────────────────────────────── */

export async function saveSession(session: CustomerSession): Promise<void> {
  const store = await cookies();
  store.set(
    SESSION_COOKIE,
    sealPayload(session, getSessionSecret()),
    cookieOptions(SESSION_COOKIE_MAX_AGE)
  );
}

/**
 * Read the session without refreshing it.
 *
 * Returns the payload even when the access token is stale — deciding what
 * to do about that belongs to the caller (see `getValidAccessToken` in
 * `client.ts`, Faza 2).
 */
export async function readSession(): Promise<CustomerSession | null> {
  const store = await cookies();
  return openPayload<CustomerSession>(
    store.get(SESSION_COOKIE)?.value,
    getSessionSecret()
  );
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Whether the access token needs refreshing before the next API call. */
export function isAccessTokenStale(
  session: Pick<CustomerSession, "expiresAt">,
  now = Date.now()
): boolean {
  return session.expiresAt - TOKEN_REFRESH_MARGIN_SECONDS * 1000 <= now;
}

/**
 * Sanitise a `returnTo` value taken from a query string.
 *
 * Only same-site absolute paths survive. Anything else — a full URL, a
 * protocol-relative `//evil.example`, a back-slash trick — collapses to the
 * default. Without this, `?returnTo=` is an open redirect that can be used
 * to bounce a freshly authenticated customer off-site.
 */
export function safeReturnPath(raw: string | null, fallback: string): string {
  if (!raw) return fallback;
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  return raw;
}
