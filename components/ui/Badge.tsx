import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "inverted" | "outline";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ label, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        "px-2 py-0.5",
        "text-[11px] font-medium leading-none tracking-[0.04em] uppercase",
        "rounded-none",
        variant === "default" && "bg-ink-hi text-ink-inv",
        variant === "inverted" && "bg-bg text-ink-hi",
        variant === "outline" && "bg-transparent text-ink-hi border border-line-2",
        className
      )}
    >
      {label}
    </span>
  );
}
