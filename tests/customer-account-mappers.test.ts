import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/shopify/customer-account/client", () => ({ customerAccountFetch: vi.fn() }));

import { mapOrder } from "@/lib/shopify/customer-account/account-data";

const order = {
  id: "gid://shopify/Order/123",
  name: "#1001",
  processedAt: "2026-07-30T10:00:00Z",
  fulfillmentStatus: "PARTIALLY_FULFILLED",
  financialStatus: "PAID",
  currencyCode: "PLN",
  subtotal: { amount: "45.00", currencyCode: "PLN" },
  totalShipping: { amount: "10.00", currencyCode: "PLN" },
  totalPrice: { amount: "55.00", currencyCode: "PLN" },
  statusPageUrl: "https://example.myshopify.com/orders/status",
  shippingAddress: {
    id: "gid://shopify/CustomerAddress/1", firstName: "Jan", lastName: "Kowalski",
    company: null, address1: "Kawowa 1", address2: null, city: "Warszawa",
    zoneCode: null, province: null, zip: "00-001", country: "Polska",
    territoryCode: "PL", phoneNumber: "+48123456789",
  },
  lineItems: { nodes: [{
    id: "gid://shopify/LineItem/1", productId: "gid://shopify/Product/2",
    variantId: "gid://shopify/ProductVariant/3", name: "Aura Blend", title: "Aura Blend",
    variantTitle: "500 g", quantity: 2, price: { amount: "22.50", currencyCode: "PLN" },
    image: { url: "https://cdn.shopify.com/image.jpg", altText: null },
  }] },
  fulfillments: { nodes: [{
    status: "SUCCESS",
    trackingInformation: [{ company: "InPost", number: "ABC", url: "https://inpost.pl/sledzenie" }],
  }] },
};

describe("Customer Account API order mapper", () => {
  it("maps Shopify money, status, lines, address and tracking without mock data", () => {
    const mapped = mapOrder(order);
    expect(mapped).toMatchObject({
      id: order.id,
      fulfillmentStatus: "in_transit",
      financialStatus: "paid",
      subtotalPrice: 45,
      shippingPrice: 10,
      totalPrice: 55,
      statusUrl: order.statusPageUrl,
      address: { name: "Jan Kowalski", city: "00-001 Warszawa", countryCode: "PL" },
      tracking: { carrier: "InPost", number: "ABC" },
    });
    expect(mapped.items[0]).toMatchObject({
      variantId: "gid://shopify/ProductVariant/3",
      quantity: 2,
      price: 22.5,
      image: { src: "https://cdn.shopify.com/image.jpg", alt: "Aura Blend" },
    });
    expect(mapped.tracking?.eta).toBeUndefined();
  });

  it("does not turn missing shipping or tracking data into fake fulfillment details", () => {
    const mapped = mapOrder({ ...order, shippingAddress: null, fulfillments: { nodes: [] } });
    expect(mapped.address).toEqual({ name: "", line1: "", city: "", country: "" });
    expect(mapped.tracking).toBeUndefined();
  });
});
