import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";

import {
  base64UrlDecode,
  base64UrlEncode,
  createCodeChallenge,
  createCodeVerifier,
  openPayload,
  randomUrlSafe,
  safeEqual,
  sealPayload,
} from "@/lib/shopify/customer-account/crypto";

const SECRET = "test-secret-nigdy-nieuzywany-w-produkcji";

describe("base64url", () => {
  it("round-trips arbitrary bytes", () => {
    const input = "kawa · żółć / +?=";
    expect(base64UrlDecode(base64UrlEncode(input)).toString("utf8")).toBe(input);
  });

  it("emits no characters that need URL escaping", () => {
    const encoded = base64UrlEncode(Buffer.from([251, 255, 0, 62, 63]));
    expect(encoded).not.toMatch(/[+/=]/);
  });
});

describe("PKCE", () => {
  it("produces a verifier within the RFC 7636 length range", () => {
    const verifier = createCodeVerifier();
    expect(verifier.length).toBeGreaterThanOrEqual(43);
    expect(verifier.length).toBeLessThanOrEqual(128);
    expect(verifier).toMatch(/^[A-Za-z0-9\-_]+$/);
  });

  it("derives the S256 challenge exactly as the spec defines it", () => {
    const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
    const expected = createHash("sha256")
      .update(verifier)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(createCodeChallenge(verifier)).toBe(expected);
  });

  it("gives a different challenge for a different verifier", () => {
    expect(createCodeChallenge("a".repeat(43))).not.toBe(
      createCodeChallenge("b".repeat(43))
    );
  });
});

describe("randomUrlSafe", () => {
  it("does not repeat across calls", () => {
    const values = new Set(Array.from({ length: 200 }, () => randomUrlSafe()));
    expect(values.size).toBe(200);
  });
});

describe("safeEqual", () => {
  it("matches identical strings and rejects everything else", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    // Length mismatch must return false rather than throw.
    expect(safeEqual("abc", "ab")).toBe(false);
    expect(safeEqual("", "")).toBe(true);
  });
});

describe("sealPayload / openPayload", () => {
  it("round-trips a payload", () => {
    const payload = { accessToken: "tok", expiresAt: 123, email: "a@b.pl" };
    const sealed = sealPayload(payload, SECRET);
    expect(openPayload<typeof payload>(sealed, SECRET)).toEqual(payload);
  });

  it("rejects a payload whose body was tampered with", () => {
    const sealed = sealPayload({ role: "customer" }, SECRET);
    const [, signature] = sealed.split(".");
    const forgedBody = base64UrlEncode(JSON.stringify({ role: "admin" }));
    expect(openPayload(`${forgedBody}.${signature}`, SECRET)).toBeNull();
  });

  it("rejects a valid payload signed with a different secret", () => {
    const sealed = sealPayload({ a: 1 }, "inny-sekret");
    expect(openPayload(sealed, SECRET)).toBeNull();
  });

  it("rejects malformed input instead of throwing", () => {
    expect(openPayload(undefined, SECRET)).toBeNull();
    expect(openPayload("", SECRET)).toBeNull();
    expect(openPayload("bez-kropki", SECRET)).toBeNull();
    expect(openPayload("a.b.c", SECRET)).toBeNull();
    expect(openPayload(".", SECRET)).toBeNull();
    // Correct signature over a body that is not JSON.
    const body = base64UrlEncode("nie-json");
    const sealed = sealPayload({ x: 1 }, SECRET);
    expect(openPayload(`${body}.${sealed.split(".")[1]}`, SECRET)).toBeNull();
  });
});
