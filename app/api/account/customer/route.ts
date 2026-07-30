import { NextResponse } from "next/server";

import { getCustomerSummary } from "@/lib/shopify/customer-account/customer";
import { CustomerApiError } from "@/lib/shopify/customer-account/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Temporary Faza 2 proof endpoint. It returns a browser-safe DTO, never the
 * OAuth token or raw Shopify response. Faza 3 pages will call the DAL
 * directly and this route can then be removed.
 */
export async function GET() {
  const headers = { "Cache-Control": "private, no-store, max-age=0" };
  try {
    return NextResponse.json(await getCustomerSummary(), { headers });
  } catch (error) {
    if (error instanceof CustomerApiError) {
      if (error.kind !== "unauthorized") {
        console.error(
          `[aura/customer-api] ${error.kind}: ${error.message}`
        );
      }
      return NextResponse.json(
        {
          error:
            error.kind === "unauthorized"
              ? "unauthorized"
              : "customer_api_unavailable",
        },
        { status: error.status, headers }
      );
    }
    console.error(
      `[aura/customer-api] unexpected: ${
        error instanceof Error ? error.message : "nieznany błąd"
      }`
    );
    return NextResponse.json(
      { error: "customer_api_unavailable" },
      { status: 500, headers }
    );
  }
}
