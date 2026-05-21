import type { Metadata } from "next";
import Link from "next/link";
import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";

const { oMarce: c, meta } = CONTENT;

export const metadata: Metadata = {
  title: `${c.meta.title} — ${meta.siteTitle}`,
  description: c.meta.description,
};

export default function OMarkePage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="px-5 lg:px-14 pt-10 lg:pt-16 pb-12 lg:pb-20 border-b border-line lg:grid lg:grid-cols-2 lg:gap-20 lg:items-end">
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

      {/* ── Full-bleed image placeholder ── */}
      <div
        className="h-[360px] lg:h-[620px]"
        aria-hidden="true"
        style={{
          background: `repeating-linear-gradient(
            135deg,
            rgba(14,14,12,0.03) 0 8px,
            rgba(14,14,12,0) 8px 20px
          ), var(--aura-paper-2)`,
        }}
      />

      {/* ── Story ── */}
      <section className="px-5 lg:px-14 py-16 lg:py-[120px] border-b border-line lg:grid lg:grid-cols-[1fr_2fr] lg:gap-20">
        <div className="mb-5 lg:mb-0">
          <p className="text-eyebrow">{c.storyEyebrow}</p>
        </div>
        <div className="max-w-[720px]">
          <p className="text-[22px] lg:text-[26px] leading-[1.4] text-ink mb-6 lg:mb-8 tracking-[-0.012em]">
            {c.storyLead}
          </p>
          <div className="flex flex-col gap-[18px] lg:gap-[22px] text-[15px] lg:text-[15.5px] leading-[1.75] text-ink">
            {c.storyParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="px-5 lg:px-14 py-16 lg:py-[120px] border-b border-line">
        <div className="mb-10 lg:mb-16">
          <p className="text-eyebrow mb-3">{c.valuesEyebrow}</p>
          <h2
            className="font-extrabold text-[36px] lg:text-[56px] leading-[1.05] tracking-[-0.025em] text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {c.valuesHeading}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line">
          {c.values.map((v) => (
            <div key={v.n} className="bg-paper p-6 lg:p-8">
              <p
                className="text-[10px] tracking-[0.14em] uppercase text-muted mb-5"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {v.n}
              </p>
              <h3
                className="font-extrabold text-[22px] lg:text-[26px] leading-[1.1] tracking-[-0.02em] text-ink mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {v.title}
              </h3>
              <p className="text-[14px] text-muted leading-[1.65]">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 lg:px-14 py-16 lg:py-[100px]">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-16">
          <div>
            <p className="text-eyebrow mb-4">{c.ctaEyebrow}</p>
            <p
              className="font-extrabold text-[40px] lg:text-[72px] leading-[1.0] tracking-[-0.03em] text-ink"
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
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
              "lg:mb-2"
            )}
          >
            {c.cta}
          </Link>
        </div>
      </section>
    </div>
  );
}
