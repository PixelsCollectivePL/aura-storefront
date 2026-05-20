type IconProps = {
  size?: number;
  className?: string;
};

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "square" } as const;

export const Icon = {
  menu: ({ size = 22, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M3 7h18M3 17h18" />
    </svg>
  ),
  close: ({ size = 22, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  ),
  bag: ({ size = 22, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M5 7h14l-1 13H6L5 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  ),
  search: ({ size = 22, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...stroke}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  ),
  back: ({ size = 22, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  ),
  arrow: ({ size = 16, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M5 12h14M14 6l6 6-6 6" />
    </svg>
  ),
  plus: ({ size = 16, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.4}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  minus: ({ size = 16, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.4}>
      <path d="M5 12h14" />
    </svg>
  ),
  check: ({ size = 14, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="square">
      <path d="M5 12l4 4 10-10" />
    </svg>
  ),
  chev: ({ size = 14, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.4}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  chevRight: ({ size = 14, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.4}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
  filter: ({ size = 16, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.4}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  ),
  account: ({ size = 22, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.4}>
      <circle cx="12" cy="9" r="3.5" />
      <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
    </svg>
  ),
  heart: ({ size = 18, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.4}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
    </svg>
  ),
  truck: ({ size = 18, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="13" height="10" rx="1" />
      <path d="M15 10h4l3 3v4h-7" />
      <circle cx="6" cy="18" r="1.5" />
      <circle cx="18" cy="18" r="1.5" />
    </svg>
  ),
  bean: ({ size = 18, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <ellipse cx="12" cy="12" rx="5.5" ry="8.5" transform="rotate(25 12 12)" />
      <path d="M10 6c1.5 3 1.5 9 0 12" transform="rotate(25 10 12)" />
    </svg>
  ),
  package: ({ size = 18, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7l9-4 9 4-9 4z" />
      <path d="M3 7v10l9 4 9-4V7" />
      <path d="M12 11v10" />
    </svg>
  ),
  shield: ({ size = 18, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L4 7v6c0 4 3.5 7.5 8 9 4.5-1.5 8-5 8-9V7l-8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
} as const;
