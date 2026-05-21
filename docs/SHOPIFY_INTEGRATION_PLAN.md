# Shopify Integration Plan — Aura Storefront v2.1

Status: **plan / nie zintegrowano**. Dokument przygotowany w PR #10
(pre-Shopify cleanup & integration readiness audit).

Cel: opisać, jak podpiąć headless Shopify Storefront API pod istniejący
frontend Aura v2.1 — bez przebudowy UI. Checkout pozostaje hostowany przez
Shopify.

---

## 1. Model architektury

```
Shopify (backend)                Next.js (frontend, ten projekt)
─────────────────                ───────────────────────────────
Produkty, warianty, ceny   ─┐
Kolekcje                    │   Storefront GraphQL API
Metafields (bean specs)     ├──────────────────────────►  lib/shopify/client.ts
Zapasy / availability       │                              lib/shopify/queries.ts
Koszyk (Cart API)           │                              lib/shopify/mappers.ts
Checkout (hostowany) ◄──────┘                                      │
                                                                   ▼
                                              lib/mock/products.ts  (seam danych)
                                              lib/cart/cart-context (seam koszyka)
                                                                   │
                                                                   ▼
                                              komponenty UI (bez zmian)
```

**Zasada:** UI nie wie nic o Shopify. Cała wiedza o Shopify mieszka w
`lib/shopify/`. Komponenty konsumują wyłącznie typy `Product` / `CartLine`.

---

## 2. Co zostaje gdzie

### Zostaje w Shopify (backend / źródło prawdy)
- Katalog produktów, warianty, ceny, waluty.
- Kolekcje (np. `featured`, `blendy`, `single-origin`, `decaf`).
- Metafields — dane specialty: `origin`, `process`, `altitude`, `varietal`,
  `producer`, `harvest_year`, `roast_level`, `tasting_notes`,
  `brewing_methods`, `lot_code`.
- Stany magazynowe / `availableForSale` / `quantityAvailable`.
- Koszyk (Cart API) i `checkoutUrl`.
- **Checkout, płatności, podatki, wysyłka** — w całości hostowane przez Shopify.

### Zostaje we frontendzie (ten projekt)
- Cały UI/UX, design system, routing, animacje, treści marketingowe (`lib/content/pl.ts`).
- Strony contentowe: `/o-marce`, `/palarnia`, `/blendy`, `/faq`, `/kontakt`.
- Logika prezentacji (filtry, sortowanie, search UI, toast, drawer koszyka).
- Mapowanie Shopify → `Product` / `CartLine` (`lib/shopify/mappers.ts`).

---

## 3. Zmienne środowiskowe

Dodać do `.env.local` (dev) oraz do Vercel Project Settings (preview + production).
**Nie commitować wartości.** W PR #10 nie dodano żadnych env vars.

| Zmienna                            | Przykład                          | Uwagi |
|------------------------------------|-----------------------------------|-------|
| `SHOPIFY_STORE_DOMAIN`             | `aura-coffee.myshopify.com`       | Domena sklepu Shopify. |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN`  | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Storefront API token (publiczny, read + cart). Server-side. |
| `SHOPIFY_API_VERSION`              | `2025-01`                         | Wersja Storefront API. |
| `SHOPIFY_REVALIDATE_SECRET`        | (losowy ciąg)                     | Opcjonalnie — sekret webhooka do `revalidateTag`. |

> Token Storefront API jest read-only + cart — bezpieczny, ale i tak trzymamy
> zapytania po stronie serwera (Server Components / Route Handlers).

---

## 4. Pliki

### Istnieją już (scaffold, PR #10) — `lib/shopify/`
| Plik         | Stan      | Do zrobienia w integracji |
|--------------|-----------|---------------------------|
| `types.ts`   | scaffold  | Dostroić do realnego schematu metafields. |
| `queries.ts` | scaffold  | Zweryfikować selekcje pól wobec realnego sklepu. |
| `client.ts`  | **stub**  | Zaimplementować realny `shopifyFetch` (POST do GraphQL). |
| `mappers.ts` | scaffold  | Dokończyć mapowanie wariantów (patrz §7). |
| `README.md`  | gotowe    | — |

### Powstaną w integracji
| Plik                          | Rola |
|-------------------------------|------|
| `lib/shopify/products.ts`     | `getProducts` / `getProduct` / `getFeaturedProducts` na bazie Shopify — zastępują seam z `lib/mock/products.ts`. |
| `lib/shopify/cart.ts`         | `createCart` / `addLines` / `updateLines` / `removeLines` / `getCart`. |
| `lib/cart/cart-storage.ts`    | Persistencja `cartId` (cookie/localStorage). |
| `app/api/revalidate/route.ts` | (Opcjonalnie) webhook Shopify → `revalidateTag` przy zmianie produktu. |
| `.env.local`                  | Lokalne zmienne środowiskowe (nie commitować). |

---

## 5. Query / Mutations

Stringi GraphQL są już w `lib/shopify/queries.ts` (scaffold).

**Read:**
- `PRODUCTS_QUERY` — lista produktów (PLP `/produkty`).
- `PRODUCT_BY_HANDLE_QUERY` — pojedynczy produkt (PDP `/produkty/[handle]`).
- `COLLECTION_PRODUCTS_QUERY` — produkty z kolekcji (homepage featured, kategorie).
- `PREDICTIVE_SEARCH_QUERY` — search overlay (zastępuje `lib/search/searchProducts.ts`).

**Cart (mutations):**
- `CART_CREATE_MUTATION` — `cartCreate` (pierwsze dodanie do koszyka).
- `CART_QUERY` — `cart(id:)` (odczyt po reloadzie).
- `CART_LINES_ADD_MUTATION` — `cartLinesAdd` ← `addToCart`.
- `CART_LINES_UPDATE_MUTATION` — `cartLinesUpdate` ← `updateCartLine`.
- `CART_LINES_REMOVE_MUTATION` — `cartLinesRemove` ← `removeCartLine`.

---

## 6. Kolejność integracji (rekomendowana)

Integrację dzielimy na PR-y, żeby każdy był testowalny na Vercel preview.

1. **PR 11 — Shopify products (read).**
   - Implementacja `lib/shopify/client.ts` (`shopifyFetch`).
   - `lib/shopify/products.ts` na bazie `queries.ts` + `mappers.ts`.
   - Przepięcie seamu danych (`getProducts`/`getProduct`/`getFeaturedProducts`)
     na Shopify — funkcje stają się `async`.
   - PLP `/produkty` musi dostać dane z Server Component (patrz §7 — dziś jest
     w całości Client Component).
   - Bez koszyka — koszyk dalej mockowy.

2. **PR 12 — Shopify cart.**
   - `lib/shopify/cart.ts` + persistencja `cartId`.
   - `cart-context` → akcje `async`, podpięte pod mutacje.
   - `checkoutUrl` z odpowiedzi Shopify.

3. **PR 13 — Checkout hand-off + finalizacja.**
   - Przycisk „Do kasy" → `window.location = cart.checkoutUrl`.
   - Predictive search na API Shopify.
   - QA, obsługa błędów, stany ładowania.

4. **PR 14 (opcjonalnie) — ISR / webhooki.**
   - `revalidateTag` przy zmianie produktów/cen.

---

## 7. Znane luki do domknięcia przed integracją

Ustalenia z audytu PR #10 (szczegóły w opisie PR):

- **Warianty.** Frontend modeluje warianty jako dwie osobne osie
  (`sizeOptions` + `grindOptions`). Shopify ma jedną płaską tablicę
  `variants` opartą o `options`. Przed/podczas PR 11 trzeba albo
  rozszerzyć typ `Product` o realne `variants` + `options`, albo trzymać
  mapowanie osi w `mappers.ts`. `cart-context.addToCart` syntetyzuje dziś
  `variantId` jako `${handle}::${variantTitle}` — musi przyjmować realny
  `ProductVariant.id` (gid).
- **PLP jest Client Component.** `app/produkty/page.tsx` ma `"use client"`
  i importuje dane modułowo. Client Component nie może `await`-ować
  async seamu. Trzeba dodać Server Component wrapper, który pobiera produkty
  i podaje je jako `props`.
- **Cena na produkcie vs. wariancie.** `Product.price` to dziś jedna liczba;
  w Shopify cena żyje na wariancie (`priceRange` na produkcie). Mapper bierze
  `minVariantPrice` — UI pokazujące „od X zł" jest OK, ale wybór wariantu
  powinien aktualizować cenę.
- **Persistencja koszyka.** Koszyk jest in-memory — znika po reloadzie.
  Shopify wymaga zapisania `cartId`.
- **Obrazy.** `Product.images[].src` to dziś `""` (placeholdery). Po
  integracji to URL-e z CDN Shopify — dodać domenę do `next.config.ts`
  (`images.remotePatterns`).
- **Routing.** `/produkty` i `/produkty/[handle]` są oparte o `handle` —
  zgodne z Shopify. Redirecty `/shop` → `/produkty` działają. `generateStaticParams`
  stanie się async.

---

## 8. Jak zachować checkout Shopify

- Nie budujemy własnego checkoutu, płatności ani integracji z BaseLinkerem
  w ramach tej ścieżki.
- Po stronie frontu koszyk operuje wyłącznie na Shopify Cart API.
- Mutacje koszyka zwracają `cart.checkoutUrl` — to pełny, hostowany przez
  Shopify URL kasy.
- Przycisk „Do kasy" w `CartDrawer` wykonuje twarde przekierowanie:
  `window.location.href = checkoutUrl`.
- Checkout, płatności, podatki, wysyłka, potwierdzenia e-mail — w całości
  po stronie Shopify. Po zakończeniu Shopify wraca na skonfigurowany w
  panelu URL (np. strona główna / thank-you).
- Dzięki temu PCI/płatności nie dotykają tego repo.

---

## 9. Poza zakresem (świadomie pominięte)

Customer accounts, subskrypcje, BaseLinker, własny checkout, własne
płatności, zmiana domeny, marketing automation (Klaviyo) — osobne, późniejsze
decyzje. Nie blokują integracji read + cart + checkout hand-off.
