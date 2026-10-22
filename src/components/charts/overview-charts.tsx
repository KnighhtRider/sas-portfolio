"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, ChevronDown, ChevronUp, Table2 } from "lucide-react";
import { TECHNOLOGY_CATEGORIES } from "@/data/technologies";
import type { TechnologyChartData } from "@/lib/chart-data";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { SectionHeader } from "@/components/ui/section-header";

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

const categoryConfig = Object.fromEntries(
  TECHNOLOGY_CATEGORIES.map((category, index) => [
    category.id,
    { label: category.label, color: chartColors[index % chartColors.length] },
  ]),
) satisfies ChartConfig;

const coverageConfig = {
  count: { label: "Public projects", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function OverviewCharts({ data }: { data: TechnologyChartData }) {
  const markHydrated = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.dataset.hydrated = "true";
    }
  }, []);

  return (
    <section
      aria-labelledby="technology-signals-title"
      className="space-y-6"
      data-overview-charts
      ref={markHydrated}
    >
      <SectionHeader
        index="03 / Technology signals"
        id="technology-signals-title"
        title="Technology signals"
        description="A compact map of the technologies tracked and where they appear in selected public work."
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/skills">
              Explore all technologies
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <CategoryChart data={data} />
        <TechnologyCoverageChart data={data} />
      </div>
    </section>
  );
}

function CategoryChart({ data }: { data: TechnologyChartData }) {
  const router = useRouter();
  const [showTable, setShowTable] = useState(false);
  const categoryData = data.categories;
  const categoryChartData = categoryData.map((entry, index) => ({
    ...entry,
    fill: chartColors[index % chartColors.length],
  }));
  const total = categoryData.reduce((sum, item) => sum + item.count, 0);

  function openCategory(category: string) {
    router.push(`/skills?category=${encodeURIComponent(category)}`);
  }

  return (
    <ChartCard
      eyebrow="Inventory"
      title="Technologies by category"
      description="Inventory coverage by category — a count of tracked technologies, not a proficiency rating."
      sample={`${data.technologyCount} technologies tracked`}
      chartId="category-chart"
      showTable={showTable}
      onToggleTable={() => setShowTable((visible) => !visible)}
      empty={total === 0}
      table={<CategoryTable categories={categoryData} />}
    >
      <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(130px,0.85fr)] sm:items-center">
        <div
          className="relative mx-auto h-[220px] w-full max-w-[250px] sm:h-[230px]"
          data-testid="category-chart"
        >
          <ChartContainer config={categoryConfig} className="h-full w-full aspect-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart accessibilityLayer>
                <Pie
                  data={categoryChartData}
                  dataKey="count"
                  nameKey="label"
                  innerRadius="66%"
                  outerRadius="88%"
                  paddingAngle={2}
                  stroke="var(--card)"
                  strokeWidth={3}
                  isAnimationActive={false}
                  onClick={(entry) => openCategory(String(entry.payload?.category))}
                  cursor="pointer"
                />
                <Tooltip
                  content={
                    <ChartTooltipContent
                      nameKey="label"
                      formatter={(value, _name, item) => (
                        <span className="flex w-full items-center justify-between gap-5">
                          <span>{String(item.payload.label)}</span>
                          <span className="font-mono tabular-nums">{String(value)}</span>
                        </span>
                      )}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="type-metric text-[2rem]">{total}</span>
            <span className="type-label mt-1 text-muted-foreground">technologies</span>
          </div>
        </div>

        <nav aria-label="Technology categories" className="grid gap-1">
          {categoryData.map((entry, index) => (
            <Link
              key={entry.category}
              href={`/skills?category=${encodeURIComponent(entry.category)}`}
              className="group flex min-h-11 items-center justify-between gap-3 rounded-md px-2.5 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: chartColors[index % chartColors.length] }}
                />
                <span className="truncate text-sm">{entry.label}</span>
              </span>
              <span className="type-meta text-muted-foreground group-hover:text-foreground">
                {entry.count}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <p className="sr-only" id="category-chart-alternative">
        Doughnut chart showing technology counts by category:{" "}
        {categoryData.map((entry) => `${entry.label}, ${entry.count}`).join("; ")}.
      </p>
    </ChartCard>
  );
}

export function TechnologyCoverageChart({ data }: { data: TechnologyChartData }) {
  const [showAll, setShowAll] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const coverageRows = data.coverage;
  const rows = useMemo(
    () => (showAll ? coverageRows : coverageRows.slice(0, 6)),
    [coverageRows, showAll],
  );
  const shownTable = showAll ? coverageRows : coverageRows.slice(0, 6);
  const chartHeight = showAll ? Math.max(246, rows.length * 32) : 246;

  return (
    <ChartCard
      eyebrow="Applied work"
      title="Projects per technology"
      description="Selected public projects tagged with each technology — project usage, not a skill rating."
      sample={`Based on ${data.publicProjectCount} selected projects`}
      chartId="coverage-chart"
      showTable={showTable}
      onToggleTable={() => setShowTable((visible) => !visible)}
      empty={coverageRows.length === 0}
      table={<CoverageTable rows={shownTable} />}
      action={
        <button
          aria-expanded={showAll}
          className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setShowAll((visible) => !visible)}
          type="button"
        >
          {showAll ? "Show top 6" : "Show all"}
          {showAll ? (
            <ChevronUp aria-hidden="true" className="size-4" />
          ) : (
            <ChevronDown aria-hidden="true" className="size-4" />
          )}
        </button>
      }
    >
      <div className="min-w-0" data-testid="coverage-chart" style={{ height: chartHeight }}>
        <ChartContainer config={coverageConfig} className="h-full w-full aspect-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={rows}
              layout="vertical"
              margin={{ top: 4, right: 18, bottom: 4, left: 0 }}
              barCategoryGap={10}
            >
              <XAxis type="number" allowDecimals={false} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={112}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                interval={0}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, _name, item) => (
                      <div className="grid gap-1.5">
                        <span className="font-medium text-foreground">
                          {String(item.payload.name)}
                        </span>
                        <span className="text-muted-foreground">
                          {String(value)} {Number(value) === 1 ? "project" : "projects"}
                        </span>
                        <span className="max-w-52 text-muted-foreground">
                          {item.payload.projectNames.join(", ")}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[0, 4, 4, 0]}
                maxBarSize={18}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <p className="sr-only" id="coverage-chart-alternative">
        Horizontal bar chart of public project coverage:{" "}
        {coverageRows
          .map((row) => `${row.name}, ${row.count} ${row.count === 1 ? "project" : "projects"}`)
          .join("; ")}
        .
      </p>
    </ChartCard>
  );
}

type ChartCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  sample: string;
  chartId: string;
  showTable: boolean;
  onToggleTable: () => void;
  empty: boolean;
  table: ReactNode;
  action?: ReactNode;
  children: ReactNode;
};

function ChartCard({
  eyebrow,
  title,
  description,
  sample,
  chartId,
  showTable,
  onToggleTable,
  empty,
  table,
  action,
  children,
}: ChartCardProps) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex min-h-[124px] items-start border-b border-border px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="type-label text-muted-foreground">{eyebrow}</p>
          <h3 className="type-card-title mt-2">{title}</h3>
          <p className="type-helper mt-1.5 max-w-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 py-4 sm:px-5">
        <div className="mb-3 flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className="type-meta text-muted-foreground">{sample}</span>
          <div className="flex items-center gap-1">
            {action}
            <Button
              aria-controls={`${chartId}-table`}
              aria-expanded={showTable}
              className="h-11 min-w-11 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={onToggleTable}
              size="sm"
              variant="ghost"
            >
              <Table2 aria-hidden="true" className="size-3.5" />
              {showTable ? "Chart" : "View as table"}
            </Button>
          </div>
        </div>
        {empty ? (
          <div className="flex h-[246px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/30 px-6 text-center">
            <p className="text-sm font-medium">No verified project coverage yet</p>
            <p className="type-helper mt-1 max-w-xs text-muted-foreground">
              This view will fill in when its source data is available.
            </p>
          </div>
        ) : (
          <div className={showTable ? "hidden" : "block"} aria-hidden={showTable}>
            {children}
          </div>
        )}
        {showTable && !empty ? (
          <div
            className="max-h-[280px] overflow-auto rounded-md border border-border"
            id={`${chartId}-table`}
          >
            {table}
          </div>
        ) : null}
        <div className="sr-only">{table}</div>
      </div>
    </article>
  );
}

function CategoryTable({ categories }: { categories: TechnologyChartData["categories"] }) {
  return (
    <table className="w-full text-left text-sm" aria-label="Technologies by category data">
      <thead className="sticky top-0 bg-muted text-xs text-muted-foreground">
        <tr>
          <th className="px-3 py-2 font-medium" scope="col">
            Category
          </th>
          <th className="px-3 py-2 text-right font-medium" scope="col">
            Technologies
          </th>
        </tr>
      </thead>
      <tbody>
        {categories.map((entry) => (
          <tr className="border-t border-border" key={entry.category}>
            <th className="px-3 py-2.5 font-normal" scope="row">
              {entry.label}
            </th>
            <td className="type-meta px-3 py-2.5 text-right">{entry.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CoverageTable({ rows }: { rows: TechnologyChartData["coverage"] }) {
  return (
    <table className="w-full text-left text-sm" aria-label="Technology project coverage data">
      <thead className="sticky top-0 bg-muted text-xs text-muted-foreground">
        <tr>
          <th className="px-3 py-2 font-medium" scope="col">
            Technology
          </th>
          <th className="px-3 py-2 text-right font-medium" scope="col">
            Projects
          </th>
          <th className="px-3 py-2 font-medium" scope="col">
            Selected work
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr className="border-t border-border" key={row.techId}>
            <th className="px-3 py-2.5 font-normal" scope="row">
              {row.name}
            </th>
            <td className="type-meta px-3 py-2.5 text-right">{row.count}</td>
            <td className="px-3 py-2.5 text-muted-foreground">{row.projectNames.join(", ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
