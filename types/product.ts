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
