import { expect, test } from "@playwright/test";

test("about page presents the confirmed profile and verified education without grades", async ({
  page,
}) => {
  await page.goto("/about");

  await expect(page.getByRole("heading", { level: 1, name: "About" })).toBeVisible();
  await expect(
    page.locator("#main-content").getByText("Vivek Thakur", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Education" })).toBeVisible();
  await expect(
    page.getByText("Bachelor of Technology (B.Tech), Computer Science and Engineering"),
  ).toBeVisible();
  await expect(page.getByText("Aryan Institute of Technology")).toBeVisible();
  await expect(page.getByText("Diploma in Computer Engineering")).toBeVisible();
  await expect(page.getByText("Jamia Millia Islamia")).toBeVisible();
  await expect(page.getByText(/7\.6|8\.0/)).toHaveCount(0);
});

test("About page omits profile copy that has not been approved", async ({ page }) => {
  await page.goto("/about");

  await expect(page.getByText("Working philosophy", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Professional direction", { exact: true })).toHaveCount(0);
});

test("contact page uses confirmed email and professional profiles and copies email accessibly", async ({
  page,
}) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/contact");

  const email = "vivekthakur7042@gmail.com";
  await expect(page.getByRole("link", { name: /Write an email/ })).toHaveAttribute(
    "href",
    `mailto:${email}`,
  );
  const contactPage = page.locator("#main-content");
  await expect(contactPage.getByRole("link", { name: /^GitHub/ })).toHaveAttribute(
    "href",
    "https://github.com/KnighhtRider",
  );
  await expect(contactPage.getByRole("link", { name: /^LinkedIn/ })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/vivekthakurr/",
  );

  await page.getByRole("button", { name: "Copy email" }).click();
  await expect(page.getByRole("status")).toHaveText("Email copied to clipboard.");
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(email);
  const resumeHref = "/resume/vivek_Thakur_Resume.pdf";
  await expect(page.getByRole("link", { name: "View resume" })).toHaveAttribute("href", resumeHref);
  await expect(page.getByRole("link", { name: "View resume" })).toHaveAttribute("target", "_blank");
  await expect(page.getByRole("link", { name: "Download PDF" })).toHaveAttribute(
    "href",
    resumeHref,
  );
  await expect(page.getByRole("link", { name: "Download PDF" })).toHaveAttribute("download", "");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: "Download PDF" }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("vivek_Thakur_Resume.pdf");
});

test("About and Contact layouts fit a mobile viewport", async ({ page }) => {
  for (const route of ["/about", "/contact"]) {
    await page.goto(route);
    const dimensions = await page.locator("main").evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  }
});
