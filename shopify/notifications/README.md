# Szablony powiadomień Shopify

Szablony e-maili transakcyjnych żyją w **Shopify Admin → Ustawienia →
Powiadomienia**, a nie w tej aplikacji. Trzymamy tu ich kopię, bo panel
Shopify nie ma historii zmian: bez tego jedyną wersją szablonu jest ta
aktualnie wklejona, a poprzednia znika bezpowrotnie.

## Jak używać

1. Edytuj plik tutaj.
2. Skopiuj całość i wklej w Shopify Admin, zastępując zawartość szablonu.
3. Wyślij podgląd na własny adres i sprawdź w Gmailu (web i mobile),
   Apple Mail oraz Outlooku (web). Outlook desktop jest najbardziej
   restrykcyjny — jeśli tam wygląda poprawnie, reszta też będzie.
4. Commit — żeby historia zmian miała sens.

## Zasoby

Szablony odwołują się do plików serwowanych przez storefront:

```
/assets/email/aura-logo.png     336×178  (wyświetlane przy 168 px)
/assets/email/aura-star.png     116×116  (wyświetlane przy 58 px)
/assets/fonts/Fractul-*.woff2
```

Są to kopie 2× retina, celowo oddzielone od zasobów sklepu — źródłowe
pliki marki mają 4000+ px i ponad 100 KB, co przy e-mailu oznacza, że
każde otwarcie ciągnie pełną rozdzielczość przez proxy obrazków Gmaila.

`/assets/email/*` ma cache na rok i jest traktowane jako niezmienne:
**zmiana wyglądu = nowa nazwa pliku**, nigdy podmiana istniejącego.
Inaczej klienci pocztowi będą pokazywać starą wersję przez wiele
miesięcy.

## Ograniczenia poczty, o których warto pamiętać

- **Fractul zobaczy mniejszość odbiorców.** `@font-face` działa w Apple
  Mail i iOS Mail; Gmail, Outlook i Yahoo go usuwają. Fallback na
  Helvetica/Arial jest świadomy, nie przypadkowy.
- **Brak `transform` i `position`.** Obrócony stempel nachodzący na róg
  karty — jak na paragonie w sklepie — jest w e-mailu nieosiągalny.
  Jedyna droga to gotowy PNG z wypalonym obrotem.
- **Ząbkowana krawędź** jest złożona ze znaków `▼`. Silnik Worda
  (Outlook desktop) rozłoży je nieco inaczej niż przeglądarka.

## Dlaczego nie trzymamy tu pełnych szablonów

Bo nie warto ich przepisywać ręcznie. Szablon potwierdzenia zamówienia
to ~2500 linii, z czego ponad 1500 to wygenerowany przez Shopify blok
renderujący pozycje zamówienia — powtórzony sześć razy w wariantach dla
paczek dzielonych, zestawów, pozycji zagnieżdżonych i odbioru osobistego.

Jedno przeoczone `{% endif %}` w takim bloku psuje e-mail z potwierdzeniem
zamówienia u prawdziwego klienta. Ryzyko przepisania jest nieproporcjonalne
do zysku, bo **nasze zmiany dotyczą wyłącznie `<head>` i trzech miejsc
w `<body>`** — reszta to nietknięty stock Shopify.

Trzymamy więc tutaj **tylko naszą warstwę**: arkusz stylów i opis zmian
w markupie. Bazą zawsze pozostaje aktualny szablon w panelu Shopify,
a w razie potrzeby „Przywróć domyślny" i ponowne nałożenie tych zmian.

## Pliki

| Plik | Zawartość |
|---|---|
| `order-confirmation.head.html` | Blok `<style>` do wklejenia w `<head>` |
| `order-confirmation.patches.md` | Trzy zmiany w `<body>`, z kontekstem |
