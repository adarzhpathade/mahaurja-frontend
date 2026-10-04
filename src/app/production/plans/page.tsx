import { ProductionPlansView } from "@/components/production/production-plans-view";

export const metadata = {
  title: "Production Plans | Mahaurja Operations",
  description: "Shift target scheduling, configurable biomass blend ratios, and line allocation.",
};

export default function ProductionPlansPage() {
  return <ProductionPlansView />;
}
