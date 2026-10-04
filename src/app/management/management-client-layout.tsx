"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { IndustrialNav, ROLE_MANAGEMENT } from "@/components/layout/industrial-nav";
import { IndustrialSkeleton } from "@/components/ui/industrial-skeleton";
import { useNavTransition } from "@/lib/hooks/use-nav-transition";

export default function ManagementClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isNavigating, navigateTo } = useNavTransition();

  const getActiveTab = () => {
    if (pathname === "/management/traceability") return "traceability";
    if (pathname === "/management/cost-yield" || pathname === "/management/reports/cost-yield") return "cost-yield";
    if (pathname === "/management/reports") return "analytics";
    return "live-kpis";
  };

  const handleTabChange = (tabId: string, href?: string) => {
    if (href) {
      navigateTo(href);
    } else if (tabId === "traceability") {
      navigateTo("/management/traceability");
    } else if (tabId === "cost-yield") {
      navigateTo("/management/cost-yield");
    } else if (tabId === "analytics") {
      navigateTo("/management/reports");
    } else {
      navigateTo("/management");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-neutral-900 flex flex-col select-none">
      {/* Precision Industrial Top Navigation (Management / Plant Director Role) */}
      <IndustrialNav
        currentRole={ROLE_MANAGEMENT}
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
