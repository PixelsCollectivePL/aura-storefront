"use client";

import Link from "next/link";
import Image from "next/image";

interface AuraErrorScreenProps {
  /** Headline. Defaults to a generic message; pages can override. */
  title?: string;
  /** Body copy under the headline. */
  body?: string;
  /** Next.js error boundary `reset()` — when provided, renders the
   *  "Spróbuj ponownie" CTA that re-renders the boundary. */
  reset?: () => void;
  /** Override for the "back home" link target. */
  homeHref?: string;
  homeLabel?: string;
}

/**
 * Aura-branded error screen.
 *
 * Used by Next.js `error.tsx` files. Full-screen brand moment (option A
 * from the loading/error proposal) — rotating star + headline + body +
 * retry/home CTAs. Mirrors AccountAuthState error look so users see a
 * consistent "something broke" experience across the site.
 *
 * Must be "use client" — Next.js error.tsx files always are, and we
 * call `reset()` from a button onClick.
 */
export function AuraErrorScreen({
  title = "Coś się przepaliło.",
  body = "Spróbuj odświeżyć stronę. Jeśli problem się powtórzy — napisz na hello@aura.coffee.",
  reset,
  homeHref = "/",
  homeLabel = "Wróć do sklepu",
}: AuraErrorScreenProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 py-16">
      <div
        className="relative w-[160px] h-[160px] mb-7 opacity-90"
        aria-hidden="true"
      >
        <Image
          src="/assets/brand/aura-star.png"
          alt=""
          fill
          className="object-contain star-spin-bg"
          sizes="160px"
        />
      </div>

      <p
        className="text-brand uppercase mb-3"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.14em",
        }}
      >
        — Błąd
      </p>

      <h1
        className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink mb-4"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 4vw, 52px)",
        }}
      >
        {title}
      </h1>

      <p className="text-[15px] lg:text-[17px] text-muted leading-[1.55] max-w-[460px] mb-7">
        {body}
      </p>

      <div className="flex flex-wrap gap-2.5 justify-center">
        {reset && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-pill bg-brand text-white border border-brand text-[14.5px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[150ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          >
            Spróbuj ponownie
          </button>
        )}
        <Link
          href={homeHref}
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-pill border border-line bg-paper text-ink text-[14.5px] font-semibold hover:border-ink transition-colors duration-[150ms] focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
        >
          {homeLabel}
        </Link>
      </div>
    </div>
  );
}
