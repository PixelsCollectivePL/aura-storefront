# AURA — Engineering Handoff

> Custom headless Shopify storefront for **Aura Coffee Roasters** (Warsaw).
> Design source of truth: `Aura Design Canvas v2.html` in this project.
> Target stack: **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · Shopify Storefront API**.

This document is the implementation contract. It is exhaustive on purpose — paste it as context when starting work in Claude Code.

---

## 0. Tech stack & assumptions

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | RSC for shop pages, server actions for cart |
| Runtime | Node 20+ on Vercel | Hydrogen-compatible, edge-cache friendly |
| Styling | Tailwind v4 (CSS-first config) | Single-token surface, matches v2 design exactly |
| Commerce | Shopify Storefront API (GraphQL, 2024-10) | Headless, cart mutations, customer accounts |
| Cart | Shopify Cart API (cart objects) | Built-in optimistic mutations, no custom backend |
| Checkout | Hosted Shopify Checkout (not custom) | Out of scope per brief |
| Content | Mostly Shopify (products, metafields) + MDX for `/about` and `/help` | Avoid a heavy CMS until needed |
| Auth | Shopify Customer Account API | Later phase |
| Search | Shopify Storefront `predictiveSearch` | Free, no Algolia needed at this scale |
| Locales | EN + PL (PL is target market; EN as default UI for now per brief) | Translate in Phase 5 |
| Images | `next/image` + Shopify CDN | Already optimized by Shopify |
| Currency | PLN primary, EUR/GBP optional via Shopify Markets | |

### Non-goals (per brief)
- ❌ No custom checkout
- ❌ No custom admin panel
- ❌ No AI sommelier / quiz
- ❌ No subscriptions (handled by Shopify subscription apps later)
- ❌ No dark mode

---

## 1. Views inventory

All views ship at both mobile and desktop breakpoints (`<lg` = mobile, `≥lg` = desktop). Cart drawer is mobile-only as bottom sheet; on desktop it's a right-side panel. Mobile menu and search are overlays mobile-only — desktop uses inline nav and a top-sheet search.

### 1.1 Routes / pages

| # | Route | File | Mobile screen | Desktop screen |
|---|---|---|---|---|
| 1 | `/` | `app/(shop)/page.tsx` | M01 Homepage | D01 Homepage |
| 2 | `/shop` | `app/(shop)/shop/page.tsx` | M02 Listing | D02 Listing |
| 3 | `/shop/[handle]` | `app/(shop)/shop/[handle]/page.tsx` | M03 PDP | D03 PDP |
| 4 | `/about` | `app/(content)/about/page.tsx` | M08 About | D07 About |
| 5 | `/help` | `app/(content)/help/page.tsx` | M09 FAQ | D08 FAQ |
| 6 | `/help/[topic]` | nested | (filtered FAQ) | (sticky sidebar topic) |
| 7 | `/search?q=` | server search route | — | — |

### 1.2 Overlays / drawers / states (not routes)

| # | Component | Trigger | Mobile | Desktop |
|---|---|---|---|---|
| 8  | `<CartDrawer>` | bag icon, add-to-cart | M04 bottom sheet (84vh) | D04 right side panel (480px) |
| 9  | `<EmptyCart>` | inside `<CartDrawer>` when items=0 | M05 | (same component) |
| 10 | `<MobileMenu>` | menu icon | M06 fullscreen overlay | — (desktop uses inline nav) |
| 11 | `<SearchOverlay>` | search icon | M07 fullscreen overlay | D06 top sheet |
| 12 | `<MegaMenu>` | hover/click "Shop" in nav | — | D05 dropdown under header |

### 1.3 Component states

Every interactive surface must implement these explicitly:

| State | Visual | Where |
|---|---|---|
| **Default** | hairline border, ink-900 text | base |
| **Hover** (desktop) | border darkens to ink-900 in 120ms | buttons, chips, cards, links |
| **Active / Pressed** | translate(0,1px) optional, or background fill | buttons, chips |
| **Selected** | ink-900 background + bg-inverse text (chips) OR inset 1px ink ring (tiles) | chips, variant tiles |
| **Disabled** | line-2 background + mute text + diagonal hairline (variant tiles) | sold-out variants |
| **Focus-visible** | 2px ink-900 outline, 2px offset | keyboard nav, ADA |
| **Loading** | skeleton (`bg-soft` animate-pulse) | product cards, PDP gallery |
| **Error** | inline 12px message under field | forms |
| **Empty** | typographic empty state (no illustration) | cart, search, listing |

---

## 2. Component architecture

Folder layout under `components/`. Each component listed below maps to a file. Names are prefixed-free (e.g. `Button`, not `AuButton`) since they live in their own namespace.

```
components/
├── layout/
│   ├── Layout.tsx              # root layout: announcement bar + Header + main + Footer
│   ├── Header.tsx              # desktop: full nav + utilities; mobile: top bar + bag/menu
│   ├── AnnouncementBar.tsx     # ink-inverted, slim, top of header
│   ├── MobileMenu.tsx          # M06 overlay
│   ├── MegaMenu.tsx            # D05 dropdown
│   ├── Footer.tsx              # 4-col desktop + newsletter / slim mobile
│   └── Section.tsx             # canonical section wrapper w/ padding tokens
├── product/
│   ├── ProductCard.tsx         # used on home, listing, search, cross-sell
│   ├── ProductGrid.tsx         # responsive grid (2/3/4 col)
│   ├── ProductFilters.tsx      # chips + more-filters drawer
│   ├── ProductSort.tsx         # sort dropdown
│   ├── ProductDetail.tsx       # PDP layout container (2-col on desktop)
│   ├── ProductGallery.tsx      # thumb rail (desktop) / dot pager (mobile)
│   ├── VariantSelector.tsx     # generic, used for grind chips + size tiles
│   ├── QuantitySelector.tsx    # +/− stepper
│   ├── StickyAddToCart.tsx     # mobile-only floating bottom bar
│   ├── PriceLine.tsx           # price + unit + stock pill
│   └── BlendComparison.tsx     # table component
├── cart/
│   ├── CartDrawer.tsx          # responsive: bottom sheet < lg, right panel ≥ lg
│   ├── CartLine.tsx            # single item row
│   ├── CartSummary.tsx         # subtotal + shipping + total
│   ├── ShippingProgress.tsx    # free-shipping progress bar
│   ├── CartToast.tsx           # "added X · Undo"
│   ├── EmptyCart.tsx           # typographic empty state
│   └── CrossSell.tsx           # appears when threshold met
├── search/
│   ├── SearchOverlay.tsx       # responsive
│   ├── SearchInput.tsx         # large styled input
│   ├── SearchSuggestions.tsx   # match-highlighted product rows + query suggestions
│   └── SearchHighlight.tsx     # <mark> wrapper for matched terms
├── content/
│   ├── PageHero.tsx            # editorial 50/50 hero (about, help)
│   ├── Stats.tsx               # 2x2 / 4x1 numeric grid
│   ├── PeopleGrid.tsx          # team portraits
│   ├── Accordion.tsx           # +/- glyph FAQ
│   ├── AccordionItem.tsx       # single Q/A
│   ├── HowItWorks.tsx          # numbered 3-step block
│   ├── PullQuote.tsx           # large quote w/ attribution
│   └── ReviewsTriplet.tsx      # 3-col reviews block
├── ui/
│   ├── Button.tsx              # primary, secondary, ghost, sm/lg variants
│   ├── IconButton.tsx          # 36/40/44 square reset
│   ├── Chip.tsx                # filter chip + variant chip
│   ├── Tile.tsx                # variant tile (size, brew method)
│   ├── Input.tsx
│   ├── Eyebrow.tsx             # 11px tracked uppercase label
│   ├── Display.tsx              # h1/h2/h3 type primitives w/ correct tracking
│   ├── Notes.tsx               # tasting notes inline list (dot-separated)
│   ├── StockPill.tsx           # dot + "In stock · 24 left"
│   ├── TrustRow.tsx            # 3/4-col hairline-bordered fact strip
│   ├── Badge.tsx               # "Sold out", "New", "Lot 04"
│   ├── HairlineRule.tsx        # 1px line
│   ├── Skeleton.tsx            # loading placeholder
│   └── Icon.tsx                # central SVG icon set (see icon list below)
└── icons/
    └── index.ts                # menu, close, bag, search, back, arrow, plus, minus,
                                # check, chev, chevR, filter, account, heart
```

### 2.1 Component contracts (selected)

**`<ProductCard>`** — used on home featured, listing, cross-sell, search results.
```ts
type Mode = "mobile" | "desktop";
interface ProductCardProps {
  product: Product;        // see types/shopify.ts
  mode?: Mode;             // controls image height + type scale
  showQuickAdd?: boolean;  // overlay button (desktop hover state)
  priority?: boolean;      // pass to next/image
}
```
Default mode is derived from breakpoint (`useMediaQuery`) — pass explicit `mode` only when locked (e.g. in cross-sell row which is always desktop-laid).

**`<VariantSelector>`** — generic. Renders either chip row or tile grid based on `display`.
```ts
interface VariantSelectorProps {
  label: string;                 // "Grind", "Size"
  index?: string;                // "01", "02" — shown in eyebrow
  options: VariantOption[];
  value: string;
  onChange: (v: string) => void;
  display: "chip" | "tile";      // chip = wrap row, tile = 3-col grid
  helperText?: string;           // microcopy below
}
```

**`<CartDrawer>`** — single component, responsive transition.
- `<lg`: slides up from bottom, `transform: translateY(100% → 0)` 280ms.
- `≥lg`: slides in from right, `transform: translateX(100% → 0)` 240ms.
- Headless UI `<Dialog>` underneath; portal at `<body>`.
- Backdrop: `rgba(0,0,0,0.32)` 200ms fade.
- `useCart()` hook from Shopify cart context.

**`<StickyAddToCart>`** — mobile only, conditionally rendered.
- Visible only when PDP image gallery has scrolled past viewport top.
- `position: fixed; bottom: 0; inset-inline: 0; padding-block-end: env(safe-area-inset-bottom)`.
- Same data as inline add-to-cart in PDP — share state via context.

**`<BlendComparison>`** — pure presentation, takes 2–4 products and a row schema.
```ts
interface BlendComparisonProps {
  products: Product[];
  rows: { key: string; label: string; render: (p: Product) => ReactNode }[];
}
```

---

## 3. Design tokens

All tokens are already authored in `aura-mono-tokens.css`. The Tailwind config below mirrors them so you can use `text-ink-hi`, `bg-cream-soft` etc. throughout the codebase.

### 3.1 Colors

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| `--m-bg` | `#FFFFFF` | `bg-white` / `bg-bg` | page background |
| `--m-bg-soft` | `#FAFAFA` | `bg-bg-soft` | section bg, image placeholder |
| `--m-bg-soft-2` | `#F4F4F4` | `bg-bg-soft-2` | card hover, side panel |
| `--m-line` | `#E8E8E8` | `border-line` | hairline divider |
| `--m-line-2` | `#D6D6D6` | `border-line-2` | chip border |
| `--m-mute` | `#9A9A9A` | `text-mute` | tertiary meta |
| `--m-mute-2` | `#6E6E6E` | `text-mute-2` | secondary text |
| `--m-ink` | `#1A1A1A` | `text-ink` | body |
| `--m-ink-hi` | `#0A0A0A` | `text-ink-hi`, `bg-ink-hi` | headlines, buttons |
| `--m-ok` | `#2F7A4A` | `text-ok` | stock dot, "free" status |

> **Rule:** there are no other colors in the system. No accents, no brand red, no warning yellow. Anything that needs differentiation does so by weight, size or hairline — never color.

### 3.2 Typography

Single typeface: **Geist Sans** (Google Fonts). Tabular numerals enabled globally via `font-feature-settings: "ss01", "cv11"`.

```ts
// tailwind theme.fontSize
fontSize: {
  // Mobile-first; desktop scales handled by clamp() or responsive variants.
  "eyebrow":     ["11px",  { lineHeight: "1",    letterSpacing: "0.12em", fontWeight: 500 }],
  "meta":        ["11.5px",{ lineHeight: "1.4",  letterSpacing: "0",      fontWeight: 400 }],
  "body-sm":     ["12.5px",{ lineHeight: "1.5" }],
  "body":        ["14px",  { lineHeight: "1.55" }],
  "body-lg":     ["15.5px",{ lineHeight: "1.6"  }],
  "h3":          ["17px",  { lineHeight: "1.2",  letterSpacing: "-0.014em", fontWeight: 500 }],
  "h2":          ["28px",  { lineHeight: "1.1",  letterSpacing: "-0.022em", fontWeight: 500 }],
  "h2-lg":       ["44px",  { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: 500 }],
  "h1":          ["48px",  { lineHeight: "1.05", letterSpacing: "-0.028em", fontWeight: 500 }],
  "h1-lg":       ["72px",  { lineHeight: "0.98", letterSpacing: "-0.03em",  fontWeight: 500 }],
  "display":     ["56px",  { lineHeight: "0.96", letterSpacing: "-0.035em", fontWeight: 500 }],
  "display-lg":  ["96px",  { lineHeight: "0.94", letterSpacing: "-0.035em", fontWeight: 500 }],
}
```

Responsive type pattern: pair mobile and desktop. Example:
```tsx
<h1 className="text-display lg:text-display-lg">Coffee, made small on purpose.</h1>
```

Eyebrow labels are always uppercase, tracked 0.12em, 11px, ink-mute-2.

### 3.3 Spacing

4-base scale. Use Tailwind defaults `1` (4px) through `32` (128px). Memorize these key values:

| Use | Mobile | Desktop |
|---|---|---|
| Page horizontal padding | `px-5` (20) | `px-14` (56) — `px-20` (80) for hero text columns |
| Section vertical rhythm | `py-16` (64) – `py-20` (80) | `py-24` (96) – `py-32` (128) |
| Inside cards | `p-4` (16) – `p-5` (20) | `p-6` (24) – `p-7` (28) |
| Heading → next block | `mb-4` (16) | `mb-6` (24) |
| Eyebrow → headline | `mb-3` (12) – `mb-4` (16) | same |
| Grid row gap | `gap-y-9` (36) mobile, `gap-y-15` (60) desktop | |
| Grid column gap | `gap-x-3` (12) mobile, `gap-x-8` (32) desktop | |

### 3.4 Radii

```ts
borderRadius: {
  DEFAULT: "0",           // EVERYTHING is squared by default
  xs: "2px",              // (rare) tiny chips, inline pills
  sm: "4px",              // (only) input focus state inner ring
  pill: "9999px",         // filter & variant chips only
}
```

> The brand is squared. Use `pill` only for chips. Buttons are 0 radius. Cards are 0 radius. Image masks are 0 radius. Don't reach for `rounded-lg` or `rounded-md` — they don't exist in the system.

### 3.5 Borders

```ts
borderWidth: {
  DEFAULT: "1px",
  hairline: "1px",
}
```
- Hairlines are `border-line` (`#E8E8E8`).
- Active / focus states use `border-ink-hi`.
- Variant tile selected state uses `box-shadow: inset 0 0 0 1px var(--ink-hi)` (NOT border width change) to avoid layout shift.

### 3.6 Shadows

```ts
boxShadow: {
  drawer: "0 -16px 50px rgba(0,0,0,0.20)",        // mobile cart drawer
  panel:  "-16px 0 50px rgba(0,0,0,0.15)",        // desktop side panel
  popover: "0 12px 32px rgba(0,0,0,0.10)",
}
```
> No `shadow-sm` / `shadow-md` ambient shadows on cards. The brand is flat. Shadows only appear on temporary surfaces (drawer, popover, toast).

### 3.7 Breakpoints

```ts
screens: {
  sm:  "480px",   // large mobile
  md:  "768px",   // tablet
  lg:  "1024px",  // desktop transition point
  xl:  "1280px",
  "2xl": "1440px", // design width
}
```

Design canvas authored at:
- Mobile: **390px** (iPhone safe area)
- Desktop: **1440px**

Tablet (768–1023) is a transition zone. See §4 for per-component behavior.

### 3.8 Interactive state matrix

```css
/* Apply to all interactive elements globally */
*:focus { outline: none; }
*:focus-visible {
  outline: 2px solid var(--m-ink-hi);
  outline-offset: 2px;
}
```

| Element | Default | Hover | Active | Selected | Disabled | Focus-visible |
|---|---|---|---|---|---|---|
| Primary button | bg-ink-hi text-white | bg-black | translate-y-px | — | bg-line-2 text-bg | 2px ink outline |
| Secondary button | white border-ink-hi | bg-ink-hi text-white | translate-y-px | — | mute | 2px ink outline |
| Ghost button | white border-line | border-mute | translate-y-px | — | mute | 2px ink outline |
| Filter chip | border-line-2 | border-ink-hi | — | bg-ink-hi text-white | mute, line bg | 2px ink outline |
| Variant tile | border-line | border-mute | — | inset-ring ink-hi | diagonal-slash, mute, bg-soft | 2px ink outline |
| Card | flat | border darkens | — | — | — | 2px ink outline (full card) |
| Link | underline-none | underline 1px offset 4 | — | — | mute, no underline | 2px ink outline |

---

## 4. Responsive behavior

### 4.1 Layout grid

| Breakpoint | Container max-width | Horizontal padding | Section py |
|---|---|---|---|
| `<sm` (mobile portrait) | full | 20px | 64–80 |
| `sm` (480–767) | full | 24px | 72–80 |
| `md` (768–1023) | 720px | 32px | 80–96 |
| `lg` (1024–1279) | 1024px | 48px | 96–112 |
| `xl` (1280–1439) | 1280px | 56px | 112–128 |
| `2xl` (≥1440) | 1440px | 56px | 128 |

### 4.2 Per-view responsive notes

**Homepage**
- Hero: stacks vertical at `<lg` (text top, image below), splits 50/50 from `lg+`.
- Featured shelf grid: 2-col mobile → 2-col `md` (larger cards) → 3-col `lg+`.
- Compare table: horizontal scroll on `<md` with sticky first column. Full table from `md+`.
- Promise (black panel): stacks at `<md`, splits at `md+`.
- How it works: 1-col `<sm`, 2-col `sm`, 3-col `md+`.
- Reviews: 1-col `<sm`, 2-col `sm/md`, 3-col `lg+`.

**Listing**
- Filter chips: horizontal scroll `<lg`, wrap `lg+`.
- Filter & sort: bottom-sheet drawer `<lg`, inline popover `lg+`.
- Grid: 2-col `<lg`, 3-col `lg+`, 4-col `2xl`.
- Quick add on cards: hover-only `lg+`, hidden mobile (use whole-card tap).

**PDP**
- Image gallery: dot pager `<lg`, thumb rail (vertical, left of main) `lg+`.
- Title block + variants: full width `<lg`, right column `lg+`.
- Sticky add-to-cart bar: `<lg` only. Inline button on `lg+`.
- Spec table + brewing cards: 1-col `<lg`, 2-col `lg+` (spec wider).

**Cart**
- `<lg`: bottom sheet, 84vh, drag-handle, slides up.
- `lg+`: right side panel, 480px wide, slides from right. Cross-sell row appears.

**About**
- Hero stacks `<lg`, 50/50 split `lg+`.
- Stats: 2×2 `<lg`, 4×1 `lg+`.
- People: 1-col `<sm`, 2-col `sm+`.

**Help (FAQ)**
- Topic nav: horizontal scroll chips `<lg`, sticky sidebar `lg+`.
- Accordions: full width both, but inner content max-w-prose `lg+`.

**Mobile menu**: not shown on `lg+` (use inline nav).
**Mega menu**: not shown on `<lg` (use mobile menu instead).
**Search**: bottom sheet mobile, top sheet desktop.

---

## 5. UX notes — interactions

### 5.1 Quick add (listing, desktop)
- Show only on `lg+` and only on card hover.
- Position: bottom of image, full-width inside card with 12px inset.
- Clicking opens a tiny popover at the card with grind + size chips. Add to cart → toast confirmation + cart count animates.
- Single-variant products skip the popover and add directly.

### 5.2 Sticky add-to-cart (PDP, mobile)
- Visible from `scrollY > galleryHeight - 56`.
- Hides while keyboard is open (CSS `:has(:focus)` on inputs above).
- Tap → adds with currently selected variants → bar morphs to "Added ✓ View basket" for 1.4s → reverts.
- Cart count badge pulses once (scale 1 → 1.15 → 1, 220ms).

### 5.3 Cart feedback
After any add-to-cart, regardless of source:
1. Optimistic update to cart context (instant).
2. Server action call to Shopify `cartLinesAdd`.
3. Toast slides in at top of `<CartDrawer>` with "Added · NAME · variant" and an Undo link (4s).
4. On success: cart count badge updates if not already.
5. On failure: toast becomes "Couldn't add — please retry" (background unchanged).

The drawer does NOT auto-open on add — user opens it explicitly. The toast is enough feedback. Exception: first-ever add in a session triggers a one-time drawer open.

### 5.4 Free shipping progress
- Render `<ShippingProgress current={subtotal} threshold={150_00}>` (values in minor units to avoid float issues).
- 2px height bar, fills ink-hi L→R with 240ms ease.
- Text above: `<= 0`: "Free shipping unlocked"; `> 0`: "Add X zł for free shipping" with numerical x value bolded.
- When threshold crosses, animate the fill, then swap the text after the animation completes.

### 5.5 Selected / disabled states
- Variant chip selected: full ink-hi background, white text. **No checkmark icon** — colour change is enough.
- Variant tile selected: inset ring 1px ink-hi (no border width change → no layout shift).
- Variant disabled (sold out): bg-soft + diagonal hairline (top-right to bottom-left) drawn via gradient. Cursor `not-allowed`. Tooltip `Sold out` on hover.
- Quantity stepper: minus disabled (mute) when qty=1. Plus disabled when qty = product.availableForSale max.

### 5.6 Search suggestions
- Debounce 120ms.
- Hit `predictiveSearch` on every keystroke after 2 chars.
- Render three columns desktop / stacked mobile:
  - Left: query suggestions (string array, click → fills input + submits).
  - Right: product results (max 4) with matched-term highlight.
- Highlight: wrap matched substring in `<mark class="bg-ink-hi text-white px-0.5">`.
- Esc closes overlay. Enter submits to `/search?q=`.

### 5.7 Mobile filters
- Filter chip row at top of listing scrolls horizontally with `overscroll-behavior-x: contain`.
- "More filters" chip with count opens bottom sheet drawer.
- Bottom sheet sections: roast level, brew method, origin, decaf toggle.
- Apply + Reset buttons at bottom; Apply closes sheet and updates URL.
- Sort opens as a smaller popover (not sheet) with radio options.

### 5.8 Other micro-interactions
- **Card hover (desktop):** border darkens to mute over 120ms; no transform, no shadow.
- **Image gallery (PDP mobile):** swipe between images, dot pager updates with width transition (small → wide).
- **Mega menu:** opens on hover desktop, 80ms delay before close to forgive cursor pathing.
- **Accordion (FAQ):** plus glyph rotates to minus via opacity swap of the vertical bar (no rotation transform — too playful for this brand).

---

## 6. Implementation notes

### 6.1 Project structure

```
.
├── app/
│   ├── layout.tsx                  # root layout w/ <Header>, <Footer>, <CartProvider>
│   ├── globals.css                 # imports tokens + base resets
│   ├── (shop)/
│   │   ├── page.tsx                # /
│   │   ├── shop/
│   │   │   ├── page.tsx            # /shop  (listing)
│   │   │   └── [handle]/page.tsx   # /shop/[handle] (PDP)
│   │   ├── search/page.tsx         # /search?q=
│   │   └── actions/
│   │       ├── cart.ts             # server actions: addLine, updateQty, removeLine
│   │       └── search.ts
│   ├── (content)/
│   │   ├── about/page.tsx          # MDX-backed
│   │   └── help/[[...topic]]/page.tsx
│   └── api/
│       └── revalidate/route.ts     # Shopify webhook → revalidate tags
├── components/...                  # see §2
├── lib/
│   ├── shopify/
│   │   ├── client.ts               # GraphQL fetcher (with revalidate tags)
│   │   ├── queries/
│   │   │   ├── product.ts
│   │   │   ├── collection.ts
│   │   │   ├── cart.ts
│   │   │   └── search.ts
│   │   ├── mutations/
│   │   │   └── cart.ts
│   │   └── normalize.ts            # Shopify → app types
│   ├── cart/
│   │   ├── context.tsx             # CartProvider + useCart()
│   │   └── storage.ts              # cartId in cookie
│   ├── seo/
│   │   └── meta.ts                 # generateMetadata helpers
│   └── utils.ts
├── types/
│   ├── shopify.ts
│   └── ui.ts
├── content/
│   ├── about.mdx
│   └── help/
│       ├── shipping.mdx
│       ├── returns.mdx
│       ├── freshness.mdx
│       └── payments.mdx
├── public/                         # static assets only (favicon, og image)
├── tailwind.config.ts              # see tokens file
└── HANDOFF.md                      # this file
```

### 6.2 Mapping data to components — Shopify-backed

| UI field | Source | Notes |
|---|---|---|
| Product name | `product.title` (renamed to ONE/TWO/THREE via metafield `aura.shortName`) | Shopify title can stay "Aura ONE — Ethiopia Yirgacheffe"; UI shows short name from metafield |
| Origin | metafield `aura.origin` | "Ethiopia · Yirgacheffe" |
| Tasting notes | metafield `aura.notes` (list of strings) | rendered by `<Notes>` |
| Lot code | metafield `aura.lotCode` | "001" |
| Roast date | metafield `aura.roastedAt` (date) | drives "11 days ago" calc |
| Roast level | metafield `aura.roastLevel` (single line) | "Light · developed for filter" |
| Process / altitude / varietal / producer | metafields `aura.process` etc. | spec table on PDP |
| Brewing recipes | metafield `aura.brewing` (JSON list) | `[{method:"V60", recipe:"15g · 250g · 92°C · 2:45"}, …]` |
| Recommended brew | metafield `aura.recommendedBrew` | shown above variants |
| Price | `variant.price.amount` + `currencyCode` | always formatted as `X zł` (no decimals if whole) |
| Variants — grind | option "Grind" | chip selector |
| Variants — size | option "Size" | tile selector |
| Stock | `variant.quantityAvailable` + `variant.availableForSale` | shows "24 left" if low (≤ 30), just "In stock" otherwise |
| Hero image | `product.images.edges[0]` | `next/image` with `priority` |
| Gallery | `product.images.edges[1..n]` | thumb rail |
| Related products | metafield `aura.relatedProducts` (product list ref) OR fallback to same collection | |
| Reviews | Phase 2 — external app (Judge.me or Stamped via metafields) | hardcode placeholder for Phase 1 |

### 6.3 What can stay static at Phase 1

These do **not** need to come from Shopify on first ship:

- Announcement bar copy
- About page content (MDX)
- Help / FAQ content (MDX, one file per topic)
- Brewing guides
- Hero copy on homepage
- Reviews (placeholder array in a TS file)
- Trust row copy (free shipping threshold etc.)
- Footer link tree (static)
- Producer map data (hardcoded — they change once a year)

Make these MDX or TS so editing is a code change, not a CMS dependency. We can move them to Shopify "Pages" or metaobjects in Phase 5 if the team needs CMS-style editing.

### 6.4 Placeholders before Shopify integration

Before any Shopify connection exists, ship with a `lib/mock/products.ts`:

```ts
export const MOCK_PRODUCTS: Product[] = [
  { handle: "one",   title: "ONE",   shortName: "ONE",   origin: "Ethiopia · Yirgacheffe", notes: ["cherry","jasmine","bergamot"], price: { amount: 84, currencyCode: "PLN" }, ... },
  // 6 total
];
```

Provide a single `getProducts()` / `getProduct(handle)` API in `lib/shopify/index.ts` that toggles between mock and live based on `process.env.SHOPIFY_STORE_DOMAIN`. This way components are built against the contract once and "switching to Shopify" is a one-env-var change.

### 6.5 Shopify Storefront queries needed (Phase 2)

**Read:**
- `product(handle:)` — PDP, plus all metafields listed in §6.2
- `products(first:, sortKey:, query:)` — listing with filters
- `collection(handle:)` — collection pages if used (Phase 2.5)
- `predictiveSearch(query:)` — search overlay
- `cart(id:)` — cart hydrate on load

**Mutate:**
- `cartCreate` (first add)
- `cartLinesAdd`
- `cartLinesUpdate` (qty change)
- `cartLinesRemove`
- `cartDiscountCodesUpdate` (later if promo codes exist)

Use `fetch` with `next: { tags: ['shopify-product:' + handle] }` and revalidate on webhook.

### 6.6 Forms

- Newsletter (footer): server action POST to Klaviyo (or Shopify Marketing if used). Inline success/error message.
- Contact (help page CTA): `mailto:hello@aura.coffee` — no form needed Phase 1.

### 6.7 Accessibility checklist

- All interactive elements: keyboard reachable, `:focus-visible` outline.
- Variant chips: `<button role="radio">` inside `role="radiogroup"`; `aria-checked`.
- Quantity stepper: `<input type="number" inputmode="numeric">` underneath, +/- buttons control value.
- Drawer: trap focus, `aria-modal="true"`, restore focus on close, Esc closes.
- Color contrast: all body text passes WCAG-AA on white (verified: ink-700 8.4:1, mute-2 5.8:1, mute 3.6:1 — limit mute to ≥14px or non-essential meta).
- Image alt text from Shopify (`image.altText`) with sensible fallback (`{productTitle} — view {n}`).
- `prefers-reduced-motion`: disable all non-essential transitions.

### 6.8 Performance

- All shop pages: RSC, fetched at request with `revalidate: 60`.
- PDP: `generateStaticParams` for known handles + ISR.
- Images: `next/image` for everything except inline icons. Shopify CDN handles transforms.
- Cart: client component only — does not affect page caching.
- Fonts: Geist self-hosted via `next/font/google` with `display: 'swap'`.
- Critical CSS: Tailwind tree-shakes; aim < 14kB of CSS on first paint.

### 6.9 Tailwind config (drop in as `tailwind.config.ts`)

See `tailwind.config.ts` in this project root — pre-configured with all tokens from §3.

### 6.10 Tokens as CSS custom properties

Keep `aura-mono-tokens.css` as your `globals.css` foundation. Tailwind values reference these vars (single source of truth). Example utility class auto-generation:

```css
/* tailwind.config + utilities in globals */
@layer utilities {
  .text-display { @apply font-medium tracking-[-0.035em] leading-[0.96] text-ink-hi; }
  .text-eyebrow { @apply text-[11px] font-medium tracking-[0.12em] uppercase text-mute-2; }
}
```

---

## 7. Phased rollout

### Phase 1 — Static frontend (no Shopify) · ~1 week
**Goal:** Pixel-correct, fully interactive frontend with mock data. Reviewable URL.

- [ ] Next.js + Tailwind project bootstrapped with tokens from §3
- [ ] All 17 views built against `MOCK_PRODUCTS` in `lib/mock/`
- [ ] Component library (`components/ui/*`) complete with all states from §3.8
- [ ] Routing complete: `/`, `/shop`, `/shop/[handle]`, `/about`, `/help`, `/help/[topic]`, `/search`
- [ ] Mobile menu, search overlay, cart drawer, mega menu — fully functional UI (with mock data)
- [ ] Variant selection works (state only, not persisted)
- [ ] Sticky add-to-cart appears + button does optimistic UI to mock cart context
- [ ] Empty cart, loading skeletons, error states
- [ ] Keyboard accessibility + focus-visible everywhere
- [ ] Lighthouse mobile: ≥ 95 perf, 100 a11y
- [ ] Deploy preview on Vercel

**Out of scope:** Shopify, real checkout, animations beyond defaults, copy in Polish, SEO meta beyond basic.

### Phase 2 — Shopify data integration · ~1 week
**Goal:** Same frontend, real products + cart.

- [ ] Storefront API access token + env vars
- [ ] All metafields defined in Shopify admin (see §6.2 list); a brief Notion doc lists them for the team
- [ ] Replace `MOCK_PRODUCTS` with live Shopify queries (single feature flag in `lib/shopify/index.ts`)
- [ ] PDP variants come from Shopify options
- [ ] Stock counts wire to `variant.quantityAvailable`
- [ ] `predictiveSearch` powers the search overlay
- [ ] Filters: roast level, brew method, origin, decaf — bound to metafield filters via Shopify's `filters` parameter
- [ ] Sort options bound to `productSort` keys
- [ ] Image CDN: confirm Shopify CDN serves through `next/image` (set `next.config.ts > images.remotePatterns`)
- [ ] Webhook revalidation: Shopify → `/api/revalidate` clears product tags

### Phase 3 — Cart + checkout · ~3 days
**Goal:** Working transactions to Shopify-hosted checkout.

- [ ] `CartProvider` reads/writes Shopify `cart` object via cookie-stored cartId
- [ ] `cartLinesAdd` server action with optimistic UI + Undo (toast)
- [ ] Qty update and line remove
- [ ] Free shipping threshold pulled from Shopify Shipping settings (or hardcoded 150 zł + metaobject)
- [ ] Cross-sell logic in drawer (suggest 1 add-on when subtotal ≥ threshold)
- [ ] Checkout button → Shopify checkout URL (`cart.checkoutUrl`)
- [ ] On checkout-complete return: clear cartId cookie, show "Order received" lightweight page
- [ ] Error handling: API failure → toast with retry, never silent

### Phase 4 — Animations + micro-interactions · ~3 days
**Goal:** Make it feel hand-built.

- [ ] Framer Motion installed and budgeted to layout + presence transitions only
- [ ] Cart drawer slide in/out (mobile bottom, desktop right) — easing per §5
- [ ] Mega menu fade + 8px translateY on open
- [ ] Search overlay slide-down
- [ ] Hero image: scale 1.02 → 1.0 over 1.2s on mount (only on `/`)
- [ ] Add-to-cart success: button "Add to basket" → "Added ✓" for 1.4s
- [ ] Cart count badge pulse
- [ ] Free-shipping bar fill transition on threshold cross
- [ ] Variant tile selection: shadow ring fades 120ms
- [ ] Accordion open/close: height auto via Framer
- [ ] Image gallery: crossfade on thumbnail click (220ms)
- [ ] `prefers-reduced-motion` disables all of the above

### Phase 5 — Polish: PL copy + SEO + launch · ~3 days
**Goal:** Ready for traffic.

- [ ] All English UI strings extracted to `messages/en.json`
- [ ] `messages/pl.json` populated (translation, not auto)
- [ ] `next-intl` (or built-in i18n) wired; routes are unprefixed for PL (default) and `/en` for English
- [ ] Metadata: `generateMetadata` on every page with title, description, OG image
- [ ] OG images: dynamic via `next/og` for products (image + title + price)
- [ ] `sitemap.xml` route + `robots.txt`
- [ ] Structured data: `Product`, `Offer`, `Organization`, `BreadcrumbList`
- [ ] GA4 / Plausible analytics
- [ ] Cookie consent (Polish DPA compliant)
- [ ] 404 + 500 pages styled
- [ ] Performance budget check: LCP < 2s mobile, INP < 200ms
- [ ] Final QA on real devices (iPhone 13, Pixel 7, MacBook 13", iPad)

---

## Appendix A — Icon set

Only these icons exist in the system. Centralize in `components/icons/index.ts`. Stroke width 1.4px, square line-caps, 24px viewBox.

`menu · close · bag · search · back · arrow · plus · minus · check · chev · chevR · filter · account · heart`

Anything else → don't add an icon. Use type.

## Appendix B — Microcopy library

```ts
export const copy = {
  cart: {
    empty: "Nothing yet.",
    emptySub: "Your basket is waiting. Start with our most-loved single origin or the house blend.",
    addToBasket: "Add to basket",
    added: "Added",
    undo: "Undo",
    checkout: "Checkout",
    continueShopping: "Continue shopping",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
  },
  shipping: {
    threshold: 150_00, // minor units
    progressOk: "Free shipping unlocked.",
    progressLeft: (left: string) => `Add ${left} zł for free shipping`,
  },
  pdp: {
    grindLabel: "01 — Grind",
    grindHelper: "Tell us your brewer and we'll grind it the morning of dispatch.",
    sizeLabel: "02 — Size",
    inStock: (n?: number) => n != null ? `In stock · ${n} left` : "In stock",
    soldOut: "Sold out",
    similar: "If you like ONE",
    similarFallback: "You may also like",
  },
  search: {
    placeholder: "Search coffees, origins, brew methods…",
    noResults: "No coffees match that. Try a brew method or origin.",
    tryAlso: "Try also",
  },
  filters: {
    apply: "Apply",
    reset: "Reset",
    sortLabel: "Sort",
    sortOptions: ["Freshest first", "Price: low to high", "Price: high to low"],
  },
};
```

## Appendix C — Env vars

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
SHOPIFY_REVALIDATION_SECRET=...
NEXT_PUBLIC_SITE_URL=https://aura.coffee
KLAVIYO_API_KEY=... (Phase 5)
```

## Appendix D — Working with the design canvas

The design lives in `Aura Design Canvas v2.html`. When implementing a component:
1. Open the canvas in a browser.
2. Find the relevant artboard (mobile: M01–M09, desktop: D01–D08).
3. Inspect the rendered markup — class names start with `m-` and tokens use `--m-*` CSS variables that translate 1:1 to the Tailwind theme.
4. The JSX source files (`aura-mono-*.jsx`) are *reference implementations*, not production code. Re-author each component in TypeScript with proper props and Shopify data binding. Layout, spacing and class semantics should match.

---

**Questions, missing pieces, or contradictions in this doc → ask before implementing.** Better to flag than to invent.
