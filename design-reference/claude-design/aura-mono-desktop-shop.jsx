// AURA v2 — desktop shop: Home, Listing, PDP. 1440 wide.

const DW = 1440;

// ============================================================================
// D-1) DESKTOP HOMEPAGE
// ============================================================================
function MDHome() {
  return (
    <div className="m-frame" style={{ width: DW, minHeight: 4400 }}>
      <MDesktopNav active="Shop" count={2}/>

      {/* HERO — left text, right image */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 720, borderBottom: "1px solid var(--m-line)" }}>
        <div style={{ padding: "120px 56px 80px 80px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="m-eyebrow" style={{ marginBottom: 28 }}>— New · Lot 04 / 2026</div>
          <div className="m-display" style={{ fontSize: 96, color: "var(--m-ink-hi)" }}>
            Coffee,<br/>made small<br/>on purpose.
          </div>
          <div className="m-mute" style={{ fontSize: 16.5, lineHeight: 1.6, marginTop: 28, maxWidth: 440 }}>
            Six lots. Roasted every Wednesday in Warsaw. Shipped within 72 hours of roasting — never older.
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 44 }}>
            <button className="m-btn m-btn-primary m-btn-lg">Shop all coffees <MIcon.arrow s={18}/></button>
            <button className="m-btn m-btn-ghost m-btn-lg">Discover your blend</button>
          </div>
        </div>
        <div style={{ background: "var(--m-bg-soft)", position: "relative", overflow: "hidden" }}>
          <MImg id="v2-d-home-hero" placeholder="Hero · brewing moment"/>
        </div>
      </section>

      {/* SECTION: featured shelf */}
      <section style={{ padding: "120px 56px 24px" }}>
        <MSectionHead
          eyebrow="The shelf · 06"
          title="This season"
          sub="Two single origins, three blends, one decaf — chosen the way you'd choose a record."
          action={<a className="m-meta" style={{ textDecoration: "underline", textUnderlineOffset: 4 }}>View all coffees →</a>}
        />
      </section>
      <section style={{ padding: "0 56px 120px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "60px 32px" }}>
        {[
          { c: "001", n: "ONE",   o: "Ethiopia · Yirgacheffe", ns: "cherry, jasmine, bergamot",      p: "84", id: "v2-dh-1" },
          { c: "002", n: "TWO",   o: "Colombia · Huila",        ns: "cocoa, plum, almond",            p: "76", id: "v2-dh-2" },
          { c: "003", n: "THREE", o: "House blend",             ns: "hazelnut, brown sugar, fig",     p: "68", id: "v2-dh-3" },
        ].map((p) => (
          <MProductCard key={p.c} mode="desktop" code={p.c} name={p.n} origin={p.o} notes={p.ns} price={p.p} slotId={p.id}/>
        ))}
      </section>

      {/* SECTION: Compare blends */}
      <section style={{ padding: "120px 56px", background: "var(--m-bg-soft)" }}>
        <MSectionHead
          eyebrow="Compare"
          title="Which blend is for you?"
          sub="A side-by-side. Three coffees, four dimensions. Pick the one that fits your morning."
        />
        <div style={{ background: "var(--m-bg)", border: "1px solid var(--m-line)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--m-bg)" }}>
                <th style={dth(true)}></th>
                {[
                  { c: "001", n: "ONE",   o: "Ethiopia · Yirgacheffe" },
                  { c: "002", n: "TWO",   o: "Colombia · Huila" },
                  { c: "003", n: "THREE", o: "House blend" },
                  { c: "005", n: "FIVE",  o: "Espresso blend" },
                ].map((p) => (
                  <th key={p.c} style={dth()}>
                    <div className="m-h2" style={{ fontSize: 32, marginBottom: 6 }}>{p.n}</div>
                    <div className="m-meta">{p.o}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Roast",        ["Light",   "Medium", "Med-dark", "Dark"]],
                ["Body",         ["Tea-like","Round",  "Full",     "Syrupy"]],
                ["Acidity",      ["High",    "Soft",   "Low",      "Very low"]],
                ["Best for",     ["Filter",  "Filter / Espresso","Espresso","Espresso, moka"]],
                ["Tasting",      ["cherry, jasmine, bergamot", "cocoa, plum, almond", "hazelnut, brown sugar, fig", "caramel, dates, chocolate"]],
                ["Price (250 g)",["84 zł",  "76 zł",  "68 zł",     "72 zł"]],
              ].map(([k, vals]) => (
                <tr key={k}>
                  <td style={dtd(true)}>{k}</td>
                  {vals.map((v, i) => <td key={i} style={dtd()}>{v}</td>)}
                </tr>
              ))}
              <tr>
                <td style={dtd(true)}></td>
                {[0,1,2,3].map((i) => <td key={i} style={{ ...dtd(), padding: "20px 18px" }}><button className="m-btn m-btn-secondary m-btn-sm" style={{ width: "100%" }}>View</button></td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION: How it works */}
      <section style={{ padding: "120px 56px" }}>
        <MSectionHead
          eyebrow="How it works"
          title="From roastery to your kitchen, in three steps."
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
          {[
            { n: "01", t: "Choose a lot",         d: "Six coffees. Different origins, brew methods and intensities. Pick by taste, by ritual, or by mood." },
            { n: "02", t: "We roast Wednesday",  d: "Every bag leaves within 72 hours of roasting. Whole bean, or ground to your method — pour-over, espresso, moka." },
            { n: "03", t: "Brew on Friday",       d: "Free shipping over 150 zł in Poland. Letterbox-format bags fit through your door, even when you're not home." },
          ].map((s) => (
            <div key={s.n} style={{ borderTop: "1px solid var(--m-ink-hi)", paddingTop: 24 }}>
              <div className="m-num m-meta" style={{ fontSize: 12 }}>{s.n}</div>
              <div className="m-h2" style={{ fontSize: 28, marginTop: 14, marginBottom: 10 }}>{s.t}</div>
              <div className="m-mute" style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 360 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: freshness */}
      <section style={{ padding: "120px 56px", background: "var(--m-ink-hi)", color: "var(--m-bg)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--m-mute)", marginBottom: 24 }}>— Promise</div>
            <div className="m-display" style={{ fontSize: 72, color: "var(--m-bg)" }}>
              Never older<br/>than ten days.
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,0.7)", marginTop: 28, maxWidth: 460 }}>
              We roast in small batches every Wednesday and ship within 72 hours. If your bag arrives past its prime, we replace it — no questions, no forms, no waiting.
            </div>
            <div style={{ marginTop: 36, display: "flex", gap: 12 }}>
              <button className="m-btn" style={{ background: "var(--m-bg)", color: "var(--m-ink-hi)" }}>Our roasting promise <MIcon.arrow s={16}/></button>
            </div>
          </div>
          <div style={{ aspectRatio: "1/1", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <MImg id="v2-d-home-roast" placeholder="Roasting drum"/>
          </div>
        </div>
      </section>

      {/* SECTION: Reviews */}
      <section style={{ padding: "120px 56px" }}>
        <MSectionHead
          eyebrow="People who drink it"
          title="A small but loyal kitchen counter."
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          {[
            { q: "Best filter coffee I've had outside of a cafe. The ONE is now a daily ritual.", a: "Anna", c: "Warsaw" },
            { q: "Bag arrived four days after roasting. You can smell the difference the moment you open it.", a: "Jakub", c: "Kraków" },
            { q: "I switched our office to AURA's house blend. Three months in, no complaints — that's a record.", a: "Karolina", c: "Wrocław" },
          ].map((r, i) => (
            <div key={i} style={{ padding: "32px 0", borderTop: "1px solid var(--m-ink-hi)" }}>
              <div style={{ fontSize: 19, color: "var(--m-ink-hi)", lineHeight: 1.5, marginBottom: 20 }}>"{r.q}"</div>
              <div className="m-meta">{r.a} · {r.c}</div>
            </div>
          ))}
        </div>
      </section>

      <MDesktopFooter/>
    </div>
  );
}
function dth(first) { return { textAlign: "left", padding: "28px 18px", borderBottom: "1px solid var(--m-ink-hi)", verticalAlign: "bottom", width: first ? "160px" : "auto", color: "var(--m-mute-2)" }; }
function dtd(first) { return { textAlign: "left", padding: "16px 18px", borderBottom: "1px solid var(--m-line)", color: first ? "var(--m-mute-2)" : "var(--m-ink-hi)", fontWeight: first ? 400 : 500, fontSize: first ? 11.5 : 14, letterSpacing: first ? "0.1em" : 0, textTransform: first ? "uppercase" : "none", verticalAlign: "top" }; }

// ============================================================================
// D-2) DESKTOP LISTING
// ============================================================================
function MDListing() {
  const products = [
    { c: "001", n: "ONE",   o: "Ethiopia · Yirgacheffe", ns: "cherry, jasmine, bergamot",      p: "84", id: "v2-dl-1" },
    { c: "002", n: "TWO",   o: "Colombia · Huila",        ns: "cocoa, plum, almond",            p: "76", id: "v2-dl-2" },
    { c: "003", n: "THREE", o: "House blend",             ns: "hazelnut, brown sugar, fig",     p: "68", id: "v2-dl-3" },
    { c: "004", n: "FOUR",  o: "Kenya · Nyeri",           ns: "blackcurrant, citrus, malt",     p: "92", id: "v2-dl-4" },
    { c: "005", n: "FIVE",  o: "Espresso blend",          ns: "caramel, dates, dark chocolate", p: "72", id: "v2-dl-5" },
    { c: "006", n: "SIX",   o: "Brazil · decaf",          ns: "milk chocolate, walnut",         p: "64", id: "v2-dl-6", soldOut: true },
  ];
  return (
    <div className="m-frame" style={{ width: DW, minHeight: 2400 }}>
      <MDesktopNav active="Shop" count={2}/>

      {/* Crumb */}
      <div style={{ padding: "20px 56px", borderBottom: "1px solid var(--m-line)" }}>
        <div className="m-meta">Home / <span style={{ color: "var(--m-ink-hi)" }}>Shop</span></div>
      </div>

      {/* Title */}
      <section style={{ padding: "72px 56px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "end" }}>
        <div>
          <div className="m-eyebrow" style={{ marginBottom: 16 }}>Shop · 06 coffees</div>
          <div className="m-display" style={{ fontSize: 80 }}>All coffees</div>
        </div>
        <div className="m-mute" style={{ fontSize: 15.5, lineHeight: 1.65, maxWidth: 460, paddingBottom: 12 }}>
          Single origins and small-batch blends, roasted to order. Filter by ritual and brew method.
        </div>
      </section>

      {/* Toolbar */}
      <div style={{ padding: "48px 56px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--m-line)" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { l: "All", a: true },
            { l: "Single origin" },
            { l: "Blends" },
            { l: "Espresso" },
            { l: "Filter" },
            { l: "Decaf" },
          ].map((c) => (
            <button key={c.l} className="m-chip" data-active={c.a ? "true" : "false"}>{c.l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button style={{ all: "unset", cursor: "pointer", display: "inline-flex", gap: 8, fontSize: 13, color: "var(--m-ink-hi)", padding: "8px 14px", border: "1px solid var(--m-line)" }}>
            <MIcon.filter s={16}/> More filters <span className="m-meta">(2)</span>
          </button>
          <button style={{ all: "unset", cursor: "pointer", display: "inline-flex", gap: 6, fontSize: 13, color: "var(--m-ink-hi)", padding: "8px 14px", border: "1px solid var(--m-line)" }}>
            Sort · Freshest first <MIcon.chev s={14}/>
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 56px 0", display: "flex", justifyContent: "space-between" }}>
        <div className="m-meta">06 results</div>
        <div className="m-meta">Showing 06 of 06</div>
      </div>

      {/* Grid 3-col */}
      <section style={{ padding: "32px 56px 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "60px 32px" }}>
        {products.map((p) => (
          <MProductCard key={p.c} mode="desktop" code={p.c} name={p.n} origin={p.o} notes={p.ns} price={p.p} slotId={p.id} soldOut={p.soldOut} showQuickAdd={p.c === "002"}/>
        ))}
      </section>

      {/* Banner — trust */}
      <section style={{ padding: "120px 56px 0" }}>
        <MTrustRow mode="desktop" items={[
          { t: "Free over 150 zł", s: "Poland · 2-3 days" },
          { t: "Roasted weekly",   s: "Shipped in 72 h" },
          { t: "30-day promise",   s: "Freshness guarantee" },
          { t: "Pay in 3",         s: "Klarna, Przelewy24" },
        ]}/>
      </section>

      <MDesktopFooter/>
    </div>
  );
}

// ============================================================================
// D-3) DESKTOP PDP
// ============================================================================
function MDPDP() {
  const [grind, setGrind] = React.useState("Whole bean");
  const [size, setSize]   = React.useState("250 g");
  const [qty, setQty]     = React.useState(1);
  const grinds = ["Whole bean", "Espresso", "Filter", "Aeropress", "Moka", "French press"];
  const sizes = [["250 g", "84"], ["500 g", "152"], ["1 kg", "276"]];
  const total = sizes.find(s => s[0] === size)[1];

  return (
    <div className="m-frame" style={{ width: DW, minHeight: 3000 }}>
      <MDesktopNav active="Shop" count={2}/>

      {/* Crumb */}
      <div style={{ padding: "20px 56px", borderBottom: "1px solid var(--m-line)" }}>
        <div className="m-meta">Home / Shop / Single origin / <span style={{ color: "var(--m-ink-hi)" }}>ONE</span></div>
      </div>

      {/* Main grid */}
      <section style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", borderBottom: "1px solid var(--m-line)" }}>
        {/* Gallery */}
        <div style={{ padding: "48px 32px 48px 56px", borderRight: "1px solid var(--m-line)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[1,2,3,4].map((i) => (
                <div key={i} style={{ height: 80, background: "var(--m-bg-soft)", border: i === 1 ? "1px solid var(--m-ink-hi)" : "1px solid transparent", overflow: "hidden", cursor: "pointer" }}>
                  <MImg id={`v2-d-pdp-t${i}`} placeholder={`view ${i}`}/>
                </div>
              ))}
            </div>
            <div style={{ height: 720, background: "var(--m-bg-soft)", overflow: "hidden", position: "relative" }}>
              <MImg id="v2-d-pdp-main" placeholder="Bag · Yirgacheffe"/>
              <span style={{ position: "absolute", top: 20, left: 20, padding: "5px 9px", background: "var(--m-bg)", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>Lot 001 · Roasted 11 days ago</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "48px 56px 48px 48px", display: "flex", flexDirection: "column" }}>
          <div className="m-eyebrow">001 · Single origin</div>
          <div className="m-display" style={{ fontSize: 112, marginTop: 16 }}>ONE</div>
          <div style={{ marginTop: 12, fontSize: 17, color: "var(--m-ink)" }}>Ethiopia · Yirgacheffe</div>

          {/* Notes */}
          <div style={{ marginTop: 24, paddingBottom: 24, borderBottom: "1px solid var(--m-line)" }}>
            <div className="m-eyebrow" style={{ marginBottom: 10 }}>Tasting</div>
            <MNotes notes={["cherry", "jasmine", "bergamot", "stone fruit", "honey"]} size={15}/>
          </div>

          {/* Quick specs row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "20px 0", borderBottom: "1px solid var(--m-line)" }}>
            {[
              ["Roast",    "Light"],
              ["Process",  "Washed"],
              ["Altitude", "1,950 m"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="m-meta">{k}</div>
                <div className="m-h3" style={{ fontSize: 18, marginTop: 6 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Variant: grind */}
          <div style={{ marginTop: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="m-eyebrow">01 — Grind</span>
              <span className="m-meta">{grind}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {grinds.map((g) => (
                <button key={g} className="m-chip" data-active={g === grind ? "true" : "false"} onClick={() => setGrind(g)}>{g}</button>
              ))}
            </div>
            <div className="m-meta" style={{ fontSize: 11.5, marginTop: 10 }}>Ground the morning of dispatch — never sooner.</div>
          </div>

          {/* Variant: size */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="m-eyebrow">02 — Size</span>
              <span className="m-meta">{size}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {sizes.map(([s, pr]) => (
                <button key={s} className="m-tile" data-active={s === size ? "true" : "false"} onClick={() => setSize(s)}>
                  <div className="m-h3" style={{ fontSize: 20 }}>{s}</div>
                  <div className="m-mute m-num" style={{ fontSize: 11.5 }}>{pr} zł</div>
                </button>
              ))}
            </div>
          </div>

          {/* Qty + Price + CTA */}
          <div style={{ marginTop: 32, display: "flex", gap: 12, alignItems: "stretch" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--m-line)", height: 60 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={btnReset(44)}><MIcon.minus/></button>
              <span className="m-num" style={{ width: 28, textAlign: "center", fontSize: 14 }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={btnReset(44)}><MIcon.plus/></button>
            </div>
            <button className="m-btn m-btn-primary" style={{ flex: 1, height: 60, justifyContent: "space-between", padding: "0 24px", fontSize: 15 }}>
              <span>Add to basket</span>
              <span className="m-num" style={{ opacity: 0.7 }}>{total} zł</span>
            </button>
            <button className="m-btn m-btn-ghost" style={{ width: 60, padding: 0 }}><MIcon.heart s={18}/></button>
          </div>

          {/* Trust under CTA */}
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Free shipping over 150 zł",
              "Ships within 72 h of roasting",
              "30-day freshness promise",
            ].map((t) => (
              <div key={t} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12.5, color: "var(--m-ink)" }}>
                <MIcon.check s={12}/> {t}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <MStock in_stock count={24}/>
          </div>
        </div>
      </section>

      {/* Profile + brewing */}
      <section style={{ padding: "96px 56px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80 }}>
        <div>
          <div className="m-eyebrow" style={{ marginBottom: 16 }}>— Profile</div>
          <div className="m-h1" style={{ fontSize: 44, marginBottom: 24 }}>From Konga washing station, picked by hand.</div>
          <div className="m-mute" style={{ fontSize: 14.5, lineHeight: 1.7, marginBottom: 32, maxWidth: 540 }}>
            Yirgacheffe is the perfume aisle of coffee — the cup arrives floral first, then opens into stone-fruit sweetness. We roast it light to preserve the tea-like clarity that makes this region famous.
          </div>
          {[
            ["Country",   "Ethiopia"],
            ["Region",    "Yirgacheffe, SNNPR"],
            ["Producer",  "Konga washing station (350+ smallholders)"],
            ["Varietal",  "Heirloom · Kurume, Wolisho"],
            ["Process",   "Fully washed · 36 h fermentation"],
            ["Altitude",  "1,950 – 2,100 m"],
            ["Harvest",   "November 2025 – January 2026"],
            ["Roast",     "Light · developed for filter"],
            ["Roasted",   "08.05.2026 (11 days ago)"],
            ["Best by",   "08.08.2026"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "180px 1fr", padding: "14px 0", borderTop: "1px solid var(--m-line)", alignItems: "baseline" }}>
              <span className="m-meta">{k}</span>
              <span style={{ fontSize: 14, color: "var(--m-ink-hi)" }}>{v}</span>
            </div>
          ))}
        </div>

        <div>
          <div className="m-eyebrow" style={{ marginBottom: 16 }}>— Brewing</div>
          <div className="m-h1" style={{ fontSize: 44, marginBottom: 28 }}>How we brew it.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { m: "V60",       d: "15 g · 250 g · 92 °C · 2:45" },
              { m: "Aeropress", d: "16 g · 220 g · 90 °C · inverted" },
              { m: "Chemex",    d: "30 g · 500 g · 94 °C · 4:00" },
              { m: "Espresso",  d: "18 g in · 38 g out · 28 s" },
            ].map((b) => (
              <div key={b.m} style={{ padding: "22px 20px", border: "1px solid var(--m-line)" }}>
                <div className="m-h3" style={{ fontSize: 20, marginBottom: 8 }}>{b.m}</div>
                <div className="m-num" style={{ fontSize: 12.5, color: "var(--m-mute-2)" }}>{b.d}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, padding: "24px", border: "1px solid var(--m-ink-hi)" }}>
            <div className="m-eyebrow" style={{ marginBottom: 10 }}>Freshness promise</div>
            <div style={{ fontSize: 14.5, color: "var(--m-ink)", lineHeight: 1.55 }}>
              Roasted Wednesdays, shipped within 72 hours. If your bag arrives past its prime, we replace it — no questions, no forms.
            </div>
          </div>
        </div>
      </section>

      {/* Similar coffees */}
      <section style={{ padding: "0 56px 96px" }}>
        <MSectionHead
          eyebrow="If you like ONE"
          title="You may also like"
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
          {[
            { c: "004", n: "FOUR",  o: "Kenya · Nyeri",     ns: "blackcurrant, citrus, malt", p: "92", id: "v2-dp-s1" },
            { c: "002", n: "TWO",   o: "Colombia · Huila",  ns: "cocoa, plum, almond",        p: "76", id: "v2-dp-s2" },
            { c: "007", n: "SEVEN", o: "Ethiopia · Sidamo", ns: "peach, black tea, hibiscus", p: "88", id: "v2-dp-s3" },
          ].map((p) => <MProductCard key={p.c} mode="desktop" {...p} slotId={p.id}/>)}
        </div>
      </section>

      <MDesktopFooter/>
    </div>
  );
}

Object.assign(window, { MDHome, MDListing, MDPDP });
