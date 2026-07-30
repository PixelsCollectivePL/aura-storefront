import { NextResponse } from "next/server";

import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";
import {
  isAccessTokenStale,
  readSession,
} from "@/lib/shopify/customer-account/session";

/**
 * GET /api/auth/shopify/session
 *
 * Session status for the client. Returns whether the customer is logged in
 * and, at most, their e-mail — because the UI greets them by it.
 *
 * It deliberately returns NO token, no refresh token, no expiry timestamp
 * and no customer id. The browser has no use for any of those, and every one
 * of them would be a credential leak the moment this response were cached,
 * logged by an analytics script, or read by an extension.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const headers = { "Cache-Control": "no-store, max-age=0" };

  if (!isCustomerAccountConfigured()) {
    return NextResponse.json({ authenticated: false }, { headers });
  }

  const session = await readSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { headers });
  }

  // A stale access token is not a logged-out customer: the refresh token is
  // still good and the next API call renews it server-side. Reporting `false`
  // here would bounce a valid customer to the login screen every few minutes.
  return NextResponse.json(
    {
      authenticated: true,
      email: session.email ?? null,
      needsRefresh: isAccessTokenStale(session),
    },
    { headers }
  );
}
