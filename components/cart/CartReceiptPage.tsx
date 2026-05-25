"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/lib/cart/cart-context";
import { Icon } from "@/components/ui/Icon";
import { CartReceiptLine } from "@/components/cart/CartReceiptLine";
import { CartReceiptSummary } from "@/components/cart/CartReceiptSummary";

const SHIPPING_FLAT_FEE = 12; // PLN — InPost paczkomat (matches /faq copy)

/**
 * Cart page — V2 Receipt / Paragon (Claude Design).
 *
 * Top-strip (ink/mono) → hero (massive H1) → free-ship strip (ink card) →
 *   2-col on desktop: items table left, receipt strip right.
 *   1-col stack on mobile, with sticky bottom CTA (Razem + Przejdź do kasy).
 *
 * All data wires through the existing `useCart` context — the design's
 * hardcoded CART_ITEMS is intentionally replaced. Checkout is a placeholder
 * disabled CTA until Shopify is wired up.
 */
export function CartReceiptPage() {
  const { lines, count, subtotal, updateCartLine, removeCartLine } = useCart();

  const isEmpty      = lines.length === 0;
  const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping     = isEmpty || shippingFree ? 0 : SHIPPING_FLAT_FEE;
  const total        = subtotal + shipping;
  const progress     = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining    = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Stable, deterministic-ish printed strings (no flicker between renders).
  const stamp = useMemo(() => buildStampStrings(), []);

  if (isEmpty) {
    return <ReceiptEmpty />;
  }

  return (
    <div className="bg-paper-2 lg:pb-0 pb-[112px] relative overflow-hidden">

      {/* ══════════════════════════════════════════
          TOP STAMP STRIP — ink/mono, prints the order
      ══════════════════════════════════════════ */}
      <div
        className="bg-ink text-white uppercase flex items-center justify-between gap-3 px-5 lg:px-14 py-3 lg:py-3.5"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.16em",
        }}
      >
        <span className="truncate">{stamp.orderId}</span>
        <span className="hidden md:inline opacity-95 shrink-0">★ Świeżo palona · drop 01</span>
        <span className="hidden sm:inline shrink-0 opacity-60 md:opacity-100">{stamp.printedShort}</span>
      </div>

      {/* ══════════════════════════════════════════
          HERO — eyebrow + massive H1 + count/sum strip
      ══════════════════════════════════════════ */}
      <section className="px-5 lg:px-14 pt-8 lg:pt-16 pb-6 lg:pb-8">
        <p
          className="text-brand uppercase mb-3 lg:mb-4 inline-flex items-center gap-2"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
          }}
        >
          <Image
            src="/assets/brand/aura-star.png"
            alt=""
            width={13}
            height={13}
            aria-hidden="true"
            className="star-spin"
          />
          Koszyk · paragon
        </p>
        <h1
          className="font-extrabold text-ink leading-[0.9] tracking-[-0.04em]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(56px, 10vw, 156px)",
          }}
        >
          Twoje
          <br />
          zamówienie.
        </h1>
        <div className="flex items-center gap-4 lg:gap-10 mt-5 lg:mt-7">
          <span
            className="text-muted uppercase shrink-0"
            style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em" }}
          >
            {productsLabel(count)}
          </span>
          <span className="flex-1 h-px bg-ink" aria-hidden="true" />
          <span
            className="tabular-nums font-semibold shrink-0"
            style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}
          >
            SUMA · {total},00 zł
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FREE SHIPPING — ink card with progress
      ══════════════════════════════════════════ */}
      <section className="px-5 lg:px-14 pb-8 lg:pb-8">
        <div className="bg-ink text-white rounded-[14px] px-4 lg:px-6 py-3.5 lg:py-[18px] flex items-center gap-3 lg:gap-[18px]">
          <Image
            src="/assets/brand/aura-star.png"
            alt=""
            width={28}
            height={28}
            aria-hidden="true"
            className="shrink-0 star-spin-bg"
          />
          <div
            className="uppercase shrink-0 hidden sm:block"
            style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em" }}
          >
            {shippingFree ? "Darmowa wysyłka odblokowana" : "Darmowa wysyłka"}
          </div>
          <div
            className="uppercase shrink-0 sm:hidden"
            style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.14em" }}
          >
            {shippingFree ? "Wysyłka odblokowana" : "Wysyłka"}
          </div>
          <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand transition-[width] duration-[400ms] ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span
            className="tabular-nums shrink-0"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
          >
            {shippingFree
              ? `${subtotal} / ${FREE_SHIPPING_THRESHOLD} zł · 100%`
              : `${remaining} zł do darmowej`}
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MAIN — items left, receipt strip right
      ══════════════════════════════════════════ */}
      <section className="px-5 lg:px-14 pb-12 lg:pb-20 lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-14 lg:items-start">

        {/* ─── LEFT: items listing ─── */}
        <div>
          {/* Desktop table header */}
          <div
            className="hidden lg:grid grid-cols-[40px_90px_1fr_140px_80px] gap-5 py-2.5 border-b border-ink uppercase font-semibold"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em" }}
          >
            <span>Nr</span>
            <span>Foto</span>
            <span>Pozycja</span>
            <span>Ilość</span>
            <span className="text-right">Kwota</span>
          </div>

          {/* Mobile table header */}
          <div
            className="lg:hidden flex justify-between py-2.5 border-b border-ink uppercase font-semibold"
            style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em" }}
          >
            <span>Nr · Pozycja</span>
            <span>Kwota</span>
          </div>

          {/* Lines — desktop */}
          <div className="hidden lg:block">
            {lines.map((line, i) => (
              <CartReceiptLine
                key={line.id}
                line={line}
                index={i}
                isLast={i === lines.length - 1}
                onQtyChange={updateCartLine}
                onRemove={removeCartLine}
                variant="desktop"
              />
            ))}
          </div>

          {/* Lines — mobile */}
          <div className="lg:hidden">
            {lines.map((line, i) => (
              <CartReceiptLine
                key={line.id}
                line={line}
                index={i}
                isLast={i === lines.length - 1}
                onQtyChange={updateCartLine}
                onRemove={removeCartLine}
                variant="mobile"
              />
            ))}
          </div>

          {/* Order meta box (dashed border) */}
          <div
            className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-5 mt-8 lg:mt-9 p-4 lg:p-6 bg-paper border border-dashed border-ink uppercase"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em" }}
          >
            <MetaItem label="Palenie" value={stamp.roastDate} />
            <MetaItem label="Wysyłka" value="InPost · 24–48h" />
            <MetaItem label="Numer partii" value={stamp.batch} />
            <MetaItem label="Status" value="Świeżo" valueClass="text-brand lg:hidden" />
          </div>

          {/* Continue shopping */}
          <Link
            href="/produkty"
            className="inline-flex items-center gap-2 mt-8 lg:mt-9 text-[13px] lg:text-[14px] text-ink hover:text-brand transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
          >
            ← Wróć do zakupów
          </Link>
        </div>

        {/* ─── RIGHT: receipt strip ─── */}
        {/* Desktop only — mobile gets its own block below */}
        <div className="hidden lg:block lg:sticky lg:top-[100px]">
          <CartReceiptSummary
            lines={lines}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            variant="desktop"
            showCta
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MOBILE — receipt + discount + sticky CTA
      ══════════════════════════════════════════ */}
      <section className="lg:hidden px-5 pb-6">
        <CartReceiptSummary
          lines={lines}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          variant="mobile"
          showCta={false}
        />
      </section>

      <section className="lg:hidden px-5 pb-5">
        <div
          className="flex justify-between items-center py-3.5 border-t border-b border-line uppercase"
          style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
        >
          <span>＋ Kod rabatowy</span>
          <span className="text-muted">Rozwiń</span>
        </div>
      </section>

      {/* Mobile sticky bottom CTA */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-paper border-t border-line flex items-center gap-3 px-5 py-3.5"
        style={{ boxShadow: "0 -8px 24px rgba(14,14,12,0.08)" }}
      >
        <div className="shrink-0">
          <div
            className="text-muted uppercase"
            style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em" }}
          >
            Razem
          </div>
          <div
            className="text-brand font-extrabold tabular-nums leading-none mt-0.5"
            style={{ fontFamily: "var(--font-display)", fontSize: 24 }}
          >
            {total},00 zł
          </div>
        </div>
        <button
          type="button"
          disabled
          title="Wkrótce — kasa Shopify"
          className="flex-1 h-14 inline-flex items-center justify-center gap-2 rounded-pill bg-brand text-white border border-brand text-[15px] font-bold tracking-[-0.005em] opacity-80 cursor-not-allowed"
        >
          Przejdź do kasy
          <Icon.arrow size={16} />
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────────────────────────── */

function MetaItem({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <div className="text-muted">{label}</div>
      <div
        className={`tabular-nums text-ink mt-1 ${valueClass}`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {value}
      </div>
    </div>
  );
}

/** Empty cart — receipt-style stripped down (Aura brand voice). */
function ReceiptEmpty() {
  return (
    <div className="bg-paper-2 min-h-[60vh] px-5 lg:px-14 py-16 lg:py-24 flex flex-col items-center text-center">
      <div className="relative w-[140px] h-[140px] mb-8 opacity-90" aria-hidden="true">
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

      <p
        className="text-brand uppercase mb-3"
        style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
      >
        ★ Koszyk · paragon
      </p>

      <h1
        className="font-extrabold text-ink leading-[0.95] tracking-[-0.035em] mb-5"
        style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 7vw, 88px)" }}
      >
        Pusto.
      </h1>

      <p className="text-[16px] lg:text-[17px] text-muted leading-[1.55] max-w-[420px] mb-8">
        Jeszcze nic tu nie ma. Wybierz lot, który chcesz zaparzyć w tym tygodniu.
      </p>

      <Link
        href="/produkty"
        className="inline-flex items-center gap-2 h-12 px-7 bg-brand text-white rounded-pill border border-brand text-[14.5px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[150ms] focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
      >
        Przeglądaj kawy
        <Icon.arrow size={15} />
      </Link>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Decorative stamp helpers — stable per render
   ────────────────────────────────────────────────────────────────── */

function buildStampStrings() {
  const now = new Date();
  const year = now.getFullYear();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(year, 0, 0).getTime()) / 86400000
  );
  const orderNum = String(dayOfYear).padStart(4, "0");

  // Polish long date "12 marca 2026"
  const dateLong = new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  const timeShort = new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  // Nearest upcoming Wednesday (roast day per FAQ)
  const day = now.getDay(); // 0=Sun, 3=Wed
  const daysToWed = (3 - day + 7) % 7 || 7;
  const wed = new Date(now);
  wed.setDate(now.getDate() + daysToWed);
  const roastDate = `Środa · ${wed.getDate()}.${String(wed.getMonth() + 1).padStart(2, "0")}.${year}`;

  return {
    orderId: `AURA · ZAMÓWIENIE · NR ${orderNum}/${year}`,
    printedShort: `Wydruk · ${dateLong} · ${timeShort}`,
    roastDate,
    batch: `#AC-${orderNum}`,
  };
}

function productsLabel(n: number): string {
  if (n === 1) return "1 produkt";
  if (n >= 2 && n <= 4) return `${n} produkty`;
  return `${n} produktów`;
}
