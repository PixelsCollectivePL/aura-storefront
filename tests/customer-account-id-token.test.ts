import {
  createSign,
  generateKeyPairSync,
  type JsonWebKey,
  type KeyObject,
} from "node:crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import {
  clearAuthJwksCache,
  verifyIdToken,
} from "@/lib/shopify/customer-account/auth";
import type { CustomerAccountEndpoints } from "@/lib/shopify/customer-account/discovery";

const CLIENT_ID = "client-id-test";
const ISSUER = "https://shopify.com/authentication/1";
const KID = "shopify-test-key";
const NOW = 1_800_000_000_000;

let privateKey: KeyObject;
let publicJwk: JsonWebKey;

const endpoints: CustomerAccountEndpoints = {
  shopId: "1",
  graphqlApi: "https://shopify.com/1/account/customer/api/2026-07/graphql",
  apiVersion: "2026-07",
  authorizationEndpoint: `${ISSUER}/oauth/authorize`,
  tokenEndpoint: `${ISSUER}/oauth/token`,
  logoutEndpoint: `${ISSUER}/logout`,
  jwksUri: `${ISSUER}/.well-known/jwks.json`,
  issuer: ISSUER,
  scopesSupported: [],
};

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function token(
  overrides: Record<string, unknown> = {},
  signingKey = privateKey
): string {
  const header = encode({ alg: "RS256", typ: "JWT", kid: KID });
  const payload = encode({
    iss: ISSUER,
    aud: CLIENT_ID,
    exp: Math.floor(NOW / 1000) + 600,
    iat: Math.floor(NOW / 1000) - 10,
    nonce: "expected-nonce",
    sub: "gid://shopify/Customer/1",
    email: "klient@example.com",
    ...overrides,
  });
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${payload}`);
  signer.end();
  return `${header}.${payload}.${signer.sign(signingKey).toString("base64url")}`;
}

describe("verifyIdToken", () => {
  beforeAll(() => {
    vi.stubEnv("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID", CLIENT_ID);
    const pair = generateKeyPairSync("rsa", { modulusLength: 2048 });
    privateKey = pair.privateKey;
    publicJwk = pair.publicKey.export({ format: "jwk" });
    clearAuthJwksCache();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ keys: [{ ...publicJwk, kid: KID, alg: "RS256" }] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    clearAuthJwksCache();
  });

  it("accepts a valid Shopify RS256 token and verified nonce", async () => {
    const claims = await verifyIdToken({
      idToken: token(),
      endpoints,
      expectedNonce: "expected-nonce",
      now: NOW,
    });
    expect(claims.email).toBe("klient@example.com");
  });

  it("rejects a token signed by a different private key", async () => {
    const attacker = generateKeyPairSync("rsa", { modulusLength: 2048 });
    await expect(
      verifyIdToken({
        idToken: token({}, attacker.privateKey),
        endpoints,
        expectedNonce: "expected-nonce",
        now: NOW,
      })
    ).rejects.toThrow(/Podpis/);
  });

  it("requires the exact nonce", async () => {
    await expect(
      verifyIdToken({
        idToken: token({ nonce: "replayed-nonce" }),
        endpoints,
        expectedNonce: "expected-nonce",
        now: NOW,
      })
    ).rejects.toMatchObject({ code: "invalid_state" });
  });

  it("rejects an expired token", async () => {
    await expect(
      verifyIdToken({
        idToken: token({ exp: Math.floor(NOW / 1000) - 1 }),
        endpoints,
        now: NOW,
      })
    ).rejects.toThrow(/wygasł/);
  });

  it("rejects the wrong issuer or audience", async () => {
    await expect(
      verifyIdToken({
        idToken: token({ iss: "https://evil.example" }),
        endpoints,
        now: NOW,
      })
    ).rejects.toThrow(/Issuer lub audience/);
    await expect(
      verifyIdToken({
        idToken: token({ aud: "other-client" }),
        endpoints,
        now: NOW,
      })
    ).rejects.toThrow(/Issuer lub audience/);
  });
});
