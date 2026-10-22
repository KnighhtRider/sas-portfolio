import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { PROFILE } from "@/data/profile";
import { formatMonthYear } from "@/lib/dates";

type OverviewCurrentRole = {
  title: string;
  employer: string;
  start: string;
};

type OverviewHeroProps = {
  currentRole?: OverviewCurrentRole;
  projectCount: number;
  resumeHref?: string;
};

export function OverviewHero({ currentRole, projectCount, resumeHref }: OverviewHeroProps) {
  const [primaryRole, ...positioning] = (PROFILE.headline ?? PROFILE.role).split(" | ");

  return (
    <section aria-labelledby="overview-title" className="grid gap-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="type-label text-muted-foreground">Portfolio / Overview</p>
          <span className="hidden h-px flex-1 bg-border sm:block" aria-hidden="true" />
          {currentRole ? (
            <StatusBadge status="current" label={`Currently at ${currentRole.employer}`} />
          ) : null}
        </div>

        <h1 id="overview-title" className="type-display mt-6">
          {PROFILE.name}
        </h1>
        <p className="type-section mt-4 max-w-2xl">
          <span className="block">{primaryRole}</span>
          {positioning.length > 0 ? (
            <span className="mt-1 block text-muted-foreground">{positioning.join(" | ")}</span>
          ) : null}
        </p>
        <p className="type-body mt-5 max-w-2xl">{PROFILE.summary}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/projects">
              Explore projects
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              Contact
              <Mail aria-hidden="true" />
            </Link>
          </Button>
          {resumeHref ? (
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 self-start rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:self-center"
            >
              <FileText aria-hidden="true" className="size-4" />
              View resume
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          ) : null}
        </div>
      </div>

      <aside className="lg:col-span-4" aria-label="Profile signal">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-5">
            <span className="type-label text-muted-foreground">Profile / portrait</span>
            <span className="type-meta text-muted-foreground">
              {projectCount} public {projectCount === 1 ? "project" : "projects"}
            </span>
          </div>

          {PROFILE.photo ? (
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={PROFILE.photo.src}
                alt={PROFILE.photo.alt}
                fill
                sizes="(min-width: 1280px) 25rem, (min-width: 1024px) 25vw, 100vw"
                className="object-cover object-[center_12%]"
              />
            </div>
          ) : (
            <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-accent-soft/40">
              <div className="absolute inset-0 bg-console-grid opacity-60" aria-hidden="true" />
              <span
                className="relative type-display text-accent-soft-foreground"
                aria-hidden="true"
              >
                VT
              </span>
            </div>
          )}

          <div className="px-4 py-4 sm:px-5">
            <p className="type-label text-muted-foreground">Current role</p>
            <p className="mt-1 type-card-title">{currentRole?.title ?? PROFILE.role}</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <p className="type-meta text-muted-foreground">
                {currentRole?.employer ?? "Profile overview"}
              </p>
              {currentRole ? (
                <p className="type-meta text-muted-foreground">
                  Since {formatMonthYear(currentRole.start)}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
