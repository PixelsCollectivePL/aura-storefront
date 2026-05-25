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

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    addToCart(product);
    openCart();
    showToast("Dodano do koszyka");
  }

  return (
    <article className={cn("group", className)}>

      {/* ══════════════════════════════════════════
          MOBILE  — horizontal card, 1 col full-width
          ══════════════════════════════════════════ */}
      <div className="flex gap-4 items-start lg:hidden">

        {/* Left — square image */}
        <Link
          href={`/produkty/${product.handle}`}
          className={cn(
            "relative shrink-0 w-[110px] h-[110px]",
            "rounded-md overflow-hidden bg-paper-2",
            "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          )}
          tabIndex={-1}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
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
            <Badge label={p.newBadge} className="absolute top-2 left-2 z-10" />
          )}
        </Link>

        {/* Right — info + quick-add */}
        <div className="flex-1 min-w-0 flex flex-col gap-2.5 pt-0.5">

          {/* Info — links to PDP */}
          <Link
            href={`/produkty/${product.handle}`}
            className="block focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
          >
            {/* Lot eyebrow */}
            <p
              className="text-[10.5px] tracking-[0.08em] text-muted-2 uppercase mb-0.5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {p.lotPrefix} {product.lotCode}
            </p>

            {/* Name + price */}
            <div className="flex items-baseline justify-between gap-2">
              <h3
                className="font-extrabold text-[17px] leading-[1.1] tracking-[-0.02em] text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {product.shortName}
              </h3>
              <p
                className="tabular-nums text-brand font-extrabold text-[13.5px] tracking-[-0.01em] shrink-0"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {formatPriceFromPLN(product.price.amount)}
              </p>
            </div>

            {/* Origin + notes */}
            <p className="text-[12px] leading-[1.4] text-muted mt-0.5">{product.origin}</p>
            <p className="text-[11.5px] leading-[1.4] text-muted-2 truncate">
              {product.notes.join(", ")}
            </p>
          </Link>

          {/* Quick-add — always visible on mobile, outside Link */}
          <button
            type="button"
            className={cn(
              "w-full h-9",
              "inline-flex items-center justify-center",
              "bg-ink text-white text-[12.5px] font-semibold tracking-[0.02em]",
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
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP — vertical card with hover button
          ══════════════════════════════════════════ */}
      <Link
        href={`/produkty/${product.handle}`}
        className={cn(
          "hidden lg:block",
          "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-md",
          "transition-transform duration-[200ms] ease-out hover:-translate-y-1"
        )}
      >
        {/* Image area */}
        <div
          className={cn(
            "relative aspect-[3/4] overflow-hidden mb-4",
            "rounded-md bg-paper-2",
            "transition-shadow duration-[200ms]",
            "group-hover:shadow-card"
          )}
        >
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

          {/* Quick-add — appears on hover */}
          <div
            className={cn(
              "absolute bottom-0 inset-x-0 p-3 z-10",
              "opacity-0 group-hover:opacity-100",
              "translate-y-1 group-hover:translate-y-0",
              "transition-[opacity,transform] duration-[150ms] ease-out"
            )}
            onClick={(e) => e.preventDefault()}
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
              onClick={handleQuickAdd}
            >
              {p.quickAdd}
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-[3px]">
          <p
            className="text-[10.5px] tracking-[0.08em] text-muted-2 uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {p.lotPrefix} {product.lotCode}
          </p>
          <div className="flex items-start justify-between gap-2 mt-0.5">
            <h3
              className="font-extrabold text-[19px] leading-[1.1] tracking-[-0.02em] text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {product.shortName}
            </h3>
            <p
              className="tabular-nums text-brand font-extrabold text-[15px] tracking-[-0.01em] shrink-0 pt-[2px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {formatPriceFromPLN(product.price.amount)}
            </p>
          </div>
          <p className="text-[12px] leading-[1.4] text-muted">{product.origin}</p>
          <p className="text-[12px] leading-[1.4] text-muted-2">{product.notes.join(", ")}</p>
        </div>
      </Link>

    </article>
  );
}
