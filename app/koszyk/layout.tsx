import type { Metadata } from "next";
import { CONTENT } from "@/lib/content/pl";

const { koszyk: c, meta } = CONTENT;

export const metadata: Metadata = {
  title: `${c.meta.title} — ${meta.siteTitle}`,
  description: c.meta.description,
};

export default function KoszykLayout({ children }: { children: React.ReactNode }) {
  return children;
}
