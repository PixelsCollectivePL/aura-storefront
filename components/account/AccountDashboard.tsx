"use client";

import { Starburst } from "@/components/brand/Starburst";
import { AccountStatusPill } from "@/components/account/AccountStatusPill";
import { AccountMiniBag } from "@/components/account/AccountMiniBag";
import { AcctIcon } from "@/components/account/AccountIcons";
import { cn, formatPrice } from "@/lib/utils";
import { formatDateLong, formatDateShort } from "@/lib/account/format";
import { notifyReorderAction } from "@/lib/account/feedback";
import type {
  AccountCustomer,
  AccountOrder,
  AccountSection,
  AccountStats,
  AccountSubscription,
  AccountTastedBlend,
} from "@/types/account";

interface AccountDashboardProps {
  customer: AccountCustomer;
  orders: AccountOrder[];
  subscription: AccountSubscription | null;
  stats: AccountStats;
  tastedBlends: AccountTastedBlend[];
  onNavigate: (section: AccountSection, orderId?: string) => void;
}

export function AccountDashboard({
  customer,
  orders,
  stats,
  tastedBlends,
  subscription,
  onNavigate,
}: AccountDashboardProps) {
  const lastOrder = orders[0];
  const previous  = orders.slice(1, 4);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page head ── */}
      <header className="flex flex-wrap items-end justify-between gap-4 mb-2 lg:mb-4">
        <div>
          <p
            className="text-brand uppercase mb-3"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
          >
            Dashboard · konto
          </p>
          <h1
            className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 4.5vw, 64px)",
            }}
          >
            Cześć, <span className="text-brand">{customer.firstName}.</span>
            <br />
            Twoja kawa czeka.
          </h1>
        </div>
        {lastOrder && (
          <div className="hidden lg:flex gap-2">
            <button
              type="button"
              onClick={() => onNavigate("details")}
              className="inline-flex items-center justify-center h-10 px-4 rounded-pill border border-line bg-paper text-ink text-[13px] font-semibold hover:border-ink transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            >
              Zarządzaj kontem ↗
            </button>
            <button
              type="button"
              onClick={notifyReorderAction}
              className="inline-flex items-center justify-center h-10 px-5 rounded-pill bg-brand text-white border border-brand text-[13px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              /* [shopify-ready]: replace onClick with cartLinesAdd mutation:
                   lastOrder.items.map(it => ({
                     merchandiseId: it.variantId,
                     quantity: it.quantity,
                   }))
                 then openCart(). */
            >
              Zamów ponownie
            </button>
          </div>
        )}
      </header>

      {/* ── Hero row: last order + subscription ── */}
      {lastOrder && (
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
          {/* Last order */}
          <article className="relative bg-paper border border-line rounded-md p-6 lg:p-7 overflow-hidden">
            <div className="flex justify-between items-start gap-4 mb-5">
              <div>
                <p
                  className="text-brand uppercase mb-2"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
                >
                  Ostatnie zamówienie
                </p>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2
                    className="font-extrabold text-[28px] lg:text-[34px] leading-none tracking-[-0.025em] text-ink"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {lastOrder.name}
                  </h2>
                  <span
                    className="text-muted uppercase"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em" }}
                  >
                    {formatDateLong(lastOrder.processedAt)}
                  </span>
                </div>
              </div>
              <AccountStatusPill kind={lastOrder.fulfillmentStatus} size="md" />
            </div>

            {/* Items strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {lastOrder.items.slice(0, 3).map((it) => (
                <div key={it.id} className="flex gap-3 items-center min-w-0">
                  <AccountMiniBag accent={it.accent} label={it.title.slice(0, 3).toUpperCase()} size="sm" />
                  <div className="min-w-0">
                    <div
                      className="font-extrabold text-[14px] leading-tight tracking-[-0.015em] mb-1 truncate"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {it.title}
                    </div>
                    <div
                      className="text-muted uppercase mb-1"
                      style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.12em" }}
                    >
                      {it.variantTitle}
                    </div>
                    <div
                      className="text-ink tabular-nums"
                      style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600 }}
                    >
                      {it.quantity} × {formatPrice(it.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tracking strip */}
            {lastOrder.tracking && (
              <div className="flex items-center gap-3 p-3 lg:p-4 bg-paper-2 rounded-md mb-4">
                <span className="text-brand shrink-0">
                  <AcctIcon.truck size={20} />
                </span>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-muted uppercase mb-0.5"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
                  >
                    Status dostawy
                  </div>
                  <div className="text-[13px] text-ink leading-tight">
                    <strong>{lastOrder.tracking.carrier} · w drodze</strong>
                    {" · dostawa "}
                    <strong className="tabular-nums">{formatDateShort(lastOrder.tracking.eta)}</strong>
                  </div>
                </div>
                {/* [shopify-ready]: open lastOrder.tracking.url */}
                {lastOrder.tracking.url ? (
                  <a
                    href={lastOrder.tracking.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex text-[13px] font-semibold text-ink border-b border-ink pb-0.5 hover:text-brand hover:border-brand transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                  >
                    Śledź ↗
                  </a>
                ) : null}
              </div>
            )}

            <div className="flex gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={notifyReorderAction}
                className="inline-flex items-center justify-center h-10 px-5 rounded-pill bg-brand text-white border border-brand text-[13px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                /* [shopify-ready]: cartLinesAdd from order.items (variantId + quantity), openCart() */
              >
                Zamów ponownie
              </button>
              <button
                type="button"
                onClick={() => onNavigate("order-details", lastOrder.id)}
                className="inline-flex items-center justify-center h-10 px-5 rounded-pill bg-paper text-ink border border-line text-[13px] font-semibold hover:border-ink transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              >
                Zobacz szczegóły
              </button>
            </div>

            <span
              className="absolute bottom-3 right-4 uppercase text-muted hidden lg:block"
              style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em" }}
            >
              LOT · {lastOrder.id.slice(-6)}
            </span>
          </article>

          {/* Subscription (dark) */}
          <article className="relative bg-ink text-white rounded-md p-6 lg:p-7 overflow-hidden flex flex-col">
            <div className="absolute -top-10 -right-10 opacity-50 pointer-events-none" aria-hidden="true">
              <Starburst color="var(--aura-orange)" size={180} points={12} depth={0.22} />
            </div>
            <div className="relative z-10 flex flex-col flex-1">
              {subscription ? (
                <>
                  <p
                    className="text-brand uppercase mb-2"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
                  >
                    Aktywna subskrypcja
                  </p>
                  <h2
                    className="font-extrabold text-[26px] lg:text-[30px] leading-[0.95] tracking-[-0.025em] mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {subscription.blendName}
                  </h2>
                  <div
                    className="text-white/55 uppercase mb-6"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em" }}
                  >
                    {subscription.variantTitle} · co {subscription.cadenceWeeks} tyg.
                  </div>

                  <div className="py-4 border-t border-dashed border-white/20 border-b flex justify-between items-end mb-5">
                    <div>
                      <div
                        className="text-white/55 uppercase mb-1"
                        style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
                      >
                        Następna wysyłka
                      </div>
                      <div
                        className="font-extrabold tabular-nums text-[24px] leading-none tracking-[-0.025em]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {formatDateShort(subscription.nextShipmentAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-white/55 uppercase mb-1"
                        style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
                      >
                        Cykl
                      </div>
                      <div className="font-semibold tabular-nums text-[16px]">
                        {formatPrice(subscription.priceCycle)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto">
                    <button
                      type="button"
                      onClick={() => onNavigate("subscriptions")}
                      className="w-full h-11 inline-flex items-center justify-center rounded-pill bg-brand text-white border border-brand text-[13.5px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                    >
                      Zarządzaj subskrypcją
                    </button>
                    <button
                      type="button"
                      className="w-full h-10 inline-flex items-center justify-center rounded-pill border border-white/25 bg-transparent text-white text-[13px] font-semibold hover:bg-white/8 transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                      /* [future-integration]: subscriptionContractSkip */
                    >
                      Pomiń najbliższą
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p
                    className="text-brand uppercase mb-2"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
                  >
                    Subskrypcja
                  </p>
                  <h2
                    className="font-extrabold text-[26px] lg:text-[30px] leading-[0.95] tracking-[-0.025em] mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Twój rytuał czeka.
                  </h2>
                  <p className="text-white/70 text-[14px] leading-[1.5] mb-6">
                    Regularna dostawa świeżo palonej kawy — taniej, bez kończenia
                    się ziarna w środku tygodnia.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate("subscriptions")}
                    className="mt-auto w-full h-11 inline-flex items-center justify-center rounded-pill bg-brand text-white border border-brand text-[13.5px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[120ms] cursor-pointer"
                  >
                    Uruchom subskrypcję
                  </button>
                </>
              )}
            </div>
          </article>
        </div>
      )}

      {/* ── Quick-stats strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-md overflow-hidden">
        {[
          { eb: "Zamówień",      v: String(stats.ordersTotal),                       sub: "łącznie" },
          { eb: "W tym roku",    v: String(stats.ordersThisYear),                    sub: "paczek" },
          { eb: "Ulubiony blend", v: stats.favoriteBlend ?? "—",                      sub: stats.favoriteBlendSubtitle ?? "" },
          { eb: "Punkty Aura",   v: String(stats.loyaltyPoints ?? 0),                sub: `do następnej: ${stats.loyaltyPointsToNext ?? 0}` },
        ].map((s) => (
          <div key={s.eb} className="bg-paper p-5">
            <div
              className="text-muted uppercase mb-1.5"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em" }}
            >
              {s.eb}
            </div>
            <div
              className="font-extrabold leading-none tracking-[-0.025em] text-[24px] lg:text-[28px] mb-1.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {s.v}
            </div>
            <div className="text-[12px] text-muted leading-tight">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Two-column row: history + tasted blends ── */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="bg-paper border border-line rounded-md p-6 lg:p-7">
          <div className="flex justify-between items-baseline mb-4">
            <h3
              className="font-extrabold text-[18px] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Twoja historia
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("orders")}
              className="text-[13px] font-semibold text-ink border-b border-ink hover:text-brand hover:border-brand transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            >
              Wszystkie zamówienia
            </button>
          </div>
          {previous.map((o, idx) => (
            <div
              key={o.id}
              className={cn(
                "flex items-center gap-3 py-3.5 flex-wrap lg:flex-nowrap",
                idx > 0 && "border-t border-dashed border-line"
              )}
            >
              <div className="min-w-[110px]">
                <div className="font-extrabold text-[15px]" style={{ fontFamily: "var(--font-display)" }}>
                  {o.name}
                </div>
                <div
                  className="text-muted uppercase"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
                >
                  {formatDateLong(o.processedAt)}
                </div>
              </div>
              <div className="flex-1 text-[13px] text-muted min-w-0 hidden sm:block">
                {o.items.map((i) => i.title).join(" · ")}
              </div>
              <AccountStatusPill kind={o.fulfillmentStatus} />
              <span className="font-bold text-[15px] tabular-nums min-w-[70px] text-right">
                {formatPrice(o.totalPrice)}
              </span>
              <button
                type="button"
                onClick={() => onNavigate("order-details", o.id)}
                className="inline-flex items-center justify-center h-9 px-3.5 rounded-pill border border-line bg-paper text-ink text-[12.5px] font-semibold hover:border-ink transition-colors duration-[120ms] cursor-pointer"
              >
                Szczegóły
              </button>
            </div>
          ))}
        </div>

        <div className="bg-paper-2 rounded-md p-6 lg:p-7 relative overflow-hidden">
          <p
            className="text-brand uppercase mb-2"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
          >
            Twoja kawa
          </p>
          <h3
            className="font-extrabold text-[22px] tracking-[-0.025em] leading-none mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Smakowałeś już…
          </h3>
          <div className="flex flex-col">
            {tastedBlends.map((blend, i) => (
              <div
                key={blend.handle}
                className={cn(
                  "flex items-center gap-3 py-2.5",
                  i < tastedBlends.length - 1 && "border-b border-dashed border-line"
                )}
              >
                <span
                  className="tabular-nums text-muted shrink-0"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", minWidth: 20 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[14px] font-medium">{blend.name}</span>
                <span
                  className="text-muted uppercase tabular-nums"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
                >
                  ×{blend.timesOrdered}
                </span>
              </div>
            ))}
          </div>
          <a
            href="/blendy"
            className="inline-flex items-center gap-1.5 mt-4 text-[13px] font-semibold text-ink border-b border-ink hover:text-brand hover:border-brand transition-colors duration-[120ms]"
          >
            Wybierz nowy blend <AcctIcon.arrow size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
