import { expect, test } from "@playwright/test";

test("skills category is URL-backed and limits the visible technology area", async ({ page }) => {
  await page.goto("/skills?category=frontend");

  await expect(page.getByRole("heading", { level: 1, name: "Skills" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Frontend", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.getByRole("heading", { name: "Frontend", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Backend & API", exact: true })).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole("link", { name: "Frontend", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("technology search filters by name and project with a clearable empty state", async ({
  page,
}) => {
  await page.goto("/skills");
  await page.getByRole("searchbox", { name: "Find a technology" }).fill("centralized blog");

  await expect(page.getByTestId("skill-result-count")).toHaveText("Showing 4 of 25 technologies");
  await expect(
    page.getByRole("heading", { name: "No technologies match that search" }),
  ).toHaveCount(0);

  await page.getByRole("searchbox", { name: "Find a technology" }).fill("nothing-matches");
  await expect(
    page.getByRole("heading", { name: "No technologies match that search" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear technology search" }).click();
  await expect(page.getByTestId("skill-result-count")).toHaveText("Showing 25 of 25 technologies");
});

test("skills distinguish learning use and link only to related public case studies", async ({
  page,
}) => {
  await page.goto("/skills?category=backend-api");

  const laravel = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Laravel" }) });
  await expect(laravel.getByText("Learning", { exact: true })).toBeVisible();
  await expect(laravel.getByText("No selected public project linked yet.")).toBeVisible();

  const restApis = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "REST APIs" }) });
  await expect(restApis.getByRole("link", { name: /HIS\/HMIS/ })).toBeVisible();
  await expect(restApis.getByRole("link", { name: /Centralized Blog CMS/ })).toBeVisible();
  await expect(page.getByText(/counts show project usage, not proficiency/i)).toBeVisible();
});
