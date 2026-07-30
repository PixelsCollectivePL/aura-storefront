/** Raw Customer Account API shapes. Server-only callers map these to DTOs. */

export interface CustomerEmailAddress {
  emailAddress: string;
}

export interface CustomerSummaryNode {
  id: string;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: CustomerEmailAddress | null;
  creationDate: string;
  imageUrl: string;
}

export interface CustomerSummaryQueryData {
  customer: CustomerSummaryNode;
}

/** Browser-safe DTO. No token, Shopify session id, or raw GraphQL metadata. */
export interface CustomerSummary {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  imageUrl: string | null;
}

export interface GraphQLErrorShape {
  message: string;
  path?: unknown;
  extensions?: Record<string, unknown>;
}

export interface CustomerGraphQLResponse<T> {
  data?: T;
  errors?: GraphQLErrorShape[];
}
