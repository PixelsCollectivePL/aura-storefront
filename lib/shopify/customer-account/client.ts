import "server-only";

import { refreshSession } from "./auth";
import { getCustomerAccountEndpoints } from "./discovery";
import { CustomerApiError } from "./errors";
import {
  clearSession,
  isAccessTokenStale,
  readSession,
  saveSession,
  type CustomerSession,
} from "./session";
import type { CustomerGraphQLResponse, GraphQLErrorShape } from "./types";

export interface CustomerRequestOptions {
  /** Persisting a refreshed token requires a Route Handler or Server Action. */
  persistRefresh?: boolean;
  /** Some future views can deliberately render partial GraphQL data. */
  allowPartialData?: boolean;
}

function unauthorized(message: string): CustomerApiError {
  return new CustomerApiError({ kind: "unauthorized", message, status: 401 });
}

async function getValidSession(persistRefresh: boolean): Promise<CustomerSession> {
  const session = await readSession();
  if (!session) throw unauthorized("Brak sesji klienta.");
  if (!isAccessTokenStale(session)) return session;
  if (!session.refreshToken) {
    if (persistRefresh) await clearSession();
    throw unauthorized("Sesja klienta wygasła.");
  }

  try {
    const endpoints = await getCustomerAccountEndpoints();
    const refreshed = await refreshSession({
      endpoints,
      refreshToken: session.refreshToken,
    });
    if (persistRefresh) await saveSession(refreshed);
    return refreshed;
  } catch (error) {
    if (persistRefresh) await clearSession();
    throw unauthorized(
      error instanceof Error ? error.message : "Nie udało się odświeżyć sesji."
    );
  }
}

async function execute<T>({
  endpoint,
  accessToken,
  query,
  variables,
}: {
  endpoint: string;
  accessToken: string;
  query: string;
  variables: Record<string, unknown>;
}): Promise<{ response: Response; body: CustomerGraphQLResponse<T> }> {
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Shopify's Customer Account API expects the token directly in this
        // header (not a Storefront token and not an Admin token).
        Authorization: accessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
  } catch (error) {
    throw new CustomerApiError({
      kind: "http",
      message: `Nie udało się połączyć z Customer Account API: ${
        error instanceof Error ? error.message : "nieznany błąd"
      }.`,
      status: 502,
    });
  }

  const text = await response.text();
  let body: CustomerGraphQLResponse<T>;
  try {
    body = JSON.parse(text) as CustomerGraphQLResponse<T>;
  } catch {
    throw new CustomerApiError({
      kind: "invalid_response",
      message: `Customer Account API zwróciło odpowiedź spoza JSON (HTTP ${response.status}).`,
      status: 502,
    });
  }
  return { response, body };
}

function graphQLErrorMessage(errors: GraphQLErrorShape[]): string {
  return errors.map(({ message }) => message).join("; ");
}

/**
 * Authenticated Customer Account GraphQL transport.
 *
 * It refreshes before expiry and retries exactly once when Shopify rejects
 * an apparently fresh token. A second 401 ends the session instead of
 * looping or hiding the failure as empty data.
 */
export async function customerAccountFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: CustomerRequestOptions = {}
): Promise<T> {
  const persistRefresh = options.persistRefresh ?? true;
  const endpoints = await getCustomerAccountEndpoints();
  let session = await getValidSession(persistRefresh);
  let result = await execute<T>({
    endpoint: endpoints.graphqlApi,
    accessToken: session.accessToken,
    query,
    variables,
  });

  if (result.response.status === 401) {
    if (!session.refreshToken) {
      if (persistRefresh) await clearSession();
      throw unauthorized("Shopify odrzuciło sesję klienta.");
    }
    try {
      session = await refreshSession({
        endpoints,
        refreshToken: session.refreshToken,
      });
      if (persistRefresh) await saveSession(session);
    } catch (error) {
      if (persistRefresh) await clearSession();
      throw unauthorized(
        error instanceof Error ? error.message : "Sesja klienta wygasła."
      );
    }
    result = await execute<T>({
      endpoint: endpoints.graphqlApi,
      accessToken: session.accessToken,
      query,
      variables,
    });
  }

  if (result.response.status === 401 || result.response.status === 403) {
    if (persistRefresh) await clearSession();
    throw unauthorized(`Customer Account API zwróciło HTTP ${result.response.status}.`);
  }
  if (!result.response.ok) {
    throw new CustomerApiError({
      kind: "http",
      message: `Customer Account API zwróciło HTTP ${result.response.status}.`,
      status: 502,
    });
  }

  const errors = result.body.errors ?? [];
  if (errors.length && !(options.allowPartialData && result.body.data)) {
    throw new CustomerApiError({
      kind: "graphql",
      message: graphQLErrorMessage(errors),
      status: 502,
      graphQLErrors: errors,
    });
  }
  if (!result.body.data) {
    throw new CustomerApiError({
      kind: "invalid_response",
      message: "Customer Account API nie zwróciło pola `data`.",
      status: 502,
    });
  }
  return result.body.data;
}

/** Useful to route handlers that only need a refreshed session. */
export async function getValidCustomerSession(): Promise<CustomerSession> {
  return getValidSession(true);
}
