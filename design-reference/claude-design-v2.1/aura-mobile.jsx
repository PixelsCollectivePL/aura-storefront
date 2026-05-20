/* eslint-disable no-undef */
/* Mobile screens — each ~390x780 phone canvas
   No phone bezel chrome; each artboard IS the screen */

const MOBILE_W = 390;
const MOBILE_H = 780;

function MobileShell({ children, bg = 'var(--aura-paper)' }) {
  return (
    <div style={{
      width: MOBILE_W, height: MOBILE_H, background: bg,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      position: 'relative',
    }}>{children}</div>
  );
}

// ── Mobile Home ──────────────────────────────────────────────────────
function MobileHome() {
  return (
    <MobileShell bg="var(--aura-paper)">
      <Header mobile cartCount={2} />
      <div className="no-scrollbar" style={{ overflowY: 'auto', flex: 1 }}>
        {/* Hero — stacked, fully contained */}
        <section style={{ background: 'var(--aura-ink)', color: '#fff', padding: '28px 20px 32px' }}>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 16 }}>Coffee club · drop 01</div>
          <h1 style={{ fontSize: 52, color: '#fff', lineHeight: 0.92, letterSpacing: '-0.03em' }}>
            Kawa<br/>z charakterem.<br/>
            <span style={{ color: 'var(--aura-orange)' }}>Palona</span> na świeżo.
          </h1>
          <p style={{ marginTop: 14, fontSize: 14, color: 'rgba(255,255,255,0.72)', lineHeight: 1.5 }}>
            Specialty z polskiej palarni. Trzy blendy na każdy rytuał.
          </p>

          {/* Contained burst illustration — sits as a controlled block */}
          <div style={{ position: 'relative', marginTop: 24, marginBottom: 8, display: 'grid', placeItems: 'center', aspectRatio: '4 / 3' }}>
            <Starburst color="var(--aura-orange)" size={260} points={12} depth={0.22}>
              <FigureRunner size={130} color="#0E0E0C" />
            </Starburst>
            <div style={{ position: 'absolute', right: 8, bottom: 8 }}>
              <Starburst color="var(--aura-paper)" size={62} points={10} depth={0.26}>
                <span className="mono" style={{ fontSize: 8, letterSpacing: '0.14em', fontWeight: 700, color: 'var(--aura-ink)' }}>DROP<br/>01</span>
              </Starburst>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button className="btn" style={{ flex: 1 }}>Sprawdź kawy <Icon.arrow /></button>
            <button className="btn btn-ghost" style={{ background: 'transparent', borderColor: '#fff', color: '#fff', padding: '0 16px' }}>Blendy</button>
          </div>
        </section>

        <Ticker items={['Świeżo palona', 'Darmowa dostawa od 150 zł', 'Wysyłka 24h', 'Specialty grade', 'Polska palarnia']} />

        {/* Wybrane blendy */}
        <section style={{ padding: '32px 20px' }}>
          <SectionHead mobile eyebrow="Wybrane blendy" title="Pod twój rytuał." action="Wszystkie" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {AURA_PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} p={p} compact />)}
          </div>
        </section>

        {/* Porównanie blendów (sensory) */}
        <section style={{ padding: '24px 20px', background: 'var(--aura-paper-2)' }}>
          <SectionHead mobile eyebrow="Porównaj" title="Jaki masz dziś nastrój?" />
          <BlendCompareMobile />
        </section>

        {/* Brand world */}
        <section style={{ padding: '40px 20px', background: 'var(--aura-ink)', color: '#fff' }}>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Brand world</div>
          <h2 style={{ fontSize: 36, color: '#fff' }}>Coffee club. Miejski. Bez ściemy.</h2>
          <p style={{ marginTop: 14, color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6 }}>
            Aura to ludzie, którzy traktują kawę poważnie, ale bez pozy. Palimy w Warszawie, pijemy wszędzie.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 24 }}>
            <div className="ph dark" style={{ aspectRatio: '1', borderRadius: 14 }}>BARISTA / LIFESTYLE</div>
            <div className="ph dark" style={{ aspectRatio: '1', borderRadius: 14 }}>ESPRESSO POUR</div>
            <div className="ph dark" style={{ aspectRatio: '1', borderRadius: 14, gridColumn: 'span 2' }}>MERCH / TSHIRT</div>
          </div>
        </section>

        {/* Jakość */}
        <section style={{ padding: '40px 20px' }}>
          <SectionHead mobile eyebrow="Świeżość" title="Palone w tym tygodniu." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { num: '01', t: 'Małe wsady', d: 'Palimy w partiach 12kg. Bez kompromisów.' },
              { num: '02', t: 'Direct trade', d: 'Znamy farmy, którym płacimy. Wszystkie.' },
              { num: '03', t: '14 dni od palenia', d: 'Trafia do ciebie, zanim ostygnie.' },
            ].map(x => (
              <div key={x.num} className="card" style={{ padding: 18, display: 'flex', gap: 16 }}>
                <span className="mono" style={{ fontSize: 14, color: 'var(--aura-orange)', fontWeight: 700 }}>{x.num}</span>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{x.t}</div>
                  <div style={{ fontSize: 13, color: 'var(--aura-muted)', lineHeight: 1.5 }}>{x.d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Opinie */}
        <section style={{ padding: '32px 20px', background: 'var(--aura-paper-2)' }}>
          <SectionHead mobile eyebrow="Co mówią" title="4.9 ★ z 2 140 ocen" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { t: 'Najlepsza kawa do mleka jaką miałem', a: 'Kuba, Warszawa', p: 'Coração' },
              { t: 'Aurora jest absurdalnie dobra. Pomidor, serio.', a: 'Marta, Kraków', p: 'Aurora' },
            ].map((r, i) => (
              <div key={i} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', color: 'var(--aura-orange)', gap: 2, marginBottom: 8 }}>
                  {[1,2,3,4,5].map(s => <Icon.star key={s} />)}
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, letterSpacing: '-0.01em' }}>„{r.t}"</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>
                  {r.a} · {r.p}
                </div>
              </div>
            ))}
          </div>
        </section>

        <TrustStrip compact />
        <Footer mobile />
      </div>
    </MobileShell>
  );
}

function BlendCompareMobile() {
  const items = [
    { name: 'Coração', mood: 'Energy', notes: 'Czekolada · Orzech', color: 'var(--aura-orange)' },
    { name: 'Verde', mood: 'Bright', notes: 'Cytrus · Jaśmin', color: 'var(--aura-green)' },
    { name: 'Lila', mood: 'Deep', notes: 'Śliwka · Kakao', color: 'var(--aura-purple)' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map(b => (
        <div key={b.name} style={{
          display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 14, alignItems: 'center',
          padding: 12, background: '#fff', borderRadius: 12, border: '1px solid var(--aura-line)',
        }}>
          <Starburst color={b.color} size={48} points={10} depth={0.22}>
            <FigureRunner size={22} />
          </Starburst>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{b.name}</div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--aura-muted)', textTransform: 'uppercase', marginTop: 2 }}>{b.notes}</div>
          </div>
          <div className="chip" style={{ background: 'var(--aura-paper-2)', borderColor: 'transparent', fontSize: 11 }}>{b.mood}</div>
        </div>
      ))}
    </div>
  );
}

// ── Mobile Listing ───────────────────────────────────────────────────
function MobileListing() {
  return (
    <MobileShell>
      <Header mobile cartCount={2} />
      <div style={{ padding: '20px 20px 12px' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 8 }}>Sklep / Kawa</div>
        <h1 style={{ fontSize: 32 }}>Wszystkie kawy</h1>
        <p style={{ fontSize: 13, color: 'var(--aura-muted)', marginTop: 8 }}>14 blendów · świeżo palone w tym tygodniu</p>
      </div>

      {/* Filter / sort row */}
      <div style={{ display: 'flex', gap: 8, padding: '0 20px 14px', overflowX: 'auto' }} className="no-scrollbar">
        <button className="chip" style={{ background: 'var(--aura-ink)', color: '#fff', borderColor: 'var(--aura-ink)', whiteSpace: 'nowrap' }}>
          <Icon.filter /> Filtry · 2
        </button>
        {['Wszystko', 'Espresso', 'Filtrowe', 'Decaf', 'Single origin', 'Blend'].map((c, i) => (
          <span key={c} className={`chip ${i === 1 ? 'orange' : ''}`} style={{ whiteSpace: 'nowrap' }}>{c}</span>
        ))}
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {AURA_PRODUCTS.map(p => <ProductCard key={p.id} p={p} compact />)}
        </div>
      </div>

      {/* Sticky sort */}
      <div style={{
        position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        background: 'var(--aura-ink)', color: '#fff', borderRadius: 999,
        padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Sortuj: Polecane</span>
        <span style={{ opacity: 0.4 }}>|</span>
        <Icon.filter />
      </div>
    </MobileShell>
  );
}

// ── Mobile PDP ───────────────────────────────────────────────────────
function MobilePDP() {
  const p = AURA_PRODUCTS[0];
  return (
    <MobileShell bg="#fff">
      <Header mobile cartCount={2} />
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
        {/* Gallery */}
        <div style={{ position: 'relative', aspectRatio: '1 / 1', background: 'var(--aura-paper-2)', display: 'grid', placeItems: 'center' }}>
          <CoffeeBag width={220} accent={p.accent} name={p.name.toUpperCase()} sub={`${p.origin} · 250g`} />
          {/* Pagination dots */}
          <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {[1,2,3,4].map(i => (
              <span key={i} style={{ width: i === 1 ? 18 : 6, height: 6, borderRadius: 3, background: i === 1 ? 'var(--aura-ink)' : 'rgba(0,0,0,0.2)' }} />
            ))}
          </div>
          {/* Decorative ill placeholder */}
          <div style={{ position: 'absolute', top: 14, right: 14, opacity: 0.95 }}>
            <Starburst color={p.accent} size={56} points={10} depth={0.22} />
          </div>
        </div>

        <div style={{ padding: '24px 20px 30px' }}>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 10 }}>{p.badge} · {p.origin}</div>
          <h1 style={{ fontSize: 38 }}>{p.name}</h1>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 14 }}>
            <div className="num" style={{ fontSize: 24, fontWeight: 700 }}>{p.price} zł</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--aura-muted)' }}>
              <div style={{ display: 'flex', color: 'var(--aura-orange)', gap: 1 }}>{[1,2,3,4,5].map(s => <Icon.star key={s} />)}</div>
              4.9 · 312 ocen
            </div>
          </div>
          <p style={{ marginTop: 16, fontSize: 14, color: 'var(--aura-ink-2)', lineHeight: 1.5 }}>{p.desc}</p>

          <div className="divider" style={{ margin: '22px 0' }} />

          {/* Variants */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <VariantPills label="Gramatura" options={['250g', '500g', '1kg']} value="250g" onChange={() => {}} />
            <VariantPills label="Forma" options={['Ziarno', 'Mielona — espresso', 'Mielona — filtr']} value="Ziarno" onChange={() => {}} />
          </div>

          <div className="divider" style={{ margin: '22px 0' }} />

          {/* Sensory */}
          <div className="eyebrow" style={{ marginBottom: 12 }}>Nuty smakowe</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
            {p.notes.map(n => <span key={n} className="chip orange">{n}</span>)}
          </div>

          {/* Roast profile slider */}
          <div className="eyebrow" style={{ marginBottom: 10 }}>Profil palenia</div>
          <RoastBar level={3} />

          <div className="divider" style={{ margin: '22px 0' }} />

          {/* Methods */}
          <div className="eyebrow" style={{ marginBottom: 10 }}>Pod jakie parzenie</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {p.methods.map(m => <span key={m} className="chip"><Icon.check /> {m}</span>)}
          </div>

          <div className="divider" style={{ margin: '22px 0' }} />

          {/* Trust */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <TrustLine icon={<Icon.bean />} txt="Palona 8 listopada · 14 dni temu" />
            <TrustLine icon={<Icon.truck />} txt="Wysyłka 24h · Darmowa od 150 zł" />
            <TrustLine icon={<Icon.check />} txt="14 dni na zwrot bez powodu" />
          </div>

          <div className="divider" style={{ margin: '26px 0 18px' }} />

          {/* Similar */}
          <div className="eyebrow" style={{ marginBottom: 14 }}>Podobne blendy</div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '0 -20px', padding: '0 20px' }} className="no-scrollbar">
            {AURA_PRODUCTS.slice(1, 4).map(s => (
              <div key={s.id} style={{ minWidth: 160 }}>
                <ProductCard p={s} compact />
              </div>
            ))}
          </div>
          <div style={{ height: 12 }} />
        </div>
      </div>

      {/* Sticky add-to-cart */}
      <div className="mobile-sticky" style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <QtyStepper value={1} onChange={() => {}} />
        <button className="btn btn-block" style={{ flex: 1 }}>
          Dodaj · <span className="num">{p.price} zł</span>
        </button>
      </div>
    </MobileShell>
  );
}
function RoastBar({ level = 3 }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--aura-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 8 }}>
        <span>Jasne</span><span>Średnie</span><span>Ciemne</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ flex: 1, height: 8, borderRadius: 4,
            background: i <= level ? 'var(--aura-orange)' : 'var(--aura-line)' }} />
        ))}
      </div>
    </div>
  );
}
function TrustLine({ icon, txt }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13 }}>
      <span style={{ color: 'var(--aura-orange)' }}>{icon}</span>
      {txt}
    </div>
  );
}

// ── Mobile Cart drawer (full sheet from right) ───────────────────────
function MobileCart() {
  const items = [
    { p: AURA_PRODUCTS[0], qty: 1, variant: '250g · Ziarno' },
    { p: AURA_PRODUCTS[2], qty: 2, variant: '250g · Espresso' },
  ];
  const subtotal = items.reduce((s, i) => s + i.p.price * i.qty, 0);
  return (
    <MobileShell bg="rgba(0,0,0,0.4)">
      {/* dimmed bg */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,12,0.45)' }} />
      {/* drawer */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%',
        background: '#fff', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--aura-line)' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--aura-orange)' }}>Koszyk · {items.reduce((s,i)=>s+i.qty,0)} szt.</div>
            <h2 style={{ fontSize: 20, marginTop: 4 }}>Twój wybór</h2>
          </div>
          <button style={iconBtn('var(--aura-ink)')}><Icon.close /></button>
        </div>

        <div style={{ padding: '16px 20px' }}>
          <FreeShippingProgress subtotal={subtotal} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px' }} className="no-scrollbar">
          {items.map((it, i) => (
            <CartLine key={i} {...it} />
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--aura-line)', padding: '20px 20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
            <span style={{ color: 'var(--aura-muted)' }}>Suma częściowa</span>
            <span className="num" style={{ fontWeight: 600 }}>{subtotal} zł</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 14 }}>
            <span style={{ color: 'var(--aura-muted)' }}>Dostawa</span>
            <span className="num" style={{ fontWeight: 600, color: subtotal >= 150 ? 'var(--aura-orange)' : 'inherit' }}>{subtotal >= 150 ? 'Gratis' : '15 zł'}</span>
          </div>
          <div className="divider" style={{ marginBottom: 14 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Razem</span>
            <span className="num" style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.01em' }}>{subtotal + (subtotal >= 150 ? 0 : 15)} zł</span>
          </div>
          <button className="btn btn-block" style={{ height: 52 }}>Przejdź do kasy <Icon.arrow /></button>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginTop: 12, textAlign: 'center' }}>
            Bezpieczna płatność · Shopify Checkout
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
function iconBtnMobile(c) { return iconBtn(c); }
function CartLine({ p, qty, variant }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--aura-line)' }}>
      <div style={{ width: 64, height: 80, background: 'var(--aura-paper-2)', borderRadius: 8, display: 'grid', placeItems: 'center' }}>
        <CoffeeBag width={42} accent={p.accent} name="" sub="" />
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{p.name}</div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginTop: 4 }}>{variant}</div>
        <div style={{ marginTop: 10 }}><QtyStepper size="sm" value={qty} onChange={() => {}} /></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--aura-muted)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>Usuń</button>
        <span className="num" style={{ fontWeight: 700, fontSize: 14 }}>{p.price * qty} zł</span>
      </div>
    </div>
  );
}

// ── Mobile Empty Cart ────────────────────────────────────────────────
function MobileEmptyCart() {
  return (
    <MobileShell bg="#fff">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--aura-line)' }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--aura-muted)' }}>Koszyk · 0 szt.</div>
          <h2 style={{ fontSize: 20, marginTop: 4 }}>Twój wybór</h2>
        </div>
        <button style={iconBtn('var(--aura-ink)')}><Icon.close /></button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <Starburst color="var(--aura-paper-2)" size={180} points={11} depth={0.22}>
            <FigureRunner size={88} color="var(--aura-ink)" />
          </Starburst>
        </div>
        <h2 style={{ fontSize: 30, marginBottom: 12 }}>Koszyk śpi.</h2>
        <p style={{ fontSize: 14, color: 'var(--aura-muted)', lineHeight: 1.55, maxWidth: 280, marginBottom: 24 }}>
          Wrzuć paczkę kawy i obudź go. Mamy świeżo palone — gotowe do wysyłki.
        </p>
        <button className="btn">Sprawdź kawy <Icon.arrow /></button>
        <div style={{ marginTop: 30, width: '100%' }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Może to?</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {AURA_PRODUCTS.slice(0, 2).map(p => <ProductCard key={p.id} p={p} compact />)}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

// ── Mobile Menu (full sheet) ─────────────────────────────────────────
function MobileMenu() {
  return (
    <MobileShell bg="var(--aura-ink)">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', color: '#fff' }}>
        <AuraMark size={20} color="#fff" />
        <button style={iconBtn('#fff')}><Icon.close /></button>
      </div>
      <div style={{ padding: '12px 20px 0', color: '#fff', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0', display: 'flex', flexDirection: 'column' }}>
          {['Produkty', 'Blendy', 'O marce', 'Palarnia', 'FAQ', 'Kontakt'].map((l, i) => (
            <li key={l} style={{
              padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'var(--aura-display)', fontSize: 32, fontWeight: 800,
              letterSpacing: '-0.02em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              {l}
              <Icon.arrow style={{ color: i === 0 ? 'var(--aura-orange)' : 'rgba(255,255,255,0.4)' }} />
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 'auto', padding: '24px 0 16px' }}>
          <button className="btn btn-block" style={{ height: 52 }}>Sprawdź kawy <Icon.arrow /></button>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: 18, textAlign: 'center' }}>
            PL · EN · UA
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

// ── Mobile Search overlay ────────────────────────────────────────────
function MobileSearch() {
  return (
    <MobileShell bg="#fff">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--aura-line)' }}>
        <Icon.search />
        <input defaultValue="esp" placeholder="Szukaj kawy, metody, smaku…" style={{
          flex: 1, border: 'none', outline: 'none', fontFamily: 'var(--aura-text)',
          fontSize: 16, fontWeight: 500
        }} />
        <button style={{ background: 'none', border: 'none', color: 'var(--aura-muted)', fontSize: 13, cursor: 'pointer' }}>Anuluj</button>
      </div>
      <div style={{ padding: '18px 20px', flex: 1, overflowY: 'auto' }} className="no-scrollbar">
        <div className="eyebrow" style={{ marginBottom: 12 }}>Sugerowane</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {['Espresso blend', 'Decaf', 'Single origin', 'Etiopia', 'Filtr', 'Aeropress'].map(t => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>

        <div className="eyebrow" style={{ marginBottom: 12 }}>Produkty (3)</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {AURA_PRODUCTS.slice(0, 3).map(p => (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--aura-line)' }}>
              <div style={{ width: 60, height: 76, background: 'var(--aura-paper-2)', borderRadius: 8, display: 'grid', placeItems: 'center' }}>
                <CoffeeBag width={38} accent={p.accent} name="" sub="" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--aura-muted)', marginTop: 4 }}>{p.origin} · <span className="num">{p.price} zł</span></div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--aura-orange)', marginTop: 4 }}>{p.badge}</div>
              </div>
              <div style={{ alignSelf: 'center', color: 'var(--aura-muted)' }}><Icon.arrow /></div>
            </div>
          ))}
        </div>

        <div className="eyebrow" style={{ marginTop: 24, marginBottom: 12 }}>Ostatnio szukane</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {['Espresso do mleka', 'Coração', 'Decaf'].map(s => (
            <li key={s} style={{ padding: '12px 0', borderBottom: '1px solid var(--aura-line)', fontSize: 14, display: 'flex', justifyContent: 'space-between', color: 'var(--aura-ink)' }}>
              {s}<Icon.arrow />
            </li>
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}

// ── Mobile About ─────────────────────────────────────────────────────
function MobileAbout() {
  return (
    <MobileShell>
      <Header mobile cartCount={2} />
      <div className="no-scrollbar" style={{ overflowY: 'auto', flex: 1 }}>
        <section style={{ padding: '32px 20px 28px', background: 'var(--aura-paper-2)' }}>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>O Aurze</div>
          <h1 style={{ fontSize: 46, lineHeight: 0.95 }}>Palarnia <br/>z charakterem.</h1>
          <p style={{ marginTop: 16, fontSize: 14, color: 'var(--aura-ink-2)', lineHeight: 1.6 }}>
            Aura urodziła się w 2021 w warsztacie na Pradze. Bez patosu, bez nadęcia. Robimy specialty, którą sami chcemy pić.
          </p>
        </section>

        <div className="ph" style={{ aspectRatio: '4 / 3', borderRadius: 0 }}>BARISTA / PRAGA</div>

        <section style={{ padding: '36px 20px' }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>2021 → 2026</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {[
              { y: '2021', t: 'Pierwsza palarnia, 5kg wsad, jeden klient.', },
              { y: '2023', t: 'Otwarcie kawiarni, 12 stałych blendów.' },
              { y: '2025', t: 'Direct trade z 4 farmami w Brazylii i Kolumbii.' },
              { y: '2026', t: 'Nowa palarnia, drop 01 — coffee club.' },
            ].map((m, i) => (
              <div key={m.y} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 14 }}>
                <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--aura-orange)' }}>{m.y}</div>
                <div style={{ fontSize: 14, lineHeight: 1.5 }}>{m.t}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: '32px 20px', background: 'var(--aura-ink)', color: '#fff' }}>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 12 }}>Jak palimy</div>
          <h2 style={{ fontSize: 30, color: '#fff' }}>Małe wsady. Świeże ziarno. Bez kompromisów.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 22 }}>
            <Stat n="12kg" l="Wsad" />
            <Stat n="4" l="Farmy" />
            <Stat n="14d" l="Od palenia" />
            <Stat n="2 140" l="Ocen" />
          </div>
        </section>

        <Footer mobile />
      </div>
    </MobileShell>
  );
}
function Stat({ n, l }) {
  return (
    <div style={{ padding: '18px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
      <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 34, color: 'var(--aura-orange)', letterSpacing: '-0.02em' }}>{n}</div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{l}</div>
    </div>
  );
}

// ── Mobile FAQ ───────────────────────────────────────────────────────
function MobileFAQ() {
  return (
    <MobileShell>
      <Header mobile cartCount={2} />
      <div className="no-scrollbar" style={{ overflowY: 'auto', flex: 1 }}>
        <section style={{ padding: '28px 20px 20px' }}>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 10 }}>Pomoc</div>
          <h1 style={{ fontSize: 36 }}>Dostawa, zwroty, FAQ</h1>
        </section>

        {/* Quick tiles */}
        <section style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Tile icon={<Icon.truck />} t="Dostawa" d="24h · DPD / InPost" />
            <Tile icon={<Icon.package />} t="Zwroty" d="14 dni bez powodu" />
            <Tile icon={<Icon.bean />} t="Świeżość" d="Palone < 14 dni" />
            <Tile icon={<Icon.shop />} t="B2B" d="Hurt i HoReCa" />
          </div>
        </section>

        <section style={{ padding: '8px 20px 32px' }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Najczęstsze pytania</div>
          <FAQList />
        </section>
        <Footer mobile />
      </div>
    </MobileShell>
  );
}
function Tile({ icon, t, d }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <span style={{ color: 'var(--aura-orange)' }}>{icon}</span>
      <div style={{ fontWeight: 700, marginTop: 10, fontSize: 14 }}>{t}</div>
      <div style={{ fontSize: 12, color: 'var(--aura-muted)', marginTop: 4 }}>{d}</div>
    </div>
  );
}
function FAQList() {
  const qs = [
    { q: 'Kiedy wyślecie moją paczkę?', a: 'Zamówienia złożone do 13:00 wysyłamy tego samego dnia. Dostawa 24–48h.', open: true },
    { q: 'Czy mogę zwrócić otwartą paczkę?' },
    { q: 'Mielona czy ziarnista — co wybrać?' },
    { q: 'Czy macie kawę bez kofeiny?' },
    { q: 'Robicie subskrypcję?' },
    { q: 'Skąd jest wasza kawa?' },
  ];
  return (
    <div style={{ borderTop: '1px solid var(--aura-line)' }}>
      {qs.map((x, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--aura-line)', padding: '16px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>{x.q}</span>
            <span style={{ width: 24, height: 24, borderRadius: 999, background: x.open ? 'var(--aura-orange)' : 'var(--aura-paper-2)', color: x.open ? '#fff' : 'var(--aura-ink)', display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 700 }}>{x.open ? '−' : '+'}</span>
          </div>
          {x.open && <p style={{ marginTop: 10, fontSize: 13, color: 'var(--aura-muted)', lineHeight: 1.6 }}>{x.a}</p>}
        </div>
      ))}
    </div>
  );
}

// ── Mobile Contact ───────────────────────────────────────────────────
function MobileContact() {
  return (
    <MobileShell>
      <Header mobile cartCount={2} />
      <div className="no-scrollbar" style={{ overflowY: 'auto', flex: 1 }}>
        <section style={{ padding: '28px 20px 20px' }}>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 10 }}>Kontakt</div>
          <h1 style={{ fontSize: 44, lineHeight: 0.95 }}>Pisz śmiało.</h1>
          <p style={{ marginTop: 14, fontSize: 14, color: 'var(--aura-ink-2)', lineHeight: 1.55 }}>
            Odpowiadamy w 24h, w dni robocze najczęściej szybciej.
          </p>
        </section>

        {/* Quick channels */}
        <section style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ContactTile label="Mail" v="hello@auracoffee.pl" big />
            <ContactTile label="Telefon" v="+48 22 123 45 67" big />
            <ContactTile label="B2B / hurt" v="b2b@auracoffee.pl" />
            <ContactTile label="Współpraca" v="hi@auracoffee.pl" />
          </div>
        </section>

        {/* Palarnia card */}
        <section style={{ padding: '0 20px 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Palarnia</div>
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 22, letterSpacing: '-0.02em', marginBottom: 8 }}>ul. Ząbkowska 16</h3>
            <p style={{ fontSize: 13, color: 'var(--aura-muted)', lineHeight: 1.55 }}>03–736 Warszawa<br/>Pn–Pt 9–17 · Sb 10–14<br/>Cupping w piątki 17:00</p>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 14 }}>Otwórz w mapach</button>
          </div>
        </section>

        {/* Form (compact) */}
        <section style={{ padding: '0 20px 32px' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Albo formularz</div>
          <div className="card" style={{ padding: 18 }}>
            <MobileField label="Mail" placeholder="anna@firma.pl" />
            <div style={{ height: 14 }} />
            <div className="eyebrow" style={{ marginBottom: 8 }}>Temat</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Zamówienie', 'B2B', 'Współpraca', 'Inne'].map((t, i) => (
                <button key={t} className={`chip ${i === 0 ? 'active' : ''}`} style={{ fontSize: 12, height: 32 }}>{t}</button>
              ))}
            </div>
            <div style={{ height: 14 }} />
            <MobileField label="Wiadomość" placeholder="O co chodzi?" textarea />
            <button className="btn btn-block" style={{ marginTop: 16 }}>Wyślij <Icon.arrow /></button>
          </div>
        </section>

        <Footer mobile />
      </div>
    </MobileShell>
  );
}
function ContactTile({ label, v, sub, big = false }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: big ? 14 : 13, fontWeight: 700, letterSpacing: '-0.005em', wordBreak: 'break-word' }}>{v}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--aura-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
function MobileField({ label, placeholder, textarea = false }) {
  const common = {
    width: '100%', border: '1.5px solid var(--aura-line)', borderRadius: 10,
    padding: '12px 14px', fontFamily: 'var(--aura-text)', fontSize: 14, outline: 'none',
    background: 'var(--aura-paper)', boxSizing: 'border-box',
  };
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>
      {textarea
        ? <textarea placeholder={placeholder} rows={4} style={{ ...common, resize: 'vertical', minHeight: 90 }} />
        : <input placeholder={placeholder} style={common} />}
    </div>
  );
}

Object.assign(window, {
  MobileHome, MobileListing, MobilePDP, MobileCart, MobileEmptyCart,
  MobileMenu, MobileSearch, MobileAbout, MobileFAQ, MobileContact,
  MOBILE_W, MOBILE_H
});
