import { NextResponse } from "next/server";

import { buildLogoutUrl } from "@/lib/shopify/customer-account/auth";
import {
  getAppUrl,
  isCustomerAccountConfigured,
  POST_LOGOUT_PATH,
} from "@/lib/shopify/customer-account/config";
import { getCustomerAccountEndpoints } from "@/lib/shopify/customer-account/discovery";
import {
  clearOAuthTransaction,
  clearSession,
  readSession,
} from "@/lib/shopify/customer-account/session";

/**
 * GET /api/auth/shopify/logout
 *
 * Ends both sessions, in that order:
 *   · ours — the signed cookie is deleted first, so even if the redirect to
 *     Shopify fails the customer is logged out of the storefront
 *   · Shopify's — via `end_session_endpoint` with `id_token_hint`
 *
 * Without the second step the customer clicks "log out", comes back, clicks
 * "log in" and is silently signed straight back in, which reads as a bug and
 * is a real problem on a shared computer.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // `NextResponse.redirect` requires an absolute URL. Prefer the configured
  // app URL, but fall back to the request's own origin so logout still works
  // on a deployment where NEXT_PUBLIC_APP_URL was never set — being unable
  // to log out is a worse failure than an unbranded redirect.
  const origin = process.env.NEXT_PUBLIC_APP_URL?.trim()
    ? getAppUrl()
    : new URL(request.url).origin;
  const fallback = `${origin}${POST_LOGOUT_PATH}`;

  // Read before clearing: we need the id token as the logout hint.
  const session = isCustomerAccountConfigured() ? await readSession() : null;

  await clearSession();
  await clearOAuthTransaction();

  if (!session) {
    return NextResponse.redirect(fallback, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const endpoints = await getCustomerAccountEndpoints();
    const logoutUrl = buildLogoutUrl({
      logoutEndpoint: endpoints.logoutEndpoint,
      idToken: session.idToken,
      postLogoutRedirectUri: fallback,
    });
    return NextResponse.redirect(logoutUrl, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    // Our cookie is already gone, so the customer is logged out here even
    // though Shopify's own session may survive.
    console.error(
      `[aura/auth] logout: nie udało się zbudować adresu wylogowania Shopify — ${
        err instanceof Error ? err.message : "nieznany błąd"
      }`
    );
    return NextResponse.redirect(fallback, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
