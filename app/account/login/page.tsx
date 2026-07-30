import { redirect } from "next/navigation";

import { AccountLogin } from "@/components/account/AccountLogin";
import { readSession } from "@/lib/shopify/customer-account/session";

export const dynamic = "force-dynamic";

/** Branded bridge to Shopify login. Existing sessions skip it. */
export default async function AccountLoginPage() {
  if (await readSession()) redirect("/konto");
  return <AccountLogin />;
}
