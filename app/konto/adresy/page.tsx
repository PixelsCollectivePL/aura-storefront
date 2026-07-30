import { AccountAddresses } from "@/components/account/AccountAddresses";
import { getCustomerAddresses } from "@/lib/shopify/customer-account/account-data";

export default async function AddressesPage() {
  return <AccountAddresses addresses={await getCustomerAddresses()} />;
}
