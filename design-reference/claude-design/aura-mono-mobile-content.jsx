// AURA v2 — mobile content pages: About, FAQ / Shipping / Returns.

// ============================================================================
// 8) MOBILE ABOUT
// ============================================================================
function MMAbout() {
  return (
    <div className="m-frame" style={{ width: 390, minHeight: 2400 }}>
      <MStatusBar/>
      <MMobileNav count={0} title="AURA"/>

      {/* Hero */}
      <div style={{ padding: "16px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 16 }}>About</div>
        <div className="m-display" style={{ fontSize: 56 }}>
          Six lots.<br/>One small<br/>roastery.
        </div>
        <div className="m-mute" style={{ fontSize: 15, lineHeight: 1.6, marginTop: 22, maxWidth: 340 }}>
          Aura is a two-person studio in Warsaw. We roast speciality coffee on a 5 kg drum every Wednesday and ship before Friday. Nothing is older than a week when it leaves us.
        </div>
      </div>

      {/* Hero image */}
      <div style={{ height: 460, background: "var(--m-bg-soft)", marginTop: 36, overflow: "hidden" }}>
        <MImg id="v2-m-about-hero" placeholder="Roastery interior"/>
      </div>

      {/* Story — long-form */}
      <div style={{ padding: "60px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>The story</div>
        <div style={{ fontSize: 15, lineHeight: 1.65, color: "var(--m-ink)", display: "flex", flexDirection: "column", gap: 18 }}>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--m-ink-hi)" }}>We started Aura in 2024</strong> because we wanted the coffee we drink at home to taste like the cups we'd been making for years behind a bar.</p>
          <p style={{ margin: 0 }}>Most coffee on Polish supermarket shelves is two months old by the time it hits espresso. We thought we could do better — at a small scale, where every bag is traceable to a Wednesday and a name.</p>
          <p style={{ margin: 0 }}>Six lots is the right number for us. Enough variety to taste the world. Few enough that we know every grower personally, and roast each profile until it sings.</p>
        </div>
      </div>

      {/* Numbers */}
      <div style={{ padding: "64px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 18 }}>By the numbers</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {[
            { n: "06", l: "Active lots" },
            { n: "72h", l: "From roast to dispatch" },
            { n: "5 kg", l: "Drum capacity" },
            { n: "2024", l: "Roasting since" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "28px 16px", borderTop: "1px solid var(--m-line)", borderLeft: i % 2 === 1 ? "1px solid var(--m-line)" : "none", borderBottom: i >= 2 ? "1px solid var(--m-line)" : "none" }}>
              <div className="m-display m-num" style={{ fontSize: 44 }}>{s.n}</div>
              <div className="m-mute" style={{ fontSize: 11.5, marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* People */}
      <div style={{ padding: "64px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 18 }}>The two of us</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { n: "Marta",  r: "Head roaster", id: "v2-m-about-p1" },
            { n: "Tomasz", r: "Sourcing",     id: "v2-m-about-p2" },
          ].map((p) => (
            <div key={p.n}>
              <div style={{ height: 200, background: "var(--m-bg-soft)", overflow: "hidden" }}>
                <MImg id={p.id} placeholder={p.n}/>
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="m-h3" style={{ fontSize: 16 }}>{p.n}</div>
                <div className="m-mute" style={{ fontSize: 12, marginTop: 3 }}>{p.r}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Producer map (placeholder) */}
      <div style={{ padding: "64px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>Where it comes from</div>
        <div className="m-h2" style={{ fontSize: 26, marginBottom: 20 }}>Six farms, three continents.</div>
        <div style={{ height: 200, background: "var(--m-bg-soft)", overflow: "hidden", marginBottom: 24 }}>
          <MImg id="v2-m-about-map" placeholder="World map · pins"/>
        </div>
        {[
          ["Ethiopia",  "Konga · Yirgacheffe"],
          ["Colombia",  "La Esperanza · Huila"],
          ["Kenya",     "Tegu · Nyeri"],
          ["Brazil",    "Fazenda Rainha · decaf"],
        ].map(([c, p]) => (
          <div key={c} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--m-line)" }}>
            <span style={{ fontSize: 14, color: "var(--m-ink-hi)" }}>{c}</span>
            <span className="m-meta">{p}</span>
          </div>
        ))}
      </div>

      {/* CTA strip */}
      <div style={{ padding: "64px 20px 0" }}>
        <div className="m-h2" style={{ fontSize: 30, marginBottom: 16 }}>Visit the roastery.</div>
        <div className="m-mute" style={{ fontSize: 14.5, lineHeight: 1.55, marginBottom: 24 }}>
          Open Wednesday-Saturday, 10:00 – 17:00. Ul. Targowa 22, Warsaw. Walk in, taste what's on the cupping table.
        </div>
        <button className="m-btn m-btn-secondary" style={{ width: "100%" }}>Get directions <MIcon.arrow s={16}/></button>
      </div>

      <MMobileFooter/>
    </div>
  );
}

// ============================================================================
// 9) MOBILE FAQ / SHIPPING / RETURNS
// ============================================================================
function MMFAQ() {
  const Acc = ({ q, a, open = false }) => (
    <details open={open} style={{ borderTop: "1px solid var(--m-line)" }}>
      <summary style={{ listStyle: "none", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, cursor: "pointer" }}>
        <span style={{ fontSize: 15, color: "var(--m-ink-hi)", fontWeight: 500, lineHeight: 1.4, flex: 1 }}>{q}</span>
        <span style={{ width: 14, height: 14, position: "relative", flexShrink: 0, marginTop: 3 }}>
          <span style={{ position: "absolute", top: 6, left: 0, right: 0, height: 1, background: "var(--m-ink-hi)" }}/>
          {!open && <span style={{ position: "absolute", left: 6, top: 0, bottom: 0, width: 1, background: "var(--m-ink-hi)" }}/>}
        </span>
      </summary>
      <div style={{ fontSize: 13.5, color: "var(--m-mute-2)", lineHeight: 1.6, paddingBottom: 24, paddingRight: 28 }}>{a}</div>
    </details>
  );

  return (
    <div className="m-frame" style={{ width: 390, minHeight: 2200 }}>
      <MStatusBar/>
      <MMobileNav count={0} title="AURA"/>

      {/* Header */}
      <div style={{ padding: "16px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>Help</div>
        <div className="m-display" style={{ fontSize: 48 }}>Shipping, returns,<br/>and the small print.</div>
      </div>

      {/* Quick tiles */}
      <div style={{ padding: "32px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { t: "Free over 150 zł", s: "Poland" },
          { t: "2–3 days",         s: "PL delivery" },
          { t: "Within 72 h",      s: "From roasting" },
          { t: "30-day return",    s: "Unopened bags" },
        ].map((q, i) => (
          <div key={i} style={{ border: "1px solid var(--m-line)", padding: "18px 16px" }}>
            <div className="m-h3" style={{ fontSize: 17, marginBottom: 4 }}>{q.t}</div>
            <div className="m-mute" style={{ fontSize: 11.5 }}>{q.s}</div>
          </div>
        ))}
      </div>

      {/* In-page nav */}
      <div style={{ padding: "40px 20px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[
          { l: "Shipping", a: true },
          { l: "Returns" },
          { l: "Freshness" },
          { l: "Payments" },
          { l: "Account" },
        ].map((c) => (
          <button key={c.l} className="m-chip" data-active={c.a ? "true" : "false"}>{c.l}</button>
        ))}
      </div>

      {/* Shipping section */}
      <div style={{ padding: "32px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>01 — Shipping</div>
        <Acc open q="When will my order ship?" a="We roast on Wednesdays and ship within 72 hours. Order before noon on Wednesday for same-week dispatch — anything later ships the following Wednesday." />
        <Acc q="How much does delivery cost?" a="Poland: free over 150 zł, otherwise 14 zł (InPost). EU: 28 zł, 4–6 business days. UK & non-EU: contact us for a quote." />
        <Acc q="Can I track my parcel?" a="Yes — we send the tracking number by email the moment the courier picks the parcel up." />
      </div>

      {/* Returns section */}
      <div style={{ padding: "40px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>02 — Returns</div>
        <Acc q="Can I return coffee?" a="Yes. Unopened bags within 30 days for a full refund. For opened bags, if you're not satisfied, write us at hello@aura.coffee and we'll make it right." />
        <Acc q="What if my coffee arrives stale?" a="That shouldn't happen — but if it does, we replace your bag, no questions asked. Just send us a photo of the bag with the roast date visible." />
      </div>

      {/* Freshness section */}
      <div style={{ padding: "40px 20px 0" }}>
        <div className="m-eyebrow" style={{ marginBottom: 14 }}>03 — Freshness</div>
        <Acc q="When is coffee 'fresh'?" a="Speciality coffee is at its best between 7–30 days after roasting. We ship within 72 hours of roasting, so you have the full window to enjoy it." />
        <Acc q="How should I store it?" a="In the original valve bag, sealed, at room temperature. Avoid the fridge. Decant into glass only after opening." />
      </div>

      {/* Still need help */}
      <div style={{ padding: "64px 20px 0" }}>
        <div className="m-h2" style={{ fontSize: 26, marginBottom: 8 }}>Still need help?</div>
        <div className="m-mute" style={{ fontSize: 13.5, marginBottom: 20 }}>We answer emails within a working day.</div>
        <button className="m-btn m-btn-secondary" style={{ width: "100%" }}>Email us <MIcon.arrow s={16}/></button>
      </div>

      <MMobileFooter/>
    </div>
  );
}

Object.assign(window, { MMAbout, MMFAQ });
