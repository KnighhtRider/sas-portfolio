import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  test(`design gallery has no axe violations in ${theme}`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
    await page.emulateMedia({ colorScheme: theme });
    await page.goto("/_design");
    await expect(page.locator("html")).toHaveClass(new RegExp(theme));
    await expect(page.locator("[data-page-transition]")).toHaveCSS("opacity", "1");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}

test("theme choice persists after reload", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/_design");

  const toggle = page.locator("#main-content").getByTestId("theme-toggle");
  await expect(toggle).toBeEnabled();
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("gallery has no horizontal overflow at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/_design");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );

  expect(overflow).toBeLessThanOrEqual(1);
});

test("keyboard focus exposes a visible ring", async ({ page }) => {
  await page.goto("/_design");
  await page.keyboard.press("Tab");

  const focus = await page.evaluate(() => {
    const active = document.activeElement;

    if (!(active instanceof HTMLElement)) {
      return null;
    }

    const style = getComputedStyle(active);

    return {
      tag: active.tagName,
      label: active.getAttribute("aria-label"),
      outlineStyle: style.outlineStyle,
      boxShadow: style.boxShadow,
    };
  });

  expect(focus).not.toBeNull();
  expect(focus?.outlineStyle !== "none" || focus?.boxShadow !== "none").toBe(true);
});

test("reduced motion removes the entry animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/_design");

  const animationName = await page
    .locator("[data-motion-demo]")
    .evaluate((element) => getComputedStyle(element).animationName);

  expect(animationName).toBe("none");
});
