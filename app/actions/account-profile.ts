"use server";

import { revalidatePath } from "next/cache";

import { getValidCustomerSession } from "@/lib/shopify/customer-account/client";
import { updateCustomerProfile } from "@/lib/shopify/customer-account/mutations";

export async function updateCustomerProfileAction(input: {
  firstName: string;
  lastName: string;
}): Promise<{ ok: boolean; error?: string }> {
  const firstName = input.firstName.trim().slice(0, 60);
  const lastName = input.lastName.trim().slice(0, 60);
  if (!firstName || !lastName) return { ok: false, error: "Imię i nazwisko są wymagane." };
  try {
    await getValidCustomerSession();
    const response = await updateCustomerProfile({ firstName, lastName });
    if (response.ok) {
      revalidatePath("/konto");
      revalidatePath("/konto/dane");
    }
    return response;
  } catch (error) {
    console.error(`[aura/account] aktualizacja profilu: ${error instanceof Error ? error.message : "błąd"}`);
    return { ok: false, error: "Nie udało się zaktualizować danych." };
  }
}
