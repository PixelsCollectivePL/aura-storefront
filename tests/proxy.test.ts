import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { proxy } from "@/proxy";
import { SESSION_COOKIE } from "@/lib/shopify/customer-account/cookie-names";

describe("account route proxy", () => {
  it("redirects a guest to the Aura login bridge and preserves returnTo", () => {
    const response = proxy(
      new NextRequest("https://aura.example/konto/zamowienia?page=2")
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://aura.example/account/login?returnTo=%2Fkonto%2Fzamowienia%3Fpage%3D2"
    );
  });

  it("lets a request with a session cookie reach the secure server guard", () => {
    const request = new NextRequest("https://aura.example/konto", {
      headers: { cookie: `${SESSION_COOKIE}=signed-session` },
    });

    const response = proxy(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("keeps the future subscription module outside the active storefront", () => {
    const response = proxy(
      new NextRequest("https://aura.example/konto/subskrypcje", {
        headers: { cookie: `${SESSION_COOKIE}=signed-session` },
      })
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://aura.example/konto");
  });
});
