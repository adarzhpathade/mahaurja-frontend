"use client";

import React, { useState } from "react";
import {
  IndustrialNav,
  USER_ROLES,
  UserRoleProfile,
} from "@/components/layout/industrial-nav";
import { LiveVehicleTracker } from "@/components/gate/live-vehicle-tracker";
import { GateHome } from "@/components/gate/gate-home";
import { GateEntryModal } from "@/components/gate/gate-entry-modal";
import { GateVehicle } from "@/lib/types/gate";

export default function Page() {
  // Default to Gate / Security Operator with active tab 'live-tracker'
  const [currentRole, setCurrentRole] = useState<UserRoleProfile>(USER_ROLES[1]);
  const [activeTabId, setActiveTabId] = useState<string>("home");
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [prefillEntryData, setPrefillEntryData] = useState<Partial<GateVehicle> | null>(null);

  const handleRoleSelect = (role: UserRoleProfile) => {
    setCurrentRole(role);
    const defaultTab = role.navItems[0]?.id || "home";
    setActiveTabId(defaultTab);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    if (tabId === "entry") {
      setPrefillEntryData(null);
      setIsEntryModalOpen(true);
    }
  };

  const handleOpenEntryWithPrefill = (prefill?: Partial<GateVehicle>) => {
    setPrefillEntryData(prefill || null);
    setIsEntryModalOpen(true);
  };

  const handleAddVehicleFromModal = (vehicle: GateVehicle) => {
    setIsEntryModalOpen(false);
    setPrefillEntryData(null);
    setActiveTabId("live-tracker");
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-neutral-900 flex flex-col select-none">
      {/* 
        TOP NAVIGATION BAR
        - Exact match to user specification
        - 0 depth, 0px corner rounding
        - Spacing between buttons
        - No color in nav buttons (transparent background, neutral borders)
        - Dynamic navigation items per user role
      */}
      <IndustrialNav
        currentRole={currentRole}
        onRoleChange={handleRoleSelect}
        activeTabId={activeTabId}
        onTabChange={handleTabChange}
      />

      {/* Main Operational Canvas */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* If in Gate Security role */}
        {currentRole.id === "gate-security" ? (
          activeTabId === "home" ? (
            <GateHome
              onNavigateTab={handleTabChange}
              onOpenEntryModal={handleOpenEntryWithPrefill}
            />
          ) : (
            <LiveVehicleTracker />
          )
        ) : (
          /* Role Switch Fallback / Preview for other roles */
          <div className="bg-white border border-neutral-300 p-8 text-center space-y-4" style={{ borderRadius: 0 }}>
            <div className="inline-block p-3 bg-neutral-100 border border-neutral-300">
              <span className="text-sm font-bold tracking-tight text-neutral-800">
                {currentRole.roleName}
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900">
              Active Module: {currentRole.navItems.find((t) => t.id === activeTabId)?.label || activeTabId}
            </h2>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Currently viewing navigation layout for <strong>{currentRole.userName}</strong> ({currentRole.department}).
              Switch back to <strong>Gate / Security Operator</strong> above or below to test the full live vehicle tracking system.
            </p>
            <div>
              <button
                type="button"
                onClick={() => handleRoleSelect(USER_ROLES[1])}
                className="px-4 py-2 bg-[#18181B] text-white text-xs font-semibold cursor-pointer"
                style={{ borderRadius: 0 }}
              >
                Switch to Gate & Security Operator
              </button>
            </div>
          </div>
        )}

        {/* Operational Role Switcher Footer Toolbar */}
        <section className="bg-transparent border border-neutral-300 p-4" style={{ borderRadius: 0 }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#059669]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                Operational Role Quick Switch
              </span>
            </div>
            <div className="text-[11px] text-neutral-500">
              Current: <strong className="text-neutral-900">{currentRole.roleName}</strong> ({currentRole.userName})
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 pt-3">
            {USER_ROLES.map((role) => {
              const isSelected = role.id === currentRole.id;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  type="button"
                  className={`
                    p-2 text-left text-xs transition-colors cursor-pointer border
                    ${
                      isSelected
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-transparent text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                    }
                  `}
                  style={{ borderRadius: 0 }}
                >
                  <div className="font-semibold truncate">{role.roleName.split("/")[0].trim()}</div>
                  <div className={`text-[10px] truncate ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                    {role.department.split("&")[0].trim()}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* Global Inbound Gate Entry Pass Modal */}
      <GateEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => {
          setIsEntryModalOpen(false);
          setPrefillEntryData(null);
        }}
        onAddVehicle={handleAddVehicleFromModal}
        initialData={prefillEntryData}
      />
    </div>
  );
}
