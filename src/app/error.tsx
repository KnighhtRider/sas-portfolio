"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageContainer>
      <div className="max-w-2xl">
        <p className="type-label text-muted-foreground">Runtime error</p>
        <h1 className="type-page-title mt-3">This view could not be rendered</h1>
        <p className="type-body mt-3 text-muted-foreground">
          Something interrupted the page. Retry the view, or return to the overview and try another
          route.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button type="button" onClick={reset}>
            Retry view
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return to overview</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
