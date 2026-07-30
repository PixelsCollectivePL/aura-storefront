import { NextResponse } from "next/server";

import { buildAuthorizationUrl } from "@/lib/shopify/customer-account/auth";
import {
  getAppUrl,
  getClientId,
  getRedirectUri,
  isCustomerAccountConfigured,
  missingCustomerAccountVars,
  POST_LOGIN_PATH,
} from "@/lib/shopify/customer-account/config";
import {
  createCodeChallenge,
  createCodeVerifier,
  randomUrlSafe,
} from "@/lib/shopify/customer-account/crypto";
import { getCustomerAccountEndpoints } from "@/lib/shopify/customer-account/discovery";
import {
  safeReturnPath,
  saveOAuthTransaction,
} from "@/lib/shopify/customer-account/session";

/**
 * GET /api/auth/shopify/login
 *
 * Starts the OAuth round trip: mints `state`, `nonce` and a PKCE verifier,
 * stores them in a short-lived HttpOnly cookie, and redirects to Shopify.
 *
 * `?returnTo=/sciezka` survives the round trip so a customer who clicked
 * "log in" from a specific page comes back to it. Sanitised to same-site
 * paths — otherwise it is an open redirect.
 *
 * Node runtime: the session cookie is signed with `node:crypto`.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isCustomerAccountConfigured()) {
    const missing = missingCustomerAccountVars();
    console.error(
      `[aura/auth] KONFIGURACJA: logowanie niedostępne, brakuje: ${missing.join(", ")}`
    );
    // 503, not 500: this is a deployment that has not been finished, and it
    // is fixed by setting variables rather than by changing code.
    return NextResponse.json(
      { error: "not_configured", missing },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const url = new URL(request.url);
  const returnTo = safeReturnPath(url.searchParams.get("returnTo"), POST_LOGIN_PATH);

  try {
    const endpoints = await getCustomerAccountEndpoints();

    const state = randomUrlSafe();
    const nonce = randomUrlSafe();
    const codeVerifier = createCodeVerifier();

    await saveOAuthTransaction({
      state,
      nonce,
      codeVerifier,
      returnTo,
      createdAt: Date.now(),
    });

    const authorizationUrl = buildAuthorizationUrl({
      authorizationEndpoint: endpoints.authorizationEndpoint,
      clientId: getClientId(),
      redirectUri: getRedirectUri(),
      state,
      nonce,
      codeChallenge: createCodeChallenge(codeVerifier),
    });

    return NextResponse.redirect(authorizationUrl, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error(
      `[aura/auth] login nie powiodło się: ${
        err instanceof Error ? err.message : "nieznany błąd"
      }`
    );
    // Send the customer somewhere useful instead of showing a stack trace.
    return NextResponse.redirect(`${getAppUrl()}/account/login?error=login_failed`, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
