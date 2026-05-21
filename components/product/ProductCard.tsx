"use client";

import Link from "next/link";
import { cn, formatPriceFrom } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/lib/cart/cart-context";
import { showToast } from "@/lib/toast/toast";
import { CONTENT } from "@/lib/content/pl";
import type { Product } from "@/types/product";

const { product: p } = CONTENT;

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart, openCart } = useCart();

  return (
    <article className={cn("group transition-transform duration-[200ms] ease-out hover:-translate-y-1", className)}>
      <Link
        href={`/produkty/${product.handle}`}
        className="block focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-md"
      >
        {/* Image area */}
        <div
          className={cn(
            "relative aspect-[3/4] overflow-hidden mb-3 lg:mb-4",
            "rounded-md bg-paper-2",
            "transition-shadow duration-[200ms]",
            "group-hover:shadow-card"
          )}
        >
          {/* Placeholder stripes — warm paper-2 with subtle diagonal pattern */}
          <div
            className="absolute inset-0 rounded-md transition-transform duration-[300ms] ease-out group-hover:scale-[1.025]"
            style={{
              background: `
                repeating-linear-gradient(
                  135deg,
                  rgba(14,14,12,0.035) 0 5px,
                  rgba(14,14,12,0) 5px 13px
                ),
                var(--aura-paper-2)
              `,
            }}
          />

          {product.isNew && (
            <Badge label={p.newBadge} className="absolute top-3 left-3 z-10" />
          )}

          {/* Quick add — desktop hover only */}
          <div
            className={cn(
              "absolute bottom-0 inset-x-0 p-3 z-10",
              "hidden lg:block",
              "opacity-0 group-hover:opacity-100",
              "translate-y-1 group-hover:translate-y-0",
              "transition-[opacity,transform] duration-[150ms] ease-out"
            )}
          >
            <button
              type="button"
              className={cn(
                "w-full h-10",
                "inline-flex items-center justify-center",
                "bg-brand text-white text-[13px] font-semibold",
                "rounded-pill border border-brand",
                "hover:bg-brand-deep hover:border-brand-deep",
                "transition-colors duration-[120ms] cursor-pointer",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              )}
              aria-label={`${p.quickAdd}: ${product.shortName}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
                openCart();
                showToast("Dodano do koszyka");
              }}
            >
              {p.quickAdd}
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-0.5 lg:gap-[3px]">
          <p
            className="text-[10.5px] tracking-[0.08em] text-muted-2 uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {p.lotPrefix} {product.lotCode}
          </p>
          <h3
            className={cn(
              "font-extrabold leading-[1.1] text-ink",
              "text-[17px] tracking-[-0.02em]",
              "lg:text-[19px]"
            )}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.shortName}
          </h3>
          <p className="text-[12px] leading-[1.4] text-muted">{product.origin}</p>
          <p className="text-[12px] leading-[1.4] text-muted-2">
            {product.notes.join(", ")}
          </p>
        </div>

        <p
          className={cn(
            "tabular-nums text-ink tracking-[-0.015em]",
            "mt-2 lg:mt-2.5",
            "text-[17px] lg:text-[18px] font-extrabold"
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {formatPriceFrom(product.price.amount, product.price.currencyCode)}
        </p>
      </Link>
    </article>
  );
}
