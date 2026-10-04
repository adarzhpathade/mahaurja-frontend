"use client";

import React, { useState } from "react";
import {
  Scale,
  Search,
  Plus,
  Printer,
  Truck,
  ArrowRight,
} from "lucide-react";
import { useWeighbridge } from "@/lib/context/weighbridge-context";
import { ScaleIndicator } from "./scale-indicator";
import { WeighmentCaptureModal } from "./weighment-capture-modal";
import { WeighbridgeSlipModal } from "./weighbridge-slip-modal";
import { WeighmentType, PlatformId } from "@/lib/types/weighbridge";
import { INITIAL_GATE_VEHICLES } from "@/lib/data/mock-gate-vehicles";
import { GateVehicle } from "@/lib/types/gate";

export function WeighbridgeHome() {
  const {
    activePlatformId,
    setActivePlatformId,
    records,
    stats,
    isCaptureModalOpen,
    captureModalParams,
    openCaptureModal,
    closeCaptureModal,
    isSlipModalOpen,
    selectedSlipRecord,
    openSlipModal,
    closeSlipModal,
    loadVehicleOnScale,
  } = useWeighbridge();

  const [filterType, setFilterType] = useState<"ALL" | "FIRST" | "SECOND">("ALL");
  const [deckFilter, setDeckFilter] = useState<"ALL" | "INBOUND_RM" | "OUTBOUND_DISPATCH">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"CARDS" | "TABLE">("CARDS");

  // Inbound & Outbound vehicles waiting for 1st weighment (Gross for RM, Tare for FG)
  const firstWeighmentQueue = INITIAL_GATE_VEHICLES.filter(
    (v) =>
      (v.direction === "INBOUND_RM" && (!v.grossWeightMT || v.stage === "WAITING_WEIGHMENT")) ||
      (v.direction === "OUTBOUND_DISPATCH" && !v.tareWeightMT)
  );

  // Vehicles waiting for 2nd weighment (Tare for unloaded RM, Gross for loaded FG)
  const secondWeighmentQueue = INITIAL_GATE_VEHICLES.filter(
    (v) =>
      (v.direction === "INBOUND_RM" &&
        v.grossWeightMT &&
        (!v.tareWeightMT || v.stage === "UNLOADING" || v.stage === "TARE_WEIGHED")) ||
      (v.direction === "OUTBOUND_DISPATCH" && v.tareWeightMT && !v.grossWeightMT)
  );

  // Filtered queue based on selected stage tab, deck filter, and search query
  const displayedQueue = (
    filterType === "FIRST"
      ? firstWeighmentQueue
      : filterType === "SECOND"
      ? secondWeighmentQueue
      : [...firstWeighmentQueue, ...secondWeighmentQueue]
  )
    .filter((v) => (deckFilter === "ALL" ? true : v.direction === deckFilter))
    .filter((v) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        v.vehicleNo.toLowerCase().includes(q) ||
        v.gateEntryNo.toLowerCase().includes(q) ||
        v.materialName.toLowerCase().includes(q) ||
        v.supplierOrCustomer.toLowerCase().includes(q) ||
        v.driverName.toLowerCase().includes(q)
      );
    });

  // Handler to position vehicle on scale and prompt capture in 1 click
  const handlePositionAndWeigh = (v: GateVehicle) => {
    const isFirstWeighment = !v.grossWeightMT;
    let targetType: WeighmentType;
    let targetPlatform: PlatformId;

    if (v.direction === "INBOUND_RM") {
      targetPlatform = "WB-01";
      targetType = isFirstWeighment ? "INBOUND_GROSS" : "INBOUND_TARE";
    } else {
      targetPlatform = "WB-02";
      targetType = isFirstWeighment ? "OUTBOUND_TARE" : "OUTBOUND_GROSS";
    }

    setActivePlatformId(targetPlatform);
    loadVehicleOnScale(targetPlatform, v);
    openCaptureModal({
      vehicle: v,
      weighmentType: targetType,
      platformId: targetPlatform,
    });
  };

  return (
    <div className="w-full space-y-8 sm:space-y-10 select-none">
      {/* ========================================================================= */}
      {/* 1. COMPACT COMMAND HEADER (EXACT GATE DASHBOARD STYLE)                    */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Weighbridge Operations
        </h1>
      </div>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME OPERATIONAL METRICS (4 CLICKABLE CARDS - GATE STYLE)         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Metric 1: At Weighbridge */}
        <div
          onClick={() => setFilterType("ALL")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors truncate">
            At Weighbridge
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {firstWeighmentQueue.length + secondWeighmentQueue.length}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Vehicles</span>
          </div>
        </div>

        {/* Metric 2: 1st Gross Weight */}
        <div
          onClick={() => setFilterType("FIRST")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors truncate">
            1st Gross Weight
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {firstWeighmentQueue.length}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Vehicles</span>
          </div>
        </div>

        {/* Metric 3: 2nd Tare & Net */}
        <div
          onClick={() => setFilterType("SECOND")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors truncate">
            2nd Tare & Net
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {secondWeighmentQueue.length}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Vehicles</span>
          </div>
        </div>

        {/* Metric 4: Completed Today */}
        <div
          onClick={() => {
            if (records.length > 0) openSlipModal(records[0]);
          }}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors truncate">
            Completed Today
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {stats.todayTotalSlips}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">
              Slips ({stats.todayNetTonnageMT.toFixed(0)} MT)
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. QUICK ACTION BUTTONS (EXACT GATE DASHBOARD STYLE)                      */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full">
        <button
          type="button"
          onClick={() => {
            if (records.length > 0) openSlipModal(records[0]);
          }}
          className="h-11 sm:h-10 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Printer className="w-4 h-4 text-neutral-600" />
          <span>Reprint Last Slip</span>
        </button>

        <button
          type="button"
          onClick={() =>
            openCaptureModal({
              weighmentType:
                activePlatformId === "WB-01" ? "INBOUND_GROSS" : "OUTBOUND_GROSS",
              platformId: activePlatformId,
            })
          }
          className="h-11 sm:h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Manual Weight Entry</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. LIVE SCALE COCKPIT (CLEAN INDUSTRIAL DESIGN)                           */}
      {/* ========================================================================= */}
      <ScaleIndicator
        onCaptureClick={() =>
          openCaptureModal({
            weighmentType:
              activePlatformId === "WB-01" ? "INBOUND_GROSS" : "OUTBOUND_GROSS",
            platformId: activePlatformId,
          })
        }
      />

      {/* ========================================================================= */}
      {/* 5. WAITING VEHICLES WORKBENCH (EXACT GATE UI PATTERN)                     */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        {/* Section Heading (Matching Gate Expected Arrivals) */}
        <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-neutral-800 shrink-0" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900">
              Waiting Vehicles
            </h2>
            <span className="text-[11px] sm:text-xs font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {displayedQueue.length}
            </span>
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

        {/* Content container - borderless on mobile, bordered on PC (Gate rule) */}
        <div className="border-0 p-0 bg-transparent sm:border sm:border-neutral-300 sm:p-6 sm:bg-white/30 space-y-4 sm:space-y-5">
          {/* Subheader & Search / Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-neutral-300">
            {/* Search Input */}
            <div className="relative w-full flex-1 sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search plate, supplier, pass, material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 sm:h-10 pl-9.5 pr-3 text-sm bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center border border-neutral-300 divide-x divide-neutral-300 text-xs overflow-x-auto no-scrollbar shrink-0 h-10 bg-white">
              <button
                type="button"
                onClick={() => setFilterType("ALL")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterType === "ALL"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>All</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    filterType === "ALL"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {firstWeighmentQueue.length + secondWeighmentQueue.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType("FIRST")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterType === "FIRST"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>1st Gross</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    filterType === "FIRST"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {firstWeighmentQueue.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType("SECOND")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterType === "SECOND"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>2nd Tare</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    filterType === "SECOND"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {secondWeighmentQueue.length}
                </span>
              </button>
            </div>
          </div>

          {/* Content: Cards Grid (Always on Mobile, or PC when Cards selected) or Table (PC only) */}
          {displayedQueue.length === 0 ? (
            <div className="py-8 text-center text-neutral-500 font-mono text-xs">
              No matching vehicles waiting for weighment.
            </div>
          ) : (
            <>
              {/* Cards View: Always on Mobile, respects viewMode on Desktop */}
              <div
                className={
                  viewMode === "CARDS"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                    : "grid grid-cols-1 sm:hidden gap-3"
                }
              >
                {displayedQueue.map((v) => {
                  const isFirst = !v.grossWeightMT;
                  const isRM = v.direction === "INBOUND_RM";
                  const targetDeck = isRM ? "WB-01" : "WB-02";
                  const weighmentLabel = isRM
                    ? isFirst
                      ? "1st Gross (RM)"
                      : "2nd Tare (RM)"
                    : isFirst
                    ? "1st Tare (FG)"
                    : "2nd Gross (FG)";

                  return (
                    <div
                      key={v.id}
                      className="border border-neutral-300 hover:border-neutral-900 bg-white/40 p-3 flex flex-col justify-between space-y-2.5 transition-all group"
                    >
                      {/* Top: Pass + Stage Status */}
                      <div className="flex items-start justify-between gap-1 pb-1.5 border-b border-neutral-200">
                        <div>
                          <span className="font-semibold text-neutral-900 tabular-nums text-xs block font-mono">
                            {v.gateEntryNo}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            In: {v.arrivalTime}
                          </span>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 border text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            isFirst
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : "bg-emerald-50 text-emerald-800 border-emerald-300"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 inline-block ${
                              isFirst ? "bg-amber-600 animate-pulse" : "bg-emerald-600"
                            }`}
                          />
                          <span>{weighmentLabel}</span>
                        </span>
                      </div>

                      {/* Vehicle & Material Details */}
                      <div className="space-y-1 text-xs">
                        <div className="font-mono font-bold text-neutral-900 text-sm group-hover:text-[#059669] transition-colors">
                          {v.vehicleNo}
                        </div>

                        <div className="flex items-baseline justify-between gap-1">
                          <span className="font-semibold text-neutral-800 truncate">
                            {v.materialName}
                          </span>
                          <span className="font-bold text-neutral-900 tabular-nums text-[11px] shrink-0">
                            {isFirst
                              ? v.declaredWeightMT
                                ? `${v.declaredWeightMT.toFixed(1)} MT`
                                : "—"
                              : `${(v.grossWeightMT || 42.8).toFixed(1)} MT`}
                          </span>
                        </div>

                        <div className="text-[11px] text-neutral-600 truncate">
                          {v.supplierOrCustomer}
                        </div>

                        <div className="text-[10px] text-neutral-400 truncate">
                          {v.transporter} · {v.driverName}
                        </div>
                      </div>

                      {/* Bottom: Action & Deck prompt */}
                      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-neutral-400 group-hover:text-neutral-700 transition-colors font-mono">
                          Deck: <strong className="text-neutral-800">{targetDeck}</strong>
                        </span>

                        <button
                          type="button"
                          onClick={() => handlePositionAndWeigh(v)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#059669] hover:bg-[#047857] text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                        >
                          <Scale className="w-3 h-3" />
                          <span>Weigh on {targetDeck}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table View: PC Only when viewMode === "TABLE" */}
              {viewMode === "TABLE" && (
                <div className="hidden sm:block overflow-x-auto border border-neutral-300">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Gate Pass #</th>
                        <th className="py-2.5 px-3">Vehicle No</th>
                        <th className="py-2.5 px-3">Direction</th>
                        <th className="py-2.5 px-3">Material & Partner</th>
                        <th className="py-2.5 px-3">Driver / Transporter</th>
                        <th className="py-2.5 px-3">Stage</th>
                        <th className="py-2.5 px-3 text-right">Weight</th>
                        <th className="py-2.5 px-3 text-center">Deck</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-300">
                      {displayedQueue.map((v) => {
                        const isFirst = !v.grossWeightMT;
                        const isRM = v.direction === "INBOUND_RM";
                        const weighmentLabel = isRM
                          ? isFirst
                            ? "1st Gross (RM)"
                            : "2nd Tare (RM)"
                          : isFirst
                          ? "1st Tare (FG)"
                          : "2nd Gross (FG)";
                        const targetDeck = isRM ? "WB-01" : "WB-02";

                        return (
                          <tr key={v.id} className="hover:bg-neutral-200/40 transition-colors">
                            <td className="py-3 px-3 font-bold text-neutral-900 tabular-nums">
                              {v.gateEntryNo}
                              <div className="text-[10px] text-neutral-500 font-normal">
                                In: {v.arrivalTime}
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <span className="font-bold text-neutral-900 text-xs px-2 py-0.5 border border-neutral-300 bg-neutral-50 font-mono">
                                {v.vehicleNo}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 border uppercase ${
                                  v.direction === "INBOUND_RM"
                                    ? "border-emerald-300 bg-emerald-50 text-[#047857]"
                                    : "border-neutral-300 bg-[#18181B] text-white"
                                }`}
                              >
                                {v.direction === "INBOUND_RM" ? "Inbound RM" : "Outbound FG"}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-semibold text-neutral-900">{v.materialName}</div>
                              <div className="text-[11px] text-neutral-500 truncate max-w-[200px]">
                                {v.supplierOrCustomer}
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <div className="text-neutral-800">{v.driverName}</div>
                              <div className="text-[10px] text-neutral-500">{v.transporter}</div>
                            </td>

                            <td className="py-3 px-3">
                              <span
                                className={`px-1.5 py-0.5 text-[10px] font-bold uppercase border ${
                                  isFirst
                                    ? "bg-amber-50 text-amber-800 border-amber-300"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-300"
                                }`}
                              >
                                {weighmentLabel}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-right tabular-nums font-bold text-neutral-900">
                              {isFirst ? (
                                <span>
                                  {v.declaredWeightMT
                                    ? `${v.declaredWeightMT.toFixed(2)} MT`
                                    : "—"}
                                </span>
                              ) : (
                                <span className="text-[#059669]">
                                  {v.grossWeightMT
                                    ? `${v.grossWeightMT.toFixed(2)} MT`
                                    : "42.80 MT"}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3 text-center">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-neutral-800">
                                {targetDeck}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handlePositionAndWeigh(v)}
                                className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ml-auto"
                              >
                                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Weigh on {targetDeck}</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Weighment Capture Modal */}
      <WeighmentCaptureModal
        isOpen={isCaptureModalOpen}
        onClose={closeCaptureModal}
        initialVehicle={captureModalParams?.vehicle}
        initialType={captureModalParams?.weighmentType}
        initialPlatformId={captureModalParams?.platformId}
      />

      {/* Official Printable Weighbridge Slip Modal */}
      <WeighbridgeSlipModal
        isOpen={isSlipModalOpen}
        onClose={closeSlipModal}
        record={selectedSlipRecord}
      />
    </div>
  );
}
