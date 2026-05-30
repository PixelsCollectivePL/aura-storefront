# Shopify Integration Roadmap

Working document. Covers **HOW** we get from today's mock-data storefront
to a live, Shopify-backed shop. The sister doc
[`SHOPIFY_INTEGRATION_PLAN.md`](./SHOPIFY_INTEGRATION_PLAN.md) covers
the data-layer mapping; the account-specific plan lives in
[`ACCOUNT_SHOPIFY_INTEGRATION_PLAN.md`](./ACCOUNT_SHOPIFY_INTEGRATION_PLAN.md).

---

## How we split the work

| Yours (Shopify admin / decisions) | Mine (code / plan) |
|---|---|
| Shopify Partner account + dev store | All code refactors |
| Custom App, Storefront token, OAuth credentials | Shopify GraphQL client |
| Product data entry, copy, images, prices | Adapters (Shopify → our types) |
| Subscription app choice (Recharge / Shopify Subs / later) | Cart context refactor |
| Vercel env vars | OAuth + session middleware |
| Real-money plan upgrade | Server Component migration where it pays off |

I prepare the code so each Shopify-side step has a single, well-marked
landing site on the frontend. Markers to grep:

- `[shopify-ready]` — drop-in replacement for an API query / mutation
- `[future-integration]` — deferred decisions (subscriptions, invoices)
- `[derived]` — values computed from existing data on real integration

---

## Sprint plan

### Sprint 0 — Shopify setup (your work, ~1 day)

Before any code can run against Shopify.

- [ ] Shopify Partner account created (free)
- [ ] Development store created
- [ ] Custom App in the store admin
  - Generate **Storefront API access token**
- [ ] (Optional now, required for Sprint 3) Customer Account API app registered in Partners
- [ ] At least 3 test products added in Shopify admin (any data — can be polished later)
- [ ] Shop domain noted (`<store>.myshopify.com`)

**Deliverable:** two strings handed off to me — `SHOPIFY_STORE_DOMAIN`
and `SHOPIFY_STOREFRONT_TOKEN`.

---

### Sprint 1 — Products + Collections (3–4 sessions)

Replaces mock products with real Shopify data. Sklep is still mock-cart
at the end of this sprint — checkout work is Sprint 2.

- [ ] Wire `lib/shopify/client.ts` (Storefront GraphQL fetch)
- [ ] `lib/shopify/queries.ts` — products / productByHandle / collection
- [ ] `lib/shopify/mappers.ts` — Shopify product → our `Product` type
- [ ] Replace `getProducts()` / `getProduct(handle)` /
  `getFeaturedProducts()` in `lib/mock/products.ts` with shopify calls
  (gradually — start by reading from Shopify when env vars are set,
  fall back to mock otherwise)
- [ ] Image domains live (already pre-allowed in `next.config.ts`)
- [ ] Verify PDP, listing, homepage shelf with real data

**Acceptance:** opening `/` and `/produkty` shows products from Shopify.
PDP route resolves real handles.

---

### Sprint 2 — Cart + Checkout (3–5 sessions)

Replaces the in-memory cart with a Shopify-backed cart, hands checkout
off to Shopify-hosted checkout page.

- [ ] Refactor `lib/cart/cart-context.tsx` to use `cartCreate` /
  `cartLinesAdd` / `cartLinesUpdate` / `cartLinesRemove`
- [ ] Persist `cartId` in HttpOnly cookie + read on mount
- [ ] Cart hydration on first visit
- [ ] Checkout CTA in `/koszyk` and drawer becomes a redirect to
  `cart.checkoutUrl`
- [ ] Cart line availability checks (handle out-of-stock cases)
- [ ] Error boundary tests (broken cart → recoverable UI)

**Acceptance:** Add-to-cart → drawer → /koszyk → "Przejdź do kasy"
lands on Shopify Checkout with the same line items. Order completes
in Shopify admin.

**At this point the shop is sellable. You can launch.**

---

### Sprint 3 — Customer Account API (4–6 sessions)

Brings the existing /account UI to life. Without this, customers log
in / view orders on Shopify's hosted account page; with this, they
stay on your storefront.

- [ ] Shopify Customer Account API app in Partners
- [ ] OAuth flow (authorize → callback → token exchange) via
  Next.js route handlers + middleware
- [ ] Server-side session: HttpOnly cookies + refresh-token handling
- [ ] Replace `isMockAuthenticated()` in `lib/account/auth.ts` with
  real session check
- [ ] Replace getters in `lib/mock/account.ts`:
  - `getCustomer()` → `customer { ... }` query
  - `getOrders()` → `customer.orders(first: 25, sortKey: PROCESSED_AT)`
  - `getOrder(idOrName)` → `order(id)` lookup
  - `getAddresses()` → `customer.addresses(first: 25)`
- [ ] Wire `notifyShopifyAction()` call sites:
  - "Edytuj" per field → `customerUpdate`
  - Address Edit / Delete / Set default → corresponding mutations
- [ ] Wire `notifyReorderAction()` → real `cartLinesAdd` from
  `order.items` (uses `variantId`, no name guessing)
- [ ] Replace `lib/account/auth.ts` mock with proper login/logout
  redirects (in `AccountAuthCard.handleLogin()` and
  `AccountSidebar.handleLogout()`)

**Acceptance:** Customer logs in via /account/login → lands on
dashboard with real orders, real addresses, real profile. Edits
persist in Shopify admin.

---

### Sprint 4 — Subscriptions (TBD, requires a business decision)

Cannot start until subscription app is chosen. Implementation depth
depends on the choice. UI is already wired — every action button on
`AccountSubscriptions` calls `notifySubscriptionAction(label)`,
ready to be redirected to the app's SDK / API.

- [ ] Choice: Recharge / Shopify Subscriptions / Customer Account
  Extension / Bold / Smartrr
- [ ] SDK / API setup
- [ ] Replace `notifySubscriptionAction(...)` call sites with real
  mutations (`subscriptionContractSkip`, `subscriptionContractPause`,
  `subscriptionContractUpdate`, `subscriptionContractCancel`)
- [ ] Real subscription history feed
- [ ] Cycle list pulled from app

**Acceptance:** A real subscriber can skip, pause, change cadence
from the UI.

---

## Maintenance rules during UI polish

These rules keep the codebase **integration-ready** while you continue
to polish the storefront. Breaking any of these makes Sprints 1–3
harder.

### 1. Components are props-driven

New sections receive their data via props. Never hardcode
customer-specific values in JSX.

```tsx
// 🛑 wrong
<h2>Cześć, Kuba.</h2>

// ✓ right
<h2>Cześć, {customer.firstName}.</h2>
```

### 2. Data flows through `lib/mock/*.ts` getters

If you need new data, add it to the mock + expose a getter. Don't
paste arrays into a component.

```tsx
// 🛑 wrong (in a component)
const REVIEWS = [{ name: "Anna", ... }, { name: "Marek", ... }];

// ✓ right
// in lib/mock/reviews.ts:
export function getReviews(): Review[] { return MOCK_REVIEWS; }
// in the component:
const reviews = getReviews();
```

### 3. Placeholder actions use the `notify*` helpers

Buttons that will become Shopify mutations call one of:

- `notifyShopifyAction(action)` — generic Customer Account action
- `notifyReorderAction()` — cart re-order
- `notifySubscriptionAction(action)` — subscription management

Never ship a button without `onClick` — it reads as broken in QA.

```tsx
// 🛑 wrong
<button>Zapisz</button>

// ✓ right
<button onClick={() => notifyShopifyAction("Zapisz")}>Zapisz</button>
```

### 4. Types live in `types/*.ts` with Shopify mapping in docstrings

When adding a new field, document its Shopify counterpart inline so
mapping is mechanical.

```ts
export interface Foo {
  /** Shopify `customer.acceptsMarketing` flattened from
   *  `emailMarketingConsent.marketingState === "SUBSCRIBED"`. */
  acceptsMarketing: boolean;
}
```

### 5. Optional fields render conditionally

If a value comes from a "may not always be present" Shopify field
(`tracking.url`, `invoiceUrl`, `statusUrl`, etc.), gate the JSX:

```tsx
{order.invoiceUrl && (
  <a href={order.invoiceUrl}>Faktura PDF</a>
)}
```

### 6. Loading + error states

Every route that fetches data has — or **will** have, post-integration
— a `loading.tsx` and `error.tsx`. When you add a new route, drop in:

```tsx
// app/<route>/loading.tsx
import { AuraLoading } from "@/components/feedback/AuraLoading";
export default function Loading() {
  return <AuraLoading message="…" />;
}
```

```tsx
// app/<route>/error.tsx
"use client";
import { AuraErrorScreen } from "@/components/feedback/AuraErrorScreen";
export default function ErrorPage({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AuraErrorScreen reset={reset} />;
}
```

---

## Outstanding decisions (yours)

1. **Subscriptions** — Recharge / Shopify Subscriptions / defer?
2. **Shopify plan** — Basic ($29/m) recommended for headless start
3. **Domain** — custom (e.g. `aura.coffee`) or `.myshopify.com` initially?
4. **Locale** — PLN/PL only, or multi-currency / multi-locale from day 1?
5. **Real product copy / photos** — ready or will we Shopify-admin
   them later?

Answer these whenever you're ready — they unblock Sprint 0.
