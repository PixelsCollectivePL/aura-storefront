/* eslint-disable no-undef */
/* Aura — Customer Account · MOBILE screens (390 wide).
   All screens use the same shell: MobileBar (sticky top) +
   scroll content + MobileTabBar (bottom). Tight horizontal padding (16px),
   touch targets ≥44px, no tables — only cards and rows. */

const MOB_W = 390;

function MobileShell({ active, bar, children, scrollH }) {
  return (
    <div className="aura" style={{
      width: MOB_W, minHeight: '100%', height: '100%',
      background: 'var(--aura-paper)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative',
    }}>
      {bar}
      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {children}
      </div>
      <MobileTabBar active={active} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// MOBILE 1 · DASHBOARD
// ────────────────────────────────────────────────────────────────────
function MobileDashboard() {
  const lastOrder = ACCT_ORDERS[0];
  const sub = ACCT_SUBSCRIPTION;
  return (
    <MobileShell active="dashboard" bar={<MobileBar title="Konto" action={<button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--aura-ink)' }}><NavIcon name="user" /></button>} />}>
      {/* Greeting hero */}
      <div style={{ padding: '20px 16px 8px' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 8 }}>Cześć, Kuba.</div>
        <h1 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 44, letterSpacing: '-0.03em', lineHeight: 0.95 }}>
          Twoja kawa<br/><span style={{ color: 'var(--aura-orange)' }}>czeka.</span>
        </h1>
      </div>

      {/* Last order card */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{
          background: '#fff', borderRadius: 'var(--r-md)',
          border: '1px solid var(--aura-line)', padding: 18, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 4 }}>Ostatnie zamówienie</div>
              <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.025em' }}>{lastOrder.name}</div>
            </div>
            <StatusPill kind={lastOrder.fulfillmentStatus} />
          </div>

          {/* Items thumbs row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            {lastOrder.items.slice(0, 3).map(it => (
              <MiniBag key={it.id} accent={it.accent} label={it.name.slice(0, 3).toUpperCase()} />
            ))}
            <div style={{ flex: 1, alignSelf: 'flex-end', textAlign: 'right' }}>
              <div className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.025em', lineHeight: 1 }}>{zl(lastOrder.totalPrice)}</div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase', marginTop: 3 }}>{lastOrder.items.length} pozycje</div>
            </div>
          </div>

          {/* Tracking strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--aura-paper-2)', borderRadius: 8, marginBottom: 14 }}>
            <span style={{ color: 'var(--aura-orange)' }}><NavIcon name="truck" /></span>
            <div style={{ flex: 1, fontSize: 12, lineHeight: 1.4 }}>
              <strong>InPost · w drodze</strong> · dostawa {dateShort(lastOrder.trackingEta)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm" style={{ flex: 1 }}>Zamów ponownie</button>
            <button className="btn btn-sm btn-ghost">Szczegóły</button>
          </div>
        </div>
      </div>

      {/* Subscription strip */}
      <div style={{ padding: '8px 16px' }}>
        <div style={{
          background: 'var(--aura-ink)', borderRadius: 'var(--r-md)',
          padding: 18, color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.5 }}>
            <Starburst color="var(--aura-orange)" size={130} points={12} depth={0.22} />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 8 }}>Aktywna subskrypcja</div>
            <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 14 }}>{sub.blendName}</div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px dashed rgba(255,255,255,0.18)', borderBottom: '1px dashed rgba(255,255,255,0.18)', marginBottom: 14 }}>
              <div>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>Następna wysyłka</div>
                <div className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.025em' }}>{dateShort(sub.nextShipmentAt)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>Cykl</div>
                <div className="num" style={{ fontSize: 14, fontWeight: 600 }}>{zl(sub.priceCycle)}</div>
              </div>
            </div>

            <button className="btn btn-sm btn-block" style={{ background: 'var(--aura-orange)', borderColor: 'var(--aura-orange)' }}>Zarządzaj subskrypcją</button>
          </div>
        </div>
      </div>

      {/* Your coffee section */}
      <div style={{ padding: '12px 16px' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 10 }}>Twoja kawa</div>
        <h2 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 14 }}>Już smakowałeś.</h2>

        <div style={{ background: '#fff', borderRadius: 'var(--r-md)', border: '1px solid var(--aura-line)', overflow: 'hidden' }}>
          {['Coração do Brasil', 'Verde Tropical', 'Lila Nocturna'].map((n, i) => (
            <div key={n} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderBottom: i < 2 ? '1px dashed var(--aura-line)' : 'none',
            }}>
              <span className="num mono" style={{ fontSize: 11, color: 'var(--aura-muted)', letterSpacing: '0.12em' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{n}</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--aura-muted)', letterSpacing: '0.12em' }}>{i === 0 ? '×3' : '×1'}</span>
              <NavIcon name="arrow" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ padding: '12px 16px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { ico: 'pin', l: 'Adresy', sub: '2 zapisane' },
            { ico: 'user', l: 'Dane konta', sub: 'Edytuj' },
          ].map(q => (
            <button key={q.l} style={{
              background: '#fff', border: '1px solid var(--aura-line)', borderRadius: 'var(--r-md)',
              padding: '18px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <NavIcon name={q.ico} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{q.l}</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>{q.sub}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Shopify note compact */}
        <div style={{ marginTop: 18, padding: '12px 14px', border: '1px dashed var(--aura-line-strong)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--aura-orange)' }}><NavIcon name="shield" /></span>
          <div style={{ fontSize: 11, color: 'var(--aura-muted)', lineHeight: 1.45, flex: 1 }}>
            Bezpieczne konto klienta · zarządzane przez Shopify
          </div>
          <NavIcon name="arrow" />
        </div>
      </div>
    </MobileShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// MOBILE 2 · ORDERS LIST
// ────────────────────────────────────────────────────────────────────
function MobileOrders() {
  return (
    <MobileShell active="orders" bar={<MobileBar title="Zamówienia" />}>
      {/* Filter chips strip */}
      <div style={{ padding: '14px 16px 8px', display: 'flex', gap: 8, overflowX: 'auto' }} className="no-scrollbar">
        <span className="chip active">Wszystkie · 4</span>
        <span className="chip">W drodze · 1</span>
        <span className="chip">Dostarczone · 3</span>
      </div>

      {/* Cards list */}
      <div style={{ padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ACCT_ORDERS.map(o => (
          <div key={o.id} style={{
            background: '#fff', borderRadius: 'var(--r-md)',
            border: '1px solid var(--aura-line)', overflow: 'hidden',
          }}>
            {/* Top strip */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px',
              borderBottom: '1px dashed var(--aura-line)',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>{o.name}</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>{dateLong(o.processedAt).toUpperCase()}</div>
              </div>
              <StatusPill kind={o.fulfillmentStatus} />
            </div>

            {/* Items */}
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex' }}>
                {o.items.slice(0, 3).map((it, i) => (
                  <div key={i} style={{ marginLeft: i === 0 ? 0 : -14, zIndex: 3 - i }}>
                    <MiniBag accent={it.accent} label={it.name.slice(0, 3).toUpperCase()} />
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>
                  {o.items.map(i => i.name).join(', ')}
                </div>
                <div className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', marginTop: 4 }}>{zl(o.totalPrice)}</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8 }}>
              <button className="btn btn-sm" style={{ flex: 1 }}>Zamów ponownie</button>
              <button className="btn btn-sm btn-ghost">Szczegóły</button>
            </div>
          </div>
        ))}

        {/* Load more */}
        <button style={{
          width: '100%', padding: '14px 16px',
          background: 'transparent', border: '1px dashed var(--aura-line-strong)',
          borderRadius: 'var(--r-md)', cursor: 'pointer',
          fontFamily: 'var(--aura-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600,
        }}>
          Wszystkie zamówienia ↗
        </button>
      </div>
    </MobileShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// MOBILE 3 · ORDER DETAILS
// ────────────────────────────────────────────────────────────────────
function MobileOrderDetails() {
  const o = ACCT_ORDERS[0];
  const subtotal = o.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <MobileShell active="orders" bar={<MobileBar title={o.name} back action={<button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--aura-ink)' }}><NavIcon name="doc" /></button>} />}>

      {/* Hero strip */}
      <div style={{ padding: '20px 16px 16px' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 6 }}>{dateLong(o.processedAt).toUpperCase()}</div>
        <h1 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.025em', lineHeight: 0.95, marginBottom: 12 }}>
          {o.name}<br/><span style={{ color: 'var(--aura-orange)' }}>w drodze.</span>
        </h1>
        <StatusPill kind={o.fulfillmentStatus} big />
      </div>

      {/* Tracking compact */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ background: 'var(--aura-ink)', color: '#fff', borderRadius: 'var(--r-md)', padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 6 }}>Dostawa</div>
              <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.025em', lineHeight: 1 }}>{dateShort(o.trackingEta)}</div>
            </div>
            <span style={{ color: 'var(--aura-orange)' }}><NavIcon name="truck" /></span>
          </div>

          {/* Mini timeline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 14 }}>
            {['done', 'done', 'current', 'wait'].map((s, i, arr) => (
              <React.Fragment key={i}>
                <div style={{
                  width: 12, height: 12, borderRadius: 999, flexShrink: 0,
                  background: s === 'current' ? 'var(--aura-orange)' : (s === 'wait' ? 'transparent' : '#fff'),
                  border: `2px solid ${s === 'wait' ? 'rgba(255,255,255,0.3)' : (s === 'current' ? 'var(--aura-orange)' : '#fff')}`,
                }} />
                {i < arr.length - 1 && (
                  <div style={{ flex: 1, height: 1.5, background: i < 2 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)' }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: 14 }}>
            InPost · {o.trackingNumber}
          </div>

          <button className="btn btn-sm btn-block" style={{ background: 'var(--aura-orange)', borderColor: 'var(--aura-orange)' }}>Śledź paczkę ↗</button>
        </div>
      </div>

      {/* Items receipt */}
      <div style={{ padding: '0 16px 12px' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 8 }}>Pozycje</div>
        <div style={{ background: '#fff', borderRadius: 'var(--r-md)', border: '1px solid var(--aura-line)', overflow: 'hidden' }}>
          {o.items.map((it, idx) => (
            <div key={it.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderBottom: idx < o.items.length - 1 ? '1px dashed var(--aura-line)' : 'none',
            }}>
              <MiniBag accent={it.accent} label={it.name.slice(0, 3).toUpperCase()} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 15, letterSpacing: '-0.015em' }}>{it.name}</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>{it.variant}</div>
                <div className="num" style={{ fontSize: 12, color: 'var(--aura-muted)', marginTop: 4, fontFamily: 'var(--aura-mono)', letterSpacing: '0.05em' }}>×{it.qty}</div>
              </div>
              <div className="num" style={{ fontWeight: 700, fontSize: 15 }}>{zl(it.price * it.qty)}</div>
            </div>
          ))}

          <Perforation />

          <div style={{ padding: '6px 16px 16px' }}>
            <ReceiptRow label="Suma częściowa" value={zl(subtotal)} />
            <ReceiptRow label="Dostawa" value={o.shippingPrice === 0 ? 'Gratis' : zl(o.shippingPrice)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14, borderTop: '1px solid var(--aura-ink)', marginTop: 8 }}>
              <span style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>Razem</span>
              <span className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.025em' }}>{zl(o.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Address + payment row */}
      <div style={{ padding: '0 16px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ background: '#fff', border: '1px solid var(--aura-line)', borderRadius: 'var(--r-md)', padding: 14 }}>
          <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 8, fontSize: 9 }}>Adres</div>
          <div style={{ fontSize: 12, lineHeight: 1.5 }}>
            <strong>{o.address.name}</strong><br/>
            {o.address.line1}<br/>
            {o.address.city}
          </div>
        </div>
        <div style={{ background: '#fff', border: '1px solid var(--aura-line)', borderRadius: 'var(--r-md)', padding: 14 }}>
          <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 8, fontSize: 9 }}>Płatność</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 32, height: 22, borderRadius: 3, background: 'var(--aura-ink)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 8 }}>VISA</div>
            <span style={{ fontSize: 12, fontWeight: 600 }}>•••• 4242</span>
          </div>
          <StatusPill kind="paid" />
        </div>
      </div>

      {/* Bottom CTAs */}
      <div style={{ padding: '8px 16px 24px', display: 'flex', gap: 8 }}>
        <button className="btn" style={{ flex: 1 }}>Zamów ponownie</button>
        <button className="btn btn-ghost" style={{ flexShrink: 0 }}><NavIcon name="doc" /></button>
      </div>
    </MobileShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// MOBILE 4 · SUBSCRIPTION ACTIVE
// ────────────────────────────────────────────────────────────────────
function MobileSubscriptionActive() {
  const sub = ACCT_SUBSCRIPTION;
  return (
    <MobileShell active="subs" bar={<MobileBar title="Subskrypcja" />}>
      {/* Hero card */}
      <div style={{ padding: '20px 16px 12px' }}>
        <div style={{ background: 'var(--aura-paper-2)', borderRadius: 'var(--r-md)', padding: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 6 }}>Aktywna subskrypcja</div>
              <h1 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.025em', lineHeight: 0.95 }}>{sub.blendName}</h1>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--aura-muted)', textTransform: 'uppercase', marginTop: 8 }}>
                {sub.variant} · co {sub.cadenceWeeks} tyg.
              </div>
            </div>
            <CoffeeBag width={88} accent={sub.accent} name={sub.blendName.split(' ')[0].toUpperCase()} sub="" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#fff', borderRadius: 10 }}>
            <div>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>Następna wysyłka</div>
              <div className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.025em' }}>{dateShort(sub.nextShipmentAt)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>Cykl</div>
              <div className="num" style={{ fontSize: 14, fontWeight: 700 }}>{zl(sub.priceCycle)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action grid */}
      <div style={{ padding: '4px 16px 12px' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 10 }}>Zarządzaj</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { ico: 'skip', l: 'Pomiń najbliższą', primary: true },
            { ico: 'repeat', l: 'Zmień blend' },
            { ico: 'doc', l: 'Zmień częstotliwość' },
            { ico: 'pin', l: 'Zmień adres' },
            { ico: 'pause', l: 'Pauzuj' },
            { ico: 'x', l: 'Anuluj', muted: true },
          ].map(a => (
            <button key={a.l} style={{
              background: a.primary ? 'var(--aura-ink)' : '#fff',
              color: a.primary ? '#fff' : (a.muted ? 'var(--aura-muted)' : 'var(--aura-ink)'),
              border: `1px solid ${a.primary ? 'var(--aura-ink)' : 'var(--aura-line)'}`,
              borderRadius: 'var(--r-md)', padding: '14px 14px',
              textAlign: 'left', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 10, minHeight: 84,
              fontFamily: 'var(--aura-text)',
            }}>
              <NavIcon name={a.ico} />
              <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{a.l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cycles compact */}
      <div style={{ padding: '8px 16px 24px' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 10 }}>Ostatnie cykle</div>
        <div style={{ background: '#fff', borderRadius: 'var(--r-md)', border: '1px solid var(--aura-line)', overflow: 'hidden' }}>
          {[
            { d: '21 maja', s: 'delivered', n: 9 },
            { d: '7 maja', s: 'delivered', n: 8 },
            { d: '23 kwietnia', s: 'delivered', n: 7 },
          ].map((c, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: i < arr.length - 1 ? '1px dashed var(--aura-line)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="num mono" style={{ fontSize: 10, color: 'var(--aura-muted)', letterSpacing: '0.12em' }}>#{String(c.n).padStart(2, '0')}</span>
                <span style={{ fontWeight: 500, fontSize: 14 }}>{c.d}</span>
              </div>
              <StatusPill kind={c.s} />
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// MOBILE 5 · ADDRESSES
// ────────────────────────────────────────────────────────────────────
function MobileAddresses() {
  return (
    <MobileShell active="menu" bar={<MobileBar title="Adresy" back action={<button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--aura-ink)' }}><NavIcon name="plus" /></button>} />}>
      <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ACCT_ADDRESSES.map(a => (
          <div key={a.id} style={{
            background: a.isDefault ? 'var(--aura-paper-2)' : '#fff',
            border: `1.5px solid ${a.isDefault ? 'var(--aura-ink)' : 'var(--aura-line)'}`,
            borderRadius: 'var(--r-md)', padding: 18,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="eyebrow" style={{ background: 'var(--aura-ink)', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 10 }}>{a.label}</span>
              {a.isDefault && <span className="eyebrow" style={{ color: 'var(--aura-orange)' }}>★ Domyślny</span>}
            </div>

            <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', marginBottom: 8 }}>{a.name}</div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--aura-ink)' }}>
              {a.line1}<br/>{a.city}<br/>{a.country}
            </div>
            <div className="mono" style={{ marginTop: 10, fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)' }}>{a.phone}</div>

            <div style={{ height: 1, background: 'var(--aura-line)', margin: '16px 0' }} />

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-sm btn-ghost" style={{ flex: '1 0 auto' }}>Edytuj</button>
              {!a.isDefault && <button className="btn btn-sm btn-ghost" style={{ flex: '1 0 auto' }}>Ustaw domyślny</button>}
            </div>
          </div>
        ))}

        {/* Empty slot */}
        <button style={{
          background: 'transparent', border: '1.5px dashed var(--aura-line-strong)',
          borderRadius: 'var(--r-md)', padding: '20px 16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'var(--aura-text)', fontWeight: 600, fontSize: 14, color: 'var(--aura-ink)',
        }}>
          <NavIcon name="plus" /> Dodaj nowy adres
        </button>
      </div>
    </MobileShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// MOBILE 6 · ACCOUNT NAVIGATION / MENU
// ────────────────────────────────────────────────────────────────────
function MobileMenu() {
  return (
    <MobileShell active="menu" bar={<MobileBar title="Menu" />}>
      {/* Profile header */}
      <div style={{ padding: '24px 16px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 999,
          background: 'var(--aura-orange-soft)',
          display: 'grid', placeItems: 'center', flexShrink: 0,
          fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.025em',
          color: 'var(--aura-orange-deep)',
        }}>KW</div>
        <div>
          <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.025em', lineHeight: 1.05 }}>{ACCT_CUSTOMER.firstName} {ACCT_CUSTOMER.lastName}</div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', marginTop: 4, textTransform: 'uppercase' }}>{ACCT_CUSTOMER.email}</div>
        </div>
      </div>

      {/* Nav list */}
      <div style={{ padding: '8px 16px' }}>
        <div style={{ background: '#fff', borderRadius: 'var(--r-md)', border: '1px solid var(--aura-line)', overflow: 'hidden' }}>
          {[
            { ico: 'home', l: 'Dashboard', sub: 'Twoje konto w skrócie' },
            { ico: 'box', l: 'Zamówienia', sub: `${ACCT_ORDERS.length} łącznie · 1 w drodze`, badge: ACCT_ORDERS.length },
            { ico: 'repeat', l: 'Subskrypcja', sub: 'Coração · co 2 tyg.', dot: true },
            { ico: 'pin', l: 'Adresy', sub: '2 zapisane' },
            { ico: 'user', l: 'Dane konta', sub: 'Imię, email, telefon' },
          ].map((it, i, arr) => (
            <a key={it.l} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', cursor: 'pointer',
              borderBottom: i < arr.length - 1 ? '1px dashed var(--aura-line)' : 'none',
              color: 'var(--aura-ink)',
            }}>
              <span style={{ width: 32, height: 32, background: 'var(--aura-paper-2)', borderRadius: 8, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <NavIcon name={it.ico} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{it.l}</div>
                <div style={{ fontSize: 12, color: 'var(--aura-muted)' }}>{it.sub}</div>
              </div>
              {it.dot && <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--aura-orange)' }} />}
              <NavIcon name="arrow" />
            </a>
          ))}
        </div>
      </div>

      {/* Sklep links */}
      <div style={{ padding: '12px 16px' }}>
        <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 10, paddingLeft: 4 }}>Sklep Aura</div>
        <div style={{ background: '#fff', borderRadius: 'var(--r-md)', border: '1px solid var(--aura-line)', overflow: 'hidden' }}>
          {['Wszystkie kawy', 'Blendy', 'Subskrypcja', 'FAQ', 'Kontakt'].map((l, i, arr) => (
            <a key={l} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', cursor: 'pointer',
              borderBottom: i < arr.length - 1 ? '1px dashed var(--aura-line)' : 'none',
              fontSize: 14, fontWeight: 500,
            }}>
              {l}
              <NavIcon name="arrow" />
            </a>
          ))}
        </div>
      </div>

      {/* Secure footer */}
      <div style={{ padding: '12px 16px 12px' }}>
        <div style={{
          padding: '14px 16px',
          background: 'var(--aura-ink)', color: '#fff',
          borderRadius: 'var(--r-md)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ color: 'var(--aura-orange)', flexShrink: 0 }}><NavIcon name="shield" /></span>
          <div style={{ flex: 1 }}>
            <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 2 }}>Bezpieczne konto</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
              Konto klienta Shopify ↗
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 24px' }}>
        <button className="btn btn-ghost btn-block" style={{ color: 'var(--aura-muted)', borderColor: 'var(--aura-line)' }}>
          <NavIcon name="logout" /> Wyloguj
        </button>
        <div className="mono" style={{ textAlign: 'center', fontSize: 9, letterSpacing: '0.14em', color: 'var(--aura-muted)', textTransform: 'uppercase', marginTop: 14 }}>
          AURA · v2.1 · 2026
        </div>
      </div>
    </MobileShell>
  );
}

Object.assign(window, {
  MobileShell,
  MobileDashboard, MobileOrders, MobileOrderDetails,
  MobileSubscriptionActive, MobileAddresses, MobileMenu,
});
