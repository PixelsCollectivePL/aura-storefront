/* eslint-disable no-undef */
/* Aura — Customer Account panel · shared shell + primitives.
   Lives within the existing Aura v2.1 design language: paper/ink base,
   orange accent, Archivo/DM Sans/JetBrains Mono, receipt/paragon cards,
   starburst detail. NEVER invent new tokens — reuse var(--aura-*).         */

// ── Mock data (Shopify-shaped) ──────────────────────────────────────
const ACCT_CUSTOMER = {
  id: 'gid://shopify/Customer/1029384756',
  firstName: 'Kuba',
  lastName: 'Wójcik',
  email: 'kuba@pixelscollective.pl',
  phone: '+48 600 412 087',
  acceptsMarketing: true,
  acceptsSms: false,
  createdAt: '2024-09-18',
};

const ACCT_ORDERS = [
  {
    id: 'gid://shopify/Order/5582901',
    name: '#AU-1042',
    processedAt: '2026-05-22',
    fulfillmentStatus: 'in_transit',     // unfulfilled · in_transit · delivered · cancelled
    financialStatus: 'paid',             // paid · pending · refunded
    totalPrice: 156,
    shippingPrice: 0,
    currency: 'PLN',
    trackingCarrier: 'InPost',
    trackingNumber: '693403812749',
    trackingEta: '2026-05-28',
    invoiceUrl: '#',
    items: [
      { id: 'coracao-250-ziarno', name: 'Coração do Brasil', variant: '250g · Ziarno', qty: 1, price: 64, accent: 'var(--aura-orange)' },
      { id: 'verde-250-filtr',    name: 'Verde Tropical',    variant: '250g · Mielona — filtr', qty: 1, price: 72, accent: 'var(--aura-green)' },
      { id: 'aurora-clip',        name: 'Klips do paczki',   variant: 'Stalowy · czarny', qty: 2, price: 10, accent: 'var(--aura-ink)' },
    ],
    address: {
      name: 'Kuba Wójcik',
      line1: 'ul. Próżna 14/8',
      line2: '',
      city: '00-107 Warszawa',
      country: 'Polska',
      phone: '+48 600 412 087',
    },
    payment: { brand: 'Visa', last4: '4242' },
  },
  {
    id: 'gid://shopify/Order/5572101',
    name: '#AU-1031',
    processedAt: '2026-05-08',
    fulfillmentStatus: 'delivered',
    financialStatus: 'paid',
    totalPrice: 142,
    shippingPrice: 0,
    currency: 'PLN',
    items: [
      { id: 'lila-500-ziarno', name: 'Lila Nocturna', variant: '500g · Ziarno', qty: 1, price: 142, accent: 'var(--aura-purple)' },
    ],
  },
  {
    id: 'gid://shopify/Order/5560044',
    name: '#AU-1018',
    processedAt: '2026-04-22',
    fulfillmentStatus: 'delivered',
    financialStatus: 'paid',
    totalPrice: 78,
    shippingPrice: 12,
    currency: 'PLN',
    items: [
      { id: 'mezcla-250-ziarno', name: 'Mezcla Casa', variant: '250g · Ziarno', qty: 1, price: 58, accent: 'var(--aura-orange)' },
      { id: 'card', name: 'Pocztówka Aura', variant: 'Drop 01', qty: 2, price: 4, accent: 'var(--aura-ink)' },
    ],
  },
  {
    id: 'gid://shopify/Order/5541920',
    name: '#AU-0994',
    processedAt: '2026-04-01',
    fulfillmentStatus: 'delivered',
    financialStatus: 'paid',
    totalPrice: 64,
    shippingPrice: 12,
    currency: 'PLN',
    items: [
      { id: 'coracao-250-ziarno', name: 'Coração do Brasil', variant: '250g · Ziarno', qty: 1, price: 64, accent: 'var(--aura-orange)' },
    ],
  },
];

const ACCT_SUBSCRIPTION = {
  id: 'gid://aura-subs/Sub/77',
  status: 'active',
  blendId: 'coracao',
  blendName: 'Coração do Brasil',
  variant: '500g · Ziarno',
  cadenceWeeks: 2,
  nextShipmentAt: '2026-06-04',
  priceCycle: 118,
  paymentStatus: 'ok',          // ok · failed · paused
  startedAt: '2026-01-12',
  cyclesDelivered: 9,
  accent: 'var(--aura-orange)',
};

const ACCT_ADDRESSES = [
  {
    id: 'addr-1', isDefault: true, label: 'Dom',
    name: 'Kuba Wójcik',
    line1: 'ul. Próżna 14/8', city: '00-107 Warszawa', country: 'Polska',
    phone: '+48 600 412 087',
  },
  {
    id: 'addr-2', isDefault: false, label: 'Studio',
    name: 'Pixels Collective sp. z o.o.',
    line1: 'ul. Krucza 41', city: '00-525 Warszawa', country: 'Polska',
    phone: '+48 22 290 11 04',
  },
];

// ── Status helpers ─────────────────────────────────────────────────
const STATUS_LABEL = {
  unfulfilled: { label: 'W przygotowaniu', dot: '#C19A2A' },
  in_transit:  { label: 'W drodze',        dot: 'var(--aura-orange)' },
  delivered:   { label: 'Dostarczone',     dot: 'var(--aura-green)' },
  cancelled:   { label: 'Anulowane',       dot: 'var(--aura-muted)' },
  paid:        { label: 'Opłacone',        dot: 'var(--aura-green)' },
  pending:     { label: 'Czeka na płatność', dot: '#C19A2A' },
  refunded:    { label: 'Zwrócone',        dot: 'var(--aura-muted)' },
};

function StatusPill({ kind, big = false, dark = false }) {
  const s = STATUS_LABEL[kind] || { label: kind, dot: 'var(--aura-muted)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: big ? '6px 14px' : '4px 10px',
      borderRadius: 999,
      background: dark ? 'rgba(255,255,255,0.08)' : '#fff',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.18)' : 'var(--aura-line)'}`,
      fontFamily: 'var(--aura-mono)',
      fontSize: big ? 12 : 11,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: dark ? '#fff' : 'var(--aura-ink)', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: s.dot, display: 'inline-block' }} />
      {s.label}
    </span>
  );
}

// ── PLN formatting ─────────────────────────────────────────────────
const zl = (n) => `${new Intl.NumberFormat('pl-PL').format(n)} zł`;
const dateLong = (iso) => new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
const dateShort = (iso) => new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long' }).format(new Date(iso));

// ── Receipt-style ticked divider (perforation) ─────────────────────
function Perforation({ color = 'var(--aura-line)', dark = false }) {
  // tiny dashed line — paragon perforation feel
  return (
    <div style={{
      height: 12,
      backgroundImage: `radial-gradient(circle at 6px 6px, ${dark ? 'rgba(255,255,255,0.18)' : color} 1.5px, transparent 1.6px)`,
      backgroundSize: '12px 12px',
      backgroundRepeat: 'repeat-x',
      backgroundPosition: 'left center',
    }} />
  );
}

// ── Stat / data row (paragon style — label left mono, value right) ─
function ReceiptRow({ label, value, strong = false, dark = false, mono = false }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      gap: 16, padding: '10px 0', borderBottom: `1px dashed ${dark ? 'rgba(255,255,255,0.12)' : 'var(--aura-line)'}`,
    }}>
      <span style={{
        fontFamily: 'var(--aura-mono)', fontSize: 11, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.55)' : 'var(--aura-muted)',
      }}>{label}</span>
      <span className={mono ? 'mono num' : 'num'} style={{
        fontSize: strong ? 16 : 14, fontWeight: strong ? 700 : 500,
        color: dark ? '#fff' : 'var(--aura-ink)', textAlign: 'right',
        fontFamily: mono ? 'var(--aura-mono)' : 'var(--aura-text)',
      }}>{value}</span>
    </div>
  );
}

// ── Sidebar nav (desktop) ──────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'dashboard',  label: 'Dashboard',     ico: 'home' },
  { key: 'orders',     label: 'Zamówienia',    ico: 'box',   badge: ACCT_ORDERS.length },
  { key: 'subs',       label: 'Subskrypcje',   ico: 'repeat', badgeDot: true },
  { key: 'addresses',  label: 'Adresy',        ico: 'pin' },
  { key: 'details',    label: 'Dane konta',    ico: 'user' },
];

function NavIcon({ name }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'home')   return <svg {...common}><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1z"/></svg>;
  if (name === 'box')    return <svg {...common}><path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>;
  if (name === 'repeat') return <svg {...common}><path d="M4 12a8 8 0 0114-5l2-2"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 01-14 5l-2 2"/><path d="M4 20v-4h4"/></svg>;
  if (name === 'pin')    return <svg {...common}><path d="M12 22s7-7 7-13a7 7 0 10-14 0c0 6 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>;
  if (name === 'user')   return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1"/></svg>;
  if (name === 'logout') return <svg {...common}><path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3"/><path d="M10 17l-5-5 5-5"/><path d="M5 12h11"/></svg>;
  if (name === 'arrow')  return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
  if (name === 'shield') return <svg {...common}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>;
  if (name === 'plus')   return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
  if (name === 'edit')   return <svg {...common}><path d="M16 3l5 5-12 12H4v-5z"/></svg>;
  if (name === 'check')  return <svg {...common}><path d="M5 12l4 4 10-10"/></svg>;
  if (name === 'pause')  return <svg {...common}><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>;
  if (name === 'skip')   return <svg {...common}><path d="M5 5l7 7-7 7M14 5l7 7-7 7"/></svg>;
  if (name === 'x')      return <svg {...common}><path d="M6 6l12 12M18 6L6 18"/></svg>;
  if (name === 'truck')  return <svg {...common}><rect x="2" y="7" width="13" height="10" rx="1"/><path d="M15 10h4l3 3v4h-7"/><circle cx="6" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>;
  if (name === 'doc')    return <svg {...common}><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/></svg>;
  if (name === 'star')   return <svg {...common}><polygon points="12 2 14.4 8.6 21.5 9 16 13.6 17.8 20.5 12 16.8 6.2 20.5 8 13.6 2.5 9 9.6 8.6 12 2" fill="currentColor" stroke="none"/></svg>;
  if (name === 'phone')  return <svg {...common}><path d="M22 16.92v3a2 2 0 01-2.18 2A19.8 19.8 0 012 4.18 2 2 0 014 2h3a2 2 0 012 1.72c.13.96.36 1.9.68 2.8a2 2 0 01-.45 2.11L8 9.91a16 16 0 006 6l1.27-1.23a2 2 0 012.11-.45c.9.32 1.84.55 2.8.68A2 2 0 0122 16.92z"/></svg>;
  return null;
}

function Sidebar({ active = 'dashboard' }) {
  return (
    <aside style={{
      width: 280, flexShrink: 0,
      background: '#fff',
      borderRight: '1px solid var(--aura-line)',
      padding: '32px 28px',
      display: 'flex', flexDirection: 'column', gap: 24,
      minHeight: '100%',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Starburst color="var(--aura-orange)" size={22} points={10} depth={0.28} />
        <span style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', color: 'var(--aura-ink)' }}>AURA</span>
        <span className="eyebrow" style={{ marginLeft: 'auto', color: 'var(--aura-muted)', fontSize: 10 }}>Konto</span>
      </div>

      {/* Greeting block */}
      <div>
        <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 6 }}>Cześć</div>
        <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.025em', lineHeight: 1, color: 'var(--aura-ink)' }}>{ACCT_CUSTOMER.firstName}.</div>
        <div style={{ fontFamily: 'var(--aura-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginTop: 8 }}>
          Klient od {dateShort(ACCT_CUSTOMER.createdAt)} {new Date(ACCT_CUSTOMER.createdAt).getFullYear()}
        </div>
      </div>

      <div className="divider" />

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(it => {
          const isActive = it.key === active;
          return (
            <a key={it.key} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 12px', borderRadius: 10, cursor: 'pointer',
              background: isActive ? 'var(--aura-ink)' : 'transparent',
              color: isActive ? '#fff' : 'var(--aura-ink)',
              fontFamily: 'var(--aura-text)', fontSize: 14, fontWeight: 500,
              letterSpacing: '-0.005em', position: 'relative',
            }}>
              <NavIcon name={it.ico} />
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.badge != null && (
                <span className="mono num" style={{
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'var(--aura-paper-2)',
                  color: isActive ? '#fff' : 'var(--aura-muted)',
                  fontSize: 10, letterSpacing: '0.08em',
                  padding: '2px 7px', borderRadius: 999, fontWeight: 600,
                }}>{it.badge}</span>
              )}
              {it.badgeDot && (
                <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--aura-orange)' }} />
              )}
            </a>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Secure account note */}
      <div style={{
        padding: '14px 14px', borderRadius: 12,
        background: 'var(--aura-paper-2)',
        border: '1px solid var(--aura-line)',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <div style={{ color: 'var(--aura-ink)', flexShrink: 0, marginTop: 1 }}>
          <NavIcon name="shield" />
        </div>
        <div>
          <div className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>Bezpieczne konto</div>
          <div style={{ fontSize: 12, lineHeight: 1.4, color: 'var(--aura-muted)' }}>
            Dane logowania zarządzane przez konto klienta Shopify.
          </div>
          <a style={{ fontSize: 12, fontWeight: 600, color: 'var(--aura-ink)', textDecoration: 'underline', textUnderlineOffset: 3, marginTop: 6, display: 'inline-block', cursor: 'pointer' }}>
            Zarządzaj kontem ↗
          </a>
        </div>
      </div>

      {/* Logout */}
      <a style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px', color: 'var(--aura-muted)',
        fontFamily: 'var(--aura-text)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
      }}>
        <NavIcon name="logout" /> Wyloguj
      </a>
    </aside>
  );
}

// ── Account page top-strip (eyebrow · title · CTA) ─────────────────
function PageHead({ eyebrow, title, action, mono = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
      <div>
        {eyebrow && <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 12 }}>{eyebrow}</div>}
        <h1 style={{
          fontFamily: 'var(--aura-display)', fontWeight: 800,
          fontSize: 'clamp(40px, 4.5vw, 64px)', lineHeight: 0.95, letterSpacing: '-0.03em',
          color: 'var(--aura-ink)',
        }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}

// ── Mobile · top bar + section header ──────────────────────────────
function MobileBar({ title, back = false, action = null }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px',
      background: '#fff',
      borderBottom: '1px solid var(--aura-line)',
      position: 'sticky', top: 0, zIndex: 5,
    }}>
      {back ? (
        <button style={{ background: 'none', border: 'none', padding: 6, cursor: 'pointer', color: 'var(--aura-ink)', display: 'inline-flex' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      ) : (
        <Starburst color="var(--aura-orange)" size={20} points={10} depth={0.28} />
      )}
      <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>{title}</div>
      <div style={{ width: 28, display: 'flex', justifyContent: 'flex-end' }}>{action}</div>
    </header>
  );
}

function MobileTabBar({ active = 'dashboard' }) {
  const items = [
    { key: 'dashboard', label: 'Konto',     ico: 'home' },
    { key: 'orders',    label: 'Zamówienia', ico: 'box' },
    { key: 'subs',      label: 'Subskrypcja', ico: 'repeat' },
    { key: 'menu',      label: 'Menu',     ico: 'user' },
  ];
  return (
    <nav style={{
      position: 'sticky', bottom: 0,
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      background: '#fff', borderTop: '1px solid var(--aura-line)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {items.map(it => {
        const isActive = it.key === active;
        return (
          <button key={it.key} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '12px 0 14px', background: 'none', border: 'none', cursor: 'pointer',
            color: isActive ? 'var(--aura-ink)' : 'var(--aura-muted)',
            fontFamily: 'var(--aura-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600,
            position: 'relative',
          }}>
            <NavIcon name={it.ico} />
            <span>{it.label}</span>
            {isActive && <span style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: 24, height: 3, background: 'var(--aura-orange)', borderRadius: '0 0 3px 3px',
            }} />}
          </button>
        );
      })}
    </nav>
  );
}

// ── Empty-state composition (used both desktop & mobile) ───────────
function EmptyState({ title, body, cta, secondaryCta, accent = 'var(--aura-orange)' }) {
  return (
    <div style={{
      padding: '64px 32px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20,
      background: '#fff', borderRadius: 'var(--r-md)', border: '1px solid var(--aura-line)',
    }}>
      <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
        <Starburst color="var(--aura-paper-2)" size={180} points={12} depth={0.22}>
          <FigureRunner size={92} color="var(--aura-ink)" />
        </Starburst>
      </div>
      <div>
        <h2 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 40, letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 12 }}>{title}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--aura-muted)', maxWidth: 420, margin: '0 auto' }}>{body}</p>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {cta && <button className="btn">{cta}</button>}
        {secondaryCta && <button className="btn btn-ghost">{secondaryCta}</button>}
      </div>
    </div>
  );
}

// ── Mini coffee bag (compact for order rows) ───────────────────────
function MiniBag({ accent = 'var(--aura-orange)', label = 'CRC' }) {
  return (
    <div style={{
      width: 72, height: 90, borderRadius: 6,
      background: 'linear-gradient(160deg, #1a1815 0%, #0a0a08 60%, #16140f 100%)',
      position: 'relative', flexShrink: 0,
      display: 'grid', placeItems: 'center',
      boxShadow: '0 6px 14px rgba(14,14,12,0.18)',
    }}>
      <Starburst color={accent} size={42} points={10} depth={0.22}>
        <FigureRunner size={22} color="var(--aura-ink)" />
      </Starburst>
      <span style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center',
        fontFamily: 'var(--aura-mono)', fontSize: 7, letterSpacing: '0.18em', color: '#fff', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

// ── Shopify integration footnote (visible per-screen) ──────────────
function ShopifyNote({ items }) {
  return (
    <div style={{
      padding: '14px 18px',
      background: 'transparent',
      border: '1px dashed var(--aura-line-strong)',
      borderRadius: 10,
      display: 'flex', gap: 14, alignItems: 'flex-start',
      marginTop: 24,
    }}>
      <div className="eyebrow" style={{ background: 'var(--aura-ink)', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 10, letterSpacing: '0.14em', flexShrink: 0 }}>
        Shopify ↗
      </div>
      <div style={{ fontFamily: 'var(--aura-mono)', fontSize: 11, lineHeight: 1.55, color: 'var(--aura-ink)', letterSpacing: '0.02em' }}>
        {items.map((it, i) => (
          <span key={i}>
            <span style={{ color: 'var(--aura-muted)' }}>{it.k}</span>
            <span style={{ margin: '0 6px', color: 'var(--aura-muted)' }}>=</span>
            <span style={{ color: 'var(--aura-ink)' }}>{it.v}</span>
            {i < items.length - 1 && <span style={{ color: 'var(--aura-muted)', margin: '0 12px' }}>·</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  ACCT_CUSTOMER, ACCT_ORDERS, ACCT_SUBSCRIPTION, ACCT_ADDRESSES,
  STATUS_LABEL, StatusPill, zl, dateLong, dateShort,
  Perforation, ReceiptRow, Sidebar, NavIcon, PageHead,
  MobileBar, MobileTabBar, EmptyState, MiniBag, ShopifyNote,
});
