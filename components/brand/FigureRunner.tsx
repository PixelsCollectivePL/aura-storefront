interface FigureRunnerProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

/**
 * Abstract running figure — simple outlined silhouette.
 * Placeholder geometric stand-in for brand character illustration.
 * NOT a recreation of brand IP — swap for production SVG on handoff.
 */
export function FigureRunner({ size = 110, color = "#0E0E0C", style }: FigureRunnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={style}
      aria-hidden="true"
    >
      {/* head */}
      <circle cx="55" cy="22" r="9" fill="none" stroke={color} strokeWidth="3.5" />
      {/* scarf trailing */}
      <path d="M55 30 C 40 32, 30 28, 18 36" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      {/* body — leaning forward */}
      <path d="M55 32 L 50 60 L 62 60 Z" fill={color} />
      {/* arm reaching forward holding cup */}
      <path d="M58 38 L 78 32 L 80 28 L 88 26" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      {/* cup */}
      <rect x="84" y="20" width="10" height="12" rx="1.5" fill={color} />
      {/* steam */}
      <path d="M88 14 q 2 -4 0 -7" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* legs */}
      <path d="M52 60 L 38 82 L 30 82" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 60 L 70 78 L 82 80" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* shoes */}
      <rect x="26" y="80" width="10" height="4" rx="1" fill={color} />
      <rect x="78" y="78" width="10" height="4" rx="1" fill={color} />
    </svg>
  );
}
