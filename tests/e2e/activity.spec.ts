import { expect, test } from "@playwright/test";

test("activity presents verified milestones in descending date order grouped by year", async ({
  page,
}) => {
  await page.goto("/activity");

  await expect(page.getByRole("heading", { level: 1, name: "Activity" })).toBeVisible();
  await expect(page.getByText("Selected engineering milestones")).toBeVisible();
  await expect(page.getByTestId("activity-result-count")).toHaveText("3");
  await expect(page.locator('h2[id^="activity-year-"]')).toHaveText(["2026", "2024"]);
  await expect(page.getByRole("heading", { name: "Started at ACGIL" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Completed role at Digital Rubix" }),
  ).toBeVisible();
  await expect(page.getByText(/does not represent GitHub contributions/i)).toBeVisible();
});

test("project filtering states when a project has no associated milestones and can be cleared", async ({
  page,
}) => {
  await page.goto("/activity");
  await page
    .getByRole("combobox", { name: "Filter milestones by project" })
    .selectOption("his-hmis");

  await expect(
    page.getByRole("heading", { name: "No milestones linked to HIS/HMIS yet" }),
  ).toBeVisible();
  await expect(page.getByTestId("activity-result-count")).toHaveText("0");
  await page.getByRole("button", { name: "Show all milestones" }).click();

  await expect(page.getByTestId("activity-result-count")).toHaveText("3");
  await expect(page.getByRole("heading", { name: "Started at ACGIL" })).toBeVisible();
});

test("activity timeline fits a mobile viewport", async ({ page }) => {
  await page.goto("/activity");

  const timeline = page.locator("[data-activity-timeline]");
  const dimensions = await timeline.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});
