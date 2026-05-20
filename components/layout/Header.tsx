"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/Button";
import { AuraMark } from "@/components/brand/AuraMark";
import { useCart } from "@/lib/cart/cart-context";
import { MobileMenu } from "@/components/layout/MobileMenu";
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40 bg-paper border-b border-line"
        style={{ borderBottomColor: "var(--aura-line)" }}
      >
        {/* ── Desktop ── */}
        <div className="hidden lg:flex items-center h-[72px] px-14 relative">
          <Link
            href="/"
            className="shrink-0 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4 rounded-xs"
            aria-label="Aura Coffee — strona główna"
          >
            <AuraMark size={26} color="var(--aura-ink)" />
          </Link>

          <nav
            aria-label="Nawigacja główna"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8"
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
                    "text-[14px] leading-[1.55] tracking-[-0.005em] transition-colors duration-[120ms]",
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

          <div className="ml-auto flex items-center gap-0.5">
            <IconButton aria-label="Szukaj" size={40}>
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
            size={36}
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
            <IconButton aria-label="Szukaj" size={36}>
              <Icon.search size={19} />
            </IconButton>
            <CartButton size={36} />
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function CartButton({ size }: { size: number }) {
  const { openCart, count } = useCart();

  return (
    <IconButton
      aria-label={count > 0 ? `Otwórz koszyk (${count})` : "Otwórz koszyk"}
      size={size}
      className="relative"
      onClick={openCart}
    >
      <Icon.bag size={20} />
      {count > 0 && (
        <span
          className={cn(
            "absolute top-[5px] right-[5px]",
            "min-w-[16px] h-[16px] px-1",
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
