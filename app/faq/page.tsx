import type { Metadata } from "next";
import Link from "next/link";
import { CONTENT } from "@/lib/content/pl";
import { AccordionItem } from "@/components/ui/AccordionItem";
import { cn } from "@/lib/utils";

const { faq: c, meta } = CONTENT;

export const metadata: Metadata = {
  title: `${c.meta.title} — ${meta.siteTitle}`,
  description: c.meta.description,
};

export default function FAQPage() {
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
        <div className="mt-6 lg:mt-0 lg:pb-3">
          <p className="text-[15px] lg:text-[17px] text-muted leading-[1.65] lg:max-w-[480px] mb-5 lg:mb-7">
            {c.subtext}
          </p>
          <Link
            href={c.emailHref}
            className={cn(
              "inline-flex items-center gap-2",
              "text-[13.5px] font-semibold text-ink",
              "border-b border-ink pb-0.5",
              "hover:text-brand hover:border-brand transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            )}
          >
            {c.emailCta} →
          </Link>
        </div>
      </section>

      {/* ── FAQ categories ── */}
      <section className="px-5 lg:px-14 py-12 lg:py-[100px]">
        {/* Category nav — mobile scrollable chips */}
        <nav
          aria-label="Kategorie FAQ"
          className="flex gap-2 overflow-x-auto pb-2 mb-10 lg:mb-14 scrollbar-none"
        >
          {c.categories.map((cat) => (
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

        {/* Categories with accordions */}
        <div className="flex flex-col gap-14 lg:gap-[80px]">
          {c.categories.map((cat) => (
            <div key={cat.id} id={cat.id}>
              <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-20">
                {/* Category label */}
                <div className="mb-4 lg:mb-0">
                  <p className="text-eyebrow">{cat.label}</p>
                </div>
                {/* Accordion items */}
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

        {/* Bottom CTA */}
        <div className="mt-16 lg:mt-[100px] pt-10 border-t border-line text-center lg:text-left lg:flex lg:items-center lg:justify-between">
          <p className="text-[17px] lg:text-[22px] text-ink leading-[1.5] mb-5 lg:mb-0">
            Nie znalazłeś odpowiedzi?
          </p>
          <Link
            href={c.emailHref}
            className={cn(
              "inline-flex items-center justify-center",
              "h-12 px-8 rounded-pill",
              "bg-brand text-white text-[14px] font-semibold tracking-[-0.005em]",
              "hover:bg-brand-deep transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            )}
          >
            {c.emailCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
