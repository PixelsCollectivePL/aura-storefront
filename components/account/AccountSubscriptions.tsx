"use client";

import { Starburst } from "@/components/brand/Starburst";
import { AccountStatusPill } from "@/components/account/AccountStatusPill";
import { AcctIcon, type AcctIconName } from "@/components/account/AccountIcons";
import { cn, formatPrice } from "@/lib/utils";
import { formatDateShort } from "@/lib/account/format";
import type { AccountSubscription } from "@/types/account";

interface AccountSubscriptionsProps {
  subscription: AccountSubscription | null;
}

/**
 * Subscriptions view.
 * Renders either the active subscription card (with management CTAs)
 * or a marketing empty-state composition.
 *
 * [future-integration]: All management actions (skip / pause / cancel /
 * change blend / change cadence) are UI-only on this stage. They'll be
 * wired to Shopify Subscriptions app or a Customer Account Extension
 * during the subscription integration phase.
 */
export function AccountSubscriptions({ subscription }: AccountSubscriptionsProps) {
  if (!subscription) {
    return <SubscriptionsEmpty />;
  }
  return <SubscriptionsActive sub={subscription} />;
}

/* ─────────── ACTIVE ─────────── */

function SubscriptionsActive({ sub }: { sub: AccountSubscription }) {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-2 lg:mb-4">
        <div>
          <p
            className="text-brand uppercase mb-3"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
          >
            Subskrypcja · co {sub.cadenceWeeks} tygodnie
          </p>
          <h1
            className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4.5vw, 60px)" }}
          >
            Twój rytuał
            <br />w trasie.
          </h1>
        </div>
        <button
          type="button"
          className="hidden lg:inline-flex items-center h-10 px-4 rounded-pill border border-line bg-paper text-ink text-[13px] font-semibold hover:border-ink transition-colors duration-[120ms] cursor-pointer"
        >
          Historia wysyłek
        </button>
      </header>

      {/* Hero card */}
      <section className="relative bg-paper-2 rounded-md p-6 lg:p-8 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:items-center overflow-hidden">
        {/* Visual */}
        <div className="grid place-items-center relative min-h-[240px] lg:min-h-[300px]">
          <Starburst color={sub.accent} size={220} points={12} depth={0.22}>
            <span className="text-ink">
              <AcctIcon.box size={64} />
            </span>
          </Starburst>
          <div
            className="absolute top-3 right-3 lg:right-0 rotate-[-8deg]"
            aria-hidden="true"
          >
            <Starburst color="var(--aura-orange)" size={70} points={12} depth={0.22}>
              <span
                className="uppercase text-ink font-bold text-center leading-[1.1]"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em" }}
              >
                Drop
                <br />
                09
              </span>
            </Starburst>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <AccountStatusPill kind={sub.paymentStatus === "ok" ? "paid" : "pending"} size="md" />
            <span
              className="text-muted uppercase"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em" }}
            >
              ID · {sub.id.slice(-2)}
            </span>
          </div>

          <p
            className="text-brand uppercase mb-2"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
          >
            Aktywna subskrypcja
          </p>
          <h2
            className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink mb-2"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px, 4vw, 48px)" }}
          >
            {sub.blendName}
          </h2>
          <div
            className="text-muted uppercase mb-6"
            style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em" }}
          >
            {sub.variantTitle} · co {sub.cadenceWeeks} tyg. · {formatPrice(sub.priceCycle)}/cykl
          </div>

          {/* Numbers */}
          <div className="grid grid-cols-2 gap-0 mb-6 bg-paper rounded-md py-4 px-5">
            <div className="border-r border-dashed border-line pr-5">
              <div
                className="text-muted uppercase mb-1"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
              >
                Następna wysyłka
              </div>
              <div
                className="font-extrabold tabular-nums leading-none tracking-[-0.025em] text-[26px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {formatDateShort(sub.nextShipmentAt)}
              </div>
            </div>
            <div className="pl-5">
              <div
                className="text-muted uppercase mb-1"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
              >
                Dostarczono
              </div>
              <div
                className="font-extrabold tabular-nums leading-none tracking-[-0.025em] text-[26px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {sub.cyclesDelivered}
              </div>
              <div
                className="text-muted uppercase mt-1"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
              >
                paczek
              </div>
            </div>
          </div>

          {/* Action cluster — UI placeholders, see [future-integration] above */}
          <div className="flex flex-wrap gap-2">
            <ActionBtn icon="skip" label="Pomiń najbliższą" />
            <ActionBtn icon="repeat" label="Zmień blend" ghost />
            <ActionBtn icon="repeat" label="Zmień częstotliwość" ghost />
            <ActionBtn icon="pause" label="Pauzuj" ghost />
            <ActionBtn icon="x" label="Anuluj" ghost muted />
          </div>
        </div>
      </section>

      {/* History strip */}
      <section className="bg-paper border border-line rounded-md p-6 lg:p-7">
        <div className="flex justify-between items-baseline mb-4">
          <h3
            className="font-extrabold text-[18px] tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Historia cykli
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0">
          {[
            { d: "21 maja", s: "delivered" as const, n: 9 },
            { d: "7 maja", s: "delivered" as const, n: 8 },
            { d: "23 kwietnia", s: "delivered" as const, n: 7 },
            { d: "9 kwietnia", s: "delivered" as const, n: 6 },
            { d: "4 czerwca", s: "unfulfilled" as const, n: 10 },
          ].map((c, i) => (
            <div
              key={i}
              className={cn(
                "py-3 px-4",
                i < 4 && "lg:border-r border-dashed border-line",
                i < 3 && "sm:border-r"
              )}
            >
              <div
                className="text-muted uppercase mb-2 tabular-nums"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
              >
                Cykl {String(c.n).padStart(2, "0")}
              </div>
              <div
                className="font-extrabold text-[15px] mb-1.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {c.d}
              </div>
              <AccountStatusPill kind={c.s} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  ghost = false,
  muted = false,
}: {
  icon: AcctIconName;
  label: string;
  ghost?: boolean;
  muted?: boolean;
}) {
  const IconCmp = AcctIcon[icon];
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 h-10 px-4 rounded-pill text-[13px] font-semibold transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
        ghost
          ? muted
            ? "bg-paper text-muted border border-line hover:border-muted"
            : "bg-paper text-ink border border-line hover:border-ink"
          : "bg-ink text-white border border-ink hover:bg-ink-2"
      )}
    >
      <IconCmp size={14} />
      {label}
    </button>
  );
}

/* ─────────── EMPTY ─────────── */

function SubscriptionsEmpty() {
  return (
    <div>
      <header className="mb-6 lg:mb-8">
        <p
          className="text-brand uppercase mb-3"
          style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
        >
          Subskrypcje
        </p>
        <h1
          className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4.5vw, 60px)" }}
        >
          Twój rytuał
          <br />
          czeka.
        </h1>
      </header>

      <section className="bg-paper border border-line rounded-md grid lg:grid-cols-2 gap-10 lg:gap-16 items-center p-8 lg:p-16 relative overflow-hidden">
        <div className="relative grid place-items-center min-h-[260px]">
          <Starburst color="var(--aura-orange-soft)" size={280} points={12} depth={0.22}>
            <span className="text-ink">
              <AcctIcon.box size={88} />
            </span>
          </Starburst>
          <div
            className="absolute bottom-0 right-3 rotate-[8deg] bg-ink text-white px-3.5 py-2 rounded-xs uppercase"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
            aria-hidden="true"
          >
            −10% na pierwszy cykl
          </div>
        </div>

        <div>
          <p
            className="text-brand uppercase mb-3"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
          >
            Nie masz jeszcze subskrypcji
          </p>
          <h2
            className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink mb-4"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 3.5vw, 48px)" }}
          >
            Uruchom regularną dostawę.
          </h2>
          <p className="text-[15px] lg:text-[16px] text-muted leading-[1.55] mb-6 max-w-[440px]">
            Świeżo palona, automatycznie. Wybierz blend i rytm — Aura sama dba o
            to, żebyś nigdy nie skończył kawy w środku tygodnia.
          </p>

          <ul className="flex flex-col gap-3.5 mb-7">
            {[
              { l: "−10% taniej", sub: "na każdy cykl, na zawsze" },
              { l: "Bez zobowiązań", sub: "pauzujesz, pomijasz, anulujesz" },
              { l: "Pierwsza wysyłka w 24h", sub: "palona w tym tygodniu" },
            ].map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="shrink-0 bg-ink text-white w-6 h-6 grid place-items-center rounded-full tabular-nums"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}
                >
                  {i + 1}
                </span>
                <div>
                  <div className="font-semibold text-[15px]">{b.l}</div>
                  <div className="text-[13px] text-muted">{b.sub}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              className="inline-flex items-center justify-center h-11 px-6 rounded-pill bg-brand text-white border border-brand text-[14px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[150ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              /* [future-integration]: subscription contract creation */
            >
              Uruchom subskrypcję
            </button>
            <a
              href="/blendy"
              className="inline-flex items-center justify-center h-11 px-6 rounded-pill bg-paper text-ink border border-line text-[14px] font-semibold hover:border-ink transition-colors duration-[150ms] focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            >
              Sprawdź blendy
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
