import Link from "next/link";
import { AuraMark } from "@/components/brand/AuraMark";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Login card for /account/login.
 *
 * Branded bridge to the real Shopify Customer Accounts OAuth flow.
 * There are deliberately no credentials fields: Aura never handles passwords.
 */
export function AccountAuthCard() {
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
          — Aura Coffee Club
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
          Dołącz do
          <br />
          swojego rytuału.
        </h1>

        {/* Body */}
        <p className="text-[15.5px] lg:text-[17px] text-muted leading-[1.55] mb-9 max-w-[440px]">
          Jedno konto do zamówień, zapisanych adresów i szybszego checkoutu.
          Bez haseł — Shopify wyśle Ci jednorazowy kod na e-mail.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-2.5 mb-10">
          <a
            href="/api/auth/shopify/login?returnTo=/konto"
            className={cn(
              "inline-flex items-center justify-center gap-2 h-14 w-full",
              "rounded-pill bg-brand text-white border border-brand",
              "text-[15px] font-semibold tracking-[-0.005em]",
              "hover:bg-brand-deep hover:border-brand-deep",
              "transition-colors duration-[150ms] cursor-pointer",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            )}
          >
            Zaloguj się lub dołącz
            <Icon.arrow size={16} />
          </a>
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
            "Historia zamówień i status paczki zawsze pod ręką.",
            "Zapisane adresy i rozpoznanie klienta w checkoutcie.",
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
            Bezpieczne logowanie obsługuje Shopify Customer Accounts. Aura nie
            przechowuje Twojego hasła.
          </p>
        </div>
      </div>
    </section>
  );
}
