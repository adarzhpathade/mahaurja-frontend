import { BatchHistoryView } from "@/components/production/batch-history-view";

export const metadata = {
  title: "Production Batch History | Mahaurja Operations",
  description: "Finished goods batch records, net yield metrology, and shift downtime tracking.",
};

export default function BatchesPage() {
  return <BatchHistoryView />;
}
