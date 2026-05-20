import type { Metadata } from "next";
import Link from "next/link";
import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";

const { palarnia: c, meta } = CONTENT;

export const metadata: Metadata = {
  title: `${c.meta.title} — ${meta.siteTitle}`,
  description: c.meta.description,
};

export default function PalarniaPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="px-5 lg:px-14 pt-10 lg:pt-[120px] pb-12 lg:pb-20 border-b border-line lg:grid lg:grid-cols-2 lg:gap-20 lg:items-end">
        <div>
          <p className="text-eyebrow mb-4 lg:mb-6">{c.eyebrow}</p>
          <h1 className="text-display lg:text-display-lg">
            {c.heading}
            <br />{c.headingL2}
          </h1>
        </div>
        <p className="text-[15px] lg:text-[17px] text-muted leading-[1.65] mt-6 lg:mt-0 lg:max-w-[480px] lg:pb-3">
          {c.subtext}
        </p>
      </section>

      {/* ── 5 Steps ── */}
      <section className="px-5 lg:px-14 py-14 lg:py-[100px] border-b border-line">
        <p className="text-eyebrow mb-8 lg:mb-12">{c.stepsEyebrow}</p>
        <div className="flex flex-col">
          {c.steps.map((step, i) => (
            <div
              key={step.n}
              className={cn(
                "py-8 lg:py-10 border-t border-line",
                "lg:grid lg:grid-cols-[80px_1fr_2fr] lg:gap-10 lg:items-start"
              )}
            >
              {/* Number */}
              <span
                className="block text-[11px] tracking-[0.12em] text-muted mb-3 lg:mb-0 lg:pt-1"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {step.n}
              </span>

              {/* Title */}
              <h2
                className="font-extrabold text-[22px] lg:text-[28px] leading-[1.1] tracking-[-0.02em] text-ink mb-3 lg:mb-0"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.title}
              </h2>

              {/* Body */}
              <p className="text-[14px] lg:text-[15.5px] text-muted leading-[1.7] max-w-[600px]">
                {step.body}
              </p>
            </div>
          ))}
          {/* Closing border */}
          <div className="border-t border-line" />
        </div>
      </section>

      {/* ── Freshness ── */}
      <section className="px-5 lg:px-14 py-14 lg:py-[100px] border-b border-line">
        <div className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div className="mb-6 lg:mb-0">
            <p className="text-eyebrow mb-3">{c.freshnessEyebrow}</p>
            <h2
              className="font-extrabold text-[28px] lg:text-[40px] leading-[1.05] tracking-[-0.025em] text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.freshnessHeading}
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            {c.freshnessParagraphs.map((p, i) => (
              <p key={i} className="text-[14px] lg:text-[15.5px] text-muted leading-[1.75]">
                {p}
              </p>
            ))}

            {/* Freshness timeline strip */}
            <div className="mt-4 flex items-center gap-0 h-10 rounded-md overflow-hidden border border-line">
              <div className="flex-none w-1/6 h-full bg-brand-soft flex items-center justify-center">
                <span className="text-[10px] text-brand font-semibold" style={{ fontFamily: "var(--font-mono)" }}>
                  1–6d
                </span>
              </div>
              <div className="flex-1 h-full bg-brand flex items-center justify-center">
                <span className="text-[10px] text-white font-bold" style={{ fontFamily: "var(--font-mono)" }}>
                  7–30d idealne okno
                </span>
              </div>
              <div className="flex-none w-1/4 h-full bg-paper-2 flex items-center justify-center">
                <span className="text-[10px] text-muted" style={{ fontFamily: "var(--font-mono)" }}>
                  30d+
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 lg:px-14 py-14 lg:py-[100px]">
        <div className="bg-paper-2 rounded-md p-8 lg:p-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-eyebrow mb-3">{c.ctaEyebrow}</p>
            <p
              className="font-extrabold text-[32px] lg:text-[48px] leading-[1.05] tracking-[-0.025em] text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.ctaHeading}
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
