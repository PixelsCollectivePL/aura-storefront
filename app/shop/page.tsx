import { redirect } from "next/navigation";

/**
 * /shop → /produkty permanent redirect.
 * Keeps existing links working.
 */
export default function ShopPage() {
  redirect("/produkty");
}
