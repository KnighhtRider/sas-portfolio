import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("project explorer shows only verified public dossiers", async ({ page }) => {
  await page.goto("/projects");

  const explorer = page.locator("[data-project-explorer]");
  await expect(explorer).toHaveAttribute("data-filters-ready", "true");
  await expect(
    explorer.getByRole("heading", { level: 1, name: "Selected work, with context." }),
  ).toBeVisible();
  await expect(explorer.locator("[data-project-slug]")).toHaveCount(7);
  await expect(explorer.getByRole("heading", { name: "HIS/HMIS" })).toBeVisible();
  await expect(explorer.getByRole("heading", { name: "Centralized Blog CMS" })).toBeVisible();
  await expect(explorer.getByRole("heading", { name: "ACGIL Corporate Website" })).toBeVisible();
  await expect(explorer.getByRole("heading", { name: "Surynova Solar Website" })).toBeVisible();
  await expect(
    explorer.getByRole("heading", { name: "Alaknanda Metro Advertising Platform" }),
  ).toBeVisible();
  await expect(
    explorer.getByRole("heading", { name: "Real Estate Lead Generation Landing Page" }),
  ).toBeVisible();
  await expect(explorer.getByRole("heading", { name: "React Streaming UI Clone" })).toBeVisible();
  await expect(explorer.getByText("SureGo")).toHaveCount(0);
  await expect(explorer.getByTestId("project-result-count")).toHaveText("7 / 7 projects");
});

test("search filters project titles and descriptions and updates the URL", async ({ page }) => {
  await page.goto("/projects");

  await expect(page.locator("[data-project-explorer]")).toHaveAttribute(
    "data-filters-ready",
    "true",
  );
  await page.getByLabel("Search", { exact: true }).fill("centralized");
  await expect(page).toHaveURL(/\/projects\?q=centralized$/);
  await expect(page.locator("[data-project-slug]")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Centralized Blog CMS" })).toBeVisible();
  await expect(page.getByTestId("project-result-count")).toHaveText("1 / 7 projects");
});

test("technology and category filters narrow the project list", async ({ page }) => {
  await page.goto("/projects");

  await expect(page.locator("[data-project-explorer]")).toHaveAttribute(
    "data-filters-ready",
    "true",
  );
  await page.getByLabel("Technology", { exact: true }).selectOption("react");
  await expect(page).toHaveURL(/\/projects\?tech=react$/);
  await expect(page.locator("[data-project-slug]")).toHaveCount(1);
  await expect(page.locator('[data-project-slug="his-hmis"]')).toBeVisible();

  await page.getByLabel("Technology", { exact: true }).selectOption("");
  await page.getByLabel("Category", { exact: true }).selectOption("content-platform");
  await expect(page).toHaveURL(/\/projects\?category=content-platform$/);
  await expect(page.locator('[data-project-slug="centralized-blog-cms"]')).toBeVisible();
  await expect(page.locator('[data-project-slug="his-hmis"]')).toHaveCount(0);
});

test("featured toggle is reflected in URL state", async ({ page }) => {
  await page.goto("/projects");

  await expect(page.locator("[data-project-explorer]")).toHaveAttribute(
    "data-filters-ready",
    "true",
  );
  await page.getByRole("button", { name: "Featured only" }).click();
  await expect(page).toHaveURL(/\/projects\?featured=true$/);
  await expect(page.getByRole("button", { name: "Featured only" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByTestId("project-result-count")).toHaveText("7 / 7 projects");
});

test("combined filters restore from the URL after refresh", async ({ page }) => {
  await page.goto("/projects");

  await expect(page.locator("[data-project-explorer]")).toHaveAttribute(
    "data-filters-ready",
    "true",
  );
  await page.getByLabel("Category", { exact: true }).selectOption("content-platform");
  await page.getByLabel("Technology", { exact: true }).selectOption("nextjs");
  await page.getByLabel("Search", { exact: true }).fill("centralized");
  await page.getByRole("button", { name: "Featured only" }).click();
  await expect(page).toHaveURL(
    /\/projects\?category=content-platform&tech=nextjs&q=centralized&featured=true$/,
  );
  await expect(page.locator("[data-project-slug]")).toHaveCount(1);

  await page.reload();
  await expect(page.locator("[data-project-explorer]")).toHaveAttribute(
    "data-filters-ready",
    "true",
  );
  await expect(page.getByLabel("Category", { exact: true })).toHaveValue("content-platform");
  await expect(page.getByLabel("Technology", { exact: true })).toHaveValue("nextjs");
  await expect(page.getByLabel("Search", { exact: true })).toHaveValue("centralized");
  await expect(page.getByRole("button", { name: "Featured only" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator('[data-project-slug="centralized-blog-cms"]')).toBeVisible();
});

test("empty state explains how to recover and clear all filters", async ({ page }) => {
  await page.goto("/projects?q=does-not-exist&tech=react&category=healthcare&featured=true");

  await expect(page.locator("[data-project-explorer]")).toHaveAttribute(
    "data-filters-ready",
    "true",
  );
  await expect(
    page.getByRole("heading", { name: "No dossiers match those filters" }),
  ).toBeVisible();
  await expect(page.getByTestId("project-result-count")).toHaveText("0 / 7 projects");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator("[data-project-slug]")).toHaveCount(7);
});

test("SureGo stays hidden even when directly searched", async ({ page }) => {
  await page.goto("/projects?q=surego");

  await expect(page.getByText("SureGo")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "No dossiers match those filters" }),
  ).toBeVisible();
});

test("project explorer has no axe violations in light and dark", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    await page.goto("/projects");
    await expect(page.locator("[data-project-explorer]")).toHaveAttribute(
      "data-filters-ready",
      "true",
    );
    await expect(page.locator("html")).toHaveClass(new RegExp(colorScheme));
    await expect(page.locator("[data-page-transition]")).toHaveCSS("opacity", "1");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations, `project explorer has axe violations in ${colorScheme}`).toEqual([]);
  }
});

test("project explorer does not overflow at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/projects");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
