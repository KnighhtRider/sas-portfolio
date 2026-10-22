"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CATEGORY_IDS, type CategoryId } from "@/data/types";
import { cn } from "@/lib/utils";

type SkillProject = { slug: string; title: string };
type SkillTechnology = {
  id: string;
  name: string;
  usage: "professional" | "learning";
  projectCount: number;
  relatedProjects: SkillProject[];
};
type SkillCategoryGroup = {
  category: CategoryId;
  label: string;
  technologies: SkillTechnology[];
};

export function SkillExplorer({ groups }: { groups: SkillCategoryGroup[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const categoryParam = params.get("category");
  const activeCategory = CATEGORY_IDS.find((category) => category === categoryParam) ?? "";
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const allTechnologies = groups.flatMap((group) => group.technologies);
  const usedTechnologies = allTechnologies.filter(
    (technology) => technology.projectCount > 0,
  ).length;
  const learningTechnologies = allTechnologies.filter(
    (technology) => technology.usage === "learning",
  ).length;

  const visibleGroups = useMemo(
    () =>
      groups
        .filter((group) => !activeCategory || group.category === activeCategory)
        .map((group) => ({
          ...group,
          technologies: group.technologies.filter((technology) => {
            const haystack = [
              technology.name,
              group.label,
              ...technology.relatedProjects.map((project) => project.title),
            ]
              .join(" ")
              .toLocaleLowerCase();
            return haystack.includes(normalizedQuery);
          }),
        }))
        .filter((group) => group.technologies.length > 0),
    [activeCategory, groups, normalizedQuery],
  );
  const visibleCount = visibleGroups.reduce((count, group) => count + group.technologies.length, 0);

  return (
    <section aria-labelledby="skills-title" className="space-y-8">
      <header className="grid gap-6 border-b border-border pb-7 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
        <div className="max-w-3xl">
          <p className="type-label text-primary">Capability index / 09</p>
          <h1 id="skills-title" className="type-page-title mt-3">
            Skills
          </h1>
          <p className="type-lead mt-3 text-muted-foreground">
            A searchable map of the technologies used across selected work, with learning interests
            clearly distinguished.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4 xl:w-[23rem] xl:grid-cols-2">
          <SummaryMetric label="Tracked" value={allTechnologies.length} />
          <SummaryMetric label="In public work" value={usedTechnologies} />
          <SummaryMetric label="Areas" value={groups.length} />
          <SummaryMetric label="Learning" value={learningTechnologies} />
        </dl>
      </header>

      <div className="-mx-6 border-b border-border bg-background px-6 py-3 lg:-mx-12 lg:px-12">
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="relative w-full sm:max-w-sm">
              <label htmlFor="technology-search" className="sr-only">
                Find a technology
              </label>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="technology-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="Search technologies or project names"
                className="h-11 pl-9 pr-10"
              />
              {query ? (
                <button
                  aria-label="Clear technology search"
                  className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              ) : null}
            </div>
            <p
              aria-live="polite"
              className="type-meta shrink-0 text-muted-foreground"
              data-testid="skill-result-count"
            >
              Showing {visibleCount} of {allTechnologies.length} technologies
            </p>
          </div>

          <nav aria-label="Filter skills by category" className="flex gap-2 overflow-x-auto pb-1">
            <CategoryLink href="/skills" active={!activeCategory}>
              All areas
            </CategoryLink>
            {groups.map((group) => (
              <CategoryLink
                key={group.category}
                href={`/skills?category=${encodeURIComponent(group.category)}`}
                active={activeCategory === group.category}
              >
                {group.label}
              </CategoryLink>
            ))}
          </nav>
        </div>
      </div>

      {visibleGroups.length ? (
        <div className="space-y-10 lg:space-y-14">
          {visibleGroups.map((group) => {
            const groupIndex = groups.findIndex((item) => item.category === group.category) + 1;
            const linkedCount = group.technologies.filter(
              (technology) => technology.projectCount > 0,
            ).length;

            return (
              <section
                key={group.category}
                aria-labelledby={`category-${group.category}`}
                className="grid gap-4 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-10"
              >
                <div className="lg:self-start">
                  <p className="type-label text-primary">
                    {String(groupIndex).padStart(2, "0")} / Technology area
                  </p>
                  <h2 id={`category-${group.category}`} className="type-section mt-2">
                    {group.label}
                  </h2>
                  <p className="mt-2 type-helper text-muted-foreground">
                    {group.technologies.length}{" "}
                    {group.technologies.length === 1 ? "technology" : "technologies"} ·{" "}
                    {linkedCount} in public work
                  </p>
                </div>

                <ul className="divide-y divide-border border-y border-border">
                  {group.technologies.map((technology) => (
                    <li key={technology.id}>
                      <article className="grid gap-3 py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-6 sm:py-5">
                        <div className="min-w-0">
                          <h3 className="type-card-title">{technology.name}</h3>
                          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 type-meta text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "size-2 rounded-full",
                                  technology.usage === "learning"
                                    ? "border border-chart-4 bg-chart-4/25"
                                    : "bg-primary",
                                )}
                              />
                              {technology.usage === "learning" ? "Learning" : "Professional use"}
                            </span>
                            <span aria-hidden="true" className="text-border">
                              ·
                            </span>
                            <span>
                              {technology.projectCount}{" "}
                              {technology.projectCount === 1
                                ? "public project"
                                : "public projects"}
                            </span>
                          </p>
                        </div>

                        <div className="min-w-0">
                          {technology.relatedProjects.length ? (
                            <ul className="flex flex-wrap gap-2">
                              {technology.relatedProjects.map((project) => (
                                <li key={project.slug}>
                                  <Link
                                    href={`/projects/${project.slug}`}
                                    className="inline-flex min-h-9 items-center gap-1 rounded-md border border-border px-2.5 type-meta text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  >
                                    {project.title}
                                    <ArrowUpRight aria-hidden="true" className="size-3" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="type-helper text-muted-foreground">
                              No selected public project linked yet.
                            </p>
                          )}
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
          <h2 className="type-card-title">No technologies match that search</h2>
          <p className="type-helper mt-2 text-muted-foreground">
            Try a different term or clear the active category.
          </p>
          {activeCategory ? (
            <Link
              className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline"
              href="/skills"
            >
              Clear category filter
            </Link>
          ) : null}
        </div>
      )}
    </section>
  );
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0 bg-card px-4 py-3">
      <dt className="type-meta text-muted-foreground">{label}</dt>
      <dd className="mt-1 type-metric text-[1.75rem] text-foreground">{value}</dd>
    </div>
  );
}

function CategoryLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: string;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      href={href}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center rounded-md border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary/35 bg-accent-soft text-accent-soft-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
