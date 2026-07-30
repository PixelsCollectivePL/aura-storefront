import { NextRequest } from "next/server";
import { beforeAll, describe, expect, it } from "vitest";

import { proxy } from "@/proxy";
import { SESSION_COOKIE } from "@/lib/shopify/customer-account/cookie-names";
import { sealPayload } from "@/lib/shopify/customer-account/crypto";

const SECRET = "proxy-test-secret";

/** A cookie the proxy should accept: sealed with the real Node implementation. */
const VALID = sealPayload(
  { accessToken: "tok", refreshToken: "ref", expiresAt: Date.now() + 60_000 },
  SECRET
);

beforeAll(() => {
  process.env.SESSION_SECRET = SECRET;
});

function request(path: string, cookie?: string) {
  return new NextRequest(`https://aura.example${path}`, {
    headers: cookie ? { cookie: `${SESSION_COOKIE}=${cookie}` } : undefined,
  });
}

describe("account route proxy", () => {
  it("redirects a guest to the Aura login bridge and preserves returnTo", async () => {
    const response = await proxy(request("/konto/zamowienia?page=2"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://aura.example/account/login?returnTo=%2Fkonto%2Fzamowienia%3Fpage%3D2"
    );
  });

  it("lets a validly signed session reach the secure server guard", async () => {
    const response = await proxy(request("/konto", VALID));

    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("keeps the future subscription module outside the active storefront", async () => {
    const response = await proxy(request("/konto/subskrypcje", VALID));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://aura.example/konto");
  });

  /**
   * The regression this guard was rewritten for. A cookie that merely
   * *exists* used to be waved through, so a forged or stale value produced
   * HTTP 200 on a protected route and the redirect only happened during
   * hydration.
   */
  describe("rejects a cookie that is present but not valid", () => {
    const forged = [
      ["garbage", "smieci"],
      ["no signature separator", "brak-kropki"],
      ["too many parts", "a.b.c"],
      ["empty body", ".sygnatura"],
      ["signed with another secret", sealPayload({ a: 1 }, "inny-sekret")],
      [
        "tampered body, original signature",
        (() => {
          const [, signature] = VALID.split(".");
          const body = Buffer.from(
            JSON.stringify({ accessToken: "skradziony" })
          )
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
          return `${body}.${signature}`;
        })(),
      ],
    ] as const;

    for (const [label, cookie] of forged) {
      it(label, async () => {
        const response = await proxy(request("/konto", cookie));

        expect(response.status).toBe(307);
        expect(response.headers.get("location")).toBe(
          "https://aura.example/account/login?returnTo=%2Fkonto"
        );
      });
    }
  });

  it("does not treat a stale access token as logged out", async () => {
    // expiresAt in the past: the refresh token still works, so the customer
    // must not be bounced to the login screen.
    const stale = sealPayload(
      { accessToken: "tok", refreshToken: "ref", expiresAt: Date.now() - 60_000 },
      SECRET
    );

    const response = await proxy(request("/konto", stale));
    expect(response.status).toBe(200);
  });
});
