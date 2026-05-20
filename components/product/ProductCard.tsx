"use client";

import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <article className={cn("group", className)}>
      <Link href={`/shop/${product.handle}`} className="block focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2">
        {/* Image area */}
        <div className="relative aspect-[3/4] bg-bg-soft overflow-hidden mb-3 lg:mb-[18px]">
          {/* Image placeholder — replaced with next/image in Phase 2 */}
          <div className="absolute inset-0 bg-bg-soft" />

          {product.isNew && (
            <Badge
              label="New"
              className="absolute top-3 left-3 z-10"
            />
          )}

          {/* Quick add — desktop hover only */}
          <div
            className={cn(
              "absolute bottom-0 inset-x-0 p-3 z-10",
              "hidden lg:block",
              "opacity-0 group-hover:opacity-100",
              "transition-opacity duration-[120ms] ease-out",
              "translate-y-1 group-hover:translate-y-0"
            )}
          >
            <Button
              variant="secondary"
              size="sm"
              className="w-[calc(100%-0px)]"
              onClick={(e) => e.preventDefault()}
            >
              Quick add
            </Button>
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-0.5 lg:gap-[3px]">
          <p className="text-[11.5px] leading-[1.4] text-mute-2">Lot {product.lotCode}</p>
          <h3 className={cn(
            "font-medium leading-[1.2] text-ink-hi",
            "text-[17px] tracking-[-0.014em]",
            "lg:text-[20px]"
          )}>
            {product.shortName}
          </h3>
          <p className="text-[11.5px] leading-[1.4] text-mute-2">{product.origin}</p>
          <p className="text-[11.5px] leading-[1.4] text-mute">
            {product.notes.join(", ")}
          </p>
        </div>

        <p className={cn(
          "font-medium text-ink-hi tabular-nums",
          "mt-2.5 lg:mt-3.5",
          "text-[14px] lg:text-[15px]"
        )}>
          {formatPrice(product.price.amount, product.price.currencyCode)}
        </p>
      </Link>
    </article>
  );
}
