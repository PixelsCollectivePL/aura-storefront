import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests, run against a deployment rather than a local server.
 *
 * That is deliberate: this project has no local Shopify credentials, so a
 * `next dev` here would render an empty catalogue and the tests would
 * assert nothing. Pointing at the deployed URL tests the thing customers
 * actually get — real Storefront API, real middleware, real cache.
 *
 * Override the target when testing a preview deployment:
 *   E2E_BASE_URL=https://aura-storefront-xxxx.vercel.app npm run e2e
 *
 * ── What these tests never do ────────────────────────────────────────
 * Place an order. The checkout test asserts the hand-off URL and stops at
 * Shopify's payment page. They do create real carts in Shopify, which is
 * unavoidable for a genuine cart test and harmless — carts expire on
 * their own and never become orders.
 */
export default defineConfig({
  testDir: "./e2e",
  // Vitest owns tests/; keep the two suites from colliding.
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: process.env.E2E_BASE_URL ?? "https://aura-storefront-chi.vercel.app",
    trace: "on-first-retry",
    // The storefront is Polish; anything else changes Shopify's checkout
    // locale and the assertions with it.
    locale: "pl-PL",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // The cart and account panel are mobile-first; the sticky bars and the
    // tab bar only exist below `lg`, so they need their own run.
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
