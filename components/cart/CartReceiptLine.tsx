"use client";

import Link from "next/link";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { Icon } from "@/components/ui/Icon";
import { getProduct } from "@/lib/mock/products";
// [shopify-ready]: replace getProduct() with line.merchandise data fetched via Storefront API
import type { CartLine } from "@/lib/cart/cart-context";
import { cn } from "@/lib/utils";

interface CartReceiptLineProps {
  line: CartLine;
  index: number;
  isLast: boolean;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  /** Mobile uses a stacked layout with a number badge over the thumb.  */
  variant?: "desktop" | "mobile";
}

/**
 * Single magazine-listing item row — V2 Receipt / Paragon.
 * Pulls extra meta (lot code, origin, flavor notes) by handle from the
 * data-access seam so the cart line stays Shopify-compatible.
 */
export function CartReceiptLine({
  line,
  index,
  isLast,
  onQtyChange,
  onRemove,
  variant = "desktop",
}: CartReceiptLineProps) {
  // Look up extra product meta (origin, notes, lot). Cart context only
  // carries shopify-shaped fields, so we look up the rest by handle.
  const product = getProduct(line.handle);
  const lot     = product?.lotCode ?? line.handle;
  const origin  = product?.origin ?? "";
  const notes   = product?.notes?.join(", ") ?? "";

  const lineTotal = line.price * line.quantity;
  const numberStr = String(index + 1).padStart(2, "0");
  const dividerCls = isLast
    ? "border-b-2 border-ink"
    : "border-b border-dashed border-line-strong";

  // ── MOBILE LAYOUT ───────────────────────────────────────────────────
  if (variant === "mobile") {
    return (
      <div className={cn("grid grid-cols-[64px_1fr_auto] gap-3.5 items-start py-[18px]", dividerCls)}>
        {/* Thumb with number badge overlay */}
        <div className="relative">
          <Thumb size={64} radius={4} />
          <span
            className="absolute -top-1.5 -left-1.5 min-w-[22px] h-[22px] px-1.5 rounded-full bg-ink text-white text-[10px] font-semibold flex items-center justify-center tabular-nums"
            style={{ fontFamily: "var(--font-mono)" }}
            aria-hidden="true"
          >
            {numberStr}
          </span>
        </div>

        {/* Meta column */}
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <Link
              href={`/produkty/${line.handle}`}
              className="font-extrabold text-[22px] leading-none tracking-[-0.022em] text-ink hover:text-brand transition-colors duration-[120ms]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {line.title}
            </Link>
            <span
              className="text-[9px] tracking-[0.14em] uppercase text-muted-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              LOT {lot}
            </span>
          </div>
          {origin && <div className="text-[12px] text-ink mb-0.5">{origin}</div>}
          {notes && <div className="text-[11px] italic text-muted mb-2">{notes}</div>}
          <div
            className="text-[9.5px] tracking-[0.14em] uppercase text-ink mb-2.5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {line.variantTitle}
          </div>

          <div className="flex items-center gap-3">
            <QuantitySelector
              value={line.quantity}
              min={1}
              max={10}
              onChange={(q) => onQtyChange(line.id, q)}
            />
            <button
              type="button"
              onClick={() => onRemove(line.id)}
              aria-label={`Usuń ${line.title} z koszyka`}
              className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-ink transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs px-1.5 py-1"
            >
              <Icon.close size={11} />
              Usuń
            </button>
          </div>
        </div>

        {/* Line price */}
        <span
          className="text-[20px] font-extrabold tabular-nums text-ink text-right leading-none pt-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {lineTotal}
          <span className="text-[11px] ml-0.5">zł</span>
        </span>
      </div>
    );
  }

  // ── DESKTOP LAYOUT — 5-col grid mirroring the design table ──────────
  return (
    <div className={cn("grid grid-cols-[40px_90px_1fr_140px_80px] gap-5 items-center py-7", dividerCls)}>
      <span
        className="text-[18px] font-semibold tabular-nums"
        style={{ fontFamily: "var(--font-mono)" }}
        aria-hidden="true"
      >
        {numberStr}
      </span>

      <Thumb size={90} radius={4} />

      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={`/produkty/${line.handle}`}
            className="font-extrabold text-[32px] leading-none tracking-[-0.022em] text-ink hover:text-brand transition-colors duration-[120ms]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {line.title}
          </Link>
          <span
            className="text-[10px] tracking-[0.14em] uppercase text-muted"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            LOT {lot}
          </span>
        </div>
        {origin && <div className="text-[13px] text-ink mb-1">{origin}</div>}
        {notes && <div className="text-[12px] italic text-muted mb-1.5">{notes}</div>}
        <div
          className="text-[10px] tracking-[0.14em] uppercase text-ink mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {line.variantTitle}
        </div>
        <button
          type="button"
          onClick={() => onRemove(line.id)}
          aria-label={`Usuń ${line.title} z koszyka`}
          className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-ink transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
        >
          <Icon.close size={11} />
          Usuń
        </button>
      </div>

      <QuantitySelector
        value={line.quantity}
        min={1}
        max={10}
        onChange={(q) => onQtyChange(line.id, q)}
      />

      <span
        className="text-[24px] font-extrabold tabular-nums text-ink text-right leading-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {lineTotal}
        <span className="text-[12px] ml-0.5">zł</span>
      </span>
    </div>
  );
}

/** Striped product thumb — matches design's BAG placeholder. */
function Thumb({ size, radius }: { size: number; radius: number }) {
  return (
    <div
      className="grid place-items-center text-muted-2 flex-none"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background:
          "repeating-linear-gradient(135deg, rgba(14,14,12,0.045) 0 6px, rgba(0,0,0,0) 6px 14px), var(--aura-paper-2)",
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      }}
      aria-hidden="true"
    >
      BAG
    </div>
  );
}
