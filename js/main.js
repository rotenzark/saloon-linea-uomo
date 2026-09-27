/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'saloon-linea-uomo',
    whatsapp: {
      number: '', // WhatsApp non dichiarato: si prenota su Treatwell o per telefono
      message: '',
      ids: [],
    },
    /* scheda Google (gestita dal titolare): mar–ven 8:30–12:30 e 14:30–19:30, sab 8:30–19:30, dom e lun chiuso */
    hours: {
      0: [], 1: [], 2: [['08:30', '12:30'], ['14:30', '19:30']], 3: [['08:30', '12:30'], ['14:30', '19:30']],
      4: [['08:30', '12:30'], ['14:30', '19:30']], 5: [['08:30', '12:30'], ['14:30', '19:30']], 6: [['08:30', '19:30']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1020,
    EN: {
      'm.salta': 'Skip to content',
      'm.top': 'Saloon Linea Uomo da Mimmo, back to the top',
      'm.sezioni': 'Sections',
      'm.lingua': 'Language',
      'm.menu': 'Open the menu',
      'm.azioni': 'Quick actions',
      'm.lightbox': 'Enlarged photo',
      'm.chiudi': 'Close',
      'm.righello': 'The time of a haircut',
      'v.taglio': 'The cut', 'v.dopo': 'Now and later', 'v.sempre': 'As always', 'v.bottega': 'The shop', 'v.dove': 'Where',
      't.prenota': 'Book',
      'r0': 'now', 'r1': 'half an hour', 'r2': 'three weeks', 'r3': 'twenty years', 'r4': 'sixty years', 'r5': 'and now?',
      'h.tempo': 'Now',
      'h.titolo': 'Now and later.',
      'h.frase': '«You’ll notice my cut both now and later.»',
      'h.chi': 'Mimmo, to a client',
      'h.sotto': 'A barber in Largo Scalabrini since 1966, <strong>one of Milan’s historic shops</strong>. Comb and scissors, fades and beards, by appointment.',
      'h.prenota': 'Book on Treatwell',
      'h.chiama': 'Call 02 471262',
      'h.vg': 'on Google · 165 reviews',
      'h.vt': 'on Treatwell · 851 reviews',
      'h.alt': 'A fade seen from behind: short dark hair on top, shorter and shorter towards the nape, down to the skin',
      'h.gTitolo': 'Diagram of a fade: the length of every hair, from the crown to the nape',
      'h.gDesc': 'Fifty-six blue lines, short at the bottom and long at the top: from 0.4 millimetres at the nape to 24 at the crown. A dashed red line marks the same hairs three weeks later, all 6.3 millimetres longer: the shape is the same, shifted.',
      'h.gSu': 'crown',
      'h.gGiu': 'nape',
      'h.lAdesso': 'now',
      'h.lDopo': 'after 3 weeks',
      'h.giorniLab': 'Days since the cut',
      'h.stato': 'Now: the cut, just done.',
      'h.cap': 'On the left, one of Mimmo’s fades; on the right, the diagram of a fade, hair by hair. Every hair grows about 0.3 mm a day: after three weeks everything is 6 mm longer, and the shape is the same.',
      't.tempo': 'Half an hour',
      't.t': 'The cut.',
      't.s': 'By appointment, Tuesday to Saturday. Classic cuts with comb and scissors, and made-to-measure cuts: first you look, you talk, and you decide together.',
      't.g1': 'Hair',
      't.s1': 'Cut and shampoo',
      't.s2': 'Dry cut', 't.s2n': 'without wetting the hair',
      't.s3': 'Cut, shampoo and treatment lotion',
      't.s4': 'Clipper cut',
      't.s5': 'Shampoo and blow-dry',
      't.g2': 'Beard',
      't.s6': 'Beard shaping', 't.s6n': 'with clippers or scissors',
      't.s7': 'Beard shave', 't.s7n': 'with the razor',
      't.s8': 'Shave and shaping', 't.s8n': 'the beard shaped with scissors',
      't.g3': 'All together, and for the little ones',
      't.s9': 'Cut, shampoo and beard',
      't.s10': 'Kids’ cut', 't.s10n': 'from 0 to 5 years old',
      't.nota': 'The durations are the ones on their booking page.',
      't.a1': 'The red and white barber chairs lined up in front of the washbasins, on the light marble floor',
      't.f1': 'The chairs, lined up in front of the mirrors.',
      't.a2': 'White bottles and jars with their logo, the classical head in the blue circle: charcoal shampoo, mallow hair cream, gel, wax',
      't.f2': 'And the products with their own brand: shampoo, gel, cream, wax.',
      'd.tempo': 'Three weeks',
      'd.t': 'And later.',
      'd.s': 'You look at a haircut on the day, in the mirror. But you really see it when it grows back.',
      'd.cit': '«Mimmo told me something that made me curious: “You’ll notice my cut both now and later”. And he was right. Days later, the cut still keeps its shape and structure impeccably. The hair grows back evenly, naturally <span class="taglio">[…]</span>»',
      'd.su': 'on Google (translated from Italian)',
      'd.gAria': 'How much hair grows, week by week',
      'd.g0': 'today', 'd.g1': '1 week', 'd.g2': '2 weeks', 'd.g3': '3 weeks', 'd.g4': '4 weeks',
      'd.p1': 'Hair grows about 0.3 millimetres a day, roughly a centimetre a month. It all grows by the same amount: on top as on the nape. That’s why the shape the cut gives you is the shape that grows back.',
      'd.p2': 'If the fade is done well, after three weeks it’s still there, just 6 millimetres longer. Then, when it’s time, you go back to Mimmo.',
      'd.fonte': 'How hair grows:',
      's.tempo': 'Twenty years',
      's.t': 'As always.',
      's.s': 'It’s the phrase that keeps coming back in the reviews: «come sempre», as always, is in 65 of the 711 reviews written on Treatwell since 2023. Some clients have been coming for twenty years, some for thirty, some bring their sons.',
      's.vg': 'on Google, 165 reviews',
      's.vt': 'on Treatwell, 851 verified reviews',
      's.d1': 'October 2023', 's.d2': 'February 2024', 's.d3': 'June 2025', 's.d4': 'May 2023',
      's.nota': 'From the reviews on Google and Treatwell, just as they were written (in Italian).',
      's.tutte': 'Read them all on Treatwell →',
      'b.tempo': 'Sixty years',
      'b.t': 'A historic shop.',
      'b.s': 'There has been a barber in Largo Scalabrini since 1966. The City of Milan lists it among the city’s historic shops.',
      'b.p1': 'Mimmo, Domenico Lorusso, has run it since 9 January 2001. On the anniversary he wrote to his clients: «25 years in business + 35 of the previous management». In March 2025, the award at Palazzo Marino, the city hall.',
      'b.p2': 'Inside: the red and white barber chairs, the gold-framed mirrors, the brick wall, and on the walls the black and white portraits of the great film stars.',
      'b.frase': '«Creativity, Imagination, Passion and Heart are the best therapies I have ever tried to make a person happy.»',
      'b.chi': 'Mimmo, on Instagram',
      'b.k1': 'Register of historic shops',
      'b.v1': 'City of Milan, no. 519',
      'b.k2': 'Barber since',
      'b.k3': 'Mimmo since',
      'b.alogo': 'Their logo: a classical head in profile, with curly hair, in a blue circle; below, «Saloon Linea Uomo» and «da Mimmo»',
      'b.afoto': 'Three red and white barber chairs and, at the back, the two black armchairs of the waiting area and the brick wall',
      'b.f1': 'The chairs and, at the back, the waiting area.',
      'w.tempo': 'And now?',
      'w.t': 'Book.',
      'w.s': 'By appointment. Book online on Treatwell, or call.',
      'w.prenota': 'Book on Treatwell',
      'w.cap': 'Opening hours',
      'w.mar': 'Tuesday', 'w.mer': 'Wednesday', 'w.gio': 'Thursday', 'w.ven': 'Friday', 'w.sab': 'Saturday', 'w.dom': 'Sunday', 'w.lun': 'Monday',
      'w.chiuso': 'closed',
      'w.k1': 'Address', 'w.k2': 'Getting there', 'w.k3': 'Phone', 'w.k4': 'Mobile',
      'w.v2': 'Gelsomini; the tram on via Giambellino, the buses on via Lorenteggio',
      'w.strada': 'Directions to Largo Scalabrini 6 →',
      'w.ains': 'The blue sign lit up at night, «Saloon Linea Uomo da Mimmo» with their logo, above the shop window',
      'w.fins': 'The sign, at night, in Largo Scalabrini.',
      'w.mappa': 'Map: Saloon Linea Uomo da Mimmo, Largo Scalabrini 6, Milan',
      'z.motto': 'A historic shop of Milan, since 1966.',
      'z.cred': 'Demo website made by <a href="https://bespokestud.io" rel="noopener">Bespoke Studio</a> · texts from their Facebook and Instagram posts, their Treatwell page, the Google listing and the City of Milan register of historic shops (September 2026); public reviews on Google and Treatwell; photos from their Treatwell page, their Facebook page and the Google listing.',
      'z.su': 'Back to the top ↑',
      'x.chiama': 'Call', 'x.prenota': 'Book', 'x.dove': 'Where',
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ SALOON LINEA UOMO DA MIMMO — il tempo di un taglio ══════════
     1. IL RIGHELLO: sul fianco (schermi larghi) segna il capitolo che si sta leggendo (IntersectionObserver).
     2. la FIRMA — la sfumatura che ricresce: nello schema accanto alla foto ogni riga è un capello (data-l = mm al
        giorno 0, scritti da _mdm_sfumatura.mjs). Quando la scheda entra in vista i giorni passano da 0 a 21: ogni
        capello cresce di 0,3 mm al giorno (Wikipedia), tutti della stessa misura, fino alla linea tratteggiata; poi
        «si torna da Mimmo» e il taglio torna com'era. Il cursore dei giorni (0–28) lo fa rifare a mano.
        Stato iniziale = stato finale = l'HTML (giorno 0): niente velo, niente lampo. Senza JS lo schema resta fermo
        con «adesso» e «dopo 3 settimane»; con reduced-motion niente animazione, il cursore funziona. */
  var capitoli = document.querySelectorAll('[data-capitolo]');
  var tacche = document.querySelectorAll('.righello a[data-tempo]');
  if (tacche.length && 'IntersectionObserver' in window) {
    var segnaTacca = function (nome) {
      tacche.forEach(function (a) {
        if (a.getAttribute('data-tempo') === nome) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    var ossTempo = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) { if (v.isIntersecting) segnaTacca(v.target.getAttribute('data-capitolo')); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    capitoli.forEach(function (c) { ossTempo.observe(c); });
    segnaTacca('adesso');
  }

  var grafico = document.getElementById('grafico');
  var capelli = grafico ? [].slice.call(grafico.querySelectorAll('.capello')) : [];
  var lungh = capelli.map(function (c) { return parseFloat(c.getAttribute('data-l')); });
  var x2Orig = capelli.map(function (c) { return c.getAttribute('x2'); });
  var GRAF = { x0: 64, mm: 16, crescita: 0.3, giorniDopo: 21 };
  var cursore = document.getElementById('giorni');
  var rigaGiorni = document.getElementById('giorniRiga');
  var outN = document.getElementById('giornoN');
  var outMm = document.getElementById('giornoMm');
  var statoScheda = document.getElementById('schedaStato');
  var TESTI_SCHEDA = {
    it: { giorno: 'giorno', adesso: 'Adesso: il taglio appena fatto.', dopo: 'Dopo {g} giorni: tutto più lungo di {mm} mm, la forma è la stessa.', torna: 'E quando è ora, si torna da Mimmo.' },
    en: { giorno: 'day', adesso: 'Now: the cut, just done.', dopo: 'After {g} days: everything {mm} mm longer, same shape.', torna: 'And when it’s time, back to Mimmo.' },
  };
  var giornoAttuale = 0, faseScheda = 'adesso';
  function testoMm(v) {
    var s = (Math.round(v * 10) / 10).toFixed(1);
    return root.lang === 'it' ? s.replace('.', ',') : s;
  }
  function aggiornaTesti() {
    var T = TESTI_SCHEDA[root.lang] || TESTI_SCHEDA.it;
    var g = Math.round(giornoAttuale);
    if (outN) outN.textContent = T.giorno + ' ' + g;
    if (outMm) outMm.textContent = '+' + testoMm(GRAF.crescita * g) + ' mm'; // i mm del giorno mostrato (8 giorni = 2,4 mm)
    if (!statoScheda) return;
    if (faseScheda === 'torna') statoScheda.textContent = T.torna;
    else if (g === 0) statoScheda.textContent = T.adesso;
    else statoScheda.textContent = T.dopo.replace('{g}', g).replace('{mm}', testoMm(GRAF.crescita * g));
  }
  function mostraGiorno(d) {
    giornoAttuale = d;
    capelli.forEach(function (c, i) {
      // al giorno 0 si rimette l'attributo scritto nell'HTML, identico: lo stato finale è quello di partenza
      c.setAttribute('x2', d === 0 ? x2Orig[i] : (GRAF.x0 + (lungh[i] + GRAF.crescita * d) * GRAF.mm).toFixed(1));
    });
    if (cursore && document.activeElement !== cursore) cursore.value = String(Math.round(d));
    aggiornaTesti();
  }
  var giroScheda = null;
  function fermaGiro() { if (giroScheda) { giroScheda.kill(); giroScheda = null; } }
  if (grafico && capelli.length) {
    if (rigaGiorni) rigaGiorni.hidden = false;
    if (cursore) {
      cursore.addEventListener('input', function () {
        fermaGiro();
        faseScheda = 'dopo';
        mostraGiorno(parseInt(cursore.value, 10) || 0);
      });
    }
    // al cambio di lingua il plumbing riscrive i testi fissi: i numeri della scheda li riallinea questa
    if ('MutationObserver' in window) new MutationObserver(aggiornaTesti).observe(root, { attributes: true, attributeFilter: ['lang'] });
    if (hasGsap && !reducedMotion) {
      var avviaGiro = function () {
        if (giroScheda) return;
        var st = { d: 0 };
        giroScheda = gsap.timeline({
          delay: 0.5,
          onComplete: function () { giroScheda = null; faseScheda = 'adesso'; mostraGiorno(0); },
        });
        giroScheda
          .to(st, { d: GRAF.giorniDopo, duration: 2.6, ease: 'power1.inOut', onUpdate: function () { faseScheda = 'dopo'; mostraGiorno(st.d); } })
          .call(function () { faseScheda = 'torna'; aggiornaTesti(); }, null, '+=0.35')
          .to(st, { d: 0, duration: 0.8, ease: 'power2.inOut', onUpdate: function () { mostraGiorno(st.d); } }, '+=0.9');
      };
      if (hasST) ScrollTrigger.create({ trigger: grafico, start: 'top 85%', once: true, onEnter: avviaGiro });
      else avviaGiro();
    }
  }
})();
