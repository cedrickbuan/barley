import { expect, test } from "@playwright/test";
import { business, gallery, hero, showcase, story } from "../../content/site";

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

test("gallery shows every photo", async ({ page }) => {
  await page.goto("/");
  const imgs = page.locator("#gallery img");
  await expect(imgs).toHaveCount(gallery.length);
  for (const [i, photo] of gallery.entries()) await expect(imgs.nth(i)).toHaveAttribute("alt", photo.alt);
});

test("visit shows address, every opening-hours row, map and CTAs", async ({ page }) => {
  await page.goto("/");
  const visit = page.locator("#visit");
  await expect(visit).toContainText("60608");
  await expect(visit.locator("[data-hours-row]")).toHaveCount(business.hours.length);
  const map = visit.locator("iframe");
  await expect(map).toHaveAttribute("src", /^https:\/\/www\.google\.com\/maps\?q=/);
  await expect(map).toHaveAttribute("title", /.+/);
  await expect(visit.locator('[data-cta="call"]')).toHaveCount(1);
  await expect(visit.locator('[data-cta="directions"]')).toHaveCount(1);
});

test("footer shows phone and current year", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("#footer");
  await expect(footer).toContainText(business.phoneDisplay);
  await expect(footer).toContainText(String(new Date().getFullYear()));
});

test("desktop: story heading and image are visible while the section scrolls into view", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop only");
  await page.goto("/");
  await page.waitForLoadState("load");
  // Bring the Story's top edge to the middle of the screen, before it pins.
  await page.evaluate(() => {
    const top = document.querySelector("#story")!.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top - window.innerHeight / 2);
  });
  await page.waitForTimeout(1500);
  for (const sel of ["#story h2", "#story img"]) {
    expect(await page.locator(sel).evaluate((e) => {
      let o = 1;
      for (let n: Element | null = e; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
      return o;
    })).toBeGreaterThan(0.9);
  }
});
