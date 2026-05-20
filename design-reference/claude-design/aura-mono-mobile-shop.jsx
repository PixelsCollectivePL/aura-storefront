// AURA v2 — mobile shop screens: Home, Listing, PDP. 390 wide.

const MW = 390;

// ============================================================================
// 1) MOBILE HOMEPAGE
// ============================================================================
function MMHome() {
  return (
    <div className="m-frame" style={{ width: MW, minHeight: 2400 }}>
      <MStatusBar/>
      <MMobileNav count={2}/>

      {/* HERO */}
      <div style={{ padding: "8px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 18 }}>New · Lot 04 / 2026</div>
        <div className="m-display" style={{ fontSize: 64 }}>
          Coffee,<br/>made small<br/>on purpose.
        </div>
        <div className="m-mute" style={{ fontSize: 14.5, marginTop: 20, maxWidth: 320, lineHeight: 1.55 }}>
          Six lots. Roasted every Wednesday. Shipped within 72 hours of roasting — never older.
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
          <button className="m-btn m-btn-primary" style={{ flex: 1 }}>Shop all coffees <MIcon.arrow s={16}/></button>
        </div>
      </div>

      {/* HERO IMAGE — full-bleed */}
      <div style={{ marginTop: 36, height: 480, background: "var(--m-bg-soft)", position: "relative", overflow: "hidden" }}>
        <MImg id="v2-m-home-hero" placeholder="Hero · brewing moment"/>
      </div>

      {/* SECTION: Featured coffees */}
      <div style={{ padding: "72px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <div>
            <div className="m-eyebrow" style={{ marginBottom: 10 }}>The shelf · 06</div>
            <div className="m-h2" style={{ fontSize: 28 }}>This season</div>
          </div>
          <a className="m-meta" style={{ textDecoration: "underline", textDecorationThickness: 1, textUnderlineOffset: 4 }}>View all</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 12px" }}>
          {[
            { c: "001", n: "ONE",   o: "Ethiopia · Yirgacheffe", ns: "cherry, jasmine, bergamot", p: "84", id: "v2-mh-1" },
            { c: "002", n: "TWO",   o: "Colombia · Huila",        ns: "cocoa, plum, almond",       p: "76", id: "v2-mh-2" },
            { c: "003", n: "THREE", o: "House blend",             ns: "hazelnut, brown sugar, fig",p: "68", id: "v2-mh-3" },
            { c: "004", n: "FOUR",  o: "Kenya · Nyeri",           ns: "blackcurrant, citrus, malt",p: "92", id: "v2-mh-4" },
          ].map((p) => (
            <MProductCard key={p.c} code={p.c} name={p.n} origin={p.o} notes={p.ns} price={p.p} slotId={p.id}/>
          ))}
        </div>
      </div>

      {/* SECTION: How it works — 3 steps, very simple */}
      <div style={{ padding: "80px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 12 }}>How it works</div>
        <div className="m-h2" style={{ fontSize: 28, marginBottom: 32 }}>From roastery to your kitchen, in three steps.</div>
        {[
          { n: "01", t: "Choose a lot", d: "Six coffees. Different origins, brew methods and intensities." },
          { n: "02", t: "We roast Wednesday", d: "All bags leave within 72 hours. Whole bean or ground to your method." },
          { n: "03", t: "Brew on Friday", d: "Free shipping over 150 zł. Letterbox bags fit through your door." },
        ].map((s) => (
          <div key={s.n} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 16, padding: "20px 0", borderTop: "1px solid var(--m-line)" }}>
            <div className="m-num" style={{ fontSize: 13, color: "var(--m-mute-2)", letterSpacing: "0.06em", paddingTop: 2 }}>{s.n}</div>
            <div>
              <div className="m-h3" style={{ fontSize: 18, marginBottom: 6 }}>{s.t}</div>
              <div className="m-mute" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION: Compare blends — tight scroll table */}
      <div style={{ padding: "80px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 12 }}>Compare</div>
        <div className="m-h2" style={{ fontSize: 28, marginBottom: 24 }}>Which blend is for you?</div>
        <div style={{ overflowX: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr>
                <th style={th()}></th>
                <th style={th()}>ONE</th>
                <th style={th()}>TWO</th>
                <th style={th()}>THREE</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Roast",      "Light",  "Medium", "Med-dark"],
                ["Body",       "Tea",    "Round",  "Full"],
                ["Acidity",    "High",   "Soft",   "Low"],
                ["Best for",   "Filter", "Filter / Espresso", "Espresso"],
                ["Price",      "84 zł", "76 zł", "68 zł"],
              ].map(([k, ...vals]) => (
                <tr key={k}>
                  <td style={td(true)}>{k}</td>
                  {vals.map((v, i) => <td key={i} style={td()}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION: Freshness/quality */}
      <div style={{ padding: "80px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>Promise</div>
        <div className="m-h1" style={{ fontSize: 36, marginBottom: 16 }}>Never older than ten days.</div>
        <div className="m-mute" style={{ fontSize: 14.5, lineHeight: 1.55, maxWidth: 340 }}>
          We roast in small batches every Wednesday and ship within 72 hours. If your bag arrives past its prime, we replace it — no questions.
        </div>
        <div style={{ height: 320, background: "var(--m-bg-soft)", marginTop: 28, position: "relative", overflow: "hidden" }}>
          <MImg id="v2-m-home-roast" placeholder="Roastery"/>
        </div>
      </div>

      {/* SECTION: Reviews/trust */}
      <div style={{ padding: "80px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 16 }}>What people say</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[
            { q: "Best filter coffee I've had outside of a cafe. The ONE is now a daily ritual.", a: "Anna · Warsaw" },
            { q: "Bag arrived four days after roasting. You can smell the difference the moment you open it.", a: "Jakub · Kraków" },
          ].map((r, i) => (
            <div key={i} style={{ padding: "24px 0", borderTop: "1px solid var(--m-line)" }}>
              <div className="m-h3" style={{ fontSize: 17, fontWeight: 400, color: "var(--m-ink-hi)", marginBottom: 12, lineHeight: 1.45 }}>"{r.q}"</div>
              <div className="m-meta">{r.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TRUST ROW */}
      <div style={{ padding: "64px 20px 0" }}>
        <MTrustRow items={[
          { t: "Free over 150 zł", s: "PL · 2-3 days" },
          { t: "Roasted weekly",   s: "Shipped in 72 h" },
          { t: "30-day promise",   s: "Freshness guarantee" },
        ]}/>
      </div>

      <MMobileFooter/>
    </div>
  );
}
function th() { return { textAlign: "left", padding: "12px 6px", fontSize: 10.5, fontWeight: 500, color: "var(--m-mute-2)", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid var(--m-ink-hi)" }; }
function td(first) { return { padding: "13px 6px", borderBottom: "1px solid var(--m-line)", color: first ? "var(--m-mute-2)" : "var(--m-ink-hi)", fontWeight: first ? 400 : 500, fontSize: 12.5, verticalAlign: "top" }; }

// ============================================================================
// 2) MOBILE LISTING / SHOP
// ============================================================================
function MMListing() {
  const products = [
    { c: "001", n: "ONE",   o: "Ethiopia · Yirgacheffe", ns: "cherry, jasmine, bergamot",      p: "84", id: "v2-ml-1" },
    { c: "002", n: "TWO",   o: "Colombia · Huila",        ns: "cocoa, plum, almond",            p: "76", id: "v2-ml-2" },
    { c: "003", n: "THREE", o: "House blend",             ns: "hazelnut, brown sugar, fig",     p: "68", id: "v2-ml-3" },
    { c: "004", n: "FOUR",  o: "Kenya · Nyeri",           ns: "blackcurrant, citrus, malt",     p: "92", id: "v2-ml-4" },
    { c: "005", n: "FIVE",  o: "Espresso blend",          ns: "caramel, dates, dark chocolate", p: "72", id: "v2-ml-5" },
    { c: "006", n: "SIX",   o: "Brazil · decaf",          ns: "milk chocolate, walnut",         p: "64", id: "v2-ml-6", soldOut: true },
  ];
  return (
    <div className="m-frame" style={{ width: MW, minHeight: 2100 }}>
      <MStatusBar/>
      <MMobileNav count={2}/>

      {/* Header */}
      <div style={{ padding: "8px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 12 }}>Shop · 06 coffees</div>
        <div className="m-display" style={{ fontSize: 52 }}>All coffees</div>
        <div className="m-mute" style={{ fontSize: 13.5, marginTop: 14, maxWidth: 320 }}>
          Single origins and small-batch blends. Roasted to order in Warsaw.
        </div>
      </div>

      {/* Filter chips horizontal scroll */}
      <div style={{ padding: "32px 16px 12px", display: "flex", gap: 8, overflowX: "hidden" }}>
        {[
          { l: "All", a: true },
          { l: "Single origin" },
          { l: "Blends" },
          { l: "Espresso" },
          { l: "Filter" },
          { l: "Decaf" },
        ].map((c) => (
          <button key={c.l} className="m-chip" data-active={c.a ? "true" : "false"} style={{ flex: "0 0 auto" }}>{c.l}</button>
        ))}
      </div>

      {/* Sort + filter row */}
      <div style={{ padding: "12px 20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <MIcon.filter s={16}/> Filter <span className="m-meta" style={{ marginLeft: 4 }}>(2)</span>
        </button>
        <button style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          Sort · Freshest <MIcon.chev s={14}/>
        </button>
      </div>

      {/* Grid */}
      <div style={{ padding: "0 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "36px 12px" }}>
        {products.map((p) => (
          <MProductCard key={p.c} code={p.c} name={p.n} origin={p.o} notes={p.ns} price={p.p} slotId={p.id} soldOut={p.soldOut}/>
        ))}
      </div>

      <div style={{ padding: "48px 20px 24px" }}>
        <button className="m-btn m-btn-ghost" style={{ width: "100%" }}>Load older lots</button>
      </div>

      <MMobileFooter/>
    </div>
  );
}

// ============================================================================
// 3) MOBILE PDP
// ============================================================================
function MMPDP() {
  const [grind, setGrind] = React.useState("Whole bean");
  const [size, setSize]   = React.useState("250 g");
  const [qty, setQty]     = React.useState(1);
  const sizes = [["250 g", "84"], ["500 g", "152"], ["1 kg", "276"]];
  const grinds = ["Whole bean", "Espresso", "Filter", "Aeropress", "Moka", "French press"];
  const total = sizes.find(s => s[0] === size)[1];

  return (
    <div className="m-frame" style={{ width: MW, minHeight: 2400 }}>
      <MStatusBar/>
      <MMobileNav left="back" title="" count={2}/>

      {/* Gallery */}
      <div style={{ position: "relative", height: 460, background: "var(--m-bg-soft)", overflow: "hidden" }}>
        <MImg id="v2-m-pdp-hero" placeholder="Lot 001 · Yirgacheffe"/>
        <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
          {[0,1,2,3].map((i) => (
            <span key={i} style={{ width: i === 0 ? 20 : 6, height: 2, background: i === 0 ? "var(--m-ink-hi)" : "var(--m-line-2)" }}/>
          ))}
        </div>
      </div>

      {/* Title + meta */}
      <div style={{ padding: "28px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div className="m-eyebrow" style={{ marginBottom: 8 }}>001 · Single origin</div>
            <div className="m-display" style={{ fontSize: 52 }}>ONE</div>
            <div className="m-mute" style={{ fontSize: 15, marginTop: 10 }}>Ethiopia · Yirgacheffe</div>
          </div>
          <button style={{ ...btnReset(40), marginTop: 4 }}><MIcon.heart s={20}/></button>
        </div>

        {/* Notes */}
        <div style={{ marginTop: 20 }}>
          <MNotes notes={["cherry", "jasmine", "bergamot", "stone fruit"]} size={14}/>
        </div>

        {/* Price + stock */}
        <div style={{ marginTop: 24, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div className="m-num" style={{ fontSize: 28, fontWeight: 500, color: "var(--m-ink-hi)" }}>
            {total} zł <span style={{ fontSize: 12, color: "var(--m-mute-2)", fontWeight: 400, marginLeft: 6 }}>/ {size}</span>
          </div>
          <MStock in_stock count={24}/>
        </div>
      </div>

      {/* Variant: Grind */}
      <div style={{ padding: "36px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div className="m-eyebrow">01 — Grind</div>
          <div style={{ fontSize: 12, color: "var(--m-mute-2)" }}>{grind}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {grinds.map((g) => (
            <button key={g} className="m-chip" data-active={g === grind ? "true" : "false"} onClick={() => setGrind(g)}>{g}</button>
          ))}
        </div>
        <div className="m-meta" style={{ fontSize: 11.5, marginTop: 10 }}>
          Tell us your brewer and we'll grind it the morning of dispatch.
        </div>
      </div>

      {/* Variant: Size */}
      <div style={{ padding: "28px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div className="m-eyebrow">02 — Size</div>
          <div style={{ fontSize: 12, color: "var(--m-mute-2)" }}>{size}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {sizes.map(([s, p]) => (
            <button key={s} className="m-tile" data-active={s === size ? "true" : "false"} onClick={() => setSize(s)}>
              <div className="m-h3" style={{ fontSize: 18 }}>{s}</div>
              <div className="m-mute m-num" style={{ fontSize: 11 }}>{p} zł</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended brew */}
      <div style={{ padding: "32px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>Recommended brew</div>
        <div style={{ border: "1px solid var(--m-line)", padding: "18px 16px" }}>
          <div className="m-h3" style={{ fontSize: 18, marginBottom: 4 }}>V60 pour-over</div>
          <div className="m-mute" style={{ fontSize: 13, marginBottom: 12 }}>Best for bright, tea-like coffees.</div>
          <div className="m-num" style={{ fontSize: 12.5, color: "var(--m-ink)", letterSpacing: "-0.005em" }}>
            15 g coffee · 250 g water · 92 °C · 2:45
          </div>
        </div>
        <div className="m-meta" style={{ marginTop: 10 }}>Also works as Aeropress, Chemex.</div>
      </div>

      {/* Profile */}
      <div style={{ padding: "36px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>Profile</div>
        {[
          ["Origin",    "Yirgacheffe, Ethiopia"],
          ["Producer",  "Konga washing station"],
          ["Altitude",  "1,950 – 2,100 m"],
          ["Process",   "Washed"],
          ["Varietal",  "Heirloom"],
          ["Roast",     "Light — developed for filter"],
          ["Roasted",   "08.05.2026 · 11 days ago"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "grid", gridTemplateColumns: "110px 1fr", padding: "12px 0", borderTop: "1px solid var(--m-line)", alignItems: "baseline" }}>
            <span className="m-meta">{k}</span>
            <span style={{ fontSize: 13.5, color: "var(--m-ink-hi)" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Shipping / returns */}
      <div style={{ padding: "36px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>Shipping & freshness</div>
        {[
          ["Free delivery",    "On orders over 150 zł. PL: 2-3 days, EU: 4-6 days."],
          ["Freshly roasted",  "Roasted Wednesday, shipped within 72 hours."],
          ["30-day promise",   "Past its prime? We replace your bag, no questions."],
        ].map(([t, d]) => (
          <div key={t} style={{ padding: "16px 0", borderTop: "1px solid var(--m-line)" }}>
            <div className="m-h3" style={{ fontSize: 14, marginBottom: 4 }}>{t}</div>
            <div className="m-mute" style={{ fontSize: 12.5, lineHeight: 1.45 }}>{d}</div>
          </div>
        ))}
      </div>

      {/* Similar */}
      <div style={{ padding: "48px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>Similar coffees</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { c: "004", n: "FOUR", o: "Kenya · Nyeri", ns: "blackcurrant, citrus, malt", p: "92", id: "v2-mpdp-s1" },
            { c: "002", n: "TWO",  o: "Colombia · Huila", ns: "cocoa, plum, almond", p: "76", id: "v2-mpdp-s2" },
          ].map((p) => <MProductCard key={p.c} mode="mobile" {...p} slotId={p.id}/>)}
        </div>
      </div>

      {/* Spacer for sticky bar */}
      <div style={{ height: 120 }}/>

      {/* STICKY ADD-TO-BASKET BAR */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "14px 16px 22px",
        background: "var(--m-bg)",
        borderTop: "1px solid var(--m-line)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--m-line)", height: 52 }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} style={btnReset(40)}><MIcon.minus s={14}/></button>
          <span className="m-num" style={{ width: 24, textAlign: "center", fontSize: 14 }}>{qty}</span>
          <button onClick={() => setQty(qty + 1)} style={btnReset(40)}><MIcon.plus s={14}/></button>
        </div>
        <button className="m-btn m-btn-primary" style={{ flex: 1, height: 52, justifyContent: "space-between", padding: "0 18px" }}>
          <span>Add to basket</span>
          <span className="m-num" style={{ opacity: 0.7 }}>{total} zł</span>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { MMHome, MMListing, MMPDP });
