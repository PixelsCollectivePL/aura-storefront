"use client";

import { useEffect } from "react";
import { AuraErrorScreen } from "@/components/feedback/AuraErrorScreen";

export default function ProduktyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[aura/produkty-error]", error);
    }
  }, [error]);

  return (
    <AuraErrorScreen
      title="Półka się przewróciła."
      body="Nie mogliśmy załadować listy kaw. Spróbuj ponownie albo wróć do sklepu."
      reset={reset}
    />
  );
}
