/**
 * AuraMark — official Aura 2026 brand wordmark (star + AURA)
 *
 * Props:
 *  size    — logo height in px (width scales automatically from aspect ratio)
 *  color   — CSS color value; cascades via SVG fill (default: currentColor)
 *  tagline — kept for API compatibility, no longer rendered
 *  className
 *
 * ViewBox is expanded vertically to expose the full starburst tips
 * (original SVG clips top/bottom by ~19px each side).
 */

interface AuraMarkProps {
  size?: number;
  color?: string;
  tagline?: boolean;   // API-compat; ignored — new logo has no tagline
  className?: string;
}

// Full starburst tip-to-tip height: 188.79 − (−19.31) = 208.1
// Aspect ratio: 1080 / 208.1 ≈ 5.19
const VB_X      = 0;
const VB_Y      = -19.31;
const VB_W      = 1080;
const VB_H      = 208.1;
const ASPECT    = VB_W / VB_H; // ≈ 5.19

export function AuraMark({
  size = 28,
  color = "currentColor",
  tagline: _tagline,
  className,
}: AuraMarkProps) {
  const height = size;
  const width  = Math.round(size * ASPECT);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
      width={width}
      height={height}
      fill={color}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* Starburst mark */}
      <polygon points="30.92 104.34 13.94 136.77 52.02 136.77 52.02 174.85 84.45 157.87 104.05 188.79 123.64 157.87 156.07 174.85 156.07 136.77 194.16 136.77 177.18 104.34 208.1 84.74 177.18 65.15 194.16 32.72 157.58 31.21 156.07 -5.37 123.64 11.62 104.05 -19.31 84.45 11.62 52.02 -5.37 50.52 31.21 13.94 32.72 30.92 65.15 0 84.74 30.92 104.34" />

      {/* AURA wordmark — U */}
      <path d="M657.64,75.51V0h-78.35v80.25c0,11.36-3.55,15.62-10.89,15.62s-10.65-4.26-10.65-15.62V0h-78.35v75.51c0,62.26,36.45,93.98,89,93.98s89.24-31.72,89.24-93.98Z" />

      {/* AURA wordmark — R + A (right) */}
      <path d="M967.44,0l-104.33,157.1-.19-.29-34.39-53.65c14.15-10.39,23.34-27.14,23.34-46.04C851.87,25.58,826.3,0,794.77,0h-120.52v114.21h0v55.27h78.35v-33.93h14.43l18.18,33.93h162.24l20-32.65,20,32.65h92.55L967.44,0ZM775.5,73.67h-22.9v-21.7h22.9c5.99,0,10.85,4.86,10.85,10.85s-4.86,10.85-10.85,10.85Z" />

      {/* AURA wordmark — A (left) */}
      <polygon points="496 169.49 383.44 0 270.89 169.49 363.44 169.49 383.44 136.84 403.45 169.49 496 169.49" />
    </svg>
  );
}
