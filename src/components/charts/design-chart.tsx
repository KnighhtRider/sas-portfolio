"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const data = [
  { month: "Jan", value: 12 },
  { month: "Feb", value: 18 },
  { month: "Mar", value: 9 },
  { month: "Apr", value: 14 },
];

const config = {
  value: {
    label: "Demo value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function DesignChart() {
  return (
    <figure className="min-w-0">
      <ChartContainer
        config={config}
        className="h-56 w-full"
        role="img"
        aria-label="Demo bar chart: January 12, February 18, March 9, April 14."
      >
        <BarChart accessibilityLayer data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartContainer>
      <figcaption className="type-meta mt-3 text-muted-foreground">
        Demo data only. Portfolio charts use derived data in Phase 6.
      </figcaption>
    </figure>
  );
}
