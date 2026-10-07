import { expect, type Page } from "@playwright/test";

export const CONTENT_SECTIONS = ["hero", "story", "showcase", "menu", "gallery", "visit"] as const;

/** Each content section's main heading is visible and fully opaque once scrolled to. */
export async function expectSectionHeadingsVisible(page: Page) {
  for (const id of CONTENT_SECTIONS) {
    const heading = page.locator(`#${id} :is(h1, h2)`).first();
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
    expect(await heading.evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
  }
}
