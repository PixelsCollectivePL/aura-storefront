import { expect, test } from "@playwright/test";

test("route content gets the Aura transition on navigation", async ({ page }) => {
  await page.goto("/produkty");

  const aboutLink = page
    .getByRole("link", { name: "O marce", exact: true })
    .filter({ visible: true })
    .first();
  await aboutLink.click();
  await expect(page).toHaveURL(/\/o-marce$/);

  const route = page.locator('[data-route="/o-marce"]');
  await expect(route).toBeVisible();
  await expect
    .poll(() =>
      route.evaluate((element) =>
        element
          .getAnimations({ subtree: true })
          .map((animation) => (animation as CSSAnimation).animationName)
      )
    )
    .toContain("aura-route-enter");
});

test("route motion is disabled when the visitor requests reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/produkty");

  const route = page.locator('[data-route="/produkty"]');
  await expect(route).toBeVisible();
  const animationNames = await route.evaluate((element) =>
    element
      .getAnimations({ subtree: true })
      .map((animation) => (animation as CSSAnimation).animationName)
  );

  expect(animationNames).not.toContain("aura-route-enter");
  expect(animationNames).not.toContain("aura-route-rule");
});
