# `lib/shopify` — catalogue data layer

**Live.** Products, collections and the PDP read from Shopify Storefront API
through this folder.

Server-only — holds the private Storefront token. Never import it from a
Client Component.

## Layout

```
client.ts              GraphQL transport, cache tags, error type
fragments.ts           shared GraphQL fragments + metafield identifiers
types.ts               Shopify response shapes
queries/
  products.ts          list, collection-products, handles
  product.ts           single product by handle
  collections.ts       collection list
mappers/
  product.ts           ShopifyProduct → Product  (+ Collection)
  cart.ts              ShopifyCartLine → CartLine   (Sprint 2, unused)
index.ts               PUBLIC API — the only file pages import
```

## Public API

```ts
import {
  getProducts,          // (opts?) => Product[]
  getProductByHandle,   // (handle) => Product | null
  getProductHandles,    // () => string[]        — generateStaticParams
  getFeaturedProducts,  // (count?) => Product[] — homepage shelf
  getCollections,       // () => Collection[]
} from "@/lib/shopify";
```

Pages consume `Product` from `types/product.ts` and never see a Shopify
shape — swapping the backend means rewriting `mappers/product.ts` only.

## Failure policy

List reads **never throw**. A missing env var, an outage, or a GraphQL
error degrades to `[]` (or `null` for a single product) and logs to the
server console — the page renders its empty state instead of 500-ing.

`getProductByHandle` returning `null` is how the PDP triggers `notFound()`.

## Caching & revalidation

Next 16 does **not** cache `fetch` by default, so every request opts in
explicitly:

```ts
next: { revalidate: 60, tags: ["shopify", "shopify:products", ...] }
```

Shopify Admin edits therefore appear within ~60s with no deploy.

Tags are the future webhook surface. Adding instant invalidation later
means writing a webhook route that calls:

```ts
revalidateTag(SHOPIFY_TAGS.products);          // any list
revalidateTag(SHOPIFY_TAGS.product(handle));   // one PDP
revalidateTag(SHOPIFY_TAGS.collections);
```

No change to this layer is required for that.

## Metafields

Coffee-specific fields (origin, lot code, roast level, tasting notes,
brewing recipes) have no native Shopify equivalent and come from `custom.*`
metafields.

The Storefront API requires explicit `identifiers` — there is **no**
"fetch all metafields" query. Creating a metafield in Shopify Admin is not
enough: its key must also be added to `PRODUCT_METAFIELD_IDENTIFIERS` in
`fragments.ts`.

All of them are optional. A product with nothing but a title and a price
renders correctly; metafield-backed fields fall back to empty values.

## Mock fixtures

Off by default and impossible to enable in production:

```ts
process.env.AURA_USE_MOCK_CATALOG === "true" && NODE_ENV !== "production"
```

They exist for local visual work while the Shopify catalogue is empty, and
load via dynamic `import()` so they stay out of the production path.

## Environment

| Variable | Required | Notes |
|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | yes | `<store>.myshopify.com` |
| `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` | yes | server-side only |
| `SHOPIFY_STOREFRONT_API_VERSION` | no | defaults to `2025-10` |
| `AURA_USE_MOCK_CATALOG` | no | dev-only escape hatch |
