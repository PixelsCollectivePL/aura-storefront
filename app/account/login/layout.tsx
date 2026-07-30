import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aura Coffee Club — Aura Coffee Roasters",
  description:
    "Zaloguj się lub dołącz do Aura Coffee Club. Zamówienia i adresy w jednym miejscu.",
};

export default function AccountLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
