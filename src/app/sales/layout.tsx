"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { IndustrialNav, ROLE_SALES_DISPATCH } from "@/components/layout/industrial-nav";
import { SalesProvider } from "@/lib/context/sales-context";
import { InventoryProvider } from "@/lib/context/inventory-context";

function SalesNavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveTab = () => {
    if (pathname === "/sales/dispatch") return "dispatch-planning";
    if (pathname === "/sales/invoices") return "invoices";
    if (pathname === "/sales/delivery") return "delivery";
    if (pathname === "/sales/payments") return "payments";
    return "orders"; // default /sales/orders or /sales
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === "dispatch-planning") {
      router.push("/sales/dispatch");
    } else if (tabId === "invoices") {
      router.push("/sales/invoices");
    } else if (tabId === "delivery") {
      router.push("/sales/delivery");
    } else if (tabId === "payments") {
      router.push("/sales/payments");
    } else {
      router.push("/sales/orders");
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
        {children}
      </main>
    </div>
  );
}

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <InventoryProvider>
      <SalesProvider>
        <SalesNavShell>{children}</SalesNavShell>
      </SalesProvider>
    </InventoryProvider>
  );
}
