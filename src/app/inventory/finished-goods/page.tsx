import { FinishedGoodsView } from "@/components/inventory/finished-goods-view";

export const metadata = {
  title: "Finished Goods Stock | Mahaurja Operations",
  description: "Finished biomass pellet stock classified by Produced, QC Pending, QC Approved, and Dispatchable.",
};

export default function FinishedGoodsPage() {
  return <FinishedGoodsView />;
}
