// AURA v2 — desktop overlays + content: Cart panel, Header detail (mega), Search overlay, About, FAQ.

// ============================================================================
// D-4) DESKTOP CART PANEL (side drawer over PDP)
// ============================================================================
function MDCart() {
  const items = [
    { c: "001", n: "ONE",   v: "Whole bean · 250 g",   p: "84",  q: 1, id: "v2-dc-1" },
    { c: "002", n: "TWO",   v: "Espresso · 500 g",     p: "138", q: 1, id: "v2-dc-2" },
    { c: "005", n: "FIVE",  v: "Espresso · 250 g",     p: "72",  q: 1, id: "v2-dc-3" },
  ];
  const sub = 294;

  return (
    <div className="m-frame" style={{ width: 1440, minHeight: 900, background: "var(--m-bg)" }}>
      {/* Faded PDP backdrop */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }}>
        <MDesktopNav active="Shop" count={3}/>
        <div style={{ padding: "20px 56px", borderBottom: "1px solid var(--m-line)" }}>
          <div className="m-meta">Home / Shop / <span style={{ color: "var(--m-ink-hi)" }}>ONE</span></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--m-line)" }}>
          <div style={{ height: 720, background: "var(--m-bg-soft)" }}/>
          <div style={{ padding: "48px 56px" }}>
            <div className="m-display" style={{ fontSize: 112 }}>ONE</div>
          </div>
        </div>
      </div>
      {/* Dim overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)" }}/>

      {/* Right-side panel */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: 480,
        background: "var(--m-bg)",
        display: "flex", flexDirection: "column",
        boxShadow: "-16px 0 50px rgba(0,0,0,0.15)",
      }}>
        {/* Header */}
        <div style={{ padding: "28px 32px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--m-line)" }}>
          <div>
            <div className="m-h2" style={{ fontSize: 24 }}>Your basket</div>
            <div className="m-meta" style={{ marginTop: 4 }}>3 items · 1.25 kg total</div>
          </div>
          <button style={btnReset(40)}><MIcon.close/></button>
        </div>

        {/* Shipping bar */}
        <div style={{ padding: "20px 32px", background: "var(--m-bg-soft)" }}>
          <MShippingBar current={294} threshold={150}/>
        </div>

        {/* Toast — just-added confirmation */}
        <div style={{ margin: "16px 32px 0", padding: "12px 16px", background: "var(--m-ink-hi)", color: "var(--m-bg)", display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
          <MIcon.check s={14}/>
          <span style={{ flex: 1 }}>Added <strong>FIVE</strong> · Espresso · 250 g</span>
          <button style={{ all: "unset", cursor: "pointer", fontSize: 11, opacity: 0.75, textDecoration: "underline" }}>Undo</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflow: "hidden", padding: "0 32px" }}>
          {items.map((it, i) => (
            <div key={it.c} style={{ display: "flex", gap: 16, padding: "24px 0", borderBottom: i < items.length - 1 ? "1px solid var(--m-line)" : "none" }}>
              <div style={{ width: 96, height: 96, background: "var(--m-bg-soft)", flexShrink: 0, overflow: "hidden" }}>
                <MImg id={it.id} placeholder={it.c}/>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div className="m-h3" style={{ fontSize: 19 }}>{it.n}</div>
                    <div className="m-num" style={{ fontSize: 15, fontWeight: 500 }}>{it.p} zł</div>
                  </div>
                  <div className="m-mute" style={{ fontSize: 12.5, marginTop: 4 }}>{it.v}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--m-line)", height: 32 }}>
                    <button style={btnReset(28)}><MIcon.minus s={12}/></button>
                    <span className="m-num" style={{ width: 24, textAlign: "center", fontSize: 12 }}>{it.q}</span>
                    <button style={btnReset(28)}><MIcon.plus s={12}/></button>
                  </div>
                  <button style={{ all: "unset", cursor: "pointer", fontSize: 11, color: "var(--m-mute-2)", textDecoration: "underline" }}>Remove</button>
                </div>
              </div>
            </div>
          ))}

          {/* Cross-sell */}
          <div style={{ marginTop: 16, paddingTop: 24, borderTop: "1px dashed var(--m-line-2)" }}>
            <div className="m-eyebrow" style={{ marginBottom: 14 }}>Add for 14 zł more — get a free brew guide</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0" }}>
              <div style={{ width: 56, height: 56, background: "var(--m-bg-soft)", overflow: "hidden", flexShrink: 0 }}>
                <MImg id="v2-dc-cross" placeholder="Filter"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: "var(--m-ink-hi)" }}>V60 paper filters</div>
                <div className="m-mute" style={{ fontSize: 12, marginTop: 2 }}>100 pack · 14 zł</div>
              </div>
              <button className="m-btn m-btn-ghost m-btn-sm">Add</button>
            </div>
          </div>
        </div>

        {/* Summary + CTA */}
        <div style={{ borderTop: "1px solid var(--m-line)", padding: "20px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "var(--m-mute-2)" }}>Subtotal</span>
            <span className="m-num" style={{ fontSize: 15 }}>{sub} zł</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <span style={{ fontSize: 13, color: "var(--m-mute-2)" }}>Shipping</span>
            <span style={{ fontSize: 13, color: "var(--m-ok)" }}>Free · InPost</span>
          </div>
          <button className="m-btn m-btn-primary m-btn-lg" style={{ width: "100%", justifyContent: "space-between" }}>
            <span>Checkout</span>
            <span className="m-num" style={{ opacity: 0.8 }}>{sub} zł <MIcon.arrow s={16}/></span>
          </button>
          <button style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: 12.5, color: "var(--m-mute-2)", padding: "10px 0", width: "100%", display: "block" }}>
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// D-5) DESKTOP HEADER · DETAIL with mega-menu open
// ============================================================================
function MDHeaderDetail() {
  return (
    <div className="m-frame" style={{ width: 1440, minHeight: 760 }}>
      {/* Announcement bar */}
      <div style={{ background: "var(--m-ink-hi)", color: "var(--m-bg)", padding: "10px 56px", display: "flex", justifyContent: "space-between", fontSize: 12, letterSpacing: 0 }}>
        <span>Free shipping over 150 zł · Roasted Wednesdays</span>
        <span style={{ display: "flex", gap: 20, color: "var(--m-mute)" }}>
          <span>PL · EN</span>
          <span>Track order</span>
          <span>Account</span>
        </span>
      </div>

      <MDesktopNav active="Shop" count={2}/>

      {/* Mega menu open under Shop */}
      <div style={{ borderBottom: "1px solid var(--m-line)", padding: "48px 56px 56px", display: "grid", gridTemplateColumns: "0.7fr 1fr 1fr 1fr", gap: 56, background: "var(--m-bg)" }}>
        {/* Curated/feature */}
        <div>
          <div className="m-eyebrow" style={{ marginBottom: 18 }}>This week</div>
          <div style={{ height: 240, background: "var(--m-bg-soft)", overflow: "hidden", marginBottom: 16 }}>
            <MImg id="v2-d-mega-hero" placeholder="ONE · feature"/>
          </div>
          <div className="m-h3" style={{ fontSize: 20 }}>ONE — Yirgacheffe</div>
          <div className="m-meta" style={{ marginTop: 4 }}>Light roast · Filter · 84 zł</div>
          <a style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 12.5, color: "var(--m-ink-hi)", borderBottom: "1px solid var(--m-ink-hi)", paddingBottom: 3 }}>
            View product <MIcon.arrow s={14}/>
          </a>
        </div>

        {[
          {
            h: "By roast",
            items: [
              { l: "Light roast", c: "02 coffees" },
              { l: "Medium roast", c: "02 coffees" },
              { l: "Medium-dark", c: "01 coffee" },
              { l: "Dark roast",  c: "01 coffee" },
              { l: "Decaf",       c: "01 coffee" },
            ],
          },
          {
            h: "By brew",
            items: [
              { l: "Espresso", c: "Bold, syrupy" },
              { l: "Filter / Pour-over", c: "Bright, clean" },
              { l: "Aeropress", c: "Versatile" },
              { l: "Moka", c: "Rich, warm" },
              { l: "French press", c: "Full body" },
            ],
          },
          {
            h: "By origin",
            items: [
              { l: "Ethiopia", c: "Yirgacheffe, Sidamo" },
              { l: "Colombia", c: "Huila" },
              { l: "Kenya",    c: "Nyeri" },
              { l: "Brazil",   c: "Rainha · decaf" },
              { l: "House blends", c: "THREE · FIVE" },
            ],
          },
        ].map((col) => (
          <div key={col.h}>
            <div className="m-eyebrow" style={{ marginBottom: 18 }}>{col.h}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {col.items.map((it) => (
                <a key={it.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", textDecoration: "none", color: "inherit" }}>
                  <span style={{ fontSize: 15, color: "var(--m-ink-hi)" }}>{it.l}</span>
                  <span className="m-meta">{it.c}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pretend page content peeking below */}
      <div style={{ padding: "72px 56px 0", opacity: 0.18, pointerEvents: "none" }}>
        <div className="m-display" style={{ fontSize: 72 }}>All coffees</div>
      </div>
    </div>
  );
}

// ============================================================================
// D-6) DESKTOP SEARCH OVERLAY
// ============================================================================
function MDSearch() {
  return (
    <div className="m-frame" style={{ width: 1440, minHeight: 760 }}>
      {/* Faded page behind */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.25, pointerEvents: "none" }}>
        <MDesktopNav active="Shop" count={2}/>
        <div style={{ padding: 56 }}>
          <div className="m-display" style={{ fontSize: 80 }}>All coffees</div>
        </div>
      </div>

      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)" }}/>

      {/* Search panel — top sheet */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "var(--m-bg)", borderBottom: "1px solid var(--m-line)", padding: "32px 56px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "0.4em", paddingLeft: "0.4em", color: "var(--m-ink-hi)" }}>AURA</div>
          <button style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            Close <MIcon.close s={16}/>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px solid var(--m-ink-hi)" }}>
          <MIcon.search s={26}/>
          <input style={{ all: "unset", flex: 1, fontSize: 32, fontWeight: 500, letterSpacing: "-0.025em", color: "var(--m-ink-hi)" }} defaultValue="ethiop"/>
          <span className="m-meta">3 results</span>
        </div>

        {/* Three-col layout */}
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 48 }}>
          {/* Suggestions */}
          <div>
            <div className="m-eyebrow" style={{ marginBottom: 16 }}>Suggested</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {["Ethiopia Yirgacheffe", "Ethiopia Sidamo", "Ethiopia natural", "Light roast", "Filter coffees"].map((s) => (
                <a key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--m-line)", textDecoration: "none", color: "inherit", cursor: "pointer" }}>
                  <span style={{ fontSize: 14, color: "var(--m-ink-hi)" }}>{s}</span>
                  <MIcon.arrow s={14}/>
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div style={{ gridColumn: "span 2" }}>
            <div className="m-eyebrow" style={{ marginBottom: 16 }}>Coffees · 3</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { c: "001", n: "ONE",   o: "Ethiopia · Yirgacheffe", p: "84", id: "v2-ds-1", ns: "cherry, jasmine, bergamot" },
                { c: "007", n: "SEVEN", o: "Ethiopia · Sidamo",      p: "88", id: "v2-ds-2", ns: "peach, black tea, hibiscus" },
                { c: "004", n: "FOUR",  o: "Kenya · Nyeri",          p: "92", id: "v2-ds-3", ns: "blackcurrant, citrus, malt" },
              ].map((p) => (
                <a key={p.c} style={{ display: "flex", gap: 16, padding: "16px", border: "1px solid var(--m-line)", cursor: "pointer", textDecoration: "none", color: "inherit" }}>
                  <div style={{ width: 92, height: 92, background: "var(--m-bg-soft)", flexShrink: 0, overflow: "hidden" }}>
                    <MImg id={p.id} placeholder={p.c}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div className="m-h3" style={{ fontSize: 19 }}>{p.n}</div>
                      <div className="m-num" style={{ fontSize: 14, fontWeight: 500 }}>{p.p} zł</div>
                    </div>
                    <div className="m-mute" style={{ fontSize: 12, marginTop: 4 }}>
                      <span dangerouslySetInnerHTML={{ __html: p.o.replace(/(ethiop)/gi, '<mark style="background:var(--m-ink-hi);color:#fff;padding:0 2px">$1</mark>') }}/>
                    </div>
                    <div style={{ marginTop: 8 }}><MNotes notes={p.ns.split(", ")} size={11.5}/></div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// D-7) DESKTOP ABOUT
// ============================================================================
function MDAbout() {
  return (
    <div className="m-frame" style={{ width: 1440, minHeight: 3600 }}>
      <MDesktopNav active="About" count={2}/>

      {/* Editorial hero */}
      <section style={{ padding: "120px 56px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "end" }}>
        <div>
          <div className="m-eyebrow" style={{ marginBottom: 24 }}>— About Aura</div>
          <div className="m-display" style={{ fontSize: 96 }}>
            Six lots.<br/>One small<br/>roastery.
          </div>
        </div>
        <div className="m-mute" style={{ fontSize: 17, lineHeight: 1.65, maxWidth: 480, paddingBottom: 12 }}>
          Aura is a two-person studio in Warsaw. We roast speciality coffee on a 5 kg drum every Wednesday and ship before Friday. Nothing is older than a week when it leaves us — because nothing should be.
        </div>
      </section>

      {/* Full-bleed image */}
      <div style={{ height: 720, background: "var(--m-bg-soft)", overflow: "hidden" }}>
        <MImg id="v2-d-about-hero" placeholder="Roastery interior"/>
      </div>

      {/* Long-form story */}
      <section style={{ padding: "120px 56px", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80 }}>
        <div>
          <div className="m-eyebrow">— The story</div>
        </div>
        <div style={{ maxWidth: 720 }}>
          <div style={{ fontSize: 26, lineHeight: 1.4, color: "var(--m-ink-hi)", marginBottom: 32, letterSpacing: "-0.012em" }}>
            We started Aura in 2024 because we wanted the coffee we drink at home to taste like the cups we'd been making for years behind a bar.
          </div>
          <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--m-ink)", display: "flex", flexDirection: "column", gap: 22 }}>
            <p style={{ margin: 0 }}>Most coffee on Polish supermarket shelves is two months old by the time it hits espresso. We thought we could do better — at a small scale, where every bag is traceable to a Wednesday and a name.</p>
            <p style={{ margin: 0 }}>Six lots is the right number for us. Enough variety to taste the world. Few enough that we know every grower personally, and roast each profile until it sings.</p>
            <p style={{ margin: 0 }}>Aura is not a coffee company. It's a roastery — one drum, two people, and a list of farmers we visit every harvest.</p>
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <section style={{ padding: "0 56px 120px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderTop: "1px solid var(--m-ink-hi)", borderBottom: "1px solid var(--m-ink-hi)" }}>
        {[
          { n: "06", l: "Active lots" },
          { n: "72h", l: "From roast to dispatch" },
          { n: "5 kg", l: "Drum capacity" },
          { n: "2024", l: "Roasting since" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "56px 32px", borderLeft: i > 0 ? "1px solid var(--m-line)" : "none" }}>
            <div className="m-display m-num" style={{ fontSize: 80 }}>{s.n}</div>
            <div className="m-meta" style={{ marginTop: 12 }}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* People */}
      <section style={{ padding: "120px 56px" }}>
        <MSectionHead
          eyebrow="The two of us"
          title="A roastery is its people."
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          {[
            { n: "Marta",  r: "Head roaster · founder", b: "Behind the drum every Wednesday since day one. Previously head barista at Coffeedesk and a Q-grader since 2019.", id: "v2-d-about-p1" },
            { n: "Tomasz", r: "Sourcing · founder",     b: "Visits every farm we buy from. Writes our origin reports and edits the journal. Believes a good cup is paid for at origin, not at retail.", id: "v2-d-about-p2" },
          ].map((p) => (
            <div key={p.n}>
              <div style={{ height: 480, background: "var(--m-bg-soft)", overflow: "hidden" }}>
                <MImg id={p.id} placeholder={p.n}/>
              </div>
              <div style={{ marginTop: 24 }}>
                <div className="m-h2" style={{ fontSize: 32 }}>{p.n}</div>
                <div className="m-meta" style={{ marginTop: 6 }}>{p.r}</div>
                <div className="m-mute" style={{ fontSize: 14.5, lineHeight: 1.65, marginTop: 16, maxWidth: 480 }}>{p.b}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visit */}
      <section style={{ padding: "0 56px 120px" }}>
        <div style={{ background: "var(--m-bg-soft)", padding: "80px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="m-eyebrow" style={{ marginBottom: 18 }}>— Visit</div>
            <div className="m-h1" style={{ fontSize: 56 }}>Come to the roastery.</div>
            <div className="m-mute" style={{ fontSize: 15.5, lineHeight: 1.65, marginTop: 22, maxWidth: 440 }}>
              Open Wednesday-Saturday, 10:00 – 17:00. Walk in, taste what's on the cupping table, take home a bag you watched come out of the drum.
            </div>
            <div className="m-num" style={{ fontSize: 14, marginTop: 28, color: "var(--m-ink-hi)", letterSpacing: 0 }}>
              ul. Targowa 22 · 03-734 Warsaw
            </div>
            <button className="m-btn m-btn-secondary" style={{ marginTop: 28 }}>Get directions <MIcon.arrow s={16}/></button>
          </div>
          <div style={{ height: 400, background: "var(--m-bg)", overflow: "hidden" }}>
            <MImg id="v2-d-about-map" placeholder="Map · roastery"/>
          </div>
        </div>
      </section>

      <MDesktopFooter/>
    </div>
  );
}

// ============================================================================
// D-8) DESKTOP FAQ / SHIPPING / RETURNS
// ============================================================================
function MDFAQ() {
  const Acc = ({ q, a, open = false }) => (
    <details open={open} style={{ borderTop: "1px solid var(--m-line)" }}>
      <summary style={{ listStyle: "none", padding: "26px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, cursor: "pointer" }}>
        <span style={{ fontSize: 17, color: "var(--m-ink-hi)", fontWeight: 500, lineHeight: 1.4, flex: 1, maxWidth: 720 }}>{q}</span>
        <span style={{ width: 16, height: 16, position: "relative", flexShrink: 0, marginTop: 4 }}>
          <span style={{ position: "absolute", top: 7, left: 0, right: 0, height: 1, background: "var(--m-ink-hi)" }}/>
          {!open && <span style={{ position: "absolute", left: 7, top: 0, bottom: 0, width: 1, background: "var(--m-ink-hi)" }}/>}
        </span>
      </summary>
      <div style={{ fontSize: 15, color: "var(--m-mute-2)", lineHeight: 1.7, paddingBottom: 28, maxWidth: 760 }}>{a}</div>
    </details>
  );

  return (
    <div className="m-frame" style={{ width: 1440, minHeight: 2800 }}>
      <MDesktopNav active="Brewing" count={2}/>

      {/* Hero */}
      <section style={{ padding: "120px 56px 80px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "end" }}>
        <div>
          <div className="m-eyebrow" style={{ marginBottom: 22 }}>— Help</div>
          <div className="m-display" style={{ fontSize: 88 }}>Shipping, returns,<br/>and the small print.</div>
        </div>
        <div style={{ paddingBottom: 12 }}>
          <div className="m-mute" style={{ fontSize: 15.5, lineHeight: 1.65, marginBottom: 24 }}>
            Everything you might need to know. If you can't find your answer, we answer emails within a working day.
          </div>
          <button className="m-btn m-btn-secondary">Email us <MIcon.arrow s={16}/></button>
        </div>
      </section>

      {/* Quick stats row */}
      <section style={{ padding: "0 56px 96px" }}>
        <MTrustRow mode="desktop" items={[
          { t: "Free over 150 zł",   s: "Poland · InPost · 2-3 days" },
          { t: "Shipped in 72 h",   s: "From roast date" },
          { t: "30-day return",     s: "Unopened bags · full refund" },
          { t: "Klarna · Pay in 3", s: "0% interest, in-cart" },
        ]}/>
      </section>

      {/* Two-col layout: sidebar + accordions */}
      <section style={{ padding: "0 56px 120px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 80 }}>
        <aside style={{ position: "sticky", top: 24 }}>
          <div className="m-eyebrow" style={{ marginBottom: 18 }}>Topics</div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { l: "Shipping", a: true, c: "03" },
              { l: "Returns",          c: "02" },
              { l: "Freshness",        c: "02" },
              { l: "Payments",         c: "02" },
              { l: "Account",          c: "02" },
              { l: "Wholesale",        c: "01" },
            ].map((t) => (
              <a key={t.l} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0",
                fontSize: 14, color: t.a ? "var(--m-ink-hi)" : "var(--m-mute-2)",
                borderBottom: "1px solid " + (t.a ? "var(--m-ink-hi)" : "transparent"),
                cursor: "pointer", textDecoration: "none",
              }}>
                <span style={{ fontWeight: t.a ? 500 : 400 }}>{t.l}</span>
                <span className="m-meta">{t.c}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div>
          {/* Shipping */}
          <div className="m-eyebrow" style={{ marginBottom: 18 }}>01 — Shipping</div>
          <Acc open q="When will my order ship?" a="We roast on Wednesdays and ship within 72 hours. Order before noon on Wednesday for same-week dispatch — anything later ships the following Wednesday." />
          <Acc q="How much does delivery cost?" a="Poland: free over 150 zł, otherwise 14 zł (InPost paczkomat) or 18 zł (courier). EU: 28 zł, 4–6 business days. UK & non-EU: contact us for a quote." />
          <Acc q="Can I track my parcel?" a="Yes — we send the tracking number by email the moment the courier picks the parcel up." />

          {/* Returns */}
          <div className="m-eyebrow" style={{ marginTop: 56, marginBottom: 18 }}>02 — Returns</div>
          <Acc q="Can I return coffee?" a="Yes. Unopened bags within 30 days for a full refund. For opened bags, if you're not satisfied, write us at hello@aura.coffee and we'll make it right." />
          <Acc q="What if my coffee arrives stale?" a="That shouldn't happen — but if it does, we replace your bag, no questions asked. Just send us a photo of the bag with the roast date visible." />

          {/* Freshness */}
          <div className="m-eyebrow" style={{ marginTop: 56, marginBottom: 18 }}>03 — Freshness</div>
          <Acc q="When is coffee 'fresh'?" a="Speciality coffee is at its best between 7–30 days after roasting. We ship within 72 hours of roasting, so you have the full window to enjoy it." />
          <Acc q="How should I store it?" a="In the original valve bag, sealed, at room temperature. Avoid the fridge. Decant into glass only after opening, and only if you'll finish it in a week." />
        </div>
      </section>

      <MDesktopFooter/>
    </div>
  );
}

Object.assign(window, { MDCart, MDHeaderDetail, MDSearch, MDAbout, MDFAQ });
