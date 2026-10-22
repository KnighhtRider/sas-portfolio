import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-primary font-mono text-xs font-semibold tracking-[0.08em] text-primary-foreground",
        className,
      )}
    >
      VT
    </span>
  );
}
