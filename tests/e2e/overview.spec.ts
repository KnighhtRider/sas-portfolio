import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("overview renders the verified profile, metrics, work, timeline and contact CTA", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Vivek Thakur" })).toBeVisible();

  const hero = page.locator("main#main-content section").first();
  await expect(hero.getByText("Full-Stack Developer", { exact: true }).first()).toBeVisible();
  await expect(
    hero.getByText("Frontend-focused React & Next.js Engineer", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Currently at ACGIL")).toBeVisible();
  await expect(page.getByRole("link", { name: "View resume" })).toHaveAttribute(
    "href",
    "/resume/vivek_Thakur_Resume.pdf",
  );
  await expect(page.getByRole("link", { name: "View resume" })).toHaveAttribute("target", "_blank");

  const summary = page.locator("[data-overview-metrics]");
  await expect(summary.getByText("Verified experience", { exact: true })).toBeVisible();
  await expect(summary.getByText("30", { exact: true })).toBeVisible();
  await expect(summary.getByText("months", { exact: true })).toBeVisible();
  await expect(summary.getByText("2 yr 6 mo · as of Oct 2026", { exact: true })).toBeVisible();
  await expect(summary.getByText("Selected projects", { exact: true })).toBeVisible();
  await expect(summary.getByText("7", { exact: true }).first()).toBeVisible();
  await expect(summary.getByText("Technology areas", { exact: true })).toBeVisible();
  await expect(summary.getByText("5", { exact: true })).toBeVisible();
  await expect(summary.getByText("25 technologies tracked.", { exact: true })).toBeVisible();
  await expect(summary.getByText("Highlights", { exact: true })).toBeVisible();
  await expect(summary.getByText("3", { exact: true })).toBeVisible();

  await expect(page.getByRole("heading", { level: 2, name: "Featured projects" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "HIS/HMIS" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Centralized Blog CMS" })).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "ACGIL Corporate Website" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "Surynova Solar Website" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "Alaknanda Metro Advertising Platform" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "Real Estate Lead Generation Landing Page" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "React Streaming UI Clone" }),
  ).toBeVisible();
  await expect(page.locator("[data-project-cover]")).toHaveCount(7);
  await expect(page.locator("[data-project-cover-fallback]")).toHaveCount(0);
  const hmisCover = page.getByRole("img", { name: /Illustrative HIS\/HMIS dashboard concept/ });
  const cmsCover = page.getByRole("img", { name: /Illustrative CMS dashboard concept/ });
  await expect(hmisCover).toBeVisible();
  await expect(cmsCover).toBeVisible();
  const acgilCover = page.getByRole("img", {
    name: "ACGIL corporate website homepage featuring its manufacturing ERP product.",
  });
  await expect(acgilCover).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Illustrative rooftop solar panel installation/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: /Alaknanda Metro advertising platform homepage with a metro train hero image/,
    }),
  ).toBeVisible();
  const realEstateCover = page.getByRole("img", {
    name: /Real estate campaign landing page showing property details/,
  });
  await expect(realEstateCover).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Fan-made React streaming interface inspired by Netflix/ }),
  ).toBeVisible();
  await expect(page.getByText("Independent UI Clone", { exact: true })).toBeVisible();
  await expect(page.getByText("Illustrative image", { exact: true })).toHaveCount(1);
  await expect
    .poll(() => hmisCover.evaluate((image) => (image as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  await expect
    .poll(() => cmsCover.evaluate((image) => (image as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  await expect
    .poll(() => realEstateCover.evaluate((image) => (image as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  await expect(page.getByText("Illustrative UI", { exact: true })).toHaveCount(2);

  await expect(page.getByRole("heading", { level: 2, name: "Career at a glance" })).toBeVisible();
  await expect(page.getByText("May 2026 – Present", { exact: true })).toBeVisible();
  await expect(page.getByText("May 2024 – Apr 2026", { exact: true })).toBeVisible();
  await expect(page.getByText("6 mo", { exact: true })).toBeVisible();
  await expect(page.getByText("2 yr", { exact: true })).toBeVisible();

  await expect(page.getByRole("heading", { level: 3, name: "Recent milestones" })).toBeVisible();
  await expect(page.getByText("Started at ACGIL", { exact: true })).toBeVisible();
  await expect(page.getByText("Completed role at Digital Rubix", { exact: true })).toBeVisible();
  await expect(page.getByText("Started at Digital Rubix", { exact: true })).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 2, name: "Let's talk about the work." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Email me" })).toHaveAttribute("href", /^mailto:/);
  await expect(page.getByRole("link", { name: "Contact page" })).toHaveAttribute(
    "href",
    "/contact",
  );
});

test("primary overview actions go to the existing project and contact routes", async ({ page }) => {
  await page.goto("/");

  const main = page.locator("main#main-content");

  await expect(main.getByRole("link", { name: "Explore projects" })).toHaveAttribute(
    "href",
    "/projects",
  );
  await expect(main.getByRole("link", { name: "Contact", exact: true }).first()).toHaveAttribute(
    "href",
    "/contact",
  );

  await main.getByRole("link", { name: "Explore projects" }).click();
  await expect(page).toHaveURL(/\/projects$/);

  await page.goto("/");
  await main.getByRole("link", { name: "Contact", exact: true }).first().click();
  await expect(page).toHaveURL(/\/contact$/);
});

test("overview does not render the hidden project", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("SureGo")).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: "Featured projects" }).locator("article"),
  ).toHaveCount(2);
});

test("overview charts disclose truthful counts and equivalent accessible tables", async ({
  page,
}) => {
  await page.goto("/");

  const charts = page.locator("[data-overview-charts]");
  await expect(charts).toHaveAttribute("data-hydrated", "true");
  await expect(charts.getByRole("heading", { name: "Technologies by category" })).toBeVisible();
  await expect(charts.getByText("25 technologies tracked", { exact: true })).toBeVisible();
  await expect(charts.getByRole("heading", { name: "Projects per technology" })).toBeVisible();
  await expect(charts.getByText("Based on 7 selected projects", { exact: true })).toBeVisible();

  await charts.getByRole("button", { name: "View as table" }).first().click();
  const categoryTable = charts
    .locator("#category-chart-table")
    .getByRole("table", { name: "Technologies by category data" });
  await expect(categoryTable).toBeVisible();
  await expect(categoryTable.getByRole("row", { name: "Frontend 7" })).toBeVisible();
  await expect(categoryTable.getByRole("row", { name: "State & Data 2" })).toBeVisible();

  await charts.getByRole("button", { name: "View as table" }).first().click();
  const coverageTable = charts
    .locator("#coverage-chart-table")
    .getByRole("table", { name: "Technology project coverage data" });
  await expect(coverageTable).toBeVisible();
  await expect(
    coverageTable.getByRole("row", { name: /REST APIs 2 .*HIS\/HMIS, Centralized Blog CMS/ }),
  ).toBeVisible();
  await expect(
    coverageTable.getByRole("row", { name: /AWS 1 .*Centralized Blog CMS/ }),
  ).toBeVisible();
  await expect(coverageTable.getByText("SureGo")).toHaveCount(0);
});

test("coverage chart tooltip names the projects behind a bar", async ({ page }) => {
  await page.goto("/");

  const charts = page.locator("[data-overview-charts]");
  await expect(charts).toHaveAttribute("data-hydrated", "true");
  const firstBar = charts.locator('[data-testid="coverage-chart"] .recharts-rectangle').first();
  await expect(firstBar).toBeVisible();
  await firstBar.hover();
  await expect(
    charts
      .getByTestId("coverage-chart")
      .getByText("HIS/HMIS, Centralized Blog CMS", { exact: true }),
  ).toBeVisible();
});

test("category legend links to the matching skills filter and coverage can expand", async ({
  page,
}) => {
  await page.goto("/");

  const charts = page.locator("[data-overview-charts]");
  await charts.getByRole("link", { name: "Frontend 7" }).click();
  await expect(page).toHaveURL(/\/skills\?category=frontend$/);

  await page.goto("/");
  await expect(charts).toHaveAttribute("data-hydrated", "true");
  await charts.getByRole("button", { name: "Show all" }).click();
  await expect(charts.getByRole("button", { name: "Show top 6" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await charts.getByRole("button", { name: "View as table" }).nth(1).click();
  await expect(
    charts
      .locator("#coverage-chart-table")
      .getByRole("table", { name: "Technology project coverage data" })
      .getByRole("row"),
  ).toHaveCount(12);
});

test("overview has no axe violations in light and dark", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(new RegExp(colorScheme));
    await expect(page.locator("[data-page-transition]")).toHaveCSS("opacity", "1");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations, `overview has axe violations in ${colorScheme}`).toEqual([]);
  }
});

test("overview does not overflow horizontally at key widths", async ({ page }) => {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );

    expect(overflow, `overview overflows at ${width}px`).toBeLessThanOrEqual(0);
  }
});
