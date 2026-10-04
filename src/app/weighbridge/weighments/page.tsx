import { WeighmentsLedger } from "@/components/weighbridge/weighments-ledger";

export const metadata = {
  title: "Weight Records & Weighbridge Slips | Mahaurja Operations",
  description: "Searchable metrology records, official printable weighbridge slips, and gross/tare/net audit trail.",
};

export { WeighmentsLedger as WeightRecordsPage };
export default function Page() {
  return <WeighmentsLedger />;
}
