import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/shopify/customer-account/cookie-names";
import { openPayloadEdge } from "@/lib/shopify/customer-account/crypto-edge";

/**
 * Account guard.
 *
 * The signed session is still validated in the account layout — this is not
 * the only line of defence. What it adds is stopping an unauthenticated
 * request *before* a protected page starts streaming.
 *
 * It used to check only that the cookie existed, which failed for the case
 * it most needed to catch: a cookie that is present but not valid — tampered
 * with, or left over from a session whose secret has since rotated. Those
 * requests sailed through, the page began streaming, and the redirect
 * arrived as a `NEXT_REDIRECT` inside the RSC payload, executed during
 * hydration. The result was HTTP 200 on a protected route, with the actual
 * redirect depending on client-side JavaScript.
 *
 * So the signature is verified here too, with Web Crypto — middleware runs
 * on the Edge runtime and cannot import `node:crypto`.
 *
 * It deliberately does NOT check `expiresAt`. That field is the access
 * token's expiry, not the session's: a stale access token is refreshed
 * server-side on the next call, and treating it as logged out would bounce
 * a perfectly valid customer to the login screen every few minutes.
 */
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/konto/subskrypcje") {
    return NextResponse.redirect(new URL("/konto", request.url));
  }

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;

  if (cookie) {
    const secret = process.env.SESSION_SECRET?.trim();

    if (!secret) {
      // Misconfigured deployment. Fall back to presence — the layout still
      // rejects the request, so this is no weaker than the old behaviour,
      // just louder about why.
      console.error(
        "[aura/proxy] KONFIGURACJA: brak SESSION_SECRET — sesji nie da się zweryfikować na brzegu."
      );
      return NextResponse.next();
    }

    if (await openPayloadEdge(cookie, secret)) return NextResponse.next();
  }

  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const loginUrl = new URL("/account/login", request.url);
  loginUrl.searchParams.set("returnTo", returnTo);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/konto/:path*"],
};
