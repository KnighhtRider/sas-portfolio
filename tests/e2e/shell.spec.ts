import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  {
    href: "/",
    label: "Overview",
    title: "Overview",
    heading: "Vivek Thakur",
    workspace: "~/overview",
  },
  {
    href: "/projects",
    label: "Projects",
    title: "Projects",
    heading: "Selected work, with context.",
    workspace: "~/projects",
  },
  { href: "/skills", label: "Skills", title: "Skills", heading: "Skills", workspace: "~/skills" },
  {
    href: "/experience",
    label: "Experience",
    title: "Experience",
    heading: "Experience",
    workspace: "~/experience",
  },
  {
    href: "/activity",
    label: "Activity",
    title: "Activity",
    heading: "Activity",
    workspace: "~/activity",
  },
  { href: "/about", label: "About", title: "About", heading: "About", workspace: "~/about" },
  {
    href: "/contact",
    label: "Contact",
    title: "Contact",
    heading: /connect/i,
    workspace: "~/contact",
  },
];

test("every public route loads, refreshes and marks the active nav item", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const route of routes) {
    await page.goto(route.href);
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();

    const sidebar = page.locator("[data-sidebar-shell]");
    await expect(sidebar.getByRole("link", { name: route.label, exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(
      page.getByRole("banner").getByText(route.workspace, { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("banner").getByText(route.title, { exact: true })).toBeVisible();
    await expect(page.locator("footer").getByText(route.workspace, { exact: true })).toBeVisible();
  }
});

test("sidebar collapse persists after refresh without server state", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const shell = page.locator("[data-sidebar-shell]");
  await expect(shell).toHaveCSS("width", "264px");

  await page.getByRole("button", { name: "Collapse sidebar" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-sidebar", "collapsed");
  await expect(shell).toHaveCSS("width", "72px");
  await expect
    .poll(() => page.evaluate(() => document.cookie))
    .toContain("sidebar_state=collapsed");

  await shell.getByRole("link", { name: "Projects", exact: true }).hover();
  await expect(page.getByRole("tooltip")).toHaveText("Projects");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-sidebar", "collapsed");
  await expect(shell).toHaveCSS("width", "72px");
  await expect(page.getByRole("button", { name: "Expand sidebar" })).toBeVisible();

  await page.getByRole("button", { name: "Expand sidebar" }).click();
  await expect(shell).toHaveCSS("width", "264px");
});

test("mobile drawer opens, traps navigation, closes on Escape and restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();

  const drawer = page.getByRole("dialog", { name: "Navigation" });
  await expect(drawer).toBeVisible();

  const projectLink = drawer.getByRole("link", { name: "Projects", exact: true });
  const box = await projectLink.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await drawer.getByRole("link", { name: "Skills", exact: true }).click();
  await expect(page).toHaveURL(/\/skills$/);
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Skills" })).toBeVisible();
});

test("command palette navigates and returns focus to its trigger", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open command palette" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Command palette" });
  await expect(dialog).toBeVisible();
  expect(await page.getByRole("option").count()).toBeGreaterThanOrEqual(routes.length);

  await page.getByPlaceholder("Search pages, projects, technologies, actions...").fill("skills");
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/skills$/);
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Skills" })).toBeVisible();

  await page.keyboard.press("Control+k");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("unknown URLs show the custom 404", async ({ page }) => {
  await page.goto("/missing-route");

  await expect(
    page.getByRole("heading", { level: 1, name: "No matching workspace path" }),
  ).toBeVisible();
  await expect(page.locator("header").getByText("Not found", { exact: true })).toBeVisible();
});

test("shell has no axe violations in light and dark", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    await page.goto("/projects");
    await expect(page.locator("html")).toHaveClass(new RegExp(colorScheme));
    await expect(page.locator("[data-page-transition]")).toHaveCSS("opacity", "1");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  }
});

test("shell has no horizontal overflow at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });

  for (const route of routes) {
    await page.goto(route.href);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );

    expect(overflow, `${route.href} overflows horizontally`).toBeLessThanOrEqual(1);
  }
});
