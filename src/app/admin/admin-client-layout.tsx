"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { IndustrialNav, ROLE_ADMIN } from "@/components/layout/industrial-nav";
import { AdminProvider } from "@/lib/context/admin-context";
import { IndustrialSkeleton } from "@/components/ui/industrial-skeleton";
import { useNavTransition } from "@/lib/hooks/use-nav-transition";

function AdminNavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isNavigating, navigateTo } = useNavTransition();

  const getActiveTab = () => {
    if (pathname.includes("/masters/customers") || pathname === "/admin/customers") return "customers";
    if (pathname.includes("/masters/transport") || pathname === "/admin/transport") return "transport";
    if (pathname.includes("/masters/materials") || pathname === "/admin/materials") return "materials";
    if (pathname.includes("/masters/formulas") || pathname === "/admin/formulas") return "formulas";
    if (pathname.includes("/users")) return "users-access";
    return "suppliers"; // default /admin/masters/suppliers or /admin
  };

  const handleTabChange = (tabId: string, href?: string) => {
    if (href) {
      navigateTo(href);
    } else if (tabId === "customers") {
      navigateTo("/admin/masters/customers");
    } else if (tabId === "transport") {
      navigateTo("/admin/masters/transport");
    } else if (tabId === "materials") {
      navigateTo("/admin/masters/materials");
    } else if (tabId === "formulas") {
      navigateTo("/admin/masters/formulas");
    } else if (tabId === "users-access") {
      navigateTo("/admin/users");
    } else {
      navigateTo("/admin/masters/suppliers");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-neutral-900 flex flex-col select-none">
      {/* Precision Industrial Top Navigation (Admin / Super Admin Role) */}
      <IndustrialNav
        currentRole={ROLE_ADMIN}
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

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminNavShell>{children}</AdminNavShell>
    </AdminProvider>
  );
}
