import { RawMaterialsView } from "@/components/inventory/raw-materials-view";

export const metadata = {
  title: "Raw Material Yards | Mahaurja Operations",
  description: "Location-wise biomass stock map, occupancy telemetry, and storage yard management.",
};

export default function RawMaterialsPage() {
  return <RawMaterialsView />;
}
