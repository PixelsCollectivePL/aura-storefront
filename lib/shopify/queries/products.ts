import { PRODUCT_CARD_FRAGMENTS } from "../fragments";

/**
 * Product list (PLP, homepage shelf, search source).
 *
 * `query` accepts Shopify's search syntax, e.g. `tag:filter`,
 * `product_type:Blend`, `available_for_sale:true`.
 */
export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD_FRAGMENTS}

  query Products($first: Int = 50, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      nodes {
        ...ProductCardFields
      }
    }
  }
`;

/**
 * Products belonging to a collection — used for the homepage "featured"
 * shelf once a `featured` collection exists in Shopify Admin.
 */
export const COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD_FRAGMENTS}

  query CollectionProducts($handle: String!, $first: Int = 8) {
    collection(handle: $handle) {
      handle
      title
      products(first: $first) {
        nodes {
          ...ProductCardFields
        }
      }
    }
  }
`;

/** Handles only — cheap query for `generateStaticParams`. */
export const PRODUCT_HANDLES_QUERY = /* GraphQL */ `
  query ProductHandles($first: Int = 250) {
    products(first: $first) {
      nodes {
        handle
      }
    }
  }
`;
