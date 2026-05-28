import Image from "next/image";

/**
 * Left-side brand panel on the /account/login screen (desktop) +
 * compact top band on mobile. Pure decoration — communicates the brand
 * moment of "logging into a craft coffee club", not a generic SaaS gate.
 *
 * Uses the same rotating star + front illustration combo as the homepage
 * hero so the panel reads as part of the Aura world, not a separate flow.
 */
export function AccountBrandPanel() {
  return (
    <aside
      className="relative bg-ink text-white overflow-hidden flex flex-col"
      aria-hidden="true"
    >
      {/* ──────────────────────────────────────────
          DESKTOP — full-bleed brand stage
          ────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-14 xl:p-20 relative">
        {/* Eyebrow top */}
        <div className="relative z-10">
          <p
            className="flex items-center gap-2 text-brand uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.16em",
            }}
          >
            <Image
              src="/assets/brand/aura-star.png"
              alt=""
              width={14}
              height={14}
              className="star-spin"
            />
            Konto Aura · drop 02
          </p>
        </div>

        {/* Layered illustration — star rotating behind, runner on top */}
        <div className="relative w-full grow flex items-center justify-center">
          <div className="relative w-full max-w-[560px]" style={{ aspectRatio: "1 / 1" }}>
            <div className="absolute inset-0 star-spin-bg">
              <Image
                src="/assets/brand/aura-star.png"
                alt=""
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 45vw, 0px"
                priority
              />
            </div>
            <div className="absolute inset-0">
              <Image
                src="/assets/brand/aura-hero-illustration-front.png"
                alt=""
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 45vw, 0px"
                priority
              />
            </div>
          </div>
        </div>

        {/* Bottom: brand headline + receipt note */}
        <div className="relative z-10 flex flex-col gap-7">
          <h2
            className="font-extrabold text-white leading-[0.92] tracking-[-0.035em]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(44px, 4vw, 64px)",
            }}
          >
            Twoja kawa,
            <br />
            <span className="text-brand">twoje konto.</span>
          </h2>

          {/* Receipt-style mono strip */}
          <div
            className="flex items-center gap-4 pt-5 border-t border-dashed border-white/20 uppercase"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
          >
            <span className="text-white/55">Coffee club</span>
            <span className="flex-1 h-px bg-white/20" />
            <span className="text-white/85">na zawsze</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────
          MOBILE — compact dark band on top of card
          ────────────────────────────────────────── */}
      <div className="lg:hidden relative px-5 py-10">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p
              className="flex items-center gap-2 text-brand uppercase mb-3"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.14em",
              }}
            >
              <Image
                src="/assets/brand/aura-star.png"
                alt=""
                width={12}
                height={12}
                className="star-spin"
              />
              Konto Aura
            </p>
            <h2
              className="font-extrabold text-white leading-[0.95] tracking-[-0.03em]"
              style={{ fontFamily: "var(--font-display)", fontSize: 34 }}
            >
              Twoja kawa,
              <br />
              <span className="text-brand">twoje konto.</span>
            </h2>
          </div>
          {/* Mini rotating star block on the right */}
          <div className="relative w-[88px] h-[88px] shrink-0 star-spin-bg">
            <Image
              src="/assets/brand/aura-star.png"
              alt=""
              fill
              className="object-contain"
              sizes="88px"
              priority
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
