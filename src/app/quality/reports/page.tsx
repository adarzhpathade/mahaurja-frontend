import { QcRecordsLedger } from "@/components/quality/qc-records-ledger";

export const metadata = {
  title: "QC Reports & COA Ledger | Mahaurja Operations",
  description: "Searchable quality control records, lab sign-offs, and printable Certificate of Analysis documents.",
};

export default function QcReportsPage() {
  return <QcRecordsLedger />;
}
