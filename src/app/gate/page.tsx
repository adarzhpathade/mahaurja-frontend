"use client";

import { useRouter } from "next/navigation";
import { GateHome } from "@/components/gate/gate-home";
import { useGate } from "@/lib/context/gate-context";
import { GateVehicle } from "@/lib/types/gate";

export default function GateHomePage() {
  const router = useRouter();
  const { setPrefillEntryData } = useGate();

  const handleOpenEntryDesk = (prefillData?: Partial<GateVehicle>) => {
    if (prefillData) {
      setPrefillEntryData(prefillData);
    }
    router.push("/gate/entry");
  };

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "entry") {
      router.push("/gate/entry");
    } else if (tabId === "live-tracker") {
      router.push("/gate/tracker");
    } else if (tabId === "exit") {
      router.push("/gate/exit");
    } else if (tabId === "docs") {
      router.push("/gate/verification");
    } else {
      router.push("/gate");
    }
  };

  return (
    <GateHome
      onNavigateTab={handleNavigateTab}
      onOpenEntryModal={handleOpenEntryDesk}
    />
  );
}
