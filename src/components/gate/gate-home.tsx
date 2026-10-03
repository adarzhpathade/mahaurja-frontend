"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Zap,
  Check,
  Calendar,
  Plus,
  X,
} from "lucide-react";
import { GateVehicle } from "@/lib/types/gate";
import { useGate } from "@/lib/context/gate-context";

interface GateHomeProps {
  onNavigateTab: (tabId: string) => void;
  onOpenEntryModal: (prefillData?: Partial<GateVehicle>) => void;
}

interface ExpectedArrival {
  id: string;
  poNo: string;
  supplierName: string;
  vehicleNo: string;
  transporter: string;
  materialName: string;
  expectedWeightMT: number;
  timeWindow: string;
  etaMinutes: number;
  status: "APPROACHING" | "ON_SCHEDULE" | "DELAYED";
  driverName: string;
  driverPhone: string;
  farmCluster: string;
}

const PRE_ADVISED_ARRIVALS: ExpectedArrival[] = [
  {
    id: "EXP-01",
    poNo: "PO-2026-0982",
    supplierName: "Kolhapur Agro Biomass Union",
    vehicleNo: "MH 09 CW 3319",
    transporter: "Sahyadri Logistics",
    materialName: "Groundnut Shell (GS)",
    expectedWeightMT: 26.5,
    timeWindow: "16:45 – 17:15",
    etaMinutes: 8,
    status: "APPROACHING",
    driverName: "Sanjay Mane",
    driverPhone: "+91 98220 11942",
    farmCluster: "Hatkangale Agro Belt",
  },
  {
    id: "EXP-02",
    poNo: "PO-2026-0985",
    supplierName: "Vidarbha Wood Processors LLP",
    vehicleNo: "MH 31 CB 7721",
    transporter: "Nagpur Express Fleet",
    materialName: "Sawdust Fine (SD)",
    expectedWeightMT: 31.0,
    timeWindow: "17:00 – 17:30",
    etaMinutes: 24,
    status: "ON_SCHEDULE",
    driverName: "Anil Wankhede",
    driverPhone: "+91 94221 88301",
    farmCluster: "Nagpur Timber Zone",
  },
  {
    id: "EXP-03",
    poNo: "PO-2026-0988",
    supplierName: "Solapur Biofuels Cluster",
    vehicleNo: "MH 13 AN 6402",
    transporter: "Siddheshwar Carriers",
    materialName: "Bagasse Dry Bale (BG)",
    expectedWeightMT: 22.8,
    timeWindow: "17:30 – 18:00",
    etaMinutes: 52,
    status: "ON_SCHEDULE",
    driverName: "Raju Gaikwad",
    driverPhone: "+91 98812 44901",
    farmCluster: "Pandharpur Sugar Cluster",
  },
  {
    id: "EXP-04",
    poNo: "PO-2026-0979",
    supplierName: "Marathwada Agro Feedstocks",
    vehicleNo: "MH 20 DV 1890",
    transporter: "Godavari Logistics",
    materialName: "Cotton Stalk Shredded (CS)",
    expectedWeightMT: 24.0,
    timeWindow: "16:00 – 16:30",
    etaMinutes: 65,
    status: "DELAYED",
    driverName: "Baban Shinde",
    driverPhone: "+91 97654 33210",
    farmCluster: "Jalna Cotton Co-op",
  },
];

export function GateHome({ onNavigateTab, onOpenEntryModal }: GateHomeProps) {
  const { vehicles } = useGate();

  // Filter & Search Pre-Advised Arrivals
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "APPROACHING" | "SCHEDULED">("ALL");
  const [viewMode, setViewMode] = useState<"CARDS" | "TABLE">("CARDS");
  const [selectedArrival, setSelectedArrival] = useState<ExpectedArrival | null>(null);
  const [checkedInIds, setCheckedInIds] = useState<string[]>([]);

  // Live Metrics computed from context
  const insideVehicles = vehicles.filter((v) => v.stage !== "EXIT_COMPLETED");
  const totalInside = insideVehicles.length;
  const inboundCount = insideVehicles.filter((v) => v.direction === "INBOUND_RM").length;
  const outboundCount = insideVehicles.filter((v) => v.direction === "OUTBOUND_DISPATCH").length;
  const awaitingWB = insideVehicles.filter(
    (v) => v.stage === "WAITING_WEIGHMENT" || v.stage === "GROSS_WEIGHED"
  ).length;
  const inYard = insideVehicles.filter(
    (v) => v.stage === "UNLOADING" || v.stage === "QC_PENDING"
  ).length;
  const readyExit = insideVehicles.filter(
    (v) => v.stage === "TARE_WEIGHED" || v.stage === "CLEARED_EXIT"
  ).length;

  const filteredExpected = PRE_ADVISED_ARRIVALS.filter((item) => {
    const matchesSearch =
      item.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === "APPROACHING") {
      return matchesSearch && item.status === "APPROACHING";
    }
    if (filterType === "SCHEDULED") {
      return matchesSearch && item.status === "ON_SCHEDULE";
    }
    return matchesSearch;
  });

  const handleFastCheckIn = (item: ExpectedArrival) => {
    setCheckedInIds((prev) => [...prev, item.id]);
    onOpenEntryModal({
      vehicleNo: item.vehicleNo,
      supplierOrCustomer: item.supplierName,
      materialName: item.materialName,
      transporter: item.transporter,
      declaredWeightMT: item.expectedWeightMT,
      driverName: item.driverName,
      driverMobile: item.driverPhone,
      direction: "INBOUND_RM",
      challanOrLrNo: item.poNo,
    });
  };

  return (
    <div className="w-full space-y-8 sm:space-y-10 select-none">
      {/* ========================================================================= */}
      {/* 1. COMPACT COMMAND HEADER                                                 */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Gate Operations
        </h1>
      </div>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME OPERATIONAL METRICS (4 CLICKABLE CARDS)                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Metric 1: Total Inside -> Goes to Tracker */}
        <div
          onClick={() => onNavigateTab("live-tracker")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors truncate">
            Inside Plant
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {totalInside}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Vehicles</span>
          </div>
        </div>

        {/* Metric 2: Awaiting Weighment -> Goes to Tracker */}
        <div
          onClick={() => onNavigateTab("live-tracker")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors truncate">
            At Weighbridge
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {awaitingWB}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Vehicles</span>
          </div>
        </div>

        {/* Metric 3: In Yard Unload / QC -> Goes to Tracker */}
        <div
          onClick={() => onNavigateTab("live-tracker")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors truncate">
            Yard & Sampling
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {inYard}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Vehicles</span>
          </div>
        </div>

        {/* Metric 4: Ready for Exit -> Goes to Exit Desk */}
        <div
          onClick={() => onNavigateTab("exit")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors truncate">
            Exit Clearance
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {readyExit}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Vehicles</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. QUICK ACTION BUTTONS                                                   */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full">
        <button
          type="button"
          onClick={() => onNavigateTab("live-tracker")}
          className="h-11 sm:h-10 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Truck className="w-4 h-4 text-neutral-600" />
          <span>Tracker ({totalInside})</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenEntryModal()}
          className="h-11 sm:h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>New Gate Entry</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. PRE-ADVISED INBOUND ARRIVALS (SCHEDULED FLEET ROSTER)                  */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-3 sm:pt-6">
        {/* Section Heading */}
        <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-neutral-800 shrink-0" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900">
              Expected Arrivals
            </h2>
            <span className="text-[11px] sm:text-xs font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {filteredExpected.length}
            </span>
          </div>
        </div>

        <div className="border-0 p-0 bg-transparent sm:border sm:border-neutral-300 sm:p-6 sm:bg-white/30 space-y-4 sm:space-y-5">
          {/* Subheader & Search / View Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-neutral-300">
            {/* Search + View Mode row on mobile */}
            <div className="flex items-center gap-2 w-full flex-1 sm:max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search plate, supplier, PO..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 sm:h-10 pl-9.5 pr-3 text-sm bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
                />
              </div>

              {/* View Mode Toggle (PC Only) */}
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

            {/* Filter Tabs (PC Only) */}
            <div className="hidden sm:flex items-center border border-neutral-300 divide-x divide-neutral-300 text-xs overflow-x-auto no-scrollbar shrink-0 h-10 bg-white">
              <button
                type="button"
                onClick={() => setFilterType("ALL")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center ${
                  filterType === "ALL"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                All ({PRE_ADVISED_ARRIVALS.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("APPROACHING")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center ${
                  filterType === "APPROACHING"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                Near (1)
              </button>
              <button
                type="button"
                onClick={() => setFilterType("SCHEDULED")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center ${
                  filterType === "SCHEDULED"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                Scheduled (2)
              </button>
            </div>
          </div>

        {/* Content: Cards Grid (Always on Mobile, or PC when Cards selected) or Table (PC only) */}
        {filteredExpected.length === 0 ? (
          <div className="py-8 text-center text-neutral-500">
            No matching scheduled arrivals found.
          </div>
        ) : (
          <>
            {/* Cards View: Always on Mobile, respects viewMode on Desktop */}
            <div className={viewMode === "CARDS" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" : "grid grid-cols-1 sm:hidden gap-3"}>
            {filteredExpected.map((item) => {
              const isCheckedIn = checkedInIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedArrival(item)}
                  className={`border p-3 flex flex-col justify-between space-y-2.5 cursor-pointer transition-all group ${
                    isCheckedIn
                      ? "border-emerald-300 bg-emerald-50/30"
                      : "border-neutral-300 hover:border-neutral-900 bg-white/40"
                  }`}
                >
                  {/* Top: Window + Status */}
                  <div className="flex items-start justify-between gap-1 pb-1.5 border-b border-neutral-200">
                    <div>
                      <span className="font-semibold text-neutral-900 tabular-nums text-xs block">
                        {item.timeWindow}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {item.poNo}
                      </span>
                    </div>

                    {item.status === "APPROACHING" ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 border border-sky-300 text-sky-700 text-[10px] font-bold uppercase tracking-wider bg-sky-50 shrink-0">
                        <span className="w-1.5 h-1.5 bg-sky-600 animate-pulse inline-block" />
                        <span>~8m Away</span>
                      </span>
                    ) : item.status === "ON_SCHEDULE" ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 border border-neutral-300 text-neutral-700 text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 shrink-0">
                        <span className="w-1.5 h-1.5 bg-neutral-500 inline-block" />
                        <span>On Time</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 border border-amber-300 text-amber-800 text-[10px] font-bold uppercase tracking-wider bg-amber-50 shrink-0">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Delayed</span>
                      </span>
                    )}
                  </div>

                  {/* Vehicle & Material Details */}
                  <div className="space-y-1 text-xs">
                    <div className="font-mono font-bold text-neutral-900 text-sm group-hover:text-[#059669] transition-colors">
                      {item.vehicleNo}
                    </div>

                    <div className="flex items-baseline justify-between gap-1">
                      <span className="font-semibold text-neutral-800 truncate">
                        {item.materialName}
                      </span>
                      <span className="font-bold text-neutral-900 tabular-nums text-[11px] shrink-0">
                        {item.expectedWeightMT.toFixed(1)} MT
                      </span>
                    </div>

                    <div className="text-[11px] text-neutral-600 truncate">
                      {item.supplierName}
                    </div>

                    <div className="text-[10px] text-neutral-400 truncate">
                      {item.transporter} · {item.driverName}
                    </div>
                  </div>

                  {/* Bottom: Action & Tap prompt */}
                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-neutral-400 group-hover:text-neutral-700 transition-colors">
                      Tap for details
                    </span>

                    {isCheckedIn ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#047857] px-2 py-0.5 bg-emerald-50 border border-emerald-300">
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        <span>Checked In</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFastCheckIn(item);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#059669] hover:bg-[#047857] text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Check-In</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table View (PC Only) */}
          <div className={viewMode === "TABLE" ? "hidden sm:block overflow-x-auto border border-neutral-300" : "hidden"}>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Window & ETA</th>
                  <th className="py-2.5 px-3">Vehicle Plate</th>
                  <th className="py-2.5 px-3">Supplier & Cluster</th>
                  <th className="py-2.5 px-3">Commodity & Declared</th>
                  <th className="py-2.5 px-3">Gate Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {filteredExpected.map((item) => {
                  const isCheckedIn = checkedInIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedArrival(item)}
                      className={`hover:bg-neutral-200/40 transition-colors cursor-pointer ${
                        isCheckedIn ? "bg-emerald-50/40" : ""
                      }`}
                    >
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-neutral-900 tabular-nums">
                          {item.timeWindow}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          {item.poNo}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-neutral-900 text-xs">
                          {item.vehicleNo}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {item.transporter}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-medium text-neutral-900 truncate max-w-[200px]">
                          {item.supplierName}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {item.farmCluster} · {item.driverName}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-medium text-neutral-900">
                          {item.materialName}
                        </div>
                        <div className="text-[11px] text-neutral-500 tabular-nums">
                          {item.expectedWeightMT.toFixed(1)} MT declared
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {item.status === "APPROACHING" ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-sky-300 text-sky-700 text-[10px] font-bold uppercase tracking-wider bg-sky-50">
                            <span className="w-1.5 h-1.5 bg-sky-600 animate-pulse inline-block" />
                            <span>Approaching (~8m)</span>
                          </span>
                        ) : item.status === "ON_SCHEDULE" ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-neutral-300 text-neutral-700 text-[10px] font-semibold uppercase tracking-wider bg-neutral-100">
                            <span className="w-1.5 h-1.5 bg-neutral-500 inline-block" />
                            <span>On Schedule</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-amber-300 text-amber-800 text-[10px] font-bold uppercase tracking-wider bg-amber-50">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Delayed Traffic</span>
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        {isCheckedIn ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#047857] px-2.5 py-1 bg-emerald-50 border border-emerald-300">
                            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                            <span>Checked In</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFastCheckIn(item);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#059669] hover:bg-[#047857] text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            <Zap className="w-3 h-3" />
                            <span>1-Click Check-In</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. ARRIVAL DETAILS POPUP MODAL (TAP-TO-INSPECT)                            */}
      {/* ========================================================================= */}
      {selectedArrival && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4"
          onClick={() => setSelectedArrival(null)}
        >
          <div
            className="w-full max-w-lg max-h-[92vh] overflow-y-auto border border-neutral-300 bg-[#F4F5F7] shadow-2xl p-4 sm:p-5 space-y-3.5 sm:space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-neutral-300 pb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Truck className="w-5 h-5 text-[#059669] shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 uppercase tracking-wide truncate">
                    Scheduled Arrival
                  </h3>
                  <div className="font-mono font-bold text-xs text-neutral-800">
                    {selectedArrival.vehicleNo}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArrival(null)}
                className="w-8 h-8 flex items-center justify-center border border-neutral-300 hover:bg-neutral-200/60 text-neutral-600 hover:text-neutral-900 cursor-pointer bg-white transition-colors shrink-0"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Arrival Info Card */}
            <div className="p-3.5 bg-white border border-neutral-300 space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5 pb-2.5 border-b border-neutral-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    PO Reference
                  </span>
                  <span className="font-mono font-bold text-neutral-900 text-sm">
                    {selectedArrival.poNo}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Scheduled Window & ETA
                  </span>
                  <span className="font-bold text-neutral-800 block text-xs">
                    {selectedArrival.timeWindow} ({selectedArrival.etaMinutes}m ETA)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Material / Commodity
                  </span>
                  <span className="font-semibold text-neutral-800 text-xs block">
                    {selectedArrival.materialName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Declared Quantity
                  </span>
                  <span className="font-mono font-bold text-neutral-900 text-xs block">
                    {selectedArrival.expectedWeightMT.toFixed(1)} MT
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2.5 border-t border-neutral-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Supplier & Cluster
                  </span>
                  <span className="font-semibold text-neutral-800 block text-xs">
                    {selectedArrival.supplierName}
                  </span>
                  <span className="text-[10px] text-neutral-500 block">
                    {selectedArrival.farmCluster}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Driver & Contact
                  </span>
                  <span className="font-semibold text-neutral-800 block text-xs">
                    {selectedArrival.driverName}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-600 block">
                    {selectedArrival.driverPhone}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                  Transporter Fleet
                </span>
                <span className="text-neutral-800 font-medium block text-xs">
                  {selectedArrival.transporter}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-neutral-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedArrival(null)}
                className="order-2 sm:order-1 w-full sm:w-auto px-4 py-2 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold cursor-pointer transition-colors text-center"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const item = selectedArrival;
                  setSelectedArrival(null);
                  handleFastCheckIn(item);
                }}
                className="order-1 sm:order-2 w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Zap className="w-4 h-4" />
                <span>Perform Gate Check-In</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
