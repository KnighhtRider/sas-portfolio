import Link from "next/link";
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CalendarDays } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { StatusBadge } from "@/components/ui/status-badge";
import { TechChip } from "@/components/ui/tech-chip";
import { formatMonthYear } from "@/lib/dates";

type ExperienceTimelineEntry = {
  id: string;
  employer: string;
  title: string;
  period: string;
  current: boolean;
  datesKnown: boolean;
  summary: string;
  responsibilities: string[];
  technologies: { id: string; name: string }[];
  projects: { slug: string; title: string }[];
};

type ExperienceTimelineProps = {
  experiences: ExperienceTimelineEntry[];
  duration: { months: number; label: string; asOf: string };
};

export function ExperienceTimeline({ experiences, duration }: ExperienceTimelineProps) {
  return (
    <PageContainer>
      <div className="space-y-10 pb-12 sm:space-y-14">
        <header className="grid gap-8 border-b border-border pb-8 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
          <div className="max-w-3xl">
            <p className="type-label text-primary">Career record / 10</p>
            <h1 className="type-page-title mt-3">Experience</h1>
            <p className="type-lead mt-3 text-muted-foreground">
              A chronological view of roles, the engineering work involved, and the technologies
              used along the way.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="type-label text-muted-foreground">Verified experience</p>
            <p
              className="mt-2 type-metric-compact whitespace-nowrap text-foreground"
              data-testid="experience-duration"
            >
              {duration.months > 0 ? duration.label : "—"}
            </p>
            <p className="mt-1 type-meta text-muted-foreground">
              {duration.months > 0
                ? `As of ${formatMonthYear(duration.asOf)} · overlapping time counted once`
                : "No verified date range available."}
            </p>
          </div>
        </header>

        {experiences.length ? (
          <ol
            aria-label="Professional experience, newest first"
            className="relative ml-2 space-y-7 border-l border-border pl-6 sm:ml-3 sm:pl-9"
          >
            {experiences.map((experience, index) => (
              <li key={experience.id} className="relative min-w-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[2.02rem] top-6 grid size-4 place-items-center rounded-full border-2 border-primary bg-background sm:-left-[2.8rem]"
                >
                  <span className="size-1.5 rounded-full bg-primary" />
                </span>
                <article className="min-w-0 overflow-hidden rounded-xl border border-border bg-card">
                  <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_12rem]">
                    <div className="min-w-0 space-y-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="type-label text-primary">
                          {String(index + 1).padStart(2, "0")} / {experience.period}
                        </span>
                        {experience.current ? <StatusBadge status="current" /> : null}
                        {!experience.datesKnown && process.env.NODE_ENV !== "production" ? (
                          <StatusBadge status="placeholder" label="Date needs confirmation" />
                        ) : null}
                      </div>
                      <div>
                        <h2 className="type-section-title">{experience.title}</h2>
                        <p className="mt-1 flex items-center gap-2 type-body text-muted-foreground">
                          <BriefcaseBusiness aria-hidden="true" className="size-4 shrink-0" />
                          {experience.employer}
                        </p>
                      </div>
                      <p className="type-body max-w-3xl text-muted-foreground">
                        {experience.summary}
                      </p>

                      <section
                        aria-labelledby={`${experience.id}-responsibilities`}
                        className="space-y-3"
                      >
                        <h3
                          id={`${experience.id}-responsibilities`}
                          className="type-label text-muted-foreground"
                        >
                          Responsibilities and contributions
                        </h3>
                        <ul className="space-y-2.5">
                          {experience.responsibilities.map((responsibility) => (
                            <li
                              key={responsibility}
                              className="flex gap-3 type-helper text-foreground"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-primary"
                              />
                              <span>{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      </section>

                      <div className="space-y-3 border-t border-border pt-4">
                        <p className="type-label text-muted-foreground">Technologies used</p>
                        <ul
                          aria-label={`${experience.employer} technologies`}
                          className="flex flex-wrap gap-1.5"
                        >
                          {experience.technologies.map((technology) => (
                            <li key={technology.id}>
                              <TechChip name={technology.name} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <aside className="flex flex-col gap-4 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                      <p className="type-label text-muted-foreground">Related public work</p>
                      {experience.projects.length ? (
                        <ul className="space-y-2">
                          {experience.projects.map((project) => (
                            <li key={project.slug}>
                              <Link
                                href={`/projects/${project.slug}`}
                                className="group flex min-h-11 items-center justify-between gap-2 rounded-md border border-border px-3 type-helper text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <span className="min-w-0 truncate">{project.title}</span>
                                <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="type-helper text-muted-foreground">
                          No public case study is linked to this role.
                        </p>
                      )}
                      {experience.datesKnown ? (
                        <p className="mt-auto flex items-center gap-2 type-meta text-muted-foreground">
                          <CalendarDays aria-hidden="true" className="size-3.5" />
                          {experience.current ? "Current role" : "Completed role"}
                        </p>
                      ) : null}
                    </aside>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <h2 className="type-card-title">No verified experience to show</h2>
            <p className="type-helper mt-2 text-muted-foreground">
              Experience entries will appear when their details are verified.
            </p>
          </div>
        )}

        <div className="flex justify-end border-t border-border pt-5">
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center gap-2 type-helper font-medium text-primary hover:underline"
          >
            Explore selected projects <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
