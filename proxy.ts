import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/shopify/customer-account/cookie-names";

/**
 * Optimistic account guard.
 *
 * The signed session is still validated in the account DAL/layout. This early
 * cookie-presence check prevents protected pages from starting a streamed
 * render only to redirect during hydration.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/konto/subskrypcje") {
    return NextResponse.redirect(new URL("/konto", request.url));
  }

  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const loginUrl = new URL("/account/login", request.url);
  loginUrl.searchParams.set("returnTo", returnTo);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/konto/:path*"],
};
