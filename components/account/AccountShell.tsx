"use client";

import { AccountSidebar } from "@/components/account/AccountSidebar";
import { AccountMobileBar } from "@/components/account/AccountMobileBar";
import { AccountMobileTabBar } from "@/components/account/AccountMobileTabBar";
import type {
  AccountCustomer,
  AccountOrder,
  AccountSection,
  AccountSubscription,
} from "@/types/account";

interface AccountShellProps {
  customer: AccountCustomer;
  orders: AccountOrder[];
  subscription: AccountSubscription | null;
  active: AccountSection;
  onNavigate: (section: AccountSection) => void;
  /** Title shown in the mobile top bar (each section sets its own). */
  mobileTitle: string;
  /** Whether the mobile bar shows back arrow (e.g. order details). */
  mobileBack?: boolean;
  /** Callback for mobile back. */
  onMobileBack?: () => void;
  /** Optional mobile-bar right-side action (e.g. invoice icon). */
  mobileAction?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Account layout shell — desktop sidebar + main panel, mobile top bar +
 * scroll content + bottom tab bar. Sections plug in as children.
 */
export function AccountShell({
  customer,
  orders,
  subscription,
  active,
  onNavigate,
  mobileTitle,
  mobileBack,
  onMobileBack,
  mobileAction,
  children,
}: AccountShellProps) {
  return (
    <div className="flex bg-paper min-h-screen">
      <AccountSidebar
        customer={customer}
        orders={orders}
        subscription={subscription}
        active={active}
        onNavigate={onNavigate}
      />

      <main className="flex-1 min-w-0 flex flex-col">
        <AccountMobileBar
          title={mobileTitle}
          back={mobileBack}
          onBack={onMobileBack}
          action={mobileAction}
        />

        <div className="flex-1 px-5 py-8 lg:px-16 lg:py-14 pb-24 lg:pb-20">
          {children}
        </div>
      </main>

      <AccountMobileTabBar active={active} onNavigate={onNavigate} />
    </div>
  );
}
