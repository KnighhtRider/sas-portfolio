import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, Layers3 } from "lucide-react";
import type { Project, Technology } from "@/data/types";
import { PROJECT_CATEGORY_LABELS } from "@/lib/project-categories";
import { PageContainer } from "@/components/layout/page-container";
import { ProjectCover } from "@/components/projects/project-cover";
import { Button } from "@/components/ui/button";
import { TechChip } from "@/components/ui/tech-chip";

type ProjectCaseStudyProps = {
  project: Project;
  technologies: Technology[];
  previous?: Project;
  next?: Project;
};

export function ProjectCaseStudy({ project, technologies, previous, next }: ProjectCaseStudyProps) {
  const cover = project.cover?.anonymized ? project.cover : undefined;
  const gallery = project.gallery?.filter((image) => image.anonymized) ?? [];
  const verifiedPerformance = project.performanceWork?.filter((item) => item.verified) ?? [];
  const sections = [
    ["overview", "Overview"],
    ["problem", "The problem"],
    ["contribution", "My contribution"],
    ["stack", "Technology stack"],
    ["features", "Features"],
    ["decisions", "Engineering decisions"],
    ...(verifiedPerformance.length ? [["performance", "Performance work"]] : []),
    ...(gallery.length ? [["gallery", "Gallery"]] : []),
    ...(project.lessons?.length ? [["lessons", "Lessons"]] : []),
    ...(project.links?.live || project.links?.github ? [["links", "Links"]] : []),
  ] as const;

  return (
    <PageContainer>
      <div className="space-y-10 pb-12 sm:space-y-14">
        <nav
          aria-label="Breadcrumb"
          className="type-meta flex items-center gap-2 text-muted-foreground"
        >
          <Link className="transition-colors hover:text-foreground" href="/projects">
            Projects
          </Link>
          <ChevronRight aria-hidden="true" className="size-3" />
          <span aria-current="page" className="truncate text-foreground">
            {project.title}
          </span>
        </nav>

        <header className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] xl:items-end">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="type-label text-primary">
                Selected work / {PROJECT_CATEGORY_LABELS[project.category]}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2 py-1 type-meta text-muted-foreground">
                <Check aria-hidden="true" className="size-3 text-primary" /> Verified project
              </span>
            </div>
            <h1 className="type-display max-w-4xl text-foreground">{project.title}</h1>
            <p className="type-lead max-w-3xl text-muted-foreground">{project.summary}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild variant="outline" size="sm">
                <Link href="#contribution">
                  Explore my contribution <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/projects">
                  <ArrowLeft aria-hidden="true" /> All projects
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-card">
            <Fact label="Project status" value="Verified" />
            <Fact label="Contributions" value={String(project.contribution.length)} />
            <Fact label="Technologies" value={String(technologies.length)} />
            <p className="col-span-3 border-t border-border px-4 py-3 type-helper text-muted-foreground">
              {project.myRole}
            </p>
          </div>
        </header>

        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_13rem] xl:gap-12">
          <nav aria-label="On this page" className="min-w-0 space-y-2 lg:hidden">
            <p className="type-label text-muted-foreground">In this case study</p>
            <div className="flex gap-4 overflow-x-auto border-b border-border pb-3">
              {sections.map(([id, label]) => (
                <a
                  key={id}
                  className="shrink-0 type-meta text-muted-foreground transition-colors hover:text-primary"
                  href={`#${id}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>

          <div className="min-w-0 space-y-12">
            <section id="overview" aria-labelledby="overview-title" className="scroll-mt-8">
              <h2 id="overview-title" className="type-section-title mb-4">
                Overview
              </h2>
              <ProjectCover
                project={{ ...project, cover }}
                priority
                sizes="(min-width: 1280px) 70vw, 100vw"
              />
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 type-meta text-muted-foreground">
                <span>Project overview</span>
                <span aria-hidden="true">/</span>
                <span>{project.title}</span>
              </div>
            </section>

            <StorySection id="problem" eyebrow="01 / Context" title="The problem">
              <p className="type-body max-w-3xl text-muted-foreground">{project.problem}</p>
            </StorySection>

            <StorySection id="contribution" eyebrow="02 / Scope" title="My contribution">
              <p className="type-helper mb-5 max-w-3xl text-muted-foreground">
                My role: {project.myRole}
              </p>
              <ol className="divide-y divide-border border-y border-border">
                {project.contribution.map((item, index) => (
                  <li key={item} className="grid gap-3 py-4 sm:grid-cols-[3rem_1fr]">
                    <span className="type-meta text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="type-body text-foreground">{item}</p>
                  </li>
                ))}
              </ol>
            </StorySection>

            <StorySection id="stack" eyebrow="03 / Tools" title="Technology stack">
              <div className="flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <TechChip key={technology.id} name={technology.name} />
                ))}
              </div>
            </StorySection>

            <StorySection id="features" eyebrow="04 / Capabilities" title="Project features">
              <ul className="grid gap-3 sm:grid-cols-2">
                {project.features.map((feature, index) => (
                  <li
                    key={feature}
                    className="flex gap-3 rounded-md border border-border bg-card p-4"
                  >
                    <span className="type-meta text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="type-helper text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </StorySection>

            <StorySection id="decisions" eyebrow="05 / Approach" title="Engineering decisions">
              <ul className="space-y-4">
                {project.decisions.map((decision) => (
                  <li key={decision} className="flex gap-3 type-body text-muted-foreground">
                    <Layers3 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            </StorySection>

            {verifiedPerformance.length ? (
              <StorySection
                id="performance"
                eyebrow="06 / Verified work"
                title="Performance and architecture"
              >
                <ul className="space-y-3">
                  {verifiedPerformance.map((item) => (
                    <li key={item.text} className="type-body text-muted-foreground">
                      {item.text}
                    </li>
                  ))}
                </ul>
              </StorySection>
            ) : null}

            {gallery.length ? (
              <StorySection id="gallery" eyebrow="07 / Visual record" title="Project gallery">
                <div className="grid gap-4 sm:grid-cols-2">
                  {gallery.map((image) => (
                    <figure key={image.src} className="space-y-2">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-muted">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(min-width: 640px) 40vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="type-meta text-muted-foreground">
                        {image.alt}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </StorySection>
            ) : null}

            {project.lessons?.length ? (
              <StorySection id="lessons" eyebrow="08 / Reflection" title="Lessons">
                <ul className="space-y-3">
                  {project.lessons.map((lesson) => (
                    <li key={lesson} className="type-body text-muted-foreground">
                      {lesson}
                    </li>
                  ))}
                </ul>
              </StorySection>
            ) : null}

            {project.links?.live || project.links?.github ? (
              <StorySection id="links" eyebrow="09 / Further reading" title="Project links">
                <div className="flex flex-wrap gap-3">
                  {project.links.live ? (
                    <ExternalProjectLink href={project.links.live} label="Live project" />
                  ) : null}
                  {project.links.github ? (
                    <ExternalProjectLink href={project.links.github} label="Source code" />
                  ) : null}
                </div>
              </StorySection>
            ) : null}
          </div>

          <aside className="hidden lg:block">
            <nav
              aria-label="On this page"
              className="sticky top-8 space-y-3 border-l border-border pl-4"
            >
              <p className="type-label text-muted-foreground">In this case study</p>
              {sections.map(([id, label]) => (
                <a
                  key={id}
                  className="block type-meta text-muted-foreground transition-colors hover:text-primary"
                  href={`#${id}`}
                >
                  {label}
                </a>
              ))}
            </nav>
          </aside>
        </div>

        <nav
          aria-label="More case studies"
          className="grid gap-3 border-t border-border pt-6 sm:grid-cols-2"
        >
          {previous ? (
            <AdjacentProject direction="Previous project" project={previous} />
          ) : (
            <span />
          )}
          {next ? <AdjacentProject direction="Next project" project={next} align="right" /> : null}
        </nav>
      </div>
    </PageContainer>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 px-3 py-4 sm:px-4">
      <p className="type-meta text-muted-foreground">{label}</p>
      <p className="mt-1 type-card-title text-foreground">{value}</p>
    </div>
  );
}

function StorySection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-8 space-y-4">
      <div>
        <p className="type-label text-primary">{eyebrow}</p>
        <h2 id={`${id}-title`} className="type-section-title mt-2">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function ExternalProjectLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-3 type-helper text-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      {label}
      <ArrowUpRight aria-hidden="true" className="size-4" />
    </a>
  );
}

function AdjacentProject({
  project,
  direction,
  align = "left",
}: {
  project: Project;
  direction: string;
  align?: "left" | "right";
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 ${align === "right" ? "text-right" : ""}`}
    >
      <span className="type-meta text-muted-foreground">{direction}</span>
      <span
        className={`mt-2 flex items-center gap-2 type-card-title group-hover:text-primary ${align === "right" ? "justify-end" : ""}`}
      >
        {align === "left" ? <ArrowLeft aria-hidden="true" className="size-4" /> : null}
        {project.title}
        {align === "right" ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
      </span>
    </Link>
  );
}
