/* Trattoria Pizzeria Da Zio — logika strony */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     KONFIGURACJA DOWOZU
     Lokal na FB/IG ma dziś "tylko odbiór osobisty". Moduł dowozu jest
     gotowy i włączony — wartości poniżej trzeba potwierdzić u klienta.
     Żeby wyłączyć dowóz, ustaw DOSTAWA.wlaczona = false.
  ------------------------------------------------------------------ */
  const DOSTAWA = {
    wlaczona: true,
    koszt: 10,            // zł — DO POTWIERDZENIA
    minimum: 60,          // zł — DO POTWIERDZENIA
    darmowaOd: 120,       // zł — DO POTWIERDZENIA
    obszar: 'Mielec i okolice'
  };

  const KONTAKT = {
    mail: 'trattoriapizzeriadazio@gmail.com',
    telefon: '+48535626725'
  };

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const zl = n => n.toFixed(2).replace('.', ',') + ' zł';

  /* ---------------- menu ---------------- */

  const wszystkiePozycje = {};
  MENU.forEach(kat => kat.pozycje.forEach(p => {
    wszystkiePozycje[kat.id + '-' + p.nr] = { klucz: kat.id + '-' + p.nr, nazwa: p.nazwa, cena: p.cena, kat: kat.nazwa };
  }));

  function tagi(p) {
    let t = '';
    if (p.ostra) t += '<span class="tag" title="Ostra">🌶️</span>';
    if (p.ryba)  t += '<span class="tag" title="Ryby i owoce morza">🦐</span>';
    return t;
  }

  function budujMenu() {
    const host = $('#menuPanels');
    if (!host) return;

    MENU.forEach((kat, i) => {
      const panel = document.createElement('div');
      panel.className = 'panel';
      panel.dataset.panel = kat.id;
      if (i > 0) panel.hidden = true;

      panel.innerHTML =
        (kat.opis ? '<p class="panel__note">' + kat.opis + '</p>' : '') +
        '<ul class="items">' + kat.pozycje.map(p =>
          '<li class="item">' +
            '<div class="item__body">' +
              '<div class="item__top">' +
                '<span class="item__nr">' + p.nr + '.</span>' +
                '<span class="item__name">' + p.nazwa + tagi(p) + '</span>' +
                '<span class="item__dots"></span>' +
                '<span class="item__price">' + p.cena + ' zł</span>' +
              '</div>' +
              '<p class="item__desc">' + p.opis + '</p>' +
            '</div>' +
            '<button class="item__add" data-add="' + kat.id + '-' + p.nr + '" ' +
              'aria-label="Dodaj ' + p.nazwa + ' do koszyka" title="Dodaj do koszyka">+</button>' +
          '</li>'
        ).join('') + '</ul>';

      host.appendChild(panel);
    });

    const dod = document.createElement('div');
    dod.className = 'panel';
    dod.dataset.panel = 'dodatki';
    dod.hidden = true;
    dod.innerHTML =
      '<p class="panel__note">Dodatki dokładamy do każdej pizzy — wpisz je w uwagach do zamówienia.</p>' +
      '<ul class="addons">' + DODATKI.map(d =>
        '<li class="addon"><b>' + d.cena + ' zł</b><p>' + d.lista + '</p></li>'
      ).join('') + '</ul>';
    host.appendChild(dod);
  }

  function zakladki() {
    $$('.tab').forEach(tab => tab.addEventListener('click', () => {
      $$('.tab').forEach(t => { t.classList.remove('is-on'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-on');
      tab.setAttribute('aria-selected', 'true');
      $$('.panel').forEach(p => {
        p.hidden = p.dataset.panel !== tab.dataset.tab;
        // panel był ukryty, więc IntersectionObserver nigdy go nie zobaczył
        if (!p.hidden) $$('.reveal', p).forEach(el => el.classList.add('is-in'));
      });
    }));
  }

  /* ---------------- koszyk ---------------- */

  const KLUCZ = 'dazio-koszyk-v1';
  let koszyk = {};

  try {
    const zapis = localStorage.getItem(KLUCZ);
    if (zapis) koszyk = JSON.parse(zapis) || {};
  } catch (e) { koszyk = {}; }

  // odsiewa pozycje, których nie ma już w karcie
  Object.keys(koszyk).forEach(k => { if (!wszystkiePozycje[k]) delete koszyk[k]; });

  function zapisz() {
    try { localStorage.setItem(KLUCZ, JSON.stringify(koszyk)); } catch (e) {}
  }

  function pozycje() {
    return Object.keys(koszyk).map(k => ({ p: wszystkiePozycje[k], ile: koszyk[k] })).filter(x => x.p && x.ile > 0);
  }

  function suma() {
    return pozycje().reduce((s, x) => s + x.p.cena * x.ile, 0);
  }

  function sztuk() {
    return pozycje().reduce((s, x) => s + x.ile, 0);
  }

  function dowozWybrany() {
    const r = $('input[name="tryb"]:checked');
    return DOSTAWA.wlaczona && r && r.value === 'dowoz';
  }

  function kosztDowozu() {
    if (!dowozWybrany()) return 0;
    const s = suma();
    if (s === 0) return 0;
    return s >= DOSTAWA.darmowaOd ? 0 : DOSTAWA.koszt;
  }

  function dodaj(klucz) {
    koszyk[klucz] = (koszyk[klucz] || 0) + 1;
    zapisz();
    odswiez();
  }

  function ustaw(klucz, ile) {
    if (ile <= 0) delete koszyk[klucz]; else koszyk[klucz] = ile;
    zapisz();
    odswiez();
  }

  function rysujKoszyk() {
    const host = $('#cartList');
    const lista = pozycje();
    if (!lista.length) {
      host.innerHTML = '<p class="summary__empty">Koszyk jest pusty. Wybierz coś z&nbsp;karty — zaczniemy od Margherity.</p>';
      return;
    }
    host.innerHTML = lista.map(x =>
      '<div class="cline">' +
        '<div class="cline__b">' +
          '<div class="cline__n">' + x.p.nazwa + '</div>' +
          '<div class="cline__p">' + x.p.cena + ' zł &middot; ' + x.p.kat + '</div>' +
        '</div>' +
        '<div class="qty">' +
          '<button data-minus="' + x.p.klucz + '" aria-label="Mniej: ' + x.p.nazwa + '">−</button>' +
          '<span>' + x.ile + '</span>' +
          '<button data-plus="' + x.p.klucz + '" aria-label="Więcej: ' + x.p.nazwa + '">+</button>' +
        '</div>' +
      '</div>'
    ).join('');
  }

  function rysujSumy(host) {
    if (!host) return;
    const s = suma();
    if (s === 0) { host.innerHTML = ''; return; }
    const d = kosztDowozu();
    let html = '<div><dt>Dania</dt><dd>' + zl(s) + '</dd></div>';
    if (dowozWybrany()) {
      html += '<div><dt>Dowóz</dt><dd>' + (d === 0 ? 'gratis' : zl(d)) + '</dd></div>';
    }
    html += '<div class="is-total"><dt>Razem</dt><dd>' + zl(s + d) + '</dd></div>';
    host.innerHTML = html;
  }

  function rysujPodsumowanie() {
    const host = $('#summaryList');
    const lista = pozycje();
    host.innerHTML = lista.length
      ? lista.map(x =>
          '<div class="sline"><span class="sline__q">' + x.ile + '×</span>' +
          '<span class="sline__n">' + x.p.nazwa + '</span>' +
          '<span class="sline__p">' + zl(x.p.cena * x.ile) + '</span></div>'
        ).join('')
      : '<p class="summary__empty">Nic jeszcze nie wybrano. <a href="#menu">Wróć do menu</a>.</p>';

    rysujSumy($('#summaryTotals'));

    const hint = $('#summaryHint');
    const s = suma();
    if (!dowozWybrany()) {
      hint.textContent = lista.length ? 'Odbiór osobisty: ul. Wolności 258, Mielec.' : '';
    } else if (s > 0 && s < DOSTAWA.minimum) {
      hint.textContent = 'Minimum przy dowozie to ' + DOSTAWA.minimum + ' zł — brakuje ' + zl(DOSTAWA.minimum - s) + '.';
    } else if (s > 0 && s < DOSTAWA.darmowaOd) {
      hint.textContent = 'Do darmowego dowozu brakuje ' + zl(DOSTAWA.darmowaOd - s) + '. Dowozimy na terenie: ' + DOSTAWA.obszar + '.';
    } else {
      hint.textContent = s > 0 ? 'Dowóz gratis. Obszar: ' + DOSTAWA.obszar + '.' : '';
    }
  }

  function odswiez() {
    const n = sztuk();
    $('#cartCount').textContent = n;
    $('#barCount').textContent = n;
    rysujKoszyk();
    rysujSumy($('#cartTotals'));
    rysujPodsumowanie();
  }

  /* ---------------- szuflada ---------------- */

  const drawer = $('#drawer');
  let ostatniFokus = null;

  function otworz() {
    ostatniFokus = document.activeElement;
    drawer.hidden = false;
    document.body.style.overflow = 'hidden';
    const x = $('.drawer__x', drawer);
    if (x) x.focus();
  }

  function zamknij() {
    drawer.hidden = true;
    document.body.style.overflow = '';
    if (ostatniFokus) ostatniFokus.focus();
  }

  /* ---------------- formularz ---------------- */

  function trybAdresu() {
    const blok = $('#adresBlok');
    const dowoz = dowozWybrany();
    blok.hidden = !dowoz;
    $$('#adresBlok input').forEach(i => { i.required = dowoz; });
    rysujPodsumowanie();
    rysujSumy($('#cartTotals'));
  }

  function trescZamowienia(dane) {
    const lista = pozycje();
    const s = suma();
    const d = kosztDowozu();
    const L = [];
    L.push('ZAMÓWIENIE — Trattoria Pizzeria Da Zio');
    L.push('');
    lista.forEach(x => L.push(x.ile + ' × ' + x.p.nazwa + '  —  ' + zl(x.p.cena * x.ile)));
    L.push('');
    L.push('Dania: ' + zl(s));
    if (dane.tryb === 'dowoz') L.push('Dowóz: ' + (d === 0 ? 'gratis' : zl(d)));
    L.push('RAZEM: ' + zl(s + d));
    L.push('');
    L.push('Sposób: ' + (dane.tryb === 'dowoz' ? 'DOWÓZ' : 'ODBIÓR OSOBISTY'));
    L.push('Imię i nazwisko: ' + dane.imie);
    L.push('Telefon: ' + dane.telefon);
    if (dane.tryb === 'dowoz') L.push('Adres: ' + dane.ulica + ', ' + dane.miasto);
    L.push('Na kiedy: ' + dane.godzina);
    L.push('Płatność: ' + dane.platnosc);
    if (dane.uwagi) L.push('Uwagi: ' + dane.uwagi);
    return L.join('\n');
  }

  function daneFormularza() {
    const f = $('#orderForm');
    const fd = new FormData(f);
    return {
      tryb: fd.get('tryb'),
      imie: (fd.get('imie') || '').trim(),
      telefon: (fd.get('telefon') || '').trim(),
      ulica: (fd.get('ulica') || '').trim(),
      miasto: (fd.get('miasto') || '').trim(),
      godzina: fd.get('godzina'),
      platnosc: fd.get('platnosc'),
      uwagi: (fd.get('uwagi') || '').trim(),
      zgoda: fd.get('zgoda')
    };
  }

  function komunikat(tekst, ok) {
    const n = $('#formNote');
    n.textContent = tekst;
    n.className = 'form__note ' + (ok ? 'is-ok' : 'is-bad');
  }

  function waliduj(d) {
    $$('.field').forEach(f => f.classList.remove('is-bad'));
    const zle = [];
    const oznacz = sel => { const el = $(sel); if (el) el.closest('.field').classList.add('is-bad'); };

    if (!pozycje().length) return 'Koszyk jest pusty — wybierz coś z menu.';
    if (d.imie.length < 3) { oznacz('[name="imie"]'); zle.push('imię'); }
    if (d.telefon.replace(/\D/g, '').length < 9) { oznacz('[name="telefon"]'); zle.push('telefon'); }
    if (d.tryb === 'dowoz') {
      if (!d.ulica) { oznacz('[name="ulica"]'); zle.push('ulicę'); }
      if (!d.miasto) { oznacz('[name="miasto"]'); zle.push('miejscowość'); }
    }
    if (zle.length) return 'Uzupełnij: ' + zle.join(', ') + '.';
    if (!d.zgoda) return 'Potrzebujemy zgody na kontakt telefoniczny.';
    if (d.tryb === 'dowoz' && suma() < DOSTAWA.minimum) {
      return 'Minimalna wartość zamówienia z dowozem to ' + DOSTAWA.minimum + ' zł. Brakuje ' + zl(DOSTAWA.minimum - suma()) + '.';
    }
    return null;
  }

  /* ---------------- galeria ---------------- */

  const ZDJECIA = [
    { plik: 'piec-serce.jpg',  alt: 'Pizza w kształcie serca w piecu opalanym drewnem' },
    { plik: 'pizza-1.jpg',     alt: 'Pizza z kurczakiem i szpinakiem podana na stole' },
    { plik: 'pizza-2.jpg',     alt: 'Świeżo wypieczona pizza wyjmowana z pieca' },
    { plik: 'ciasto.jpg',      alt: 'Ciasto na pizzę z rozprowadzonym sosem pomidorowym' },
    { plik: 'pizze-blat.jpg',  alt: 'Trzy pizze przygotowywane na blacie kuchni' },
    { plik: 'lemoniada.jpg',   alt: 'Domowa lemoniada cytrynowa w ogródku restauracji' },
    { plik: 'wnetrze-1.jpg',   alt: 'Sala restauracji z drewnianymi stołami przy oknie' },
    { plik: 'wnetrze-2.jpg',   alt: 'Wnętrze restauracji z ceglaną kolumną i zielonymi zasłonami' },
    { plik: 'wnetrze-3.jpg',   alt: 'Stolik przy ścianie z mchu w sali restauracji' }
  ];

  let lbIndex = 0;

  function budujGalerie() {
    const host = $('#galleryGrid');
    if (!host) return;
    host.innerHTML = ZDJECIA.map((z, i) =>
      '<button data-lb="' + i + '" aria-label="Powiększ: ' + z.alt + '">' +
        '<img src="assets/img/gallery/' + z.plik + '" alt="' + z.alt + '" loading="lazy">' +
      '</button>'
    ).join('');
  }

  function pokazLb(i) {
    lbIndex = (i + ZDJECIA.length) % ZDJECIA.length;
    const img = $('#lightboxImg');
    img.src = 'assets/img/gallery/' + ZDJECIA[lbIndex].plik;
    img.alt = ZDJECIA[lbIndex].alt;
    $('#lightbox').hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function zamknijLb() {
    $('#lightbox').hidden = true;
    document.body.style.overflow = '';
  }

  /* ---------------- start ---------------- */

  budujMenu();
  zakladki();
  budujGalerie();
  odswiez();
  trybAdresu();
  $('#year').textContent = new Date().getFullYear();

  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      dodaj(add.dataset.add);
      add.classList.add('is-added');
      add.textContent = '✓';
      setTimeout(() => { add.classList.remove('is-added'); add.textContent = '+'; }, 700);
      return;
    }
    const plus = e.target.closest('[data-plus]');
    if (plus) { ustaw(plus.dataset.plus, (koszyk[plus.dataset.plus] || 0) + 1); return; }

    const minus = e.target.closest('[data-minus]');
    if (minus) { ustaw(minus.dataset.minus, (koszyk[minus.dataset.minus] || 0) - 1); return; }

    if (e.target.closest('[data-close]')) { zamknij(); return; }

    const lb = e.target.closest('[data-lb]');
    if (lb) { pokazLb(parseInt(lb.dataset.lb, 10)); return; }
  });

  $('#cartBtn').addEventListener('click', otworz);
  $('#barOrder').addEventListener('click', otworz);

  $$('input[name="tryb"]').forEach(r => r.addEventListener('change', trybAdresu));

  $('#orderForm').addEventListener('submit', e => {
    e.preventDefault();
    const d = daneFormularza();
    const blad = waliduj(d);
    if (blad) { komunikat(blad, false); return; }
    const tresc = trescZamowienia(d);
    const temat = 'Zamówienie ze strony — ' + d.imie + ' (' + (d.tryb === 'dowoz' ? 'dowóz' : 'odbiór') + ')';
    window.location.href = 'mailto:' + KONTAKT.mail +
      '?subject=' + encodeURIComponent(temat) + '&body=' + encodeURIComponent(tresc);
    komunikat('Otwieramy Twój program pocztowy z gotowym zamówieniem. Jeśli się nie otworzył — użyj „Kopiuj treść" i zadzwoń.', true);
  });

  $('#copyBtn').addEventListener('click', () => {
    if (!pozycje().length) { komunikat('Koszyk jest pusty — nie ma czego kopiować.', false); return; }
    const tresc = trescZamowienia(daneFormularza());
    const gotowe = () => komunikat('Skopiowane. Wklej w SMS-ie lub wiadomości na Facebooku.', true);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(tresc).then(gotowe, () => komunikat('Nie udało się skopiować.', false));
    } else {
      const ta = document.createElement('textarea');
      ta.value = tresc; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); gotowe(); } catch (err) { komunikat('Nie udało się skopiować.', false); }
      document.body.removeChild(ta);
    }
  });

  $('.lightbox__x').addEventListener('click', zamknijLb);
  $('.lightbox__nav--prev').addEventListener('click', () => pokazLb(lbIndex - 1));
  $('.lightbox__nav--next').addEventListener('click', () => pokazLb(lbIndex + 1));
  $('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') zamknijLb(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (!$('#lightbox').hidden) zamknijLb(); if (!drawer.hidden) zamknij(); }
    if (!$('#lightbox').hidden) {
      if (e.key === 'ArrowLeft')  pokazLb(lbIndex - 1);
      if (e.key === 'ArrowRight') pokazLb(lbIndex + 1);
    }
  });

  /* ---------------- wideo w hero ---------------- */
  /* Zdjęcie leży pod spodem jako pierwsza klatka i awaryjne tło. Wideo dociągamy
     dopiero, gdy ma to sens, i zapętlamy przez przenikanie do zdjęcia — ostatnia
     klatka różni się od pierwszej, więc twarde cięcie byłoby widoczne.
     Gramy tylko wtedy, gdy hero jest na ekranie: poza kadrem przeglądarki i tak
     wstrzymują wideo bez dźwięku, a przy okazji oszczędzamy baterię. */
  (function wideoHero() {
    const v = $('#heroVideo');
    if (!v) return;

    const ruchOff = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const siec = navigator.connection || {};
    const wolne = typeof siec.effectiveType === 'string' && /(^|-)(2g|3g)$/.test(siec.effectiveType);
    if (ruchOff || siec.saveData === true || wolne) { v.remove(); return; }

    const maly = window.matchMedia && window.matchMedia('(max-width: 899px)').matches;
    const zrodlo = (maly && v.dataset.srcMobile) ? v.dataset.srcMobile : v.dataset.src;
    if (!zrodlo) { v.remove(); return; }

    const PRZENIKANIE = 0.5; // sekundy — tyle samo co transition w CSS
    let wKadrze = true;

    const graj = () => {
      if (!wKadrze || document.hidden || !v.isConnected) return;
      const r = v.play();
      if (r && r.catch) r.catch(() => {}); // Chrome sam wstrzymuje wideo bez dźwięku poza kadrem
    };

    v.addEventListener('canplay', () => { v.classList.add('is-on'); graj(); }, { once: true });
    v.addEventListener('error', () => v.remove(), { once: true });

    // wygaszamy tuż przed końcem, żeby skok pętli schował się pod zdjęciem
    v.addEventListener('timeupdate', () => {
      if (v.duration && v.duration - v.currentTime < PRZENIKANIE) v.classList.remove('is-on');
    });
    v.addEventListener('ended', () => {
      v.currentTime = 0;
      graj();
      setTimeout(() => { if (wKadrze) v.classList.add('is-on'); }, 60);
    });

    v.preload = 'auto';
    v.src = zrodlo;
    graj();

    document.addEventListener('visibilitychange', () => { if (!document.hidden) graj(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(wpisy => {
        wKadrze = wpisy[0].isIntersecting;
        if (wKadrze) graj(); else v.pause();
      }, { threshold: 0 }).observe($('.hero'));
    }
  })();

  const nav = $('#nav');
  const przyScrollu = () => nav.classList.toggle('is-stuck', window.scrollY > 40);
  przyScrollu();
  window.addEventListener('scroll', przyScrollu, { passive: true });

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(wpisy => {
      wpisy.forEach(w => { if (w.isIntersecting) { w.target.classList.add('is-in'); obs.unobserve(w.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    $$('.strip__in > div, .shead, .items, .addons, .grid, .about__txt, .about__pics, .review, .contact__info, .contact__map, .order__grid')
      .forEach(el => { el.classList.add('reveal'); obs.observe(el); });
  }
})();
