import { AccountOrders } from "@/components/account/AccountOrders";
import { getAccountOverview } from "@/lib/shopify/customer-account/account-data";

export default async function OrdersPage() {
  const { orders } = await getAccountOverview();
  return <AccountOrders orders={orders} />;
}
