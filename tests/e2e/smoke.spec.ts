import { expect, test } from "@playwright/test";

test("page has title and all sections in order", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Arley Bakery/);
  const ids = await page.locator("[data-section]").evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(["header", "hero", "story", "showcase", "menu", "gallery", "visit", "footer"]);
});
