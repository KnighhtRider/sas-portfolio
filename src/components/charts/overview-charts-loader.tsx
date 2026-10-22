"use client";

import dynamic from "next/dynamic";
import type { TechnologyChartData } from "@/lib/chart-data";

function ChartsLoading() {
  return (
    <section aria-label="Technology charts loading" className="space-y-6" data-chart-loading>
      <div className="border-b border-border pb-4">
        <div className="h-3 w-36 animate-pulse rounded-md bg-muted" />
        <div className="mt-3 h-8 w-64 animate-pulse rounded-md bg-muted" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {["category", "coverage"].map((chart) => (
          <div
            key={chart}
            aria-hidden="true"
            className="h-[460px] animate-pulse rounded-xl border border-border bg-card"
          />
        ))}
      </div>
    </section>
  );
}

const OverviewCharts = dynamic(
  () => import("@/components/charts/overview-charts").then((module) => module.OverviewCharts),
  { loading: ChartsLoading },
);

export function OverviewChartsLoader({ data }: { data: TechnologyChartData }) {
  return <OverviewCharts data={data} />;
}
