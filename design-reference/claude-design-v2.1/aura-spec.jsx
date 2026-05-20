/* eslint-disable no-undef */
/* Aura — design specification artboard (tokens, type, components, UX notes) */

function SpecBoard() {
  return (
    <div style={{ width: 1280, padding: 72, background: 'var(--aura-paper)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, paddingBottom: 24, borderBottom: '2px solid var(--aura-ink)' }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Aura Storefront v2 · Design spec</div>
          <h1 style={{ fontSize: 100, letterSpacing: '-0.035em' }}>Co tu jest.</h1>
          <p style={{ marginTop: 16, fontSize: 16, color: 'var(--aura-muted)', maxWidth: 540, lineHeight: 1.55 }}>
            Tokeny, typografia, komponenty, UX notes i handoff dla Claude Code. Wszystko z czego zbudowany jest sklep — w jednym miejscu.
          </p>
        </div>
        <AuraMark size={32} tagline />
      </header>

      {/* 1. Design direction */}
      <SpecSection num="01" title="Design direction">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <h3 style={{ fontSize: 28, marginBottom: 14, letterSpacing: '-0.02em' }}>Premium coffee club. Bez przebrania.</h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--aura-ink-2)' }}>
              Czarno-biała baza, pomarańcz jako akcent, ilustracje brandowe jako sygnatura — ale nadal nowoczesny, sprzedażowy layout e-commerce. Trzymamy się klasycznego rytmu siatek, dużych zdjęć produktowych i czytelnej typografii, a charakter dodajemy w detalach: starbursty, mocna typografia display, miejski język, mono jako element brandowy.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['Nie', 'Komiksowy chaos · przesadny luksus · generyczny Shopify · zalanie pomarańczem · stockowe ilustracje'],
              ['Tak', 'Coffee club energy · merch drop · jakościowe foto produktu · mono jako element systemu · czarne sekcje break\'owe'],
            ].map(([k, v]) => (
              <div key={k} style={{
                padding: 18, borderRadius: 14,
                background: k === 'Tak' ? 'var(--aura-ink)' : '#fff',
                color: k === 'Tak' ? '#fff' : 'var(--aura-ink)',
                border: k === 'Tak' ? 'none' : '1px solid var(--aura-line)',
              }}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: k === 'Tak' ? 'var(--aura-orange)' : 'var(--aura-muted)', marginBottom: 8 }}>{k}</div>
                <div style={{ fontSize: 14, lineHeight: 1.5 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </SpecSection>

      {/* 2. Kolory */}
      <SpecSection num="02" title="Kolory · design tokens">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <Swatch n="aura.ink" hex="#0E0E0C" label="Tekst, ciemne sekcje, ink-CTA" />
          <Swatch n="aura.paper" hex="#FAF8F4" label="Baza tła, ciepły off-white" />
          <Swatch n="aura.paper-2" hex="#F3F0E9" label="Sekcje break, surface-2" />
          <Swatch n="aura.line" hex="#E6E2D8" label="Border, divider" />
          <Swatch n="aura.orange" hex="#FF4D17" label="Primary CTA, accent" big />
          <Swatch n="aura.orange-deep" hex="#E03A04" label="Hover orange" />
          <Swatch n="aura.green" hex="#2EA12E" label="Sekundarny — produkt (filtr)" />
          <Swatch n="aura.purple" hex="#6F4FD4" label="Sekundarny — produkt (deep)" />
        </div>
        <div className="card" style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Zasady użycia pomarańczu</div>
            <ul style={{ fontSize: 14, lineHeight: 1.7, paddingLeft: 18, margin: 0, color: 'var(--aura-ink-2)' }}>
              <li>CTA, badge'y, hover linków, akcenty w nagłówkach</li>
              <li>Tinted background (~10% powierzchni sekcji)</li>
              <li>Nigdy jako primary background całej strony</li>
              <li>Stosunek pomarańczu do bazy ≈ 1 : 9</li>
            </ul>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Drugorzędne (produktowe)</div>
            <ul style={{ fontSize: 14, lineHeight: 1.7, paddingLeft: 18, margin: 0, color: 'var(--aura-ink-2)' }}>
              <li>Green i purple wyłącznie na ilustracji / packshocie / chip jednego produktu</li>
              <li>Nigdy razem w jednej sekcji jako akcenty UI</li>
              <li>Pomarańcz pozostaje primary brand color</li>
            </ul>
          </div>
        </div>
      </SpecSection>

      {/* 3. Typografia */}
      <SpecSection num="03" title="Typografia">
        <div className="card" style={{ padding: 32, marginBottom: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 18, color: 'var(--aura-orange)' }}>Display · Archivo 800</div>
          <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 100, lineHeight: 0.9, letterSpacing: '-0.035em' }}>
            Kawa z charakterem.
          </div>
          <div className="mono" style={{ marginTop: 16, fontSize: 11, color: 'var(--aura-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            H1 · 100/120 px · letter-spacing -0.035em · tracking-tight
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="eyebrow" style={{ marginBottom: 14, color: 'var(--aura-orange)' }}>Text · DM Sans 400/500/600</div>
            <p style={{ fontFamily: 'var(--aura-text)', fontSize: 18, fontWeight: 500, lineHeight: 1.4 }}>Świeżo palona. Gotowa do wysyłki. Tekst body trzyma czytelność na każdym ekranie.</p>
            <div className="mono" style={{ marginTop: 12, fontSize: 11, color: 'var(--aura-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Body M · 16/24 · 1.55 line-height</div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <div className="eyebrow" style={{ marginBottom: 14, color: 'var(--aura-orange)' }}>Mono · JetBrains Mono</div>
            <div className="mono" style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--aura-ink)' }}>SKU · 250G · ZIARNO<br/>WYSYŁKA · 24H · DPD<br/>PALONA · 8.11.2025</div>
            <div className="mono" style={{ marginTop: 12, fontSize: 11, color: 'var(--aura-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Eyebrow · tags · sku · brand voice</div>
          </div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--aura-line)' }}>
                <Th>Token</Th><Th>Family</Th><Th>Wght</Th><Th>Size · LH</Th><Th>Use</Th>
              </tr>
            </thead>
            <tbody>
              <TypeRow t="display/hero" f="Archivo" w={800} s="160 / 0.9" u="Desktop hero H1" />
              <TypeRow t="display/section" f="Archivo" w={800} s="72 / 0.95" u="Section heads, About" />
              <TypeRow t="display/card" f="Archivo" w={800} s="28 / 1.05" u="Product card title, PDP" />
              <TypeRow t="text/body-l" f="DM Sans" w={500} s="18 / 1.5" u="Hero subtitle, manifest" />
              <TypeRow t="text/body" f="DM Sans" w={400} s="14 / 1.55" u="Default body, p" />
              <TypeRow t="text/label" f="DM Sans" w={600} s="13 / 1.2" u="Buttons, links, nav" />
              <TypeRow t="mono/eyebrow" f="JetBrains Mono" w={500} s="11 / 1 · +0.14em" u="UPPER eyebrows, tags" />
              <TypeRow t="mono/sku" f="JetBrains Mono" w={500} s="10 / 1 · +0.1em" u="SKU, meta, badges" />
            </tbody>
          </table>
        </div>
      </SpecSection>

      {/* 4. Komponenty */}
      <SpecSection num="04" title="Komponenty">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
          <ComponentBox title="Buttons">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
              <button className="btn">Dodaj do koszyka</button>
              <button className="btn btn-ink">Przejdź do kasy</button>
              <button className="btn btn-ghost">Sprawdź kawy</button>
              <button className="btn btn-sm">Quick add</button>
            </div>
          </ComponentBox>
          <ComponentBox title="Chips · pills">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <span className="chip">Espresso</span>
              <span className="chip active">Wybrane</span>
              <span className="chip orange">Czekolada</span>
              <span className="chip">+ filtr</span>
            </div>
          </ComponentBox>
          <ComponentBox title="QtyStepper">
            <QtyStepper value={2} onChange={() => {}} />
          </ComponentBox>
          <ComponentBox title="VariantPills">
            <VariantPills options={['250g', '500g', '1kg']} value="500g" onChange={() => {}} />
          </ComponentBox>
          <ComponentBox title="Eyebrow · star burst">
            <Starburst color="var(--aura-orange)" size={80} points={11} depth={0.22}>
              <FigureRunner size={42} />
            </Starburst>
          </ComponentBox>
          <ComponentBox title="ProductCard · compact">
            <div style={{ maxWidth: 200 }}>
              <ProductCard p={AURA_PRODUCTS[0]} compact />
            </div>
          </ComponentBox>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Mapowanie na komponenty React (handoff)</div>
          <div className="mono" style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--aura-ink-2)' }}>
            Header · Footer · ProductCard · ProductGrid · ProductDetail · VariantSelector · QuantitySelector · CartDrawer · SearchOverlay · MobileMenu · FilterDrawer · TrustNotes · BlendComparison · Ticker · Hero · NewsletterCTA
          </div>
        </div>
      </SpecSection>

      {/* 5. UX notes */}
      <SpecSection num="05" title="UX notes">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <UXNote t="Sticky add-to-cart (mobile PDP)" d="Pojawia się po przejściu nad fold, dolny pas z QtyStepper + CTA + ceną. Zachowuje wybrany wariant." />
          <UXNote t="Quick add na listingu" d="Pojawia się po hoverze na desktopie, zawsze widoczny na mobile. Dodaje wariant domyślny (250g, ziarno). Toast potwierdzający." />
          <UXNote t="Free shipping progress" d="Pasek w cart drawer pokazujący progres do 150 zł. Mikrocopy zmienia się dynamicznie: 'Dodaj jeszcze X zł' → 'Masz darmową wysyłkę. Brawo.'" />
          <UXNote t="Empty cart state" d="Dedykowany ekran z mikrocopy ('Koszyk śpi.') i rekomendowanymi produktami. CTA prowadzi do listingu." />
          <UXNote t="Search overlay" d="Sugerowane tagi → wyniki real-time (debounce 200ms). Najpierw produkty (z packshotem), potem kategorie, potem 'Ostatnio szukane'." />
          <UXNote t="Mobile filters" d="Pełny drawer od dołu z sekcjami collapsible. Sticky CTA 'Pokaż 14 produktów'. Aktywne filtry jako chipy na górze listingu." />
          <UXNote t="Variant defaults" d="PDP otwiera się z najtańszym wariantem (250g, ziarno). Zmiana wariantu nie skutkuje reloadem, tylko update ceny." />
          <UXNote t="Hover/focus states" d="Karty produktu — lekkie podniesienie i cieniem. Linki tekstowe — pomarańczowy underline. Inputy — orange outline 2px focus-visible." />
        </div>
      </SpecSection>

      {/* 6. Responsive */}
      <SpecSection num="06" title="Responsive behavior">
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--aura-line)' }}>
                <Th>Breakpoint</Th><Th>Container</Th><Th>Grid</Th><Th>Header</Th><Th>Notes</Th>
              </tr>
            </thead>
            <tbody>
              <RespRow b="sm < 640" c="20px gutter" g="2 col cards" h="hamburger + logo + cart" n="Sticky search/CTA, drawer od bottom" />
              <RespRow b="md 640–1024" c="32px gutter" g="3 col cards" h="hamburger + logo + nav-lite" n="Sidebar filters jako drawer" />
              <RespRow b="lg 1024–1440" c="64px gutter" g="3 col cards · 4 hero" h="pełen nav + mega menu" n="Sticky header z scroll-blur" />
              <RespRow b="xl 1440+" c="80px gutter" g="4 col cards" h="pełen nav" n="Hero 160px H1, max-width 1600" />
            </tbody>
          </table>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[
            { t: 'Touch targets', d: 'min. 44px wysokości. Stepper, chipy, CTA — wszystkie ≥44.' },
            { t: 'Sticky behavior', d: 'Header tylko od md. Add-to-cart sticky tylko na sm/md.' },
            { t: 'Image strategy', d: 'srcset 1x/2x · WebP/AVIF · aspect-ratio fixed na placeholdze, żeby uniknąć CLS.' },
          ].map(x => (
            <div key={x.t} className="card" style={{ padding: 18 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{x.t}</div>
              <div style={{ fontSize: 13, color: 'var(--aura-muted)', lineHeight: 1.5 }}>{x.d}</div>
            </div>
          ))}
        </div>
      </SpecSection>

      {/* 7. Animacje */}
      <SpecSection num="07" title="Animacje · micro-interactions">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Anim t="Cart drawer" d="Slide-in z prawej, 280ms ease-out. Backdrop fade 200ms. Cart icon — pomarańczowy puls + counter bump po dodaniu." />
          <Anim t="Quick add → toast" d="Karta produktu zaznacza się na 400ms (orange ring), toast wjeżdża od dołu na 320ms. Auto-dismiss po 3s." />
          <Anim t="Star burst rotation" d="Ilustracja w hero rotuje wolno (~30s/full turn) bez akcentu. Na hoverze przyspiesza do 8s." />
          <Anim t="Ticker marquee" d="Liniowa pętla, ~40s na cykl. Pauza on-hover." />
          <Anim t="Variant pill" d="Active state — background slide z lewej na prawą (200ms). Color contrast się przerysowuje." />
          <Anim t="Free shipping progress" d="Pasek rośnie 600ms cubic-bezier(.2,.7,.3,1) na zmianę subtotalu. Confetti emoji przy crossover ≥150 zł." />
          <Anim t="Search overlay" d="Fade + scale 0.98→1, 240ms. Pierwszy input auto-focus." />
          <Anim t="PDP gallery" d="Crossfade między zdjęciami 180ms. Mobile — swipe z momentum." />
        </div>
      </SpecSection>

      {/* 8. Handoff */}
      <SpecSection num="08" title="Handoff dla Claude Code">
        <div className="card" style={{ padding: 28, background: 'var(--aura-ink)', color: '#fff', border: 'none' }}>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Stack docelowy</div>
          <div className="mono" style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
            Next.js 14 (App Router) · React 18 · Tailwind v3 · Shopify Storefront API (GraphQL) · Vercel
          </div>
          <div style={{ height: 24 }} />
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Struktura</div>
          <pre className="mono" style={{ fontSize: 12, lineHeight: 1.55, color: 'rgba(255,255,255,0.8)', margin: 0, whiteSpace: 'pre-wrap' }}>{`app/
  (storefront)/
    page.tsx             // Home
    sklep/
      page.tsx           // Listing
      [handle]/
        page.tsx         // PDP
    o-marce/page.tsx     // About
    pomoc/page.tsx       // FAQ
components/
  layout/        Header, Footer, Ticker, MobileMenu
  product/       ProductCard, ProductGrid, VariantSelector,
                 QuantitySelector, ProductGallery, BlendComparison
  cart/          CartDrawer, CartLine, FreeShippingProgress, EmptyCart
  search/        SearchOverlay
  primitives/    Button, Chip, Burst, FigureRunner, CoffeeBag, AuraMark
lib/
  shopify/       client.ts, queries.ts, types.ts
  utils/         formatPrice, slugify, debounce`}</pre>
          <div style={{ height: 24 }} />
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Tailwind tokens (do tailwind.config.js)</div>
          <pre className="mono" style={{ fontSize: 12, lineHeight: 1.55, color: 'rgba(255,255,255,0.8)', margin: 0, whiteSpace: 'pre-wrap' }}>{`colors: {
  ink: { DEFAULT: '#0E0E0C', 2: '#1B1A17' },
  paper: { DEFAULT: '#FAF8F4', 2: '#F3F0E9' },
  line: { DEFAULT: '#E6E2D8', strong: '#1B1A17' },
  brand: { DEFAULT: '#FF4D17', deep: '#E03A04', soft: '#FFE3D2' },
  accent: { green: '#2EA12E', purple: '#6F4FD4' },
  muted: { DEFAULT: '#6E6A60', 2: '#99948A' },
},
fontFamily: {
  display: ['Archivo', 'sans-serif'],
  text:    ['DM Sans', 'sans-serif'],
  mono:    ['JetBrains Mono', 'monospace'],
},
borderRadius: { xs: '4px', sm: '8px', md: '14px', lg: '22px' },`}</pre>
          <div style={{ height: 24 }} />
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Shopify Storefront API · zapytania</div>
          <ul style={{ fontSize: 13, lineHeight: 1.7, paddingLeft: 18, margin: 0, color: 'rgba(255,255,255,0.85)' }}>
            <li><span className="mono">products(first: 14, sortKey: BEST_SELLING)</span> — listing</li>
            <li><span className="mono">productByHandle(handle)</span> — PDP, z variants i metafields (roast, origin, notes)</li>
            <li><span className="mono">cartCreate / cartLinesAdd / cartLinesUpdate / cartLinesRemove</span> — koszyk</li>
            <li><span className="mono">predictiveSearch</span> — search overlay</li>
          </ul>
          <div style={{ height: 24 }} />
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Metafields produktu (do dodania w Shopify)</div>
          <ul style={{ fontSize: 13, lineHeight: 1.7, paddingLeft: 18, margin: 0, color: 'rgba(255,255,255,0.85)' }}>
            <li><span className="mono">aura.origin</span> · single-line text (np. "Brazylia · Cerrado")</li>
            <li><span className="mono">aura.roast_level</span> · int 1–5</li>
            <li><span className="mono">aura.process</span> · single-line text (Natural / Washed / Honey / Decaf)</li>
            <li><span className="mono">aura.notes</span> · list.single_line text (Czekolada, Orzech…)</li>
            <li><span className="mono">aura.methods</span> · list.single_line text</li>
            <li><span className="mono">aura.accent_color</span> · color (orange/green/purple)</li>
            <li><span className="mono">aura.badge</span> · single-line text (Bestseller / Limited / Decaf)</li>
            <li><span className="mono">aura.roast_date</span> · date (do trust-notes "Palona X")</li>
          </ul>
        </div>
      </SpecSection>

      <footer style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid var(--aura-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AuraMark size={20} tagline />
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>
          Spec v2 · 2026 · ready for handoff
        </div>
      </footer>
    </div>
  );
}

function SpecSection({ num, title, children }) {
  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'baseline', marginBottom: 32 }}>
        <span className="mono" style={{ color: 'var(--aura-orange)', fontWeight: 700, fontSize: 14, letterSpacing: '0.1em' }}>{num}</span>
        <h2 style={{ fontSize: 52, letterSpacing: '-0.03em' }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
function Swatch({ n, hex, label, big = false }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ background: hex, height: big ? 120 : 80 }} />
      <div style={{ padding: 14 }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{n}</div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--aura-muted)', marginTop: 4 }}>{hex}</div>
        <div style={{ fontSize: 12, color: 'var(--aura-muted)', marginTop: 8, lineHeight: 1.4 }}>{label}</div>
      </div>
    </div>
  );
}
function ComponentBox({ title, children }) {
  return (
    <div className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 200 }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>{title}</div>
      <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>{children}</div>
    </div>
  );
}
function Th({ children }) { return <th style={{ padding: '10px 12px', fontFamily: 'var(--aura-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--aura-muted)', fontWeight: 500 }}>{children}</th>; }
function TypeRow({ t, f, w, s, u }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--aura-line)' }}>
      <td style={td()}><span className="mono">{t}</span></td>
      <td style={td()}>{f}</td>
      <td style={td()}>{w}</td>
      <td style={td()}><span className="mono">{s}</span></td>
      <td style={td()}>{u}</td>
    </tr>
  );
}
function RespRow({ b, c, g, h, n }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--aura-line)' }}>
      <td style={td()}><span className="mono" style={{ color: 'var(--aura-orange)' }}>{b}</span></td>
      <td style={td()}>{c}</td>
      <td style={td()}>{g}</td>
      <td style={td()}>{h}</td>
      <td style={td()}>{n}</td>
    </tr>
  );
}
function td() { return { padding: '14px 12px', fontSize: 13, verticalAlign: 'top' }; }
function UXNote({ t, d }) {
  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{t}</div>
      <p style={{ fontSize: 13, color: 'var(--aura-muted)', lineHeight: 1.6 }}>{d}</p>
    </div>
  );
}
function Anim({ t, d }) {
  return (
    <div className="card" style={{ padding: 22, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--aura-orange)', marginTop: 8, flexShrink: 0 }} />
      <div>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>{t}</div>
        <p style={{ fontSize: 13, color: 'var(--aura-muted)', lineHeight: 1.6 }}>{d}</p>
      </div>
    </div>
  );
}

Object.assign(window, { SpecBoard });
