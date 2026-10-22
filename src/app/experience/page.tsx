import type { Metadata } from "next";
import { ExperienceTimeline } from "@/components/experience/experience-timeline";
import { EXPERIENCES } from "@/data/experience";
import { PROJECTS } from "@/data/projects";
import { TECHNOLOGIES } from "@/data/technologies";
import { formatMonthYear, isYearMonth } from "@/lib/dates";
import { experienceDuration, verifiedExperiences } from "@/lib/metrics";
import { getPublicProjects } from "@/lib/chart-data";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Experience",
  description:
    "Review verified engineering experience, responsibilities, technologies, and related public case studies.",
  path: "/experience",
});

const publicProjects = getPublicProjects(PROJECTS);
const projectBySlug = new Map(publicProjects.map((project) => [project.slug, project]));
const technologyById = new Map(TECHNOLOGIES.map((technology) => [technology.id, technology]));

export default function ExperiencePage() {
  const experiences = verifiedExperiences(EXPERIENCES)
    .slice()
    .sort((left, right) => right.start.localeCompare(left.start))
    .map((experience) => {
      const datesKnown =
        isYearMonth(experience.start) && (!experience.end || isYearMonth(experience.end));

      return {
        id: experience.id,
        employer: experience.employer,
        title: experience.title,
        period: datesKnown
          ? `${formatMonthYear(experience.start)} – ${experience.end ? formatMonthYear(experience.end) : "Present"}`
          : "Dates pending confirmation",
        datesKnown,
        current: !experience.end,
        summary: experience.summary,
        responsibilities: experience.responsibilities,
        technologies: experience.techIds.flatMap((id) => {
          const technology = technologyById.get(id);
          return technology ? [{ id: technology.id, name: technology.name }] : [];
        }),
        projects: experience.projectSlugs.flatMap((slug) => {
          const project = projectBySlug.get(slug);
          return project ? [{ slug: project.slug, title: project.title }] : [];
        }),
      };
    });

  return (
    <ExperienceTimeline experiences={experiences} duration={experienceDuration(EXPERIENCES)} />
  );
}
