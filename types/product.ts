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
 * Per-variant price / availability — mirrors Shopify ProductVariant.
 * [shopify-ready]: populated from variant fragment in Storefront API response.
 */
export interface ProductVariant {
  /**
   * Shopify ProductVariant gid (gid://shopify/ProductVariant/...).
   * Mock value: `${handle}::${title}`.
   */
  variantId: string;
  title: string;
  price: ProductPrice;
  /**
   * Axis values for this variant — e.g. [{ name: "Size", value: "200g" }].
   * [shopify-ready]: map directly from variant.selectedOptions.
   */
  selectedOptions: Array<{ name: string; value: string }>;
  availableForSale?: boolean;
}

export interface Product {
  /**
   * Shopify Product id (gid://shopify/Product/...).
   * Optional while running on mock data — `handle` is used as the stable
   * key today. [shopify-ready]: populated from Shopify Storefront API.
   */
  id?: string;
  handle: string;
  title: string;
  shortName: string;
  description?: string;
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
   * Flat list of purchasable variants (size axis only in mock data).
   * [shopify-ready]: maps from Shopify product.variants edges.
   */
  variants?: ProductVariant[];
  images: ProductImage[];
  tags?: string[];
  /**
   * Marks a product as homepage-featured. While on mock data the homepage
   * uses `getFeaturedProducts()` (first N). [shopify-ready]: drive from a
   * Shopify metafield (`custom.featured`) or a dedicated "Featured" collection.
   */
  featured?: boolean;
  /**
   * Owning collection handle. [shopify-ready]: Shopify Collection.handle —
   * lets PLP routes and filters map onto Shopify collections.
   */
  collection?: string;
}
