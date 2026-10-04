import { MaterialIssueWorkbench } from "@/components/production/material-issue-workbench";

export const metadata = {
  title: "Material Issue to Plant | Mahaurja Operations",
  description: "Raw material lot deduction and issue to active production shift plan.",
};

export default function MaterialIssuePage() {
  return <MaterialIssueWorkbench />;
}
