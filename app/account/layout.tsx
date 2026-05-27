import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konto — Aura Coffee Roasters",
  description: "Panel klienta — zamówienia, subskrypcje, adresy, dane konta.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
