"use client";

import { useEffect } from "react";
import { AuraErrorScreen } from "@/components/feedback/AuraErrorScreen";

export default function KoszykError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[aura/koszyk-error]", error);
    }
  }, [error]);

  return (
    <AuraErrorScreen
      title="Coś się zacięło w koszyku."
      body="Nie mogliśmy załadować twojego zamówienia. Spróbuj ponownie albo wróć do sklepu — koszyk czeka."
      reset={reset}
      homeHref="/produkty"
      homeLabel="Wróć do kaw"
    />
  );
}
