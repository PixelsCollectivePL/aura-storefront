import type { Metadata } from "next";
import Link from "next/link";
import { CONTENT } from "@/lib/content/pl";
import { cn, formatPrice } from "@/lib/utils";

const { blendy: c, meta } = CONTENT;

export const metadata: Metadata = {
  title: `${c.meta.title} — ${meta.siteTitle}`,
  description: c.meta.description,
};

export default function BlendyPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="px-5 lg:px-14 pt-10 lg:pt-16 pb-12 lg:pb-20 border-b border-line lg:grid lg:grid-cols-2 lg:gap-20 lg:items-end">
        <div>
          <p className="text-eyebrow mb-4 lg:mb-6">{c.eyebrow}</p>
          <h1 className="text-display lg:text-display-lg">{c.heading}</h1>
        </div>
        <p className="text-[15px] lg:text-[17px] text-muted leading-[1.65] mt-6 lg:mt-0 lg:max-w-[480px] lg:pb-3">
          {c.subtext}
        </p>
      </section>

      {/* ── Blend cards ── */}
      <section className="px-5 lg:px-14 py-14 lg:py-[100px] border-b border-line">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line">
          {c.blends.map((blend) => (
            <article key={blend.code} className="bg-paper p-6 lg:p-8 flex flex-col">
              {/* Header */}
              <div className="flex items-baseline justify-between mb-5">
                <span
                  className="text-[10px] tracking-[0.14em] uppercase text-muted"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {blend.code}
                </span>
                <span className="text-[13px] font-semibold text-ink tabular-nums">
                  {formatPrice(blend.price, "PLN")}
                </span>
              </div>

              {/* Image placeholder */}
              <div
                className="aspect-[3/4] mb-5 rounded-md"
                aria-hidden="true"
                style={{
                  background: `repeating-linear-gradient(
                    135deg,
                    rgba(14,14,12,0.04) 0 5px,
                    rgba(14,14,12,0) 5px 13px
                  ), var(--aura-paper-2)`,
                }}
              />

              {/* Info */}
              <div className="flex-1 flex flex-col">
                <h2
                  className="font-extrabold text-[24px] leading-[1.1] tracking-[-0.02em] text-ink mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {blend.name}
                </h2>
                <p className="text-[12px] text-brand font-semibold mb-3">{blend.tagline}</p>
                <p className="text-[13px] text-muted leading-[1.6] mb-4 flex-1">{blend.description}</p>

                {/* Notes */}
                <p className="text-[11.5px] text-muted-2 mb-3">
                  {blend.notes.join(" · ")}
                </p>

                {/* Best for */}
                <div className="flex flex-wrap gap-1.5">
                  {blend.bestFor.map((method) => (
                    <span
                      key={method}
                      className="inline-flex items-center px-2.5 py-1 rounded-pill border border-line text-[11px] text-ink"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Helper: 3 pytania → 1 blend ── */}
      <section className="px-5 lg:px-14 py-14 lg:py-[100px] border-b border-line lg:grid lg:grid-cols-[1fr_2fr] lg:gap-20 lg:items-start">
        <div className="mb-8 lg:mb-0">
          <p className="text-eyebrow mb-3">{c.helperEyebrow}</p>
          <h2
            className="font-extrabold text-[36px] lg:text-[48px] leading-[1.05] tracking-[-0.025em] text-ink mb-4 lg:mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {c.helperHeading}
          </h2>
          <p className="text-[14px] text-muted leading-[1.6]">{c.helperNote}</p>
        </div>

        <div className="flex flex-col divide-y divide-line border-t border-line">
          {c.helperItems.map((item, i) => (
            <div key={i} className="flex items-baseline gap-6 py-6">
              <span
                className="text-[10px] text-muted-2 tabular-nums w-5 shrink-0"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                0{i + 1}
              </span>
              <p className="flex-1 text-[15px] lg:text-[17px] text-ink leading-[1.4]">{item.q}</p>
              <span
                className="text-[13px] font-semibold text-brand shrink-0"
              >
                {item.a}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 lg:px-14 py-14 lg:py-[100px]">
        <div className="bg-ink text-white rounded-md p-8 lg:p-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p
              className="text-[10px] tracking-[0.14em] uppercase text-white/40 mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              — Zamów teraz
            </p>
            <p
              className="font-extrabold text-[32px] lg:text-[48px] leading-[1.05] tracking-[-0.025em]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Wszystkie blendy w sklepie.
            </p>
          </div>
          <Link
            href={c.ctaHref}
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              "h-14 px-10 rounded-pill",
              "bg-brand text-white text-[15px] font-semibold tracking-[-0.005em]",
              "hover:bg-brand-deep transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            )}
          >
            {c.cta}
          </Link>
        </div>
      </section>
    </div>
  );
}
