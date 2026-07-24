import { NextResponse } from "next/server";
import {
  getShopifyAdminAccessToken,
  getAdminTokenCacheStatus,
  getAdminApiVersion,
  isAdminApiConfigured,
  getAdminProducts,
  getAdminProductById,
  createDraftProduct,
  updateProductBasicData,
  updateProductVariantPrice,
  publishProduct,
  setProductMetafields,
  AdminApiError,
} from "@/lib/shopify/admin";

/**
 * TEMPORARY diagnostic endpoint — Admin tools module smoke test.
 *
 * Verifies that the administrative layer is wired correctly:
 *   1. token    — client_credentials exchange + in-memory cache behaviour
 *   2. products — read path through the module
 *   3. tools    — the seven operations are exported and callable
 *
 * READ-ONLY. Executes no mutations. The write functions are only probed
 * through their validation paths (deliberately invalid input, which
 * short-circuits before any network call), so nothing in the store is
 * created, changed or published.
 *
 * Never returns the access token, client id or client secret.
 *
 * ⚠️ DELETE once the admin module is confirmed working.
 */

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Probe a write function without touching Shopify.
 *
 * Passes intentionally invalid input so the function's own validation
 * rejects it before any network call — this proves the function exists,
 * is callable, and validates, while guaranteeing no mutation is sent.
 */
async function probeValidation(
  name: string,
  run: () => Promise<{ ok: boolean; userErrors: Array<{ message: string }> }>
): Promise<{
  name: string;
  callable: boolean;
  rejectsInvalidInput: boolean;
  sampleMessage?: string;
  error?: string;
}> {
  try {
    const result = await run();
    return {
      name,
      callable: true,
      // Must reject: we fed it invalid input on purpose.
      rejectsInvalidInput: result.ok === false && result.userErrors.length > 0,
      sampleMessage: result.userErrors[0]?.message,
    };
  } catch (err) {
    return {
      name,
      callable: false,
      rejectsInvalidInput: false,
      error: err instanceof Error ? err.message : "nieznany błąd",
    };
  }
}

export async function GET() {
  const noStore = { "Cache-Control": "no-store, max-age=0" };
  const apiVersion = getAdminApiVersion();

  // ── 1. Config ────────────────────────────────────────────────────
  if (!isAdminApiConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        apiVersion,
        checks: {
          config: {
            ok: false,
            error:
              "Brak SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_CLIENT_ID lub SHOPIFY_ADMIN_CLIENT_SECRET.",
          },
          token: { ok: false, skipped: "brak konfiguracji" },
          products: { ok: false, skipped: "brak konfiguracji" },
          tools: { ok: false, skipped: "brak konfiguracji" },
        },
      },
      { status: 500, headers: noStore }
    );
  }

  // ── 2. Token (+ cache behaviour) ─────────────────────────────────
  let tokenCheck: Record<string, unknown>;
  try {
    const firstStart = Date.now();
    await getShopifyAdminAccessToken();
    const firstMs = Date.now() - firstStart;

    const cacheAfterFirst = getAdminTokenCacheStatus();

    // Second call must be served from cache — no network round trip.
    const secondStart = Date.now();
    await getShopifyAdminAccessToken();
    const secondMs = Date.now() - secondStart;

    tokenCheck = {
      ok: true,
      acquired: true,
      cache: cacheAfterFirst,
      timing: {
        firstCallMs: firstMs,
        cachedCallMs: secondMs,
        servedFromCache: secondMs < Math.max(5, firstMs / 2),
      },
      note: "Token przechowywany wyłącznie w pamięci instancji. Nigdy nie jest zwracany ani logowany.",
    };
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        apiVersion,
        checks: {
          config: { ok: true },
          token: {
            ok: false,
            error: err instanceof Error ? err.message : "nieznany błąd",
            httpStatus: err instanceof AdminApiError ? err.status : undefined,
          },
          products: { ok: false, skipped: "brak tokenu" },
          tools: { ok: false, skipped: "brak tokenu" },
        },
      },
      { status: 502, headers: noStore }
    );
  }

  // ── 3. Read path ─────────────────────────────────────────────────
  let productsCheck: Record<string, unknown>;
  let firstProductId: string | null = null;
  try {
    const products = await getAdminProducts({ first: 5 });
    firstProductId = products[0]?.id ?? null;
    productsCheck = {
      ok: true,
      count: products.length,
      // Summaries only — no customer or financial data involved.
      products: products.map((p) => ({
        id: p.id,
        handle: p.handle,
        title: p.title,
        status: p.status,
        variantCount: p.variantCount,
      })),
      note:
        products.length === 0
          ? "Katalog pusty. Admin API zwraca także produkty DRAFT, więc w sklepie faktycznie nie ma żadnego produktu."
          : undefined,
    };
  } catch (err) {
    productsCheck = {
      ok: false,
      error: err instanceof Error ? err.message : "nieznany błąd",
      httpStatus: err instanceof AdminApiError ? err.status : undefined,
    };
  }

  // getAdminProductById is only exercised when there is something to read.
  let productByIdCheck: Record<string, unknown>;
  if (firstProductId) {
    try {
      const detail = await getAdminProductById(firstProductId);
      productByIdCheck = {
        ok: Boolean(detail),
        exercised: true,
        variantCount: detail?.variants.length ?? 0,
        metafieldCount: detail?.metafields.length ?? 0,
      };
    } catch (err) {
      productByIdCheck = {
        ok: false,
        exercised: true,
        error: err instanceof Error ? err.message : "nieznany błąd",
      };
    }
  } else {
    productByIdCheck = {
      ok: true,
      exercised: false,
      note: "Pominięte — brak produktów do odczytania.",
    };
  }

  // ── 4. Write functions — validation probes only ──────────────────
  const tools = await Promise.all([
    probeValidation("createDraftProduct", () =>
      createDraftProduct({ title: "" })
    ),
    probeValidation("updateProductBasicData", () =>
      updateProductBasicData({ id: "not-a-gid", title: "x" })
    ),
    probeValidation("updateProductVariantPrice", () =>
      updateProductVariantPrice({
        productId: "not-a-gid",
        variantId: "not-a-gid",
        price: "abc",
      })
    ),
    probeValidation("publishProduct", () =>
      publishProduct({ productId: "not-a-gid" })
    ),
    probeValidation("setProductMetafields", () =>
      setProductMetafields({ productId: "not-a-gid", metafields: [] })
    ),
  ]);

  const toolsOk = tools.every((t) => t.callable && t.rejectsInvalidInput);

  const allOk =
    tokenCheck.ok === true &&
    productsCheck.ok === true &&
    productByIdCheck.ok === true &&
    toolsOk;

  return NextResponse.json(
    {
      ok: allOk,
      apiVersion,
      checks: {
        config: { ok: true },
        token: tokenCheck,
        products: productsCheck,
        productById: productByIdCheck,
        tools: {
          ok: toolsOk,
          probed: tools,
          note: "Funkcje zapisu sprawdzone wyłącznie ścieżką walidacji (celowo błędne dane) — żadna mutacja nie została wysłana.",
        },
      },
      guarantees: {
        mutationsExecuted: false,
        productsCreated: 0,
        productsModified: 0,
        productsPublished: 0,
        deleteOperationsAvailable: false,
      },
      availableOperations: {
        read: ["getAdminProducts", "getAdminProductById"],
        write: [
          "createDraftProduct",
          "updateProductBasicData",
          "updateProductVariantPrice",
          "publishProduct",
          "setProductMetafields",
        ],
        notImplementedByDesign: [
          "deleteProduct",
          "deleteVariant",
          "inventory writes (brak scope write_inventory)",
        ],
      },
    },
    { status: allOk ? 200 : 502, headers: noStore }
  );
}
