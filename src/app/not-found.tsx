import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageContainer>
      <div className="max-w-2xl">
        <p className="type-label text-muted-foreground">404 · Route not found</p>
        <h1 className="type-page-title mt-3">No matching workspace path</h1>
        <p className="type-body mt-3 text-muted-foreground">
          The address does not resolve to a page in this portfolio. Return to the overview or open
          the command palette.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href="/">Return to overview</Link>
          </Button>
          <span className="type-meta text-muted-foreground">
            or press{" "}
            <kbd className="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.6875rem] text-foreground">
              Ctrl K
            </kbd>{" "}
            to search
          </span>
        </div>
      </div>
    </PageContainer>
  );
}
