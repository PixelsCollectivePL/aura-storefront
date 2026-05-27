import { cn } from "@/lib/utils";
import type { FulfillmentStatus, FinancialStatus } from "@/types/account";

type StatusKind = FulfillmentStatus | FinancialStatus;

const STATUS_MAP: Record<StatusKind, { label: string; dot: string }> = {
  unfulfilled: { label: "W przygotowaniu", dot: "#C19A2A" },
  in_transit:  { label: "W drodze",        dot: "var(--aura-orange)" },
  delivered:   { label: "Dostarczone",     dot: "var(--aura-green)" },
  cancelled:   { label: "Anulowane",       dot: "var(--aura-muted)" },
  paid:        { label: "Opłacone",        dot: "var(--aura-green)" },
  pending:     { label: "Czeka na płatność", dot: "#C19A2A" },
  refunded:    { label: "Zwrócone",        dot: "var(--aura-muted)" },
  voided:      { label: "Anulowane",       dot: "var(--aura-muted)" },
};

interface AccountStatusPillProps {
  kind: StatusKind;
  size?: "sm" | "md";
  /** When the pill sits on a dark background (e.g. inside ink card). */
  onDark?: boolean;
  className?: string;
}

export function AccountStatusPill({
  kind,
  size = "sm",
  onDark = false,
  className,
}: AccountStatusPillProps) {
  const s = STATUS_MAP[kind] ?? { label: kind, dot: "var(--aura-muted)" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border whitespace-nowrap uppercase",
        size === "md" ? "px-3.5 py-1.5 text-[12px]" : "px-2.5 py-1 text-[11px]",
        onDark
          ? "bg-white/8 border-white/20 text-white"
          : "bg-paper border-line text-ink",
        className
      )}
      style={{
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.1em",
      }}
    >
      <span
        className={cn(
          "inline-block rounded-full shrink-0",
          kind === "in_transit" ? "motion-safe:animate-pulse" : ""
        )}
        style={{
          background: s.dot,
          width: 8,
          height: 8,
        }}
        aria-hidden="true"
      />
      {s.label}
    </span>
  );
}
