/**
 * Account-panel-only SVG icons.
 * Kept separate from components/ui/Icon.tsx to avoid bloating the global
 * Icon namespace with feature-specific glyphs. No external deps.
 */

import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function I({ size = 18, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const AcctIcon = {
  home:    (p: IconProps) => <I {...p}><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1z" /></I>,
  box:     (p: IconProps) => <I {...p}><path d="M3 7l9-4 9 4-9 4z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></I>,
  repeat:  (p: IconProps) => <I {...p}><path d="M4 12a8 8 0 0114-5l2-2" /><path d="M20 4v4h-4" /><path d="M20 12a8 8 0 01-14 5l-2 2" /><path d="M4 20v-4h4" /></I>,
  pin:     (p: IconProps) => <I {...p}><path d="M12 22s7-7 7-13a7 7 0 10-14 0c0 6 7 13 7 13z" /><circle cx="12" cy="9" r="2.5" /></I>,
  user:    (p: IconProps) => <I {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1" /></I>,
  logout:  (p: IconProps) => <I {...p}><path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3" /><path d="M10 17l-5-5 5-5" /><path d="M5 12h11" /></I>,
  arrow:   (p: IconProps) => <I {...p}><path d="M5 12h14M13 5l7 7-7 7" /></I>,
  back:    (p: IconProps) => <I {...p}><path d="M19 12H5M12 19l-7-7 7-7" /></I>,
  shield:  (p: IconProps) => <I {...p}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></I>,
  plus:    (p: IconProps) => <I {...p}><path d="M12 5v14M5 12h14" /></I>,
  edit:    (p: IconProps) => <I {...p}><path d="M16 3l5 5-12 12H4v-5z" /></I>,
  check:   (p: IconProps) => <I {...p}><path d="M5 12l4 4 10-10" /></I>,
  pause:   (p: IconProps) => <I {...p}><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></I>,
  skip:    (p: IconProps) => <I {...p}><path d="M5 5l7 7-7 7M14 5l7 7-7 7" /></I>,
  x:       (p: IconProps) => <I {...p}><path d="M6 6l12 12M18 6L6 18" /></I>,
  truck:   (p: IconProps) => <I {...p}><rect x="2" y="7" width="13" height="10" rx="1" /><path d="M15 10h4l3 3v4h-7" /><circle cx="6" cy="18" r="1.5" /><circle cx="18" cy="18" r="1.5" /></I>,
  doc:     (p: IconProps) => <I {...p}><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" /><path d="M14 3v6h6" /></I>,
};

export type AcctIconName = keyof typeof AcctIcon;
