import { test } from "@playwright/test";
import { expectSectionHeadingsVisible } from "./helpers";

test.use({ javaScriptEnabled: false });

test("without JavaScript all sections visible", async ({ page }) => {
  await page.goto("/");
  await expectSectionHeadingsVisible(page);
});
