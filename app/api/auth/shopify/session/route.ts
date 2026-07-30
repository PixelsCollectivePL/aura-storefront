import { NextResponse } from "next/server";

import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";
import { getValidCustomerSession } from "@/lib/shopify/customer-account/client";
import { CustomerApiError } from "@/lib/shopify/customer-account/errors";

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

  try {
    // This is a Route Handler, so getValidCustomerSession can safely rotate
    // the signed HttpOnly cookie when the access token is near expiry.
    const session = await getValidCustomerSession();
    return NextResponse.json(
      { authenticated: true, email: session.email ?? null },
      { headers }
    );
  } catch (error) {
    if (!(error instanceof CustomerApiError) || error.kind !== "unauthorized") {
      console.error(
        `[aura/auth] session status: ${
          error instanceof Error ? error.message : "nieznany błąd"
        }`
      );
    }
    return NextResponse.json({ authenticated: false }, { headers });
  }
}
