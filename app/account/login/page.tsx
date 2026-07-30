import { redirect } from "next/navigation";

export default function LegacyLoginPage() {
  redirect("/api/auth/shopify/login?returnTo=/konto");
}
