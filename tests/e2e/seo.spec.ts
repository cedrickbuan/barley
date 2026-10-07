import { expect, test } from "@playwright/test";
import { business } from "../../content/site";

test("page has description, Open Graph image and Bakery structured data", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /.+/);
  const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(data["@type"]).toBe("Bakery");
  expect(data.telephone).toBe("+1-773-222-3333");
  expect(data.address.postalCode).toBe("60608");
  expect(data.openingHoursSpecification).toHaveLength(business.hours.length);
});
