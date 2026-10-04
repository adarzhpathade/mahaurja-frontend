import { QcOverview } from "@/components/quality/qc-overview";

export const metadata = {
  title: "QC Lab Overview | Mahaurja Operations",
  description: "Shift quality telemetry, active sampling queue, and finished pellet testing launchpad.",
};

export default function QualityHomePage() {
  return <QcOverview />;
}
