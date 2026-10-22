"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/layout/brand-mark";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SITE } from "@/lib/constants";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label="Open navigation"
          className="size-11 lg:hidden"
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[min(88vw,320px)] gap-0 bg-sidebar p-0 data-[side=left]:w-[min(88vw,320px)]"
      >
        <SheetHeader className="flex-row items-center gap-3 border-b border-sidebar-border p-3">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Primary pages for this portfolio.</SheetDescription>
          <BrandMark />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{SITE.name}</p>
            <p className="type-meta truncate text-muted-foreground">{SITE.role}</p>
          </div>
          <SheetClose asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label="Close navigation"
              className="ml-auto size-11"
            >
              <X aria-hidden="true" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav mobile onNavigate={() => setOpen(false)} />
        </div>

        <div className="space-y-1 border-t border-sidebar-border p-3">
          <div className="flex min-h-11 items-center gap-2 rounded-md px-1 text-muted-foreground">
            <ThemeToggle className="size-11 shrink-0" />
            <span className="type-meta">Theme</span>
          </div>
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
          >
            <ArrowUpRight aria-hidden="true" className="size-4" />
            GitHub
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
