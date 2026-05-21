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
 * "od X zł" — signals a minimum/starting price, ready for Shopify variants
 * where the card shows priceRange.minVariantPrice.
 * [shopify-ready]: pass minVariantPrice.amount + minVariantPrice.currencyCode.
 */
export function formatPriceFrom(amount: number, currencyCode = "PLN"): string {
  return `od ${formatPrice(amount, currencyCode)}`;
}
