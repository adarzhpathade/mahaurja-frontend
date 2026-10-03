"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Truck,
  Plus,
  Search,
  Scale,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  SlidersHorizontal,
  MoreVertical,
  Calendar,
  ChevronDown,
  Layers,
  Activity,
  Zap,
  ShieldCheck,
  FlaskConical,
  Printer,
  ChevronUp,
  Check,
  X,
} from "lucide-react";
import { GateVehicle, VehicleDirection, GateStage } from "@/lib/types/gate";
import { INITIAL_GATE_VEHICLES } from "@/lib/data/mock-gate-vehicles";
import { GateEntryModal } from "@/components/gate/gate-entry-modal";

type FilterTab = "ALL" | "INBOUND_RM" | "OUTBOUND_DISPATCH" | "WAITING_WEIGHMENT" | "CLEARED_EXIT";

export interface LiveVehicleTrackerProps {
  vehicles?: GateVehicle[];
  onUpdateStage?: (vehicleId: string, newStage: GateStage) => void;
  onAddVehicle?: (vehicle: GateVehicle) => void;
  onNavigateTab?: (tabId: string) => void;
}

export function LiveVehicleTracker({
  vehicles: externalVehicles,
  onUpdateStage: externalUpdateStage,
  onAddVehicle: externalAddVehicle,
  onNavigateTab,
}: LiveVehicleTrackerProps = {}) {
  const [internalVehicles, setInternalVehicles] = useState<GateVehicle[]>(INITIAL_GATE_VEHICLES);
  const vehicles = externalVehicles || internalVehicles;
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<GateVehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exitBarrierMessage, setExitBarrierMessage] = useState<string | null>(null);

  // Dynamic KPI Stats
  const stats = useMemo(() => {
    const totalInside = vehicles.length;
    const inboundRM = vehicles.filter((v) => v.direction === "INBOUND_RM").length;
    const outboundFG = vehicles.filter((v) => v.direction === "OUTBOUND_DISPATCH").length;
    const awaitingWeighbridge = vehicles.filter(
      (v) => v.stage === "WAITING_WEIGHMENT" || v.stage === "ARRIVED_AT_GATE"
    ).length;
    const activeUnloading = vehicles.filter(
      (v) => v.stage === "UNLOADING" || v.stage === "QC_PENDING"
    ).length;
    const clearedForExit = vehicles.filter(
      (v) => v.stage === "CLEARED_EXIT" || v.stage === "TARE_WEIGHED"
    ).length;

    return { totalInside, inboundRM, outboundFG, awaitingWeighbridge, activeUnloading, clearedForExit };
  }, [vehicles]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Tab filter
      if (activeTab === "INBOUND_RM" && v.direction !== "INBOUND_RM") return false;
      if (activeTab === "OUTBOUND_DISPATCH" && v.direction !== "OUTBOUND_DISPATCH") return false;
      if (
        activeTab === "WAITING_WEIGHMENT" &&
        v.stage !== "WAITING_WEIGHMENT" &&
        v.stage !== "ARRIVED_AT_GATE"
      )
        return false;
      if (
        activeTab === "CLEARED_EXIT" &&
        v.stage !== "CLEARED_EXIT" &&
        v.stage !== "TARE_WEIGHED"
      )
        return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesNo = v.vehicleNo.toLowerCase().includes(query);
        const matchesPass = v.gateEntryNo.toLowerCase().includes(query);
        const matchesMaterial = v.materialName.toLowerCase().includes(query);
        const matchesSupplier = v.supplierOrCustomer.toLowerCase().includes(query);
        const matchesDriver = v.driverName.toLowerCase().includes(query);
        return matchesNo || matchesPass || matchesMaterial || matchesSupplier || matchesDriver;
      }

      return true;
    });
  }, [vehicles, activeTab, searchQuery]);

  const handleAddVehicle = (newVehicle: GateVehicle) => {
    if (externalAddVehicle) {
      externalAddVehicle(newVehicle);
    } else {
      setInternalVehicles((prev) => [newVehicle, ...prev]);
    }
  };

  const handleUpdateStage = (vehicleId: string, newStage: GateStage) => {
    if (externalUpdateStage) {
      externalUpdateStage(vehicleId, newStage);
    } else {
      setInternalVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, stage: newStage } : v))
      );
    }
    if (selectedVehicle && selectedVehicle.id === vehicleId) {
      setSelectedVehicle((prev) => (prev ? { ...prev, stage: newStage } : null));
    }
  };


  // Distinct stage colors for guard visibility (Transparent backgrounds, no color fill)
  const getStageConfig = (stage: GateStage) => {
    switch (stage) {
      case "ARRIVED_AT_GATE":
        return {
          label: "At Gate Barrier",
          dotColor: "#0284C7", // Sky Blue
          textColor: "#0369A1",
          borderClass: "border-sky-300",
        };
      case "WAITING_WEIGHMENT":
        return {
          label: "Weighbridge Queue",
          dotColor: "#D97706", // Amber
          textColor: "#B45309",
          borderClass: "border-amber-300",
        };
      case "UNLOADING":
        return {
          label: "Unloading / Yard",
          dotColor: "#2563EB", // Royal Blue
          textColor: "#1D4ED8",
          borderClass: "border-blue-300",
        };
      case "QC_PENDING":
        return {
          label: "QC Sampling Active",
          dotColor: "#9333EA", // Purple
          textColor: "#7E22CE",
          borderClass: "border-purple-300",
        };
      case "TARE_WEIGHED":
        return {
          label: "Tare Weighed",
          dotColor: "#0D9488", // Teal
          textColor: "#0F766E",
          borderClass: "border-teal-300",
        };
      case "CLEARED_EXIT":
        return {
          label: "Cleared for Exit",
          dotColor: "#059669", // Bio-Emerald Green
          textColor: "#047857",
          borderClass: "border-emerald-300",
        };
      case "EXIT_COMPLETED":
        return {
          label: "Exit Completed",
          dotColor: "#64748B", // Slate
          textColor: "#475569",
          borderClass: "border-slate-300",
        };
      default:
        return {
          label: stage,
          dotColor: "#737373",
          textColor: "#525252",
          borderClass: "border-neutral-300",
        };
    }
  };

  return (
    <div className="space-y-12 md:space-y-14 select-none">
      {/* ========================================================================= */}
      {/* SECTION 1: OVERVIEW PANEL WITH LARGE TYPOGRAPHY & BIG CARDS (NO BG COLOR) */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        {/* Section Header with Large Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs md:text-sm font-medium text-neutral-400 block tracking-normal">
              Data Based on Today&apos;s Logistics
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mt-1">
              Overview Panel
            </h1>
          </div>

          {/* Quick Header Utility Badges (Transparent, neutral borders, no bg color) */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-neutral-300 text-xs font-medium text-neutral-700">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <span>Today · 03 Oct</span>
            </div>

            {/* Station Dropdown Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-transparent border border-neutral-300 text-xs font-medium text-neutral-800 cursor-pointer hover:bg-neutral-200/40">
              <span className="w-1.5 h-1.5 bg-[#059669] inline-block" />
              <span>Gate Station 01</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </div>

            {/* Primary Action Button (Surgical Bio-Emerald Accent) */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span>New Gate Pass</span>
            </button>
          </div>
        </div>

        {/* Big Cards Row: Transparent surfaces, crisp hairline borders, no bg color */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Big Hero Card: Live Barrier Control & Vehicle Gate Desk */}
          <div className="lg:col-span-6 bg-transparent border border-neutral-300 p-5 md:p-6 flex flex-col justify-between">
            {/* Header: Title + Barrier System Status */}
            <div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border border-neutral-300 bg-transparent flex items-center justify-center text-neutral-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">
                      Live Barrier Control & Gate Desk
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-emerald-300 text-[10px] uppercase font-bold tracking-wider text-[#047857]">
                    <span className="w-1.5 h-1.5 bg-[#059669] animate-pulse inline-block" />
                    <span>BOOM BARRIERS ACTIVE</span>
                  </span>
                </div>
              </div>

              {/* Two Active Physical Gate Stations: Entry vs Exit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Station 01: Inbound Entry Boom */}
                <div className="border border-neutral-300 p-3.5 flex flex-col justify-between bg-transparent">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                        <ArrowDownRight className="w-3.5 h-3.5 text-sky-600" />
                        <span>Entry Gate 01</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-sky-300 text-sky-700">
                        AT BARRIER
                      </span>
                    </div>

                    <div className="mt-2.5">
                      <div className="text-sm font-bold text-neutral-900 tracking-tight">
                        MH-12-Q-4491
                      </div>
                      <div className="text-[11px] text-neutral-600 mt-0.5 font-medium">
                        Kisan Bio-Agri · Groundnut Shell
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-2">
                        <span className="font-semibold text-neutral-700">PO-2026-0881</span>
                        <span>·</span>
                        <span className="tabular-nums">28.5 MT Declared</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                      <span>Issue Pass & Open Entry</span>
                    </button>
                  </div>
                </div>

                {/* Station 02: Outbound Exit Boom */}
                <div className="border border-neutral-300 p-3.5 flex flex-col justify-between bg-transparent">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Exit Gate 02</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-emerald-300 text-[#047857] tabular-nums">
                        {stats.clearedForExit} CLEARED
                      </span>
                    </div>

                    <div className="mt-2.5">
                      <div className="text-sm font-bold text-neutral-900 tracking-tight">
                        MH-40-BL-1102
                      </div>
                      <div className="text-[11px] text-neutral-600 mt-0.5 font-medium">
                        MahaGenco · FG Pellets (32 MT)
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-2">
                        <span className="text-[#059669] font-medium">✓ Tare Done</span>
                        <span>·</span>
                        <span className="text-[#059669] font-medium">✓ EWB Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const exitVehicle = vehicles.find((v) => v.stage === "CLEARED_EXIT" || v.stage === "TARE_WEIGHED");
                          if (exitVehicle) {
                            handleUpdateStage(exitVehicle.id, "EXIT_COMPLETED");
                            setExitBarrierMessage(`Exit Barrier Raised · Vehicle ${exitVehicle.vehicleNo} Exited Plant`);
                            setTimeout(() => setExitBarrierMessage(null), 4000);
                          } else {
                            setExitBarrierMessage("All cleared vehicles have departed.");
                            setTimeout(() => setExitBarrierMessage(null), 3000);
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#18181B] hover:bg-neutral-800 text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        style={{ borderRadius: 0 }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" strokeWidth={2} />
                        <span>Quick Raise Barrier</span>
                      </button>
                      {onNavigateTab && (
                        <button
                          type="button"
                          onClick={() => onNavigateTab("exit")}
                          className="px-2.5 py-1.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-[11px] font-bold transition-colors cursor-pointer"
                          style={{ borderRadius: 0 }}
                          title="Open Outward Exit Station"
                        >
                          Exit Desk →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Ticker: Direct Guard Safety Telemetry */}
            <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between text-[11px] text-neutral-600 gap-2">
              <div className="flex items-center gap-3">
                {exitBarrierMessage ? (
                  <span className="text-[#059669] font-bold animate-pulse">
                    ● {exitBarrierMessage}
                  </span>
                ) : (
                  <>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#059669] inline-block" />
                      <span>Entry Barrier: READY</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 inline-block" />
                      <span className="tabular-nums">Exit Barrier: {stats.clearedForExit} IN QUEUE</span>
                    </span>
                  </>
                )}
              </div>

              <div className="text-[11px] text-neutral-500">
                RFID Sensor: <strong className="text-neutral-800 font-semibold">Online</strong> (Antenna 01/02)
              </div>
            </div>
          </div>

          {/* Big Metric Card 1: Physical Plant Bay Matrix */}
          <div className="lg:col-span-3 bg-transparent border border-neutral-300 p-5 flex flex-col justify-between">
            <div>
              {/* Header: Icon + Title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border border-neutral-300 bg-transparent flex items-center justify-center text-neutral-800">
                    <Layers className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Plant Bay Matrix
                  </span>
                </div>
                <span className="text-[10px] text-[#059669] font-bold uppercase tracking-wider border border-emerald-300 px-1.5 py-0.5">
                  4 BAYS FREE
                </span>
              </div>

              {/* Sub-header info */}
              <div className="flex items-baseline justify-between mt-2.5">
                <div className="text-2xl font-bold text-neutral-900 tracking-tight tabular-nums">
                  8 <span className="text-sm font-normal text-neutral-400">/ 12 Active Bays</span>
                </div>
                <span className="text-[11px] text-neutral-500 tabular-nums">67% Yard Load</span>
              </div>
            </div>

            {/* Visual 12-Bay Matrix: 3 rows of 4 bays */}
            <div className="my-3 py-3 border-y border-neutral-200">
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "B01", name: "WB-01", occupied: true },
                  { id: "B02", name: "Yard A", occupied: true },
                  { id: "B03", name: "Yard A", occupied: true },
                  { id: "B04", name: "Yard B", occupied: true },
                  { id: "B05", name: "Yard B", occupied: true },
                  { id: "B06", name: "FG-01", occupied: true },
                  { id: "B07", name: "FG-02", occupied: true },
                  { id: "B08", name: "WB-02", occupied: true },
                  { id: "B09", name: "Yard A", occupied: false },
                  { id: "B10", name: "Yard B", occupied: false },
                  { id: "B11", name: "FG-03", occupied: false },
                  { id: "B12", name: "Hold", occupied: false },
                ].map((bay) => (
                  <div
                    key={bay.id}
                    className={`p-1.5 border text-center transition-colors ${
                      bay.occupied
                        ? "border-neutral-300 bg-neutral-200/40"
                        : "border-emerald-400 bg-emerald-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold leading-none">
                      <span className={bay.occupied ? "text-neutral-500" : "text-[#059669] font-bold"}>
                        {bay.id}
                      </span>
                      <span
                        className={`w-1.5 h-1.5 inline-block ${
                          bay.occupied ? "bg-[#18181B]" : "bg-[#059669]"
                        }`}
                      />
                    </div>
                    <div
                      className={`text-[10px] font-semibold mt-1 truncate ${
                        bay.occupied ? "text-neutral-800" : "text-[#047857]"
                      }`}
                    >
                      {bay.occupied ? bay.name : "FREE"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Guard Guidance */}
            <div className="flex items-center justify-between text-[11px] pt-1 text-neutral-500">
              <span className="text-neutral-700 font-medium">Bays 01–08: Occupied</span>
              <span className="text-[#059669] font-bold">Bays 09–12: Open for Entry</span>
            </div>
          </div>

          {/* Big Metric Card 2: Dual Live Weighbridge Decks */}
          <div className="lg:col-span-3 bg-transparent border border-neutral-300 p-5 flex flex-col justify-between">
            <div>
              {/* Header: Icon + Title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border border-neutral-300 bg-transparent flex items-center justify-center text-neutral-800">
                    <Scale className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Dual Weighbridge Decks
                  </span>
                </div>
                <span className="text-[10px] text-[#059669] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#059669] inline-block animate-pulse" />
                  <span>LIVE LOAD</span>
                </span>
              </div>

              {/* Sub-header info */}
              <div className="flex items-baseline justify-between mt-2.5">
                <div className="text-2xl font-bold text-neutral-900 tracking-tight tabular-nums">
                  2 <span className="text-sm font-normal text-neutral-400">Scales Active</span>
                </div>
                <span className="text-[11px] text-amber-800 font-semibold tabular-nums">2 In Queue</span>
              </div>
            </div>

            {/* Dual Platform Scale Decks Side-by-Side */}
            <div className="my-3 py-2 border-y border-neutral-200 space-y-2.5">
              {/* Deck 1: WB-01 Gross Inbound Scale */}
              <div className="border border-neutral-300 p-2.5 bg-neutral-200/30">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-amber-500 inline-block" />
                    <span>WB-01 Gross Scale</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider border border-amber-300 px-1.5 py-0.5 text-amber-800 bg-transparent">
                    WEIGHING
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1.5">
                  <div className="text-lg font-bold text-neutral-900 tabular-nums">
                    42.85 <span className="text-[10px] font-normal text-neutral-500">MT</span>
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-700 truncate max-w-[120px]">
                    MH-12-Q-4491
                  </div>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 mt-1.5 flex">
                  <div className="bg-[#18181B] h-full w-[71%]" title="42.85 MT of 60 MT capacity" />
                </div>
              </div>

              {/* Deck 2: WB-02 Tare Outbound Scale */}
              <div className="border border-neutral-300 p-2.5 bg-transparent">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#059669] inline-block" />
                    <span>WB-02 Tare Scale</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider border border-emerald-300 px-1.5 py-0.5 text-[#047857] bg-transparent">
                    CLEAR
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1.5">
                  <div className="text-lg font-bold text-neutral-900 tabular-nums">
                    0.00 <span className="text-[10px] font-normal text-neutral-500">MT</span>
                  </div>
                  <div className="text-[11px] text-[#059669] font-semibold">
                    Platform Ready
                  </div>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 mt-1.5 flex">
                  <div className="bg-[#059669] h-full w-0" />
                </div>
              </div>
            </div>

            {/* Bottom Guard Guidance */}
            <div className="flex items-center justify-between text-[11px] pt-1 text-neutral-500">
              <span className="text-amber-800 font-semibold tabular-nums">Gross: ~2m remaining</span>
              <span className="text-[#059669] font-bold">Tare: Instant Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: LIVE VEHICLE FLEET & ORDER LIST (NO BG COLOR)                  */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        {/* Section Header with Large Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs md:text-sm font-medium text-neutral-400 block tracking-normal">
              Active Gate Movement Queue
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
              Vehicle Fleet & Order List
            </h2>
          </div>

          <div className="text-xs text-neutral-500">
            Showing <strong className="text-neutral-900">{filteredVehicles.length}</strong> of{" "}
            <strong>{vehicles.length}</strong> active vehicles
          </div>
        </div>

        {/* Filter Tabs & Search Bar (Transparent, neutral borders, no bg color) */}
        <div className="bg-transparent border border-neutral-300 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Spaced Rectangular Tab Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`px-3 py-1.5 text-xs font-medium border cursor-pointer transition-colors ${
                activeTab === "ALL"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-transparent text-neutral-700 border-neutral-300 hover:bg-neutral-200/50"
              }`}
            >
              All Vehicles ({stats.totalInside})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("INBOUND_RM")}
              className={`px-3 py-1.5 text-xs font-medium border cursor-pointer transition-colors ${
                activeTab === "INBOUND_RM"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-transparent text-neutral-700 border-neutral-300 hover:bg-neutral-200/50"
              }`}
            >
              Inbound RM ({stats.inboundRM})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("OUTBOUND_DISPATCH")}
              className={`px-3 py-1.5 text-xs font-medium border cursor-pointer transition-colors ${
                activeTab === "OUTBOUND_DISPATCH"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-transparent text-neutral-700 border-neutral-300 hover:bg-neutral-200/50"
              }`}
            >
              Outbound Dispatch ({stats.outboundFG})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("WAITING_WEIGHMENT")}
              className={`px-3 py-1.5 text-xs font-medium border cursor-pointer transition-colors ${
                activeTab === "WAITING_WEIGHMENT"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-transparent text-neutral-700 border-neutral-300 hover:bg-neutral-200/50"
              }`}
            >
              Awaiting Weighment ({stats.awaitingWeighbridge})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("CLEARED_EXIT")}
              className={`px-3 py-1.5 text-xs font-medium border cursor-pointer transition-colors ${
                activeTab === "CLEARED_EXIT"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-transparent text-neutral-700 border-neutral-300 hover:bg-neutral-200/50"
              }`}
            >
              Cleared Exit ({stats.clearedForExit})
            </button>
          </div>

          {/* Search Input (Transparent, dark icon) */}
          <div className="flex items-center gap-2 border border-neutral-300 px-3 py-1.5 bg-transparent w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-800 shrink-0" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicle, driver, supplier..."
              className="w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        {/* The Exact Order list Table (Transparent background, no bg color) */}
        <div className="bg-transparent border border-neutral-300 overflow-hidden">
          {/* Table Card Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-300 bg-transparent">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 border border-neutral-300 flex items-center justify-center text-neutral-700 bg-transparent">
                <FileText className="w-3 h-3" strokeWidth={1.75} />
              </div>
              <h3 className="text-xs md:text-[13px] font-semibold text-neutral-900 tracking-tight">
                Order list
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="w-6 h-6 border border-neutral-300 hover:bg-neutral-200/50 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer bg-transparent"
                title="Table Filters"
              >
                <SlidersHorizontal className="w-3 h-3" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className="w-6 h-6 border border-neutral-300 hover:bg-neutral-200/50 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer bg-transparent"
                title="Table Options"
              >
                <MoreVertical className="w-3 h-3" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Table Body (Transparent, hairline dividers) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse bg-transparent">
              <thead className="bg-neutral-200/60 border-b border-neutral-300">
                <tr className="text-neutral-600 font-medium">
                  <th className="py-2.5 px-5 font-medium text-xs text-neutral-600">
                    Customer name
                  </th>
                  <th className="py-2.5 px-4 font-medium text-xs text-neutral-600">
                    Shipping ID
                  </th>
                  <th className="py-2.5 px-4 font-medium text-xs text-neutral-600">
                    Location
                  </th>
                  <th className="py-2.5 px-5 font-medium text-xs text-neutral-600">
                    Status Order
                  </th>
                  <th className="py-2.5 px-5 font-medium text-xs text-neutral-600 text-right">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/70 bg-transparent">
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-400 bg-transparent">
                      No active vehicles found matching current filter.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => {
                    const idNum = vehicle.gateEntryNo.split("-")[2] || "9836";
                    const stageConfig = getStageConfig(vehicle.stage);
                    const isExpanded = selectedVehicle?.id === vehicle.id;

                    const LIFECYCLE_STAGES: { key: GateStage; label: string; icon: React.ElementType }[] = [
                      { key: "ARRIVED_AT_GATE", label: "Gate In", icon: ShieldCheck },
                      { key: "WAITING_WEIGHMENT", label: "Gross Weighment", icon: Scale },
                      { key: "UNLOADING", label: "Unload & QC", icon: FlaskConical },
                      { key: "TARE_WEIGHED", label: "Tare Weighment", icon: Scale },
                      { key: "CLEARED_EXIT", label: "Gate Out", icon: CheckCircle2 },
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

                    const phoneStr = vehicle.driverPhone?.trim() ? vehicle.driverPhone : "+91 98224 81920";
                    const dwellStr = vehicle.dwellMinutes && vehicle.dwellMinutes > 0 ? `${vehicle.dwellMinutes}m dwell` : "42m dwell";
                    const currentStep = getStageIndex(vehicle.stage);

                    return (
                      <React.Fragment key={vehicle.id}>
                        <tr
                          onClick={() => setSelectedVehicle(isExpanded ? null : vehicle)}
                          className={`cursor-pointer transition-colors ${
                            isExpanded ? "bg-[#ECEFF2]" : "hover:bg-neutral-200/40"
                          }`}
                        >
                          {/* Customer / Supplier Name */}
                          <td className="py-3.5 px-5 font-medium text-neutral-900 text-xs md:text-[13px]">
                            <div className="flex items-center gap-2">
                              {isExpanded && (
                                <span className="w-1.5 h-1.5 bg-[#059669] inline-block shrink-0" title="Active Inspection" />
                              )}
                              <span>{vehicle.supplierOrCustomer}</span>
                            </div>
                            <div className="text-[11px] font-normal text-neutral-500 mt-0.5">
                              {vehicle.vehicleNo} · {vehicle.materialName} ({vehicle.declaredWeightMT.toFixed(1)} MT)
                            </div>
                          </td>

                          {/* Shipping ID (#9836 style) */}
                          <td className="py-3.5 px-4 text-xs text-neutral-700">
                            <span className="font-semibold tabular-nums text-neutral-900">#{idNum}</span>
                            <div className="text-[10px] text-neutral-500 font-medium">
                              {vehicle.gateEntryNo}
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-3.5 px-4 text-xs text-neutral-700">
                            <div>{vehicle.assignedLocation}</div>
                            <div className="text-[10px] text-neutral-400">
                              {vehicle.transporter}
                            </div>
                          </td>

                          {/* Status Order (Distinct Guard Colors with transparent bg) */}
                          <td className="py-3.5 px-5 text-xs whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border bg-transparent ${stageConfig.borderClass}`}
                            >
                              <span
                                className="w-1.5 h-1.5 inline-block shrink-0"
                                style={{ backgroundColor: stageConfig.dotColor }}
                              />
                              <span style={{ color: stageConfig.textColor }}>
                                {stageConfig.label}
                              </span>
                            </span>
                          </td>

                          {/* Details Button / Expand Indicator */}
                          <td className="py-3.5 px-5 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVehicle(isExpanded ? null : vehicle);
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 border text-[11px] font-medium cursor-pointer transition-all duration-200 active:scale-95 ${
                                isExpanded
                                  ? "bg-[#18181B] text-white border-[#18181B]"
                                  : "border-neutral-300 hover:bg-neutral-200/50 text-neutral-700 bg-transparent"
                              }`}
                            >
                              <span>{isExpanded ? "Collapse" : "Inspect"}</span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </td>
                        </tr>

                        {/* Inline Expanded Card: Framed Dossier Inset with Smooth Motion */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.tr
                              key={`expanded-${vehicle.id}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="border-b border-neutral-300"
                            >
                              <td colSpan={5} className="p-0">
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{
                                    height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                                    opacity: { duration: 0.25 },
                                  }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-3 sm:p-4 bg-neutral-200/35 border-b border-neutral-300">
                                    <motion.div
                                      initial={{ opacity: 0, y: -12, scale: 0.995 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -8, scale: 0.995 }}
                                      transition={{ duration: 0.28, delay: 0.03, ease: [0.16, 1, 0.3, 1] }}
                                      className="bg-white border border-neutral-300 p-5 md:p-6 space-y-4"
                                    >
                                      {/* Header inside expanded card (No duplicate collapse button) */}
                                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-200">
                                  <div className="flex flex-wrap items-center gap-3">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-neutral-300 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-800">
                                      <span
                                        className="w-1.5 h-1.5 shrink-0 inline-block"
                                        style={{ backgroundColor: stageConfig.dotColor }}
                                      />
                                      <span>Active Dossier</span>
                                    </span>
                                    <div className="flex flex-wrap items-center gap-2.5">
                                      <span className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                                        {vehicle.vehicleNo}
                                      </span>
                                      <span
                                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 ${
                                          vehicle.direction === "INBOUND_RM"
                                            ? "bg-[#18181B] text-white"
                                            : "bg-[#059669] text-white"
                                        }`}
                                      >
                                        {vehicle.direction === "INBOUND_RM"
                                          ? "Inbound Biomass RM"
                                          : "Outbound Dispatch FG"}
                                      </span>
                                      <span className="text-xs text-neutral-600">
                                        Pass: <strong className="text-neutral-800 font-semibold">{vehicle.gateEntryNo}</strong> · {vehicle.vehicleType}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Right Metadata Pill & Close Icon */}
                                  <div className="flex items-center gap-2">
                                    <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-600 bg-white/70 border border-neutral-300 px-2.5 py-1 tabular-nums">
                                      <span>In: {vehicle.inTime || "14:15"}</span>
                                      <span>·</span>
                                      <span className="text-neutral-800 font-semibold">{dwellStr}</span>
                                      <span>·</span>
                                      <span className="text-[#059669] font-medium">{stageConfig.label}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedVehicle(null);
                                      }}
                                      className="w-7 h-7 flex items-center justify-center border border-neutral-300 hover:bg-neutral-200/50 text-neutral-600 hover:text-neutral-900 cursor-pointer bg-white/70 transition-colors"
                                      title="Close Inspection Panel"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* 5-Stage Plant Operational Stepper (Connected Timeline Pipeline) */}
                                <div className="border border-neutral-300 p-4 bg-neutral-50/80">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3">
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 bg-[#059669] inline-block" />
                                      <span>Plant Operational Lifecycle Progress</span>
                                    </span>
                                    <span className="font-semibold text-neutral-800 tabular-nums border border-neutral-300 px-2 py-0.5 bg-white">
                                      Stage {currentStep + 1} of {LIFECYCLE_STAGES.length} · {LIFECYCLE_STAGES[currentStep]?.label}
                                    </span>
                                  </div>

                                  <div className="relative">
                                    {/* Connecting Pipeline Tracks */}
                                    <div className="absolute top-4 left-6 right-6 h-0.5 bg-neutral-200 z-0" />
                                    <div
                                      className="absolute top-4 left-6 h-0.5 bg-[#18181B] z-0 transition-all duration-300"
                                      style={{
                                        width: `${(currentStep / (LIFECYCLE_STAGES.length - 1)) * 100}%`,
                                      }}
                                    />

                                    <div className="relative z-10 grid grid-cols-5 gap-2">
                                      {LIFECYCLE_STAGES.map((step, idx) => {
                                        const Icon = step.icon;
                                        const isPassed = idx < currentStep;
                                        const isCurrent = idx === currentStep;

                                        return (
                                          <div key={step.key} className="flex flex-col items-center text-center">
                                            <div
                                              className={`w-8 h-8 flex items-center justify-center text-xs mb-1.5 border transition-all relative ${
                                                isCurrent
                                                  ? "bg-[#18181B] text-white border-[#18181B] ring-2 ring-[#059669]/50 shadow-sm"
                                                  : isPassed
                                                  ? "bg-neutral-900 text-white border-neutral-900"
                                                  : "bg-white text-neutral-400 border-neutral-300"
                                              }`}
                                            >
                                              {isCurrent && (
                                                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#059669] animate-ping" />
                                              )}
                                              {isPassed ? (
                                                <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                                              ) : (
                                                <Icon className="w-4 h-4" />
                                              )}
                                            </div>
                                            <span
                                              className={`text-[10px] sm:text-[11px] leading-tight block ${
                                                isCurrent
                                                  ? "font-bold text-neutral-900"
                                                  : isPassed
                                                  ? "text-neutral-700 font-medium"
                                                  : "text-neutral-400"
                                              }`}
                                            >
                                              {step.label}
                                            </span>
                                            <span className="text-[10px] text-neutral-400 block mt-0.5">
                                              {isCurrent ? "Active Now" : isPassed ? "Complete" : "Pending"}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>

                                {/* 4-Column Structured Specification Matrix */}
                                <div className="border border-neutral-300 divide-y md:divide-y-0 md:divide-x divide-neutral-200 bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                                  {/* Col 1: Cargo & Commodity */}
                                  <div className="p-3.5 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                                        Cargo / Material
                                      </span>
                                      <span className="text-[9px] font-semibold uppercase px-1 py-0.2 bg-neutral-100 border border-neutral-200 text-neutral-600">
                                        BIOMASS LOT
                                      </span>
                                    </div>
                                    <div className="font-bold text-neutral-900 text-xs sm:text-sm">
                                      {vehicle.materialName}
                                    </div>
                                    <div className="text-[11px] text-neutral-500 tabular-nums">
                                      Declared: <strong className="text-neutral-900 font-semibold">{vehicle.declaredWeightMT.toFixed(2)} MT</strong>
                                    </div>
                                  </div>

                                  {/* Col 2: Supplier / Origin */}
                                  <div className="p-3.5 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                                        {vehicle.direction === "INBOUND_RM" ? "Supplier / Origin" : "Customer Unit"}
                                      </span>
                                      <span className="text-[9px] font-semibold uppercase px-1 py-0.2 bg-neutral-100 border border-neutral-200 text-neutral-600">
                                        VERIFIED
                                      </span>
                                    </div>
                                    <div className="font-semibold text-neutral-900 text-xs sm:text-sm truncate">
                                      {vehicle.supplierOrCustomer}
                                    </div>
                                    <div className="text-[11px] text-neutral-500 truncate">
                                      {vehicle.transporter} · {vehicle.challanOrLrNo || "LR-78102"}
                                    </div>
                                  </div>

                                  {/* Col 3: Driver & Crew */}
                                  <div className="p-3.5 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                                        Driver & Sobriety
                                      </span>
                                      <span className="text-[9px] font-bold uppercase px-1 py-0.2 text-[#047857] border border-emerald-300 bg-emerald-50/50">
                                        ✓ 0.00% BAC
                                      </span>
                                    </div>
                                    <div className="font-semibold text-neutral-900 text-xs sm:text-sm">
                                      {vehicle.driverName}
                                    </div>
                                    <div className="text-[11px] text-neutral-600 font-medium tabular-nums">
                                      {phoneStr}
                                    </div>
                                  </div>

                                  {/* Col 4: Yard Location & E-Way */}
                                  <div className="p-3.5 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                                        Assigned Bay / Yard
                                      </span>
                                      <span className="text-[9px] font-semibold uppercase px-1 py-0.2 bg-neutral-100 border border-neutral-200 text-neutral-600">
                                        DESTINATION
                                      </span>
                                    </div>
                                    <div className="font-bold text-neutral-900 text-xs sm:text-sm flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 bg-[#059669] inline-block" />
                                      <span>{vehicle.assignedLocation}</span>
                                    </div>
                                    <div className="text-[11px] text-neutral-600 font-medium truncate">
                                      {vehicle.ewayBillNo || "EWB-6621-0891-7733"}
                                    </div>
                                  </div>
                                </div>

                                {/* Gate Security & Inspection Note Inset */}
                                <div className="p-3.5 bg-neutral-50 border border-neutral-300 flex items-start gap-3">
                                  <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                                  <div className="text-xs flex-1">
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="font-bold uppercase tracking-wider text-[10px] text-neutral-800">
                                        Gate Security Checkpoint Record
                                      </span>
                                      <span className="text-[10px] text-neutral-500 font-medium">
                                        Station 01 Inspector Stamp
                                      </span>
                                    </div>
                                    <p className="text-neutral-600 leading-relaxed text-[11px]">
                                      {vehicle.remarks || "Direct tipper load from farm cluster. Moisture visually normal. Breathalyzer test passed. Gate pass authenticated."}
                                    </p>
                                  </div>
                                </div>

                                {/* Guard Fast Action Workflow Toolbar */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mr-1">
                                      Fast Routing Action:
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStage(vehicle.id, "WAITING_WEIGHMENT");
                                      }}
                                      className="px-3 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-[11px] font-semibold cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                                    >
                                      <Scale className="w-3.5 h-3.5 text-amber-700" />
                                      <span>Route to Weighbridge 1</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStage(vehicle.id, "UNLOADING");
                                      }}
                                      className="px-3 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-[11px] font-semibold cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                                    >
                                      <Layers className="w-3.5 h-3.5 text-blue-700" />
                                      <span>Direct to Yard Unloading</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStage(vehicle.id, "CLEARED_EXIT");
                                      }}
                                      className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Clear for Boom Barrier Exit</span>
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.print();
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-[11px] font-medium cursor-pointer bg-white transition-all active:scale-95"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Print Gate Slip</span>
                                  </button>
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Gate Entry Modal */}
      <GateEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddVehicle={handleAddVehicle}
      />
    </div>
  );
}
