"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";

const { listing: l } = CONTENT;

interface FilterDrawerProps {
  isOpen: boolean;
  activeFilters: Set<string>;
  onToggleFilter: (value: string) => void;
  onReset: () => void;
  onApply: () => void;
  onClose: () => void;
  resultCount: number;
}

/**
 * FilterDrawer — bottom sheet for advanced filters (roast, origin).
 * Keyboard: ESC closes, focus trap inside panel.
 */
export function FilterDrawer({
  isOpen,
  activeFilters,
  onToggleFilter,
  onReset,
  onApply,
  onClose,
  resultCount,
}: FilterDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

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
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const applyLabel =
    resultCount === 1
      ? `${l.drawerApply} (1 kawa)`
      : resultCount >= 2 && resultCount <= 4
      ? `${l.drawerApply} (${resultCount} kawy)`
      : `${l.drawerApply} (${resultCount} kaw)`;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 cart-overlay-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — slides up from bottom */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={l.drawerTitle}
        className={cn(
          "absolute bottom-0 left-0 right-0",
          "bg-paper rounded-t-[20px]",
          "max-h-[82svh] flex flex-col",
          "shadow-[0_-4px_32px_rgba(14,14,12,0.12)]",
          "menu-panel-in"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-5 shrink-0 border-b border-line">
          <h2
            className="text-[15px] font-bold text-ink tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {l.drawerTitle}
          </h2>
          <div className="flex items-center gap-3">
            {activeFilters.size > 0 && (
              <button
                type="button"
                onClick={onReset}
                className={cn(
                  "text-[12.5px] text-muted underline underline-offset-4",
                  "hover:text-ink transition-colors duration-[120ms] cursor-pointer",
                  "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
                )}
              >
                {l.drawerReset}
              </button>
            )}
            <button
              type="button"
              aria-label="Zamknij filtry"
              onClick={onClose}
              className={cn(
                "flex items-center justify-center w-9 h-9",
                "text-muted hover:text-ink transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-sm",
                "cursor-pointer"
              )}
            >
              <Icon.close size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable filter groups */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Roast */}
          <FilterGroup
            title={l.filterGroups.roast.label}
            options={l.filterGroups.roast.options}
            activeFilters={activeFilters}
            onToggle={onToggleFilter}
          />

          {/* Origin */}
          <FilterGroup
            title={l.filterGroups.origin.label}
            options={l.filterGroups.origin.options}
            activeFilters={activeFilters}
            onToggle={onToggleFilter}
          />
        </div>

        {/* Apply CTA */}
        <div className="px-5 pb-8 pt-3 border-t border-line shrink-0">
          <button
            type="button"
            onClick={onApply}
            className={cn(
              "w-full h-12",
              "inline-flex items-center justify-center",
              "bg-brand text-white rounded-pill",
              "text-[14px] font-semibold tracking-[-0.005em]",
              "hover:bg-brand-deep transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
              "cursor-pointer"
            )}
          >
            {applyLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Filter group sub-component ─────────────────────────────────────────

interface FilterGroupProps {
  title: string;
  options: Array<{ value: string; label: string }>;
  activeFilters: Set<string>;
  onToggle: (value: string) => void;
}

function FilterGroup({ title, options, activeFilters, onToggle }: FilterGroupProps) {
  return (
    <div className="pb-6 border-b border-line last:border-0 last:pb-0">
      <p
        className="text-[11px] tracking-[0.1em] uppercase text-muted mb-3"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {title}
      </p>
      <ul className="space-y-2">
        {options.map((opt) => {
          const checked = activeFilters.has(opt.value);
          return (
            <li key={opt.value}>
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => onToggle(opt.value)}
                className={cn(
                  "w-full flex items-center gap-3 py-1",
                  "text-[13.5px] text-ink text-left cursor-pointer",
                  "hover:text-brand transition-colors duration-[120ms]",
                  "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
                )}
              >
                <span
                  className={cn(
                    "w-4 h-4 rounded-[3px] shrink-0",
                    "border transition-colors duration-[120ms]",
                    "flex items-center justify-center",
                    checked
                      ? "bg-brand border-brand"
                      : "bg-white border-line"
                  )}
                >
                  {checked && (
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                {opt.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
