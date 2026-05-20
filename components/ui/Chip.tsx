"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  count?: number;
  selected?: boolean;
  variant?: "default" | "orange";
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, count, selected, variant = "default", onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-1.5",
        "px-[10px] py-[5px] rounded-pill border",
        "text-[12px] leading-[1.4] font-medium",
        "bg-white cursor-pointer whitespace-nowrap",
        "transition-[background-color,border-color,color] duration-[120ms] ease-out",
        "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
        // default — unselected
        !selected && variant === "default" && "border-line text-ink hover:border-ink",
        // default — selected
        selected && variant === "default" && "bg-ink text-white border-ink",
        // orange variant
        variant === "orange" && "bg-brand-soft border-brand-soft text-brand-deep",
        className
      )}
    >
      {label}
      {count != null && count > 0 && (
        <span
          className={cn(
            "text-[11px] font-medium tabular-nums",
            selected ? "opacity-60" : "text-muted-2"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
