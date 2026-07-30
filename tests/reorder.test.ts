import { describe, expect, it } from "vitest";

import { planReorderLines } from "@/lib/account/reorder";
import type { AccountOrderLineItem } from "@/types/account";
import type { PurchasableVariant } from "@/lib/shopify/variants";

function item(id: string, quantity = 2): AccountOrderLineItem {
  return {
    id: `line-${id}`, productId: "product", variantId: id, handle: "",
    title: `Wariant ${id}`, productTitle: `Produkt ${id}`, variantTitle: "500 g",
    quantity, price: 99,
  };
}

function variant(id: string, availableForSale = true, quantityAvailable: number | null = 10): PurchasableVariant {
  return {
    id, title: "500 g", availableForSale, quantityAvailable,
    product: { title: `Produkt ${id}`, handle: `produkt-${id}` },
  };
}

describe("reorder planner", () => {
  it("uses current variants and requested quantities without carrying historical prices", () => {
    const result = planReorderLines([item("v1", 2)], [variant("v1")]);
    expect(result).toEqual({ lines: [{ merchandiseId: "v1", quantity: 2 }], skipped: [] });
    expect(result.lines[0]).not.toHaveProperty("price");
  });

  it("skips deleted and sold-out variants", () => {
    const result = planReorderLines(
      [item("deleted"), item("sold-out")],
      [variant("sold-out", false, 0)]
    );
    expect(result.lines).toEqual([]);
    expect(result.skipped).toEqual(["Produkt deleted", "Produkt sold-out"]);
  });

  it("caps quantity to current stock and explains the partial add", () => {
    const result = planReorderLines([item("v1", 4)], [variant("v1", true, 1)]);
    expect(result.lines).toEqual([{ merchandiseId: "v1", quantity: 1 }]);
    expect(result.skipped).toEqual(["Produkt v1 (dodano 1 z 4)"]);
  });

  it("keeps requested quantity when Shopify does not track inventory", () => {
    expect(planReorderLines([item("v1", 3)], [variant("v1", true, null)]).lines[0].quantity).toBe(3);
  });
});
