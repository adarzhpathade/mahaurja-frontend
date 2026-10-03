"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Truck,
  Search,
  Scale,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FlaskConical,
  Check,
  X,
  MapPin,
  Eye,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { GateVehicle, VehicleDirection, GateStage } from "@/lib/types/gate";
import { INITIAL_GATE_VEHICLES } from "@/lib/data/mock-gate-vehicles";

type FilterTab =
  | "ALL"
  | "INBOUND_RM"
  | "OUTBOUND_DISPATCH"
  | "WAITING_WEIGHMENT"
  | "UNLOADING"
  | "CLEARED_EXIT";

export interface LiveVehicleTrackerProps {
  vehicles?: GateVehicle[];
  onUpdateStage?: (vehicleId: string, newStage: GateStage) => void;
  onAddVehicle?: (vehicle: GateVehicle) => void;
  onNavigateTab?: (tabId: string) => void;
}

export function LiveVehicleTracker({
  vehicles: externalVehicles,
}: LiveVehicleTrackerProps = {}) {
  const [internalVehicles] = useState<GateVehicle[]>(INITIAL_GATE_VEHICLES);
  const vehicles = externalVehicles || internalVehicles;

  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectVehicle, setInspectVehicle] = useState<GateVehicle | null>(null);
  const [viewMode, setViewMode] = useState<"CARDS" | "TABLE">("CARDS");

  // Dynamic Fleet Counts & Dwell Metrics
  const stats = useMemo(() => {
    const totalInside = vehicles.length;
    const inboundRM = vehicles.filter((v) => v.direction === "INBOUND_RM").length;
    const outboundFG = vehicles.filter((v) => v.direction === "OUTBOUND_DISPATCH").length;

    const awaitingWeighbridge = vehicles.filter(
      (v) =>
        v.stage === "WAITING_WEIGHMENT" ||
        v.stage === "ARRIVED_AT_GATE" ||
        v.stage === "GROSS_WEIGHED"
    ).length;
    const activeUnloading = vehicles.filter(
      (v) => v.stage === "UNLOADING" || v.stage === "QC_PENDING"
    ).length;
    const clearedForExit = vehicles.filter(
      (v) => v.stage === "CLEARED_EXIT" || v.stage === "TARE_WEIGHED"
    ).length;

    // Dwell Time Alerts (>90m)
    const overdueDwell = vehicles.filter((v) => (v.elapsedMinutes || 0) > 90).length;

    return {
      totalInside,
      inboundRM,
      outboundFG,
      awaitingWeighbridge,
      activeUnloading,
      clearedForExit,
      overdueDwell,
    };
  }, [vehicles]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (activeTab === "INBOUND_RM" && v.direction !== "INBOUND_RM") return false;
      if (activeTab === "OUTBOUND_DISPATCH" && v.direction !== "OUTBOUND_DISPATCH") return false;
      if (
        activeTab === "WAITING_WEIGHMENT" &&
        v.stage !== "WAITING_WEIGHMENT" &&
        v.stage !== "ARRIVED_AT_GATE" &&
        v.stage !== "GROSS_WEIGHED"
      )
        return false;
      if (
        activeTab === "UNLOADING" &&
        v.stage !== "UNLOADING" &&
        v.stage !== "QC_PENDING"
      )
        return false;
      if (
        activeTab === "CLEARED_EXIT" &&
        v.stage !== "CLEARED_EXIT" &&
        v.stage !== "TARE_WEIGHED"
      )
        return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesNo = v.vehicleNo.toLowerCase().includes(query);
        const matchesPass = v.gateEntryNo.toLowerCase().includes(query);
        const matchesMaterial = v.materialName.toLowerCase().includes(query);
        const matchesSupplier = v.supplierOrCustomer.toLowerCase().includes(query);
        const matchesDriver = v.driverName.toLowerCase().includes(query);
        const matchesLocation = (v.assignedLocation || "").toLowerCase().includes(query);
        return matchesNo || matchesPass || matchesMaterial || matchesSupplier || matchesDriver || matchesLocation;
      }

      return true;
    });
  }, [vehicles, activeTab, searchQuery]);

  const getStageConfig = (stage: GateStage) => {
    switch (stage) {
      case "ARRIVED_AT_GATE":
        return {
          label: "At Gate In",
          dotColor: "#18181B",
          textColor: "#18181B",
          borderClass: "border-neutral-300 bg-neutral-100",
        };
      case "WAITING_WEIGHMENT":
        return {
          label: "Gross Weighbridge Queue",
          dotColor: "#D97706",
          textColor: "#92400E",
          borderClass: "border-amber-300 bg-amber-50",
        };
      case "GROSS_WEIGHED":
        return {
          label: "Gross Weighed",
          dotColor: "#059669",
          textColor: "#047857",
          borderClass: "border-emerald-300 bg-emerald-50",
        };
      case "UNLOADING":
        return {
          label: "Unloading in Yard",
          dotColor: "#059669",
          textColor: "#047857",
          borderClass: "border-emerald-300 bg-emerald-50",
        };
      case "QC_PENDING":
        return {
          label: "QC Sampling Active",
          dotColor: "#D97706",
          textColor: "#92400E",
          borderClass: "border-amber-300 bg-amber-50",
        };
      case "TARE_WEIGHED":
        return {
          label: "Tare Weighed (Net Done)",
          dotColor: "#059669",
          textColor: "#047857",
          borderClass: "border-emerald-300 bg-emerald-50",
        };
      case "CLEARED_EXIT":
        return {
          label: "Cleared for Exit",
          dotColor: "#059669",
          textColor: "#047857",
          borderClass: "border-emerald-300 bg-emerald-50",
        };
      case "EXIT_COMPLETED":
        return {
          label: "Gate Out / Departed",
          dotColor: "#64748B",
          textColor: "#475569",
          borderClass: "border-neutral-300 bg-neutral-100",
        };
      default:
        return {
          label: stage,
          dotColor: "#737373",
          textColor: "#525252",
          borderClass: "border-neutral-300 bg-neutral-50",
        };
    }
  };

  const LIFECYCLE_STAGES: { key: GateStage; label: string; shortLabel: string; icon: React.ElementType }[] = [
    { key: "ARRIVED_AT_GATE", label: "Gate In", shortLabel: "Gate In", icon: ShieldCheck },
    { key: "WAITING_WEIGHMENT", label: "Gross Weighment", shortLabel: "Gross", icon: Scale },
    { key: "UNLOADING", label: "Unload & QC", shortLabel: "Unload", icon: FlaskConical },
    { key: "TARE_WEIGHED", label: "Tare Weighment", shortLabel: "Tare", icon: Scale },
    { key: "CLEARED_EXIT", label: "Gate Out", shortLabel: "Exit", icon: CheckCircle2 },
  ];

  const getStageIndex = (stage: GateStage) => {
    switch (stage) {
      case "ARRIVED_AT_GATE":
        return 0;
      case "WAITING_WEIGHMENT":
      case "GROSS_WEIGHED":
        return 1;
      case "UNLOADING":
      case "QC_PENDING":
        return 2;
      case "TARE_WEIGHED":
        return 3;
      case "CLEARED_EXIT":
      case "EXIT_COMPLETED":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 select-none">
      {/* ========================================================================= */}
      {/* HEADER & OPERATIONAL COUNTERS                                             */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-300 pb-5 sm:pb-6">
        <div className="py-1 sm:py-1.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Vehicle Tracker
          </h1>
        </div>

        {/* Live Operational Counters */}
        <div className="flex flex-wrap items-center gap-2.5 mt-2 sm:mt-0">
          <div className="h-10 flex items-center gap-2 px-3.5 bg-neutral-200/50 border border-neutral-300 text-xs font-bold text-neutral-900">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse shrink-0" />
            <span className="font-mono">{stats.totalInside}</span>
            <span>Inside Plant</span>
          </div>

          {stats.overdueDwell > 0 && (
            <div className="h-10 flex items-center gap-2 px-3 bg-amber-50 border border-amber-300 text-xs font-bold text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span><strong className="font-mono">{stats.overdueDwell}</strong> Overdue (&gt;90m)</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN VEHICLE FLEET TABLE                                                  */}
      {/* ========================================================================= */}
      <div className="border-0 sm:border sm:border-neutral-300">
        {/* Filter Tabs & Search Controls */}
        <div className="p-0 sm:p-4 pb-3 sm:pb-4 border-b border-neutral-300 space-y-2.5">
          {/* Top Row: Search Input (Full Width on mobile) + Filters Toggle (PC) + View Mode Switcher (PC) */}
          <div className="flex items-center gap-2">
            <div className="relative w-full flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plate, pass ID, material, driver..."
                className="w-full h-11 sm:h-10 pl-9.5 pr-8 bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-[#059669] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters Toggle Button (PC Only) */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`hidden sm:flex h-10 px-3.5 border text-xs font-bold uppercase tracking-wider items-center gap-2 transition-colors cursor-pointer shrink-0 ${
                showFilters || activeTab !== "ALL"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeTab !== "ALL" && (
                <span className="text-[10px] bg-[#059669] text-white px-1.5 py-0.2 rounded font-mono font-bold">
                  1
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* View Mode Switcher (PC Only) */}
            <div className="hidden sm:inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
              <button
                type="button"
                onClick={() => setViewMode("CARDS")}
                className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center ${
                  viewMode === "CARDS"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode("TABLE")}
                className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center ${
                  viewMode === "TABLE"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                Table
              </button>
            </div>
          </div>

          {/* Active Filter summary chip (PC Only) */}
          {!showFilters && activeTab !== "ALL" && (
            <div className="hidden sm:flex items-center gap-2 pt-0.5 text-xs">
              <span className="text-neutral-500 font-medium">Filter:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 text-white font-bold text-[11px] uppercase tracking-wide">
                <span>
                  {
                    [
                      { key: "INBOUND_RM", label: "Inbound Biomass" },
                      { key: "OUTBOUND_DISPATCH", label: "Outbound Dispatch" },
                      { key: "WAITING_WEIGHMENT", label: "Awaiting Weighment" },
                      { key: "UNLOADING", label: "Yard Unload & QC" },
                      { key: "CLEARED_EXIT", label: "Cleared for Exit" },
                    ].find((f) => f.key === activeTab)?.label
                  }
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("ALL")}
                  className="hover:text-red-400 cursor-pointer ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
          )}

          {/* Expandable Filter Tabs Grid/Pills (PC Only) */}
          {showFilters && (
            <div className="hidden sm:block pt-2 border-t border-neutral-200 space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { key: "ALL", label: "All Inside", count: stats.totalInside },
                  { key: "INBOUND_RM", label: "Inbound Biomass", count: stats.inboundRM },
                  { key: "OUTBOUND_DISPATCH", label: "Outbound Dispatch", count: stats.outboundFG },
                  { key: "WAITING_WEIGHMENT", label: "Awaiting Weighment", count: stats.awaitingWeighbridge },
                  { key: "UNLOADING", label: "Yard Unload & QC", count: stats.activeUnloading },
                  { key: "CLEARED_EXIT", label: "Cleared for Exit", count: stats.clearedForExit },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key as FilterTab)}
                    className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border whitespace-nowrap flex items-center gap-1.5 ${
                      activeTab === tab.key
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="opacity-75 font-mono text-[11px]">({tab.count})</span>
                  </button>
                ))}
                {activeTab !== "ALL" && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("ALL")}
                    className="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2 ml-2 cursor-pointer font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="text-[11px] text-neutral-500">
                Showing <strong className="text-neutral-900">{filteredVehicles.length}</strong> vehicles matching criteria
              </div>
            </div>
          )}
        </div>

        {/* Vehicles Data: Cards View or Table View */}
        {filteredVehicles.length === 0 ? (
          <div className="py-12 text-center text-neutral-500">
            <Truck className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="font-semibold text-neutral-700">No vehicles match the selected filter</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Try clearing the search query or switching tabs</p>
          </div>
        ) : (
          <>
            {/* Cards View: Always on Mobile, respects viewMode on Desktop */}
            <div className={viewMode === "CARDS" ? "px-0 py-3 sm:p-4" : "px-0 py-3 sm:hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredVehicles.map((vehicle) => {
                const stageConfig = getStageConfig(vehicle.stage);
                const dwell = vehicle.elapsedMinutes || vehicle.dwellMinutes || 35;
                const isOverdue = dwell > 90;
                const isWarning = dwell >= 60 && dwell <= 90;

                return (
                  <div
                    key={vehicle.id}
                    onClick={() => setInspectVehicle(vehicle)}
                    className="border border-neutral-300 p-3.5 hover:border-neutral-900 transition-all cursor-pointer group bg-transparent flex flex-col justify-between space-y-3"
                  >
                    {/* Card Top: Plate + Pass ID + Direction Badge */}
                    <div className="flex items-start justify-between gap-2 border-b border-neutral-200 pb-2">
                      <div>
                        <div className="font-mono font-bold text-neutral-900 text-sm group-hover:text-[#059669] transition-colors">
                          {vehicle.vehicleNo}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          {vehicle.gateEntryNo}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 border shrink-0 ${
                          vehicle.direction === "INBOUND_RM"
                            ? "border-emerald-300 bg-emerald-50 text-[#047857]"
                            : "border-neutral-300 bg-[#18181B] text-white"
                        }`}
                      >
                        {vehicle.direction === "INBOUND_RM" ? "Inbound RM" : "Outbound FG"}
                      </span>
                    </div>

                    {/* Card Middle: Cargo & Party details */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-semibold text-neutral-900 truncate">
                          {vehicle.materialName}
                        </span>
                        <span className="text-[11px] font-bold text-neutral-700 tabular-nums shrink-0">
                          {vehicle.declaredWeightMT.toFixed(1)} MT
                        </span>
                      </div>

                      <div className="text-[11px] text-neutral-600 truncate">
                        {vehicle.supplierOrCustomer}
                      </div>

                      <div className="text-[10px] text-neutral-400 truncate">
                        {vehicle.transporter} · {vehicle.driverName}
                      </div>
                    </div>

                    {/* Card Footer: Operational Stage + Dwell Timer */}
                    <div className="pt-2 border-t border-neutral-200 flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider ${stageConfig.borderClass}`}
                        style={{ color: stageConfig.textColor }}
                      >
                        <span
                          className="w-1.5 h-1.5 inline-block shrink-0"
                          style={{ backgroundColor: stageConfig.dotColor }}
                        />
                        <span>{stageConfig.label}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-bold tabular-nums border ${
                            isOverdue
                              ? "bg-red-50 text-red-700 border-red-200"
                              : isWarning
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-neutral-200/60 text-neutral-700 border-neutral-300"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{dwell}m</span>
                        </span>

                        <span className="text-[10px] text-neutral-400 group-hover:text-neutral-900 transition-colors inline-flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Details</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table View (PC Only) */}
          <div className={viewMode === "TABLE" ? "hidden sm:block overflow-x-auto" : "hidden"}>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-200/50 border-b border-neutral-300 text-[10px] uppercase font-bold text-neutral-600 tracking-wider">
                  <th className="py-3 px-4">Vehicle & Pass No</th>
                  <th className="py-3 px-3">Direction</th>
                  <th className="py-3 px-3">Material & Declared</th>
                  <th className="py-3 px-3">Supplier / Customer</th>
                  <th className="py-3 px-3">Operational Stage</th>
                  <th className="py-3 px-3">Dwell Time</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {filteredVehicles.map((vehicle) => {
                  const stageConfig = getStageConfig(vehicle.stage);
                  const dwell = vehicle.elapsedMinutes || vehicle.dwellMinutes || 35;
                  const isOverdue = dwell > 90;
                  const isWarning = dwell >= 60 && dwell <= 90;

                  return (
                    <tr
                      key={vehicle.id}
                      onClick={() => setInspectVehicle(vehicle)}
                      className="hover:bg-neutral-200/40 cursor-pointer transition-colors"
                    >
                      {/* Vehicle & Pass */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-neutral-900 text-sm">
                          {vehicle.vehicleNo}
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          {vehicle.gateEntryNo}
                        </div>
                      </td>

                      {/* Direction */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 border ${
                            vehicle.direction === "INBOUND_RM"
                              ? "border-emerald-300 bg-emerald-50 text-[#047857]"
                              : "border-neutral-300 bg-[#18181B] text-white"
                          }`}
                        >
                          {vehicle.direction === "INBOUND_RM" ? "Inbound RM" : "Outbound FG"}
                        </span>
                      </td>

                      {/* Material & Declared Qty */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-neutral-800 truncate max-w-[170px]">
                          {vehicle.materialName}
                        </div>
                        <div className="text-[11px] text-neutral-500 tabular-nums">
                          {vehicle.declaredWeightMT.toFixed(1)} MT declared
                        </div>
                      </td>

                      {/* Supplier / Customer */}
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-neutral-800 truncate max-w-[180px]">
                          {vehicle.supplierOrCustomer}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[180px]">
                          {vehicle.transporter}
                        </div>
                      </td>

                      {/* Operational Stage */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider ${stageConfig.borderClass}`}
                          style={{ color: stageConfig.textColor }}
                        >
                          <span
                            className="w-1.5 h-1.5 inline-block shrink-0"
                            style={{ backgroundColor: stageConfig.dotColor }}
                          />
                          <span>{stageConfig.label}</span>
                        </span>
                        <div className="text-[10px] text-neutral-400 mt-0.5">
                          {vehicle.assignedLocation || "Yard Area"}
                        </div>
                      </td>

                      {/* Dwell Time */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-bold tabular-nums ${
                            isOverdue
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : isWarning
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-neutral-200/60 text-neutral-700 border border-neutral-300"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{dwell}m</span>
                        </span>
                      </td>

                      {/* Details Trigger Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectVehicle(vehicle);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold border border-neutral-300 hover:bg-neutral-200/60 text-neutral-700 transition-colors inline-flex items-center gap-1 cursor-pointer bg-transparent"
                        >
                          <Eye className="w-3.5 h-3.5 text-neutral-500" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

        {/* Footer info bar */}
        <div className="p-3 border-t border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span>Plant Gate Operations</span>
            <span>·</span>
            <span className="text-[#059669] font-medium">Automatic Dwell Time Tracking Active</span>
          </div>
          <div>
            Click any row or &quot;View Details&quot; to inspect vehicle lifecycle and specifications.
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POPUP MODAL: CLEAN VEHICLE DETAILS CARD (ZERO TRUNCATION)                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {inspectVehicle && (() => {
          const v = inspectVehicle;
          const stageConfig = getStageConfig(v.stage);
          const currentStep = getStageIndex(v.stage);
          const dwell = v.elapsedMinutes || v.dwellMinutes || 45;
          const phoneStr = v.driverPhone || v.driverMobile || "+91 98224 81920";

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs"
              onClick={() => setInspectVehicle(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white border border-neutral-300 shadow-2xl p-4 sm:p-6 space-y-4"
              >
                {/* Modal Header */}
                <div className="pb-3 border-b border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono font-bold text-xl sm:text-2xl text-neutral-900 tracking-tight whitespace-nowrap">
                      {v.vehicleNo}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInspectVehicle(null)}
                      className="w-8 h-8 flex items-center justify-center border border-neutral-300 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 cursor-pointer bg-white transition-colors shrink-0"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
                        v.direction === "INBOUND_RM"
                          ? "border-emerald-300 bg-emerald-50 text-[#047857]"
                          : "border-neutral-300 bg-[#18181B] text-white"
                      }`}
                    >
                      {v.direction === "INBOUND_RM" ? "Inbound RM" : "Outbound FG"}
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 border border-neutral-200 px-2 py-0.5 tabular-nums">
                      ⏱️ {dwell}m inside
                    </span>
                    <span className="text-neutral-300 hidden sm:inline">·</span>
                    <span className="text-xs text-neutral-500">
                      Pass: <strong className="text-neutral-800 font-semibold">{v.gateEntryNo}</strong> · In: {v.arrivalTime || v.inTime || "14:15"}
                    </span>
                  </div>
                </div>

                {/* Sleek Segmented Stage Indicator */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                      <span>{stageConfig.label}</span>
                    </span>
                    <span className="text-neutral-500 text-[11px] font-medium">
                      Stage {currentStep + 1} of 5
                    </span>
                  </div>

                  {/* 5-Segment Track */}
                  <div className="grid grid-cols-5 gap-1.5 h-1.5">
                    {[0, 1, 2, 3, 4].map((stepIdx) => (
                      <div
                        key={stepIdx}
                        className={`h-full transition-colors ${
                          stepIdx <= currentStep ? "bg-[#059669]" : "bg-neutral-200"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] text-neutral-400 font-medium px-0.5">
                    <span>Gate In</span>
                    <span>Gross</span>
                    <span>Unload/QC</span>
                    <span>Tare</span>
                    <span>Exit</span>
                  </div>
                </div>

                {/* 2-Column Clean Details (Zero Truncation) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-y border-neutral-200 text-xs">
                  {/* Left Column: Cargo & Source */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-0.5">
                        Material & Quantity
                      </span>
                      <div className="font-semibold text-neutral-900 text-sm">
                        {v.materialName}
                      </div>
                      <div className="text-neutral-600 font-medium mt-0.5">
                        Declared: <strong className="text-neutral-900">{v.declaredWeightMT.toFixed(1)} MT</strong>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-0.5">
                        {v.direction === "INBOUND_RM" ? "Supplier / Source" : "Customer / Destination"}
                      </span>
                      <div className="font-semibold text-neutral-900">
                        {v.supplierOrCustomer}
                      </div>
                      <div className="text-neutral-500 text-[11px] mt-0.5">
                        Transporter: {v.transporter}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Driver & Area */}
                  <div className="space-y-3 sm:border-l sm:border-neutral-200 sm:pl-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-0.5">
                        Driver Details
                      </span>
                      <div className="font-semibold text-neutral-900 text-sm">
                        {v.driverName}
                      </div>
                      <div className="text-neutral-600 font-mono text-[11px] mt-0.5">
                        {phoneStr}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-0.5">
                        Assigned Plant Area
                      </span>
                      <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                        <span>{v.assignedLocation || "Yard Area"}</span>
                      </div>
                      <div className="text-neutral-500 text-[11px] mt-0.5 truncate">
                        {v.ewayBillNo ? `EWB: ${v.ewayBillNo}` : (v.challanOrLrNo ? `Challan: ${v.challanOrLrNo}` : "Pass Authenticated")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle Remarks (No Giant Box) */}
                {(v.notes || v.remarks) && (
                  <div className="text-xs text-neutral-600 flex items-start gap-2 bg-[#F8F9FA] p-2.5 border border-neutral-200">
                    <span className="font-bold text-neutral-800 shrink-0">Note:</span>
                    <span className="leading-relaxed">{v.notes || v.remarks}</span>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setInspectVehicle(null)}
                    className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-[#18181B] hover:bg-neutral-800 text-white text-xs font-semibold cursor-pointer transition-colors text-center"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
