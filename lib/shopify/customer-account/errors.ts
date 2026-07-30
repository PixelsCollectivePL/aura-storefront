/**
 * Customer Account API / OAuth failures.
 *
 * Never carries a token, a client secret, or an authorization code — these
 * objects end up in logs.
 */

export type CustomerAuthErrorCode =
  | "not_configured"
  | "discovery_failed"
  | "invalid_state"
  | "missing_code"
  | "token_exchange_failed"
  | "refresh_failed"
  | "session_expired"
  | "api_failed"
  | "unauthorized";

export class CustomerAuthError extends Error {
  readonly code: CustomerAuthErrorCode;
  readonly status: number;

  constructor(code: CustomerAuthErrorCode, message: string, status = 500) {
    super(message);
    this.name = "CustomerAuthError";
    this.code = code;
    this.status = status;
  }
}

/**
 * Short, non-technical Polish message for the customer.
 *
 * The technical detail stays in the server log; the shopper gets something
 * actionable instead of an OAuth error code.
 */
export function customerAuthMessage(code: CustomerAuthErrorCode): string {
  switch (code) {
    case "not_configured":
      return "Logowanie jest chwilowo niedostępne z powodu konfiguracji sklepu.";
    case "invalid_state":
      return "Sesja logowania wygasła lub jest nieprawidłowa. Spróbuj zalogować się ponownie.";
    case "session_expired":
      return "Twoja sesja wygasła. Zaloguj się ponownie.";
    case "unauthorized":
      return "Musisz być zalogowany, aby zobaczyć tę stronę.";
    default:
      return "Nie udało się zalogować. Spróbuj ponownie za chwilę.";
  }
}
