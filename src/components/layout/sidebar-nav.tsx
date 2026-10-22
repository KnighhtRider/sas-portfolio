"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isNavItemActive } from "@/lib/navigation";

export function SidebarNav({
  onNavigate,
  mobile = false,
  collapsed = false,
}: {
  onNavigate?: () => void;
  mobile?: boolean;
  collapsed?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={mobile ? "Mobile primary" : "Primary"}>
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          const Icon = item.icon;

          const link = (
            <Link
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              data-active={active}
              data-sidebar-row
              onClick={onNavigate}
              className={cn(
                "group relative flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 ease-console hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar data-[active=true]:bg-accent-soft data-[active=true]:text-accent-soft-foreground",
                mobile && "min-h-11",
              )}
            >
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity duration-150 group-data-[active=true]:opacity-100"
              />
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span data-sidebar-label className="truncate">
                {item.label}
              </span>
            </Link>
          );

          return (
            <li key={item.href}>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ) : (
                link
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
