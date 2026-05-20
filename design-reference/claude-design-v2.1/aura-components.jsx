/* eslint-disable no-undef */
/* Aura — shared data + reusable UI components */

// ── Mock product catalog ─────────────────────────────────────────────
const AURA_PRODUCTS = [
  {
    id: 'coracao',
    name: 'Coração do Brasil',
    origin: 'Brazylia · Cerrado',
    roast: 'Średnie',
    process: 'Natural',
    notes: ['Czekolada', 'Orzech', 'Karmel'],
    methods: ['Espresso', 'Moka', 'Aeropress'],
    accent: 'var(--aura-orange)',
    price: 64,
    badge: 'Bestseller',
    desc: 'Klasyk z karku Cerrado. Pełne ciało, kakaowa baza, długi finisz. Robi robotę w mleku i solo.'
  },
  {
    id: 'verde',
    name: 'Verde Tropical',
    origin: 'Etiopia · Sidamo',
    roast: 'Jasne',
    process: 'Washed',
    notes: ['Cytrus', 'Bergamotka', 'Jaśmin'],
    methods: ['V60', 'Chemex', 'Aeropress'],
    accent: 'var(--aura-green)',
    price: 72,
    badge: 'Single Origin',
    desc: 'Jasne, kwiatowe, z cytrusowym kopem. Filtrowo. Świeży poranek w kubku.'
  },
  {
    id: 'lila',
    name: 'Lila Nocturna',
    origin: 'Kolumbia · Huila',
    roast: 'Średnio-ciemne',
    process: 'Honey',
    notes: ['Śliwka', 'Kakao', 'Wino'],
    methods: ['Espresso', 'French press'],
    accent: 'var(--aura-purple)',
    price: 78,
    badge: 'Limited',
    desc: 'Głęboka, owocowa, lekko winna. Pasuje na wieczór po kolacji.'
  },
  {
    id: 'mezcla',
    name: 'Mezcla Casa',
    origin: 'Blend · BR+CO',
    roast: 'Średnie',
    process: 'Mix',
    notes: ['Mleczna czekolada', 'Migdał'],
    methods: ['Espresso', 'Moka'],
    accent: 'var(--aura-orange)',
    price: 58,
    badge: 'Codzienna',
    desc: 'Bezpieczny wybór do ekspresu. Słodka, zbalansowana, niewymagająca.'
  },
  {
    id: 'rio',
    name: 'Rio Decaf',
    origin: 'Brazylia · Swiss Water',
    roast: 'Średnie',
    process: 'Decaf',
    notes: ['Orzech laskowy', 'Toffi'],
    methods: ['Espresso', 'Aeropress'],
    accent: 'var(--aura-green)',
    price: 68,
    badge: 'Decaf',
    desc: 'Bez kofeiny, z pełnym smakiem. Dla wieczornych ekspresjofilów.'
  },
  {
    id: 'aurora',
    name: 'Aurora',
    origin: 'Kenia · Nyeri',
    roast: 'Jasne',
    process: 'Washed',
    notes: ['Czarna porzeczka', 'Pomidor'],
    methods: ['V60', 'Chemex'],
    accent: 'var(--aura-purple)',
    price: 84,
    badge: 'Micro lot',
    desc: 'Wibrująca kwasowość, pomidorowa głębia. Dla osób, które wiedzą, czego chcą.'
  }
];

// ── Icons (small inline SVGs — original) ─────────────────────────────
const Icon = {
  cart: (p={}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h8.7a2 2 0 002-1.5L21 8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>,
  search: (p={}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  menu: (p={}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M3 7h18M3 17h18"/></svg>,
  close: (p={}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>,
  plus: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  minus: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...p}><path d="M5 12h14"/></svg>,
  arrow: (p={}) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  filter: (p={}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M4 6h16M7 12h10M10 18h4"/></svg>,
  truck: (p={}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="7" width="13" height="10" rx="1"/><path d="M15 10h4l3 3v4h-7"/><circle cx="6" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>,
  star: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l3 6.5 7 .9-5.2 4.6L18 21l-6-3.4L6 21l1.2-7L2 9.4l7-.9z"/></svg>,
  check: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12l4 4 10-10"/></svg>,
  bean: (p={}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}><ellipse cx="12" cy="12" rx="6" ry="9" transform="rotate(20 12 12)"/><path d="M9 5c2 5 2 9 0 14" stroke="#fff" strokeWidth="1.2" fill="none"/></svg>,
  shop: (p={}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M4 8h16l-1 12H5z"/><path d="M9 8V5a3 3 0 016 0v3"/></svg>,
  package: (p={}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>,
};

// ── Header (desktop + mobile use it differently) ─────────────────────
function Header({ mobile = false, onMenu, onSearch, onCart, cartCount = 0, transparent = false }) {
  const bg = transparent ? 'transparent' : '#fff';
  const border = transparent ? 'transparent' : 'var(--aura-line)';
  const color = transparent ? '#fff' : 'var(--aura-ink)';
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: mobile ? '14px 16px' : '18px 40px',
      background: bg, borderBottom: `1px solid ${border}`,
      color, position: 'relative', zIndex: 2
    }}>
      {mobile && (
        <button onClick={onMenu} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>
          <Icon.menu />
        </button>
      )}
      {!mobile && (
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a className="navlink" style={navLink(color)}>Produkty</a>
          <a className="navlink" style={navLink(color)}>Blendy</a>
          <a className="navlink" style={navLink(color)}>O marce</a>
          <a className="navlink" style={navLink(color)}>Palarnia</a>
          <a className="navlink" style={navLink(color)}>FAQ</a>
          <a className="navlink" style={navLink(color)}>Kontakt</a>
        </nav>
      )}
      <div style={{ position: mobile ? 'static' : 'absolute', left: '50%', transform: mobile ? 'none' : 'translateX(-50%)' }}>
        <AuraMark size={mobile ? 18 : 22} color={color} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 14 : 18 }}>
        <button onClick={onSearch} style={iconBtn(color)}><Icon.search /></button>
        {!mobile && <a style={{ ...navLink(color), fontSize: 13 }}>Konto</a>}
        <button onClick={onCart} style={{ ...iconBtn(color), position: 'relative' }}>
          <Icon.cart />
          {cartCount > 0 && <span style={{
            position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, borderRadius: 9,
            background: 'var(--aura-orange)', color: '#fff', fontSize: 10, fontWeight: 700,
            display: 'grid', placeItems: 'center', padding: '0 5px'
          }}>{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}
function navLink(c) {
  return { color: c, fontFamily: 'var(--aura-text)', fontSize: 13, fontWeight: 500, textDecoration: 'none', cursor: 'pointer', letterSpacing: '-0.005em' };
}
function iconBtn(c) {
  return { background: 'none', border: 'none', color: c, cursor: 'pointer', padding: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
}

// ── Marquee ticker (brand voice strip) ───────────────────────────────
function Ticker({ items, dark = true }) {
  return (
    <div style={{
      background: dark ? 'var(--aura-ink)' : 'var(--aura-orange)',
      color: '#fff',
      padding: '10px 0',
      overflow: 'hidden',
      borderTop: dark ? 'none' : 'none',
      borderBottom: dark ? '1px solid #1B1A17' : 'none',
    }}>
      <div style={{
        display: 'flex', gap: 28, whiteSpace: 'nowrap',
        fontFamily: 'var(--aura-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
      }}>
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
            <span>{t}</span><span aria-hidden style={{ opacity: 0.5 }}>✱</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── ProductCard (responsive) ─────────────────────────────────────────
function ProductCard({ p, compact = false, onQuickAdd }) {
  return (
    <div className="product-card" style={{
      background: '#fff', borderRadius: 'var(--r-md)', border: '1px solid var(--aura-line)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      transition: 'transform .2s ease, box-shadow .2s ease',
    }}>
      <div style={{
        position: 'relative', aspectRatio: '4 / 5', background: 'var(--aura-paper-2)',
        display: 'grid', placeItems: 'center', overflow: 'hidden',
      }}>
        <CoffeeBag width={compact ? 130 : 170} accent={p.accent} name={p.name.toUpperCase()} sub={`${p.origin} · 250g`} />
        {p.badge && (
          <span className="chip" style={{
            position: 'absolute', top: 10, left: 10,
            background: 'var(--aura-ink)', color: '#fff', border: 'none',
            fontFamily: 'var(--aura-mono)', fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase', padding: '4px 8px'
          }}>{p.badge}</span>
        )}
        {onQuickAdd && (
          <button onClick={onQuickAdd} className="quick-add" style={{
            position: 'absolute', bottom: 10, right: 10,
            height: 36, padding: '0 14px', borderRadius: 999,
            background: 'var(--aura-orange)', color: '#fff', border: 'none',
            fontFamily: 'var(--aura-text)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <Icon.plus /> Dodaj
          </button>
        )}
      </div>
      <div style={{ padding: compact ? 14 : 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <h3 style={{ fontSize: compact ? 16 : 18, lineHeight: 1.1, flex: 1 }}>{p.name}</h3>
          <span className="num" style={{ fontWeight: 700, fontSize: compact ? 14 : 15 }}>{p.price} zł</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {p.notes.map(n => (
            <span key={n} className="mono" style={{
              fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--aura-muted)'
            }}>{n}{n !== p.notes[p.notes.length-1] && <span style={{ margin: '0 6px', opacity: 0.5 }}>·</span>}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
          <span style={{ fontSize: 11, color: 'var(--aura-muted)' }}>{p.origin}</span>
          <span style={{ fontSize: 11, color: 'var(--aura-muted)', marginLeft: 'auto' }}>{p.roast}</span>
        </div>
      </div>
    </div>
  );
}

// ── Footer ──────────────────────────────────────────────────────────
function Footer({ mobile = false }) {
  const cols = mobile ? 2 : 4;
  return (
    <footer style={{ background: 'var(--aura-ink)', color: '#fff', padding: mobile ? '36px 20px 24px' : '64px 40px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: mobile ? 28 : 40 }}>
        <div style={{ gridColumn: mobile ? '1 / -1' : 'auto' }}>
          <AuraMark size={mobile ? 22 : 28} color="#fff" tagline />
          <p style={{ marginTop: 14, fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.7)', maxWidth: 260 }}>
            Speciality coffee z polskiej palarni. Świeżo palone, wysyłka w 24h.
          </p>
        </div>
        <FooterCol title="Sklep" links={['Wszystkie kawy', 'Blendy', 'Subskrypcja', 'Karta podarunkowa']} />
        <FooterCol title="Marka" links={['O marce', 'Palarnia', 'Współpraca B2B', 'Coffee club']} />
        <FooterCol title="Pomoc" links={['FAQ', 'Dostawa', 'Zwroty', 'Kontakt']} />
      </div>
      <div className="divider" style={{ background: 'rgba(255,255,255,0.1)', margin: '32px 0 16px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                     fontFamily: 'var(--aura-mono)', fontSize: 10, letterSpacing: '0.1em',
                     textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
        <span>© 2026 AURA Coffee Roasters</span>
        <span>Polityka prywatności · Regulamin</span>
      </div>
    </footer>
  );
}
function FooterCol({ title, links }) {
  return (
    <div>
      <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map(l => <li key={l} style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }}>{l}</li>)}
      </ul>
    </div>
  );
}

// ── Trust strip ─────────────────────────────────────────────────────
function TrustStrip({ dark = false, compact = false }) {
  const items = [
    { icon: <Icon.truck />, txt: 'Darmowa dostawa od 150 zł' },
    { icon: <Icon.bean />, txt: 'Palona w tym tygodniu' },
    { icon: <Icon.package />, txt: 'Wysyłka w 24h' },
    { icon: <Icon.check />, txt: '14 dni na zwrot' },
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${compact ? 2 : 4}, 1fr)`,
      gap: compact ? 12 : 0,
      borderTop: '1px solid var(--aura-line)',
      borderBottom: '1px solid var(--aura-line)',
      background: dark ? 'var(--aura-ink)' : '#fff',
      color: dark ? '#fff' : 'var(--aura-ink)',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: compact ? '14px 12px' : '20px 24px',
          borderRight: !compact && i < items.length - 1 ? `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'var(--aura-line)'}` : 'none',
          fontFamily: 'var(--aura-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase'
        }}>
          <span style={{ color: 'var(--aura-orange)' }}>{it.icon}</span>
          <span>{it.txt}</span>
        </div>
      ))}
    </div>
  );
}

// ── Quantity stepper ────────────────────────────────────────────────
function QtyStepper({ value = 1, onChange = () => {}, size = 'md' }) {
  const h = size === 'sm' ? 30 : 40;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--aura-line)', borderRadius: 999, height: h }}>
      <button onClick={() => onChange(Math.max(1, value - 1))} style={qBtn(h)} aria-label="zmniejsz"><Icon.minus /></button>
      <span className="num" style={{ minWidth: 24, textAlign: 'center', fontWeight: 600, fontSize: 14 }}>{value}</span>
      <button onClick={() => onChange(value + 1)} style={qBtn(h)} aria-label="zwiększ"><Icon.plus /></button>
    </div>
  );
}
function qBtn(h) {
  return { width: h, height: h, background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aura-ink)' };
}

// ── Variant selector (e.g. ziarno/mielona, gramatura) ────────────────
function VariantPills({ options, value, onChange, label = null }) {
  return (
    <div>
      {label && <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map(o => {
          const active = o === value || o.value === value;
          const text = typeof o === 'string' ? o : o.label;
          return (
            <button key={text} onClick={() => onChange(typeof o === 'string' ? o : o.value)} style={{
              height: 40, padding: '0 16px', borderRadius: 999,
              background: active ? 'var(--aura-ink)' : '#fff',
              color: active ? '#fff' : 'var(--aura-ink)',
              border: `1.5px solid ${active ? 'var(--aura-ink)' : 'var(--aura-line)'}`,
              fontFamily: 'var(--aura-text)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              transition: 'all .15s ease',
            }}>{text}</button>
          );
        })}
      </div>
    </div>
  );
}

// ── Free-shipping progress ──────────────────────────────────────────
function FreeShippingProgress({ subtotal, threshold = 150 }) {
  const pct = Math.min(100, (subtotal / threshold) * 100);
  const remaining = Math.max(0, threshold - subtotal);
  return (
    <div style={{ padding: 14, background: 'var(--aura-paper-2)', borderRadius: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 500 }}>
          {remaining > 0
            ? <>Dodaj jeszcze <strong className="num">{remaining} zł</strong> i wysyłka gratis.</>
            : <strong>Masz darmową wysyłkę. Brawo.</strong>}
        </div>
        <Icon.truck />
      </div>
      <div style={{ height: 6, background: '#fff', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--aura-orange)', transition: 'width .3s ease' }} />
      </div>
    </div>
  );
}

// ── Section heading ─────────────────────────────────────────────────
function SectionHead({ eyebrow, title, action, mobile = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                   marginBottom: mobile ? 18 : 28, gap: 16, flexWrap: 'wrap' }}>
      <div>
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--aura-orange)' }}>{eyebrow}</div>}
        <h2 style={{ fontSize: mobile ? 28 : 48, letterSpacing: '-0.025em' }}>{title}</h2>
      </div>
      {action && <a style={{ ...navLink('var(--aura-ink)'), display: 'inline-flex', alignItems: 'center', gap: 6, borderBottom: '1.5px solid var(--aura-ink)', paddingBottom: 2 }}>{action} <Icon.arrow /></a>}
    </div>
  );
}

Object.assign(window, {
  AURA_PRODUCTS, Icon, Header, Ticker, ProductCard, Footer, TrustStrip,
  QtyStepper, VariantPills, FreeShippingProgress, SectionHead
});
