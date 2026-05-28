/**
 * Mock auth helpers for the customer account panel.
 *
 * TODAY: a single localStorage flag (`aura-account-auth`) is the only
 *        source of truth. Default behaviour with no flag set = treat
 *        as authenticated, so the dashboard renders on a fresh visit.
 *
 * FUTURE: replace these with Shopify Customer Accounts session checks
 *         (server-side via the Customer Account API token + cookie
 *         exchange). No real auth lives on this stage.
 *
 * Why localStorage and not cookies / context?
 *   - No backend in the project right now.
 *   - No SSR redirect to Shopify yet.
 *   - The auth state must survive a route change between /account and
 *     /account/login. localStorage is the simplest read/write across
 *     both routes without dragging in a provider.
 *   - When wiring Shopify, replace with `cookies()` checks server-side
 *     or use the Customer Account API helper.
 */

const STORAGE_KEY = "aura-account-auth";

/**
 * Returns whether the user is treated as authenticated for mock UI.
 * SSR-safe: returns `true` on the server so the page can render
 * its initial HTML without hydration mismatch. The client effect
 * re-evaluates on mount.
 *
 * [shopify-ready]: replace with a Customer Account session check
 *   (e.g. presence of a valid customer access token).
 */
export function isMockAuthenticated(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    // null / missing → first-time visit, treat as authenticated
    return v !== "false";
  } catch {
    return true;
  }
}

/**
 * Flips the mock auth flag. No-op on the server.
 *
 * [shopify-ready]: replace with Shopify login redirect (set=true)
 *   or session invalidation (set=false).
 */
export function setMockAuthenticated(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
  } catch {
    /* localStorage disabled — silently no-op */
  }
}
