import { expect, test } from "@playwright/test";
import { hero, story } from "../../content/site";

test("hero shows headline, image and CTAs", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#hero h1")).toHaveText(hero.headline);
  const img = page.locator("#hero img");
  await expect(img).toHaveAttribute("alt", hero.image.alt);
  await expect(page.locator('#hero [data-cta="call"]')).toBeVisible();
  await expect(page.locator('#hero [data-cta="directions"]')).toBeVisible();
});

test("story shows heading, all paragraphs and image", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#story h2")).toHaveText(story.heading);
  await expect(page.locator("#story p")).toHaveCount(story.paragraphs.length);
  const img = page.locator("#story img");
  await img.scrollIntoViewIfNeeded();
  await expect(img).toBeVisible();
  await expect(img).toHaveAttribute("alt", story.image.alt);
});
