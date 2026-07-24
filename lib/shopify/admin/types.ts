/**
 * Shopify Admin API — types for the administrative module.
 *
 * Deliberately narrow: only what the seven exposed operations need.
 */

/* ─── Shopify payload shapes ──────────────────────────────────────────── */

/** Shape of `userErrors` across Admin mutation payloads. */
export interface AdminUserError {
  field: string[] | null;
  message: string;
  /** Present on typed error unions (e.g. ProductVariantsBulkUpdateUserError). */
  code?: string | null;
}

export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export interface AdminProductVariantSummary {
  id: string;
  title: string;
  sku: string | null;
  price: string;
  compareAtPrice: string | null;
  selectedOptions?: Array<{ name: string; value: string }>;
}

export interface AdminProductSummary {
  id: string;
  handle: string;
  title: string;
  status: ProductStatus;
  vendor: string | null;
  productType: string | null;
  tags: string[];
  totalInventory: number | null;
  updatedAt: string;
  featuredMediaUrl?: string | null;
  variantCount?: number;
}

export interface AdminProductDetail extends AdminProductSummary {
  descriptionHtml: string;
  seo: { title: string | null; description: string | null } | null;
  options: Array<{ id: string; name: string; values: string[] }>;
  variants: AdminProductVariantSummary[];
  metafields: Array<{
    id: string;
    namespace: string;
    key: string;
    type: string;
    value: string;
  }>;
  publications: Array<{ publicationId: string; name: string; isPublished: boolean }>;
}

/* ─── Operation result contract ───────────────────────────────────────── */

/**
 * The plan a write operation *would* execute. Returned instead of
 * performing the write when `dryRun: true`.
 */
export interface AdminOperationPlan {
  /** Human-readable description of the intended change. */
  summary: string;
  /** The GraphQL document that would be sent. */
  mutation: string;
  /** The variables that would be sent. */
  variables: Record<string, unknown>;
}

/**
 * Uniform result for every write operation.
 *
 * Callers never need try/catch for expected failures: validation
 * problems and Shopify `userErrors` both land in `userErrors` with
 * `ok: false`. Only transport/auth faults throw (`AdminApiError`).
 */
export interface AdminWriteResult<TData = unknown> {
  ok: boolean;
  /** True when nothing was sent to Shopify. */
  dryRun: boolean;
  /** Stable operation name, e.g. "createDraftProduct". */
  operation: string;
  /** Populated on success when not a dry run. */
  data?: TData;
  /** Validation failures and Shopify userErrors, merged. */
  userErrors: AdminUserError[];
  /** Populated when `dryRun: true`. */
  plan?: AdminOperationPlan;
}

/** Every write operation accepts this. */
export interface AdminWriteOptions {
  /**
   * When true, the function validates input and returns the operation
   * plan WITHOUT contacting Shopify. Nothing is created or changed.
   */
  dryRun?: boolean;
}

/* ─── Input types ─────────────────────────────────────────────────────── */

export interface CreateDraftProductInput {
  /** Required. */
  title: string;
  /** URL handle. Shopify derives one from the title when omitted. */
  handle?: string;
  descriptionHtml?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  seo?: { title?: string; description?: string };
  /**
   * Option axes, e.g.
   *   [{ name: "Waga", values: ["200g", "500g"] }]
   *
   * NOTE: `productCreate` only creates the product's FIRST variant.
   * Additional variants require `productVariantsBulkCreate`, which this
   * module does not expose yet.
   */
  options?: Array<{ name: string; values: string[] }>;
}

export interface UpdateProductBasicDataInput {
  /** Product GID. */
  id: string;
  title?: string;
  handle?: string;
  descriptionHtml?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  seo?: { title?: string; description?: string };
}

export interface UpdateProductVariantPriceInput {
  /** Product GID that owns the variant. */
  productId: string;
  /** Variant GID. */
  variantId: string;
  /** Decimal string, e.g. "84.00". */
  price: string;
  /** Crossed-out price. Pass null to clear it. */
  compareAtPrice?: string | null;
}

export interface PublishProductInput {
  /** Product GID. */
  productId: string;
  /**
   * Publication GIDs to publish to. When omitted, the module discovers
   * every publication on the shop and publishes to all of them.
   */
  publicationIds?: string[];
  /**
   * Also flip product status DRAFT → ACTIVE. Default true: publishing a
   * product that stays DRAFT would not be visible to buyers, which is
   * almost never the intent.
   */
  setActive?: boolean;
}

export interface ProductMetafieldInput {
  /** Defaults to "custom" — the namespace Shopify Admin uses by default. */
  namespace?: string;
  key: string;
  /** e.g. "single_line_text_field", "list.single_line_text_field", "json", "boolean" */
  type: string;
  value: string;
}

export interface SetProductMetafieldsInput {
  /** Product GID. */
  productId: string;
  metafields: ProductMetafieldInput[];
}
