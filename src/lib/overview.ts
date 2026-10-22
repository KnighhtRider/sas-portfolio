import type { Experience, Milestone, Project, Technology } from "@/data/types";
import { EXPERIENCES } from "@/data/experience";
import { MILESTONES } from "@/data/activity";
import { PROJECTS } from "@/data/projects";
import { TECHNOLOGIES } from "@/data/technologies";
import { getPublicProjects, featuredProjects } from "@/lib/chart-data";
import { formatDuration, formatMonthYear } from "@/lib/dates";
import {
  countTechnologyCategories,
  experienceDuration,
  totalExperienceMonths,
  verifiedExperiences,
} from "@/lib/metrics";
import { PROJECT_CATEGORY_LABELS } from "@/lib/project-categories";

export type OverviewMetric = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  helper: string;
};

function countValue(count: number, hasData: boolean) {
  return hasData ? String(count) : "—";
}

export function getOverviewMetrics(
  experiences: Experience[] = EXPERIENCES,
  projects: Project[] = PROJECTS,
  technologies: Technology[] = TECHNOLOGIES,
  milestones: Milestone[] = MILESTONES,
): OverviewMetric[] {
  const verifiedExperience = verifiedExperiences(experiences);
  const duration = experienceDuration(experiences);
  const hasExperience = verifiedExperience.length > 0 && duration.months > 0;
  const publicProjects = getPublicProjects(projects);
  const hasPublicProjects = publicProjects.length > 0;
  const categoryCount = countTechnologyCategories(technologies);
  const verifiedMilestones = milestones.filter((milestone) => milestone.status === "verified");
  const hasMilestones = verifiedMilestones.length > 0;

  return [
    {
      id: "experience",
      label: "Verified experience",
      value: countValue(duration.months, hasExperience),
      unit: hasExperience ? "months" : undefined,
      helper: hasExperience
        ? `${duration.label} · as of ${formatMonthYear(duration.asOf)}`
        : "No verified experience data.",
    },
    {
      id: "projects",
      label: "Selected projects",
      value: countValue(publicProjects.length, hasPublicProjects),
      unit: hasPublicProjects ? "projects" : undefined,
      helper: hasPublicProjects ? "Public, verified dossiers." : "No verified public projects.",
    },
    {
      id: "categories",
      label: "Technology areas",
      value: countValue(categoryCount, technologies.length > 0),
      unit: technologies.length > 0 ? "categories" : undefined,
      helper:
        technologies.length > 0
          ? `${technologies.length} technologies tracked.`
          : "No verified technology data.",
    },
    {
      id: "highlights",
      label: "Highlights",
      value: countValue(verifiedMilestones.length, hasMilestones),
      unit: hasMilestones ? "milestones" : undefined,
      helper: hasMilestones ? "Verified employment events." : "No verified milestones yet.",
    },
  ];
}

export type FeaturedProjectCard = {
  slug: string;
  title: string;
  category: Project["category"];
  categoryLabel: string;
  summary: string;
  status: Project["status"];
  contribution: string[];
  technologies: string[];
  additionalTechnologyCount: number;
  cover?: Project["cover"];
  href: string;
};

export function getFeaturedProjectCards(
  projects: Project[] = PROJECTS,
  technologies: Technology[] = TECHNOLOGIES,
): FeaturedProjectCard[] {
  const technologyNames = new Map(
    technologies.map((technology) => [technology.id, technology.name]),
  );

  return featuredProjects(projects).map((project) => {
    const names = project.techIds
      .map((techId) => technologyNames.get(techId))
      .filter((name): name is string => Boolean(name));

    return {
      slug: project.slug,
      title: project.title,
      category: project.category,
      categoryLabel: PROJECT_CATEGORY_LABELS[project.category],
      summary: project.summary,
      status: project.status,
      contribution: project.contribution.slice(0, 2),
      technologies: names.slice(0, 5),
      additionalTechnologyCount: Math.max(names.length - 5, 0),
      cover: project.cover,
      href: `/projects/${project.slug}`,
    };
  });
}

export type ExperiencePreview = {
  id: string;
  employer: string;
  title: string;
  summary: string;
  period: string;
  durationLabel: string;
  current: boolean;
};

export function getExperiencePreview(experiences: Experience[] = EXPERIENCES): ExperiencePreview[] {
  return verifiedExperiences(experiences)
    .slice()
    .sort((a, b) => b.start.localeCompare(a.start))
    .map((experience) => ({
      id: experience.id,
      employer: experience.employer,
      title: experience.title,
      summary: experience.summary,
      period: `${formatMonthYear(experience.start)} – ${
        experience.end ? formatMonthYear(experience.end) : "Present"
      }`,
      durationLabel: formatDuration(totalExperienceMonths([experience])),
      current: !experience.end,
    }));
}

export type OverviewMilestone = {
  id: string;
  dateLabel: string;
  title: string;
  description: string;
  projectSlug?: string;
};

export function getRecentMilestones(milestones: Milestone[] = MILESTONES): OverviewMilestone[] {
  return milestones
    .filter((milestone) => milestone.status === "verified")
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((milestone) => ({
      id: milestone.id,
      dateLabel: formatMonthYear(milestone.date),
      title: milestone.title,
      description: milestone.description,
      projectSlug: milestone.projectSlug,
    }));
}
