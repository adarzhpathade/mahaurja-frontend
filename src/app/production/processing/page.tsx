import { ProcessingStagesConsole } from "@/components/production/processing-stages-console";

export const metadata = {
  title: "7-Stage Processing Console | Mahaurja Operations",
  description: "Live 7-stage pelletising line monitor covering cleaning, grinding, drying, blending, pelletisation, cooling, and screening.",
};

export default function ProcessingPage() {
  return <ProcessingStagesConsole />;
}
