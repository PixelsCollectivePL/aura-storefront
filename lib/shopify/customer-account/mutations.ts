import "server-only";

import { customerAccountFetch } from "./client";

export interface CustomerAddressInput {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
  territoryCode: string;
  zoneCode?: string;
  phoneNumber?: string;
}

interface MutationError { field?: string[] | null; message: string }
interface AddressPayload {
  customerAddress?: { id: string } | null;
  deletedAddressId?: string | null;
  userErrors: MutationError[];
}

const CREATE = /* GraphQL */ `
  mutation CustomerAddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
      customerAddress { id }
      userErrors { field message }
    }
  }
`;
const UPDATE = /* GraphQL */ `
  mutation CustomerAddressUpdate($addressId: ID!, $address: CustomerAddressInput, $defaultAddress: Boolean) {
    customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) {
      customerAddress { id }
      userErrors { field message }
    }
  }
`;
const DELETE = /* GraphQL */ `
  mutation CustomerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors { field message }
    }
  }
`;

function result(payload: AddressPayload | undefined): { ok: boolean; error?: string } {
  if (!payload) return { ok: false, error: "Shopify nie zwróciło wyniku operacji." };
  if (payload.userErrors.length) return { ok: false, error: payload.userErrors.map((e) => e.message).join(" ") };
  return { ok: true };
}

export async function createCustomerAddress(input: CustomerAddressInput, makeDefault: boolean) {
  const data = await customerAccountFetch<{ customerAddressCreate: AddressPayload }>(
    CREATE, { address: input, defaultAddress: makeDefault }
  );
  return result(data.customerAddressCreate);
}

export async function updateCustomerAddress(id: string, input: CustomerAddressInput, makeDefault?: boolean) {
  const data = await customerAccountFetch<{ customerAddressUpdate: AddressPayload }>(
    UPDATE, { addressId: id, address: input, defaultAddress: makeDefault ?? null }
  );
  return result(data.customerAddressUpdate);
}

export async function deleteCustomerAddress(id: string) {
  const data = await customerAccountFetch<{ customerAddressDelete: AddressPayload }>(DELETE, { addressId: id });
  return result(data.customerAddressDelete);
}

export async function setDefaultCustomerAddress(id: string) {
  const data = await customerAccountFetch<{ customerAddressUpdate: AddressPayload }>(
    UPDATE, { addressId: id, address: null, defaultAddress: true }
  );
  return result(data.customerAddressUpdate);
}
