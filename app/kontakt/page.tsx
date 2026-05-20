import type { Metadata } from "next";
import Link from "next/link";
import { CONTENT } from "@/lib/content/pl";
import { ContactFormShell } from "@/components/contact/ContactFormShell";
import { cn } from "@/lib/utils";

const { kontakt: c, meta } = CONTENT;

export const metadata: Metadata = {
  title: `${c.meta.title} — ${meta.siteTitle}`,
  description: c.meta.description,
};

export default function KontaktPage() {
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

      {/* ── Main content: channels + form ── */}
      <section className="px-5 lg:px-14 py-14 lg:py-[100px] lg:grid lg:grid-cols-[360px_1fr] lg:gap-20 lg:items-start border-b border-line">
        {/* Channels */}
        <div className="mb-10 lg:mb-0">
          <p className="text-eyebrow mb-6">{c.channelsEyebrow}</p>
          <dl className="flex flex-col gap-6">
            {c.channels.map((ch) => (
              <div key={ch.label}>
                <dt
                  className="text-[10.5px] tracking-[0.1em] uppercase text-muted mb-1"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {ch.label}
                </dt>
                <dd>
                  {ch.href ? (
                    <Link
                      href={ch.href}
                      target={ch.href.startsWith("http") ? "_blank" : undefined}
                      rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={cn(
                        "text-[15px] font-medium text-ink",
                        "hover:text-brand transition-colors duration-[120ms]",
                        "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                      )}
                    >
                      {ch.value}
                    </Link>
                  ) : (
                    <span className="text-[15px] font-medium text-ink">{ch.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Form */}
        <div>
          <div className="mb-6">
            <p className="text-eyebrow mb-3">{c.formEyebrow}</p>
            <h2
              className="font-extrabold text-[28px] lg:text-[40px] leading-[1.05] tracking-[-0.025em] text-ink mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.formHeading}
            </h2>
          </div>
          <ContactFormShell />
        </div>
      </section>

      {/* ── Map placeholder ── */}
      <div
        className="h-[280px] lg:h-[400px] bg-paper-2 flex items-center justify-center"
        aria-hidden="true"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            rgba(14,14,12,0.025) 0 1px,
            rgba(14,14,12,0) 1px 40px
          ),
          repeating-linear-gradient(
            0deg,
            rgba(14,14,12,0.025) 0 1px,
            rgba(14,14,12,0) 1px 40px
          ),
          var(--aura-paper-2)`,
        }}
      >
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-brand mx-auto mb-3 flex items-center justify-center">
            <span className="text-white text-[12px] font-bold">A</span>
          </div>
          <p
            className="text-[11px] tracking-[0.1em] uppercase text-muted"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ul. Targowa 22 · Warszawa
          </p>
        </div>
      </div>
    </div>
  );
}
