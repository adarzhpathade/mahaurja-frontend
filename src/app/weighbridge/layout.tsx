"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { IndustrialNav, USER_ROLES } from "@/components/layout/industrial-nav";
import { GateProvider } from "@/lib/context/gate-context";
import { WeighbridgeProvider } from "@/lib/context/weighbridge-context";

function WeighbridgeNavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active desk tab based on current route
  const getActiveTab = () => {
    if (pathname === "/weighbridge/weighments") return "weighments";
    if (pathname === "/weighbridge/gross") return "gross-weight";
    if (pathname === "/weighbridge/tare") return "tare-weight";
    if (pathname === "/weighbridge/slips") return "slips";
    return "home"; // default /weighbridge
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === "weighments") {
      router.push("/weighbridge/weighments");
    } else if (tabId === "gross-weight") {
      router.push("/weighbridge/gross");
    } else if (tabId === "tare-weight") {
      router.push("/weighbridge/tare");
    } else if (tabId === "slips") {
      router.push("/weighbridge/slips");
    } else {
      router.push("/weighbridge");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-neutral-900 flex flex-col select-none">
      {/* Precision Industrial Top Navigation (Weighbridge Operator Role) */}
      <IndustrialNav
        currentRole={USER_ROLES[2]} // Weighbridge Operator
        activeTabId={getActiveTab()}
        onTabChange={handleTabChange}
      />

      {/* Main Operational Canvas */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-3.5 sm:py-6 space-y-4 sm:space-y-6">
        {children}
      </main>
    </div>
  );
}

export default function WeighbridgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <GateProvider>
      <WeighbridgeProvider>
        <WeighbridgeNavShell>{children}</WeighbridgeNavShell>
      </WeighbridgeProvider>
    </GateProvider>
  );
}
