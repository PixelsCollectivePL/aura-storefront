/* eslint-disable no-undef */
/* Aura — Customer Account · DESKTOP screens (1440 wide).
   All seven views live here; each is a self-contained section that
   the canvas pulls into a DCArtboard. Layout pattern:
   <Sidebar/> (280) + <main/> (flex-1, padded 64/56). Receipts use
   pure white cards on paper. Orange is reserved for primary CTAs +
   active accents + status dots.                                    */

// ── Wrapper used by every desktop screen ───────────────────────────
function DesktopShell({ active, children, mainPad = '56px 64px 80px' }) {
  return (
    <div className="aura" style={{
      width: 1440, minHeight: '100%',
      display: 'flex', background: 'var(--aura-paper)',
    }}>
      <Sidebar active={active} />
      <main style={{ flex: 1, padding: mainPad, overflow: 'hidden' }}>
        {children}
      </main>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// 1) DASHBOARD
// ────────────────────────────────────────────────────────────────────
function AccountDashboard() {
  const lastOrder = ACCT_ORDERS[0];
  const sub = ACCT_SUBSCRIPTION;

  return (
    <DesktopShell active="dashboard">
      <PageHead
        eyebrow="Dashboard · konto 01"
        title={<>Cześć, <span style={{ color: 'var(--aura-orange)' }}>Kuba.</span><br/>Twoja kawa czeka.</>}
        action={
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm">Zarządzaj kontem ↗</button>
            <button className="btn btn-sm">Zamów ponownie</button>
          </div>
        }
      />

      {/* Hero row: last order + subscription side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Last order — receipt card */}
        <div style={{
          background: '#fff', borderRadius: 'var(--r-md)',
          border: '1px solid var(--aura-line)', padding: 28, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
            <div>
              <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 10 }}>Ostatnie zamówienie</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <h2 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.025em', lineHeight: 1 }}>{lastOrder.name}</h2>
                <span className="mono" style={{ fontSize: 12, color: 'var(--aura-muted)', letterSpacing: '0.1em' }}>{dateLong(lastOrder.processedAt).toUpperCase()}</span>
              </div>
            </div>
            <StatusPill kind={lastOrder.fulfillmentStatus} big />
          </div>

          {/* Items row */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 22 }}>
            {lastOrder.items.slice(0, 3).map(it => (
              <div key={it.id} style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                <MiniBag accent={it.accent} label={it.name.slice(0, 3).toUpperCase()} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 15, letterSpacing: '-0.015em', lineHeight: 1.1, marginBottom: 4 }}>{it.name}</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--aura-muted)', letterSpacing: '0.1em' }}>{it.variant}</div>
                  <div className="num mono" style={{ fontSize: 12, color: 'var(--aura-ink)', marginTop: 6, fontWeight: 600 }}>{it.qty} × {zl(it.price)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tracking strip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px', background: 'var(--aura-paper-2)', borderRadius: 10, marginBottom: 18,
          }}>
            <span style={{ color: 'var(--aura-orange)' }}><NavIcon name="truck" /></span>
            <div style={{ flex: 1 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Status dostawy</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--aura-ink)' }}>
                {lastOrder.trackingCarrier} · w drodze do Próżna 14/8 · dostawa <strong className="num">{dateShort(lastOrder.trackingEta)}</strong>
              </div>
            </div>
            <a style={{ fontFamily: 'var(--aura-text)', fontWeight: 600, fontSize: 13, color: 'var(--aura-ink)', borderBottom: '1.5px solid var(--aura-ink)', paddingBottom: 2, cursor: 'pointer' }}>Śledź ↗</a>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn">Zamów ponownie</button>
            <button className="btn btn-ghost">Zobacz szczegóły</button>
          </div>

          {/* Lot ticker bottom corner */}
          <div className="mono" style={{ position: 'absolute', bottom: 14, right: 18, fontSize: 9, letterSpacing: '0.18em', color: 'var(--aura-muted)' }}>
            LOT · {lastOrder.id.slice(-6)}
          </div>
        </div>

        {/* Subscription card — ink */}
        <div style={{
          background: 'var(--aura-ink)', borderRadius: 'var(--r-md)',
          padding: 28, color: '#fff', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* burst decoration */}
          <div style={{ position: 'absolute', top: -40, right: -40, opacity: 0.5 }}>
            <Starburst color="var(--aura-orange)" size={180} points={12} depth={0.22} />
          </div>

          <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 10 }}>Aktywna subskrypcja</div>
            <h2 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.025em', lineHeight: 0.95, marginBottom: 4 }}>{sub.blendName}</h2>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: 24 }}>{sub.variant} · co {sub.cadenceWeeks} tyg.</div>

            <div style={{
              padding: '18px 0', borderTop: '1px dashed rgba(255,255,255,0.18)', borderBottom: '1px dashed rgba(255,255,255,0.18)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22,
            }}>
              <div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: 4 }}>Następna wysyłka</div>
                <div className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.025em', lineHeight: 1 }}>{dateShort(sub.nextShipmentAt)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: 4 }}>Cykl</div>
                <div className="num" style={{ fontSize: 16, fontWeight: 600 }}>{zl(sub.priceCycle)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
              <button className="btn btn-block" style={{ background: 'var(--aura-orange)', borderColor: 'var(--aura-orange)' }}>Zarządzaj subskrypcją</button>
              <button className="btn btn-ghost btn-block" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Pomiń najbliższą</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick-stats strip */}
      <div style={{
        background: '#fff', border: '1px solid var(--aura-line)',
        borderRadius: 'var(--r-md)', padding: '24px 28px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginBottom: 20,
      }}>
        {[
          { eb: 'Zamówień', v: ACCT_ORDERS.length, sub: 'łącznie' },
          { eb: 'W tym roku', v: '4', sub: 'paczek' },
          { eb: 'Ulubiony blend', v: 'Coração', sub: 'do espresso' },
          { eb: 'Punkty Aura', v: '128', sub: 'do następnej nagrody: 22' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '0 24px', borderRight: i < 3 ? '1px solid var(--aura-line)' : 'none' }}>
            <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 6 }}>{s.eb}</div>
            <div className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 6 }}>{s.v}</div>
            <div style={{ fontSize: 12, color: 'var(--aura-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Two columns: previous orders + tasted blends */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 'var(--r-md)', border: '1px solid var(--aura-line)', padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
            <h3 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>Twoja historia</h3>
            <a style={{ fontSize: 13, fontWeight: 600, color: 'var(--aura-ink)', borderBottom: '1.5px solid var(--aura-ink)', cursor: 'pointer' }}>Wszystkie zamówienia</a>
          </div>
          {ACCT_ORDERS.slice(1, 4).map((o, idx) => (
            <div key={o.id} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '14px 0', borderTop: idx > 0 ? '1px dashed var(--aura-line)' : 'none',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 15 }}>{o.name}</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>{dateLong(o.processedAt).toUpperCase()}</div>
              </div>
              <div style={{ flex: 1, fontSize: 13, color: 'var(--aura-muted)' }}>
                {o.items.map(i => i.name).join(' · ')}
              </div>
              <StatusPill kind={o.fulfillmentStatus} />
              <span className="num" style={{ fontWeight: 700, fontSize: 15, minWidth: 70, textAlign: 'right' }}>{zl(o.totalPrice)}</span>
              <button className="btn btn-sm btn-ghost">Ponów</button>
            </div>
          ))}
        </div>

        {/* Tasted blends */}
        <div style={{ background: 'var(--aura-paper-2)', borderRadius: 'var(--r-md)', padding: 28, position: 'relative', overflow: 'hidden' }}>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 10 }}>Twoja kawa</div>
          <h3 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 18 }}>Smakowałeś już…</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Coração do Brasil', 'Verde Tropical', 'Lila Nocturna', 'Mezcla Casa'].map((n, i) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px dashed var(--aura-line)' : 'none' }}>
                <span className="num mono" style={{ fontSize: 10, color: 'var(--aura-muted)', letterSpacing: '0.12em', minWidth: 20 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{n}</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--aura-muted)', letterSpacing: '0.12em' }}>{i === 0 ? '×3' : '×1'}</span>
              </div>
            ))}
          </div>
          <a style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 18, fontSize: 13, fontWeight: 600, color: 'var(--aura-ink)', borderBottom: '1.5px solid var(--aura-ink)', cursor: 'pointer' }}>
            Wybierz nowy blend <NavIcon name="arrow" />
          </a>
        </div>
      </div>

      <ShopifyNote items={[
        { k: 'customer.firstName', v: 'Kuba' },
        { k: 'orders.first(1)', v: 'lastOrder' },
        { k: 'subscription.activeContract', v: 'app metafield' },
        { k: 'order.fulfillment.trackingInfo', v: 'truck strip' },
      ]} />
    </DesktopShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// 2) ORDERS LIST
// ────────────────────────────────────────────────────────────────────
function AccountOrders() {
  return (
    <DesktopShell active="orders">
      <PageHead
        eyebrow="Zamówienia · 04"
        title={<>Twoje<br/>paczki.</>}
        action={
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className="chip">Wszystkie</span>
            <span className="chip">Dostarczone</span>
            <span className="chip">W drodze</span>
            <span style={{ width: 1, height: 24, background: 'var(--aura-line)' }} />
            <button className="btn btn-sm">Zamów ponownie</button>
          </div>
        }
      />

      {/* Orders table — receipt rows */}
      <div style={{ background: '#fff', borderRadius: 'var(--r-md)', border: '1px solid var(--aura-line)', overflow: 'hidden' }}>
        {/* table head */}
        <div style={{
          display: 'grid', gridTemplateColumns: '180px 1fr 200px 120px 200px',
          gap: 24, padding: '18px 28px',
          background: 'var(--aura-paper-2)',
          borderBottom: '1px solid var(--aura-line)',
        }}>
          {['Zamówienie', 'Produkty', 'Status', 'Wartość', ''].map((h, i) => (
            <span key={i} className="eyebrow" style={{ color: 'var(--aura-muted)', fontSize: 10 }}>{h}</span>
          ))}
        </div>

        {ACCT_ORDERS.map((o, idx) => (
          <div key={o.id} style={{
            display: 'grid', gridTemplateColumns: '180px 1fr 200px 120px 200px',
            gap: 24, padding: '22px 28px', alignItems: 'center',
            borderBottom: idx < ACCT_ORDERS.length - 1 ? '1px dashed var(--aura-line)' : 'none',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 4 }}>{o.name}</div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>{dateLong(o.processedAt).toUpperCase()}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: -8 }}>
                {o.items.slice(0, 3).map((it, i) => (
                  <div key={i} style={{ marginLeft: i === 0 ? 0 : -12 }}>
                    <MiniBag accent={it.accent} label={it.name.slice(0, 3).toUpperCase()} />
                  </div>
                ))}
              </div>
              <div style={{ marginLeft: 8, fontSize: 13, color: 'var(--aura-ink)' }}>
                <div style={{ fontWeight: 500, lineHeight: 1.4 }}>{o.items.map(i => i.name).join(' · ')}</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase', marginTop: 3 }}>{o.items.length} {o.items.length === 1 ? 'pozycja' : 'pozycje'}</div>
              </div>
            </div>
            <StatusPill kind={o.fulfillmentStatus} />
            <div className="num" style={{ fontWeight: 700, fontSize: 17 }}>{zl(o.totalPrice)}</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-sm btn-ghost">Szczegóły</button>
              <button className="btn btn-sm">Ponów</button>
            </div>
          </div>
        ))}
      </div>

      <ShopifyNote items={[
        { k: 'orders(first: 25)', v: 'list endpoint' },
        { k: 'order.name', v: '#AU-1042' },
        { k: 'order.fulfillmentStatus', v: 'enum' },
        { k: 'order.totalPrice.amount', v: 'PLN' },
      ]} />
    </DesktopShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// 3) ORDER DETAILS
// ────────────────────────────────────────────────────────────────────
function AccountOrderDetails() {
  const o = ACCT_ORDERS[0];
  const subtotal = o.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <DesktopShell active="orders">
      {/* Back row */}
      <a style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, fontWeight: 600, color: 'var(--aura-muted)', cursor: 'pointer' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Wszystkie zamówienia
      </a>

      <PageHead
        eyebrow={`Zamówienie · ${dateLong(o.processedAt).toUpperCase()}`}
        title={<>{o.name}<br/><span style={{ color: 'var(--aura-orange)' }}>w drodze.</span></>}
        action={
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm"><NavIcon name="doc" /> Faktura PDF</button>
            <button className="btn btn-sm">Zamów ponownie</button>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
        {/* Items receipt */}
        <div style={{ background: '#fff', borderRadius: 'var(--r-md)', border: '1px solid var(--aura-line)', overflow: 'hidden' }}>
          {/* Header strip */}
          <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--aura-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eyebrow" style={{ color: 'var(--aura-muted)' }}>Pozycje</div>
            <StatusPill kind={o.fulfillmentStatus} />
          </div>

          {/* Item rows */}
          {o.items.map((it, idx) => (
            <div key={it.id} style={{
              display: 'flex', gap: 18, alignItems: 'center',
              padding: '22px 28px',
              borderBottom: idx < o.items.length - 1 ? '1px dashed var(--aura-line)' : 'none',
            }}>
              <MiniBag accent={it.accent} label={it.name.slice(0, 3).toUpperCase()} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 4 }}>{it.name}</div>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>{it.variant}</div>
              </div>
              <div className="num mono" style={{ fontSize: 13, color: 'var(--aura-muted)', minWidth: 60, textAlign: 'right', letterSpacing: '0.05em' }}>×{it.qty}</div>
              <div className="num" style={{ fontWeight: 700, fontSize: 17, minWidth: 90, textAlign: 'right' }}>{zl(it.price * it.qty)}</div>
            </div>
          ))}

          <Perforation />

          {/* Totals */}
          <div style={{ padding: '18px 28px 24px' }}>
            <ReceiptRow label="Suma częściowa" value={zl(subtotal)} />
            <ReceiptRow label="Dostawa" value={o.shippingPrice === 0 ? 'Gratis' : zl(o.shippingPrice)} />
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '20px 0 4px', borderTop: '1px solid var(--aura-ink)', marginTop: 12,
            }}>
              <span style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>Razem</span>
              <span className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.025em' }}>{zl(o.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Right column: address, payment, tracking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Tracking */}
          <div style={{ background: 'var(--aura-ink)', color: '#fff', borderRadius: 'var(--r-md)', padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 12 }}>Dostawa</div>
            <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 4 }}>
              {dateShort(o.trackingEta)}
            </div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: 18 }}>Szacowana dostawa</div>

            {/* steps */}
            {[
              { l: 'Zamówienie przyjęte', done: true, d: '22 maja, 14:08' },
              { l: 'Paczka spakowana',    done: true, d: '23 maja, 09:42' },
              { l: 'W drodze · InPost',   done: true, current: true, d: '24 maja, 18:11' },
              { l: 'Dostarczone',         done: false, d: 'oczekiwane 28 maja' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingBottom: 14, position: 'relative' }}>
                <div style={{
                  width: 14, height: 14, borderRadius: 999, marginTop: 2,
                  background: s.current ? 'var(--aura-orange)' : (s.done ? '#fff' : 'transparent'),
                  border: `2px solid ${s.done ? (s.current ? 'var(--aura-orange)' : '#fff') : 'rgba(255,255,255,0.3)'}`,
                  flexShrink: 0, position: 'relative', zIndex: 1,
                }} />
                {i < 3 && <div style={{ position: 'absolute', left: 7, top: 18, bottom: 0, width: 1.5, background: s.done ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)' }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: s.current ? 700 : 500, color: s.done ? '#fff' : 'rgba(255,255,255,0.5)' }}>{s.l}</div>
                  <div className="mono num" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>{s.d}</div>
                </div>
              </div>
            ))}

            <button className="btn btn-block" style={{ background: 'var(--aura-orange)', borderColor: 'var(--aura-orange)', marginTop: 8 }}>
              Śledź paczkę ↗
            </button>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', marginTop: 10, textTransform: 'uppercase' }}>
              {o.trackingCarrier} · {o.trackingNumber}
            </div>
          </div>

          {/* Address card */}
          <div style={{ background: '#fff', border: '1px solid var(--aura-line)', borderRadius: 'var(--r-md)', padding: 24 }}>
            <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 12 }}>Adres dostawy</div>
            <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 6 }}>{o.address.name}</div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--aura-ink)' }}>
              {o.address.line1}<br/>
              {o.address.city}<br/>
              {o.address.country}
            </div>
            <div className="mono" style={{ marginTop: 12, fontSize: 11, letterSpacing: '0.1em', color: 'var(--aura-muted)' }}>{o.address.phone}</div>
          </div>

          {/* Payment */}
          <div style={{ background: '#fff', border: '1px solid var(--aura-line)', borderRadius: 'var(--r-md)', padding: 24 }}>
            <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 12 }}>Płatność</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 30, borderRadius: 4, background: 'var(--aura-ink)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 10, letterSpacing: '0.05em' }}>VISA</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>•••• 4242</div>
                <StatusPill kind="paid" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShopifyNote items={[
        { k: 'order.lineItems', v: 'items receipt' },
        { k: 'order.shippingAddress', v: 'address card' },
        { k: 'order.fulfillment.trackingInfo', v: 'timeline' },
        { k: 'order.invoiceUrl', v: 'Faktura PDF link' },
      ]} />
    </DesktopShell>
  );
}

Object.assign(window, { DesktopShell, AccountDashboard, AccountOrders, AccountOrderDetails });
