import { SalesOrdersView } from "@/components/sales/sales-orders-view";

export const metadata = {
  title: "Sales & Dispatch | Mahaurja Operations",
  description: "Customer sales orders, vehicle dispatch planning, invoices, and payment tracking.",
};

export default function SalesIndexPage() {
  return <SalesOrdersView />;
}
