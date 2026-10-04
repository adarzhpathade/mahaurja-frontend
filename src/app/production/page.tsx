import { ProductionPlansView } from "@/components/production/production-plans-view";

export const metadata = {
  title: "Production Planning | Mahaurja Operations",
  description: "Shift target scheduling, configurable biomass blend ratios, and line allocation.",
};

export default function ProductionIndexPage() {
  return <ProductionPlansView />;
}
