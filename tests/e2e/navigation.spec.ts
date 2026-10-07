import { expect, test } from "@playwright/test";

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop only");
});

test("header Visit link lands on the visit section", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("load");
  await page.click('[data-nav="visit"]');
  await expect(page.locator("#visit h2")).toBeInViewport({ timeout: 5000 });
});

test("visit section still reachable after resize", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("load");
  await page.setViewportSize({ width: 900, height: 700 });
  await page.waitForTimeout(500);
  await page.click('[data-nav="visit"]');
  await expect(page.locator("#visit h2")).toBeInViewport({ timeout: 5000 });
});

test("opening a shared /#visit link lands on the visit section", async ({ page }) => {
  await page.goto("/#visit");
  await page.waitForLoadState("load");
  await expect(page.locator("#visit h2")).toBeInViewport({ timeout: 5000 });
});
