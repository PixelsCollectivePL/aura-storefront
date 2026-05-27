/* eslint-disable no-undef */
/* Aura — Customer Account · empty states + handoff spec doc.        */

// ────────────────────────────────────────────────────────────────────
// EMPTY · No orders (desktop view)
// ────────────────────────────────────────────────────────────────────
function AccountOrdersEmpty() {
  return (
    <DesktopShell active="orders">
      <PageHead eyebrow="Zamówienia · 00" title={<>Twoje<br/>paczki.</>} />
      <EmptyState
        title="Jeszcze nie zamówiłeś."
        body="Pierwsze ziarno czeka. Wybierz blend pod swój rytuał — espresso, filtr, wieczór — i sprawdź jak smakuje świeże palenie."
        cta="Sprawdź kawy"
        secondaryCta="Pomoc w wyborze"
      />
      <ShopifyNote items={[
        { k: 'orders(first: 1).length', v: '0' },
        { k: 'show CTA →', v: '/produkty' },
      ]} />
    </DesktopShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// EMPTY · No addresses (desktop)
// ────────────────────────────────────────────────────────────────────
function AccountAddressesEmpty() {
  return (
    <DesktopShell active="addresses">
      <PageHead eyebrow="Adresy · 00" title={<>Bez adresu<br/>nie wyślemy.</>} />
      <EmptyState
        title="Pusto."
        body="Dodaj adres dostawy, żebyśmy mogli przyjąć Twoje pierwsze zamówienie. Możesz mieć ich kilka — dom, biuro, do mamy."
        cta="Dodaj adres"
      />
      <ShopifyNote items={[
        { k: 'customer.addresses.length', v: '0' },
        { k: 'show CTA →', v: 'customerAddressCreate' },
      ]} />
    </DesktopShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// HANDOFF SPEC — Big info card for Claude Code
// ────────────────────────────────────────────────────────────────────
function AccountHandoffSpec() {
  return (
    <div className="aura" style={{ width: 1440, padding: '64px 80px', background: 'var(--aura-paper)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 40 }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--aura-orange)', marginBottom: 14 }}>Handoff dla Claude Code · v2.1 → account</div>
          <h1 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 96, letterSpacing: '-0.03em', lineHeight: 0.9 }}>
            Panel<br/>klienta.
          </h1>
        </div>
        <div style={{ maxWidth: 420 }}>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--aura-ink)' }}>
            Customer Account dla Aura Storefront v2.1 — minimalistyczny, naturalna część sklepu, bezpośrednio integrowany z <strong>Shopify Customer Accounts</strong> i <strong>Shopify Subscriptions</strong>. Brak własnego auth, własnego checkoutu, własnego CRM.
          </p>
          <div className="mono" style={{ marginTop: 16, fontSize: 11, letterSpacing: '0.14em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>
            Branch: redesign/aura-v2 · path /account · stack Next 14 + TS + Tailwind + Storefront API
          </div>
        </div>
      </div>

      {/* Numbered grid of sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28 }}>

        {/* 1. Direction */}
        <Block n="01" title="Design direction">
          <p>Czarno-biała baza, pomarańcz <code>#FF4D17</code> jako akcent CTA + statusy. Mocna typografia Archivo 800 — H1 60–96 px desktop. <strong>Karty receipt/paragon</strong> z perforacją (dashed border + dot pattern) i mono-eyebrows. Starburst Aura jako detal w empty-states i pakshotach. ≈10% powierzchni pomarańczu max. Tonacja warm-paper, bez SaaS-owej szarości.</p>
        </Block>

        {/* 2. Views */}
        <Block n="02" title="Widoki">
          <ul style={ulCss}>
            <li><strong>Desktop:</strong> Dashboard · Orders list · Order details · Subscriptions active · Subscriptions empty · Addresses · Account details</li>
            <li><strong>Mobile:</strong> Dashboard · Orders list · Order details · Subscription active · Addresses · Menu</li>
            <li><strong>Empty states:</strong> brak zamówień, brak subskrypcji, brak adresów</li>
          </ul>
          <p style={{ marginTop: 10 }}>Routes: <code className="mono">/account</code>, <code className="mono">/account/orders</code>, <code className="mono">/account/orders/[name]</code>, <code className="mono">/account/subscriptions</code>, <code className="mono">/account/addresses</code>, <code className="mono">/account/details</code>.</p>
        </Block>

        {/* 3. Components */}
        <Block n="03" title="Komponenty">
          <ul style={ulCss}>
            <li><code className="mono">&lt;Sidebar/&gt;</code> · 280px desktop, fixed</li>
            <li><code className="mono">&lt;MobileBar/&gt;</code> + <code className="mono">&lt;MobileTabBar/&gt;</code></li>
            <li><code className="mono">&lt;StatusPill kind/&gt;</code> · paid / in_transit / delivered / cancelled / pending</li>
            <li><code className="mono">&lt;ReceiptRow/&gt;</code>, <code className="mono">&lt;Perforation/&gt;</code> — paragon visuals</li>
            <li><code className="mono">&lt;MiniBag/&gt;</code> · 72×90 bag thumb dla list pozycji</li>
            <li><code className="mono">&lt;EmptyState/&gt;</code> · Starburst + figure + CTA</li>
            <li><code className="mono">&lt;ShopifyNote/&gt;</code> · DEV-only banner, w prod hidden</li>
            <li><code className="mono">&lt;OrderTracker/&gt;</code> · stepper z 4 krokami</li>
            <li><code className="mono">&lt;CadencePicker/&gt;</code>, <code className="mono">&lt;BlendSwap/&gt;</code> · radio cards</li>
          </ul>
        </Block>

        {/* 4. Tokens */}
        <Block n="04" title="Design tokens">
          <p>Reuse v2.1 — bez nowych. Sprawdzaj <code>tokens.css</code>:</p>
          <ul style={ulCss}>
            <li><strong>Colors:</strong> ink <code>#0E0E0C</code>, paper <code>#FAF8F4</code>, paper-2 <code>#F3F0E9</code>, line <code>#E6E2D8</code>, brand <code>#FF4D17</code>, muted <code>#6E6A60</code></li>
            <li><strong>Status dots:</strong> <span style={{ color: 'var(--aura-green)' }}>● delivered/paid</span> · <span style={{ color: 'var(--aura-orange)' }}>● in_transit</span> · <span style={{ color: '#C19A2A' }}>● pending</span> · <span style={{ color: 'var(--aura-muted)' }}>● cancelled/refunded</span></li>
            <li><strong>Type:</strong> Archivo 800 (display, H1 clamp(40,4.5vw,64)), DM Sans 400/500/600 (body 14–17), JetBrains Mono (eyebrow 11/0.14em, num)</li>
            <li><strong>Radii:</strong> sm 8 · md 14 · pill 999. Cards = md, chips/buttons = pill.</li>
            <li><strong>Receipt perforation:</strong> dashed dot bg <code className="mono" style={{ fontSize: 10 }}>radial-gradient(circle at 6px 6px, line 1.5px, transparent 1.6px) / 12px 12px repeat-x</code></li>
          </ul>
        </Block>

        {/* 5. Responsive */}
        <Block n="05" title="Responsive behavior">
          <ul style={ulCss}>
            <li><strong>≥ lg (1024+):</strong> Sidebar 280 + main flex-1 (padding 56/64)</li>
            <li><strong>md → lg:</strong> Sidebar collapses do hamburger sheet z lewej, main full</li>
            <li><strong>&lt; md:</strong> brak sidebar, MobileBar góra + MobileTabBar dół (4 sekcje + Menu)</li>
            <li>Touch targets ≥ 44px. CTA główne <code>h-12</code>. Cards <code>p-4/6</code> mobile / <code>p-7/8</code> desktop.</li>
            <li>Tabele <strong>nigdy</strong> na mobile — zawsze cards z poziomym układem klucz/wartość.</li>
            <li>Sticky bottom-tab bar honoruje <code>safe-area-inset-bottom</code></li>
          </ul>
        </Block>

        {/* 6. UX notes */}
        <Block n="06" title="UX notes">
          <ul style={ulCss}>
            <li><strong>„Zamów ponownie"</strong> = primary CTA na każdym ekranie z zamówieniami. Tworzy <code className="mono">cartLinesAdd</code> z line itemami i otwiera cart drawer.</li>
            <li>Status pill <strong>zawsze</strong> przy zamówieniu — nigdy gołe „delivered" tekstem.</li>
            <li>Subskrypcja widoczna na dashboardzie, ale nie nachalna — jeden ink-card prawy, nie sekcja na full width.</li>
            <li>Dane konta (email, hasło, 2FA) wskazują na Shopify customer account — własny panel nigdy nie próbuje tym zarządzać.</li>
            <li>Empty states zachęcają, nie sprzedają — Starburst + jedno CTA + krótki body. Bez „zniżek na pierwsze zamówienie" w treści.</li>
            <li>Skipping / pausing subskrypcji = jeden klik z confirm-toast (nie modal).</li>
          </ul>
        </Block>

        {/* 7. Empty states */}
        <Block n="07" title="Empty states">
          <ul style={ulCss}>
            <li><strong>Brak zamówień:</strong> Starburst paper-2 + figure runner ink + „Jeszcze nie zamówiłeś" + CTA „Sprawdź kawy"</li>
            <li><strong>Brak subskrypcji:</strong> dwukolumnowy layout z burst po lewej, 3 benefits + dual CTA po prawej</li>
            <li><strong>Brak adresów:</strong> kompaktowy empty + CTA „Dodaj adres" w nagłówku</li>
            <li>Wszystkie używają tego samego <code className="mono">&lt;EmptyState/&gt;</code> komponentu — różny content, ten sam visual language</li>
          </ul>
        </Block>

        {/* 8. Shopify */}
        <Block n="08" title="Shopify integration" wide>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--aura-mono)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--aura-ink)' }}>
                <th style={thCss}>Widok</th>
                <th style={thCss}>Query / Mutation</th>
                <th style={thCss}>Pole</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Dashboard', 'customer { firstName }', 'greeting'],
                ['Dashboard', 'customer.orders(first: 1)', 'last order'],
                ['Dashboard', 'order.fulfillment.trackingInfo', 'tracking strip'],
                ['Dashboard', 'app · subscriptionContract', 'subs card (active/empty)'],
                ['Orders list', 'customer.orders(first: 25, sortKey: PROCESSED_AT)', 'list'],
                ['Orders list', 'order.name / processedAt / fulfillmentStatus / totalPrice', 'rows'],
                ['Order details', 'order(id: $id)', 'fetch'],
                ['Order details', 'order.lineItems / shippingAddress / financialStatus', 'receipt'],
                ['Order details', 'order.invoiceUrl', 'Faktura PDF'],
                ['Order details', 'cartLinesAdd', 'Zamów ponownie'],
                ['Subscriptions', 'subscriptionContracts(first: 5)', 'active list'],
                ['Subscriptions', 'subscriptionContract.deliveryPolicy.interval', 'cadence'],
                ['Subscriptions', 'subscriptionContractUpdate', 'change blend/cadence'],
                ['Subscriptions', 'subscriptionContractSkip / Pause / Cancel', 'lifecycle CTAs'],
                ['Addresses', 'customer.addresses(first: 25)', 'list'],
                ['Addresses', 'customerAddressCreate / Update / Delete', 'edit CTAs'],
                ['Addresses', 'customerDefaultAddressUpdate', 'set default'],
                ['Account details', 'customer { firstName lastName email phone acceptsMarketing }', 'profile'],
                ['Account details', 'customerUpdate', 'edit fields'],
                ['Account details', 'Shopify customer account URL', 'manage account ↗ link'],
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px dashed var(--aura-line)' }}>
                  <td style={tdCss}>{r[0]}</td>
                  <td style={tdCss}><code style={{ color: 'var(--aura-orange-deep)' }}>{r[1]}</code></td>
                  <td style={tdCss}>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Block>

        {/* 9. Microinteractions */}
        <Block n="09" title="Animations / microinteractions">
          <ul style={ulCss}>
            <li><strong>StatusPill dot:</strong> pulsuje co 2s przy <code>in_transit</code> (opacity 0.6 → 1)</li>
            <li><strong>„Zamów ponownie":</strong> button → orange ring 400 ms + toast „Dodano 3 pozycje do koszyka", auto-open cart sheet</li>
            <li><strong>Tracking timeline:</strong> stagger fade-in 60 ms each na entry</li>
            <li><strong>Cadence/Blend picker:</strong> active radio — orange dot scale 0 → 1 (200 ms cubic-bezier(.2,.7,.3,1))</li>
            <li><strong>Pause / Skip / Cancel:</strong> confirm toast bottom-center z undo (5 s)</li>
            <li><strong>Empty state burst:</strong> wolna rotacja 60s, pause on hover</li>
            <li><strong>Mobile tab switch:</strong> orange top-indicator slide 240 ms</li>
            <li><strong>Subskrypcja card:</strong> burst-decoration powolny obrót w tle (60 s)</li>
            <li>Wszystko respektuje <code>prefers-reduced-motion</code></li>
          </ul>
        </Block>

        {/* 10. Mocks */}
        <Block n="10" title="Dane do mocku (faza 1)">
          <ul style={ulCss}>
            <li><strong>customer:</strong> Kuba Wójcik · kuba@pixelscollective.pl · +48 600 412 087 · klient od 2024-09-18</li>
            <li><strong>orders:</strong> 4 sztuki — <code>#AU-1042</code> (in_transit), <code>#AU-1031</code> (delivered), <code>#AU-1018</code> (delivered), <code>#AU-0994</code> (delivered)</li>
            <li><strong>line items:</strong> Coração 250g/500g, Verde 250g, Lila 500g, Mezcla 250g + akcesoria (klipsy, pocztówki)</li>
            <li><strong>subscription:</strong> 1 aktywna — Coração 500g / co 2 tyg. / next 4 czerwca / 9 cykli dostarczonych</li>
            <li><strong>addresses:</strong> 2 — Dom (Próżna 14/8, default), Studio (Krucza 41)</li>
            <li><strong>payment:</strong> Visa •••• 4242 (Shopify Payments)</li>
            <li><strong>tracking:</strong> InPost 693403812749 · ETA 28 maja</li>
            <li>Wszystkie ceny w PLN, daty w PL locale (<code>Intl.DateTimeFormat('pl-PL')</code>)</li>
          </ul>
        </Block>

      </div>

      {/* Footer */}
      <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--aura-line-strong)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--aura-muted)', textTransform: 'uppercase' }}>
          Aura Storefront v2.1 · Customer Account · 2026 Q2 · ready for code
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Starburst color="var(--aura-orange)" size={20} points={10} depth={0.28} />
          <span style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>AURA</span>
        </div>
      </div>
    </div>
  );
}

// Block primitive
const ulCss = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, lineHeight: 1.55, color: 'var(--aura-ink)' };
const thCss = { textAlign: 'left', padding: '12px 8px', fontSize: 10, letterSpacing: '0.14em', color: 'var(--aura-muted)', textTransform: 'uppercase', fontWeight: 600 };
const tdCss = { padding: '10px 8px', verticalAlign: 'top' };

function Block({ n, title, children, wide = false }) {
  return (
    <div style={{
      gridColumn: wide ? '1 / -1' : 'auto',
      background: '#fff', border: '1px solid var(--aura-line)',
      borderRadius: 'var(--r-md)', padding: 28,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16, paddingBottom: 14, borderBottom: '1px dashed var(--aura-line)' }}>
        <span className="num mono" style={{ fontSize: 12, color: 'var(--aura-orange)', letterSpacing: '0.16em', fontWeight: 600 }}>{n}</span>
        <h3 style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', flex: 1 }}>{title}</h3>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--aura-ink)' }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, {
  AccountOrdersEmpty, AccountAddressesEmpty, AccountHandoffSpec,
});
