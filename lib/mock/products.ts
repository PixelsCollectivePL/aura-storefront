import type { Product } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
  {
    handle: "one",
    title: "Aura ONE — Ethiopia Yirgacheffe",
    shortName: "ONE",
    description:
      "Jasne, kwiatowe, zaskakująco owocowe. Yirgacheffe to kwintesencja etiopskiej kawy filtrowej — myty proces wydobywa z ziaren bergamotkę i wiśnię, zostawiając długie, herbacianie czyste zakończenie. Idealna do V60 rano.",
    origin: "Ethiopia · Yirgacheffe",
    notes: ["cherry", "jasmine", "bergamot"],
    lotCode: "001",
    price: { amount: 84, currencyCode: "PLN" },
    roastLevel: "Light · developed for filter",
    process: "Washed",
    altitude: "1900–2200m",
    varietal: "Heirloom",
    producer: "Kochere Station",
    recommendedBrew: "V60, Chemex, AeroPress",
    brewing: [
      { method: "V60", recipe: "15g · 250g · 92°C · 2:45" },
      { method: "Chemex", recipe: "25g · 400g · 93°C · 4:00" },
      { method: "AeroPress", recipe: "14g · 200g · 85°C · 1:30" },
    ],
    availableForSale: true,
    quantityAvailable: 24,
    isNew: true,
    grindOptions: ["Whole bean", "Filter fine", "Filter medium", "Cafetière"],
    sizeOptions: [
      { label: "200g", weight: "200" },
      { label: "500g", weight: "500" },
    ],
    /** [shopify-ready]: map from product.variants edges in Storefront API */
    variants: [
      { variantId: "one::200g", title: "200g", price: { amount: 84, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "200g" }], availableForSale: true },
      { variantId: "one::500g", title: "500g", price: { amount: 184, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "500g" }], availableForSale: true },
    ],
    images: [{ src: "", alt: "Aura ONE — Ethiopia Yirgacheffe" }],
    tags: ["filter", "single-origin", "light"],
    harvestYear: "2024",
  },
  {
    handle: "two",
    title: "Aura TWO — Colombia Huila",
    shortName: "TWO",
    description:
      "Balans w czystej postaci. Huila to region znany z łagodnych, owocowych kaw o naturalnej słodkości. Obróbka naturalna dodaje głębi — kakao i śliwka budują ciało, migdał wydłuża zakończenie. Działa zarówno jako espresso, jak i na filtrze.",
    origin: "Colombia · Huila",
    notes: ["cocoa", "plum", "almond"],
    lotCode: "002",
    price: { amount: 76, currencyCode: "PLN" },
    roastLevel: "Medium · balanced for any method",
    process: "Natural",
    altitude: "1700–1900m",
    varietal: "Caturra, Castillo",
    producer: "La Palma y El Tucán",
    recommendedBrew: "V60, Espresso, Moka",
    brewing: [
      { method: "V60", recipe: "15g · 250g · 91°C · 3:00" },
      { method: "Espresso", recipe: "18g · 36g · 93°C · 28s" },
    ],
    availableForSale: true,
    quantityAvailable: 41,
    isNew: false,
    grindOptions: ["Whole bean", "Filter medium", "Espresso", "Cafetière"],
    sizeOptions: [
      { label: "200g", weight: "200" },
      { label: "500g", weight: "500" },
    ],
    /** [shopify-ready]: map from product.variants edges in Storefront API */
    variants: [
      { variantId: "two::200g", title: "200g", price: { amount: 76, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "200g" }], availableForSale: true },
      { variantId: "two::500g", title: "500g", price: { amount: 164, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "500g" }], availableForSale: true },
    ],
    images: [{ src: "", alt: "Aura TWO — Colombia Huila" }],
    tags: ["filter", "espresso", "single-origin", "medium"],
    harvestYear: "2024",
  },
  {
    handle: "three",
    title: "Aura THREE — House Blend",
    shortName: "THREE",
    description:
      "Nasz authorski blend do codziennego espresso. Łączymy Brazylię z Etiopią tak, żeby kawa działała w każdej metodzie i o każdej porze — orzechowa słodycz, brązowy cukier, figowe tło. Sprawdzona przez tysiące kubków.",
    origin: "House blend",
    notes: ["hazelnut", "brown sugar", "fig"],
    lotCode: "003",
    price: { amount: 68, currencyCode: "PLN" },
    roastLevel: "Medium-dark · classic house",
    process: "Mixed",
    recommendedBrew: "Espresso, Moka, Cafetière",
    brewing: [
      { method: "Espresso", recipe: "18g · 36g · 93°C · 27s" },
      { method: "Moka", recipe: "22g · medium-fine grind" },
    ],
    availableForSale: true,
    quantityAvailable: 67,
    isNew: false,
    grindOptions: ["Whole bean", "Espresso", "Moka", "Cafetière"],
    sizeOptions: [
      { label: "200g", weight: "200" },
      { label: "500g", weight: "500" },
      { label: "1kg", weight: "1000" },
    ],
    /** [shopify-ready]: map from product.variants edges in Storefront API */
    variants: [
      { variantId: "three::200g", title: "200g", price: { amount: 68, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "200g" }], availableForSale: true },
      { variantId: "three::500g", title: "500g", price: { amount: 148, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "500g" }], availableForSale: true },
      { variantId: "three::1kg",  title: "1kg",  price: { amount: 269, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "1kg"  }], availableForSale: true },
    ],
    images: [{ src: "", alt: "Aura THREE — House Blend" }],
    tags: ["espresso", "blend", "medium-dark"],
    harvestYear: "2024",
  },
  {
    handle: "four",
    title: "Aura FOUR — Kenya Nyeri",
    shortName: "FOUR",
    description:
      "Kenia Nyeri to jedna z najbardziej złożonych kaw na świecie. Myta obróbka i bogate gleby wulkaniczne dają intensywne czarne porzeczki, cytrynową kwasowość i słodowy finisz. Polecamy jako filtr — najlepiej Chemex lub kalita.",
    origin: "Kenya · Nyeri",
    notes: ["blackcurrant", "citrus", "malt"],
    lotCode: "004",
    price: { amount: 92, currencyCode: "PLN" },
    roastLevel: "Light-medium · bright and complex",
    process: "Washed",
    altitude: "1600–1800m",
    varietal: "SL-28, SL-34",
    producer: "Gakuyuini Factory",
    recommendedBrew: "V60, Chemex, Aeropress",
    brewing: [
      { method: "V60", recipe: "15g · 250g · 94°C · 2:50" },
    ],
    availableForSale: true,
    quantityAvailable: 18,
    isNew: true,
    grindOptions: ["Whole bean", "Filter fine", "Filter medium", "Cafetière"],
    sizeOptions: [
      { label: "200g", weight: "200" },
      { label: "500g", weight: "500" },
    ],
    /** [shopify-ready]: map from product.variants edges in Storefront API */
    variants: [
      { variantId: "four::200g", title: "200g", price: { amount: 92, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "200g" }], availableForSale: true },
      { variantId: "four::500g", title: "500g", price: { amount: 199, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "500g" }], availableForSale: true },
    ],
    images: [{ src: "", alt: "Aura FOUR — Kenya Nyeri" }],
    tags: ["filter", "single-origin", "light"],
    harvestYear: "2024",
  },
  {
    handle: "five",
    title: "Aura FIVE — Espresso Blend",
    shortName: "FIVE",
    description:
      "Klasyczne ciemne espresso bez kompromisów. Mieszanka Brazylii z Gwatemalą daje ciemną czekoladę, karmel i orzechy włoskie w jednym sycącym sorbecie. Doskonałe pod moka, espresso lub jako baza do flat white.",
    origin: "Espresso blend",
    notes: ["dark chocolate", "caramel", "walnut"],
    lotCode: "005",
    price: { amount: 64, currencyCode: "PLN" },
    roastLevel: "Dark · classic espresso",
    process: "Mixed",
    recommendedBrew: "Espresso, Moka",
    brewing: [
      { method: "Espresso", recipe: "18g · 36g · 94°C · 25s" },
    ],
    availableForSale: true,
    quantityAvailable: 55,
    isNew: false,
    grindOptions: ["Whole bean", "Espresso", "Moka"],
    sizeOptions: [
      { label: "200g", weight: "200" },
      { label: "500g", weight: "500" },
      { label: "1kg", weight: "1000" },
    ],
    /** [shopify-ready]: map from product.variants edges in Storefront API */
    variants: [
      { variantId: "five::200g", title: "200g", price: { amount: 64, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "200g" }], availableForSale: true },
      { variantId: "five::500g", title: "500g", price: { amount: 139, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "500g" }], availableForSale: true },
      { variantId: "five::1kg",  title: "1kg",  price: { amount: 249, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "1kg"  }], availableForSale: true },
    ],
    images: [{ src: "", alt: "Aura FIVE — Espresso Blend" }],
    tags: ["espresso", "blend", "dark"],
    harvestYear: "2024",
  },
  {
    handle: "six",
    title: "Aura SIX — Guatemala Decaf",
    shortName: "SIX",
    description:
      "Decaf, który nie wygląda jak decaf. Metoda Swiss Water zachowuje pełne ciało i naturalne nuty kawy — toffi, suszone owoce i cedrowe ciepło. Na każdą metodę, o każdej porze dnia. Dla tych, którzy kochają kawę, nie kofeinę.",
    origin: "Guatemala · Huehuetenango",
    notes: ["toffee", "dried fruit", "cedar"],
    lotCode: "006",
    price: { amount: 72, currencyCode: "PLN" },
    roastLevel: "Medium · Swiss water decaf",
    process: "Swiss Water",
    altitude: "1500–1700m",
    varietal: "Bourbon, Catuai",
    producer: "El Injerto",
    recommendedBrew: "Any method",
    brewing: [
      { method: "V60", recipe: "15g · 250g · 93°C · 3:00" },
      { method: "Espresso", recipe: "18g · 36g · 93°C · 28s" },
    ],
    availableForSale: true,
    quantityAvailable: 29,
    isNew: false,
    grindOptions: ["Whole bean", "Filter medium", "Espresso", "Cafetière"],
    sizeOptions: [
      { label: "200g", weight: "200" },
      { label: "500g", weight: "500" },
    ],
    /** [shopify-ready]: map from product.variants edges in Storefront API */
    variants: [
      { variantId: "six::200g", title: "200g", price: { amount: 72, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "200g" }], availableForSale: true },
      { variantId: "six::500g", title: "500g", price: { amount: 159, currencyCode: "PLN" }, selectedOptions: [{ name: "Size", value: "500g" }], availableForSale: true },
    ],
    images: [{ src: "", alt: "Aura SIX — Guatemala Decaf" }],
    tags: ["filter", "espresso", "decaf", "single-origin"],
    harvestYear: "2024",
  },
];

/**
 * ─── Data-access seam ───────────────────────────────────────────────────
 * All product reads in the app go through these three functions — never the
 * raw MOCK_PRODUCTS array. This is the single integration point: on Shopify
 * integration, re-implement these to call the Storefront API (and make them
 * `async`). See docs/SHOPIFY_INTEGRATION_PLAN.md.
 *
 * [shopify-ready]: getProducts        → products(first:N) query
 * [shopify-ready]: getProduct         → productByHandle(handle) query
 * [shopify-ready]: getFeaturedProducts → collection(handle:"featured") query
 */

export function getProducts(): Product[] {
  return MOCK_PRODUCTS;
}

export function getProduct(handle: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.handle === handle);
}

export function getFeaturedProducts(count = 4): Product[] {
  // Prefer an explicit `featured` flag when present; fall back to first N.
  const flagged = MOCK_PRODUCTS.filter((p) => p.featured);
  return (flagged.length > 0 ? flagged : MOCK_PRODUCTS).slice(0, count);
}
