import { expect, test } from "@playwright/test";

const routeTitles = [
  { path: "/", title: "Vivek Thakur — Full-Stack Developer" },
  { path: "/projects", title: "Projects | Vivek Thakur" },
  { path: "/skills", title: "Skills & Technologies | Vivek Thakur" },
  { path: "/experience", title: "Experience | Vivek Thakur" },
  { path: "/activity", title: "Activity | Vivek Thakur" },
  { path: "/about", title: "About | Vivek Thakur" },
  { path: "/contact", title: "Contact | Vivek Thakur" },
  { path: "/projects/his-hmis", title: "HIS/HMIS Case Study | Vivek Thakur" },
  {
    path: "/projects/centralized-blog-cms",
    title: "Centralized Blog CMS Case Study | Vivek Thakur",
  },
  {
    path: "/projects/surynova-solar-website",
    title: "Surynova Solar Website Case Study | Vivek Thakur",
  },
  {
    path: "/projects/alaknanda-metro-advertising-platform",
    title: "Alaknanda Metro Advertising Platform Case Study | Vivek Thakur",
  },
  {
    path: "/projects/real-estate-lead-generation-landing-page",
    title: "Real Estate Lead Generation Landing Page Case Study | Vivek Thakur",
  },
  {
    path: "/projects/react-streaming-ui-clone",
    title: "React Streaming UI Clone Case Study | Vivek Thakur",
  },
];

test("public routes have unique titles and useful descriptions", async ({ page }) => {
  const titles = new Set<string>();

  for (const route of routeTitles) {
    await page.goto(route.path);
    await expect(page).toHaveTitle(route.title);

    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.trim().length ?? 0).toBeGreaterThan(40);
    expect(titles.has(route.title)).toBe(false);
    titles.add(route.title);
  }
});

test("home and project pages expose generated share images and Person JSON-LD", async ({
  page,
}) => {
  for (const path of ["/", "/projects/his-hmis"]) {
    await page.goto(path);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(1);

    const imagePath = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(imagePath).toBeTruthy();
    const imageResponse = await page.request.get(new URL(imagePath ?? "", page.url()).toString());
    expect(imageResponse.ok()).toBe(true);
    expect(imageResponse.headers()["content-type"]).toContain("image/png");
  }

  await page.goto("/");
  const jsonLdText = await page.locator('script[type="application/ld+json"]').textContent();
  const person = JSON.parse(jsonLdText ?? "{}") as {
    "@context"?: string;
    "@type"?: string;
    name?: string;
    sameAs?: string[];
  };

  expect(person).toMatchObject({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Vivek Thakur",
    sameAs: ["https://github.com/KnighhtRider", "https://www.linkedin.com/in/vivekthakurr/"],
  });
});

test("robots and sitemap endpoints load without listing hidden projects", async ({ request }) => {
  for (const iconPath of ["/icon", "/apple-icon"]) {
    const iconResponse = await request.get(iconPath);
    expect(iconResponse.ok()).toBe(true);
    expect(iconResponse.headers()["content-type"]).toContain("image/png");
  }

  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.ok()).toBe(true);
  expect(await robotsResponse.text()).toContain("User-Agent: *");

  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBe(true);
  const sitemap = await sitemapResponse.text();
  expect(sitemap).toContain("<urlset");
  expect(sitemap.toLowerCase()).not.toContain("surego");
  expect(sitemap.toLowerCase()).not.toContain("/design");
});
