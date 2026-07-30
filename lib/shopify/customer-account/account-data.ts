import "server-only";

import { cache } from "react";
import { customerAccountFetch } from "./client";
import {
  ACCOUNT_OVERVIEW_QUERY,
  CUSTOMER_ADDRESSES_QUERY,
  CUSTOMER_ORDER_QUERY,
} from "./queries";
import type {
  AccountAddress,
  AccountCustomer,
  AccountOrder,
  AccountOrderAddress,
  FinancialStatus,
  FulfillmentStatus,
} from "@/types/account";

interface MoneyNode { amount: string; currencyCode: string }
interface PageInfo { hasNextPage: boolean; endCursor: string | null }
interface AddressNode {
  id: string; firstName: string | null; lastName: string | null;
  company: string | null; address1: string | null; address2: string | null;
  city: string | null; zoneCode: string | null; province: string | null;
  zip: string | null; country: string | null; territoryCode: string | null;
  phoneNumber: string | null;
}
interface OrderNode {
  id: string; name: string; processedAt: string; fulfillmentStatus: string;
  financialStatus: string | null; currencyCode: string; subtotal: MoneyNode | null;
  totalShipping: MoneyNode; totalPrice: MoneyNode; statusPageUrl: string;
  shippingAddress: AddressNode | null;
  lineItems: { nodes: Array<{
    id: string; productId: string | null; variantId: string | null;
    name: string; title: string; variantTitle: string | null; quantity: number;
    price: MoneyNode | null; image: { url: string; altText: string | null } | null;
  }> };
  fulfillments: { nodes: Array<{
    status: string;
    trackingInformation: Array<{ company: string | null; number: string | null; url: string | null }>;
  }> };
}
interface CustomerNode {
  id: string; displayName: string; firstName: string | null; lastName: string | null;
  emailAddress: { emailAddress: string } | null;
  phoneNumber: { phoneNumber: string } | null; creationDate: string;
  defaultAddress: { id: string } | null;
  orders: { nodes: OrderNode[]; pageInfo: PageInfo };
}

const money = (value: MoneyNode | null | undefined) => Number(value?.amount ?? 0);

function fulfillmentStatus(value: string): FulfillmentStatus {
  if (value === "FULFILLED") return "delivered";
  if (["IN_PROGRESS", "PARTIALLY_FULFILLED"].includes(value)) return "in_transit";
  if (value === "RESTOCKED") return "cancelled";
  return "unfulfilled";
}

function financialStatus(value: string | null): FinancialStatus {
  if (value === "PAID") return "paid";
  if (["REFUNDED", "PARTIALLY_REFUNDED"].includes(value ?? "")) return "refunded";
  if (value === "VOIDED" || value === "EXPIRED") return "voided";
  return "pending";
}

function address(node: AddressNode | null): AccountOrderAddress {
  if (!node) return { name: "", line1: "", city: "", country: "" };
  return {
    name: [node.firstName, node.lastName].filter(Boolean).join(" "),
    line1: node.address1 ?? "",
    line2: node.address2 ?? undefined,
    city: [node.zip, node.city].filter(Boolean).join(" "),
    province: node.province ?? undefined,
    country: node.country ?? "",
    countryCode: node.territoryCode ?? undefined,
    phone: node.phoneNumber ?? undefined,
  };
}

export function mapOrder(node: OrderNode): AccountOrder {
  const tracking = node.fulfillments.nodes
    .flatMap((fulfillment) => fulfillment.trackingInformation)
    .find((item) => item.number || item.url);
  return {
    id: node.id,
    name: node.name,
    processedAt: node.processedAt,
    fulfillmentStatus: fulfillmentStatus(node.fulfillmentStatus),
    financialStatus: financialStatus(node.financialStatus),
    subtotalPrice: money(node.subtotal),
    shippingPrice: money(node.totalShipping),
    totalPrice: money(node.totalPrice),
    currencyCode: node.totalPrice.currencyCode || node.currencyCode,
    items: node.lineItems.nodes.map((item) => ({
      id: item.id,
      productId: item.productId ?? "",
      variantId: item.variantId ?? "",
      handle: "",
      title: item.name || item.title,
      productTitle: item.name || item.title,
      variantTitle: item.variantTitle ?? "",
      quantity: item.quantity,
      price: money(item.price),
      currencyCode: item.price?.currencyCode ?? node.currencyCode,
      image: item.image ? { src: item.image.url, alt: item.image.altText ?? item.name } : undefined,
    })),
    address: address(node.shippingAddress),
    tracking: tracking ? {
      carrier: tracking.company ?? "Przewoźnik",
      number: tracking.number ?? "",
      url: tracking.url ?? undefined,
    } : undefined,
    statusUrl: node.statusPageUrl,
  };
}

function mapCustomer(node: CustomerNode): AccountCustomer {
  return {
    id: node.id,
    firstName: node.firstName ?? "",
    lastName: node.lastName ?? "",
    displayName: node.displayName,
    email: node.emailAddress?.emailAddress ?? "",
    phone: node.phoneNumber?.phoneNumber ?? undefined,
    acceptsMarketing: false,
    acceptsSms: false,
    createdAt: node.creationDate,
    defaultAddressId: node.defaultAddress?.id,
  };
}

/** Fetches every order page so dashboard totals are real, not first-page estimates. */
async function fetchAccountOverview(): Promise<{ customer: AccountCustomer; orders: AccountOrder[] }> {
  const orders: OrderNode[] = [];
  let after: string | null = null;
  let customer: CustomerNode | null = null;
  do {
    const data: { customer: CustomerNode } = await customerAccountFetch(
      ACCOUNT_OVERVIEW_QUERY,
      { ordersFirst: 50, ordersAfter: after },
      { persistRefresh: false }
    );
    customer = data.customer;
    orders.push(...data.customer.orders.nodes);
    after = data.customer.orders.pageInfo.hasNextPage
      ? data.customer.orders.pageInfo.endCursor
      : null;
  } while (after);
  if (!customer) throw new Error("Customer Account API nie zwróciło klienta.");
  return { customer: mapCustomer(customer), orders: orders.map(mapOrder) };
}

export const getAccountOverview = cache(fetchAccountOverview);

export async function getCustomerAddresses(): Promise<AccountAddress[]> {
  const result: AccountAddress[] = [];
  let after: string | null = null;
  do {
    const data: { customer: { defaultAddress: { id: string } | null; addresses: { nodes: AddressNode[]; pageInfo: PageInfo } } } =
      await customerAccountFetch(CUSTOMER_ADDRESSES_QUERY, { first: 50, after }, { persistRefresh: false });
    result.push(...data.customer.addresses.nodes.map((node) => ({
      id: node.id,
      isDefault: node.id === data.customer.defaultAddress?.id,
      firstName: node.firstName ?? "",
      lastName: node.lastName ?? "",
      company: node.company ?? undefined,
      address1: node.address1 ?? "",
      address2: node.address2 ?? undefined,
      city: node.city ?? "",
      province: node.province ?? undefined,
      zip: node.zip ?? "",
      country: node.country ?? "",
      countryCode: node.territoryCode ?? undefined,
      phone: node.phoneNumber ?? undefined,
    })));
    after = data.customer.addresses.pageInfo.hasNextPage ? data.customer.addresses.pageInfo.endCursor : null;
  } while (after);
  return result;
}

export async function getCustomerOrder(id: string): Promise<AccountOrder | null> {
  const data = await customerAccountFetch<{ order: OrderNode | null }>(
    CUSTOMER_ORDER_QUERY,
    { id },
    { persistRefresh: false }
  );
  return data.order ? mapOrder(data.order) : null;
}
