export function cn(...classes: (string | undefined | null | false | 0)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount: number, currencyCode = "PLN"): string {
  if (currencyCode === "PLN") {
    return `${amount} zł`;
  }
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * "od X zł" — legacy helper kept for backward compat.
 * Prefer formatPriceFromPLN / formatPricePLN for new UI.
 */
export function formatPriceFrom(amount: number, currencyCode = "PLN"): string {
  return `od ${formatPrice(amount, currencyCode)}`;
}

/**
 * "OD 84 PLN" — starting price label for ProductCard and PDP before variant
 * selection. Uppercase, PLN currency, Aura v2.1 brand style.
 * [shopify-ready]: pass priceRange.minVariantPrice.amount.
 */
export function formatPriceFromPLN(amount: number): string {
  return `OD ${amount} PLN`;
}

/**
 * "84 PLN" — exact variant price once a size is selected.
 * [shopify-ready]: pass selectedVariant.price.amount.
 */
export function formatPricePLN(amount: number): string {
  return `${amount} PLN`;
}
