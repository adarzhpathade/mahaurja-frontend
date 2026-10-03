"use client";

import { useRouter } from "next/navigation";
import { GateHome } from "@/components/gate/gate-home";
import { useGate } from "@/lib/context/gate-context";

export default function GateHomePage() {
  const router = useRouter();
  const { openEntryModal } = useGate();

  const handleNavigateTab = (tabId: string) => {
    if (tabId === "entry") {
      openEntryModal();
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
      onOpenEntryModal={openEntryModal}
    />
  );
}
