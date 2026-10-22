import { expect, test } from "@playwright/test";

test("HIS/HMIS case study presents verified role, contributions, stack, and illustrative cover", async ({
  page,
}) => {
  await page.goto("/projects/his-hmis");

  await expect(page).toHaveTitle("HIS/HMIS | Vivek Thakur");
  await expect(page.getByRole("heading", { level: 1, name: "HIS/HMIS" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "My contribution" })).toBeVisible();
  await expect(page.getByText("Full-Stack Developer at ACGIL", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Implemented lazy loading and code splitting in the application."),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Illustrative HIS\/HMIS dashboard concept/ }),
  ).toBeVisible();
  await expect(page.getByText("Illustrative UI", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Project gallery" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Next project Centralized Blog CMS/ })).toBeVisible();
});

test("Centralized Blog CMS case study has project-specific metadata and conditional sections", async ({
  page,
}) => {
  await page.goto("/projects/centralized-blog-cms");

  await expect(page).toHaveTitle("Centralized Blog CMS | Vivek Thakur");
  await expect(page.getByRole("heading", { level: 1, name: "Centralized Blog CMS" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Project features" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Engineering decisions" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Performance and architecture" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Project links" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Previous project HIS\/HMIS/ })).toBeVisible();
});

test("Surynova Solar case study presents the approved cover and performance notes", async ({
  page,
}) => {
  await page.goto("/projects/surynova-solar-website");

  await expect(page).toHaveTitle("Surynova Solar Website Case Study | Vivek Thakur");
  await expect(
    page.getByRole("heading", { level: 1, name: "Surynova Solar Website" }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Illustrative rooftop solar panel installation/ }),
  ).toBeVisible();
  await expect(page.getByText("Illustrative image", { exact: true })).toBeVisible();
  await expect(page.getByText(/memoization and frontend performance optimization/)).toBeVisible();
  await expect(page.getByText(/Largest Contentful Paint \(LCP\) and Lighthouse audits/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Live project/ })).toHaveAttribute(
    "href",
    "https://suryanova-knighhtriders-projects.vercel.app/",
  );
});

test("Alaknanda Metro case study covers the advertising platform and lead dashboard", async ({
  page,
}) => {
  await page.goto("/projects/alaknanda-metro-advertising-platform");

  await expect(page).toHaveTitle("Alaknanda Metro Advertising Platform Case Study | Vivek Thakur");
  await expect(
    page.getByRole("heading", { level: 1, name: "Alaknanda Metro Advertising Platform" }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: /Alaknanda Metro advertising platform homepage with a metro train hero image/,
    }),
  ).toBeVisible();
  await expect(page.getByText("Lead pipeline dashboard", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Live project", exact: true }),
  ).toHaveAttribute("href", "https://alaknanda-metro.vercel.app/");
});

test("real estate landing page case study presents its lead generation work", async ({ page }) => {
  await page.goto("/projects/real-estate-lead-generation-landing-page");

  await expect(page).toHaveTitle("Real Estate Lead Generation Landing Page Case Study | Vivek Thakur");
  await expect(
    page.getByRole("heading", { level: 1, name: "Real Estate Lead Generation Landing Page" }),
  ).toBeVisible();
  await expect(page.getByText("Multiple lead enquiry forms", { exact: true })).toBeVisible();
  await expect(page.getByText(/PHP for lead form handling/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Live project", exact: true })).toHaveAttribute(
    "href",
    "https://lp-theme.vercel.app/",
  );
});

test("React streaming clone is presented as independent from Netflix", async ({ page }) => {
  await page.goto("/projects/react-streaming-ui-clone");

  await expect(page).toHaveTitle("React Streaming UI Clone Case Study | Vivek Thakur");
  await expect(page.getByRole("heading", { level: 1, name: "React Streaming UI Clone" })).toBeVisible();
  await expect(page.getByText(/not affiliated with Netflix/)).toBeVisible();
  await expect(page.getByText("Independent UI Clone", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Live project", exact: true })).toHaveAttribute(
    "href",
    "https://gilded-rugelach-66b018.netlify.app/",
  );
});

test("hidden and unknown project slugs return 404", async ({ page }) => {
  const hidden = await page.goto("/projects/surego");
  expect(hidden?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "No matching workspace path" })).toBeVisible();

  const unknown = await page.goto("/projects/not-a-project");
  expect(unknown?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "No matching workspace path" })).toBeVisible();
});

test("project explorer titles and case study buttons open the corresponding case study", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.getByRole("link", { name: "Centralized Blog CMS", exact: true }).click();

  await expect(page).toHaveURL(/\/projects\/centralized-blog-cms$/);
  await expect(page.getByRole("heading", { level: 1, name: "Centralized Blog CMS" })).toBeVisible();

  await page.goto("/projects");
  const card = page.locator('[data-project-slug="centralized-blog-cms"]');
  await expect(card.getByRole("link", { name: "Read case study", exact: true })).toBeVisible();
  await card.getByRole("link", { name: "Read case study", exact: true }).click();

  await expect(page).toHaveURL(/\/projects\/centralized-blog-cms$/);
  await expect(page.getByRole("heading", { level: 1, name: "Centralized Blog CMS" })).toBeVisible();
});
