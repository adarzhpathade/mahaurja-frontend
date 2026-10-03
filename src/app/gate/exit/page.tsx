"use client";

import { useRouter } from "next/navigation";
import { GateExit } from "@/components/gate/gate-exit";
import { useGate } from "@/lib/context/gate-context";

export default function GateExitPage() {
  const router = useRouter();
  const { vehicles, updateStage } = useGate();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "entry") {
      router.push("/gate/entry");
    } else if (tabId === "live-tracker") {
      router.push("/gate/tracker");
    } else if (tabId === "docs") {
      router.push("/gate/verification");
    } else {
      router.push("/gate");
    }
  };

  return (
    <GateExit
      vehicles={vehicles}
      onUpdateStage={updateStage}
      onNavigateTab={handleNavigateTab}
    />
  );
}
