import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ExperiencePreview, OverviewMilestone } from "@/lib/overview";

type CareerPreviewProps = {
  experiences: ExperiencePreview[];
  milestones: OverviewMilestone[];
};

export function CareerPreview({ experiences, milestones }: CareerPreviewProps) {
  return (
    <section aria-labelledby="career-preview-title" className="space-y-6">
      <SectionHeader
        index="04 / Career"
        id="career-preview-title"
        title="Career at a glance"
        description="Verified roles and the dated employment events around them. The full experience page carries the complete detail."
        action={
          <Button asChild variant="ghost" size="sm" className="min-h-11 sm:min-h-8">
            <Link href="/experience">
              Full experience
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-8">
          {experiences.length === 0 ? (
            <EmptyState
              title="No verified roles yet"
              description="Professional experience will appear here once the dates and details are confirmed."
            />
          ) : (
            <ol className="border-t border-border">
              {experiences.map((experience) => (
                <li
                  key={experience.id}
                  className="grid gap-3 border-b border-border py-5 sm:grid-cols-[9rem_1fr] sm:gap-6"
                >
                  <div className="flex items-center justify-between gap-3 sm:block">
                    <p className="type-meta text-muted-foreground">{experience.period}</p>
                    <p className="type-label mt-0 text-muted-foreground sm:mt-2">
                      {experience.durationLabel}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="type-card-title">{experience.title}</h3>
                      {experience.current ? <StatusBadge status="current" /> : null}
                    </div>
                    <p className="type-helper mt-1 text-muted-foreground">{experience.employer}</p>
                    <p className="type-helper mt-2 line-clamp-3 leading-relaxed text-muted-foreground">
                      {experience.summary}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <aside
          aria-labelledby="career-milestones-title"
          className="min-w-0 rounded-xl border border-border bg-muted/20 p-5 lg:col-span-4"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 id="career-milestones-title" className="type-label text-muted-foreground">
              Recent milestones
            </h3>
            <StatusBadge status="verified" />
          </div>

          {milestones.length === 0 ? (
            <p className="type-helper mt-4 text-muted-foreground">No verified milestones yet.</p>
          ) : (
            <ol className="mt-4">
              {milestones.map((milestone) => (
                <li
                  key={milestone.id}
                  className="grid grid-cols-[4.25rem_1fr] gap-3 border-t border-border py-3 first:border-t-0 first:pt-0"
                >
                  <p className="type-meta pt-0.5 text-muted-foreground">{milestone.dateLabel}</p>
                  <div>
                    <p className="text-sm font-medium">{milestone.title}</p>
                    <p className="type-helper mt-1 text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}

          <Button asChild variant="ghost" size="sm" className="-ml-2 mt-2 min-h-11 sm:min-h-8">
            <Link href="/activity">
              Activity
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </aside>
      </div>
    </section>
  );
}
