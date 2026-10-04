"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { IndustrialNav, ROLE_GATE_SECURITY } from "@/components/layout/industrial-nav";
import { GateProvider, useGate } from "@/lib/context/gate-context";
import { GateEntryModal } from "@/components/gate/gate-entry-modal";
import { GateVehicle } from "@/lib/types/gate";
import { IndustrialSkeleton } from "@/components/ui/industrial-skeleton";
import { useNavTransition } from "@/lib/hooks/use-nav-transition";

function GateNavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isNavigating, navigateTo } = useNavTransition();
  const {
    addVehicle,
    isEntryModalOpen,
    closeEntryModal,
    openEntryModal,
    prefillEntryData,
  } = useGate();

  // Determine active desk tab based on current route
  const getActiveTab = () => {
    if (pathname === "/gate/entry") return "entry";
    if (pathname === "/gate/tracker") return "live-tracker";
    if (pathname === "/gate/exit") return "exit";
    return "home"; // default /gate
  };

  const handleTabChange = (tabId: string, href?: string) => {
    if (href) {
      navigateTo(href);
    } else if (tabId === "entry") {
      navigateTo("/gate/entry");
    } else if (tabId === "live-tracker") {
      navigateTo("/gate/tracker");
    } else if (tabId === "exit") {
      navigateTo("/gate/exit");
    } else {
      navigateTo("/gate");
    }
  };

  const handleAddVehicleFromModal = (vehicle: GateVehicle) => {
    addVehicle(vehicle);
    closeEntryModal();
    navigateTo("/gate/tracker");
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-neutral-900 flex flex-col select-none">
      {/* Precision Industrial Top Navigation */}
      <IndustrialNav
        currentRole={ROLE_GATE_SECURITY}
        activeTabId={getActiveTab()}
        onTabChange={handleTabChange}
      />

      {/* Main Operational Canvas */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6 sm:space-y-8">
        <Suspense fallback={<IndustrialSkeleton />}>
          {isNavigating ? <IndustrialSkeleton /> : children}
        </Suspense>
      </main>

      {/* Centralized Gate Entry Pass Modal */}
      <GateEntryModal
        isOpen={isEntryModalOpen}
        onClose={closeEntryModal}
        onAddVehicle={handleAddVehicleFromModal}
        initialData={prefillEntryData}
      />
    </div>
  );
}

export default function GateClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <GateProvider>
      <GateNavShell>{children}</GateNavShell>
    </GateProvider>
  );
}
