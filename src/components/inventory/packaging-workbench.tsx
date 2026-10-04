"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  CheckCircle2,
  Package,
  Layers,
  Calendar,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  Search,
} from "lucide-react";
import { useInventory } from "@/lib/context/inventory-context";
import { PackagingRecord } from "@/lib/types/inventory";

export function PackagingWorkbench() {
  const { fgStock, packagingRecords, addPackagingRecord } = useInventory();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = packagingRecords.filter((rec) => {
    return (
      rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.packagingType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.storageBay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.operatorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const approvedBatches = fgStock.filter((b) => b.qcStatus === "QC_APPROVED");

  // Form State
  const [selectedBatch, setSelectedBatch] = useState<string>(
    approvedBatches[0]?.batchNumber || "FG-BATCH-261003-009"
  );
  const [packagingType, setPackagingType] = useState<
    "BAGGED_50KG" | "BAGGED_40KG" | "BAGGED_25KG" | "BULK_LOOSE"
  >("BAGGED_50KG");
  const [totalQuantityMT, setTotalQuantityMT] = useState<number>(20.0);
  const [packagingMaterial, setPackagingMaterial] = useState<string>(
    "Woven HDPE Laminated 50kg Bags with Mahaurja Logo"
  );
  const [storageBay, setStorageBay] = useState<string>("FG Shed Bay 01 — Bagged Stacking Zone");
  const [operatorName, setOperatorName] = useState<string>("Santosh Ghadge");
  const [remarks, setRemarks] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-calculate bag count
  const bagWeightKg =
    packagingType === "BAGGED_50KG" ? 50 : packagingType === "BAGGED_40KG" ? 40 : packagingType === "BAGGED_25KG" ? 25 : 0;
  const calculatedBags = bagWeightKg > 0 ? Math.round((totalQuantityMT * 1000) / bagWeightKg) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addPackagingRecord({
      batchNumber: selectedBatch,
      packagingType,
      numberOfBags: bagWeightKg > 0 ? calculatedBags : undefined,
      bagWeightKg: bagWeightKg > 0 ? bagWeightKg : undefined,
      totalQuantityMT,
      packagingMaterialUsed: packagingMaterial,
      operatorName,
      packagingDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) + `, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      storageBay,
      remarks,
    });

    setSuccessMsg(`Packaging logged successfully: ${totalQuantityMT} MT bagged from ${selectedBatch}.`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-300 pb-4 sm:pb-5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Packaging &amp; Bagging
          </h1>
          <span className="text-xs sm:text-sm font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
            {filteredRecords.length}
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

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Primary Data Entry: Desktop Zero-Scroll (< 650px) */}
      <form onSubmit={handleSubmit} className="bg-transparent border-0 p-0 sm:border sm:border-neutral-300 sm:p-5 sm:bg-white space-y-5">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#059669]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Log New Bagging or Bulk Loading Run
          </h2>
        </div>

        {/* 3-Column Field Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Batch Selection */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Finished Goods Batch (QC Approved)
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-bold font-mono text-neutral-900 focus:outline-none focus:border-[#059669]"
            >
              {approvedBatches.map((b) => (
                <option key={b.batchNumber} value={b.batchNumber}>
                  {b.batchNumber} ({b.producedQuantityMT} MT · {b.productName})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-neutral-500 mt-1">Only laboratory approved batches can be packaged</p>
          </div>

          {/* 2. Packaging Mode */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Packaging Format (Option A / Option B)
            </label>
            <select
              value={packagingType}
              onChange={(e) => setPackagingType(e.target.value as any)}
              className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#059669]"
            >
              <option value="BAGGED_50KG">Option A — 50 kg Bagged (Standard)</option>
              <option value="BAGGED_40KG">Option A — 40 kg Bagged</option>
              <option value="BAGGED_25KG">Option A — 25 kg Bagged</option>
              <option value="BULK_LOOSE">Option B — Bulk / Loose Vehicle Loading</option>
            </select>
            <p className="text-[10px] text-neutral-500 mt-1">Supports individual bagging or direct bulk transport</p>
          </div>

          {/* 3. Total Quantity */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Total Quantity Packaged (MT)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={totalQuantityMT}
                onChange={(e) => setTotalQuantityMT(parseFloat(e.target.value) || 0)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                required
              />
              <span className="text-xs font-mono text-neutral-500">MT</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              {bagWeightKg > 0 ? (
                <>Equivalent to <strong className="text-neutral-900 font-mono">{calculatedBags} bags</strong> of {bagWeightKg} kg</>
              ) : (
                "Direct vehicle chute loading without individual bags"
              )}
            </p>
          </div>

          {/* 4. Packaging Material */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Packaging Material Specification
            </label>
            <input
              type="text"
              value={packagingMaterial}
              onChange={(e) => setPackagingMaterial(e.target.value)}
              className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
              required
            />
          </div>

          {/* 5. Storage Location */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Storage Bay / Stacking Zone
            </label>
            <input
              type="text"
              value={storageBay}
              onChange={(e) => setStorageBay(e.target.value)}
              className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
              required
            />
          </div>

          {/* 6. Operator Name */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Bagging Machine Operator
            </label>
            <input
              type="text"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
              required
            />
          </div>
        </div>

        {/* Remarks */}
        <div className="pt-2">
          <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
            Packaging Remarks &amp; Pallet Numbers
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Pallets 101-120 stretch-wrapped with moisture protective foil."
            className="w-full min-h-[48px] p-3 text-xs leading-relaxed bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] resize-none"
          />
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-neutral-600">
            Stock will be updated immediately in Finished Goods warehouse inventory.
          </div>
          <button
            type="submit"
            className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Record Packaging Transaction &rarr;</span>
          </button>
        </div>
      </form>

      {/* Packaging Records History Ledger */}
      <section className="space-y-4 pt-6 border-t border-neutral-300">
        <div className="flex items-center gap-2 border-b border-neutral-300 pb-2.5">
          <ShoppingBag className="w-4 h-4 text-[#059669] shrink-0" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Bagging &amp; Packaging Runs History
          </h2>
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
                placeholder="Search run ID, batch number, bay, operator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center border border-neutral-300 divide-x divide-neutral-300 text-xs overflow-x-auto no-scrollbar shrink-0 h-10 bg-white">
              <button
                type="button"
                className="h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 bg-[#18181B] text-white font-semibold"
              >
                <span>All Runs</span>
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#059669] text-white">
                  {packagingRecords.length}
                </span>
              </button>
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No packaging runs match your search criteria.
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.map((pkg) => (
                <div
                  key={pkg.id}
                  className="border border-neutral-300 bg-white/40 p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500">{pkg.id}</span>
                        <h3 className="font-mono font-bold text-neutral-900 text-sm">{pkg.batchNumber}</h3>
                      </div>
                      <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5">
                        {pkg.packagingType.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-neutral-700">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Packaged Qty:</span>
                        <span className="font-mono font-bold text-neutral-900">{pkg.totalQuantityMT} MT</span>
                      </div>
                      {pkg.numberOfBags && (
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Bag Count:</span>
                          <span className="font-mono text-neutral-900 font-semibold">{pkg.numberOfBags} Bags</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Storage Zone:</span>
                        <span className="font-medium text-neutral-800">{pkg.storageBay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Operator:</span>
                        <span className="font-medium text-neutral-800">{pkg.operatorName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 text-[10px] text-neutral-500 font-mono flex justify-between">
                    <span>{pkg.packagingDate}</span>
                    <span className="text-emerald-700 font-bold">Stored</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Mobile Cards Fallback */}
              <div className="grid grid-cols-1 sm:hidden gap-4">
                {filteredRecords.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="border border-neutral-300 bg-white/40 p-4 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                        <div>
                          <span className="text-[10px] font-mono text-neutral-500">{pkg.id}</span>
                          <h3 className="font-mono font-bold text-neutral-900 text-sm">{pkg.batchNumber}</h3>
                        </div>
                        <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5">
                          {pkg.packagingType.replace("_", " ")}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-neutral-700">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Packaged Qty:</span>
                          <span className="font-mono font-bold text-neutral-900">{pkg.totalQuantityMT} MT</span>
                        </div>
                        {pkg.numberOfBags && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Bag Count:</span>
                            <span className="font-mono text-neutral-900 font-semibold">{pkg.numberOfBags} Bags</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Storage Zone:</span>
                          <span className="font-medium text-neutral-800">{pkg.storageBay}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Operator:</span>
                          <span className="font-medium text-neutral-800">{pkg.operatorName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-200 text-[10px] text-neutral-500 font-mono flex justify-between">
                      <span>{pkg.packagingDate}</span>
                      <span className="text-emerald-700 font-bold">Stored</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Transparent Table */}
              <div className="hidden sm:block border border-neutral-300 overflow-x-auto bg-transparent">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Run ID</th>
                      <th className="py-2.5 px-3">FG Batch</th>
                      <th className="py-2.5 px-3">Packaging Type</th>
                      <th className="py-2.5 px-3 font-mono">Total MT</th>
                      <th className="py-2.5 px-3 font-mono">Bags</th>
                      <th className="py-2.5 px-3">Storage Bay</th>
                      <th className="py-2.5 px-3">Operator</th>
                      <th className="py-2.5 px-3 text-right">Date / Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-300">
                    {filteredRecords.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-neutral-200/40 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{pkg.id}</td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-neutral-800">{pkg.batchNumber}</td>
                        <td className="py-2.5 px-3 text-neutral-800">{pkg.packagingType.replace("_", " ")}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{pkg.totalQuantityMT} MT</td>
                        <td className="py-2.5 px-3 font-mono text-neutral-700">{pkg.numberOfBags || "—"}</td>
                        <td className="py-2.5 px-3 text-neutral-700">{pkg.storageBay}</td>
                        <td className="py-2.5 px-3 text-neutral-700">{pkg.operatorName}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-neutral-600">{pkg.packagingDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
