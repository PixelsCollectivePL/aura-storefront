/**
 * Customer Account API — environment configuration.
 *
 * SERVER-ONLY. Reads the confidential client's secret.
 *
 * Every URL the OAuth flow uses is built from `NEXT_PUBLIC_APP_URL`, never
 * hardcoded, so the same code works on localhost, a Vercel preview and
 * production without edits.
 */

import { CustomerAuthError } from "./errors";

/** Scopes we request. Confirmed against the store's discovery document. */
export const CUSTOMER_ACCOUNT_SCOPES = [
  "openid",
  "email",
  "customer-account-api:full",
] as const;

/** Where Shopify sends the customer back after authorization. */
export const CALLBACK_PATH = "/api/auth/shopify/callback";

/** Where the customer lands after a successful login / after logout. */
export const POST_LOGIN_PATH = "/account";
export const POST_LOGOUT_PATH = "/";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new CustomerAuthError(
      "not_configured",
      `Brak zmiennej środowiskowej ${name}.`
    );
  }
  return value;
}

/** `<store>.myshopify.com`, tolerant of protocol / trailing slash. */
export function getStoreDomain(): string {
  return required("SHOPIFY_STORE_DOMAIN")
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

export function getClientId(): string {
  return required("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID");
}

export function getClientSecret(): string {
  return required("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET");
}

export function getSessionSecret(): string {
  return required("SESSION_SECRET");
}

/** Public origin of this deployment, without a trailing slash. */
export function getAppUrl(): string {
  return required("NEXT_PUBLIC_APP_URL").replace(/\/+$/, "");
}

/**
 * Redirect URI registered in the Customer Account API app.
 *
 * Must match byte-for-byte what Shopify has on file, which is why it is
 * derived from one variable in one place.
 */
export function getRedirectUri(): string {
  return `${getAppUrl()}${CALLBACK_PATH}`;
}

/**
 * Whether login can be attempted at all.
 *
 * Used to fail loudly and early rather than redirect the customer into a
 * broken OAuth round trip.
 */
export function isCustomerAccountConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN?.trim() &&
      process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID?.trim() &&
      process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET?.trim() &&
      process.env.SESSION_SECRET?.trim() &&
      process.env.NEXT_PUBLIC_APP_URL?.trim()
  );
}

/** Names of the variables that are missing — for diagnostics, never values. */
export function missingCustomerAccountVars(): string[] {
  return [
    "SHOPIFY_STORE_DOMAIN",
    "SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID",
    "SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET",
    "SESSION_SECRET",
    "NEXT_PUBLIC_APP_URL",
  ].filter((name) => !process.env[name]?.trim());
}

/** Optional API-version pin. Discovery reports the current one otherwise. */
export function getApiVersionOverride(): string | undefined {
  return process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION?.trim() || undefined;
}
