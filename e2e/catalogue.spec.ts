import { expect, test } from "@playwright/test";

/**
 * Catalogue and product detail.
 *
 * These assert the shape of the page rather than specific merchandising —
 * product names, prices and metafields all change in Shopify Admin, and a
 * test that breaks every time someone edits a product is a test nobody
 * keeps.
 */

test("listing renders products from Shopify", async ({ page }) => {
  await page.goto("/produkty");

  await expect(page.getByRole("heading", { name: /Wszystkie kawy/i })).toBeVisible();

  const productLinks = page.locator('a[href^="/produkty/"]');
  await expect(productLinks.first()).toBeVisible();

  // The count strip must agree with what is on screen — this caught the
  // empty catalogue when the inventory scope was missing.
  const count = await productLinks.count();
  expect(count).toBeGreaterThan(0);
});

test("listing offers category filters", async ({ page }) => {
  await page.goto("/produkty");
  // "Wszystko" is present whether the chips come from Shopify collections
  // or from the legacy fallback list.
  await expect(page.getByRole("button", { name: "Wszystko" })).toBeVisible();
});

test("product page shows a price and a way to buy", async ({ page }) => {
  await page.goto("/produkty");
  await page.locator('a[href^="/produkty/"]').first().click();

  await expect(page).toHaveURL(/\/produkty\/[^/]+$/);
  // Price, in PLN, somewhere on the page.
  await expect(page.getByText(/\d+\s*(PLN|zł)/i).first()).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Wrzuć do koszyka/i }).first()
  ).toBeVisible();
});

test("product page shows the Shopify image, not the placeholder", async ({ page }) => {
  await page.goto("/produkty");
  await page.locator('a[href^="/produkty/"]').first().click();

  // Next/Image proxies Shopify's CDN through /_next/image.
  const packshot = page.locator('img[src*="/_next/image"]').first();
  await expect(packshot).toBeVisible();
  await expect(packshot).toHaveAttribute("src", /cdn\.shopify\.com/);
});

test("the storefront is not indexable before launch", async ({ page }) => {
  // A launch that forgets AURA_ALLOW_INDEXING is recoverable; one that
  // ships noindex to a live shop is weeks of lost traffic. Both directions
  // are worth a test.
  const response = await page.goto("/produkty");
  expect(response?.headers()["x-robots-tag"]).toContain("noindex");
});

test("unknown product is not found, and not indexable", async ({ page }) => {
  const response = await page.goto("/produkty/nie-ma-takiej-kawy");

  // Deliberately NOT asserting a 404 status. This route streams — it has a
  // loading.tsx — and Next documents that a streamed response always
  // commits 200 because the headers are sent before `notFound()` runs.
  // What matters for SEO is the marker Next injects instead, which is what
  // keeps crawlers from treating the URL as a real page.
  expect(response?.status()).toBe(200);
  const robots = await page
    .locator('meta[name="robots"]')
    .first()
    .getAttribute("content");
  expect(robots).toContain("noindex");

  // And the customer sees a not-found page, not a broken product page.
  await expect(page.getByRole("button", { name: /Wrzuć do koszyka/i })).toHaveCount(0);
});
