"use client";

import { showToast } from "@/lib/toast/toast";

/**
 * Variant for subscription management actions.
 * On Shopify wire-up, this becomes a `subscriptionContractUpdate` /
 * `subscriptionContractSkip` / `subscriptionContractCancel` etc.
 */
export function notifySubscriptionAction(action: string): void {
  showToast(`${action} — w kolejnym etapie przez aplikację subskrypcyjną Shopify`);
}
