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
}
