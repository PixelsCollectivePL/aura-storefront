/**
 * Shopify Storefront API — response shapes.
 *
 * Simplified subset of the Storefront GraphQL schema, covering only the
 * fields the Aura storefront requests. NOT exhaustive.
 *
 * These mirror the fragments in `lib/shopify/fragments.ts` — the two must
 * stay in sync. Queries use `nodes { ... }` (not `edges { node }`), so the
 * connection types below are shaped accordingly.
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
  namespace: string; // "custom"
  key: string; // e.g. "roast_level"
  value: string;
  type: string; // e.g. "single_line_text_field", "list.single_line_text_field"
}

/** Generic `nodes`-style connection. */
export interface ShopifyNodes<T> {
  nodes: T[];
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
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: ShopifySelectedOption[];
  image: ShopifyImage | null;
}

export interface ShopifyCollectionRef {
  handle: string;
  title: string;
}

/** Shape returned by `ProductCardFields`. */
export interface ShopifyProduct {
  id: string; // gid://shopify/Product/...
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  tags: string[];
  productType: string;
  vendor: string;
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney;
  } | null;
  featuredImage: ShopifyImage | null;
  images: ShopifyNodes<ShopifyImage>;
  options: ShopifyProductOption[];
  variants: ShopifyNodes<ShopifyProductVariant>;
  collections: ShopifyNodes<ShopifyCollectionRef>;
  /** Positional array — Shopify returns `null` for unset identifiers. */
  metafields: Array<ShopifyMetafield | null>;
}

/** Shape returned by `ProductDetailFields` (card + long-form fields). */
export interface ShopifyProductDetail extends ShopifyProduct {
  descriptionHtml: string;
  seo: {
    title: string | null;
    description: string | null;
  } | null;
}

// ─── Collection ──────────────────────────────────────────────────────────

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
}

// ─── Query result envelopes ──────────────────────────────────────────────

export interface ProductsQueryResult {
  products: ShopifyNodes<ShopifyProduct>;
}

export interface ProductHandlesQueryResult {
  products: ShopifyNodes<{ handle: string }>;
}

export interface ProductByHandleQueryResult {
  product: ShopifyProductDetail | null;
}

export interface CollectionProductsQueryResult {
  collection: {
    handle: string;
    title: string;
    products: ShopifyNodes<ShopifyProduct>;
  } | null;
}

export interface CollectionsQueryResult {
  collections: ShopifyNodes<ShopifyCollection>;
}

// ─── Cart ────────────────────────────────────────────────────────────────

/** `merchandise` narrowed to ProductVariant — the only kind we ever add. */
export interface ShopifyCartLineMerchandise {
  id: string; // ProductVariant gid — the `merchandiseId`
  title: string; // variant title, e.g. "500g / Ziarno"
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: ShopifyMoney;
  selectedOptions: ShopifySelectedOption[];
  image: ShopifyImage | null;
  product: {
    handle: string;
    title: string;
    featuredImage: ShopifyImage | null;
    /** `custom.short_name`; `null` when the merchant hasn't set it. */
    metafield: { value: string } | null;
  };
}

export interface ShopifyCartLine {
  id: string; // gid://shopify/CartLine/...
  quantity: number;
  merchandise: ShopifyCartLineMerchandise;
}

export interface ShopifyCartDiscountCode {
  code: string;
  applicable: boolean;
}

export interface ShopifyCart {
  id: string; // gid://shopify/Cart/...
  checkoutUrl: string; // hand-off URL for Shopify-hosted checkout
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  discountCodes: ShopifyCartDiscountCode[];
  lines: ShopifyNodes<ShopifyCartLine>;
}

/**
 * Business-level rejection from a cart mutation. Arrives with HTTP 200 and
 * no top-level `errors`, so it must be read from the mutation payload.
 */
export interface ShopifyCartUserError {
  field: string[] | null;
  message: string;
  code: string | null;
}

/** Every cart mutation returns this envelope, under its own key. */
export interface ShopifyCartMutationPayload {
  cart: ShopifyCart | null;
  userErrors: ShopifyCartUserError[];
}

export interface CartQueryResult {
  cart: ShopifyCart | null;
}

export type CartCreateResult = { cartCreate: ShopifyCartMutationPayload };
export type CartLinesAddResult = { cartLinesAdd: ShopifyCartMutationPayload };
export type CartLinesUpdateResult = {
  cartLinesUpdate: ShopifyCartMutationPayload;
};
export type CartLinesRemoveResult = {
  cartLinesRemove: ShopifyCartMutationPayload;
};
export type CartDiscountCodesUpdateResult = {
  cartDiscountCodesUpdate: ShopifyCartMutationPayload;
};
export type CartBuyerIdentityUpdateResult = {
  cartBuyerIdentityUpdate: ShopifyCartMutationPayload;
};

// ─── GraphQL envelope ────────────────────────────────────────────────────

export interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}
