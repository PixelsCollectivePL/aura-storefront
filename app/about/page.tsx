import type { Metadata } from "next";
import Link from "next/link";
import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";

const { about: c, meta } = CONTENT;

export const metadata: Metadata = {
  title: `${c.meta.title} — ${meta.siteTitle}`,
  description: c.meta.description,
};

export default function AboutPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="px-5 lg:px-14 pt-10 lg:pt-16 pb-12 lg:pb-20 lg:grid lg:grid-cols-2 lg:gap-20 lg:items-end border-b border-line">
        <div>
          <p className="text-eyebrow mb-4 lg:mb-6">{c.eyebrow}</p>
          <h1 className="text-display lg:text-display-lg">
            {c.heroHeading[0]}
            <br />{c.heroHeading[1]}
            <br />{c.heroHeading[2]}
          </h1>
        </div>
        <p className="text-[15px] lg:text-[17px] text-mute leading-[1.65] mt-6 lg:mt-0 lg:max-w-[480px] lg:pb-3">
          {c.heroSubtext}
        </p>
      </section>

      {/* ── Full-bleed image ── */}
      <div className="h-[460px] lg:h-[720px] bg-bg-soft" aria-hidden="true" />

      {/* ── Story ── */}
      <section className="px-5 lg:px-14 py-16 lg:py-[120px] border-b border-line lg:grid lg:grid-cols-[1fr_2fr] lg:gap-20">
        <div className="mb-5 lg:mb-0">
          <p className="text-eyebrow">{c.storyEyebrow}</p>
        </div>
        <div className="max-w-[720px]">
          <p className="text-[22px] lg:text-[26px] leading-[1.4] text-ink-hi mb-6 lg:mb-8 tracking-[-0.012em]">
            {c.storyLead}
          </p>
          <div className="flex flex-col gap-[18px] lg:gap-[22px] text-[15px] lg:text-[15.5px] leading-[1.75] text-ink">
            {c.storyParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="lg:border-y lg:border-ink-hi">
        <div className="px-5 lg:px-14 grid grid-cols-2 lg:grid-cols-4">
          {c.stats.map((s, i) => (
            <div
              key={i}
              className={cn(
                "py-7 lg:py-14 px-4 lg:px-8",
                "border-t border-line lg:border-t-0",
                i % 2 === 1 && "border-l border-line",
                i === 2 && "lg:border-l lg:border-line",
                i >= 2 && "border-b border-line lg:border-b-0",
                i > 0 && "lg:border-l lg:border-line"
              )}
            >
              <p className={cn(
                "font-medium tabular-nums tracking-tight text-ink-hi",
                "text-[44px] lg:text-[80px]"
              )}>
                {s.n}
              </p>
              <p className="text-meta text-mute-2 mt-2 lg:mt-3">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── People ── */}
      <section className="px-5 lg:px-14 py-16 lg:py-[120px] border-b border-line">
        <div className="mb-8 lg:mb-12">
          <p className="text-eyebrow mb-3">{c.peopleEyebrow}</p>
          <h2 className="text-h1 lg:text-h1-lg">{c.peopleHeading}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3.5 lg:gap-10">
          {c.people.map((p) => (
            <div key={p.name}>
              <div className="h-[200px] lg:h-[480px] bg-bg-soft" aria-hidden="true" />
              <div className="mt-3 lg:mt-6">
                <p className="text-[16px] lg:text-[32px] font-medium text-ink-hi">{p.name}</p>
                <p className="text-meta text-mute-2 mt-1 lg:mt-1.5">{p.role}</p>
                <p className="hidden lg:block text-[14.5px] text-mute leading-[1.65] mt-4 max-w-[480px]">{p.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Origins (mobile visible, desktop hidden) ── */}
      <section className="lg:hidden px-5 py-16 border-b border-line">
        <p className="text-eyebrow mb-3">{c.originsEyebrow}</p>
        <h2 className="text-h2 mb-6">{c.originsHeading}</h2>
        <div className="h-[200px] bg-bg-soft mb-6" aria-hidden="true" />
        <dl>
          {c.origins.map(([country, farm]) => (
            <div key={country} className="flex justify-between py-3.5 border-t border-line">
              <dt className="text-[14px] text-ink-hi">{country}</dt>
              <dd className="text-meta text-mute-2">{farm}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Visit ── */}
      <section className="px-5 lg:px-14 py-16 lg:pb-[120px]">
        <div className="bg-bg-soft p-6 lg:p-20 lg:grid lg:grid-cols-2 lg:gap-20 lg:items-center">
          <div>
            <p className="text-eyebrow mb-4 lg:mb-[18px]">{c.visitEyebrow}</p>
            <h2 className="text-h1 lg:text-[56px] lg:font-medium lg:leading-[1.1] lg:tracking-[-0.02em]">
              {c.visitHeading}
            </h2>
            <p className="text-[14.5px] lg:text-[15.5px] text-mute leading-[1.65] mt-4 lg:mt-[22px] lg:max-w-[440px]">
              {c.visitBody}
            </p>
            <p className="text-[14px] tabular-nums text-ink-hi mt-5 lg:mt-7 tracking-[0]">
              {c.visitAddress}
            </p>
            <Link
              href="https://maps.google.com/?q=ul.+Targowa+22+Warszawa"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2.5 mt-5 lg:mt-7",
                "px-[22px] py-4 min-h-12",
                "text-[14px] font-medium text-ink-hi",
                "border border-ink-hi",
                "hover:bg-ink-hi hover:text-ink-inv",
                "transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
              )}
            >
              {c.visitCta}
            </Link>
          </div>
          <div className="hidden lg:block h-[400px] bg-bg" aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}
