/**
 * Shared GraphQL fragments for the Storefront API.
 *
 * Kept in one place so the list query and the single-product query can
 * never drift apart — a field added here lands in both.
 */

/**
 * Metafields surfaced on products.
 *
 * These carry the coffee-specific data the Aura UI renders (origin,
 * tasting notes, roast level, brewing recipes...) which has no native
 * Shopify equivalent.
 *
 * The Storefront API requires explicit `identifiers` — there is no
 * "give me all metafields" query. Adding a metafield in Shopify Admin is
 * therefore NOT enough; its key must also be listed here.
 *
 * Namespace `custom` is what Shopify Admin uses by default when you
 * create a metafield definition through the UI.
 */
export const PRODUCT_METAFIELD_IDENTIFIERS = [
  "short_name",
  "origin",
  "tasting_notes",
  "lot_code",
  "roast_level",
  "process",
  "altitude",
  "varietal",
  "producer",
  "harvest_year",
  "recommended_brew",
  "brewing",
  "is_new",
] as const;

const METAFIELD_IDENTIFIERS_GQL = PRODUCT_METAFIELD_IDENTIFIERS.map(
  (key) => `{ namespace: "custom", key: "${key}" }`
).join(", ");

export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

export const MONEY_FRAGMENT = /* GraphQL */ `
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
`;

export const VARIANT_FRAGMENT = /* GraphQL */ `
  fragment VariantFields on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    price {
      ...MoneyFields
    }
    compareAtPrice {
      ...MoneyFields
    }
    selectedOptions {
      name
      value
    }
    image {
      ...ImageFields
    }
  }
`;

/**
 * Product shape for list views (PLP, homepage shelf, search).
 *
 * Deliberately omits `descriptionHtml` and `seo` — a listing of 50
 * products does not need long-form HTML, and it dominates the payload.
 */
export const PRODUCT_CARD_FRAGMENT = /* GraphQL */ `
  fragment ProductCardFields on Product {
    id
    handle
    title
    description
    availableForSale
    tags
    productType
    vendor
    priceRange {
      minVariantPrice {
        ...MoneyFields
      }
      maxVariantPrice {
        ...MoneyFields
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFields
      }
    }
    featuredImage {
      ...ImageFields
    }
    images(first: 10) {
      nodes {
        ...ImageFields
      }
    }
    options {
      id
      name
      values
    }
    variants(first: 50) {
      nodes {
        ...VariantFields
      }
    }
    collections(first: 5) {
      nodes {
        handle
        title
      }
    }
    metafields(identifiers: [${METAFIELD_IDENTIFIERS_GQL}]) {
      namespace
      key
      value
      type
    }
  }
`;

/**
 * Full product shape for the PDP — the card fragment plus long-form
 * fields.
 *
 * NOTE: this must NOT re-declare `images` with different arguments than
 * the card fragment. Two selections of the same field with conflicting
 * args are a GraphQL validation error, so the gallery size lives solely
 * in `ProductCardFields`.
 */
export const PRODUCT_DETAIL_FRAGMENT = /* GraphQL */ `
  fragment ProductDetailFields on Product {
    ...ProductCardFields
    descriptionHtml
    seo {
      title
      description
    }
  }
`;

/** Fragment bundle for list queries. */
export const PRODUCT_CARD_FRAGMENTS = [
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  VARIANT_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
].join("\n");

/** Fragment bundle for detail queries. */
export const PRODUCT_DETAIL_FRAGMENTS = [
  PRODUCT_CARD_FRAGMENTS,
  PRODUCT_DETAIL_FRAGMENT,
].join("\n");
