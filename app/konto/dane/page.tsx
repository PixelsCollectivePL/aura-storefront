import { AccountDetails } from "@/components/account/AccountDetails";
import { getAccountOverview } from "@/lib/shopify/customer-account/account-data";

export default async function DetailsPage() {
  const { customer } = await getAccountOverview();
  return <AccountDetails customer={customer} />;
}
