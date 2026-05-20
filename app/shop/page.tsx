"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";
import { MOCK_PRODUCTS } from "@/lib/mock/products";
import type { Product } from "@/types/product";

const { shop: s } = CONTENT;

// Internal filter values — must match product data (roastLevel, tags, origin)
const ROAST_VALUES = s.filters.roast.map((o) => o.value);
const METHOD_VALUES = s.filters.method.map((o) => o.value);
const ORIGIN_VALUES = s.filters.origin.map((o) => o.value);

function filterProducts(
  products: Product[],
  activeFilters: Set<string>,
  showDecaf: boolean
): Product[] {
  let result = products;

  if (showDecaf) {
    result = result.filter((p) => p.tags?.includes("decaf"));
  }

  if (activeFilters.size === 0) return result;

  return result.filter((product) => {
    const roastMatch =
      !ROAST_VALUES.some((r) => activeFilters.has(r)) ||
      ROAST_VALUES.some(
        (r) =>
          activeFilters.has(r) &&
          product.roastLevel.toLowerCase().includes(r.toLowerCase())
      );

    const methodMatch =
      !METHOD_VALUES.some((m) => activeFilters.has(m)) ||
      METHOD_VALUES.some(
        (m) =>
          activeFilters.has(m) && product.tags?.includes(m.toLowerCase())
      );

    const originMatch =
      !ORIGIN_VALUES.some((o) => activeFilters.has(o)) ||
      ORIGIN_VALUES.some(
        (o) => activeFilters.has(o) && product.origin.includes(o)
      );

    return roastMatch && methodMatch && originMatch;
  });
}

export default function ShopPage() {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [showDecaf, setShowDecaf] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [showSort, setShowSort] = useState(false);

  const toggleFilter = (value: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const clearFilters = () => {
    setActiveFilters(new Set());
    setShowDecaf(false);
  };

  const filtered = filterProducts(MOCK_PRODUCTS, activeFilters, showDecaf);
  const currentSort = s.sortOptions.find((o) => o.value === sortBy);
  const activeCount = activeFilters.size + (showDecaf ? 1 : 0);

  return (
    <div>
      {/* ── Page header ── */}
      <div className="px-5 lg:px-14 pt-10 lg:pt-14 pb-8 lg:pb-10 border-b border-line">
        <p className="text-eyebrow mb-3">{s.eyebrow}</p>
        <div className="flex items-baseline justify-between">
          <h1 className="text-h2 lg:text-h2-lg">{s.heading}</h1>
          <p className="text-[11.5px] text-mute-2">{s.count(filtered.length)}</p>
        </div>
      </div>

      {/* ── Filter + Sort bar ── */}
      <div className="sticky top-[calc(44px+56px)] lg:top-[calc(44px+72px)] z-30 bg-bg border-b border-line">
        <div className="px-5 lg:px-14 py-3 flex items-center gap-3">
          {/* Filter chips — horizontal scroll on mobile */}
          <div
            className={cn(
              "flex items-center gap-2 flex-1 min-w-0",
              "overflow-x-auto scrollbar-hide",
              "-mx-5 px-5 lg:mx-0 lg:px-0",
              "lg:flex-wrap lg:overflow-visible"
            )}
          >
            {s.filters.roast.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={activeFilters.has(opt.value)}
                onClick={() => toggleFilter(opt.value)}
              />
            ))}
            {s.filters.method.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={activeFilters.has(opt.value)}
                onClick={() => toggleFilter(opt.value)}
              />
            ))}
            {s.filters.origin.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={activeFilters.has(opt.value)}
                onClick={() => toggleFilter(opt.value)}
              />
            ))}
            <Chip
              label={s.filters.decaf}
              selected={showDecaf}
              onClick={() => setShowDecaf((v) => !v)}
            />
          </div>

          {/* Sort button */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowSort((v) => !v)}
              aria-expanded={showSort}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 min-h-9",
                "text-[12.5px] text-ink-hi border border-line-2",
                "hover:border-ink-hi transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2",
                "whitespace-nowrap bg-bg cursor-pointer"
              )}
            >
              <Icon.filter size={14} />
              <span className="hidden sm:inline">{currentSort?.label}</span>
              <span className="sm:hidden">{s.sortMobileLabel}</span>
              <Icon.chev
                size={12}
                className={cn(
                  "transition-transform duration-[120ms]",
                  showSort && "rotate-180"
                )}
              />
            </button>

            {/* Sort dropdown */}
            {showSort && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSort(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-[calc(100%+4px)] z-20 bg-bg border border-line shadow-popover min-w-[180px]">
                  {s.sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                      className={cn(
                        "w-full text-left px-4 py-3 text-[13px]",
                        "hover:bg-bg-soft transition-colors duration-[120ms]",
                        "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-[-2px]",
                        "cursor-pointer",
                        opt.value === sortBy ? "text-ink-hi font-medium" : "text-mute-2"
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

        {/* Active filters summary */}
        {activeCount > 0 && (
          <div className="px-5 lg:px-14 pb-3 flex items-center gap-2">
            <p className="text-[11.5px] text-mute-2">
              {s.activeFiltersLabel(activeCount)}
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="text-[11.5px] text-mute-2 underline underline-offset-4 hover:text-ink-hi transition-colors duration-[120ms] cursor-pointer"
            >
              {s.clearAll}
            </button>
          </div>
        )}
      </div>

      {/* ── Product grid ── */}
      <div className="px-5 lg:px-14 pt-10 lg:pt-14 pb-20 lg:pb-32">
        {filtered.length > 0 ? (
          <ProductGrid products={filtered} />
        ) : (
          <div className="text-center py-24">
            <p className="text-h3 lg:text-h3-lg mb-3">{s.emptyState.heading}</p>
            <p className="text-mute-2 text-body mb-6">{s.emptyState.body}</p>
            <button
              type="button"
              onClick={clearFilters}
              className={cn(
                "inline-flex items-center justify-center",
                "px-[22px] py-4 min-h-12",
                "font-medium text-[14px] text-ink-hi",
                "border border-ink-hi",
                "hover:bg-ink-hi hover:text-ink-inv",
                "transition-colors duration-[120ms] cursor-pointer"
              )}
            >
              {s.emptyState.clearCta}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
