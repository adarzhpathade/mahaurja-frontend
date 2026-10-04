"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { IndustrialNav, ROLE_QC_LAB } from "@/components/layout/industrial-nav";
import { QualityProvider } from "@/lib/context/quality-context";

function QualityNavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveTab = () => {
    if (pathname === "/quality/rm-testing") return "rm-testing";
    if (pathname === "/quality/fg-testing") return "fg-testing";
    if (pathname === "/quality/reports") return "coa-reports";
    return "home"; // default /quality
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === "rm-testing") {
      router.push("/quality/rm-testing");
    } else if (tabId === "fg-testing") {
      router.push("/quality/fg-testing");
    } else if (tabId === "coa-reports") {
      router.push("/quality/reports");
    } else {
      router.push("/quality");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-neutral-900 flex flex-col select-none">
      {/* Precision Industrial Top Navigation (QC / Lab Technician Role) */}
      <IndustrialNav
        currentRole={ROLE_QC_LAB}
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

export default function QualityLayout({ children }: { children: React.ReactNode }) {
  return (
    <QualityProvider>
      <QualityNavShell>{children}</QualityNavShell>
    </QualityProvider>
  );
}
