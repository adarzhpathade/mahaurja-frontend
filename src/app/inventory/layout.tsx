"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { IndustrialNav, ROLE_WAREHOUSE } from "@/components/layout/industrial-nav";
import { InventoryProvider } from "@/lib/context/inventory-context";
import { IndustrialSkeleton } from "@/components/ui/industrial-skeleton";
import { useNavTransition } from "@/lib/hooks/use-nav-transition";

function InventoryNavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isNavigating, navigateTo } = useNavTransition();

  const getActiveTab = () => {
    if (pathname === "/inventory/finished-goods") return "fg-stock";
    if (pathname === "/inventory/packaging") return "packaging";
    if (pathname === "/inventory/lots") return "lots";
    return "rm-inventory"; // default /inventory/raw-materials or /inventory
  };

  const handleTabChange = (tabId: string, href?: string) => {
    if (href) {
      navigateTo(href);
    } else if (tabId === "fg-stock") {
      navigateTo("/inventory/finished-goods");
    } else if (tabId === "packaging") {
      navigateTo("/inventory/packaging");
    } else if (tabId === "lots") {
      navigateTo("/inventory/lots");
    } else {
      navigateTo("/inventory/raw-materials");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-neutral-900 flex flex-col select-none">
      {/* Precision Industrial Top Navigation (Warehouse / Inventory Manager Role) */}
      <IndustrialNav
        currentRole={ROLE_WAREHOUSE}
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

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <InventoryProvider>
      <InventoryNavShell>{children}</InventoryNavShell>
    </InventoryProvider>
  );
}
