// AURA v2 — mobile: Cart drawer (filled), Empty cart, Menu drawer, Search overlay.

// ============================================================================
// 4) MOBILE CART DRAWER (filled)
// ============================================================================
function MMCartDrawer() {
  const items = [
    { c: "001", n: "ONE",   v: "Whole bean · 250 g", p: "84", q: 1, id: "v2-mc-1" },
    { c: "002", n: "TWO",   v: "Espresso · 500 g",   p: "138", q: 1, id: "v2-mc-2" },
    { c: "005", n: "FIVE",  v: "Espresso · 250 g",   p: "72", q: 1, id: "v2-mc-3" },
  ];
  const sub = 294;
  return (
    <div className="m-frame" style={{ width: 390, height: 844, background: "rgba(0,0,0,0.45)" }}>
      {/* Ghost of PDP behind */}
      <div style={{ position: "absolute", inset: 0, background: "var(--m-bg)", filter: "brightness(0.55)", zIndex: 0 }}>
        <div style={{ height: 44 }}/>
        <div style={{ height: 56 }}/>
        <div style={{ height: 380, background: "var(--m-bg-soft)", margin: "0" }}/>
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 48, fontWeight: 500, letterSpacing: "-0.035em" }}>ONE</div>
        </div>
      </div>

      {/* Drawer */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        background: "var(--m-bg)",
        height: 700,
        display: "flex", flexDirection: "column",
        boxShadow: "0 -16px 50px rgba(0,0,0,0.25)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <span style={{ width: 40, height: 3, background: "var(--m-line-2)" }}/>
        </div>

        <div style={{ padding: "16px 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--m-line)" }}>
          <div>
            <div className="m-h2" style={{ fontSize: 22 }}>Basket</div>
            <div className="m-meta" style={{ marginTop: 4 }}>3 items · 1.25 kg</div>
          </div>
          <button style={btnReset(36)}><MIcon.close/></button>
        </div>

        {/* Free shipping bar */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--m-line)" }}>
          <MShippingBar current={294} threshold={150}/>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflow: "hidden", padding: "0 20px" }}>
          {items.map((it, i) => (
            <div key={it.c} style={{ display: "flex", gap: 14, padding: "20px 0", borderBottom: i < items.length - 1 ? "1px solid var(--m-line)" : "none" }}>
              <div style={{ width: 84, height: 84, background: "var(--m-bg-soft)", flexShrink: 0, overflow: "hidden", position: "relative" }}>
                <MImg id={it.id} placeholder={it.c}/>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div className="m-h3" style={{ fontSize: 17 }}>{it.n}</div>
                    <div className="m-num" style={{ fontSize: 14, fontWeight: 500 }}>{it.p} zł</div>
                  </div>
                  <div className="m-mute" style={{ fontSize: 12, marginTop: 4 }}>{it.v}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--m-line)", height: 32 }}>
                    <button style={btnReset(28)}><MIcon.minus s={12}/></button>
                    <span className="m-num" style={{ width: 20, textAlign: "center", fontSize: 12 }}>{it.q}</span>
                    <button style={btnReset(28)}><MIcon.plus s={12}/></button>
                  </div>
                  <button style={{ all: "unset", cursor: "pointer", fontSize: 11, color: "var(--m-mute-2)", textDecoration: "underline" }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / summary */}
        <div style={{ borderTop: "1px solid var(--m-line)", padding: "18px 20px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12.5, color: "var(--m-mute-2)" }}>Subtotal</span>
            <span className="m-num" style={{ fontSize: 14 }}>{sub} zł</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12.5, color: "var(--m-mute-2)" }}>Shipping</span>
            <span style={{ fontSize: 12.5, color: "var(--m-ok)" }}>Free</span>
          </div>
        </div>

        <div style={{ padding: "0 16px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="m-btn m-btn-primary" style={{ width: "100%", height: 56, justifyContent: "space-between", padding: "0 22px" }}>
            <span>Checkout</span>
            <span className="m-num" style={{ opacity: 0.7 }}>{sub} zł <MIcon.arrow s={14}/></span>
          </button>
          <button style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: 12, color: "var(--m-mute-2)", padding: 8 }}>
            Continue shopping
          </button>
        </div>
      </div>

      {/* Tiny toast — "Added" feedback */}
      <div style={{
        position: "absolute", top: 80, left: 16, right: 16,
        background: "var(--m-ink-hi)", color: "var(--m-bg)",
        padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
        fontSize: 13, fontWeight: 500, zIndex: 10,
      }}>
        <MIcon.check s={16}/>
        <span style={{ flex: 1 }}>Added FIVE · Espresso · 250 g</span>
        <button style={{ all: "unset", cursor: "pointer", fontSize: 11, opacity: 0.7, textDecoration: "underline" }}>Undo</button>
      </div>
    </div>
  );
}

// ============================================================================
// 5) MOBILE EMPTY CART
// ============================================================================
function MMEmpty() {
  return (
    <div className="m-frame" style={{ width: 390, minHeight: 844 }}>
      <MStatusBar/>
      <MMobileNav left="back" title="" count={0}/>

      <div style={{ padding: "16px 20px 0" }}>
        <div className="m-h2" style={{ fontSize: 30 }}>Basket</div>
        <div className="m-meta" style={{ marginTop: 4 }}>Empty</div>
      </div>

      {/* Big empty state — typographic, not iconographic */}
      <div style={{ padding: "60px 28px 0", textAlign: "center" }}>
        <div style={{ width: 1, height: 64, background: "var(--m-line-2)", margin: "0 auto 36px" }}/>
        <div className="m-display" style={{ fontSize: 44 }}>Nothing yet.</div>
        <div className="m-mute" style={{ fontSize: 14.5, marginTop: 16, lineHeight: 1.55, maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>
          Your basket is waiting. Start with our most-loved single origin or the house blend.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 36, maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>
          <button className="m-btn m-btn-primary">Shop all coffees <MIcon.arrow s={16}/></button>
          <button className="m-btn m-btn-ghost">Browse blends</button>
        </div>
      </div>

      {/* Suggested */}
      <div style={{ padding: "72px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <div className="m-eyebrow">You may like</div>
          <a className="m-meta" style={{ textDecoration: "underline", textUnderlineOffset: 4 }}>View all</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 12px" }}>
          {[
            { c: "001", n: "ONE", o: "Ethiopia · Yirgacheffe", ns: "cherry, jasmine, bergamot", p: "84", id: "v2-me-1" },
            { c: "003", n: "THREE", o: "House blend",         ns: "hazelnut, brown sugar, fig", p: "68", id: "v2-me-2" },
          ].map((p) => <MProductCard key={p.c} {...p} slotId={p.id}/>)}
        </div>
      </div>

      <MMobileFooter/>
    </div>
  );
}

// ============================================================================
// 6) MOBILE MENU DRAWER
// ============================================================================
function MMMenu() {
  return (
    <div className="m-frame" style={{ width: 390, height: 844 }}>
      <MStatusBar/>

      {/* Header — close X right */}
      <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "0.32em", paddingLeft: "0.32em" }}>AURA</div>
        <button style={btnReset(36)}><MIcon.close/></button>
      </div>

      {/* Big nav items */}
      <div style={{ padding: "8px 20px 0" }}>
        {[
          { l: "Shop",       s: "06 coffees" },
          { l: "Blends",     s: "House · Espresso · Decaf" },
          { l: "About",      s: "Our story · Roastery" },
          { l: "Brewing",    s: "Guides · methods" },
          { l: "Journal",    s: "New posts weekly" },
        ].map((n, i) => (
          <a key={n.l} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "26px 0",
            borderBottom: "1px solid var(--m-line)",
            color: "var(--m-ink-hi)", textDecoration: "none",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <span className="m-num m-mute" style={{ fontSize: 11, width: 22, letterSpacing: 0 }}>0{i+1}</span>
              <div>
                <div className="m-h2" style={{ fontSize: 30 }}>{n.l}</div>
                <div className="m-mute" style={{ fontSize: 12.5, marginTop: 2 }}>{n.s}</div>
              </div>
            </div>
            <MIcon.chevR s={18}/>
          </a>
        ))}
      </div>

      {/* Account / utilities */}
      <div style={{ padding: "28px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        <a style={ml()}>
          <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <MIcon.account s={18}/> Account
          </span>
          <MIcon.chevR s={14}/>
        </a>
        <a style={ml()}>
          <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <MIcon.bag s={18}/> Basket
          </span>
          <span className="m-meta">2 items</span>
        </a>
      </div>

      {/* Bottom — language */}
      <div style={{ position: "absolute", bottom: 24, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--m-line)", paddingTop: 18 }}>
        <span className="m-meta">EN · PLN</span>
        <span className="m-meta">Warsaw, PL</span>
      </div>
    </div>
  );
}
function ml() { return { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", fontSize: 14, color: "var(--m-ink-hi)", textDecoration: "none", cursor: "pointer" }; }

// ============================================================================
// 7) MOBILE SEARCH OVERLAY
// ============================================================================
function MMSearch() {
  return (
    <div className="m-frame" style={{ width: 390, height: 844 }}>
      <MStatusBar/>

      {/* Search header */}
      <div style={{ padding: "12px 16px", display: "flex", gap: 10, alignItems: "center", borderBottom: "1px solid var(--m-line)" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--m-bg-soft)" }}>
          <MIcon.search s={18}/>
          <input style={{ all: "unset", flex: 1, fontFamily: "var(--m-font)", fontSize: 14, color: "var(--m-ink-hi)" }} defaultValue="ethiop"/>
          <button style={btnReset(20)}><MIcon.close s={14}/></button>
        </div>
        <button style={{ all: "unset", cursor: "pointer", fontSize: 13, color: "var(--m-ink-hi)" }}>Cancel</button>
      </div>

      {/* Live results */}
      <div style={{ padding: "12px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>Coffees · 3</div>
        {[
          { c: "001", n: "ONE",  o: "Ethiopia · Yirgacheffe", p: "84", id: "v2-ms-1" },
          { c: "007", n: "SEVEN",o: "Ethiopia · Sidamo",      p: "88", id: "v2-ms-2" },
          { c: "004", n: "FOUR", o: "Kenya · Nyeri",          p: "92", id: "v2-ms-3" },
        ].map((p) => (
          <a key={p.c} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: "1px solid var(--m-line)", textDecoration: "none", color: "inherit" }}>
            <div style={{ width: 56, height: 56, background: "var(--m-bg-soft)", flexShrink: 0, overflow: "hidden" }}>
              <MImg id={p.id} placeholder={p.c}/>
            </div>
            <div style={{ flex: 1 }}>
              <div className="m-h3" style={{ fontSize: 16 }}>{p.n}</div>
              <div className="m-mute" style={{ fontSize: 12, marginTop: 3 }}>
                <span dangerouslySetInnerHTML={{ __html: p.o.replace(/(ethiop)/gi, '<mark style="background:var(--m-ink-hi);color:#fff;padding:0 2px">$1</mark>') }}/>
              </div>
            </div>
            <div className="m-num" style={{ fontSize: 13.5, fontWeight: 500, alignSelf: "center" }}>{p.p} zł</div>
          </a>
        ))}
      </div>

      {/* Suggestions */}
      <div style={{ padding: "32px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>Try also</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Ethiopia", "Filter", "Light roast", "Single origin", "Decaf", "Espresso", "Gifts"].map((t) => (
            <button key={t} className="m-chip">{t}</button>
          ))}
        </div>
      </div>

      {/* Pages */}
      <div style={{ padding: "32px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>Pages</div>
        {[
          { t: "About Aura", s: "Our story" },
          { t: "Shipping & returns", s: "Help" },
          { t: "Brewing guides", s: "How-to" },
        ].map((p) => (
          <a key={p.t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--m-line)", textDecoration: "none", color: "inherit" }}>
            <div>
              <div style={{ fontSize: 14, color: "var(--m-ink-hi)" }}>{p.t}</div>
              <div className="m-mute" style={{ fontSize: 12, marginTop: 2 }}>{p.s}</div>
            </div>
            <MIcon.chevR s={14}/>
          </a>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { MMCartDrawer, MMEmpty, MMMenu, MMSearch });
