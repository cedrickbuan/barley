import { expect, test } from "@playwright/test";
import { expectSectionHeadingsVisible } from "./helpers";

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("no smooth scroll, all sections visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
    await expectSectionHeadingsVisible(page);
  });
});

test("smooth scroll active by default", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop only");
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/lenis/);
});
