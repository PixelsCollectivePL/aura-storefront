import "server-only";

import { customerAccountFetch } from "./client";
import { CUSTOMER_SUMMARY_QUERY } from "./queries";
import type {
  CustomerSummary,
  CustomerSummaryQueryData,
} from "./types";

/** Minimal customer DTO used to prove the authenticated API path end-to-end. */
export async function getCustomerSummary(): Promise<CustomerSummary> {
  const { customer } = await customerAccountFetch<CustomerSummaryQueryData>(
    CUSTOMER_SUMMARY_QUERY
  );
  return {
    id: customer.id,
    displayName: customer.displayName,
    firstName: customer.firstName ?? "",
    lastName: customer.lastName ?? "",
    email: customer.emailAddress?.emailAddress ?? "",
    createdAt: customer.creationDate,
    imageUrl: customer.imageUrl || null,
  };
}
