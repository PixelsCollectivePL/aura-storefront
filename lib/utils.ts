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
