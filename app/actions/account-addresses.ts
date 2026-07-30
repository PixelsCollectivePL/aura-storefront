"use server";

import { revalidatePath } from "next/cache";

import {
  createCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
  updateCustomerAddress,
  type CustomerAddressInput,
} from "@/lib/shopify/customer-account/mutations";
import { getValidCustomerSession } from "@/lib/shopify/customer-account/client";

export interface AddressActionInput extends CustomerAddressInput {
  id?: string;
  makeDefault?: boolean;
}
export interface AddressActionResult { ok: boolean; error?: string }

function clean(value: string | undefined, max = 120): string {
  return (value ?? "").trim().slice(0, max);
}

function validate(input: AddressActionInput): { value?: CustomerAddressInput; error?: string } {
  const value: CustomerAddressInput = {
    firstName: clean(input.firstName, 60),
    lastName: clean(input.lastName, 60),
    company: clean(input.company, 100) || undefined,
    address1: clean(input.address1),
    address2: clean(input.address2) || undefined,
    city: clean(input.city, 80),
    zip: clean(input.zip, 20),
    territoryCode: clean(input.territoryCode, 2).toUpperCase(),
    zoneCode: clean(input.zoneCode, 20) || undefined,
    phoneNumber: clean(input.phoneNumber, 30) || undefined,
  };
  if (!value.firstName || !value.lastName || !value.address1 || !value.city || !value.zip) {
    return { error: "Uzupełnij imię, nazwisko, adres, kod pocztowy i miasto." };
  }
  if (!/^[A-Z]{2}$/.test(value.territoryCode)) return { error: "Kod kraju musi mieć dwie litery, np. PL." };
  return { value };
}

function validId(id: string | undefined): id is string {
  return Boolean(id && /^gid:\/\/shopify\/CustomerAddress\/[^/]+$/.test(id));
}

async function authenticated<T>(operation: () => Promise<T>): Promise<T> {
  await getValidCustomerSession();
  return operation();
}

export async function saveAddressAction(input: AddressActionInput): Promise<AddressActionResult> {
  try {
    const parsed = validate(input);
    if (!parsed.value) return { ok: false, error: parsed.error };
    const response = input.id
      ? validId(input.id)
        ? await authenticated(() => updateCustomerAddress(input.id!, parsed.value!, input.makeDefault))
        : { ok: false, error: "Nie rozpoznano adresu." }
      : await authenticated(() => createCustomerAddress(parsed.value!, Boolean(input.makeDefault)));
    if (response.ok) revalidatePath("/konto/adresy");
    return response;
  } catch (error) {
    console.error(`[aura/account] zapis adresu: ${error instanceof Error ? error.message : "błąd"}`);
    return { ok: false, error: "Nie udało się zapisać adresu. Spróbuj ponownie." };
  }
}

export async function deleteAddressAction(id: string): Promise<AddressActionResult> {
  if (!validId(id)) return { ok: false, error: "Nie rozpoznano adresu." };
  try {
    const response = await authenticated(() => deleteCustomerAddress(id));
    if (response.ok) revalidatePath("/konto/adresy");
    return response;
  } catch (error) {
    console.error(`[aura/account] usuwanie adresu: ${error instanceof Error ? error.message : "błąd"}`);
    return { ok: false, error: "Nie udało się usunąć adresu." };
  }
}

export async function setDefaultAddressAction(id: string): Promise<AddressActionResult> {
  if (!validId(id)) return { ok: false, error: "Nie rozpoznano adresu." };
  try {
    const response = await authenticated(() => setDefaultCustomerAddress(id));
    if (response.ok) revalidatePath("/konto/adresy");
    return response;
  } catch (error) {
    console.error(`[aura/account] domyślny adres: ${error instanceof Error ? error.message : "błąd"}`);
    return { ok: false, error: "Nie udało się ustawić adresu domyślnego." };
  }
}
