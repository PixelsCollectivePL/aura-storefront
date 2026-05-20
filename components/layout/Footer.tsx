"use client";

import Link from "next/link";
import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";

const { footer: f } = CONTENT;

const SHOP_LINKS = [
  { label: "ONE", href: "/shop/one" },
  { label: "TWO", href: "/shop/two" },
  { label: "THREE", href: "/shop/three" },
  { label: "FOUR", href: "/shop/four" },
  { label: "FIVE", href: "/shop/five" },
  { label: "SIX", href: "/shop/six" },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-mute-2 mb-5">
      {children}
    </p>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith("mailto:") || href.startsWith("http");
  const Tag = isExternal ? "a" : Link;
  return (
    <Tag
      href={href}
      className="block text-[13px] text-mute-2 hover:text-ink-hi transition-colors duration-[120ms] py-1 focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
    >
      {children}
    </Tag>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line mt-auto">
      {/* ── Desktop: 4-col grid ── */}
      <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_2fr] gap-16 px-14 py-16">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="block text-[20px] font-medium tracking-[0.4em] pl-[0.4em] text-ink-hi mb-5 focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
          >
            AURA
          </Link>
          <p className="text-[13px] leading-[1.6] text-mute-2 max-w-[240px]">
            {f.tagline}
          </p>
        </div>

        {/* Shop */}
        <div>
          <FooterHeading>{f.shopHeading}</FooterHeading>
          <nav>
            {SHOP_LINKS.map((l) => (
              <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
            ))}
          </nav>
        </div>

        {/* Company */}
        <div>
          <FooterHeading>{f.companyHeading}</FooterHeading>
          <nav>
            {f.companyLinks.map((l) => (
              <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
            ))}
          </nav>
        </div>

        {/* Newsletter */}
        <div>
          <FooterHeading>{f.newsletterHeading}</FooterHeading>
          <p className="text-[13px] text-mute-2 mb-4 leading-[1.6]">
            {f.newsletterDesc}
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-0">
            <input
              type="email"
              placeholder={f.emailPlaceholder}
              aria-label="Adres e-mail"
              className={cn(
                "flex-1 min-w-0 px-4 py-3 text-[13px]",
                "border border-line border-r-0",
                "bg-bg text-ink-hi placeholder:text-mute",
                "outline-none focus:border-ink-hi",
                "transition-colors duration-[120ms]"
              )}
            />
            <button
              type="submit"
              className={cn(
                "px-5 py-3 text-[12.5px] font-medium",
                "bg-ink-hi text-ink-inv border border-ink-hi",
                "hover:bg-black transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2",
                "whitespace-nowrap cursor-pointer"
              )}
            >
              {f.subscribeCta}
            </button>
          </form>
        </div>
      </div>

      {/* ── Mobile: stacked ── */}
      <div className="lg:hidden px-5 py-12">
        <Link href="/" className="block text-[20px] font-medium tracking-[0.4em] pl-[0.4em] text-ink-hi mb-8">
          AURA
        </Link>

        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <FooterHeading>{f.shopHeading}</FooterHeading>
            <nav>
              {SHOP_LINKS.map((l) => (
                <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
              ))}
            </nav>
          </div>
          <div>
            <FooterHeading>{f.companyHeading}</FooterHeading>
            <nav>
              {f.companyLinks.slice(0, 4).map((l) => (
                <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Newsletter mobile */}
        <div className="border-t border-line pt-8">
          <FooterHeading>{f.newsletterHeading}</FooterHeading>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-0">
            <input
              type="email"
              placeholder={f.emailPlaceholder}
              aria-label="Adres e-mail"
              className="flex-1 min-w-0 px-4 py-3 text-[13px] border border-line border-r-0 bg-bg text-ink-hi placeholder:text-mute outline-none focus:border-ink-hi transition-colors duration-[120ms]"
            />
            <button
              type="submit"
              className="px-4 py-3 text-[12.5px] font-medium bg-ink-hi text-ink-inv border border-ink-hi hover:bg-black transition-colors duration-[120ms] cursor-pointer"
            >
              {f.subscribeMobileCta}
            </button>
          </form>
        </div>
      </div>

      {/* ── Legal bar ── */}
      <div className="border-t border-line px-5 lg:px-14 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="text-[11.5px] text-mute">
          © {new Date().getFullYear()} Aura Coffee Roasters
        </p>
        <div className="flex gap-5">
          {f.legalLinks.map((label) => (
            <Link
              key={label}
              href="#"
              className="text-[11.5px] text-mute hover:text-ink-hi transition-colors duration-[120ms]"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
