import type {
  AccountCustomer,
  AccountOrder,
  AccountAddress,
  AccountSubscription,
  AccountStats,
  AccountTastedBlend,
  SubscriptionCadenceOption,
  SubscriptionBlendOption,
} from "@/types/account";

/**
 * Mock account data — shaped to match Shopify Customer Account API.
 *
 * Data-access seam: all account UI reads go through the getters below.
 * On Shopify integration, re-implement these to call the Customer
 * Account API (and make them async). See
 * docs/ACCOUNT_SHOPIFY_INTEGRATION_PLAN.md.
 */

const ORANGE = "var(--aura-orange)";
const GREEN  = "var(--aura-green)";
const PURPLE = "var(--aura-purple)";
const INK    = "var(--aura-ink)";

/* ──────────────────────────────────────────────────────────────────
   Customer
   ────────────────────────────────────────────────────────────────── */
export const MOCK_CUSTOMER: AccountCustomer = {
  id: "gid://shopify/Customer/1029384756",
  firstName: "Kuba",
  lastName: "Wójcik",
  displayName: "Kuba Wójcik",
  email: "kuba@pixelscollective.pl",
  phone: "+48 600 412 087",
  acceptsMarketing: true,
  acceptsSms: false,
  createdAt: "2024-09-18",
  defaultAddressId: "addr-1",
};

/* ──────────────────────────────────────────────────────────────────
   Orders
   ────────────────────────────────────────────────────────────────── */
export const MOCK_ORDERS: AccountOrder[] = [
  {
    id: "gid://shopify/Order/5582901",
    name: "#AU-1042",
    processedAt: "2026-05-22",
    fulfillmentStatus: "in_transit",
    financialStatus: "paid",
    subtotalPrice: 156,
    shippingPrice: 0,
    totalPrice: 156,
    currencyCode: "PLN",
    items: [
      {
        id: "li-1042-1",
        productId: "two",
        variantId: "two::250g",
        handle: "two",
        title: "Coração do Brasil",
        productTitle: "Coração do Brasil",
        variantTitle: "250g · Ziarno",
        quantity: 1,
        price: 64,
        currencyCode: "PLN",
        accent: ORANGE,
      },
      {
        id: "li-1042-2",
        productId: "four",
        variantId: "four::250g",
        handle: "four",
        title: "Verde Tropical",
        productTitle: "Verde Tropical",
        variantTitle: "250g · Mielona — filtr",
        quantity: 1,
        price: 72,
        currencyCode: "PLN",
        accent: GREEN,
      },
      {
        id: "li-1042-3",
        productId: "clip",
        variantId: "clip::stalowy",
        handle: "clip",
        title: "Klips do paczki",
        productTitle: "Klips do paczki",
        variantTitle: "Stalowy · czarny",
        quantity: 2,
        price: 10,
        currencyCode: "PLN",
        accent: INK,
      },
    ],
    address: {
      name: "Kuba Wójcik",
      line1: "ul. Próżna 14/8",
      city: "00-107 Warszawa",
      province: "mazowieckie",
      country: "Polska",
      countryCode: "PL",
      phone: "+48 600 412 087",
    },
    payment: { brand: "Visa", last4: "4242" },
    tracking: {
      carrier: "InPost",
      number: "693403812749",
      eta: "2026-05-28",
      // [shopify-ready]: from fulfillments.trackingInfo.url
      url: "#track",
      // [shopify-ready]: derived from fulfillment.events + fulfillmentStatus
      timeline: [
        { status: "placed",     label: "Zamówienie przyjęte", at: "2026-05-22T14:08" },
        { status: "packed",     label: "Paczka spakowana",    at: "2026-05-23T09:42" },
        { status: "in_transit", label: "W drodze · InPost",   at: "2026-05-24T18:11", current: true },
        { status: "delivered",  label: "Dostarczone" },
      ],
    },
    statusUrl: "#order-status",
    /** [future-integration]: invoiceUrl typically from BaseLinker / invoicing app */
    invoiceUrl: "#invoice",
  },
  {
    id: "gid://shopify/Order/5572101",
    name: "#AU-1031",
    processedAt: "2026-05-08",
    fulfillmentStatus: "delivered",
    financialStatus: "paid",
    subtotalPrice: 142,
    shippingPrice: 0,
    totalPrice: 142,
    currencyCode: "PLN",
    items: [
      {
        id: "li-1031-1",
        productId: "five",
        variantId: "five::500g",
        handle: "five",
        title: "Lila Nocturna",
        productTitle: "Lila Nocturna",
        variantTitle: "500g · Ziarno",
        quantity: 1,
        price: 142,
        currencyCode: "PLN",
        accent: PURPLE,
      },
    ],
    address: {
      name: "Kuba Wójcik",
      line1: "ul. Próżna 14/8",
      city: "00-107 Warszawa",
      country: "Polska",
      countryCode: "PL",
      phone: "+48 600 412 087",
    },
    payment: { brand: "Visa", last4: "4242" },
  },
  {
    id: "gid://shopify/Order/5560044",
    name: "#AU-1018",
    processedAt: "2026-04-22",
    fulfillmentStatus: "delivered",
    financialStatus: "paid",
    subtotalPrice: 66,
    shippingPrice: 12,
    totalPrice: 78,
    currencyCode: "PLN",
    items: [
      {
        id: "li-1018-1",
        productId: "three",
        variantId: "three::250g",
        handle: "three",
        title: "Mezcla Casa",
        productTitle: "Mezcla Casa",
        variantTitle: "250g · Ziarno",
        quantity: 1,
        price: 58,
        currencyCode: "PLN",
        accent: ORANGE,
      },
      {
        id: "li-1018-2",
        productId: "postcard",
        variantId: "postcard::drop01",
        handle: "postcard",
        title: "Pocztówka Aura",
        productTitle: "Pocztówka Aura",
        variantTitle: "Drop 01",
        quantity: 2,
        price: 4,
        currencyCode: "PLN",
        accent: INK,
      },
    ],
    address: {
      name: "Kuba Wójcik",
      line1: "ul. Próżna 14/8",
      city: "00-107 Warszawa",
      country: "Polska",
      countryCode: "PL",
    },
    payment: { brand: "Visa", last4: "4242" },
  },
  {
    id: "gid://shopify/Order/5541920",
    name: "#AU-0994",
    processedAt: "2026-04-01",
    fulfillmentStatus: "delivered",
    financialStatus: "paid",
    subtotalPrice: 52,
    shippingPrice: 12,
    totalPrice: 64,
    currencyCode: "PLN",
    items: [
      {
        id: "li-0994-1",
        productId: "two",
        variantId: "two::250g",
        handle: "two",
        title: "Coração do Brasil",
        productTitle: "Coração do Brasil",
        variantTitle: "250g · Ziarno",
        quantity: 1,
        price: 64,
        currencyCode: "PLN",
        accent: ORANGE,
      },
    ],
    address: {
      name: "Kuba Wójcik",
      line1: "ul. Próżna 14/8",
      city: "00-107 Warszawa",
      country: "Polska",
      countryCode: "PL",
    },
    payment: { brand: "Visa", last4: "4242" },
  },
];

/* ──────────────────────────────────────────────────────────────────
   Subscription
   [future-integration]: real subscription data comes from Shopify
   Subscriptions / Recharge / Customer Account Extension.
   ────────────────────────────────────────────────────────────────── */
export const MOCK_SUBSCRIPTION: AccountSubscription = {
  id: "gid://aura-subs/Sub/77",
  status: "active",
  blendHandle: "two",
  blendName: "Coração do Brasil",
  variantTitle: "500g · Ziarno",
  cadenceWeeks: 2,
  nextShipmentAt: "2026-06-04",
  priceCycle: 118,
  currencyCode: "PLN",
  paymentStatus: "ok",
  startedAt: "2026-01-12",
  cyclesDelivered: 9,
  accent: ORANGE,
  cycles: [
    { cycleNumber: 9, deliveredAt: "2026-05-21", status: "delivered" },
    { cycleNumber: 8, deliveredAt: "2026-05-07", status: "delivered" },
    { cycleNumber: 7, deliveredAt: "2026-04-23", status: "delivered" },
    { cycleNumber: 6, deliveredAt: "2026-04-09", status: "delivered" },
    { cycleNumber: 10, deliveredAt: "2026-06-04", status: "unfulfilled" },
  ],
};

/* ──────────────────────────────────────────────────────────────────
   Subscription catalog options (cadence + blend swap).
   NOT customer data — these are catalog/plan options. On Shopify these
   come from `sellingPlanGroups` query (cadences) and product collection
   (blends).
   ────────────────────────────────────────────────────────────────── */
export const SUBSCRIPTION_CADENCE_OPTIONS: SubscriptionCadenceOption[] = [
  { cadenceWeeks: 1, label: "Co tydzień",     hint: "Dla codziennych" },
  { cadenceWeeks: 2, label: "Co 2 tygodnie",  hint: "Polecane",        recommended: true },
  { cadenceWeeks: 4, label: "Co miesiąc",     hint: "Dla wolniejszych" },
  { cadenceWeeks: 8, label: "Co 2 miesiące",  hint: "Tylko wieczorem" },
];

export const SUBSCRIPTION_BLEND_OPTIONS: SubscriptionBlendOption[] = [
  { handle: "two",   name: "Coração do Brasil", hint: "Espresso · ciemniejszy", accent: ORANGE },
  { handle: "four",  name: "Verde Tropical",    hint: "Filtr · cytrusowy",       accent: GREEN },
  { handle: "five",  name: "Lila Nocturna",     hint: "Espresso · winny",        accent: PURPLE },
];

/* ──────────────────────────────────────────────────────────────────
   Addresses
   ────────────────────────────────────────────────────────────────── */
export const MOCK_ADDRESSES: AccountAddress[] = [
  {
    id: "addr-1",
    isDefault: true,
    label: "Dom",
    firstName: "Kuba",
    lastName: "Wójcik",
    address1: "ul. Próżna 14/8",
    city: "Warszawa",
    province: "mazowieckie",
    zip: "00-107",
    country: "Polska",
    countryCode: "PL",
    phone: "+48 600 412 087",
  },
  {
    id: "addr-2",
    isDefault: false,
    label: "Studio",
    firstName: "Pixels Collective",
    lastName: "sp. z o.o.",
    company: "Pixels Collective sp. z o.o.",
    address1: "ul. Krucza 41",
    city: "Warszawa",
    province: "mazowieckie",
    zip: "00-525",
    country: "Polska",
    countryCode: "PL",
    phone: "+48 22 290 11 04",
  },
];

/* ──────────────────────────────────────────────────────────────────
   Dashboard stats + tasted blends
   [derived / future]: in production these come from:
     - order-history aggregation (this year count, favorite blend),
     - loyalty app metafield (points).
   For now: static mock.
   ────────────────────────────────────────────────────────────────── */
export const MOCK_STATS: AccountStats = {
  ordersTotal: MOCK_ORDERS.length,
  ordersThisYear: 4,
  favoriteBlend: "Coração",
  favoriteBlendSubtitle: "do espresso",
  loyaltyPoints: 128,
  loyaltyPointsToNext: 22,
};

export const MOCK_TASTED_BLENDS: AccountTastedBlend[] = [
  { handle: "two",  name: "Coração do Brasil", timesOrdered: 3 },
  { handle: "four", name: "Verde Tropical",    timesOrdered: 1 },
  { handle: "five", name: "Lila Nocturna",     timesOrdered: 1 },
  { handle: "three", name: "Mezcla Casa",     timesOrdered: 1 },
];

/* ─── Data-access seam ──────────────────────────────────────────────
   All account UI reads via these getters — never directly from the
   MOCK_* arrays. Swap to async Customer Account API later.

   [shopify-ready]: getCustomer       → customer query
   [shopify-ready]: getOrders         → customer.orders(first:N)
   [shopify-ready]: getOrder          → customer.orders(query:"name:#X") or by id
   [shopify-ready]: getAddresses      → customer.addresses(first:25)
   [derived]:       getAccountStats   → computed from orders + loyalty app
   [derived]:       getTastedBlends   → computed from order history
   [future-integration]: getSubscription → Recharge / Shopify Subscriptions
   ────────────────────────────────────────────────────────────────── */

export function getCustomer(): AccountCustomer {
  return MOCK_CUSTOMER;
}

export function getOrders(): AccountOrder[] {
  return MOCK_ORDERS;
}

export function getOrder(idOrName: string): AccountOrder | undefined {
  return MOCK_ORDERS.find((o) => o.id === idOrName || o.name === idOrName);
}

export function getAddresses(): AccountAddress[] {
  return MOCK_ADDRESSES;
}

export function getSubscription(): AccountSubscription | null {
  return MOCK_SUBSCRIPTION;
}

export function getAccountStats(): AccountStats {
  return MOCK_STATS;
}

export function getTastedBlends(): AccountTastedBlend[] {
  return MOCK_TASTED_BLENDS;
}
