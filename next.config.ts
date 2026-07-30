import type { NextConfig } from "next";

/**
 * Indexing is opt-in via `AURA_ALLOW_INDEXING=true`. Read here as well as
 * in `lib/seo/indexing.ts` because `headers()` runs at build time and
 * cannot import from the app graph.
 *
 * Consequence worth remembering: flipping this variable in Vercel requires
 * a redeploy for the header to change.
 */
const allowIndexing = process.env.AURA_ALLOW_INDEXING === "true";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  /**
   * `X-Robots-Tag` on every response, so the directive also covers what a
   * meta tag cannot: images, JSON, and any non-HTML route. Paired with the
   * meta tag in `app/layout.tsx` and a crawl-allowing `robots.txt` — see
   * `lib/seo/indexing.ts` for why blocking the crawl would backfire.
   */
  async headers() {
    if (allowIndexing) return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },

  /**
   * Image domains.
   *
   * Today: only `/public/assets/brand/*` PNGs are used, which Next/Image
   * serves locally and does NOT require allow-listing.
   *
   * [shopify-ready]: when wiring Storefront API, product images come from
   * the Shopify CDN — both `cdn.shopify.com` (legacy) and
   * `cdn.shopifycdn.net` (newer) are used. Pre-allowlisted now so we
   * don't trip over a config change during integration.
   *
   * Other patterns to add per integration:
   *   - The customer's media host (if avatars are stored on Shopify).
   *   - Any third-party (e.g. CDN behind Klaviyo for avatars).
   */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "cdn.shopifycdn.net" },
    ],
  },
};

export default nextConfig;
