// Aura — style direction artboard. The first visual direction in one screen.

function AuStyleDirection() {
  return (
    <div className="au-frame" style={{ width: 1440, height: 2720, padding: "64px 72px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid var(--au-cream-300)", paddingBottom: 32 }}>
        <div>
          <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)", marginBottom: 16 }}>— Style direction · v1</div>
          <div className="au-serif" style={{ fontSize: 72, lineHeight: 0.95, letterSpacing: "-0.02em", maxWidth: 900 }}>
            Editorial, sensory, <em className="au-serif-it">quiet</em>.<br/>An invitation, not a sale.
          </div>
        </div>
        <div className="au-mono-up" style={{ fontSize: 10.5, color: "var(--au-stone-500)", textAlign: "right" }}>
          Aura · Coffee speciality<br/>Mobile-first · Headless Shopify
        </div>
      </div>

      {/* ============================================================== */}
      {/* PALETTE                                                          */}
      {/* ============================================================== */}
      <div style={{ marginTop: 56 }}>
        <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)", marginBottom: 18 }}>01 · Palette</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 12 }}>
          {[
            { name: "Paper",       v: "cream-50",   hex: "#F6F1E7", token: "--au-cream-50",  tone: "dark", use: "Surface · sticky bars" },
            { name: "Default bg",  v: "cream-100",  hex: "#F0EADC", token: "--au-cream-100", tone: "dark", use: "Page bg" },
            { name: "Soft card",   v: "cream-200",  hex: "#E2D9C6", token: "--au-cream-200", tone: "dark", use: "Cards · image placeholders" },
            { name: "Divider",     v: "cream-300",  hex: "#C9BFA8", token: "--au-cream-300", tone: "dark", use: "Hairlines · chip border" },
            { name: "Stone",       v: "stone-500",  hex: "#8A8071", token: "--au-stone-500", tone: "light", use: "Secondary text" },
            { name: "Ink body",    v: "ink-700",    hex: "#3D362C", token: "--au-ink-700",   tone: "light", use: "Body text" },
            { name: "Ink head",    v: "ink-900",    hex: "#1F1A14", token: "--au-ink-900",   tone: "light", use: "Headings · primary btn" },
            { name: "Ember",       v: "ember",      hex: "#B85A2C", token: "--au-ember",     tone: "light", use: "ACCENT · freshness · pip" },
          ].map((c) => (
            <div key={c.v}>
              <div style={{ height: 140, background: `var(${c.token})`, borderRadius: 4, position: "relative", overflow: "hidden", border: c.v === "cream-50" || c.v === "cream-100" ? "1px solid var(--au-cream-300)" : "none" }}>
                <div className="au-mono-up" style={{ position: "absolute", bottom: 10, left: 10, color: c.tone === "light" ? "var(--au-cream-50)" : "var(--au-ink-900)", fontSize: 9 }}>
                  {c.hex}
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div className="au-serif" style={{ fontSize: 17 }}>{c.name}</div>
                <div className="au-mono" style={{ fontSize: 10, color: "var(--au-stone-500)", letterSpacing: "0.06em", marginTop: 2 }}>{c.token}</div>
                <div style={{ fontSize: 11, color: "var(--au-ink-700)", marginTop: 6, lineHeight: 1.35 }}>{c.use}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Accent secondaries (tasting) */}
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(2, 1fr) 4fr", gap: 12 }}>
          {[
            { name: "Cherry",  hex: "#A0432F", token: "--au-cherry", use: "Tasting · fruity notes" },
            { name: "Moss",    hex: "#5F7D3A", token: "--au-moss",   use: "Tasting · herbal · in stock" },
          ].map((c) => (
            <div key={c.token} style={{ display: "flex", gap: 14, alignItems: "center", padding: 14, border: "1px solid var(--au-cream-300)", borderRadius: 4 }}>
              <div style={{ width: 60, height: 60, background: `var(${c.token})`, borderRadius: 4 }}/>
              <div>
                <div className="au-serif" style={{ fontSize: 18 }}>{c.name}</div>
                <div className="au-mono" style={{ fontSize: 10, color: "var(--au-stone-500)", letterSpacing: "0.06em", marginTop: 2 }}>{c.token} · {c.hex}</div>
                <div style={{ fontSize: 11.5, color: "var(--au-ink-700)", marginTop: 4 }}>{c.use}</div>
              </div>
            </div>
          ))}
          <div style={{ padding: 14, background: "var(--au-cream-200)", borderRadius: 4, fontSize: 11.5, color: "var(--au-ink-700)", lineHeight: 1.5 }}>
            <strong className="au-mono-up" style={{ fontSize: 9.5, display: "block", marginBottom: 8, color: "var(--au-stone-500)" }}>System rules</strong>
            All accents share chroma ~0.14, hue rotated 25–130°. <strong>Ember</strong> is the only marketing accent. Cherry & moss are <strong>data-only</strong> (notes, stock, status) — never for CTAs. WCAG-AA contrast verified on cream-100 background for ink-700 (8.4:1), ember (4.6:1) and stone-500 (3.6:1 — labels &nbsp;≥&nbsp;14px only).
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TYPOGRAPHY                                                       */}
      {/* ============================================================== */}
      <div style={{ marginTop: 72 }}>
        <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)", marginBottom: 18 }}>02 · Typography</div>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 24, alignItems: "stretch" }}>

          <div style={{ padding: "28px 32px", border: "1px solid var(--au-cream-300)", borderRadius: 4 }}>
            <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)", marginBottom: 8 }}>Display · Instrument Serif</div>
            <div className="au-serif" style={{ fontSize: 88, lineHeight: 0.92, letterSpacing: "-0.025em" }}>Aa</div>
            <div className="au-serif-it" style={{ fontSize: 32, marginTop: 4, color: "var(--au-ink-700)" }}>quiet, brighter</div>
            <hr className="au-rule" style={{ margin: "20px 0" }}/>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", fontSize: 11, fontFamily: "var(--au-mono)", color: "var(--au-stone-500)" }}>
              <span>72–96</span><span>Hero · editorial moments</span>
              <span>40–56</span><span>Section titles · page H1</span>
              <span>22–28</span><span>Product names · card titles</span>
              <span>14–18</span><span>Italic subtitles only</span>
            </div>
          </div>

          <div style={{ padding: "28px 32px", border: "1px solid var(--au-cream-300)", borderRadius: 4 }}>
            <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)", marginBottom: 8 }}>Body · Geist</div>
            <div style={{ fontFamily: "var(--au-sans)", fontSize: 80, lineHeight: 0.95, fontWeight: 500 }}>Aa</div>
            <div style={{ fontFamily: "var(--au-sans)", fontSize: 14, marginTop: 14, color: "var(--au-ink-700)", lineHeight: 1.55 }}>
              Body copy stays small and warm. Line-height 1.55, letter-spacing -0.005em.
            </div>
            <hr className="au-rule" style={{ margin: "20px 0" }}/>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", fontSize: 11, fontFamily: "var(--au-mono)", color: "var(--au-stone-500)" }}>
              <span>16/24</span><span>Lead paragraph</span>
              <span>14/22</span><span>Body default</span>
              <span>13/20</span><span>Cards · meta</span>
              <span>500</span><span>Buttons · UI emphasis</span>
            </div>
          </div>

          <div style={{ padding: "28px 32px", border: "1px solid var(--au-cream-300)", borderRadius: 4 }}>
            <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)", marginBottom: 8 }}>Mono · JetBrains Mono</div>
            <div className="au-mono" style={{ fontSize: 80, lineHeight: 0.95, letterSpacing: 0 }}>Aa</div>
            <div className="au-mono-up" style={{ fontSize: 11, marginTop: 14, color: "var(--au-ink-700)" }}>
              001 · Yirgacheffe · 11 days ago
            </div>
            <hr className="au-rule" style={{ margin: "20px 0" }}/>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", fontSize: 11, fontFamily: "var(--au-mono)", color: "var(--au-stone-500)" }}>
              <span>11 ALL-CAPS</span><span>Section labels · eyebrows</span>
              <span>10–11</span><span>Lot codes · timestamps</span>
              <span>12–14</span><span>Prices · totals · receipts</span>
              <span>0.14em</span><span>Tracking on labels</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SPACING + RADII + ICONS                                          */}
      {/* ============================================================== */}
      <div style={{ marginTop: 72, display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 32 }}>

        {/* SPACING */}
        <div>
          <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)", marginBottom: 18 }}>03 · Spacing · 4-base</div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            {[
              { n: "1", v: 4 },{ n: "2", v: 8 },{ n: "3", v: 12 },{ n: "4", v: 16 },
              { n: "5", v: 20 },{ n: "6", v: 24 },{ n: "8", v: 32 },{ n: "10", v: 40 },
              { n: "12", v: 48 },{ n: "16", v: 64 },{ n: "20", v: 80 },
            ].map((s) => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ width: s.v, height: s.v, background: "var(--au-ink-900)", borderRadius: 2 }}/>
                <div className="au-mono" style={{ fontSize: 9.5, color: "var(--au-stone-500)", marginTop: 8 }}>{s.n}</div>
                <div className="au-mono" style={{ fontSize: 9, color: "var(--au-stone-400)" }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "var(--au-ink-700)", marginTop: 24, lineHeight: 1.5, maxWidth: 480 }}>
            Mobile screen edge: <strong>16–24px</strong>. Section rhythm: <strong>56–80px</strong> between blocks. Inside cards: <strong>16–20px</strong>. Headings sit 8–14px below their eyebrow label. Maps cleanly to Tailwind's <em>spacing scale</em> (1=4px).
          </div>
        </div>

        {/* RADII */}
        <div>
          <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)", marginBottom: 18 }}>04 · Radii</div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            {[
              { n: "xs", v: 2 },
              { n: "sm", v: 4 },
              { n: "md", v: 6 },
              { n: "lg", v: 10 },
              { n: "pill", v: 999 },
            ].map((r) => (
              <div key={r.n} style={{ textAlign: "center" }}>
                <div style={{ width: 60, height: 60, background: "var(--au-cream-200)", border: "1px solid var(--au-cream-300)", borderRadius: r.v }}/>
                <div className="au-mono-up" style={{ fontSize: 9, color: "var(--au-stone-500)", marginTop: 8 }}>{r.n}</div>
                <div className="au-mono" style={{ fontSize: 9, color: "var(--au-stone-400)" }}>{r.v}px</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "var(--au-ink-700)", marginTop: 24, lineHeight: 1.5 }}>
            We stay intentionally <strong>tight</strong>. Default: 4px (cards, buttons, inputs). Pill only for chips and stock dot. No nadmuchane 16+ radii — that signals SaaS, not magazine.
          </div>
        </div>

        {/* ICONS / DETAILS */}
        <div>
          <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)", marginBottom: 18 }}>05 · Icons & details</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { i: <AuIcon.bag/>,    l: "bag" },
              { i: <AuIcon.search/>, l: "search" },
              { i: <AuIcon.menu/>,   l: "menu" },
              { i: <AuIcon.back/>,   l: "back" },
              { i: <AuIcon.drop/>,   l: "drop" },
              { i: <AuIcon.leaf/>,   l: "leaf" },
              { i: <AuIcon.check/>,  l: "check" },
              { i: <AuIcon.arrow/>,  l: "arrow" },
            ].map((g, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", padding: "16px 0", border: "1px solid var(--au-cream-300)", borderRadius: 4, color: "var(--au-ink-900)" }}>
                {g.i}
                <span className="au-mono" style={{ fontSize: 9, color: "var(--au-stone-500)" }}>{g.l}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "var(--au-ink-700)", marginTop: 24, lineHeight: 1.5 }}>
            Hairline <strong>1.5px stroke</strong>, square line-caps, no fills. 22px on mobile nav, 16px inline, 12px in chips. <strong>No emoji.</strong>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* COMPONENTS — BUTTONS / CARDS                                     */}
      {/* ============================================================== */}
      <div style={{ marginTop: 72 }}>
        <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-500)", marginBottom: 18 }}>06 · Components · first pass</div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.2fr", gap: 24, alignItems: "stretch" }}>

          {/* BUTTONS */}
          <div style={{ padding: "28px", border: "1px solid var(--au-cream-300)", borderRadius: 4, display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)" }}>Buttons</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button className="au-btn au-btn-primary">Add to basket</button>
              <button className="au-btn au-btn-primary" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>Sold out</button>
              <button className="au-btn au-btn-ember">Subscribe & save</button>
              <button className="au-btn au-btn-ghost">Continue shopping</button>
              <button className="au-btn au-btn-primary au-btn-sm">Small</button>
              <button className="au-btn au-btn-ghost au-btn-sm">Small ghost</button>
            </div>
            <hr className="au-rule"/>
            <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)" }}>Chips · variant pickers</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <button className="au-chip" data-active="true">All</button>
              <button className="au-chip">Espresso</button>
              <button className="au-chip">Filter</button>
              <button className="au-chip">Single origin</button>
              <button className="au-chip">Decaf</button>
            </div>
            <hr className="au-rule"/>
            <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)" }}>Notes pills</div>
            <AuNotes notes={["cherry", "jasmine", "bergamot", "cocoa"]}/>
            <div style={{ fontSize: 11, color: "var(--au-stone-500)", lineHeight: 1.55 }}>
              48px min touch · 4px radius · 500 weight · primary = ink-900, accent = ember (subscription / freshness CTAs only).
            </div>
          </div>

          {/* PRODUCT CARD */}
          <div style={{ padding: "28px", border: "1px solid var(--au-cream-300)", borderRadius: 4 }}>
            <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)", marginBottom: 14 }}>Product card</div>
            <AuProductCard mode="desktop" code="001" name="ONE" origin="Ethiopia · Yirgacheffe" notes="cherry, jasmine, bergamot" price="84" slotId="style-card-1" />
            <div style={{ fontSize: 11, color: "var(--au-stone-500)", marginTop: 16, lineHeight: 1.55 }}>
              Image-led, no border. Lot code top-left (mono). Name (serif) ↔ price (mono) baseline-aligned. Italic serif for tasting notes.
            </div>
          </div>

          {/* CARD: FORM ELEMENTS + INFO BAR */}
          <div style={{ padding: "28px", border: "1px solid var(--au-cream-300)", borderRadius: 4, display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="au-mono-up" style={{ fontSize: 10, color: "var(--au-stone-500)" }}>Inputs · steppers · notes</div>
            <input placeholder="your@email" style={{
              padding: "14px 16px", background: "transparent",
              border: "1px solid var(--au-cream-300)", color: "var(--au-ink-900)",
              fontFamily: "var(--au-sans)", fontSize: 13, borderRadius: 4, outline: "none",
            }}/>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--au-cream-300)", borderRadius: 4, height: 44, width: 140 }}>
              <button style={{ all: "unset", cursor: "pointer", width: 40, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}><AuIcon.minus s={14}/></button>
              <span className="au-mono" style={{ flex: 1, textAlign: "center", fontSize: 13 }}>2</span>
              <button style={{ all: "unset", cursor: "pointer", width: 40, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}><AuIcon.plus s={14}/></button>
            </div>
            <div style={{ padding: "14px 16px", background: "var(--au-cream-200)", borderRadius: 4 }}>
              <div className="au-mono-up" style={{ fontSize: 9.5, color: "var(--au-ember)", marginBottom: 6 }}>Freshness · 11 days</div>
              <div className="au-serif-it" style={{ fontSize: 14, lineHeight: 1.3, color: "var(--au-ink-900)" }}>
                Roasted 08.05 · ships tomorrow.
              </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--au-stone-500)", lineHeight: 1.55 }}>
              Inputs: 44px height, 1px hairline border, no shadow. Steppers: same height as buttons. <strong>Ember</strong> is reserved for time-sensitive moments (freshness, restock, new lot).
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VISUAL LANGUAGE RULES                                            */}
      {/* ============================================================== */}
      <div style={{ marginTop: 72, padding: "40px 48px", background: "var(--au-ink-900)", color: "var(--au-cream-100)", borderRadius: 4 }}>
        <div className="au-mono-up" style={{ fontSize: 11, color: "var(--au-stone-400)", marginBottom: 24 }}>07 · Visual language · principles</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40 }}>
          {[
            { h: "Whitespace is the brand", b: "We let the page breathe. Section padding starts at 56px mobile, 96px desktop. If it feels too empty, we resist filling it." },
            { h: "Type before decoration", b: "Serif headlines + mono labels carry the identity. We don't reach for badges, gradients, glows or icon-stickers." },
            { h: "Image-led, but quiet",   b: "Photography is warm, slightly underexposed, single subject. No stock. No flat-lays unless they belong in a magazine." },
            { h: "Mono = signal",          b: "Anything that smells like a fact — lot, date, gram, price — is mono. It reads like a coffee receipt." },
            { h: "Friction on purpose",    b: "We don't over-pop CTAs. The product is the hero. Add-to-basket is sticky on mobile, never shouty." },
            { h: "Motion is exhale",       b: "Transitions 140–220ms, ease (.2,.7,.3,1). Hover lifts a hairline, not a card. Add-to-cart is a small flash, not a celebration." },
          ].map((p) => (
            <div key={p.h}>
              <div className="au-serif-it" style={{ fontSize: 26, lineHeight: 1.1, color: "var(--au-cream-50)", marginBottom: 12 }}>{p.h}.</div>
              <div style={{ fontSize: 13, color: "var(--au-cream-100)", opacity: 0.78, lineHeight: 1.6 }}>{p.b}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AuStyleDirection });
