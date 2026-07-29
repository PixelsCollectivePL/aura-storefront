import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

/**
 * TEMPORARY diagnostic endpoint — Shopify env-var presence check.
 *
 * Answers exactly one question: is each variable configured at runtime.
 * It never returns, logs, or otherwise exposes a value — only booleans.
 *
 * ── Access ───────────────────────────────────────────────────────────
 * Outside production: open, so local and preview work stays frictionless.
 * In production: requires `DIAGNOSTICS_SECRET` to be set AND presented as
 *   Authorization: Bearer <secret>
 * When that variable is absent in production the route reports 404 — a
 * forgotten deploy must not leave an open diagnostic surface.
 *
 * `force-dynamic` is required: without it Next.js may statically evaluate
 * this route at build time and cache the result, which would report the
 * build-time environment instead of the runtime one.
 *
 * ⚠️ DELETE THIS ROUTE once the Shopify integration is complete.
 *    Tracked in docs/INTEGRATION_ROADMAP.md.
 */

export const dynamic = "force-dynamic";
export const revalidate = 0;
// node:crypto — this route must not run on the Edge runtime.
export const runtime = "nodejs";

const CHECKED_VARS = [
  "SHOPIFY_STORE_DOMAIN",
  "SHOPIFY_STOREFRONT_PRIVATE_TOKEN",
  "SHOPIFY_STOREFRONT_API_VERSION",
  "SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID",
  "SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET",
  "SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION",
  "SESSION_SECRET",
  "NEXT_PUBLIC_APP_URL",
] as const;

/** Constant-time comparison, so the secret can't be probed byte by byte. */
function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function isAuthorized(request: Request): boolean {
  if (process.env.NODE_ENV !== "production") return true;

  const expected = process.env.DIAGNOSTICS_SECRET?.trim();
  if (!expected) return false; // no secret configured → no access at all

  const header = request.headers.get("authorization") ?? "";
  const provided = header.replace(/^Bearer\s+/i, "").trim();
  if (!provided) return false;

  return secretMatches(provided, expected);
}

export async function GET(request: Request) {
  // 404 rather than 401: an unauthorized caller learns nothing about
  // whether this endpoint exists on this deployment.
  if (!isAuthorized(request)) {
    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }

  const configured: Record<string, boolean> = {};

  for (const name of CHECKED_VARS) {
    const value = process.env[name];
    // Presence only — a variable set to an empty string counts as absent.
    configured[name] = typeof value === "string" && value.trim().length > 0;
  }

  return NextResponse.json(
    { configured },
    {
      headers: {
        // Never let a CDN or browser cache a diagnostic result.
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
