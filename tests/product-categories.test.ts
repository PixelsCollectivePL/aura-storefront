import { describe, expect, it } from "vitest";

import { buildCategoryOptions } from "@/lib/product/categories";
import type { Collection } from "@/types/product";

function collection(handle: string, title: string): Collection {
  return { id: `gid://shopify/Collection/${handle}`, handle, title };
}

describe("buildCategoryOptions", () => {
  it("turns collections into chips, led by the reset chip", () => {
    const options = buildCategoryOptions(
      [collection("espresso", "Espresso"), collection("filtrowe", "Filtrowe")],
      "Wszystko"
    );

    expect(options).toEqual([
      { value: "all", label: "Wszystko" },
      { value: "espresso", label: "Espresso" },
      { value: "filtrowe", label: "Filtrowe" },
    ]);
  });

  it("uses the merchant's own titles, in whatever language they wrote", () => {
    const options = buildCategoryOptions(
      [collection("kawy-swiateczne", "Kawy świąteczne")],
      "Wszystko"
    );
    expect(options[1]).toEqual({ value: "kawy-swiateczne", label: "Kawy świąteczne" });
  });

  it("drops Shopify's auto-created Home page collection", () => {
    // `frontpage` normally holds the whole catalogue, so as a filter it is
    // both meaningless and confusing next to real categories.
    const options = buildCategoryOptions(
      [collection("frontpage", "Strona główna"), collection("blendy", "Blendy")],
      "Wszystko"
    );

    expect(options.map((o) => o.value)).toEqual(["all", "blendy"]);
  });

  it("returns nothing when only auto-created collections exist", () => {
    // Empty means "fall back to the legacy tag categories" — better than a
    // chip row holding a single useless "Wszystko".
    expect(
      buildCategoryOptions([collection("frontpage", "Strona główna")], "Wszystko")
    ).toEqual([]);
  });

  it("returns nothing for a store with no collections", () => {
    expect(buildCategoryOptions([], "Wszystko")).toEqual([]);
  });

  it("ignores a collection without a handle", () => {
    const options = buildCategoryOptions(
      [collection("", "Bez uchwytu"), collection("decaf", "Decaf")],
      "Wszystko"
    );
    expect(options.map((o) => o.value)).toEqual(["all", "decaf"]);
  });
});
