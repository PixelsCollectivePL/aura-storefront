/**
 * Date formatting helpers used across account screens.
 * pl-PL locale; matches the design's "12 maja 2026" / "12 maja" style.
 */

export function formatDateLong(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatDateShort(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pl-PL", {
      day: "numeric",
      month: "long",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
