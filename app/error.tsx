"use client";

import { useEffect } from "react";
import { AuraErrorScreen } from "@/components/feedback/AuraErrorScreen";

/**
 * Root error boundary — fallback for any route that doesn't ship its own
 * `error.tsx`. Activates whenever a server / client component throws
 * during render or data fetching.
 *
 * Per Next.js: receives `error` and `reset`. Must be "use client".
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // [shopify-ready]: pipe to Sentry / observability sink during integration
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[aura/root-error]", error);
    }
  }, [error]);

  return <AuraErrorScreen reset={reset} />;
}
