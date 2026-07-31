import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site-url";

/**
 * `/robots.txt`
 *
 * Crawling is allowed even while the site is not indexable — see the
 * explanation in `lib/seo/indexing.ts`. A crawler must be able to fetch a
 * page to read its `noindex`; blocking it here would leave URLs eligible
 * for indexing with no content and no way to opt out.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: new URL("/sitemap.xml", getSiteUrl()).toString(),
  };
}
