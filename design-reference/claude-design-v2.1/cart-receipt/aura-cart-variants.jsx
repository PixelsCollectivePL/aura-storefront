/* eslint-disable no-undef */
/* Aura — Koszyk · 3 warianty redesignu strony „Twoje zamówienie".
   Cel: wyrzucić generyczny czarny box podsumowania i dodać brand pazura. */

// ── Wspólne dane koszyka ────────────────────────────────────────────
const CART_ITEMS = [
  {
    id: 'two', lot: '002', name: 'TWO',
    origin: 'Colombia · Huila',
    notes: 'cocoa, plum, almond',
    variant: 'Standard · 250g · Ziarno',
    price: 76, qty: 1,
    accent: 'var(--aura-orange)',
  },
  {
    id: 'one', lot: '001', name: 'ONE',
    origin: 'Ethiopia · Yirgacheffe',
    notes: 'cherry, jasmine, bergamot',
    variant: 'Standard · 250g · Ziarno',
    price: 84, qty: 1,
    accent: 'var(--aura-orange)',
  },
];
const SUBTOTAL = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
const FREE_SHIP_THRESHOLD = 150;
const SHIPPING = SUBTOTAL >= FREE_SHIP_THRESHOLD ? 0 : 12;
const TOTAL = SUBTOTAL + SHIPPING;
const ITEMS_COUNT = CART_ITEMS.reduce((s, i) => s + i.qty, 0);

// Helper — striped product thumb (matches existing .ph token but inline so
// each variant can override radii/sizing without overriding global CSS).
function Thumb({ size = 96, dark = false, radius = 8 }) {
  const stripeAlpha = dark ? 0.05 : 0.045;
  const stripeBg = dark ? '#16140F' : 'var(--aura-paper-2)';
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: `repeating-linear-gradient(135deg, rgba(${dark ? '255,255,255' : '14,14,12'},${stripeAlpha}) 0 6px, rgba(0,0,0,0) 6px 14px), ${stripeBg}`,
      display: 'grid', placeItems: 'center',
      fontFamily: 'var(--aura-mono)', fontSize: 9, letterSpacing: '0.18em',
      color: dark ? 'rgba(255,255,255,0.55)' : 'var(--aura-muted)',
      textTransform: 'uppercase',
      flex: '0 0 auto',
    }}>BAG</div>
  );
}

// Small reusable qty stepper (inline, matches existing style)
function QtyMini({ qty = 1, color = 'var(--aura-ink)', muted = 'var(--aura-muted)' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 14,
      border: `1px solid ${color === '#fff' ? 'rgba(255,255,255,0.25)' : 'var(--aura-line)'}`,
      borderRadius: 999, padding: '6px 12px', background: color === '#fff' ? 'transparent' : '#fff',
    }}>
      <button style={{ background: 'none', border: 'none', color, cursor: 'pointer', padding: 0, display: 'grid', placeItems: 'center' }} aria-label="minus">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14"/></svg>
      </button>
      <span className="num" style={{ fontWeight: 600, fontSize: 14, color, minWidth: 14, textAlign: 'center' }}>{qty}</span>
      <button style={{ background: 'none', border: 'none', color, cursor: 'pointer', padding: 0, display: 'grid', placeItems: 'center' }} aria-label="plus">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
  );
}

// Simple slim header — reused across variants
function MiniHeader({ ink = false }) {
  const fg = ink ? '#fff' : 'var(--aura-ink)';
  const bg = ink ? 'var(--aura-ink)' : '#fff';
  const border = ink ? 'rgba(255,255,255,0.08)' : 'var(--aura-line)';
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 56px', background: bg, color: fg,
      borderBottom: `1px solid ${border}`,
    }}>
      <nav style={{ display: 'flex', gap: 26 }}>
        {['Produkty', 'Blendy', 'O marce', 'Kontakt'].map(l => (
          <a key={l} style={{ color: fg, fontSize: 13, fontWeight: 500, letterSpacing: '-0.005em' }}>{l}</a>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Starburst color={ink ? '#fff' : 'var(--aura-orange)'} size={20} points={10} depth={0.28} />
        <span style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', color: fg }}>AURA</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ color: fg, fontSize: 13, fontWeight: 500 }}>Konto</span>
        <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 999, border: `1px solid ${ink ? 'rgba(255,255,255,0.25)' : 'var(--aura-line)'}`, display: 'grid', placeItems: 'center', color: fg }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h8.7a2 2 0 002-1.5L21 8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>
          <span style={{
            position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9,
            background: 'var(--aura-orange)', color: '#fff', fontSize: 10, fontWeight: 700,
            display: 'grid', placeItems: 'center', padding: '0 5px',
          }}>{ITEMS_COUNT}</span>
        </div>
      </div>
    </header>
  );
}

// ════════════════════════════════════════════════════════════════════
// V1 — PAPER EDITORIAL
// Całość na kremowym papierze. Total trafia w wielki, obracający się
// burst, mono-receipt rozpisany poniżej. Items jako listy edytorialne,
// bez kart-pudełek. Biegnąca postać peeka z rogu jak na poster-cup.
// ════════════════════════════════════════════════════════════════════
function CartV1() {
  return (
    <div className="aura" style={{ minHeight: 1300, background: 'var(--aura-paper)', position: 'relative', overflow: 'hidden' }}>
      <MiniHeader />

      {/* Hero header */}
      <section style={{ padding: '54px 56px 28px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 40 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <Starburst color="var(--aura-orange)" size={16} points={10} depth={0.28} />
              <span className="eyebrow" style={{ color: 'var(--aura-orange)' }}>Koszyk · Drop 01 · 2026</span>
            </div>
            <h1 style={{ fontSize: 132, lineHeight: 0.92, letterSpacing: '-0.035em' }}>
              Twoje<br/>zamówienie.
            </h1>
          </div>
          <div style={{ paddingTop: 14, textAlign: 'right' }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>Nr</div>
            <div className="mono num" style={{ fontSize: 22, fontWeight: 600, color: 'var(--aura-ink)', marginTop: 2 }}>AC-1247-26</div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginTop: 16 }}>{ITEMS_COUNT} produkty · w drodze</div>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'var(--aura-line-strong)', margin: '0 56px' }} />

      {/* Layout — items left, summary right */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, padding: '40px 56px 80px', alignItems: 'flex-start' }}>
        {/* LEFT — items */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 22, color: 'var(--aura-ink)' }}>W koszyku</div>
          {CART_ITEMS.map((it, i) => (
            <div key={it.id} style={{
              display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 26, alignItems: 'center',
              padding: '24px 0',
              borderTop: i === 0 ? '1px solid var(--aura-line)' : 'none',
              borderBottom: '1px solid var(--aura-line)',
            }}>
              <Thumb size={110} radius={6} />
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6 }}>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--aura-muted)' }}>LOT {it.lot}</span>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--aura-muted)' }}>·</span>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--aura-muted)' }}>{it.origin}</span>
                </div>
                <h3 style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }}>{it.name}</h3>
                <div style={{ fontSize: 13, color: 'var(--aura-muted)', marginBottom: 14, fontStyle: 'italic' }}>{it.notes}</div>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--aura-ink)', textTransform: 'uppercase' }}>{it.variant}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                <span className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 32, color: 'var(--aura-orange)' }}>{it.price * it.qty} zł</span>
                <QtyMini qty={it.qty} />
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--aura-muted)', fontSize: 12, cursor: 'pointer', padding: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
                  Usuń
                </button>
              </div>
            </div>
          ))}
          {/* Return CTA */}
          <a style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 32,
            color: 'var(--aura-ink)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>
            <span style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid var(--aura-line)', display: 'grid', placeItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </span>
            Wróć do zakupów
          </a>
        </div>

        {/* RIGHT — summary as a poster module (no card, no box) */}
        <div style={{ position: 'sticky', top: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 22 }}>Razem do zapłaty</div>

          {/* The BURST + huge total — anchor of the page */}
          <div style={{ position: 'relative', height: 420, display: 'grid', placeItems: 'center', marginBottom: 24 }}>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', animation: 'aura-spin 32s linear infinite' }}>
              <Starburst color="var(--aura-orange)" size={420} points={12} depth={0.22} />
            </div>
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--aura-ink)', marginBottom: 6 }}>łącznie</div>
              <div className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 900, fontSize: 140, lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--aura-ink)' }}>
                {TOTAL}<span style={{ fontSize: 56, marginLeft: 4 }}>zł</span>
              </div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--aura-ink)', marginTop: 10 }}>brutto · vat 23%</div>
            </div>
          </div>

          {/* Mono breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
            {[
              ['Suma częściowa', `${SUBTOTAL} zł`],
              ['Dostawa', SHIPPING === 0 ? 'Gratis' : `${SHIPPING} zł`],
              ['VAT (w cenie)', '30 zł'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed var(--aura-line)' }}>
                <span className="mono" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>{k}</span>
                <span className="num" style={{ fontSize: 16, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Free shipping unlocked */}
          {SHIPPING === 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
              background: 'var(--aura-orange-soft)', borderRadius: 999, marginBottom: 24,
              color: 'var(--aura-orange-deep)', fontSize: 13, fontWeight: 600,
            }}>
              <Starburst color="var(--aura-orange-deep)" size={20} points={10} depth={0.28} />
              <span>Masz darmową wysyłkę. Brawo.</span>
            </div>
          )}

          {/* CTA */}
          <button className="btn" style={{ width: '100%', height: 64, fontSize: 16, fontWeight: 700, gap: 12 }}>
            Przejdź do kasy
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>

          <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {['BLIK', 'KARTA', 'APPLE PAY', 'GOOGLE PAY', 'PRZELEWY24'].map(t => (
              <span key={t} className="mono" style={{
                fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)',
                padding: '4px 9px', border: '1px solid var(--aura-line)', borderRadius: 999,
              }}>{t}</span>
            ))}
          </div>

          {/* Kod rabatowy — slim */}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid var(--aura-line)', borderBottom: '1px solid var(--aura-line)' }}>
            <span className="mono" style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase' }}>＋ Kod rabatowy</span>
            <span className="mono" style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>Rozwiń</span>
          </div>
        </div>
      </section>

      {/* Decorative figure peeking */}
      <div style={{ position: 'absolute', bottom: 36, left: 56, opacity: 0.9 }}>
        <FigureRunner size={140} color="var(--aura-ink)" />
      </div>
      <div style={{ position: 'absolute', bottom: 56, left: 220, maxWidth: 260, fontSize: 13, color: 'var(--aura-muted)', lineHeight: 1.5 }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-ink)' }}>Świeżo palona</span>
        <p style={{ marginTop: 6 }}>Każda paczka leci do ciebie w ciągu 72h od palenia. Bez magazynowania.</p>
      </div>

      <style>{`@keyframes aura-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// V2 — RECEIPT / PARAGON
// Strona jako wydrukowany paragon-poster. Mono w głównej roli, dashed
// dividery, sekcja podsumowania to vertical "rachunek" ze stemplem.
// Items jako listing magazynowy, numerowane.
// ════════════════════════════════════════════════════════════════════
function CartV2() {
  return (
    <div className="aura" style={{ minHeight: 1300, background: 'var(--aura-paper-2)', position: 'relative', overflow: 'hidden' }}>
      <MiniHeader />

      {/* "Stamp" top strip — printed magazine cover */}
      <div className="mono" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 56px', borderBottom: '1px solid var(--aura-ink)',
        background: 'var(--aura-ink)', color: '#fff',
        fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
      }}>
        <span>AURA · ZAMÓWIENIE · NR 1247/2026</span>
        <span>★ Świeżo palona · drop 01</span>
        <span>Wydruk · 8 listopada 2026 · 19:48</span>
      </div>

      <section style={{ padding: '64px 56px 24px' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 18 }}>★ Koszyk · paragon</div>
        <h1 style={{ fontSize: 156, lineHeight: 0.9, letterSpacing: '-0.04em', marginBottom: 18 }}>
          Twoje<br/>zamówienie.
        </h1>
        <div style={{ display: 'flex', gap: 40, alignItems: 'center', marginTop: 28 }}>
          <span className="mono" style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>{ITEMS_COUNT} produkty</span>
          <span style={{ flex: 1, height: 1, background: 'var(--aura-ink)' }} />
          <span className="mono num" style={{ fontSize: 14, fontWeight: 600 }}>SUMA · {TOTAL},00 zł</span>
        </div>
      </section>

      {/* Free shipping progress strip — full-width */}
      <section style={{ padding: '0 56px 32px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 18,
          padding: '18px 24px', background: 'var(--aura-ink)', color: '#fff', borderRadius: 14,
        }}>
          <Starburst color="var(--aura-orange)" size={28} points={10} depth={0.28} />
          <div style={{ fontFamily: 'var(--aura-mono)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Darmowa wysyłka odblokowana
          </div>
          <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 999, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--aura-orange)', width: '100%' }} />
          </div>
          <span className="mono num" style={{ fontSize: 12, letterSpacing: '0.14em' }}>{SUBTOTAL} / {FREE_SHIP_THRESHOLD} zł · 100%</span>
        </div>
      </section>

      {/* Layout — magazine listing left, receipt strip right */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 56, padding: '0 56px 80px', alignItems: 'flex-start' }}>
        {/* LEFT — items listing magazine */}
        <div>
          {/* table header */}
          <div className="mono" style={{
            display: 'grid', gridTemplateColumns: '40px 90px 1fr 140px 80px',
            gap: 20, padding: '10px 0', borderBottom: '1px solid var(--aura-ink)',
            fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--aura-ink)', fontWeight: 600,
          }}>
            <span>Nr</span>
            <span>Foto</span>
            <span>Pozycja</span>
            <span>Ilość</span>
            <span style={{ textAlign: 'right' }}>Kwota</span>
          </div>

          {CART_ITEMS.map((it, i) => (
            <div key={it.id} style={{
              display: 'grid', gridTemplateColumns: '40px 90px 1fr 140px 80px',
              gap: 20, padding: '28px 0', alignItems: 'center',
              borderBottom: i === CART_ITEMS.length - 1 ? '2px solid var(--aura-ink)' : '1px dashed var(--aura-line-strong)',
            }}>
              <span className="mono num" style={{ fontSize: 18, fontWeight: 600 }}>{String(i + 1).padStart(2, '0')}</span>
              <Thumb size={90} radius={4} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 32, lineHeight: 1 }}>{it.name}</h3>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--aura-muted)' }}>LOT {it.lot}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--aura-ink)', marginBottom: 4 }}>{it.origin}</div>
                <div style={{ fontSize: 12, color: 'var(--aura-muted)', fontStyle: 'italic' }}>{it.notes}</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--aura-ink)', textTransform: 'uppercase', marginTop: 6 }}>{it.variant}</div>
              </div>
              <QtyMini qty={it.qty} />
              <span className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 24, textAlign: 'right' }}>
                {it.price * it.qty}<span style={{ fontSize: 12, marginLeft: 2 }}>zł</span>
              </span>
            </div>
          ))}

          {/* Order details — like receipt meta */}
          <div className="mono" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20,
            marginTop: 36, padding: 24, background: '#fff',
            border: '1px dashed var(--aura-ink)',
            fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            <div>
              <div style={{ color: 'var(--aura-muted)' }}>Palenie</div>
              <div className="num" style={{ marginTop: 4, color: 'var(--aura-ink)' }}>Środa · 5.11.2026</div>
            </div>
            <div>
              <div style={{ color: 'var(--aura-muted)' }}>Wysyłka</div>
              <div className="num" style={{ marginTop: 4, color: 'var(--aura-ink)' }}>InPost · 24–48h</div>
            </div>
            <div>
              <div style={{ color: 'var(--aura-muted)' }}>Numer partii</div>
              <div className="num" style={{ marginTop: 4, color: 'var(--aura-ink)' }}>#AC-1247</div>
            </div>
          </div>

          <a style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 32, fontSize: 13, color: 'var(--aura-ink)' }}>
            ← Wróć do zakupów
          </a>
        </div>

        {/* RIGHT — receipt strip */}
        <div style={{
          background: '#fff', padding: 36, position: 'relative',
          boxShadow: '0 1px 2px rgba(14,14,12,0.04)',
          /* Zig-zag bottom edge — paragon torn-off feel */
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), 96% 100%, 92% calc(100% - 16px), 88% 100%, 84% calc(100% - 16px), 80% 100%, 76% calc(100% - 16px), 72% 100%, 68% calc(100% - 16px), 64% 100%, 60% calc(100% - 16px), 56% 100%, 52% calc(100% - 16px), 48% 100%, 44% calc(100% - 16px), 40% 100%, 36% calc(100% - 16px), 32% 100%, 28% calc(100% - 16px), 24% 100%, 20% calc(100% - 16px), 16% 100%, 12% calc(100% - 16px), 8% 100%, 4% calc(100% - 16px), 0 100%)',
          paddingBottom: 60,
        }}>
          {/* Stamp burst */}
          <div style={{ position: 'absolute', top: -22, right: 24 }}>
            <div style={{ position: 'relative', width: 96, height: 96, animation: 'aura-spin 40s linear infinite' }}>
              <Starburst color="var(--aura-orange)" size={96} points={12} depth={0.24} />
              <div style={{
                position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                fontFamily: 'var(--aura-mono)', fontSize: 9, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--aura-ink)', textAlign: 'center', fontWeight: 700, lineHeight: 1.2,
              }}>OPŁAĆ<br/>SZYBKO</div>
            </div>
          </div>

          {/* Logo header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Starburst color="var(--aura-ink)" size={18} points={10} depth={0.28} />
            <span style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>AURA</span>
          </div>
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 28 }}>
            Pure coffee beans · Warszawa
          </div>

          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 12 }}>
            Rachunek · do zapłaty
          </div>

          {/* Items recap as mono lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 18, borderBottom: '2px dashed var(--aura-line-strong)' }}>
            {CART_ITEMS.map(it => (
              <div key={it.id} className="mono num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--aura-ink)' }}>
                <span>{it.qty}× {it.name} · 250g</span>
                <span>{it.price * it.qty},00 zł</span>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '18px 0', borderBottom: '2px dashed var(--aura-line-strong)' }}>
            <div className="mono num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--aura-muted)' }}>Suma częściowa</span><span>{SUBTOTAL},00 zł</span>
            </div>
            <div className="mono num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--aura-muted)' }}>Dostawa</span>
              <span style={{ color: SHIPPING === 0 ? 'var(--aura-orange)' : 'inherit', fontWeight: SHIPPING === 0 ? 700 : 400 }}>
                {SHIPPING === 0 ? 'GRATIS' : `${SHIPPING},00 zł`}
              </span>
            </div>
            <div className="mono num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--aura-muted)' }}>W tym VAT 23%</span><span>30,00 zł</span>
            </div>
          </div>

          {/* Total — receipt style, mono not display */}
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 6 }}>Razem do zapłaty</div>
            <div className="num" style={{
              fontFamily: 'var(--aura-display)', fontWeight: 900, fontSize: 88, lineHeight: 1,
              letterSpacing: '-0.03em', color: 'var(--aura-orange)',
            }}>
              {TOTAL},00 zł
            </div>
          </div>

          {/* CTA */}
          <button className="btn" style={{ width: '100%', height: 56, fontSize: 15, gap: 10, marginTop: 6 }}>
            Przejdź do kasy →
          </button>

          <div className="mono" style={{
            marginTop: 18, fontSize: 9, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'var(--aura-muted)', textAlign: 'center', lineHeight: 1.6,
          }}>
            Bezpieczna kasa Shopify<br/>
            BLIK · Karta · Apple Pay · Google Pay<br/>
            ─────────────<br/>
            Dziękujemy. Do zobaczenia w środę.
          </div>
        </div>
      </section>

      <style>{`@keyframes aura-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// V3 — INVERSE POSTER (INK)
// Czarny ZOSTAJE, ale przestaje być boxem. Pełen bleed lewej połowy
// jako okładka plakatu z burstem, biegnącą postacią i monumentalnym
// totalem. Items po prawej na papierze — to ich miejsce.
// ════════════════════════════════════════════════════════════════════
function CartV3() {
  return (
    <div className="aura" style={{ minHeight: 1300, background: 'var(--aura-paper)', position: 'relative', overflow: 'hidden' }}>
      <MiniHeader />

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', minHeight: 1240, alignItems: 'stretch' }}>
        {/* LEFT — INK poster panel */}
        <div style={{
          background: 'var(--aura-ink)', color: '#fff',
          padding: '64px 56px 64px', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          {/* Eyebrow */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Starburst color="var(--aura-orange)" size={16} points={10} depth={0.28} />
              <span className="eyebrow" style={{ color: 'var(--aura-orange)' }}>Koszyk · {ITEMS_COUNT} produkty</span>
            </div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>
              Razem do zapłaty
            </div>
          </div>

          {/* Massive total — overlaps a spinning burst */}
          <div style={{ position: 'relative', textAlign: 'left', margin: '20px 0 40px' }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', animation: 'aura-spin 28s linear infinite', zIndex: 1,
            }}>
              <Starburst color="var(--aura-orange)" size={520} points={12} depth={0.22} />
            </div>
            <div style={{ position: 'relative', zIndex: 2, padding: '70px 0', textAlign: 'center' }}>
              <div className="num" style={{
                fontFamily: 'var(--aura-display)', fontWeight: 900, fontSize: 200, lineHeight: 0.85,
                letterSpacing: '-0.05em', color: '#fff',
              }}>{TOTAL}</div>
              <div style={{
                fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 56, lineHeight: 1,
                letterSpacing: '-0.03em', color: '#fff', marginTop: 8,
              }}>zł</div>
            </div>

            {/* Tiny figure peeking from burst — like the brand poster */}
            <div style={{ position: 'absolute', bottom: -20, right: -10, zIndex: 3 }}>
              <FigureRunner size={120} color="#fff" />
            </div>
          </div>

          {/* Mono breakdown */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22, paddingBottom: 22, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
              {[
                ['Suma częściowa', `${SUBTOTAL} zł`],
                ['Dostawa · InPost', SHIPPING === 0 ? 'GRATIS' : `${SHIPPING} zł`],
                ['VAT (w cenie)', '30 zł'],
              ].map(([k, v]) => (
                <div key={k} className="mono" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>{k}</span>
                  <span className="num" style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Unlocked badge */}
            {SHIPPING === 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 999,
                background: 'rgba(255,77,23,0.15)', border: '1px solid var(--aura-orange)',
                color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 22,
              }}>
                <Starburst color="var(--aura-orange)" size={18} points={10} depth={0.28} />
                Masz darmową wysyłkę. Brawo.
              </div>
            )}

            {/* CTA */}
            <button className="btn" style={{
              width: '100%', height: 64, fontSize: 16, fontWeight: 700, gap: 12,
              background: 'var(--aura-orange)', borderColor: 'var(--aura-orange)',
            }}>
              Przejdź do kasy
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </button>

            {/* Microcopy + payment methods */}
            <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
              {['BLIK', 'KARTA', 'APPLE PAY', 'GOOGLE PAY'].map(t => (
                <span key={t} className="mono" style={{
                  fontSize: 9, letterSpacing: '0.14em',
                  padding: '5px 10px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999,
                  color: 'rgba(255,255,255,0.7)',
                }}>{t}</span>
              ))}
            </div>
            <div className="mono" style={{ marginTop: 14, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
              Bezpieczna kasa Shopify · zaszyfrowana
            </div>
          </div>
        </div>

        {/* RIGHT — PAPER items panel */}
        <div style={{ background: 'var(--aura-paper)', padding: '64px 64px 64px', position: 'relative' }}>
          {/* Heading */}
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 18 }}>★ Twój wybór</div>
          <h1 style={{ fontSize: 88, lineHeight: 0.95, letterSpacing: '-0.035em', marginBottom: 12 }}>
            Twoje<br/>zamówienie.
          </h1>
          <div className="mono" style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 36 }}>
            Nr AC-1247 · {ITEMS_COUNT} produkty · ze świeżego palenia
          </div>

          {/* Items — magazine list */}
          <div>
            {CART_ITEMS.map((it, i) => (
              <div key={it.id} style={{
                display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 22, alignItems: 'center',
                padding: '22px 0',
                borderTop: '1px solid var(--aura-line)',
                borderBottom: i === CART_ITEMS.length - 1 ? '1px solid var(--aura-line)' : 'none',
              }}>
                <Thumb size={90} radius={6} />
                <div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--aura-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                    LOT {it.lot} · {it.origin}
                  </div>
                  <h3 style={{ fontSize: 28, lineHeight: 1, marginBottom: 6 }}>{it.name}</h3>
                  <div style={{ fontSize: 12, color: 'var(--aura-muted)', fontStyle: 'italic', marginBottom: 8 }}>{it.notes}</div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--aura-ink)', textTransform: 'uppercase' }}>{it.variant}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  <span className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 26, color: 'var(--aura-ink)' }}>{it.price * it.qty} zł</span>
                  <QtyMini qty={it.qty} />
                </div>
              </div>
            ))}
          </div>

          {/* Suggested upsell */}
          <div style={{ marginTop: 28, padding: 20, border: '1px dashed var(--aura-line-strong)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 18 }}>
            <Starburst color="var(--aura-green)" size={56} points={11} depth={0.24}>
              <span className="mono" style={{ fontSize: 8, letterSpacing: '0.14em', color: 'var(--aura-ink)', fontWeight: 700 }}>NEW</span>
            </Starburst>
            <div style={{ flex: 1 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>Może dorzucić?</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>Aurora · Kenya Nyeri — <span style={{ color: 'var(--aura-orange)' }}>92 zł</span></div>
              <div style={{ fontSize: 12, color: 'var(--aura-muted)', fontStyle: 'italic', marginTop: 2 }}>blackcurrant, citrus, malt</div>
            </div>
            <button style={{
              height: 40, padding: '0 16px', borderRadius: 999,
              background: 'var(--aura-ink)', color: '#fff', border: 'none',
              fontFamily: 'var(--aura-text)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              ＋ Dodaj
            </button>
          </div>

          {/* Discount code */}
          <div style={{ marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
            <span className="mono" style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase' }}>＋ Kod rabatowy</span>
            <span className="mono" style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>Rozwiń</span>
          </div>

          {/* Return CTA */}
          <a style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 24,
            color: 'var(--aura-ink)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>
            <span style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid var(--aura-line)', display: 'grid', placeItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </span>
            Wróć do zakupów
          </a>
        </div>
      </section>

      <style>{`@keyframes aura-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// V2 — MOBILE (390 × auto)
// Adaptacja paragonu na 390. Top strip → eyebrow + H1 → free-ship bar
// → items numerowane jako paragon listing → receipt-strip pełnoszer.
// → sticky bottom z totalem + CTA. Trzyma DNA z desktopa: mono, dashed,
// stempel-burst, postrzępiony dół paragonu, kolejność „od góry do dołu".
// ════════════════════════════════════════════════════════════════════
function CartV2Mobile() {
  const W = 390;
  return (
    <div className="aura" style={{ width: W, minHeight: 1400, background: 'var(--aura-paper-2)', position: 'relative', overflow: 'hidden' }}>
      {/* Top stamp strip — przewija się jak ticker; tu statycznie */}
      <div className="mono" style={{
        padding: '10px 16px', background: 'var(--aura-ink)', color: '#fff',
        fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        display: 'flex', justifyContent: 'space-between', gap: 12,
      }}>
        <span>AURA · NR 1247/2026</span>
        <span style={{ opacity: 0.6 }}>★ DROP 01</span>
      </div>

      {/* Mobile header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', background: '#fff', borderBottom: '1px solid var(--aura-line)',
      }}>
        <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 7h18M3 17h18"/></svg>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Starburst color="var(--aura-orange)" size={16} points={10} depth={0.28} />
          <span style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>AURA</span>
        </div>
        <div style={{ position: 'relative', width: 34, height: 34, borderRadius: 999, border: '1px solid var(--aura-line)', display: 'grid', placeItems: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h8.7a2 2 0 002-1.5L21 8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>
          <span style={{
            position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8,
            background: 'var(--aura-orange)', color: '#fff', fontSize: 9, fontWeight: 700,
            display: 'grid', placeItems: 'center', padding: '0 4px',
          }}>{ITEMS_COUNT}</span>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: '28px 20px 18px' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 12, fontSize: 10 }}>★ Koszyk · paragon</div>
        <h1 style={{ fontSize: 64, lineHeight: 0.92, letterSpacing: '-0.035em' }}>
          Twoje<br/>zamówienie.
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>{ITEMS_COUNT} produkty</span>
          <span style={{ flex: 1, height: 1, background: 'var(--aura-ink)' }} />
          <span className="mono num" style={{ fontSize: 12, fontWeight: 600 }}>{TOTAL},00 zł</span>
        </div>
      </section>

      {/* Free shipping bar */}
      <section style={{ padding: '0 20px 22px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px', background: 'var(--aura-ink)', color: '#fff', borderRadius: 12,
        }}>
          <Starburst color="var(--aura-orange)" size={20} points={10} depth={0.28} />
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>
              Wysyłka odblokowana
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--aura-orange)', width: '100%' }} />
            </div>
          </div>
          <span className="mono num" style={{ fontSize: 11, fontWeight: 600 }}>100%</span>
        </div>
      </section>

      {/* Items list — numbered paragon */}
      <section style={{ padding: '0 20px 24px' }}>
        <div className="mono" style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '10px 0', borderBottom: '1px solid var(--aura-ink)',
          fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600,
        }}>
          <span>Nr · Pozycja</span>
          <span>Kwota</span>
        </div>

        {CART_ITEMS.map((it, i) => (
          <div key={it.id} style={{
            display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 14, alignItems: 'flex-start',
            padding: '18px 0',
            borderBottom: i === CART_ITEMS.length - 1 ? '2px solid var(--aura-ink)' : '1px dashed var(--aura-line-strong)',
          }}>
            <div style={{ position: 'relative' }}>
              <Thumb size={64} radius={4} />
              <span className="mono num" style={{
                position: 'absolute', top: -6, left: -6, minWidth: 22, height: 22, borderRadius: 999,
                background: 'var(--aura-ink)', color: '#fff', fontSize: 10, fontWeight: 600,
                display: 'grid', placeItems: 'center', padding: '0 6px',
              }}>{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <h3 style={{ fontSize: 22, lineHeight: 1 }}>{it.name}</h3>
                <span className="mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--aura-muted)' }}>LOT {it.lot}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--aura-ink)', marginBottom: 2 }}>{it.origin}</div>
              <div style={{ fontSize: 11, color: 'var(--aura-muted)', fontStyle: 'italic', marginBottom: 8 }}>{it.notes}</div>
              <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.14em', color: 'var(--aura-ink)', textTransform: 'uppercase', marginBottom: 10 }}>{it.variant}</div>
              <QtyMini qty={it.qty} />
            </div>
            <span className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 20, textAlign: 'right' }}>
              {it.price * it.qty}<span style={{ fontSize: 11, marginLeft: 1 }}>zł</span>
            </span>
          </div>
        ))}
      </section>

      {/* Order meta — stack */}
      <section style={{ padding: '0 20px 28px' }}>
        <div className="mono" style={{
          padding: 16, background: '#fff',
          border: '1px dashed var(--aura-ink)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
          fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          <div>
            <div style={{ color: 'var(--aura-muted)' }}>Palenie</div>
            <div className="num" style={{ marginTop: 4, color: 'var(--aura-ink)' }}>Śr · 5.11.26</div>
          </div>
          <div>
            <div style={{ color: 'var(--aura-muted)' }}>Wysyłka</div>
            <div className="num" style={{ marginTop: 4, color: 'var(--aura-ink)' }}>InPost · 24h</div>
          </div>
          <div>
            <div style={{ color: 'var(--aura-muted)' }}>Nr partii</div>
            <div className="num" style={{ marginTop: 4, color: 'var(--aura-ink)' }}>#AC-1247</div>
          </div>
          <div>
            <div style={{ color: 'var(--aura-muted)' }}>Status</div>
            <div className="num" style={{ marginTop: 4, color: 'var(--aura-orange)' }}>Świeżo</div>
          </div>
        </div>
      </section>

      {/* Receipt strip — full width */}
      <section style={{ padding: '0 20px 24px' }}>
        <div style={{
          background: '#fff', padding: '32px 22px 56px', position: 'relative',
          boxShadow: '0 1px 2px rgba(14,14,12,0.04)',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), 95% 100%, 90% calc(100% - 14px), 85% 100%, 80% calc(100% - 14px), 75% 100%, 70% calc(100% - 14px), 65% 100%, 60% calc(100% - 14px), 55% 100%, 50% calc(100% - 14px), 45% 100%, 40% calc(100% - 14px), 35% 100%, 30% calc(100% - 14px), 25% 100%, 20% calc(100% - 14px), 15% 100%, 10% calc(100% - 14px), 5% 100%, 0 calc(100% - 14px))',
        }}>
          {/* Stamp burst */}
          <div style={{ position: 'absolute', top: -16, right: 18 }}>
            <div style={{ position: 'relative', width: 76, height: 76, animation: 'aura-spin 40s linear infinite' }}>
              <Starburst color="var(--aura-orange)" size={76} points={12} depth={0.24} />
              <div style={{
                position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                fontFamily: 'var(--aura-mono)', fontSize: 7.5, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--aura-ink)', textAlign: 'center', fontWeight: 700, lineHeight: 1.2,
              }}>OPŁAĆ<br/>SZYBKO</div>
            </div>
          </div>

          {/* Logo header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <Starburst color="var(--aura-ink)" size={14} points={10} depth={0.28} />
            <span style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>AURA</span>
          </div>
          <div className="mono" style={{ fontSize: 8.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 20 }}>
            Pure coffee beans · Warszawa
          </div>

          <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 10 }}>
            Rachunek · do zapłaty
          </div>

          {/* Items recap */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 14, borderBottom: '2px dashed var(--aura-line-strong)' }}>
            {CART_ITEMS.map(it => (
              <div key={it.id} className="mono num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--aura-ink)' }}>
                <span>{it.qty}× {it.name} · 250g</span>
                <span>{it.price * it.qty},00 zł</span>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 0', borderBottom: '2px dashed var(--aura-line-strong)' }}>
            <div className="mono num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--aura-muted)' }}>Suma częściowa</span><span>{SUBTOTAL},00 zł</span>
            </div>
            <div className="mono num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--aura-muted)' }}>Dostawa</span>
              <span style={{ color: SHIPPING === 0 ? 'var(--aura-orange)' : 'inherit', fontWeight: SHIPPING === 0 ? 700 : 400 }}>
                {SHIPPING === 0 ? 'GRATIS' : `${SHIPPING},00 zł`}
              </span>
            </div>
            <div className="mono num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--aura-muted)' }}>W tym VAT 23%</span><span>30,00 zł</span>
            </div>
          </div>

          {/* Total */}
          <div style={{ padding: '20px 0 6px', textAlign: 'center' }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 4 }}>Razem do zapłaty</div>
            <div className="num" style={{
              fontFamily: 'var(--aura-display)', fontWeight: 900, fontSize: 64, lineHeight: 1,
              letterSpacing: '-0.03em', color: 'var(--aura-orange)',
            }}>
              {TOTAL},00 zł
            </div>
          </div>

          <div className="mono" style={{
            marginTop: 16, fontSize: 8.5, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'var(--aura-muted)', textAlign: 'center', lineHeight: 1.7,
          }}>
            ─────────────<br/>
            Dziękujemy. Do zobaczenia w środę.
          </div>
        </div>
      </section>

      {/* Discount code */}
      <section style={{ padding: '0 20px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid var(--aura-line)', borderBottom: '1px solid var(--aura-line)' }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>＋ Kod rabatowy</span>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>Rozwiń</span>
        </div>
      </section>

      <section style={{ padding: '0 20px 110px' }}>
        <a style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--aura-ink)' }}>
          ← Wróć do zakupów
        </a>
      </section>

      {/* Sticky bottom CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '1px solid var(--aura-line)',
        padding: '14px 20px 18px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 -8px 24px rgba(14,14,12,0.08)',
      }}>
        <div>
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>Razem</div>
          <div className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 24, color: 'var(--aura-orange)', lineHeight: 1, marginTop: 2 }}>{TOTAL},00 zł</div>
        </div>
        <button className="btn" style={{ flex: 1, height: 56, fontSize: 15, fontWeight: 700, gap: 8 }}>
          Przejdź do kasy
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
      </div>

      <style>{`@keyframes aura-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

Object.assign(window, { CartV1, CartV2, CartV3, CartV2Mobile });
