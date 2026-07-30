import "server-only";

import { shopifyFetch } from "./client";

const VARIANTS_BY_ID_QUERY = /* GraphQL */ `
  query VariantsById($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        title
        availableForSale
        quantityAvailable
        product { title handle }
      }
    }
  }
`;

export interface PurchasableVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  product: { title: string; handle: string };
}

/** Current catalog state for historical variant ids. Missing nodes were deleted. */
export async function getVariantsByIds(
  ids: string[],
  buyerIp?: string
): Promise<PurchasableVariant[]> {
  if (ids.length === 0) return [];
  const data = await shopifyFetch<{ nodes: Array<PurchasableVariant | null> }>({
    query: VARIANTS_BY_ID_QUERY,
    variables: { ids: [...new Set(ids)].slice(0, 250) },
    buyerIp,
    revalidate: false,
    tags: [],
  });
  return data.nodes.filter((node): node is PurchasableVariant => Boolean(node));
}
