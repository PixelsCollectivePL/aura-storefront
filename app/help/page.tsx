import type { Metadata } from "next";
import Link from "next/link";
import { CONTENT } from "@/lib/content/pl";
import { AccordionItem } from "@/components/ui/AccordionItem";
import { cn } from "@/lib/utils";

const { help: c, meta } = CONTENT;

export const metadata: Metadata = {
  title: `${c.meta.title} — ${meta.siteTitle}`,
  description: c.meta.description,
};

const EMAIL = "mailto:hello@aura.coffee";

export default function HelpPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="px-5 lg:px-14 pt-10 lg:pt-[120px] pb-12 lg:pb-20 border-b border-line lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-20 lg:items-end">
        <div>
          <p className="text-eyebrow mb-4 lg:mb-[22px]">{c.eyebrow}</p>
          <h1 className="text-display lg:text-display-lg">
            {c.headingL1}
            <br />{c.headingL2}
          </h1>
        </div>
        <div className="hidden lg:block lg:pb-3">
          <p className="text-[15.5px] text-mute leading-[1.65] mb-6">{c.subtext}</p>
          <Link
            href={EMAIL}
            className={cn(
              "inline-flex items-center gap-2.5",
              "px-[22px] py-4 min-h-12",
              "text-[14px] font-medium text-ink-hi",
              "border border-ink-hi",
              "hover:bg-ink-hi hover:text-ink-inv",
              "transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
            )}
          >
            {c.emailCta}
          </Link>
        </div>
      </section>

      {/* ── Trust tiles ── */}
      <section className="px-5 lg:px-14 py-10 lg:py-24 border-b border-line">
        {/* Desktop: 4-col row */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-0 border border-line">
          {c.trustItems.map((item, i) => (
            <div
              key={i}
              className={cn(
                "px-8 py-7",
                i > 0 && "border-l border-line"
              )}
            >
              <p className="text-h3 lg:text-h3-lg mb-1.5">{item.t}</p>
              <p className="text-meta text-mute-2">{item.s}</p>
            </div>
          ))}
        </div>
        {/* Mobile: 2×2 tiles */}
        <div className="grid grid-cols-2 gap-2 lg:hidden">
          {c.trustItems.map((item, i) => (
            <div key={i} className="border border-line px-4 py-[18px]">
              <p className="text-h3 mb-1">{item.t}</p>
              <p className="text-[11.5px] text-mute-2">{item.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Content: sidebar + accordions ── */}
      <section className="px-5 lg:px-14 py-12 lg:py-[120px] lg:grid lg:grid-cols-[240px_1fr] lg:gap-20">
        {/* Sticky sidebar — desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(44px+72px+1px)]">
            <p className="text-eyebrow mb-4">Tematy</p>
            <nav aria-label="Tematy pomocy">
              {c.topics.map((t, i) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className={cn(
                    "flex justify-between items-center py-2.5",
                    "text-[14px] border-b",
                    "transition-colors duration-[120ms]",
                    "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2",
                    i === 0
                      ? "text-ink-hi font-medium border-ink-hi"
                      : "text-mute-2 font-normal border-transparent hover:text-ink-hi"
                  )}
                >
                  <span>{t.label}</span>
                  <span className="text-meta text-mute-2">{t.count}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Accordions */}
        <div>
          {/* Mobile: topic chips */}
          <div className="flex flex-wrap gap-2 mb-8 lg:hidden">
            {c.topics.map((t, i) => (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "inline-flex items-center px-3.5 py-2 min-h-9",
                  "rounded-pill border text-[12.5px]",
                  "transition-colors duration-[120ms]",
                  "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2",
                  i === 0
                    ? "bg-ink-hi text-ink-inv border-ink-hi"
                    : "bg-transparent text-ink border-line-2 hover:border-ink-hi"
                )}
              >
                {t.label}
              </Link>
            ))}
          </div>

          {c.sections.map((section, si) => (
            <div key={section.id} id={section.id} className={si > 0 ? "mt-12 lg:mt-14" : ""}>
              <p className="text-eyebrow mb-4 lg:mb-[18px]">{section.label}</p>
              {section.items.map((item) => (
                <AccordionItem
                  key={item.q}
                  question={item.q}
                  answer={item.a}
                  defaultOpen={item.defaultOpen}
                />
              ))}
            </div>
          ))}

          {/* Still need help */}
          <div className="mt-16 lg:mt-20 border-t border-line pt-10">
            <h2 className="text-h2 lg:text-h2-lg mb-2">{c.stillNeedHelp.heading}</h2>
            <p className="text-[13.5px] lg:text-[15px] text-mute mb-5">{c.stillNeedHelp.body}</p>
            <Link
              href={EMAIL}
              className={cn(
                "inline-flex items-center gap-2.5 w-full lg:w-auto justify-center lg:justify-start",
                "px-[22px] py-4 min-h-12",
                "text-[14px] font-medium text-ink-hi",
                "border border-ink-hi",
                "hover:bg-ink-hi hover:text-ink-inv",
                "transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
              )}
            >
              {c.stillNeedHelp.cta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
