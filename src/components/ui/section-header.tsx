import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  index?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  id?: string;
  className?: string;
};

export function SectionHeader({
  index,
  title,
  description,
  action,
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {index ? <p className="type-label text-muted-foreground">{index}</p> : null}
        <h2 id={id} className={cn("type-section", index && "mt-2")}>
          {title}
        </h2>
        {description ? (
          <p className="type-helper mt-2 max-w-2xl text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
