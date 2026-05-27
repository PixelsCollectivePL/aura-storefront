import type {
  AccountCustomer,
  AccountOrder,
  AccountAddress,
  AccountSubscription,
} from "@/types/account";

/**
 * Mock account data — shaped to match Shopify Customer Account API.
 *
 * Data-access seam: all account reads go through the getters below.
 * On Shopify integration, re-implement these to query the Customer Account
 * API (and make them async). See docs/ACCOUNT_SHOPIFY_INTEGRATION_PLAN.md.
 */

const ORANGE = "var(--aura-orange)";
const GREEN  = "var(--aura-green)";
const PURPLE = "var(--aura-purple)";
const INK    = "var(--aura-ink)";

export const MOCK_CUSTOMER: AccountCustomer = {
  id: "gid://shopify/Customer/1029384756",
  firstName: "Kuba",
  lastName: "Wójcik",
  email: "kuba@pixelscollective.pl",
  phone: "+48 600 412 087",
  acceptsMarketing: true,
  acceptsSms: false,
  createdAt: "2024-09-18",
  defaultAddressId: "addr-1",
};

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
        variantTitle: "250g · Ziarno",
        quantity: 1,
        price: 64,
        accent: ORANGE,
      },
      {
        id: "li-1042-2",
        productId: "four",
        variantId: "four::250g",
        handle: "four",
        title: "Verde Tropical",
        variantTitle: "250g · Mielona — filtr",
        quantity: 1,
        price: 72,
        accent: GREEN,
      },
      {
        id: "li-1042-3",
        productId: "clip",
        variantId: "clip::stalowy",
        handle: "clip",
        title: "Klips do paczki",
        variantTitle: "Stalowy · czarny",
        quantity: 2,
        price: 10,
        accent: INK,
      },
    ],
    address: {
      name: "Kuba Wójcik",
      line1: "ul. Próżna 14/8",
      city: "00-107 Warszawa",
      country: "Polska",
      phone: "+48 600 412 087",
    },
    payment: { brand: "Visa", last4: "4242" },
    tracking: {
      carrier: "InPost",
      number: "693403812749",
      eta: "2026-05-28",
    },
    invoiceUrl: "#", // [future-integration]: BaseLinker / invoicing app
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
        variantTitle: "500g · Ziarno",
        quantity: 1,
        price: 142,
        accent: PURPLE,
      },
    ],
    address: {
      name: "Kuba Wójcik",
      line1: "ul. Próżna 14/8",
      city: "00-107 Warszawa",
      country: "Polska",
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
        variantTitle: "250g · Ziarno",
        quantity: 1,
        price: 58,
        accent: ORANGE,
      },
      {
        id: "li-1018-2",
        productId: "postcard",
        variantId: "postcard::drop01",
        handle: "postcard",
        title: "Pocztówka Aura",
        variantTitle: "Drop 01",
        quantity: 2,
        price: 4,
        accent: INK,
      },
    ],
    address: {
      name: "Kuba Wójcik",
      line1: "ul. Próżna 14/8",
      city: "00-107 Warszawa",
      country: "Polska",
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
        variantTitle: "250g · Ziarno",
        quantity: 1,
        price: 64,
        accent: ORANGE,
      },
    ],
    address: {
      name: "Kuba Wójcik",
      line1: "ul. Próżna 14/8",
      city: "00-107 Warszawa",
      country: "Polska",
    },
    payment: { brand: "Visa", last4: "4242" },
  },
];

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
};

export const MOCK_ADDRESSES: AccountAddress[] = [
  {
    id: "addr-1",
    isDefault: true,
    label: "Dom",
    firstName: "Kuba",
    lastName: "Wójcik",
    address1: "ul. Próżna 14/8",
    city: "Warszawa",
    zip: "00-107",
    country: "Polska",
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
    zip: "00-525",
    country: "Polska",
    phone: "+48 22 290 11 04",
  },
];

/* ─── Data-access seam ──────────────────────────────────────────────
   All account UI reads via these getters — never directly from the
   MOCK_* arrays. Swap to async Customer Account API later.

   [shopify-ready]: getCustomer       → customer query
   [shopify-ready]: getOrders         → customer.orders(first:N)
   [shopify-ready]: getOrder          → customer.orders(query:"name:#X") or by id
   [shopify-ready]: getAddresses      → customer.addresses(first:25)
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
