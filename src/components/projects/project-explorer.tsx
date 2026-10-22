"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { ArrowUpRight, Check, FolderSearch, Search, SlidersHorizontal, X } from "lucide-react";
import { ProjectCover } from "@/components/projects/project-cover";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PROJECT_CATEGORY_LABELS } from "@/lib/project-categories";
import { filterProjects, parseProjectFilters } from "@/lib/project-filters";
import type { Project, ProjectCategory, Technology } from "@/data/types";
import { cn } from "@/lib/utils";

type ProjectExplorerProps = {
  projects: Project[];
  technologies: Technology[];
};

export function ProjectExplorer({ projects, technologies }: ProjectExplorerProps) {
  const searchParams = useSearchParams();
  const markReady = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.dataset.filtersReady = "true";
    }
  }, []);
  const filters = parseProjectFilters(searchParams, technologies);
  const results = useMemo(() => filterProjects(projects, filters), [projects, filters]);
  const technologyNames = useMemo(
    () => new Map(technologies.map((technology) => [technology.id, technology.name])),
    [technologies],
  );
  const availableCategories = useMemo(() => {
    const ids = new Set(projects.map((project) => project.category));
    return Object.entries(PROJECT_CATEGORY_LABELS).filter(([id]) => ids.has(id as ProjectCategory));
  }, [projects]);

  const setFilter = useCallback((key: "q" | "tech" | "category" | "featured", value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const query = params.toString();
    window.history.replaceState(null, "", query ? `/projects?${query}` : "/projects");
  }, []);

  const clearFilters = useCallback(() => {
    window.history.replaceState(null, "", "/projects");
  }, []);

  const hasFilters = Boolean(filters.q || filters.tech || filters.category || filters.featured);

  return (
    <div className="space-y-8 lg:space-y-10" data-project-explorer ref={markReady}>
      <section
        aria-labelledby="projects-title"
        className="grid gap-8 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end"
      >
        <div className="max-w-3xl">
          <p className="type-label text-muted-foreground">01 / Project index</p>
          <h1 id="projects-title" className="type-page-title mt-3">
            Selected work, with context.
          </h1>
          <p className="type-body mt-4 max-w-2xl text-muted-foreground">
            Browse verified project dossiers by the problem, technology, and contribution. Each
            entry describes work grounded in the current portfolio record.
          </p>
        </div>

        <aside className="border-l-2 border-primary pl-4" aria-label="Collection note">
          <p className="type-label text-muted-foreground">Current collection</p>
          <p className="mt-2 font-mono text-3xl font-medium tabular-nums tracking-tight">
            {String(projects.length).padStart(2, "0")}
          </p>
          <p className="type-helper mt-1 text-muted-foreground">
            verified public {projects.length === 1 ? "dossier" : "dossiers"}
          </p>
        </aside>
      </section>

      <section aria-label="Project filters" className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal aria-hidden="true" className="size-4 text-primary" />
            <h2 className="type-label text-foreground">Refine the index</h2>
          </div>
          {hasFilters ? (
            <button
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              onClick={clearFilters}
              type="button"
            >
              <X aria-hidden="true" className="size-3.5" />
              Clear all filters
            </button>
          ) : (
            <span className="type-meta text-muted-foreground">Search and combine filters</span>
          )}
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(220px,1.5fr)_minmax(150px,1fr)_minmax(150px,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <label className="type-label mb-2 block text-muted-foreground" htmlFor="project-search">
              Search
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                autoComplete="off"
                className="h-11 pl-9 pr-10"
                id="project-search"
                onChange={(event) => setFilter("q", event.currentTarget.value.trimStart())}
                placeholder="Titles, problems, summaries"
                type="search"
                value={filters.q}
              />
              {filters.q ? (
                <button
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setFilter("q", "")}
                  type="button"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <label
              className="type-label mb-2 block text-muted-foreground"
              htmlFor="project-technology"
            >
              Technology
            </label>
            <select
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              id="project-technology"
              onChange={(event) => setFilter("tech", event.currentTarget.value)}
              value={filters.tech}
            >
              <option value="">All technologies</option>
              {technologies.map((technology) => (
                <option key={technology.id} value={technology.id}>
                  {technology.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="type-label mb-2 block text-muted-foreground"
              htmlFor="project-category"
            >
              Category
            </label>
            <select
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              id="project-category"
              onChange={(event) => setFilter("category", event.currentTarget.value)}
              value={filters.category}
            >
              <option value="">All categories</option>
              {availableCategories.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <button
            aria-pressed={filters.featured}
            className="flex min-h-11 items-center gap-2.5 rounded-md border border-border px-3 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:col-span-2 lg:col-span-1"
            onClick={() => setFilter("featured", filters.featured ? "" : "true")}
            type="button"
          >
            <span
              aria-hidden="true"
              className={cn(
                "inline-flex size-4 items-center justify-center rounded-[4px] border transition-colors",
                filters.featured
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background",
              )}
            >
              {filters.featured ? <Check className="size-3" /> : null}
            </span>
            <span>Featured only</span>
          </button>
        </div>
      </section>

      <section aria-labelledby="project-results-heading" className="space-y-5">
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="type-label text-muted-foreground">02 / Dossiers</p>
            <h2 id="project-results-heading" className="type-section mt-2">
              Project results
            </h2>
          </div>
          <p
            aria-live="polite"
            className="type-meta font-medium text-muted-foreground"
            data-testid="project-result-count"
            role="status"
          >
            {results.length} / {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid min-w-0 gap-5 md:grid-cols-2">
            {results.map((project, index) => (
              <ProjectDossier
                key={project.slug}
                project={project}
                index={index}
                technologyNames={technologyNames}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            className="rounded-lg"
            icon={<FolderSearch aria-hidden="true" className="size-7" />}
            title="No dossiers match those filters"
            description="Try a broader search or remove one of the filters to see more selected work."
            action={
              <button
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                onClick={clearFilters}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
                Clear filters
              </button>
            }
          />
        )}
      </section>
    </div>
  );
}

function ProjectDossier({
  project,
  index,
  technologyNames,
}: {
  project: Project;
  index: number;
  technologyNames: Map<string, string>;
}) {
  const featuredNote = project.featured ? "Featured selection" : "Project dossier";
  const keyDecision = project.decisions[0];
  const visibleContributions = project.contribution.slice(0, 2);
  const additionalContributions = Math.max(
    0,
    project.contribution.length - visibleContributions.length,
  );

  return (
    <article
      aria-labelledby={`project-${project.slug}-title`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/35"
      data-project-slug={project.slug}
    >
      <ProjectCover project={project} className="border-b" sizes="(min-width: 768px) 45vw, 100vw" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="type-label text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {PROJECT_CATEGORY_LABELS[project.category]}
          </p>
          <span
            className={cn(
              "inline-flex h-6 items-center gap-1.5 rounded-sm border px-2 text-[0.6875rem] font-medium",
              project.featured
                ? "border-primary/20 bg-accent-soft text-accent-soft-foreground"
                : "border-border text-muted-foreground",
            )}
          >
            {project.featured ? <Check aria-hidden="true" className="size-3" /> : null}
            {featuredNote}
          </span>
        </div>

        <h3 className="type-card-title mt-3" id={`project-${project.slug}-title`}>
          <Link
            href={`/projects/${project.slug}`}
            className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            {project.title}
          </Link>
        </h3>
        <p className="type-body mt-2 text-muted-foreground">{project.summary}</p>

        <div className="mt-4">
          <Button asChild size="sm" variant="outline">
            <Link href={`/projects/${project.slug}`}>
              Read case study
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-4 border-y border-border py-4 sm:grid-cols-2">
          <div>
            <p className="type-label text-muted-foreground">Problem space</p>
            <p className="type-helper mt-2 text-foreground">{project.problem}</p>
          </div>
          <div>
            <p className="type-label text-muted-foreground">Why it stands out</p>
            <p className="type-helper mt-2 text-foreground">
              {keyDecision ?? "Verified project details are being prepared."}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="type-label text-muted-foreground">My contribution</p>
          <ul className="mt-2 space-y-2">
            {visibleContributions.map((contribution) => (
              <li key={contribution} className="flex gap-2 type-helper text-muted-foreground">
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0 text-primary"
                />
                <span>{contribution}</span>
              </li>
            ))}
          </ul>
          {additionalContributions > 0 ? (
            <p className="type-meta mt-2 pl-5 text-muted-foreground">
              +{additionalContributions} additional verified contributions
            </p>
          ) : null}
        </div>

        <div className="mt-auto pt-5">
          <p className="type-label text-muted-foreground">Technology tags</p>
          <ul aria-label={`${project.title} technologies`} className="mt-2 flex flex-wrap gap-1.5">
            {project.techIds.map((techId) => (
              <li
                className="rounded-sm border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground"
                key={techId}
              >
                {technologyNames.get(techId) ?? techId}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
