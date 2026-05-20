import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";

const { stock } = CONTENT.product;

interface StockPillProps {
  available: boolean;
  quantity?: number;
  className?: string;
}

export function StockPill({ available, quantity, className }: StockPillProps) {
  const isLow = available && quantity != null && quantity <= 30;

  if (!available) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-[11.5px] text-mute-2", className)}>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-mute" />
        {stock.soldOut}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11.5px] text-mute-2", className)}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-ok" />
      {isLow && quantity != null ? stock.lowStock(quantity) : stock.inStock}
    </span>
  );
}
