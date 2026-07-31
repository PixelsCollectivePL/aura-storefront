"use client";

import { usePathname } from "next/navigation";

/**
 * Presentation-only route entrance.
 *
 * The key remounts this wrapper when the pathname changes, replaying the CSS
 * animation without touching the persistent CartProvider, auth cookies or any
 * Shopify data layer living above it in the root layout.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="route-transition" data-route={pathname}>
      {children}
    </div>
  );
}
