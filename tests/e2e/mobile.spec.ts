import { expect, test } from "@playwright/test";

test("mobile: action bar stays visible and page never scrolls sideways", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  await page.goto("/");
  const bar = page.locator("[data-mobile-bar]");
  await expect(bar).toBeVisible();
  for (let i = 0; i < 10; i++) await page.mouse.wheel(0, 1000);
  await expect(bar).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test("desktop: mobile action bar hidden", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop only");
  await page.goto("/");
  await expect(page.locator("[data-mobile-bar]")).toBeHidden();
});
