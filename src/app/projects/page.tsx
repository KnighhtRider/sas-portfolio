import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { PROJECTS } from "@/data/projects";
import { TECHNOLOGIES } from "@/data/technologies";
import { getPublicProjects } from "@/lib/chart-data";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "Explore selected, verified project case studies in healthcare software and centralized content publishing.",
  path: "/projects",
});

function ProjectExplorerFallback() {
  return (
    <div aria-hidden="true" className="space-y-8" data-projects-loading>
      <div className="h-9 w-64 animate-pulse rounded-md bg-muted" />
      <div className="h-40 animate-pulse rounded-lg border border-border bg-card" />
      <div className="grid gap-5 md:grid-cols-2">
        {["one", "two"].map((item) => (
          <div
            key={item}
            className="h-[440px] animate-pulse rounded-lg border border-border bg-card"
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const projects = getPublicProjects(PROJECTS);
  const usedTechnologyIds = new Set(projects.flatMap((project) => project.techIds));
  const technologies = TECHNOLOGIES.filter((technology) => usedTechnologyIds.has(technology.id));

  return (
    <PageContainer>
      <Suspense fallback={<ProjectExplorerFallback />}>
        <ProjectExplorer projects={projects} technologies={technologies} />
      </Suspense>
    </PageContainer>
  );
}
