import { SalesOrdersView } from "@/components/sales/sales-orders-view";

export const metadata = {
  title: "Sales Orders | Mahaurja Operations",
  description: "Customer sales orders booking and contract fulfillment tracking.",
};

export default function OrdersPage() {
  return <SalesOrdersView />;
}
