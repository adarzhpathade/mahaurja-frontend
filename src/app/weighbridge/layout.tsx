"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { IndustrialNav, ROLE_WEIGHBRIDGE } from "@/components/layout/industrial-nav";
import { GateProvider } from "@/lib/context/gate-context";
import { WeighbridgeProvider } from "@/lib/context/weighbridge-context";

function WeighbridgeNavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active desk tab based on current route
  const getActiveTab = () => {
    if (pathname === "/weighbridge/weighments") return "weighments";
    return "home"; // default /weighbridge (Scale Terminal)
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === "weighments") {
      router.push("/weighbridge/weighments");
    } else {
      router.push("/weighbridge");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-neutral-900 flex flex-col select-none">
      {/* Precision Industrial Top Navigation (Weighbridge Operator Role) */}
      <IndustrialNav
        currentRole={ROLE_WEIGHBRIDGE}
        activeTabId={getActiveTab()}
        onTabChange={handleTabChange}
      />

      {/* Main Operational Canvas */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6 sm:space-y-8">
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
