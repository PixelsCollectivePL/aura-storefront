import type { AccountOrderLineItem } from "@/types/account";
import type { PurchasableVariant } from "@/lib/shopify/variants";

export interface ReorderLine {
  merchandiseId: string;
  quantity: number;
}

export function planReorderLines(
  historical: AccountOrderLineItem[],
  current: PurchasableVariant[]
): { lines: ReorderLine[]; skipped: string[] } {
  const byId = new Map(current.map((variant) => [variant.id, variant]));
  const skipped: string[] = [];
  const lines = historical.flatMap((item) => {
    const variant = byId.get(item.variantId);
    const label = item.productTitle ?? item.title;
    if (!variant || !variant.availableForSale || variant.quantityAvailable === 0) {
      skipped.push(label);
      return [];
    }
    const quantity = variant.quantityAvailable == null
      ? item.quantity
      : Math.min(item.quantity, variant.quantityAvailable);
    if (quantity < item.quantity) skipped.push(`${label} (dodano ${quantity} z ${item.quantity})`);
    return quantity > 0 ? [{ merchandiseId: variant.id, quantity }] : [];
  });
  return { lines, skipped };
}
