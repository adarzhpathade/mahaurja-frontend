import { PaymentsLedgerView } from "@/components/sales/payments-ledger-view";

export const metadata = {
  title: "Payments & Receivables | Mahaurja Operations",
  description: "Accounts receivable ledger, partial payment tracking, and receipt generation.",
};

export default function PaymentsPage() {
  return <PaymentsLedgerView />;
}
