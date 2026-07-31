import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Cart hydration — what happens on mount, on every page, before the
 * shopper has asked for anything.
 *
 * The failure this pins down was silent and self-perpetuating: a corrupted
 * `aura_cart_id` cookie made Shopify reject the read, the error surfaced as
 * a toast the customer could not act on, and because the read "failed" the
 * cookie was never cleared — so the toast came back on every page load
 * until they cleared cookies by hand.
 */

const cookieStore = vi.hoisted(() => {
  const jar = new Map<string, string>();
  return {
    jar,
    get: vi.fn((name: string) =>
      jar.has(name) ? { name, value: jar.get(name)! } : undefined
    ),
    set: vi.fn((name: string, value: string) => jar.set(name, value)),
    delete: vi.fn((name: string) => jar.delete(name)),
  };
});

const getCart = vi.hoisted(() => vi.fn());

vi.mock("next/headers", () => ({
  cookies: async () => cookieStore,
  headers: async () => new Map<string, string>(),
}));

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/lib/shopify/cart", () => ({
  getCart,
  createCart: vi.fn(),
  addCartLines: vi.fn(),
  updateCartLineQuantity: vi.fn(),
  removeCartLines: vi.fn(),
  setCartDiscountCodes: vi.fn(),
  setCartBuyerIdentity: vi.fn(),
}));

vi.mock("@/lib/shopify/customer-account/client", () => ({
  getValidCustomerSession: vi.fn(),
}));
vi.mock("@/lib/shopify/customer-account/session", () => ({ readSession: vi.fn() }));
vi.mock("@/lib/shopify/customer-account/account-data", () => ({
  getCustomerOrder: vi.fn(),
}));
vi.mock("@/lib/shopify/variants", () => ({ getVariantsByIds: vi.fn() }));

import { fetchCartAction } from "@/app/actions/cart";

const COOKIE = "aura_cart_id";
const VALID_ID = "gid://shopify/Cart/abc123";

beforeEach(() => {
  cookieStore.jar.clear();
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("fetchCartAction", () => {
  it("returns an empty cart when there is no cookie, without calling Shopify", async () => {
    await expect(fetchCartAction()).resolves.toEqual({ cart: null, error: null });
    expect(getCart).not.toHaveBeenCalled();
  });

  it("drops a cookie that is not a Cart GID without asking Shopify", async () => {
    cookieStore.jar.set(COOKIE, "smieci");

    await expect(fetchCartAction()).resolves.toEqual({ cart: null, error: null });
    expect(getCart).not.toHaveBeenCalled();
    expect(cookieStore.jar.has(COOKIE)).toBe(false);
  });

  it("forgets a cart Shopify no longer knows about", async () => {
    cookieStore.jar.set(COOKIE, VALID_ID);
    getCart.mockResolvedValue({ cart: null, error: null });

    await expect(fetchCartAction()).resolves.toEqual({ cart: null, error: null });
    expect(cookieStore.jar.has(COOKIE)).toBe(false);
  });

  it("never hands a hydration failure to the customer", async () => {
    // The shopper asked for nothing and can do nothing about a Shopify
    // outage; an empty cart is the honest fallback, a toast is noise.
    cookieStore.jar.set(COOKIE, VALID_ID);
    getCart.mockResolvedValue({ cart: null, error: "Shopify nie odpowiada." });

    const result = await fetchCartAction();

    expect(result.error).toBeNull();
    expect(result.cart).toBeNull();
    // …but it is still recorded server-side, so the outage is visible in logs.
    expect(console.error).toHaveBeenCalled();
  });

  it("returns the cart when Shopify answers", async () => {
    cookieStore.jar.set(COOKIE, VALID_ID);
    const cart = { id: VALID_ID, lines: [], checkoutUrl: "https://x/checkouts/cn/1" };
    getCart.mockResolvedValue({ cart, error: null });

    const result = await fetchCartAction();

    expect(result.cart).toBe(cart);
    expect(cookieStore.jar.get(COOKIE)).toBe(VALID_ID);
  });
});
