"use client";

import { AccountStatusPill } from "@/components/account/AccountStatusPill";
import { AccountMiniBag } from "@/components/account/AccountMiniBag";
import { AccountReceiptRow } from "@/components/account/AccountReceiptRow";
import { AcctIcon } from "@/components/account/AccountIcons";
import { cn, formatPrice } from "@/lib/utils";
import { formatDateLong, formatDateShort } from "@/lib/account/format";
import type { AccountOrder } from "@/types/account";

interface AccountOrderDetailsProps {
  order: AccountOrder;
  onBack: () => void;
}

export function AccountOrderDetails({ order, onBack }: AccountOrderDetailsProps) {
  return (
    <div>
      {/* Back row (desktop only — mobile uses MobileBar back arrow) */}
      <button
        type="button"
        onClick={onBack}
        className="hidden lg:inline-flex items-center gap-2 mb-6 text-[13px] font-semibold text-muted hover:text-ink transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
      >
        <AcctIcon.back size={14} />
        Wszystkie zamówienia
      </button>

      <header className="flex flex-wrap items-end justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <p
            className="text-brand uppercase mb-3"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
          >
            Zamówienie · {formatDateLong(order.processedAt)}
          </p>
          <h1
            className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4.5vw, 60px)" }}
          >
            {order.name}
            <br />
            <span className="text-brand">
              {order.fulfillmentStatus === "delivered" ? "dostarczone." : "w drodze."}
            </span>
          </h1>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          {order.invoiceUrl && (
            <a
              href={order.invoiceUrl}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-pill border border-line bg-paper text-ink text-[13px] font-semibold hover:border-ink transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              /* [future-integration]: invoiceUrl provided by Shopify / BaseLinker */
            >
              <AcctIcon.doc size={14} />
              Faktura PDF
            </a>
          )}
          <button
            type="button"
            /* [shopify-ready]: cartLinesAdd with order.items */
            className="inline-flex items-center justify-center h-10 px-5 rounded-pill bg-brand text-white border border-brand text-[13px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          >
            Zamów ponownie
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5">
        {/* Items receipt */}
        <section className="bg-paper border border-line rounded-md overflow-hidden">
          <div className="flex justify-between items-center px-5 lg:px-7 py-4 border-b border-line">
            <span
              className="text-muted uppercase"
              style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
            >
              Pozycje
            </span>
            <AccountStatusPill kind={order.fulfillmentStatus} size="md" />
          </div>

          {order.items.map((it, idx) => (
            <div
              key={it.id}
              className={cn(
                "flex gap-4 items-center px-5 lg:px-7 py-5",
                idx < order.items.length - 1 && "border-b border-dashed border-line"
              )}
            >
              <AccountMiniBag accent={it.accent} label={it.title.slice(0, 3).toUpperCase()} size="sm" />
              <div className="flex-1 min-w-0">
                <div
                  className="font-extrabold text-[16px] lg:text-[18px] tracking-[-0.02em] truncate"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {it.title}
                </div>
                <div
                  className="text-muted uppercase mt-1"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em" }}
                >
                  {it.variantTitle}
                </div>
              </div>
              <div
                className="text-muted tabular-nums hidden sm:block"
                style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.05em" }}
              >
                ×{it.quantity}
              </div>
              <div className="font-bold text-[17px] tabular-nums min-w-[80px] text-right">
                {formatPrice(it.price * it.quantity)}
              </div>
            </div>
          ))}

          {/* Perforation */}
          <div
            className="h-3"
            style={{
              backgroundImage:
                "radial-gradient(circle at 6px 6px, var(--aura-line) 1.5px, transparent 1.6px)",
              backgroundSize: "12px 12px",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left center",
            }}
            aria-hidden="true"
          />

          {/* Totals */}
          <div className="px-5 lg:px-7 py-5">
            <AccountReceiptRow label="Suma częściowa" value={formatPrice(order.subtotalPrice)} />
            <AccountReceiptRow
              label="Dostawa"
              value={
                order.shippingPrice === 0 ? (
                  <span className="text-brand font-bold">Gratis</span>
                ) : (
                  formatPrice(order.shippingPrice)
                )
              }
            />
            <div className="flex justify-between items-baseline pt-5 mt-3 border-t border-ink">
              <span
                className="font-extrabold tracking-[-0.02em] text-[18px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Razem
              </span>
              <span
                className="font-extrabold tabular-nums tracking-[-0.025em] text-[28px] lg:text-[34px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </div>
        </section>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Tracking */}
          {order.tracking && (
            <section className="bg-ink text-white rounded-md p-5 lg:p-6">
              <p
                className="text-brand uppercase mb-2"
                style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
              >
                Dostawa
              </p>
              <div
                className="font-extrabold tracking-[-0.025em] leading-none text-[22px] lg:text-[26px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {formatDateShort(order.tracking.eta)}
              </div>
              <div
                className="text-white/55 uppercase mt-1.5 mb-5"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
              >
                Szacowana dostawa
              </div>

              <ol className="flex flex-col">
                {[
                  { l: "Zamówienie przyjęte", done: true,  d: "22 maja, 14:08" },
                  { l: "Paczka spakowana",    done: true,  d: "23 maja, 09:42" },
                  { l: "W drodze · InPost",   done: true,  current: true, d: "24 maja, 18:11" },
                  { l: "Dostarczone",         done: false, d: "oczekiwane 28 maja" },
                ].map((s, i, arr) => (
                  <li key={i} className="flex gap-3.5 items-start pb-3 relative">
                    <span
                      className="relative z-10 rounded-full mt-0.5 shrink-0"
                      style={{
                        width: 14,
                        height: 14,
                        background: s.current ? "var(--aura-orange)" : s.done ? "#fff" : "transparent",
                        border: `2px solid ${
                          s.done ? (s.current ? "var(--aura-orange)" : "#fff") : "rgba(255,255,255,0.3)"
                        }`,
                      }}
                      aria-hidden="true"
                    />
                    {i < arr.length - 1 && (
                      <span
                        className="absolute left-[6px] top-[18px] bottom-0 w-px"
                        style={{ background: s.done ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)" }}
                        aria-hidden="true"
                      />
                    )}
                    <div className="flex-1">
                      <div
                        className={cn(
                          "text-[13px]",
                          s.current ? "font-bold text-white" : s.done ? "text-white" : "text-white/50"
                        )}
                      >
                        {s.l}
                      </div>
                      <div
                        className="tabular-nums text-white/55"
                        style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em" }}
                      >
                        {s.d}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              <button
                type="button"
                className="w-full h-11 mt-2 inline-flex items-center justify-center rounded-pill bg-brand text-white border border-brand text-[13.5px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                /* [shopify-ready]: open tracking.url in new tab */
              >
                Śledź paczkę ↗
              </button>
              <div
                className="text-white/55 uppercase mt-2.5"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
              >
                {order.tracking.carrier} · {order.tracking.number}
              </div>
            </section>
          )}

          {/* Address */}
          <section className="bg-paper border border-line rounded-md p-5 lg:p-6">
            <p
              className="text-muted uppercase mb-3"
              style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
            >
              Adres dostawy
            </p>
            <div
              className="font-extrabold text-[16px] lg:text-[18px] tracking-[-0.02em] mb-1.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {order.address.name}
            </div>
            <div className="text-[14px] leading-[1.5] text-ink">
              {order.address.line1}
              <br />
              {order.address.city}
              <br />
              {order.address.country}
            </div>
            {order.address.phone && (
              <div
                className="text-muted mt-3"
                style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em" }}
              >
                {order.address.phone}
              </div>
            )}
          </section>

          {/* Payment */}
          {order.payment && (
            <section className="bg-paper border border-line rounded-md p-5 lg:p-6">
              <p
                className="text-muted uppercase mb-3"
                style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
              >
                Płatność
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-7 rounded-xs bg-ink text-white grid place-items-center"
                  style={{ fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.05em", fontWeight: 800 }}
                >
                  {order.payment.brand.toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-[14px]">•••• {order.payment.last4}</div>
                  <AccountStatusPill kind={order.financialStatus} />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
