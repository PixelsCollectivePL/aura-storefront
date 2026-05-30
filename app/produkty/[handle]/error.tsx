"use client";

import { useEffect } from "react";
import { AuraErrorScreen } from "@/components/feedback/AuraErrorScreen";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[aura/produkt-error]", error);
    }
  }, [error]);

  return (
    <AuraErrorScreen
      title="Tej kawy chwilowo nie znajdziemy."
      body="Coś poszło nie tak przy ładowaniu produktu. Spróbuj ponownie albo wróć do listy."
      reset={reset}
      homeHref="/produkty"
      homeLabel="Wszystkie kawy"
    />
  );
}
