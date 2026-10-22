"use client";

import { ArrowUpRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore, type ReactElement } from "react";
import { BrandMark } from "@/components/layout/brand-mark";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SITE } from "@/lib/constants";
import {
  getServerSidebarSnapshot,
  getSidebarSnapshot,
  subscribeSidebar,
  writeSidebarState,
} from "@/lib/sidebar";

export function AppSidebar() {
  const sidebarState = useSyncExternalStore(
    subscribeSidebar,
    getSidebarSnapshot,
    getServerSidebarSnapshot,
  );
  const collapsed = sidebarState === "collapsed";

  function toggleSidebar() {
    writeSidebarState(collapsed ? "expanded" : "collapsed");
  }

  const CollapseIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      id="app-sidebar"
      aria-label="Sidebar"
      data-sidebar-shell
      className="fixed top-0 bottom-[var(--status-height)] left-0 z-40 hidden w-[var(--sidebar-width)] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-150 ease-console lg:flex"
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-3">
        <CollapsedTooltip enabled={collapsed} label="Overview">
          <Link
            href="/"
            data-sidebar-row
            className="flex w-full min-w-0 items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
          >
            <BrandMark />
            <span data-sidebar-label className="min-w-0">
              <span className="block truncate text-sm font-semibold">{SITE.name}</span>
              <span className="type-meta block truncate text-muted-foreground">{SITE.role}</span>
            </span>
            <span className="sr-only">Overview</span>
          </Link>
        </CollapsedTooltip>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav collapsed={collapsed} />
      </div>

      <div className="space-y-1 border-t border-sidebar-border p-3">
        <div
          data-sidebar-row
          title={collapsed ? "Toggle theme" : undefined}
          className="flex min-h-10 items-center gap-2 rounded-md px-3 text-muted-foreground"
        >
          <ThemeToggle className="size-8 shrink-0" />
          <span data-sidebar-label className="type-meta">
            Theme
          </span>
        </div>

        <CollapsedTooltip enabled={collapsed} label="GitHub">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            data-sidebar-row
            className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
          >
            <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            <span data-sidebar-label>GitHub</span>
          </a>
        </CollapsedTooltip>

        <CollapsedTooltip
          enabled={collapsed}
          label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            aria-controls="app-sidebar"
            data-sidebar-row
            className="w-full justify-start gap-3 px-3 text-muted-foreground"
          >
            <CollapseIcon aria-hidden="true" className="size-4 shrink-0" />
            <span data-sidebar-label>{collapsed ? "Expand" : "Collapse"}</span>
          </Button>
        </CollapsedTooltip>
      </div>
    </aside>
  );
}

function CollapsedTooltip({
  enabled,
  label,
  children,
}: {
  enabled: boolean;
  label: string;
  children: ReactElement;
}) {
  if (!enabled) {
    return children;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
