import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import { TECHNOLOGIES, TECHNOLOGY_CATEGORIES } from "@/data/technologies";
import type { CommandPaletteData } from "@/components/command/command-types";
import { getAvailableResumeHref } from "@/lib/resume";

export function getCommandPaletteData(): CommandPaletteData {
  const categoryLabels = new Map(TECHNOLOGY_CATEGORIES.map(({ id, label }) => [id, label]));
  const resumeHref = getAvailableResumeHref();

  return {
    projects: PROJECTS.filter(
      (project) => project.visibility === "public" && project.status === "verified",
    ).map(({ slug, title, summary, category }) => ({
      slug,
      title,
      summary,
      category,
    })),
    technologies: TECHNOLOGIES.map(({ id, name, category }) => ({
      id,
      name,
      category,
      categoryLabel: categoryLabels.get(category) ?? "Technology",
    })),
    email: PROFILE.email,
    profileLinks: PROFILE.links
      .filter((link) => link.status === "verified")
      .map(({ id, label, href }) => ({ id, label, href })),
    ...(resumeHref ? { resumeHref } : {}),
  };
}
