"use client";

import { useState, useMemo } from "react";
import { AccountStatusPill } from "@/components/account/AccountStatusPill";
import { AccountMiniBag } from "@/components/account/AccountMiniBag";
import { AccountEmptyState } from "@/components/account/AccountEmptyState";
import { cn, formatPrice } from "@/lib/utils";
import { formatDateLong } from "@/lib/account/format";
import type { AccountOrder, FulfillmentStatus } from "@/types/account";

interface AccountOrdersProps {
  orders: AccountOrder[];
  onSelectOrder: (orderId: string) => void;
}

type Filter = "all" | "in_transit" | "delivered";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all",         label: "Wszystkie" },
  { value: "in_transit",  label: "W drodze" },
  { value: "delivered",   label: "Dostarczone" },
];

export function AccountOrders({ orders, onSelectOrder }: AccountOrdersProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.fulfillmentStatus === filter as FulfillmentStatus);
  }, [orders, filter]);

  if (orders.length === 0) {
    return (
      <div>
        <PageHead eyebrow="Zamówienia · 00" title={<>Twoje<br />paczki.</>} />
        <AccountEmptyState
          title="Jeszcze nie zamówiłeś."
          body="Pierwsze ziarno czeka. Wybierz blend pod swój rytuał — espresso, filtr, wieczór — i sprawdź jak smakuje świeże palenie."
          cta={{ label: "Sprawdź kawy", href: "/produkty" }}
          secondaryCta={{ label: "Pomoc w wyborze", href: "/o-marce" }}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHead
        eyebrow={`Zamówienia · ${String(orders.length).padStart(2, "0")}`}
        title={<>Twoje<br />paczki.</>}
        action={
          <div className="hidden lg:flex items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "inline-flex items-center h-9 px-3.5 rounded-pill border text-[12.5px] font-medium transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
                  filter === f.value
                    ? "bg-ink text-white border-ink"
                    : "bg-paper text-ink border-line hover:border-ink"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      />

      {/* Mobile filter chips */}
      <div className="lg:hidden flex gap-2 overflow-x-auto mb-4 -mx-5 px-5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "inline-flex items-center h-9 px-3.5 rounded-pill border text-[12.5px] font-medium shrink-0 transition-colors duration-[120ms] cursor-pointer",
              filter === f.value
                ? "bg-ink text-white border-ink"
                : "bg-paper text-ink border-line"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Desktop: receipt-row list */}
      <div className="hidden lg:block bg-paper border border-line rounded-md overflow-hidden">
        <div
          className="grid grid-cols-[170px_1fr_180px_110px_180px] gap-6 px-7 py-4 bg-paper-2 border-b border-line uppercase text-muted"
          style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em" }}
        >
          <span>Zamówienie</span>
          <span>Produkty</span>
          <span>Status</span>
          <span>Wartość</span>
          <span />
        </div>

        {filtered.map((o, idx) => (
          <div
            key={o.id}
            className={cn(
              "grid grid-cols-[170px_1fr_180px_110px_180px] gap-6 px-7 py-5 items-center",
              idx < filtered.length - 1 && "border-b border-dashed border-line"
            )}
          >
            <div>
              <div
                className="font-extrabold text-[17px] tracking-[-0.02em] mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {o.name}
              </div>
              <div
                className="text-muted uppercase"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
              >
                {formatDateLong(o.processedAt)}
              </div>
            </div>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex">
                {o.items.slice(0, 3).map((it, i) => (
                  <div key={i} style={{ marginLeft: i === 0 ? 0 : -14, zIndex: 3 - i }}>
                    <AccountMiniBag accent={it.accent} label={it.title.slice(0, 3).toUpperCase()} size="sm" />
                  </div>
                ))}
              </div>
              <div className="ml-2 text-[13px] min-w-0">
                <div className="font-medium leading-tight truncate">
                  {o.items.map((i) => i.title).join(" · ")}
                </div>
                <div
                  className="text-muted uppercase mt-1"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
                >
                  {o.items.length} {o.items.length === 1 ? "pozycja" : "pozycje"}
                </div>
              </div>
            </div>
            <AccountStatusPill kind={o.fulfillmentStatus} />
            <div className="font-bold text-[16px] tabular-nums">{formatPrice(o.totalPrice)}</div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => onSelectOrder(o.id)}
                className="inline-flex items-center justify-center h-9 px-3.5 rounded-pill border border-line bg-paper text-ink text-[12.5px] font-semibold hover:border-ink transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              >
                Szczegóły
              </button>
              <button
                type="button"
                /* [shopify-ready]: cartLinesAdd with this order.items */
                className="inline-flex items-center justify-center h-9 px-3.5 rounded-pill bg-brand text-white border border-brand text-[12.5px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              >
                Ponów
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: card list */}
      <div className="lg:hidden flex flex-col gap-3">
        {filtered.map((o) => (
          <article key={o.id} className="bg-paper border border-line rounded-md overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3.5 border-b border-dashed border-line">
              <div>
                <div
                  className="font-extrabold text-[17px] tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {o.name}
                </div>
                <div
                  className="text-muted uppercase mt-0.5"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
                >
                  {formatDateLong(o.processedAt)}
                </div>
              </div>
              <AccountStatusPill kind={o.fulfillmentStatus} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex">
                {o.items.slice(0, 3).map((it, i) => (
                  <div key={i} style={{ marginLeft: i === 0 ? 0 : -14, zIndex: 3 - i }}>
                    <AccountMiniBag accent={it.accent} label={it.title.slice(0, 3).toUpperCase()} size="sm" />
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium leading-tight">
                  {o.items.map((i) => i.title).join(", ")}
                </div>
                <div
                  className="font-extrabold text-[17px] tracking-[-0.02em] tabular-nums mt-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formatPrice(o.totalPrice)}
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-4 pb-4">
              <button
                type="button"
                /* [shopify-ready]: cartLinesAdd */
                className="flex-1 h-10 inline-flex items-center justify-center rounded-pill bg-brand text-white border border-brand text-[13px] font-semibold cursor-pointer"
              >
                Zamów ponownie
              </button>
              <button
                type="button"
                onClick={() => onSelectOrder(o.id)}
                className="inline-flex items-center justify-center h-10 px-4 rounded-pill border border-line bg-paper text-ink text-[13px] font-semibold cursor-pointer"
              >
                Szczegóły
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ── Section head primitive (shared visual; small enough to colocate) ── */
function PageHead({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 mb-6 lg:mb-8">
      <div>
        <p
          className="text-brand uppercase mb-3"
          style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
        >
          {eyebrow}
        </p>
        <h1
          className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4.5vw, 60px)" }}
        >
          {title}
        </h1>
      </div>
      {action}
    </header>
  );
}
