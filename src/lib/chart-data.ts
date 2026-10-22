import { PROJECTS } from "@/data/projects";
import { TECHNOLOGIES, TECHNOLOGY_CATEGORIES } from "@/data/technologies";
import type { CategoryId, Project, Technology, TechnologyUsage } from "@/data/types";

export function getPublicProjects(projects: Project[] = PROJECTS) {
  return projects.filter(
    (project) => project.visibility === "public" && project.status === "verified",
  );
}

export function featuredProjects(projects: Project[] = PROJECTS) {
  return getPublicProjects(projects).filter((project) => project.featured);
}

export function techByCategory(technologies: Technology[] = TECHNOLOGIES) {
  return TECHNOLOGY_CATEGORIES.map((category) => ({
    category: category.id,
    label: category.label,
    count: technologies.filter((technology) => technology.category === category.id).length,
  }));
}

export function projectsPerTech(
  projects: Project[] = PROJECTS,
  technologies: Technology[] = TECHNOLOGIES,
) {
  const publicProjects = getPublicProjects(projects);
  const counts = new Map<string, { count: number; projectSlugs: string[] }>();

  for (const project of publicProjects) {
    for (const techId of new Set(project.techIds)) {
      const current = counts.get(techId) ?? { count: 0, projectSlugs: [] };

      current.count += 1;
      current.projectSlugs.push(project.slug);
      counts.set(techId, current);
    }
  }

  return technologies
    .flatMap((technology) => {
      const entry = counts.get(technology.id);

      if (!entry) {
        return [];
      }

      return [
        {
          techId: technology.id,
          name: technology.name,
          count: entry.count,
          projectSlugs: entry.projectSlugs,
        },
      ];
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export type TechnologyChartData = {
  categories: ReturnType<typeof techByCategory>;
  coverage: (ReturnType<typeof projectsPerTech>[number] & { projectNames: string[] })[];
  publicProjectCount: number;
  technologyCount: number;
};

export function technologyChartData(
  projects: Project[] = PROJECTS,
  technologies: Technology[] = TECHNOLOGIES,
): TechnologyChartData {
  const publicProjects = getPublicProjects(projects);
  const coverage = projectsPerTech(publicProjects, technologies).map((row) => ({
    ...row,
    projectNames: row.projectSlugs.flatMap((slug) => {
      const project = publicProjects.find((item) => item.slug === slug);
      return project ? [project.title] : [];
    }),
  }));

  return {
    categories: techByCategory(technologies),
    coverage,
    publicProjectCount: publicProjects.length,
    technologyCount: technologies.length,
  };
}

export type SkillGroup = {
  category: CategoryId;
  label: string;
  technologies: {
    id: string;
    name: string;
    usage: TechnologyUsage;
    projectCount: number;
  }[];
};

export function groupSkills(
  technologies: Technology[] = TECHNOLOGIES,
  projects: Project[] = PROJECTS,
): SkillGroup[] {
  const publicProjects = getPublicProjects(projects);

  return TECHNOLOGY_CATEGORIES.map((category) => ({
    category: category.id,
    label: category.label,
    technologies: technologies
      .filter((technology) => technology.category === category.id)
      .map((technology) => ({
        id: technology.id,
        name: technology.name,
        usage: technology.usage,
        projectCount: publicProjects.filter((project) => project.techIds.includes(technology.id))
          .length,
      })),
  }));
}
