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
