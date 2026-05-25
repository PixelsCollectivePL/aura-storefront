import type { Metadata } from "next";
import Link from "next/link";
import { CONTENT } from "@/lib/content/pl";
import { AccordionItem } from "@/components/ui/AccordionItem";
import { cn } from "@/lib/utils";

const { oMarce: c, palarnia: pal, faq, meta } = CONTENT;

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
              <p className="text-[15px] lg:text-[14px] text-muted leading-[1.65]">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Palarnia — process steps ── */}
      <section id="palarnia" className="px-5 lg:px-14 py-14 lg:py-[100px] border-b border-line">
        <p className="text-eyebrow mb-8 lg:mb-12">{pal.stepsEyebrow}</p>
        <div className="flex flex-col">
          {pal.steps.map((step) => (
            <div
              key={step.n}
              className={cn(
                "py-8 lg:py-10 border-t border-line",
                "lg:grid lg:grid-cols-[80px_1fr_2fr] lg:gap-10 lg:items-start"
              )}
            >
              <span
                className="block text-[11px] tracking-[0.12em] text-muted mb-3 lg:mb-0 lg:pt-1"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {step.n}
              </span>
              <h3
                className="font-extrabold text-[22px] lg:text-[28px] leading-[1.1] tracking-[-0.02em] text-ink mb-3 lg:mb-0"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.title}
              </h3>
              <p className="text-[15px] lg:text-[15.5px] text-muted leading-[1.7] max-w-[600px]">
                {step.body}
              </p>
            </div>
          ))}
          <div className="border-t border-line" />
        </div>
      </section>

      {/* ── Palarnia — freshness ── */}
      <section className="px-5 lg:px-14 py-14 lg:py-[100px] border-b border-line">
        <div className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div className="mb-6 lg:mb-0">
            <p className="text-eyebrow mb-3">{pal.freshnessEyebrow}</p>
            <h2
              className="font-extrabold text-[28px] lg:text-[40px] leading-[1.05] tracking-[-0.025em] text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {pal.freshnessHeading}
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            {pal.freshnessParagraphs.map((p, i) => (
              <p key={i} className="text-[15px] lg:text-[15.5px] text-muted leading-[1.75]">
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

      {/* ── FAQ ── */}
      <section id="faq" className="px-5 lg:px-14 py-12 lg:py-[100px] border-b border-line">
        <div className="mb-10 lg:mb-14">
          <p className="text-eyebrow mb-3">{faq.eyebrow}</p>
          <h2
            className="font-extrabold text-[36px] lg:text-[56px] leading-[1.05] tracking-[-0.025em] text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {faq.heading}
            <br />{faq.headingL2}
          </h2>
        </div>

        {/* Category nav chips */}
        <nav
          aria-label="Kategorie FAQ"
          className="flex gap-2 overflow-x-auto pb-2 mb-10 lg:mb-14 scrollbar-none"
        >
          {faq.categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={cn(
                "inline-flex items-center shrink-0 px-4 h-9",
                "rounded-pill border border-line bg-paper",
                "text-[12.5px] text-ink hover:border-ink",
                "transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              )}
            >
              {cat.label}
            </a>
          ))}
        </nav>

        {/* Accordion categories */}
        <div className="flex flex-col gap-14 lg:gap-[80px]">
          {faq.categories.map((cat) => (
            <div key={cat.id} id={cat.id}>
              <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-20">
                <div className="mb-4 lg:mb-0">
                  <p className="text-eyebrow">{cat.label}</p>
                </div>
                <div>
                  {cat.items.map((item, i) => (
                    <AccordionItem
                      key={i}
                      question={item.q}
                      answer={item.a}
                      defaultOpen={cat.id === "dostawa" && i === 0}
                    />
                  ))}
                  <div className="border-t border-line" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ bottom CTA */}
        <div className="mt-16 lg:mt-[80px] pt-10 border-t border-line flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <p className="text-[17px] lg:text-[22px] text-ink leading-[1.5]">
            Nie znalazłeś odpowiedzi?
          </p>
          <Link
            href={faq.emailHref}
            className={cn(
              "inline-flex items-center justify-center",
              "h-12 px-8 rounded-pill",
              "bg-brand text-white text-[14px] font-semibold tracking-[-0.005em]",
              "hover:bg-brand-deep transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            )}
          >
            {faq.emailCta}
          </Link>
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
