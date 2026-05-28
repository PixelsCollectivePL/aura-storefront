"use client";

import { showToast } from "@/lib/toast/toast";

/**
 * Standard toast for account-panel buttons that will be wired to
 * Shopify Customer Accounts / Customer Account API in a later step.
 *
 * Why: leaving the button without any onClick handler reads as "broken"
 * in QA. A toast clearly states "this is a placeholder, the real action
 * lives in Shopify". When integrating, drop-in replace the call site
 * with the actual mutation / redirect.
 */
export function notifyShopifyAction(action: string): void {
  showToast(`${action} — w kolejnym etapie przez Shopify Customer Accounts`);
}

/**
 * Variant for the cart re-order flow.
 * On Shopify wire-up, this becomes a `cartLinesAdd` call with
 * `merchandiseId: lineItem.variantId` for each line + openCart().
 */
export function notifyReorderAction(): void {
  showToast("Ponawianie zamówienia — w kolejnym etapie przez koszyk Shopify");
}

/**
 * Variant for subscription management actions.
 * On Shopify wire-up, this becomes a `subscriptionContractUpdate` /
 * `subscriptionContractSkip` / `subscriptionContractCancel` etc.
 */
export function notifySubscriptionAction(action: string): void {
  showToast(`${action} — w kolejnym etapie przez aplikację subskrypcyjną Shopify`);
}
