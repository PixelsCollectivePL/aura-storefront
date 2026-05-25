import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface TrustItem {
  icon: React.ReactNode;
  text: string;
}

const ITEMS: TrustItem[] = [
  { icon: <Icon.bean    size={16} />, text: "Palona w tym tygodniu" },
  { icon: <Icon.truck   size={16} />, text: "Darmowa dostawa od 150 zł" },
  { icon: <Icon.package size={16} />, text: "Wysyłka w 24 h od palenia" },
  { icon: <Icon.shield  size={16} />, text: "14 dni na zwrot" },
];

interface TrustStripProps {
  className?: string;
}

/**
 * TrustStrip — 4-column benefit bar.
 * Desktop: single row, divided by vertical lines.
 * Mobile: 2×2 grid.
 */
export function TrustStrip({ className }: TrustStripProps) {
  return (
    <div
      className={cn(
        "border-b border-line",
        className
      )}
    >
      {/* Desktop: 4-col row */}
      <div className="hidden lg:grid grid-cols-4">
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2.5 px-8 py-4",
              i > 0 && "border-l border-line"
            )}
          >
            <span className="text-brand shrink-0">{item.icon}</span>
            <span
              className="text-[11px] tracking-[0.09em] uppercase text-ink leading-tight"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile: 2×2 grid */}
      <div className="grid grid-cols-2 lg:hidden">
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 px-4 py-3",
              i % 2 === 1 && "border-l border-line",
              i >= 2 && "border-t border-line"
            )}
          >
            <span className="text-brand shrink-0">{item.icon}</span>
            <span
              className="text-[11px] tracking-[0.07em] uppercase text-ink/80 leading-tight"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
