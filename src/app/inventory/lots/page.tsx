import { LotsTraceabilityView } from "@/components/inventory/lots-traceability-view";

export const metadata = {
  title: "Lot Traceability Ledger | Mahaurja Operations",
  description: "Complete raw material lot digital ledger linking supplier, vehicle, weighbridge, and storage location.",
};

export default function LotsPage() {
  return <LotsTraceabilityView />;
}
