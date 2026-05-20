"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { CONTENT } from "@/lib/content/pl";

const { decreaseQty, increaseQty, qty: qtyLabel } = CONTENT.pdp;

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
      className={cn(
        "inline-flex items-center rounded-pill border border-line overflow-hidden",
        className
      )}
      role="group"
      aria-label={qtyLabel}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        aria-label={decreaseQty}
        className={cn(
          "flex items-center justify-center w-11 h-11",
          "text-ink bg-transparent cursor-pointer",
          "transition-colors duration-[120ms]",
          "hover:bg-paper-2",
          "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-[-2px]",
          "disabled:text-muted disabled:cursor-not-allowed"
        )}
      >
        <Icon.minus size={16} />
      </button>

      <span
        className="w-10 text-center text-[14px] font-semibold text-ink tabular-nums select-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        aria-label={increaseQty}
        className={cn(
          "flex items-center justify-center w-11 h-11",
          "text-ink bg-transparent cursor-pointer",
          "transition-colors duration-[120ms]",
          "hover:bg-paper-2",
          "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-[-2px]",
          "disabled:text-muted disabled:cursor-not-allowed"
        )}
      >
        <Icon.plus size={16} />
      </button>
    </div>
  );
}
