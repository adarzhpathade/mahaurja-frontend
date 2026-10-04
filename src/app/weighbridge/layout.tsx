"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { IndustrialNav, ROLE_WEIGHBRIDGE } from "@/components/layout/industrial-nav";
import { GateProvider } from "@/lib/context/gate-context";
import { WeighbridgeProvider } from "@/lib/context/weighbridge-context";
import { IndustrialSkeleton } from "@/components/ui/industrial-skeleton";
import { useNavTransition } from "@/lib/hooks/use-nav-transition";

function WeighbridgeNavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isNavigating, navigateTo } = useNavTransition();

  // Determine active desk tab based on current route
  const getActiveTab = () => {
    if (pathname === "/weighbridge/weighments") return "weighments";
    return "home"; // default /weighbridge (Scale Terminal)
  };

  const handleTabChange = (tabId: string, href?: string) => {
    if (href) {
      navigateTo(href);
    } else if (tabId === "weighments") {
      navigateTo("/weighbridge/weighments");
    } else {
      navigateTo("/weighbridge");
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
        <Suspense fallback={<IndustrialSkeleton />}>
          {isNavigating ? <IndustrialSkeleton /> : children}
        </Suspense>
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
