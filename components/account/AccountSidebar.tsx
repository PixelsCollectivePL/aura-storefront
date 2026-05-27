"use client";

import Link from "next/link";
import { Starburst } from "@/components/brand/Starburst";
import { AcctIcon, type AcctIconName } from "@/components/account/AccountIcons";
import { cn } from "@/lib/utils";
import type {
  AccountCustomer,
  AccountSection,
  AccountOrder,
  AccountSubscription,
} from "@/types/account";

interface NavItem {
  key: Exclude<AccountSection, "order-details">;
  label: string;
  icon: AcctIconName;
  badge?: number;
  badgeDot?: boolean;
}

interface AccountSidebarProps {
  customer: AccountCustomer;
  orders: AccountOrder[];
  subscription: AccountSubscription | null;
  active: AccountSection;
  onNavigate: (section: AccountSection) => void;
}

/**
 * Desktop sidebar (280px). Brand mark + greeting + nav list + secure-account
 * footer note + logout. Active section highlighted with ink fill.
 */
export function AccountSidebar({
  customer,
  orders,
  subscription,
  active,
  onNavigate,
}: AccountSidebarProps) {
  const items: NavItem[] = [
    { key: "dashboard",     label: "Dashboard",  icon: "home" },
    { key: "orders",        label: "Zamówienia", icon: "box",   badge: orders.length },
    { key: "subscriptions", label: "Subskrypcje", icon: "repeat", badgeDot: subscription?.status === "active" },
    { key: "addresses",     label: "Adresy",     icon: "pin" },
    { key: "details",       label: "Dane konta", icon: "user" },
  ];

  const memberSince = new Date(customer.createdAt).getFullYear();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col gap-6",
        "w-[280px] shrink-0 min-h-screen",
        "bg-paper border-r border-line",
        "px-7 py-8"
      )}
      aria-label="Nawigacja konta"
    >
      {/* Brand row */}
      <div className="flex items-center gap-2.5">
        <Starburst color="var(--aura-orange)" size={22} points={10} depth={0.28} />
        <span
          className="font-extrabold tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-display)", fontSize: 22 }}
        >
          AURA
        </span>
        <span
          className="ml-auto uppercase text-muted"
          style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em" }}
        >
          Konto
        </span>
      </div>

      {/* Greeting */}
      <div>
        <div
          className="text-brand uppercase mb-1.5"
          style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
        >
          Cześć
        </div>
        <div
          className="font-extrabold tracking-[-0.025em] text-ink leading-none"
          style={{ fontFamily: "var(--font-display)", fontSize: 32 }}
        >
          {customer.firstName}.
        </div>
        <div
          className="text-muted uppercase mt-2"
          style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em" }}
        >
          Klient od {memberSince}
        </div>
      </div>

      <div className="h-px bg-line" />

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {items.map((it) => {
          const isActive = active === it.key || (it.key === "orders" && active === "order-details");
          const IconCmp = AcctIcon[it.icon];
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onNavigate(it.key)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-left",
                "text-[14px] font-medium tracking-[-0.005em]",
                "transition-colors duration-[120ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
                isActive
                  ? "bg-ink text-white"
                  : "text-ink hover:bg-paper-2"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <IconCmp />
              <span className="flex-1">{it.label}</span>
              {typeof it.badge === "number" && (
                <span
                  className={cn(
                    "tabular-nums rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    isActive ? "bg-white/15 text-white" : "bg-paper-2 text-muted"
                  )}
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
                >
                  {it.badge}
                </span>
              )}
              {it.badgeDot && (
                <span
                  className="w-2 h-2 rounded-full bg-brand"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* Secure-account note */}
      <div className="flex gap-2.5 items-start p-3.5 rounded-md bg-paper-2 border border-line">
        <span className="shrink-0 text-ink mt-0.5">
          <AcctIcon.shield size={16} />
        </span>
        <div>
          <div
            className="uppercase mb-1 text-ink"
            style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em" }}
          >
            Bezpieczne konto
          </div>
          <p className="text-[12px] leading-[1.45] text-muted">
            Dane logowania zarządzane przez Shopify Customer Accounts.
          </p>
          {/* [shopify-ready]: link to Shopify customer account settings URL */}
          <Link
            href="#manage-account"
            className="inline-block mt-1.5 text-[12px] font-semibold text-ink border-b border-ink hover:text-brand hover:border-brand transition-colors duration-[120ms]"
          >
            Zarządzaj kontem ↗
          </Link>
        </div>
      </div>

      {/* Logout — placeholder (Shopify customer account logout flow) */}
      <button
        type="button"
        className="flex items-center gap-2.5 text-muted hover:text-ink transition-colors duration-[120ms] text-[13px] font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs"
      >
        <AcctIcon.logout size={16} />
        Wyloguj
      </button>
    </aside>
  );
}
