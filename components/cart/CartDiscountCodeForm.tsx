"use client";

import { useState, type FormEvent } from "react";

import { useCart } from "@/lib/cart/cart-context";

export function CartDiscountCodeForm({ id }: { id: string }) {
  const { applyDiscountCode, discountCodes, isPending } = useCart();
  const [code, setCode] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = code.trim();
    if (!normalized) return;
    await applyDiscountCode(normalized);
  }

  return (
    <form onSubmit={submit} className="py-4 border-b-2 border-dashed border-line-strong">
      <label
        htmlFor={id}
        className="block text-muted uppercase mb-2 text-[10px]"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em" }}
      >
        Kod rabatowy
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          value={code}
          onChange={(event) => setCode(event.target.value)}
          autoComplete="off"
          placeholder="Wpisz kod"
          className="min-w-0 flex-1 h-10 rounded-md border border-line bg-paper-2 px-3 text-[13px] uppercase outline-none focus:border-ink"
        />
        <button
          type="submit"
          disabled={isPending || !code.trim()}
          className="h-10 rounded-pill border border-ink bg-ink px-4 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Zastosuj
        </button>
      </div>
      {/*
        Shopify keeps an inapplicable code attached to the cart on purpose —
        it can start applying once the cart meets the discount's conditions.
        The side effect is a warning banner in checkout, at the worst
        possible moment, so the customer needs a way out of it here.
      */}
      {discountCodes.map((discount) => (
        <p
          key={discount.code}
          className={`mt-2 flex items-center gap-2 text-[11px] ${
            discount.applicable ? "text-brand" : "text-muted"
          }`}
          role="status"
        >
          <span>
            {discount.applicable
              ? `Kod ${discount.code} został zastosowany.`
              : `Kod ${discount.code} nie jest dostępny dla tego koszyka.`}
          </span>
          <button
            type="button"
            onClick={() => applyDiscountCode("")}
            disabled={isPending}
            className="underline underline-offset-2 hover:text-ink transition-colors duration-[120ms] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-xs cursor-pointer"
          >
            Usuń
          </button>
        </p>
      ))}
    </form>
  );
}
