"use client";

import { useRouter } from "next/navigation";
import { AccountStatusPill } from "@/components/account/AccountStatusPill";
import { AccountMiniBag } from "@/components/account/AccountMiniBag";
import { AcctIcon } from "@/components/account/AccountIcons";
import { cn, formatPrice } from "@/lib/utils";
import { formatDateLong, formatDateShort } from "@/lib/account/format";
import { useCart } from "@/lib/cart/cart-context";
import type {
  AccountCustomer,
  AccountOrder,
  AccountStats,
  AccountTastedBlend,
  FulfillmentStatus,
} from "@/types/account";

/** Shopify's fulfillment status in the customer's language. */
const FULFILLMENT_LABEL: Record<FulfillmentStatus, string> = {
  unfulfilled: "w przygotowaniu",
  in_transit: "w drodze",
  delivered: "dostarczone",
  cancelled: "anulowane",
};

interface AccountDashboardProps {
  customer: AccountCustomer;
  orders: AccountOrder[];
  stats: AccountStats;
  tastedBlends: AccountTastedBlend[];
}

export function AccountDashboard({
  customer,
  orders,
  stats,
  tastedBlends,
}: AccountDashboardProps) {
  const router = useRouter();
  const { reorder, isPending } = useCart();
  const navigate = (section: string, orderId?: string) => {
    const paths: Record<string, string> = {
      dashboard: "/konto", orders: "/konto/zamowienia",
      subscriptions: "/konto/subskrypcje", addresses: "/konto/adresy", details: "/konto/dane",
    };
    router.push(section === "order-details" && orderId
      ? `/konto/zamowienia/${orderId.split("/").pop()}`
      : paths[section] ?? "/konto");
  };
  const lastOrder = orders[0];
  // Derived from real order history, not from a metafield we do not have.
  // `tastedBlends` arrives sorted by how often each blend was ordered.
  const favouriteBlend = tastedBlends[0];
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
              onClick={() => navigate("details")}
              className="inline-flex items-center justify-center h-10 px-4 rounded-pill border border-line bg-paper text-ink text-[13px] font-semibold hover:border-ink transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            >
              Zarządzaj kontem ↗
            </button>
            <button
              type="button"
              onClick={() => void reorder(lastOrder.id)}
              disabled={isPending}
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

      {/* ── Latest order ── */}
      {lastOrder && (
        <div className="grid gap-5">
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
                  {/* The status comes from Shopify's fulfillmentStatus, not
                      from a hardcoded "w drodze" — this strip used to claim
                      the parcel was in transit for every order that had a
                      tracking number, including delivered and cancelled ones. */}
                  <div className="text-[13px] text-ink leading-tight">
                    <strong>
                      {lastOrder.tracking.carrier} · {FULFILLMENT_LABEL[lastOrder.fulfillmentStatus]}
                    </strong>
                    {lastOrder.tracking.eta ? (
                      <>
                        {" · dostawa "}
                        <strong className="tabular-nums">
                          {formatDateShort(lastOrder.tracking.eta)}
                        </strong>
                      </>
                    ) : null}
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
                onClick={() => void reorder(lastOrder.id)}
                disabled={isPending}
                className="inline-flex items-center justify-center h-10 px-5 rounded-pill bg-brand text-white border border-brand text-[13px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                /* [shopify-ready]: cartLinesAdd from order.items (variantId + quantity), openCart() */
              >
                Zamów ponownie
              </button>
              <button
                type="button"
                onClick={() => navigate("order-details", lastOrder.id)}
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

        </div>
      )}

      {/* ── Quick-stats strip ──
          Every tile is derived from real Shopify order history. "Punkty
          Aura" used to render `loyaltyPoints ?? 0` — a loyalty programme
          that has no backend, showing a confident "0" to a customer who
          might well have earned something. It is now labelled as what it
          is: a feature that does not exist yet. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-md overflow-hidden">
        {[
          { eb: "Zamówień",       v: String(stats.ordersTotal),    sub: "łącznie",  future: false },
          { eb: "W tym roku",     v: String(stats.ordersThisYear), sub: "paczek",   future: false },
          {
            eb: "Ulubiony blend",
            v: favouriteBlend?.name ?? "—",
            sub: favouriteBlend ? `zamówiony ${favouriteBlend.timesOrdered}×` : "po pierwszym zamówieniu",
            future: false,
          },
          { eb: "Punkty Aura",    v: "Wkrótce",                    sub: "program lojalnościowy w przygotowaniu", future: true },
        ].map((s) => (
          <div key={s.eb} className="bg-paper p-5">
            <div
              className="text-muted uppercase mb-1.5"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em" }}
            >
              {s.eb}
            </div>
            <div
              className={cn(
                "font-extrabold leading-none tracking-[-0.025em] mb-1.5",
                s.future ? "text-muted text-[18px] lg:text-[20px]" : "text-[24px] lg:text-[28px]"
              )}
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
              onClick={() => navigate("orders")}
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
                onClick={() => navigate("order-details", o.id)}
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
