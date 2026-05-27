/**
 * Account types — shaped to match Shopify Customer Account API.
 * When wiring real Shopify Customer Accounts:
 *   - Customer ← `customer { ... }`
 *   - Order    ← `customer.orders.edges.node`
 *   - Address  ← `customer.addresses.edges.node`
 *   - Subscription ← Subscription app (Recharge / Shopify Subscriptions) or
 *                    Customer Account Extension. No native Storefront type.
 *
 * IDs use GID format (gid://shopify/<Type>/<id>) so mock-to-real swap is 1:1.
 */

/** ──────────────────────────────────────────────────────────────────
    Money / shipping fragments — match Shopify MoneyV2
    ────────────────────────────────────────────────────────────────── */
export interface Money {
  amount: number;
  currencyCode: string;            // "PLN"
}

/** ──────────────────────────────────────────────────────────────────
    Customer
    ────────────────────────────────────────────────────────────────── */
export interface AccountCustomer {
  id: string;                      // gid://shopify/Customer/...
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  acceptsMarketing: boolean;
  acceptsSms: boolean;
  createdAt: string;               // ISO date
  defaultAddressId?: string;
}

/** ──────────────────────────────────────────────────────────────────
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
  productId: string;               // gid://shopify/Product/... (or handle)
  variantId: string;               // gid://shopify/ProductVariant/...
  handle: string;
  title: string;
  variantTitle: string;
  quantity: number;
  price: number;                   // PLN per unit
  image?: { src: string; alt: string };
  accent?: string;                 // brand accent for thumb (CSS color)
}

export interface AccountOrderAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;                    // "00-107 Warszawa" — includes postal code (matches mock)
  country: string;
  phone?: string;
}

export interface AccountOrderTracking {
  carrier: string;                 // "InPost"
  number: string;
  eta: string;                     // ISO date
  url?: string;
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
  items: AccountOrderLineItem[];
  address: AccountOrderAddress;
  payment?: { brand: string; last4: string };
  tracking?: AccountOrderTracking;
  invoiceUrl?: string;             // optional — may come from BaseLinker / invoicing app
}

/** ──────────────────────────────────────────────────────────────────
    Addresses (saved customer addresses, separate from order address)
    ────────────────────────────────────────────────────────────────── */
export interface AccountAddress {
  id: string;
  isDefault: boolean;
  label: string;                   // "Dom" / "Studio"
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
}

/** ──────────────────────────────────────────────────────────────────
    Subscription
    NOTE: No native Storefront type. Shape mirrors Shopify Subscriptions /
    Recharge contract — fields might map differently when integrating.
    ────────────────────────────────────────────────────────────────── */
export type SubscriptionStatus = "active" | "paused" | "cancelled" | "failed";

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
  accent?: string;
}

/** ──────────────────────────────────────────────────────────────────
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
