"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { IndustrialNav, ROLE_MANAGEMENT } from "@/components/layout/industrial-nav";

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveTab = () => {
    if (pathname === "/management/traceability") return "traceability";
    if (pathname === "/management/cost-yield" || pathname === "/management/reports/cost-yield") return "cost-yield";
    if (pathname === "/management/reports") return "analytics";
    return "live-kpis";
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === "traceability") {
      router.push("/management/traceability");
    } else if (tabId === "cost-yield") {
      router.push("/management/cost-yield");
    } else if (tabId === "analytics") {
      router.push("/management/reports");
    } else {
      router.push("/management");
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
        {children}
      </main>
    </div>
  );
}
