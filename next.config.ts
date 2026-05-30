import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
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
