/**
 * Lightweight browser-only toast trigger.
 * Fires a custom DOM event that `<Toast />` listens to.
 * No context, no provider — works from any client component.
 */
export function showToast(message: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("aura:toast", { detail: { message } })
  );
}
