# Aura Storefront v2.1 — Handoff do Claude Code

> Dokument wdrożeniowy dla redesignu Aura Coffee Roasters.
> Branch: `redesign/aura-v2` · Stack docelowy: **Next.js 14 (App Router) · React 18 · TypeScript · Tailwind v3 · Shopify Storefront API**
> Status: design zaakceptowany, brak zmian wizualnych. Implementujemy 1:1 z pliku `Aura Storefront v2.1.html`.

---

## 0. Zakres

**Co wdrażamy:**
- Wszystkie widoki desktop + mobile z canvasu v2.1
- Komponenty zgodnie ze strukturą poniżej
- Design tokens jako Tailwind config + CSS variables
- Cart drawer, search overlay, mobile menu, sticky add-to-cart, free-shipping progress
- Mock data fixtures (Coração, Verde, Lila, Mezcla, Rio, Aurora)
- Wszystkie teksty PL, gotowe do wdrożenia

**Czego NIE wdrażamy:**
- Własny checkout (przekierowanie do Shopify `cart.checkoutUrl`)
- Backend / API routes ponad cache layer dla Storefront
- Logowanie / konto użytkownika
- Subskrypcja (UI ma istnieć jako CTA, ale flow w v3)
- Dark mode

**Faza 1 (ten branch):** wszystko na mock data, layout & UX 100%.
**Faza 2:** podłączenie Shopify Storefront API w miejscach oznaczonych `[shopify-ready]`.

---

## 1. Widoki

### Desktop (1440 × ?, hero/section pełnowymiarowe, content max-width 1280–1440)

| # | Route | Komponent strony | Status |
|---|---|---|---|
| 1 | `/` | `app/page.tsx` (`HomePage`) | Hero + featured + comparison + brand world + reviews + subscription CTA |
| 2 | `/produkty` | `app/produkty/page.tsx` (`ProductsPage`) | Listing z horyzontalnym filter-barem |
| 3 | `/produkty/[handle]` | `app/produkty/[handle]/page.tsx` (`ProductPage`) | PDP: galeria + warianty + sensoryka + story + similar |
| 4 | `/blendy` | `app/blendy/page.tsx` (`BlendsPage`) | Tabela porównawcza + picker „3 pytania → 1 blend" |
| 5 | `/o-marce` | `app/o-marce/page.tsx` (`AboutPage`) | Manifest + timeline + stats |
| 6 | `/palarnia` | `app/palarnia/page.tsx` (`RoasteryPage`) | Process 5-kroków + cupping invite |
| 7 | `/faq` | `app/faq/page.tsx` (`FaqPage`) | Tiles + sidebar topics + accordion |
| 8 | `/kontakt` | `app/kontakt/page.tsx` (`ContactPage`) | Kanały + formularz |
| – | global overlay | `<CartDrawer>` | Slide-in z prawej |
| – | global overlay | `<SearchOverlay>` | Dropdown pod headerem |

### Mobile (390 × ?)

Te same routes — komponenty layoutu odpalają mobile lub desktop wariant przez Tailwind breakpoints. Dodatkowo:

| # | Stan | Kiedy |
|---|---|---|
| 1 | Home (mobile) | breakpoint `< md` |
| 2 | Listing | breakpoint `< md` |
| 3 | PDP | + sticky bottom CTA |
| 4 | `<MobileMenu>` | `sheet: 'menu'` w stanie globalnym |
| 5 | `<SearchOverlay>` mobile | `sheet: 'search'` |
| 6 | `<CartDrawer>` mobile (full-sheet) | `sheet: 'cart'` |
| 7 | Empty cart state | gdy `cart.items.length === 0` |
| 8a | FAQ (compact tiles + accordion) | `< md` |
| 8b | Kontakt (compact form) | `< md` |

---

## 2. Struktura komponentów

```
src/
├── app/
│   ├── layout.tsx                 // <html lang="pl">, fonts, <Providers>
│   ├── page.tsx                   // Home
│   ├── produkty/
│   │   ├── page.tsx
│   │   └── [handle]/page.tsx
│   ├── blendy/page.tsx
│   ├── o-marce/page.tsx
│   ├── palarnia/page.tsx
│   ├── faq/page.tsx
│   ├── kontakt/page.tsx
│   └── api/
│       └── cart/route.ts          // [shopify-ready] cart mutations
├── components/
│   ├── layout/
│   │   ├── Header.tsx             // sticky on scroll, mega menu hover
│   │   ├── Footer.tsx
│   │   ├── Ticker.tsx             // marquee strip
│   │   ├── MobileMenu.tsx         // full-screen sheet
│   │   ├── TrustStrip.tsx
│   │   └── SectionHead.tsx
│   ├── product/
│   │   ├── ProductCard.tsx        // 2 warianty: compact (mobile) / standard (desktop)
│   │   ├── ProductGrid.tsx
│   │   ├── ProductGallery.tsx     // thumbnail strip + main, mobile swipe
│   │   ├── ProductDetail.tsx      // szczegóły, sensoryka, story
│   │   ├── VariantPills.tsx       // gramatura / forma
│   │   ├── QtyStepper.tsx
│   │   ├── QuickAdd.tsx           // bottom-right na karcie
│   │   ├── RoastBar.tsx           // 5-stopniowa skala
│   │   ├── BlendComparison.tsx    // tabela 4-kolumnowa
│   │   ├── BlendPicker.tsx        // 3 pytania → result card
│   │   └── ProductMeta.tsx        // origin/process/notes/methods
│   ├── cart/
│   │   ├── CartDrawer.tsx         // 460px desktop, full-width mobile
│   │   ├── CartLine.tsx
│   │   ├── CartTotals.tsx         // Suma częściowa / Dostawa / Razem
│   │   ├── FreeShippingProgress.tsx
│   │   ├── EmptyCart.tsx
│   │   ├── StickyAddToCart.tsx    // mobile-only
│   │   └── useCart.ts             // [shopify-ready] cart state hook
│   ├── search/
│   │   ├── SearchOverlay.tsx      // dropdown pod headerem
│   │   ├── SearchInput.tsx
│   │   └── SearchResults.tsx
│   ├── filter/
│   │   ├── FilterBar.tsx          // horizontal chips + sort
│   │   ├── FilterDropdown.tsx     // przycisk „Filtry" → popover
│   │   ├── FilterMobileDrawer.tsx // bottom sheet
│   │   ├── SortDropdown.tsx
│   │   └── ActiveFilters.tsx      // chipy nad gridem
│   ├── form/
│   │   ├── ContactForm.tsx
│   │   ├── Field.tsx              // input / textarea unified
│   │   └── ChipGroup.tsx          // radio jako chipy
│   ├── faq/
│   │   ├── FaqAccordion.tsx
│   │   └── FaqTiles.tsx
│   ├── home/
│   │   ├── Hero.tsx               // 2-col controlled
│   │   ├── FeaturedBlends.tsx
│   │   ├── BrandWorld.tsx
│   │   ├── Reviews.tsx
│   │   └── SubscriptionCTA.tsx
│   ├── brand/
│   │   ├── Starburst.tsx          // SVG burst component
│   │   ├── FigureRunner.tsx       // PLACEHOLDER → docelowo SVG z brandbook
│   │   ├── BurstBadge.tsx
│   │   ├── AuraMark.tsx           // wordmark
│   │   └── CoffeeBag.tsx          // fallback / loading state for packshot
│   └── ui/
│       ├── Button.tsx             // .btn / .btn-ink / .btn-ghost / .btn-sm
│       ├── Chip.tsx               // default / active / orange
│       ├── Eyebrow.tsx
│       ├── Divider.tsx
│       ├── Tile.tsx
│       ├── Stat.tsx
│       ├── Icon.tsx               // SVG icon set
│       └── PhotoPlaceholder.tsx   // striped bg + mono label (dev only)
├── lib/
│   ├── shopify/
│   │   ├── client.ts              // [shopify-ready] GraphQL client
│   │   ├── queries.ts             // [shopify-ready]
│   │   ├── mutations.ts           // [shopify-ready] cart mutations
│   │   └── types.ts               // [shopify-ready]
│   ├── data/
│   │   ├── products.ts            // mock data (faza 1)
│   │   ├── faq.ts
│   │   └── reviews.ts
│   ├── hooks/
│   │   ├── useCart.ts             // cart state (zustand / context)
│   │   ├── useSheet.ts            // global sheets (menu/search/cart)
│   │   ├── useScrollLock.ts
│   │   └── useDebounce.ts
│   └── utils/
│       ├── formatPrice.ts         // 64 → "64 zł", tabular-nums
│       ├── slugify.ts
│       └── cn.ts                  // clsx + tailwind-merge
├── styles/
│   └── globals.css                // @tailwind + custom @layer base
└── public/
    ├── brand/
    │   ├── illustrations/         // PRODUKCYJNE SVG z brandboardu
    │   ├── wordmark.svg
    │   └── packshots/             // bagi WebP 1200×1500
    ├── lifestyle/                 // foto 4:5 monochromatyczne
    └── og/                        // social cards
```

---

## 3. Design tokens

### 3.1 Kolory

```ts
// tailwind.config.ts → theme.extend.colors
{
  ink:    { DEFAULT: '#0E0E0C', 2: '#1B1A17' },
  paper:  { DEFAULT: '#FAF8F4', 2: '#F3F0E9' },
  line:   { DEFAULT: '#E6E2D8', strong: '#1B1A17' },
  brand:  { DEFAULT: '#FF4D17', deep: '#E03A04', soft: '#FFE3D2' }, // PRIMARY ORANGE
  accent: { green: '#2EA12E', purple: '#6F4FD4' },                  // tylko packshoty / chip blendu
  muted:  { DEFAULT: '#6E6A60', 2: '#99948A' },
}
```

**Zasady użycia pomarańczu (`brand.DEFAULT`):**
- CTA (primary button, „Dodaj", „Sprawdź", „Wyślij")
- Hover linków tekstowych
- Akcenty w nagłówkach (jedno słowo w H1, np. `<span>Palona</span>`)
- Eyebrow color (`color: theme(colors.brand.DEFAULT)`)
- Badge'y `Bestseller`, `Limited` — z pomarańczowym tłem
- Free-shipping progress bar
- Quick-add przycisk

**Stosunek pomarańczu do reszty: ≈10% powierzchni.** Nigdy jako background całej sekcji ponad 1× na stronę (wyjątek: subscription CTA).

**Zielony / fioletowy** — wyłącznie jako kolor akcentu **konkretnego blendu** (Verde Tropical = zielony, Lila Nocturna = fioletowy). Pole `accent_color` przychodzi z metafield produktu. Nigdy nie używać w globalnym UI.

### 3.2 Typografia

Fonts via `next/font/google`:

```ts
// src/app/layout.tsx
import { Archivo, DM_Sans, JetBrains_Mono } from 'next/font/google';

const archivo  = Archivo({       subsets: ['latin', 'latin-ext'], variable: '--font-display', weight: ['400','500','600','700','800','900'] });
const dmSans   = DM_Sans({       subsets: ['latin', 'latin-ext'], variable: '--font-text',    weight: ['400','500','600','700'] });
const mono     = JetBrains_Mono({subsets: ['latin'],              variable: '--font-mono',    weight: ['400','500','600'] });
```

```ts
// tailwind.config.ts → fontFamily
{
  display: ['var(--font-display)', 'Archivo', 'sans-serif'],
  text:    ['var(--font-text)',    '"DM Sans"', 'sans-serif'],
  mono:    ['var(--font-mono)',    '"JetBrains Mono"', 'monospace'],
}
```

**Skala typograficzna:**

| Token | Family | Weight | Size · LH · Tracking | Użycie |
|---|---|---|---|---|
| `text-display-xl`   | Archivo | 800 | `clamp(72px, 12vw, 160px)` · `0.9` · `-0.035em` | Hero H1 (about, blendy) |
| `text-display-l`    | Archivo | 800 | `clamp(56px, 9vw, 116px)`  · `0.92` · `-0.035em` | Home hero H1 |
| `text-display-m`    | Archivo | 800 | `clamp(40px, 6vw, 72px)`   · `0.95` · `-0.03em`  | Section H2 |
| `text-display-s`    | Archivo | 800 | `clamp(28px, 4vw, 48px)`   · `1.0`  · `-0.025em` | SectionHead H2 |
| `text-headline`     | Archivo | 800 | `28px` · `1.05` · `-0.02em` | ProductCard, PDP H3 |
| `text-body-l`       | DM Sans | 500 | `17–18px` · `1.5–1.55` | Hero sub, manifest |
| `text-body`         | DM Sans | 400 | `14px` · `1.55` | Default p |
| `text-body-sm`      | DM Sans | 400 | `13px` · `1.5`  | Card body, meta |
| `text-label`        | DM Sans | 600 | `13px` · `1.2` | Buttons, links, nav |
| `text-eyebrow`      | Mono    | 500 | `11px` · `1` · `+0.14em UPPER` | Eyebrows, section tags |
| `text-mono-sm`      | Mono    | 500 | `10px` · `1` · `+0.12em UPPER` | SKU, meta, badge'y |
| `text-num`          | inherit | inherit | + `font-variant-numeric: tabular-nums` | Ceny, ilości |

### 3.3 Spacing

Tailwind default scale (`0.25rem` step) jest OK. Dodatkowo:

```ts
// tailwind.config.ts → spacing
{
  // section paddings
  'section-y-sm': '64px',   // mobile section
  'section-y':    '100px',  // desktop section
  'section-y-lg': '120px',  // home hero spacing
  // container gutters
  'gutter-sm':    '20px',   // < md
  'gutter-md':    '32px',   // md
  'gutter-lg':    '64px',   // lg
  'gutter-xl':    '80px',   // xl
}
```

**Rytm wewnętrzny:**
- Grid produktów `gap-6` (24px) na desktop, `gap-3` (12px) na mobile
- Karty: `padding 18px` (compact) / `padding 24–32px` (standard)
- Form fields: `gap-y-4` (16px) między polami, `padding 14×16px` w inputach
- Section heads: `mb-7` (28px) odstępu od pierwszego elementu poniżej

### 3.4 Radius

```ts
borderRadius: {
  xs:   '4px',    // chipy, drobne tagi
  sm:   '8px',    // małe karty, tile, input
  md:   '14px',   // ProductCard, FreeShippingProgress, card
  lg:   '22px',   // hero illustration block, photo placeholder
  full: '9999px', // pills, buttons, chipy
}
```

### 3.5 Border

- Default: `1px solid theme(colors.line.DEFAULT)` — wszystkie podziały, karty
- Strong: `1px solid theme(colors.ink.DEFAULT)` — `border-b` na PDP, focus outline
- Active chip: `1.5px solid theme(colors.ink.DEFAULT)` (przy `bg-ink` text-white)
- Filter checkbox active: `1.5px solid theme(colors.brand.DEFAULT)`

### 3.6 Shadows

Bardzo oszczędne. Nie używać dramatic shadows.

```ts
boxShadow: {
  card:    '0 1px 2px rgba(14, 14, 12, 0.04)',                                  // karty domyślnie — opcjonalnie
  hover:   '0 6px 24px rgba(14, 14, 12, 0.08), 0 1px 2px rgba(14, 14, 12, 0.04)', // ProductCard hover
  drawer:  '-20px 0 60px rgba(14, 14, 12, 0.18)',                               // cart drawer (desktop)
  bag:     '0 18px 30px rgba(14, 14, 12, 0.18)',                                // CoffeeBag drop
  cup:     '0 12px 18px rgba(14, 14, 12, 0.18)',
  sticky:  '0 -8px 24px rgba(14, 14, 12, 0.08)',                                // mobile sticky bottom
  toast:   '0 8px 24px rgba(0, 0, 0, 0.20)',
}
```

### 3.7 Breakpoints

Tailwind default + `xl` = `1440px` (zamiast 1280) bo design pracuje na 1440.

```ts
screens: {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1440px',  // override
  '2xl': '1680px',
}
```

---

## 4. Responsywność

| Breakpoint | Container | Grid produktów | Hero H1 | Nav | Filtry listingu |
|---|---|---|---|---|---|
| `< sm` (390) | `px-5` (20px) | 2 col, `gap-3` | clamp 52px | burger + logo + cart | bottom-sheet drawer |
| `sm 640+`    | `px-6` (24px) | 2 col, `gap-4` | clamp ~64px | burger + logo + nav-lite | dropdown popover |
| `md 768+`    | `px-8` (32px) | 3 col, `gap-5` | clamp ~80px | burger + logo + nav-lite | dropdown popover |
| `lg 1024+`   | `px-16`(64px) | 3–4 col, `gap-6` | clamp 100px | pełny nav | horizontal chips inline |
| `xl 1440+`   | `px-20`(80px) | 4 col, `gap-7` | clamp 116px | pełny nav | horizontal chips inline |

**Reguły ogólne:**
- **Touch targets:** min `h-11` (44px). QtyStepper, chipy, CTA, nav items.
- **Sticky header:** od `md` włącznie, `bg-paper/95 backdrop-blur` przy scrollY > 80.
- **Sticky add-to-cart (PDP):** wyłącznie `< md`. Element jest siostrą scroll containera (nie nadrzędnym child) — flex-1 scroll redukuje się automatycznie o jego wysokość. Nigdy `position: fixed` nad treścią.
- **Images:** `next/image`, `srcset 1×/2×`, format AVIF z fallback WebP. `aspectRatio` fixed (np. `aspect-[4/5]`) żeby uniknąć CLS.
- **Container width:** brak global container — sekcje używają `mx-auto max-w-screen-xl` tam gdzie potrzeba, ale hero często bleeduje na full-width z internal padding.

---

## 5. UX notes

### 5.1 Listing bez sidebaru — horizontal filter bar

```
┌──────────────────────────────────────────────────────────────────┐
│  [Wszystko 14] [Espresso 6] [Filtrowe 5] ...  [Filtry ▾ ●2] | [Sortuj ▾]
├──────────────────────────────────────────────────────────────────┤
│  Aktywne:  [Średnie palenie ×]  [Brazylia ×]   ·  Wyczyść
├──────────────────────────────────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐
│  │card│ │card│ │card│ │card│   (4 col, gap-7)
│  └────┘ └────┘ └────┘ └────┘
```

- Chipy kategorii: prostokątne pill, `h-10`, single-select dla głównej kategorii (toggle behaviour gdy `default = Wszystko`).
- „Filtry ▾" otwiera **dropdown** (desktop) lub **bottom-sheet** (mobile) z:
  - Profil palenia (1–5)
  - Pochodzenie (multi-select)
  - Nuty (multi-select)
  - Cena (zakres)
- Aktywne filtry jako chipy nad gridem, z `×` do usunięcia.
- Sort default: `BEST_SELLING`. Opcje: `Polecane / Cena rosnąco / Cena malejąco / Najświeższe (po dacie palenia)`.

### 5.2 Cart drawer

- Desktop: `width: 460px`, slide-in z prawej, `transform: translateX(100%) → 0`, 280ms ease-out. Backdrop `bg-ink/55` fade 200ms.
- Mobile: full-width sheet, slide-in z prawej tak samo.
- Sticky **header** + **scrollable lines** (flex-1) + **sticky footer** z totals.
- Footer kolejność: `Suma częściowa → Dostawa (z kolorem brand jeśli ≥150 zł) → divider → Razem (bold 22px) → CTA „Przejdź do kasy" → microcopy „Bezpieczna płatność · Shopify Checkout"`.
- Quantity zmiana = optimistic update, debounced 250ms call do `cartLinesUpdate`.
- Klik w produkt zamyka drawer i nawiguje do PDP.

### 5.3 Mobile menu

- Full-screen sheet, `bg-ink`, color white.
- 6 pozycji: Produkty / Blendy / O marce / Palarnia / FAQ / Kontakt, font `display 32px/800`, divider `1px rgba(white, 0.1)`.
- Pierwszy item ma arrow w kolorze brand (active hint).
- Bottom: CTA primary „Sprawdź kawy" `h-13` (52px) + mini-locale switch `PL · EN · UA` (na razie tylko PL aktywne).

### 5.4 Sticky add-to-cart (mobile PDP)

- Element poza scroll containerem (sibling, nie child). `flex: 1` scroll redukuje się.
- Wysokość: `h-18` (72px), padding `12px 16px`.
- Skład: `QtyStepper (left)` + `Button block (right, fontSize 15, cena inline)`.
- Cena w `tabular-nums`.
- Po `Dodaj` → optimistic add + opening cart sheet + 400ms później toast „Dodano do koszyka".

### 5.5 Search overlay

- Desktop: dropdown pod headerem, `border-bottom 1px line`, padding 32px 80px 28px.
- Mobile: full-page replace.
- Input: `font-display 800 40px` (desktop) / `text-base` (mobile).
- 3 sekcje wyników: **Sugerowane chips → Produkty (z packshotem) → Popularne kategorie / Ostatnio szukane**.
- Debounce 250ms, min 2 znaki.
- `Esc` zamyka. Backdrop `bg-ink/40` (desktop) lub solid white (mobile).
- Auto-focus na otwarcie. Body scroll lock.

### 5.6 Empty cart

- Trigger: `cart.items.length === 0` przy otwartym cart sheet.
- Composition: Starburst (large, paper-2 color) z FigureRunner w środku → H2 „Koszyk śpi." → paragraf microcopy → primary CTA „Sprawdź kawy" → poniżej eyebrow „Może to?" + 2-col grid z 2 rekomendacjami.
- Mobile: jak wyżej, mniejsza siatka rekomendacji.

### 5.7 Free shipping progress

- Pasek w cart drawer i opcjonalnie na PDP („Dodaj do koszyka i zyskaj…").
- Threshold: 150 zł.
- Microcopy dynamiczne:
  - `subtotal < threshold`: „Dodaj jeszcze **{remaining} zł** i wysyłka gratis."
  - `subtotal ≥ threshold`: „**Masz darmową wysyłkę. Brawo.**"
- Pasek `h-1.5` (6px), tło `bg-white`, fill `bg-brand`, animacja width 600ms `cubic-bezier(.2,.7,.3,1)`.
- Confetti emoji `🎉` przy crossover (jednorazowo na sesję per cart).

### 5.8 Quick add na listingu

- Position absolute bottom-right karty produktu.
- Desktop: visible on `hover` karty (fade 150ms). Mobile: zawsze visible.
- Dodaje wariant **domyślny**: pierwszy variant (250g, ziarno).
- Po kliknięciu: orange ring 400ms wokół karty + toast bottom-center 320ms slide-up, auto-dismiss 3s.

---

## 6. Polskie teksty / microcopy

Centralizuj w `lib/copy.ts` żeby było jedno źródło.

```ts
// lib/copy.ts
export const COPY = {
  brand: {
    name: 'AURA',
    tagline: 'Pure Coffee Beans',
  },
  nav: {
    products: 'Produkty',
    blends: 'Blendy',
    about: 'O marce',
    roastery: 'Palarnia',
    faq: 'FAQ',
    contact: 'Kontakt',
  },
  cta: {
    addToCart: 'Dodaj do koszyka',
    addShort: 'Dodaj',
    checkBlends: 'Sprawdź kawy',
    compareBlends: 'Porównaj blendy',
    checkout: 'Przejdź do kasy',
    showMore: 'Pokaż więcej',
    seeAll: 'Zobacz wszystkie',
    subscribe: 'Zacznij subskrypcję',
    send: 'Wyślij',
  },
  hero: {
    eyebrow: 'Coffee club · drop 01 · 2026',
    h1Line1: 'Kawa z charakterem.',
    h1Line2Pre: '',
    h1Line2Accent: 'Palona',
    h1Line2Post: ' na świeżo.',
    sub: 'Specialty z polskiej palarni. Drop 01 zaczyna się od trzech blendów na każdy rytuał — espresso, filtr, wieczór.',
  },
  trust: {
    freeShippingFrom: 'Darmowa dostawa od 150 zł',
    freshThisWeek: 'Palona w tym tygodniu',
    fastShip: 'Wysyłka w 24h',
    returns: '14 dni na zwrot',
    securePayment: 'Bezpieczna płatność · Shopify Checkout',
  },
  cart: {
    title: 'Twój wybór',
    subtotal: 'Suma częściowa',
    shipping: 'Dostawa',
    total: 'Razem',
    shippingFree: 'Gratis',
    progressMsgRemaining: (zl: number) => `Dodaj jeszcze ${zl} zł i wysyłka gratis.`,
    progressMsgUnlocked: 'Masz darmową wysyłkę. Brawo.',
    empty: {
      title: 'Koszyk śpi.',
      body: 'Wrzuć paczkę kawy i obudź go. Mamy świeżo palone — gotowe do wysyłki.',
      suggest: 'Może to?',
    },
  },
  search: {
    placeholder: 'Szukaj kawy, metody, smaku…',
    cancel: 'Anuluj',
    suggested: 'Sugerowane',
    results: 'Produkty',
    recent: 'Ostatnio szukane',
    categories: 'Popularne kategorie',
    seeAllResults: 'Zobacz wszystkie wyniki',
  },
  filter: {
    title: 'Filtry',
    active: 'Aktywne',
    clear: 'Wyczyść',
    sort: 'Sortuj',
    sortOptions: ['Polecane', 'Cena rosnąco', 'Cena malejąco', 'Najświeższe'],
    categories: ['Wszystko', 'Espresso', 'Filtrowe', 'Decaf', 'Single origin', 'Blendy', 'Sprzęt'],
    roastLabels: ['Jasne', 'Średnie', 'Średnio-ciemne', 'Ciemne'],
  },
  pdp: {
    grammage: 'Gramatura',
    form: 'Forma',
    formOptions: ['Ziarno', 'Mielona — espresso', 'Mielona — filtr'],
    notes: 'Nuty smakowe',
    roastProfile: 'Profil palenia',
    methods: 'Pod jakie parzenie',
    origin: 'Pochodzenie',
    similar: 'Podobne blendy',
    roastedOn: (date: string) => `Palona ${date}`,
  },
  blends: {
    h1Line1: 'Wybierz pod',
    h1Line2: 'swój rytuał.',
    pickerTitle: 'Trzy pytania — jeden blend.',
    pickerResult: 'Twój blend',
    questions: [
      { q: '01 · Kiedy pijesz?', opts: ['Rano', 'Po obiedzie', 'Wieczorem'] },
      { q: '02 · Jak parzysz?', opts: ['Espresso', 'Filtr', 'French / Moka'] },
      { q: '03 · Z mlekiem?', opts: ['Tak, latte', 'Czarna', 'Mix'] },
    ],
  },
  roastery: {
    h1Line1: 'Palimy',
    h1Line2: 'w środy.',
    sub: 'Co tydzień. Małe wsady, ręczna kontrola każdej partii. Ziarno trafia do ciebie zanim ostygnie — i to nie metafora.',
    cuppingCta: 'Zapisz się na cupping',
  },
  contact: {
    h1: 'Pisz śmiało.',
    sub: 'Odpowiadamy w 24h, w dni robocze najczęściej szybciej.',
    formTitle: 'Napisz wiadomość',
    fields: { name: 'Imię', email: 'Mail', message: 'Wiadomość' },
    subjects: ['Zamówienie', 'B2B / hurt', 'Współpraca', 'Reklamacja', 'Inne'],
    rodo: 'RODO · dane tylko do odpowiedzi',
  },
  faq: {
    h1: 'Pomoc, dostawa, zwroty',
    tiles: [
      { t: 'Dostawa',  d: '24h · DPD i InPost · Free od 150 zł' },
      { t: 'Zwroty',   d: '14 dni bez powodu · za nasz koszt' },
      { t: 'Świeżość', d: 'Wszystko palone < 14 dni' },
      { t: 'B2B / HoReCa', d: 'Hurt, kontrakty, doradztwo' },
    ],
  },
  // Brand-voice copy fragmenty
  voice: {
    samples: [
      'Kawa z charakterem. Palona na świeżo.',
      'Wybierz blend pod swój rytuał.',
      'Ziarno, które robi robotę.',
      'Świeżo palona. Gotowa do wysyłki.',
    ],
  },
} as const;
```

**Zasady językowe:**
- Liczby zawsze ze spacją w tysiącach: `2 140 ocen`, `1 100 m n.p.m.` (`Intl.NumberFormat('pl-PL')`).
- Cena formatowana jako `64 zł` (bez decymali jeśli `Math.round(price) === price`, z dwoma jeśli ma grosze).
- Daty: `Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long' })` → `8 listopada`.
- Polskie cudzysłowy: `„ … "` (otwarcie/zamknięcie) — w komponencie `<Quote>` zrobić consistent.
- Bullet w mono UI: `·` (middot, `U+00B7`).
- Brak emoji w treści. Wyjątek: `🎉` przy unlocku free shipping (jednorazowo).

---

## 7. Animation ideas

| Element | Animacja | Tech |
|---|---|---|
| **Cart drawer** | Slide-in z prawej 280ms ease-out + backdrop fade 200ms | Framer Motion `<motion.div>` |
| **Cart icon** | Counter bump (scale 1 → 1.2 → 1) 240ms po dodaniu | CSS keyframes, JS trigger przez useEffect |
| **Quick add** | Karta — orange ring 400ms (`box-shadow 0 0 0 4px brand`); toast slide-up 320ms, auto-dismiss 3s | Framer Motion |
| **Burst rotation (hero)** | Wolna rotacja ~30s/turn, przyspieszenie do 8s on hover | CSS `animation: spin 30s linear infinite`, hover override |
| **Ticker marquee** | Liniowa pętla ~40s, pause on hover | CSS keyframes |
| **VariantPill active** | Background slide left→right 200ms + color shift | CSS transition `background-color` |
| **Free shipping progress** | Width grow 600ms `cubic-bezier(.2,.7,.3,1)`, confetti emoji bounce na crossover | Framer + jednorazowy `useState` |
| **Search overlay** | Fade + scale 0.98 → 1, 240ms; backdrop fade 200ms | Framer Motion `AnimatePresence` |
| **PDP gallery** | Crossfade 180ms, mobile swipe z momentum (`embla-carousel-react`) | Embla |
| **Sticky header on scroll** | `bg-paper → bg-paper/95 backdrop-blur` przy scrollY > 80, transition 200ms | Tailwind + IntersectionObserver |
| **Scroll-in section heads** | Fade-up 240ms na pojawienie się | Framer `useInView` |
| **Hover ProductCard** | `translateY(-2px)` + shadow-hover, transition 200ms | Tailwind utility |
| **Button press** | `translateY(1px)` na `:active` | CSS pseudo |
| **FAQ accordion** | Height 0 → auto z opacity, 200ms | `@radix-ui/react-accordion` |
| **Mobile menu open** | Slide-in z lewej 280ms, backdrop fade. Stagger items 30ms each | Framer Motion stagger |

**Reguły dostępności:**
- Wszystkie animacje muszą respektować `prefers-reduced-motion`. W `globals.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
  ```

---

## 8. Implementation notes dla Claude Code

### 8.1 Setup branch

```bash
git checkout main && git pull
git checkout -b redesign/aura-v2

# 1. Zainstaluj dodatkowe deps
pnpm add framer-motion clsx tailwind-merge embla-carousel-react @radix-ui/react-dialog @radix-ui/react-accordion zustand
pnpm add -D @types/react @tailwindcss/typography prettier-plugin-tailwindcss

# 2. Skopiuj tokens do tailwind.config.ts
# 3. Wyrzuć stary globals.css; zacznij od @tailwind base/components/utilities + @layer base z reset typography
# 4. Skopiuj fonty przez next/font (NIE link href)
```

### 8.2 Kolejność wdrożenia (PRs)

1. **PR #1 — design tokens + base styles**: tailwind config, fonts, globals.css, primitives (`<Button>`, `<Chip>`, `<Eyebrow>`, `<Icon>`, `<Starburst>`, `<AuraMark>`, `<CoffeeBag>` jako placeholder)
2. **PR #2 — layout shell**: `<Header>` (sticky on scroll, mega menu hover desktop), `<Footer>`, `<Ticker>`, `<TrustStrip>`, `<MobileMenu>`, `<SectionHead>`, layout.tsx z fontami
3. **PR #3 — Home**: Hero (controlled 2-col), FeaturedBlends, BlendComparison (preview), BrandWorld, Reviews, SubscriptionCTA, podpięte do mock data
4. **PR #4 — Products listing**: FilterBar (chips + dropdown + sort), ActiveFilters, ProductGrid, ProductCard (compact + standard), QuickAdd, mobile FilterDrawer
5. **PR #5 — PDP**: ProductGallery (desktop thumbnails + mobile swipe), VariantPills, QtyStepper, RoastBar, Trust strip, similar carousel, mobile StickyAddToCart
6. **PR #6 — Cart**: CartDrawer (desktop + mobile sheet), CartLine, CartTotals, FreeShippingProgress, EmptyCart, zustand store
7. **PR #7 — Search**: SearchOverlay (desktop dropdown + mobile full-screen), debounced filter na mock data
8. **PR #8 — Strony content**: /blendy (BlendComparison full + Picker), /o-marce, /palarnia, /faq, /kontakt (ContactForm walidacja, server action)
9. **PR #9 — Animacje + polish**: framer-motion na drawer/overlay/section reveals, hover states, focus rings, reduced-motion
10. **PR #10 — Shopify integration**: `lib/shopify/`, replace mock data z prawdziwymi queries, podpięcie cart mutations, predictive search

### 8.3 Konwencje kodu

- **TypeScript strict** — `strict: true`, brak `any`.
- **Component pattern:**
  ```tsx
  // Każdy komponent — named export, props interface, „use client" tylko gdzie potrzeba (interaktywne)
  interface ProductCardProps { product: Product; variant?: 'compact' | 'standard'; onQuickAdd?: () => void; }
  export function ProductCard({ product, variant = 'standard', onQuickAdd }: ProductCardProps) { … }
  ```
- **Server Components first.** Interactive (cart drawer, search overlay, filter, forms) — `'use client'`.
- **No global CSS poza** `globals.css`. Wszystko utility-first Tailwind. Jeśli potrzeba arbitrary value — używaj `[…]` syntax.
- **Class merging:** `cn(...)` z `tailwind-merge` + `clsx`.
- **Icons** — jeden plik `<Icon>` z wszystkimi SVG, render przez `<Icon name="cart" />`. Brak zewnętrznych ikon.
- **Image strategy** — `next/image` zawsze z `width`/`height` lub `fill`. Placeholder: `data:image/svg+xml,…` striped pattern jako temporary.

### 8.4 Mock data shape (faza 1)

```ts
// lib/data/products.ts
import type { Product } from '@/lib/shopify/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'gid://mock/product/1',
    handle: 'coracao-do-brasil',
    title: 'Coração do Brasil',
    description: 'Klasyk z karku Cerrado. Pełne ciało, kakaowa baza, długi finisz. Robi robotę w mleku i solo.',
    priceRange: { minVariantPrice: { amount: '64.00', currencyCode: 'PLN' } },
    images: [
      { url: '/packshots/coracao-front.png', altText: 'Coração do Brasil 250g', width: 1200, height: 1500 },
      // …
    ],
    variants: [
      { id: 'gid://mock/variant/1-250g-bean',  title: '250g · Ziarno',           price: '64.00', selectedOptions: [{ name: 'Gramatura', value: '250g' }, { name: 'Forma', value: 'Ziarno' }] },
      { id: 'gid://mock/variant/1-500g-bean',  title: '500g · Ziarno',           price: '118.00' },
      // …
    ],
    metafields: {
      origin: 'Brazylia · Cerrado',
      roast_level: 3,
      process: 'Natural',
      notes: ['Czekolada', 'Orzech', 'Karmel'],
      methods: ['Espresso', 'Moka', 'Aeropress'],
      accent_color: '#FF4D17',
      badge: 'Bestseller',
      roast_date: '2025-11-08',
      body: 4, acid: 2, sweet: 4,
    },
  },
  // … 5 more
];
```

**Mock dataset:** Coração do Brasil, Verde Tropical, Lila Nocturna, Mezcla Casa, Rio Decaf, Aurora.

### 8.5 State management

Zustand store:

```ts
// lib/hooks/useCart.ts
interface CartState {
  items: CartLine[];
  isOpen: boolean;
  add: (variantId: string, qty?: number) => void;
  remove: (lineId: string) => void;
  updateQty: (lineId: string, qty: number) => void;
  open: () => void;
  close: () => void;
  subtotal: () => number;
  count: () => number;
}
```

```ts
// lib/hooks/useSheet.ts — global UI sheets
interface SheetState {
  sheet: 'menu' | 'search' | 'cart' | null;
  open: (s: SheetState['sheet']) => void;
  close: () => void;
}
```

### 8.6 SEO / metadata

```tsx
// app/layout.tsx
export const metadata = {
  title: { default: 'AURA · Świeżo palona kawa specialty', template: '%s · AURA Coffee Roasters' },
  description: 'Specialty z polskiej palarni. Świeżo palona, wysyłka w 24h, darmowa dostawa od 150 zł.',
  metadataBase: new URL('https://auracoffee.pl'),
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'AURA Coffee Roasters',
    images: ['/og/default.png'],
  },
  twitter: { card: 'summary_large_image' },
};
```

Per-page metadata via export `metadata` lub `generateMetadata`. PDP używa `productByHandle` do dynamic OG.

### 8.7 Testy / quality gates

- **Lighthouse target:** ≥95 perf desktop, ≥90 mobile, ≥95 a11y wszędzie.
- **Critical path:** Home + PDP + Cart drawer otwarcie + Add to cart must work with JS disabled (server-side fallbacks).
- **Visual regression:** Playwright + opcjonalnie Chromatic na 5 kluczowych ekranach (Home desktop/mobile, PDP, Listing, Cart drawer).
- **A11y:** axe-core w CI. Wszystkie interactive elements `aria-label`. Focus rings widoczne (`focus-visible:outline-2 focus-visible:outline-brand`).
- **i18n:** Strings przez `lib/copy.ts` (jedno źródło, prep do future EN/UA).

---

## 9. Shopify Storefront API — co podpinamy w fazie 2

Wszystkie miejsca oznaczone `[shopify-ready]` w strukturze plików. Faza 1 używa mock data; faza 2 podmienia warstwę data fetching.

### 9.1 Queries

```graphql
# lib/shopify/queries.ts

# Listing
query Products($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
  products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
    edges { node { ...ProductCard } }
    pageInfo { hasNextPage endCursor }
  }
}

# PDP
query ProductByHandle($handle: String!) {
  product(handle: $handle) {
    id title handle description descriptionHtml
    priceRange { minVariantPrice { amount currencyCode } }
    images(first: 8) { edges { node { url altText width height } } }
    variants(first: 20) {
      edges { node { id title availableForSale price { amount currencyCode } selectedOptions { name value } } }
    }
    metafields(identifiers: [
      { namespace: "aura", key: "origin" },
      { namespace: "aura", key: "roast_level" },
      { namespace: "aura", key: "process" },
      { namespace: "aura", key: "notes" },
      { namespace: "aura", key: "methods" },
      { namespace: "aura", key: "accent_color" },
      { namespace: "aura", key: "badge" },
      { namespace: "aura", key: "roast_date" },
      { namespace: "aura", key: "body" },
      { namespace: "aura", key: "acid" },
      { namespace: "aura", key: "sweet" },
    ]) { key value type }
  }
}

# Predictive search
query PredictiveSearch($query: String!) {
  predictiveSearch(query: $query, types: [PRODUCT], limit: 8) {
    products { ...ProductCard }
  }
}
```

### 9.2 Mutations (cart)

```graphql
mutation CartCreate { cartCreate(input: {}) { cart { id checkoutUrl ...CartFields } } }
mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } } }
mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { … }
mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { … }
```

### 9.3 Metafields Schema (Shopify Admin → Settings → Custom data → Products)

| Namespace | Key | Type | Notes |
|---|---|---|---|
| `aura` | `origin` | `single_line_text_field` | „Brazylia · Cerrado" |
| `aura` | `roast_level` | `number_integer` | 1–5 (dla `<RoastBar>`) |
| `aura` | `process` | `single_line_text_field` | Natural / Washed / Honey / Decaf |
| `aura` | `notes` | `list.single_line_text_field` | `["Czekolada", "Orzech", "Karmel"]` |
| `aura` | `methods` | `list.single_line_text_field` | `["Espresso", "Moka"]` |
| `aura` | `accent_color` | `color` | `#FF4D17` / `#2EA12E` / `#6F4FD4` |
| `aura` | `badge` | `single_line_text_field` | „Bestseller", „Limited", „Decaf" |
| `aura` | `roast_date` | `date` | `2025-11-08` |
| `aura` | `body` | `number_integer` | 1–5 (dla `<BlendComparison>`) |
| `aura` | `acid` | `number_integer` | 1–5 |
| `aura` | `sweet` | `number_integer` | 1–5 |
| `aura` | `tagline` | `single_line_text_field` | krótka linia produktowa |

### 9.4 Cart cookies / persistence

- Cart ID w `httpOnly` cookie `aura-cart-id`, max-age 14 dni.
- Server Action `getOrCreateCart()` w `lib/shopify/cart.ts` — wywołane raz w `layout.tsx`.
- Optimistic updates po stronie client, revalidate po response.

### 9.5 Checkout

- **Nie projektujemy własnego.** Przycisk „Przejdź do kasy" w cart drawer = `<a href={cart.checkoutUrl}>` z `target="_self"`.
- Po powrocie z Shopify (success URL) — clear lokalnego cart ID, redirect na `/zamowienie-zlozone` (osobna sukces strona — może być w fazie 2.5).

### 9.6 Env vars

```bash
# .env.local
SHOPIFY_STORE_DOMAIN=auracoffee.myshopify.com
SHOPIFY_STOREFRONT_API_TOKEN=xxx
SHOPIFY_STOREFRONT_API_VERSION=2024-10
NEXT_PUBLIC_SITE_URL=https://auracoffee.pl
```

---

## 10. Pliki do dostarczenia z designu

W tym repo / projekcie:

| Plik | Co zawiera |
|---|---|
| `Aura Storefront v2.1.html` | Pełen interaktywny canvas wszystkich widoków |
| `tokens.css` | Wszystkie design tokens jako CSS variables (referencja) |
| `aura-illustrations.jsx` | `<Starburst>`, `<FigureRunner>`, `<BurstBadge>`, `<AuraMark>`, `<CoffeeBag>` — gotowe SVG do skopiowania do React |
| `aura-components.jsx` | Header, Footer, Ticker, ProductCard, QtyStepper, VariantPills, TrustStrip, FreeShippingProgress, SectionHead |
| `aura-desktop.jsx` | Wszystkie desktop screens |
| `aura-mobile.jsx` | Wszystkie mobile screens |
| `aura-canvas.jsx` | Composition + brief + changelog + notatki |
| `HANDOFF-V2.1.md` | Ten dokument |

**Konwersja JSX → Next/TS:**
- Pliki są w plain JSX (Babel inline). Do Next przekonwertować na `.tsx`, dodać typing, podzielić wg `components/` structure powyżej.
- Inline styles w designie są celowe (rapid prototyping). W docelowym kodzie zamienić na Tailwind utilities — mapowanie 1:1 (np. `padding: '20px 40px'` → `px-10 py-5`).
- Wszystkie kolory używane jako CSS variables (`var(--aura-orange)`) → w Next zamienić na Tailwind classes (`bg-brand`, `text-brand`).
- Custom CSS w `tokens.css` (`.btn`, `.chip`, `.card`, `.ph`) → ekstraktować jako React komponenty (`<Button>`, `<Chip>`, `<Card>`, `<PhotoPlaceholder>`).

---

## 11. Acceptance criteria (przed merge do main)

- [ ] Wszystkie 8 routes działają, lazy-loaded gdzie sensowne
- [ ] Layout 1:1 z canvasem v2.1 na 4 breakpoints (390 / 768 / 1024 / 1440)
- [ ] Cart drawer otwiera/zamyka, add/remove/qty update działa na mock data
- [ ] Search overlay otwiera/zamyka, debounced filter po `title + notes + origin`
- [ ] Mobile menu otwiera/zamyka, scroll-lock działa
- [ ] Sticky add-to-cart na PDP nie zasłania treści (test na realnym mobile)
- [ ] Free shipping progress liczy się poprawnie, mikrocopy zmienia się w stanie unlocked
- [ ] Empty cart pokazuje się gdy cart pusty
- [ ] Wszystkie focus states widoczne, tab order logiczny
- [ ] `prefers-reduced-motion` respected
- [ ] Lighthouse Home: 95+ perf desktop, 90+ mobile, 95+ a11y
- [ ] Brak hard-coded stringów PL poza `lib/copy.ts`
- [ ] Brak `console.log`, `// TODO`, `any`
- [ ] Build pass `pnpm build` bez warnings
- [ ] All `[shopify-ready]` plikach są placeholderami z TODO commentem (`// TODO: replace with Shopify Storefront query in PR #10`)

---

## 12. Kontakt do designera

Wszelkie pytania o intencję wizualną, dwuznaczne stany, brakujące komponenty — referencja jest w `Aura Storefront v2.1.html`. Jeśli czegoś brakuje, NIE wymyślaj — zapytaj.

---

**Wersja:** v2.1 final · 2026 Q1
**Branch docelowy:** `redesign/aura-v2`
**Status:** Ready for implementation
