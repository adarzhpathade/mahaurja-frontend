import { RmTestingWorkbench } from "@/components/quality/rm-testing-workbench";

export const metadata = {
  title: "Raw Material QC Testing | Mahaurja Operations",
  description: "Laboratory testing of inbound biomass parameters with instant tolerance checks and Approve/Hold/Reject decisions.",
};

export default function RmTestingPage() {
  return <RmTestingWorkbench />;
}
