import { CONTENT } from "@/lib/content/pl";

const { announcement: a } = CONTENT;

const MESSAGES = [
  a.freeShipping,
  a.roastSchedule,
  "14 dni na zwrot bez pytań",
  "Specialty coffee z Warszawy",
];

/** Duplicate messages to create seamless loop: anim scrolls -50% */
const TRACK = [...MESSAGES, ...MESSAGES];

/**
 * Scrolling ticker — dark bg, JetBrains Mono uppercase, infinite marquee.
 * Falls back to static centered text when prefers-reduced-motion is active.
 */
export function AnnouncementBar() {
  return (
    <div
      className="bg-ink text-white overflow-hidden shrink-0"
      style={{ height: 36 }}
      aria-label="Ogłoszenia"
    >
      {/*
        ANIMATED — hidden when prefers-reduced-motion: reduce
        Duplicated track scrolls translateX(0 → -50%) and loops seamlessly.
      */}
      <div
        className="flex items-center h-full motion-reduce:hidden"
        aria-hidden="true"
      >
        <div className="flex items-center ticker-scroll whitespace-nowrap">
          {TRACK.map((text, i) => (
            <span key={i} className="inline-flex items-center shrink-0">
              <span
                className="text-[10.5px] tracking-[0.15em] uppercase text-white/80 px-8"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {text}
              </span>
              <span
                className="text-white/25 text-[8px]"
                style={{ fontFamily: "var(--font-mono)" }}
                aria-hidden="true"
              >
                ✱
              </span>
            </span>
          ))}
        </div>
      </div>

      {/*
        STATIC FALLBACK — visible only when prefers-reduced-motion: reduce.
        Shows the first message centered.
      */}
      <div className="hidden motion-reduce:flex items-center justify-center h-full">
        <span
          className="text-[10.5px] tracking-[0.15em] uppercase text-white/80"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {MESSAGES[0]}
          <span className="mx-6 text-white/25 text-[8px]" aria-hidden="true">✱</span>
          {MESSAGES[1]}
        </span>
      </div>
    </div>
  );
}
