import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";

export function RouteStub({
  title,
  phase,
  description,
}: {
  title: string;
  phase: number;
  description: string;
}) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <PageContainer>
      <div className="max-w-2xl">
        <Badge variant="outline">Development only</Badge>
        <p className="type-label mt-6 text-muted-foreground">Phase {phase} route stub</p>
        <h1 className="type-page-title mt-3">{title}</h1>
        <p className="type-body mt-3 text-muted-foreground">{description}</p>
        <div className="mt-8 rounded-lg border border-border bg-card p-5">
          <p className="type-label text-muted-foreground">Planned</p>
          <p className="type-body mt-2 text-foreground">
            This route is intentionally a stub during development. The real page arrives in Phase{" "}
            {phase}.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
