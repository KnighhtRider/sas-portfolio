import { expect, test } from "@playwright/test";

test("home page renders inside the app shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Vivek Thakur" })).toBeVisible();
  await expect(page.locator("main#main-content")).toBeVisible();
  await expect(page.getByRole("banner")).toBeVisible();
});
