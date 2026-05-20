export const CONTENT = {
  announcement: {
    freeShipping: "Darmowa dostawa od 150 zł",
    roastSchedule: "Palona co środę w Warszawie, wysyłana w ciągu 72 godzin",
  },

  nav: {
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
      eyebrow: "Nowość · Lot 04 / 2026",
      headingL1: "Kawa,",
      headingL2: "robiona mała,",
      headingL3: "z założenia.",
      subheading:
        "Sześć lotów. Palone co środę w Warszawie. Wysyłane w ciągu 72 godzin od palenia — nigdy starsze.",
      ctaPrimary: "Sprawdź kawy",
      ctaSecondary: "Znajdź swój blend",
      imageCaption: "Zdjęcie główne — Lot 04 / Warszawa",
    },

    shelf: {
      eyebrow: "Półka · 06",
      heading: "W tym sezonie",
      viewAll: "Wszystkie kawy →",
      viewAllMobile: "Wszystkie →",
      description:
        "Dwa single origin, trzy blendy, jeden decaf — dobrane tak, jak dobiera się muzykę.",
    },

    howItWorks: {
      eyebrow: "Jak to działa",
      heading: "Od palarni do Twojej kuchni. W trzech krokach.",
      steps: [
        {
          n: "01",
          title: "Wybierz lot",
          desc: "Sześć kaw. Różne originy, metody parzenia, intensywności. Wszystkie palone w Warszawie.",
        },
        {
          n: "02",
          title: "Palimy w środy",
          desc: "Paczki wychodzą w ciągu 72 godzin od palenia. Całe ziarna lub mielone pod Twoją metodę.",
        },
        {
          n: "03",
          title: "Do Ciebie w 3 dni",
          desc: "Standardowa dostawa 2–3 dni. Express następnego dnia na poranny rytuał.",
        },
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

    reviews: {
      eyebrow: "Opinie",
      heading: "Co mówią klienci",
      items: [
        {
          text: "ONE to szczerze najlepsza kawa filtrowa, jaką parzyłam w domu. Lekka, czysta i te nuty jaśminu są naprawdę wyczuwalne.",
          name: "Marta K.",
          location: "Warszawa",
        },
        {
          text: "Zamówiłem w czwartek, dotarło w sobotę. Jeszcze ciepła z palarni — to rzeczywiście robi różnicę w smaku.",
          name: "Piotr W.",
          location: "Kraków",
        },
        {
          text: "Kupuję od Aury od roku. THREE to moje codzienne espresso i przez ten czas trzymają konsekwentnie jakość.",
          name: "Aleks M.",
          location: "Gdańsk",
        },
      ],
    },

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

  meta: {
    siteTitle: "Aura Coffee Roasters",
    siteDescription:
      "Kawa speciality palona w małych partiach co środę w Warszawie. Wysyłamy w ciągu 72 godzin od palenia.",
  },
};
