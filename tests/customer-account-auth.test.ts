import { describe, expect, it } from "vitest";

import {
  buildAuthorizationUrl,
  buildLogoutUrl,
} from "@/lib/shopify/customer-account/auth";
import { parseGraphqlApi } from "@/lib/shopify/customer-account/discovery";
import {
  isAccessTokenStale,
  safeReturnPath,
  TOKEN_REFRESH_MARGIN_SECONDS,
} from "@/lib/shopify/customer-account/session";

const ENDPOINT = "https://shopify.com/authentication/107230986579/oauth/authorize";

describe("buildAuthorizationUrl", () => {
  const url = new URL(
    buildAuthorizationUrl({
      authorizationEndpoint: ENDPOINT,
      clientId: "client-123",
      redirectUri: "https://aura.example/api/auth/shopify/callback",
      state: "state-abc",
      nonce: "nonce-xyz",
      codeChallenge: "challenge-789",
    })
  );

  it("targets the discovered authorization endpoint", () => {
    expect(`${url.origin}${url.pathname}`).toBe(ENDPOINT);
  });

  it("requests the authorization-code flow with PKCE S256", () => {
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("code_challenge")).toBe("challenge-789");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
  });

  it("carries state and nonce", () => {
    expect(url.searchParams.get("state")).toBe("state-abc");
    expect(url.searchParams.get("nonce")).toBe("nonce-xyz");
  });

  it("requests the scopes the Customer Account API needs", () => {
    const scopes = url.searchParams.get("scope")?.split(" ") ?? [];
    expect(scopes).toContain("openid");
    expect(scopes).toContain("email");
    expect(scopes).toContain("customer-account-api:full");
  });

  it("never leaks the client secret into the URL", () => {
    expect(url.searchParams.has("client_secret")).toBe(false);
    expect(url.toString()).not.toMatch(/secret/i);
  });

  it("passes the redirect URI unmodified", () => {
    expect(url.searchParams.get("redirect_uri")).toBe(
      "https://aura.example/api/auth/shopify/callback"
    );
  });
});

describe("buildLogoutUrl", () => {
  it("includes the id token hint so Shopify ends the right session", () => {
    const url = new URL(
      buildLogoutUrl({
        logoutEndpoint: "https://shopify.com/authentication/1/logout",
        idToken: "id-token-value",
        postLogoutRedirectUri: "https://aura.example/",
      })
    );
    expect(url.searchParams.get("id_token_hint")).toBe("id-token-value");
    expect(url.searchParams.get("post_logout_redirect_uri")).toBe(
      "https://aura.example/"
    );
  });

  it("omits the hint when there is no id token", () => {
    const url = new URL(
      buildLogoutUrl({
        logoutEndpoint: "https://shopify.com/authentication/1/logout",
        postLogoutRedirectUri: "https://aura.example/",
      })
    );
    expect(url.searchParams.has("id_token_hint")).toBe(false);
  });
});

describe("parseGraphqlApi", () => {
  it("extracts the shop id and API version", () => {
    expect(
      parseGraphqlApi(
        "https://shopify.com/107230986579/account/customer/api/2026-07/graphql"
      )
    ).toEqual({ shopId: "107230986579", apiVersion: "2026-07" });
  });

  it("throws on an unexpected URL shape rather than guessing", () => {
    expect(() => parseGraphqlApi("https://example.com/graphql")).toThrow();
    expect(() => parseGraphqlApi("")).toThrow();
    // Non-numeric shop id must not be accepted.
    expect(() =>
      parseGraphqlApi(
        "https://shopify.com/abc/account/customer/api/2026-07/graphql"
      )
    ).toThrow();
  });
});

describe("isAccessTokenStale", () => {
  const now = 1_000_000_000_000;

  it("is false well before expiry", () => {
    expect(isAccessTokenStale({ expiresAt: now + 3600_000 }, now)).toBe(false);
  });

  it("is true inside the refresh margin", () => {
    const justInside = now + (TOKEN_REFRESH_MARGIN_SECONDS - 5) * 1000;
    expect(isAccessTokenStale({ expiresAt: justInside }, now)).toBe(true);
  });

  it("is true for an already expired token", () => {
    expect(isAccessTokenStale({ expiresAt: now - 1 }, now)).toBe(true);
  });
});

describe("safeReturnPath", () => {
  it("keeps same-site absolute paths", () => {
    expect(safeReturnPath("/konto/zamowienia", "/account")).toBe(
      "/konto/zamowienia"
    );
  });

  it("blocks open redirects", () => {
    for (const evil of [
      "https://evil.example",
      "//evil.example",
      "/\\evil.example",
      "http://evil.example/path",
      "evil.example",
    ]) {
      expect(safeReturnPath(evil, "/account")).toBe("/account");
    }
  });

  it("falls back when absent", () => {
    expect(safeReturnPath(null, "/account")).toBe("/account");
    expect(safeReturnPath("", "/account")).toBe("/account");
  });
});
