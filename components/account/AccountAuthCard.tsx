"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuraMark } from "@/components/brand/AuraMark";
import { Icon } from "@/components/ui/Icon";
import { setMockAuthenticated } from "@/lib/account/auth";
import { showToast } from "@/lib/toast/toast";
import { cn } from "@/lib/utils";

/**
 * Login card for /account/login.
 *
 * IMPORTANT — no real auth on this stage.
 *
 * The primary CTA is a placeholder; it triggers a toast explaining that
 * Shopify Customer Accounts will own this flow. We intentionally render
 * NO email/password form so the page reads honestly as "Shopify-managed".
 *
 * [shopify-ready]: replace handleLogin() with redirect to Shopify
 *   Customer Accounts login URL (e.g. https://shopify.com/<shop>/account/login
 *   with appropriate return URL parameter).
 */
export function AccountAuthCard() {
  const router = useRouter();

  function handleLogin() {
    // [shopify-ready]: replace with redirect to Shopify Customer Accounts
    //   login URL, e.g.:
    //   window.location.href =
    //     `${SHOPIFY_LOGIN_URL}?return_url=` +
    //     encodeURIComponent(window.location.origin + "/account");
    setMockAuthenticated(true);
    showToast("Zalogowano (mock) — integracja Shopify w kolejnym etapie");
    router.push("/account");
  }

  return (
    <section
      className="bg-paper flex flex-col justify-center px-5 py-12 lg:px-14 xl:px-20 lg:py-20"
      aria-labelledby="account-login-heading"
    >
      <div className="w-full max-w-[480px] mx-auto lg:mx-0">

        {/* Brand mark */}
        <div className="mb-8 lg:mb-10">
          <AuraMark size={28} color="var(--aura-ink)" variant="brand" />
        </div>

        {/* Eyebrow */}
        <p
          className="text-brand uppercase mb-4"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.16em",
          }}
        >
          — Logowanie
        </p>

        {/* H1 */}
        <h1
          id="account-login-heading"
          className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink mb-5"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4.5vw, 56px)",
          }}
        >
          Zaloguj się do
          <br />
          konta Aura.
        </h1>

        {/* Body */}
        <p className="text-[15.5px] lg:text-[17px] text-muted leading-[1.55] mb-9 max-w-[440px]">
          Sprawdź zamówienia, subskrypcje i wróć do ulubionych blendów.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-2.5 mb-10">
          <button
            type="button"
            onClick={handleLogin}
            className={cn(
              "inline-flex items-center justify-center gap-2 h-14 w-full",
              "rounded-pill bg-brand text-white border border-brand",
              "text-[15px] font-semibold tracking-[-0.005em]",
              "hover:bg-brand-deep hover:border-brand-deep",
              "transition-colors duration-[150ms] cursor-pointer",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            )}
          >
            Zaloguj się
            <Icon.arrow size={16} />
          </button>
          <Link
            href="/"
            className={cn(
              "inline-flex items-center justify-center h-14 w-full",
              "rounded-pill bg-paper text-ink border border-line",
              "text-[15px] font-semibold tracking-[-0.005em]",
              "hover:border-ink hover:bg-paper-2",
              "transition-colors duration-[150ms]",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            )}
          >
            Wróć do sklepu
          </Link>
        </div>

        {/* Receipt-style perks list */}
        <ul className="flex flex-col gap-3.5 pt-7 mb-7 border-t border-dashed border-line">
          {[
            "Twoje zamówienia, adresy i subskrypcje w jednym miejscu.",
            "Konto utworzysz przy pierwszym zamówieniu.",
          ].map((line) => (
            <li key={line} className="flex items-start gap-3 text-[13.5px] text-ink leading-[1.5]">
              <span
                className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-paper-2 text-brand mt-0.5"
                aria-hidden="true"
              >
                <Icon.check size={11} />
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {/* Trust note — Shopify */}
        <div
          className="flex items-start gap-3 px-4 py-3.5 bg-paper-2 rounded-md border border-line"
          /* [shopify-ready]: Shopify Customer Accounts handles login,
             2FA, password resets, email changes. We never own any of it. */
        >
          <span className="text-brand shrink-0 mt-0.5" aria-hidden="true">
            <Icon.shield size={14} />
          </span>
          <p
            className="text-[11.5px] leading-[1.55] text-muted uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
          >
            Logowanie będzie obsługiwane bezpiecznie przez Shopify Customer
            Accounts.
          </p>
        </div>
      </div>
    </section>
  );
}
