"use client";

import { useEffect } from "react";
import { AuraErrorScreen } from "@/components/feedback/AuraErrorScreen";

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[aura/account-error]", error);
    }
  }, [error]);

  return (
    <AuraErrorScreen
      title="Nie mogliśmy załadować konta."
      body="Spróbuj odświeżyć stronę. Jeśli problem zostaje — napisz na hello@aura.coffee."
      reset={reset}
    />
  );
}
