# Powiadomienia e-mail Shopify — Aura

## Potwierdzenie zamówienia

Plik `order-confirmation.liquid` jest pełnym szablonem do wklejenia w:

`Shopify → Ustawienia → Powiadomienia → Powiadomienia dla klientów → Potwierdzenie zamówienia → Edytuj kod`

Szablon zachowuje oryginalną logikę Shopify z 3 sierpnia 2026 r. i nakłada na nią system wizualny Aury.

### Przed aktywacją

1. W Shopify ustaw logo wiadomości e-mail na wersję Aury z przezroczystym tłem. Szablon korzysta z `shop.email_logo_url`.
2. Wklej całą zawartość `order-confirmation.liquid` do pola HTML.
3. Kliknij **Podgląd**.
4. Wyślij wiadomość testową.
5. Sprawdź Gmail, Apple Mail oraz telefon.
6. Dopiero wtedy zapisz aktywną wersję.

### Font

Fractul jest pobierany z publicznych, stabilnych adresów storefrontu. Klienci pocztowi blokujący webfonty otrzymają Helvetica/Arial. Jest to zamierzony fallback — nie należy zamieniać tekstu na obrazy.

### Bezpieczeństwo zmian

- Nie usuwaj bloków Liquid odpowiedzialnych za płatności, dostawy, rabaty, zestawy ani karty prezentowe.
- Zmiany wizualne wykonuj przede wszystkim w bloku `<style>` opisanym jako `Aura transactional email system`.
- Po zmianie domyślnego szablonu przez Shopify porównaj logikę nowej wersji przed jej połączeniem ze stylami Aury.
