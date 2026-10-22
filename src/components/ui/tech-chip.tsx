import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TechChipProps = {
  name: string;
  className?: string;
};

export function TechChip({ name, className }: TechChipProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-mono text-[0.6875rem] tracking-normal text-muted-foreground", className)}
    >
      {name}
    </Badge>
  );
}
