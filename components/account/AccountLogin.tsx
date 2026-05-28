import { AccountBrandPanel } from "@/components/account/AccountBrandPanel";
import { AccountAuthCard } from "@/components/account/AccountAuthCard";

/**
 * /account/login composition.
 *
 * Desktop: 50/50 split — brand panel on the left, auth card on the right.
 * Mobile:  single column — brand band on top, auth card below.
 *
 * Fills the viewport minus the project header (mobile ≈56px / desktop 80px)
 * so the page reads as its own focused moment.
 */
export function AccountLogin() {
  return (
    <div
      className="grid lg:grid-cols-2 bg-paper"
      style={{
        // viewport height minus sticky project header
        minHeight: "calc(100svh - 56px)",
      }}
    >
      <AccountBrandPanel />
      <AccountAuthCard />
    </div>
  );
}
