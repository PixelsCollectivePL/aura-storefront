"use client";

import Link from "next/link";
import { AuraMark } from "@/components/brand/AuraMark";
import { CONTENT } from "@/lib/content/pl";

const { footer: f } = CONTENT;

const NAV_COLS = [
  {
    heading: "Sklep",
    links: [
      { label: "Produkty",      href: "/produkty" },
      { label: "Blendy",        href: "/blendy" },
    ],
  },
  {
    heading: "Marka",
    links: [
      { label: "O marce",  href: "/o-marce" },
      { label: "Palarnia", href: "/o-marce#palarnia" },
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
      {/* ── Desktop: brand + 3 nav cols ── */}
      <div className="hidden lg:grid grid-cols-[1.8fr_1fr_1fr_1fr] gap-14 px-14 py-16 border-b border-white/10">
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

      </div>

      {/* ── Legal bar ── */}
      <div className="px-5 lg:px-14 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p
          className="text-[11px] tracking-[0.06em] text-white/30"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          © {new Date().getFullYear()} Aura Coffee Roasters · Warszawa
        </p>
      </div>
    </footer>
  );
}
