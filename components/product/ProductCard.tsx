"use client";

import Link from "next/link";
import { cn, formatPriceFromPLN } from "@/lib/utils";
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

  function handleQuickAdd() {
    addToCart(product);
    openCart();
    showToast("Dodano do koszyka");
  }

  return (
    <article className={cn("group transition-transform duration-[200ms] ease-out lg:hover:-translate-y-1", className)}>

      {/* ── Link wraps image + info (no interactive elements inside except desktop hover btn) ── */}
      <Link
        href={`/produkty/${product.handle}`}
        className="block focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-md"
      >
        {/* Image area */}
        <div
          className={cn(
            "relative overflow-hidden mb-3 lg:mb-4",
            "aspect-[4/3] lg:aspect-[3/4]",       // landscape on mobile, portrait on desktop
            "rounded-md bg-paper-2",
            "transition-shadow duration-[200ms]",
            "lg:group-hover:shadow-card"
          )}
        >
          {/* Placeholder — diagonal stripe pattern */}
          <div
            className="absolute inset-0 rounded-md transition-transform duration-[300ms] ease-out lg:group-hover:scale-[1.025]"
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

          {/* Desktop quick-add — hover overlay */}
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
                handleQuickAdd();
              }}
            >
              {p.quickAdd}
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-0.5 lg:gap-[3px]">
          {/* Lot eyebrow */}
          <p
            className="text-[10.5px] tracking-[0.08em] text-muted-2 uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {p.lotPrefix} {product.lotCode}
          </p>

          {/* Name + price */}
          <div className="flex items-start justify-between gap-2 mt-0.5">
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
            <p
              className={cn(
                "tabular-nums text-brand font-extrabold shrink-0",
                "text-[14px] lg:text-[15px]",
                "tracking-[-0.01em] pt-[2px]"
              )}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {formatPriceFromPLN(product.price.amount)}
            </p>
          </div>

          {/* Origin */}
          <p className="text-[12px] leading-[1.4] text-muted">{product.origin}</p>
          {/* Notes */}
          <p className="text-[12px] leading-[1.4] text-muted-2">{product.notes.join(", ")}</p>
        </div>
      </Link>

      {/* Mobile quick-add — always visible, sits below the Link */}
      <button
        type="button"
        className={cn(
          "mt-3 w-full h-11 lg:hidden",
          "inline-flex items-center justify-center",
          "bg-ink text-white text-[13.5px] font-semibold tracking-[0.01em]",
          "rounded-pill",
          "active:scale-[0.98] transition-[background-color,transform] duration-[120ms]",
          "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
          "cursor-pointer"
        )}
        aria-label={`${p.quickAdd}: ${product.shortName}`}
        onClick={handleQuickAdd}
      >
        {p.quickAdd}
      </button>

    </article>
  );
}
