export const CONTENT = {
  announcement: {
    freeShipping: "Darmowa dostawa od 150 zł",
    roastSchedule: "Palona co środę w Warszawie, wysyłana w ciągu 72 godzin",
  },

  nav: {
    // v2.1 nav items
    produkty: "Produkty",
    blendy: "Blendy",
    oMarce: "O marce",
    palarnia: "Palarnia",
    faq: "FAQ",
    kontakt: "Kontakt",
    // legacy aliases (kept for backward compat with existing pages)
    shop: "Sklep",
    about: "O nas",
    brewing: "Parzenie",
    journal: "Journal",
  },

  footer: {
    tagline: "Mikropalarnia specialty. Palona w Warszawie, wysyłana w ciągu 72 godzin.",
    shopHeading: "Kawy",
    companyHeading: "Firma",
    newsletterHeading: "Bądź na bieżąco",
    newsletterDesc: "Nowe loty, terminy palenia i przewodniki po parzeniu — kiedy to ma znaczenie.",
    emailPlaceholder: "twój@email.com",
    subscribeCta: "Zapisz się",
    subscribeMobileCta: "OK",
    companyLinks: [
      { label: "O nas", href: "/about" },
      { label: "Przewodnik parzenia", href: "/brewing" },
      { label: "Journal", href: "/journal" },
      { label: "Stockiści", href: "/stockists" },
      { label: "Kontakt", href: "mailto:hello@aura.coffee" },
    ],
    legalLinks: ["Polityka prywatności", "Śledzenie przesyłki", "Zwroty"],
  },

  homepage: {
    hero: {
      eyebrow: "Coffee club · drop 01 · 2026",
      headingLine1: "Kawa",
      headingLine2: "z charakterem.",
      headingAccent: "Palona",
      headingLine3: "na świeżo.",
      subheading:
        "Specialty z polskiej palarni. Trzy blendy na każdy rytuał — espresso, filtr, wieczór.",
      ctaPrimary: "Sprawdź kawy",
      ctaSecondary: "Poznaj blendy",
      trustNotes: ["Świeżo palona", "Darmowa dostawa od 150 zł", "Wysyłka 24–48h"],
    },

    shelf: {
      eyebrow: "Wybrane blendy",
      heading: "Pod twój rytuał.",
      viewAll: "Wszystkie kawy",
      viewAllMobile: "Wszystkie →",
      description:
        "Dwa single origin, trzy blendy, jeden decaf — dobrane tak, jak dobiera się muzykę.",
    },

    quality: {
      eyebrow: "Jakość",
      headingL1: "Świeżo palona.",
      headingL2: "Gotowa do wysyłki.",
      body: "Palimy w małych wsadach co tydzień. Wysyłamy w 24 h. Trafia do ciebie, zanim pierwsze ziarno zdąży zwietrzeć.",
      points: [
        { n: "01", title: "Małe wsady",   desc: "Partia 12 kg. Żadnych stocków." },
        { n: "02", title: "Direct trade", desc: "Znamy farmy z imienia." },
        { n: "03", title: "< 14 dni",     desc: "Od bębna do twoich drzwi." },
      ],
    },

    reviews: {
      eyebrow: "Co mówią",
      heading: "4.9 ★ z 2 140 ocen.",
      items: [
        {
          text: "Najlepsza kawa do mleka, jaką piłem. THREE robi robotę przy każdym espresso.",
          name: "Kuba",
          location: "Warszawa",
          product: "THREE",
        },
        {
          text: "Zamówiłem w czwartek, dotarło w sobotę — jeszcze ciepłe z palarni. 10/10.",
          name: "Piotr W.",
          location: "Kraków",
          product: "ONE",
        },
        {
          text: "ONE to coś innego. Te nuty jaśminu są naprawdę wyczuwalne. Kupuję od roku.",
          name: "Marta K.",
          location: "Gdańsk",
          product: "TWO",
        },
      ],
    },

    newsletter: {
      eyebrow: "Bądź pierwszy",
      headingL1: "Nowy drop.",
      headingL2: "Dowiesz się pierwszy.",
      body: "Świeże info o nowych blendach, terminach palenia i limitowanych lotach — prosto na skrzynkę.",
      placeholder: "twój@email.com",
      cta: "Zapisz się",
      disclaimer: "Bez spamu. Wypisujesz się jednym kliknięciem.",
    },

    // legacy keys kept for old sections still referencing them
    howItWorks: {
      eyebrow: "Jak to działa",
      heading: "Od palarni do Twojej kuchni. W trzech krokach.",
      steps: [
        { n: "01", title: "Wybierz lot",      desc: "Sześć kaw. Różne originy, metody parzenia, intensywności. Wszystkie palone w Warszawie." },
        { n: "02", title: "Palimy w środy",   desc: "Paczki wychodzą w ciągu 72 godzin od palenia. Całe ziarna lub mielone pod Twoją metodę." },
        { n: "03", title: "Do Ciebie w 3 dni", desc: "Standardowa dostawa 2–3 dni. Express następnego dnia na poranny rytuał." },
      ],
    },

    promise: {
      eyebrow: "Nasza obietnica",
      headingL1: "Tylko świeże.",
      headingL2: "Tylko Twoje.",
      body: "Palimy w małych partiach, żeby nic nie leżało w magazynie. Twoja kawa wychodzi w ciągu 72 godzin od bębna — to nie jest marketing, to harmonogram, według którego działamy.",
    },

    trustItems: [
      { label: "Darmowa dostawa", sub: "od zamówień powyżej 150 zł" },
      { label: "Palone na zamówienie", sub: "co środę w Warszawie" },
      { label: "72 godziny świeżości", sub: "nigdy starsze, nigdy magazynowane" },
      { label: "14 dni na zwrot", sub: "jeśli coś nie gra — naprawiamy" },
    ],

    ctaBanner: {
      eyebrow: "Zacznij tutaj",
      heading: "Nie wiesz, od czego zacząć?",
      ctaPrimary: "Przeglądaj wszystkie kawy",
      ctaSecondary: "Nasza historia",
    },
  },

  shop: {
    eyebrow: "Półka",
    heading: "Wszystkie kawy",
    count: (n: number): string => {
      if (n === 1) return "1 kawa";
      if (n >= 2 && n <= 4) return `${n} kawy`;
      return `${n} kaw`;
    },
    sortMobileLabel: "Sortuj",
    sortOptions: [
      { value: "featured", label: "Polecane" },
      { value: "fresh", label: "Najświeższe" },
      { value: "price-asc", label: "Cena: od najniższej" },
      { value: "price-desc", label: "Cena: od najwyższej" },
    ],
    filters: {
      roast: [
        { value: "Light", label: "Jasny" },
        { value: "Medium", label: "Średni" },
        { value: "Medium-dark", label: "Średnio ciemny" },
        { value: "Dark", label: "Ciemny" },
      ],
      method: [
        { value: "Filter", label: "Filtr" },
        { value: "Espresso", label: "Espresso" },
        { value: "Cafetière", label: "Cafetière" },
        { value: "AeroPress", label: "AeroPress" },
      ],
      origin: [
        { value: "Ethiopia", label: "Etiopia" },
        { value: "Colombia", label: "Kolumbia" },
        { value: "Kenya", label: "Kenia" },
        { value: "Guatemala", label: "Gwatemala" },
      ],
      decaf: "Decaf",
    },
    activeFiltersLabel: (n: number): string => {
      if (n === 1) return "1 filtr aktywny";
      if (n >= 2 && n <= 4) return `${n} filtry aktywne`;
      return `${n} filtrów aktywnych`;
    },
    clearAll: "Wyczyść",
    emptyState: {
      heading: "Żadna kawa nie pasuje do filtrów.",
      body: "Spróbuj innego stopnia palenia lub metody parzenia.",
      clearCta: "Wyczyść filtry",
    },
  },

  listing: {
    eyebrow: "Sklep",
    heading: "Wszystkie kawy",
    description:
      "Single origin i autorskie blendy. Wszystko świeżo palone w Warszawie, wysyłane w 72 godziny.",
    count: (n: number): string => {
      if (n === 1) return "1 kawa";
      if (n >= 2 && n <= 4) return `${n} kawy`;
      return `${n} kaw`;
    },
    categories: [
      { value: "all",           label: "Wszystko"      },
      { value: "espresso",      label: "Espresso"      },
      { value: "filter",        label: "Filtrowe"      },
      { value: "blend",         label: "Blendy"        },
      { value: "decaf",         label: "Decaf"         },
      { value: "single-origin", label: "Single origin" },
    ],
    filtersLabel: "Filtry",
    filtersActiveLabel: (n: number): string => `Filtry · ${n}`,
    activeFiltersLabel: "Aktywne:",
    clearAll: "Wyczyść",
    sortLabel: "Sortuj",
    sortOptions: [
      { value: "featured",   label: "Polecane"            },
      { value: "fresh",      label: "Najświeższe"         },
      { value: "price-asc",  label: "Cena: od najniższej" },
      { value: "price-desc", label: "Cena: od najwyższej" },
    ],
    drawerTitle: "Filtry",
    drawerApply: "Pokaż wyniki",
    drawerReset: "Resetuj",
    filterGroups: {
      roast: {
        label: "Stopień palenia",
        options: [
          { value: "light",       label: "Jasny"          },
          { value: "medium",      label: "Średni"         },
          { value: "medium-dark", label: "Średnio ciemny" },
          { value: "dark",        label: "Ciemny"         },
        ],
      },
      origin: {
        label: "Kraj pochodzenia",
        options: [
          { value: "Ethiopia",  label: "Etiopia"   },
          { value: "Colombia",  label: "Kolumbia"  },
          { value: "Kenya",     label: "Kenia"     },
          { value: "Guatemala", label: "Gwatemala" },
        ],
      },
    },
    emptyState: {
      heading: "Żadna kawa nie pasuje.",
      body: "Spróbuj zmienić filtry lub wybrać inną kategorię.",
      clearCta: "Wyczyść filtry",
    },
  },

  pdp: {
    breadcrumbShop: "Sklep",
    sizeLabel: "Gramatura",
    grindLabel: "Forma",
    qtyLabel: "Ilość",
    addToCart: "Dodaj do koszyka",
    addToCartWithPrice: (price: string): string => `Dodaj do koszyka · ${price}`,
    outOfStock: "Niedostępne",
    ratingsPlaceholder: "4.9 · 312 ocen",
    ratingsAriaLabel: "Ocena 4.9 na 5",
    notesEyebrow: "Nuty smakowe",
    roastEyebrow: "Profil palenia",
    roastMin: "Jasne",
    roastMid: "Średnie",
    roastMax: "Ciemne",
    brewingEyebrow: "Pod jakie parzenie",
    originEyebrow: "Skąd pochodzi",
    originSectionEyebrow: "Pochodzenie",
    brewingSectionEyebrow: "Jak parzyć",
    similarEyebrow: "Podobne kawy",
    similarHeading: "Może ci się spodobać.",
    similarAll: "Zobacz wszystkie",
    specLabels: {
      altitude: "Wysokość",
      process: "Obróbka",
      varietal: "Odmiana",
      producer: "Producent",
      harvest: "Zbiór",
    },
    trust: {
      roasted: "Palona co środę · zawsze świeża",
      shipping: "Wysyłka 24h · darmowa od 150 zł",
      returns: "14 dni na zwrot bez powodu",
      payment: "Bezpieczna płatność",
    },
    decreaseQty: "Zmniejsz ilość",
    increaseQty: "Zwiększ ilość",
    qty: "Ilość",
  },

  product: {
    lotPrefix: "Lot",
    quickAdd: "Dodaj",
    newBadge: "Nowość",
    stock: {
      inStock: "Na stanie",
      lowStock: (qty: number): string => `Na stanie · ${qty} szt.`,
      soldOut: "Wyprzedane",
    },
  },

  cart: {
    title: "Koszyk",
    closeLabel: "Zamknij koszyk",
    empty: {
      heading: "Twój koszyk jest pusty",
      body: "Dodaj kawę, którą chcesz zaparzyć w tym tygodniu.",
      browseCta: "Przeglądaj kawy",
    },
    lotPrefix: "Lot",
    remove: "Usuń",
    removeLabel: (name: string): string => `Usuń ${name} z koszyka`,
    freeShipping: {
      remainingPrefix: "Dodaj jeszcze",
      remainingSuffix: "do darmowej dostawy (od 150 zł).",
      unlocked: "Zamówienie kwalifikuje się do darmowej dostawy.",
    },
    subtotalLabel: "Suma częściowa",
    checkoutCta: "Przejdź do kasy",
    checkoutNote:
      "Płatności dostępne w kolejnym etapie. Wysyłka naliczana przy kasie.",
  },

  about: {
    meta: {
      title: "O nas",
      description: "Dwuosobowa mikropalarnia w Warszawie. Palimy speciality coffee na 5 kg bębnie każdą środę.",
    },
    eyebrow: "— O nas",
    heroHeading: ["Sześć lotów.", "Jedna mała", "palarnia."],
    heroSubtext:
      "Aura to dwuosobowe studio w Warszawie. Palimy speciality coffee na 5 kg bębnie każdą środę i wysyłamy przed piątkiem. Nic, co od nas wychodzi, nie jest starsze niż tydzień.",
    storyEyebrow: "— Historia",
    storyLead:
      "Zaczęliśmy Aurę w 2024, bo chcieliśmy, żeby kawa, którą pijemy w domu, smakowała jak to, co robiliśmy przez lata za barem.",
    storyParagraphs: [
      "Większość kawy na polskich półkach ma dwa miesiące od palenia, gdy trafia do ekspresu. Stwierdziliśmy, że możemy robić to lepiej — w małej skali, gdzie każda paczka jest przypisana do konkretnej środy i nazwiska.",
      "Sześć lotów to właściwa liczba dla nas. Wystarczająca różnorodność, żeby poczuć świat. Na tyle mała, że znamy każdego plantatora osobiście i palimy każdy profil, dopóki nie brzmi jak powinien.",
      "Aura to nie firma kawowa. To palarnia — jeden bęben, dwie osoby i lista farmerów, które odwiedzamy każde żniwa.",
    ],
    statsEyebrow: "Liczby",
    stats: [
      { n: "06", l: "Aktywnych lotów" },
      { n: "72h", l: "Od palenia do wysyłki" },
      { n: "5 kg", l: "Pojemność bębna" },
      { n: "2024", l: "Palimy od" },
    ],
    peopleEyebrow: "Nas dwoje",
    peopleHeading: "Palarnia to jej ludzie.",
    people: [
      {
        name: "Marta",
        role: "Head roaster · założycielka",
        bio: "Za bębnem każdą środę od pierwszego dnia. Wcześniej head barista w Coffeedesk, Q-grader od 2019 roku.",
      },
      {
        name: "Tomasz",
        role: "Sourcing · założyciel",
        bio: "Odwiedza każdą farmę, od której kupujemy. Pisze nasze raporty o originach i redaguje journal. Uważa, że dobra kawa jest opłacona u plantatora, nie przy kasie.",
      },
    ],
    originsEyebrow: "Skąd pochodzi",
    originsHeading: "Sześć farm, trzy kontynenty.",
    origins: [
      ["Etiopia", "Konga · Yirgacheffe"],
      ["Kolumbia", "La Esperanza · Huila"],
      ["Kenia", "Tegu · Nyeri"],
      ["Brazylia", "Fazenda Rainha · decaf"],
    ] as [string, string][],
    visitEyebrow: "— Odwiedź nas",
    visitHeading: "Przyjedź do palarni.",
    visitBody:
      "Otwarte środa–sobota, 10:00–17:00. Wejdź, spróbuj co stoi na stole do cuppingu, wyjdź z paczką, którą widziałeś wychodzącą z bębna.",
    visitAddress: "ul. Targowa 22 · 03-734 Warszawa",
    visitCta: "Jak dojechać",
  },

  help: {
    meta: {
      title: "Pomoc",
      description: "Dostawa, zwroty i odpowiedzi na najczęstsze pytania.",
    },
    eyebrow: "— Pomoc",
    headingL1: "Dostawa, zwroty",
    headingL2: "i mała czcionka.",
    subtext:
      "Wszystko, czego możesz potrzebować. Jeśli nie znajdziesz odpowiedzi — odpisujemy na maile w ciągu dnia roboczego.",
    emailCta: "Napisz do nas",
    trustItems: [
      { t: "Darmowa od 150 zł", s: "Polska · InPost · 2–3 dni" },
      { t: "Wysyłka w 72 h", s: "Od daty palenia" },
      { t: "30-dniowy zwrot", s: "Nieotwarte paczki · pełny zwrot" },
      { t: "Klarna · 3 raty", s: "0% prowizji, w koszyku" },
    ],
    topics: [
      { label: "Wysyłka", count: "03", href: "#shipping" },
      { label: "Zwroty", count: "02", href: "#returns" },
      { label: "Świeżość", count: "02", href: "#freshness" },
    ],
    sections: [
      {
        id: "shipping",
        label: "01 — Wysyłka",
        items: [
          {
            q: "Kiedy wyślecie moje zamówienie?",
            a: "Palimy w środy i wysyłamy w ciągu 72 godzin od palenia. Zamów przed południem w środę na wysyłkę w tym samym tygodniu — późniejsze zamówienia wysyłamy w kolejną środę.",
            defaultOpen: true,
          },
          {
            q: "Ile kosztuje dostawa?",
            a: "Polska: darmowa powyżej 150 zł, inaczej 14 zł (InPost paczkomat) lub 18 zł (kurier). UE: 28 zł, 4–6 dni roboczych. Inne kraje: napisz do nas po wycenę.",
          },
          {
            q: "Czy mogę śledzić przesyłkę?",
            a: "Tak — numer śledzenia wysyłamy mailem w momencie odbioru paczki przez kuriera.",
          },
        ],
      },
      {
        id: "returns",
        label: "02 — Zwroty",
        items: [
          {
            q: "Czy mogę zwrócić kawę?",
            a: "Tak. Nieotwarte paczki w ciągu 30 dni — pełny zwrot. W przypadku otwartych paczek: napisz na hello@aura.coffee, rozwiążemy problem.",
          },
          {
            q: "Co, jeśli kawa dotrze nieświeża?",
            a: "To nie powinno się zdarzyć — ale jeśli tak będzie, wymieniamy paczkę bez pytań i bez formularzy. Wyślij nam zdjęcie worka z widoczną datą palenia.",
          },
        ],
      },
      {
        id: "freshness",
        label: "03 — Świeżość",
        items: [
          {
            q: "Kiedy kawa jest 'świeża'?",
            a: "Speciality coffee jest w najlepszej formie między 7. a 30. dniem od palenia. Wysyłamy w ciągu 72 godzin od bębna, więc masz cały przedział, żeby się nią cieszyć.",
          },
          {
            q: "Jak przechowywać kawę?",
            a: "W oryginalnym worecku z zaworem, zapiętym, w temperaturze pokojowej. Unikaj lodówki. Przelej do hermetycznego pojemnika tylko po otwarciu — i tylko jeśli skończysz w ciągu tygodnia.",
          },
        ],
      },
    ],
    stillNeedHelp: {
      heading: "Nie znalazłeś odpowiedzi?",
      body: "Odpisujemy na maile w ciągu dnia roboczego.",
      cta: "Napisz do nas",
    },
  },

  mobileMenu: {
    closeLabel: "Zamknij menu",
    navItems: [
      { label: "Produkty", sub: "Kawy single origin i blendy",    href: "/produkty" },
      { label: "Blendy",   sub: "Nasze stałe zestawy",            href: "/blendy" },
      { label: "O marce",  sub: "Historia i wartości Aury",       href: "/o-marce" },
      { label: "Palarnia", sub: "Jak palimy · środy w Warszawie", href: "/palarnia" },
      { label: "FAQ",      sub: "Dostawa, zwroty, świeżość",      href: "/faq" },
      { label: "Kontakt",  sub: "hello@aura.coffee",              href: "/kontakt" },
    ],
    account: "Konto",
    basket: "Koszyk",
    basketCount: (n: number): string =>
      n === 1 ? "1 produkt" : n >= 2 && n <= 4 ? `${n} produkty` : `${n} produktów`,
    locale: "PL · PLN",
    city: "Warszawa",
  },

  search: {
    label: "Wyszukaj",
    placeholder: "Szukaj kaw, nut smakowych, origin…",
    closeLabel: "Zamknij wyszukiwanie",
    popularHeading: "Popularne",
    popularTerms: ["Espresso", "Filtr", "Etiopia", "Brazylia", "Kolumbia", "Decaf"],
    resultsHeading: "Wyniki",
    emptyHeading: "Brak wyników",
    emptyBody: 'Spróbuj innej frazy — np. "espresso", "Etiopia" albo "wisnia".',
    lotPrefix: "Lot",
  },

  blendy: {
    meta: {
      title: "Blendy",
      description: "Cztery autorskie receptury Aury. Stale dostępne, palone co środę.",
    },
    eyebrow: "— Blendy",
    heading: "Cztery receptury.",
    subtext: "Blendy to nasze autorskie kompozycje — stałe profile, stałe ziarno, palona co środę jak każdy inny lot. Wiesz czego się spodziewać przy każdym zamówieniu.",
    blends: [
      {
        code: "DOM",
        name: "Dom",
        tagline: "Espresso na co dzień",
        description: "Brazylia i Etiopia 70/30. Orzechowa słodycz, kakao i długie ciepłe zakończenie. Sprawdza się w ekspresie, moka i na filtrze.",
        notes: ["orzech", "kakao", "karmel"],
        bestFor: ["Espresso", "Moka", "Filtr"],
        price: 68,
      },
      {
        code: "RANEK",
        name: "Ranek",
        tagline: "Filtr na dobry poranek",
        description: "Kolumbia i Kenia 60/40. Lekkie, owocowe, z wyraźną cytrusową kwasowością. Najlepsze jako V60 bez mleka.",
        notes: ["cytrus", "jabłko", "herbata"],
        bestFor: ["V60", "Chemex", "AeroPress"],
        price: 72,
      },
      {
        code: "MLEKO",
        name: "Mleko",
        tagline: "Pełne ciało do milk-based",
        description: "Brazylia i Sumatra 65/35. Pełne ciało, niska kwasowość, czekoladowe tło, które nie gubi się pod mlekiem.",
        notes: ["czekolada", "daktyl", "krem"],
        bestFor: ["Flat White", "Latte", "Cappuccino"],
        price: 64,
      },
      {
        code: "DECAF",
        name: "Decaf",
        tagline: "Bez kofeiny, z charakterem",
        description: "Brazylia Swiss Water. Orzechowo-czekoladowa, zero goryczy — ani słabsza, ani nudniejsza niż reszta lotów.",
        notes: ["orzech laskowy", "czekolada", "wanilia"],
        bestFor: ["Espresso", "Moka", "Filtr"],
        price: 78,
      },
    ],
    helperEyebrow: "Nie wiesz który?",
    helperHeading: "3 pytania. 1 blend.",
    helperItems: [
      { q: "Parzysz espresso lub moka?", a: "Dom lub Mleko" },
      { q: "Wolisz filtr i lekkie kawy?", a: "Ranek" },
      { q: "Chcesz bez kofeiny?", a: "Decaf" },
    ],
    helperNote: "Nie masz pewności — napisz do nas. Podpowiemy blend do twojego ekspresu.",
    cta: "Zamów blendy",
    ctaHref: "/produkty",
  },

  oMarce: {
    meta: {
      title: "O marce",
      description: "Dwuosobowa mikropalarnia w Warszawie. Palimy speciality coffee na 5 kg bębnie każdą środę.",
    },
    eyebrow: "— O marce",
    heading: "Jedna palarnia.",
    headingL2: "Jeden standard.",
    subtext: "Aura to dwuosobowe studio w Warszawie. Palimy na 5 kg bębnie każdą środę i wysyłamy przed piątkiem. Nic, co od nas wychodzi, nie jest starsze niż tydzień.",
    storyEyebrow: "— Skąd się wzięliśmy",
    storyLead: "Zaczęliśmy Aurę w 2024, bo chcieliśmy, żeby kawa, którą pijemy w domu, smakowała jak to, co robiliśmy przez lata za barem.",
    storyParagraphs: [
      "Większość kawy na polskich półkach ma dwa miesiące od palenia, gdy trafia do ekspresu. Stwierdziliśmy, że możemy robić to lepiej — w małej skali, gdzie każda paczka jest przypisana do konkretnej środy i nazwiska.",
      "Sześć lotów to właściwa liczba dla nas. Wystarczająca różnorodność, żeby poczuć świat. Na tyle mała, że znamy każdego plantatora osobiście i palimy każdy profil, dopóki nie brzmi jak powinien.",
    ],
    valuesEyebrow: "— Wartości",
    valuesHeading: "Czym się kierujemy.",
    values: [
      { n: "01", title: "Świeżość", body: "Palona w środę, wysyłana w piątek. Każda paczka ma datę palenia na etykiecie — widzisz co kupujesz." },
      { n: "02", title: "Charakter", body: "Sześć lotów, każdy inny. Single origin, pełna traceability, żadnych anonimowych blendów ze stocku." },
      { n: "03", title: "Jakość", body: "Tylko ziarno speciality powyżej 84 pkt SCA. Q-grader na miejscu, każda partia cuppingowana przed zatwierdzeniem." },
      { n: "04", title: "Prostota", body: "Jeden bęben, dwie osoby, sześć lotów. Nie skalujemy kosztem profilu. To nie jest firma — to palarnia." },
    ],
    ctaEyebrow: "— Zacznij tu",
    ctaHeading: "Kawy są w sklepie.",
    cta: "Przejdź do produktów",
    ctaHref: "/produkty",
  },

  palarnia: {
    meta: {
      title: "Palarnia",
      description: "Jak palimy — od wyboru ziarna po wysyłkę. Jeden bęben 5 kg, każda środa.",
    },
    eyebrow: "— Palarnia",
    heading: "Od ziarna",
    headingL2: "do paczki.",
    subtext: "Jeden bęben, pięć kroków, 72 godziny. Tyle dzieli pole od twojego ekspresu.",
    stepsEyebrow: "— Proces",
    steps: [
      {
        n: "01",
        title: "Wybór ziarna",
        body: "Współpracujemy bezpośrednio z farmerami. Każda partia jest próbkowana przed zakupem i cupped przez Martę. Kupujemy tylko ziarno powyżej 84 pkt SCA.",
      },
      {
        n: "02",
        title: "Palenie",
        body: "Każda środa, bęben 5 kg. Profile pisane ręcznie, dostosowane do każdego origin. Żadnych automatycznych krzywych — każdy lot pali się pod siebie.",
      },
      {
        n: "03",
        title: "Odpoczynek",
        body: "Po paleniu kawa odpoczywa 24–48 godzin w otwartych workach. CO2 ucieka, smaki się stabilizują. Dopiero potem pakujemy.",
      },
      {
        n: "04",
        title: "Pakowanie",
        body: "Woreczki z zaworem jednostronnym, datą palenia na etykiecie, kodem lotu. Widzisz co kupujesz — co do grama i środy.",
      },
      {
        n: "05",
        title: "Wysyłka",
        body: "Do 72 godzin od palenia. InPost lub kurier. Darmowa od 150 zł. Zanim zdąży zwietrzeć — jest u ciebie.",
      },
    ],
    freshnessEyebrow: "— Świeżość",
    freshnessHeading: "Dlaczego data palenia jest ważna.",
    freshnessParagraphs: [
      "Speciality coffee jest w najlepszej formie między 7. a 30. dniem od palenia. Wcześniej — za dużo CO2, gorzki i nijaki. Później — utlenie, płaski, bez zapachu.",
      "Większość kawy w Polsce ma 2–3 miesiące od palenia, gdy trafia na półkę. My wysyłamy w piątek to, co palone było w środę. To jedyna różnica, która naprawdę ma smak.",
    ],
    ctaEyebrow: "— Gotowe?",
    ctaHeading: "Wybierz swój lot.",
    cta: "Przejdź do produktów",
    ctaHref: "/produkty",
  },

  faq: {
    meta: {
      title: "FAQ",
      description: "Odpowiedzi na najczęstsze pytania: dostawa, zwroty, świeżość, płatności, produkty.",
    },
    eyebrow: "— FAQ",
    heading: "Pytania,",
    headingL2: "odpowiedzi.",
    subtext: "Wszystko, czego możesz potrzebować. Jeśli nie znajdziesz odpowiedzi — napisz na hello@aura.coffee.",
    categories: [
      {
        id: "dostawa",
        label: "Dostawa",
        items: [
          { q: "Ile kosztuje dostawa?", a: "Dostawa InPost jest darmowa od 150 zł. Poniżej — 12 zł. Kurier DPD — 15 zł. Odbiór w palarni (ul. Targowa 22, Warszawa) — zawsze bezpłatny." },
          { q: "Kiedy nadajecie zamówienie?", a: "Paczki wysyłamy w piątek — tydzień po paleniu. Zamawiasz do środy, dostaniesz w piątek lub sobotę. Zamawiasz po środzie — następny piątek." },
          { q: "Jak długo czeka się na paczkę?", a: "InPost paczkomat — 1 dzień roboczy od nadania. Kurier DPD — 1–2 dni robocze. W sumie od zamówienia do drzwi: 3–5 dni." },
        ],
      },
      {
        id: "zwroty",
        label: "Zwroty",
        items: [
          { q: "Czy mogę zwrócić kawę?", a: "Tak. Nieotwarte paczki możesz zwrócić w ciągu 30 dni bez podawania przyczyny. Zwrot kurierem na nasz koszt." },
          { q: "Co jeśli kawa jest uszkodzona?", a: "Napisz na hello@aura.coffee z numerem zamówienia i zdjęciem. Wymieniamy lub zwracamy pieniądze w ciągu 2 dni roboczych." },
        ],
      },
      {
        id: "swiezosc",
        label: "Świeżość",
        items: [
          { q: "Kiedy kawa jest 'świeża'?", a: "Speciality coffee jest w najlepszej formie między 7. a 30. dniem od palenia. Wysyłamy w piątek to, co palone było w środę — masz cały przedział." },
          { q: "Jak przechowywać kawę?", a: "W oryginalnym woreczku z zaworem, zapiętym, w temperaturze pokojowej. Unikaj lodówki i bezpośredniego słońca. Raz otwarty — zużyj w 2 tygodnie." },
        ],
      },
      {
        id: "platnosci",
        label: "Płatności",
        items: [
          { q: "Jakie metody płatności akceptujecie?", a: "Karta, BLIK, Przelewy24, Apple Pay, Google Pay. W kasie pojawi się też opcja Klarna 3 raty 0% — wkrótce." },
          { q: "Czy mogę zapłacić przy odbiorze?", a: "Nie — realizujemy tylko płatności z góry. Pomaga nam to utrzymać harmonogram palenia i planować zamówienia u farmerów." },
        ],
      },
      {
        id: "produkty",
        label: "Produkty",
        items: [
          { q: "Czym różnią się loty?", a: "Każdy lot to inne ziarno, inna farma, inny kraj. Profil smakowy, metoda obróbki i zalecane parzenie różnią się między lotami. Opisy znajdziesz na kartach produktów." },
          { q: "Czy mlelecie kawę na zamówienie?", a: "Tak. Wybierasz stopień mielenia przy zamówieniu — ziarna całe, filtr gruby, filtr drobny, espresso, moka lub cafetière. Mlelimy tuż przed pakowaniem." },
          { q: "Czy dostępna jest subskrypcja?", a: "Pracujemy nad tym. Subskrypcja pojawi się jako osobna opcja — zapisz się do newslettera, żeby dostać info jako pierwszy." },
        ],
      },
    ],
    emailCta: "Napisz do nas",
    emailHref: "mailto:hello@aura.coffee",
  },

  kontakt: {
    meta: {
      title: "Kontakt",
      description: "Skontaktuj się z Aura Coffee Roasters. hello@aura.coffee",
    },
    eyebrow: "— Kontakt",
    heading: "Odpisujemy",
    headingL2: "w ciągu doby.",
    subtext: "Pytania o kawę, zamówienia, współpracę, odwiedziny w palarni — piszcie śmiało.",
    channelsEyebrow: "— Znajdziesz nas tu",
    channels: [
      { label: "Email", value: "hello@aura.coffee", href: "mailto:hello@aura.coffee" },
      { label: "Instagram", value: "@aura.coffee", href: "https://instagram.com/aura.coffee" },
      { label: "Adres", value: "ul. Targowa 22, 03-734 Warszawa", href: "https://maps.google.com/?q=ul.+Targowa+22+Warszawa" },
      { label: "Godziny", value: "Pon–Pt 10:00–17:00", href: "" },
    ],
    formEyebrow: "— Formularz",
    formHeading: "Napisz do nas.",
    formNote: "Formularz UI — podpięcie backendu wkrótce. Teraz najszybciej przez hello@aura.coffee.",
    formFields: {
      name: "Imię i nazwisko",
      email: "Adres e-mail",
      subject: "Temat",
      message: "Wiadomość",
      submit: "Wyślij wiadomość",
      successHeading: "Dziękujemy!",
      successBody: "Odpiszemy na podany adres e-mail w ciągu dnia roboczego.",
      placeholderNote: "Ten formularz jest wersją demonstracyjną — wiadomość nie zostanie wysłana.",
    },
  },

  meta: {
    siteTitle: "Aura Coffee Roasters",
    siteDescription:
      "Kawa speciality palona w małych partiach co środę w Warszawie. Wysyłamy w ciągu 72 godzin od palenia.",
  },
};

// ── Standalone helpers ─────────────────────────────────────────────────
// Exported as named functions (not inside CONTENT) to guarantee correct
// TypeScript inference — nested function literals in object literals can
// confuse TS strict-mode type narrowing.

/** Returns a readable Polish category label for a product's tag list. */
export function getCategoryLabel(tags?: string[]): string {
  if (!tags) return "Kawa";
  if (tags.includes("espresso")) return "Espresso";
  if (tags.includes("filter")) return "Filtrowe";
  if (tags.includes("blend")) return "Blend";
  if (tags.includes("decaf")) return "Decaf";
  if (tags.includes("single-origin")) return "Single origin";
  return "Kawa";
}
