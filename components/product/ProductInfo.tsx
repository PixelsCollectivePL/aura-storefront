"use client";

import { useState } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { StockPill } from "@/components/ui/StockPill";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/lib/cart/cart-context";
import { CONTENT } from "@/lib/content/pl";
import type { Product } from "@/types/product";

const { pdp: c } = CONTENT;

interface ProductInfoProps {
  product: Product;
}

function computePrice(
  baseAmount: number,
  sizes: { label: string; weight: string }[],
  selectedWeight: string
): number {
  if (sizes.length === 0) return baseAmount;
  const baseWeight = parseInt(sizes[0].weight, 10);
  const target = parseInt(selectedWeight, 10);
  if (!baseWeight || !target) return baseAmount;
  return Math.round(baseAmount * (target / baseWeight));
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { addItem, openCart } = useCart();
  const [grind, setGrind] = useState(product.grindOptions[0] ?? "Whole bean");
  const [selectedSize, setSelectedSize] = useState(product.sizeOptions[0]?.label ?? "");
  const [qty, setQty] = useState(1);

  const currentSize =
    product.sizeOptions.find((s) => s.label === selectedSize) ?? product.sizeOptions[0];
  const price = currentSize
    ? computePrice(product.price.amount, product.sizeOptions, currentSize.weight)
    : product.price.amount;
  const formattedPrice = formatPrice(price, product.price.currencyCode);
  const maxQty = Math.min(10, product.quantityAvailable ?? 10);

  function handleAdd() {
    for (let i = 0; i < qty; i++) addItem(product);
    openCart();
  }

  const quickSpecs = [
    [c.specs.roast, product.roastLevel.split("·")[0].trim()],
    product.process ? [c.specs.process, product.process] : null,
    product.altitude ? [c.specs.altitude, product.altitude] : null,
  ].filter((row): row is [string, string] => row !== null).slice(0, 3);

  return (
    <>
      {/* Info panel */}
      <div className="px-5 lg:px-12 lg:pr-14 py-7 lg:py-12 flex flex-col">
        {/* Eyebrow + display name */}
        <p className="text-eyebrow">{c.eyebrow(product.lotCode)}</p>
        <h1
          className={cn(
            "font-medium leading-[0.9] text-ink-hi tracking-[-0.02em]",
            "text-[80px] lg:text-[112px]",
            "mt-3 lg:mt-4"
          )}
        >
          {product.shortName}
        </h1>
        <p className="text-[15px] lg:text-[17px] text-ink mt-3">{product.origin}</p>

        {/* Tasting notes */}
        <div className="mt-6 pb-6 border-b border-line">
          <p className="text-eyebrow mb-2.5">{c.tastingLabel}</p>
          <p className="text-[13.5px] lg:text-[14px] text-mute">
            {product.notes.join(" · ")}
          </p>
        </div>

        {/* Quick specs */}
        <div className="grid grid-cols-3 py-5 border-b border-line gap-2">
          {quickSpecs.map(([k, v]) => (
            <div key={k}>
              <p className="text-meta text-mute-2">{k}</p>
              <p className="text-h3 mt-1.5">{v}</p>
            </div>
          ))}
        </div>

        {/* Grind selector */}
        <div className="mt-7">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-eyebrow">{c.grindLabel}</span>
            <span className="text-meta text-mute-2">{grind}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.grindOptions.map((g) => (
              <Chip key={g} label={g} selected={grind === g} onClick={() => setGrind(g)} />
            ))}
          </div>
          <p className="text-[11.5px] text-mute-2 mt-2.5">{c.grindHint}</p>
        </div>

        {/* Size selector */}
        <div className="mt-6">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-eyebrow">{c.sizeLabel}</span>
            <span className="text-meta text-mute-2">{selectedSize}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {product.sizeOptions.map((s) => {
              const sPrice = computePrice(product.price.amount, product.sizeOptions, s.weight);
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSelectedSize(s.label)}
                  className={cn(
                    "border p-3 lg:p-4 text-left",
                    "transition-colors duration-[120ms] cursor-pointer",
                    "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-[-2px]",
                    selectedSize === s.label
                      ? "border-ink-hi"
                      : "border-line hover:border-line-2"
                  )}
                >
                  <p className="text-h3 lg:text-h3-lg">{s.label}</p>
                  <p className="text-[11px] text-mute-2 tabular-nums mt-0.5">
                    {formatPrice(sPrice, product.price.currencyCode)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Qty + CTA — desktop only */}
        <div className="hidden lg:flex mt-8 gap-3 items-stretch">
          <QuantitySelector value={qty} onChange={setQty} max={maxQty} />
          <Button
            variant="primary"
            size="lg"
            className="flex-1 justify-between"
            onClick={handleAdd}
            disabled={!product.availableForSale}
          >
            <span>{c.addToCartSimple}</span>
            <span className="tabular-nums opacity-70">{formattedPrice}</span>
          </Button>
        </div>

        {/* Trust items — desktop only */}
        <div className="hidden lg:flex mt-5 flex-col gap-2">
          {c.trust.map((t) => (
            <div key={t} className="flex items-center gap-2.5 text-[12.5px] text-ink">
              <Icon.check size={12} className="shrink-0" />
              {t}
            </div>
          ))}
        </div>

        {/* Stock indicator */}
        <div className="mt-5 lg:mt-6">
          <StockPill
            available={product.availableForSale}
            quantity={product.quantityAvailable}
          />
        </div>
      </div>

      {/* Mobile sticky add-to-cart bar */}
      <div
        className={cn(
          "fixed bottom-0 inset-x-0 z-40 lg:hidden",
          "bg-bg border-t border-line",
          "px-4 pt-3.5 pb-[calc(14px+env(safe-area-inset-bottom,0px))]",
          "flex gap-2.5 items-center"
        )}
      >
        <QuantitySelector value={qty} onChange={setQty} max={maxQty} />
        <Button
          variant="primary"
          size="lg"
          className="flex-1 justify-between px-4"
          onClick={handleAdd}
          disabled={!product.availableForSale}
        >
          <span>{c.addToCartSimple}</span>
          <span className="tabular-nums opacity-70">{formattedPrice}</span>
        </Button>
      </div>
    </>
  );
}
