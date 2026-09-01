# Trattoria Pizzeria Da Zio — Mielec

Landing page pizzerii z ul. Wolności 258 w Mielcu. Statyczna strona (HTML/CSS/JS,
bez build stepu), publikowana przez GitHub Pages.

## Struktura
- `index.html` — cała strona
- `assets/css/style.css` — style
- `assets/js/menu-data.js` — karta dań (ceny 1:1 z kart lokalu)
- `assets/js/main.js` — koszyk, formularz zamówienia, galeria, lightbox
- `assets/img/` — hero (generowane) i galeria (zdjęcia z Instagrama lokalu)
- `docs/` — notatki z researchu i lista braków w menu

## Zamówienia
Koszyk trzyma stan w `localStorage`. Wysyłka zamówienia otwiera `mailto:` na adres
lokalu; jest też przycisk „Kopiuj treść" i klikalny telefon. Docelowo warto podpiąć
prawdziwy backend albo integrację z systemem zamówień.

## Dowóz
Parametry dowozu ustawia się w obiekcie `DOSTAWA` na górze `assets/js/main.js`.
Wartości wymagają potwierdzenia u klienta — szczegóły w `docs/menu-braki.md`.
