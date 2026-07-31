/**
 * Reading merchant-entered roast level and origin.
 *
 * Both come from free-text `custom.*` metafields, typed by a person in
 * Shopify Admin. The matching used to be English-only and prefix-based:
 * `roastLevel.startsWith("light")`, `origin.includes("Ethiopia")`. A
 * merchant writing "Jasny" or "Etiopia" — the obvious thing to do on a
 * Polish storefront — got a roast bar stuck in the middle and a country
 * filter that silently matched nothing.
 *
 * So this module accepts either language, ignores case, diacritics and
 * surrounding text. It is pure and fully unit-tested, because every failure
 * mode here is silent: nothing throws, results are just quietly wrong.
 */

import type { Product } from "@/types/product";

/** Lowercase, strip Polish diacritics, collapse separators. */
function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    // Combining marks, written as escapes rather than literals so the
    // source file's encoding can never change what this matches.
    .replace(/[\u0300-\u036f]/g, "")
    // Ł has no decomposed form, so NFD leaves it alone.
    .replace(/ł/g, "l")
    .replace(/[_/]/g, " ")
    .trim();
}

/* ─── Roast ───────────────────────────────────────────────────────────── */

export type RoastLevel = "light" | "medium-light" | "medium" | "medium-dark" | "dark";

/**
 * Recognised spellings per level, in both languages.
 *
 * Order matters: "medium-dark" has to be tested before "medium" and before
 * "dark", or "Medium-dark · classic" resolves as plain medium. Same for the
 * Polish "średnio ciemny", which contains both "średni" and "ciemny".
 */
const ROAST_PATTERNS: Array<{ level: RoastLevel; scale: number; match: string[] }> = [
  { level: "medium-dark", scale: 4, match: ["medium dark", "medium-dark", "srednio ciemn"] },
  { level: "medium-light", scale: 2, match: ["medium light", "medium-light", "jasno sredni", "srednio jasn"] },
  { level: "light", scale: 1, match: ["light", "jasn"] },
  { level: "dark", scale: 5, match: ["dark", "ciemn"] },
  { level: "medium", scale: 3, match: ["medium", "sredni"] },
];

/** The level a merchant's text describes, or `null` when unrecognised. */
export function parseRoastLevel(raw: string | undefined): RoastLevel | null {
  if (!raw?.trim()) return null;
  const value = normalise(raw);
  return ROAST_PATTERNS.find((p) => p.match.some((m) => value.includes(m)))?.level ?? null;
}

/**
 * 1–5 for the roast bar. Unrecognised text lands in the middle — the bar has
 * to render something, and 3 is the least misleading guess.
 */
export function roastScale(raw: string | undefined): number {
  const level = parseRoastLevel(raw);
  return ROAST_PATTERNS.find((p) => p.level === level)?.scale ?? 3;
}

/** Whether a product matches a roast filter value (`light`, `medium`, …). */
export function matchesRoast(product: Product, filterValue: string): boolean {
  const level = parseRoastLevel(product.roastLevel);
  if (!level) return false;
  // Filter values are the canonical level names, but tolerate a Polish label
  // being passed in by mistake.
  return level === (parseRoastLevel(filterValue) ?? filterValue);
}

/* ─── Origin ──────────────────────────────────────────────────────────── */

/**
 * Country aliases. Keys are the canonical filter values used in
 * `lib/content/pl.ts`; each list holds the spellings a merchant might type.
 */
const ORIGIN_ALIASES: Record<string, string[]> = {
  Ethiopia: ["ethiopia", "etiopia"],
  Colombia: ["colombia", "kolumbia"],
  Kenya: ["kenya", "kenia"],
  Guatemala: ["guatemala", "gwatemala"],
  Brazil: ["brazil", "brasil", "brazylia"],
  Rwanda: ["rwanda"],
  Burundi: ["burundi"],
  Peru: ["peru"],
  Honduras: ["honduras"],
  Indonesia: ["indonesia", "indonezja"],
  Costa_Rica: ["costa rica", "kostaryka"],
};

/**
 * Whether a product's origin matches a country filter.
 *
 * `origin` is a full phrase like "Ethiopia · Yirgacheffe" or
 * "Etiopia · Yirgacheffe", so this is a contains check over every known
 * spelling. An unknown filter value falls back to matching itself, which
 * keeps the function useful if the country list grows in content before it
 * grows here.
 */
export function matchesOrigin(product: Product, filterValue: string): boolean {
  const origin = normalise(product.origin);
  if (!origin) return false;
  const aliases = ORIGIN_ALIASES[filterValue] ?? [normalise(filterValue)];
  return aliases.some((alias) => origin.includes(alias));
}
