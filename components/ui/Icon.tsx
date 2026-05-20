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
} as const;
