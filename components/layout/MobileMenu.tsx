"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { Icon } from "@/components/ui/Icon";
import { AuraMark } from "@/components/brand/AuraMark";
import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";

const m = CONTENT.mobileMenu;

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { count, openCart } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    // Focus the close button on open
    const closeBtn = panelRef.current?.querySelector<HTMLElement>("[data-close]");
    closeBtn?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cartCountLabel =
    count === 1
      ? "1 produkt"
      : count >= 2 && count <= 4
      ? `${count} produkty`
      : `${count} produktów`;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 cart-overlay-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — slides in from left, dark bg */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu nawigacji"
        className={cn(
          "absolute left-0 top-0 h-full w-full max-w-[340px]",
          "bg-ink flex flex-col",
          "menu-panel-in"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-5 shrink-0 border-b border-white/10">
          <Link
            href="/"
            onClick={onClose}
            className="focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4 rounded-xs"
            aria-label="Strona główna"
          >
            <AuraMark size={20} color="white" />
          </Link>
          <button
            type="button"
            data-close
            aria-label={m.closeLabel}
            onClick={onClose}
            className={cn(
              "flex items-center justify-center w-9 h-9",
              "bg-transparent border-0 cursor-pointer text-white/60",
              "hover:text-white transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-sm"
            )}
          >
            <Icon.close size={20} />
          </button>
        </div>

        {/* Main nav */}
        <nav aria-label="Menu główne" className="flex-1 overflow-y-auto px-5 pt-1">
          <ol>
            {m.navItems.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between py-5",
                    "border-b border-white/10 text-white no-underline",
                    "hover:text-white/80 transition-colors duration-[120ms]",
                    "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-[-2px]"
                  )}
                >
                  <div className="flex items-baseline gap-3.5">
                    <span
                      className="text-[10px] text-white/30 tabular-nums w-5"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      0{i + 1}
                    </span>
                    <div>
                      <p
                        className="text-[26px] leading-[1.1] tracking-[-0.02em] font-extrabold"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.label}
                      </p>
                      <p className="text-[12px] text-white/40 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                  <Icon.chevRight size={16} className="shrink-0 text-white/30" />
                </Link>
              </li>
            ))}
          </ol>

          {/* Utility links */}
          <div className="pt-6 pb-2 flex flex-col gap-1">
            <button
              type="button"
              className={cn(
                "flex items-center justify-between py-3",
                "text-[13.5px] text-white/50 cursor-pointer hover:text-white",
                "transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon.account size={17} />
                {m.account}
              </span>
              <Icon.chevRight size={14} className="text-white/30" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                openCart();
              }}
              className={cn(
                "flex items-center justify-between py-3",
                "text-[13.5px] text-white/50 cursor-pointer hover:text-white",
                "transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon.bag size={17} />
                {m.basket}
              </span>
              {count > 0 && (
                <span className="text-[11px] text-white/40 tabular-nums">
                  {cartCountLabel}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* CTA + footer */}
        <div className="px-5 pb-8 pt-4 border-t border-white/10 shrink-0 space-y-4">
          {/* Primary CTA */}
          <Link
            href="/produkty"
            onClick={onClose}
            className={cn(
              "flex items-center justify-center w-full h-12",
              "bg-brand text-white rounded-pill",
              "text-[14px] font-semibold tracking-[-0.005em]",
              "hover:bg-brand-deep transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            )}
          >
            Sprawdź kawy
          </Link>

          <div className="flex items-center justify-between">
            <span
              className="text-[10px] tracking-[0.1em] text-white/30"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {m.locale}
            </span>
            <span
              className="text-[10px] tracking-[0.1em] text-white/30"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {m.city}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
