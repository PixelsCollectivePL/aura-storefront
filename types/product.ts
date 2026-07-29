export type CurrencyCode = "PLN" | "EUR" | "GBP";

export interface ProductPrice {
  amount: number;
  currencyCode: CurrencyCode;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface BrewingRecipe {
  method: string;
  recipe: string;
}

export interface SizeOption {
  label: string;
  weight: string;
}

/**
 * A product option axis — e.g. { name: "Waga", values: ["200g", "500g"] }.
 * Maps 1:1 from Shopify `product.options`.
 */
export interface ProductOption {
  id?: string;
  name: string;
  values: string[];
}

/**
 * A collection a product belongs to. Maps from Shopify
 * `product.collections`.
 */
export interface ProductCollectionRef {
  handle: string;
  title: string;
}

/**
 * Per-variant price / availability — mirrors Shopify ProductVariant.
 * Populated from the variant fragment in the Storefront API response.
 */
export interface ProductVariant {
  /**
   * Shopify ProductVariant gid (gid://shopify/ProductVariant/...).
   * This is the `merchandiseId` used by Cart API mutations — reorder and
   * add-to-cart must key off this, never off a title string.
   * Mock value: `${handle}::${title}`.
   */
  variantId: string;
  title: string;
  price: ProductPrice;
  /** Crossed-out "was" price, when the variant is discounted. */
  compareAtPrice?: ProductPrice;
  /**
   * Axis values for this variant — e.g. [{ name: "Waga", value: "200g" }].
   * Maps directly from Shopify `variant.selectedOptions`.
   */
  selectedOptions: Array<{ name: string; value: string }>;
  availableForSale?: boolean;
  quantityAvailable?: number;
  /** Variant-specific image, when the merchant set one. */
  image?: ProductImage;
}

export interface Product {
  /**
   * Shopify Product id (gid://shopify/Product/...).
   * Optional only because mock fixtures may omit it — live Shopify data
   * always carries it.
   */
  id?: string;
  handle: string;
  title: string;
  /**
   * Short display name used on cards and in the cart.
   * Sourced from the `custom.short_name` metafield; falls back to `title`.
   */
  shortName: string;
  description?: string;
  /** Rich description from Shopify. Render with care — it is raw HTML. */
  descriptionHtml?: string;
  origin: string;
  notes: string[];
  lotCode: string;
  price: ProductPrice;
  roastLevel: string;
  process?: string;
  altitude?: string;
  varietal?: string;
  producer?: string;
  harvestYear?: string;
  recommendedBrew?: string;
  brewing?: BrewingRecipe[];
  availableForSale: boolean;
  quantityAvailable?: number;
  isNew?: boolean;
  grindOptions: string[];
  sizeOptions: SizeOption[];
  /**
   * Name of the Shopify option axis backing `sizeOptions` (e.g. "Waga").
   * Required to resolve a selection back to a real `ProductVariant` —
   * `variant.selectedOptions` is keyed by this name, and it is the
   * merchant's own label, not a constant we can hardcode.
   * Absent when the product has no size axis.
   */
  sizeOptionName?: string;
  /** Name of the Shopify option axis backing `grindOptions` (e.g. "Mielenie"). */
  grindOptionName?: string;
  /**
   * Flat list of purchasable variants.
   * Maps from Shopify `product.variants`.
   */
  variants?: ProductVariant[];
  /** Option axes as defined in Shopify (`product.options`). */
  options?: ProductOption[];
  /** Primary image. Maps from Shopify `product.featuredImage`. */
  featuredImage?: ProductImage;
  images: ProductImage[];
  /**
   * Lowest "was" price across variants, when the product is discounted.
   * Maps from Shopify `compareAtPriceRange.minVariantPrice`.
   */
  compareAtPrice?: ProductPrice;
  tags?: string[];
  /** Shopify `product.productType`. */
  productType?: string;
  /** Shopify `product.vendor`. */
  vendor?: string;
  /** All collections this product belongs to (Shopify `product.collections`). */
  collections?: ProductCollectionRef[];
  /**
   * Marks a product as homepage-featured. While on mock data the homepage
   * uses `getFeaturedProducts()` (first N). [shopify-ready]: drive from a
   * Shopify metafield (`custom.featured`) or a dedicated "Featured" collection.
   */
  featured?: boolean;
  /**
   * Primary collection handle, for PLP routing and filters.
   * Derived from the first entry of `collections`.
   */
  collection?: string;
}

/**
 * A Shopify collection, as surfaced by `getCollections()`.
 * Used for catalogue navigation.
 */
export interface Collection {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: ProductImage;
}
