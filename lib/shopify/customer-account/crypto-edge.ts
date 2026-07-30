/**
 * Signature verification that runs on the Edge runtime.
 *
 * `crypto.ts` uses `node:crypto`, which middleware cannot import. This is
 * the same HMAC-SHA256 scheme implemented with Web Crypto so the proxy can
 * reject a forged or corrupted session cookie *before* a protected page
 * starts streaming.
 *
 * The two implementations must stay byte-compatible — a payload sealed by
 * `sealPayload` has to open here and vice versa. That is asserted in
 * `tests/customer-account-crypto-edge.test.ts`, because a silent divergence
 * would either lock every customer out or wave every forgery through.
 */

/** base64url → bytes, without Buffer. */
function base64UrlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** bytes → base64url, without Buffer. */
function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Constant-time comparison. Length mismatch returns false without leaking. */
function safeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

/**
 * Verify a `<base64url(json)>.<base64url(hmac)>` token and return its payload.
 *
 * `null` for anything suspect — wrong shape, bad signature, unparseable
 * JSON — so the caller has a single failure path, exactly like the Node
 * implementation.
 */
export async function openPayloadEdge<T>(
  token: string | undefined,
  secret: string
): Promise<T | null> {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [body, signature] = parts;
  if (!body || !signature) return null;

  let expected: Uint8Array;
  try {
    const key = await hmacKey(secret);
    expected = new Uint8Array(
      await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body))
    );
  } catch {
    return null;
  }

  let provided: Uint8Array;
  try {
    provided = base64UrlToBytes(signature);
  } catch {
    return null;
  }

  if (!safeEqualBytes(provided, expected)) return null;

  try {
    return JSON.parse(new TextDecoder().decode(base64UrlToBytes(body))) as T;
  } catch {
    return null;
  }
}

/** Exposed for the compatibility test. */
export const __edgeInternals = { base64UrlToBytes, bytesToBase64Url };
