"use client";

import { useState, useMemo, useCallback } from "react";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterDrawer } from "@/components/product/FilterDrawer";
import { CONTENT } from "@/lib/content/pl";
import { getProducts } from "@/lib/mock/products";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const { listing: l } = CONTENT;

// [shopify-ready]: getProducts() is the data-access seam. When integrating,
// move the fetch to a server component and pass `products` in as a prop —
// this page is a Client Component and cannot `await` an async data source.
const ALL_PRODUCTS = getProducts();

// ── Roast matching helpers ─────────────────────────────────────────────
const ROAST_MATCH: Record<string, string[]> = {
  light:       ["light"],
  medium:      ["medium ·", "medium-light"],
  "medium-dark": ["medium-dark"],
  dark:        ["dark ·", "dark"],
};

function matchesRoast(product: Product, roastValue: string): boolean {
  const level = product.roastLevel.toLowerCase();
  return (ROAST_MATCH[roastValue] ?? [roastValue]).some((kw) =>
    level.startsWith(kw)
  );
}

// ── Filtering & sorting ────────────────────────────────────────────────
function applyFilters(
  products: Product[],
  category: string,
  drawerFilters: Set<string>,
  sortBy: string
): Product[] {
  let result = products;

  // Category (tag-based, single-select)
  if (category !== "all") {
    result = result.filter((p) => p.tags?.includes(category));
  }

  // Drawer filters
  if (drawerFilters.size > 0) {
    const roastActive = l.filterGroups.roast.options
      .map((o) => o.value)
      .filter((v) => drawerFilters.has(v));
    const originActive = l.filterGroups.origin.options
      .map((o) => o.value)
      .filter((v) => drawerFilters.has(v));

    result = result.filter((p) => {
      const roastOk =
        roastActive.length === 0 ||
        roastActive.some((r) => matchesRoast(p, r));
      const originOk =
        originActive.length === 0 ||
        originActive.some((o) => p.origin.includes(o));
      return roastOk && originOk;
    });
  }

  // Sort
  if (sortBy === "price-asc") {
    result = [...result].sort((a, b) => a.price.amount - b.price.amount);
  } else if (sortBy === "price-desc") {
    result = [...result].sort((a, b) => b.price.amount - a.price.amount);
  }
  // "featured" and "fresh" → keep original order

  return result;
}

// ── Page ───────────────────────────────────────────────────────────────
export default function ProduktylPage() {
  const [category, setCategory] = useState("all");
  const [drawerFilters, setDrawerFilters] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(
    () => applyFilters(ALL_PRODUCTS, category, drawerFilters, sortBy),
    [category, drawerFilters, sortBy]
  );

  // Active filter chips (category + drawer)
  const activeChips = useMemo(() => {
    const chips: Array<{ key: string; label: string }> = [];
    if (category !== "all") {
      const cat = l.categories.find((c) => c.value === category);
      if (cat) chips.push({ key: `cat:${category}`, label: cat.label });
    }
    drawerFilters.forEach((v) => {
      const opt = [
        ...l.filterGroups.roast.options,
        ...l.filterGroups.origin.options,
      ].find((o) => o.value === v);
      if (opt) chips.push({ key: v, label: opt.label });
    });
    return chips;
  }, [category, drawerFilters]);

  const drawerActiveCount = useMemo(() => drawerFilters.size, [drawerFilters]);

  const toggleDrawerFilter = useCallback((value: string) => {
    setDrawerFilters((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const resetDrawerFilters = useCallback(() => {
    setDrawerFilters(new Set());
  }, []);

  const removeChip = useCallback((key: string) => {
    if (key.startsWith("cat:")) {
      setCategory("all");
    } else {
      setDrawerFilters((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }, []);

  const clearAll = useCallback(() => {
    setCategory("all");
    setDrawerFilters(new Set());
  }, []);

  const currentSort = l.sortOptions.find((o) => o.value === sortBy);

  return (
    <>
      {/* ── Page hero ─────────────────────────────────────────────── */}
      <section className="px-5 lg:px-14 pt-10 lg:pt-16 pb-8 lg:pb-12 border-b border-line">
        <div className="flex items-end justify-between gap-10">
          <div>
            <p
              className="text-[10.5px] tracking-[0.12em] uppercase text-brand mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {l.eyebrow} · {l.count(ALL_PRODUCTS.length)}
            </p>
            <h1
              className="text-[42px] lg:text-[80px] leading-[1] tracking-[-0.03em] font-extrabold text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {l.heading}
            </h1>
          </div>
          <p className="hidden lg:block text-[14.5px] text-muted leading-[1.55] max-w-[320px] pb-2">
            {l.description}
          </p>
        </div>
        <p className="lg:hidden text-[13.5px] text-muted leading-[1.5] mt-4">
          {l.description}
        </p>
      </section>

      {/* ── Sticky filter bar ─────────────────────────────────────── */}
      <div
        className={cn(
          "sticky top-14 lg:top-[72px] z-30",
          "bg-paper/95 backdrop-blur-sm",
          "border-b border-line"
        )}
      >
        {/* Primary filter row */}
        <div className="px-5 lg:px-14 py-3 flex items-center gap-3">
          {/* Filtry button (mobile-first, shows active count) */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={cn(
              "flex items-center gap-2 h-9 px-3.5 shrink-0",
              "rounded-pill border text-[12.5px] font-medium",
              "transition-colors duration-[120ms] cursor-pointer",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
              drawerActiveCount > 0
                ? "bg-ink text-white border-ink"
                : "bg-white text-ink border-line hover:border-ink"
            )}
          >
            <Icon.filter size={13} />
            <span>
              {drawerActiveCount > 0
                ? l.filtersActiveLabel(drawerActiveCount)
                : l.filtersLabel}
            </span>
          </button>

          {/* Thin divider */}
          <div className="w-px h-5 bg-line shrink-0" />

          {/* Category chips — horizontal scroll on mobile */}
          <div
            className={cn(
              "flex items-center gap-2 flex-1 min-w-0",
              "overflow-x-auto",
              "-mr-5 pr-5 lg:mr-0 lg:pr-0",
              "lg:flex-wrap lg:overflow-visible"
            )}
            style={{ scrollbarWidth: "none" }}
          >
            {l.categories.map((cat) => {
              const active = category === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "inline-flex items-center h-9 px-3.5 rounded-pill",
                    "text-[12.5px] font-medium whitespace-nowrap shrink-0",
                    "border transition-colors duration-[120ms] cursor-pointer",
                    "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
                    active
                      ? "bg-ink text-white border-ink"
                      : "bg-white text-ink border-line hover:border-ink"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sort dropdown */}
          <div className="relative flex-shrink-0 hidden sm:block">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              aria-expanded={sortOpen}
              className={cn(
                "flex items-center gap-2 h-9 px-3.5",
                "rounded-pill border border-line bg-white",
                "text-[12.5px] text-ink whitespace-nowrap",
                "hover:border-ink transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
                "cursor-pointer"
              )}
            >
              <span
                className="text-[10px] tracking-[0.1em] uppercase text-muted"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {l.sortLabel}
              </span>
              <span>{currentSort?.label}</span>
              <Icon.chev
                size={11}
                className={cn(
                  "transition-transform duration-[120ms]",
                  sortOpen && "rotate-180"
                )}
              />
            </button>

            {sortOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSortOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className={cn(
                    "absolute right-0 top-[calc(100%+6px)] z-20",
                    "bg-paper border border-line rounded-md shadow-popover",
                    "min-w-[200px] overflow-hidden"
                  )}
                >
                  {l.sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.value);
                        setSortOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 text-[13px]",
                        "hover:bg-paper-2 transition-colors duration-[120ms] cursor-pointer",
                        "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-[-2px]",
                        opt.value === sortBy
                          ? "text-ink font-semibold"
                          : "text-muted"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Active filters chips row */}
        {activeChips.length > 0 && (
          <div className="px-5 lg:px-14 pb-3 flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] tracking-[0.1em] uppercase text-muted shrink-0"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {l.activeFiltersLabel}
            </span>
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => removeChip(chip.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 h-7 px-3",
                  "rounded-pill text-[12px] font-medium",
                  "bg-brand-soft border border-brand-soft text-brand-deep",
                  "hover:bg-brand-soft/70 transition-colors duration-[120ms] cursor-pointer",
                  "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                )}
              >
                {chip.label}
                <Icon.close size={11} />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className={cn(
                "text-[12px] text-muted underline underline-offset-4",
                "hover:text-ink transition-colors duration-[120ms] cursor-pointer",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
              )}
            >
              {l.clearAll}
            </button>
          </div>
        )}
      </div>

      {/* ── Product grid ──────────────────────────────────────────── */}
      <section className="px-5 lg:px-14 pt-8 lg:pt-12 pb-24 lg:pb-32">
        {/* Count line */}
        <p
          className="text-[11px] tracking-[0.08em] uppercase text-muted mb-6 lg:mb-8"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {l.count(filtered.length)}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-7">
            {filtered.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <p
              className="text-[28px] lg:text-[36px] font-extrabold text-ink tracking-[-0.02em] mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {l.emptyState.heading}
            </p>
            <p className="text-[14px] text-muted leading-[1.5] max-w-[280px] mb-8">
              {l.emptyState.body}
            </p>
            <button
              type="button"
              onClick={clearAll}
              className={cn(
                "inline-flex items-center justify-center h-12 px-7",
                "bg-ink text-white rounded-pill",
                "text-[14px] font-semibold tracking-[-0.005em]",
                "hover:bg-ink/80 transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
                "cursor-pointer"
              )}
            >
              {l.emptyState.clearCta}
            </button>
          </div>
        )}
      </section>

      {/* ── Mobile floating sort — backdrop (below pill) ─────────── */}
      {sortOpen && (
        <div
          className="sm:hidden fixed inset-0 z-[39]"
          onClick={() => setSortOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile floating sort pill ─────────────────────────────── */}
      <div className="sm:hidden fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto relative">
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            className={cn(
              "flex items-center gap-3 h-11 px-5",
              "bg-ink text-white rounded-pill",
              "text-[11px] tracking-[0.1em] uppercase",
              "shadow-[0_8px_24px_rgba(14,14,12,0.22)]",
              "hover:bg-ink/90 transition-colors duration-[120ms] cursor-pointer",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            )}
            style={{ fontFamily: "var(--font-mono)" }}
            aria-expanded={sortOpen}
          >
            <span>Sortuj: {currentSort?.label}</span>
            <span className="opacity-40">|</span>
            <Icon.filter size={13} />
          </button>

          {/* Sort popover — rises above pill */}
          {sortOpen && (
            <div
              className={cn(
                "absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2",
                "bg-paper border border-line rounded-xl shadow-popover",
                "overflow-hidden w-52"
              )}
            >
              {l.sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSortBy(opt.value);
                    setSortOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 text-[13px]",
                    "hover:bg-paper-2 transition-colors duration-[120ms] cursor-pointer",
                    opt.value === sortBy
                      ? "text-ink font-semibold"
                      : "text-muted"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Filter drawer ─────────────────────────────────────────── */}
      <FilterDrawer
        isOpen={drawerOpen}
        activeFilters={drawerFilters}
        onToggleFilter={toggleDrawerFilter}
        onReset={resetDrawerFilters}
        onApply={() => setDrawerOpen(false)}
        onClose={() => setDrawerOpen(false)}
        resultCount={filtered.length}
      />
    </>
  );
}
