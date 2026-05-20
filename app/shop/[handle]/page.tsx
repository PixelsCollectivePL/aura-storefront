import { redirect } from "next/navigation";

/**
 * /shop/[handle] → /produkty/[handle] permanent redirect.
 * Old PDP route kept working while v2.1 PDP lives at /produkty/[handle].
 */
export default async function OldProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  redirect(`/produkty/${handle}`);
}
