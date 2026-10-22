import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export function OverviewSkeleton() {
  return (
    <PageContainer>
      <div role="status" className="space-y-20 lg:space-y-24">
        <span className="sr-only">Loading overview</span>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="mt-6 h-16 w-full max-w-xl" />
            <Skeleton className="mt-4 h-6 w-full max-w-2xl" />
            <Skeleton className="mt-3 h-4 w-full max-w-xl" />
            <Skeleton className="mt-2 h-4 w-4/5 max-w-lg" />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="aspect-[2/1] w-full rounded-xl sm:aspect-[5/2] lg:aspect-[4/3]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="border-t border-border pt-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-4 h-10 w-20" />
              <Skeleton className="mt-3 h-3 w-36" />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-8 w-56" />
            <Skeleton className="mt-3 h-4 w-full max-w-xl" />
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
            {[0, 1].map((item) => (
              <div key={item} className="overflow-hidden rounded-xl border border-border bg-card">
                <Skeleton className="aspect-[16/10] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="mt-3 h-8 w-64" />
            <Skeleton className="mt-3 h-4 w-full max-w-xl" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {[0, 1].map((item) => (
              <Skeleton key={item} className="h-[390px] w-full rounded-xl" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-56" />
          </div>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-5 lg:col-span-8">
              {[0, 1].map((item) => (
                <div key={item} className="border-t border-border pt-5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="mt-3 h-5 w-48" />
                  <Skeleton className="mt-2 h-4 w-full" />
                </div>
              ))}
            </div>
            <Skeleton className="h-64 w-full rounded-xl lg:col-span-4" />
          </div>
        </div>

        <Skeleton className="h-52 w-full rounded-xl" />
      </div>
    </PageContainer>
  );
}
