// Aura — mobile screens.
// 390 wide. Heights vary by content. Each screen is a self-contained frame.

const AURA_W = 390;

// ============================================================================
// 1) MOBILE HOMEPAGE
// ============================================================================
function AuMobileHome() {
  return (
    <div className="au-frame" style={{ width: AURA_W, height: 2280 }}>
      <AuStatusBar />
      <AuMobileNav count={0} />

      {/* HERO ------------------------------------------------------------- */}
      <div style={{ position: "relative", height: 560, margin: "0 16px 0", overflow: "hidden", borderRadius: 4 }}>
        <AuImg id="m-home-hero" w="100%" h="100%" radius={4} placeholder="Hero · pouring / steam / hand" />
        <span className="au-mono-up" style={{ position: "absolute", top: 14, left: 14, color: "var(--au-cream-50)", fontSize: 10, mixBlendMode: "difference" }}>Lot 04 · 2026</span>
        <span className="au-mono-up" style={{ position: "absolute", top: 14, right: 14, color: "var(--au-cream-50)", fontSize: 10, mixBlendMode: "difference" }}>Roasted weekly</span>
        <div style={{ position: "absolute", bottom: 18, left: 18, right: 18, color: "var(--au-cream-50)" }}>
          <div className="au-mono-up" style={{ fontSize: 10.5, opacity: 0.9, marginBottom: 8 }}>This season</div>
          <div className="au-serif" style={{ fontSize: 42, lineHeight: 0.95, letterSpacing: "-0.025em" }}>
            Slow mornings,<br/><em className="au-serif-it">brighter</em> cups.
          </div>
        </div>
      </div>

      {/* INTRO ------------------------------------------------------------ */}
      <div style={{ padding: "40px 24px 36px" }}>
        <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)", marginBottom: 14 }}>— Five lots, hand-picked</div>
        <div className="au-serif" style={{ fontSize: 30, lineHeight: 1.1, color: "var(--au-ink-900)" }}>
          Coffee with a quiet kind of clarity. Roasted weekly in Warsaw, never older than ten days when it leaves us.
        </div>
        <a className="au-mono-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 22, fontSize: 11, color: "var(--au-ink-900)", borderBottom: "1px solid var(--au-ink-900)", paddingBottom: 4, textDecoration: "none", cursor: "pointer" }}>
          Browse the shop <AuIcon.arrow s={14}/>
        </a>
      </div>

      {/* THIS WEEK STRIP -------------------------------------------------- */}
      <div style={{ padding: "0 24px 12px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)" }}>This week's pick</div>
        <a className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-ink-900)", textDecoration: "none", cursor: "pointer" }}>All →</a>
      </div>

      <div style={{ padding: "0 16px", display: "flex", gap: 12, overflowX: "hidden" }}>
        {[
          { c: "002", n: "TWO", o: "Colombia · Huila", p: "76", ns: "cocoa, plum, almond", id: "m-home-p1" },
          { c: "001", n: "ONE", o: "Ethiopia · Yirgacheffe", p: "84", ns: "cherry, jasmine, bergamot", id: "m-home-p2" },
        ].map((p) => (
          <div key={p.c} style={{ flex: "0 0 240px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: "var(--au-cream-200)", height: 280, borderRadius: 4, position: "relative", overflow: "hidden" }}>
              <AuImg id={p.id} w="100%" h="100%" radius={4} placeholder={`Lot ${p.c}`}/>
              <span className="au-mono-up" style={{ position: "absolute", top: 10, left: 10, fontSize: 9, color: "var(--au-ink-900)", background: "var(--au-cream-50)", padding: "3px 6px", borderRadius: 2 }}>{p.c}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div className="au-serif" style={{ fontSize: 22 }}>{p.n}</div>
              <div className="au-mono" style={{ fontSize: 12 }}>{p.p} zł</div>
            </div>
            <div className="au-mono" style={{ fontSize: 10, color: "var(--au-stone-500)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: -6 }}>{p.o}</div>
            <div className="au-serif-it" style={{ fontSize: 13, color: "var(--au-ink-700)" }}>{p.ns}</div>
          </div>
        ))}
      </div>

      {/* BREW METHOD SHORTCUTS ------------------------------------------- */}
      <div style={{ marginTop: 56, padding: "0 24px" }}>
        <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)", marginBottom: 14 }}>Shop by ritual</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { l: "Espresso", s: "Bold, syrupy" },
            { l: "Filter", s: "Bright, clean" },
            { l: "Moka", s: "Rich, warm" },
          ].map((m) => (
            <div key={m.l} style={{
              padding: "18px 12px",
              border: "1px solid var(--au-cream-300)",
              borderRadius: 4,
              minHeight: 96,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div className="au-serif" style={{ fontSize: 19 }}>{m.l}</div>
              <div className="au-mono" style={{ fontSize: 9.5, color: "var(--au-stone-500)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{m.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* STORY ----------------------------------------------------------- */}
      <div style={{ marginTop: 56, padding: "0 16px" }}>
        <div style={{ height: 280, background: "var(--au-cream-200)", borderRadius: 4, overflow: "hidden" }}>
          <AuImg id="m-home-story" w="100%" h="100%" radius={4} placeholder="Roastery / farmer lifestyle" />
        </div>
        <div style={{ padding: "20px 8px 0" }}>
          <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)", marginBottom: 8 }}>Origin</div>
          <div className="au-serif" style={{ fontSize: 28, lineHeight: 1.1, marginBottom: 10 }}>
            We know every grower by name.
          </div>
          <div style={{ fontSize: 13.5, color: "var(--au-ink-700)", lineHeight: 1.55, marginBottom: 16 }}>
            Six farms, three continents, one rule — pay above market and visit every harvest. The cups are the receipt.
          </div>
          <a className="au-mono-up" style={{ fontSize: 11, color: "var(--au-ink-900)", borderBottom: "1px solid var(--au-ink-900)", paddingBottom: 3, cursor: "pointer", textDecoration: "none" }}>
            Read the journal →
          </a>
        </div>
      </div>

      {/* TRUST SIGNALS --------------------------------------------------- */}
      <div style={{ marginTop: 56, padding: "20px 24px", borderTop: "1px solid var(--au-cream-300)", borderBottom: "1px solid var(--au-cream-300)", display: "flex", justifyContent: "space-between" }}>
        {["Roasted to order", "Free over 150 zł", "Pay in 3"].map((t) => (
          <div key={t} className="au-mono-up" style={{ fontSize: 9.5, color: "var(--au-stone-500)" }}>{t}</div>
        ))}
      </div>

      {/* FOOTER ---------------------------------------------------------- */}
      <div style={{ padding: "36px 24px 24px" }}>
        <div className="au-serif" style={{ fontSize: 28, letterSpacing: "0.32em", paddingLeft: "0.32em" }}>AURA</div>
        <div className="au-mono" style={{ fontSize: 10.5, color: "var(--au-stone-500)", marginTop: 6, letterSpacing: "0.08em" }}>Roasted in Warsaw · est. 2024</div>
      </div>
    </div>
  );
}

// ============================================================================
// 2) MOBILE PRODUCT LISTING
// ============================================================================
function AuMobileListing() {
  const products = [
    { c: "001", n: "ONE",   o: "Ethiopia · Yirgacheffe", ns: "cherry, jasmine, bergamot", p: "84", id: "m-list-1" },
    { c: "002", n: "TWO",   o: "Colombia · Huila",        ns: "cocoa, plum, almond",       p: "76", id: "m-list-2" },
    { c: "003", n: "THREE", o: "House blend",             ns: "hazelnut, brown sugar, fig",p: "68", id: "m-list-3" },
    { c: "004", n: "FOUR",  o: "Kenya · Nyeri",           ns: "blackcurrant, citrus, malt",p: "92", id: "m-list-4" },
    { c: "005", n: "FIVE",  o: "Espresso blend",          ns: "caramel, dates, dark choc.",p: "72", id: "m-list-5" },
    { c: "006", n: "SIX",   o: "Brazil · decaf",          ns: "milk chocolate, walnut",    p: "64", id: "m-list-6" },
  ];
  return (
    <div className="au-frame" style={{ width: AURA_W, height: 1480 }}>
      <AuStatusBar />
      <AuMobileNav count={0} />

      {/* Header */}
      <div style={{ padding: "16px 24px 18px" }}>
        <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)", marginBottom: 10 }}>The shop · 06 lots</div>
        <div className="au-serif" style={{ fontSize: 40, lineHeight: 1, letterSpacing: "-0.02em" }}>
          A small,<br/><em className="au-serif-it">considered</em> shelf.
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ padding: "6px 16px 0", display: "flex", gap: 6, overflowX: "hidden" }}>
        {[
          { l: "All", a: true },
          { l: "Espresso" },
          { l: "Filter" },
          { l: "Single origin" },
          { l: "Decaf" },
        ].map((c) => (
          <button key={c.l} className="au-chip" data-active={c.a ? "true" : "false"} style={{ flex: "0 0 auto" }}>{c.l}</button>
        ))}
      </div>

      {/* Sort row */}
      <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)" }}>6 results</div>
        <button style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span className="au-mono-up" style={{ fontSize: 10, color: "var(--au-ink-900)" }}>Sort · roast date</span>
          <AuIcon.drop s={12}/>
        </button>
      </div>

      {/* Grid */}
      <div style={{ padding: "0 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px 12px" }}>
        {products.map((p) => (
          <AuProductCard key={p.c} code={p.c} name={p.n} origin={p.o} notes={p.ns} price={p.p} slotId={p.id} />
        ))}
      </div>

      <div style={{ padding: "40px 24px 24px", textAlign: "center" }}>
        <button className="au-btn au-btn-ghost" style={{ width: "100%" }}>Load older lots</button>
      </div>
    </div>
  );
}

// ============================================================================
// 3) MOBILE PRODUCT DETAIL (PDP)
// ============================================================================
function AuMobilePDP() {
  const [variantGrind, setVariantGrind] = React.useState("Whole bean");
  const [variantSize, setVariantSize] = React.useState("250 g");
  const grinds = ["Whole bean", "Espresso", "Filter", "Moka", "French press"];
  const sizes  = ["250 g", "500 g", "1 kg"];

  return (
    <div className="au-frame" style={{ width: AURA_W, height: 1820 }}>
      <AuStatusBar />
      <AuMobileNav showBack count={0} title="ONE" />

      {/* Image */}
      <div style={{ position: "relative", height: 460, margin: "0 16px", background: "var(--au-cream-200)", borderRadius: 4, overflow: "hidden" }}>
        <AuImg id="m-pdp-hero" w="100%" h="100%" radius={4} placeholder="Bag · Yirgacheffe" />
        <span className="au-mono-up" style={{ position: "absolute", top: 14, left: 14, fontSize: 9.5, background: "var(--au-cream-50)", padding: "5px 8px", borderRadius: 2 }}>Lot 001 · 2026</span>
        <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
          {[0,1,2,3].map((i) => (
            <span key={i} style={{ width: i === 0 ? 18 : 5, height: 5, borderRadius: 2, background: i === 0 ? "var(--au-ink-900)" : "var(--au-cream-50)", opacity: i === 0 ? 1 : 0.7 }}/>
          ))}
        </div>
      </div>

      {/* Title block */}
      <div style={{ padding: "28px 24px 0" }}>
        <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)" }}>001 · Ethiopia · Yirgacheffe</div>
        <div className="au-serif" style={{ fontSize: 56, lineHeight: 0.95, marginTop: 8, letterSpacing: "-0.025em" }}>ONE</div>
        <div className="au-serif-it" style={{ fontSize: 18, lineHeight: 1.25, color: "var(--au-ink-700)", marginTop: 10 }}>
          A bright, tea-like cup with cherry and bergamot on the finish.
        </div>

        <div style={{ marginTop: 18 }}>
          <AuNotes notes={["cherry", "jasmine", "bergamot", "stone fruit"]}/>
        </div>

        {/* Price */}
        <div style={{ marginTop: 24, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div>
            <span className="au-serif" style={{ fontSize: 36, lineHeight: 1 }}>84 zł</span>
            <span className="au-mono" style={{ fontSize: 12, color: "var(--au-stone-500)", marginLeft: 10, letterSpacing: "0.08em" }}>/ 250 g</span>
          </div>
          <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-moss)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--au-moss)" }}/> In stock
          </div>
        </div>
      </div>

      {/* Variant: grind */}
      <div style={{ padding: "32px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)" }}>01 · Grind</div>
          <div className="au-mono" style={{ fontSize: 11, color: "var(--au-ink-900)" }}>{variantGrind}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {grinds.map((g) => (
            <button key={g} className="au-chip" data-active={g === variantGrind ? "true" : "false"} onClick={() => setVariantGrind(g)}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Variant: size */}
      <div style={{ padding: "24px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)" }}>02 · Size</div>
          <div className="au-mono" style={{ fontSize: 11, color: "var(--au-ink-900)" }}>{variantSize}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {sizes.map((s) => (
            <button key={s} onClick={() => setVariantSize(s)} style={{
              all: "unset", cursor: "pointer", textAlign: "center",
              padding: "16px 8px",
              border: "1px solid " + (s === variantSize ? "var(--au-ink-900)" : "var(--au-cream-300)"),
              background: s === variantSize ? "var(--au-cream-50)" : "transparent",
              borderRadius: 4,
              display: "flex", flexDirection: "column", gap: 4, alignItems: "center",
            }}>
              <div className="au-serif" style={{ fontSize: 22 }}>{s.split(" ")[0]}</div>
              <div className="au-mono-up" style={{ fontSize: 9.5, color: "var(--au-stone-500)" }}>{s.split(" ")[1]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Brew tip */}
      <div style={{ margin: "28px 24px 0", padding: "16px 16px", background: "var(--au-cream-200)", borderRadius: 4, display: "flex", alignItems: "flex-start", gap: 12 }}>
        <AuIcon.drop s={16}/>
        <div style={{ flex: 1 }}>
          <div className="au-mono-up" style={{ fontSize: 9.5, color: "var(--au-stone-500)", marginBottom: 4 }}>Brewer's note</div>
          <div className="au-serif-it" style={{ fontSize: 15, lineHeight: 1.3, color: "var(--au-ink-900)" }}>
            Best as a pour-over · 15 g coffee · 250 g water · 92 °C.
          </div>
        </div>
      </div>

      {/* Specs */}
      <div style={{ padding: "36px 24px 0" }}>
        <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)", marginBottom: 14 }}>Profile</div>
        {[
          ["Origin",     "Yirgacheffe, Ethiopia"],
          ["Producer",   "Konga washing station"],
          ["Altitude",   "1,950 – 2,100 m"],
          ["Process",    "Washed"],
          ["Varietal",   "Heirloom"],
          ["Roast",      "Light · Filter"],
          ["Roasted",    "11 days ago · 08.05.2026"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderTop: "1px solid var(--au-cream-300)" }}>
            <span className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)" }}>{k}</span>
            <span style={{ fontSize: 13, color: "var(--au-ink-900)" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Freshness banner */}
      <div style={{ margin: "32px 24px 0", padding: "18px 18px", border: "1px solid var(--au-cream-300)", borderRadius: 4 }}>
        <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-ember)", marginBottom: 8 }}>Freshness promise</div>
        <div style={{ fontSize: 13.5, color: "var(--au-ink-700)", lineHeight: 1.5 }}>
          Roasted Wednesdays. Orders before noon ship same day, leaving the roastery within 72 h of roasting. 30-day return on unopened bags.
        </div>
      </div>

      <div style={{ height: 110 }}/>

      {/* STICKY ADD TO CART --------------------------------------------- */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "14px 16px 22px",
        background: "var(--au-cream-50)",
        borderTop: "1px solid var(--au-cream-300)",
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 -8px 24px -12px oklch(0.20 0.01 50 / 0.10)",
      }}>
        {/* Qty stepper */}
        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--au-cream-300)", borderRadius: 4, height: 48 }}>
          <button style={{ all: "unset", cursor: "pointer", width: 40, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}><AuIcon.minus/></button>
          <span className="au-mono" style={{ width: 28, textAlign: "center", fontSize: 14 }}>1</span>
          <button style={{ all: "unset", cursor: "pointer", width: 40, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}><AuIcon.plus/></button>
        </div>
        <button className="au-btn au-btn-primary" style={{ flex: 1, height: 48, justifyContent: "space-between", padding: "0 18px" }}>
          <span>Add to basket</span>
          <span className="au-mono" style={{ opacity: 0.7 }}>84 zł</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 4) MOBILE CART DRAWER
// ============================================================================
function AuMobileCart() {
  const items = [
    { c: "001", n: "ONE",   v: "Whole bean · 250 g", p: "84", id: "m-cart-1" },
    { c: "002", n: "TWO",   v: "Espresso grind · 500 g", p: "138", id: "m-cart-2" },
    { c: "005", n: "FIVE",  v: "Espresso blend · 250 g", p: "72", id: "m-cart-3" },
  ];
  const sub = 294;
  return (
    <div className="au-frame" style={{ width: AURA_W, height: 844 }}>
      {/* PDP backdrop (blurred / darkened) */}
      <div style={{ position: "absolute", inset: 0, background: "var(--au-ink-900)", opacity: 1 }}>
        <div style={{ position: "absolute", inset: 0, background: "var(--au-cream-100)", opacity: 0.05 }}/>
      </div>
      {/* Faint ghost of PDP for context */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.18, pointerEvents: "none" }}>
        <AuStatusBar tone="light"/>
        <AuMobileNav tone="light" count={3}/>
        <div style={{ margin: "0 16px", height: 360, background: "var(--au-cream-200)", borderRadius: 4 }}/>
        <div style={{ padding: "24px" }}>
          <div className="au-mono-up" style={{ color: "var(--au-cream-50)", fontSize: 10 }}>001 · Ethiopia</div>
          <div className="au-serif" style={{ color: "var(--au-cream-50)", fontSize: 48, lineHeight: 1 }}>ONE</div>
        </div>
      </div>

      {/* DRAWER ---------------------------------------------------------- */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        background: "var(--au-cream-50)",
        borderTopLeftRadius: 16, borderTopRightRadius: 16,
        padding: "10px 0 24px",
        height: 720,
        boxShadow: "0 -20px 50px -10px oklch(0.10 0 0 / 0.4)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "6px 0 14px" }}>
          <span style={{ width: 40, height: 4, borderRadius: 2, background: "var(--au-cream-300)" }}/>
        </div>

        {/* Header */}
        <div style={{ padding: "0 24px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="au-serif" style={{ fontSize: 28, lineHeight: 1 }}>Basket</div>
            <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)", marginTop: 6 }}>03 items · 1.25 kg</div>
          </div>
          <button style={{ all: "unset", cursor: "pointer", padding: 6, color: "var(--au-ink-900)" }}><AuIcon.close/></button>
        </div>

        {/* Free shipping progress */}
        <div style={{ margin: "8px 24px 14px", padding: "14px 16px", background: "var(--au-cream-200)", borderRadius: 4 }}>
          <div style={{ fontSize: 12, color: "var(--au-ink-700)", marginBottom: 8 }}>
            <strong style={{ color: "var(--au-ink-900)" }}>Free shipping</strong> unlocked at 150 zł — you've earned it.
          </div>
          <div style={{ height: 3, background: "var(--au-cream-300)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: "var(--au-ember)" }}/>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflow: "hidden", padding: "0 24px" }}>
          {items.map((it, i) => (
            <div key={it.c} style={{ display: "flex", gap: 12, padding: "16px 0", borderTop: i === 0 ? "none" : "1px solid var(--au-cream-300)" }}>
              <div style={{ width: 76, height: 76, background: "var(--au-cream-200)", borderRadius: 4, flexShrink: 0, overflow: "hidden", position: "relative" }}>
                <AuImg id={it.id} w="100%" h="100%" radius={4} placeholder={it.c}/>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div className="au-serif" style={{ fontSize: 19 }}>{it.n}</div>
                    <div className="au-mono" style={{ fontSize: 13 }}>{it.p} zł</div>
                  </div>
                  <div className="au-mono" style={{ fontSize: 10, color: "var(--au-stone-500)", letterSpacing: "0.08em", marginTop: 2 }}>{it.v}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--au-cream-300)", borderRadius: 4 }}>
                    <button style={{ all: "unset", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><AuIcon.minus s={12}/></button>
                    <span className="au-mono" style={{ width: 20, textAlign: "center", fontSize: 12 }}>1</span>
                    <button style={{ all: "unset", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><AuIcon.plus s={12}/></button>
                  </div>
                  <button className="au-mono-up" style={{ all: "unset", cursor: "pointer", fontSize: 10, color: "var(--au-stone-500)", textDecoration: "underline" }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subtotal */}
        <div style={{ padding: "16px 24px 12px", borderTop: "1px solid var(--au-cream-300)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)" }}>Subtotal</span>
            <span className="au-mono" style={{ fontSize: 14, color: "var(--au-ink-900)" }}>{sub} zł</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)" }}>Shipping</span>
            <span className="au-mono" style={{ fontSize: 12, color: "var(--au-moss)" }}>Free</span>
          </div>
        </div>

        {/* Checkout button */}
        <div style={{ padding: "8px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="au-btn au-btn-primary" style={{ width: "100%", height: 52, justifyContent: "space-between", padding: "0 20px" }}>
            <span>Checkout</span>
            <span className="au-mono" style={{ opacity: 0.7 }}>{sub} zł →</span>
          </button>
          <button className="au-mono-up" style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: 11, color: "var(--au-stone-500)", padding: "8px" }}>
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AuMobileHome, AuMobileListing, AuMobilePDP, AuMobileCart });
