import Image from "next/image";

interface AuraLoadingProps {
  /** Contextual brand message — defaults to "Świeże ziarno mieli się…". */
  message?: string;
  /** Optional second-line subtitle. */
  hint?: string;
}

/**
 * Aura-branded loading screen.
 *
 * Used by Next.js `loading.tsx` files across the app. Renders a rotating
 * star + brand-mono eyebrow with a contextual coffee-themed message.
 * No spinners — the rotating PNG is the visual cue.
 *
 * Server component (no event handlers / state).
 */
export function AuraLoading({
  message = "Świeże ziarno mieli się…",
  hint,
}: AuraLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5 py-16"
    >
      <div
        className="relative w-[140px] h-[140px] mb-7 opacity-90"
        aria-hidden="true"
      >
        <Image
          src="/assets/brand/aura-star.png"
          alt=""
          fill
          className="object-contain star-spin-bg"
          sizes="140px"
          priority
        />
      </div>

      <p
        className="text-brand uppercase mb-1.5"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.16em",
        }}
      >
        — Aura · drop 02
      </p>
      <p
        className="font-extrabold text-ink leading-[1.05] tracking-[-0.022em]"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(20px, 2.4vw, 26px)",
        }}
      >
        {message}
      </p>
      {hint && (
        <p className="text-[13.5px] text-muted leading-[1.55] mt-3 max-w-[360px]">
          {hint}
        </p>
      )}

      {/* Screen-reader hint */}
      <span className="sr-only">Ładowanie zawartości</span>
    </div>
  );
}
