"use client";

import React, { useState } from "react";
import { MobileFilterSheet } from "@/components/shared/mobile-filter-sheet";
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  LayoutGrid,
  Table as TableIcon,
  Printer,
  ExternalLink,
  ShieldCheck,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { useQuality } from "@/lib/context/quality-context";
import { CoaModal } from "./coa-modal";
import { CertificateOfAnalysis } from "@/lib/types/quality";

export function QcRecordsLedger() {
  const { rmSamples, fgSamples, coas, selectedCoa, setSelectedCoa } = useQuality();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "APPROVED" | "HOLD" | "REJECTED" | "RM" | "FG">("ALL");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [isCoaOpen, setIsCoaOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Combine RM and FG test records
  const allRecords = [
    ...rmSamples.map((s) => ({
      type: "RM" as const,
      id: s.id,
      refId: s.gatePassNumber,
      identifier: s.vehicleNumber,
      entityName: s.materialName,
      partner: s.supplierName,
      status: s.status,
      testedTime: s.testedTime || s.sampleTime,
      testedBy: s.testedBy || "Pending Analysis",
      parameters: s.parameters,
      remarks: s.remarks || s.quarantineReason || "Routine quality testing",
      hasCoa: false,
    })),
    ...fgSamples.map((b) => ({
      type: "FG" as const,
      id: b.id,
      refId: b.productionBatchNumber,
      identifier: b.batchNumber,
      entityName: b.productName,
      partner: `${b.quantityMT} MT · ${b.productionLine}`,
      status: b.status,
      testedTime: b.testedTime || b.productionDate,
      testedBy: b.testedBy || "Pending Analysis",
      parameters: b.parameters,
      remarks: b.remarks || "Finished pellet final testing",
      hasCoa: b.status === "APPROVED",
    })),
  ];

  const filteredRecords = allRecords.filter((r) => {
    // Type filter
    if (filterType === "APPROVED" && r.status !== "APPROVED") return false;
    if (filterType === "HOLD" && r.status !== "HOLD") return false;
    if (filterType === "REJECTED" && r.status !== "REJECTED") return false;
    if (filterType === "RM" && r.type !== "RM") return false;
    if (filterType === "FG" && r.type !== "FG") return false;

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.refId.toLowerCase().includes(q) ||
        r.identifier.toLowerCase().includes(q) ||
        r.entityName.toLowerCase().includes(q) ||
        r.partner.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenCoa = (fgQcId: string) => {
    const existing = coas.find((c) => c.fgQcId === fgQcId) || coas[0];
    if (existing) {
      setSelectedCoa(existing);
      setIsCoaOpen(true);
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 select-none">
      {/* ========================================================================= */}
      {/* 1. COMPACT COMMAND HEADER (with Count & Desktop View Toggle)              */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            QC Reports &amp; History
          </h1>
          <span className="text-[11px] font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
            {filteredRecords.length}
          </span>
        </div>

        {/* View Toggle */}
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
                placeholder="Search plate, batch, ID, supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className={`sm:hidden w-10 h-10 flex items-center justify-center border shrink-0 cursor-pointer relative transition-colors ${
                filterType !== "ALL"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              }`}
              title="Filter Options"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {filterType !== "ALL" && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#059669] rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>

          {/* Desktop Filter Tabs */}
          <div className="hidden sm:flex items-center border border-neutral-300 divide-x divide-neutral-300 text-xs overflow-x-auto no-scrollbar shrink-0 h-10 bg-white">
            {(["ALL", "APPROVED", "HOLD", "REJECTED"] as const).map((filter) => {
              const count =
                filter === "ALL"
                  ? allRecords.length
                  : allRecords.filter((r) => r.status === filter).length;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setFilterType(filter)}
                  className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    filterType === filter
                      ? "bg-[#18181B] text-white font-semibold"
                      : "bg-white text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span>{filter === "ALL" ? "All" : filter}</span>
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-bold ${
                      filterType === filter
                        ? "bg-[#059669] text-white"
                        : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Filter Sheet */}
        <MobileFilterSheet
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          title="Filter QC Records"
          selectedId={filterType}
          onSelect={(id) => setFilterType(id as typeof filterType)}
          options={[
            {
              id: "ALL",
              label: "All Records",
              count: allRecords.length,
              dotColor: "bg-neutral-400",
              selectedDotColor: "bg-white ring-2 ring-white/30",
            },
            {
              id: "APPROVED",
              label: "Approved",
              count: allRecords.filter((r) => r.status === "APPROVED").length,
              dotColor: "bg-[#059669]",
              selectedDotColor: "bg-[#10B981] ring-2 ring-[#10B981]/40",
            },
            {
              id: "HOLD",
              label: "Quarantine / Hold",
              count: allRecords.filter((r) => r.status === "HOLD").length,
              dotColor: "bg-amber-500",
              selectedDotColor: "bg-amber-400 ring-2 ring-amber-400/40",
            },
            {
              id: "REJECTED",
              label: "Rejected",
              count: allRecords.filter((r) => r.status === "REJECTED").length,
              dotColor: "bg-red-500",
              selectedDotColor: "bg-red-400 ring-2 ring-red-400/40",
            },
          ]}
        />

      {/* Main Records Display */}
      {/* 1. Cards View: Always on Mobile, respects viewMode on Desktop */}
      <div
        className={
          viewMode === "cards"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            : "grid grid-cols-1 sm:hidden gap-3"
        }
      >
        {filteredRecords.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500 font-mono col-span-full">
            No QC records found matching criteria.
          </div>
        ) : (
          filteredRecords.map((r) => (
            <div
              key={r.id}
              className="border border-neutral-300 hover:border-neutral-900 bg-white/60 p-4 flex flex-col justify-between space-y-3 transition-all"
            >
              <div>
                <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                  <div>
                    <div className="font-mono font-bold text-neutral-900 text-sm">{r.identifier}</div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{r.id} · {r.refId}</div>
                  </div>
                  {r.type === "RM" ? (
                    <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
                      Inbound RM
                    </span>
                  ) : (
                    <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5">
                      Outbound FG
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-neutral-700">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Material/Product:</span>
                    <span className="font-semibold text-neutral-900">{r.entityName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Supplier/Batch:</span>
                    <span className="font-medium text-neutral-800 truncate max-w-[200px]">{r.partner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Date/Time:</span>
                    <span className="font-mono text-neutral-700">{r.testedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Remarks:</span>
                    <span className="text-neutral-600 truncate max-w-[200px]">{r.remarks}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                    r.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : r.status === "HOLD"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : r.status === "REJECTED"
                      ? "bg-red-100 text-red-800 border border-red-300"
                      : "bg-neutral-200 text-neutral-700"
                  }`}>
                    {r.status}
                  </span>
                </div>

                {r.type === "FG" && r.status === "APPROVED" ? (
                  <button
                    type="button"
                    onClick={() => handleOpenCoa(r.id)}
                    className="h-10 sm:h-8 px-4 sm:px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View COA</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {r.type === "RM" ? "Signed Off" : "Test Complete"}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. Table View: Tablet/PC Only when viewMode === "table" */}
      {viewMode === "table" && (
        <div className="hidden sm:block border border-neutral-300 overflow-x-auto bg-transparent">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Direction</th>
                <th className="py-2.5 px-3">QC Test ID</th>
                <th className="py-2.5 px-3">Entity Identifier</th>
                <th className="py-2.5 px-3">Material / Product</th>
                <th className="py-2.5 px-3">Supplier / Batch Info</th>
                <th className="py-2.5 px-3">Date / Time</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Certificate / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-neutral-500">
                    No QC records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-200/40 transition-colors">
                    <td className="py-2.5 px-3">
                      {r.type === "RM" ? (
                        <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
                          Inbound RM
                        </span>
                      ) : (
                        <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5">
                          Outbound FG
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">
                      {r.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 font-mono font-bold text-xs bg-neutral-50 border border-neutral-300 text-neutral-900 inline-block">
                        {r.identifier}
                      </span>
                      <span className="block font-mono text-[10px] text-neutral-500 mt-0.5">
                        {r.refId}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-neutral-900">
                      {r.entityName}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700">
                      {r.partner}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-600">
                      {r.testedTime}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                        r.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : r.status === "HOLD"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : r.status === "REJECTED"
                          ? "bg-red-100 text-red-800 border border-red-300"
                          : "bg-neutral-200 text-neutral-700"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {r.type === "FG" && r.status === "APPROVED" ? (
                        <button
                          type="button"
                          onClick={() => handleOpenCoa(r.id)}
                          className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View COA</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-500 font-mono">
                          {r.type === "RM" ? "RM Quality Slip" : "Pending Approval"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      </div>

      {/* COA Printable Modal */}
      <CoaModal
        isOpen={isCoaOpen}
        onClose={() => setIsCoaOpen(false)}
        coa={selectedCoa}
      />
    </div>
  );
}
