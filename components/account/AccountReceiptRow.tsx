import { cn } from "@/lib/utils";

interface AccountReceiptRowProps {
  label: string;
  value: React.ReactNode;
  /** Stronger value styling (used for last row before total). */
  strong?: boolean;
  /** When the row sits on the ink card. */
  onDark?: boolean;
  className?: string;
}

/**
 * Paragon-style row: mono label on the left, value on the right,
 * dashed bottom border. Used in receipt cards (order details, etc.).
 */
export function AccountReceiptRow({
  label,
  value,
  strong = false,
  onDark = false,
  className,
}: AccountReceiptRowProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-baseline gap-4 py-2.5",
        onDark ? "border-b border-dashed border-white/15" : "border-b border-dashed border-line",
        className
      )}
    >
      <span
        className={cn(
          "uppercase",
          onDark ? "text-white/55" : "text-muted"
        )}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
        }}
      >
        {label}
      </span>
      <span
        className={cn(
          "tabular-nums text-right",
          strong ? "font-bold text-[16px]" : "font-medium text-[14px]",
          onDark ? "text-white" : "text-ink"
        )}
      >
        {value}
      </span>
    </div>
  );
}
