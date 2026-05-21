# lib/shopify — integration scaffold (NOT wired up)

This folder is a **placeholder structure** for the future Shopify Storefront API
integration. As of PR #10 nothing here is imported by the running app, no
network requests are made, and no environment variables are read.

The live app reads products through the data-access seam in
`lib/mock/products.ts` (`getProducts` / `getProduct` / `getFeaturedProducts`).
Integration = re-implementing that seam on top of the files below.

## Files

| File         | Purpose                                                        | Status      |
|--------------|----------------------------------------------------------------|-------------|
| `types.ts`   | Shopify Storefront API response shapes (TypeScript interfaces). | Scaffold    |
| `queries.ts` | GraphQL query/mutation strings (plain strings, not executed).   | Scaffold    |
| `client.ts`  | `shopifyFetch` wrapper — **stub that throws** until configured. | Stub        |
| `mappers.ts` | Shopify → Aura `Product` mapping helpers.                       | Scaffold    |

## How integration will work

1. Add env vars (see `docs/SHOPIFY_INTEGRATION_PLAN.md`).
2. Implement `client.ts` (`shopifyFetch`) against the Storefront GraphQL endpoint.
3. Implement `mappers.ts` to convert Shopify products → the app's `Product` type.
4. Re-point the seam in `lib/mock/products.ts` (or replace it) to call
   `shopifyFetch` + the mappers. Make the seam functions `async`.
5. Wire the cart context to the cart mutations.

See `docs/SHOPIFY_INTEGRATION_PLAN.md` for the full plan and ordering.
