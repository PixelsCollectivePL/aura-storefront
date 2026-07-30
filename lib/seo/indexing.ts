/**
 * Search-engine indexing switch.
 *
 * Default is NOT indexable. The storefront is under active development and
 * an accidentally indexed work-in-progress is far more expensive to undo
 * than a launch-day env change: once Google has the URLs, removing them
 * takes weeks.
 *
 * Flip at launch by setting `AURA_ALLOW_INDEXING=true` in Vercel
 * (Production only — Preview deployments should never be indexable).
 *
 * ── Why noindex and not `Disallow: /` ────────────────────────────────
 * They are not interchangeable. `Disallow` stops crawling, but a URL
 * linked from anywhere else can still land in the index without its
 * content — and a crawler that never fetches the page never sees a
 * `noindex`. So we do the opposite of the folk wisdom: allow crawling,
 * and answer every request with an explicit `noindex` (both as a meta tag
 * and as an `X-Robots-Tag` header, so non-HTML responses are covered too).
 * That is what actually keeps pages out of the index.
 */

/** Whether this deployment may be indexed. Opt-in, never assumed. */
export function isIndexingAllowed(): boolean {
  return process.env.AURA_ALLOW_INDEXING === "true";
}

/** `robots` metadata for the root layout. */
export const ROBOTS_METADATA = isIndexingAllowed()
  ? { index: true, follow: true }
  : { index: false, follow: false, nocache: true };
