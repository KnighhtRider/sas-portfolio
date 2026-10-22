import type { Metadata } from "next";
import { ActivityTimeline } from "@/components/activity/activity-timeline";
import { PageContainer } from "@/components/layout/page-container";
import { MILESTONES } from "@/data/activity";
import { PROJECTS } from "@/data/projects";
import { formatMonthYear, isYearMonth } from "@/lib/dates";
import { getPublicProjects } from "@/lib/chart-data";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Activity",
  description:
    "Selected engineering milestones connected to public projects, with dates included where verified.",
  path: "/activity",
});

const projects = getPublicProjects(PROJECTS).map(({ slug, title }) => ({ slug, title }));
const publicProjectSlugs = new Set(projects.map((project) => project.slug));

export default function ActivityPage() {
  const milestones = MILESTONES.flatMap((milestone) => {
    const project =
      milestone.projectSlug && publicProjectSlugs.has(milestone.projectSlug)
        ? projects.find((item) => item.slug === milestone.projectSlug)
        : undefined;

    if (milestone.status === "verified" && isYearMonth(milestone.date)) {
      return [
        {
          id: milestone.id,
          date: milestone.date,
          dateLabel: formatMonthYear(milestone.date),
          year: milestone.date.slice(0, 4),
          title: milestone.title,
          description: milestone.description,
          project,
          placeholder: false,
        },
      ];
    }

    if (process.env.NODE_ENV !== "production") {
      return [
        {
          id: milestone.id,
          date: "",
          dateLabel: "Date needs confirmation",
          year: "Needs confirmation",
          title: milestone.title,
          description: milestone.description,
          project,
          placeholder: true,
        },
      ];
    }

    return [];
  });

  return (
    <PageContainer>
      <ActivityTimeline milestones={milestones} projects={projects} />
    </PageContainer>
  );
}
