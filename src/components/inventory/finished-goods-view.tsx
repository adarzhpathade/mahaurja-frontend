"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PackageCheck,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShoppingBag,
  Layers,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useInventory } from "@/lib/context/inventory-context";

export function FinishedGoodsView() {
  const { fgStock, metrics } = useInventory();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "QC_APPROVED" | "QC_PENDING">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredStock = fgStock.filter((item) => {
    const matchesStatus = statusFilter === "ALL" || item.qcStatus === statusFilter;
    const matchesSearch =
      item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productionBatchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storageBay.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Finished Goods Warehouse &amp; Stock
        </h1>
        <Link
          href="/inventory/packaging"
          className="h-10 px-4 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <span>Bagging &amp; Packaging</span>
        </Link>
      </div>

      {/* 4-KPI Status Classification Row (PDF Sec 24) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Total Produced Pellets
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900">
              {metrics.totalFgStockMT} MT
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-200">
              All Batches
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Approved &amp; Dispatchable
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-black text-2xl sm:text-3xl text-[#059669]">
              {metrics.dispatchableFgMT} MT
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-[#047857] border border-emerald-200">
              Ready for Orders
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Awaiting Final Lab QC
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900">
              {metrics.pendingQcFgMT} MT
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200">
              In Testing
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Allocated for Active Dispatches
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900">
              15.0 MT
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200">
              Reserved
            </span>
          </div>
        </div>
      </div>

      {/* Finished Goods Batches Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-neutral-800 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Finished Goods Batches
            </h2>
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {filteredStock.length}
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
                  placeholder="Search batch number, run ref, product, bay..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                onClick={() => setStatusFilter("ALL")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "ALL"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>All Batches</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "ALL"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {fgStock.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("QC_APPROVED")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "QC_APPROVED"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Dispatchable</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "QC_APPROVED"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {fgStock.filter((s) => s.qcStatus === "QC_APPROVED").length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("QC_PENDING")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "QC_PENDING"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>QC Pending</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "QC_PENDING"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {fgStock.filter((s) => s.qcStatus === "QC_PENDING").length}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Filter Sheet Modal */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:hidden">
              <div className="bg-white w-full border-t border-neutral-300 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">Filter Batches</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-xs font-bold text-neutral-500 hover:text-neutral-800"
                  >
                    Close ✕
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setStatusFilter("ALL"); setIsMobileFilterOpen(false); }}
                    className={`p-2.5 text-xs font-medium border text-center ${
                      statusFilter === "ALL" ? "border-neutral-900 bg-[#18181B] text-white font-bold" : "border-neutral-300 bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    All ({fgStock.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStatusFilter("QC_APPROVED"); setIsMobileFilterOpen(false); }}
                    className={`p-2.5 text-xs font-medium border text-center ${
                      statusFilter === "QC_APPROVED" ? "border-neutral-900 bg-[#18181B] text-white font-bold" : "border-neutral-300 bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    Dispatchable ({fgStock.filter((s) => s.qcStatus === "QC_APPROVED").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStatusFilter("QC_PENDING"); setIsMobileFilterOpen(false); }}
                    className={`p-2.5 text-xs font-medium border text-center ${
                      statusFilter === "QC_PENDING" ? "border-neutral-900 bg-[#18181B] text-white font-bold" : "border-neutral-300 bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    QC Pending ({fgStock.filter((s) => s.qcStatus === "QC_PENDING").length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredStock.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No finished goods batches match your search criteria.
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStock.map((item) => (
            <div
              key={item.batchNumber}
              className="border border-neutral-300 hover:border-neutral-900 bg-white/40 p-4 flex flex-col justify-between space-y-4 transition-all"
            >
              <div>
                <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Run Ref: {item.productionBatchNumber}
                    </span>
                    <h3 className="font-mono font-bold text-neutral-900 text-base">
                      {item.batchNumber}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                    item.qcStatus === "QC_APPROVED"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-blue-100 text-blue-800 border border-blue-300"
                  }`}>
                    {item.qcStatus === "QC_APPROVED" ? "Dispatchable" : "Awaiting Lab Release"}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-neutral-700">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Product:</span>
                    <span className="font-semibold text-neutral-900">{item.productName} ({item.diameterMm}mm)</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Produced Quantity:</span>
                    <span className="font-mono font-bold text-neutral-900">{item.producedQuantityMT} MT</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Packaging Mode:</span>
                    <span className="font-medium text-neutral-800">{item.packagingMode.replace("_", " ")}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Storage Bay:</span>
                    <span className="font-medium text-neutral-800">{item.storageBay}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">GCV Rating:</span>
                    <span className="font-mono font-semibold text-[#047857]">{item.gcvKcal} kcal/kg</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Available to Dispatch:</span>
                    <span className="font-mono font-bold text-neutral-900">
                      {item.qcStatus === "QC_APPROVED" ? `${item.dispatchableQuantityMT - item.allocatedQuantityMT} MT` : "0.0 MT"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-[10px] text-neutral-500 font-mono">
                  Mfg Date: {item.productionDate} {item.qcApprovalDate ? `· Approved ${item.qcApprovalDate}` : ""}
                </span>
                {item.qcStatus === "QC_APPROVED" ? (
                  <Link
                    href="/sales/dispatch"
                    className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Allocate Dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    href="/quality/fg-testing"
                    className="h-8 px-3 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>View in QC Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
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
                <th className="py-2.5 px-3">Batch Number</th>
                <th className="py-2.5 px-3">Production Run</th>
                <th className="py-2.5 px-3">Product Spec</th>
                <th className="py-2.5 px-3 font-mono">Produced Qty</th>
                <th className="py-2.5 px-3 font-mono">Available Dispatch</th>
                <th className="py-2.5 px-3">Packaging</th>
                <th className="py-2.5 px-3">Storage Bay</th>
                <th className="py-2.5 px-3">QC Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300">
              {filteredStock.map((item) => (
                <tr key={item.batchNumber} className="hover:bg-neutral-200/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">
                    {item.batchNumber}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-neutral-600">
                    {item.productionBatchNumber}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-neutral-900">
                    {item.productName}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">
                    {item.producedQuantityMT} MT
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#047857]">
                    {item.qcStatus === "QC_APPROVED" ? `${item.dispatchableQuantityMT - item.allocatedQuantityMT} MT` : "0.0 MT"}
                  </td>
                  <td className="py-2.5 px-3 text-neutral-700">
                    {item.packagingMode.replace("_", " ")}
                  </td>
                  <td className="py-2.5 px-3 text-neutral-700">
                    {item.storageBay}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                      item.qcStatus === "QC_APPROVED"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-blue-100 text-blue-800 border border-blue-300"
                    }`}>
                      {item.qcStatus === "QC_APPROVED" ? "Approved" : "Pending QC"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {item.qcStatus === "QC_APPROVED" ? (
                      <Link
                        href="/sales/dispatch"
                        className="h-7 px-2.5 bg-[#18181B] hover:bg-[#059669] text-white text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Dispatch</span>
                      </Link>
                    ) : (
                      <Link
                        href="/quality/fg-testing"
                        className="h-7 px-2.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                      >
                        <span>QC Test</span>
                      </Link>
                    )}
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
