/**
 * Shopify Admin API — product operations.
 *
 * SERVER-ONLY.
 *
 * ── Safety rules baked into this module ──────────────────────────────
 *  1. No delete. There is deliberately no product/variant delete
 *     operation, and none should be added without an explicit decision.
 *  2. Creation is always DRAFT. `createDraftProduct` hard-codes
 *     `status: DRAFT`; a caller cannot request ACTIVE.
 *  3. Publishing is a separate, explicit call. `updateProductBasicData`
 *     cannot change status, so nothing goes live as a side effect of an
 *     edit — only `publishProduct` does that.
 *  4. Every write supports `dryRun`, which returns the exact mutation +
 *     variables and sends nothing.
 *  5. Input is validated before any network call; failures come back as
 *     `userErrors`, not exceptions.
 */

import { adminGraphqlRequest } from "./client";
import type {
  AdminUserError,
  AdminWriteOptions,
  AdminWriteResult,
  AdminProductDetail,
  AdminProductSummary,
  CreateDraftProductInput,
  UpdateProductBasicDataInput,
  UpdateProductVariantPriceInput,
  PublishProductInput,
  SetProductMetafieldsInput,
} from "./types";

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function validationError(message: string, field?: string): AdminUserError {
  return { field: field ? [field] : null, message, code: "VALIDATION" };
}

function fail(
  operation: string,
  errors: AdminUserError[],
  dryRun = false
): AdminWriteResult<never> {
  return { ok: false, dryRun, operation, userErrors: errors };
}

function planned<T>(
  operation: string,
  summary: string,
  mutation: string,
  variables: Record<string, unknown>
): AdminWriteResult<T> {
  return {
    ok: true,
    dryRun: true,
    operation,
    userErrors: [],
    plan: { summary, mutation, variables },
  };
}

/** Shopify GIDs look like `gid://shopify/Product/123`. */
function isGid(value: string, resource: string): boolean {
  return new RegExp(`^gid://shopify/${resource}/\\d+$`).test(value);
}

/** Decimal money string, e.g. "84" or "84.00". */
function isMoneyString(value: string): boolean {
  return /^\d+(\.\d{1,2})?$/.test(value.trim());
}

/* ─── Shared GraphQL pieces ───────────────────────────────────────────── */

const PRODUCT_SUMMARY_FIELDS = /* GraphQL */ `
  id
  handle
  title
  status
  vendor
  productType
  tags
  totalInventory
  updatedAt
  featuredMedia {
    preview {
      image {
        url
      }
    }
  }
  variantsCount {
    count
  }
`;

const USER_ERROR_FIELDS = /* GraphQL */ `
  field
  message
`;

interface RawProductSummary {
  id: string;
  handle: string;
  title: string;
  status: AdminProductSummary["status"];
  vendor: string | null;
  productType: string | null;
  tags: string[];
  totalInventory: number | null;
  updatedAt: string;
  featuredMedia?: { preview?: { image?: { url?: string } | null } | null } | null;
  variantsCount?: { count: number } | null;
}

function toProductSummary(node: RawProductSummary): AdminProductSummary {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    status: node.status,
    vendor: node.vendor,
    productType: node.productType,
    tags: node.tags ?? [],
    totalInventory: node.totalInventory,
    updatedAt: node.updatedAt,
    featuredMediaUrl: node.featuredMedia?.preview?.image?.url ?? null,
    variantCount: node.variantsCount?.count,
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   READ
   ═══════════════════════════════════════════════════════════════════ */

const PRODUCTS_QUERY = /* GraphQL */ `
  query AdminProducts($first: Int!, $query: String) {
    products(first: $first, query: $query, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ${PRODUCT_SUMMARY_FIELDS}
      }
    }
  }
`;

/**
 * List products from the Admin API.
 *
 * Unlike the Storefront API this includes DRAFT and ARCHIVED products,
 * which is the point — it reflects the true state of the catalogue.
 */
export async function getAdminProducts(options?: {
  first?: number;
  /** Shopify search syntax, e.g. `status:draft`. */
  query?: string;
}): Promise<AdminProductSummary[]> {
  const first = Math.min(Math.max(options?.first ?? 25, 1), 250);
  const data = await adminGraphqlRequest<{
    products: { nodes: RawProductSummary[] };
  }>({
    query: PRODUCTS_QUERY,
    variables: { first, query: options?.query },
  });
  return (data.products?.nodes ?? []).map(toProductSummary);
}

const PRODUCT_BY_ID_QUERY = /* GraphQL */ `
  query AdminProduct($id: ID!) {
    product(id: $id) {
      ${PRODUCT_SUMMARY_FIELDS}
      descriptionHtml
      seo {
        title
        description
      }
      options {
        id
        name
        values
      }
      variants(first: 100) {
        nodes {
          id
          title
          sku
          price
          compareAtPrice
          selectedOptions {
            name
            value
          }
        }
      }
      metafields(first: 50) {
        nodes {
          id
          namespace
          key
          type
          value
        }
      }
      resourcePublicationsV2(first: 25) {
        nodes {
          isPublished
          publication {
            id
            name
          }
        }
      }
    }
  }
`;

/** Fetch one product by GID. Returns `null` when it does not exist. */
export async function getAdminProductById(
  id: string
): Promise<AdminProductDetail | null> {
  if (!isGid(id, "Product")) {
    throw new Error(
      `getAdminProductById: oczekiwano GID produktu (gid://shopify/Product/...), otrzymano "${id}".`
    );
  }

  const data = await adminGraphqlRequest<{
    product:
      | (RawProductSummary & {
          descriptionHtml: string;
          seo: { title: string | null; description: string | null } | null;
          options: Array<{ id: string; name: string; values: string[] }>;
          variants: {
            nodes: Array<{
              id: string;
              title: string;
              sku: string | null;
              price: string;
              compareAtPrice: string | null;
              selectedOptions: Array<{ name: string; value: string }>;
            }>;
          };
          metafields: {
            nodes: Array<{
              id: string;
              namespace: string;
              key: string;
              type: string;
              value: string;
            }>;
          };
          resourcePublicationsV2: {
            nodes: Array<{
              isPublished: boolean;
              publication: { id: string; name: string };
            }>;
          };
        })
      | null;
  }>({ query: PRODUCT_BY_ID_QUERY, variables: { id } });

  const p = data.product;
  if (!p) return null;

  return {
    ...toProductSummary(p),
    descriptionHtml: p.descriptionHtml,
    seo: p.seo,
    options: p.options ?? [],
    variants: (p.variants?.nodes ?? []).map((v) => ({
      id: v.id,
      title: v.title,
      sku: v.sku,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      selectedOptions: v.selectedOptions,
    })),
    metafields: p.metafields?.nodes ?? [],
    publications: (p.resourcePublicationsV2?.nodes ?? []).map((n) => ({
      publicationId: n.publication.id,
      name: n.publication.name,
      isPublished: n.isPublished,
    })),
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   WRITE — create
   ═══════════════════════════════════════════════════════════════════ */

const PRODUCT_CREATE_MUTATION = /* GraphQL */ `
  mutation CreateDraftProduct($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product {
        ${PRODUCT_SUMMARY_FIELDS}
      }
      userErrors {
        ${USER_ERROR_FIELDS}
      }
    }
  }
`;

/**
 * Create a product in DRAFT status.
 *
 * Status is hard-coded — there is no way to create an ACTIVE product
 * through this module. Making it live requires a deliberate, separate
 * `publishProduct()` call.
 *
 * Only the product's first variant is created (a Shopify constraint of
 * `productCreate`). Additional variants need `productVariantsBulkCreate`,
 * which this module does not expose yet.
 */
export async function createDraftProduct(
  input: CreateDraftProductInput,
  options: AdminWriteOptions = {}
): Promise<AdminWriteResult<AdminProductSummary>> {
  const operation = "createDraftProduct";
  const dryRun = options.dryRun === true;
  const errors: AdminUserError[] = [];

  const title = input.title?.trim();
  if (!title) {
    errors.push(validationError("`title` jest wymagany.", "title"));
  }
  if (input.handle !== undefined && !/^[a-z0-9-]+$/.test(input.handle)) {
    errors.push(
      validationError(
        "`handle` może zawierać wyłącznie małe litery, cyfry i myślniki.",
        "handle"
      )
    );
  }
  for (const opt of input.options ?? []) {
    if (!opt.name?.trim()) {
      errors.push(validationError("Opcja produktu wymaga `name`.", "options"));
    }
    if (!opt.values?.length) {
      errors.push(
        validationError(
          `Opcja "${opt.name}" wymaga co najmniej jednej wartości.`,
          "options"
        )
      );
    }
  }
  if (errors.length) return fail(operation, errors, dryRun);

  const product: Record<string, unknown> = {
    title,
    // Hard-coded. Not caller-controllable by design.
    status: "DRAFT",
  };
  if (input.handle) product.handle = input.handle;
  if (input.descriptionHtml) product.descriptionHtml = input.descriptionHtml;
  if (input.vendor) product.vendor = input.vendor;
  if (input.productType) product.productType = input.productType;
  if (input.tags?.length) product.tags = input.tags;
  if (input.seo) product.seo = input.seo;
  if (input.options?.length) {
    product.productOptions = input.options.map((o) => ({
      name: o.name,
      values: o.values.map((v) => ({ name: v })),
    }));
  }

  const variables = { product };

  if (dryRun) {
    return planned<AdminProductSummary>(
      operation,
      `Utworzy produkt "${title}" w statusie DRAFT (bez publikacji).`,
      PRODUCT_CREATE_MUTATION,
      variables
    );
  }

  const data = await adminGraphqlRequest<{
    productCreate: {
      product: RawProductSummary | null;
      userErrors: AdminUserError[];
    };
  }>({ query: PRODUCT_CREATE_MUTATION, variables });

  const userErrors = data.productCreate?.userErrors ?? [];
  const created = data.productCreate?.product;

  return {
    ok: userErrors.length === 0 && Boolean(created),
    dryRun: false,
    operation,
    data: created ? toProductSummary(created) : undefined,
    userErrors,
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   WRITE — update basic data
   ═══════════════════════════════════════════════════════════════════ */

const PRODUCT_UPDATE_MUTATION = /* GraphQL */ `
  mutation UpdateProductBasicData($product: ProductUpdateInput!) {
    productUpdate(product: $product) {
      product {
        ${PRODUCT_SUMMARY_FIELDS}
      }
      userErrors {
        ${USER_ERROR_FIELDS}
      }
    }
  }
`;

/**
 * Update descriptive product fields.
 *
 * Cannot change `status`. An edit therefore can never publish or
 * unpublish a product as a side effect — that is `publishProduct`'s job
 * alone.
 */
export async function updateProductBasicData(
  input: UpdateProductBasicDataInput,
  options: AdminWriteOptions = {}
): Promise<AdminWriteResult<AdminProductSummary>> {
  const operation = "updateProductBasicData";
  const dryRun = options.dryRun === true;
  const errors: AdminUserError[] = [];

  if (!isGid(input.id, "Product")) {
    errors.push(
      validationError(
        "`id` musi być GID produktu (gid://shopify/Product/...).",
        "id"
      )
    );
  }
  if (input.handle !== undefined && !/^[a-z0-9-]+$/.test(input.handle)) {
    errors.push(
      validationError(
        "`handle` może zawierać wyłącznie małe litery, cyfry i myślniki.",
        "handle"
      )
    );
  }

  const product: Record<string, unknown> = { id: input.id };
  if (input.title !== undefined) product.title = input.title;
  if (input.handle !== undefined) product.handle = input.handle;
  if (input.descriptionHtml !== undefined)
    product.descriptionHtml = input.descriptionHtml;
  if (input.vendor !== undefined) product.vendor = input.vendor;
  if (input.productType !== undefined) product.productType = input.productType;
  if (input.tags !== undefined) product.tags = input.tags;
  if (input.seo !== undefined) product.seo = input.seo;

  if (Object.keys(product).length === 1) {
    errors.push(
      validationError("Nie podano żadnego pola do aktualizacji.", "input")
    );
  }
  if (errors.length) return fail(operation, errors, dryRun);

  const variables = { product };

  if (dryRun) {
    const changed = Object.keys(product).filter((k) => k !== "id");
    return planned<AdminProductSummary>(
      operation,
      `Zaktualizuje pola [${changed.join(", ")}] produktu ${input.id}. Status pozostanie bez zmian.`,
      PRODUCT_UPDATE_MUTATION,
      variables
    );
  }

  const data = await adminGraphqlRequest<{
    productUpdate: {
      product: RawProductSummary | null;
      userErrors: AdminUserError[];
    };
  }>({ query: PRODUCT_UPDATE_MUTATION, variables });

  const userErrors = data.productUpdate?.userErrors ?? [];
  const updated = data.productUpdate?.product;

  return {
    ok: userErrors.length === 0 && Boolean(updated),
    dryRun: false,
    operation,
    data: updated ? toProductSummary(updated) : undefined,
    userErrors,
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   WRITE — variant price
   ═══════════════════════════════════════════════════════════════════ */

const VARIANT_PRICE_MUTATION = /* GraphQL */ `
  mutation UpdateProductVariantPrice(
    $productId: ID!
    $variants: [ProductVariantsBulkInput!]!
  ) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants {
        id
        title
        price
        compareAtPrice
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

/**
 * Update a single variant's price (and optionally its compare-at price).
 *
 * Shopify requires the owning product GID alongside the variant GID —
 * variants cannot be updated standalone via this mutation.
 */
export async function updateProductVariantPrice(
  input: UpdateProductVariantPriceInput,
  options: AdminWriteOptions = {}
): Promise<
  AdminWriteResult<
    Array<{
      id: string;
      title: string;
      price: string;
      compareAtPrice: string | null;
    }>
  >
> {
  const operation = "updateProductVariantPrice";
  const dryRun = options.dryRun === true;
  const errors: AdminUserError[] = [];

  if (!isGid(input.productId, "Product")) {
    errors.push(
      validationError("`productId` musi być GID produktu.", "productId")
    );
  }
  if (!isGid(input.variantId, "ProductVariant")) {
    errors.push(
      validationError(
        "`variantId` musi być GID wariantu (gid://shopify/ProductVariant/...).",
        "variantId"
      )
    );
  }
  if (!isMoneyString(input.price)) {
    errors.push(
      validationError(
        '`price` musi być kwotą dziesiętną, np. "84.00".',
        "price"
      )
    );
  }
  if (
    input.compareAtPrice !== undefined &&
    input.compareAtPrice !== null &&
    !isMoneyString(input.compareAtPrice)
  ) {
    errors.push(
      validationError(
        '`compareAtPrice` musi być kwotą dziesiętną lub null.',
        "compareAtPrice"
      )
    );
  }
  if (errors.length) return fail(operation, errors, dryRun);

  const variant: Record<string, unknown> = {
    id: input.variantId,
    price: input.price,
  };
  if (input.compareAtPrice !== undefined) {
    variant.compareAtPrice = input.compareAtPrice;
  }

  const variables = { productId: input.productId, variants: [variant] };

  if (dryRun) {
    return planned(
      operation,
      `Ustawi cenę wariantu ${input.variantId} na ${input.price}.`,
      VARIANT_PRICE_MUTATION,
      variables
    );
  }

  const data = await adminGraphqlRequest<{
    productVariantsBulkUpdate: {
      productVariants: Array<{
        id: string;
        title: string;
        price: string;
        compareAtPrice: string | null;
      }> | null;
      userErrors: AdminUserError[];
    };
  }>({ query: VARIANT_PRICE_MUTATION, variables });

  const userErrors = data.productVariantsBulkUpdate?.userErrors ?? [];
  const variants = data.productVariantsBulkUpdate?.productVariants ?? [];

  return {
    ok: userErrors.length === 0 && variants.length > 0,
    dryRun: false,
    operation,
    data: variants,
    userErrors,
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   WRITE — publish
   ═══════════════════════════════════════════════════════════════════ */

const PUBLICATIONS_QUERY = /* GraphQL */ `
  query ShopPublications($first: Int!) {
    publications(first: $first) {
      nodes {
        id
        name
      }
    }
  }
`;

const PUBLISH_MUTATION = /* GraphQL */ `
  mutation PublishProduct($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      publishable {
        ... on Product {
          id
          status
        }
      }
      userErrors {
        ${USER_ERROR_FIELDS}
      }
    }
  }
`;

const SET_ACTIVE_MUTATION = /* GraphQL */ `
  mutation ActivateProduct($product: ProductUpdateInput!) {
    productUpdate(product: $product) {
      product {
        id
        status
      }
      userErrors {
        ${USER_ERROR_FIELDS}
      }
    }
  }
`;

/**
 * Publish a product to sales channels — the ONLY operation in this
 * module that can make a product publicly visible.
 *
 * By default it also flips status DRAFT → ACTIVE, because a published
 * product left in DRAFT is still invisible to buyers. Pass
 * `setActive: false` to publish without changing status.
 *
 * When `publicationIds` is omitted, every publication on the shop is
 * discovered and used — this is what makes a product visible to the
 * Storefront API.
 */
export async function publishProduct(
  input: PublishProductInput,
  options: AdminWriteOptions = {}
): Promise<
  AdminWriteResult<{
    productId: string;
    status?: string;
    publishedTo: string[];
  }>
> {
  const operation = "publishProduct";
  const dryRun = options.dryRun === true;
  const errors: AdminUserError[] = [];

  if (!isGid(input.productId, "Product")) {
    errors.push(
      validationError("`productId` musi być GID produktu.", "productId")
    );
  }
  for (const pid of input.publicationIds ?? []) {
    if (!isGid(pid, "Publication")) {
      errors.push(
        validationError(
          `"${pid}" nie jest GID publikacji (gid://shopify/Publication/...).`,
          "publicationIds"
        )
      );
    }
  }
  if (errors.length) return fail(operation, errors, dryRun);

  const setActive = input.setActive !== false;

  // Discover publications when the caller did not name any. This read is
  // safe in dry-run mode — it changes nothing.
  let publicationIds = input.publicationIds;
  if (!publicationIds?.length) {
    const data = await adminGraphqlRequest<{
      publications: { nodes: Array<{ id: string; name: string }> };
    }>({ query: PUBLICATIONS_QUERY, variables: { first: 25 } });
    publicationIds = (data.publications?.nodes ?? []).map((n) => n.id);
  }

  if (!publicationIds.length) {
    return fail(
      operation,
      [
        validationError(
          "Sklep nie ma żadnych publikacji (kanałów sprzedaży), do których można opublikować produkt."
        ),
      ],
      dryRun
    );
  }

  const publishVariables = {
    id: input.productId,
    input: publicationIds.map((publicationId) => ({ publicationId })),
  };

  if (dryRun) {
    return planned(
      operation,
      `Opublikuje produkt ${input.productId} w ${publicationIds.length} kanale(-ach)${
        setActive ? " oraz ustawi status ACTIVE" : " (status bez zmian)"
      }.`,
      setActive
        ? `${SET_ACTIVE_MUTATION}\n\n${PUBLISH_MUTATION}`
        : PUBLISH_MUTATION,
      setActive
        ? {
            activate: { product: { id: input.productId, status: "ACTIVE" } },
            publish: publishVariables,
          }
        : publishVariables
    );
  }

  const userErrors: AdminUserError[] = [];
  let status: string | undefined;

  if (setActive) {
    const activateData = await adminGraphqlRequest<{
      productUpdate: {
        product: { id: string; status: string } | null;
        userErrors: AdminUserError[];
      };
    }>({
      query: SET_ACTIVE_MUTATION,
      variables: { product: { id: input.productId, status: "ACTIVE" } },
    });
    userErrors.push(...(activateData.productUpdate?.userErrors ?? []));
    status = activateData.productUpdate?.product?.status;

    // Do not publish if activation failed — avoids a half-applied change.
    if (userErrors.length) {
      return { ok: false, dryRun: false, operation, userErrors };
    }
  }

  const publishData = await adminGraphqlRequest<{
    publishablePublish: {
      publishable: { id: string; status?: string } | null;
      userErrors: AdminUserError[];
    };
  }>({ query: PUBLISH_MUTATION, variables: publishVariables });

  userErrors.push(...(publishData.publishablePublish?.userErrors ?? []));

  return {
    ok: userErrors.length === 0,
    dryRun: false,
    operation,
    data: {
      productId: input.productId,
      status: publishData.publishablePublish?.publishable?.status ?? status,
      publishedTo: publicationIds,
    },
    userErrors,
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   WRITE — metafields
   ═══════════════════════════════════════════════════════════════════ */

const METAFIELDS_SET_MUTATION = /* GraphQL */ `
  mutation SetProductMetafields($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        key
        type
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

/**
 * Set (create or overwrite) metafields on a product.
 *
 * This is how the coffee-specific data the storefront renders — origin,
 * lot code, roast level, tasting notes, brewing recipes — gets onto a
 * product, since Shopify has no native fields for any of it.
 *
 * Keys must also be listed in `PRODUCT_METAFIELD_IDENTIFIERS`
 * (lib/shopify/fragments.ts) for the Storefront API to return them —
 * writing a metafield here is necessary but not sufficient.
 */
export async function setProductMetafields(
  input: SetProductMetafieldsInput,
  options: AdminWriteOptions = {}
): Promise<
  AdminWriteResult<
    Array<{ id: string; namespace: string; key: string; type: string }>
  >
> {
  const operation = "setProductMetafields";
  const dryRun = options.dryRun === true;
  const errors: AdminUserError[] = [];

  if (!isGid(input.productId, "Product")) {
    errors.push(
      validationError("`productId` musi być GID produktu.", "productId")
    );
  }
  if (!input.metafields?.length) {
    errors.push(
      validationError("Lista `metafields` nie może być pusta.", "metafields")
    );
  }
  for (const mf of input.metafields ?? []) {
    if (!mf.key?.trim()) {
      errors.push(validationError("Metafield wymaga `key`.", "metafields"));
    }
    if (!mf.type?.trim()) {
      errors.push(
        validationError(
          `Metafield "${mf.key}" wymaga \`type\` (np. single_line_text_field).`,
          "metafields"
        )
      );
    }
    if (mf.value === undefined || mf.value === null) {
      errors.push(
        validationError(`Metafield "${mf.key}" wymaga \`value\`.`, "metafields")
      );
    }
  }
  if (errors.length) return fail(operation, errors, dryRun);

  const metafields = input.metafields.map((mf) => ({
    ownerId: input.productId,
    namespace: mf.namespace?.trim() || "custom",
    key: mf.key,
    type: mf.type,
    value: mf.value,
  }));

  const variables = { metafields };

  if (dryRun) {
    return planned(
      operation,
      `Ustawi ${metafields.length} metafield(ów) na produkcie ${input.productId}: ${metafields
        .map((m) => `${m.namespace}.${m.key}`)
        .join(", ")}.`,
      METAFIELDS_SET_MUTATION,
      variables
    );
  }

  const data = await adminGraphqlRequest<{
    metafieldsSet: {
      metafields: Array<{
        id: string;
        namespace: string;
        key: string;
        type: string;
      }> | null;
      userErrors: AdminUserError[];
    };
  }>({ query: METAFIELDS_SET_MUTATION, variables });

  const userErrors = data.metafieldsSet?.userErrors ?? [];
  const written = data.metafieldsSet?.metafields ?? [];

  return {
    ok: userErrors.length === 0 && written.length > 0,
    dryRun: false,
    operation,
    data: written,
    userErrors,
  };
}
