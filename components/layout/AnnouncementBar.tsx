import { CONTENT } from "@/lib/content/pl";

const { announcement: a } = CONTENT;

/** Scrolling ticker — dark bg, mono type, infinite marquee */
const ITEMS = [
  a.freeShipping,
  a.roastSchedule,
  a.freeShipping,
  a.roastSchedule,
];

export function AnnouncementBar() {
  return (
    <div
      className="bg-ink text-white overflow-hidden"
      style={{ height: 38 }}
      aria-label="Ogłoszenia"
    >
      {/* Duplicate content × 2 so the loop is seamless */}
      <div
        className="flex items-center h-full ticker-scroll whitespace-nowrap"
        aria-hidden="true"
      >
        {[...ITEMS, ...ITEMS].map((text, i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className="text-[11px] tracking-[0.14em] uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {text}
            </span>
            <span
              className="mx-8 text-white/30"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
