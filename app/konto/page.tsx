import { AccountDashboard } from "@/components/account/AccountDashboard";
import { getAccountOverview } from "@/lib/shopify/customer-account/account-data";
import type { AccountStats, AccountTastedBlend } from "@/types/account";

export default async function KontoPage() {
  const { customer, orders } = await getAccountOverview();
  const currentYear = new Date().getFullYear();
  const stats: AccountStats = {
    ordersTotal: orders.length,
    ordersThisYear: orders.filter((order) => new Date(order.processedAt).getFullYear() === currentYear).length,
  };
  const counts = new Map<string, number>();
  for (const order of orders) for (const item of order.items) {
    counts.set(item.productTitle ?? item.title, (counts.get(item.productTitle ?? item.title) ?? 0) + item.quantity);
  }
  const tastedBlends: AccountTastedBlend[] = [...counts.entries()]
    .map(([name, timesOrdered]) => ({ name, timesOrdered, handle: "" }))
    .sort((a, b) => b.timesOrdered - a.timesOrdered);
  return (
    <AccountDashboard
      customer={customer}
      orders={orders}
      stats={stats}
      tastedBlends={tastedBlends}
    />
  );
}
