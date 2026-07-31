import { expect, test } from "@playwright/test";

/**
 * Account protection and the login bridge.
 *
 * These stop short of authenticating: Shopify's login is a one-time code
 * sent by e-mail, which no automated test should try to intercept. What is
 * testable — and what actually protects customer data — is that every
 * protected route refuses an unauthenticated request, and that the login
 * hand-off carries the right OAuth parameters.
 */

const PROTECTED = [
  "/konto",
  "/konto/zamowienia",
  "/konto/adresy",
  "/konto/dane",
];

for (const path of PROTECTED) {
  test(`${path} refuses a guest and remembers where they were going`, async ({ page }) => {
    const response = await page.goto(path);

    await expect(page).toHaveURL(/\/account\/login/);
    // returnTo is what sends the customer back to the page they wanted,
    // instead of dumping them on the dashboard after logging in.
    expect(page.url()).toContain(`returnTo=${encodeURIComponent(path)}`);
    expect(response?.status()).toBeLessThan(400);
  });
}

test("a forged session cookie does not get past the guard", async ({
  page,
  context,
  baseURL,
}) => {
  // The regression: the proxy checked only that the cookie existed, so an
  // invalid one produced HTTP 200 on a protected route and the redirect
  // happened during hydration.
  await context.addCookies([
    {
      name: "aura_customer",
      value: "podrobione.ciasteczko",
      url: baseURL!,
    },
  ]);

  const response = await page.goto("/konto");

  await expect(page).toHaveURL(/\/account\/login/);
  // And rejected at the edge, before the page streams — not repaired
  // later by client-side JavaScript.
  expect(response?.request().redirectedFrom()).not.toBeNull();
});

test("the subscription module stays out of the storefront", async ({ page }) => {
  // Subscriptions have no backend. The route must not present a UI that
  // implies otherwise.
  await page.goto("/konto/subskrypcje");
  await expect(page).toHaveURL(/\/(konto|account\/login)/);
  await expect(page.getByText(/Zarządzaj subskrypcją/i)).toHaveCount(0);
});

test("the login bridge starts a proper OAuth round trip", async ({ request }) => {
  // Inspect the redirect itself rather than following it: Shopify's own
  // login screen redirects further, and this test is about the parameters
  // we send, not about their UI.
  const response = await request.get("/api/auth/shopify/login", {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(307);
  const location = response.headers()["location"];
  expect(location).toContain("shopify.com/authentication/");

  const url = new URL(location);
  expect(url.searchParams.get("response_type")).toBe("code");
  expect(url.searchParams.get("code_challenge_method")).toBe("S256");
  expect(url.searchParams.get("code_challenge")).toBeTruthy();
  expect(url.searchParams.get("state")).toBeTruthy();
  expect(url.searchParams.get("nonce")).toBeTruthy();
  expect(url.searchParams.get("scope")).toContain("customer-account-api:full");
  // The client secret must never appear in a URL the browser can see.
  expect(location).not.toMatch(/client_secret/i);
});

test("the session endpoint reports a guest as a guest, without leaking", async ({ request }) => {
  const response = await request.get("/api/auth/shopify/session");
  expect(response.ok()).toBe(true);

  const body = await response.json();
  expect(body.authenticated).toBe(false);
  // No token, no refresh token, no expiry — the browser has no use for any
  // of them, and every one would be a credential leak.
  expect(JSON.stringify(body)).not.toMatch(/token|refresh|expires/i);
});

test("logging out clears both cookies even without a session", async ({ request }) => {
  const response = await request.get("/api/auth/shopify/logout", {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(307);
  const setCookie = response.headersArray().filter((h) => h.name.toLowerCase() === "set-cookie");
  const cleared = setCookie.map((h) => h.value).join(" ");
  expect(cleared).toContain("aura_customer=");
  expect(cleared).toContain("aura_oauth=");
});

test("the legacy /account address forwards to the Polish route", async ({ page }) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/(konto|account\/login)/);
});
