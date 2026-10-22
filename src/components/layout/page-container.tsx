import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={cn(
        "mx-auto w-full max-w-[1280px] scroll-mt-14 px-6 py-10 outline-none lg:px-12 lg:py-14",
        className,
      )}
    >
      {children}
    </main>
  );
}
