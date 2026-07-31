/**
 * Category chips on the product listing, built from Shopify collections.
 *
 * They used to be a hardcoded list in `lib/content/pl.ts` matched against
 * product tags with exact values (`espresso`, `filter`, `blend`, …) that
 * appear nowhere in Shopify Admin. A merchant creating a collection saw
 * nothing change on the storefront, and could only affect the filters by
 * guessing a tag convention no screen ever showed them.
 *
 * Now the merchant's collections are the categories. Pure and testable —
 * fetching happens in the page.
 */

import type { Collection } from "@/types/product";

export interface CategoryOption {
  /** Collection handle, or `"all"` for the reset chip. */
  value: string;
  label: string;
}

/**
 * Collections Shopify creates by itself, which are not product categories
 * and should not become filter chips.
 *
 * `frontpage` is the "Home page" collection every store starts with. It
 * usually contains the whole catalogue, so as a filter it is both
 * meaningless and confusing next to real categories.
 */
const AUTO_COLLECTION_HANDLES = new Set(["frontpage"]);

/**
 * Turn Shopify collections into the chip row, led by "Wszystko".
 *
 * Returns an empty array when there is nothing worth showing, which the
 * listing reads as "fall back to the legacy tag categories" rather than
 * rendering a row with a single useless chip.
 */
export function buildCategoryOptions(
  collections: Collection[],
  allLabel: string
): CategoryOption[] {
  const usable = collections
    .filter((c) => c.handle && !AUTO_COLLECTION_HANDLES.has(c.handle))
    .map((c) => ({ value: c.handle, label: c.title }));

  if (usable.length === 0) return [];

  return [{ value: "all", label: allLabel }, ...usable];
}
