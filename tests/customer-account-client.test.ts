import { beforeEach, describe, expect, it, vi } from "vitest";

const session = {
  accessToken: "access-old",
  refreshToken: "refresh-token",
  expiresAt: Date.now() + 60 * 60 * 1000,
};

const {
  readSession,
  saveSession,
  clearSession,
  isAccessTokenStale,
  refreshSession,
} = vi.hoisted(() => ({
  readSession: vi.fn(),
  saveSession: vi.fn(),
  clearSession: vi.fn(),
  isAccessTokenStale: vi.fn(),
  refreshSession: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/shopify/customer-account/session", () => ({
  readSession,
  saveSession,
  clearSession,
  isAccessTokenStale,
}));

vi.mock("@/lib/shopify/customer-account/auth", () => ({ refreshSession }));

vi.mock("@/lib/shopify/customer-account/discovery", () => ({
  getCustomerAccountEndpoints: vi.fn(async () => ({
    graphqlApi: "https://shopify.com/1/account/customer/api/2026-07/graphql",
    tokenEndpoint: "https://shopify.com/authentication/1/oauth/token",
  })),
}));

import { customerAccountFetch } from "@/lib/shopify/customer-account/client";
import { CustomerApiError } from "@/lib/shopify/customer-account/errors";

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("customerAccountFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    readSession.mockResolvedValue({ ...session });
    isAccessTokenStale.mockReturnValue(false);
    refreshSession.mockResolvedValue({
      ...session,
      accessToken: "access-new",
      expiresAt: Date.now() + 60 * 60 * 1000,
    });
    saveSession.mockResolvedValue(undefined);
    clearSession.mockResolvedValue(undefined);
  });

  it("sends the customer token only in the Authorization header", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({ data: { customer: { id: "gid://customer/1" } } }));

    const data = await customerAccountFetch<{ customer: { id: string } }>(
      "query { customer { id } }"
    );

    expect(data.customer.id).toBe("gid://customer/1");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/account/customer/api/");
    expect(new Headers(init?.headers).get("Authorization")).toBe("access-old");
    expect(String(init?.body)).not.toContain("access-old");
  });

  it("refreshes a stale token before the GraphQL request and persists it", async () => {
    isAccessTokenStale.mockReturnValue(true);
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({ data: { customer: { id: "1" } } }));

    await customerAccountFetch("query { customer { id } }");

    expect(refreshSession).toHaveBeenCalledOnce();
    expect(saveSession).toHaveBeenCalledOnce();
    expect(new Headers(fetchMock.mock.calls[0][1]?.headers).get("Authorization")).toBe(
      "access-new"
    );
  });

  it("refreshes and retries exactly once after a 401", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response({ errors: [{ message: "expired" }] }, 401))
      .mockResolvedValueOnce(response({ data: { customer: { id: "1" } } }));

    await customerAccountFetch("query { customer { id } }");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(refreshSession).toHaveBeenCalledOnce();
    expect(saveSession).toHaveBeenCalledOnce();
    expect(new Headers(fetchMock.mock.calls[1][1]?.headers).get("Authorization")).toBe(
      "access-new"
    );
  });

  it("ends the session when Shopify rejects both the original and refreshed token", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response({}, 401))
      .mockResolvedValueOnce(response({}, 401));

    const promise = customerAccountFetch("query { customer { id } }");
    await expect(promise).rejects.toMatchObject({
      kind: "unauthorized",
      status: 401,
    });
    expect(clearSession).toHaveBeenCalledOnce();
  });

  it("distinguishes GraphQL errors from HTTP failures", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      response({ errors: [{ message: "Missing customer_read_orders scope" }] })
    );

    const promise = customerAccountFetch("query { customer { id } }");
    await expect(promise).rejects.toBeInstanceOf(CustomerApiError);
    await expect(promise).rejects.toMatchObject({
      kind: "graphql",
      status: 502,
    });
  });

  it("does not turn a Shopify outage into empty customer data", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response({}, 503));
    await expect(
      customerAccountFetch("query { customer { id } }")
    ).rejects.toMatchObject({ kind: "http", status: 502 });
  });

  it("rejects malformed JSON explicitly", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<html>not graphql</html>", { status: 200 })
    );
    await expect(
      customerAccountFetch("query { customer { id } }")
    ).rejects.toMatchObject({ kind: "invalid_response", status: 502 });
  });

  it("returns 401 without making a network request when there is no session", async () => {
    readSession.mockResolvedValue(null);
    const fetchMock = vi.spyOn(globalThis, "fetch");

    await expect(
      customerAccountFetch("query { customer { id } }")
    ).rejects.toMatchObject({ kind: "unauthorized", status: 401 });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
