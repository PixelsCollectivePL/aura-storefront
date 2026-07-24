/**
 * Collection list — used to drive catalogue navigation / filters once
 * collections exist in Shopify Admin.
 *
 * Product membership is fetched separately via
 * `COLLECTION_PRODUCTS_QUERY` so the list stays cheap.
 */
export const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections($first: Int = 20) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        description
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
`;
