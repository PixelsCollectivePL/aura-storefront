"use client";

import { AccountEmptyState } from "@/components/account/AccountEmptyState";
import { cn } from "@/lib/utils";
import type { AccountAddress } from "@/types/account";

interface AccountAddressesProps {
  addresses: AccountAddress[];
}

/**
 * Customer-saved addresses.
 * All edit / set-default / delete actions are UI placeholders.
 *
 * [shopify-ready]: customerAddressCreate / customerAddressUpdate /
 * customerAddressDelete / customerDefaultAddressUpdate mutations.
 */
export function AccountAddresses({ addresses }: AccountAddressesProps) {
  if (addresses.length === 0) {
    return (
      <div>
        <header className="mb-6 lg:mb-8">
          <p
            className="text-brand uppercase mb-3"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
          >
            Adresy · 00
          </p>
          <h1
            className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4.5vw, 60px)" }}
          >
            Bez adresu
            <br />
            nie wyślemy.
          </h1>
        </header>
        <AccountEmptyState
          title="Pusto."
          body="Nie masz jeszcze zapisanego adresu w Shopify. Dodawanie i edycję włączymy po podłączeniu mutacji adresowych."
        />
      </div>
    );
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <p
            className="text-brand uppercase mb-3"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em" }}
          >
            Adresy · {String(addresses.length).padStart(2, "0")}
          </p>
          <h1
            className="font-extrabold tracking-[-0.03em] leading-[0.95] text-ink"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4.5vw, 60px)" }}
          >
            Gdzie
            <br />
            wysłać paczkę?
          </h1>
        </div>
        <span className="text-[13px] text-muted">Adresy zsynchronizowane z Shopify</span>
      </header>

      <div className="grid sm:grid-cols-2 gap-4 lg:gap-5 mb-5">
        {addresses.map((a) => (
          <article
            key={a.id}
            className={cn(
              "relative rounded-md p-6 lg:p-7",
              a.isDefault
                ? "bg-paper-2 border-[1.5px] border-ink"
                : "bg-paper border-[1.5px] border-line"
            )}
          >
            <div className="flex justify-between items-start mb-4 gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className="uppercase bg-ink text-white px-2.5 py-1 rounded-xs"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", fontWeight: 600 }}
                >
                  {a.label ?? "Adres"}
                </span>
                {a.isDefault && (
                  <span
                    className="text-brand uppercase"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", fontWeight: 600 }}
                  >
                    ★ Adres domyślny
                  </span>
                )}
              </div>
            </div>

            <div
              className="font-extrabold tracking-[-0.025em] leading-[1.05] text-[22px] lg:text-[26px] mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {a.firstName} {a.lastName}
            </div>
            <div className="text-[14px] lg:text-[15px] leading-[1.55] text-ink mb-3">
              {a.company && (
                <>
                  {a.company}
                  <br />
                </>
              )}
              {a.address1}
              {a.address2 && (
                <>
                  <br />
                  {a.address2}
                </>
              )}
              <br />
              {a.zip} {a.city}
              <br />
              {a.country}
            </div>
            <div
              className="text-muted uppercase"
              style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em" }}
            >
              {a.phone}
            </div>

          </article>
        ))}
      </div>

    </div>
  );
}
