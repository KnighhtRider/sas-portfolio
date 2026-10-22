import { expect, test } from "@playwright/test";

test("experience page presents verified roles newest first with derived duration", async ({
  page,
}) => {
  await page.goto("/experience");

  await expect(page.getByRole("heading", { level: 1, name: "Experience" })).toBeVisible();
  await expect(page.getByTestId("experience-duration")).toHaveText("2 yr 6 mo");

  const roles = page
    .getByRole("list", { name: "Professional experience, newest first" })
    .locator(":scope > li");
  await expect(roles).toHaveCount(2);
  await expect(roles.nth(0)).toContainText("ACGIL");
  await expect(roles.nth(0)).toContainText("May 2026 – Present");
  await expect(roles.nth(1)).toContainText("Digital Rubix");
  await expect(roles.nth(1)).toContainText("May 2024 – Apr 2026");
});

test("experience entries link only to available public case studies and list their technologies", async ({
  page,
}) => {
  await page.goto("/experience");

  const roles = page
    .getByRole("list", { name: "Professional experience, newest first" })
    .locator(":scope > li");
  await expect(roles.nth(0).getByRole("link", { name: "HIS/HMIS" })).toHaveAttribute(
    "href",
    "/projects/his-hmis",
  );
  await expect(roles.nth(0).getByText("React", { exact: true })).toBeVisible();
  await expect(
    roles.nth(1).getByRole("link", { name: "Real Estate Lead Generation Landing Page" }),
  ).toHaveAttribute("href", "/projects/real-estate-lead-generation-landing-page");
  await expect(page.getByText("30+ responsive React landing page themes.")).toBeVisible();
});

test("experience timeline stays within the mobile viewport", async ({ page }) => {
  await page.goto("/experience");

  const timeline = page.getByRole("list", { name: "Professional experience, newest first" });
  const dimensions = await timeline.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});
