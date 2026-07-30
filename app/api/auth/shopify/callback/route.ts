import { NextResponse } from "next/server";

import { exchangeCodeForSession } from "@/lib/shopify/customer-account/auth";
import {
  getAppUrl,
  isCustomerAccountConfigured,
  POST_LOGIN_PATH,
} from "@/lib/shopify/customer-account/config";
import { safeEqual } from "@/lib/shopify/customer-account/crypto";
import { getCustomerAccountEndpoints } from "@/lib/shopify/customer-account/discovery";
import {
  clearOAuthTransaction,
  readOAuthTransaction,
  safeReturnPath,
  saveSession,
} from "@/lib/shopify/customer-account/session";

/**
 * GET /api/auth/shopify/callback
 *
 * Where Shopify returns the customer. Order matters:
 *
 *   1. surface an error Shopify reported, before touching anything
 *   2. load the OAuth transaction from its cookie — no cookie, no login
 *   3. compare `state` in constant time  ← CSRF protection
 *   4. exchange the code server-side, with the client secret and the PKCE
 *      verifier, and check the id token's `nonce`
 *   5. persist the session, delete the transaction cookie
 *
 * Step 3 is the one that must never be skipped or short-circuited: without
 * it, an attacker can complete a login in someone else's browser.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Bounce back to the login screen with a reason, never with a token. */
function loginError(reason: string): NextResponse {
  return NextResponse.redirect(`${getAppUrl()}/account/login?error=${reason}`, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(request: Request) {
  if (!isCustomerAccountConfigured()) {
    console.error("[aura/auth] KONFIGURACJA: callback bez pełnej konfiguracji.");
    return loginError("not_configured");
  }

  const url = new URL(request.url);

  // 1. Shopify said no (customer cancelled, app misconfigured, scope denied).
  const oauthError = url.searchParams.get("error");
  if (oauthError) {
    console.error(
      `[aura/auth] callback: Shopify zwróciło błąd "${oauthError}" (${
        url.searchParams.get("error_description") ?? "brak opisu"
      }).`
    );
    await clearOAuthTransaction();
    return loginError("shopify_denied");
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    console.error("[aura/auth] callback: brak `code` lub `state` w zapytaniu.");
    await clearOAuthTransaction();
    return loginError("invalid_callback");
  }

  // 2. The transaction cookie. Absent means expired, or a callback that never
  //    started here.
  const tx = await readOAuthTransaction();
  if (!tx) {
    console.error("[aura/auth] callback: brak lub nieprawidłowe ciasteczko OAuth.");
    return loginError("session_expired");
  }

  // 3. CSRF: constant-time comparison of the state we minted.
  if (!safeEqual(state, tx.state)) {
    console.error("[aura/auth] callback: `state` nie zgadza się — żądanie odrzucone.");
    await clearOAuthTransaction();
    return loginError("invalid_state");
  }

  try {
    const endpoints = await getCustomerAccountEndpoints();

    // 4. Server-side exchange: client secret + PKCE verifier + nonce check.
    const session = await exchangeCodeForSession({
      endpoints,
      code,
      codeVerifier: tx.codeVerifier,
      expectedNonce: tx.nonce,
    });

    // 5. Persist, then burn the one-time transaction.
    await saveSession(session);
    await clearOAuthTransaction();

    const target = safeReturnPath(tx.returnTo, POST_LOGIN_PATH);
    return NextResponse.redirect(`${getAppUrl()}${target}`, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error(
      `[aura/auth] callback: wymiana kodu nie powiodła się — ${
        err instanceof Error ? err.message : "nieznany błąd"
      }`
    );
    await clearOAuthTransaction();
    return loginError("token_exchange_failed");
  }
}
