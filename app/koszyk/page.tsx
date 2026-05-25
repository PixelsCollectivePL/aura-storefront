"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/lib/cart/cart-context";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { ProductCard } from "@/components/product/ProductCard";
import { Icon } from "@/components/ui/Icon";
import { getProducts } from "@/lib/mock/products";
import { CONTENT } from "@/lib/content/pl";
import { cn, formatPrice } from "@/lib/utils";

const { koszyk: c } = CONTENT;

const SHIPPING_FLAT_FEE = 12; // PLN — InPost paczkomat (matches /faq copy)

export default function KoszykPage() {
  const { lines, count, subtotal, updateCartLine, removeCartLine } = useCart();

  // ── Local UI state ───────────────────────────────────────────────────
  const [promoInput, setPromoInput]   = useState("");
  const [promoError, setPromoError]   = useState(false);
  const [promoOpen,  setPromoOpen]    = useState(false);
  const [notesOpen,  setNotesOpen]    = useState(false);
  const [notes,      setNotes]        = useState("");

  // ── Derived values ───────────────────────────────────────────────────
  const isEmpty       = lines.length === 0;
  const shippingFree  = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost  = isEmpty || shippingFree ? 0 : SHIPPING_FLAT_FEE;
  const total         = subtotal + shippingCost;
  const remaining     = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress      = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // ── Cross-sell: products not already in cart ─────────────────────────
  const crossSell = useMemo(() => {
    const handlesInCart = new Set(lines.map((l) => l.handle));
    return getProducts()
      .filter((p) => !handlesInCart.has(p.handle))
      .slice(0, 3);
  }, [lines]);

  // ── Promo placeholder (no real backend until Shopify) ────────────────
  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    setPromoError(promoInput.trim().length > 0);
  }

  return (
    <div>
      {/* ── Page hero ─────────────────────────────────────────────── */}
      <section className="px-5 lg:px-14 pt-10 lg:pt-16 pb-8 lg:pb-12 border-b border-line">
        <p className="text-eyebrow mb-4">{c.eyebrow}</p>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <h1
            className="font-extrabold leading-[1] tracking-[-0.03em] text-ink"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 64px)",
            }}
          >
            {isEmpty ? c.headingEmpty : c.heading}
          </h1>
          {!isEmpty && (
            <p
              className="text-[13px] text-muted tabular-nums"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}
            >
              {c.countSuffix(count)}
            </p>
          )}
        </div>
      </section>

      {/* ── Empty state ──────────────────────────────────────────── */}
      {isEmpty ? (
        <section className="px-5 lg:px-14 py-20 lg:py-[120px]">
          <div className="flex flex-col items-center text-center max-w-[420px] mx-auto">
            <span className="text-muted mb-6" aria-hidden="true">
              <Icon.bag size={56} />
            </span>
            <p className="text-[16px] lg:text-[17px] text-muted leading-[1.55] mb-8">
              {c.empty.body}
            </p>
            <Link
              href={c.empty.ctaHref}
              className={cn(
                "inline-flex items-center justify-center gap-2 h-12 px-7",
                "bg-brand text-white rounded-pill border border-brand",
                "text-[14.5px] font-semibold",
                "hover:bg-brand-deep hover:border-brand-deep",
                "transition-colors duration-[150ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              )}
            >
              {c.empty.cta}
              <Icon.arrow size={15} />
            </Link>
          </div>
        </section>
      ) : (
        /* ══════════════════════════════════════════
           Items (left) + Summary sidebar (right)
           ══════════════════════════════════════════ */
        <section className="px-5 lg:px-14 py-10 lg:py-[80px] lg:grid lg:grid-cols-[1fr_400px] lg:gap-14 lg:items-start">

          {/* ─────────── LEFT — line items ─────────── */}
          <div>

            {/* Table head (desktop only) */}
            <div className="hidden lg:grid grid-cols-[1fr_140px_120px_40px] gap-6 pb-4 border-b border-line text-eyebrow text-muted">
              <span>{c.columnProduct}</span>
              <span className="text-center">{c.columnQty}</span>
              <span className="text-right">{c.columnTotal}</span>
              <span />
            </div>

            {/* Lines */}
            <ul className="divide-y divide-line">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="py-5 lg:py-7 lg:grid lg:grid-cols-[1fr_140px_120px_40px] lg:gap-6 lg:items-center"
                >
                  {/* Product cell (image + meta) */}
                  <div className="flex gap-4 items-start lg:items-center">
                    <Link
                      href={`/produkty/${line.handle}`}
                      className="shrink-0 w-[88px] h-[88px] lg:w-[96px] lg:h-[96px] rounded-md overflow-hidden bg-paper-2 block focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                      aria-label={line.title}
                    >
                      <div
                        className="w-full h-full"
                        style={{
                          background: `repeating-linear-gradient(
                            135deg,
                            rgba(14,14,12,0.035) 0 5px,
                            rgba(14,14,12,0) 5px 13px
                          ), var(--aura-paper-2)`,
                        }}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/produkty/${line.handle}`}
                        className="block focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
                      >
                        <h3
                          className="font-extrabold text-[18px] lg:text-[20px] leading-[1.1] tracking-[-0.02em] text-ink"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {line.title}
                        </h3>
                      </Link>
                      <p className="text-[13px] lg:text-[13.5px] leading-[1.4] text-muted mt-1">
                        {line.variantTitle}
                      </p>
                      <p className="text-[12.5px] tabular-nums text-muted-2 mt-1">
                        {formatPrice(line.price, line.currencyCode)} / szt.
                      </p>

                      {/* Mobile: qty + price + remove inline */}
                      <div className="flex items-center justify-between gap-3 mt-3 lg:hidden">
                        <QuantitySelector
                          value={line.quantity}
                          min={1}
                          max={10}
                          onChange={(q) => updateCartLine(line.id, q)}
                        />
                        <p
                          className="font-extrabold text-[16px] text-ink tabular-nums"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {formatPrice(line.price * line.quantity, line.currencyCode)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCartLine(line.id)}
                        aria-label={c.removeLabel(line.title)}
                        className={cn(
                          "mt-2 lg:hidden",
                          "text-[12.5px] text-muted underline underline-offset-4 cursor-pointer",
                          "hover:text-ink transition-colors duration-[120ms]",
                          "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                        )}
                      >
                        {c.remove}
                      </button>
                    </div>
                  </div>

                  {/* Desktop: qty selector */}
                  <div className="hidden lg:flex justify-center">
                    <QuantitySelector
                      value={line.quantity}
                      min={1}
                      max={10}
                      onChange={(q) => updateCartLine(line.id, q)}
                    />
                  </div>

                  {/* Desktop: line total */}
                  <p
                    className="hidden lg:block font-extrabold text-[17px] text-ink tabular-nums text-right"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {formatPrice(line.price * line.quantity, line.currencyCode)}
                  </p>

                  {/* Desktop: remove */}
                  <button
                    type="button"
                    onClick={() => removeCartLine(line.id)}
                    aria-label={c.removeLabel(line.title)}
                    className={cn(
                      "hidden lg:flex items-center justify-center",
                      "w-9 h-9 rounded-pill text-muted cursor-pointer",
                      "hover:text-ink hover:bg-paper-2 transition-colors duration-[120ms]",
                      "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                    )}
                  >
                    <Icon.close size={15} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Continue shopping link */}
            <div className="mt-6 lg:mt-8">
              <Link
                href="/produkty"
                className={cn(
                  "inline-flex items-center gap-2",
                  "text-[13.5px] lg:text-[14px] font-semibold text-ink",
                  "border-b border-ink pb-0.5",
                  "hover:text-brand hover:border-brand",
                  "transition-colors duration-[120ms]",
                  "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                )}
              >
                <Icon.arrow size={14} className="rotate-180" />
                {c.continueShopping}
              </Link>
            </div>
          </div>

          {/* ─────────── RIGHT — sticky summary sidebar ─────────── */}
          <aside
            className={cn(
              "mt-12 lg:mt-0 lg:sticky lg:top-[100px]",
              "bg-paper-2 rounded-lg p-6 lg:p-7"
            )}
            aria-label={c.summaryHeading}
          >
            <h2
              className="font-extrabold text-[20px] lg:text-[22px] leading-[1.1] tracking-[-0.02em] text-ink mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.summaryHeading}
            </h2>

            {/* Free-shipping progress */}
            <div className="mb-5">
              <p className="text-[12.5px] leading-[1.5] text-muted mb-2">
                {shippingFree ? (
                  <span className="text-ink font-medium">{CONTENT.cart.freeShipping.unlocked}</span>
                ) : (
                  <>
                    {CONTENT.cart.freeShipping.remainingPrefix}{" "}
                    <span className="text-ink font-semibold tabular-nums">
                      {formatPrice(remaining)}
                    </span>{" "}
                    {CONTENT.cart.freeShipping.remainingSuffix}
                  </>
                )}
              </p>
              <div className="h-1.5 bg-line rounded-full overflow-hidden" aria-hidden="true">
                <div
                  className="h-full bg-brand rounded-full transition-[width] duration-[300ms] ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Summary rows */}
            <dl className="flex flex-col gap-2.5 py-4 border-t border-line">
              <div className="flex justify-between text-[14px]">
                <dt className="text-muted">{c.subtotalLabel}</dt>
                <dd className="tabular-nums text-ink font-medium">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-[14px]">
                <dt className="text-muted">{c.shippingLabel}</dt>
                <dd className={cn(
                  "tabular-nums font-medium",
                  shippingFree ? "text-ok" : "text-ink"
                )}>
                  {shippingFree ? c.shippingFree : formatPrice(shippingCost)}
                </dd>
              </div>
            </dl>

            {/* Total */}
            <div className="flex items-baseline justify-between py-4 border-t border-line">
              <span
                className="font-extrabold text-[16px] tracking-[-0.01em] text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {c.totalLabel}
              </span>
              <span
                className="font-extrabold tabular-nums text-ink tracking-[-0.025em]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 3.2vw, 30px)",
                }}
              >
                {formatPrice(total)}
              </span>
            </div>

            {/* Checkout CTA — Shopify will own the next step */}
            <button
              type="button"
              disabled
              title="Wkrótce — checkout Shopify"
              className={cn(
                "w-full h-14 inline-flex items-center justify-center gap-2 mt-2",
                "rounded-pill text-[15px] font-semibold tracking-[-0.005em]",
                "bg-brand text-white border border-brand",
                "opacity-70 cursor-not-allowed"
              )}
            >
              {c.checkoutCtaWithAmount(formatPrice(total))}
              <Icon.arrow size={16} />
            </button>
            <p className="text-[11.5px] leading-[1.5] text-muted text-center mt-3">
              {c.checkoutNote}
            </p>

            {/* Collapsible: Promo code */}
            <div className="mt-6 pt-5 border-t border-line">
              <button
                type="button"
                onClick={() => setPromoOpen((v) => !v)}
                aria-expanded={promoOpen}
                className="w-full flex items-center justify-between text-eyebrow text-ink cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs py-1"
              >
                <span>{c.promoEyebrow}</span>
                <span className="relative w-3 h-3 shrink-0" aria-hidden="true">
                  <span className="absolute top-[5px] inset-x-0 h-px bg-ink" />
                  {!promoOpen && <span className="absolute left-[5px] inset-y-0 w-px bg-ink" />}
                </span>
              </button>
              {promoOpen && (
                <form onSubmit={handleApplyPromo} className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError(false); }}
                    placeholder={c.promoPlaceholder}
                    className={cn(
                      "flex-1 min-w-0 h-10 px-3 text-[13.5px]",
                      "bg-paper border border-line rounded-sm",
                      "outline-none focus:border-ink transition-colors duration-[120ms]"
                    )}
                  />
                  <button
                    type="submit"
                    className={cn(
                      "shrink-0 h-10 px-4 text-[12.5px] font-semibold",
                      "bg-ink text-white rounded-sm",
                      "hover:bg-ink-2 transition-colors duration-[120ms] cursor-pointer",
                      "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                    )}
                  >
                    {c.promoApply}
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11.5px] text-brand mt-2">{c.promoError}</p>
              )}
            </div>

            {/* Collapsible: Order notes */}
            <div className="mt-3 pt-5 border-t border-line">
              <button
                type="button"
                onClick={() => setNotesOpen((v) => !v)}
                aria-expanded={notesOpen}
                className="w-full flex items-center justify-between text-eyebrow text-ink cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs py-1"
              >
                <span>{c.notesEyebrow}</span>
                <span className="relative w-3 h-3 shrink-0" aria-hidden="true">
                  <span className="absolute top-[5px] inset-x-0 h-px bg-ink" />
                  {!notesOpen && <span className="absolute left-[5px] inset-y-0 w-px bg-ink" />}
                </span>
              </button>
              {notesOpen && (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder={c.notesPlaceholder}
                  className={cn(
                    "w-full mt-3 px-3 py-2.5 text-[13.5px] leading-[1.5]",
                    "bg-paper border border-line rounded-sm resize-none",
                    "outline-none focus:border-ink transition-colors duration-[120ms]"
                  )}
                />
              )}
            </div>

            {/* Trust badges */}
            <ul className="mt-6 pt-5 border-t border-line flex flex-col gap-2.5">
              {c.trustBadges.map((b, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-[12.5px] text-muted"
                >
                  <span className="text-brand shrink-0" aria-hidden="true">
                    {b.icon === "shield"  && <Icon.shield  size={14} />}
                    {b.icon === "truck"   && <Icon.truck   size={14} />}
                    {b.icon === "lock"    && <Icon.check   size={14} />}
                  </span>
                  {b.text}
                </li>
              ))}
            </ul>
          </aside>
        </section>
      )}

      {/* ── Cross-sell — only when cart has items and there's something to suggest ── */}
      {!isEmpty && crossSell.length > 0 && (
        <section className="border-t border-line px-5 lg:px-14 py-14 lg:py-[80px]">
          <div className="mb-8 lg:mb-10">
            <p className="text-eyebrow mb-3">{c.crossSellEyebrow}</p>
            <h2
              className="font-extrabold leading-[1.05] tracking-[-0.025em] text-ink"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 44px)",
              }}
            >
              {c.crossSellHeading}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {crossSell.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
