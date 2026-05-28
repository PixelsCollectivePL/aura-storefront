/**
 * Account types — shaped to match Shopify Customer Account API.
 *
 * **Source of truth on real integration:**
 *   - Customer    ← `customer { ... }` (Customer Account API)
 *   - Order       ← `customer.orders.edges.node`
 *   - Address     ← `customer.addresses.edges.node`
 *   - Subscription ← Subscription app (Recharge / Shopify Subscriptions)
 *                    or Customer Account Extension. No native Storefront type.
 *
 * **GIDs:** IDs use Shopify GID format where applicable
 *   (`gid://shopify/<Type>/<id>`) so mock-to-real swap is 1:1.
 *
 * **Simplifications vs. Shopify** (intentional — annotated inline):
 *   - `acceptsMarketing` / `acceptsSms` are booleans here; Shopify returns
 *     `emailMarketingConsent` / `smsMarketingConsent` objects with
 *     `{ marketingState, marketingOptInLevel, consentUpdatedAt }`.
 *     The UI is on/off; the mapping layer flattens.
 *   - `defaultAddressId` is just the ID; Shopify returns the full
 *     `defaultAddress` object reference.
 *   - `AccountOrder.items` is locally named (Shopify uses `lineItems`);
 *     kept for codebase ergonomics — adapter will map.
 *   - `AccountOrder.address` is locally named (Shopify uses
 *     `shippingAddress`); adapter will map.
 *   - `AccountOrder.tracking` flattens `fulfillments[0].trackingInfo`.
 */

/* ──────────────────────────────────────────────────────────────────
   Money — match Shopify MoneyV2
   ────────────────────────────────────────────────────────────────── */
export interface Money {
  amount: number;
  currencyCode: string;            // "PLN"
}

/* ──────────────────────────────────────────────────────────────────
   Customer
   ────────────────────────────────────────────────────────────────── */
export interface AccountCustomer {
  id: string;                      // gid://shopify/Customer/...
  firstName: string;
  lastName: string;
  /** Optional convenience field; Shopify's `customer.displayName`. */
  displayName?: string;
  email: string;
  phone?: string;
  /** Maps to `customer.emailMarketingConsent.marketingState === "SUBSCRIBED"` */
  acceptsMarketing: boolean;
  /** Maps to `customer.smsMarketingConsent.marketingState === "SUBSCRIBED"` */
  acceptsSms: boolean;
  createdAt: string;               // ISO date
  /** Shopify exposes the full defaultAddress object; we keep just the id. */
  defaultAddressId?: string;
}

/* ──────────────────────────────────────────────────────────────────
   Orders
   ────────────────────────────────────────────────────────────────── */
export type FulfillmentStatus =
  | "unfulfilled"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type FinancialStatus =
  | "paid"
  | "pending"
  | "refunded"
  | "voided";

export interface AccountOrderLineItem {
  id: string;                      // line ID
  productId: string;               // gid://shopify/Product/...
  variantId: string;               // gid://shopify/ProductVariant/... — used by reorder (cartLinesAdd)
  handle: string;                  // product handle, for /produkty/[handle] linking
  title: string;                   // Shopify `lineItem.title` (= variant title or product+variant)
  /** Plain product title without variant detail — Shopify `lineItem.name` or `product.title`. */
  productTitle?: string;
  variantTitle: string;
  quantity: number;
  price: number;                   // per-unit, in `currencyCode`
  /** Defaults to the order's currency when unset. */
  currencyCode?: string;
  image?: { src: string; alt: string };
  /** Frontend-only display accent (brand color) — not from Shopify. */
  accent?: string;
}

export interface AccountOrderAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;                    // includes postal code when stored as one line
  /** Shopify: `province` / `provinceCode` (state / region) */
  province?: string;
  country: string;
  /** ISO country code (Shopify returns both `country` and `countryCodeV2`). */
  countryCode?: string;
  phone?: string;
}

/** One step of the fulfillment timeline.
 *  Shopify reality: derived from `fulfillment.events` + status enum. */
export interface AccountFulfillmentEvent {
  status: "placed" | "packed" | "in_transit" | "delivered";
  label: string;
  at?: string;                     // ISO datetime; absent for future steps
  /** Current step in the timeline (visual highlight). */
  current?: boolean;
}

export interface AccountOrderTracking {
  carrier: string;                 // e.g. "InPost"
  number: string;
  eta: string;                     // ISO date
  url?: string;                    // carrier tracking URL
  /** Optional timeline events; falls back to default progression in UI. */
  timeline?: AccountFulfillmentEvent[];
}

export interface AccountOrder {
  id: string;                      // gid://shopify/Order/...
  name: string;                    // "#AU-1042"
  processedAt: string;             // ISO date
  fulfillmentStatus: FulfillmentStatus;
  financialStatus: FinancialStatus;
  subtotalPrice: number;
  shippingPrice: number;
  totalPrice: number;
  currencyCode: string;
  items: AccountOrderLineItem[];   // Shopify `order.lineItems` — see notes above
  address: AccountOrderAddress;    // Shopify `order.shippingAddress` — see notes above
  payment?: { brand: string; last4: string };
  tracking?: AccountOrderTracking;
  /** Shopify `order.statusUrl` — public order-status page link. */
  statusUrl?: string;
  /** [future-integration]: invoiceUrl typically comes from BaseLinker
   *  or an invoicing app, not Storefront API. Conditional in UI. */
  invoiceUrl?: string;
}

/* ──────────────────────────────────────────────────────────────────
   Addresses (saved customer addresses)
   ────────────────────────────────────────────────────────────────── */
export interface AccountAddress {
  id: string;
  isDefault: boolean;
  /** Frontend-only display label (e.g. "Dom", "Studio"). Not a Shopify
   *  field — would need a customer metafield or be derived. */
  label?: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  zip: string;
  country: string;
  countryCode?: string;
  phone?: string;
}

/* ──────────────────────────────────────────────────────────────────
   Subscription
   NOTE: No native Storefront type. Shape mirrors Shopify Subscriptions /
   Recharge contract — fields may map differently per app.
   ────────────────────────────────────────────────────────────────── */
export type SubscriptionStatus = "active" | "paused" | "cancelled" | "failed";

export interface AccountSubscriptionCycle {
  cycleNumber: number;
  /** ISO date of past shipment, or planned shipment for unfulfilled. */
  deliveredAt: string;
  status: FulfillmentStatus;
}

export interface AccountSubscription {
  id: string;                      // gid://aura-subs/Sub/...
  status: SubscriptionStatus;
  blendHandle: string;
  blendName: string;
  variantTitle: string;            // "500g · Ziarno"
  cadenceWeeks: number;            // 1 | 2 | 4 | 8
  nextShipmentAt: string;          // ISO date
  priceCycle: number;
  currencyCode: string;
  paymentStatus: "ok" | "failed" | "paused";
  startedAt: string;
  cyclesDelivered: number;
  cycles?: AccountSubscriptionCycle[];
  accent?: string;
}

/* ──────────────────────────────────────────────────────────────────
   Subscription catalog options (cadence + blend swap)
   These are NOT customer data — they're plan / catalog data.
   On Shopify they come from `sellingPlanGroups` query.
   ────────────────────────────────────────────────────────────────── */
export interface SubscriptionCadenceOption {
  cadenceWeeks: number;
  label: string;
  hint: string;
  recommended?: boolean;
}

export interface SubscriptionBlendOption {
  handle: string;
  name: string;
  hint: string;
  accent?: string;
}

/* ──────────────────────────────────────────────────────────────────
   Derived / aggregate stats shown on the dashboard.
   On Shopify: computed from `customer.orders` or from a loyalty app
   metafield (`loyaltyPoints`). Today: mock values.
   ────────────────────────────────────────────────────────────────── */
export interface AccountStats {
  ordersTotal: number;
  ordersThisYear: number;
  /** [derived]: from order-history aggregation */
  favoriteBlend?: string;
  favoriteBlendSubtitle?: string;
  /** [future-integration]: loyalty app */
  loyaltyPoints?: number;
  loyaltyPointsToNext?: number;
}

export interface AccountTastedBlend {
  handle: string;
  name: string;
  timesOrdered: number;
}

/* ──────────────────────────────────────────────────────────────────
   Section keys — drives sidebar nav & section state
   ────────────────────────────────────────────────────────────────── */
export type AccountSection =
  | "dashboard"
  | "orders"
  | "order-details"
  | "subscriptions"
  | "addresses"
  | "details";

/** Auth view state — drives whether to render the panel or a special state. */
export type AccountViewState = "loggedIn" | "loggedOut" | "loading" | "error";
