import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/projects",
  "/projects?q=qa-no-matches",
  "/projects/his-hmis",
  "/projects/centralized-blog-cms",
  "/projects/surynova-solar-website",
  "/projects/alaknanda-metro-advertising-platform",
  "/projects/real-estate-lead-generation-landing-page",
  "/projects/react-streaming-ui-clone",
  "/skills",
  "/experience",
  "/activity",
  "/about",
  "/contact",
  "/design",
  "/missing-route",
] as const;

const viewportWidths = [320, 360, 375, 390, 430, 640, 768, 1024, 1280, 1440, 1536, 1600];

test("every route passes axe in light and dark themes", async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const route of routes) {
    for (const theme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(route);
      await expect(page.locator("main#main-content")).toBeVisible();
      await expect(page.locator("html")).toHaveClass(new RegExp(theme));
      await expect(page.locator("[data-page-transition]")).toHaveCSS("opacity", "1");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const violations = results.violations.map(({ id, impact, nodes }) => ({
        id,
        impact,
        targets: nodes.map(({ target }) => target),
      }));
      expect(violations, `${route} has axe violations in ${theme}`).toEqual([]);
    }
  }
});

test("every route fits the planned responsive viewport matrix", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const route of routes) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(route);

    for (const width of viewportWidths) {
      await page.setViewportSize({ width, height: 900 });
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), {
          message: `${route} should not overflow at ${width}px`,
        })
        .toBeLessThanOrEqual(1);
    }
  }
});
