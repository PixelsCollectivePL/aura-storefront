"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, count, selected, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-1.5",
        "px-3.5 py-2 min-h-9",
        "rounded-pill border border-line-2",
        "text-[12.5px] leading-[1.55] text-ink",
        "bg-transparent cursor-pointer whitespace-nowrap",
        "transition-[background-color,border-color,color] duration-[120ms] ease-out",
        "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2",
        !selected && "hover:border-ink-hi",
        selected && "bg-ink-hi text-ink-inv border-ink-hi",
        className
      )}
    >
      {label}
      {count != null && count > 0 && (
        <span className={cn(
          "text-[11px] font-medium tabular-nums",
          selected ? "text-ink-inv/70" : "text-mute-2"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}
