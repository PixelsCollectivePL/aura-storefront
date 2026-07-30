"use client";

export default function KontoError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-[50vh] place-items-center text-center">
      <div>
        <h1 className="text-3xl font-extrabold">Nie udało się pobrać konta.</h1>
        <p className="mt-3 text-muted">Shopify chwilowo nie zwróciło danych. Spróbuj ponownie.</p>
        <button type="button" onClick={reset} className="mt-6 rounded-pill bg-brand px-6 py-3 font-semibold text-white">
          Ponów próbę
        </button>
      </div>
    </div>
  );
}
