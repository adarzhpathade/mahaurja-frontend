"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { IndustrialNav, ROLE_SALES_DISPATCH } from "@/components/layout/industrial-nav";
import { SalesProvider } from "@/lib/context/sales-context";
import { InventoryProvider } from "@/lib/context/inventory-context";
import { IndustrialSkeleton } from "@/components/ui/industrial-skeleton";
import { useNavTransition } from "@/lib/hooks/use-nav-transition";

function SalesNavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isNavigating, navigateTo } = useNavTransition();

  const getActiveTab = () => {
    if (pathname === "/sales/dispatch") return "dispatch-planning";
    if (pathname === "/sales/invoices") return "invoices";
    if (pathname === "/sales/delivery") return "delivery";
    if (pathname === "/sales/payments") return "payments";
    return "orders"; // default /sales/orders or /sales
  };

  const handleTabChange = (tabId: string, href?: string) => {
    if (href) {
      navigateTo(href);
    } else if (tabId === "dispatch-planning") {
      navigateTo("/sales/dispatch");
    } else if (tabId === "invoices") {
      navigateTo("/sales/invoices");
    } else if (tabId === "delivery") {
      navigateTo("/sales/delivery");
    } else if (tabId === "payments") {
      navigateTo("/sales/payments");
    } else {
      navigateTo("/sales/orders");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-neutral-900 flex flex-col select-none">
      {/* Precision Industrial Top Navigation (Sales / Dispatch Manager Role) */}
      <IndustrialNav
        currentRole={ROLE_SALES_DISPATCH}
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

export default function SalesClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <InventoryProvider>
      <SalesProvider>
        <SalesNavShell>{children}</SalesNavShell>
      </SalesProvider>
    </InventoryProvider>
  );
}
