export const CUSTOMER_SUMMARY_QUERY = /* GraphQL */ `
  query CustomerSummary {
    customer {
      id
      displayName
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      creationDate
      imageUrl
    }
  }
`;

const CUSTOMER_ADDRESS_FIELDS = /* GraphQL */ `
  id
  firstName
  lastName
  company
  address1
  address2
  city
  zoneCode
  province
  zip
  country
  territoryCode
  phoneNumber
`;

const ORDER_FIELDS = /* GraphQL */ `
  id
  name
  processedAt
  fulfillmentStatus
  financialStatus
  currencyCode
  subtotal { amount currencyCode }
  totalShipping { amount currencyCode }
  totalPrice { amount currencyCode }
  statusPageUrl
  shippingAddress { ${CUSTOMER_ADDRESS_FIELDS} }
  lineItems(first: 100) {
    nodes {
      id
      productId
      variantId
      name
      title
      variantTitle
      quantity
      price { amount currencyCode }
      image { url altText }
    }
  }
  fulfillments(first: 10) {
    nodes {
      status
      trackingInformation { company number url }
    }
  }
`;

export const ACCOUNT_OVERVIEW_QUERY = /* GraphQL */ `
  query AccountOverview($ordersFirst: Int!, $ordersAfter: String) {
    customer {
      id
      displayName
      firstName
      lastName
      emailAddress { emailAddress }
      phoneNumber { phoneNumber }
      creationDate
      defaultAddress { id }
      orders(first: $ordersFirst, after: $ordersAfter, reverse: true) {
        nodes { ${ORDER_FIELDS} }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;

export const CUSTOMER_ADDRESSES_QUERY = /* GraphQL */ `
  query CustomerAddresses($first: Int!, $after: String) {
    customer {
      defaultAddress { id }
      addresses(first: $first, after: $after) {
        nodes { ${CUSTOMER_ADDRESS_FIELDS} }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;

export const CUSTOMER_ORDER_QUERY = /* GraphQL */ `
  query CustomerOrder($id: ID!) {
    order(id: $id) { ${ORDER_FIELDS} }
  }
`;
