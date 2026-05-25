"use client";

import Link from "next/link";
import { AuraMark } from "@/components/brand/AuraMark";
import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";

const { footer: f } = CONTENT;

const NAV_COLS = [
  {
    heading: "Sklep",
    links: [
      { label: "Produkty",      href: "/produkty" },
      { label: "Blendy",        href: "/blendy" },
      { label: "Subskrypcja",   href: "/subskrypcja" },
    ],
  },
  {
    heading: "Marka",
    links: [
      { label: "O marce",  href: "/o-marce" },
      { label: "Palarnia", href: "/o-marce#palarnia" },
      { label: "Journal",  href: "/journal" },
    ],
  },
  {
    heading: "Pomoc",
    links: [
      { label: "FAQ",      href: "/o-marce#faq" },
      { label: "Kontakt",  href: "/kontakt" },
      { label: "Dostawa",  href: "/o-marce#dostawa" },
      { label: "Zwroty",   href: "/o-marce#zwroty" },
    ],
  },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] tracking-[0.14em] uppercase mb-5 text-white/40"
      style={{ fontFamily: "var(--font-mono)" }}
    >
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
      className="block text-[13px] text-white/50 hover:text-white transition-colors duration-[120ms] py-1 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
    >
      {children}
    </Tag>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      {/* ── Desktop: brand + 3 nav cols + newsletter ── */}
      <div className="hidden lg:grid grid-cols-[1.8fr_1fr_1fr_1fr_1.6fr] gap-14 px-14 py-16 border-b border-white/10">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="block mb-6 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4 rounded-xs w-fit"
            aria-label="Aura Coffee — strona główna"
          >
            <AuraMark size={28} color="white" />
          </Link>
          <p className="text-[13px] leading-[1.65] text-white/50 max-w-[220px]">
            {f.tagline}
          </p>
        </div>

        {/* Nav columns */}
        {NAV_COLS.map((col) => (
          <div key={col.heading}>
            <FooterHeading>{col.heading}</FooterHeading>
            <nav>
              {col.links.map((l) => (
                <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
              ))}
            </nav>
          </div>
        ))}

        {/* Newsletter */}
        <div>
          <FooterHeading>{f.newsletterHeading}</FooterHeading>
          <p className="text-[13px] text-white/50 mb-4 leading-[1.65]">
            {f.newsletterDesc}
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-0">
            <input
              type="email"
              placeholder={f.emailPlaceholder}
              aria-label="Adres e-mail"
              className={cn(
                "flex-1 min-w-0 px-4 py-3 text-[13px]",
                "border border-white/20 border-r-0 rounded-l-sm",
                "bg-white/8 text-white placeholder:text-white/30",
                "outline-none focus:border-brand",
                "transition-colors duration-[120ms]"
              )}
            />
            <button
              type="submit"
              className={cn(
                "px-5 py-3 text-[12.5px] font-semibold shrink-0",
                "bg-brand text-white border border-brand rounded-r-sm",
                "hover:bg-brand-deep hover:border-brand-deep",
                "transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
                "cursor-pointer whitespace-nowrap"
              )}
            >
              {f.subscribeCta}
            </button>
          </form>
        </div>
      </div>

      {/* ── Mobile: stacked ── */}
      <div className="lg:hidden px-5 pt-12 pb-8 border-b border-white/10">
        <Link
          href="/"
          className="block mb-8 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4 rounded-xs w-fit"
          aria-label="Aura Coffee — strona główna"
        >
          <AuraMark size={26} color="white" />
        </Link>

        <div className="grid grid-cols-2 gap-8 mb-10">
          {NAV_COLS.slice(0, 2).map((col) => (
            <div key={col.heading}>
              <FooterHeading>{col.heading}</FooterHeading>
              <nav>
                {col.links.map((l) => (
                  <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Newsletter mobile */}
        <div className="border-t border-white/10 pt-8">
          <FooterHeading>{f.newsletterHeading}</FooterHeading>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-0">
            <input
              type="email"
              placeholder={f.emailPlaceholder}
              aria-label="Adres e-mail"
              className="flex-1 min-w-0 px-4 py-3 text-[13px] border border-white/20 border-r-0 rounded-l-sm bg-white/8 text-white placeholder:text-white/30 outline-none focus:border-brand transition-colors duration-[120ms]"
            />
            <button
              type="submit"
              className="px-4 py-3 text-[12.5px] font-semibold bg-brand text-white border border-brand rounded-r-sm hover:bg-brand-deep transition-colors duration-[120ms] cursor-pointer"
            >
              {f.subscribeMobileCta}
            </button>
          </form>
        </div>
      </div>

      {/* ── Legal bar ── */}
      <div className="px-5 lg:px-14 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p
          className="text-[11px] tracking-[0.06em] text-white/30"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          © {new Date().getFullYear()} Aura Coffee Roasters · Warszawa
        </p>
        <div className="flex gap-5">
          {f.legalLinks.map((label) => (
            <Link
              key={label}
              href="#"
              className="text-[11px] text-white/30 hover:text-white/60 transition-colors duration-[120ms]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
