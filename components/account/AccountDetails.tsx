"use client";

import { AcctIcon } from "@/components/account/AccountIcons";
import { cn } from "@/lib/utils";
import type { AccountCustomer } from "@/types/account";

interface AccountDetailsProps {
  customer: AccountCustomer;
}

/**
 * Account profile + marketing consents.
 *
 * IMPORTANT: We DO NOT manage email / password / 2FA here — those are owned
 * by Shopify Customer Accounts. The CTA "Zarządzaj kontem" deep-links to
 * Shopify's customer account UI when wired up.
 *
 * [shopify-ready]: customerUpdate mutation for editable fields (firstName,
 * lastName, phone, acceptsMarketing).
 */
export function AccountDetails({ customer }: AccountDetailsProps) {
  const fields = [
    { eb: "Imię",     v: customer.firstName },
    { eb: "Nazwisko", v: customer.lastName },
    { eb: "Email",    v: customer.email,    verified: true },
    { eb: "Telefon",  v: customer.phone ?? "—" },
  ];

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <p
            className="text-brand uppercase mb-3"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
          >
            Dane konta
          </p>
          <h1
            className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4.5vw, 60px)" }}
          >
            Twoje
            <br />
            dane.
          </h1>
        </div>
        <span className="text-[13px] text-muted">Dane zsynchronizowane z Shopify</span>
      </header>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        {/* Profile card */}
        <section className="bg-paper border border-line rounded-md overflow-hidden">
          <div className="flex justify-between items-center px-5 lg:px-7 py-4 bg-paper-2 border-b border-line">
            <span
              className="text-muted uppercase"
              style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
            >
              Profil klienta
            </span>
            <span
              className="text-muted uppercase tabular-nums"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em" }}
            >
              ID · {customer.id.slice(-10)}
            </span>
          </div>

          <div className="px-5 lg:px-7 py-2">
            {fields.map((row, i, arr) => (
              <div
                key={row.eb}
                className={cn(
                  "flex justify-between items-center py-4 gap-4 flex-wrap",
                  i < arr.length - 1 && "border-b border-dashed border-line"
                )}
              >
                <div>
                  <div
                    className="text-muted uppercase mb-1"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
                  >
                    {row.eb}
                  </div>
                  <div className="text-[16px] lg:text-[17px] font-medium text-ink">
                    {row.v}
                    {row.verified && (
                      <span
                        className="text-ok uppercase ml-2"
                        style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" }}
                      >
                        ✓ Zweryfikowany
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] uppercase text-muted">Tylko do odczytu</span>
              </div>
            ))}
          </div>

          {/* Secure account banner */}
          <div className="flex items-center gap-3.5 bg-ink text-white px-5 lg:px-7 py-4">
            <span className="text-brand shrink-0">
              <AcctIcon.shield size={18} />
            </span>
            <div className="flex-1 min-w-0">
              <div
                className="text-brand uppercase mb-0.5"
                style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
              >
                Bezpieczne konto klienta
              </div>
              <div className="text-[13px] text-white/75 leading-[1.45]">
                Dane konta będą zarządzane bezpiecznie przez Shopify Customer Accounts.
              </div>
            </div>
          </div>
        </section>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Marketing consents */}
          <section className="bg-paper border border-line rounded-md p-5 lg:p-7">
            <p
              className="text-muted uppercase mb-3"
              style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
            >
              Zgody marketingowe
            </p>
            <h3
              className="font-extrabold text-[20px] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Co dostajesz
            </h3>

            <p className="text-[13px] text-muted leading-[1.5]">
              Zarządzanie zgodami nie jest jeszcze podłączone. Nie pokazujemy przełączników,
              dopóki zapis przez Shopify nie będzie aktywny.
            </p>
          </section>

          {/* Account export / danger zone */}
          <section className="border border-dashed border-line-strong rounded-md p-5 lg:p-6">
            <p
              className="text-muted uppercase mb-2.5"
              style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
            >
              Strefa konta
            </p>
            <h3
              className="font-extrabold text-[18px] tracking-[-0.02em] mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Eksport / usunięcie konta
            </h3>
            <p className="text-[13px] text-muted leading-[1.5] mb-3.5">
              Pobierz wszystkie swoje dane (RODO) lub poproś o trwałe usunięcie
              konta. Zamówienia archiwizowane zgodnie z prawem.
            </p>
            <p className="text-[12px] text-muted">Funkcja będzie dostępna po podłączeniu właściwego procesu Shopify.</p>
          </section>
        </div>
      </div>

      {/* Mobile-only logout — sidebar is desktop-only.
          [shopify-ready]: see handleLogout() above. */}
      <div className="lg:hidden mt-6">
        <a
          href="/api/auth/shopify/logout"
          className="w-full inline-flex items-center justify-center gap-2.5 h-12 rounded-pill border border-line bg-paper text-muted text-[13.5px] font-semibold hover:text-ink hover:border-ink transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
        >
          <AcctIcon.logout size={15} />
          Wyloguj
        </a>
      </div>
    </div>
  );
}
