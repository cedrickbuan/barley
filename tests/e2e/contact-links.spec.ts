import { expect, test } from "@playwright/test";

test("every Call link dials the bakery", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator('[data-cta="call"]').evaluateAll((a) => a.map((x) => x.getAttribute("href")));
  expect(hrefs.length).toBeGreaterThan(0);
  expect(new Set(hrefs)).toEqual(new Set(["tel:+17732223333"]));
});

test("every Directions link targets Google Maps for Chicago 60608", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator('[data-cta="directions"]').evaluateAll((a) => a.map((x) => x.getAttribute("href")));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    expect(href).toMatch(/^https:\/\/www\.google\.com\/maps\/dir\//);
    expect(href).toContain("60608");
  }
});
