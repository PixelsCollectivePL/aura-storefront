import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic endpoint — Shopify env-var presence check.
 *
 * Returns ONLY booleans indicating whether each variable is set at
 * runtime. Never returns, logs, or otherwise exposes any value.
 *
 * `force-dynamic` is required: without it Next.js may statically
 * evaluate this route at build time and cache the result, which would
 * report the build-time environment instead of the runtime one.
 *
 * ⚠️ DELETE THIS ROUTE once Sprint 0 verification is done.
 *    Tracked in docs/INTEGRATION_ROADMAP.md (Sprint 0 checklist).
 */

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CHECKED_VARS = [
  "SHOPIFY_STORE_DOMAIN",
  "SHOPIFY_STOREFRONT_PUBLIC_TOKEN",
  "SHOPIFY_STOREFRONT_PRIVATE_TOKEN",
] as const;

export async function GET() {
  const result: Record<string, boolean> = {};

  for (const name of CHECKED_VARS) {
    const value = process.env[name];
    // Presence only — a variable set to an empty string counts as absent.
    result[name] = typeof value === "string" && value.trim().length > 0;
  }

  return NextResponse.json(result, {
    headers: {
      // Never let a CDN or browser cache a diagnostic result.
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
