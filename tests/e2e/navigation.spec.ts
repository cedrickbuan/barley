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

test("a malformed URL hash does not break the page", async ({ page }) => {
  await page.goto("/#%E0%A4%A");
  await expect(page.locator("#hero h1")).toBeVisible();
});

test("after gliding to Visit and scrolling away, a resize does not snap back", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("load");
  await page.click('[data-nav="visit"]');
  await expect(page.locator("#visit h2")).toBeInViewport({ timeout: 5000 });
  await page.waitForTimeout(1500);
  // Scroll away without wheel/touch/key/pointer input, as back/forward restoration or a scrollbar drag can.
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(500);
  await page.setViewportSize({ width: 1100, height: 760 });
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(3000);
});

test("keyboard: after following the Visit link, Tab moves to controls inside Visit", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("load");
  await page.focus('[data-nav="visit"]');
  await page.keyboard.press("Enter");
  await expect(page.locator("#visit h2")).toBeInViewport({ timeout: 5000 });
  await page.waitForTimeout(1500);
  await page.keyboard.press("Tab");
  const inVisit = await page.evaluate(() => !!document.activeElement?.closest("#visit"));
  expect(inVisit).toBe(true);
  await expect(page.locator(":focus")).toBeInViewport();
});
