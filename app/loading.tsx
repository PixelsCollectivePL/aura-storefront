import { AuraLoading } from "@/components/feedback/AuraLoading";

/**
 * Root loading state — fallback for any route that doesn't ship its own
 * `loading.tsx`. Activates automatically via Next.js Suspense whenever
 * a server component is `await`-ing data.
 */
export default function RootLoading() {
  return <AuraLoading />;
}
