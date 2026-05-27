# Account panel — Shopify integration plan

Status: **UI complete, mock data, no auth, no Shopify wiring.**
Branch: `main` · Path: `/account` · Layout source:
`design-reference/claude-design-v2.1/account-panel/`

## Architectural commitments

1. **No own auth.** Shopify Customer Accounts owns login, password, 2FA,
   email management. We deep-link to Shopify's account UI for those.
2. **No own backend.** No database for customers/orders. Read-only views
   over Shopify Storefront / Customer Account API.
3. **No own checkout.** Re-order CTAs dispatch `cartLinesAdd` against
   the existing Shopify-ready cart and route to Shopify Checkout.
4. **Props-driven components.** Mock data is the **only** data the UI
   knows about. All UI reads go through `lib/mock/account.ts` getters
   (`getCustomer`, `getOrders`, `getOrder`, `getAddresses`,
   `getSubscription`). Swap those for async Customer Account API calls.

## Data that will come from Shopify

| UI surface | Shopify source |
|---|---|
| Customer name, email, phone, marketing prefs | `customer { firstName lastName email phone acceptsMarketing }` |
| Orders list | `customer.orders(first:25, sortKey: PROCESSED_AT)` |
| Order details | `order(id)` — `lineItems`, `shippingAddress`, `fulfillments`, `financialStatus`, `totalPrice` |
| Tracking | `order.fulfillments.trackingInfo { number, url, company }` |
| Saved addresses | `customer.addresses(first:25)`, `customer.defaultAddress.id` |
| Login / password / 2FA | Shopify Customer Account UI deep-link |
| Cart re-order | `cartLinesAdd` mutation |

## Mutations

| Action | Mutation |
|---|---|
| Edit profile field | `customerUpdate` |
| Toggle marketing consent | `customerUpdate { acceptsMarketing }` |
| Add address | `customerAddressCreate` |
| Update address | `customerAddressUpdate` |
| Remove address | `customerAddressDelete` |
| Set default address | `customerDefaultAddressUpdate` |

## Future integration (deferred)

| Feature | Owner | Notes |
|---|---|---|
| Subscriptions (pause / skip / cancel / change blend / cadence) | Shopify Subscriptions app **or** Customer Account Extension **or** Recharge | UI in `AccountSubscriptions.tsx` is placeholder-only. All action buttons have `[future-integration]` markers. Mock subscription lives in `lib/mock/account.ts`. |
| `invoiceUrl` (PDF invoices) | BaseLinker / Invoicing app | Order details surfaces an optional `invoiceUrl`. Mock has `"#"` placeholder. |
| Loyalty points / coffee club | TBD (Smile? own metafields?) | Dashboard quick-stats has "Punkty Aura" mock. |
| 2FA / password reset flows | Shopify Customer Accounts UI | We never render these — deep-link only. |
| `Ostatnie cykle` (subscription history) | Subscription app webhook → metafields | Hardcoded mock data on `AccountSubscriptions` cycles strip. |

## Auth states already wired (UI only)

The page uses `?state=loggedOut|loading|error` query param (debug-only)
to demonstrate the non-logged-in views. The `AccountAuthState` component
renders:

- **loggedOut** — login prompt with Shopify-account note + "Wróć do sklepu"
- **loading** — skeleton receipt card with `motion-safe:animate-pulse`
- **error** — error message with retry + back-to-shop CTAs

When wiring real auth:

1. Replace query-param toggle with a check: if Customer Account API
   returns 401, render `<AccountAuthState state="loggedOut" />`.
2. Show `<AccountAuthState state="loading" />` while initial fetch
   resolves (or use `<Suspense>`).
3. On fetch error, render `<AccountAuthState state="error"
   onRetry={refetch} />`.

## Integration order (recommended)

1. **Logged-out → Shopify login redirect.** Replace `onClick` of the
   "Zaloguj się" button in `AccountAuthState` with redirect to
   Shopify Customer Accounts login URL.
2. **Customer profile.** Wire `getCustomer()` to Customer Account API.
   Render the same `<AccountDetails customer={...}/>`.
3. **Orders list + details.** Wire `getOrders()` and `getOrder(id)`.
4. **Addresses.** Wire `getAddresses()` and mutation handlers.
5. **Subscriptions.** Pick a subscription app, wire mutation handlers
   for skip/pause/cancel/change.
6. **Optional:** consider splitting into Next.js route segments
   (`/account/orders/[name]`) once orders have shareable / bookmarkable
   URLs. Today they don't — single-page state-driven works fine.

## Files & components

| Path | Purpose |
|---|---|
| `app/account/page.tsx` | Top-level client component, section state machine, auth state switching |
| `app/account/layout.tsx` | Metadata only |
| `components/account/AccountShell.tsx` | Layout: sidebar (desktop) + main + mobile bar + mobile tab bar |
| `components/account/AccountSidebar.tsx` | Desktop 280px nav |
| `components/account/AccountMobileBar.tsx` | Top sticky bar on mobile |
| `components/account/AccountMobileTabBar.tsx` | Bottom sticky tab bar on mobile |
| `components/account/AccountIcons.tsx` | Account-only SVG icons (no deps) |
| `components/account/AccountStatusPill.tsx` | Status pill with dot |
| `components/account/AccountReceiptRow.tsx` | Label + value paragon row |
| `components/account/AccountMiniBag.tsx` | Coffee-bag thumb |
| `components/account/AccountEmptyState.tsx` | Reusable empty state |
| `components/account/AccountAuthState.tsx` | loggedOut / loading / error |
| `components/account/AccountDashboard.tsx` | Section: dashboard |
| `components/account/AccountOrders.tsx` | Section: orders list |
| `components/account/AccountOrderDetails.tsx` | Section: order details |
| `components/account/AccountSubscriptions.tsx` | Section: subscriptions (active + empty) |
| `components/account/AccountAddresses.tsx` | Section: addresses |
| `components/account/AccountDetails.tsx` | Section: profile + marketing consents |
| `lib/account/format.ts` | pl-PL date helpers |
| `lib/mock/account.ts` | Mock customer / orders / subscription / addresses + data-access seam |
| `types/account.ts` | TypeScript types Shopify-shaped |

## Markers to grep when wiring

- `[shopify-ready]` — drop-in points for Customer Account API queries / mutations
- `[future-integration]` — deferred (subscriptions, invoicing, loyalty)

## Constraints (do not change without discussion)

- No new dependencies
- No localStorage / cookies for customer data
- No custom auth flow (no email/password forms anywhere in `/account`)
- Cart context (`lib/cart/cart-context.tsx`) NOT modified by this panel
- Checkout placeholders remain disabled until Shopify Checkout is wired
