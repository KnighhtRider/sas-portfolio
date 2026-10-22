import Image from "next/image";
import { HeartPulse, Layers, Newspaper } from "lucide-react";
import type { ComponentType } from "react";
import type { Project, ProjectCategory } from "@/data/types";
import { PROJECT_CATEGORY_LABELS } from "@/lib/project-categories";
import { cn } from "@/lib/utils";

const categoryIcons: Record<
  ProjectCategory,
  ComponentType<{ "aria-hidden"?: boolean; className?: string }>
> = {
  healthcare: HeartPulse,
  "content-platform": Newspaper,
  other: Layers,
};

type ProjectCoverProps = {
  project: Pick<Project, "title" | "category" | "cover">;
  className?: string;
  sizes?: string;
  priority?: boolean;
  index?: number;
};

export function ProjectCover({
  project,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  index,
}: ProjectCoverProps) {
  const Icon = categoryIcons[project.category];
  const indexLabel = index ? String(index).padStart(2, "0") : null;

  if (project.cover) {
    return (
      <div
        data-project-cover
        className={cn("relative aspect-[16/10] overflow-hidden border-b border-border", className)}
      >
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            project.cover.fit === "contain" ? "bg-background object-contain" : "object-cover",
            "transition-transform duration-150 ease-console group-hover:scale-[1.01] motion-reduce:transform-none",
          )}
        />
        {project.cover.illustrative ? (
          <span
            aria-hidden="true"
            className="absolute bottom-3 left-3 rounded-sm border border-border/80 bg-background/90 px-2 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-muted-foreground shadow-sm backdrop-blur-sm"
          >
            {project.cover.illustrativeLabel ?? "Illustrative UI"}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      data-project-cover
      data-project-cover-fallback
      aria-hidden="true"
      className={cn(
        "relative aspect-[16/10] overflow-hidden border-b border-border bg-accent-soft/40",
        className,
      )}
    >
      <div className="absolute inset-0 bg-console-grid opacity-70" />
      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-center justify-between gap-4">
          <span className="type-label text-accent-soft-foreground">
            {indexLabel ? `${indexLabel} / ` : ""}
            {PROJECT_CATEGORY_LABELS[project.category]}
          </span>
          <Icon className="size-5 text-accent-soft-foreground/80" aria-hidden />
        </div>
        <div className="flex items-end justify-between gap-4">
          <span className="type-display text-accent-soft-foreground">{indexLabel ?? "VT"}</span>
          <span className="type-meta text-muted-foreground">
            {indexLabel ? "VT / portfolio" : "Portfolio / case study"}
          </span>
        </div>
      </div>
    </div>
  );
}
