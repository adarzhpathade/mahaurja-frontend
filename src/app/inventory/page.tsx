import { RawMaterialsView } from "@/components/inventory/raw-materials-view";

export const metadata = {
  title: "Warehouse Inventory | Mahaurja Operations",
  description: "Location-wise biomass stock map, occupancy telemetry, and storage yard management.",
};

export default function InventoryIndexPage() {
  return <RawMaterialsView />;
}
