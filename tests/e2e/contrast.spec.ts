import { expect, test } from "@playwright/test";

// The caramel accent is used for small label text; WCAG AA needs 4.5:1 on every background it sits on.
const BACKGROUNDS = { cream: "#fbf6ee", galleryCrustTint: "#f4eadb", card: "#ffffff" };

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("caramel accent text meets WCAG AA on every background", async ({ page }) => {
  await page.goto("/");
  const caramel = (
    await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-caramel"))
  ).trim();
  for (const [name, bg] of Object.entries(BACKGROUNDS)) {
    expect(contrast(caramel, bg), `caramel ${caramel} on ${name} ${bg}`).toBeGreaterThanOrEqual(4.5);
  }
});
