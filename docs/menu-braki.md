# Czego brakuje w menu na stronie

Menu przepisane ze zdjęć kart otrzymanych od klienta 01.09.2026.
Ceny i składy są 1:1 z kart. Poniżej luki do uzupełnienia.

## Pizza — brakujące pozycje
Na zdjęciach nie było widać czterech numerów. Numeracja na stronie jest zachowana,
więc po dosłaniu danych wystarczy dopisać je w `assets/js/menu-data.js`.

| Nr | Nazwa | Cena | Skład |
|----|-------|------|-------|
| 12 | ? | ? | ? |
| 13 | ? | ? | ? (jedna z nich kończyła się na „boczek, szynka, pieczarki") |
| 22 | ? | ? | ? |
| 23 | ? | ? | „sos pomidorowy, mozzarella fior di latte, salami spianata, kurczak, nduja, cebula" — brak nazwy i ceny |

## Dodatki
Kategoria 7 zł urywa się na „owoce morza, salami spianata, kurczak, boczek" —
możliwe, że lista jest dłuższa.

## Całe karty, których nie ma
- przystawki / bruschetty
- desery (tiramisu i panna cotta są wymieniane w opiniach)
- napoje, lemoniady, wino, kawa
- menu dla dzieci

## Do potwierdzenia u klienta
- **Dowóz** — na FB/IG lokal ma „tylko odbiór osobisty". Moduł zamówień jest zbudowany
  z dowozem i odbiorem. Wartości w `assets/js/main.js` (obiekt `DOSTAWA`) to placeholdery:
  koszt 10 zł, minimum 60 zł, gratis od 120 zł, obszar „Mielec i okolice".
  Jeśli dowozu nie ma — ustawić `DOSTAWA.wlaczona = false`.
- Czy „kuchnia czynna od 14:00, ostatnie zamówienia do 20:40" dotyczy tylko makaronów,
  czy całego menu. Na stronie jest opisane jako dotyczące makaronów.
- Rozmiar pizzy (średnica) — nie było na karcie.
- Zdjęcia: wszystkie w galerii pochodzą z Instagrama lokalu i są w niskiej rozdzielczości.
  Warto poprosić klienta o oryginały. Hero jest wygenerowane (Higgsfield) — nie jest to
  zdjęcie ich pieca.
