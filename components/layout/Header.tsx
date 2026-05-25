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
// [shopify-ready]: getProducts() seam → Shopify predictiveSearch / products query
import { getProducts } from "@/lib/mock/products";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Produkty", href: "/produkty" },
  { label: "Blendy",   href: "/blendy" },
  { label: "O marce",  href: "/o-marce" },
  { label: "Kontakt",  href: "/kontakt" },
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
        <div className="hidden lg:flex items-center h-[80px] px-14 relative">
          {/* Nav — left */}
          <nav
            aria-label="Nawigacja główna"
            className="flex items-center gap-9"
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
                    "group relative inline-flex items-center h-[80px]",
                    "text-[12px] tracking-[0.16em] uppercase font-semibold",
                    "transition-colors duration-[150ms]",
                    // Underline pseudo-element
                    "after:absolute after:bottom-[22px] after:left-0 after:right-0",
                    "after:h-[2px] after:bg-brand after:rounded-pill",
                    "after:transition-transform after:duration-[220ms] after:ease-out",
                    "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs",
                    isActive
                      ? "text-ink after:scale-x-100"
                      : "text-muted hover:text-ink after:scale-x-0 after:origin-left hover:after:scale-x-100"
                  )}
                  style={{ fontFamily: "var(--font-mono)" }}
                  aria-current={isActive ? "page" : undefined}
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
            <AuraMark size={32} color="var(--aura-ink)" variant="brand" />
          </Link>

          {/* Actions — right */}
          <div className="ml-auto flex items-center gap-2">
            <DesktopIconButton
              aria-label="Otwórz wyszukiwanie"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
            >
              <Icon.search size={20} />
            </DesktopIconButton>
            <DesktopCartButton />
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
            <AuraMark size={24} color="var(--aura-ink)" variant="brand" />
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
            <MobileCartButton />
          </div>
        </div>
      </header>

      <MobileMenu    isOpen={menuOpen}   onClose={() => setMenuOpen(false)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} products={getProducts()} />
    </>
  );
}

/* ─── Desktop icon button — pill shape, border, generous hit area ─── */
function DesktopIconButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex items-center justify-center",
        "w-11 h-11 rounded-pill",
        "border border-line bg-paper text-ink",
        "transition-[background-color,border-color,color,transform] duration-[150ms]",
        "hover:border-ink hover:bg-paper-2",
        "active:scale-[0.97]",
        "cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ─── Desktop cart — same pill shell + brand badge ─── */
function DesktopCartButton() {
  const { openCart, count } = useCart();
  return (
    <DesktopIconButton
      aria-label={count > 0 ? `Otwórz koszyk (${count} produktów)` : "Otwórz koszyk"}
      onClick={openCart}
    >
      <Icon.bag size={20} />
      {count > 0 && (
        <span
          className={cn(
            "absolute -top-1 -right-1",
            "min-w-[18px] h-[18px] px-1",
            "flex items-center justify-center",
            "bg-brand text-white rounded-full",
            "text-[10px] font-bold leading-none tabular-nums",
            "ring-2 ring-paper"
          )}
          aria-hidden="true"
        >
          {count}
        </span>
      )}
    </DesktopIconButton>
  );
}

/* ─── Mobile cart — keeps original flat IconButton ─── */
function MobileCartButton() {
  const { openCart, count } = useCart();
  return (
    <IconButton
      aria-label={count > 0 ? `Otwórz koszyk (${count} produktów)` : "Otwórz koszyk"}
      size={40}
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
