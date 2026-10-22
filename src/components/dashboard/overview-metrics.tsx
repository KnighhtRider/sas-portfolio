import { MetricCard } from "@/components/ui/metric-card";
import type { OverviewMetric } from "@/lib/overview";

export function OverviewMetrics({ metrics }: { metrics: OverviewMetric[] }) {
  return (
    <section aria-label="Career summary" data-overview-metrics>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            unit={metric.unit}
            helper={metric.helper}
          />
        ))}
      </div>
    </section>
  );
}
