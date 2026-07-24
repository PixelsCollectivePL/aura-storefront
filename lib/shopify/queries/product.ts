import { PRODUCT_DETAIL_FRAGMENTS } from "../fragments";

/**
 * Single product by handle — powers the PDP.
 *
 * Returns `null` in `data.product` when the handle does not exist, which
 * the data layer translates into a 404.
 */
export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_DETAIL_FRAGMENTS}

  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductDetailFields
    }
  }
`;
