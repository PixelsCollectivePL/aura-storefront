/* eslint-disable no-undef */
/* Aura — Koszyk V2 (Receipt / Paragon)
   Desktop (CartV2) + Mobile (CartV2Mobile)
   Zależności: tokens.css, aura-illustrations.jsx (Starburst, FigureRunner)
   Typografia: Archivo (display), DM Sans (text), JetBrains Mono (mono) */

// ── Dane koszyka (zastąp prawdziwymi z Shopify Storefront API) ──────
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

// ── Helpers ─────────────────────────────────────────────────────────
function Thumb({ size = 96, radius = 8 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: 'repeating-linear-gradient(135deg, rgba(14,14,12,0.045) 0 6px, rgba(0,0,0,0) 6px 14px), var(--aura-paper-2)',
      display: 'grid', placeItems: 'center',
      fontFamily: 'var(--aura-mono)', fontSize: 9, letterSpacing: '0.18em',
      color: 'var(--aura-muted)', textTransform: 'uppercase', flex: '0 0 auto',
    }}>BAG</div>
  );
}

function QtyMini({ qty = 1 }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 14,
      border: '1px solid var(--aura-line)', borderRadius: 999, padding: '6px 12px', background: '#fff',
    }}>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'grid', placeItems: 'center' }} aria-label="minus">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14"/></svg>
      </button>
      <span className="num" style={{ fontWeight: 600, fontSize: 14, minWidth: 14, textAlign: 'center' }}>{qty}</span>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'grid', placeItems: 'center' }} aria-label="plus">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
  );
}

function MiniHeader() {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 56px', background: '#fff', borderBottom: '1px solid var(--aura-line)',
    }}>
      <nav style={{ display: 'flex', gap: 26 }}>
        {['Produkty', 'Blendy', 'O marce', 'Kontakt'].map(l => (
          <a key={l} style={{ color: 'var(--aura-ink)', fontSize: 13, fontWeight: 500, letterSpacing: '-0.005em' }}>{l}</a>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Starburst color="var(--aura-orange)" size={20} points={10} depth={0.28} />
        <span style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>AURA</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>Konto</span>
        <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 999, border: '1px solid var(--aura-line)', display: 'grid', placeItems: 'center' }}>
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
// DESKTOP — CartV2 (1440)
// ════════════════════════════════════════════════════════════════════
function CartV2() {
  return (
    <div className="aura" style={{ minHeight: 1300, background: 'var(--aura-paper-2)', position: 'relative', overflow: 'hidden' }}>
      <MiniHeader />

      {/* Top stamp strip */}
      <div className="mono" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 56px', background: 'var(--aura-ink)', color: '#fff',
        fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
      }}>
        <span>AURA · ZAMÓWIENIE · NR 1247/2026</span>
        <span>★ Świeżo palona · drop 01</span>
        <span>Wydruk · 8 listopada 2026 · 19:48</span>
      </div>

      {/* Hero */}
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

      {/* Free shipping unlocked */}
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

      {/* Items listing + receipt strip */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 56, padding: '0 56px 80px', alignItems: 'flex-start' }}>
        {/* LEFT */}
        <div>
          <div className="mono" style={{
            display: 'grid', gridTemplateColumns: '40px 90px 1fr 140px 80px',
            gap: 20, padding: '10px 0', borderBottom: '1px solid var(--aura-ink)',
            fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600,
          }}>
            <span>Nr</span><span>Foto</span><span>Pozycja</span><span>Ilość</span>
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
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 6 }}>{it.variant}</div>
              </div>
              <QtyMini qty={it.qty} />
              <span className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 24, textAlign: 'right' }}>
                {it.price * it.qty}<span style={{ fontSize: 12, marginLeft: 2 }}>zł</span>
              </span>
            </div>
          ))}

          <div className="mono" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20,
            marginTop: 36, padding: 24, background: '#fff', border: '1px dashed var(--aura-ink)',
            fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            <div>
              <div style={{ color: 'var(--aura-muted)' }}>Palenie</div>
              <div className="num" style={{ marginTop: 4 }}>Środa · 5.11.2026</div>
            </div>
            <div>
              <div style={{ color: 'var(--aura-muted)' }}>Wysyłka</div>
              <div className="num" style={{ marginTop: 4 }}>InPost · 24–48h</div>
            </div>
            <div>
              <div style={{ color: 'var(--aura-muted)' }}>Numer partii</div>
              <div className="num" style={{ marginTop: 4 }}>#AC-1247</div>
            </div>
          </div>

          <a style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 32, fontSize: 13 }}>← Wróć do zakupów</a>
        </div>

        {/* RIGHT — receipt */}
        <div style={{
          background: '#fff', padding: '36px 36px 60px', position: 'relative',
          boxShadow: '0 1px 2px rgba(14,14,12,0.04)',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), 96% 100%, 92% calc(100% - 16px), 88% 100%, 84% calc(100% - 16px), 80% 100%, 76% calc(100% - 16px), 72% 100%, 68% calc(100% - 16px), 64% 100%, 60% calc(100% - 16px), 56% 100%, 52% calc(100% - 16px), 48% 100%, 44% calc(100% - 16px), 40% 100%, 36% calc(100% - 16px), 32% 100%, 28% calc(100% - 16px), 24% 100%, 20% calc(100% - 16px), 16% 100%, 12% calc(100% - 16px), 8% 100%, 4% calc(100% - 16px), 0 100%)',
        }}>
          <div style={{ position: 'absolute', top: -22, right: 24 }}>
            <div style={{ position: 'relative', width: 96, height: 96, animation: 'aura-spin 40s linear infinite' }}>
              <Starburst color="var(--aura-orange)" size={96} points={12} depth={0.24} />
              <div style={{
                position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                fontFamily: 'var(--aura-mono)', fontSize: 9, letterSpacing: '0.18em',
                textTransform: 'uppercase', textAlign: 'center', fontWeight: 700, lineHeight: 1.2,
              }}>OPŁAĆ<br/>SZYBKO</div>
            </div>
          </div>

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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 18, borderBottom: '2px dashed var(--aura-line-strong)' }}>
            {CART_ITEMS.map(it => (
              <div key={it.id} className="mono num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>{it.qty}× {it.name} · 250g</span>
                <span>{it.price * it.qty},00 zł</span>
              </div>
            ))}
          </div>

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

          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 6 }}>Razem do zapłaty</div>
            <div className="num" style={{
              fontFamily: 'var(--aura-display)', fontWeight: 900, fontSize: 88, lineHeight: 1,
              letterSpacing: '-0.03em', color: 'var(--aura-orange)',
            }}>{TOTAL},00 zł</div>
          </div>

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
// MOBILE — CartV2Mobile (390)
// ════════════════════════════════════════════════════════════════════
function CartV2Mobile() {
  return (
    <div className="aura" style={{ width: 390, minHeight: 1400, background: 'var(--aura-paper-2)', position: 'relative', overflow: 'hidden' }}>
      <div className="mono" style={{
        padding: '10px 16px', background: 'var(--aura-ink)', color: '#fff',
        fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>AURA · NR 1247/2026</span>
        <span style={{ opacity: 0.6 }}>★ DROP 01</span>
      </div>

      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', background: '#fff', borderBottom: '1px solid var(--aura-line)',
      }}>
        <button style={{ background: 'none', border: 'none', padding: 0 }}>
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

      <section style={{ padding: '0 20px 22px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px', background: 'var(--aura-ink)', color: '#fff', borderRadius: 12,
        }}>
          <Starburst color="var(--aura-orange)" size={20} points={10} depth={0.28} />
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Wysyłka odblokowana</div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--aura-orange)', width: '100%' }} />
            </div>
          </div>
          <span className="mono num" style={{ fontSize: 11, fontWeight: 600 }}>100%</span>
        </div>
      </section>

      <section style={{ padding: '0 20px 24px' }}>
        <div className="mono" style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '10px 0', borderBottom: '1px solid var(--aura-ink)',
          fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600,
        }}>
          <span>Nr · Pozycja</span><span>Kwota</span>
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
              <div style={{ fontSize: 12, marginBottom: 2 }}>{it.origin}</div>
              <div style={{ fontSize: 11, color: 'var(--aura-muted)', fontStyle: 'italic', marginBottom: 8 }}>{it.notes}</div>
              <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>{it.variant}</div>
              <QtyMini qty={it.qty} />
            </div>
            <span className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 20, textAlign: 'right' }}>
              {it.price * it.qty}<span style={{ fontSize: 11, marginLeft: 1 }}>zł</span>
            </span>
          </div>
        ))}
      </section>

      <section style={{ padding: '0 20px 28px' }}>
        <div className="mono" style={{
          padding: 16, background: '#fff', border: '1px dashed var(--aura-ink)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
          fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          <div><div style={{ color: 'var(--aura-muted)' }}>Palenie</div><div className="num" style={{ marginTop: 4 }}>Śr · 5.11.26</div></div>
          <div><div style={{ color: 'var(--aura-muted)' }}>Wysyłka</div><div className="num" style={{ marginTop: 4 }}>InPost · 24h</div></div>
          <div><div style={{ color: 'var(--aura-muted)' }}>Nr partii</div><div className="num" style={{ marginTop: 4 }}>#AC-1247</div></div>
          <div><div style={{ color: 'var(--aura-muted)' }}>Status</div><div className="num" style={{ marginTop: 4, color: 'var(--aura-orange)' }}>Świeżo</div></div>
        </div>
      </section>

      <section style={{ padding: '0 20px 24px' }}>
        <div style={{
          background: '#fff', padding: '32px 22px 56px', position: 'relative',
          boxShadow: '0 1px 2px rgba(14,14,12,0.04)',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), 95% 100%, 90% calc(100% - 14px), 85% 100%, 80% calc(100% - 14px), 75% 100%, 70% calc(100% - 14px), 65% 100%, 60% calc(100% - 14px), 55% 100%, 50% calc(100% - 14px), 45% 100%, 40% calc(100% - 14px), 35% 100%, 30% calc(100% - 14px), 25% 100%, 20% calc(100% - 14px), 15% 100%, 10% calc(100% - 14px), 5% 100%, 0 calc(100% - 14px))',
        }}>
          <div style={{ position: 'absolute', top: -16, right: 18 }}>
            <div style={{ position: 'relative', width: 76, height: 76, animation: 'aura-spin 40s linear infinite' }}>
              <Starburst color="var(--aura-orange)" size={76} points={12} depth={0.24} />
              <div style={{
                position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                fontFamily: 'var(--aura-mono)', fontSize: 7.5, letterSpacing: '0.18em',
                textTransform: 'uppercase', textAlign: 'center', fontWeight: 700, lineHeight: 1.2,
              }}>OPŁAĆ<br/>SZYBKO</div>
            </div>
          </div>

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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 14, borderBottom: '2px dashed var(--aura-line-strong)' }}>
            {CART_ITEMS.map(it => (
              <div key={it.id} className="mono num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>{it.qty}× {it.name} · 250g</span>
                <span>{it.price * it.qty},00 zł</span>
              </div>
            ))}
          </div>

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

          <div style={{ padding: '20px 0 6px', textAlign: 'center' }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--aura-muted)', marginBottom: 4 }}>Razem do zapłaty</div>
            <div className="num" style={{
              fontFamily: 'var(--aura-display)', fontWeight: 900, fontSize: 64, lineHeight: 1,
              letterSpacing: '-0.03em', color: 'var(--aura-orange)',
            }}>{TOTAL},00 zł</div>
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

      <section style={{ padding: '0 20px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid var(--aura-line)', borderBottom: '1px solid var(--aura-line)' }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>＋ Kod rabatowy</span>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aura-muted)' }}>Rozwiń</span>
        </div>
      </section>

      <section style={{ padding: '0 20px 110px' }}>
        <a style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}>← Wróć do zakupów</a>
      </section>

      {/* Sticky bottom CTA (mobile) */}
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

Object.assign(window, { CartV2, CartV2Mobile });
