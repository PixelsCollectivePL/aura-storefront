"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/cart-context";
import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";

const { nav } = CONTENT;

const NAV_ITEMS = [
  { label: nav.shop, href: "/shop" },
  { label: nav.about, href: "/about" },
  { label: nav.brewing, href: "/brewing" },
  { label: nav.journal, href: "/journal" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-bg sticky top-0 z-40">
      {/* ── Desktop ── */}
      <div className="hidden lg:flex items-center h-[72px] px-14 relative">
        <Link
          href="/"
          className="text-[22px] font-medium tracking-[0.4em] pl-[0.4em] text-ink-hi focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
        >
          AURA
        </Link>

        <nav
          aria-label="Nawigacja główna"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-9"
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
                  "text-[14px] leading-[1.55] transition-colors duration-[120ms]",
                  "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2",
                  isActive ? "text-ink-hi font-medium" : "text-mute-2 hover:text-ink-hi"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-0.5">
          <IconButton aria-label="Szukaj" size={40}>
            <Icon.search size={20} />
          </IconButton>
          <CartButton size={40} />
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="flex lg:hidden items-center h-14 px-4 relative">
        <IconButton aria-label="Otwórz menu" size={36}>
          <Icon.menu size={22} />
        </IconButton>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-[18px] font-medium tracking-[0.32em] pl-[0.32em] text-ink-hi focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
        >
          AURA
        </Link>

        <div className="ml-auto flex items-center">
          <IconButton aria-label="Szukaj" size={36}>
            <Icon.search size={20} />
          </IconButton>
          <CartButton size={36} />
        </div>
      </div>
    </header>
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
            "absolute top-1 right-1 min-w-[15px] h-[15px] px-1",
            "flex items-center justify-center",
            "bg-ink-hi text-ink-inv text-[10px] font-medium leading-none tabular-nums"
          )}
          aria-hidden="true"
        >
          {count}
        </span>
      )}
    </IconButton>
  );
}
