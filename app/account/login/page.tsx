import { redirect } from "next/navigation";

import { AccountLogin } from "@/components/account/AccountLogin";
import {
  readSession,
  safeReturnPath,
} from "@/lib/shopify/customer-account/session";

export const dynamic = "force-dynamic";

/** Branded bridge to Shopify login. Existing sessions skip it. */
export default async function AccountLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo: rawReturnTo } = await searchParams;
  const returnTo = safeReturnPath(rawReturnTo ?? null, "/konto");
  if (await readSession()) redirect(returnTo);
  return <AccountLogin returnTo={returnTo} />;
}
