import { beforeEach, describe, expect, it, vi } from "vitest";

const shopifyFetch = vi.hoisted(() => vi.fn());

vi.mock("@/lib/shopify/client", () => ({
  shopifyFetch,
  ShopifyError: class ShopifyError extends Error {
    graphQLErrors?: Array<{ message: string }>;
  },
}));

import { setCartBuyerIdentity } from "@/lib/shopify/cart";
import { CART_BUYER_IDENTITY_UPDATE_MUTATION } from "@/lib/shopify/cart/operations";

describe("cart buyer identity", () => {
  beforeEach(() => vi.clearAllMocks());

  it("uses Shopify's supported cartBuyerIdentityUpdate mutation", () => {
    expect(CART_BUYER_IDENTITY_UPDATE_MUTATION).toContain("cartBuyerIdentityUpdate");
    expect(CART_BUYER_IDENTITY_UPDATE_MUTATION).toContain("CartBuyerIdentityInput!");
    expect(CART_BUYER_IDENTITY_UPDATE_MUTATION).not.toContain("checkoutCreate");
  });

  it("sends the customer token and buyer IP only through the server transport", async () => {
    shopifyFetch.mockResolvedValue({
      cartBuyerIdentityUpdate: { cart: null, userErrors: [] },
    });

    await setCartBuyerIdentity("gid://shopify/Cart/1?key=safe", "customer-token", {
      buyerIp: "203.0.113.10",
    });

    expect(shopifyFetch).toHaveBeenCalledWith(expect.objectContaining({
      buyerIp: "203.0.113.10",
      variables: {
        cartId: "gid://shopify/Cart/1?key=safe",
        buyerIdentity: { customerAccessToken: "customer-token" },
      },
      revalidate: false,
    }));
  });
});
