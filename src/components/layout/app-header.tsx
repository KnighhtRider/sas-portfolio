"use client";

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/command/command-palette";
import type { CommandPaletteData } from "@/components/command/command-types";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { getPageTitle, getWorkspacePath } from "@/lib/navigation";

export function AppHeader({ commandData }: { commandData: CommandPaletteData }) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const workspace = getWorkspacePath(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur-sm sm:px-4 lg:px-6">
      <MobileNav />

      <div className="min-w-0 flex-1 py-1">
        <p className="type-label truncate text-muted-foreground">{workspace}</p>
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
      </div>

      <div className="flex items-center gap-1">
        <CommandPalette
          data={commandData}
          trigger={
            <Button
              type="button"
              variant="outline"
              data-testid="command-trigger"
              className="size-11 px-0 sm:h-9 sm:w-auto sm:px-3"
            >
              <Search aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
              <span className="sr-only">Open command palette</span>
              <kbd className="hidden rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground md:inline-flex">
                Ctrl K
              </kbd>
            </Button>
          }
        />
        <ThemeToggle className="size-11 sm:size-9" />
      </div>
    </header>
  );
}
