/* eslint-disable no-undef */
/* Aura — Customer Account · DESKTOP screens part 2.
   Subscriptions (active + empty), Addresses, Account Details. */

// ────────────────────────────────────────────────────────────────────
// 4) SUBSCRIPTIONS · ACTIVE
// ────────────────────────────────────────────────────────────────────
function AccountSubscriptionsActive() {
  const sub = ACCT_SUBSCRIPTION;

  return (
    <DesktopShell active="subs">
      <PageHead
        eyebrow="Subskrypcja · co 2 tygodnie"
        title={<>Twój rytuał<br/>w trasie.</>}
        action={<button className="btn btn-ghost btn-sm">Historia wysyłek</button>}
      />

      {/* Main subscription card — hero */}
      <div style={{
        background: 'var(--aura-paper-2)', borderRadius: 'var(--r-md)',
        padding: 36, marginBottom: 20, position: 'relative', overflow: 'hidden',
        display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 36, alignItems: 'center',
      }}>
        {/* Big bag visual */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 320 }}>
          <CoffeeBag width={210} accent={sub.accent} name={sub.blendName.toUpperCase()} sub={sub.variant} />
          <div style={{ position: 'absolute', top: 20, right: -10, transform: 'rotate(-8deg)' }}>
            <Starburst color="var(--aura-orange)" size={80} points={12} depth={0.22}>
              <span className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', textAlign: 'center', textTransform: 'uppercase', color: 'var(--aura-ink)', lineHeight: 1.1 }}>Drop<br/>09</span>
            </Starburst>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <StatusPill kind="paid" big />
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>ID · {sub.id.slice(-2)}</span>
          </div>

          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 10 }}>Aktywna subskrypcja</div>
          <h2 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 48, letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: 10 }}>{sub.blendName}</h2>
          <div className="mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--aura-muted)', textTransform: 'uppercase', marginBottom: 28 }}>
            {sub.variant} · co {sub.cadenceWeeks} tyg. · {zl(sub.priceCycle)}/cykl
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginBottom: 24, background: '#fff', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ borderRight: '1px dashed var(--aura-line)', paddingRight: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--aura-muted)' }}>Następna wysyłka</div>
              <div className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.025em', lineHeight: 1 }}>{dateShort(sub.nextShipmentAt)}</div>
              <div className="mono num" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase', marginTop: 4 }}>za 8 dni</div>
            </div>
            <div style={{ paddingLeft: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--aura-muted)' }}>Dostarczono</div>
              <div className="num" style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.025em', lineHeight: 1 }}>{sub.cyclesDelivered}</div>
              <div className="mono num" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase', marginTop: 4 }}>paczek od stycznia</div>
            </div>
          </div>

          {/* Action cluster */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button className="btn btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <NavIcon name="skip" /> Pomiń najbliższą
            </button>
            <button className="btn btn-sm btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <NavIcon name="repeat" /> Zmień blend
            </button>
            <button className="btn btn-sm btn-ghost">Zmień częstotliwość</button>
            <button className="btn btn-sm btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <NavIcon name="pause" /> Pauzuj
            </button>
            <button className="btn btn-sm btn-ghost" style={{ color: 'var(--aura-muted)', borderColor: 'var(--aura-line)' }}>
              Anuluj
            </button>
          </div>
        </div>
      </div>

      {/* Cadence + blend + address grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Cadence picker */}
        <div style={{ background: '#fff', border: '1px solid var(--aura-line)', borderRadius: 'var(--r-md)', padding: 24 }}>
          <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 14 }}>Częstotliwość</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { v: 1, label: 'Co tydzień', sub: 'Dla codziennych' },
              { v: 2, label: 'Co 2 tygodnie', sub: 'Polecane', active: true },
              { v: 4, label: 'Co miesiąc', sub: 'Dla wolniejszych' },
              { v: 8, label: 'Co 2 miesiące', sub: 'Tylko wieczorem' },
            ].map(c => (
              <label key={c.v} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                border: `1.5px solid ${c.active ? 'var(--aura-ink)' : 'var(--aura-line)'}`,
                background: c.active ? 'var(--aura-paper-2)' : '#fff',
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 999,
                  border: `1.5px solid ${c.active ? 'var(--aura-ink)' : 'var(--aura-line)'}`,
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  {c.active && <span style={{ width: 9, height: 9, borderRadius: 999, background: 'var(--aura-orange)' }} />}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.label}</div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>{c.sub}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Swap blend */}
        <div style={{ background: '#fff', border: '1px solid var(--aura-line)', borderRadius: 'var(--r-md)', padding: 24 }}>
          <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 14 }}>Zmień blend</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Coração do Brasil', meta: 'Espresso · ciemniejszy', active: true, accent: 'var(--aura-orange)' },
              { name: 'Verde Tropical', meta: 'Filtr · cytrusowy', accent: 'var(--aura-green)' },
              { name: 'Lila Nocturna', meta: 'Espresso · winny', accent: 'var(--aura-purple)' },
            ].map(b => (
              <div key={b.name} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10,
                background: b.active ? 'var(--aura-paper-2)' : 'transparent',
                border: `1.5px solid ${b.active ? 'var(--aura-ink)' : 'var(--aura-line)'}`, cursor: 'pointer',
              }}>
                <MiniBag accent={b.accent} label={b.name.slice(0, 3).toUpperCase()} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 14, letterSpacing: '-0.015em' }}>{b.name}</div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>{b.meta}</div>
                </div>
                {b.active && <NavIcon name="check" />}
              </div>
            ))}
          </div>
          <a style={{ display: 'inline-block', marginTop: 14, fontSize: 13, fontWeight: 600, color: 'var(--aura-ink)', borderBottom: '1.5px solid var(--aura-ink)', cursor: 'pointer' }}>
            Wszystkie blendy →
          </a>
        </div>

        {/* Address + payment */}
        <div style={{ background: '#fff', border: '1px solid var(--aura-line)', borderRadius: 'var(--r-md)', padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 14 }}>Dostawa & płatność</div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Kuba Wójcik</div>
            <div style={{ fontSize: 13, color: 'var(--aura-muted)', lineHeight: 1.5 }}>
              ul. Próżna 14/8<br/>00-107 Warszawa
            </div>
            <a style={{ fontSize: 12, fontWeight: 600, color: 'var(--aura-ink)', borderBottom: '1.5px solid var(--aura-ink)', marginTop: 8, display: 'inline-block', cursor: 'pointer' }}>Zmień adres</a>
          </div>

          <div style={{ paddingTop: 18, borderTop: '1px dashed var(--aura-line)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 30, borderRadius: 4, background: 'var(--aura-ink)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 10 }}>VISA</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>•••• 4242</div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)' }}>WAŻNA DO 09/29</div>
            </div>
            <a style={{ fontSize: 12, fontWeight: 600, color: 'var(--aura-ink)', cursor: 'pointer' }}>Zmień ↗</a>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{
            marginTop: 18, padding: 12, borderRadius: 8,
            background: 'var(--aura-paper-2)',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <span style={{ color: 'var(--aura-orange)', marginTop: 2 }}><NavIcon name="shield" /></span>
            <div style={{ fontSize: 12, color: 'var(--aura-muted)', lineHeight: 1.45 }}>
              Płatność cykliczna obsługiwana przez Shopify Subscriptions. Anulujesz w każdej chwili.
            </div>
          </div>
        </div>
      </div>

      {/* Cycles history strip */}
      <div style={{ background: '#fff', border: '1px solid var(--aura-line)', borderRadius: 'var(--r-md)', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>Historia cykli</h3>
          <a style={{ fontSize: 13, fontWeight: 600, color: 'var(--aura-ink)', borderBottom: '1.5px solid var(--aura-ink)', cursor: 'pointer' }}>Wszystkie</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0 }}>
          {[
            { d: '21 maja', s: 'delivered' },
            { d: '7 maja', s: 'delivered' },
            { d: '23 kwietnia', s: 'delivered' },
            { d: '9 kwietnia', s: 'delivered' },
            { d: '4 czerwca', s: 'unfulfilled' },
          ].map((c, i) => (
            <div key={i} style={{ padding: '8px 16px', borderRight: i < 4 ? '1px dashed var(--aura-line)' : 'none' }}>
              <div className="mono num" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Cykl {String(9 - i).padStart(2, '0')}</div>
              <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{c.d}</div>
              <StatusPill kind={c.s} />
            </div>
          ))}
        </div>
      </div>

      <ShopifyNote items={[
        { k: 'app · subscriptionContract', v: 'Shopify Subscriptions API' },
        { k: 'subscription.nextBillingDate', v: 'next shipment' },
        { k: 'subscription.deliveryPolicy.interval', v: 'cadence' },
        { k: 'metafield: aura.subscription_id', v: 'order link' },
      ]} />
    </DesktopShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// 5) SUBSCRIPTIONS · EMPTY
// ────────────────────────────────────────────────────────────────────
function AccountSubscriptionsEmpty() {
  return (
    <DesktopShell active="subs">
      <PageHead
        eyebrow="Subskrypcje"
        title={<>Twój rytuał<br/>czeka.</>}
      />

      <div style={{
        background: '#fff', borderRadius: 'var(--r-md)',
        border: '1px solid var(--aura-line)',
        padding: '72px 64px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Left: visual */}
        <div style={{ position: 'relative', display: 'grid', placeItems: 'center', minHeight: 360 }}>
          <Starburst color="var(--aura-orange-soft)" size={320} points={12} depth={0.22}>
            <FigureRunner size={160} color="var(--aura-ink)" />
          </Starburst>
          <div style={{
            position: 'absolute', bottom: -20, right: 20, transform: 'rotate(8deg)',
            background: 'var(--aura-ink)', color: '#fff', padding: '8px 14px',
            fontFamily: 'var(--aura-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', borderRadius: 6,
          }}>
            −10% na pierwszy cykl
          </div>
        </div>

        {/* Right: content */}
        <div>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Nie masz jeszcze subskrypcji</div>
          <h2 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 56, letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: 18 }}>
            Uruchom regularną dostawę.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--aura-muted)', marginBottom: 28, maxWidth: 440 }}>
            Świeżo palona, automatycznie. Wybierz blend i rytm — Aura sama dba o to, żebyś nigdy nie skończył kawy w środku tygodnia.
          </p>

          {/* Three benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
            {[
              { l: '−10% taniej', sub: 'na każdy cykl, na zawsze' },
              { l: 'Bez zobowiązań', sub: 'pauzujesz, pomijasz, anulujesz' },
              { l: 'Pierwsza wysyłka w 24h', sub: 'palona w tym tygodniu' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span className="num mono" style={{ background: 'var(--aura-ink)', color: '#fff', width: 26, height: 26, borderRadius: 999, display: 'grid', placeItems: 'center', fontSize: 11, letterSpacing: 0, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{b.l}</div>
                  <div style={{ fontSize: 13, color: 'var(--aura-muted)' }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn">Uruchom subskrypcję</button>
            <button className="btn btn-ghost">Jak to działa?</button>
          </div>
        </div>
      </div>

      <ShopifyNote items={[
        { k: 'subscription.activeContracts.length', v: '0' },
        { k: 'sellingPlanGroups(first: 5)', v: 'available plans' },
        { k: 'app · Shopify Subscriptions / Recharge', v: 'create contract' },
      ]} />
    </DesktopShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// 6) ADDRESSES
// ────────────────────────────────────────────────────────────────────
function AccountAddresses() {
  return (
    <DesktopShell active="addresses">
      <PageHead
        eyebrow={`Adresy · ${ACCT_ADDRESSES.length}`}
        title={<>Gdzie<br/>wysłać paczkę?</>}
        action={<button className="btn"><NavIcon name="plus" /> Dodaj adres</button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {ACCT_ADDRESSES.map(a => (
          <div key={a.id} style={{
            background: a.isDefault ? 'var(--aura-paper-2)' : '#fff',
            border: `1.5px solid ${a.isDefault ? 'var(--aura-ink)' : 'var(--aura-line)'}`,
            borderRadius: 'var(--r-md)', padding: 28, position: 'relative',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="eyebrow" style={{ background: 'var(--aura-ink)', color: '#fff', padding: '5px 10px', borderRadius: 4, fontSize: 10 }}>{a.label}</span>
                {a.isDefault && (
                  <span className="eyebrow" style={{ color: 'var(--aura-orange)' }}>★ Adres domyślny</span>
                )}
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--aura-muted)', display: 'inline-flex' }}>
                <NavIcon name="edit" />
              </button>
            </div>

            {/* Body */}
            <div style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 12 }}>
              {a.name}
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--aura-ink)', marginBottom: 16 }}>
              {a.line1}<br/>
              {a.city}<br/>
              {a.country}
            </div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>
              {a.phone}
            </div>

            <div style={{ height: 1, background: a.isDefault ? 'var(--aura-line-strong)' : 'var(--aura-line)', margin: '22px 0 16px', opacity: a.isDefault ? 0.2 : 1 }} />

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-ghost">Edytuj</button>
              {!a.isDefault && <button className="btn btn-sm btn-ghost">Ustaw jako domyślny</button>}
              {!a.isDefault && <button className="btn btn-sm btn-ghost" style={{ color: 'var(--aura-muted)', borderColor: 'var(--aura-line)' }}>Usuń</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Add card — dashed empty slot */}
      <button style={{
        width: '100%', minHeight: 130,
        background: 'transparent', border: '1.5px dashed var(--aura-line-strong)',
        borderRadius: 'var(--r-md)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        fontFamily: 'var(--aura-text)', fontSize: 15, fontWeight: 600, color: 'var(--aura-ink)',
      }}>
        <NavIcon name="plus" /> Dodaj nowy adres dostawy
      </button>

      <ShopifyNote items={[
        { k: 'customer.addresses(first: 25)', v: 'address list' },
        { k: 'customer.defaultAddress.id', v: 'isDefault flag' },
        { k: 'customerAddressCreate', v: 'Dodaj adres' },
        { k: 'customerDefaultAddressUpdate', v: 'Ustaw jako domyślny' },
      ]} />
    </DesktopShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// 7) ACCOUNT DETAILS
// ────────────────────────────────────────────────────────────────────
function AccountDetails() {
  return (
    <DesktopShell active="details">
      <PageHead
        eyebrow="Dane konta"
        title={<>Twoje<br/>dane.</>}
        action={<button className="btn btn-ghost btn-sm">Zarządzaj kontem Shopify ↗</button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Profile card */}
        <div style={{ background: '#fff', border: '1px solid var(--aura-line)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
          {/* Header strip with ID */}
          <div style={{ padding: '20px 28px', background: 'var(--aura-paper-2)', borderBottom: '1px solid var(--aura-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eyebrow" style={{ color: 'var(--aura-muted)' }}>Profil klienta</div>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>ID · {ACCT_CUSTOMER.id.slice(-10)}</span>
          </div>

          <div style={{ padding: 28 }}>
            {/* Each row: label / value / inline edit */}
            {[
              { eb: 'Imię', v: ACCT_CUSTOMER.firstName },
              { eb: 'Nazwisko', v: ACCT_CUSTOMER.lastName },
              { eb: 'Email', v: ACCT_CUSTOMER.email, verified: true },
              { eb: 'Telefon', v: ACCT_CUSTOMER.phone },
            ].map((row, i, arr) => (
              <div key={row.eb} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '18px 0', borderBottom: i < arr.length - 1 ? '1px dashed var(--aura-line)' : 'none',
              }}>
                <div>
                  <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 4 }}>{row.eb}</div>
                  <div style={{ fontSize: 17, fontWeight: 500, color: 'var(--aura-ink)' }}>
                    {row.v} {row.verified && <span className="mono" style={{ color: 'var(--aura-green)', fontSize: 10, letterSpacing: '0.12em', marginLeft: 8, textTransform: 'uppercase' }}>✓ Zweryfikowany</span>}
                  </div>
                </div>
                <button className="btn btn-sm btn-ghost">Edytuj</button>
              </div>
            ))}
          </div>

          {/* Bottom: secure account banner */}
          <div style={{ background: 'var(--aura-ink)', color: '#fff', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: 'var(--aura-orange)', flexShrink: 0 }}><NavIcon name="shield" /></span>
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 3 }}>Bezpieczne konto klienta</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                Hasło, dwuetapowa weryfikacja i adres email zarządzasz w panelu Shopify Customer Accounts.
              </div>
            </div>
            <button className="btn btn-sm" style={{ background: 'var(--aura-orange)', borderColor: 'var(--aura-orange)' }}>Otwórz panel ↗</button>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Marketing consents */}
          <div style={{ background: '#fff', border: '1px solid var(--aura-line)', borderRadius: 'var(--r-md)', padding: 28 }}>
            <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 14 }}>Zgody marketingowe</div>
            <h3 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', marginBottom: 18 }}>Co dostajesz</h3>

            {[
              { l: 'Drop emaile', sub: 'Nowe partie, świeże palenia, story', on: true },
              { l: 'SMS o wysyłce', sub: 'Tylko jeden, gdy paczka rusza', on: false },
              { l: 'Coffee club', sub: 'Cuppingi, eventy, kod -10% co kwartał', on: true },
            ].map(c => (
              <div key={c.l} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px dashed var(--aura-line)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.l}</div>
                  <div style={{ fontSize: 12, color: 'var(--aura-muted)' }}>{c.sub}</div>
                </div>
                {/* Toggle */}
                <div style={{
                  width: 42, height: 24, borderRadius: 999, position: 'relative',
                  background: c.on ? 'var(--aura-orange)' : 'var(--aura-line)',
                  transition: 'background .15s',
                  flexShrink: 0,
                }}>
                  <span style={{
                    position: 'absolute', top: 3, left: c.on ? 21 : 3,
                    width: 18, height: 18, borderRadius: 999, background: '#fff',
                    transition: 'left .15s', boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  }} />
                </div>
              </div>
            ))}

            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--aura-muted)', textTransform: 'uppercase', marginTop: 14, lineHeight: 1.5 }}>
              RODO · zgody wymagane do wysyłki maili promocyjnych
            </div>
          </div>

          {/* Danger zone */}
          <div style={{ border: '1px dashed var(--aura-line-strong)', borderRadius: 'var(--r-md)', padding: 24 }}>
            <div className="eyebrow" style={{ color: 'var(--aura-muted)', marginBottom: 10 }}>Strefa konta</div>
            <h3 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 8 }}>Eksport / usunięcie konta</h3>
            <p style={{ fontSize: 13, color: 'var(--aura-muted)', lineHeight: 1.5, marginBottom: 14 }}>
              Pobierz wszystkie swoje dane (RODO) lub poproś o trwałe usunięcie konta. Zamówienia archiwizowane zgodnie z prawem.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-ghost">Pobierz dane</button>
              <button className="btn btn-sm btn-ghost" style={{ color: 'var(--aura-muted)' }}>Usuń konto</button>
            </div>
          </div>
        </div>
      </div>

      <ShopifyNote items={[
        { k: 'customer.firstName / lastName / email / phone', v: 'profile fields' },
        { k: 'customer.acceptsMarketing', v: 'marketing toggle' },
        { k: 'Shopify Customer Account UI', v: 'password / 2FA / login' },
        { k: 'customerUpdate mutation', v: 'edit fields' },
      ]} />
    </DesktopShell>
  );
}

Object.assign(window, {
  AccountSubscriptionsActive, AccountSubscriptionsEmpty,
  AccountAddresses, AccountDetails,
});
