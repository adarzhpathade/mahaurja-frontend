import { DispatchPlanningView } from "@/components/sales/dispatch-planning-view";

export const metadata = {
  title: "Dispatch Planning | Mahaurja Operations",
  description: "Stock verification against orders, allocation of approved FG batches to vehicles.",
};

export default function DispatchPage() {
  return <DispatchPlanningView />;
}
