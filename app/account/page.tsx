"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AccountShell } from "@/components/account/AccountShell";
import { AccountAuthState } from "@/components/account/AccountAuthState";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { AccountOrders } from "@/components/account/AccountOrders";
import { AccountOrderDetails } from "@/components/account/AccountOrderDetails";
import { AccountSubscriptions } from "@/components/account/AccountSubscriptions";
import { AccountAddresses } from "@/components/account/AccountAddresses";
import { AccountDetails } from "@/components/account/AccountDetails";

import {
  getCustomer,
  getOrders,
  getSubscription,
  getAddresses,
} from "@/lib/mock/account";

import type { AccountSection, AccountViewState } from "@/types/account";

/**
 * /account — single-route account panel with state-based section switching.
 *
 * Sections: dashboard | orders | order-details | subscriptions | addresses | details
 * Auth view state via ?state=loggedOut|loading|error (default = loggedIn).
 *
 * On Shopify Customer Accounts integration:
 *   - Auth check → if not logged in, redirect to Shopify login URL
 *   - Replace getCustomer / getOrders / getSubscription / getAddresses
 *     with Customer Account API async fetches
 *   - Consider splitting into segments (/account/orders/[name]) if SEO / sharing matters
 */
export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountPageInner />
    </Suspense>
  );
}

function AccountPageInner() {
  const searchParams = useSearchParams();
  const stateParam = searchParams.get("state") as AccountViewState | null;
  const viewState: AccountViewState =
    stateParam === "loggedOut" || stateParam === "loading" || stateParam === "error"
      ? stateParam
      : "loggedIn";

  // ── Non-logged-in states render their own self-contained UI ────────
  if (viewState !== "loggedIn") {
    return (
      <AccountAuthState
        state={viewState}
        onRetry={() => {
          // [shopify-ready]: trigger refetch of customer/orders queries
          window.location.reload();
        }}
      />
    );
  }

  return <LoggedInAccount />;
}

function LoggedInAccount() {
  // Static mocks for now — sourced via data-access seam (lib/mock/account.ts).
  const customer     = useMemo(() => getCustomer(),     []);
  const orders       = useMemo(() => getOrders(),       []);
  const subscription = useMemo(() => getSubscription(), []);
  const addresses    = useMemo(() => getAddresses(),    []);

  const [section, setSection] = useState<AccountSection>("dashboard");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  /** Navigation handler — keeps section + selectedOrderId in sync. */
  function navigate(target: AccountSection, orderId?: string) {
    if (target === "order-details" && orderId) {
      setSelectedOrderId(orderId);
    } else if (target !== "order-details") {
      setSelectedOrderId(null);
    }
    setSection(target);
  }

  const selectedOrder =
    section === "order-details" && selectedOrderId
      ? orders.find((o) => o.id === selectedOrderId) ?? null
      : null;

  // ── Mobile bar title + back handling per section ───────────────────
  const mobileTitle = (() => {
    switch (section) {
      case "dashboard":     return "Konto";
      case "orders":        return "Zamówienia";
      case "order-details": return selectedOrder?.name ?? "Zamówienie";
      case "subscriptions": return "Subskrypcja";
      case "addresses":     return "Adresy";
      case "details":       return "Dane konta";
    }
  })();

  const mobileBack = section === "order-details";

  return (
    <AccountShell
      customer={customer}
      orders={orders}
      subscription={subscription}
      active={section}
      onNavigate={navigate}
      mobileTitle={mobileTitle}
      mobileBack={mobileBack}
      onMobileBack={() => navigate("orders")}
    >
      {section === "dashboard" && (
        <AccountDashboard
          customer={customer}
          orders={orders}
          subscription={subscription}
          onNavigate={navigate}
        />
      )}
      {section === "orders" && (
        <AccountOrders
          orders={orders}
          onSelectOrder={(id) => navigate("order-details", id)}
        />
      )}
      {section === "order-details" && selectedOrder && (
        <AccountOrderDetails order={selectedOrder} onBack={() => navigate("orders")} />
      )}
      {section === "subscriptions" && (
        <AccountSubscriptions subscription={subscription} />
      )}
      {section === "addresses" && (
        <AccountAddresses addresses={addresses} />
      )}
      {section === "details" && (
        <AccountDetails customer={customer} />
      )}
    </AccountShell>
  );
}
