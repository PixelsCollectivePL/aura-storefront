/**
 * Shopify Storefront API — response shapes (scaffold).
 *
 * Simplified subset of the Storefront GraphQL schema, covering only the
 * fields the Aura storefront needs. NOT exhaustive. Nothing here is wired
 * into the running app yet — see lib/shopify/README.md.
 *
 * Reference: https://shopify.dev/docs/api/storefront
 */

// ─── Primitives ──────────────────────────────────────────────────────────

export interface ShopifyMoney {
  amount: string; // Shopify returns decimals as strings, e.g. "84.00"
  currencyCode: string; // "PLN" | "EUR" | ...
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface ShopifySelectedOption {
  name: string; // e.g. "Waga"
  value: string; // e.g. "200g"
}

export interface ShopifyMetafield {
  namespace: string; // e.g. "custom"
  key: string; // e.g. "roast_level"
  value: string;
  type: string; // e.g. "single_line_text_field", "list.single_line_text_field"
}

// ─── Product ─────────────────────────────────────────────────────────────

export interface ShopifyProductOption {
  id: string;
  name: string; // "Waga", "Mielenie"
  values: string[]; // ["200g", "500g", "1kg"]
}

export interface ShopifyProductVariant {
  id: string; // gid://shopify/ProductVariant/...
  title: string; // "200g / Ziarna"
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: ShopifyMoney;
  selectedOptions: ShopifySelectedOption[];
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string; // gid://shopify/Product/...
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  tags: string[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  featuredImage: ShopifyImage | null;
  images: { edges: Array<{ node: ShopifyImage }> };
  options: ShopifyProductOption[];
  variants: { edges: Array<{ node: ShopifyProductVariant }> };
  /** Bean specs (origin, process, altitude, roast, brewing...) live here. */
  metafields: Array<ShopifyMetafield | null>;
}

// ─── Cart ────────────────────────────────────────────────────────────────

export interface ShopifyCartLineMerchandise {
  id: string; // ProductVariant gid
  title: string; // variant title
  product: {
    handle: string;
    title: string;
    featuredImage: ShopifyImage | null;
  };
  price: ShopifyMoney;
}

export interface ShopifyCartLine {
  id: string; // gid://shopify/CartLine/...
  quantity: number;
  merchandise: ShopifyCartLineMerchandise;
}

export interface ShopifyCart {
  id: string; // gid://shopify/Cart/...
  checkoutUrl: string; // hand-off URL for Shopify-hosted checkout
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  lines: { edges: Array<{ node: ShopifyCartLine }> };
}

// ─── GraphQL envelope ────────────────────────────────────────────────────

export interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}
