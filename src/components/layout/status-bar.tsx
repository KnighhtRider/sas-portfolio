"use client";

import { Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/constants";
import { getWorkspacePath } from "@/lib/navigation";

export function StatusBar() {
  const pathname = usePathname();

  return (
    <footer
      aria-label="Status bar"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[var(--status-height)] items-center gap-3 border-t border-border bg-background/95 px-3 type-meta text-muted-foreground backdrop-blur-sm lg:px-6"
    >
      <span className="min-w-0 truncate">{getWorkspacePath(pathname)}</span>
      <span className="hidden truncate sm:inline">content updated {SITE.contentUpdated}</span>
      <span className="ml-auto inline-flex shrink-0 items-center gap-1.5">
        <Sun aria-hidden="true" className="size-3 dark:hidden" />
        <Moon aria-hidden="true" className="hidden size-3 dark:block" />
        <span className="dark:hidden">light</span>
        <span className="hidden dark:inline">dark</span>
      </span>
    </footer>
  );
}
