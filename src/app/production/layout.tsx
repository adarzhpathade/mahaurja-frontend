"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { IndustrialNav, ROLE_PRODUCTION } from "@/components/layout/industrial-nav";
import { ProductionProvider } from "@/lib/context/production-context";
import { InventoryProvider } from "@/lib/context/inventory-context";

function ProductionNavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveTab = () => {
    if (pathname === "/production/material-issue") return "issue";
    if (pathname === "/production/processing") return "processing";
    if (pathname === "/production/batches") return "batch-history";
    return "plans"; // default /production/plans or /production
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === "issue") {
      router.push("/production/material-issue");
    } else if (tabId === "processing") {
      router.push("/production/processing");
    } else if (tabId === "batch-history") {
      router.push("/production/batches");
    } else {
      router.push("/production/plans");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-neutral-900 flex flex-col select-none">
      {/* Precision Industrial Top Navigation (Production Supervisor Role) */}
      <IndustrialNav
        currentRole={ROLE_PRODUCTION}
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

export default function ProductionLayout({ children }: { children: React.ReactNode }) {
  return (
    <InventoryProvider>
      <ProductionProvider>
        <ProductionNavShell>{children}</ProductionNavShell>
      </ProductionProvider>
    </InventoryProvider>
  );
}
