import { AccountLogin } from "@/components/account/AccountLogin";

/**
 * /account/login — dedicated split-screen login page.
 *
 * Auth strategy: Shopify Customer Accounts (deferred).
 * UI today is a placeholder — see components/account/AccountAuthCard for
 * the click handler that will become a Shopify login redirect.
 *
 * The shared inline logged-out state still lives at
 *   /account?state=loggedOut
 * via AccountAuthState, and its "Zaloguj się" CTA links here.
 */
export default function AccountLoginPage() {
  return <AccountLogin />;
}
