/**
 * Cryptographic primitives for the OAuth flow and the session cookie.
 *
 * Uses `node:crypto` only — no new runtime dependencies. Consequence: every
 * route that touches this must run on the Node runtime, not Edge.
 *
 * Exported individually so each piece is unit-testable without a browser,
 * a server, or a Shopify account.
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/* ─── Encoding ────────────────────────────────────────────────────────── */

export function base64UrlEncode(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function base64UrlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded, "base64");
}

/** Cryptographically random, URL-safe string. Used for `state` and `nonce`. */
export function randomUrlSafe(byteLength = 32): string {
  return base64UrlEncode(randomBytes(byteLength));
}

/* ─── PKCE ────────────────────────────────────────────────────────────── */

/**
 * PKCE code verifier.
 *
 * RFC 7636 requires 43–128 characters; 32 random bytes base64url-encoded
 * gives 43, the minimum that is still full entropy.
 */
export function createCodeVerifier(): string {
  return randomUrlSafe(32);
}

/**
 * S256 challenge for a verifier — the only method the store's discovery
 * document advertises.
 */
export function createCodeChallenge(verifier: string): string {
  return base64UrlEncode(createHash("sha256").update(verifier).digest());
}

/* ─── Signed payloads ─────────────────────────────────────────────────── */

/** Constant-time compare that tolerates length mismatch without throwing. */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function sign(payload: string, secret: string): string {
  return base64UrlEncode(createHmac("sha256", secret).update(payload).digest());
}

/**
 * Serialise and sign a payload as `<base64url(json)>.<base64url(hmac)>`.
 *
 * This is authentication, not encryption: the payload is readable by anyone
 * holding the cookie, but cannot be modified without the secret. That is
 * the right trade-off here because the cookie is HttpOnly and never leaves
 * the server–browser channel, and because we need the server to read
 * `expiresAt` without a round trip.
 */
export function sealPayload<T extends object>(value: T, secret: string): string {
  const body = base64UrlEncode(JSON.stringify(value));
  return `${body}.${sign(body, secret)}`;
}

/**
 * Verify and parse a sealed payload. Returns `null` for anything suspect —
 * wrong shape, bad signature, unparseable JSON — so callers have a single
 * failure path and cannot accidentally trust a tampered value.
 */
export function openPayload<T>(token: string | undefined, secret: string): T | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [body, signature] = parts;
  if (!body || !signature) return null;
  if (!safeEqual(signature, sign(body, secret))) return null;

  try {
    return JSON.parse(base64UrlDecode(body).toString("utf8")) as T;
  } catch {
    return null;
  }
}
