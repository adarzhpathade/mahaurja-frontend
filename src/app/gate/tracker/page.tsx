"use client";

import { useRouter } from "next/navigation";
import { LiveVehicleTracker } from "@/components/gate/live-vehicle-tracker";
import { useGate } from "@/lib/context/gate-context";

export default function GateTrackerPage() {
  const router = useRouter();
  const { vehicles, updateStage, addVehicle, openEntryModal } = useGate();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "entry") {
      openEntryModal();
    } else if (tabId === "exit") {
      router.push("/gate/exit");
    } else if (tabId === "docs") {
      router.push("/gate/verification");
    } else {
      router.push("/gate");
    }
  };

  return (
    <LiveVehicleTracker
      vehicles={vehicles}
      onUpdateStage={updateStage}
      onAddVehicle={addVehicle}
      onNavigateTab={handleNavigateTab}
    />
  );
}
