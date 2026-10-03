"use client";

import React, { useState } from "react";
import {
  Scale,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Printer,
} from "lucide-react";
import { useWeighbridge } from "@/lib/context/weighbridge-context";
import { WeighbridgeSlipModal } from "@/components/weighbridge/weighbridge-slip-modal";

export default function WeighmentsLedgerPage() {
  const { records, openSlipModal, isSlipModalOpen, selectedSlipRecord, closeSlipModal } =
    useWeighbridge();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDirection, setFilterDirection] = useState<"ALL" | "INBOUND_RM" | "OUTBOUND_DISPATCH">("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "COMPLETED" | "PENDING_SECOND_WEIGHMENT">("ALL");

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
    <div className="space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div className="bg-white border border-neutral-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#059669]" />
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-neutral-500">
              Audit Registry
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Official Weighments Master Ledger
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Complete digital ledger of gross weighments, tare reconciliations, and net tonnage certified by legal metrology.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 flex items-center gap-1.5 cursor-pointer"
            style={{ borderRadius: 0 }}
          >
            <Printer className="w-3.5 h-3.5 text-neutral-600" />
            <span>Print Ledger</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-neutral-300 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search slip no, vehicle, partner, gate pass..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 sm:h-10 pl-9.5 pr-3 text-sm bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
              style={{ borderRadius: 0 }}
            />
          </div>

          {/* Direction Filter */}
          <div className="sm:col-span-3">
            <select
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-neutral-900"
              style={{ borderRadius: 0 }}
            >
              <option value="ALL">All Directions</option>
              <option value="INBOUND_RM">Inbound Raw Material</option>
              <option value="OUTBOUND_DISPATCH">Outbound Dispatch</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-neutral-900"
              style={{ borderRadius: 0 }}
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed (Net Slip Issued)</option>
              <option value="PENDING_SECOND_WEIGHMENT">Pending 2nd Weighment</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto border border-neutral-300">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] text-neutral-700 font-semibold border-b border-neutral-300">
                <th className="p-3">Slip & Pass</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Direction</th>
                <th className="p-3">Commodity & Partner</th>
                <th className="p-3 font-mono text-right">Gross (MT)</th>
                <th className="p-3 font-mono text-right">Tare (MT)</th>
                <th className="p-3 font-mono text-right text-emerald-800">Net (MT)</th>
                <th className="p-3 font-mono text-right">Variance</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-3 font-mono">
                    <div className="font-bold text-neutral-900">{r.slipNo}</div>
                    <div className="text-[10px] text-neutral-500">{r.gateEntryNo}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-mono font-bold text-neutral-900">{r.vehicleNo}</div>
                    <div className="text-[11px] text-neutral-500">{r.driverName}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                        r.direction === "INBOUND_RM"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : "bg-purple-50 text-purple-800 border-purple-200"
                      }`}
                    >
                      {r.direction === "INBOUND_RM" ? "Inbound RM" : "Outbound FG"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-neutral-900">{r.materialName}</div>
                    <div className="text-[11px] text-neutral-500 truncate max-w-[200px]">
                      {r.supplierOrCustomer}
                    </div>
                  </td>
                  <td className="p-3 font-mono text-right text-neutral-800">
                    {r.grossWeightMT.toFixed(2)} MT
                  </td>
                  <td className="p-3 font-mono text-right text-neutral-800">
                    {r.tareWeightMT !== undefined ? `${r.tareWeightMT.toFixed(2)} MT` : "—"}
                  </td>
                  <td className="p-3 font-mono text-right font-black text-emerald-700 text-sm">
                    {r.netWeightMT !== undefined ? `${r.netWeightMT.toFixed(2)} MT` : "PENDING"}
                  </td>
                  <td className="p-3 font-mono text-right text-neutral-600">
                    {r.varianceMT !== undefined
                      ? `${r.varianceMT >= 0 ? "+" : ""}${r.varianceMT.toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                        r.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      {r.status === "COMPLETED" ? "RECONCILED" : "WAITING TARE"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => openSlipModal(r)}
                      className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 inline-flex items-center gap-1 cursor-pointer transition-colors"
                      style={{ borderRadius: 0 }}
                    >
                      <Eye className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Slip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <WeighbridgeSlipModal
        isOpen={isSlipModalOpen}
        onClose={closeSlipModal}
        record={selectedSlipRecord}
      />
    </div>
  );
}
