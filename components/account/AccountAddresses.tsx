"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  deleteAddressAction,
  saveAddressAction,
  setDefaultAddressAction,
  type AddressActionInput,
} from "@/app/actions/account-addresses";
import { AccountEmptyState } from "@/components/account/AccountEmptyState";
import { AcctIcon } from "@/components/account/AccountIcons";
import { showToast } from "@/lib/toast/toast";
import { cn } from "@/lib/utils";
import type { AccountAddress } from "@/types/account";

interface AccountAddressesProps { addresses: AccountAddress[] }

export function AccountAddresses({ addresses }: AccountAddressesProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<AccountAddress | "new" | null>(null);
  const [isPending, startTransition] = useTransition();

  function finish(message: string) {
    showToast(message);
    setEditing(null);
    router.refresh();
  }

  function submit(form: HTMLFormElement) {
    const data = new FormData(form);
    const input: AddressActionInput = {
      id: editing && editing !== "new" ? editing.id : undefined,
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      company: String(data.get("company") ?? ""),
      address1: String(data.get("address1") ?? ""),
      address2: String(data.get("address2") ?? ""),
      city: String(data.get("city") ?? ""),
      zip: String(data.get("zip") ?? ""),
      territoryCode: String(data.get("territoryCode") ?? "PL"),
      zoneCode: String(data.get("zoneCode") ?? ""),
      phoneNumber: String(data.get("phoneNumber") ?? ""),
      makeDefault: data.get("makeDefault") === "on",
    };
    startTransition(async () => {
      const result = await saveAddressAction(input);
      if (result.ok) finish(input.id ? "Adres został zaktualizowany." : "Adres został dodany.");
      else showToast(result.error ?? "Nie udało się zapisać adresu.");
    });
  }

  function remove(address: AccountAddress) {
    if (!window.confirm(`Usunąć adres ${address.firstName} ${address.lastName}, ${address.address1}?`)) return;
    startTransition(async () => {
      const result = await deleteAddressAction(address.id);
      if (result.ok) finish("Adres został usunięty.");
      else showToast(result.error ?? "Nie udało się usunąć adresu.");
    });
  }

  function makeDefault(address: AccountAddress) {
    startTransition(async () => {
      const result = await setDefaultAddressAction(address.id);
      if (result.ok) finish("Ustawiono adres domyślny.");
      else showToast(result.error ?? "Nie udało się ustawić adresu domyślnego.");
    });
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <p className="text-brand uppercase mb-3 font-mono text-[11px] tracking-[0.14em]">
            Adresy · {String(addresses.length).padStart(2, "0")}
          </p>
          <h1 className="font-display font-extrabold tracking-[-0.03em] leading-[0.95] text-ink text-[clamp(36px,4.5vw,60px)]">
            Gdzie<br />wysłać paczkę?
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          disabled={isPending}
          className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-brand bg-brand px-5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
        >
          <AcctIcon.plus size={14} /> Dodaj adres
        </button>
      </header>

      {editing && (
        <AddressForm
          key={editing === "new" ? "new" : editing.id}
          address={editing === "new" ? undefined : editing}
          pending={isPending}
          onCancel={() => setEditing(null)}
          onSubmit={submit}
        />
      )}

      {addresses.length === 0 && !editing ? (
        <AccountEmptyState
          title="Pusto."
          body="Dodaj pierwszy adres dostawy. Zapiszemy go bezpośrednio na Twoim koncie Shopify i udostępnimy w checkoutcie."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
          {addresses.map((address) => (
            <article
              key={address.id}
              className={cn(
                "relative rounded-md border-[1.5px] p-6 lg:p-7",
                address.isDefault ? "border-ink bg-paper-2" : "border-line bg-paper"
              )}
            >
              <div className="mb-4 flex flex-wrap items-center gap-2.5">
                <span className="rounded-xs bg-ink px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white">Adres</span>
                {address.isDefault && <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">★ Domyślny</span>}
              </div>
              <h2 className="mb-3 font-display text-[24px] font-extrabold leading-none tracking-[-0.025em]">
                {address.firstName} {address.lastName}
              </h2>
              <address className="mb-5 text-[14px] not-italic leading-[1.55] text-ink">
                {address.company && <>{address.company}<br /></>}
                {address.address1}{address.address2 && <><br />{address.address2}</>}<br />
                {address.zip} {address.city}<br />{address.country}
                {address.phone && <><br />{address.phone}</>}
              </address>
              <div className="flex flex-wrap gap-2 border-t border-dashed border-line pt-4">
                <Action onClick={() => setEditing(address)} disabled={isPending}>Edytuj</Action>
                {!address.isDefault && <Action onClick={() => makeDefault(address)} disabled={isPending}>Ustaw jako domyślny</Action>}
                {!address.isDefault && <Action onClick={() => remove(address)} disabled={isPending} muted>Usuń</Action>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressForm({ address, pending, onCancel, onSubmit }: {
  address?: AccountAddress;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (form: HTMLFormElement) => void;
}) {
  return (
    <section id="address-form" className="mb-6 rounded-md border border-ink bg-paper-2 p-5 lg:p-7" aria-labelledby="address-form-title">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-brand">Shopify Customer Account</p>
          <h2 id="address-form-title" className="font-display text-[28px] font-extrabold tracking-[-0.025em]">
            {address ? "Edytuj adres" : "Nowy adres"}
          </h2>
        </div>
        <button type="button" onClick={onCancel} aria-label="Zamknij formularz" className="min-h-11 min-w-11 rounded-pill text-muted hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-brand">✕</button>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); onSubmit(event.currentTarget); }} className="grid gap-4 sm:grid-cols-2">
        <Field label="Imię" name="firstName" defaultValue={address?.firstName} autoComplete="given-name" required />
        <Field label="Nazwisko" name="lastName" defaultValue={address?.lastName} autoComplete="family-name" required />
        <Field label="Firma (opcjonalnie)" name="company" defaultValue={address?.company} autoComplete="organization" />
        <Field label="Telefon (opcjonalnie)" name="phoneNumber" type="tel" defaultValue={address?.phone} autoComplete="tel" />
        <Field label="Ulica i numer" name="address1" defaultValue={address?.address1} autoComplete="address-line1" required wide />
        <Field label="Lokal / piętro (opcjonalnie)" name="address2" defaultValue={address?.address2} autoComplete="address-line2" wide />
        <Field label="Kod pocztowy" name="zip" defaultValue={address?.zip} autoComplete="postal-code" required />
        <Field label="Miasto" name="city" defaultValue={address?.city} autoComplete="address-level2" required />
        <Field label="Kod kraju" name="territoryCode" defaultValue={address?.countryCode ?? "PL"} autoComplete="off" required maxLength={2} />
        <Field label="Kod województwa / regionu (opcjonalnie)" name="zoneCode" defaultValue={address?.zoneCode} autoComplete="address-level1" />
        <label className="flex min-h-11 items-center gap-3 text-[13px] sm:col-span-2">
          <input type="checkbox" name="makeDefault" defaultChecked={address?.isDefault ?? false} className="h-5 w-5 accent-[var(--aura-orange)]" />
          Ustaw jako domyślny adres dostawy
        </label>
        <div className="flex flex-wrap justify-end gap-2 sm:col-span-2">
          <button type="button" onClick={onCancel} disabled={pending} className="min-h-11 rounded-pill border border-line bg-paper px-5 text-[13px] font-semibold hover:border-ink disabled:opacity-60">Anuluj</button>
          <button type="submit" disabled={pending} className="min-h-11 rounded-pill border border-brand bg-brand px-6 text-[13px] font-semibold text-white hover:bg-brand-deep disabled:cursor-wait disabled:opacity-60">
            {pending ? "Zapisywanie…" : "Zapisz adres"}
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, wide, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; wide?: boolean }) {
  return (
    <label className={cn("grid gap-1.5", wide && "sm:col-span-2")}>
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{label}</span>
      <input {...props} className="min-h-12 rounded-md border border-line bg-paper px-4 text-[16px] text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-brand/20" />
    </label>
  );
}

function Action({ muted, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { muted?: boolean }) {
  return <button type="button" {...props} className={cn("min-h-9 rounded-pill border border-line bg-paper px-3.5 text-[12px] font-semibold hover:border-ink disabled:cursor-wait disabled:opacity-60", muted && "text-muted hover:text-ink")} />;
}
