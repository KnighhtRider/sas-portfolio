import { CareerPreview } from "@/components/dashboard/career-preview";
import { ClosingCta } from "@/components/dashboard/closing-cta";
import { FeaturedProjects } from "@/components/dashboard/featured-projects";
import { OverviewHero } from "@/components/dashboard/overview-hero";
import { OverviewMetrics } from "@/components/dashboard/overview-metrics";
import { PageContainer } from "@/components/layout/page-container";
import { OverviewChartsLoader } from "@/components/charts/overview-charts-loader";
import { EXPERIENCES } from "@/data/experience";
import { PROJECTS } from "@/data/projects";
import { TECHNOLOGIES } from "@/data/technologies";
import { technologyChartData } from "@/lib/chart-data";
import { currentExperience } from "@/lib/metrics";
import { getAvailableResumeHref } from "@/lib/resume";
import {
  getExperiencePreview,
  getFeaturedProjectCards,
  getOverviewMetrics,
  getRecentMilestones,
} from "@/lib/overview";
export default function Home() {
  const currentRole = currentExperience(EXPERIENCES);
  const charts = technologyChartData(PROJECTS, TECHNOLOGIES);

  return (
    <PageContainer>
      <div className="space-y-20 lg:space-y-24">
        <OverviewHero
          currentRole={
            currentRole
              ? {
                  title: currentRole.title,
                  employer: currentRole.employer,
                  start: currentRole.start,
                }
              : undefined
          }
          projectCount={charts.publicProjectCount}
          resumeHref={getAvailableResumeHref()}
        />
        <OverviewMetrics metrics={getOverviewMetrics()} />
        <FeaturedProjects projects={getFeaturedProjectCards()} />

        <OverviewChartsLoader data={charts} />

        <CareerPreview experiences={getExperiencePreview()} milestones={getRecentMilestones()} />
        <ClosingCta />
      </div>
    </PageContainer>
  );
}
