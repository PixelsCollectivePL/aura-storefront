import { describe, expect, it } from "vitest";

import {
  matchesOrigin,
  matchesRoast,
  parseRoastLevel,
  roastScale,
} from "@/lib/product/taxonomy";
import type { Product } from "@/types/product";

/**
 * These values are typed by a person in Shopify Admin, in Polish, with
 * diacritics and free-form trailing text. Every failure here is silent —
 * a filter that quietly matches nothing, or a roast bar parked in the
 * middle — so the cases are enumerated rather than assumed.
 */

function product(fields: Partial<Product>): Product {
  return {
    handle: "x",
    title: "X",
    shortName: "X",
    origin: "",
    notes: [],
    lotCode: "",
    price: { amount: 50, currencyCode: "PLN" },
    roastLevel: "",
    availableForSale: true,
    grindOptions: [],
    sizeOptions: [],
    images: [],
    ...fields,
  };
}

describe("parseRoastLevel", () => {
  it("reads English values, with or without trailing description", () => {
    expect(parseRoastLevel("Light")).toBe("light");
    expect(parseRoastLevel("Light · developed for filter")).toBe("light");
    expect(parseRoastLevel("Medium · balanced for any method")).toBe("medium");
    expect(parseRoastLevel("Medium-dark · classic house")).toBe("medium-dark");
    expect(parseRoastLevel("Dark")).toBe("dark");
  });

  it("reads Polish values, including diacritics and inflections", () => {
    expect(parseRoastLevel("Jasny")).toBe("light");
    expect(parseRoastLevel("jasna")).toBe("light");
    expect(parseRoastLevel("Średni")).toBe("medium");
    expect(parseRoastLevel("średnie palenie")).toBe("medium");
    expect(parseRoastLevel("Ciemny")).toBe("dark");
    expect(parseRoastLevel("Średnio ciemny")).toBe("medium-dark");
  });

  it("prefers the compound level over its parts", () => {
    // "średnio ciemny" contains both "średni" and "ciemny"; "medium-dark"
    // contains both "medium" and "dark". Order of evaluation decides.
    expect(parseRoastLevel("Średnio ciemny")).toBe("medium-dark");
    expect(parseRoastLevel("Medium-dark")).toBe("medium-dark");
    expect(parseRoastLevel("medium dark roast")).toBe("medium-dark");
  });

  it("returns null rather than guessing on unusable input", () => {
    expect(parseRoastLevel("")).toBeNull();
    expect(parseRoastLevel("   ")).toBeNull();
    expect(parseRoastLevel(undefined)).toBeNull();
    expect(parseRoastLevel("owocowa")).toBeNull();
  });
});

describe("roastScale", () => {
  it("maps each level onto the 1–5 bar", () => {
    expect(roastScale("Jasny")).toBe(1);
    expect(roastScale("Light")).toBe(1);
    expect(roastScale("Średni")).toBe(3);
    expect(roastScale("Średnio ciemny")).toBe(4);
    expect(roastScale("Ciemny")).toBe(5);
  });

  it("lands in the middle when the text says nothing usable", () => {
    // The bar has to render something; 3 is the least misleading guess.
    expect(roastScale("")).toBe(3);
    expect(roastScale(undefined)).toBe(3);
    expect(roastScale("owocowa")).toBe(3);
  });
});

describe("matchesRoast", () => {
  it("matches a Polish product against the canonical filter value", () => {
    // The regression: a merchant writes "Jasny", the filter sends "light".
    expect(matchesRoast(product({ roastLevel: "Jasny" }), "light")).toBe(true);
    expect(matchesRoast(product({ roastLevel: "Ciemny" }), "dark")).toBe(true);
    expect(matchesRoast(product({ roastLevel: "Średnio ciemny" }), "medium-dark")).toBe(true);
  });

  it("does not confuse neighbouring levels", () => {
    expect(matchesRoast(product({ roastLevel: "Średnio ciemny" }), "medium")).toBe(false);
    expect(matchesRoast(product({ roastLevel: "Średnio ciemny" }), "dark")).toBe(false);
    expect(matchesRoast(product({ roastLevel: "Jasny" }), "dark")).toBe(false);
  });

  it("excludes a product whose roast level is empty or unrecognised", () => {
    expect(matchesRoast(product({ roastLevel: "" }), "light")).toBe(false);
    expect(matchesRoast(product({ roastLevel: "owocowa" }), "medium")).toBe(false);
  });
});

describe("matchesOrigin", () => {
  it("matches either language against the canonical filter value", () => {
    expect(matchesOrigin(product({ origin: "Etiopia · Yirgacheffe" }), "Ethiopia")).toBe(true);
    expect(matchesOrigin(product({ origin: "Ethiopia · Yirgacheffe" }), "Ethiopia")).toBe(true);
    expect(matchesOrigin(product({ origin: "Kolumbia · Huila" }), "Colombia")).toBe(true);
    expect(matchesOrigin(product({ origin: "Kenia" }), "Kenya")).toBe(true);
    expect(matchesOrigin(product({ origin: "Gwatemala · Antigua" }), "Guatemala")).toBe(true);
  });

  it("ignores case and diacritics", () => {
    expect(matchesOrigin(product({ origin: "ETIOPIA" }), "Ethiopia")).toBe(true);
    expect(matchesOrigin(product({ origin: "brazylia · cerrado" }), "Brazil")).toBe(true);
  });

  it("does not match a different country", () => {
    expect(matchesOrigin(product({ origin: "Etiopia" }), "Colombia")).toBe(false);
    expect(matchesOrigin(product({ origin: "" }), "Ethiopia")).toBe(false);
  });

  it("falls back to matching the filter value itself for unknown countries", () => {
    // Keeps the filter working if the content list grows before the alias map.
    expect(matchesOrigin(product({ origin: "Panama · Boquete" }), "Panama")).toBe(true);
  });
});
