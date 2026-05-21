import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { TrustStrip } from "@/components/layout/TrustStrip";
import { Starburst } from "@/components/brand/Starburst";
import { FigureRunner } from "@/components/brand/FigureRunner";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { Icon } from "@/components/ui/Icon";
import { CONTENT } from "@/lib/content/pl";
import { getFeaturedProducts } from "@/lib/mock/products";
import { cn } from "@/lib/utils";

const { homepage: hp } = CONTENT;
const { hero: h, shelf, quality: q, reviews: rv, newsletter: nl } = hp;

// [shopify-ready] getFeaturedProducts → Shopify "featured" collection query
const FEATURED = getFeaturedProducts(4);

export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════════
          HERO — dark, full-bleed, controlled layout
      ══════════════════════════════════════════ */}
      <section className="bg-ink text-white overflow-hidden">
        <div className="px-5 lg:px-20 py-12 lg:py-[88px] lg:grid lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:items-center">

          {/* ── Left: copy ── */}
          <div>
            <p
              className="text-[11px] tracking-[0.14em] uppercase text-brand mb-6 lg:mb-7"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {h.eyebrow}
            </p>

            <h1
              className="text-white leading-[0.92] tracking-[-0.035em] font-extrabold mb-5 lg:mb-7"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px, 5.5vw, 78px)",
              }}
            >
              {h.headingLine1}
              <br />
              {h.headingLine2}
              <br />
              <span className="text-brand">{h.headingAccent}</span>{" "}
              {h.headingLine3}
            </h1>

            <p className="text-[14px] lg:text-[17px] text-white/70 leading-[1.55] max-w-[340px] lg:max-w-[480px] mb-8 lg:mb-10">
              {h.subheading}
            </p>

            {/* CTAs */}
            <div className="flex gap-3 mb-10 lg:mb-14">
              <Link
                href="/produkty"
                className={cn(
                  "inline-flex items-center justify-center gap-2 h-12 lg:h-14 px-6 lg:px-7",
                  "bg-brand text-white rounded-pill border border-brand",
                  "text-[14px] lg:text-[15px] font-semibold",
                  "hover:bg-brand-deep hover:border-brand-deep",
                  "transition-colors duration-[150ms]",
                  "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
                  "flex-1 lg:flex-none"
                )}
              >
                {h.ctaPrimary}
                <Icon.arrow size={17} />
              </Link>
              <Link
                href="/blendy"
                className={cn(
                  "hidden lg:inline-flex items-center justify-center gap-2 h-14 px-7",
                  "bg-transparent text-white rounded-pill border border-white/30",
                  "text-[15px] font-semibold",
                  "hover:border-white hover:bg-white/8",
                  "transition-colors duration-[150ms]",
                  "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                )}
              >
                {h.ctaSecondary}
              </Link>
            </div>

            {/* Trust notes */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {h.trustNotes.map((note) => (
                <span
                  key={note}
                  className="flex items-center gap-1.5 text-[12px] text-white/60"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}
                >
                  <span className="text-brand text-[10px]">✦</span>
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: illustration ── */}
          <div aria-hidden="true">
            {/* Mobile: compact burst, fixed height */}
            <div className="lg:hidden relative h-[260px] flex items-center justify-center">
              <Starburst color="var(--aura-orange)" size={240} points={12} depth={0.22}>
                <FigureRunner size={118} color="#0E0E0C" />
              </Starburst>
              <div className="absolute" style={{ right: "14%", top: "8%" }}>
                <Starburst color="var(--aura-paper-2)" size={52} points={10} depth={0.26}>
                  <span
                    className="text-ink text-center font-bold"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.3 }}
                  >
                    DROP<br />01
                  </span>
                </Starburst>
              </div>
            </div>

            {/* Desktop: large burst, aspect-ratio container */}
            <div className="hidden lg:block relative" style={{ aspectRatio: "5 / 6" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Starburst color="var(--aura-orange)" size={460} points={12} depth={0.22} svgClassName="burst-rotate">
                  <FigureRunner size={230} color="#0E0E0C" />
                </Starburst>
              </div>
              {/* Accent burst */}
              <div className="absolute" style={{ right: 0, bottom: "12%" }}>
                <Starburst color="var(--aura-paper-2)" size={80} points={10} depth={0.26}>
                  <span
                    className="text-ink text-center font-bold"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.3 }}
                  >
                    DROP<br />01
                  </span>
                </Starburst>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════════ */}
      <TrustStrip />

      {/* ══════════════════════════════════════════
          FEATURED SHELF
      ══════════════════════════════════════════ */}
      <section className="bg-paper bg-grid-subtle px-5 lg:px-14 pt-16 lg:pt-[100px] pb-16 lg:pb-[100px]">
        {/* Section head */}
        <div className="flex items-end justify-between mb-8 lg:mb-10 gap-4">
          <div>
            <p
              className="text-[11px] tracking-[0.14em] uppercase text-brand mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {shelf.eyebrow}
            </p>
            <h2
              className="font-extrabold tracking-[-0.025em] leading-[0.96] text-ink"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 5vw, 56px)",
              }}
            >
              {shelf.heading}
            </h2>
          </div>
          <Link
            href="/produkty"
            className={cn(
              "hidden lg:inline-flex items-center gap-2 shrink-0",
              "text-[13px] font-semibold text-ink",
              "border-b border-ink pb-0.5",
              "hover:text-brand hover:border-brand",
              "transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
            )}
          >
            {shelf.viewAll}
            <Icon.arrow size={14} />
          </Link>
          <Link
            href="/produkty"
            className={cn(
              "lg:hidden shrink-0",
              "text-[12.5px] font-medium text-muted",
              "hover:text-ink transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
            )}
          >
            {shelf.viewAllMobile}
          </Link>
        </div>

        {/* Product grid — 4-col desktop, 2-col mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-10 lg:gap-6">
          {FEATURED.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUALITY / PROMISE — 2-col, paper bg
      ══════════════════════════════════════════ */}
      <section className="bg-paper-2 bg-grid-subtle border-t border-line px-5 lg:px-14 py-16 lg:py-[100px]">
        <div className="lg:grid lg:grid-cols-2 lg:gap-20 lg:items-center">

          {/* Left — photo placeholder */}
          <div
            className="hidden lg:block rounded-lg overflow-hidden"
            style={{ aspectRatio: "4 / 5" }}
          >
            <div
              className="w-full h-full flex items-end p-8"
              style={{
                background: `
                  repeating-linear-gradient(
                    135deg,
                    rgba(14,14,12,0.04) 0 6px,
                    rgba(14,14,12,0) 6px 14px
                  ),
                  var(--aura-paper-2)
                `,
              }}
            >
              <span
                className="text-[10px] tracking-[0.12em] uppercase text-muted"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Barista · Espresso pour
              </span>
            </div>
          </div>

          {/* Right — copy */}
          <div>
            <p
              className="text-[11px] tracking-[0.14em] uppercase text-brand mb-5 lg:mb-6"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {q.eyebrow}
            </p>
            <h2
              className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink mb-5 lg:mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 6vw, 80px)",
              }}
            >
              {q.headingL1}
              <br />
              {q.headingL2}
            </h2>
            <p className="text-[14.5px] lg:text-[16px] text-ink/70 leading-[1.6] max-w-[480px] mb-10 lg:mb-12">
              {q.body}
            </p>

            {/* Numbered points */}
            <div className="grid grid-cols-3 gap-6">
              {q.points.map((pt) => (
                <div key={pt.n}>
                  <div
                    className="text-brand font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.12em",
                    }}
                  >
                    {pt.n}
                  </div>
                  <div
                    className="font-bold text-[15px] lg:text-[16px] text-ink mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {pt.title}
                  </div>
                  <div className="text-[12.5px] text-muted leading-[1.5]">
                    {pt.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: CTA after points */}
            <Link
              href="/o-marce"
              className={cn(
                "lg:hidden mt-8 inline-flex items-center gap-2",
                "text-[13.5px] font-semibold text-ink",
                "border-b border-ink pb-0.5",
                "hover:text-brand hover:border-brand",
                "transition-colors duration-[120ms]"
              )}
            >
              Nasza historia
              <Icon.arrow size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          REVIEWS — paper-2 bg
      ══════════════════════════════════════════ */}
      <section className="bg-paper bg-grid-subtle border-t border-line px-5 lg:px-14 py-16 lg:py-[100px]">
        {/* Head */}
        <div className="flex items-end justify-between mb-8 lg:mb-12 gap-4">
          <div>
            <p
              className="text-[11px] tracking-[0.14em] uppercase text-brand mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {rv.eyebrow}
            </p>
            <h2
              className="font-extrabold tracking-[-0.025em] leading-[0.96] text-ink"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4.5vw, 56px)",
              }}
            >
              {rv.heading}
            </h2>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-line">
          {rv.items.map((review) => (
            <div
              key={review.name}
              className="bg-paper px-6 py-7 lg:px-8 lg:py-9 flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-1" aria-label="5 gwiazdek">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="var(--aura-orange)"
                    aria-hidden="true"
                  >
                    <path d="M12 2l3 6.5 7 .9-5.2 4.6L18 21l-6-3.4L6 21l1.2-7L2 9.4l7-.9z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-[15px] lg:text-[16px] font-medium text-ink leading-[1.45] tracking-[-0.01em] flex-1">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-ink">{review.name}</p>
                  <p className="text-[12px] text-muted">{review.location}</p>
                </div>
                <span
                  className="text-[10px] tracking-[0.1em] uppercase text-muted"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {review.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEWSLETTER CTA — orange bg, single strong accent
      ══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden border-t border-brand/20"
        style={{ background: "var(--aura-orange)" }}
      >
        <div className="relative z-10 px-5 lg:px-20 py-16 lg:py-[100px]">
          <div className="max-w-[680px]">
            <p
              className="text-[11px] tracking-[0.14em] uppercase text-white/70 mb-5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {nl.eyebrow}
            </p>
            <h2
              className="text-white font-extrabold leading-[0.92] tracking-[-0.035em] mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 7vw, 88px)",
              }}
            >
              {nl.headingL1}
              <br />
              {nl.headingL2}
            </h2>
            <p className="text-[15px] lg:text-[16px] text-white/85 leading-[1.55] max-w-[440px] mb-8 lg:mb-10">
              {nl.body}
            </p>

            {/* Email form — UI shell, no backend [shopify-ready] */}
            <NewsletterForm />

            <p className="mt-4 text-[11.5px] text-white/50">{nl.disclaimer}</p>
          </div>
        </div>

        {/* Decorative starburst — contained, right side */}
        <div
          className="absolute right-[-80px] top-[-40px] lg:right-[-40px] lg:top-[-40px]"
          aria-hidden="true"
          style={{ transform: "rotate(15deg)" }}
        >
          <Starburst color="rgba(255,255,255,0.12)" size={400} points={12} depth={0.2}>
            <FigureRunner size={200} color="rgba(255,255,255,0.18)" />
          </Starburst>
        </div>
      </section>
    </>
  );
}
