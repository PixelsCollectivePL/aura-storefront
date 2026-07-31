import type { MetadataRoute } from "next";
import { getProductHandles } from "@/lib/shopify";
import { getSiteUrl } from "@/lib/seo/site-url";

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/produkty", changeFrequency: "daily", priority: 0.9 },
  { path: "/blendy", changeFrequency: "weekly", priority: 0.7 },
  { path: "/o-marce", changeFrequency: "monthly", priority: 0.6 },
  { path: "/kontakt", changeFrequency: "yearly", priority: 0.4 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteUrl();
  const handles = await getProductHandles();

  return [
    ...STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
      url: new URL(path, origin).toString(),
      changeFrequency,
      priority,
    })),
    ...handles.map((handle) => ({
      url: new URL(`/produkty/${encodeURIComponent(handle)}`, origin).toString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
