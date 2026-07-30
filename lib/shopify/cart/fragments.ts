/**
 * Cart GraphQL fragment.
 *
 * One fragment shared by the cart query and every cart mutation, so a
 * field added here lands everywhere and the client can never receive a
 * partially-shaped cart depending on which mutation ran.
 *
 * Notes on specific selections:
 *   · `checkoutUrl` — handed to the customer verbatim; Shopify appends a
 *     required `key` parameter that we must not touch.
 *   · `quantityAvailable` — needs the `unauthenticated_read_product_inventory`
 *     scope. Same field that silently emptied the catalogue before the
 *     scope was granted.
 *   · `product.metafield(short_name)` — the cart shows Aura's short names
 *     ("ONE", not "Aura ONE — Ethiopia Yirgacheffe"), which live in a
 *     metafield rather than the product title.
 *   · `merchandise` is a union; only `ProductVariant` is ever added by
 *     this storefront, so the inline fragment covers everything.
 */

export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    discountCodes {
      code
      applicable
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            quantityAvailable
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
            product {
              handle
              title
              featuredImage {
                url
                altText
              }
              metafield(namespace: "custom", key: "short_name") {
                value
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * `userErrors` shape returned by every cart mutation.
 *
 * These are business-level rejections (sold out, quantity above stock,
 * unknown variant) and arrive with HTTP 200 and no top-level `errors`.
 * They must be inspected explicitly — the transport layer cannot see them.
 */
export const CART_USER_ERRORS = /* GraphQL */ `
  userErrors {
    field
    message
    code
  }
`;
