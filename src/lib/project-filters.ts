import type { Project, ProjectCategory, Technology } from "@/data/types";
import { PROJECT_CATEGORY_LABELS } from "@/lib/project-categories";

export type ProjectFilters = {
  q: string;
  tech: string;
  category: ProjectCategory | "";
  featured: boolean;
};

export function parseProjectFilters(
  params: Pick<URLSearchParams, "get">,
  technologies: Technology[],
): ProjectFilters {
  const category = params.get("category") ?? "";
  const tech = params.get("tech") ?? "";

  return {
    q: params.get("q") ?? "",
    tech: technologies.some((technology) => technology.id === tech) ? tech : "",
    category: Object.hasOwn(PROJECT_CATEGORY_LABELS, category) ? (category as ProjectCategory) : "",
    featured: params.get("featured") === "true",
  };
}

export function filterProjects(projects: Project[], filters: ProjectFilters): Project[] {
  const search = filters.q.trim().toLocaleLowerCase();

  return projects.filter((project) => {
    if (project.visibility !== "public" || project.status !== "verified") {
      return false;
    }

    if (filters.featured && !project.featured) {
      return false;
    }

    if (filters.tech && !project.techIds.includes(filters.tech)) {
      return false;
    }

    if (filters.category && project.category !== filters.category) {
      return false;
    }

    if (search) {
      const searchableText = [project.title, project.summary, project.problem]
        .join(" ")
        .toLocaleLowerCase();

      if (!searchableText.includes(search)) {
        return false;
      }
    }

    return true;
  });
}
