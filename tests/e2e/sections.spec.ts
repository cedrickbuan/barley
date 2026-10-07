import { expect, test } from "@playwright/test";
import { hero, showcase, story } from "../../content/site";

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

test("showcase renders one figure per slide with caption", async ({ page }) => {
  await page.goto("/");
  const figures = page.locator("#showcase figure");
  await expect(figures).toHaveCount(showcase.length);
  for (const [i, slide] of showcase.entries()) {
    await expect(figures.nth(i).locator("figcaption")).toHaveText(slide.caption);
    await expect(figures.nth(i).locator("img")).toHaveAttribute("alt", slide.image.alt);
  }
});

test("menu lists the four items with prices", async ({ page }) => {
  await page.goto("/");
  const names = await page.locator("#menu [data-menu-item] h3").allTextContents();
  expect(names).toEqual(["Flan", "Chocolate Cookies", "Chocolate Cupcakes", "Gummies"]);
  await expect(page.locator("#menu [data-menu-item]").first()).toContainText("$10.99");
  await expect(page.locator("#menu")).not.toContainText("chololate");
});
