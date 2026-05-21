/**
 * Shopify Storefront API — GraphQL operations (scaffold).
 *
 * These are plain strings. They are NOT executed anywhere yet — the client
 * in lib/shopify/client.ts is a stub. Field selections are a starting point
 * and will need tuning against the real store's metafield definitions.
 *
 * Reference: https://shopify.dev/docs/api/storefront
 */

// ─── Reusable fragments ──────────────────────────────────────────────────

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    tags
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    featuredImage { url altText width height }
    images(first: 8) {
      edges { node { url altText width height } }
    }
    options { id name values }
    variants(first: 25) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price { amount currencyCode }
          selectedOptions { name value }
          image { url altText width height }
        }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "origin" }
      { namespace: "custom", key: "process" }
      { namespace: "custom", key: "altitude" }
      { namespace: "custom", key: "varietal" }
      { namespace: "custom", key: "producer" }
      { namespace: "custom", key: "harvest_year" }
      { namespace: "custom", key: "roast_level" }
      { namespace: "custom", key: "tasting_notes" }
      { namespace: "custom", key: "brewing_methods" }
      { namespace: "custom", key: "lot_code" }
    ]) {
      namespace key value type
    }
  }
`;

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              product {
                handle
                title
                featuredImage { url altText width height }
              }
            }
          }
        }
      }
    }
  }
`;

// ─── Read queries ────────────────────────────────────────────────────────

/** All products (PLP). [shopify-ready]: getProducts() seam. */
export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Products($first: Int = 50) {
    products(first: $first) {
      edges { node { ...ProductFields } }
    }
  }
`;

/** Single product (PDP). [shopify-ready]: getProduct(handle) seam. */
export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductFields }
  }
`;

/** Products in a collection. [shopify-ready]: getFeaturedProducts() seam. */
export const COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query CollectionProducts($handle: String!, $first: Int = 8) {
    collection(handle: $handle) {
      products(first: $first) {
        edges { node { ...ProductFields } }
      }
    }
  }
`;

/** Predictive search. [shopify-ready]: replaces lib/search/searchProducts.ts. */
export const PREDICTIVE_SEARCH_QUERY = /* GraphQL */ `
  query PredictiveSearch($query: String!) {
    predictiveSearch(query: $query, limit: 6, types: [PRODUCT]) {
      products {
        handle
        title
        featuredImage { url altText }
        priceRange { minVariantPrice { amount currencyCode } }
      }
    }
  }
`;

// ─── Cart mutations ──────────────────────────────────────────────────────

export const CART_CREATE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  ${CART_FRAGMENT}
  query Cart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;
