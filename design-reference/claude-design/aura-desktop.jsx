// Aura — desktop screens (1440 wide).
// Editorial, asymmetric, magazine-rooted. Not a typical Shopify grid.

const AURA_DW = 1440;

// ============================================================================
// 5) DESKTOP HOMEPAGE
// ============================================================================
function AuDesktopHome() {
  return (
    <div className="au-frame" style={{ width: AURA_DW, height: 3080 }}>
      <AuDesktopNav active="Shop" count={2} />

      {/* HERO — asymmetric split ---------------------------------------- */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 720, borderBottom: "1px solid var(--au-cream-300)" }}>
        <div style={{ background: "var(--au-cream-200)", position: "relative", overflow: "hidden" }}>
          <AuImg id="d-home-hero" w="100%" h="100%" radius={0} placeholder="Hero · pour-over moment" />
          <div style={{ position: "absolute", top: 30, left: 30, right: 30, display: "flex", justifyContent: "space-between", color: "var(--au-cream-50)", mixBlendMode: "difference" }}>
            <span className="au-mono-up" style={{ fontSize: 11 }}>Lot 04 · 2026</span>
            <span className="au-mono-up" style={{ fontSize: 11 }}>Roasted 11.05 — 17.05</span>
          </div>
        </div>
        <div style={{ padding: "120px 96px 80px 88px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)", marginBottom: 28 }}>— Five lots · Spring season</div>
            <div className="au-serif" style={{ fontSize: 88, lineHeight: 0.92, letterSpacing: "-0.025em", color: "var(--au-ink-900)" }}>
              Slow mornings,<br/>
              <em className="au-serif-it">brighter</em> cups.
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.55, color: "var(--au-ink-700)", marginTop: 36, maxWidth: 460 }}>
              Speciality coffee, roasted by hand each Wednesday in Warsaw. Six farms, three continents, one small shelf — chosen the way you'd choose a record.
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 48 }}>
            <button className="au-btn au-btn-primary" style={{ padding: "16px 22px" }}>
              Shop the season <AuIcon.arrow s={16}/>
            </button>
            <button className="au-btn au-btn-ghost" style={{ padding: "16px 22px" }}>
              Try the tasting set
            </button>
          </div>
        </div>
      </div>

      {/* THE SHELF -------------------------------------------------------- */}
      <div style={{ padding: "112px 64px 24px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)", marginBottom: 16 }}>— The shelf</div>
          <div className="au-serif" style={{ fontSize: 56, lineHeight: 1, letterSpacing: "-0.02em" }}>
            Five lots, hand-picked.
          </div>
        </div>
        <a className="au-mono-up" style={{ fontSize: 12, color: "var(--au-ink-900)", borderBottom: "1px solid var(--au-ink-900)", paddingBottom: 4, cursor: "pointer", textDecoration: "none" }}>
          View all coffees →
        </a>
      </div>

      <div style={{ padding: "48px 64px 96px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "28px 32px" }}>
        {[
          { c: "001", n: "ONE",   o: "Ethiopia · Yirgacheffe", ns: "cherry, jasmine, bergamot", p: "84", id: "d-home-p1" },
          { c: "002", n: "TWO",   o: "Colombia · Huila",       ns: "cocoa, plum, almond",       p: "76", id: "d-home-p2" },
          { c: "003", n: "THREE", o: "House blend",            ns: "hazelnut, brown sugar, fig",p: "68", id: "d-home-p3" },
        ].map((p) => (
          <AuProductCard key={p.c} mode="desktop" code={p.c} name={p.n} origin={p.o} notes={p.ns} price={p.p} slotId={p.id} />
        ))}
      </div>

      {/* PULL QUOTE / EDITORIAL ------------------------------------------ */}
      <div style={{ padding: "64px 64px 96px", borderTop: "1px solid var(--au-cream-300)", borderBottom: "1px solid var(--au-cream-300)", background: "var(--au-cream-200)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 0", textAlign: "center" }}>
          <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)", marginBottom: 28 }}>— From the journal</div>
          <div className="au-serif-it" style={{ fontSize: 48, lineHeight: 1.12, color: "var(--au-ink-900)", letterSpacing: "-0.015em" }}>
            "We're not chasing the rarest bean on earth. We're chasing the cup you'll remember on Monday morning."
          </div>
          <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)", marginTop: 32 }}>Marta · Head roaster</div>
        </div>
      </div>

      {/* BREW METHOD STRIP ----------------------------------------------- */}
      <div style={{ padding: "96px 64px 64px" }}>
        <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)", marginBottom: 20 }}>— Shop by ritual</div>
        <div className="au-serif" style={{ fontSize: 48, lineHeight: 1, marginBottom: 40 }}>How do you brew?</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          {[
            { l: "Espresso", s: "Bold, syrupy", n: "12 lots" },
            { l: "Filter",   s: "Bright, clean", n: "08 lots" },
            { l: "Moka",     s: "Rich, warm",    n: "06 lots" },
            { l: "Decaf",    s: "All-day quiet", n: "02 lots" },
          ].map((m) => (
            <a key={m.l} style={{
              padding: "28px 24px 24px",
              border: "1px solid var(--au-cream-300)",
              borderRadius: 4,
              minHeight: 168,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              cursor: "pointer", textDecoration: "none", color: "inherit",
              transition: "border-color 140ms",
            }}>
              <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)" }}>{m.n}</div>
              <div>
                <div className="au-serif" style={{ fontSize: 36, lineHeight: 1 }}>{m.l}</div>
                <div className="au-serif-it" style={{ fontSize: 14, color: "var(--au-ink-700)", marginTop: 8 }}>{m.s}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* FOOTER ---------------------------------------------------------- */}
      <div style={{ marginTop: 64, padding: "64px 64px 36px", background: "var(--au-ink-900)", color: "var(--au-cream-100)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 56 }}>
          <div>
            <div className="au-serif" style={{ fontSize: 44, letterSpacing: "0.32em", paddingLeft: "0.32em", color: "var(--au-cream-50)" }}>AURA</div>
            <div className="au-mono" style={{ fontSize: 11, color: "var(--au-stone-400)", marginTop: 14, letterSpacing: "0.1em" }}>Roasted in Warsaw · est. 2024</div>
            <div className="au-serif-it" style={{ fontSize: 22, color: "var(--au-cream-100)", marginTop: 32, maxWidth: 340 }}>
              A small letter, on Sundays. New lots, brew notes, no noise.
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18, maxWidth: 380 }}>
              <input placeholder="your@email" style={{
                flex: 1, padding: "14px 16px", background: "transparent",
                border: "1px solid var(--au-stone-500)", color: "var(--au-cream-50)",
                fontFamily: "var(--au-sans)", fontSize: 13, borderRadius: 4, outline: "none",
              }}/>
              <button className="au-btn au-btn-ember">Subscribe</button>
            </div>
          </div>
          {[
            { h: "Shop",    items: ["All coffees", "Espresso", "Filter", "Subscription", "Gift card"] },
            { h: "About",   items: ["Our story", "Roastery", "Producers", "Sustainability", "Wholesale"] },
            { h: "Support", items: ["Brewing guides", "Shipping", "Returns", "FAQ", "Contact"] },
          ].map((c) => (
            <div key={c.h}>
              <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-400)", marginBottom: 18 }}>{c.h}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {c.items.map((it) => <a key={it} style={{ fontSize: 13, color: "var(--au-cream-100)", textDecoration: "none", cursor: "pointer" }}>{it}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: "1px solid var(--au-stone-500)", display: "flex", justifyContent: "space-between" }}>
          <div className="au-mono" style={{ fontSize: 10.5, color: "var(--au-stone-400)", letterSpacing: "0.08em" }}>© 2026 Aura Coffee Roasters</div>
          <div className="au-mono" style={{ fontSize: 10.5, color: "var(--au-stone-400)", letterSpacing: "0.08em" }}>Privacy · Terms · Imprint</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6) DESKTOP PRODUCT DETAIL PAGE
// ============================================================================
function AuDesktopPDP() {
  const [grind, setGrind] = React.useState("Whole bean");
  const [size, setSize]   = React.useState("250 g");
  return (
    <div className="au-frame" style={{ width: AURA_DW, height: 1920 }}>
      <AuDesktopNav active="Shop" count={2} />

      {/* Crumb */}
      <div style={{ padding: "20px 64px", borderBottom: "1px solid var(--au-cream-300)" }}>
        <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)" }}>
          Shop / Single origin / <span style={{ color: "var(--au-ink-900)" }}>ONE — Ethiopia Yirgacheffe</span>
        </div>
      </div>

      {/* MAIN ------------------------------------------------------------- */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 0, padding: "0", borderBottom: "1px solid var(--au-cream-300)" }}>
        {/* Gallery */}
        <div style={{ padding: "48px 48px 48px 64px", background: "var(--au-cream-100)", display: "flex", flexDirection: "column", gap: 16, borderRight: "1px solid var(--au-cream-300)" }}>
          <div style={{ height: 620, background: "var(--au-cream-200)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
            <AuImg id="d-pdp-hero" w="100%" h="100%" radius={4} placeholder="Bag · Yirgacheffe" />
            <span className="au-mono-up" style={{ position: "absolute", top: 18, left: 18, fontSize: 10, background: "var(--au-cream-50)", padding: "5px 8px", borderRadius: 2 }}>
              Lot 001 · Roasted 11 days ago
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            {[1,2,3,4].map((i) => (
              <div key={i} style={{ height: 96, background: "var(--au-cream-200)", borderRadius: 4, border: i === 1 ? "1px solid var(--au-ink-900)" : "1px solid transparent", overflow: "hidden" }}>
                <AuImg id={`d-pdp-thumb${i}`} w="100%" h="100%" radius={4} placeholder={`view ${i}`}/>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "48px 64px 48px 56px", display: "flex", flexDirection: "column" }}>
          <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)" }}>001 · Single origin</div>
          <div className="au-serif" style={{ fontSize: 96, lineHeight: 0.92, letterSpacing: "-0.025em", marginTop: 14 }}>ONE</div>
          <div className="au-serif-it" style={{ fontSize: 24, lineHeight: 1.2, color: "var(--au-ink-700)", marginTop: 16 }}>
            A bright, tea-like cup with cherry and bergamot on the finish.
          </div>

          {/* Notes */}
          <div style={{ marginTop: 28 }}>
            <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)", marginBottom: 10 }}>Tasting</div>
            <AuNotes notes={["cherry", "jasmine", "bergamot", "stone fruit", "honey"]}/>
          </div>

          {/* Quick origin specs — inline tablet */}
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, padding: "20px 0", borderTop: "1px solid var(--au-cream-300)", borderBottom: "1px solid var(--au-cream-300)" }}>
            {[
              ["Origin", "Yirgacheffe"],
              ["Process", "Washed"],
              ["Altitude", "1,950 m"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="au-mono-up" style={{ fontSize: 9.5, color: "var(--au-stone-500)" }}>{k}</div>
                <div className="au-serif" style={{ fontSize: 22, lineHeight: 1.1, marginTop: 6 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Variant: Grind */}
          <div style={{ marginTop: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <span className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)" }}>01 · Grind</span>
              <span className="au-mono" style={{ fontSize: 11, color: "var(--au-ink-900)" }}>{grind}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Whole bean", "Espresso", "Filter", "Aeropress", "Moka", "French press"].map((g) => (
                <button key={g} className="au-chip" data-active={g === grind ? "true" : "false"} onClick={() => setGrind(g)}>{g}</button>
              ))}
            </div>
          </div>

          {/* Variant: Size */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <span className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)" }}>02 · Size</span>
              <span className="au-mono" style={{ fontSize: 11, color: "var(--au-ink-900)" }}>{size}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                ["250 g", "84 zł"],
                ["500 g", "152 zł"],
                ["1 kg",  "276 zł"],
              ].map(([s, pr]) => (
                <button key={s} onClick={() => setSize(s)} style={{
                  all: "unset", cursor: "pointer", textAlign: "center",
                  padding: "16px 8px",
                  border: "1px solid " + (s === size ? "var(--au-ink-900)" : "var(--au-cream-300)"),
                  background: s === size ? "var(--au-cream-50)" : "transparent",
                  borderRadius: 4,
                  display: "flex", flexDirection: "column", gap: 4, alignItems: "center",
                }}>
                  <div className="au-serif" style={{ fontSize: 22 }}>{s}</div>
                  <div className="au-mono" style={{ fontSize: 10.5, color: "var(--au-stone-500)" }}>{pr}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Price + CTA */}
          <div style={{ marginTop: 32, display: "flex", alignItems: "stretch", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 4px" }}>
              <div className="au-mono-up" style={{ fontSize: 9.5, color: "var(--au-stone-500)" }}>Total</div>
              <div className="au-serif" style={{ fontSize: 36, lineHeight: 1, marginTop: 4 }}>84 zł</div>
            </div>
            <button className="au-btn au-btn-primary" style={{ flex: 1, padding: "0 24px", height: 60, fontSize: 15 }}>
              Add to basket <AuIcon.arrow s={16}/>
            </button>
            <button className="au-btn au-btn-ghost" style={{ width: 60, padding: 0 }} title="Save for later">
              <AuIcon.star s={16}/>
            </button>
          </div>

          {/* Trust signals */}
          <div style={{ marginTop: 24, display: "flex", gap: 24 }}>
            {[
              ["✓", "In stock · ships tomorrow"],
              ["✓", "Free shipping over 150 zł"],
              ["✓", "30-day freshness promise"],
            ].map(([i, t]) => (
              <div key={t} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11.5, color: "var(--au-ink-700)" }}>
                <span style={{ color: "var(--au-moss)" }}><AuIcon.check s={12}/></span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SPEC TABLE + BREW GUIDE ----------------------------------------- */}
      <div style={{ padding: "80px 64px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80 }}>
        <div>
          <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)", marginBottom: 16 }}>— Profile</div>
          <div className="au-serif" style={{ fontSize: 44, lineHeight: 1, marginBottom: 32, letterSpacing: "-0.02em" }}>
            From Konga washing station, <em className="au-serif-it">picked by hand</em>.
          </div>
          <div style={{ fontSize: 14.5, color: "var(--au-ink-700)", lineHeight: 1.65, maxWidth: 540, marginBottom: 32 }}>
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
            <div key={k} style={{ display: "grid", gridTemplateColumns: "180px 1fr", padding: "13px 0", borderTop: "1px solid var(--au-cream-300)", alignItems: "baseline" }}>
              <span className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)" }}>{k}</span>
              <span style={{ fontSize: 14, color: "var(--au-ink-900)" }}>{v}</span>
            </div>
          ))}
        </div>

        <div>
          <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)", marginBottom: 16 }}>— Brewing</div>
          <div className="au-serif" style={{ fontSize: 44, lineHeight: 1, marginBottom: 24 }}>How we brew it.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { m: "V60",       d: "15 g / 250 g / 92 °C / 2:45" },
              { m: "Aeropress", d: "16 g / 220 g / 90 °C / inverted" },
              { m: "Chemex",    d: "30 g / 500 g / 94 °C / 4:00" },
              { m: "Espresso",  d: "18 g in / 38 g out / 28 s" },
            ].map((b) => (
              <div key={b.m} style={{ padding: "20px 18px", border: "1px solid var(--au-cream-300)", borderRadius: 4, background: "var(--au-cream-100)" }}>
                <div className="au-serif" style={{ fontSize: 22, marginBottom: 8 }}>{b.m}</div>
                <div className="au-mono" style={{ fontSize: 11, color: "var(--au-ink-700)", letterSpacing: "0.04em" }}>{b.d}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: "24px", background: "var(--au-cream-200)", borderRadius: 4 }}>
            <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-ember)", marginBottom: 10 }}>Freshness promise</div>
            <div style={{ fontSize: 14, color: "var(--au-ink-700)", lineHeight: 1.55 }}>
              We roast Wednesdays and ship within 72 h. If your bag arrives past its prime, we replace it — no questions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AuDesktopHome, AuDesktopPDP });
