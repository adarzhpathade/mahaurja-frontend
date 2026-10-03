"use client";

import { useRouter } from "next/navigation";
import { GateDocVerification } from "@/components/gate/gate-doc-verification";
import { useGate } from "@/lib/context/gate-context";

export default function GateVerificationPage() {
  const router = useRouter();
  const { vehicles, updateStage } = useGate();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "entry") {
      router.push("/gate/entry");
    } else if (tabId === "live-tracker") {
      router.push("/gate/tracker");
    } else if (tabId === "exit") {
      router.push("/gate/exit");
    } else {
      router.push("/gate");
    }
  };

  return (
    <GateDocVerification
      vehicles={vehicles}
      onUpdateStage={updateStage}
      onNavigateTab={handleNavigateTab}
    />
  );
}
