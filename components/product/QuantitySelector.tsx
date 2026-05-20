"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function QuantitySelector({
  value,
  min = 1,
  max = 10,
  onChange,
  className,
}: QuantitySelectorProps) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn("inline-flex items-center border border-line", className)}
      role="group"
      aria-label="Quantity"
    >
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "flex items-center justify-center w-11 h-11",
          "text-ink-hi bg-transparent border-0 cursor-pointer",
          "transition-colors duration-[120ms]",
          "hover:bg-bg-soft",
          "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-[-2px]",
          "disabled:text-mute disabled:cursor-not-allowed"
        )}
      >
        <Icon.minus size={16} />
      </button>

      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
        }}
        aria-label="Quantity value"
        className={cn(
          "w-10 h-11 text-center",
          "text-[14px] font-medium text-ink-hi tabular-nums",
          "bg-transparent border-0 border-x border-line",
          "outline-none appearance-none",
          "[&::-webkit-inner-spin-button]:appearance-none",
          "[&::-webkit-outer-spin-button]:appearance-none"
        )}
      />

      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          "flex items-center justify-center w-11 h-11",
          "text-ink-hi bg-transparent border-0 cursor-pointer",
          "transition-colors duration-[120ms]",
          "hover:bg-bg-soft",
          "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-[-2px]",
          "disabled:text-mute disabled:cursor-not-allowed"
        )}
      >
        <Icon.plus size={16} />
      </button>
    </div>
  );
}
