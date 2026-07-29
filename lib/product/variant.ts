/**
 * Variant resolution — selection (size / grind) → a real Shopify variant.
 *
 * Why this exists: Cart API mutations key off `merchandiseId`, which is a
 * `gid://shopify/ProductVariant/...`. Nothing in the purchase flow may
 * invent an identifier from a title string — a synthetic id cannot be sent
 * to `cartLinesAdd` and silently diverges from the merchant's catalogue.
 *
 * Pure and dependency-free, so it stays unit-testable without a DOM.
 *
 * ── Matching model ───────────────────────────────────────────────────
 * Shopify exposes option axes generically (`product.options`), while the
 * Aura UI renders two named pickers. The mapper records which Shopify axis
 * backs each picker (`sizeOptionName`, `grindOptionName`); we constrain
 * only the axes that actually exist on the product. A product with one
 * axis is therefore pinned by one constraint, a two-axis product by two —
 * in both cases the match is unambiguous.
 *
 * Comparison is trimmed and case-insensitive: merchants edit these strings
 * by hand in Shopify Admin, and "200G" vs "200g" must not break checkout.
 */

import type { Product, ProductVariant } from "@/types/product";

/** One axis constraint: which Shopify option, and which value. */
export interface VariantSelection {
  /** Value picked on the size axis (e.g. "200g"). */
  size?: string;
  /** Value picked on the grind axis (e.g. "Ziarna"). */
  grind?: string;
}

function eq(a: string | undefined, b: string | undefined): boolean {
  return (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();
}

/** Whether a variant carries `value` on the axis named `name`. */
function matchesAxis(
  variant: ProductVariant,
  name: string,
  value: string
): boolean {
  return variant.selectedOptions.some(
    (o) => eq(o.name, name) && eq(o.value, value)
  );
}

/**
 * Build the list of (axis name, value) constraints implied by a selection.
 *
 * An axis is skipped when the product does not expose it, or when the UI
 * has no value for it — constraining a non-existent axis would match
 * nothing at all.
 */
function constraintsFor(
  product: Product,
  selection: VariantSelection
): Array<{ name: string; value: string }> {
  const out: Array<{ name: string; value: string }> = [];
  if (product.sizeOptionName && selection.size) {
    out.push({ name: product.sizeOptionName, value: selection.size });
  }
  if (product.grindOptionName && selection.grind) {
    out.push({ name: product.grindOptionName, value: selection.grind });
  }
  return out;
}

/** Prefer a purchasable variant; fall back to the first match. */
function preferAvailable(variants: ProductVariant[]): ProductVariant | null {
  return variants.find((v) => v.availableForSale !== false) ?? variants[0] ?? null;
}

/**
 * The variant matching the current selection, or `null` when the catalogue
 * offers no such combination (a merchant can legitimately not stock
 * "1kg + espresso").
 *
 * Callers must treat `null` as "not purchasable" — never as a reason to
 * synthesise an id.
 */
export function findVariant(
  product: Product,
  selection: VariantSelection
): ProductVariant | null {
  const variants = product.variants ?? [];
  if (variants.length === 0) return null;

  const constraints = constraintsFor(product, selection);

  // No axis to constrain (single-variant product): the only variant is it.
  if (constraints.length === 0) {
    return variants.length === 1 ? variants[0] : preferAvailable(variants);
  }

  const matches = variants.filter((v) =>
    constraints.every((c) => matchesAxis(v, c.name, c.value))
  );

  return preferAvailable(matches);
}

/**
 * Variant to use when the UI has no explicit selection — the card's
 * quick-add. Picks the first purchasable variant so quick-add never drops
 * a sold-out line into the cart.
 */
export function resolveDefaultVariant(product: Product): ProductVariant | null {
  return preferAvailable(product.variants ?? []);
}

/**
 * Human-readable variant label for the cart.
 *
 * Prefers the option values joined the way the storefront writes them
 * ("200g · Ziarna") and falls back to Shopify's own `variant.title`
 * ("200g / Ziarna") when a variant carries no `selectedOptions`.
 */
export function formatVariantTitle(variant: ProductVariant): string {
  const fromOptions = variant.selectedOptions
    .map((o) => o.value.trim())
    .filter(Boolean)
    .join(" · ");
  return fromOptions || variant.title;
}
