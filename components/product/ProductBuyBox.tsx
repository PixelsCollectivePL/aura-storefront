"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { useCart } from "@/lib/cart/cart-context";
import { CONTENT } from "@/lib/content/pl";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product, SizeOption } from "@/types/product";

const { pdp: t } = CONTENT;

interface ProductBuyBoxProps {
  product: Product;
}

/**
 * ProductBuyBox — interactive buy section.
 * Handles size/grind variant selection, quantity, add-to-cart.
 * Renders a sticky add-to-cart bar on mobile.
 * [shopify-ready]: swap mock addItem for Shopify cart mutation.
 */
export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const { addToCart, openCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<SizeOption>(
    product.sizeOptions[0]
  );
  const [selectedGrind, setSelectedGrind] = useState<string>(
    product.grindOptions[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    const variantTitle = `${selectedSize.label} · ${selectedGrind}`;
    addToCart(product, variantTitle, quantity);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  }

  const priceStr = formatPrice(product.price.amount, product.price.currencyCode);
  const addLabel = added ? "Dodano ✓" : t.addToCartWithPrice(priceStr);
  const available = product.availableForSale;

  return (
    <>
      {/* ── Size selector ─────────────────────────────────────────── */}
      <VariantGroup label={t.sizeLabel} id="size-selector">
        <div className="flex flex-wrap gap-2">
          {product.sizeOptions.map((opt) => (
            <button
              key={opt.weight}
              type="button"
              onClick={() => setSelectedSize(opt)}
              aria-pressed={selectedSize.weight === opt.weight}
              className={cn(
                "h-10 px-4 rounded-pill border text-[13.5px] font-medium",
                "transition-colors duration-[120ms] cursor-pointer",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
                selectedSize.weight === opt.weight
                  ? "bg-ink text-white border-ink"
                  : "bg-white text-ink border-line hover:border-ink"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </VariantGroup>

      {/* ── Grind selector ────────────────────────────────────────── */}
      <VariantGroup label={t.grindLabel} id="grind-selector">
        <div className="flex flex-wrap gap-2">
          {product.grindOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSelectedGrind(opt)}
              aria-pressed={selectedGrind === opt}
              className={cn(
                "h-10 px-4 rounded-pill border text-[13.5px] font-medium",
                "transition-colors duration-[120ms] cursor-pointer",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
                selectedGrind === opt
                  ? "bg-ink text-white border-ink"
                  : "bg-white text-ink border-line hover:border-ink"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </VariantGroup>

      {/* ── Qty + ATC (desktop) ───────────────────────────────────── */}
      <div className="hidden lg:flex items-center gap-4 mt-2">
        <QuantitySelector
          value={quantity}
          min={1}
          max={product.quantityAvailable ?? 10}
          onChange={setQuantity}
        />
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!available}
          className={cn(
            "flex-1 h-14 inline-flex items-center justify-center gap-2",
            "rounded-pill text-[15px] font-semibold tracking-[-0.005em]",
            "transition-colors duration-[150ms] cursor-pointer",
            "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
            available
              ? added
                ? "bg-ink text-white border border-ink"
                : "bg-brand text-white border border-brand hover:bg-brand-deep hover:border-brand-deep"
              : "bg-paper-2 text-muted border border-line cursor-not-allowed"
          )}
        >
          {available ? addLabel : t.outOfStock}
        </button>
      </div>

      {/* ── Trust lines ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-2">
        <TrustLine icon={<Icon.bean size={15} />} text={t.trust.roasted} />
        <TrustLine icon={<Icon.truck size={15} />} text={t.trust.shipping} />
        <TrustLine icon={<Icon.check size={15} />} text={t.trust.returns} />
        <TrustLine icon={<Icon.package size={15} />} text={t.trust.payment} />
      </div>

      {/* ── Mobile sticky ATC ─────────────────────────────────────── */}
      <div
        className={cn(
          "lg:hidden",
          "fixed bottom-0 left-0 right-0 z-40",
          "bg-paper/95 backdrop-blur-sm border-t border-line",
          "px-4 py-3 flex items-center gap-3"
        )}
      >
        <QuantitySelector
          value={quantity}
          min={1}
          max={product.quantityAvailable ?? 10}
          onChange={setQuantity}
          className="shrink-0"
        />
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!available}
          className={cn(
            "flex-1 h-12 inline-flex items-center justify-center",
            "rounded-pill text-[14px] font-semibold tracking-[-0.005em]",
            "transition-colors duration-[150ms] cursor-pointer",
            "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
            available
              ? added
                ? "bg-ink text-white"
                : "bg-brand text-white hover:bg-brand-deep"
              : "bg-paper-2 text-muted cursor-not-allowed"
          )}
        >
          {available
            ? added
              ? "Dodano ✓"
              : t.addToCart
            : t.outOfStock}
        </button>
      </div>
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────

function VariantGroup({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        id={id}
        className="text-[11px] tracking-[0.1em] uppercase text-muted mb-2.5"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </p>
      <div role="group" aria-labelledby={id}>
        {children}
      </div>
    </div>
  );
}

function TrustLine({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[12.5px] text-muted">
      <span className="text-brand shrink-0">{icon}</span>
      {text}
    </div>
  );
}
