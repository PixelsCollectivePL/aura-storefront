"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn, formatPrice } from "@/lib/utils";
import { searchProducts } from "@/lib/search/searchProducts";
import { CONTENT } from "@/lib/content/pl";
import type { Product } from "@/types/product";

const s = CONTENT.search;

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Product catalogue to search against.
   * Pass MOCK_PRODUCTS here; swap for Shopify query results when integrating.
   * [shopify-ready]: replace with results from Shopify predictiveSearch API.
   */
  products: Product[];
}

export function SearchOverlay({ isOpen, onClose, products }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Derived search results — pure filter over props, no async
  const results = useMemo(
    () => searchProducts(products, query),
    [products, query]
  );

  const hasQuery = query.trim().length > 0;
  const hasResults = results.length > 0;

  // Focus input + set up keyboard trap when overlay opens
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset query when overlay closes
  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  if (!isOpen) return null;

  function handleResultClick() {
    setQuery("");
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-ink/20 cart-overlay-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={s.label}
        className={cn(
          "fixed left-0 right-0 z-40",
          "top-14 lg:top-[72px]",
          "bg-paper border-b border-line shadow-popover",
          "cart-overlay-in"
        )}
      >
        {/* ── Input row ──────────────────────────────────────── */}
        <div className="px-5 lg:px-14 pt-5 lg:pt-6">
          <div className="flex items-center gap-3 border-b border-line pb-4 lg:pb-5">
            <Icon.search size={20} className="text-muted shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={s.placeholder}
              aria-label={s.label}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className={cn(
                "flex-1 min-w-0 bg-transparent outline-none",
                "text-[16px] lg:text-[18px] text-ink placeholder:text-muted",
                "leading-[1.4]"
              )}
            />
            {hasQuery && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Wyczyść"
                className={cn(
                  "flex items-center justify-center w-7 h-7 shrink-0",
                  "text-muted hover:text-ink transition-colors duration-[120ms]",
                  "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs",
                  "cursor-pointer"
                )}
              >
                <Icon.close size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={s.closeLabel}
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
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className="px-5 lg:px-14 pb-6 lg:pb-7 pt-5">
          {/* Popular chips — shown when no query */}
          {!hasQuery && (
            <div>
              <p
                className="text-[10.5px] tracking-[0.12em] uppercase text-muted mb-3"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {s.popularHeading}
              </p>
              <div className="flex flex-wrap gap-2">
                {s.popularTerms.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term.toLowerCase());
                      inputRef.current?.focus();
                    }}
                    className={cn(
                      "inline-flex items-center px-3 py-1.5",
                      "rounded-pill border border-line bg-white",
                      "text-[12.5px] text-ink",
                      "hover:border-ink transition-colors duration-[120ms] cursor-pointer",
                      "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                    )}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search results */}
          {hasQuery && hasResults && (
            <div>
              <p
                className="text-[10.5px] tracking-[0.12em] uppercase text-muted mb-3"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {s.resultsHeading}
              </p>
              <ul className="divide-y divide-line">
                {results.map((product) => (
                  <li key={product.handle}>
                    <Link
                      href={`/produkty/${product.handle}`}
                      onClick={handleResultClick}
                      className={cn(
                        "flex items-center gap-3.5 py-3.5",
                        "hover:bg-paper-2 -mx-3 px-3 rounded-md",
                        "transition-colors duration-[120ms]",
                        "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-[-2px] rounded-md"
                      )}
                    >
                      {/* Image placeholder */}
                      <div
                        className="w-10 h-12 rounded shrink-0"
                        aria-hidden="true"
                        style={{
                          background: `repeating-linear-gradient(
                            135deg,
                            rgba(14,14,12,0.04) 0 4px,
                            rgba(14,14,12,0) 4px 10px
                          ), var(--aura-paper-2)`,
                        }}
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-extrabold text-[14px] leading-[1.2] tracking-[-0.01em] text-ink"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {product.shortName}
                        </p>
                        <p className="text-[11.5px] text-muted leading-[1.4] mt-0.5">
                          {product.origin}
                        </p>
                        <p className="text-[11px] text-muted leading-[1.4] truncate">
                          {product.notes.join(", ")}
                        </p>
                      </div>

                      {/* Price */}
                      <p className="text-[13px] font-semibold text-ink tabular-nums shrink-0">
                        {formatPrice(product.price.amount, product.price.currencyCode)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Empty state */}
          {hasQuery && !hasResults && (
            <div className="py-4 text-center">
              <p
                className="font-extrabold text-[16px] tracking-[-0.01em] text-ink mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.emptyHeading}
              </p>
              <p className="text-[13px] text-muted leading-[1.55]">{s.emptyBody}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
