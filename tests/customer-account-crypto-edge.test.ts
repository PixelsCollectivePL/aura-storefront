import { describe, expect, it } from "vitest";

import { openPayload, sealPayload } from "@/lib/shopify/customer-account/crypto";
import { openPayloadEdge } from "@/lib/shopify/customer-account/crypto-edge";

/**
 * The session cookie is written with `node:crypto` in Route Handlers and read
 * with Web Crypto in middleware. If those two ever disagree, the failure is
 * silent and total: either every customer is locked out of /konto, or every
 * forged cookie is accepted at the edge.
 *
 * These tests pin them together.
 */

const SECRET = "wspolny-sekret-testowy";

describe("edge verification matches the Node implementation", () => {
  it("opens a payload sealed by node:crypto", async () => {
    const payload = { accessToken: "tok", expiresAt: 1234, email: "a@b.pl" };
    const sealed = sealPayload(payload, SECRET);

    await expect(openPayloadEdge(sealed, SECRET)).resolves.toEqual(payload);
    // …and the Node side still agrees, so neither drifted.
    expect(openPayload(sealed, SECRET)).toEqual(payload);
  });

  it("survives non-ASCII content, where base64 handling usually breaks", async () => {
    const payload = { email: "żółć@przykład.pl", name: "Kuba Mróz · ☕" };
    const sealed = sealPayload(payload, SECRET);

    await expect(openPayloadEdge(sealed, SECRET)).resolves.toEqual(payload);
  });

  it("rejects exactly what the Node implementation rejects", async () => {
    const cases: Array<string | undefined> = [
      undefined,
      "",
      "brak-kropki",
      "a.b.c",
      ".",
      sealPayload({ a: 1 }, "inny-sekret"),
    ];

    for (const value of cases) {
      await expect(openPayloadEdge(value, SECRET)).resolves.toBeNull();
      expect(openPayload(value, SECRET)).toBeNull();
    }
  });

  it("rejects a tampered body carrying a genuine signature", async () => {
    const sealed = sealPayload({ role: "customer" }, SECRET);
    const [, signature] = sealed.split(".");
    const forgedBody = Buffer.from(JSON.stringify({ role: "admin" }))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await expect(
      openPayloadEdge(`${forgedBody}.${signature}`, SECRET)
    ).resolves.toBeNull();
  });

  it("rejects a signature that is not valid base64url", async () => {
    const sealed = sealPayload({ a: 1 }, SECRET);
    const [body] = sealed.split(".");

    await expect(openPayloadEdge(`${body}.!!!!`, SECRET)).resolves.toBeNull();
  });
});
