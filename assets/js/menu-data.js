/* Menu przepisane 1:1 z kart lokalu (zdjęcia od klienta, 01.09.2026).
   Braki oznaczone w docs/menu-braki.md — pozycje 12, 13, 22, 23 pizzy
   oraz karty przystawek, deserów i napojów nie były widoczne na zdjęciach. */

const MENU = [
  {
    id: 'pizza',
    nazwa: 'Pizza',
    opis: 'Z pieca opalanego drewnem. Ciasto wyrastające 48 godzin, mozzarella fior di latte.',
    pozycje: [
      { nr: 1,  nazwa: 'Margherita',           cena: 41, opis: 'Sos pomidorowy, mozzarella fior di latte' },
      { nr: 2,  nazwa: 'Prosciutto Cotto',     cena: 45, opis: 'Sos pomidorowy, mozzarella fior di latte, szynka gotowana' },
      { nr: 3,  nazwa: 'Funghi',               cena: 44, opis: 'Sos pomidorowy, mozzarella fior di latte, pieczarki' },
      { nr: 4,  nazwa: 'Salami',               cena: 45, opis: 'Sos pomidorowy, mozzarella fior di latte, salami' },
      { nr: 5,  nazwa: 'Prosciutto e Funghi',  cena: 48, opis: 'Sos pomidorowy, mozzarella fior di latte, szynka, pieczarki' },
      { nr: 6,  nazwa: 'Carbonara',            cena: 49, opis: 'Sos śmietanowy, mozzarella fior di latte, boczek, jajko, cebula, grana padano' },
      { nr: 7,  nazwa: 'Diavola',              cena: 48, opis: 'Sos pomidorowy, mozzarella fior di latte, salami spianata', ostra: true },
      { nr: 8,  nazwa: 'Hawaii',               cena: 47, opis: 'Sos pomidorowy, mozzarella fior di latte, szynka, ananas' },
      { nr: 9,  nazwa: 'Tonno e Cipolla',      cena: 50, opis: 'Sos pomidorowy, mozzarella fior di latte, tuńczyk, cebula', ryba: true },
      { nr: 10, nazwa: 'Capricciosa',          cena: 52, opis: 'Sos pomidorowy, mozzarella fior di latte, szynka, pieczarki, salami, papryka, oliwki' },
      { nr: 11, nazwa: 'Pollo',                cena: 52, opis: 'Sos pomidorowy, mozzarella fior di latte, kurczak, cebula, papryka' },
      { nr: 14, nazwa: 'Vegetariana',          cena: 48, opis: 'Sos pomidorowy, mozzarella fior di latte, pieczarki, oliwki, szpinak, cebula, kukurydza' },
      { nr: 15, nazwa: 'Quattro Formaggi',     cena: 51, opis: 'Sos pomidorowy, mozzarella fior di latte, gorgonzola, grana padano, taleggio' },
      { nr: 16, nazwa: 'Piccante',             cena: 53, opis: 'Sos pomidorowy, mozzarella fior di latte, kurczak, salami spianata, jalapeño', ostra: true },
      { nr: 17, nazwa: 'Frutti di Mare',       cena: 52, opis: 'Sos pomidorowy, mozzarella fior di latte, mix owoców morza, pietruszka', ryba: true },
      { nr: 18, nazwa: 'KS Smoczanka',         cena: 55, opis: 'Sos pomidorowy, mozzarella fior di latte, boczek, szynka, pieczarki, kurczak, cebula' },
      { nr: 19, nazwa: 'Salmone e Cipolla',    cena: 54, opis: 'Sos pomidorowy, mozzarella fior di latte, łosoś, cebula, pietruszka', ryba: true },
      { nr: 20, nazwa: 'Rukola',               cena: 57, opis: 'Sos pomidorowy, mozzarella fior di latte, prosciutto crudo, pomidor koktajlowy, rukola, grana padano' },
      { nr: 21, nazwa: 'Regina',               cena: 50, opis: 'Sos pomidorowy, mozzarella fior di latte, szynka, pieczarki, salami' },
      { nr: 24, nazwa: 'Rustica',              cena: 58, opis: 'Sos pomidorowy, mozzarella fior di latte, salami spianata, kurczak, szpinak, cebula', ostra: true },
      { nr: 25, nazwa: 'Trattoria',            cena: 58, opis: 'Sos pomidorowy, mozzarella fior di latte, szynka, salami, kurczak, szpinak' },
      { nr: 26, nazwa: 'Bricciola',            cena: 59, opis: 'Sos pomidorowy, mozzarella fior di latte, salami spianata, szynka, pieczarki, papryka, cebula', ostra: true },
      { nr: 27, nazwa: 'Bianca',               cena: 50, opis: 'Sos śmietanowy, mozzarella fior di latte, gorgonzola, grana padano, suszone pomidory' },
      { nr: 28, nazwa: 'Burrata',              cena: 59, opis: 'Sos pomidorowy, mozzarella fior di latte, rukola, pomidorki koktajlowe, grana padano, burrata' },
      { nr: 29, nazwa: 'Burrata con Crudo',    cena: 64, opis: 'Sos pomidorowy, mozzarella fior di latte, rukola, pomidorki koktajlowe, prosciutto crudo, burrata' },
      { nr: 30, nazwa: 'Foccacia',             cena: 22, opis: 'Oliwa, oregano' }
    ]
  },
  {
    id: 'makarony',
    nazwa: 'Makarony',
    opis: 'Kuchnia czynna od 14:00. Ostatnie zamówienia przyjmujemy do 20:40.',
    pozycje: [
      { nr: 1, nazwa: 'Spaghetti Napoli',                    cena: 32, opis: 'Makaron spaghetti, sos pomidorowy, grana padano' },
      { nr: 2, nazwa: "Penne all'Arrabbiata",                cena: 34, opis: 'Makaron penne, sos pomidorowy, oliwa z oliwek, czosnek, papryczki pikantne, grana padano', ostra: true },
      { nr: 3, nazwa: 'Spaghetti Bolognese',                 cena: 36, opis: 'Makaron spaghetti, sos boloński, grana padano' },
      { nr: 4, nazwa: 'Tagliatelle ai Porcini',              cena: 38, opis: 'Makaron tagliatelle, sos śmietanowy, sos pomidorowy, borowiki, pietruszka, grana padano' },
      { nr: 5, nazwa: 'Spaghetti Carbonara',                 cena: 38, opis: 'Makaron spaghetti, żółtka jajka, guanciale, grana padano' },
      { nr: 6, nazwa: 'Penne con Pollo, Spinaci e Gorgonzola', cena: 38, opis: 'Makaron penne, sos śmietanowy, kurczak, gorgonzola, szpinak, grana padano' },
      { nr: 7, nazwa: 'Tagliatelle con Gamberi',             cena: 44, opis: 'Makaron tagliatelle, krewetki, pomidorki koktajlowe, oliwa z oliwek, czosnek, pietruszka', ryba: true },
      { nr: 8, nazwa: 'Spaghetti Frutti di Mare',            cena: 42, opis: 'Makaron spaghetti, oliwa z oliwek, mix owoców morza, czosnek, pietruszka', ryba: true }
    ]
  }
];

const DODATKI = [
  { cena: 2, lista: 'ketchup, sos czosnkowy' },
  { cena: 3, lista: 'pieczarki, papryka, kukurydza, cebula, ananas, oliwki, jalapeño, czosnek' },
  { cena: 5, lista: 'grana padano, mozzarella, salami, szynka, taleggio, szpinak, rukola, pomidor koktajlowy, suszone pomidory' },
  { cena: 7, lista: 'owoce morza, salami spianata, kurczak, boczek' }
];
