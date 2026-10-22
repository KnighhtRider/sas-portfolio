import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  unit?: string;
  helper?: string;
  className?: string;
};

export function MetricCard({ label, value, unit, helper, className }: MetricCardProps) {
  return (
    <div className={cn("min-w-0 border-t border-border pt-4", className)}>
      <p className="type-label text-muted-foreground">{label}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="type-metric">{value}</span>
        {unit ? <span className="type-meta text-muted-foreground">{unit}</span> : null}
      </div>
      {helper ? <p className="type-helper mt-2 text-muted-foreground">{helper}</p> : null}
    </div>
  );
}
