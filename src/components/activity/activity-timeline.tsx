"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Filter, X } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { latestYearMonth, yearsRepresented } from "@/lib/activity";
import { formatMonthYear } from "@/lib/dates";

type ActivityProject = { slug: string; title: string };
type ActivityMilestone = {
  id: string;
  date: string;
  dateLabel: string;
  year: string;
  title: string;
  description: string;
  project?: ActivityProject;
  placeholder: boolean;
};

type ActivityTimelineProps = {
  milestones: ActivityMilestone[];
  projects: ActivityProject[];
};

export function ActivityTimeline({ milestones, projects }: ActivityTimelineProps) {
  const [projectFilter, setProjectFilter] = useState("");
  const milestoneCountByProject = new Map(
    projects.map((project) => [
      project.slug,
      milestones.filter((milestone) => milestone.project?.slug === project.slug).length,
    ]),
  );
  const visibleMilestones = useMemo(
    () =>
      milestones.filter((milestone) => !projectFilter || milestone.project?.slug === projectFilter),
    [milestones, projectFilter],
  );
  const groups = useMemo(() => {
    const grouped = new Map<string, ActivityMilestone[]>();

    for (const milestone of visibleMilestones) {
      const group = grouped.get(milestone.year) ?? [];
      group.push(milestone);
      grouped.set(milestone.year, group);
    }

    return [...grouped.entries()]
      .map(
        ([year, entries]) =>
          [year, entries.sort((left, right) => right.date.localeCompare(left.date))] as const,
      )
      .sort(([left], [right]) => {
        if (left === "Needs confirmation") return 1;
        if (right === "Needs confirmation") return -1;
        return right.localeCompare(left);
      });
  }, [visibleMilestones]);
  const selectedProject = projects.find((project) => project.slug === projectFilter);
  const verifiedMilestones = visibleMilestones.filter((milestone) => !milestone.placeholder);
  const verifiedDates = verifiedMilestones.map((milestone) => milestone.date);
  const latestDate = latestYearMonth(verifiedDates);
  const hasLinkedMilestones = milestones.some((milestone) => milestone.project);

  return (
    <div className="space-y-10 pb-12 sm:space-y-12" data-activity-timeline>
      <header className="grid gap-8 border-b border-border pb-8 xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-end">
        <div className="max-w-3xl">
          <p className="type-label text-primary">Milestone ledger / 11</p>
          <h1 className="type-page-title mt-3">Activity</h1>
          <p className="type-section-title mt-4 text-foreground">Selected engineering milestones</p>
          <p className="type-body mt-2 max-w-2xl text-muted-foreground">
            A dated record of verified employment and project milestones. This view does not
            represent GitHub contributions or daily activity.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="min-w-0 px-4 py-4">
              <p className="type-meta text-muted-foreground">Verified milestones</p>
              <p
                className="mt-2 type-metric text-[2rem] text-foreground"
                data-testid="activity-result-count"
              >
                {verifiedMilestones.length}
              </p>
            </div>
            <div className="min-w-0 px-4 py-4">
              <p className="type-meta text-muted-foreground">Years represented</p>
              <p className="mt-2 type-metric text-[2rem] text-foreground">
                {yearsRepresented(verifiedDates)}
              </p>
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-t border-border px-4 py-3">
            <p className="type-meta text-muted-foreground">Latest entry</p>
            <p className="type-meta text-foreground">
              {latestDate ? formatMonthYear(latestDate) : "—"}
            </p>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="activity-filter-title"
        className="flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6"
      >
        <div className="min-w-0">
          <h2 id="activity-filter-title" className="type-label text-muted-foreground">
            Project context
          </h2>
          <p id="activity-filter-help" className="mt-1.5 max-w-xl type-helper text-muted-foreground">
            Only milestones explicitly linked to a project appear in its filtered view.
            {hasLinkedMilestones
              ? ""
              : " No milestones are linked to a project yet, so every project view is currently empty."}
          </p>
        </div>
        <div className="relative w-full shrink-0 sm:w-72">
          <Filter
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <select
            aria-describedby="activity-filter-help"
            aria-label="Filter milestones by project"
            className="h-11 w-full appearance-none rounded-md border border-input bg-background px-10 pr-9 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            onChange={(event) => setProjectFilter(event.currentTarget.value)}
            value={projectFilter}
          >
            <option value="">All milestones</option>
            {projects.map((project) => (
              <option key={project.slug} value={project.slug}>
                {project.title} · {milestoneCountByProject.get(project.slug) ?? 0} linked
              </option>
            ))}
          </select>
          {projectFilter ? (
            <button
              aria-label="Clear project filter"
              className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setProjectFilter("")}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </div>
      </section>

      {groups.length ? (
        <div className="space-y-10 sm:space-y-12">
          {groups.map(([year, entries]) => (
            <section
              key={year}
              aria-labelledby={`activity-year-${year.replaceAll(" ", "-")}`}
              className="grid gap-4 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-8"
            >
              <div className="md:sticky md:top-20 md:self-start">
                <p className="type-label text-primary">Timeline / Year</p>
                <h2
                  id={`activity-year-${year.replaceAll(" ", "-")}`}
                  className="mt-1 font-mono text-3xl font-medium tracking-tight text-foreground sm:text-4xl"
                >
                  {year}
                </h2>
                <p className="mt-2 type-meta text-muted-foreground">
                  {entries.filter((entry) => !entry.placeholder).length}{" "}
                  {entries.length === 1 ? "milestone" : "milestones"}
                </p>
              </div>

              <ol className="divide-y divide-border border-y border-border">
                {entries.map((milestone) => (
                  <li
                    key={milestone.id}
                    className="min-w-0 transition-colors hover:bg-muted/30"
                  >
                    <div className="grid gap-2 py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6 sm:py-5">
                      <time
                        dateTime={milestone.date || undefined}
                        className="inline-flex items-start gap-1.5 type-meta text-muted-foreground"
                      >
                        <CalendarDays aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                        {milestone.dateLabel}
                      </time>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <h3 className="type-card-title">{milestone.title}</h3>
                          {milestone.placeholder ? <StatusBadge status="placeholder" /> : null}
                        </div>
                        <p className="mt-1.5 max-w-2xl type-helper text-muted-foreground">
                          {milestone.description}
                        </p>
                        {milestone.project ? (
                          <Link
                            href={`/projects/${milestone.project.slug}`}
                            className="mt-3 inline-flex min-h-9 items-center gap-1 rounded-md border border-border px-2.5 type-meta text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {milestone.project.title}
                            <ArrowUpRight aria-hidden="true" className="size-3" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
          <CalendarDays aria-hidden="true" className="mx-auto size-5 text-muted-foreground" />
          <h2 className="mt-3 type-card-title">
            {selectedProject
              ? `No milestones linked to ${selectedProject.title} yet`
              : "No verified milestones yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-lg type-helper text-muted-foreground">
            Project work appears here only when a verified milestone includes that project
            association.
          </p>
          {selectedProject ? (
            <button
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-primary hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setProjectFilter("")}
              type="button"
            >
              Show all milestones <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </div>
      )}

      <div className="grid gap-5 border-t border-border pt-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="type-label text-muted-foreground">How to read this ledger</p>
          <p className="mt-2 max-w-2xl type-helper text-muted-foreground">
            Dates and project associations appear only when recorded in verified milestone data.
            Nothing here is inferred from other activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/experience"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border px-3 type-helper text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Career record
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border px-3 type-helper text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Selected projects
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
