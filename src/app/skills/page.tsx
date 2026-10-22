import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { TechnologyCoverageChart } from "@/components/charts/overview-charts";
import { SkillExplorer } from "@/components/skills/skill-explorer";
import { PROJECTS } from "@/data/projects";
import { TECHNOLOGIES } from "@/data/technologies";
import { getPublicProjects, groupSkills, technologyChartData } from "@/lib/chart-data";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Skills & Technologies",
  description:
    "Browse technologies by area and see their use in verified public projects. Usage counts show project tags, not proficiency.",
  path: "/skills",
});

function SkillsFallback() {
  return (
    <div aria-hidden="true" className="space-y-6" data-skills-loading>
      <div className="h-32 rounded-lg border border-border bg-card" />
      <div className="h-24 rounded-lg border border-border bg-card" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-10">
        <div className="h-16 rounded-md border border-border bg-card" />
        <div className="divide-y divide-border border-y border-border">
          {["one", "two", "three", "four", "five"].map((item) => (
            <div className="h-16" key={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const projects = getPublicProjects(PROJECTS);
  const groups = groupSkills(TECHNOLOGIES, projects).map((group) => ({
    ...group,
    technologies: group.technologies.map((technology) => ({
      ...technology,
      relatedProjects: projects
        .filter((project) => project.techIds.includes(technology.id))
        .map(({ slug, title }) => ({ slug, title })),
    })),
  }));
  const chartData = technologyChartData(projects, TECHNOLOGIES);

  return (
    <PageContainer>
      <div className="space-y-12">
        <Suspense fallback={<SkillsFallback />}>
          <SkillExplorer groups={groups} />
        </Suspense>
        <section
          aria-labelledby="skill-coverage-title"
          className="grid gap-6 border-t border-border pt-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.55fr)] lg:gap-10 lg:pt-12"
        >
          <div>
            <p className="type-label text-muted-foreground">02 / Evidence</p>
            <h2 id="skill-coverage-title" className="type-section mt-2">
              Project usage at a glance
            </h2>
            <p className="type-helper mt-3 max-w-md text-muted-foreground">
              Counts show project usage, not proficiency. Each connection comes from a technology
              tag in a public, verified project record.
            </p>
            <p className="mt-4 type-meta text-muted-foreground">
              Based on {chartData.publicProjectCount} selected projects ·{" "}
              {chartData.coverage.length} of {chartData.technologyCount} technologies have linked
              work
            </p>
          </div>
          <TechnologyCoverageChart data={chartData} />
        </section>
      </div>
    </PageContainer>
  );
}
