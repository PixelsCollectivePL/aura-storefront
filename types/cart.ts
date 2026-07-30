/**
 * Cart types — the app-level shape, mapped from Shopify Cart API.
 *
 * Source of truth is the Shopify `Cart` object. Nothing here is invented
 * locally: `id` is a `gid://shopify/Cart/...`, `lines[].id` is a
 * `gid://shopify/CartLine/...`, and `variantId` is the `merchandiseId`
 * every Cart mutation keys off.
 *
 * Money arrives from Shopify as decimal strings ("50.00") and is
 * converted to numbers here, because the whole UI formats numbers.
 */

/** One line of the cart. Shape is UI-facing and deliberately flat. */
export interface CartLine {
  /** `gid://shopify/CartLine/...` — the id `cartLinesUpdate`/`Remove` take. */
  id: string;
  /** Product handle, for linking back to the PDP. */
  productId: string;
  /** `gid://shopify/ProductVariant/...` — the `merchandiseId`. */
  variantId: string;
  handle: string;
  /** Display name: `custom.short_name` metafield, falling back to title. */
  title: string;
  /** "500g · Ziarno" — built from the variant's selected options. */
  variantTitle: string;
  image: { src: string; alt: string };
  /** Per-unit price in `currencyCode`. */
  price: number;
  currencyCode: string;
  quantity: number;
  /** False when the merchant took the variant off sale after it was added. */
  availableForSale: boolean;
  /** Stock ceiling reported by Shopify, when the inventory scope allows it. */
  quantityAvailable?: number;
}

/** A discount code attached to the cart, and whether Shopify honoured it. */
export interface CartDiscountCode {
  code: string;
  applicable: boolean;
}

/** The cart as the UI needs it. */
export interface Cart {
  /** `gid://shopify/Cart/...` */
  id: string;
  /**
   * Shopify-hosted checkout URL. Carries a required `key` parameter, so it
   * must be used verbatim and never reconstructed by hand. Re-read it
   * immediately before redirecting — it can go stale.
   */
  checkoutUrl: string;
  totalQuantity: number;
  /** Line items before shipping and discounts. */
  subtotal: number;
  /** What Shopify says the cart costs, after discounts it can compute. */
  total: number;
  currencyCode: string;
  discountCodes: CartDiscountCode[];
  lines: CartLine[];
}

/**
 * What a cart Server Action hands back to the client.
 *
 * `cart` is `null` for an empty/absent cart. `error` is a human-readable
 * Polish message — cart failures are shown to the customer rather than
 * swallowed, because a silently dropped add-to-cart loses a sale.
 */
export interface CartResult {
  cart: Cart | null;
  error: string | null;
}
