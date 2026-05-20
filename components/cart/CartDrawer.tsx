"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { Icon } from "@/components/ui/Icon";
import { IconButton, Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { CONTENT } from "@/lib/content/pl";
import { cn, formatPrice } from "@/lib/utils";

const { cart: c } = CONTENT;
const FREE_SHIPPING_THRESHOLD = 150;

export function CartDrawer() {
  const { items, isOpen, count, subtotal, removeItem, updateQuantity, closeCart } = useCart();
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
        className="absolute inset-0 bg-ink-hi/40 cart-overlay-in"
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
          "bg-bg shadow-panel flex flex-col",
          "cart-panel-in focus:outline-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 lg:px-6 h-14 border-b border-line shrink-0">
          <h2 className="text-h3 flex items-baseline gap-1.5">
            {c.title}
            {count > 0 && (
              <span className="text-[11.5px] font-normal text-mute-2 tabular-nums">
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
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <span className="text-mute mb-4" aria-hidden="true">
              <Icon.bag size={40} />
            </span>
            <p className="text-h3 mb-1.5">{c.empty.heading}</p>
            <p className="text-body-sm text-mute-2 mb-6">{c.empty.body}</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className={cn(
                "inline-flex items-center justify-center gap-2.5",
                "font-medium text-[12.5px] leading-[1.55] px-3.5 py-2.5 min-h-9",
                "bg-bg text-ink-hi border border-ink-hi",
                "hover:bg-ink-hi hover:text-ink-inv transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
              )}
            >
              {c.empty.browseCta}
            </Link>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto px-5 lg:px-6">
            {items.map((line) => (
              <li
                key={line.product.handle}
                className="flex gap-3.5 py-5 border-b border-line"
              >
                <div className="w-16 h-20 bg-bg-soft shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11.5px] leading-[1.4] text-mute-2">
                        {c.lotPrefix} {line.product.lotCode}
                      </p>
                      <h3 className="text-h3 truncate">{line.product.shortName}</h3>
                      <p className="text-[11.5px] leading-[1.4] text-mute-2 truncate">
                        {line.product.origin}
                      </p>
                    </div>
                    <p className="text-[14px] font-medium text-ink-hi tabular-nums shrink-0">
                      {formatPrice(
                        line.product.price.amount * line.quantity,
                        line.product.price.currencyCode
                      )}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <QuantitySelector
                      value={line.quantity}
                      onChange={(q) => updateQuantity(line.product.handle, q)}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(line.product.handle)}
                      aria-label={c.removeLabel(line.product.shortName)}
                      className={cn(
                        "text-[11.5px] text-mute-2 underline underline-offset-4 cursor-pointer",
                        "hover:text-ink-hi transition-colors duration-[120ms]",
                        "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
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
        {items.length > 0 && (
          <div className="border-t border-line px-5 lg:px-6 py-5 shrink-0 space-y-4">
            <div>
              <p className="text-[11.5px] leading-[1.5] text-mute-2 mb-2">
                {remaining > 0 ? (
                  <>
                    {c.freeShipping.remainingPrefix}{" "}
                    <span className="text-ink-hi font-medium">
                      {formatPrice(remaining)}
                    </span>{" "}
                    {c.freeShipping.remainingSuffix}
                  </>
                ) : (
                  c.freeShipping.unlocked
                )}
              </p>
              <div className="h-1 bg-bg-soft-2" aria-hidden="true">
                <div
                  className="h-full bg-ink-hi transition-[width] duration-[200ms]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-body text-mute-2">{c.subtotalLabel}</span>
              <span className="text-[15px] font-medium text-ink-hi tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>

            <Button variant="primary" size="lg" className="w-full" disabled>
              {c.checkoutCta}
            </Button>
            <p className="text-[11px] leading-[1.5] text-mute text-center">
              {c.checkoutNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
