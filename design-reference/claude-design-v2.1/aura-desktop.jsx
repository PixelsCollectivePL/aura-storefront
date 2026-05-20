/* eslint-disable no-undef */
/* Desktop screens — 1440x900 viewport */

const DESK_W = 1440;
const DESK_H = 900;

function DeskShell({ children, bg = 'var(--aura-paper)', h = DESK_H }) {
  return (
    <div style={{
      width: DESK_W, height: h, background: bg, overflow: 'hidden',
      display: 'flex', flexDirection: 'column', position: 'relative'
    }}>{children}</div>
  );
}

// ── Desktop Home ─────────────────────────────────────────────────────
function DesktopHome() {
  return (
    <DeskShell h={2400}>
      <Header cartCount={2} />
      <Ticker items={['Drop 01 · 2026', 'Świeżo palona', 'Wysyłka 24h', 'Darmowa dostawa od 150 zł', 'Specialty grade']} />

      {/* Hero — controlled poster layout, grid-bounded */}
      <section style={{ background: 'var(--aura-ink)', color: '#fff', position: 'relative' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 64,
          padding: '88px 80px 96px', alignItems: 'center',
        }}>
          {/* Left — copy + CTA */}
          <div>
            <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 28 }}>Coffee club · drop 01 · 2026</div>
            <h1 style={{ fontSize: 116, color: '#fff', lineHeight: 0.92, letterSpacing: '-0.035em', maxWidth: 720 }}>
              Kawa z charakterem.<br/>
              <span style={{ color: 'var(--aura-orange)' }}>Palona</span> na świeżo.
            </h1>
            <p style={{ marginTop: 28, fontSize: 17, color: 'rgba(255,255,255,0.72)', maxWidth: 480, lineHeight: 1.55 }}>
              Specialty z polskiej palarni. Drop 01 zaczyna się od trzech blendów na każdy rytuał — espresso, filtr, wieczór.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 40 }}>
              <button className="btn" style={{ height: 56, padding: '0 28px', fontSize: 15 }}>Sprawdź kawy <Icon.arrow /></button>
              <button className="btn btn-ghost" style={{ background: 'transparent', borderColor: '#fff', color: '#fff', height: 56, padding: '0 28px', fontSize: 15 }}>Porównaj blendy</button>
            </div>
            {/* Inline trust strip */}
            <div style={{ display: 'flex', gap: 32, marginTop: 56 }}>
              {[['12kg', 'Wsad'], ['< 14d', 'Od palenia'], ['4.9 ★', '2 140 ocen']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 28, color: 'var(--aura-orange)', letterSpacing: '-0.02em' }}>{n}</div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — controlled illustration block */}
          <div style={{ position: 'relative', aspectRatio: '5 / 6', maxWidth: 540, justifySelf: 'center', width: '100%' }}>
            {/* main burst — fully contained */}
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <Starburst color="var(--aura-orange)" size={460} points={12} depth={0.22}>
                <FigureRunner size={220} color="#0E0E0C" />
              </Starburst>
            </div>
            {/* small accent burst, intentional placement */}
            <div style={{ position: 'absolute', right: -8, bottom: 18 }}>
              <Starburst color="var(--aura-paper)" size={86} points={10} depth={0.26}>
                <span className="mono" style={{ fontSize: 9, letterSpacing: '0.14em', fontWeight: 700, color: 'var(--aura-ink)' }}>DROP<br/>01</span>
              </Starburst>
            </div>
            {/* bag tucked at bottom-left for product anchor */}
            <div style={{ position: 'absolute', left: -16, bottom: -12 }}>
              <CoffeeBag width={140} accent="var(--aura-orange)" name="CORAÇÃO" sub="250g · świeżo palona" />
            </div>
          </div>
        </div>
      </section>

      {/* Wybrane blendy */}
      <section style={{ padding: '100px 80px' }}>
        <SectionHead eyebrow="Wybrane blendy" title="Pod twój rytuał." action="Wszystkie kawy" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {AURA_PRODUCTS.slice(0, 4).map(p => (
            <ProductCard key={p.id} p={p} onQuickAdd={() => {}} />
          ))}
        </div>
      </section>

      {/* Porównanie blendów */}
      <section style={{ padding: '100px 80px', background: 'var(--aura-paper-2)' }}>
        <SectionHead eyebrow="Porównaj" title="Trzy blendy. Trzy rytuały." />
        <BlendCompareDesk />
      </section>

      {/* Quality / freshness */}
      <section style={{ padding: '120px 80px', background: 'var(--aura-paper)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div className="ph" style={{ aspectRatio: '4 / 5', borderRadius: 22 }}>BARISTA · ESPRESSO POUR</div>
        <div>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 20 }}>Jakość</div>
          <h2 style={{ fontSize: 80, letterSpacing: '-0.03em', lineHeight: 0.95 }}>Świeżo palona. Gotowa do wysyłki.</h2>
          <p style={{ marginTop: 24, fontSize: 16, color: 'var(--aura-ink-2)', lineHeight: 1.55, maxWidth: 480 }}>
            Palimy w małych wsadach co tydzień. Wysyłamy w 24h. Trafia do ciebie, zanim pierwsze ziarno zdąży zwietrzeć.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 44 }}>
            {[
              { num: '01', t: 'Małe wsady', d: 'Partia 12kg.' },
              { num: '02', t: 'Direct trade', d: 'Znamy farmy.' },
              { num: '03', t: '< 14 dni', d: 'Od palenia do ciebie.' },
            ].map(x => (
              <div key={x.num}>
                <div className="mono" style={{ color: 'var(--aura-orange)', fontWeight: 700, marginBottom: 8 }}>{x.num}</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{x.t}</div>
                <div style={{ fontSize: 13, color: 'var(--aura-muted)', marginTop: 4 }}>{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand world / lifestyle */}
      <section style={{ padding: '100px 80px', background: 'var(--aura-ink)', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 16 }}>Brand world</div>
            <h2 style={{ fontSize: 72, color: '#fff', letterSpacing: '-0.03em' }}>Coffee club.<br/>Miejski. Bez ściemy.</h2>
          </div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 360, lineHeight: 1.55 }}>
            Palimy w Warszawie, pijemy wszędzie. Klimat speciality bez nadęcia — kawa, ludzie, ulica.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, gridAutoRows: '240px' }}>
          <div className="ph dark" style={{ borderRadius: 18, gridRow: 'span 2' }}>BARISTA / LIFESTYLE</div>
          <div className="ph dark" style={{ borderRadius: 18 }}>MERCH / TSHIRT</div>
          <div className="ph dark" style={{ borderRadius: 18 }}>PACKSHOT</div>
          <div className="ph dark" style={{ borderRadius: 18, gridRow: 'span 2' }}>CAFE INTERIOR</div>
          <div className="ph dark" style={{ borderRadius: 18, gridColumn: 'span 2' }}>ESPRESSO POUR · WIDE</div>
        </div>
      </section>

      {/* Reviews */}
      <section style={{ padding: '100px 80px', background: 'var(--aura-paper-2)' }}>
        <SectionHead eyebrow="Co mówią" title="4.9 ★ z 2 140 ocen." action="Zobacz wszystkie" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { t: 'Najlepsza kawa do mleka, jaką piłem. Coração robi robotę.', a: 'Kuba', c: 'Warszawa', p: 'Coração do Brasil' },
            { t: 'Aurora to coś innego. Czarna porzeczka i pomidor, serio.', a: 'Marta', c: 'Kraków', p: 'Aurora' },
            { t: 'Wysłali w 24h, otwierałem pachnące jak palarnia. 10/10.', a: 'Jan', c: 'Wrocław', p: 'Verde Tropical' },
          ].map((r, i) => (
            <div key={i} className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', color: 'var(--aura-orange)', gap: 3, marginBottom: 16 }}>{[1,2,3,4,5].map(s => <Icon.star key={s} />)}</div>
              <p style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.35, letterSpacing: '-0.01em' }}>„{r.t}"</p>
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--aura-muted)' }}>
                <span>{r.a} · {r.c}</span>
                <span className="mono" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>{r.p}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription CTA */}
      <section style={{ padding: '100px 80px', background: 'var(--aura-orange)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 720 }}>
          <div className="eyebrow" style={{ color: '#fff', marginBottom: 16 }}>Coffee club · subskrypcja</div>
          <h2 style={{ fontSize: 88, color: '#fff', letterSpacing: '-0.035em', lineHeight: 0.92 }}>Świeże ziarno.<br/>Co dwa tygodnie.</h2>
          <p style={{ marginTop: 20, fontSize: 16, color: 'rgba(255,255,255,0.9)', lineHeight: 1.55, maxWidth: 480 }}>
            Wybierz blend, my zajmujemy się resztą. Anulujesz w dowolnym momencie. Bez ściemy.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 36 }}>
            <button className="btn btn-ink">Zacznij od 58 zł / msc</button>
            <button className="btn btn-ghost" style={{ background: 'transparent', borderColor: '#fff', color: '#fff' }}>Jak to działa</button>
          </div>
        </div>
        <div style={{ position: 'absolute', right: -80, top: -40, transform: 'rotate(15deg)' }}>
          <Starburst color="#fff" size={460} points={12} depth={0.2}>
            <FigureRunner size={240} color="var(--aura-orange)" />
          </Starburst>
        </div>
      </section>

      <TrustStrip />
      <Footer />
    </DeskShell>
  );
}

function BlendCompareDesk() {
  const blends = [
    { name: 'Coração do Brasil', mood: 'Codzienna energia', notes: ['Czekolada', 'Orzech', 'Karmel'], color: 'var(--aura-orange)', method: 'Espresso · Moka', body: 4, acid: 2, sweet: 4 },
    { name: 'Verde Tropical',     mood: 'Jasna świeżość',  notes: ['Cytrus', 'Bergamotka', 'Jaśmin'], color: 'var(--aura-green)',  method: 'V60 · Chemex',    body: 2, acid: 5, sweet: 3 },
    { name: 'Lila Nocturna',      mood: 'Wieczorna głębia', notes: ['Śliwka', 'Kakao', 'Wino'],       color: 'var(--aura-purple)', method: 'Espresso · French', body: 5, acid: 3, sweet: 4 },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      {blends.map(b => (
        <div key={b.name} className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, opacity: 0.95 }}>
            <Starburst color={b.color} size={160} points={11} depth={0.22}>
              <FigureRunner size={80} color="#0E0E0C" />
            </Starburst>
          </div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>{b.mood}</div>
          <h3 style={{ fontSize: 32, letterSpacing: '-0.02em', maxWidth: 200 }}>{b.name}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {b.notes.map(n => <span key={n} className="chip">{n}</span>)}
          </div>
          <div style={{ marginTop: 8 }}>
            <BlendBars body={b.body} acid={b.acid} sweet={b.sweet} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--aura-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{b.method}</span>
            <button className="btn btn-sm">Sprawdź</button>
          </div>
        </div>
      ))}
    </div>
  );
}
function BlendBars({ body, acid, sweet }) {
  const Row = ({ l, v }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'center', gap: 12 }}>
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>{l}</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= v ? 'var(--aura-ink)' : 'var(--aura-line)' }} />)}
      </div>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Row l="Ciało" v={body} />
      <Row l="Kwas." v={acid} />
      <Row l="Słodycz" v={sweet} />
    </div>
  );
}

// ── Desktop Listing ──────────────────────────────────────────────────
function DesktopListing() {
  return (
    <DeskShell h={1900}>
      <Header cartCount={2} />

      {/* Title */}
      <section style={{ padding: '64px 80px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 60 }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Sklep · 14 produktów</div>
            <h1 style={{ fontSize: 96, letterSpacing: '-0.03em' }}>Wszystkie kawy</h1>
          </div>
          <p style={{ fontSize: 15, color: 'var(--aura-muted)', maxWidth: 320, lineHeight: 1.5 }}>
            Single origin i autorskie blendy. Wszystko świeżo palone w tym tygodniu w naszej palarni na Pradze.
          </p>
        </div>
      </section>

      {/* Horizontal filter bar */}
      <section style={{ padding: '0 80px', borderTop: '1px solid var(--aura-line)', borderBottom: '1px solid var(--aura-line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 0' }}>
          {/* Category chips */}
          <div style={{ display: 'flex', gap: 8, flex: 1, overflow: 'hidden' }}>
            {[
              { l: 'Wszystko', n: 14, active: true },
              { l: 'Espresso', n: 6 },
              { l: 'Filtrowe', n: 5 },
              { l: 'Decaf', n: 2 },
              { l: 'Single origin', n: 8 },
              { l: 'Blendy', n: 4 },
              { l: 'Sprzęt', n: 8 },
            ].map(c => (
              <button key={c.l} className={`chip ${c.active ? 'active' : ''}`} style={{ height: 40, padding: '0 16px', fontSize: 13, gap: 6, whiteSpace: 'nowrap' }}>
                {c.l} <span style={{ opacity: 0.55, fontWeight: 400 }}>{c.n}</span>
              </button>
            ))}
          </div>

          {/* Filter dropdown button */}
          <button className="chip" style={{ height: 40, padding: '0 16px', fontSize: 13, borderColor: 'var(--aura-line-strong)', gap: 8, whiteSpace: 'nowrap' }}>
            <Icon.filter /> Filtry <span className="num" style={{ background: 'var(--aura-orange)', color: '#fff', borderRadius: 999, padding: '1px 7px', fontSize: 11 }}>2</span>
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: 'var(--aura-line)' }} />

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>Sortuj</span>
            <button className="chip" style={{ height: 40, padding: '0 14px', borderColor: 'var(--aura-line-strong)', fontSize: 13, gap: 6, whiteSpace: 'nowrap' }}>
              Polecane <span style={{ opacity: 0.5 }}>▾</span>
            </button>
          </div>
        </div>

        {/* Active filter chips row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingBottom: 18 }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>Aktywne:</span>
          <span className="chip orange" style={{ gap: 6 }}>Średnie palenie <Icon.close /></span>
          <span className="chip orange" style={{ gap: 6 }}>Brazylia <Icon.close /></span>
          <button style={{ background: 'none', border: 'none', color: 'var(--aura-muted)', fontSize: 12, textDecoration: 'underline', cursor: 'pointer' }}>Wyczyść</button>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '40px 80px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
          {AURA_PRODUCTS.concat(AURA_PRODUCTS.slice(0, 2)).map((p, i) => (
            <ProductCard key={i} p={p} onQuickAdd={() => {}} />
          ))}
        </div>

        {/* Load more */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 56 }}>
          <button className="btn btn-ghost" style={{ height: 52, padding: '0 32px' }}>Pokaż więcej (6) <Icon.arrow /></button>
        </div>
      </section>

      <Footer />
    </DeskShell>
  );
}
function FilterGroup({ title, options }) {
  return (
    <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--aura-line)' }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map(o => (
          <li key={o.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 16, height: 16, borderRadius: 4,
                border: `1.5px solid ${o.active ? 'var(--aura-orange)' : 'var(--aura-line-strong)'}`,
                background: o.active ? 'var(--aura-orange)' : 'transparent',
                display: 'grid', placeItems: 'center',
              }}>{o.active && <Icon.check style={{ color: '#fff', width: 10, height: 10 }} />}</span>
              {o.l}
            </span>
            <span style={{ color: 'var(--aura-muted)', fontSize: 12 }}>({o.n})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Desktop PDP ──────────────────────────────────────────────────────
function DesktopPDP() {
  const p = AURA_PRODUCTS[0];
  return (
    <DeskShell h={1900}>
      <Header cartCount={2} />
      {/* breadcrumbs */}
      <div className="mono" style={{ padding: '24px 80px 0', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>
        Sklep / Espresso / <span style={{ color: 'var(--aura-ink)' }}>Coração do Brasil</span>
      </div>

      {/* Main */}
      <section style={{ padding: '40px 80px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
        {/* Gallery */}
        <div>
          <div style={{ background: 'var(--aura-paper-2)', borderRadius: 22, aspectRatio: '1', display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <CoffeeBag width={340} accent={p.accent} name={p.name.toUpperCase()} sub={`${p.origin} · 250g`} />
            <div style={{ position: 'absolute', top: 24, right: 24, opacity: 0.95 }}>
              <Starburst color={p.accent} size={80} points={11} depth={0.22} />
            </div>
            <div style={{ position: 'absolute', top: 24, left: 24 }}>
              <span className="chip" style={{ background: 'var(--aura-ink)', color: '#fff', borderColor: 'var(--aura-ink)', fontFamily: 'var(--aura-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{p.badge}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {[0,1,2,3].map(i => (
              <div key={i} className="ph" style={{ flex: 1, aspectRatio: '1', borderRadius: 14,
                outline: i === 0 ? '2px solid var(--aura-ink)' : 'none', outlineOffset: 2 }}>
                {['BAG', 'BEANS', 'BREW', 'LIFESTYLE'][i]}
              </div>
            ))}
          </div>
        </div>

        {/* Info column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>{p.origin} · {p.process}</div>
            <h1 style={{ fontSize: 80, letterSpacing: '-0.03em' }}>{p.name}</h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 18 }}>
              <span className="num" style={{ fontSize: 32, fontWeight: 700 }}>{p.price} zł</span>
              <span style={{ fontSize: 13, color: 'var(--aura-muted)' }}>za 250g</span>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--aura-muted)' }}>
                <span style={{ display: 'flex', color: 'var(--aura-orange)' }}>{[1,2,3,4,5].map(s => <Icon.star key={s} />)}</span>
                4.9 · 312 ocen
              </span>
            </div>
          </div>

          <p style={{ fontSize: 16, color: 'var(--aura-ink-2)', lineHeight: 1.55, maxWidth: 520 }}>{p.desc}</p>

          <div className="divider" />

          <VariantPills label="Gramatura" options={['250g', '500g', '1kg']} value="250g" onChange={() => {}} />
          <VariantPills label="Forma" options={['Ziarno', 'Mielona — espresso', 'Mielona — filtr']} value="Ziarno" onChange={() => {}} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
            <QtyStepper value={1} onChange={() => {}} />
            <button className="btn" style={{ flex: 1, height: 56, fontSize: 15 }}>Dodaj do koszyka · <span className="num">{p.price} zł</span></button>
          </div>

          <div className="divider" />

          {/* Trust */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <TrustLine icon={<Icon.bean />} txt="Palona 8 listopada" />
            <TrustLine icon={<Icon.truck />} txt="Wysyłka w 24h" />
            <TrustLine icon={<Icon.check />} txt="14 dni na zwrot" />
            <TrustLine icon={<Icon.package />} txt="Bezpieczna płatność" />
          </div>
        </div>
      </section>

      {/* Sensory / details strip */}
      <section style={{ padding: '80px 80px', background: 'var(--aura-paper-2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 60 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16, color: 'var(--aura-orange)' }}>Nuty smakowe</div>
            <h3 style={{ fontSize: 28, marginBottom: 16, letterSpacing: '-0.02em' }}>Czekolada. Orzech. Karmel.</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {p.notes.map(n => <span key={n} className="chip orange">{n}</span>)}
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16, color: 'var(--aura-orange)' }}>Profil palenia</div>
            <h3 style={{ fontSize: 28, marginBottom: 20, letterSpacing: '-0.02em' }}>Średnie. Zbalansowane.</h3>
            <RoastBar level={3} />
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16, color: 'var(--aura-orange)' }}>Pod jakie parzenie</div>
            <h3 style={{ fontSize: 28, marginBottom: 16, letterSpacing: '-0.02em' }}>Espresso, moka, aeropress.</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {p.methods.map(m => <span key={m} className="chip"><Icon.check /> {m}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '100px 80px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'center' }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 18 }}>Pochodzenie</div>
          <h2 style={{ fontSize: 64, letterSpacing: '-0.03em', lineHeight: 0.95 }}>Cerrado.<br/>Wyżyna, słońce, ziarno.</h2>
          <p style={{ marginTop: 22, fontSize: 15, color: 'var(--aura-ink-2)', lineHeight: 1.6, maxWidth: 460 }}>
            Coração rośnie na wyżynach Cerrado, w Brazylii. Wysokość 1 100 m, naturalna obróbka, ręczny zbiór. Trafia do nas raz na pół roku.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 36, maxWidth: 420 }}>
            <Spec l="Wysokość" v="1 100 m n.p.m." />
            <Spec l="Obróbka" v="Natural" />
            <Spec l="Odmiana" v="Yellow Bourbon" />
            <Spec l="Zbiór" v="2025" />
          </div>
        </div>
        <div className="ph" style={{ aspectRatio: '4 / 3', borderRadius: 22 }}>FARMA · CERRADO · BR</div>
      </section>

      {/* Similar */}
      <section style={{ padding: '60px 80px 100px' }}>
        <SectionHead eyebrow="Podobne blendy" title="Albo coś takiego." action="Wszystkie" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {AURA_PRODUCTS.slice(1, 5).map(s => <ProductCard key={s.id} p={s} onQuickAdd={() => {}} />)}
        </div>
      </section>

      <Footer />
    </DeskShell>
  );
}
function Spec({ l, v }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 4 }}>{l}</div>
      <div style={{ fontSize: 16, fontWeight: 600 }}>{v}</div>
    </div>
  );
}

// ── Desktop Cart drawer (over a faded page) ──────────────────────────
function DesktopCart() {
  const items = [
    { p: AURA_PRODUCTS[0], qty: 1, variant: '250g · Ziarno' },
    { p: AURA_PRODUCTS[2], qty: 2, variant: '500g · Espresso' },
    { p: AURA_PRODUCTS[1], qty: 1, variant: '250g · V60' },
  ];
  const subtotal = items.reduce((s, i) => s + i.p.price * i.qty, 0);
  return (
    <DeskShell h={DESK_H}>
      {/* faded background page */}
      <Header cartCount={4} />
      <div style={{ padding: '40px 80px', flex: 1, opacity: 0.35, pointerEvents: 'none' }}>
        <h1 style={{ fontSize: 64 }}>Wszystkie kawy</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 32 }}>
          {AURA_PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,12,0.55)' }} />

      {/* Drawer */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 460,
        background: '#fff', display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', borderBottom: '1px solid var(--aura-line)' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--aura-orange)' }}>Koszyk · {items.reduce((s,i)=>s+i.qty,0)} szt.</div>
            <h2 style={{ fontSize: 26, marginTop: 4 }}>Twój wybór</h2>
          </div>
          <button style={iconBtn('var(--aura-ink)')}><Icon.close /></button>
        </div>
        <div style={{ padding: '18px 28px' }}>
          <FreeShippingProgress subtotal={subtotal} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 28px' }} className="no-scrollbar">
          {items.map((it, i) => <CartLine key={i} {...it} />)}
        </div>
        <div style={{ borderTop: '1px solid var(--aura-line)', padding: '20px 28px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
            <span style={{ color: 'var(--aura-muted)' }}>Suma częściowa</span>
            <span className="num" style={{ fontWeight: 600 }}>{subtotal} zł</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 14 }}>
            <span style={{ color: 'var(--aura-muted)' }}>Dostawa</span>
            <span className="num" style={{ fontWeight: 600, color: subtotal >= 150 ? 'var(--aura-orange)' : 'inherit' }}>{subtotal >= 150 ? 'Gratis 🎉' : '15 zł'}</span>
          </div>
          <div className="divider" style={{ marginBottom: 14 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>Razem</span>
            <span className="num" style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.01em' }}>{subtotal + (subtotal >= 150 ? 0 : 15)} zł</span>
          </div>
          <button className="btn btn-block" style={{ height: 52 }}>Przejdź do kasy <Icon.arrow /></button>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginTop: 14, textAlign: 'center' }}>
            Bezpieczna płatność · Shopify Checkout
          </div>
        </div>
      </div>
    </DeskShell>
  );
}

// ── Desktop Header (close-up showcase of nav states) ──────────────────
function DesktopHeaderShowcase() {
  return (
    <DeskShell h={680}>
      {/* Default header */}
      <div style={{ padding: '40px 0 24px' }}>
        <div className="eyebrow" style={{ padding: '0 80px', marginBottom: 12, color: 'var(--aura-muted)' }}>Default header (sklep)</div>
        <Header cartCount={2} />
        <Ticker items={['Drop 01 · 2026', 'Świeżo palona', 'Wysyłka 24h']} />
      </div>

      {/* Transparent (over hero) */}
      <div style={{ marginTop: 24 }}>
        <div className="eyebrow" style={{ padding: '0 80px', marginBottom: 12, color: 'var(--aura-muted)' }}>Transparent / on hero</div>
        <div style={{ background: 'var(--aura-ink)', position: 'relative' }}>
          <Header cartCount={2} transparent />
        </div>
      </div>

      {/* Hover state + mega menu peek */}
      <div style={{ marginTop: 24, position: 'relative' }}>
        <div className="eyebrow" style={{ padding: '0 80px', marginBottom: 12, color: 'var(--aura-muted)' }}>Hover · mega menu (Sklep)</div>
        <Header cartCount={2} />
        {/* Mega menu */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 'calc(100% + 0px)',
          background: '#fff', borderBottom: '1px solid var(--aura-line)',
          boxShadow: '0 12px 30px rgba(14,14,12,0.07)',
          padding: '32px 80px',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: 48,
        }}>
          <MegaCol title="Kategorie" items={['Wszystkie kawy', 'Espresso (6)', 'Filtrowe (5)', 'Decaf (2)', 'Sprzęt']} />
          <MegaCol title="Profil palenia" items={['Jasne (4)', 'Średnie (7)', 'Średnio-ciemne (3)', 'Ciemne (2)']} />
          <MegaCol title="Pochodzenie" items={['Brazylia (4)', 'Kolumbia (3)', 'Etiopia (3)', 'Kenia (2)', 'Blendy (2)']} />
          <div style={{ background: 'var(--aura-paper-2)', borderRadius: 14, padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}><CoffeeBag width={90} accent="var(--aura-orange)" name="" sub="" /></div>
            <div>
              <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 6 }}>Drop 01</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Coração do Brasil</div>
              <div style={{ fontSize: 12, color: 'var(--aura-muted)', marginBottom: 10 }}>Bestseller · Świeżo palone</div>
              <button className="btn btn-sm">Sprawdź</button>
            </div>
          </div>
        </div>
      </div>
    </DeskShell>
  );
}
function MegaCol({ title, items }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 14 }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((l, i) => (
          <li key={l} style={{ fontSize: 14, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--aura-orange)' : 'var(--aura-ink)', cursor: 'pointer' }}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

// ── Desktop Search overlay ───────────────────────────────────────────
function DesktopSearch() {
  return (
    <DeskShell h={DESK_H}>
      <Header cartCount={2} />
      <div style={{ position: 'absolute', inset: 0, top: 73, background: 'rgba(14,14,12,0.4)' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 73,
        background: '#fff', borderBottom: '1px solid var(--aura-line)',
      }}>
        <div style={{ padding: '32px 80px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingBottom: 20, borderBottom: '2px solid var(--aura-ink)' }}>
            <Icon.search style={{ width: 28, height: 28 }} />
            <input defaultValue="espresso do mleka" style={{
              flex: 1, border: 'none', outline: 'none',
              fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 40,
              letterSpacing: '-0.02em', background: 'transparent'
            }} />
            <button className="btn btn-ghost btn-sm">Esc</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr', gap: 60, marginTop: 36 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Sugerowane</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                {['Espresso blend', 'Espresso do mleka', 'Decaf', 'Etiopia', 'Filtr', 'Aeropress', 'Pod V60'].map(t => (
                  <span key={t} className={`chip ${t === 'Espresso do mleka' ? 'orange' : ''}`}>{t}</span>
                ))}
              </div>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Popularne kategorie</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
                {['Espresso blendy', 'Single origin', 'Decaf', 'Sprzęt do parzenia'].map((s, i) => (
                  <li key={s} style={{ padding: '14px 0', borderBottom: '1px solid var(--aura-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16, fontWeight: 500 }}>
                    {s} <Icon.arrow />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Produkty (3)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {AURA_PRODUCTS.slice(0, 4).map(p => (
                  <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 14, padding: 14, background: 'var(--aura-paper-2)', borderRadius: 12 }}>
                    <div style={{ height: 90, background: '#fff', borderRadius: 8, display: 'grid', placeItems: 'center' }}>
                      <CoffeeBag width={46} accent={p.accent} name="" sub="" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--aura-muted)', marginTop: 4 }}>{p.origin}</div>
                      <div className="num" style={{ fontWeight: 700, marginTop: 6, fontSize: 13 }}>{p.price} zł</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-ghost" style={{ marginTop: 20, width: '100%' }}>Zobacz wszystkie wyniki <Icon.arrow /></button>
            </div>
          </div>
        </div>
      </div>
    </DeskShell>
  );
}

// ── Desktop About ────────────────────────────────────────────────────
function DesktopAbout() {
  return (
    <DeskShell h={2200}>
      <Header cartCount={2} />
      {/* Hero */}
      <section style={{ padding: '100px 80px 120px', background: 'var(--aura-paper-2)', position: 'relative', overflow: 'hidden' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 24 }}>O Aurze · od 2021</div>
        <h1 style={{ fontSize: 180, lineHeight: 0.9, letterSpacing: '-0.035em' }}>Palarnia <br/>z charakterem.</h1>
        <p style={{ marginTop: 32, fontSize: 18, color: 'var(--aura-ink-2)', maxWidth: 540, lineHeight: 1.5 }}>
          Aura urodziła się w warsztacie na Pradze. Bez patosu, bez nadęcia. Specialty, którą sami chcemy pić — palona w małych wsadach, dla ludzi, dla kawiarni.
        </p>
        <div style={{ position: 'absolute', right: 80, top: 80, opacity: 0.95 }}>
          <Starburst color="var(--aura-orange)" size={300} points={12} depth={0.22}>
            <FigureRunner size={150} color="#0E0E0C" />
          </Starburst>
        </div>
      </section>

      {/* Photo strip */}
      <section style={{ padding: '0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="ph" style={{ aspectRatio: '4 / 5', borderRadius: 0 }}>PALARNIA · WARSZAWA</div>
        <div className="ph" style={{ aspectRatio: '4 / 5', borderRadius: 0 }}>BARISTA · CUPPING</div>
        <div className="ph" style={{ aspectRatio: '4 / 5', borderRadius: 0 }}>FARMA · BRAZYLIA</div>
      </section>

      {/* Manifesto */}
      <section style={{ padding: '120px 80px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80 }}>
        <div className="eyebrow" style={{ paddingTop: 12, color: 'var(--aura-orange)' }}>Manifest</div>
        <div>
          <h2 style={{ fontSize: 72, letterSpacing: '-0.03em', lineHeight: 1 }}>
            Robimy kawę dla ludzi, nie dla guide'ów.
          </h2>
          <p style={{ marginTop: 30, fontSize: 18, lineHeight: 1.6, color: 'var(--aura-ink-2)', maxWidth: 640 }}>
            Nie wymyślamy nut, których nie czuć. Nie nakładamy 40% marży za fancy etykietę. Palimy świeżo, sprzedajemy uczciwie, gadamy normalnie. Jeśli twoja kawa smakuje jak kawa — robimy dobrą robotę.
          </p>
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
            {[
              { t: 'Świeżość', d: 'Małe wsady, krótka dystrybucja. < 14 dni od palenia.' },
              { t: 'Uczciwie', d: 'Direct trade. Znamy farmy. Płacimy fair.' },
              { t: 'Bez ściemy', d: 'Brak słów-wytrychów. Mówimy jak smakuje.' },
            ].map(x => (
              <div key={x.t}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{x.t}</div>
                <p style={{ fontSize: 14, color: 'var(--aura-muted)', lineHeight: 1.55 }}>{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '100px 80px', background: 'var(--aura-ink)', color: '#fff' }}>
        <SectionHead eyebrow="2021 → 2026" title="Co po drodze." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { y: '2021', t: 'Pierwsza palarnia', d: '5kg wsad, jeden klient — siebie.' },
            { y: '2023', t: 'Kawiarnia w mieście', d: '12 stałych blendów, pierwszy zespół.' },
            { y: '2025', t: 'Direct trade', d: '4 farmy, Brazylia + Kolumbia + Etiopia.' },
            { y: '2026', t: 'Drop 01 — coffee club', d: 'Nowa palarnia, nowy świat marki.' },
          ].map(m => (
            <div key={m.y} style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 24 }}>
              <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--aura-orange)', marginBottom: 16 }}>{m.y}</div>
              <h3 style={{ fontSize: 24, color: '#fff' }}>{m.t}</h3>
              <p style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>{m.d}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, marginTop: 80 }}>
          {[['12kg', 'Wsad palenia'], ['4', 'Farmy'], ['< 14d', 'Od palenia'], ['2 140', 'Ocen 4.9★']].map(([n, l]) => (
            <div key={l} style={{ borderLeft: '2px solid var(--aura-orange)', paddingLeft: 20 }}>
              <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 64, color: '#fff', letterSpacing: '-0.03em' }}>{n}</div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </DeskShell>
  );
}

// ── Desktop FAQ ──────────────────────────────────────────────────────
function DesktopFAQ() {
  return (
    <DeskShell h={1500}>
      <Header cartCount={2} />
      <section style={{ padding: '60px 80px 40px' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Pomoc · dostawa · zwroty</div>
        <h1 style={{ fontSize: 120, letterSpacing: '-0.03em' }}>Pomoc.</h1>
        <p style={{ marginTop: 24, fontSize: 17, color: 'var(--aura-ink-2)', maxWidth: 640, lineHeight: 1.5 }}>
          Konkretne odpowiedzi, bez bełkotu. A jak nie znajdziesz — napisz, odpiszemy w 24h.
        </p>
      </section>

      <section style={{ padding: '0 80px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          <Tile icon={<Icon.truck />} t="Dostawa" d="24h · DPD i InPost · Free od 150 zł" />
          <Tile icon={<Icon.package />} t="Zwroty" d="14 dni bez powodu · za nasz koszt" />
          <Tile icon={<Icon.bean />} t="Świeżość" d="Wszystko palone < 14 dni" />
          <Tile icon={<Icon.shop />} t="B2B / HoReCa" d="Hurt, kontrakty, doradztwo" />
        </div>
      </section>

      <section style={{ padding: '40px 80px 100px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Tematy</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['Zamówienia', 'Dostawa', 'Zwroty i reklamacje', 'Produkty', 'Subskrypcja', 'B2B', 'Konto'].map((t, i) => (
              <li key={t} style={{
                padding: '14px 0', borderBottom: '1px solid var(--aura-line)',
                fontSize: 16, fontWeight: i === 1 ? 700 : 500,
                color: i === 1 ? 'var(--aura-orange)' : 'var(--aura-ink)',
                display: 'flex', justifyContent: 'space-between', cursor: 'pointer'
              }}>
                {t}<Icon.arrow />
              </li>
            ))}
          </ul>

          <div className="card" style={{ marginTop: 32, padding: 24, background: 'var(--aura-ink)', color: '#fff', border: 'none' }}>
            <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 10 }}>Nie znalazłeś?</div>
            <h3 style={{ fontSize: 22, color: '#fff', marginBottom: 12 }}>Napisz do nas.</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 16, lineHeight: 1.5 }}>
              hello@auracoffee.pl · pon–pt 9–17
            </p>
            <button className="btn">Kontakt</button>
          </div>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Dostawa — najczęstsze</div>
          <FAQList />
        </div>
      </section>

      <Footer />
    </DeskShell>
  );
}

// ── Desktop Blends — dedicated comparison & guide page ───────────────
function DesktopBlends() {
  const blends = [
    { id: 'coracao', name: 'Coração do Brasil', mood: 'Codzienna energia',
      notes: ['Czekolada', 'Orzech', 'Karmel'], color: 'var(--aura-orange)',
      method: 'Espresso · Moka · Aeropress', body: 4, acid: 2, sweet: 4, roast: 3,
      origin: 'Brazylia · Cerrado', price: 64, line: 'Robi robotę w mleku i solo.',
    },
    { id: 'verde', name: 'Verde Tropical', mood: 'Jasna świeżość',
      notes: ['Cytrus', 'Bergamotka', 'Jaśmin'], color: 'var(--aura-green)',
      method: 'V60 · Chemex · Aeropress', body: 2, acid: 5, sweet: 3, roast: 1,
      origin: 'Etiopia · Sidamo', price: 72, line: 'Filtrowo. Świeży poranek w kubku.',
    },
    { id: 'lila', name: 'Lila Nocturna', mood: 'Wieczorna głębia',
      notes: ['Śliwka', 'Kakao', 'Wino'], color: 'var(--aura-purple)',
      method: 'Espresso · French press', body: 5, acid: 3, sweet: 4, roast: 4,
      origin: 'Kolumbia · Huila', price: 78, line: 'Po kolacji, do ciemnego deseru.',
    },
    { id: 'mezcla', name: 'Mezcla Casa', mood: 'Bezpieczny wybór',
      notes: ['Mleczna czekolada', 'Migdał'], color: 'var(--aura-orange)',
      method: 'Espresso · Moka', body: 3, acid: 2, sweet: 4, roast: 3,
      origin: 'Blend · BR + CO', price: 58, line: 'Słodka, zbalansowana, bez wymagań.',
    },
  ];
  return (
    <DeskShell h={2400}>
      <Header cartCount={2} />
      {/* Hero */}
      <section style={{ padding: '80px 80px 60px' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 18 }}>Blendy · porównanie</div>
        <h1 style={{ fontSize: 140, letterSpacing: '-0.035em', lineHeight: 0.9 }}>Wybierz pod<br/>swój rytuał.</h1>
        <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aura-ink-2)', maxWidth: 620, lineHeight: 1.55 }}>
          Cztery blendy, cztery zupełnie różne kawy. Porównaj profil, nuty i metody parzenia — wybierz, który pasuje do twojego poranka, wieczoru albo niedzielnego cuppingu.
        </p>
      </section>

      {/* Comparison table */}
      <section style={{ padding: '40px 80px 80px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '180px repeat(4, 1fr)' }}>
            {/* Header row — bag previews */}
            <div style={{ padding: '32px 24px', borderBottom: '1px solid var(--aura-line)' }} />
            {blends.map(b => (
              <div key={b.id} style={{ padding: '32px 24px', borderBottom: '1px solid var(--aura-line)', borderLeft: '1px solid var(--aura-line)', textAlign: 'center', position: 'relative' }}>
                <div style={{ display: 'grid', placeItems: 'center', marginBottom: 16 }}>
                  <CoffeeBag width={120} accent={b.color} name={b.name.split(' ')[0].toUpperCase()} sub="250g" />
                </div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 6 }}>{b.mood}</div>
                <h3 style={{ fontSize: 22, letterSpacing: '-0.02em' }}>{b.name}</h3>
                <div className="num" style={{ marginTop: 8, fontWeight: 700, fontSize: 16 }}>{b.price} zł</div>
              </div>
            ))}

            {/* Rows */}
            <CompareRow label="Tagline" cells={blends.map(b => <span style={{ fontStyle: 'italic', color: 'var(--aura-ink-2)' }}>„{b.line}"</span>)} />
            <CompareRow label="Pochodzenie" cells={blends.map(b => b.origin)} />
            <CompareRow label="Nuty smakowe" cells={blends.map(b => (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                {b.notes.map(n => <span key={n} className="chip" style={{ fontSize: 11 }}>{n}</span>)}
              </div>
            ))} />
            <CompareRow label="Profil palenia" cells={blends.map(b => <CompactBars values={[b.roast]} labels={['Palenie']} max={5} />)} />
            <CompareRow label="Ciało · kwas · słodycz" cells={blends.map(b => (
              <CompactBars values={[b.body, b.acid, b.sweet]} labels={['Ciało', 'Kwas', 'Słodycz']} max={5} />
            ))} />
            <CompareRow label="Pod metody" cells={blends.map(b => <span style={{ fontSize: 12, color: 'var(--aura-muted)' }}>{b.method}</span>)} />
            <CompareRow label="" cells={blends.map(b => <button className="btn btn-sm">Sprawdź <Icon.arrow /></button>)} last />
          </div>
        </div>
      </section>

      {/* Choose-your-rhythm picker */}
      <section style={{ padding: '100px 80px', background: 'var(--aura-paper-2)' }}>
        <SectionHead eyebrow="Pomocnik" title="Trzy pytania — jeden blend." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { q: '01 · Kiedy pijesz?', opts: ['Rano', 'Po obiedzie', 'Wieczorem'], sel: 0 },
            { q: '02 · Jak parzysz?',  opts: ['Espresso', 'Filtr', 'French / Moka'], sel: 0 },
            { q: '03 · Z mlekiem?',    opts: ['Tak, latte', 'Czarna', 'Mix'],          sel: 0 },
          ].map(s => (
            <div key={s.q} className="card" style={{ padding: 28 }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--aura-orange)', marginBottom: 16 }}>{s.q}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {s.opts.map((o, i) => (
                  <button key={o} className={`chip ${i === s.sel ? 'active' : ''}`} style={{ justifyContent: 'flex-start', height: 44, padding: '0 16px', fontSize: 14 }}>{o}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginTop: 36, padding: 36, display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: 32, alignItems: 'center' }}>
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <CoffeeBag width={140} accent="var(--aura-orange)" name="CORAÇÃO" sub="250g · ziarno" />
          </div>
          <div>
            <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 8 }}>Twój blend</div>
            <h3 style={{ fontSize: 40, letterSpacing: '-0.02em' }}>Coração do Brasil</h3>
            <p style={{ marginTop: 10, fontSize: 14, color: 'var(--aura-muted)', maxWidth: 460 }}>Czekoladowy, słodki, idealny do mleka. Espresso od rana do popołudnia.</p>
          </div>
          <button className="btn" style={{ height: 56, padding: '0 28px' }}>Dodaj · <span className="num">64 zł</span></button>
        </div>
      </section>

      <Footer />
    </DeskShell>
  );
}
function CompareRow({ label, cells, last = false }) {
  return (
    <>
      <div style={{ padding: '20px 24px', borderBottom: last ? 'none' : '1px solid var(--aura-line)', background: 'var(--aura-paper)' }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>{label}</span>
      </div>
      {cells.map((c, i) => (
        <div key={i} style={{ padding: '20px 24px', borderBottom: last ? 'none' : '1px solid var(--aura-line)', borderLeft: '1px solid var(--aura-line)', textAlign: 'center', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c}</div>
      ))}
    </>
  );
}
function CompactBars({ values, labels, max = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 160, margin: '0 auto' }}>
      {values.map((v, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '54px 1fr', gap: 8, alignItems: 'center' }}>
          <span className="mono" style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--aura-muted)', textAlign: 'left' }}>{labels[i]}</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: max }).map((_, j) => (
              <div key={j} style={{ flex: 1, height: 5, borderRadius: 2, background: j < v ? 'var(--aura-ink)' : 'var(--aura-line)' }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Desktop Palarnia — roastery story page ───────────────────────────
function DesktopPalarnia() {
  return (
    <DeskShell h={2400}>
      <Header cartCount={2} />
      {/* Hero */}
      <section style={{ position: 'relative', background: 'var(--aura-ink)', color: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, padding: '88px 80px 80px', alignItems: 'center' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 24 }}>Palarnia · Warszawa Praga</div>
            <h1 style={{ fontSize: 124, color: '#fff', letterSpacing: '-0.035em', lineHeight: 0.92 }}>Palimy<br/>w środy.</h1>
            <p style={{ marginTop: 26, fontSize: 16, color: 'rgba(255,255,255,0.75)', maxWidth: 520, lineHeight: 1.55 }}>
              Co tydzień. Małe wsady, ręczna kontrola każdej partii. Ziarno trafia do ciebie zanim ostygnie — i to nie metafora.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 36 }}>
              <button className="btn">Zamów świeżą partię <Icon.arrow /></button>
              <button className="btn btn-ghost" style={{ background: 'transparent', borderColor: '#fff', color: '#fff' }}>Umów wizytę</button>
            </div>
          </div>
          <div className="ph ink" style={{ aspectRatio: '4 / 5', borderRadius: 22, justifySelf: 'center', width: '100%', maxWidth: 480 }}>PALARNIA · PROBAT 12KG</div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: '100px 80px' }}>
        <SectionHead eyebrow="Proces" title="Od ziarna do paczki — 5 kroków." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {[
            { n: '01', t: 'Selekcja zielonego', d: 'Cuppingujemy próbki, wybieramy partie z 4 farm, do których wracamy od lat.' },
            { n: '02', t: 'Profil palenia', d: 'Każdy blend ma własną krzywą. Profilujemy do nut, nie do koloru.' },
            { n: '03', t: 'Palenie', d: 'Probat 12kg, środy 7–14. Wsad ma ~12 min od pierwszego cracka.' },
            { n: '04', t: 'Odgazowanie', d: '24–48h w silosie. Bez tego espresso się buntuje.' },
            { n: '05', t: 'Pakowanie', d: 'Worek z zaworem, data palenia, wysyłka w 24h.' },
          ].map(s => (
            <div key={s.n} className="card" style={{ padding: 22, borderTop: '3px solid var(--aura-orange)' }}>
              <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--aura-orange)', marginBottom: 12 }}>{s.n}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.t}</div>
              <p style={{ fontSize: 13, color: 'var(--aura-muted)', lineHeight: 1.55 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Photo grid */}
      <section style={{ padding: '0 0 100px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 4 }}>
        <div className="ph" style={{ aspectRatio: '5 / 4', borderRadius: 0 }}>PROBAT · DOLEWKA</div>
        <div className="ph" style={{ aspectRatio: '5 / 4', borderRadius: 0 }}>CUPPING · MIESIĄC</div>
        <div className="ph" style={{ aspectRatio: '5 / 4', borderRadius: 0 }}>ROAST LOG · TABLET</div>
      </section>

      {/* Visit info + map */}
      <section style={{ padding: '0 80px 100px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 18 }}>Wpadnij na cupping</div>
          <h2 style={{ fontSize: 72, letterSpacing: '-0.03em', lineHeight: 0.95 }}>Otwieramy palarnię w piątki.</h2>
          <p style={{ marginTop: 22, fontSize: 15, color: 'var(--aura-ink-2)', lineHeight: 1.6, maxWidth: 480 }}>
            Co piątek o 17:00 robimy publiczny cupping. Pięć kaw, mówimy o procesie, smakujemy razem. Bez biletów — zapisy mailowo.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 36 }}>
            <Spec l="Adres" v="ul. Ząbkowska 16 / Warszawa" />
            <Spec l="Godziny" v="Pn–Pt 9–17 · Sb 10–14" />
            <Spec l="Cupping" v="Piątki, 17:00" />
            <Spec l="Mail" v="palarnia@auracoffee.pl" />
          </div>
          <button className="btn" style={{ marginTop: 32 }}>Zapisz się na cupping <Icon.arrow /></button>
        </div>
        <div className="ph" style={{ aspectRatio: '5 / 4', borderRadius: 22 }}>MAPA · PRAGA · WARSZAWA</div>
      </section>

      <Footer />
    </DeskShell>
  );
}

// ── Desktop Contact ──────────────────────────────────────────────────
function DesktopContact() {
  return (
    <DeskShell h={1500}>
      <Header cartCount={2} />
      <section style={{ padding: '80px 80px 60px' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 18 }}>Kontakt</div>
        <h1 style={{ fontSize: 140, letterSpacing: '-0.035em', lineHeight: 0.9 }}>Pisz śmiało.</h1>
        <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aura-ink-2)', maxWidth: 580, lineHeight: 1.55 }}>
          Odpowiadamy w 24h, w dni robocze szybciej. Jeśli sprawa palaca — telefon działa.
        </p>
      </section>

      <section style={{ padding: '0 80px 100px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80 }}>
        {/* Channels */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Bezpośrednio</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <ContactRow label="Mail" v="hello@auracoffee.pl" />
            <ContactRow label="Telefon" v="+48 22 123 45 67" sub="Pn–Pt 9–17" />
            <ContactRow label="B2B / hurt" v="b2b@auracoffee.pl" sub="HoReCa, biura, sklepy" />
            <ContactRow label="Współpraca" v="hi@auracoffee.pl" sub="Kawiarnie, eventy, prasa" />
          </div>

          <div className="divider" style={{ margin: '36px 0' }} />

          <div className="eyebrow" style={{ marginBottom: 18 }}>Palarnia</div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 24, letterSpacing: '-0.02em', marginBottom: 10 }}>ul. Ząbkowska 16</h3>
            <p style={{ fontSize: 14, color: 'var(--aura-muted)', lineHeight: 1.55 }}>03–736 Warszawa<br/>Pn–Pt 9–17 · Sb 10–14<br/>Cupping w piątki 17:00</p>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 18 }}>Otwórz w mapach</button>
          </div>

          <div className="divider" style={{ margin: '36px 0' }} />

          <div className="eyebrow" style={{ marginBottom: 14 }}>Social</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['IG', 'TT', 'YT', 'IN'].map(s => (
              <button key={s} className="chip" style={{ width: 48, height: 48, padding: 0, justifyContent: 'center', fontFamily: 'var(--aura-mono)', fontSize: 12, fontWeight: 700 }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: 40 }}>
          <h2 style={{ fontSize: 36, letterSpacing: '-0.02em' }}>Napisz wiadomość</h2>
          <p style={{ marginTop: 10, fontSize: 13, color: 'var(--aura-muted)' }}>Odpisujemy w 24h, w robocze najczęściej szybciej.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 28 }}>
            <Field label="Imię" placeholder="Anna" />
            <Field label="Mail" placeholder="anna@firma.pl" />
          </div>
          <div style={{ marginTop: 18 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Temat</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Zamówienie', 'B2B / hurt', 'Współpraca', 'Reklamacja', 'Inne'].map((t, i) => (
                <button key={t} className={`chip ${i === 0 ? 'active' : ''}`} style={{ height: 38, padding: '0 14px' }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <Field label="Wiadomość" placeholder="O co chodzi?" textarea />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>RODO · dane tylko do odpowiedzi</span>
            <button className="btn" style={{ height: 52, padding: '0 28px' }}>Wyślij <Icon.arrow /></button>
          </div>
        </div>
      </section>

      <Footer />
    </DeskShell>
  );
}
function ContactRow({ label, v, sub }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 20, padding: '18px 0', borderBottom: '1px solid var(--aura-line)' }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--aura-muted)', paddingTop: 2 }}>{label}</span>
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>{v}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--aura-muted)', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}
function Field({ label, placeholder, textarea = false }) {
  const common = {
    width: '100%', border: '1.5px solid var(--aura-line)', borderRadius: 12,
    padding: '14px 16px', fontFamily: 'var(--aura-text)', fontSize: 15, outline: 'none',
    background: 'var(--aura-paper)',
  };
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>
      {textarea
        ? <textarea placeholder={placeholder} rows={5} style={{ ...common, resize: 'vertical', minHeight: 120 }} />
        : <input placeholder={placeholder} style={common} />}
    </div>
  );
}

Object.assign(window, {
  DesktopHome, DesktopListing, DesktopPDP, DesktopCart,
  DesktopHeaderShowcase, DesktopSearch, DesktopAbout, DesktopFAQ,
  DesktopBlends, DesktopPalarnia, DesktopContact,
  DESK_W, DESK_H
});
