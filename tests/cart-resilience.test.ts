import { beforeEach, describe, expect, it, vi } from "vitest";

const shopifyFetch = vi.hoisted(() => vi.fn());

// Hoisted alongside the mock: `vi.mock` is lifted to the top of the file, so
// anything its factory closes over has to be lifted with it.
const FakeShopifyError = vi.hoisted(
  () =>
    class FakeShopifyError extends Error {
      status: number;
      graphQLErrors: Array<{ message: string }> | null;
      constructor(
        message: string,
        status = 500,
        graphQLErrors: Array<{ message: string }> | null = null
      ) {
        super(message);
        this.status = status;
        this.graphQLErrors = graphQLErrors;
      }
    }
);

vi.mock("@/lib/shopify/client", () => ({
  shopifyFetch,
  ShopifyError: FakeShopifyError,
}));

import { addCartLines, getCart } from "@/lib/shopify/cart";
import { mapShopifyCart } from "@/lib/shopify/mappers/cart";

/**
 * The cart failure modes that cannot be clicked through: an expired cart, a
 * variant that stopped being purchasable, a permission problem, a Shopify
 * outage. Each one is a silent way to lose a sale, so each one is pinned
 * here rather than discovered in production.
 */

function shopifyCart(overrides: Record<string, unknown> = {}) {
  return {
    id: "gid://shopify/Cart/1",
    checkoutUrl: "https://shop.myshopify.com/checkouts/cn/abc?key=required",
    totalQuantity: 1,
    cost: {
      subtotalAmount: { amount: "50.00", currencyCode: "PLN" },
      totalAmount: { amount: "50.00", currencyCode: "PLN" },
    },
    discountCodes: [],
    lines: {
      nodes: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 1,
          merchandise: {
            id: "gid://shopify/ProductVariant/1",
            title: "500g / Ziarno",
            availableForSale: true,
            quantityAvailable: 7,
            price: { amount: "50.00", currencyCode: "PLN" },
            selectedOptions: [
              { name: "Waga", value: "500g" },
              { name: "Mielenie", value: "Ziarno" },
            ],
            image: { url: "https://cdn.shopify.com/variant.png", altText: "Wariant" },
            product: {
              handle: "kawa",
              title: "Aura ONE — Ethiopia",
              featuredImage: {
                url: "https://cdn.shopify.com/product.png",
                altText: "Produkt",
              },
              metafield: { value: "ONE" },
            },
          },
        },
      ],
    },
    ...overrides,
  };
}

beforeEach(() => vi.clearAllMocks());

describe("expired cart", () => {
  it("reports an absent cart as neither data nor failure", async () => {
    // Shopify answers `cart: null` for a cart that expired or already became
    // an order. The caller must be able to tell that apart from an outage so
    // it can quietly start a new cart instead of showing an error.
    shopifyFetch.mockResolvedValue({ cart: null });

    await expect(getCart("gid://shopify/Cart/gone")).resolves.toEqual({
      cart: null,
      error: null,
    });
  });

  it("treats a missing cart id as an empty cart rather than a request", async () => {
    await expect(getCart("")).resolves.toEqual({ cart: null, error: null });
    expect(shopifyFetch).not.toHaveBeenCalled();
  });
});

describe("failures reach the customer instead of being swallowed", () => {
  it("returns a message when Shopify is unreachable", async () => {
    shopifyFetch.mockRejectedValue(new FakeShopifyError("timeout", 0));

    const { cart, error } = await getCart("gid://shopify/Cart/1");
    expect(cart).toBeNull();
    expect(error).toBeTruthy();
  });

  it("says configuration, not outage, when Shopify rejects on permissions", async () => {
    shopifyFetch.mockRejectedValue(
      new FakeShopifyError("Błąd GraphQL", 200, [
        { message: "Access denied for cart field. Required access: scope" },
      ])
    );

    const { error } = await getCart("gid://shopify/Cart/1");
    // Wording differs from the generic failure so it is obvious in the UI
    // that this will never fix itself.
    expect(error).toMatch(/konfiguracji/i);
  });

  it("surfaces a userError while still returning the cart Shopify sent back", async () => {
    // Sold out mid-session: HTTP 200, no top-level errors, rejection lives
    // in the mutation payload.
    shopifyFetch.mockResolvedValue({
      cartLinesAdd: {
        cart: shopifyCart(),
        userErrors: [
          { field: ["lines"], message: "The merchandise is out of stock", code: "MERCHANDISE_OUT_OF_STOCK" },
        ],
      },
    });

    const { cart, error } = await addCartLines("gid://shopify/Cart/1", [
      { merchandiseId: "gid://shopify/ProductVariant/1", quantity: 1 },
    ]);

    expect(error).toBe("The merchandise is out of stock");
    expect(cart).not.toBeNull();
  });
});

describe("cart mapping", () => {
  it("marks a line Shopify will no longer sell", () => {
    const cart = mapShopifyCart(
      shopifyCart({
        lines: {
          nodes: [
            {
              ...shopifyCart().lines.nodes[0],
              merchandise: {
                ...shopifyCart().lines.nodes[0].merchandise,
                availableForSale: false,
                quantityAvailable: 0,
              },
            },
          ],
        },
      }) as never
    );

    expect(cart.lines[0].availableForSale).toBe(false);
    expect(cart.lines[0].quantityAvailable).toBe(0);
  });

  it("carries the checkout URL through untouched, key parameter included", () => {
    const cart = mapShopifyCart(shopifyCart() as never);
    expect(cart.checkoutUrl).toBe(
      "https://shop.myshopify.com/checkouts/cn/abc?key=required"
    );
  });

  it("prefers the short name and the variant image", () => {
    const cart = mapShopifyCart(shopifyCart() as never);
    expect(cart.lines[0].title).toBe("ONE");
    expect(cart.lines[0].image.src).toBe("https://cdn.shopify.com/variant.png");
    expect(cart.lines[0].variantTitle).toBe("500g · Ziarno");
  });

  it("falls back to the product image and title when the variant has neither", () => {
    const base = shopifyCart().lines.nodes[0];
    const cart = mapShopifyCart(
      shopifyCart({
        lines: {
          nodes: [
            {
              ...base,
              merchandise: {
                ...base.merchandise,
                image: null,
                selectedOptions: [],
                product: { ...base.merchandise.product, metafield: null },
              },
            },
          ],
        },
      }) as never
    );

    expect(cart.lines[0].title).toBe("Aura ONE — Ethiopia");
    expect(cart.lines[0].image.src).toBe("https://cdn.shopify.com/product.png");
    expect(cart.lines[0].variantTitle).toBe("500g / Ziarno");
  });

  it("converts Shopify's decimal strings to numbers", () => {
    const cart = mapShopifyCart(shopifyCart() as never);
    expect(cart.subtotal).toBe(50);
    expect(cart.lines[0].price).toBe(50);
  });
});
