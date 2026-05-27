"use client";

import { AcctIcon, type AcctIconName } from "@/components/account/AccountIcons";
import { cn } from "@/lib/utils";
import type { AccountSection } from "@/types/account";

interface Tab {
  key: Exclude<AccountSection, "order-details">;
  label: string;
  icon: AcctIconName;
}

const TABS: Tab[] = [
  { key: "dashboard",     label: "Konto",       icon: "home" },
  { key: "orders",        label: "Zamówienia",  icon: "box" },
  { key: "subscriptions", label: "Subskrypcja", icon: "repeat" },
  { key: "details",       label: "Menu",        icon: "user" },
];

interface AccountMobileTabBarProps {
  active: AccountSection;
  onNavigate: (section: AccountSection) => void;
}

/**
 * Sticky bottom tab bar (mobile). 4 sections, touch targets ≥48px.
 * Active tab gets a brand-orange top indicator + ink label.
 */
export function AccountMobileTabBar({ active, onNavigate }: AccountMobileTabBarProps) {
  return (
    <nav
      aria-label="Sekcje konta"
      className={cn(
        "lg:hidden fixed bottom-0 inset-x-0 z-30",
        "grid grid-cols-4",
        "bg-paper border-t border-line"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map((t) => {
        const isActive =
          t.key === active ||
          (t.key === "orders" && active === "order-details");
        const IconCmp = AcctIcon[t.icon];
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onNavigate(t.key)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 py-3 cursor-pointer min-h-[56px]",
              "transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-[-2px]",
              isActive ? "text-ink" : "text-muted"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {isActive && (
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-brand rounded-b-[3px]"
                aria-hidden="true"
              />
            )}
            <IconCmp size={20} />
            <span
              className="uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.12em",
                fontWeight: 600,
              }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
