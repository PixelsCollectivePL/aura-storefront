// Aura — shared UI primitives: icons, nav chrome, product card, notes pills.
// Kept light: no styles object collisions; everything pulls from aura-tokens.css.

// --- Icons (hairline, 1.5 stroke) -------------------------------------------
const AuIcon = {
  menu:  (p) => <svg viewBox="0 0 24 24" width={p?.s||22} height={p?.s||22} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M4 8h16M4 16h16"/></svg>,
  close: (p) => <svg viewBox="0 0 24 24" width={p?.s||22} height={p?.s||22} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 5l14 14M19 5L5 19"/></svg>,
  bag:   (p) => <svg viewBox="0 0 24 24" width={p?.s||22} height={p?.s||22} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 7h14l-1 13H6L5 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>,
  search:(p) => <svg viewBox="0 0 24 24" width={p?.s||22} height={p?.s||22} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="6"/><path d="m20 20-4-4"/></svg>,
  back:  (p) => <svg viewBox="0 0 24 24" width={p?.s||22} height={p?.s||22} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M14 6l-6 6 6 6"/></svg>,
  arrow: (p) => <svg viewBox="0 0 24 24" width={p?.s||16} height={p?.s||16} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M5 12h14M14 6l6 6-6 6"/></svg>,
  plus:  (p) => <svg viewBox="0 0 24 24" width={p?.s||16} height={p?.s||16} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14"/></svg>,
  minus: (p) => <svg viewBox="0 0 24 24" width={p?.s||16} height={p?.s||16} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14"/></svg>,
  drop:  (p) => <svg viewBox="0 0 24 24" width={p?.s||14} height={p?.s||14} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11Z"/></svg>,
  leaf:  (p) => <svg viewBox="0 0 24 24" width={p?.s||14} height={p?.s||14} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 20c0-8 6-14 16-16-2 10-8 16-16 16Z"/><path d="M4 20c4-4 8-7 12-9"/></svg>,
  check: (p) => <svg viewBox="0 0 24 24" width={p?.s||14} height={p?.s||14} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square"><path d="M5 12l4 4 10-10"/></svg>,
  star:  (p) => <svg viewBox="0 0 24 24" width={p?.s||12} height={p?.s||12} fill="currentColor"><path d="M12 2l2.9 6.4 6.6.6-5 4.6 1.5 6.7L12 16.9 6 20.3l1.5-6.7-5-4.6 6.6-.6L12 2Z"/></svg>,
};

// --- Status bar (iOS-style, simplified, monochrome ink) ---------------------
function AuStatusBar({ time = "9:41", tone = "dark" }) {
  const color = tone === "light" ? "#F5F0E5" : "var(--au-ink-900)";
  return (
    <div className="au-status" style={{ color, height: 44 }}>
      <span>{time}</span>
      <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill={color}>
          <rect x="0" y="7" width="3" height="4" rx="0.5"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.5"/>
          <rect x="9" y="3" width="3" height="8" rx="0.5"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5"/>
        </svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke={color} strokeWidth="1.2">
          <path d="M1 4.2a10 10 0 0 1 13 0"/>
          <path d="M3.2 6.2a7 7 0 0 1 8.6 0"/>
          <path d="M5.4 8.2a4 4 0 0 1 4.2 0"/>
          <circle cx="7.5" cy="10" r="0.7" fill={color}/>
        </svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none" stroke={color} strokeWidth="1">
          <rect x="0.5" y="0.5" width="22" height="11" rx="2.5"/>
          <rect x="23.5" y="3.5" width="2" height="5" rx="1" fill={color}/>
          <rect x="2" y="2" width="18" height="8" rx="1.2" fill={color}/>
        </svg>
      </span>
    </div>
  );
}

// --- Mobile top nav ---------------------------------------------------------
function AuMobileNav({ title = "AURA", showBack = false, count = 0, tone = "dark" }) {
  const ink = tone === "light" ? "#F5F0E5" : "var(--au-ink-900)";
  return (
    <div style={{
      height: 56, padding: "0 18px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      color: ink,
      position: "relative", zIndex: 2,
    }}>
      <button style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, marginLeft: -8 }}>
        {showBack ? <AuIcon.back /> : <AuIcon.menu />}
      </button>
      <div className="au-serif" style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
        fontSize: 19, letterSpacing: "0.36em", paddingLeft: "0.36em",
      }}>
        {title}
      </div>
      <button style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, width: 36, height: 36, justifyContent: "center", marginRight: -8, position: "relative" }}>
        <AuIcon.bag />
        {count > 0 && (
          <span className="au-mono" style={{
            position: "absolute", top: 4, right: 4,
            background: "var(--au-ember)", color: "#fff",
            fontSize: 9, fontWeight: 600,
            width: 14, height: 14, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            letterSpacing: 0,
          }}>{count}</span>
        )}
      </button>
    </div>
  );
}

// --- Desktop top nav --------------------------------------------------------
function AuDesktopNav({ active = "Shop", count = 2 }) {
  const items = ["Shop", "Subscription", "Journal", "Brewing", "About"];
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "26px 56px",
      borderBottom: "1px solid var(--au-cream-300)",
      background: "var(--au-cream-100)",
      position: "relative", zIndex: 2,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
        <div className="au-serif" style={{ fontSize: 22, letterSpacing: "0.4em", paddingLeft: "0.4em" }}>AURA</div>
        <nav style={{ display: "flex", gap: 32 }}>
          {items.map((n) => (
            <a key={n} className="au-mono-up" style={{
              fontSize: 11,
              color: n === active ? "var(--au-ink-900)" : "var(--au-stone-500)",
              cursor: "pointer",
              borderBottom: n === active ? "1px solid var(--au-ink-900)" : "1px solid transparent",
              paddingBottom: 4, textDecoration: "none",
            }}>{n}</a>
          ))}
        </nav>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button className="au-mono-up" style={{ all: "unset", cursor: "pointer", fontSize: 11, color: "var(--au-stone-500)", padding: "8px 12px" }}>Search</button>
        <button className="au-mono-up" style={{ all: "unset", cursor: "pointer", fontSize: 11, color: "var(--au-stone-500)", padding: "8px 12px" }}>EN · PLN</button>
        <button className="au-mono-up" style={{
          background: "var(--au-ink-900)", color: "var(--au-cream-50)",
          border: 0, cursor: "pointer", padding: "10px 16px",
          fontSize: 11, fontFamily: "var(--au-mono)",
          letterSpacing: "0.14em", textTransform: "uppercase",
          borderRadius: "var(--au-r-sm)",
          display: "inline-flex", alignItems: "center", gap: 10,
        }}>
          Basket <span style={{ opacity: 0.6 }}>({count})</span>
        </button>
      </div>
    </div>
  );
}

// --- Tasting notes row ------------------------------------------------------
function AuNotes({ notes = [], size = "md" }) {
  const tones = ["ember", "cherry", "moss", "ember"];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {notes.map((n, i) => (
        <span key={i} className={"au-note " + tones[i % tones.length]} style={{ fontSize: size === "sm" ? 10.5 : 11.5, padding: size === "sm" ? "4px 8px 4px 7px" : "5px 10px 5px 8px" }}>
          <span className="dot"/>{n}
        </span>
      ))}
    </div>
  );
}

// --- Image slot wrapper (using <image-slot> web component) ------------------
function AuImg({ id, w, h, shape = "rounded", radius = 4, placeholder = "Product image", style = {} }) {
  return (
    <image-slot
      id={id}
      shape={shape}
      radius={String(radius)}
      placeholder={placeholder}
      style={{ width: w || "100%", height: h || "100%", display: "block", ...style }}
    />
  );
}

// --- Product mini card (mobile listing) -------------------------------------
function AuProductCard({ code, name, origin, notes, price, gram = "250 g", slotId, mode = "mobile" }) {
  const imgH = mode === "desktop" ? 360 : 200;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: "var(--au-cream-200)", height: imgH, position: "relative", overflow: "hidden", borderRadius: "var(--au-r-sm)" }}>
        <AuImg id={slotId} w="100%" h="100%" radius={4} placeholder={`Lot ${code}`} />
        <span className="au-mono-up" style={{ position: "absolute", top: 10, left: 10, fontSize: 9.5, color: "var(--au-ink-900)", background: "var(--au-cream-50)", padding: "4px 6px", borderRadius: 2 }}>{code}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div className="au-serif" style={{ fontSize: mode === "desktop" ? 26 : 20, lineHeight: 1.1 }}>{name}</div>
          <div className="au-mono" style={{ fontSize: 10.5, color: "var(--au-stone-500)", marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>{origin}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="au-mono" style={{ fontSize: 13, color: "var(--au-ink-900)" }}>{price} zł</div>
          <div className="au-mono" style={{ fontSize: 9.5, color: "var(--au-stone-500)", marginTop: 2, letterSpacing: "0.1em" }}>{gram}</div>
        </div>
      </div>
      <div className="au-serif-it" style={{ fontSize: 13, color: "var(--au-ink-700)", lineHeight: 1.35, marginTop: -2 }}>
        {notes}
      </div>
    </div>
  );
}

// --- Postit note rendered next to artboards ---------------------------------
function AuNote({ title, sections }) {
  // sections: [{ label: 'STRUCTURE', items: ['...', '...'] }, ...]
  return (
    <div className="au-notepad">
      <h4>{title}</h4>
      {sections.map((s, i) => (
        <div key={i}>
          <div className="sub">{s.label}</div>
          <ul>
            {s.items.map((it, j) => <li key={j} dangerouslySetInnerHTML={{__html: it}}/>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  AuIcon, AuStatusBar, AuMobileNav, AuDesktopNav,
  AuNotes, AuImg, AuProductCard, AuNote,
});
