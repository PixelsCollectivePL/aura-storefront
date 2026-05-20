// Aura — root app. Wraps each screen with its implementation note,
// arranges everything inside DesignCanvas sections.

function ScreenWithNote({ children, screenW, screenH, note, noteOnSide = "right" }) {
  // Composes a screen frame + an Aura-styled note panel side-by-side,
  // so a single DCArtboard contains both.
  const noteW = 340;
  if (noteOnSide === "below") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24, width: screenW, alignItems: "stretch" }}>
        <div style={{ width: screenW, height: screenH }}>{children}</div>
        <div style={{ width: screenW }}><AuNote {...note} /></div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
      <div style={{ width: screenW, height: screenH }}>{children}</div>
      <div style={{ width: noteW, paddingTop: 8 }}>
        <AuNote {...note} />
      </div>
    </div>
  );
}

function AuraApp() {
  // Notes per screen — kept here so they're scannable next to the canvas.
  const noteMobileHome = {
    title: "Mobile · Homepage",
    sections: [
      { label: "Structure", items: [
        "<strong>Hero</strong> — full-bleed image · season label · serif headline",
        "<strong>Editorial intro</strong> — 30px serif lead + browse link",
        "<strong>This week's pick</strong> — horizontal scroll · 2 cards visible",
        "<strong>Brew ritual shortcuts</strong> — 3-up tiles, type-only",
        "<strong>Origin story</strong> — image + text + journal link",
        "<strong>Trust strip</strong> — 3 mono labels between hairlines",
      ]},
      { label: "Components", items: [
        "<em>StatusBar</em>, <em>MobileNav</em>, <em>HeroBanner</em>, <em>ProductCard</em>, <em>RitualTile</em>, <em>TrustStrip</em>",
        "Reuse <em>ProductCard</em> across home / listing / cart",
      ]},
      { label: "Responsive", items: [
        "Hero h: 520→720 from sm→lg",
        "Pick strip: scroll → 3-col grid ≥md",
        "Edge padding: 16→24→64",
      ]},
      { label: "Next.js / Tailwind", items: [
        "<em>app/(shop)/page.tsx</em> · server component, fetched via Storefront API",
        "<em>HeroBanner</em> uses next/image with <code>priority</code>",
        "Scroll strip: <code>snap-x snap-mandatory</code> on container",
      ]},
      { label: "Animation later", items: [
        "Hero headline: 0.6s reveal, blur(8px)→0, ease-out",
        "Cards: hover lifts hairline border to ink-900 over 140ms",
      ]},
    ],
  };

  const noteMobileList = {
    title: "Mobile · Shop / listing",
    sections: [
      { label: "Structure", items: [
        "Big editorial title (40px serif italic accent)",
        "Filter chips (horizontal scroll)",
        "Sort + count meta row",
        "2-col grid · 32px row gap · 12px column gap",
        "Load-more ghost button",
      ]},
      { label: "Components", items: [
        "<em>FilterChip</em> (active = ink-900 fill)",
        "<em>SortDropdown</em>",
        "<em>ProductCard</em> · same as home",
      ]},
      { label: "Responsive", items: [
        "Grid: 2 → 3 → 4 cols at sm/md/lg",
        "Image aspect locked 4:5",
        "Notes pills truncate after 4",
      ]},
      { label: "Next.js / Tailwind", items: [
        "URL state via <em>useSearchParams</em>: <code>?type=filter&sort=fresh</code>",
        "Server pre-renders filtered list (RSC)",
        "Skeleton card while next page streams",
      ]},
      { label: "Animation later", items: [
        "Cards: stagger fade-in on filter change (40ms each)",
        "Chip selection: ink fills L→R 180ms",
      ]},
    ],
  };

  const noteMobilePDP = {
    title: "Mobile · Product detail",
    sections: [
      { label: "Structure", items: [
        "Hero image · dots indicator",
        "Mono crumb + giant <strong>ONE</strong> · italic subline",
        "Tasting notes row",
        "Price + stock pill",
        "01 Grind (chips) · 02 Size (cards) — numbered = ritual",
        "Brewer's note block (cream-200)",
        "Profile spec table",
        "Freshness banner",
        "<strong>Sticky add-to-basket bar</strong> · 48px qty + primary CTA",
      ]},
      { label: "Components", items: [
        "<em>PDPHero</em>, <em>VariantChips</em>, <em>VariantCards</em>",
        "<em>SpecTable</em> (key/value rows, hairline rules)",
        "<em>QtyStepper</em>, <em>StickyAddBar</em> reused on subscription PDP later",
      ]},
      { label: "Responsive", items: [
        "Sticky bar stays mobile-only",
        "Two-col layout takes over ≥md (see desktop)",
        "Touch targets: min 44×44 always",
      ]},
      { label: "Next.js / Tailwind", items: [
        "<em>app/shop/[handle]/page.tsx</em> · generateStaticParams",
        "Variant state in <em>useState</em>, persisted via search params",
        "<em>StickyAddBar</em>: <code>fixed bottom-0 inset-x-0 pb-[env(safe-area-inset-bottom)]</code>",
      ]},
      { label: "Animation later", items: [
        "Add-to-cart: bag count pulse + soft flash on sticky bar 200ms",
        "Notes pills hover: dot scales 1 → 1.4",
      ]},
    ],
  };

  const noteMobileCart = {
    title: "Mobile · Basket drawer",
    sections: [
      { label: "Structure", items: [
        "Backdrop · dimmed ink-900 with PDP ghost behind",
        "Drawer · ~85% viewport, rounded top",
        "Handle bar · 40×4 stone divider",
        "Header: <strong>Basket</strong> + items count + close",
        "Free shipping progress (always shown, even at 100%)",
        "Item rows · thumb · meta · stepper · remove",
        "Subtotal block (ink) + shipping (moss when free)",
        "Primary checkout CTA · ghost continue-shopping",
      ]},
      { label: "Components", items: [
        "<em>Drawer</em> (motion sheet)",
        "<em>CartLine</em>, <em>QtyStepper</em>, <em>ShippingBar</em>",
        "<em>SummaryBlock</em> · reuses on full-cart and checkout",
      ]},
      { label: "Responsive", items: [
        "Drawer mobile only; ≥md = popover from cart icon",
        "Image thumb 76→96 in popover",
      ]},
      { label: "Next.js / Tailwind", items: [
        "Cart state via <em>cart-context</em> with optimistic mutations",
        "Drawer: Headless UI <em>Dialog</em> + Tailwind transition utils",
        "Shipping threshold from Shopify Markets config",
      ]},
      { label: "Animation later", items: [
        "Drawer: translateY 100% → 0 with ease 280ms",
        "Line add: 220ms slide-down + fade",
        "Free-shipping bar fills L→R when threshold crossed",
      ]},
    ],
  };

  const noteDesktopHome = {
    title: "Desktop · Homepage",
    sections: [
      { label: "Structure", items: [
        "Top nav · brand + 5 links + search + basket",
        "Hero split 50/50 · image L · editorial R (88px serif)",
        "Shelf · 3-col card grid (4:5 image, generous row gap)",
        "Pull-quote editorial block (cream-200, centered italic 48px)",
        "Brew ritual 4-up tiles",
        "Newsletter inside footer · ink-900 invert",
      ]},
      { label: "Components", items: [
        "<em>DesktopNav</em>, <em>HeroSplit</em>, <em>EditorialQuote</em>",
        "<em>ProductCard mode='desktop'</em> · same atoms, larger metrics",
        "<em>Footer</em> with 4-col block + invert newsletter",
      ]},
      { label: "Responsive", items: [
        "Hero stacks vertical on tablet (md), image first",
        "Shelf grid: 3 → 2 → 1 cols (lg → sm)",
        "Brew tiles: 4 → 2 → 2 cols",
      ]},
      { label: "Next.js / Tailwind", items: [
        "Sections become reusable <em>Section</em> wrappers with consistent padding tokens",
        "Footer newsletter posts to Klaviyo via server action",
        "<em>HeroSplit</em>: <code>grid grid-cols-1 md:grid-cols-2</code>",
      ]},
      { label: "Animation later", items: [
        "Hero: image scale 1.02 → 1.0 over 1.2s on load",
        "Quote: italic glyph fades in word-by-word (Framer)",
        "Tiles: hover · border ink-900, label shifts +4px",
      ]},
    ],
  };

  const noteDesktopPDP = {
    title: "Desktop · Product detail",
    sections: [
      { label: "Structure", items: [
        "Slim breadcrumb bar",
        "Two-col main · 55/45 · gallery left, info right",
        "Quick origin specs in 3-up strip (origin / process / altitude)",
        "Variant pickers stack vertically: 01 Grind · 02 Size",
        "Total + primary CTA + save · trust line under",
        "Below: profile spec table + brewing card grid + freshness card",
      ]},
      { label: "Components", items: [
        "<em>Gallery</em> (main + 4 thumbs)",
        "<em>VariantChips</em>, <em>VariantCards</em>, <em>SpecTable</em>",
        "<em>BrewMethodCard</em>",
      ]},
      { label: "Responsive", items: [
        "Two-col → stacked at md; gallery moves to top",
        "Spec table → 2-col → 1-col",
        "On mobile the sticky bar from mobile PDP takes over",
      ]},
      { label: "Next.js / Tailwind", items: [
        "Page = RSC with client island for variant state",
        "Cart action: server action that mutates Shopify cart, optimistic UI",
        "Image: <em>next/image fill</em> + <code>object-cover</code>",
      ]},
      { label: "Animation later", items: [
        "Thumbnail click: main image crossfade 220ms",
        "Add-to-basket: button morphs into 'Added ✓' for 1.4s, then resets",
        "Spec rows: stagger reveal on scroll-into-view",
      ]},
    ],
  };

  return (
    <DesignCanvas>
      <DCSection
        id="direction"
        title="Style direction · v1"
        subtitle="The first visual position. Palette, type, spacing, components."
      >
        <DCArtboard id="direction-1" label="Direction" width={1440} height={2720}>
          <AuStyleDirection />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="mobile"
        title="Mobile · the spine of the shop"
        subtitle="390 wide · iPhone safe area · sticky add-to-cart on PDP"
      >
        <DCArtboard id="m-home" label="01 · Homepage" width={760} height={2280}>
          <ScreenWithNote screenW={390} screenH={2280} note={noteMobileHome}>
            <AuMobileHome/>
          </ScreenWithNote>
        </DCArtboard>

        <DCArtboard id="m-list" label="02 · Shop · listing" width={760} height={1480}>
          <ScreenWithNote screenW={390} screenH={1480} note={noteMobileList}>
            <AuMobileListing/>
          </ScreenWithNote>
        </DCArtboard>

        <DCArtboard id="m-pdp" label="03 · Product detail" width={760} height={1820}>
          <ScreenWithNote screenW={390} screenH={1820} note={noteMobilePDP}>
            <AuMobilePDP/>
          </ScreenWithNote>
        </DCArtboard>

        <DCArtboard id="m-cart" label="04 · Basket drawer" width={760} height={844}>
          <ScreenWithNote screenW={390} screenH={844} note={noteMobileCart}>
            <AuMobileCart/>
          </ScreenWithNote>
        </DCArtboard>
      </DCSection>

      <DCSection
        id="desktop"
        title="Desktop · the editorial face"
        subtitle="1440 wide · magazine spacing · asymmetric heroes"
      >
        <DCArtboard id="d-home" label="05 · Homepage" width={1840} height={3080}>
          <ScreenWithNote screenW={1440} screenH={3080} note={noteDesktopHome}>
            <AuDesktopHome/>
          </ScreenWithNote>
        </DCArtboard>

        <DCArtboard id="d-pdp" label="06 · Product detail" width={1840} height={1920}>
          <ScreenWithNote screenW={1440} screenH={1920} note={noteDesktopPDP}>
            <AuDesktopPDP/>
          </ScreenWithNote>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AuraApp />);
