import type { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";
import { getPublicProjects } from "@/lib/chart-data";
import { getAbsoluteSiteUrl } from "@/lib/site-url";

const publicPagePaths = [
  "/",
  "/projects",
  "/skills",
  "/experience",
  "/activity",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const publicProjectPaths = getPublicProjects(PROJECTS).map(
    (project) => `/projects/${project.slug}`,
  );

  return [...publicPagePaths, ...publicProjectPaths].flatMap((path) => {
    const url = getAbsoluteSiteUrl(path);
    return url ? [{ url }] : [];
  });
}
