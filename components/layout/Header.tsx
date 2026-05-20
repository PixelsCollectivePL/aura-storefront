"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/Button";
import { AuraMark } from "@/components/brand/AuraMark";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { useCart } from "@/lib/cart/cart-context";
// [shopify-ready]: swap MOCK_PRODUCTS for a Shopify products array or useSearch hook
import { MOCK_PRODUCTS } from "@/lib/mock/products";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Produkty",  href: "/produkty" },
  { label: "Blendy",    href: "/blendy" },
  { label: "O marce",   href: "/o-marce" },
  { label: "Palarnia",  href: "/palarnia" },
  { label: "FAQ",       href: "/faq" },
  { label: "Kontakt",   href: "/kontakt" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  // Detect scroll to trigger sticky visual state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // sync on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-200",
          scrolled
            ? "bg-paper/95 backdrop-blur-sm border-b border-line/80 shadow-[0_1px_12px_rgba(14,14,12,0.06)]"
            : "bg-paper border-b border-line"
        )}
      >
        {/* ── Desktop ── */}
        <div className="hidden lg:flex items-center h-[72px] px-14 relative">
          {/* Nav — left */}
          <nav
            aria-label="Nawigacja główna"
            className="flex items-center gap-7"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href !== "/"
                  ? pathname?.startsWith(item.href)
                  : pathname === "/";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-[13.5px] leading-[1.55] tracking-[-0.005em]",
                    "transition-colors duration-[120ms]",
                    "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs",
                    isActive
                      ? "text-ink font-semibold"
                      : "text-muted hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logo — centred (absolute so it stays true-centre regardless of nav/actions widths) */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 shrink-0 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4 rounded-xs"
            aria-label="Aura Coffee — strona główna"
          >
            <AuraMark size={26} color="var(--aura-ink)" />
          </Link>

          {/* Actions — right */}
          <div className="ml-auto flex items-center gap-0.5">
            <IconButton
              aria-label="Otwórz wyszukiwanie"
              aria-expanded={searchOpen}
              size={40}
              onClick={() => setSearchOpen(true)}
            >
              <Icon.search size={19} />
            </IconButton>
            <CartButton size={40} />
          </div>
        </div>

        {/* ── Mobile ── */}
        <div className="flex lg:hidden items-center h-14 px-4 relative">
          <IconButton
            aria-label="Otwórz menu"
            aria-expanded={menuOpen}
            size={40}
            onClick={() => setMenuOpen(true)}
          >
            <Icon.menu size={22} />
          </IconButton>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4 rounded-xs"
            aria-label="Aura Coffee — strona główna"
          >
            <AuraMark size={22} color="var(--aura-ink)" />
          </Link>

          <div className="ml-auto flex items-center">
            <IconButton
              aria-label="Otwórz wyszukiwanie"
              aria-expanded={searchOpen}
              size={40}
              onClick={() => setSearchOpen(true)}
            >
              <Icon.search size={19} />
            </IconButton>
            <CartButton size={40} />
          </div>
        </div>
      </header>

      <MobileMenu    isOpen={menuOpen}   onClose={() => setMenuOpen(false)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} products={MOCK_PRODUCTS} />
    </>
  );
}

function CartButton({ size }: { size: number }) {
  const { openCart, count } = useCart();

  return (
    <IconButton
      aria-label={count > 0 ? `Otwórz koszyk (${count} produktów)` : "Otwórz koszyk"}
      size={size}
      className="relative"
      onClick={openCart}
    >
      <Icon.bag size={20} />
      {count > 0 && (
        <span
          className={cn(
            "absolute top-[6px] right-[6px]",
            "min-w-[15px] h-[15px] px-[3px]",
            "flex items-center justify-center",
            "bg-brand text-white rounded-full",
            "text-[9px] font-bold leading-none tabular-nums"
          )}
          aria-hidden="true"
        >
          {count}
        </span>
      )}
    </IconButton>
  );
}
