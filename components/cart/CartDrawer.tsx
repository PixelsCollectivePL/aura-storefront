"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/lib/cart/cart-context";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { CONTENT } from "@/lib/content/pl";
import { cn, formatPrice } from "@/lib/utils";

const { cart: c } = CONTENT;

export function CartDrawer() {
  const { lines, isOpen, count, subtotal, removeCartLine, updateCartLine, closeCart } =
    useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-ink/50 cart-overlay-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={c.title}
        tabIndex={-1}
        className={cn(
          "absolute right-0 top-0 h-full w-full sm:w-[420px]",
          "bg-paper shadow-panel flex flex-col",
          "cart-panel-in focus:outline-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 lg:px-6 h-14 border-b border-line shrink-0">
          <h2
            className="font-extrabold text-[17px] leading-[1.1] tracking-[-0.02em] text-ink flex items-baseline gap-1.5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {c.title}
            {count > 0 && (
              <span className="text-[11.5px] font-normal text-muted tabular-nums">
                · {count}
              </span>
            )}
          </h2>
          <IconButton
            aria-label={c.closeLabel}
            size={40}
            className="-mr-2.5"
            onClick={closeCart}
          >
            <Icon.close size={20} />
          </IconButton>
        </div>

        {/* Body */}
        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <span className="text-muted mb-4" aria-hidden="true">
              <Icon.bag size={40} />
            </span>
            <p
              className="font-extrabold text-[17px] leading-[1.1] tracking-[-0.02em] text-ink mb-1.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.empty.heading}
            </p>
            <p className="text-[13px] leading-[1.55] text-muted mb-6">{c.empty.body}</p>
            <Link
              href="/produkty"
              onClick={closeCart}
              className={cn(
                "inline-flex items-center justify-center",
                "font-semibold text-[13px] px-5 h-10",
                "rounded-pill bg-brand text-white border border-brand",
                "hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              )}
            >
              {c.empty.browseCta}
            </Link>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto px-5 lg:px-6 divide-y divide-line">
            {lines.map((line) => (
              <li key={line.id} className="flex gap-3.5 py-5">
                {/* Product image placeholder */}
                <div
                  className="w-16 h-20 rounded-md bg-paper-2 shrink-0"
                  aria-hidden="true"
                  style={{
                    background: `repeating-linear-gradient(
                      135deg,
                      rgba(14,14,12,0.035) 0 5px,
                      rgba(14,14,12,0) 5px 13px
                    ), var(--aura-paper-2)`,
                  }}
                />

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3
                        className="font-extrabold text-[14px] leading-[1.2] tracking-[-0.01em] text-ink truncate"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {line.title}
                      </h3>
                      <p className="text-[11.5px] leading-[1.4] text-muted mt-0.5">
                        {line.variantTitle}
                      </p>
                    </div>
                    <p className="text-[14px] font-semibold text-ink tabular-nums shrink-0">
                      {formatPrice(line.price * line.quantity, line.currencyCode)}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <QuantitySelector
                      value={line.quantity}
                      min={1}
                      max={10}
                      onChange={(q) => updateCartLine(line.id, q)}
                    />
                    <button
                      type="button"
                      onClick={() => removeCartLine(line.id)}
                      aria-label={c.removeLabel(line.title)}
                      className={cn(
                        "text-[11.5px] text-muted underline underline-offset-4 cursor-pointer",
                        "hover:text-ink transition-colors duration-[120ms]",
                        "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                      )}
                    >
                      {c.remove}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        {lines.length > 0 && (
          <div className="border-t border-line px-5 lg:px-6 py-5 shrink-0 space-y-4">
            {/* Free shipping progress */}
            <div>
              <p className="text-[11.5px] leading-[1.5] text-muted mb-2">
                {remaining > 0 ? (
                  <>
                    {c.freeShipping.remainingPrefix}{" "}
                    <span className="text-ink font-medium">
                      {formatPrice(remaining)}
                    </span>{" "}
                    {c.freeShipping.remainingSuffix}
                  </>
                ) : (
                  c.freeShipping.unlocked
                )}
              </p>
              <div className="h-1 bg-paper-2 rounded-full overflow-hidden" aria-hidden="true">
                <div
                  className="h-full bg-brand rounded-full transition-[width] duration-[300ms] ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-muted">{c.subtotalLabel}</span>
              <span className="text-[15px] font-semibold text-ink tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Checkout CTA — links to full cart page */}
            <Link
              href="/koszyk"
              onClick={closeCart}
              className={cn(
                "w-full h-14 inline-flex items-center justify-center gap-2",
                "rounded-pill text-[15px] font-semibold tracking-[-0.005em]",
                "bg-brand text-white border border-brand",
                "hover:bg-brand-deep hover:border-brand-deep",
                "transition-colors duration-[150ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              )}
            >
              {c.checkoutCta}
              <Icon.arrow size={16} />
            </Link>
            <p className="text-[11.5px] leading-[1.5] text-muted text-center">
              {c.checkoutNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
