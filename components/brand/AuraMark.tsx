import { Starburst } from "@/components/brand/Starburst";

interface AuraMarkProps {
  size?: number;
  color?: string;
  tagline?: boolean;
  className?: string;
}

/** AURA wordmark — starburst dot + bold Archivo display type */
export function AuraMark({
  size = 28,
  color = "currentColor",
  tagline = false,
  className,
}: AuraMarkProps) {
  const burstSize = Math.round(size * 0.55);

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(size * 0.3),
        lineHeight: 1,
        color,
      }}
    >
      <Starburst color={color} size={burstSize} points={10} depth={0.28} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: size,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          AURA
        </span>
        {tagline && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: Math.round(size * 0.28),
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginTop: 2,
              opacity: 0.6,
            }}
          >
            Pure Coffee Beans
          </span>
        )}
      </div>
    </div>
  );
}
