"use client";

import Link from "next/link";
import { Starburst } from "@/components/brand/Starburst";
import { AcctIcon } from "@/components/account/AccountIcons";
import { cn } from "@/lib/utils";
import type { AccountViewState } from "@/types/account";

interface AccountAuthStateProps {
  state: Exclude<AccountViewState, "loggedIn">;
  /** Used by error state to retry. */
  onRetry?: () => void;
}

/**
 * Renders the three non-logged-in states for /account:
 *   - loggedOut: login prompt with Shopify-account note (no email/password form)
 *   - loading:   skeleton receipt card while we'd be fetching
 *   - error:     "couldn't load account" + retry / back to shop
 *
 * No real auth on this stage — Shopify Customer Accounts owns login.
 */
export function AccountAuthState({ state, onRetry }: AccountAuthStateProps) {
  return (
    <div className="bg-paper min-h-[60vh] flex items-center justify-center px-5 lg:px-14 py-16 lg:py-24">
      <div className="w-full max-w-[640px] text-center flex flex-col items-center">
        {state === "loggedOut" && <LoggedOut />}
        {state === "loading"   && <Loading />}
        {state === "error"     && <ErrorState onRetry={onRetry} />}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   LOGGED OUT
   ────────────────────────────────────────────────────────────────── */
function LoggedOut() {
  return (
    <>
      <div className="relative grid place-items-center mb-7" aria-hidden="true">
        <Starburst color="var(--aura-orange-soft)" size={200} points={12} depth={0.22}>
          <span className="text-ink">
            <AcctIcon.user size={64} />
          </span>
        </Starburst>
      </div>

      <p
        className="text-brand uppercase mb-3"
        style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
      >
        Konto Aura
      </p>
      <h1
        className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink mb-4"
        style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4.5vw, 60px)" }}
      >
        Zaloguj się
        <br />
        do konta Aura.
      </h1>
      <p className="text-[15px] lg:text-[17px] text-muted leading-[1.55] max-w-[460px] mb-7">
        Sprawdź zamówienia, subskrypcje i wróć do ulubionych blendów.
      </p>

      <div className="flex flex-wrap gap-2.5 justify-center mb-7">
        {/* Dedicated login page; final Shopify login redirect happens
            inside AccountAuthCard. */}
        <Link
          href="/account/login"
          className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-pill bg-brand text-white border border-brand text-[14.5px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[150ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
        >
          Zaloguj się
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-pill border border-line bg-paper text-ink text-[14.5px] font-semibold hover:border-ink transition-colors duration-[150ms] focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
        >
          Wróć do sklepu
        </Link>
      </div>

      <p
        className="text-muted leading-[1.55] max-w-[380px]"
        style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em" }}
      >
        Logowanie obsługiwane bezpiecznie przez Shopify Customer Accounts.
      </p>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────
   LOADING — skeleton receipt
   ────────────────────────────────────────────────────────────────── */
function Loading() {
  return (
    <>
      <p
        className="text-brand uppercase mb-3"
        style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
        aria-live="polite"
      >
        Ładujemy Twoje konto…
      </p>

      {/* Skeleton receipt card — pure CSS, no external library */}
      <div className="w-full max-w-[440px] mx-auto bg-paper border border-line rounded-md p-6 lg:p-7 flex flex-col gap-4 text-left">
        <Skel className="h-3 w-24" />
        <Skel className="h-8 w-3/4" />
        <div className="h-px bg-line" />
        <div className="flex flex-col gap-3">
          <Skel className="h-3 w-full" />
          <Skel className="h-3 w-5/6" />
          <Skel className="h-3 w-2/3" />
        </div>
        <div className="h-px bg-line" />
        <div className="flex justify-between items-center">
          <Skel className="h-3 w-20" />
          <Skel className="h-6 w-24" />
        </div>
        <Skel className="h-11 w-full rounded-pill" />
      </div>
    </>
  );
}

function Skel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-paper-2 rounded-xs motion-safe:animate-pulse",
        className
      )}
      aria-hidden="true"
    />
  );
}

/* ──────────────────────────────────────────────────────────────────
   ERROR
   ────────────────────────────────────────────────────────────────── */
function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <>
      <div className="relative grid place-items-center mb-7" aria-hidden="true">
        <Starburst color="var(--aura-paper-2)" size={180} points={12} depth={0.22}>
          <span className="text-ink">
            <AcctIcon.x size={56} />
          </span>
        </Starburst>
      </div>

      <p
        className="text-brand uppercase mb-3"
        style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
      >
        Błąd
      </p>
      <h1
        className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink mb-4"
        style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 52px)" }}
      >
        Nie udało się
        <br />
        pobrać danych konta.
      </h1>
      <p className="text-[15px] lg:text-[17px] text-muted leading-[1.55] max-w-[460px] mb-7">
        Spróbuj odświeżyć stronę. Jeśli problem się powtarza — napisz na
        hello@aura.coffee.
      </p>

      <div className="flex flex-wrap gap-2.5 justify-center">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-pill bg-brand text-white border border-brand text-[14.5px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[150ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
        >
          Spróbuj ponownie
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-pill border border-line bg-paper text-ink text-[14.5px] font-semibold hover:border-ink transition-colors duration-[150ms] focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
        >
          Wróć do sklepu
        </Link>
      </div>
    </>
  );
}
