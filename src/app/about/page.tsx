import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/ui/section-header";
import { EDUCATION } from "@/data/education";
import { EXPERIENCES } from "@/data/experience";
import { PROFILE } from "@/data/profile";
import { currentExperience, verifiedExperiences } from "@/lib/metrics";
import { formatMonthYear, isYear, isYearMonth } from "@/lib/dates";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "About Vivek Thakur, a full-stack developer focused on React, Next.js, and practical application interfaces.",
  path: "/about",
});

const experiences = verifiedExperiences(EXPERIENCES)
  .slice()
  .sort((left, right) => right.start.localeCompare(left.start));
const education = EDUCATION.filter((item) => item.status === "verified")
  .slice()
  .sort((left, right) => (right.end ?? "").localeCompare(left.end ?? ""));
const currentRole = currentExperience(EXPERIENCES);

export default function AboutPage() {
  const currentPeriod =
    currentRole && isYearMonth(currentRole.start)
      ? `Since ${formatMonthYear(currentRole.start)}`
      : "Current role";

  return (
    <PageContainer>
      <div className="space-y-14 pb-12 sm:space-y-20">
        <header className="grid gap-8 border-b border-border pb-9 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-stretch">
          <div className="flex flex-col justify-center">
            <p className="type-label text-primary">Profile / 12</p>
            <h1 className="type-page-title mt-3">About</h1>
            <p className="mt-5 type-display text-foreground">{PROFILE.name}</p>
            <p className="mt-3 type-lead text-muted-foreground">
              {PROFILE.headline ?? PROFILE.role}
            </p>
            <p className="mt-5 max-w-3xl type-body text-muted-foreground">{PROFILE.summary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Explore selected work <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Get in touch <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>

          <aside
            aria-label="Profile identity"
            className="relative flex min-h-64 flex-col gap-5 overflow-hidden rounded-xl border border-border bg-accent-soft/30 p-6 sm:min-h-72 sm:p-8"
          >
            <div className="relative flex items-center justify-between">
              <span className="type-label text-accent-soft-foreground">Developer profile</span>
              <BrandMark className="size-10 text-sm" />
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-[17rem] overflow-hidden rounded-lg border border-border bg-card">
              {PROFILE.photo ? (
                <Image
                  src={PROFILE.photo.src}
                  alt={PROFILE.photo.alt}
                  width={800}
                  height={800}
                  sizes="17rem"
                  className="size-full object-cover object-center"
                />
              ) : (
                <span className="grid size-full place-items-center font-mono text-7xl font-semibold tracking-[-0.08em] text-accent-soft-foreground sm:text-8xl">
                  VT
                </span>
              )}
            </div>
            <div className="relative border-t border-border/70 pt-4">
              <p className="type-card-title text-foreground">{PROFILE.role}</p>
              {currentRole ? (
                <p className="mt-1 type-helper text-muted-foreground">
                  {currentRole.employer} · {currentPeriod}
                </p>
              ) : null}
            </div>
          </aside>
        </header>

        <section
          aria-labelledby="interests-title"
          className="grid gap-7 lg:grid-cols-[minmax(14rem,0.65fr)_minmax(0,1.35fr)] lg:gap-12"
        >
          <div>
            <p className="type-label text-primary">01 / Areas of interest</p>
            <h2 id="interests-title" className="type-section mt-2">
              What I’m drawn to
            </h2>
            <p className="mt-3 type-helper text-muted-foreground">
              The technical areas that shape the products and problems I choose to work on.
            </p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {PROFILE.interests.map((interest, index) => (
              <li
                key={interest}
                className="flex min-h-14 items-start gap-3 rounded-lg border border-border bg-card p-4"
              >
                <span className="type-meta text-primary">{String(index + 1).padStart(2, "0")}</span>
                <span className="type-helper text-foreground">{interest}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="background-title" className="space-y-6">
          <SectionHeader
            id="background-title"
            index="02 / Professional background"
            title="Experience that informs the work"
            description="Verified roles and dates, with more detail on the experience page."
            action={
              <Link
                href="/experience"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Full timeline <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            }
          />
          <ol className="divide-y divide-border border-y border-border">
            {experiences.map((experience) => (
              <li
                key={experience.id}
                className="grid gap-3 py-5 sm:grid-cols-[minmax(9rem,0.45fr)_minmax(0,1fr)] sm:gap-7"
              >
                <p className="type-meta text-muted-foreground">
                  {isYearMonth(experience.start)
                    ? formatMonthYear(experience.start)
                    : "Date pending"}
                  {" – "}
                  {experience.end && isYearMonth(experience.end)
                    ? formatMonthYear(experience.end)
                    : experience.end
                      ? "Date pending"
                      : "Present"}
                </p>
                <div>
                  <h3 className="type-card-title">{experience.title}</h3>
                  <p className="mt-1 type-helper text-muted-foreground">{experience.employer}</p>
                  <p className="mt-3 max-w-3xl type-helper text-foreground">{experience.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="education-title" className="space-y-6">
          <SectionHeader
            id="education-title"
            index="03 / Education"
            title="Education"
            description="Verified qualifications and study dates."
          />
          <ol className="grid gap-4 lg:grid-cols-2">
            {education.map((item) => {
              const start = item.start && isYear(item.start) ? item.start : undefined;
              const end = item.end && isYear(item.end) ? item.end : undefined;

              return (
                <li key={item.id}>
                  <article className="flex h-full gap-4 rounded-lg border border-border bg-card p-5 sm:p-6">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-muted/50 text-primary"
                    >
                      <BookOpen className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="type-meta text-muted-foreground">
                        {start && end
                          ? `${start} – ${end}`
                          : (start ?? end ?? "Dates pending confirmation")}
                      </p>
                      <h3 className="mt-2 type-card-title">{item.degree}</h3>
                      <p className="mt-1 type-helper text-muted-foreground">{item.institution}</p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </section>

      </div>
    </PageContainer>
  );
}
