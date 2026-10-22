import { expect, test } from "@playwright/test";

test("palette searches public projects and opens the selected case study", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open command palette" }).click();

  const dialog = page.getByRole("dialog", { name: "Command palette" });
  await expect(dialog.getByText("Projects", { exact: true }).first()).toBeVisible();
  await expect(dialog.getByRole("option", { name: /SureGo/ })).toHaveCount(0);
  await page.getByPlaceholder("Search pages, projects, technologies, actions...").fill("HIS/HMIS");
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/projects\/his-hmis$/);
  await expect(page.getByRole("heading", { level: 1, name: "HIS/HMIS" })).toBeVisible();
});

test("palette changes theme and copies the public email with feedback", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: "Open command palette" }).click();

  const dialog = page.getByRole("dialog", { name: "Command palette" });
  const search = page.getByPlaceholder("Search pages, projects, technologies, actions...");
  await search.fill("toggle theme");
  await dialog.getByRole("option", { name: /Toggle theme/ }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.keyboard.press("Control+k");
  await search.fill("copy email");
  await dialog.getByRole("option", { name: /Copy email/ }).click();
  await expect(dialog.getByRole("status")).toHaveText("Email copied to clipboard.");
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe("vivekthakur7042@gmail.com");
});

test("technology results open the corresponding skills category", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open command palette" }).click();
  await page.getByPlaceholder("Search pages, projects, technologies, actions...").fill("React");
  await page.getByRole("option", { name: "React Frontend" }).click();

  await expect(page).toHaveURL(/\/skills\?category=frontend$/);
  await expect(page.getByRole("heading", { level: 1, name: "Skills" })).toBeVisible();
});

test("palette exposes the existing local resume PDF", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    Object.defineProperty(window, "open", {
      configurable: true,
      value: (url: string) => {
        window.sessionStorage.setItem("opened-resume-url", url);
        return null;
      },
    });
  });
  await page.getByRole("button", { name: "Open command palette" }).click();
  await page.getByPlaceholder("Search pages, projects, technologies, actions...").fill("resume");

  const resumeAction = page.getByRole("option", { name: "Open resume" });
  await expect(resumeAction).toBeVisible();
  await resumeAction.click();
  await expect(page.getByRole("dialog", { name: "Command palette" })).not.toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.sessionStorage.getItem("opened-resume-url")))
    .toBe("/resume/vivek_Thakur_Resume.pdf");
});

test("reduced motion skips page entry animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const transition = page.locator("[data-page-transition]");
  await expect(transition).toHaveAttribute("data-reduced-motion", "true");
  await expect(transition).toHaveCSS("opacity", "1");
});
