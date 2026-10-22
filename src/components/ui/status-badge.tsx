import { Check, CircleDashed, Radio } from "lucide-react";
import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "verified" | "placeholder" | "current";

const statusConfig: Record<
  Status,
  {
    label: string;
    variant: "success" | "warning" | "accent";
    icon: ComponentType<{ "aria-hidden"?: boolean; className?: string }>;
  }
> = {
  verified: { label: "Verified", variant: "success", icon: Check },
  placeholder: { label: "Placeholder", variant: "warning", icon: CircleDashed },
  current: { label: "Current", variant: "success", icon: Radio },
};

type StatusBadgeProps = {
  status: Status;
  label?: string;
  className?: string;
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={cn("gap-1.5", className)} data-status={status}>
      <Icon aria-hidden />
      {label ?? config.label}
    </Badge>
  );
}
