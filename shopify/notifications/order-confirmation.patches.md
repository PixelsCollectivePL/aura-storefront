# Potwierdzenie zamówienia — zmiany w `<body>`

Trzy podmiany. Bazą jest szablon Shopify; te zmiany nakładamy na niego
za każdym razem, gdy wracamy do domyślnego.

---

## 1. Nieprawidłowe zagnieżdżenie akapitów

`email_body` niesie własne bloki `<p>` i `<h3>`, a był wstawiany wewnątrz
`<p>`. Klient pocztowy zamyka zewnętrzny akapit w losowym miejscu — stąd
nierówne odstępy między Gmailem a Apple Mail.

**Znajdź:**
```liquid
            <p>{{ email_body }}</p>
```

**Zamień na:**
```liquid
            <div class="content__body">{{ email_body }}</div>
```

---

## 2. Zdublowana kwota końcowa

Shopify renderuje wiersz „Suma" w `subtotal-table--total`. Blok
`aura-grand-total` renderował tę samą kwotę drugi raz, w innym stylu,
trzydzieści pikseli niżej — plus druga kreska kropkowana pod pierwszą.

Wielka pomarańczowa liczba przenosi się na istniejący wiersz Shopify
(robi to CSS: `.subtotal-table--total .subtotal-line:first-child`).
Dzięki temu wszystkie warianty Shopify — B2B, terminy płatności,
zaokrąglenia gotówkowe, płatności częściowe, „Oszczędzasz" — działają
dalej, a kwota pojawia się raz.

**Znajdź** cały blok zaczynający się od:
```liquid
            <table role="presentation" class="aura-grand-total" width="100%" cellpadding="0" cellspacing="0" border="0">
```
i kończący się odpowiadającym mu `</table>` (zawiera `aura-grand-total__label`,
`aura-grand-total__value` i `aura-grand-total__thanks`).

**Zamień na:**
```liquid
            <p class="aura-receipt-thanks">Dziękujemy. Zaczynamy przygotowania.</p>
```

---

## 3. Zasoby graficzne

Szablon wskazywał na źródłową grafikę marki: logo 4500×2392 px (102 KB)
wyświetlane przy 168 px i gwiazda 4167×4167 px (133 KB) przy 58 px.
Każde otwarcie wiadomości ciągnęło pełną rozdzielczość przez proxy
obrazków Gmaila — 235 KB narzutu, często na transmisji komórkowej.

**Dwie podmiany URL-i:**

```
https://aura-storefront-chi.vercel.app/assets/brand/aura-logo-email.png
  →  https://aura-storefront-chi.vercel.app/assets/email/aura-logo.png

https://aura-storefront-chi.vercel.app/assets/brand/aura-star.png
  →  https://aura-storefront-chi.vercel.app/assets/email/aura-star.png
```

Nowe pliki to kopie 2× retina: 10 KB i 4 KB, o 94% lżejsze, z cache'em
na rok. Zmiana wyglądu = nowa nazwa pliku, nigdy podmiana istniejącej —
inaczej klienci pocztowi będą pokazywać starą wersję miesiącami.
