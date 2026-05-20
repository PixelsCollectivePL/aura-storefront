interface StarburstProps {
  color?: string;
  size?: number;
  points?: number;
  depth?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

/** 12-point spiky starburst — original geometric shape, brand placeholder */
export function Starburst({
  color = "var(--aura-orange)",
  size = 120,
  points = 12,
  depth = 0.22,
  children,
  style,
  className,
}: StarburstProps) {
  const r = size / 2;
  const inner = r * (1 - depth);
  const cx = r;
  const cy = r;
  const total = points * 2;
  const pathParts: string[] = [];

  for (let i = 0; i < total; i++) {
    const a = (i / total) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : inner;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad;
    pathParts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  pathParts.push("Z");

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "inline-grid",
        placeItems: "center",
        width: size,
        height: size,
        ...style,
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      >
        <path
          d={pathParts.join(" ")}
          fill={color}
          strokeLinejoin="round"
        />
      </svg>
      {children && (
        <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
      )}
    </div>
  );
}
