import { expect, test } from "@playwright/test";
import { hero } from "../../content/site";

test("hero shows headline, image and CTAs", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#hero h1")).toHaveText(hero.headline);
  const img = page.locator("#hero img");
  await expect(img).toHaveAttribute("alt", hero.image.alt);
  await expect(page.locator('#hero [data-cta="call"]')).toBeVisible();
  await expect(page.locator('#hero [data-cta="directions"]')).toBeVisible();
});
