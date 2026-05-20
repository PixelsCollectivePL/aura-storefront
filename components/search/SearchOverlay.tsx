"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SearchOverlay — UI shell placeholder.
 * Appears as a dropdown panel below the header.
 * No live search functionality (Phase 1 placeholder).
 * Keyboard: ESC closes, focus trap inside panel.
 * [shopify-ready]: wire up query state + results in Phase 2.
 */
export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus input on open
    const timer = setTimeout(() => inputRef.current?.focus(), 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-ink/20 cart-overlay-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — slides down from top of viewport, below header */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Wyszukaj"
        className={cn(
          "fixed left-0 right-0 z-40",
          /* positioned just below sticky header (mobile h-14 = 56px, desktop 72px) */
          "top-14 lg:top-[72px]",
          "bg-paper border-b border-line",
          "shadow-popover",
          "cart-overlay-in"
        )}
      >
        <div className="px-5 lg:px-14 py-5 lg:py-7">
          {/* Search input row */}
          <div className="flex items-center gap-3 border-b border-line pb-4 lg:pb-5">
            <Icon.search size={20} className="text-muted shrink-0" />
            <input
              ref={inputRef}
              type="search"
              placeholder="Szukaj kaw, blendów, metod parzenia…"
              aria-label="Wyszukaj"
              className={cn(
                "flex-1 min-w-0 bg-transparent outline-none",
                "text-[16px] lg:text-[18px] text-ink placeholder:text-muted",
                "font-sans leading-[1.4]"
              )}
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Zamknij wyszukiwanie"
              className={cn(
                "flex items-center justify-center w-8 h-8 shrink-0",
                "text-muted hover:text-ink transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs",
                "cursor-pointer"
              )}
            >
              <Icon.close size={18} />
            </button>
          </div>

          {/* Placeholder state — suggestions / popular */}
          <div className="pt-5 pb-2">
            <p
              className="text-[10.5px] tracking-[0.12em] uppercase text-muted mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Popularne
            </p>
            <div className="flex flex-wrap gap-2">
              {["Espresso", "Filtr", "Etiopia", "Brazylia", "Kolumbia", "Decaf"].map((term) => (
                <button
                  key={term}
                  type="button"
                  className={cn(
                    "inline-flex items-center px-3 py-1.5",
                    "rounded-pill border border-line",
                    "text-[12.5px] text-ink hover:border-ink",
                    "transition-colors duration-[120ms] cursor-pointer",
                    "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
                    "bg-white"
                  )}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
