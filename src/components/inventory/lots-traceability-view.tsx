"use client";

import React, { useState } from "react";
import {
  Layers,
  Search,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  GitFork,
  ArrowRight,
  ShieldCheck,
  Truck,
  Scale,
  FlaskConical,
} from "lucide-react";
import { useInventory } from "@/lib/context/inventory-context";

export function LotsTraceabilityView() {
  const { rmLots } = useInventory();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedLotForTrace, setSelectedLotForTrace] = useState<string | null>(null);

  const filteredLots = rmLots.filter((lot) => {
    const matchesStatus =
      statusFilter === "ALL" ? true : lot.status === statusFilter;
    if (!matchesStatus) return false;

    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      lot.lotId.toLowerCase().includes(q) ||
      lot.materialName.toLowerCase().includes(q) ||
      lot.supplierName.toLowerCase().includes(q) ||
      lot.vehicleNumber.toLowerCase().includes(q) ||
      lot.qcReportId.toLowerCase().includes(q)
    );
  });

  const activeLot = rmLots.find((l) => l.lotId === selectedLotForTrace) || rmLots[0];

  return (
    <div className="space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Raw Material Lot Traceability Ledger
        </h1>
      </div>

      {/* Digital Lineage Trace Visualizer (PDF Sec 8 & 34) */}
      {activeLot && (
        <div className="bg-neutral-900 text-white p-4 sm:p-5 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Interactive Lineage Trace: {activeLot.lotId}
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">
              Available: {activeLot.availableQuantityMT} MT in {activeLot.storageLocationName}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2 text-xs">
            <div className="bg-neutral-800/80 p-2.5 border border-neutral-700">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">1. Supplier</span>
              <span className="font-semibold text-white truncate block mt-0.5">{activeLot.supplierName}</span>
              <span className="text-[10px] text-neutral-400 font-mono block">{activeLot.supplierId}</span>
            </div>

            <div className="bg-neutral-800/80 p-2.5 border border-neutral-700">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">2. Inbound Gate</span>
              <span className="font-mono font-bold text-white block mt-0.5">{activeLot.vehicleNumber}</span>
              <span className="text-[10px] text-neutral-400 font-mono block">{activeLot.gatePassNumber}</span>
            </div>

            <div className="bg-neutral-800/80 p-2.5 border border-neutral-700">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">3. Weighbridge</span>
              <span className="font-mono font-bold text-emerald-400 block mt-0.5">{activeLot.initialQuantityMT} MT Net</span>
              <span className="text-[10px] text-neutral-400 font-mono block">{activeLot.weighbridgeSlipNumber}</span>
            </div>

            <div className="bg-neutral-800/80 p-2.5 border border-neutral-700">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">4. Laboratory QC</span>
              <span className="font-mono font-bold text-white block mt-0.5">{activeLot.qcReportId}</span>
              <span className="text-[10px] text-emerald-400 font-mono block">M:{activeLot.qcParameters.moisturePercent}% · A:{activeLot.qcParameters.ashPercent}%</span>
            </div>

            <div className="bg-neutral-800/80 p-2.5 border border-neutral-700">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">5. Valuation</span>
              <span className="font-mono font-bold text-white block mt-0.5">₹{activeLot.purchaseRatePerMT}/MT</span>
              <span className="text-[10px] text-neutral-400 font-mono block">Total: ₹{Math.round(activeLot.initialQuantityMT * activeLot.purchaseRatePerMT).toLocaleString("en-IN")}</span>
            </div>

            <div className="bg-emerald-950/60 p-2.5 border border-emerald-600">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">6. Current Lot</span>
              <span className="font-mono font-bold text-white block mt-0.5 truncate">{activeLot.lotId}</span>
              <span className="text-[10px] text-emerald-300 font-semibold block">{activeLot.status}</span>
            </div>
          </div>
        </div>
      )}

      {/* Lots Section */}
      <section className="space-y-4 pt-4 border-t border-neutral-300">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-800 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Raw Material Lots
            </h2>
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {filteredLots.length}
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
            {/* Search Input */}
            <div className="relative w-full flex-1 sm:max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search lot ID, material, supplier, vehicle, QC report..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center border border-neutral-300 divide-x divide-neutral-300 text-xs overflow-x-auto no-scrollbar shrink-0 h-10 bg-white">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "ALL"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>All Lots</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "ALL"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {rmLots.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("IN_STOCK")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "IN_STOCK"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>In Stock</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "IN_STOCK"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {rmLots.filter((l) => l.status === "IN_STOCK").length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("PARTIALLY_CONSUMED")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "PARTIALLY_CONSUMED"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Partial</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "PARTIALLY_CONSUMED"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {rmLots.filter((l) => l.status === "PARTIALLY_CONSUMED").length}
                </span>
              </button>
            </div>
          </div>

          {filteredLots.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No raw material lots match your search criteria.
            </div>
          ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLots.map((lot) => (
            <div
              key={lot.lotId}
              onClick={() => setSelectedLotForTrace(lot.lotId)}
              className={`border p-4 flex flex-col justify-between space-y-4 transition-all cursor-pointer ${
                selectedLotForTrace === lot.lotId
                  ? "border-[#059669] bg-white shadow-sm ring-1 ring-[#059669]"
                  : "border-neutral-300 bg-white/40 hover:border-neutral-900"
              }`}
            >
              <div>
                <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500">{lot.receivedDate}</span>
                    <h3 className="font-mono font-bold text-neutral-900 text-sm">{lot.lotId}</h3>
                  </div>
                  <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
                    {lot.status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-neutral-700">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Material:</span>
                    <span className="font-semibold text-neutral-900">{lot.materialName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Supplier:</span>
                    <span className="font-medium text-neutral-800 truncate max-w-[170px]">{lot.supplierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Vehicle / Gate:</span>
                    <span className="font-mono text-neutral-900 font-semibold">{lot.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Yard Location:</span>
                    <span className="font-medium text-neutral-800">{lot.storageLocationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Available Qty:</span>
                    <span className="font-mono font-bold text-[#047857]">{lot.availableQuantityMT} MT / {lot.initialQuantityMT} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Purchase Rate:</span>
                    <span className="font-mono text-neutral-800">₹{lot.purchaseRatePerMT} / MT</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                <span>QC: {lot.qcReportId} (M:{lot.qcParameters.moisturePercent}%)</span>
                <span className="text-neutral-900 font-bold">Inspect Trace &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Transparent Industrial Table */
        <div className="border border-neutral-300 overflow-x-auto bg-transparent">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Lot ID</th>
                <th className="py-2.5 px-3">Material</th>
                <th className="py-2.5 px-3">Supplier</th>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3 font-mono">Available MT</th>
                <th className="py-2.5 px-3">Storage Yard</th>
                <th className="py-2.5 px-3">QC Report</th>
                <th className="py-2.5 px-3 font-mono">Rate (₹/MT)</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300">
              {filteredLots.map((lot) => (
                <tr
                  key={lot.lotId}
                  onClick={() => setSelectedLotForTrace(lot.lotId)}
                  className={`hover:bg-neutral-200/40 transition-colors cursor-pointer ${
                    selectedLotForTrace === lot.lotId ? "bg-emerald-50/50" : ""
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">
                    {lot.lotId}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-neutral-900">
                    {lot.materialName}
                  </td>
                  <td className="py-2.5 px-3 text-neutral-700">
                    {lot.supplierName}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-neutral-800">
                    {lot.vehicleNumber}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#047857]">
                    {lot.availableQuantityMT} MT
                  </td>
                  <td className="py-2.5 px-3 text-neutral-700">
                    {lot.storageLocationName}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-neutral-600">
                    {lot.qcReportId}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-neutral-900">
                    ₹{lot.purchaseRatePerMT}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
                      {lot.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        </div>
      </section>
    </div>
  );
}
