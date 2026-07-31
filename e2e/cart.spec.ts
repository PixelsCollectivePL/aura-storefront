import { expect, test, type Page } from "@playwright/test";

/**
 * The purchase path, end to end against real Shopify.
 *
 * Each test starts from an empty cart: the cart id lives in an HttpOnly
 * cookie, so a leftover cart from a previous test would make the counts
 * meaningless. Playwright gives every test a fresh context, which is
 * exactly the isolation needed here.
 *
 * These create real carts in Shopify. That is unavoidable for a genuine
 * cart test and harmless — carts expire on their own and never become
 * orders. No test completes a checkout.
 */

/** Add the first product on the listing to the cart. */
async function addFirstProduct(page: Page) {
  await page.goto("/produkty");
  await page.locator('a[href^="/produkty/"]').first().click();
  await page.getByRole("button", { name: /Wrzuć do koszyka/i }).first().click();
  // The badge is the client's proof that Shopify accepted the line.
  await expect(page.getByRole("button", { name: /Otwórz koszyk \(/ })).toBeVisible();
}

test("adding a product reaches Shopify and shows up in the cart", async ({ page }) => {
  await addFirstProduct(page);

  await page.goto("/koszyk");
  await expect(page.getByRole("heading", { name: /Twoje\s+zamówienie/i })).toBeVisible();
  await expect(page.getByText(/SUMA PRODUKTÓW/i).first()).toBeVisible();
});

test("the cart survives a full page reload", async ({ page }) => {
  // The regression that motivated the Cart API work: the old cart lived in
  // React state and died on refresh.
  await addFirstProduct(page);

  await page.goto("/koszyk");
  const before = await page.getByRole("button", { name: /Otwórz koszyk \(/ }).textContent();

  await page.reload();
  const after = await page.getByRole("button", { name: /Otwórz koszyk \(/ }).textContent();

  expect(after).toBe(before);
});

test("quantity changes and removal update the totals", async ({ page }) => {
  await addFirstProduct(page);
  await page.goto("/koszyk");

  await page.getByRole("button", { name: /Zwiększ ilość/ }).first().click();
  await expect(page.getByRole("button", { name: /Otwórz koszyk \(2/ })).toBeVisible();

  await page.getByRole("button", { name: /Usuń .* z koszyka/ }).first().click();
  // Empty state, and the badge loses its count entirely.
  await expect(page.getByRole("heading", { name: "Pusto." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Otwórz koszyk" })).toBeVisible();
});

test("shipping is left for checkout to calculate", async ({ page }) => {
  // The receipt must not invent a shipping cost, or claim free shipping it
  // cannot verify — only Shopify knows the rate for the customer's address.
  await addFirstProduct(page);
  await page.goto("/koszyk");

  // The page renders the receipt twice — `hidden lg:block` for desktop and
  // `lg:hidden` for mobile — so anything unscoped picks the copy that is
  // invisible at the current viewport. Match on visibility, not order.
  await expect(page.locator("text=/NALICZANA W KASIE/i").locator("visible=true").first()).toBeVisible();
  await expect(page.getByText(/^GRATIS$/i)).toHaveCount(0);
});

test("an invalid discount code is rejected once, and can be removed", async ({ page }) => {
  await addFirstProduct(page);
  await page.goto("/koszyk");

  // Scope to the receipt copy that is actually on screen at this viewport.
  const form = page
    .locator("form")
    .filter({ has: page.locator('input[id*="discount"]') })
    .locator("visible=true")
    .first();

  await form.locator('input[id*="discount"]').fill("NIEISTNIEJACY-KOD-E2E");
  await form.getByRole("button", { name: "Zastosuj" }).click();

  await expect(form.getByText(/nie jest dostępny dla tego koszyka/i)).toBeVisible();
  // One explanation, not two: the toast wording must not reappear.
  await expect(page.getByText(/jest nieprawidłowy/i)).toHaveCount(0);

  await form.getByRole("button", { name: "Usuń" }).click();
  await expect(page.getByText(/nie jest dostępny dla tego koszyka/i)).toHaveCount(0);
});

test("checkout hands off to Shopify with the cart intact", async ({ page }) => {
  await addFirstProduct(page);
  await page.goto("/koszyk");

  await page.getByRole("button", { name: /Przejdź do kasy/i }).first().click();

  // Shopify-hosted checkout, on a URL we did not build ourselves — the
  // `key` parameter is why checkoutUrl must be used verbatim.
  await page.waitForURL(/\/checkouts\/cn\//, { timeout: 30_000 });
  expect(page.url()).toContain("/checkouts/cn/");

  // Stop here. Never complete an order.
  await expect(page).toHaveTitle(/Realizacja zakupu|Checkout/i);
});
