import { Starburst } from "@/components/brand/Starburst";

interface AccountMiniBagProps {
  /** CSS color for the burst — typically the product's brand accent. */
  accent?: string;
  /** 3-letter label shown at the bottom of the bag. */
  label: string;
  size?: "sm" | "md";
}

/**
 * Mini coffee-bag thumb used in account order rows.
 * Decorative — paired with the real product title; not a substitute for
 * the actual product image (which comes from Shopify later).
 */
export function AccountMiniBag({
  accent = "var(--aura-orange)",
  label,
  size = "md",
}: AccountMiniBagProps) {
  const w = size === "sm" ? 56 : 72;
  const h = size === "sm" ? 72 : 90;
  const burstSize = size === "sm" ? 32 : 42;

  return (
    <div
      className="relative shrink-0 grid place-items-center rounded-md overflow-hidden"
      style={{
        width: w,
        height: h,
        background:
          "linear-gradient(160deg, #1a1815 0%, #0a0a08 60%, #16140f 100%)",
        boxShadow: "0 6px 14px rgba(14,14,12,0.18)",
      }}
      aria-hidden="true"
    >
      <Starburst color={accent} size={burstSize} points={10} depth={0.22} />
      <span
        className="absolute bottom-2 inset-x-0 text-center text-white uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 7,
          letterSpacing: "0.18em",
        }}
      >
        {label}
      </span>
    </div>
  );
}
