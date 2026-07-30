import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AccountShell } from "@/components/account/AccountShell";
import { getAccountOverview } from "@/lib/shopify/customer-account/account-data";
import { CustomerApiError } from "@/lib/shopify/customer-account/errors";
import { readSession } from "@/lib/shopify/customer-account/session";

export const metadata: Metadata = {
  title: "Konto — Aura Coffee Roasters",
  description: "Panel klienta — zamówienia, adresy i dane konta.",
};

export const dynamic = "force-dynamic";

async function loadAccountShellData() {
  try {
    return await getAccountOverview();
  } catch (error) {
    if (error instanceof CustomerApiError && error.kind === "unauthorized") {
      redirect("/api/auth/shopify/login?returnTo=/konto");
    }
    throw error;
  }
}

export default async function KontoLayout({ children }: { children: React.ReactNode }) {
  if (!(await readSession())) redirect("/api/auth/shopify/login?returnTo=/konto");
  const { customer, orders } = await loadAccountShellData();
  return (
    <AccountShell customer={customer} ordersCount={orders.length} mobileTitle="Konto">
      {children}
    </AccountShell>
  );
}
