/**
 * Canonical public origin used by Next.js metadata routes.
 *
 * `NEXT_PUBLIC_APP_URL` remains the source of truth because OAuth uses the
 * same origin. Vercel host variables are safe fallbacks for deployments;
 * localhost only keeps env-free test/build jobs deterministic.
 */
export function getSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) return new URL(configured);

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return new URL(`https://${vercelHost}`);

  return new URL("http://localhost:3000");
}
