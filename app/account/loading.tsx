import { AuraLoading } from "@/components/feedback/AuraLoading";

export default function AccountLoading() {
  return (
    <AuraLoading
      message="Otwieramy twoje konto…"
      hint="Pobieramy zamówienia i subskrypcje."
    />
  );
}
