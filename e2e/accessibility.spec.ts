import { expect, test } from "@playwright/test";

test("keyboard users can skip repeated navigation", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Przejdź do treści" });
  await expect(skipLink).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("search returns focus to its trigger after closing", async ({ page }) => {
  await page.goto("/");

  const searchTrigger = page
    .getByRole("button", { name: "Otwórz wyszukiwanie" })
    .filter({ visible: true });
  await searchTrigger.focus();
  await searchTrigger.press("Enter");

  await expect(page.getByRole("dialog", { name: "Wyszukaj" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(searchTrigger).toBeFocused();
});
