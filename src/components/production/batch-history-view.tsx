"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  LayoutGrid,
  Table as TableIcon,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useProduction } from "@/lib/context/production-context";

export function BatchHistoryView() {
  const { batches } = useProduction();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "APPROVED" | "HOLD" | "QC_PENDING">("ALL");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredBatches = batches.filter((b) => {
    const matchesFilter =
      filterStatus === "ALL" ||
      (filterStatus === "APPROVED" && b.qcStatus === "QC_APPROVED") ||
      (filterStatus === "HOLD" && b.qcStatus === "QC_HOLD") ||
      (filterStatus === "QC_PENDING" && b.qcStatus === "QC_PENDING");

    if (!matchesFilter) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      b.batchNumber.toLowerCase().includes(q) ||
      b.fgBatchNumber.toLowerCase().includes(q) ||
      b.productName.toLowerCase().includes(q) ||
      b.formulaUsed.toLowerCase().includes(q) ||
      b.operatorName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Batch Run History
        </h1>
      </div>

      {/* 2. HISTORICAL BATCH RUNS SECTION */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#059669] shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Batch Production Runs
            </h2>
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {filteredBatches.length}
            </span>
          </div>

          {/* Desktop Dual View */}
          <div className="hidden sm:inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === "cards"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === "table"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Content container - borderless on mobile, bordered on PC */}
        <div className="border-0 p-0 bg-transparent sm:border sm:border-neutral-300 sm:p-6 sm:bg-white/30 space-y-4 sm:space-y-5">
          {/* Subheader & Search / Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-neutral-300">
            {/* Search Input with Mobile Filter Button */}
            <div className="flex items-center gap-2 flex-1 sm:max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search PB or FG batch, formula, operator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="sm:hidden w-10 h-10 flex items-center justify-center border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 shrink-0 cursor-pointer"
                title="Filter Options"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop Filter Tabs */}
            <div className="hidden sm:flex items-center border border-neutral-300 divide-x divide-neutral-300 text-xs overflow-x-auto no-scrollbar shrink-0 h-10 bg-white">
              <button
                type="button"
                onClick={() => setFilterStatus("ALL")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === "ALL"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>All Batches</span>
                <span className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  filterStatus === "ALL" ? "bg-[#059669] text-white" : "bg-neutral-200 text-neutral-700"
                }`}>
                  {batches.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("APPROVED")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === "APPROVED"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Approved</span>
                <span className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  filterStatus === "APPROVED" ? "bg-[#059669] text-white" : "bg-neutral-200 text-neutral-700"
                }`}>
                  {batches.filter((b) => b.qcStatus === "QC_APPROVED").length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("QC_PENDING")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === "QC_PENDING"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Pending QC</span>
                <span className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  filterStatus === "QC_PENDING" ? "bg-[#059669] text-white" : "bg-neutral-200 text-neutral-700"
                }`}>
                  {batches.filter((b) => b.qcStatus === "QC_PENDING").length}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Filter Sheet Modal */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:hidden">
              <div className="bg-white w-full border-t border-neutral-300 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">Filter Options</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-xs font-bold text-neutral-500 hover:text-neutral-800"
                  >
                    Close ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setFilterStatus("ALL"); setIsMobileFilterOpen(false); }}
                    className={`p-2.5 text-xs font-medium border text-center ${
                      filterStatus === "ALL" ? "border-neutral-900 bg-[#18181B] text-white font-bold" : "border-neutral-300 bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    All Batches ({batches.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFilterStatus("APPROVED"); setIsMobileFilterOpen(false); }}
                    className={`p-2.5 text-xs font-medium border text-center ${
                      filterStatus === "APPROVED" ? "border-neutral-900 bg-[#18181B] text-white font-bold" : "border-neutral-300 bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    Approved ({batches.filter((b) => b.qcStatus === "QC_APPROVED").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFilterStatus("QC_PENDING"); setIsMobileFilterOpen(false); }}
                    className={`p-2.5 text-xs font-medium border text-center ${
                      filterStatus === "QC_PENDING" ? "border-neutral-900 bg-[#18181B] text-white font-bold" : "border-neutral-300 bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    Pending QC ({batches.filter((b) => b.qcStatus === "QC_PENDING").length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredBatches.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No production runs match your search criteria.
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBatches.map((batch) => (
                <div
                  key={batch.batchNumber}
                  className="border border-neutral-300 hover:border-neutral-900 bg-white/40 p-4 flex flex-col justify-between space-y-4 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500">
                          {batch.productionDate} · {batch.shift} · {batch.lineName}
                        </span>
                        <h3 className="font-mono font-bold text-neutral-900 text-base">
                          {batch.batchNumber} &rarr; {batch.fgBatchNumber}
                        </h3>
                      </div>
                      <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
                        {batch.qcStatus.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs text-neutral-700">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Product:</span>
                        <span className="font-semibold text-neutral-900">{batch.productName} ({batch.pelletDiameterMm}mm)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Recipe Formula:</span>
                        <span className="font-medium text-neutral-800 truncate max-w-[200px]">{batch.formulaUsed}</span>
                      </div>

                      {/* Mass Balance & Net Yield Box */}
                      <div className="p-3 bg-neutral-100 border border-neutral-200 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Input Biomass</span>
                          <span className="font-mono font-black text-neutral-900 text-sm">{batch.totalInputMT} MT</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Good Pellets</span>
                          <span className="font-mono font-black text-[#059669] text-sm">{batch.goodProductionMT} MT</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Net Conversion</span>
                          <span className="font-mono font-black text-[#047857] text-sm">{batch.netYieldPercent}%</span>
                        </div>
                      </div>

                      {/* Consumed Lots */}
                      <div>
                        <span className="text-[10px] font-semibold text-neutral-500 block mb-1">Consumed Raw Material Lots:</span>
                        <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                          {batch.consumedRmLots.map((lot) => (
                            <span key={lot} className="px-1.5 py-0.5 bg-white border border-neutral-300 text-neutral-800">
                              {lot}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Downtime */}
                      <div className="flex justify-between text-[11px] pt-1">
                        <span className="text-neutral-500">Shift Downtime:</span>
                        <span className="font-mono text-neutral-800">{batch.downtimeMinutes} min ({batch.downtimeReason || "Zero"})</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span>Operator: {batch.operatorName}</span>
                    <Link
                      href="/quality/fg-testing"
                      className="font-bold text-neutral-900 hover:text-[#059669] transition-colors"
                    >
                      View QC Release &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Transparent Table */
            <div className="border border-neutral-300 overflow-x-auto bg-transparent">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Production Batch</th>
                    <th className="py-2.5 px-3">FG Batch Number</th>
                    <th className="py-2.5 px-3 font-mono">Input MT</th>
                    <th className="py-2.5 px-3 font-mono">Good Output MT</th>
                    <th className="py-2.5 px-3 font-mono">Yield %</th>
                    <th className="py-2.5 px-3">Consumed RM Lots</th>
                    <th className="py-2.5 px-3 font-mono">Downtime</th>
                    <th className="py-2.5 px-3">Operator</th>
                    <th className="py-2.5 px-3 text-right">QC Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300">
                  {filteredBatches.map((batch) => (
                    <tr key={batch.batchNumber} className="hover:bg-neutral-200/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{batch.batchNumber}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-neutral-800">{batch.fgBatchNumber}</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-700">{batch.totalInputMT} MT</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#047857]">{batch.goodProductionMT} MT</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{batch.netYieldPercent}%</td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-neutral-700">{batch.consumedRmLots.join(", ")}</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-700">{batch.downtimeMinutes} min</td>
                      <td className="py-2.5 px-3 text-neutral-700">{batch.operatorName}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
                          {batch.qcStatus.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
