"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState(false);
  const [promoOpen,  setPromoOpen]  = useState(false);
  const [notesOpen,  setNotesOpen]  = useState(false);
  const [notes,      setNotes]      = useState("");

  const isEmpty       = lines.length === 0;
  const shippingFree  = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost  = isEmpty || shippingFree ? 0 : SHIPPING_FLAT_FEE;
  const total         = subtotal + shippingCost;
  const remaining     = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress      = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const progressRound = Math.round(progress);

  const crossSell = useMemo(() => {
    const handlesInCart = new Set(lines.map((l) => l.handle));
    return getProducts()
      .filter((p) => !handlesInCart.has(p.handle))
      .slice(0, 3);
  }, [lines]);

  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    setPromoError(promoInput.trim().length > 0);
  }

  return (
    <div>
      {/* ══════════════════════════════════════════
          HERO — eyebrow + heading + count chip
      ══════════════════════════════════════════ */}
      <section className="px-5 lg:px-14 pt-10 lg:pt-16 pb-10 lg:pb-14 border-b border-line">
        <p
          className="flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-brand mb-4 lg:mb-5"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <Image
            src="/assets/brand/aura-star.png"
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
            className="star-spin"
          />
          {c.eyebrow.replace(/^—\s?/, "")}
        </p>

        <div className="flex items-end justify-between gap-6 flex-wrap">
          <h1
            className="font-extrabold leading-[0.96] tracking-[-0.03em] text-ink"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 6.5vw, 76px)",
            }}
          >
            {isEmpty ? c.headingEmpty : c.heading}
          </h1>

          {!isEmpty && (
            <span
              className={cn(
                "inline-flex items-center gap-2 h-9 px-4 rounded-pill",
                "border border-line bg-paper",
                "text-[12px] tracking-[0.08em] uppercase text-muted tabular-nums"
              )}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand" aria-hidden="true" />
              {c.countSuffix(count)}
            </span>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EMPTY STATE
      ══════════════════════════════════════════ */}
      {isEmpty ? (
        <section className="px-5 lg:px-14 py-16 lg:py-[120px]">
          <div className="flex flex-col items-center text-center max-w-[460px] mx-auto">
            <div className="relative w-[140px] h-[140px] mb-7 opacity-90" aria-hidden="true">
              <Image
                src="/assets/brand/aura-star.png"
                alt=""
                fill
                className="object-contain star-spin-bg"
                sizes="140px"
              />
              <div className="absolute inset-0 flex items-center justify-center text-ink">
                <Icon.bag size={44} />
              </div>
            </div>
            <p className="text-[17px] lg:text-[19px] text-ink leading-[1.5] font-medium mb-3">
              {c.empty.body}
            </p>
            <Link
              href={c.empty.ctaHref}
              className={cn(
                "mt-4 inline-flex items-center justify-center gap-2 h-12 px-7",
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
            ITEMS (left) + SUMMARY ASIDE (right)
        ══════════════════════════════════════════ */
        <section className="px-5 lg:px-14 py-10 lg:py-16 lg:grid lg:grid-cols-[1fr_420px] lg:gap-16 lg:items-start">

          {/* ─────────── LEFT — line items ─────────── */}
          <div>
            <ul className="flex flex-col gap-0 -mt-1">
              {lines.map((line, idx) => {
                const lotMatch = line.handle ? line.handle : "";
                return (
                  <li
                    key={line.id}
                    className={cn(
                      "py-6 lg:py-7",
                      idx !== 0 && "border-t border-line"
                    )}
                  >
                    <div className="flex gap-4 lg:gap-6 items-start">
                      {/* Image — square with lot badge overlay */}
                      <Link
                        href={`/produkty/${line.handle}`}
                        className={cn(
                          "relative shrink-0",
                          "w-[112px] h-[112px] lg:w-[140px] lg:h-[140px]",
                          "rounded-md overflow-hidden bg-paper-2 block",
                          "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
                          "transition-transform duration-[200ms] hover:scale-[1.02]"
                        )}
                        aria-label={line.title}
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `repeating-linear-gradient(
                              135deg,
                              rgba(14,14,12,0.035) 0 5px,
                              rgba(14,14,12,0) 5px 13px
                            ), var(--aura-paper-2)`,
                          }}
                        />
                        {lotMatch && (
                          <span
                            className="absolute top-2 left-2 text-[9.5px] tracking-[0.08em] uppercase text-muted-2 bg-paper/80 backdrop-blur-sm px-1.5 py-0.5 rounded-xs"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {line.handle}
                          </span>
                        )}
                      </Link>

                      {/* Info + actions column */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5 lg:gap-2 pt-1">

                        {/* Top row — name + line total */}
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={`/produkty/${line.handle}`}
                            className="block min-w-0 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs hover:text-brand transition-colors duration-[120ms]"
                          >
                            <h3
                              className="font-extrabold text-[20px] lg:text-[24px] leading-[1.05] tracking-[-0.022em] text-ink"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              {line.title}
                            </h3>
                          </Link>
                          <p
                            className="font-extrabold text-brand tabular-nums shrink-0 text-[18px] lg:text-[22px] tracking-[-0.015em]"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {formatPrice(line.price * line.quantity, line.currencyCode)}
                          </p>
                        </div>

                        {/* Variant — mono uppercase chip-style line */}
                        <p
                          className="text-[11.5px] lg:text-[12px] tracking-[0.08em] uppercase text-muted-2"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {line.variantTitle}
                          <span className="mx-2 text-line-2">·</span>
                          <span className="tabular-nums">
                            {formatPrice(line.price, line.currencyCode)} / szt
                          </span>
                        </p>

                        {/* Qty + remove row */}
                        <div className="flex items-center justify-between gap-3 mt-3 lg:mt-2.5">
                          <QuantitySelector
                            value={line.quantity}
                            min={1}
                            max={10}
                            onChange={(q) => updateCartLine(line.id, q)}
                          />
                          <button
                            type="button"
                            onClick={() => removeCartLine(line.id)}
                            aria-label={c.removeLabel(line.title)}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 h-9",
                              "rounded-pill text-[12.5px] text-muted cursor-pointer",
                              "hover:text-ink hover:bg-paper-2",
                              "transition-colors duration-[120ms]",
                              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                            )}
                          >
                            <Icon.close size={13} />
                            <span>{c.remove}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Continue shopping — bottom of left column */}
            <div className="mt-10 pt-6 border-t border-line">
              <Link
                href="/produkty"
                className={cn(
                  "inline-flex items-center gap-2 group",
                  "text-[14px] font-semibold text-ink",
                  "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
                )}
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-pill border border-line group-hover:border-ink group-hover:bg-paper-2 transition-colors duration-[120ms]">
                  <Icon.arrow size={14} className="rotate-180" />
                </span>
                {c.continueShopping}
              </Link>
            </div>
          </div>

          {/* ─────────── RIGHT — dark premium summary aside ─────────── */}
          <aside
            className="mt-12 lg:mt-0 lg:sticky lg:top-[100px]"
            aria-label={c.summaryHeading}
          >
            <div className="rounded-lg overflow-hidden bg-ink text-white shadow-card">

              {/* Main */}
              <div className="px-6 lg:px-8 pt-7 lg:pt-8 pb-6 lg:pb-7">

                {/* Heading + count */}
                <div className="flex items-baseline justify-between mb-7">
                  <h2
                    className="font-extrabold text-[22px] lg:text-[24px] leading-[1.05] tracking-[-0.022em] text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {c.summaryHeading}
                  </h2>
                  <span
                    className="text-[10.5px] tracking-[0.14em] uppercase text-white/40 tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {count} szt
                  </span>
                </div>

                {/* Free shipping progress — inline, no nested box */}
                <div className="mb-7">
                  <div className="flex items-end justify-between gap-3 mb-2.5">
                    <p className="text-[12.5px] leading-[1.4] text-white/80 flex-1">
                      {shippingFree ? (
                        <span className="font-semibold text-ok inline-flex items-center gap-1.5">
                          <Icon.check size={13} />
                          Darmowa dostawa odblokowana
                        </span>
                      ) : (
                        <>
                          Brakuje{" "}
                          <span className="font-bold text-white tabular-nums">
                            {formatPrice(remaining)}
                          </span>{" "}
                          do darmowej wysyłki
                        </>
                      )}
                    </p>
                    <span
                      className="text-[10.5px] tracking-[0.12em] text-white/40 tabular-nums shrink-0 pb-0.5"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {progressRound}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden" aria-hidden="true">
                    <div
                      className={cn(
                        "h-full rounded-full transition-[width] duration-[400ms] ease-out",
                        shippingFree ? "bg-ok" : "bg-brand"
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Summary rows — clean dl */}
                <dl className="flex flex-col gap-3.5 pb-6 mb-6 border-b border-white/10">
                  <div className="flex justify-between items-baseline text-[14px]">
                    <dt className="text-white/60">{c.subtotalLabel}</dt>
                    <dd className="tabular-nums text-white font-medium">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between items-baseline text-[14px]">
                    <dt className="text-white/60">{c.shippingLabel}</dt>
                    <dd className={cn(
                      "tabular-nums font-medium",
                      shippingFree ? "text-ok" : "text-white"
                    )}>
                      {shippingFree ? c.shippingFree : formatPrice(shippingCost)}
                    </dd>
                  </div>
                </dl>

                {/* Total — hero brand-orange number */}
                <div className="flex items-end justify-between mb-6">
                  <span
                    className="text-[10.5px] tracking-[0.14em] uppercase text-white/50 pb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {c.totalLabel}
                  </span>
                  <span
                    className="font-extrabold tabular-nums text-brand tracking-[-0.025em] leading-none"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(34px, 4.2vw, 44px)",
                    }}
                  >
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  disabled
                  title="Wkrótce — kasa Shopify"
                  className={cn(
                    "group w-full h-14 inline-flex items-center justify-center gap-2",
                    "rounded-pill text-[15px] font-semibold tracking-[-0.005em]",
                    "bg-brand text-white border border-brand",
                    "opacity-80 cursor-not-allowed"
                  )}
                >
                  {c.checkoutCta}
                  <Icon.arrow size={16} className="transition-transform duration-[150ms] group-hover:translate-x-0.5" />
                </button>
                <p
                  className="text-[10.5px] leading-[1.5] text-white/40 text-center mt-3 px-2"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}
                >
                  {c.checkoutNote}
                </p>

                {/* Promo collapsible */}
                <div className="mt-6 pt-5 border-t border-white/10">
                  <CollapsibleHeader
                    open={promoOpen}
                    onToggle={() => setPromoOpen((v) => !v)}
                    tone="dark"
                  >
                    {c.promoEyebrow}
                  </CollapsibleHeader>
                  {promoOpen && (
                    <form onSubmit={handleApplyPromo} className="flex gap-2 mt-3 aura-reveal">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => { setPromoInput(e.target.value); setPromoError(false); }}
                        placeholder={c.promoPlaceholder}
                        className={cn(
                          "flex-1 min-w-0 h-11 px-3.5 text-[13.5px]",
                          "bg-white/5 border border-white/15 rounded-pill text-white",
                          "placeholder:text-white/30",
                          "outline-none focus:border-white/40 focus:bg-white/8 transition-colors duration-[120ms]"
                        )}
                      />
                      <button
                        type="submit"
                        className={cn(
                          "shrink-0 h-11 px-5 text-[12.5px] font-semibold",
                          "bg-white text-ink rounded-pill",
                          "hover:bg-white/90 transition-colors duration-[120ms] cursor-pointer",
                          "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                        )}
                      >
                        {c.promoApply}
                      </button>
                    </form>
                  )}
                  {promoError && (
                    <p className="text-[11.5px] text-brand mt-2 px-1">{c.promoError}</p>
                  )}
                </div>

                {/* Notes collapsible */}
                <div className="mt-3 pt-5 border-t border-white/10">
                  <CollapsibleHeader
                    open={notesOpen}
                    onToggle={() => setNotesOpen((v) => !v)}
                    tone="dark"
                  >
                    {c.notesEyebrow}
                  </CollapsibleHeader>
                  {notesOpen && (
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder={c.notesPlaceholder}
                      className={cn(
                        "w-full mt-3 px-3.5 py-3 text-[13.5px] leading-[1.5]",
                        "bg-white/5 border border-white/15 rounded-md text-white resize-none",
                        "placeholder:text-white/30",
                        "outline-none focus:border-white/40 focus:bg-white/8 transition-colors duration-[120ms]",
                        "aura-reveal"
                      )}
                    />
                  )}
                </div>

              </div>

              {/* Trust footer — lighter band on dark */}
              <div className="border-t border-white/10 bg-ink-2 px-6 lg:px-8 py-5">
                <ul className="flex flex-col gap-3">
                  {c.trustBadges.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-[12.5px] text-white/75"
                    >
                      <span
                        className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/5 border border-white/10 text-brand"
                        aria-hidden="true"
                      >
                        {b.icon === "shield" && <Icon.shield size={13} />}
                        {b.icon === "truck"  && <Icon.truck  size={13} />}
                        {b.icon === "lock"   && <Icon.check  size={13} />}
                      </span>
                      <span className="leading-[1.4]">{b.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </section>
      )}

      {/* ══════════════════════════════════════════
          CROSS-SELL — when cart has items
      ══════════════════════════════════════════ */}
      {!isEmpty && crossSell.length > 0 && (
        <section className="border-t border-line bg-paper-2 px-5 lg:px-14 py-14 lg:py-[80px]">
          <div className="mb-8 lg:mb-10">
            <p
              className="flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-brand mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <Image
                src="/assets/brand/aura-star.png"
                alt=""
                width={13}
                height={13}
                aria-hidden="true"
                className="star-spin"
              />
              {c.crossSellEyebrow.replace(/^—\s?/, "")}
            </p>
            <h2
              className="font-extrabold leading-[1.0] tracking-[-0.025em] text-ink"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(30px, 4.5vw, 52px)",
              }}
            >
              {c.crossSellHeading}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7">
            {crossSell.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────────────────────────── */

function CollapsibleHeader({
  open,
  onToggle,
  children,
  tone = "light",
}: {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={cn(
        "w-full flex items-center justify-between py-1 cursor-pointer",
        "text-[11px] tracking-[0.14em] uppercase font-semibold",
        "transition-colors duration-[120ms]",
        "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs",
        tone === "dark"
          ? "text-white/90 hover:text-brand"
          : "text-ink hover:text-brand"
      )}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span>{children}</span>
      <span className="relative w-3.5 h-3.5 shrink-0" aria-hidden="true">
        <span className="absolute top-[6px] inset-x-0 h-[1.5px] bg-current rounded-full" />
        {!open && (
          <span className="absolute left-[6px] inset-y-0 w-[1.5px] bg-current rounded-full" />
        )}
      </span>
    </button>
  );
}
