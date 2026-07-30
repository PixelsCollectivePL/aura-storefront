import { notFound } from "next/navigation";

import { AccountOrderDetails } from "@/components/account/AccountOrderDetails";
import { getCustomerOrder } from "@/lib/shopify/customer-account/account-data";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const order = await getCustomerOrder(`gid://shopify/Order/${id}`);
  if (!order) notFound();
  return <AccountOrderDetails order={order} />;
}
