// AURA v2 — root: arranges all 17 screens with implementation notes.

function ScreenWithNote2({ children, screenW, screenH, note }) {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ width: screenW, minHeight: screenH, height: screenH }}>{children}</div>
      <div style={{ width: 340, paddingTop: 8 }}>
        <MNote {...note} />
      </div>
    </div>
  );
}

// Mobile-only notes are concise (priority is the screens themselves)
const NOTES = {
  mHome: {
    title: "Mobile · Homepage",
    sections: [
      { label: "Sections", items: [
        "<strong>Hero</strong> — type-first, single CTA",
        "Full-bleed hero image",
        "<strong>This season</strong> — 2×2 product grid",
        "<strong>How it works</strong> — 3 numbered rows",
        "<strong>Compare</strong> — mini blend table",
        "<strong>Promise</strong> — freshness statement + image",
        "Reviews · Trust strip · Footer",
      ]},
      { label: "Components", items: [
        "<em>ProductCard</em> (used 4× here)",
        "<em>TrustRow</em>, <em>NumberedSteps</em>, <em>CompareTable</em>",
      ]},
      { label: "Next.js / Tailwind", items: [
        "<em>app/(shop)/page.tsx</em> · RSC, Storefront API",
        "Sections as reusable <code>&lt;Section&gt;</code> wrappers",
        "Image: <em>next/image priority</em> for hero only",
      ]},
    ],
  },

  mListing: {
    title: "Mobile · Shop · listing",
    sections: [
      { label: "Sections", items: [
        "Editorial title block",
        "Horizontal-scroll filter chips",
        "Filter / Sort row (44px tap targets)",
        "<strong>2-col grid</strong> · 36px row gap",
        "Load more ghost button",
      ]},
      { label: "UX details", items: [
        "Sold-out tag top-left on image",
        "Selected filter count next to icon",
        "Active sort spelled out, not just iconified",
      ]},
      { label: "Next.js / Tailwind", items: [
        "URL state: <code>?type=…&sort=…</code>",
        "Filter drawer opens as bottom sheet",
        "Grid: <code>grid-cols-2 sm:grid-cols-3 lg:grid-cols-4</code>",
      ]},
    ],
  },

  mPDP: {
    title: "Mobile · Product detail",
    sections: [
      { label: "Sections", items: [
        "Image gallery (h:460) + dot indicator",
        "Title · notes · price + stock pill",
        "01 Grind (chips) · 02 Size (tiles) — numbered",
        "Recommended brew block",
        "Profile spec table",
        "Shipping + freshness",
        "Similar coffees",
        "<strong>Sticky add-to-basket bar</strong>",
      ]},
      { label: "UX details", items: [
        "Microcopy under variants (\"ground morning of dispatch\")",
        "Stock count visible (\"24 left\")",
        "Heart in top-right of title row",
        "Sticky bar shows total + qty stepper",
      ]},
      { label: "Next.js / Tailwind", items: [
        "<em>app/shop/[handle]/page.tsx</em> · generateStaticParams",
        "Variant state in client island",
        "Sticky bar: <code>fixed bottom-0 inset-x-0 pb-[env(safe-area-inset-bottom)]</code>",
      ]},
    ],
  },

  mCart: {
    title: "Mobile · Basket drawer",
    sections: [
      { label: "Sections", items: [
        "Drawer · 84% viewport, slides from bottom",
        "Handle bar · header with count",
        "Free shipping progress (1px line, fills L→R)",
        "Line items · 84×84 thumbs · stepper · remove",
        "Summary block · subtotal + shipping",
        "Primary CTA Checkout · ghost Continue shopping",
        "Toast at top: \"Added FIVE\" with Undo",
      ]},
      { label: "Components", items: [
        "<em>Drawer</em>, <em>CartLine</em>, <em>QtyStepper</em>",
        "<em>ShippingBar</em>, <em>SummaryBlock</em>, <em>Toast</em>",
      ]},
      { label: "Next.js / Tailwind", items: [
        "Cart context with optimistic mutations",
        "Headless UI <em>Dialog</em> as drawer",
        "Toast auto-dismiss 4s (visible state shown here)",
      ]},
    ],
  },

  mEmpty: {
    title: "Mobile · Empty cart",
    sections: [
      { label: "Sections", items: [
        "Typographic empty state (no illustration)",
        "Vertical hairline divider as visual breath",
        "Big headline + supportive copy",
        "Two CTAs: primary Shop all, ghost Browse blends",
        "Suggested coffees (2-col)",
      ]},
      { label: "Notes", items: [
        "No emoji, no sad-cart-icon — type-only restraint",
        "Same page chrome as filled cart (consistency)",
      ]},
    ],
  },

  mMenu: {
    title: "Mobile · Menu drawer",
    sections: [
      { label: "Sections", items: [
        "Numbered nav items (large serif-less display)",
        "Each row · label + tiny description",
        "Account & Basket as utility rows",
        "Locale row pinned at bottom",
      ]},
      { label: "UX details", items: [
        "Numbered 01–05 — gives shop a sense of order",
        "Chevron right hints depth on nav, count on basket",
      ]},
    ],
  },

  mSearch: {
    title: "Mobile · Search overlay",
    sections: [
      { label: "Sections", items: [
        "Input row with chip suggestions when typing",
        "Live product results with matched-term highlight",
        "Try-also chips",
        "Pages section (about, shipping, etc)",
      ]},
      { label: "UX details", items: [
        "Black highlight on matched query term",
        "Cancel link → back to previous view",
        "Type-ahead is debounced 120ms in production",
      ]},
    ],
  },

  mAbout: {
    title: "Mobile · About",
    sections: [
      { label: "Sections", items: [
        "Editorial hero · 3-line display",
        "Full-bleed image",
        "Story · 3 paragraphs · 15px",
        "By the numbers · 2×2 grid · big numerals",
        "Team · 2-up portrait grid",
        "Producer map · destinations table",
        "Visit roastery CTA",
      ]},
      { label: "Next.js / Tailwind", items: [
        "<em>app/about/page.tsx</em> · static RSC",
        "Image lazy-load except hero",
      ]},
    ],
  },

  mFAQ: {
    title: "Mobile · FAQ / Shipping / Returns",
    sections: [
      { label: "Sections", items: [
        "Display headline",
        "Quick-fact tiles (4-up)",
        "Topic chips for filtering",
        "Accordion sections by topic · custom +/− toggle",
        "\"Still need help\" CTA",
      ]},
      { label: "UX details", items: [
        "Plus → minus glyph instead of chevron — feels intentional",
        "Open state default for first item",
      ]},
      { label: "Next.js / Tailwind", items: [
        "Static MDX content collection per topic",
        "<code>&lt;details&gt;</code> + custom marker styling",
      ]},
    ],
  },

  dHome: {
    title: "Desktop · Homepage",
    sections: [
      { label: "Sections", items: [
        "Hero · 50/50 split, type-left/image-right",
        "Shelf · 3-col product grid · 60px row gap",
        "<strong>Compare table</strong> (on cream-soft band)",
        "How it works · 3 numbered hairline-topped columns",
        "<strong>Promise</strong> · inverted black panel",
        "Reviews · 3-col hairline-topped",
        "Footer · 4-col + newsletter",
      ]},
      { label: "Components", items: [
        "<em>HeroSplit</em>, <em>SectionHead</em>, <em>CompareTable</em>",
        "<em>NumberedSteps</em>, <em>InversePromise</em>, <em>ReviewTriplet</em>",
      ]},
      { label: "Next.js / Tailwind", items: [
        "Section wrappers w/ canonical padding tokens",
        "Inverted section: <code>bg-black text-white</code>, isolated from rest",
        "Footer newsletter via server action",
      ]},
    ],
  },

  dListing: {
    title: "Desktop · Shop · listing",
    sections: [
      { label: "Sections", items: [
        "Breadcrumb · slim",
        "Title + supportive copy in 50/50 grid",
        "Toolbar · chips left, more-filters & sort right",
        "Result count",
        "<strong>3-col product grid</strong> · 60px row gap",
        "Quick add appears on card hover (shown here on TWO)",
        "Trust row · 4-up · before footer",
      ]},
      { label: "UX details", items: [
        "Selected filter count badge on chips & more-filters",
        "Sort spelled out, not just iconified",
        "Sold-out tag top-left (e.g. SIX · decaf)",
      ]},
      { label: "Next.js / Tailwind", items: [
        "Filter state via search params (URL-shareable)",
        "Cards: hover state in CSS (no JS) — border darkens 120ms",
      ]},
    ],
  },

  dPDP: {
    title: "Desktop · Product detail",
    sections: [
      { label: "Sections", items: [
        "Breadcrumb",
        "Two-col main · gallery left (with thumb rail), info right",
        "Quick specs strip (roast/process/altitude)",
        "01 Grind (chips) · 02 Size (tiles)",
        "Qty + Total + Add to basket + favourite",
        "Trust list under CTA",
        "Profile spec table · Brewing 2×2 cards · Freshness card",
        "Similar coffees 3-up",
      ]},
      { label: "UX details", items: [
        "Vertical thumbnail rail (not below) — feels Aesop-like",
        "Lot meta visible top-left of main image",
        "Heart isolated as 60×60 ghost button next to CTA",
      ]},
      { label: "Next.js / Tailwind", items: [
        "Page = RSC + client island for variants",
        "Cart action: server action with optimistic UI",
        "<em>next/image fill</em>, gallery state in client",
      ]},
    ],
  },

  dCart: {
    title: "Desktop · Cart panel",
    sections: [
      { label: "Sections", items: [
        "Right-side panel · 480 wide",
        "Header · title + items + bag-weight meta",
        "Shipping progress on soft band",
        "<strong>Add-to-cart toast</strong> at top of items",
        "Item rows · 96×96 thumbs",
        "<strong>Cross-sell row</strong> · filters at threshold",
        "Summary · 60px primary CTA",
      ]},
      { label: "UX details", items: [
        "Toast persists in panel until dismissed (not auto-hide here)",
        "Cross-sell only appears when over free-shipping threshold",
      ]},
      { label: "Next.js / Tailwind", items: [
        "Headless UI <em>Dialog</em> with side transition",
        "Optimistic add → server action → toast on success",
      ]},
    ],
  },

  dHeader: {
    title: "Desktop · Header · mega menu open",
    sections: [
      { label: "Sections", items: [
        "Announcement bar · ink-inverted",
        "Main nav row · brand left, centred links, utilities right",
        "<strong>Mega menu</strong> open under Shop",
        "  - Curated feature card (left)",
        "  - 3 columns: by roast, by brew, by origin",
      ]},
      { label: "UX details", items: [
        "Each link row shows count or short descriptor",
        "Active state · single hairline under nav item",
        "Account icon shown beside cart for known users",
      ]},
      { label: "Next.js / Tailwind", items: [
        "Mega menu opens on hover (desktop) and tap (touch laptops)",
        "Categories driven from Shopify collections",
      ]},
    ],
  },

  dSearch: {
    title: "Desktop · Search overlay",
    sections: [
      { label: "Sections", items: [
        "Top sheet from header · brand still visible",
        "Large input · 32px display weight",
        "Three columns: Suggested · Coffees 2-up",
        "Matched-term highlight in product origin",
      ]},
      { label: "UX details", items: [
        "Suggestions slide in as you type (each its own row)",
        "Esc closes overlay",
        "Click outside dim to dismiss",
      ]},
    ],
  },

  dAbout: {
    title: "Desktop · About",
    sections: [
      { label: "Sections", items: [
        "Editorial hero · 50/50",
        "Full-bleed image",
        "Long-form story · 1/3 sidebar + 2/3 column",
        "Stats strip · 4-up · giant numerals",
        "Team · 2-up portrait grid",
        "Visit · soft band, 2-col with map",
      ]},
      { label: "Notes", items: [
        "No background colour gymnastics — single soft band for Visit",
        "Big numerals as typographic anchors",
      ]},
    ],
  },

  dFAQ: {
    title: "Desktop · FAQ / Shipping / Returns",
    sections: [
      { label: "Sections", items: [
        "Hero with supportive copy + email CTA",
        "Quick stats trust row",
        "<strong>Sticky sidebar</strong> with topic list",
        "Accordion content grouped by topic",
        "Plus/minus glyph instead of chevron",
      ]},
      { label: "Next.js / Tailwind", items: [
        "<em>sticky top-24</em> on sidebar with smooth-scroll anchors",
        "MDX content per topic file",
      ]},
    ],
  },
};

function AuraV2App() {
  return (
    <DesignCanvas>
      <DCSection
        id="mobile"
        title="Mobile · the spine"
        subtitle="390 wide. Mobile-first. Nine screens covering shop, cart states, navigation, content."
      >
        <DCArtboard id="m-home" label="01 · Homepage"        width={760} height={4400}><ScreenWithNote2 screenW={390} screenH={4400} note={NOTES.mHome}><MMHome/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="m-list" label="02 · Shop · listing"  width={760} height={2100}><ScreenWithNote2 screenW={390} screenH={2100} note={NOTES.mListing}><MMListing/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="m-pdp"  label="03 · Product detail"  width={760} height={2400}><ScreenWithNote2 screenW={390} screenH={2400} note={NOTES.mPDP}><MMPDP/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="m-cart" label="04 · Basket drawer"   width={760} height={844}><ScreenWithNote2 screenW={390} screenH={844} note={NOTES.mCart}><MMCartDrawer/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="m-empty" label="05 · Empty cart"     width={760} height={1700}><ScreenWithNote2 screenW={390} screenH={1700} note={NOTES.mEmpty}><MMEmpty/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="m-menu" label="06 · Menu drawer"     width={760} height={844}><ScreenWithNote2 screenW={390} screenH={844} note={NOTES.mMenu}><MMMenu/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="m-search" label="07 · Search overlay" width={760} height={844}><ScreenWithNote2 screenW={390} screenH={844} note={NOTES.mSearch}><MMSearch/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="m-about" label="08 · About"           width={760} height={3300}><ScreenWithNote2 screenW={390} screenH={3300} note={NOTES.mAbout}><MMAbout/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="m-faq"   label="09 · FAQ · shipping"  width={760} height={2400}><ScreenWithNote2 screenW={390} screenH={2400} note={NOTES.mFAQ}><MMFAQ/></ScreenWithNote2></DCArtboard>
      </DCSection>

      <DCSection
        id="desktop"
        title="Desktop · the editorial face"
        subtitle="1440 wide. Asymmetric heroes, magazine spacing, restrained mono palette."
      >
        <DCArtboard id="d-home"   label="01 · Homepage"           width={1840} height={5150}><ScreenWithNote2 screenW={1440} screenH={5150} note={NOTES.dHome}><MDHome/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="d-list"   label="02 · Shop · listing"     width={1840} height={2400}><ScreenWithNote2 screenW={1440} screenH={2400} note={NOTES.dListing}><MDListing/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="d-pdp"    label="03 · Product detail"     width={1840} height={3200}><ScreenWithNote2 screenW={1440} screenH={3200} note={NOTES.dPDP}><MDPDP/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="d-cart"   label="04 · Cart side panel"    width={1840} height={900}><ScreenWithNote2 screenW={1440} screenH={900} note={NOTES.dCart}><MDCart/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="d-header" label="05 · Header · mega menu" width={1840} height={760}><ScreenWithNote2 screenW={1440} screenH={760} note={NOTES.dHeader}><MDHeaderDetail/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="d-search" label="06 · Search overlay"     width={1840} height={760}><ScreenWithNote2 screenW={1440} screenH={760} note={NOTES.dSearch}><MDSearch/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="d-about"  label="07 · About"              width={1840} height={4400}><ScreenWithNote2 screenW={1440} screenH={4400} note={NOTES.dAbout}><MDAbout/></ScreenWithNote2></DCArtboard>
        <DCArtboard id="d-faq"    label="08 · FAQ · shipping"     width={1840} height={2800}><ScreenWithNote2 screenW={1440} screenH={2800} note={NOTES.dFAQ}><MDFAQ/></ScreenWithNote2></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

const root2 = ReactDOM.createRoot(document.getElementById("root"));
root2.render(<AuraV2App/>);
