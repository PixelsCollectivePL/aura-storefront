import { AuraLoading } from "@/components/feedback/AuraLoading";

export default function ProduktyLoading() {
  return (
    <AuraLoading
      message="Otwieramy paczki…"
      hint="Sprawdzamy stan magazynu i ważymy każdy lot."
    />
  );
}
