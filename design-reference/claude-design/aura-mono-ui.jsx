// AURA v2 — mono UI primitives. Shared across all screens.

const MIcon = {
  menu:   (p) => <svg width={p?.s||22} height={p?.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square"><path d="M3 7h18M3 17h18"/></svg>,
  close:  (p) => <svg width={p?.s||22} height={p?.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 5l14 14M19 5L5 19"/></svg>,
  bag:    (p) => <svg width={p?.s||22} height={p?.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 7h14l-1 13H6L5 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>,
  search: (p) => <svg width={p?.s||22} height={p?.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>,
  back:   (p) => <svg width={p?.s||22} height={p?.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square"><path d="M15 5l-7 7 7 7"/></svg>,
  arrow:  (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square"><path d="M5 12h14M14 6l6 6-6 6"/></svg>,
  plus:   (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 5v14M5 12h14"/></svg>,
  minus:  (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 12h14"/></svg>,
  check:  (p) => <svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"><path d="M5 12l4 4 10-10"/></svg>,
  chev:   (p) => <svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 9l6 6 6-6"/></svg>,
  chevR:  (p) => <svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M9 6l6 6-6 6"/></svg>,
  filter: (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 6h16M7 12h10M10 18h4"/></svg>,
  account:(p) => <svg width={p?.s||22} height={p?.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="9" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/></svg>,
  heart:  (p) => <svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/></svg>,
};

// Status bar (iOS-style, mono)
function MStatusBar({ tone = "dark", time = "9:41" }) {
  const c = tone === "light" ? "#FFFFFF" : "#0A0A0A";
  return (
    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 0 24px", fontWeight: 600, fontSize: 14, color: c }}>
      <span style={{ letterSpacing: "-0.01em" }}>{time}</span>
      <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill={c}><rect x="0" y="7" width="3" height="4" rx=".5"/><rect x="4.5" y="5" width="3" height="6" rx=".5"/><rect x="9" y="3" width="3" height="8" rx=".5"/><rect x="13.5" y="0" width="3" height="11" rx=".5"/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke={c} strokeWidth="1.2"><path d="M1 4.2a10 10 0 0 1 13 0"/><path d="M3.2 6.2a7 7 0 0 1 8.6 0"/><path d="M5.4 8.2a4 4 0 0 1 4.2 0"/><circle cx="7.5" cy="10" r=".7" fill={c}/></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none" stroke={c} strokeWidth="1"><rect x=".5" y=".5" width="22" height="11" rx="2.5"/><rect x="23.5" y="3.5" width="2" height="5" rx="1" fill={c}/><rect x="2" y="2" width="18" height="8" rx="1.2" fill={c}/></svg>
      </span>
    </div>
  );
}

// Mobile nav — flat, three-icon. Brand wordmark centered.
function MMobileNav({ left = "menu", title = "AURA", count = 0, tone = "dark", showSearch = true }) {
  const c = tone === "light" ? "#FFFFFF" : "#0A0A0A";
  const LeftIcon = left === "back" ? MIcon.back : MIcon.menu;
  return (
    <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", color: c, position: "relative" }}>
      <button style={btnReset(36)}><LeftIcon/></button>
      <div style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
        fontSize: 18, fontWeight: 500, letterSpacing: "0.32em", paddingLeft: "0.32em",
      }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {showSearch && <button style={btnReset(36)}><MIcon.search/></button>}
        <button style={{ ...btnReset(36), position: "relative" }}>
          <MIcon.bag/>
          {count > 0 && <span style={countDot(c, tone)}>{count}</span>}
        </button>
      </div>
    </div>
  );
}
function btnReset(size) { return { all: "unset", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: size, height: size }; }
function countDot(c, tone) {
  return {
    position: "absolute", top: 4, right: 4,
    background: c, color: tone === "light" ? "#0A0A0A" : "#FFFFFF",
    fontSize: 9, fontWeight: 600,
    width: 14, height: 14, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    letterSpacing: 0,
  };
}

// Desktop nav — left brand, centered nav, right utilities.
function MDesktopNav({ active = "Shop", count = 2, sticky = false }) {
  const items = ["Shop", "Blends", "About", "Brewing", "Journal"];
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 72, padding: "0 56px",
      borderBottom: "1px solid var(--m-line)",
      background: "var(--m-bg)",
      position: "relative", zIndex: 5,
    }}>
      <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "0.4em", paddingLeft: "0.4em", color: "var(--m-ink-hi)" }}>AURA</div>
      <nav style={{ display: "flex", gap: 36, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
        {items.map((n) => (
          <a key={n} style={{
            fontSize: 13, color: "var(--m-ink-hi)", cursor: "pointer", textDecoration: "none",
            position: "relative", paddingBottom: 4,
            opacity: n === active ? 1 : 0.55,
            fontWeight: n === active ? 500 : 400,
          }}>
            {n}
            {n === active && <span style={{ position: "absolute", left: 0, right: 0, bottom: -2, height: 1, background: "var(--m-ink-hi)" }}/>}
          </a>
        ))}
      </nav>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button style={iconBtn()}><MIcon.search/></button>
        <button style={iconBtn()}><MIcon.account/></button>
        <button style={iconBtn()}>
          <MIcon.bag/>
          {count > 0 && <span style={{
            position: "absolute", top: 4, right: 4,
            background: "var(--m-ink-hi)", color: "#fff",
            fontSize: 9, fontWeight: 600, width: 14, height: 14, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{count}</span>}
        </button>
      </div>
    </header>
  );
}
function iconBtn() { return { all: "unset", cursor: "pointer", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--m-ink-hi)", position: "relative", borderRadius: 4 }; }

// Image slot wrapper
function MImg({ id, w, h, placeholder = "Image", radius = 0, style = {} }) {
  return (
    <image-slot id={id} shape={radius > 0 ? "rounded" : "rect"} radius={String(radius)} placeholder={placeholder}
      style={{ width: w || "100%", height: h || "100%", display: "block", ...style }} />
  );
}

// Tasting notes — plain text comma-separated, lowercase (more minimal)
function MNotes({ notes = [], size = 13 }) {
  return (
    <span style={{ color: "var(--m-mute-2)", fontSize: size, letterSpacing: "-0.005em" }}>
      {notes.map((n, i) => (
        <span key={i}>
          {i > 0 && <span style={{ color: "var(--m-line-2)", margin: "0 6px" }}>·</span>}
          {n}
        </span>
      ))}
    </span>
  );
}

// Stock pill — single tiny dot + label
function MStock({ in_stock = true, count = null }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11.5, color: in_stock ? "var(--m-ink)" : "var(--m-mute-2)" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: in_stock ? "var(--m-ok)" : "var(--m-mute)" }}/>
      {in_stock ? (count !== null ? `In stock · ${count} left` : "In stock") : "Out of stock"}
    </span>
  );
}

// Free-shipping progress
function MShippingBar({ current = 134, threshold = 150 }) {
  const pct = Math.min(100, (current / threshold) * 100);
  const left = Math.max(0, threshold - current);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--m-ink)", marginBottom: 8 }}>
        <span>{left > 0 ? <>Add <strong className="m-num">{left} zł</strong> for free shipping</> : <strong>Free shipping unlocked</strong>}</span>
        <span className="m-num m-mute" style={{ fontSize: 11.5 }}>{current}/{threshold} zł</span>
      </div>
      <div style={{ height: 2, background: "var(--m-line)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "var(--m-ink-hi)", transition: "width 240ms" }}/>
      </div>
    </div>
  );
}

// Product card — minimal, image-led, used across mobile & desktop
function MProductCard({ name, origin, notes, price, gram = "250 g", slotId, code, mode = "mobile", showQuickAdd = false, soldOut = false }) {
  const isDesktop = mode === "desktop";
  const imgH = isDesktop ? 460 : 220;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isDesktop ? 16 : 12, position: "relative" }}>
      <div style={{ position: "relative", background: "var(--m-bg-soft)", height: imgH, overflow: "hidden" }}>
        <MImg id={slotId} placeholder={`${code || name}`} />
        {soldOut && <span style={{
          position: "absolute", top: 12, left: 12, padding: "4px 8px", background: "var(--m-bg)", color: "var(--m-ink-hi)",
          fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase"
        }}>Sold out</span>}
        {showQuickAdd && (
          <button className="m-btn m-btn-primary m-btn-sm" style={{
            position: "absolute", bottom: 12, left: 12, right: 12,
            opacity: 0.95,
          }}>
            Quick add
          </button>
        )}
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="m-h3" style={{ fontSize: isDesktop ? 22 : 17 }}>{name}</div>
            <div className="m-mute" style={{ fontSize: isDesktop ? 13 : 12, marginTop: 4 }}>{origin}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="m-num" style={{ fontSize: isDesktop ? 16 : 14, fontWeight: 500, color: "var(--m-ink-hi)" }}>{price} zł</div>
            <div className="m-mute m-num" style={{ fontSize: isDesktop ? 12 : 11, marginTop: 2 }}>{gram}</div>
          </div>
        </div>
        {notes && <div style={{ marginTop: 10 }}><MNotes notes={typeof notes === "string" ? notes.split(",").map(s => s.trim()) : notes} size={isDesktop ? 13 : 12}/></div>}
      </div>
    </div>
  );
}

// Notes panel (yellow paper) — kept identical to v1's API
function MNote({ title, sections }) {
  return (
    <div className="m-notepad">
      <h4>{title}</h4>
      {sections.map((s, i) => (
        <div key={i}>
          <div className="sub">{s.label}</div>
          <ul>{s.items.map((it, j) => <li key={j} dangerouslySetInnerHTML={{__html: it}}/>)}</ul>
        </div>
      ))}
    </div>
  );
}

// Section wrapper — desktop section title row
function MSectionHead({ eyebrow, title, sub, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
      <div>
        {eyebrow && <div className="m-eyebrow" style={{ marginBottom: 16 }}>— {eyebrow}</div>}
        <div className="m-h1" style={{ fontSize: 44, maxWidth: 720 }}>{title}</div>
        {sub && <div className="m-mute" style={{ fontSize: 15, marginTop: 14, maxWidth: 520 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

// Trust row (3 items, hairline borders)
function MTrustRow({ items, mode = "mobile" }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      borderTop: "1px solid var(--m-line)",
      borderBottom: "1px solid var(--m-line)",
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          padding: mode === "desktop" ? "32px 24px" : "20px 12px",
          borderLeft: i > 0 ? "1px solid var(--m-line)" : "none",
          textAlign: "center",
        }}>
          <div style={{ fontSize: mode === "desktop" ? 15 : 12.5, color: "var(--m-ink-hi)", fontWeight: 500, marginBottom: 4 }}>{it.t}</div>
          <div className="m-mute" style={{ fontSize: mode === "desktop" ? 12 : 10.5 }}>{it.s}</div>
        </div>
      ))}
    </div>
  );
}

// Footer used on most desktop pages
function MDesktopFooter() {
  return (
    <footer style={{ padding: "80px 56px 32px", background: "var(--m-bg)", borderTop: "1px solid var(--m-line)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 56 }}>
        <div>
          <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: "0.36em", paddingLeft: "0.36em", color: "var(--m-ink-hi)" }}>AURA</div>
          <div className="m-mute" style={{ fontSize: 13, marginTop: 16, maxWidth: 320 }}>Speciality coffee, roasted weekly in Warsaw. New lots every Wednesday.</div>
          <div style={{ marginTop: 28, maxWidth: 360 }}>
            <div className="m-eyebrow" style={{ marginBottom: 10 }}>Newsletter</div>
            <div style={{ display: "flex", border: "1px solid var(--m-line-2)" }}>
              <input className="m-input" placeholder="your@email" style={{ border: 0, flex: 1, minHeight: 48 }}/>
              <button style={{ all: "unset", cursor: "pointer", padding: "0 20px", display: "flex", alignItems: "center", borderLeft: "1px solid var(--m-line-2)", color: "var(--m-ink-hi)" }}>
                <MIcon.arrow s={18}/>
              </button>
            </div>
          </div>
        </div>
        {[
          { h: "Shop",    items: ["All coffees", "Single origin", "Blends", "Decaf", "Gift card"] },
          { h: "About",   items: ["Our story", "Roastery", "Producers", "Wholesale", "Press"] },
          { h: "Support", items: ["Shipping", "Returns", "Brewing guides", "FAQ", "Contact"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="m-eyebrow" style={{ marginBottom: 20 }}>{c.h}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {c.items.map((it) => <a key={it} style={{ fontSize: 13.5, color: "var(--m-ink)", textDecoration: "none", cursor: "pointer" }}>{it}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 64, paddingTop: 24, borderTop: "1px solid var(--m-line)", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--m-mute-2)" }}>
        <div>© 2026 Aura Coffee Roasters · Warsaw</div>
        <div style={{ display: "flex", gap: 24 }}>
          <a style={{ color: "inherit", textDecoration: "none" }}>Privacy</a>
          <a style={{ color: "inherit", textDecoration: "none" }}>Terms</a>
          <a style={{ color: "inherit", textDecoration: "none" }}>Cookies</a>
        </div>
      </div>
    </footer>
  );
}

// Mobile footer — slim
function MMobileFooter() {
  return (
    <footer style={{ padding: "48px 20px 32px", borderTop: "1px solid var(--m-line)", marginTop: 64 }}>
      <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: "0.32em", paddingLeft: "0.32em" }}>AURA</div>
      <div className="m-mute" style={{ fontSize: 12, marginTop: 12 }}>Roasted in Warsaw · est. 2024</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 32, fontSize: 13 }}>
        {["Shop all", "Blends", "About", "Brewing", "Shipping", "Returns", "FAQ", "Contact"].map((it) => (
          <a key={it} style={{ color: "var(--m-ink)", textDecoration: "none" }}>{it}</a>
        ))}
      </div>
      <div style={{ marginTop: 36, fontSize: 11, color: "var(--m-mute-2)" }}>© 2026 Aura</div>
    </footer>
  );
}

Object.assign(window, {
  MIcon, MStatusBar, MMobileNav, MDesktopNav,
  MImg, MNotes, MStock, MShippingBar,
  MProductCard, MNote, MSectionHead, MTrustRow,
  MDesktopFooter, MMobileFooter,
  btnReset, iconBtn,
});
