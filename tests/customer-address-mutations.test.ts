import { beforeEach, describe, expect, it, vi } from "vitest";

const customerAccountFetch = vi.hoisted(() => vi.fn());
vi.mock("server-only", () => ({}));
vi.mock("@/lib/shopify/customer-account/client", () => ({ customerAccountFetch }));

import {
  createCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
  updateCustomerAddress,
  updateCustomerProfile,
} from "@/lib/shopify/customer-account/mutations";

const address = {
  firstName: "Jan", lastName: "Kowalski", address1: "Kawowa 1",
  city: "Warszawa", zip: "00-001", territoryCode: "PL",
};

describe("Customer Account address mutations", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates an address and can mark it as default", async () => {
    customerAccountFetch.mockResolvedValue({ customerAddressCreate: { customerAddress: { id: "a1" }, userErrors: [] } });
    await expect(createCustomerAddress(address, true)).resolves.toEqual({ ok: true });
    expect(customerAccountFetch).toHaveBeenCalledWith(
      expect.stringContaining("customerAddressCreate"),
      { address, defaultAddress: true }
    );
  });

  it("updates by addressId using Customer Account API argument names", async () => {
    customerAccountFetch.mockResolvedValue({ customerAddressUpdate: { customerAddress: { id: "a1" }, userErrors: [] } });
    await updateCustomerAddress("gid://shopify/CustomerAddress/1", address, false);
    expect(customerAccountFetch).toHaveBeenCalledWith(
      expect.stringContaining("$addressId: ID!"),
      { addressId: "gid://shopify/CustomerAddress/1", address, defaultAddress: false }
    );
  });

  it("sets default without overwriting the address", async () => {
    customerAccountFetch.mockResolvedValue({ customerAddressUpdate: { customerAddress: { id: "a1" }, userErrors: [] } });
    await setDefaultCustomerAddress("gid://shopify/CustomerAddress/1");
    expect(customerAccountFetch).toHaveBeenCalledWith(
      expect.any(String),
      { addressId: "gid://shopify/CustomerAddress/1", address: null, defaultAddress: true }
    );
  });

  it("deletes by addressId", async () => {
    customerAccountFetch.mockResolvedValue({ customerAddressDelete: { deletedAddressId: "a1", userErrors: [] } });
    await expect(deleteCustomerAddress("gid://shopify/CustomerAddress/1")).resolves.toEqual({ ok: true });
  });

  it("does not hide Shopify userErrors as success", async () => {
    customerAccountFetch.mockResolvedValue({
      customerAddressCreate: { customerAddress: null, userErrors: [{ field: ["address", "zip"], message: "Invalid postal code" }] },
    });
    await expect(createCustomerAddress(address, false)).resolves.toEqual({ ok: false, error: "Invalid postal code" });
  });

  it("updates only fields supported by Customer Account CustomerUpdateInput", async () => {
    customerAccountFetch.mockResolvedValue({
      customerUpdate: { customer: { id: "gid://shopify/Customer/1" }, userErrors: [] },
    });
    await expect(updateCustomerProfile({ firstName: "Jan", lastName: "Nowak" })).resolves.toEqual({ ok: true });
    expect(customerAccountFetch).toHaveBeenCalledWith(
      expect.stringContaining("customerUpdate(input: $input)"),
      { input: { firstName: "Jan", lastName: "Nowak" } }
    );
  });
});
