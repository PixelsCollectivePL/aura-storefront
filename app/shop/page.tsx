"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { ProductGrid } from "@/components/product/ProductGrid";
import { cn } from "@/lib/utils";
import { MOCK_PRODUCTS } from "@/lib/mock/products";
import type { Product } from "@/types/product";

const FILTER_GROUPS = [
  {
    id: "roast",
    label: "All roasts",
    options: ["Light", "Medium", "Medium-dark", "Dark"],
  },
  {
    id: "method",
    label: "All methods",
    options: ["Filter", "Espresso", "Cafetière", "AeroPress"],
  },
  {
    id: "origin",
    label: "All origins",
    options: ["Ethiopia", "Colombia", "Kenya", "Guatemala"],
  },
  {
    id: "decaf",
    label: "Decaf only",
    options: [],
  },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "fresh", label: "Freshest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function filterProducts(products: Product[], activeFilters: Set<string>, showDecaf: boolean): Product[] {
  let result = products;

  if (showDecaf) {
    result = result.filter((p) => p.tags?.includes("decaf"));
  }

  if (activeFilters.size === 0) return result;

  return result.filter((product) => {
    const roastMatch = !["Light", "Medium", "Medium-dark", "Dark"].some((r) => activeFilters.has(r)) ||
      ["Light", "Medium", "Medium-dark", "Dark"].some((r) =>
        activeFilters.has(r) && product.roastLevel.toLowerCase().includes(r.toLowerCase())
      );

    const methodMatch = !["Filter", "Espresso", "Cafetière", "AeroPress"].some((m) => activeFilters.has(m)) ||
      ["Filter", "Espresso", "Cafetière", "AeroPress"].some((m) =>
        activeFilters.has(m) && product.tags?.includes(m.toLowerCase())
      );

    const originMatch = !["Ethiopia", "Colombia", "Kenya", "Guatemala"].some((o) => activeFilters.has(o)) ||
      ["Ethiopia", "Colombia", "Kenya", "Guatemala"].some((o) =>
        activeFilters.has(o) && product.origin.includes(o)
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

  const currentSort = SORT_OPTIONS.find((o) => o.value === sortBy);

  return (
    <div>
      {/* ── Page header ── */}
      <div className="px-5 lg:px-14 pt-10 lg:pt-14 pb-8 lg:pb-10 border-b border-line">
        <p className="text-eyebrow mb-3">The shelf</p>
        <div className="flex items-baseline justify-between">
          <h1 className="text-h2 lg:text-h2-lg">All coffees</h1>
          <p className="text-[11.5px] text-mute-2">
            {filtered.length} {filtered.length === 1 ? "coffee" : "coffees"}
          </p>
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
            {/* Roast chips */}
            {FILTER_GROUPS[0].options.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={activeFilters.has(opt)}
                onClick={() => toggleFilter(opt)}
              />
            ))}

            {/* Method chips */}
            {FILTER_GROUPS[1].options.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={activeFilters.has(opt)}
                onClick={() => toggleFilter(opt)}
              />
            ))}

            {/* Origin chips */}
            {FILTER_GROUPS[2].options.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={activeFilters.has(opt)}
                onClick={() => toggleFilter(opt)}
              />
            ))}

            {/* Decaf toggle */}
            <Chip
              label="Decaf"
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
              <span className="sm:hidden">Sort</span>
              <Icon.chev size={12} className={cn(
                "transition-transform duration-[120ms]",
                showSort && "rotate-180"
              )} />
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
                  {SORT_OPTIONS.map((opt) => (
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
        {(activeFilters.size > 0 || showDecaf) && (
          <div className="px-5 lg:px-14 pb-3 flex items-center gap-2">
            <p className="text-[11.5px] text-mute-2">
              {activeFilters.size + (showDecaf ? 1 : 0)} filter{activeFilters.size + (showDecaf ? 1 : 0) !== 1 ? "s" : ""} active
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="text-[11.5px] text-mute-2 underline underline-offset-4 hover:text-ink-hi transition-colors duration-[120ms] cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Product grid ── */}
      <div className="px-5 lg:px-14 pt-10 lg:pt-14 pb-20 lg:pb-32">
        {filtered.length > 0 ? (
          <ProductGrid products={filtered} />
        ) : (
          /* Empty state */
          <div className="text-center py-24">
            <p className="text-h3 lg:text-h3-lg mb-3">No coffees match that.</p>
            <p className="text-mute-2 text-body mb-6">
              Try a different roast level or brew method.
            </p>
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
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
