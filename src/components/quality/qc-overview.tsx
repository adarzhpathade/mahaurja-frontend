"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  FileText,
  Truck,
  Layers,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useQuality } from "@/lib/context/quality-context";
import { RmQcSample, FgQcSample } from "@/lib/types/quality";

export function QcOverview() {
  const router = useRouter();
  const { rmSamples, fgSamples, metrics, setActiveRmSampleId, setActiveFgSampleId } = useQuality();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "TESTING">("ALL");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const pendingRm = rmSamples.filter((s) => s.status === "PENDING" || s.status === "TESTING");
  const pendingFg = fgSamples.filter((s) => s.status === "PENDING" || s.status === "TESTING");

  const filteredSamples = pendingRm.filter((sample) => {
    const matchesFilter = filterStatus === "ALL" || sample.status === filterStatus;
    const matchesSearch =
      sample.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.gatePassNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStartRmTest = (sampleId: string) => {
    setActiveRmSampleId(sampleId);
    router.push("/quality/rm-testing");
  };

  const handleStartFgTest = (sampleId: string) => {
    setActiveFgSampleId(sampleId);
    router.push("/quality/fg-testing");
  };

  return (
    <div className="w-full space-y-8 sm:space-y-10 select-none">
      {/* ========================================================================= */}
      {/* 1. COMPACT COMMAND HEADER (with Desktop Actions)                          */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Quality Control Overview
        </h1>
      </div>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME OPERATIONAL METRICS (4 CLICKABLE CARDS)                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Metric 1 */}
        <div
          onClick={() => router.push("/quality/rm-testing")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors">
            Pending RM
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {metrics.rmAwaitingQc}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Vehicles</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => router.push("/quality/fg-testing")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors">
            Pending FG
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {metrics.fgAwaitingQc}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Batches</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => router.push("/quality/reports")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors">
            Tested Today
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {metrics.testedTodayCount}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Tests</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => router.push("/quality/reports")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors">
            Pass Rate
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {metrics.passRatePercent}%
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Optimal</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. QUICK ACTION BUTTONS (Mobile View Only)                                */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-stretch gap-2.5 w-full sm:hidden">
        <Link
          href="/quality/reports"
          className="h-11 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full"
        >
          <FileText className="w-4 h-4 text-neutral-600" />
          <span>COA Reports</span>
        </Link>

        <Link
          href="/quality/fg-testing"
          className="h-11 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full"
        >
          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          <span>Test FG Pellets</span>
        </Link>

        <Link
          href="/quality/rm-testing"
          className="h-11 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs w-full"
        >
          <FlaskConical className="w-4 h-4" />
          <span>Test Inbound RM</span>
        </Link>
      </div>

      {/* Main Section 1: Inbound Raw Material Awaiting Sampling (PDF Sec 6) */}
      <section className="space-y-4 pt-3 sm:pt-6">
        {/* Section Heading */}
        <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-neutral-800 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Sampling Queue
            </h2>
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {filteredSamples.length}
            </span>
          </div>

          {/* View Mode Toggle (PC Only) */}
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
                  placeholder="Search sample, vehicle, supplier, material..."
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
                onClick={() => setFilterStatus("ALL")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === "ALL"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>All</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    filterStatus === "ALL"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {pendingRm.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("PENDING")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === "PENDING"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Pending</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    filterStatus === "PENDING"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {pendingRm.filter((s) => s.status === "PENDING").length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("TESTING")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === "TESTING"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>In Testing</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    filterStatus === "TESTING"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {pendingRm.filter((s) => s.status === "TESTING").length}
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
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setFilterStatus("ALL"); setIsMobileFilterOpen(false); }}
                    className={`p-2.5 text-xs font-medium border text-center ${
                      filterStatus === "ALL" ? "border-neutral-900 bg-[#18181B] text-white font-bold" : "border-neutral-300 bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    All ({pendingRm.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFilterStatus("PENDING"); setIsMobileFilterOpen(false); }}
                    className={`p-2.5 text-xs font-medium border text-center ${
                      filterStatus === "PENDING" ? "border-neutral-900 bg-[#18181B] text-white font-bold" : "border-neutral-300 bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    Pending ({pendingRm.filter((s) => s.status === "PENDING").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFilterStatus("TESTING"); setIsMobileFilterOpen(false); }}
                    className={`p-2.5 text-xs font-medium border text-center ${
                      filterStatus === "TESTING" ? "border-neutral-900 bg-[#18181B] text-white font-bold" : "border-neutral-300 bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    In Testing ({pendingRm.filter((s) => s.status === "TESTING").length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cards or Table */}
          {filteredSamples.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No samples match your filter criteria.
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredSamples.map((sample) => (
              <div
                key={sample.id}
                className="border border-neutral-300 hover:border-neutral-900 bg-white/40 p-4 flex flex-col justify-between space-y-3 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 pb-2 border-b border-neutral-200">
                    <div>
                      <div className="font-mono font-bold text-neutral-900 text-sm group-hover:text-[#059669] transition-colors">
                        {sample.vehicleNumber}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                        Sample ID: {sample.id} · {sample.gatePassNumber}
                      </div>
                    </div>
                    <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
                      Inbound RM
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-neutral-700">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Material:</span>
                      <span className="font-semibold text-neutral-900">{sample.materialName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Supplier:</span>
                      <span className="font-medium text-neutral-800 truncate max-w-[180px]">{sample.supplierName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Dump Location:</span>
                      <span className="font-medium text-neutral-800">{sample.unloadingLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Sample Time:</span>
                      <span className="font-mono text-neutral-700">{sample.sampleTime}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                    sample.status === "TESTING"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-neutral-200 text-neutral-700"
                  }`}>
                    {sample.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStartRmTest(sample.id)}
                    className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>{sample.status === "TESTING" ? "Continue Test" : "Test Sample"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* View Mode: Transparent Industrial Table */
          <div className="border border-neutral-300 overflow-x-auto bg-transparent">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Vehicle / Pass</th>
                  <th className="py-2.5 px-3">Sample ID</th>
                  <th className="py-2.5 px-3">Material</th>
                  <th className="py-2.5 px-3">Supplier</th>
                  <th className="py-2.5 px-3">Dump Location</th>
                  <th className="py-2.5 px-3">Sample Time</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {filteredSamples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-neutral-200/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 font-mono font-bold text-xs bg-neutral-50 border border-neutral-300 text-neutral-900 inline-block">
                        {sample.vehicleNumber}
                      </span>
                      <span className="block font-mono text-[10px] text-neutral-500 mt-0.5">
                        {sample.gatePassNumber}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-neutral-800">
                      {sample.id}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-neutral-900">
                      {sample.materialName}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700">
                      {sample.supplierName}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700">
                      {sample.unloadingLocation}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-600">
                      {sample.sampleTime}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                        sample.status === "TESTING"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-neutral-200 text-neutral-700"
                      }`}>
                        {sample.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleStartRmTest(sample.id)}
                        className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Test</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </section>

      {/* Main Section 2: Finished Goods Batches Awaiting Final QC (PDF Sec 22) */}
      <section className="space-y-3 pt-6 border-t border-neutral-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Finished Goods Batches Awaiting Release Test (8mm Pellets)
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-neutral-200 text-neutral-800">
              {pendingFg.length} Pending
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {pendingFg.map((batch) => (
            <div
              key={batch.id}
              className="border border-neutral-300 bg-white/40 p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                  <div>
                    <div className="font-mono font-bold text-neutral-900 text-sm">
                      {batch.batchNumber}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                      Production Batch: {batch.productionBatchNumber} · Line: {batch.productionLine}
                    </div>
                  </div>
                  <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5">
                    Finished Goods
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-700">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Product:</span>
                    <span className="font-semibold text-neutral-900">{batch.productName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Batch Quantity:</span>
                    <span className="font-mono font-bold text-neutral-900">{batch.quantityMT} MT</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Production Date:</span>
                    <span className="font-mono text-neutral-700">{batch.productionDate}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">QC Target:</span>
                    <span className="font-medium text-emerald-800">8mm Standard / GCV &gt; 4200</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200">
                  Awaiting Final Lab Release
                </span>
                <button
                  type="button"
                  onClick={() => handleStartFgTest(batch.id)}
                  className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Enter Lab Results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
