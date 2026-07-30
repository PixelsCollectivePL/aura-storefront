import { describe, expect, it } from "vitest";

import {
  findVariant,
  formatVariantTitle,
  resolveDefaultVariant,
} from "@/lib/product/variant";
import type { Product, ProductVariant } from "@/types/product";

/**
 * Regression tests for the bug found in the Faza 0 audit: variant matching
 * keyed off a hardcoded "Size" axis and ignored grind entirely, so a
 * two-axis product resolved to whichever variant happened to come first.
 */

function variant(
  id: string,
  options: Array<[string, string]>,
  extra: Partial<ProductVariant> = {}
): ProductVariant {
  return {
    variantId: `gid://shopify/ProductVariant/${id}`,
    title: options.map(([, v]) => v).join(" / "),
    price: { amount: 50, currencyCode: "PLN" },
    selectedOptions: options.map(([name, value]) => ({ name, value })),
    availableForSale: true,
    ...extra,
  };
}

function product(partial: Partial<Product>): Product {
  return {
    handle: "test",
    title: "Test",
    shortName: "TEST",
    origin: "",
    notes: [],
    lotCode: "",
    price: { amount: 50, currencyCode: "PLN" },
    roastLevel: "",
    availableForSale: true,
    grindOptions: [],
    sizeOptions: [],
    images: [],
    ...partial,
  };
}

const TWO_AXIS = product({
  sizeOptionName: "Waga",
  grindOptionName: "Mielenie",
  variants: [
    variant("1", [["Waga", "250g"], ["Mielenie", "Ziarno"]]),
    variant("2", [["Waga", "250g"], ["Mielenie", "Średni"]]),
    variant("3", [["Waga", "500g"], ["Mielenie", "Ziarno"]]),
    variant("4", [["Waga", "500g"], ["Mielenie", "Średni"]]),
  ],
});

describe("findVariant — two axes", () => {
  it("resolves the exact combination, not just the weight", () => {
    expect(findVariant(TWO_AXIS, { size: "500g", grind: "Średni" })?.variantId).toBe(
      "gid://shopify/ProductVariant/4"
    );
    expect(findVariant(TWO_AXIS, { size: "250g", grind: "Ziarno" })?.variantId).toBe(
      "gid://shopify/ProductVariant/1"
    );
  });

  it("distinguishes grind at the same weight — the original bug", () => {
    const a = findVariant(TWO_AXIS, { size: "250g", grind: "Ziarno" });
    const b = findVariant(TWO_AXIS, { size: "250g", grind: "Średni" });
    expect(a?.variantId).not.toBe(b?.variantId);
  });

  it("ignores case and stray whitespace, as merchants type these by hand", () => {
    expect(findVariant(TWO_AXIS, { size: " 500G ", grind: "średni" })?.variantId).toBe(
      "gid://shopify/ProductVariant/4"
    );
  });

  it("returns null for a combination the merchant does not offer", () => {
    expect(findVariant(TWO_AXIS, { size: "1kg", grind: "Ziarno" })).toBeNull();
  });
});

describe("findVariant — one axis", () => {
  const oneAxis = product({
    sizeOptionName: "Waga",
    variants: [
      variant("10", [["Waga", "250g"]]),
      variant("11", [["Waga", "500g"]]),
    ],
  });

  it("pins the variant with a single constraint", () => {
    expect(findVariant(oneAxis, { size: "500g" })?.variantId).toBe(
      "gid://shopify/ProductVariant/11"
    );
  });

  it("ignores a grind selection the product does not have", () => {
    expect(
      findVariant(oneAxis, { size: "250g", grind: "Nieistotne" })?.variantId
    ).toBe("gid://shopify/ProductVariant/10");
  });
});

describe("findVariant — degenerate cases", () => {
  it("returns the only variant when the product has no axes", () => {
    const single = product({ variants: [variant("20", [])] });
    expect(findVariant(single, {})?.variantId).toBe(
      "gid://shopify/ProductVariant/20"
    );
  });

  it("returns null when Shopify returned no variants", () => {
    expect(findVariant(product({ variants: [] }), { size: "250g" })).toBeNull();
    expect(findVariant(product({}), {})).toBeNull();
  });

  it("prefers a purchasable variant over a sold-out match", () => {
    const mixed = product({
      sizeOptionName: "Waga",
      variants: [
        variant("30", [["Waga", "250g"]], { availableForSale: false }),
        variant("31", [["Waga", "250g"]], { availableForSale: true }),
      ],
    });
    expect(findVariant(mixed, { size: "250g" })?.variantId).toBe(
      "gid://shopify/ProductVariant/31"
    );
  });
});

describe("resolveDefaultVariant", () => {
  it("skips sold-out variants so quick-add never drops one in the cart", () => {
    const p = product({
      variants: [
        variant("40", [["Waga", "250g"]], { availableForSale: false }),
        variant("41", [["Waga", "500g"]], { availableForSale: true }),
      ],
    });
    expect(resolveDefaultVariant(p)?.variantId).toBe(
      "gid://shopify/ProductVariant/41"
    );
  });

  it("returns null for a product with no variants", () => {
    expect(resolveDefaultVariant(product({}))).toBeNull();
  });
});

describe("formatVariantTitle", () => {
  it("joins the option values the way the storefront writes them", () => {
    expect(
      formatVariantTitle(variant("50", [["Waga", "500g"], ["Mielenie", "Ziarno"]]))
    ).toBe("500g · Ziarno");
  });

  it("falls back to Shopify's own variant title when there are no options", () => {
    const v = variant("51", []);
    v.title = "Default Title";
    expect(formatVariantTitle(v)).toBe("Default Title");
  });
});
