"use client";

import { AccountEmptyState } from "@/components/account/AccountEmptyState";
import { AcctIcon } from "@/components/account/AccountIcons";
import { notifyShopifyAction } from "@/lib/account/feedback";
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
          body="Dodaj adres dostawy, żebyśmy mogli przyjąć Twoje pierwsze zamówienie. Możesz mieć ich kilka — dom, biuro, do mamy."
          cta={{ label: "Dodaj adres", href: "#add-address" }}
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
        <button
          type="button"
          onClick={() => notifyShopifyAction("Dodanie adresu")}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-pill bg-brand text-white border border-brand text-[13.5px] font-semibold hover:bg-brand-deep hover:border-brand-deep transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          /* [shopify-ready]: customerAddressCreate */
        >
          <AcctIcon.plus size={14} />
          Dodaj adres
        </button>
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
                  {a.label}
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
              <button
                type="button"
                onClick={() => notifyShopifyAction("Edycja adresu")}
                aria-label={`Edytuj adres ${a.label}`}
                className="text-muted hover:text-ink transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-pill p-1"
                /* [shopify-ready]: open address edit form → customerAddressUpdate */
              >
                <AcctIcon.edit size={16} />
              </button>
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

            <div
              className={cn("h-px my-5", a.isDefault ? "bg-ink/10" : "bg-line")}
              aria-hidden="true"
            />

            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => notifyShopifyAction("Edycja adresu")}
                /* [shopify-ready]: customerAddressUpdate */
                className="inline-flex items-center justify-center h-9 px-3.5 rounded-pill border border-line bg-paper text-ink text-[12.5px] font-semibold hover:border-ink transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              >
                Edytuj
              </button>
              {!a.isDefault && (
                <>
                  <button
                    type="button"
                    onClick={() => notifyShopifyAction("Ustawienie adresu domyślnego")}
                    /* [shopify-ready]: customerDefaultAddressUpdate */
                    className="inline-flex items-center justify-center h-9 px-3.5 rounded-pill border border-line bg-paper text-ink text-[12.5px] font-semibold hover:border-ink transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                  >
                    Ustaw jako domyślny
                  </button>
                  <button
                    type="button"
                    onClick={() => notifyShopifyAction("Usunięcie adresu")}
                    /* [shopify-ready]: customerAddressDelete */
                    className="inline-flex items-center justify-center h-9 px-3.5 rounded-pill border border-line bg-paper text-muted text-[12.5px] font-semibold hover:text-ink transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                  >
                    Usuń
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Add empty slot */}
      <button
        type="button"
        onClick={() => notifyShopifyAction("Dodanie adresu")}
        className="w-full min-h-[120px] inline-flex items-center justify-center gap-3 border-[1.5px] border-dashed border-line-strong rounded-md text-ink text-[14px] font-semibold hover:bg-paper-2 transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
        /* [shopify-ready]: customerAddressCreate */
      >
        <AcctIcon.plus size={16} />
        Dodaj nowy adres dostawy
      </button>
    </div>
  );
}
