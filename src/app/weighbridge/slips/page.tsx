"use client";

import React, { useState } from "react";
import {
  Receipt,
  Search,
  Printer,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  FileCheck,
} from "lucide-react";
import { useWeighbridge } from "@/lib/context/weighbridge-context";
import { WeighbridgeSlipModal } from "@/components/weighbridge/weighbridge-slip-modal";

export default function SlipsArchivePage() {
  const { records, openSlipModal, isSlipModalOpen, selectedSlipRecord, closeSlipModal } =
    useWeighbridge();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredSlips = records.filter((r) => {
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
              Legal Metrology Slips Archive
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Certified Weighbridge Slips Archive
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Retrieve, verify, and reprint computerized legal weighment slips with authentic barcode authentication and operator signatures.
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
            <span>Print Batch</span>
          </button>
        </div>
      </div>

      {/* Search and Slips List */}
      <div className="bg-white border border-neutral-300 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search slip number, vehicle, supplier, gate entry pass..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 sm:h-10 pl-9.5 pr-3 text-sm bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
              style={{ borderRadius: 0 }}
            />
          </div>

          <div className="text-xs text-neutral-500 font-mono">
            Showing <strong>{filteredSlips.length}</strong> official certificates
          </div>
        </div>

        {/* Slips Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSlips.map((slip) => (
            <div
              key={slip.id}
              className="border border-neutral-300 bg-neutral-50/50 p-4 space-y-3 hover:border-neutral-900 hover:bg-white transition-all shadow-xs"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <div className="flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-[#059669]" />
                  <span className="font-mono font-black text-sm text-neutral-900">
                    {slip.slipNo}
                  </span>
                </div>
                <span
                  className={`px-1.5 py-0.2 text-[9px] font-bold font-mono uppercase border ${
                    slip.status === "COMPLETED"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-amber-50 text-amber-800 border-amber-300"
                  }`}
                >
                  {slip.status === "COMPLETED" ? "CERTIFIED" : "PENDING TARE"}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Vehicle:</span>
                  <span className="font-mono font-bold text-neutral-900">
                    {slip.vehicleNo}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Commodity:</span>
                  <span className="font-semibold text-neutral-800 truncate max-w-[170px]">
                    {slip.materialName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Partner:</span>
                  <span className="text-neutral-700 truncate max-w-[170px]">
                    {slip.supplierOrCustomer}
                  </span>
                </div>
              </div>

              {/* Weights Ticker */}
              <div className="bg-white border border-neutral-200 p-2.5 grid grid-cols-3 gap-1 text-center font-mono">
                <div>
                  <span className="text-[9px] text-neutral-400 block uppercase">
                    Gross
                  </span>
                  <strong className="text-xs text-neutral-800">
                    {slip.grossWeightMT.toFixed(2)}
                  </strong>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 block uppercase">
                    Tare
                  </span>
                  <strong className="text-xs text-neutral-800">
                    {slip.tareWeightMT !== undefined
                      ? slip.tareWeightMT.toFixed(2)
                      : "—"}
                  </strong>
                </div>
                <div>
                  <span className="text-[9px] text-emerald-700 block uppercase font-bold">
                    Net MT
                  </span>
                  <strong className="text-xs text-emerald-700 font-black">
                    {slip.netWeightMT !== undefined
                      ? slip.netWeightMT.toFixed(2)
                      : "PEND"}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openSlipModal(slip)}
                className="w-full py-2 text-xs font-bold uppercase tracking-wider bg-[#18181B] hover:bg-neutral-800 text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                style={{ borderRadius: 0 }}
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>View & Print Slip</span>
              </button>
            </div>
          ))}
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
