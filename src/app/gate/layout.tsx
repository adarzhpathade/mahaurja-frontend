"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { IndustrialNav, USER_ROLES } from "@/components/layout/industrial-nav";
import { GateProvider, useGate } from "@/lib/context/gate-context";
import { GateEntryModal } from "@/components/gate/gate-entry-modal";
import { GateVehicle } from "@/lib/types/gate";

function GateNavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
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
    if (pathname === "/gate/verification") return "docs";
    return "home"; // default /gate
  };

  const handleTabChange = (tabId: string) => {
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

  const handleAddVehicleFromModal = (vehicle: GateVehicle) => {
    addVehicle(vehicle);
    closeEntryModal();
    router.push("/gate/tracker");
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-neutral-900 flex flex-col select-none">
      {/* Precision Industrial Top Navigation */}
      <IndustrialNav
        currentRole={USER_ROLES[1]} // Gate / Security Operator
        activeTabId={getActiveTab()}
        onTabChange={handleTabChange}
      />

      {/* Main Operational Canvas */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6 sm:space-y-8">
        {children}
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

export default function GateLayout({ children }: { children: React.ReactNode }) {
  return (
    <GateProvider>
      <GateNavShell>{children}</GateNavShell>
    </GateProvider>
  );
}
