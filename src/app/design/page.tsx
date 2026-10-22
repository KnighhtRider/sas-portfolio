import { ArrowUpRight, Check, CircleDashed, Inbox, Search, Settings, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Design System",
  description: "Development-only component and theme reference.",
  robots: { index: false, follow: false },
};
import { DesignChart } from "@/components/charts/design-chart";
import { CommandDemo } from "@/components/design/command-demo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechChip } from "@/components/ui/tech-chip";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const tokenGroups = [
  {
    label: "Surfaces",
    tokens: ["--background", "--card", "--sidebar", "--muted"],
  },
  {
    label: "Ink and lines",
    tokens: ["--foreground", "--muted-foreground", "--border", "--input"],
  },
  {
    label: "Signal",
    tokens: ["--primary", "--accent-soft", "--success", "--warning", "--destructive"],
  },
  {
    label: "Charts",
    tokens: ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"],
  },
];

function TokenSwatch({ token }: { token: string }) {
  const style = { backgroundColor: `var(${token})` } satisfies CSSProperties;

  return (
    <div className="min-w-0">
      <div className="h-12 rounded-md border border-border" style={style} aria-hidden="true" />
      <p className="type-meta mt-2 truncate text-muted-foreground">{token.replace("--", "")}</p>
    </div>
  );
}

export default function DesignPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto w-full max-w-[1280px] scroll-mt-14 px-6 py-10 outline-none md:px-12 md:py-14"
    >
      <header className="border-b border-border pb-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="type-label text-primary">Precision Console · Internal</p>
            <h1 className="type-page-title mt-4">Design system</h1>
            <p className="type-body mt-3 max-w-2xl text-muted-foreground">
              The visual contract for the portfolio: one accent, hairline geometry, mono metadata
              and both themes treated as designed surfaces. This route is development-only.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="type-meta text-muted-foreground">dev only</span>
            <ThemeToggle />
          </div>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
          <div>
            <dt className="type-label text-muted-foreground">Direction</dt>
            <dd className="type-meta mt-1">Precision Console</dd>
          </div>
          <div>
            <dt className="type-label text-muted-foreground">Type pair</dt>
            <dd className="type-meta mt-1">Geist Sans / Mono</dd>
          </div>
          <div>
            <dt className="type-label text-muted-foreground">Radius</dt>
            <dd className="type-meta mt-1">6 / 8 / 12 px</dd>
          </div>
          <div>
            <dt className="type-label text-muted-foreground">Motion</dt>
            <dd className="type-meta mt-1">150–180 ms, entry only</dd>
          </div>
        </dl>
      </header>

      <div className="mt-14 space-y-16">
        <section aria-labelledby="foundations">
          <SectionHeader
            index="01 / Foundations"
            id="foundations"
            title="Type, color and motion"
            description="Roles stay stable across pages; only density and composition change."
          />
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-7">
              <div>
                <p className="type-label text-muted-foreground">Display</p>
                <p className="type-display mt-2">Build with intent.</p>
              </div>
              <div>
                <p className="type-label text-muted-foreground">Page title</p>
                <p className="type-page-title mt-2">Selected work</p>
              </div>
              <div>
                <p className="type-label text-muted-foreground">Section</p>
                <p className="type-section mt-2">Capability matrix</p>
              </div>
              <div>
                <p className="type-label text-muted-foreground">Card title</p>
                <p className="type-card-title mt-2">Hospital information system</p>
              </div>
              <div>
                <p className="type-label text-muted-foreground">Body</p>
                <p className="type-body mt-2 max-w-prose text-muted-foreground">
                  Clear hierarchy, consistent optical alignment and evidence-first content. No
                  fabricated metrics, no percentage skill bars and no placeholder screenshots.
                </p>
              </div>
              <div className="flex flex-wrap items-end gap-8">
                <div>
                  <p className="type-label text-muted-foreground">Metric</p>
                  <p className="type-metric mt-2">128</p>
                </div>
                <div>
                  <p className="type-label text-muted-foreground">Helper</p>
                  <p className="type-helper mt-2 text-muted-foreground">
                    Derived from data, never typed.
                  </p>
                </div>
                <div>
                  <p className="type-label text-muted-foreground">Metadata</p>
                  <p className="type-meta mt-2 text-muted-foreground">2026 · 04</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {tokenGroups.map((group) => (
                <div key={group.label}>
                  <p className="type-label text-muted-foreground">{group.label}</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                    {group.tokens.map((token) => (
                      <TokenSwatch key={token} token={token} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="controls">
          <SectionHeader
            index="02 / Controls"
            id="controls"
            title="Controls and inputs"
            description="Every control has a visible focus ring, a disabled state and an invalid state."
          />
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h3 className="type-card-title">Buttons</h3>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" aria-label="Open settings">
                  <Settings aria-hidden="true" />
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
            <div className="space-y-5">
              <h3 className="type-card-title">Inputs</h3>
              <div>
                <label htmlFor="design-name" className="type-label text-muted-foreground">
                  Name
                </label>
                <Input id="design-name" className="mt-2" placeholder="Vivek Thakur" />
              </div>
              <div>
                <label htmlFor="design-invalid" className="type-label text-muted-foreground">
                  Invalid state
                </label>
                <Input
                  id="design-invalid"
                  className="mt-2"
                  aria-invalid="true"
                  aria-describedby="design-invalid-error"
                  defaultValue="not-an-email"
                />
                <p id="design-invalid-error" className="type-helper mt-1 text-destructive">
                  Enter a valid email address.
                </p>
              </div>
              <div>
                <label htmlFor="design-search" className="type-label text-muted-foreground">
                  Search
                </label>
                <InputGroup className="mt-2">
                  <InputGroupAddon>
                    <Search aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput id="design-search" placeholder="Search projects..." />
                </InputGroup>
              </div>
              <div>
                <label htmlFor="design-note" className="type-label text-muted-foreground">
                  Note
                </label>
                <Textarea id="design-note" className="mt-2" placeholder="A short note..." />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="feedback">
          <SectionHeader
            index="03 / Feedback"
            id="feedback"
            title="Status, overlays and loading"
            description="Badges carry state; overlays are the only surfaces with shadows."
          />
          <div className="mt-8 space-y-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="verified" />
              <StatusBadge status="current" />
              <StatusBadge status="placeholder" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover for tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>Mono metadata, concise labels.</TooltipContent>
              </Tooltip>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm action</DialogTitle>
                    <DialogDescription>
                      Overlays use a hairline border and a shadow reserved for floating surfaces.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter showCloseButton>
                    <Button>Continue</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open sheet</Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Navigation sheet</SheetTitle>
                    <SheetDescription>
                      The mobile shell uses this surface with ≥44px targets in Phase 3.
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
              <CommandDemo />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-3">
                <p className="type-label text-muted-foreground">Separator</p>
                <Separator />
                <p className="type-helper text-muted-foreground">
                  A one-pixel rule replaces the resting shadow.
                </p>
                <Separator />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="data">
          <SectionHeader
            index="04 / Data display"
            id="data"
            title="Cards, metrics and charts"
            description="Cards are discrete objects only; metrics are derived values, not typed claims."
          />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Project dossier</CardTitle>
                <CardDescription>A compact object with a hairline border.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="type-body text-muted-foreground">
                  Case-study rows use indexed titles, mono metadata and one restrained action.
                </p>
              </CardContent>
              <CardFooter className="justify-between">
                <span className="type-meta text-muted-foreground">ACGIL · 2026</span>
                <Button variant="ghost" size="sm">
                  Open
                  <ArrowUpRight aria-hidden="true" />
                </Button>
              </CardFooter>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard label="Projects" value="03" helper="Demo value" />
              <MetricCard label="Technologies" value="09" helper="Demo value" />
              <MetricCard label="Years" value="2+" helper="Derived from dates" />
              <MetricCard label="Status" value="Now" helper="Current role" />
            </div>
            <div>
              <p className="type-label text-muted-foreground">Tech chips</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <TechChip name="TypeScript" />
                <TechChip name="Next.js" />
                <TechChip name="Node.js" />
                <TechChip name="MongoDB" />
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="type-card-title">Tabs</h3>
              <Tabs defaultValue="overview" className="mt-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="type-helper mt-4 text-muted-foreground">
                  Default tabs use a quiet surface and a 150ms transition.
                </TabsContent>
                <TabsContent value="details" className="type-helper mt-4 text-muted-foreground">
                  Content remains readable in both themes.
                </TabsContent>
                <TabsContent value="notes" className="type-helper mt-4 text-muted-foreground">
                  No resting shadows on active tabs.
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <h3 className="type-card-title">Chart</h3>
              <div className="mt-4">
                <DesignChart />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <EmptyState
              icon={<Inbox aria-hidden="true" className="size-6" />}
              title="No projects match"
              description="Filters produce a real empty state, not a blank panel. Clear the filter to return to the dossier."
              action={
                <Button variant="outline" size="sm">
                  Clear filters
                </Button>
              }
            />
          </div>
        </section>

        <section aria-labelledby="motion">
          <SectionHeader
            index="05 / Motion"
            id="motion"
            title="Entry, hover and reduced motion"
            description="Motion is entry-only and effectively instant when the OS asks for reduced motion."
          />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div
              data-motion-demo
              className="flex items-start gap-4 border border-border bg-card p-5"
            >
              <Sparkles aria-hidden="true" className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="type-card-title">Entry rise</p>
                <p className="type-helper mt-1 text-muted-foreground">
                  Page content fades in with a 4px rise over 160ms. There are no exit animations.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">Hover me</Button>
              <Button variant="ghost" size="icon" aria-label="Motion sample">
                <Check aria-hidden="true" />
              </Button>
              <span className="type-meta text-muted-foreground">
                <CircleDashed aria-hidden="true" className="mr-1 inline size-3.5" />
                120ms hover
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
