/* eslint-disable no-undef */
/* Aura Storefront v2.1 — main canvas composition */

function App() {
  return (
    <div className="aura" style={{ minHeight: '100vh' }}>
      <DesignCanvas>
        <DCSection id="intro" title="Aura Storefront v2.1 · Brief & kierunek" subtitle="Coffee club z polskiej palarni — premium e-commerce, czysta nawigacja, kontrolowany hero">
          <DCArtboard id="brief" label="Założenia + decyzje" width={760} height={1100}>
            <BriefBoard />
          </DCArtboard>
          <DCArtboard id="brand" label="Brand DNA" width={520} height={1100}>
            <BrandDNABoard />
          </DCArtboard>
          <DCArtboard id="changes" label="Zmiany v2 → v2.1" width={620} height={1100}>
            <ChangelogBoard />
          </DCArtboard>
        </DCSection>

        <DCSection id="desktop" title="Desktop · 1440×900" subtitle="Pełna podróż e-commerce w klimacie coffee clubu">
          <DCArtboard id="dh"  label="01 · Home"            width={DESK_W} height={2500}><DesktopHome /></DCArtboard>
          <DCArtboard id="dl"  label="02 · Produkty (listing)" width={DESK_W} height={1900}><DesktopListing /></DCArtboard>
          <DCArtboard id="dp"  label="03 · Karta produktu"   width={DESK_W} height={1900}><DesktopPDP /></DCArtboard>
          <DCArtboard id="db"  label="04 · Blendy"           width={DESK_W} height={2400}><DesktopBlends /></DCArtboard>
          <DCArtboard id="da"  label="05 · O marce"          width={DESK_W} height={2200}><DesktopAbout /></DCArtboard>
          <DCArtboard id="dpa" label="06 · Palarnia"         width={DESK_W} height={2400}><DesktopPalarnia /></DCArtboard>
          <DCArtboard id="df"  label="07 · FAQ · pomoc"      width={DESK_W} height={1500}><DesktopFAQ /></DCArtboard>
          <DCArtboard id="dco" label="08 · Kontakt"          width={DESK_W} height={1500}><DesktopContact /></DCArtboard>
          <DCArtboard id="dc"  label="09 · Cart drawer"      width={DESK_W} height={DESK_H}><DesktopCart /></DCArtboard>
          <DCArtboard id="ds"  label="(+) Search overlay"    width={DESK_W} height={DESK_H}><DesktopSearch /></DCArtboard>
        </DCSection>

        <DCSection id="mobile" title="Mobile · 390×780" subtitle="Uporządkowane: bezpieczny spacing, sticky CTA bez przykrycia treści, rytm kart">
          <DCArtboard id="mh"  label="01 · Home"           width={MOBILE_W} height={MOBILE_H}><MobileHome /></DCArtboard>
          <DCArtboard id="ml"  label="02 · Produkty"       width={MOBILE_W} height={MOBILE_H}><MobileListing /></DCArtboard>
          <DCArtboard id="mp"  label="03 · Karta produktu" width={MOBILE_W} height={MOBILE_H}><MobilePDP /></DCArtboard>
          <DCArtboard id="mm"  label="04 · Menu"           width={MOBILE_W} height={MOBILE_H}><MobileMenu /></DCArtboard>
          <DCArtboard id="ms"  label="05 · Search overlay" width={MOBILE_W} height={MOBILE_H}><MobileSearch /></DCArtboard>
          <DCArtboard id="mc"  label="06 · Koszyk drawer"  width={MOBILE_W} height={MOBILE_H}><MobileCart /></DCArtboard>
          <DCArtboard id="mec" label="07 · Empty cart"     width={MOBILE_W} height={MOBILE_H}><MobileEmptyCart /></DCArtboard>
          <DCArtboard id="mf"  label="08a · FAQ"           width={MOBILE_W} height={MOBILE_H}><MobileFAQ /></DCArtboard>
          <DCArtboard id="mco" label="08b · Kontakt"       width={MOBILE_W} height={MOBILE_H}><MobileContact /></DCArtboard>
        </DCSection>

        <DCSection id="notes" title="Notatki wdrożeniowe v2.1" subtitle="Co zmienione, komponenty, tokeny, responsive, Claude Code">
          <DCArtboard id="nt" label="Notatki + handoff" width={1280} height={2400}>
            <NotesBoard />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </div>
  );
}

// ── Brief board ──────────────────────────────────────────────────────
function BriefBoard() {
  return (
    <div style={{ padding: 56, background: 'var(--aura-paper)', height: '100%' }}>
      <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 18 }}>Aura Storefront · v2.1 · 2026</div>
      <h1 style={{ fontSize: 64, letterSpacing: '-0.035em', lineHeight: 0.95 }}>Coffee club.<br/>Bez chaosu.</h1>
      <p style={{ marginTop: 22, fontSize: 16, color: 'var(--aura-ink-2)', lineHeight: 1.55, maxWidth: 580 }}>
        Druga iteracja — czarno-biała baza, mocny pomarańcz, ilustracje brandowe i mocna typografia, ale nadal nowoczesny, sprzedażowy layout. Drop 01 buduje świat marki, nie odbiera UX.
      </p>

      <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Pill l="Stack" v="Next.js · Tailwind · Shopify Storefront API" />
        <Pill l="Język" v="100% PL · konkret, miejski ton" />
        <Pill l="Primary" v="Pomarańcz (#FF4D17) jako akcent CTA" />
        <Pill l="Type" v="Archivo · DM Sans · JetBrains Mono" />
        <Pill l="Tożsamość" v="Starburst + ilustracje + mono UI" />
        <Pill l="Format" v="Mobile-first, premium e-commerce" />
      </div>

      <div className="divider" style={{ margin: '36px 0' }} />

      <div className="eyebrow" style={{ marginBottom: 18 }}>Decyzje projektowe</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['Layout', 'Klasyczna siatka e-commerce. Charakter dodajemy sekcjami break\'owymi (czarne) i pomarańczowym CTA — nie ozdobnikami.'],
          ['Ilustracje', 'Starbursty + uproszczone figurki w hero, na produkcie i jako trust. Nigdy w treści tam, gdzie szkodzą czytelności.'],
          ['Pomarańcz', '≈10% powierzchni. CTA, hovery, akcenty w nagłówkach, badge\'y. Cała reszta — paper, ink, line.'],
          ['Mono', 'Eyebrow, badge\'y, SKU, daty palenia. Buduje klimat coffee clubu bez krzyczenia.'],
          ['Ton', 'Konkret. „Robi robotę". „Świeżo palona. Gotowa do wysyłki." Nie „magia aromatu".'],
          ['Nawigacja', 'Produkty · Blendy · O marce · Palarnia · FAQ · Kontakt. Espresso/Filtrowe/Decaf żyją jako filtry, nie jako sekcje nav.'],
        ].map(([k, v]) => (
          <li key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 18 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--aura-orange)', paddingTop: 3 }}>{k}</span>
            <span style={{ fontSize: 15, lineHeight: 1.55 }}>{v}</span>
          </li>
        ))}
      </ul>

      <div className="divider" style={{ margin: '36px 0' }} />

      <div className="eyebrow" style={{ marginBottom: 14 }}>Co dostajesz</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {['9 widoków desktop', '9 widoków mobile', '15+ komponentów', 'Tokeny + Tailwind config', 'Handoff Next.js + Shopify', 'Metafields schema'].map(t => (
          <div key={t} className="card" style={{ padding: 14, fontSize: 13, fontWeight: 500 }}>
            <Icon.check style={{ color: 'var(--aura-orange)', marginRight: 6, verticalAlign: 'middle' }} /> {t}
          </div>
        ))}
      </div>
    </div>
  );
}
function Pill({ l, v }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 4 }}>{l}</div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
    </div>
  );
}

// ── Brand DNA board ──────────────────────────────────────────────────
function BrandDNABoard() {
  return (
    <div style={{ padding: 40, background: 'var(--aura-ink)', color: '#fff', height: '100%' }}>
      <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Brand DNA</div>
      <h2 style={{ fontSize: 48, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.95 }}>Co z planszy bierzemy.</h2>

      <div style={{ marginTop: 36 }}>
        <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Burst — sygnatura marki</div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'space-between' }}>
          <Starburst color="var(--aura-orange)" size={120} points={11} depth={0.22}>
            <FigureRunner size={56} color="#0E0E0C" />
          </Starburst>
          <Starburst color="var(--aura-green)" size={120} points={11} depth={0.22}>
            <FigureRunner size={56} color="#0E0E0C" />
          </Starburst>
          <Starburst color="var(--aura-purple)" size={120} points={11} depth={0.22}>
            <FigureRunner size={56} color="#0E0E0C" />
          </Starburst>
        </div>
        <p style={{ marginTop: 18, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>
          Pomarańcz = brand primary. Zielony i fioletowy używamy wyłącznie jako akcenty konkretnych blendów (Verde, Lila).
        </p>
      </div>

      <div className="divider" style={{ background: 'rgba(255,255,255,0.1)', margin: '32px 0' }} />

      <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Packshoty</div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <CoffeeBag width={110} accent="var(--aura-orange)" name="" sub="" />
        <CoffeeBag width={110} accent="var(--aura-green)" name="" sub="" />
        <CoffeeBag width={110} accent="var(--aura-purple)" name="" sub="" />
      </div>

      <div className="divider" style={{ background: 'rgba(255,255,255,0.1)', margin: '32px 0' }} />

      <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Wordmark</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
        <AuraMark size={36} color="#fff" tagline />
        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 8 }}>
          <AuraMark size={36} color="var(--aura-ink)" tagline />
        </div>
      </div>

      <div className="divider" style={{ background: 'rgba(255,255,255,0.1)', margin: '32px 0' }} />

      <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Ton · próbki</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          'Kawa z charakterem. Palona na świeżo.',
          'Wybierz blend pod swój rytuał.',
          'Ziarno, które robi robotę.',
          'Świeżo palona. Gotowa do wysyłki.',
        ].map(t => (
          <li key={t} style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', color: '#fff' }}>
            <span style={{ color: 'var(--aura-orange)' }}>„</span>{t}<span style={{ color: 'var(--aura-orange)' }}>"</span>
          </li>
        ))}
      </ul>

      <div className="divider" style={{ background: 'rgba(255,255,255,0.1)', margin: '32px 0' }} />

      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
        Geometrie placeholderowe — produkcyjne ilustracje drop-in podczas wdrożenia.
      </div>
    </div>
  );
}

// ── Changelog v2 → v2.1 ──────────────────────────────────────────────
function ChangelogBoard() {
  const changes = [
    { area: 'Nawigacja', d: 'Sklep / Jak parzyć / Historia marki → Produkty / Blendy / O marce / Palarnia / FAQ / Kontakt. Espresso/Filtrowe/Decaf/Sprzęt zeszły z poziomu nav do filtrów listingu.' },
    { area: 'Hero (desktop)', d: 'Zamiast posterowego ucięcia — kontrolowany 2-kolumnowy układ. H1 116px (zamiast 160px), pełna czytelność, ilustracja zamknięta w siatce, akcent „DROP 01" jako celowy detal.' },
    { area: 'Hero (mobile)', d: 'Hero stacked: tytuł + sub + zamknięty blok ilustracji w aspect ratio, na końcu CTA. Bez wypadającego burstu.' },
    { area: 'Listing desktop', d: 'Ciężki sidebar filtrów usunięty. Poziomy pasek: chipy kategorii + przycisk „Filtry" + sortowanie po prawej. Grid 4-kolumnowy, więcej powietrza. Aktywne filtry jako chipy nad gridem.' },
    { area: 'Nowe widoki', d: 'Dodane: Blendy (porównawcza tabela + selektor pomocnik), Palarnia (proces 5 kroków + odwiedziny), Kontakt (kanały + formularz).' },
    { area: 'Mobile cart drawer', d: 'Bezpieczne paddingi (20/24), wyraźny „Razem" w bold 22px, podział na suma częściowa / dostawa / razem.' },
    { area: 'Mobile sticky CTA', d: 'Element poza scroll containerem (siostro), nie nachodzi na treść — flex-1 scroll redukuje się o jego wysokość automatycznie.' },
    { area: 'Mobile menu', d: 'Skrócone: 6 pozycji (Produkty/Blendy/O marce/Palarnia/FAQ/Kontakt), pełnoekranowe CTA „Sprawdź kawy" na dole.' },
    { area: 'Komponenty', d: 'Nowe: BlendComparison (tabela), ProcessSteps, ContactForm, ChipGroup horizontal. Reszta jak v2.' },
    { area: 'Footer', d: 'Kolumna „Sklep" zaktualizowana: Wszystkie kawy / Blendy / Subskrypcja / Karta podarunkowa. Bez kategorii produktowych.' },
  ];
  return (
    <div style={{ padding: 48, background: 'var(--aura-paper)', height: '100%' }}>
      <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Zmiany · v2 → v2.1</div>
      <h2 style={{ fontSize: 52, letterSpacing: '-0.035em', lineHeight: 0.95 }}>Co poprawione.</h2>
      <p style={{ marginTop: 16, fontSize: 14, color: 'var(--aura-muted)', lineHeight: 1.55, maxWidth: 480 }}>
        Kierunek wizualny zachowany. Wszystkie poprawki celują w UX, czytelność i strukturę produktową.
      </p>
      <div className="divider" style={{ margin: '28px 0' }} />
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {changes.map((c, i) => (
          <li key={c.area} style={{ display: 'grid', gridTemplateColumns: '24px 130px 1fr', gap: 14, alignItems: 'flex-start' }}>
            <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--aura-orange)', paddingTop: 2 }}>{String(i+1).padStart(2, '0')}</span>
            <span style={{ fontWeight: 700, fontSize: 14, paddingTop: 1 }}>{c.area}</span>
            <span style={{ fontSize: 13, color: 'var(--aura-ink-2)', lineHeight: 1.5 }}>{c.d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Notes & handoff ──────────────────────────────────────────────────
function NotesBoard() {
  return (
    <div style={{ width: 1280, padding: 64, background: 'var(--aura-paper)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, paddingBottom: 20, borderBottom: '2px solid var(--aura-ink)' }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Aura Storefront v2.1 · notatki + handoff</div>
          <h1 style={{ fontSize: 80, letterSpacing: '-0.035em' }}>Gotowe do wdrożenia.</h1>
        </div>
        <AuraMark size={28} tagline />
      </header>

      {/* 1 — komponenty */}
      <NoteSection num="01" title="Główne komponenty">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            'Header', 'Footer', 'Ticker', 'TrustStrip',
            'ProductCard', 'ProductGrid', 'ProductGallery',
            'VariantSelector (Pills)', 'QtyStepper',
            'CartDrawer', 'CartLine', 'FreeShippingProgress', 'EmptyCart',
            'SearchOverlay', 'MobileMenu', 'FilterBar', 'FilterDropdown',
            'BlendComparison', 'BlendPicker', 'ProcessSteps',
            'ContactForm', 'FAQAccordion', 'Hero', 'SectionHead',
            'Starburst', 'FigureRunner', 'CoffeeBag', 'AuraMark',
            'Chip', 'Button', 'Field', 'Tile',
          ].map(c => (
            <div key={c} className="card" style={{ padding: '10px 14px', fontFamily: 'var(--aura-mono)', fontSize: 12 }}>{c}</div>
          ))}
        </div>
      </NoteSection>

      {/* 2 — tokens */}
      <NoteSection num="02" title="Tokeny kolorów">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <Swatch n="ink"            hex="#0E0E0C" />
          <Swatch n="ink-2"          hex="#1B1A17" />
          <Swatch n="paper"          hex="#FAF8F4" />
          <Swatch n="paper-2"        hex="#F3F0E9" />
          <Swatch n="line"           hex="#E6E2D8" />
          <Swatch n="muted"          hex="#6E6A60" />
          <Swatch n="orange"         hex="#FF4D17" />
          <Swatch n="orange-deep"    hex="#E03A04" />
          <Swatch n="orange-soft"    hex="#FFE3D2" />
          <Swatch n="green"          hex="#2EA12E" />
          <Swatch n="purple"         hex="#6F4FD4" />
          <Swatch n="white"          hex="#FFFFFF" />
        </div>
      </NoteSection>

      {/* 3 — responsive */}
      <NoteSection num="03" title="Zasady responsive">
        <div className="card" style={{ padding: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid var(--aura-line)' }}>
              <Th>Breakpoint</Th><Th>Container</Th><Th>Grid produktów</Th><Th>Hero H1</Th><Th>Nav</Th><Th>Filtry listingu</Th>
            </tr></thead>
            <tbody>
              <RespRow b="sm < 640"      c="20px gutter" g="2 col"     h="52px"  hd="burger + logo + cart"     n="bottom-drawer" />
              <RespRow b="md 640–1024"   c="32px gutter" g="3 col"     h="80px"  hd="burger + logo + nav-lite"  n="dropdown" />
              <RespRow b="lg 1024–1440"  c="64px gutter" g="3–4 col"   h="100px" hd="pełny nav"                  n="horizontal chips" />
              <RespRow b="xl 1440+"      c="80px gutter" g="4 col"     h="116px" hd="pełny nav"                  n="horizontal chips" />
            </tbody>
          </table>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 16 }}>
          <NoteCard t="Touch targets" d="min. 44px wysokości. Stepper, chipy, CTA — wszystkie ≥44." />
          <NoteCard t="Sticky behavior" d="Sticky add-to-cart wyłącznie sm/md. Element zewnętrzny vs scroll — nigdy nie zasłania treści." />
          <NoteCard t="Images" d="srcset 1x/2x · WebP/AVIF · aspect-ratio fixed na placeholdze, żeby uniknąć CLS." />
        </div>
      </NoteSection>

      {/* 4 — handoff */}
      <NoteSection num="04" title="Uwagi do wdrożenia w Claude Code">
        <div className="card" style={{ padding: 28, background: 'var(--aura-ink)', color: '#fff', border: 'none' }}>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Stack docelowy</div>
          <div className="mono" style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
            Next.js 14 (App Router) · React 18 · Tailwind v3 · Shopify Storefront API (GraphQL) · Vercel · TypeScript
          </div>

          <div style={{ height: 24 }} />
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Struktura routes</div>
          <pre className="mono" style={{ fontSize: 12, lineHeight: 1.55, color: 'rgba(255,255,255,0.8)', margin: 0, whiteSpace: 'pre-wrap' }}>{`app/
  page.tsx               // Home
  produkty/page.tsx      // Listing (default sort: BEST_SELLING)
  produkty/[handle]/     // PDP
  blendy/page.tsx        // BlendComparison + picker
  o-marce/page.tsx       // Brand story
  palarnia/page.tsx      // Roastery process
  faq/page.tsx           // FAQ accordion + tiles
  kontakt/page.tsx       // Form + channels`}</pre>

          <div style={{ height: 24 }} />
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Tailwind tokens</div>
          <pre className="mono" style={{ fontSize: 12, lineHeight: 1.55, color: 'rgba(255,255,255,0.8)', margin: 0, whiteSpace: 'pre-wrap' }}>{`colors: {
  ink:    { DEFAULT: '#0E0E0C', 2: '#1B1A17' },
  paper:  { DEFAULT: '#FAF8F4', 2: '#F3F0E9' },
  line:   { DEFAULT: '#E6E2D8' },
  brand:  { DEFAULT: '#FF4D17', deep: '#E03A04', soft: '#FFE3D2' },
  accent: { green: '#2EA12E', purple: '#6F4FD4' },
  muted:  { DEFAULT: '#6E6A60', 2: '#99948A' },
},
fontFamily: {
  display: ['Archivo', 'sans-serif'],
  text:    ['"DM Sans"', 'sans-serif'],
  mono:    ['"JetBrains Mono"', 'monospace'],
},
borderRadius: { xs: '4px', sm: '8px', md: '14px', lg: '22px', full: '999px' },`}</pre>

          <div style={{ height: 24 }} />
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Shopify Storefront API</div>
          <ul style={{ fontSize: 13, lineHeight: 1.7, paddingLeft: 18, margin: 0, color: 'rgba(255,255,255,0.85)' }}>
            <li><span className="mono">products(first: 24, query)</span> — listing z filtrami (collection / tags / vendor / sortKey)</li>
            <li><span className="mono">productByHandle(handle)</span> — PDP + variants + metafields (origin/roast/notes/methods)</li>
            <li><span className="mono">cartCreate / cartLinesAdd / cartLinesUpdate / cartLinesRemove</span> — cart drawer</li>
            <li><span className="mono">predictiveSearch</span> — search overlay (debounce 250ms, min 2 znaki)</li>
            <li><span className="mono">cart.checkoutUrl</span> — przekierowanie do Shopify Checkout (nie projektujemy własnego)</li>
          </ul>

          <div style={{ height: 24 }} />
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Metafields produktu (Shopify Admin)</div>
          <ul style={{ fontSize: 13, lineHeight: 1.7, paddingLeft: 18, margin: 0, color: 'rgba(255,255,255,0.85)' }}>
            <li><span className="mono">aura.origin</span> · single-line text (np. „Brazylia · Cerrado")</li>
            <li><span className="mono">aura.roast_level</span> · int 1–5 (RoastBar)</li>
            <li><span className="mono">aura.process</span> · single-line text (Natural / Washed / Honey / Decaf)</li>
            <li><span className="mono">aura.notes</span> · list.single_line text</li>
            <li><span className="mono">aura.methods</span> · list.single_line text</li>
            <li><span className="mono">aura.accent_color</span> · color (orange / green / purple)</li>
            <li><span className="mono">aura.badge</span> · single-line text (Bestseller / Limited / Decaf)</li>
            <li><span className="mono">aura.roast_date</span> · date (trust-notes „Palona X")</li>
            <li><span className="mono">aura.body / acid / sweet</span> · int 1–5 (BlendComparison)</li>
          </ul>

          <div style={{ height: 24 }} />
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Ilustracje · assety</div>
          <ul style={{ fontSize: 13, lineHeight: 1.7, paddingLeft: 18, margin: 0, color: 'rgba(255,255,255,0.85)' }}>
            <li>Burst + figurki w designie są <strong>placeholderami geometrycznymi</strong>. Produkcyjne ilustracje (z brandboardu) wrzucamy jako SVG do <span className="mono">/public/brand/illustrations/</span> i podmieniamy w komponencie <span className="mono">&lt;BurstBadge /&gt;</span>.</li>
            <li>Packshoty kawowych worków: prawdziwe zdjęcia bagów na transparent PNG / WebP, ~1200×1500. Komponent <span className="mono">&lt;CoffeeBag /&gt;</span> SVG zostaje jako fallback / loading state.</li>
            <li>Lifestyle: 4×5 portretowe, monochromatyczne tonowanie (np. mild S-curve), bez filtrów.</li>
          </ul>
        </div>
      </NoteSection>

      <footer style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid var(--aura-line)', display: 'flex', justifyContent: 'space-between' }}>
        <AuraMark size={18} tagline />
        <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>v2.1 · ready for handoff</span>
      </footer>
    </div>
  );
}
function NoteSection({ num, title, children }) {
  return (
    <section style={{ marginBottom: 56 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'baseline', marginBottom: 24 }}>
        <span className="mono" style={{ color: 'var(--aura-orange)', fontWeight: 700, fontSize: 13 }}>{num}</span>
        <h2 style={{ fontSize: 44, letterSpacing: '-0.03em' }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
function Swatch({ n, hex }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ background: hex, height: 64 }} />
      <div style={{ padding: 10 }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{n}</div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--aura-muted)', marginTop: 2 }}>{hex}</div>
      </div>
    </div>
  );
}
function NoteCard({ t, d }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{t}</div>
      <div style={{ fontSize: 13, color: 'var(--aura-muted)', lineHeight: 1.5 }}>{d}</div>
    </div>
  );
}
function Th({ children }) { return <th style={{ padding: '10px 12px', fontFamily: 'var(--aura-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--aura-muted)', fontWeight: 500 }}>{children}</th>; }
function RespRow({ b, c, g, h, hd, n }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--aura-line)' }}>
      <td style={td()}><span className="mono" style={{ color: 'var(--aura-orange)' }}>{b}</span></td>
      <td style={td()}>{c}</td>
      <td style={td()}>{g}</td>
      <td style={td()}><span className="mono">{h}</span></td>
      <td style={td()}>{hd}</td>
      <td style={td()}>{n}</td>
    </tr>
  );
}
function td() { return { padding: '12px 12px', fontSize: 13, verticalAlign: 'top' }; }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
