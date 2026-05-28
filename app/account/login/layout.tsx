import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logowanie — Aura Coffee Roasters",
  description:
    "Zaloguj się do konta Aura. Zamówienia, subskrypcje, adresy w jednym miejscu.",
};

export default function AccountLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
