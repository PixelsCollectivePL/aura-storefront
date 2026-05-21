/**
 * AuraMark — Aura 2026 brand wordmark
 *
 * Props:
 *  size      — logo height in px (width scales from aspect ratio)
 *  color     — CSS color for the letterforms (default: currentColor)
 *  variant   — "mono"  : single colour, star + text both use `color`  (footer, mobile)
 *              "brand" : two-colour, star in brand orange, text in `color` (header)
 *  tagline   — kept for API compatibility, ignored
 *  className
 *
 * Both variants share the same viewBox 0 0 1080 208.1 (full starburst included).
 * Aspect ratio ≈ 5.19 (1080 / 208.1).
 */

interface AuraMarkProps {
  size?: number;
  color?: string;
  variant?: "mono" | "brand";
  tagline?: boolean;
  className?: string;
}

const VB       = "0 0 1080 208.1";
const ASPECT   = 1080 / 208.1; // ≈ 5.19
const ORANGE   = "#FF4D17";     // --aura-brand

export function AuraMark({
  size = 28,
  color = "currentColor",
  variant = "mono",
  tagline: _tagline,
  className,
}: AuraMarkProps) {
  const height    = size;
  const width     = Math.round(size * ASPECT);
  const starColor = variant === "brand" ? ORANGE : color;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VB}
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* Starburst mark */}
      <polygon
        fill={starColor}
        points="30.92 123.64 13.94 156.07 52.02 156.07 52.02 194.16 84.45 177.18 104.05 208.1 123.64 177.18 156.07 194.16 156.07 156.07 194.16 156.07 177.18 123.64 208.1 104.05 177.18 84.45 194.16 52.02 157.58 50.52 156.07 13.94 123.64 30.92 104.05 0 84.45 30.92 52.02 13.94 50.52 50.52 13.94 52.02 30.92 84.45 0 104.05 30.92 123.64"
      />

      {/* AURA letterforms — U */}
      <path
        fill={color}
        d="M657.64,94.82V19.31h-78.35v80.25c0,11.36-3.55,15.62-10.89,15.62s-10.65-4.26-10.65-15.62V19.31h-78.35v75.51c0,62.26,36.45,93.98,89,93.98s89.24-31.72,89.24-93.98Z"
      />

      {/* AURA letterforms — R + A (right) */}
      <path
        fill={color}
        d="M967.44,19.31l-104.33,157.1-.19-.29-34.39-53.65c14.15-10.39,23.34-27.14,23.34-46.04,0-31.54-25.57-57.1-57.1-57.1h-120.52v114.21h0v55.27h78.35v-33.93h14.43l18.18,33.93h162.24l20-32.65,20,32.65h92.55l-112.56-169.49ZM775.5,92.98h-22.9v-21.7h22.9c5.99,0,10.85,4.86,10.85,10.85s-4.86,10.85-10.85,10.85Z"
      />

      {/* AURA letterforms — A (left) */}
      <polygon
        fill={color}
        points="496 188.79 383.44 19.31 270.89 188.79 363.44 188.79 383.44 156.14 403.45 188.79 496 188.79"
      />
    </svg>
  );
}
