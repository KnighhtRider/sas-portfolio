"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  Check,
  Copy,
  Cpu,
  FileText,
  FolderKanban,
  MoonStar,
  Sun,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import type { CommandPaletteData } from "@/components/command/command-types";
import { NAV_ITEMS } from "@/lib/navigation";

type CopyState = "idle" | "copied" | "error";

export function CommandPalette({
  trigger,
  data,
}: {
  trigger: ReactNode;
  data: CommandPaletteData;
}) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(data.email);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  function openExternal(href: string) {
    setOpen(false);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) setCopyState("idle");
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      title="Command palette"
      description="Search pages, projects, technologies, and useful actions."
      className="left-1/2 top-[18%] w-[min(44rem,calc(100vw-1.5rem))] -translate-x-1/2 translate-y-0 sm:top-[20%]"
    >
      <Command>
        <CommandInput
          placeholder="Search pages, projects, technologies, actions..."
          aria-label="Search pages, projects, technologies, and actions"
        />
        <CommandList className="max-h-[min(60vh,27rem)]">
          <CommandEmpty>
            <p className="font-medium text-foreground">No matching result</p>
            <p className="mt-1 text-muted-foreground">Try a page, project, or technology name.</p>
          </CommandEmpty>
          <CommandGroup heading="Pages">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.href}
                  value={`${item.label} ${item.href}`}
                  onSelect={() => navigate(item.href)}
                >
                  <Icon aria-hidden="true" />
                  {item.label}
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Projects">
            {data.projects.map((project) => (
              <CommandItem
                key={project.slug}
                value={`${project.title} ${project.summary} ${project.category}`}
                onSelect={() => navigate(`/projects/${project.slug}`)}
              >
                <FolderKanban aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{project.title}</span>
                <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                  {project.category}
                </span>
                <CommandShortcut>↵</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Technologies">
            {data.technologies.map((technology) => (
              <CommandItem
                key={technology.id}
                value={`${technology.name} ${technology.categoryLabel}`}
                onSelect={() => navigate(`/skills?category=${technology.category}`)}
              >
                <Cpu aria-hidden="true" />
                {technology.name}
                <span className="ml-auto text-xs text-muted-foreground">
                  {technology.categoryLabel}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem
              value="toggle theme switch color mode light dark"
              onSelect={() => {
                setOpen(false);
                setTheme(resolvedTheme === "dark" ? "light" : "dark");
              }}
            >
              {resolvedTheme === "dark" ? (
                <Sun aria-hidden="true" />
              ) : (
                <MoonStar aria-hidden="true" />
              )}
              Toggle theme
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
            <CommandItem value={`copy email ${data.email}`} onSelect={() => void copyEmail()}>
              {copyState === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copyState === "copied" ? "Email copied" : "Copy email"}
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
            {data.profileLinks.map((link) => (
              <CommandItem
                key={link.id}
                value={`${link.label} profile social link`}
                onSelect={() => openExternal(link.href)}
              >
                <ArrowUpRight aria-hidden="true" />
                Open {link.label}
                <CommandShortcut>↗</CommandShortcut>
              </CommandItem>
            ))}
            {data.resumeHref ? (
              <CommandItem
                value="resume download pdf"
                onSelect={() => openExternal(data.resumeHref ?? "")}
              >
                <FileText aria-hidden="true" />
                Open resume
                <CommandShortcut>↗</CommandShortcut>
              </CommandItem>
            ) : null}
          </CommandGroup>
        </CommandList>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border px-3 py-2 text-[0.6875rem] text-muted-foreground">
          <span>
            <kbd className="font-mono text-foreground">↑↓</kbd> Navigate
          </span>
          <span>
            <kbd className="font-mono text-foreground">↵</kbd> Open
          </span>
          <span>
            <kbd className="font-mono text-foreground">Esc</kbd> Close
          </span>
          <span role="status" aria-live="polite" className="ml-auto">
            {copyState === "copied"
              ? "Email copied to clipboard."
              : copyState === "error"
                ? "Clipboard access failed."
                : ""}
          </span>
        </div>
      </Command>
    </CommandDialog>
  );
}
