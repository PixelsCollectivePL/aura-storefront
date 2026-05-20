"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { Icon } from "@/components/ui/Icon";
import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";

const { mobileMenu: c } = CONTENT;

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

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-ink-hi/40 cart-overlay-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — slides in from left */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu nawigacji"
        className={cn(
          "absolute left-0 top-0 h-full w-full",
          "bg-bg flex flex-col",
          "menu-panel-in"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 shrink-0">
          <span className="text-[18px] font-medium tracking-[0.32em] pl-[0.32em] text-ink-hi">
            AURA
          </span>
          <button
            type="button"
            data-close
            aria-label={c.closeLabel}
            onClick={onClose}
            className={cn(
              "flex items-center justify-center w-9 h-9",
              "bg-transparent border-0 cursor-pointer text-ink-hi",
              "hover:text-black transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
            )}
          >
            <Icon.close size={20} />
          </button>
        </div>

        {/* Main nav */}
        <nav aria-label="Menu główne" className="flex-1 overflow-y-auto px-5 pt-2">
          <ol>
            {c.navItems.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between py-[26px]",
                    "border-b border-line text-ink-hi no-underline",
                    "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-[-2px]"
                  )}
                >
                  <div className="flex items-baseline gap-3.5">
                    <span className="text-[11px] text-mute-2 tabular-nums w-[22px]">
                      0{i + 1}
                    </span>
                    <div>
                      <p className="text-h2" style={{ fontSize: 30 }}>{item.label}</p>
                      <p className="text-[12.5px] text-mute mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                  <Icon.chevRight size={18} className="shrink-0 text-mute-2" />
                </Link>
              </li>
            ))}
          </ol>

          {/* Utility links */}
          <div className="pt-7 flex flex-col gap-3.5">
            <button
              type="button"
              className={cn(
                "flex items-center justify-between py-2.5",
                "text-[14px] text-ink-hi cursor-pointer",
                "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon.account size={18} />
                {c.account}
              </span>
              <Icon.chevRight size={14} className="text-mute-2" />
            </button>

            <button
              type="button"
              onClick={() => { onClose(); openCart(); }}
              className={cn(
                "flex items-center justify-between py-2.5",
                "text-[14px] text-ink-hi cursor-pointer",
                "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon.bag size={18} />
                {c.basket}
              </span>
              {count > 0 && (
                <span className="text-meta text-mute-2">{c.basketCount(count)}</span>
              )}
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-5 pb-6 pt-4 border-t border-line shrink-0 flex items-center justify-between">
          <span className="text-meta text-mute-2">{c.locale}</span>
          <span className="text-meta text-mute-2">{c.city}</span>
        </div>
      </div>
    </div>
  );
}
