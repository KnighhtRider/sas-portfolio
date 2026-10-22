import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectCover } from "@/components/projects/project-cover";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TechChip } from "@/components/ui/tech-chip";
import type { FeaturedProjectCard } from "@/lib/overview";

type FeaturedProjectsProps = {
  projects: FeaturedProjectCard[];
};

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section aria-labelledby="featured-projects-title" className="space-y-6">
      <SectionHeader
        index="02 / Selected work"
        id="featured-projects-title"
        title="Featured projects"
        description="Verified case studies with the problem, contribution, and stack behind each build."
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/projects">
              All projects
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="No featured projects yet"
          description="Verified project dossiers will appear here once they are ready."
          action={
            <Button asChild variant="outline" size="sm">
              <Link href="/projects">Open project explorer</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {projects.map((project, index) => (
            <article
              key={project.slug}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-150 ease-console hover:border-primary/40"
            >
              <ProjectCover project={project} index={index + 1} />

              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="type-label text-muted-foreground">{project.categoryLabel}</span>
                  <StatusBadge status={project.status} />
                </div>

                <h3 className="type-card-title mt-3">
                  <Link
                    href={project.href}
                    className="rounded-sm transition-colors duration-150 ease-console hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  >
                    {project.title}
                  </Link>
                </h3>
                <p className="type-body mt-2 text-muted-foreground">{project.summary}</p>

                {project.contribution.length > 0 ? (
                  <ul className="mt-4 space-y-1.5">
                    {project.contribution.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 type-helper text-muted-foreground before:mt-2 before:size-1 before:shrink-0 before:rounded-full before:bg-primary"
                      >
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.technologies.map((technology) => (
                    <TechChip key={technology} name={technology} />
                  ))}
                  {project.additionalTechnologyCount > 0 ? (
                    <span className="type-meta self-center text-muted-foreground">
                      +{project.additionalTechnologyCount}
                    </span>
                  ) : null}
                </div>

                <div className="mt-auto pt-5">
                  <Button asChild variant="ghost" size="sm" className="-ml-2">
                    <Link href={project.href}>
                      Read case study
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
