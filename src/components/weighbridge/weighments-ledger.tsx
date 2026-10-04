"use client";

import React, { useState } from "react";
import { MobileFilterSheet } from "@/components/shared/mobile-filter-sheet";
import {
  Search,
  Printer,
  Eye,
  LayoutGrid,
  Table as TableIcon,
  SlidersHorizontal,
} from "lucide-react";
import { useWeighbridge } from "@/lib/context/weighbridge-context";
import { WeighbridgeSlipModal } from "./weighbridge-slip-modal";

export function WeighmentsLedger() {
  const { records, openSlipModal, isSlipModalOpen, selectedSlipRecord, closeSlipModal } =
    useWeighbridge();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDirection, setFilterDirection] = useState<"ALL" | "INBOUND_RM" | "OUTBOUND_DISPATCH">("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "COMPLETED" | "PENDING_SECOND_WEIGHMENT">("ALL");
  const [viewMode, setViewMode] = useState<"CARDS" | "TABLE">("CARDS");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredRecords = records.filter((r) => {
    if (filterDirection !== "ALL" && r.direction !== filterDirection) return false;
    if (filterStatus !== "ALL" && r.status !== filterStatus) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.slipNo.toLowerCase().includes(q) ||
      r.vehicleNo.toLowerCase().includes(q) ||
      r.materialName.toLowerCase().includes(q) ||
      r.supplierOrCustomer.toLowerCase().includes(q) ||
      r.gateEntryNo.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* ========================================================================= */}
      {/* 1. COMPACT COMMAND HEADER (with Count, Print & Desktop View Toggle)       */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Weight Records
          </h1>
          <span className="text-[11px] font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
            {filteredRecords.length}
          </span>
        </div>

        {/* Desktop Controls: Action Button + Dual View Toggle */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-10 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-neutral-600" />
            <span>Print Ledger</span>
          </button>

          {/* Desktop Dual View Toggle */}
          <div className="inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
            <button
              type="button"
              onClick={() => setViewMode("CARDS")}
              className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === "CARDS"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("TABLE")}
              className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === "TABLE"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MOBILE ACTION STACK (Gate UI Pattern) */}
      <div className="sm:hidden flex flex-col items-stretch gap-2.5 w-full">
        <button
          type="button"
          onClick={() => window.print()}
          className="h-11 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full"
        >
          <Printer className="w-4 h-4 text-neutral-600" />
          <span>Print Ledger</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT (ZERO DUPLICATE SUBHEADING BAR)                           */}
      {/* ========================================================================= */}
      <div className="border-0 p-0 bg-transparent sm:border sm:border-neutral-300 sm:p-6 sm:bg-white/30 space-y-4 sm:space-y-5">
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-neutral-300">
          {/* Search Input with Mobile Filter Square */}
          <div className="flex items-center gap-2 flex-1 sm:max-w-md">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search slip, vehicle, partner, material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className={`sm:hidden w-10 h-10 flex items-center justify-center border shrink-0 cursor-pointer relative transition-colors ${
                filterDirection !== "ALL"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              }`}
              title="Filter Options"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {filterDirection !== "ALL" && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#059669] rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>

          {/* Desktop Filter Tabs */}
          <div className="hidden sm:flex items-center border border-neutral-300 divide-x divide-neutral-300 text-xs overflow-x-auto no-scrollbar shrink-0 h-10 bg-white">
            <button
              type="button"
              onClick={() => setFilterDirection("ALL")}
              className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterDirection === "ALL"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span>All</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  filterDirection === "ALL"
                    ? "bg-[#059669] text-white"
                    : "bg-neutral-200 text-neutral-700"
                }`}
              >
                {records.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFilterDirection("INBOUND_RM")}
              className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterDirection === "INBOUND_RM"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span>RM Inbound</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  filterDirection === "INBOUND_RM"
                    ? "bg-[#059669] text-white"
                    : "bg-neutral-200 text-neutral-700"
                }`}
              >
                {records.filter((r) => r.direction === "INBOUND_RM").length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFilterDirection("OUTBOUND_DISPATCH")}
              className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterDirection === "OUTBOUND_DISPATCH"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span>FG Outbound</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  filterDirection === "OUTBOUND_DISPATCH"
                    ? "bg-[#059669] text-white"
                    : "bg-neutral-200 text-neutral-700"
                }`}
              >
                {records.filter((r) => r.direction === "OUTBOUND_DISPATCH").length}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Filter Sheet */}
        <MobileFilterSheet
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          title="Filter Weighments"
          selectedId={filterDirection}
          onSelect={(id) => setFilterDirection(id as typeof filterDirection)}
          options={[
            {
              id: "ALL",
              label: "All Direction Slips",
              count: records.length,
              dotColor: "bg-neutral-400",
              selectedDotColor: "bg-white ring-2 ring-white/30",
            },
            {
              id: "INBOUND_RM",
              label: "RM Inbound Gross/Tare",
              count: records.filter((r) => r.direction === "INBOUND_RM").length,
              dotColor: "bg-[#059669]",
              selectedDotColor: "bg-[#10B981] ring-2 ring-[#10B981]/40",
            },
            {
              id: "OUTBOUND_DISPATCH",
              label: "FG Outbound Tare/Gross",
              count: records.filter((r) => r.direction === "OUTBOUND_DISPATCH").length,
              dotColor: "bg-blue-500",
              selectedDotColor: "bg-sky-400 ring-2 ring-sky-400/40",
            },
          ]}
        />

        {/* Content: Cards Grid (Always on Mobile, or PC when Cards selected) or Table (PC only) */}
        {filteredRecords.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500 font-mono">
            No weight records found matching current filters.
          </div>
        ) : (
          <>
            {/* Cards View: Always on Mobile, respects viewMode on Desktop */}
            <div
              className={
                viewMode === "CARDS"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                  : "grid grid-cols-1 sm:hidden gap-3"
              }
            >
              {filteredRecords.map((r) => (
                <div
                  key={r.id}
                  className="border border-neutral-300 hover:border-neutral-900 bg-white/40 p-3.5 flex flex-col justify-between space-y-3 transition-all group"
                >
                  {/* Top: Slip + Status */}
                  <div className="flex items-start justify-between gap-1 pb-2 border-b border-neutral-200">
                    <div>
                      <span className="font-mono font-bold text-xs text-neutral-900 block">
                        {r.slipNo}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        Pass: {r.gateEntryNo}
                      </span>
                    </div>

                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold uppercase border ${
                        r.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      {r.status === "COMPLETED" ? "RECONCILED" : "WAITING TARE"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-neutral-900 group-hover:text-[#059669] transition-colors">
                        {r.vehicleNo}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 border uppercase ${
                          r.direction === "INBOUND_RM"
                            ? "border-emerald-300 bg-emerald-50 text-[#047857]"
                            : "border-neutral-300 bg-[#18181B] text-white"
                        }`}
                      >
                        {r.direction === "INBOUND_RM" ? "RM" : "FG"}
                      </span>
                    </div>

                    <div className="font-semibold text-neutral-800">{r.materialName}</div>
                    <div className="text-[11px] text-neutral-600 truncate">
                      {r.supplierOrCustomer} · {r.driverName}
                    </div>

                    {/* Weight Breakdown */}
                    <div className="grid grid-cols-3 gap-1 bg-neutral-100/70 border border-neutral-200 p-2 text-center font-mono">
                      <div>
                        <span className="text-[9px] text-neutral-400 block uppercase">Gross</span>
                        <strong className="text-xs text-neutral-800">{r.grossWeightMT.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-400 block uppercase">Tare</span>
                        <strong className="text-xs text-neutral-800">
                          {r.tareWeightMT !== undefined ? r.tareWeightMT.toFixed(2) : "—"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-emerald-600 block uppercase font-bold">Net</span>
                        <strong className="text-xs text-[#059669]">
                          {r.netWeightMT !== undefined ? `${r.netWeightMT.toFixed(2)}` : "—"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => openSlipModal(r)}
                      className="h-8 px-3 text-xs font-bold uppercase tracking-wider bg-[#18181B] hover:bg-[#059669] text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Official Slip</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Table View: PC Only when viewMode === "TABLE" (NO white bg) */}
            {viewMode === "TABLE" && (
              <div className="hidden sm:block overflow-x-auto border border-neutral-300 bg-transparent">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Slip & Pass</th>
                      <th className="py-2.5 px-3">Vehicle No</th>
                      <th className="py-2.5 px-3">Direction</th>
                      <th className="py-2.5 px-3">Material & Partner</th>
                      <th className="py-2.5 px-3 font-mono text-right">Gross (MT)</th>
                      <th className="py-2.5 px-3 font-mono text-right">Tare (MT)</th>
                      <th className="py-2.5 px-3 font-mono text-right text-emerald-800">Net (MT)</th>
                      <th className="py-2.5 px-3 font-mono text-right">Variance</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-300">
                    {filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-neutral-200/40 transition-colors">
                        <td className="py-3 px-3 font-mono">
                          <div className="font-bold text-neutral-900">{r.slipNo}</div>
                          <div className="text-[10px] text-neutral-500">{r.gateEntryNo}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 font-mono font-bold text-sm bg-neutral-50 border border-neutral-300 text-neutral-900 inline-block">
                            {r.vehicleNo}
                          </span>
                          <div className="text-[11px] text-neutral-500 mt-0.5">{r.driverName}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                              r.direction === "INBOUND_RM"
                                ? "border-emerald-300 bg-emerald-50 text-[#047857]"
                                : "border-neutral-300 bg-[#18181B] text-white"
                            }`}
                          >
                            {r.direction === "INBOUND_RM" ? "Inbound RM" : "Outbound FG"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-neutral-900">{r.materialName}</div>
                          <div className="text-[11px] text-neutral-500 truncate max-w-[200px]">
                            {r.supplierOrCustomer}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-right text-neutral-800">
                          {r.grossWeightMT.toFixed(2)} MT
                        </td>
                        <td className="py-3 px-3 font-mono text-right text-neutral-800">
                          {r.tareWeightMT !== undefined ? `${r.tareWeightMT.toFixed(2)} MT` : "—"}
                        </td>
                        <td className="py-3 px-3 font-mono text-right font-black text-emerald-800 text-sm">
                          {r.netWeightMT !== undefined ? `${r.netWeightMT.toFixed(2)} MT` : "PENDING"}
                        </td>
                        <td className="py-3 px-3 font-mono text-right text-neutral-600">
                          {r.varianceMT !== undefined
                            ? `${r.varianceMT >= 0 ? "+" : ""}${r.varianceMT.toFixed(2)}`
                            : "—"}
                        </td>
                        <td className="py-3 text-center">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                              r.status === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : "bg-amber-50 text-amber-800 border-amber-300"
                            }`}
                          >
                            {r.status === "COMPLETED" ? "RECONCILED" : "PENDING TARE"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => openSlipModal(r)}
                            className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Slip</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <WeighbridgeSlipModal
        isOpen={isSlipModalOpen}
        onClose={closeSlipModal}
        record={selectedSlipRecord}
      />
    </div>
  );
}

export const WeightRecordsPage = WeighmentsLedger;
export default WeighmentsLedger;
