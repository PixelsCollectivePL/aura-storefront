/**
 * Shopify Admin API — public surface.
 *
 * SERVER-ONLY. Import from Server Components, Route Handlers or Server
 * Actions. Never from a Client Component: this module reaches the app's
 * client secret.
 *
 * Separate from `lib/shopify` (Storefront), which is read-only, public
 * catalogue data. This module is the write path.
 *
 * ── What this module deliberately does NOT do ────────────────────────
 *   · no delete of any kind
 *   · no way to create a product in ACTIVE status
 *   · no status change outside `publishProduct`
 *   · no inventory writes (the app has no `write_inventory` scope)
 */

export {
  getShopifyAdminAccessToken,
  adminGraphqlRequest,
  isAdminApiConfigured,
  getAdminApiVersion,
  getAdminTokenCacheStatus,
  clearAdminTokenCache,
  AdminApiError,
} from "./client";

export {
  // read
  getAdminProducts,
  getAdminProductById,
  // write — all support { dryRun: true }
  createDraftProduct,
  updateProductBasicData,
  updateProductVariantPrice,
  publishProduct,
  setProductMetafields,
} from "./products";

export type {
  AdminUserError,
  AdminWriteOptions,
  AdminWriteResult,
  AdminOperationPlan,
  AdminProductSummary,
  AdminProductDetail,
  AdminProductVariantSummary,
  ProductStatus,
  CreateDraftProductInput,
  UpdateProductBasicDataInput,
  UpdateProductVariantPriceInput,
  PublishProductInput,
  SetProductMetafieldsInput,
  ProductMetafieldInput,
} from "./types";
