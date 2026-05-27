"use client";

import { Starburst } from "@/components/brand/Starburst";
import type { CartLine } from "@/lib/cart/cart-context";
import { cn } from "@/lib/utils";

// Receipt zig-zag bottom edge — exact polygon from the V2 design (Aura Koszyk Warianty).
const RECEIPT_CLIP_DESKTOP =
  "polygon(0 0, 100% 0, 100% calc(100% - 16px), 96% 100%, 92% calc(100% - 16px), 88% 100%, 84% calc(100% - 16px), 80% 100%, 76% calc(100% - 16px), 72% 100%, 68% calc(100% - 16px), 64% 100%, 60% calc(100% - 16px), 56% 100%, 52% calc(100% - 16px), 48% 100%, 44% calc(100% - 16px), 40% 100%, 36% calc(100% - 16px), 32% 100%, 28% calc(100% - 16px), 24% 100%, 20% calc(100% - 16px), 16% 100%, 12% calc(100% - 16px), 8% 100%, 4% calc(100% - 16px), 0 100%)";
const RECEIPT_CLIP_MOBILE =
  "polygon(0 0, 100% 0, 100% calc(100% - 14px), 95% 100%, 90% calc(100% - 14px), 85% 100%, 80% calc(100% - 14px), 75% 100%, 70% calc(100% - 14px), 65% 100%, 60% calc(100% - 14px), 55% 100%, 50% calc(100% - 14px), 45% 100%, 40% calc(100% - 14px), 35% 100%, 30% calc(100% - 14px), 25% 100%, 20% calc(100% - 14px), 15% 100%, 10% calc(100% - 14px), 5% 100%, 0 calc(100% - 14px))";

interface CartReceiptSummaryProps {
  lines: CartLine[];
  subtotal: number;
  shipping: number;
  total: number;
  variant?: "desktop" | "mobile";
  /** Whether to render the disabled checkout CTA (desktop yes, mobile uses sticky bar) */
  showCta?: boolean;
}

/**
 * Receipt strip — paper card with zig-zag torn-off bottom + rotating stamp.
 * The dynamic stamp + clip-path are the signature visual moment of V2.
 */
export function CartReceiptSummary({
  lines,
  subtotal,
  shipping,
  total,
  variant = "desktop",
  showCta = true,
}: CartReceiptSummaryProps) {
  const vat = Math.round((subtotal * 0.23) / 1.23);
  const isMobile = variant === "mobile";
  const clipPath = isMobile ? RECEIPT_CLIP_MOBILE : RECEIPT_CLIP_DESKTOP;

  return (
    <div
      className="relative bg-paper shadow-card"
      style={{
        padding: isMobile ? "32px 22px 56px" : "36px 36px 60px",
        clipPath,
      }}
    >
      {/* ── Rotating stamp burst (top-right) ── */}
      <div
        className="absolute"
        style={{ top: isMobile ? -16 : -22, right: isMobile ? 18 : 24 }}
        aria-hidden="true"
      >
        <div
          className="relative star-spin-bg"
          style={{ width: isMobile ? 76 : 96, height: isMobile ? 76 : 96 }}
        >
          <Starburst
            color="var(--aura-orange)"
            size={isMobile ? 76 : 96}
            points={12}
            depth={0.24}
          />
          {/* Counter-spin label so text stays upright while burst rotates */}
          <div
            className="absolute inset-0 grid place-items-center text-center text-ink font-bold leading-[1.2]"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: isMobile ? 7.5 : 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              animation: "aura-star-spin 24s linear infinite reverse",
            }}
          >
            OPŁAĆ
            <br />
            SZYBKO
          </div>
        </div>
      </div>

      {/* ── Logo header ── */}
      <div className="flex items-center gap-2.5 mb-1">
        <Starburst color="var(--aura-ink)" size={isMobile ? 14 : 18} points={10} depth={0.28} />
        <span
          className="font-extrabold tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? 18 : 22,
          }}
        >
          AURA
        </span>
      </div>
      <div
        className={cn(
          "uppercase text-muted",
          isMobile ? "text-[8.5px] mb-5" : "text-[9px] mb-7"
        )}
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.22em" }}
      >
        Pure coffee beans · Warszawa
      </div>

      <div
        className={cn(
          "uppercase text-muted",
          isMobile ? "text-[9.5px] mb-2.5" : "text-[10px] mb-3"
        )}
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em" }}
      >
        Rachunek · do zapłaty
      </div>

      {/* ── Items recap (mono lines) ── */}
      <div className="flex flex-col gap-1.5 pb-4 border-b-2 border-dashed border-line-strong">
        {lines.map((line) => (
          <div
            key={line.id}
            className={cn(
              "flex justify-between tabular-nums text-ink",
              isMobile ? "text-[12px]" : "text-[13px]"
            )}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span>
              {line.quantity}× {line.title} · {extractSizeFromVariant(line.variantTitle)}
            </span>
            <span>{line.price * line.quantity},00 zł</span>
          </div>
        ))}
      </div>

      {/* ── Breakdown ── */}
      <div
        className={cn(
          "flex flex-col gap-2.5 border-b-2 border-dashed border-line-strong",
          isMobile ? "py-3.5" : "py-[18px]"
        )}
      >
        <BreakdownRow
          label="Suma częściowa"
          value={`${subtotal},00 zł`}
          fontSize={isMobile ? 12 : 13}
        />
        <BreakdownRow
          label="Dostawa"
          value={shipping === 0 ? "GRATIS" : `${shipping},00 zł`}
          valueClass={shipping === 0 ? "text-brand font-bold" : ""}
          fontSize={isMobile ? 12 : 13}
        />
        <BreakdownRow
          label="W tym VAT 23%"
          value={`${vat},00 zł`}
          fontSize={isMobile ? 12 : 13}
        />
      </div>

      {/* ── Total ── */}
      <div className={cn("text-center", isMobile ? "pt-5 pb-1.5" : "py-6")}>
        <div
          className={cn(
            "uppercase text-muted",
            isMobile ? "text-[10px] mb-1" : "text-[11px] mb-1.5"
          )}
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}
        >
          Razem do zapłaty
        </div>
        <div
          className="text-brand font-black tabular-nums tracking-[-0.03em] leading-none"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? 64 : 88,
          }}
        >
          {total},00 zł
        </div>
      </div>

      {/* ── CTA (desktop only — mobile uses sticky bottom bar) ── */}
      {showCta && (
        <>
          <button
            type="button"
            disabled
            title="Wkrótce — kasa Shopify"
            className={cn(
              "w-full h-14 inline-flex items-center justify-center gap-2.5 mt-1.5",
              "rounded-pill text-[15px] font-semibold tracking-[-0.005em]",
              "bg-brand text-white border border-brand",
              "opacity-80 cursor-not-allowed"
            )}
          >
            Przejdź do kasy →
          </button>

          <div
            className="text-center text-muted uppercase leading-[1.6] mt-4 text-[9px]"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em" }}
          >
            Bezpieczna kasa Shopify
            <br />
            BLIK · Karta · Apple Pay · Google Pay
            <br />
            ─────────────
            <br />
            Dziękujemy. Do zobaczenia w środę.
          </div>
        </>
      )}

      {/* ── Mobile receipt foot ── */}
      {isMobile && (
        <div
          className="text-center text-muted uppercase leading-[1.7] mt-4 text-[8.5px]"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em" }}
        >
          ─────────────
          <br />
          Dziękujemy. Do zobaczenia w środę.
        </div>
      )}
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  valueClass = "",
  fontSize,
}: {
  label: string;
  value: string;
  valueClass?: string;
  fontSize: number;
}) {
  return (
    <div
      className="flex justify-between tabular-nums"
      style={{ fontFamily: "var(--font-mono)", fontSize }}
    >
      <span className="text-muted">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

/** Try to surface the size portion of a variant title for the recap line. */
function extractSizeFromVariant(variantTitle: string): string {
  // Heuristic: variants look like "200g", "200g · Espresso", "Standard · 250g · Ziarno"
  const m = variantTitle.match(/\b(\d+(?:\.\d+)?\s*(?:g|kg))\b/i);
  if (m) return m[1].replace(/\s+/g, "");
  return variantTitle;
}
