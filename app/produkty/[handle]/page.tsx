import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { getProduct, MOCK_PRODUCTS } from "@/lib/mock/products";
import { Starburst } from "@/components/brand/Starburst";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductBuyBox } from "@/components/product/ProductBuyBox";
import { Icon } from "@/components/ui/Icon";
import { CONTENT } from "@/lib/content/pl";
import { formatPrice, cn } from "@/lib/utils";

const { pdp: t } = CONTENT;

// ── Helpers ────────────────────────────────────────────────────────────

/** Map roastLevel string → 1–5 scale for the RoastBar. */
function getRoastLevel(roastLevel: string): number {
  const l = roastLevel.toLowerCase();
  if (l.startsWith("light-medium") || l.startsWith("light ·")) return 1;
  if (l.startsWith("light")) return 1;
  if (l.startsWith("medium-dark")) return 4;
  if (l.startsWith("medium")) return 3;
  if (l.startsWith("dark")) return 5;
  return 3;
}

/** Derive readable category label from product tags — delegates to content helper. */
const getCategoryLabel = t.getCategoryLabel;

/** Accent colour per product (warm palette, no Shopify metafield yet). */
const ACCENT_PALETTE = [
  "var(--aura-orange)",
  "#5C8EE0",
  "#E05C6A",
  "#5CBE8A",
  "#C07C3E",
  "#9B5CE0",
];
function getAccent(handle: string): string {
  const idx = handle.charCodeAt(0) % ACCENT_PALETTE.length;
  return ACCENT_PALETTE[idx];
}

// ── Metadata (SSG-ready) ───────────────────────────────────────────────

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) return { title: "Kawa · Aura" };
  return {
    title: `${product.shortName} · ${product.origin} — Aura`,
    description: product.description ?? product.title,
  };
}

// ── Page ───────────────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();

  const roastLevel = getRoastLevel(product.roastLevel);
  const categoryLabel = getCategoryLabel(product.tags);
  const accent = getAccent(product.handle);
  const related = MOCK_PRODUCTS.filter((p) => p.handle !== product.handle).slice(0, 4);

  return (
    // Extra bottom padding on mobile for sticky ATC bar
    <div className="pb-24 lg:pb-0">

      {/* ── Breadcrumbs ─────────────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="px-5 lg:px-14 pt-5 lg:pt-7 pb-0"
      >
        <ol
          className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-muted"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <li>
            <Link href="/produkty" className="hover:text-ink transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-brand rounded-xs">
              {t.breadcrumbShop}
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted/50">/</li>
          <li>
            <Link href="/produkty" className="hover:text-ink transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-brand rounded-xs">
              {categoryLabel}
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted/50">/</li>
          <li className="text-ink font-medium" aria-current="page">
            {product.shortName}
          </li>
        </ol>
      </nav>

      {/* ── Main grid: packshot + buy box ───────────────────────── */}
      <section className="px-5 lg:px-14 pt-8 lg:pt-10 pb-0 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">

        {/* ── Left: Packshot ────────────────────────────────────── */}
        <div className="lg:sticky lg:top-[88px]">
          {/* Main image square */}
          <div
            className="relative aspect-square rounded-xl lg:rounded-2xl overflow-hidden bg-paper-2 flex items-center justify-center"
          >
            {/* Placeholder diagonal texture */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  repeating-linear-gradient(
                    135deg,
                    rgba(14,14,12,0.03) 0 6px,
                    rgba(14,14,12,0) 6px 16px
                  ),
                  var(--aura-paper-2)
                `,
              }}
            />

            {/* Central product label */}
            <div className="relative z-10 flex flex-col items-center gap-3 select-none">
              <Starburst
                color={accent}
                size={180}
                points={12}
                depth={0.22}
                style={{ opacity: 0.9 }}
              >
                <span
                  className="font-extrabold text-ink text-center leading-[1]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 36,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {product.shortName}
                </span>
              </Starburst>
            </div>

            {/* Accent starburst — top right corner */}
            <div className="absolute top-5 right-5 z-20" aria-hidden="true">
              <Starburst color={accent} size={56} points={10} depth={0.25} />
            </div>

            {/* New badge — top left */}
            {product.isNew && (
              <div className="absolute top-4 left-4 z-20">
                <span
                  className="inline-flex items-center h-6 px-3 rounded-pill bg-ink text-white text-[10px] font-semibold tracking-[0.06em] uppercase"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {CONTENT.product.newBadge}
                </span>
              </div>
            )}

            {/* Lot code — bottom left */}
            <div className="absolute bottom-4 left-4 z-20">
              <span
                className="text-[10px] tracking-[0.12em] uppercase text-muted/70"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {CONTENT.product.lotPrefix} {product.lotCode}
              </span>
            </div>
          </div>

          {/* Thumbnail strip — placeholder slots */}
          <div className="hidden lg:flex gap-3 mt-4">
            {(["ZIARNO", "BREW", "FARMA", "DETAIL"] as const).map((label, i) => (
              <button
                key={label}
                type="button"
                aria-label={`Zdjęcie ${i + 1}`}
                className={cn(
                  "flex-1 aspect-square rounded-lg bg-paper-2 overflow-hidden",
                  "flex items-center justify-center",
                  "text-[9px] tracking-[0.1em] uppercase text-muted/50",
                  "border-2 transition-colors duration-[120ms] cursor-pointer",
                  "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
                  i === 0
                    ? "border-ink"
                    : "border-transparent hover:border-line"
                )}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Product info + buy box ─────────────────────── */}
        <div className="mt-8 lg:mt-0 flex flex-col gap-6">

          {/* Origin + process eyebrow */}
          <p
            className="text-[11px] tracking-[0.12em] uppercase text-brand"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {product.origin}
            {product.process ? ` · ${product.process}` : ""}
          </p>

          {/* Product name */}
          <div className="-mt-2">
            <h1
              className="font-extrabold leading-[0.93] tracking-[-0.035em] text-ink"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(48px, 7vw, 80px)",
              }}
            >
              {product.shortName}
            </h1>

            {/* Price + placeholder rating */}
            <div className="flex items-baseline justify-between mt-4 gap-4">
              <div className="flex items-baseline gap-3">
                <span
                  className="font-bold text-ink tabular-nums"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(24px, 3.5vw, 32px)",
                  }}
                >
                  {formatPrice(product.price.amount, product.price.currencyCode)}
                </span>
                <span className="text-[13px] text-muted">
                  za {product.sizeOptions[0]?.label ?? "250g"}
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 text-[12.5px] text-muted"
                aria-label={t.ratingsAriaLabel}
              >
                <StarRow />
                <span>{t.ratingsPlaceholder}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-[14.5px] lg:text-[15.5px] text-ink/75 leading-[1.6] max-w-[520px]">
              {product.description}
            </p>
          )}

          {/* Divider */}
          <hr className="border-line" />

          {/* Buy box — Client Component */}
          <ProductBuyBox product={product} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SENSORY STRIP — notes / roast / brewing
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-paper-2 border-t border-line mt-16 lg:mt-20 px-5 lg:px-14 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* Nuty smakowe */}
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-brand mb-4" style={{ fontFamily: "var(--font-mono)" }}>{t.notesEyebrow}</p>
            <h3
              className="font-extrabold text-[22px] lg:text-[26px] tracking-[-0.025em] text-ink leading-[1.1] mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {product.notes.map((n, i) => (
                <span key={n}>
                  {n.charAt(0).toUpperCase() + n.slice(1)}
                  {i < product.notes.length - 1 ? ". " : "."}
                </span>
              ))}
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.notes.map((note) => (
                <span
                  key={note}
                  className="inline-flex items-center h-8 px-3.5 rounded-pill bg-brand-soft border border-brand-soft text-brand-deep text-[12.5px] font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Profil palenia */}
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-brand mb-4" style={{ fontFamily: "var(--font-mono)" }}>{t.roastEyebrow}</p>
            <h3
              className="font-extrabold text-[22px] lg:text-[26px] tracking-[-0.025em] text-ink leading-[1.1] mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {product.roastLevel.split(" · ")[0]}.
            </h3>
            <RoastBar level={roastLevel} />
          </div>

          {/* Pod jakie parzenie */}
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-brand mb-4" style={{ fontFamily: "var(--font-mono)" }}>{t.brewingEyebrow}</p>
            {product.recommendedBrew && (
              <h3
                className="font-extrabold text-[22px] lg:text-[26px] tracking-[-0.025em] text-ink leading-[1.1] mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {product.recommendedBrew}.
              </h3>
            )}
            {product.brewing && product.brewing.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.brewing.map((b) => (
                  <span
                    key={b.method}
                    className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-pill bg-white border border-line text-ink text-[12.5px] font-medium"
                  >
                    <Icon.check size={11} className="text-brand" />
                    {b.method}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ORIGIN STORY
      ══════════════════════════════════════════════════════════ */}
      {(product.altitude || product.varietal || product.producer) && (
        <section className="border-t border-line px-5 lg:px-14 py-16 lg:py-24">
          <div className="lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:items-center">

            {/* Copy */}
            <div>
              <p className="text-[11px] tracking-[0.14em] uppercase text-brand mb-5" style={{ fontFamily: "var(--font-mono)" }}>{t.originSectionEyebrow}</p>
              <h2
                className="font-extrabold tracking-[-0.03em] leading-[0.94] text-ink mb-6"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px, 6vw, 72px)",
                }}
              >
                {product.origin.split(" · ").map((part, i) => (
                  <span key={i}>
                    {part}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h2>
              {product.description && (
                <p className="text-[15px] text-ink/70 leading-[1.65] max-w-[480px] mb-10">
                  {product.description}
                </p>
              )}

              {/* Specs grid */}
              <div className="grid grid-cols-2 gap-5 max-w-[400px]">
                {product.altitude && (
                  <Spec label={t.specLabels.altitude} value={product.altitude} />
                )}
                {product.process && (
                  <Spec label={t.specLabels.process} value={product.process} />
                )}
                {product.varietal && (
                  <Spec label={t.specLabels.varietal} value={product.varietal} />
                )}
                {product.producer && (
                  <Spec label={t.specLabels.producer} value={product.producer} />
                )}
                {product.harvestYear && (
                  <Spec label={t.specLabels.harvest} value={product.harvestYear} />
                )}
              </div>
            </div>

            {/* Photo placeholder */}
            <div
              className="hidden lg:flex rounded-2xl overflow-hidden items-end p-8"
              style={{
                aspectRatio: "4 / 3",
                background: `
                  repeating-linear-gradient(
                    135deg,
                    rgba(14,14,12,0.04) 0 6px,
                    rgba(14,14,12,0) 6px 14px
                  ),
                  var(--aura-paper-2)
                `,
              }}
            >
              <span
                className="text-[10px] tracking-[0.12em] uppercase text-muted"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {product.origin} · {product.process ?? "farm"}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          BREWING GUIDE
      ══════════════════════════════════════════════════════════ */}
      {product.brewing && product.brewing.length > 0 && (
        <section className="bg-ink text-white border-t border-white/10 px-5 lg:px-14 py-14 lg:py-20">
          <p
            className="text-[11px] tracking-[0.14em] uppercase text-brand mb-5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {t.brewingSectionEyebrow}
          </p>
          <h2
            className="font-extrabold tracking-[-0.03em] leading-[0.94] text-white mb-10 lg:mb-14"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 56px)",
            }}
          >
            Receptury.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10">
            {product.brewing.map((brew, i) => (
              <div key={brew.method} className="bg-ink p-6 lg:p-8">
                <div
                  className="text-[10px] tracking-[0.12em] uppercase text-brand mb-3"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3
                  className="text-[22px] lg:text-[26px] font-extrabold text-white tracking-[-0.02em] mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {brew.method}
                </h3>
                <p
                  className="text-[13px] text-white/60 leading-[1.7] tracking-[0.01em]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {brew.recipe}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          RELATED PRODUCTS
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-line px-5 lg:px-14 py-14 lg:py-20">
        <div className="flex items-end justify-between mb-8 lg:mb-10 gap-4">
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-brand mb-3" style={{ fontFamily: "var(--font-mono)" }}>{t.similarEyebrow}</p>
            <h2
              className="font-extrabold tracking-[-0.025em] leading-[0.96] text-ink"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4.5vw, 52px)",
              }}
            >
              {t.similarHeading}
            </h2>
          </div>
          <Link
            href="/produkty"
            className={cn(
              "hidden lg:inline-flex items-center gap-2 shrink-0",
              "text-[13px] font-semibold text-ink",
              "border-b border-ink pb-0.5",
              "hover:text-brand hover:border-brand",
              "transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
            )}
          >
            {t.similarAll}
            <Icon.arrow size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-7">
          {related.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────

/** 5-segment roast bar, 1 (light) → 5 (dark). */
function RoastBar({ level }: { level: number }) {
  return (
    <div>
      <div
        className="flex justify-between text-[10px] tracking-[0.1em] uppercase text-muted mb-2"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span>{CONTENT.pdp.roastMin}</span>
        <span>{CONTENT.pdp.roastMid}</span>
        <span>{CONTENT.pdp.roastMax}</span>
      </div>
      <div className="flex gap-1.5" role="img" aria-label={`Poziom palenia: ${level} z 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-2 rounded-full transition-colors duration-[120ms]",
              i <= level ? "bg-brand" : "bg-line"
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** Single spec cell for origin section. */
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="text-[10px] tracking-[0.12em] uppercase text-muted mb-1"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </p>
      <p className="text-[15px] font-semibold text-ink">{value}</p>
    </div>
  );
}

/** 5 orange star icons — placeholder rating display. */
function StarRow() {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="var(--aura-orange)"
        >
          <path d="M12 2l3 6.5 7 .9-5.2 4.6L18 21l-6-3.4L6 21l1.2-7L2 9.4l7-.9z" />
        </svg>
      ))}
    </span>
  );
}
