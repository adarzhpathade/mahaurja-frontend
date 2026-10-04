"use client";

import React, { useState } from "react";
import {
  Truck,
  CheckCircle2,
  Clock,
  Upload,
  LayoutGrid,
  Table as TableIcon,
  Search,
  FileCheck,
  ShieldCheck,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useSales } from "@/lib/context/sales-context";
import { DeliveryRecord } from "@/lib/types/sales";

export function DeliveryPodView() {
  const { deliveries, uploadPod } = useSales();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // POD Form State
  const [receiverName, setReceiverName] = useState("");
  const [feedback, setFeedback] = useState("");

  const filteredDeliveries = deliveries.filter((del) => {
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "TRANSIT"
        ? del.status === "IN_TRANSIT" || del.status === "DISPATCHED"
        : del.status === statusFilter;
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      del.id.toLowerCase().includes(q) ||
      del.dispatchNumber.toLowerCase().includes(q) ||
      del.vehicleNumber.toLowerCase().includes(q) ||
      del.customerName.toLowerCase().includes(q) ||
      del.deliveryLocation.toLowerCase().includes(q) ||
      del.driverName.toLowerCase().includes(q)
    );
  });

  const handleConfirmPod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    uploadPod(selectedDelivery.id, receiverName, feedback);
    setSelectedDelivery(null);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Command Header */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Delivery &amp; Proof of Delivery (POD)
        </h1>
      </div>

      {/* Deliveries History Ledger */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-neutral-800 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Fleet Tracking &amp; Deliveries
            </h2>
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {filteredDeliveries.length}
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
            {/* Search Input & Mobile Filter Button */}
            <div className="flex items-center gap-2 flex-1 sm:max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search delivery, dispatch, vehicle, customer, driver..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
                />
              </div>

              {/* Mobile Filter Square Button */}
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
                <span>All Deliveries</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "ALL"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {deliveries.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("TRANSIT")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "TRANSIT"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>In Transit</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "TRANSIT"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {deliveries.filter((d) => d.status === "IN_TRANSIT" || d.status === "DISPATCHED").length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("POD_RECEIVED")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "POD_RECEIVED"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>POD Verified</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "POD_RECEIVED"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {deliveries.filter((d) => d.status === "POD_RECEIVED").length}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Filter Modal Popup */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:hidden">
              <div className="w-full bg-white border-t border-neutral-300 p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#059669]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Filter Deliveries
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("ALL");
                      setIsMobileFilterOpen(false);
                    }}
                    className={`h-11 px-4 text-xs font-semibold flex items-center justify-between border ${
                      statusFilter === "ALL"
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-white text-neutral-800 border-neutral-200"
                    }`}
                  >
                    <span>All Deliveries</span>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-neutral-200/40">{deliveries.length}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("TRANSIT");
                      setIsMobileFilterOpen(false);
                    }}
                    className={`h-11 px-4 text-xs font-semibold flex items-center justify-between border ${
                      statusFilter === "TRANSIT"
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-white text-neutral-800 border-neutral-200"
                    }`}
                  >
                    <span>In Transit</span>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-neutral-200/40">
                      {deliveries.filter((d) => d.status === "IN_TRANSIT" || d.status === "DISPATCHED").length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("POD_RECEIVED");
                      setIsMobileFilterOpen(false);
                    }}
                    className={`h-11 px-4 text-xs font-semibold flex items-center justify-between border ${
                      statusFilter === "POD_RECEIVED"
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-white text-neutral-800 border-neutral-200"
                    }`}
                  >
                    <span>POD Verified</span>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-neutral-200/40">
                      {deliveries.filter((d) => d.status === "POD_RECEIVED").length}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredDeliveries.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No deliveries match your search criteria.
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDeliveries.map((del) => (
                <div
                  key={del.id}
                  className="border border-neutral-300 hover:border-neutral-900 bg-white/40 p-4 flex flex-col justify-between space-y-4 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500">Dispatch: {del.dispatchNumber}</span>
                        <h3 className="font-mono font-bold text-neutral-900 text-base">{del.vehicleNumber}</h3>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                        del.status === "POD_RECEIVED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}>
                        {del.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-neutral-700">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Customer:</span>
                        <span className="font-bold text-neutral-900 truncate max-w-[180px]">{del.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Destination:</span>
                        <span className="font-medium text-neutral-800 truncate max-w-[180px]">{del.deliveryLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Net Quantity:</span>
                        <span className="font-mono font-bold text-[#047857]">{del.dispatchedQuantityMT} MT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Driver:</span>
                        <span className="text-neutral-800">{del.driverName}</span>
                      </div>
                      {del.receiverName && (
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Acknowledged By:</span>
                          <span className="font-semibold text-neutral-900">{del.receiverName}</span>
                        </div>
                      )}
                      {del.qualityFeedback && (
                        <div className="pt-2 text-[11px] text-neutral-600 bg-neutral-100/70 p-2 border border-neutral-200">
                          <strong>Client Feedback:</strong> &ldquo;{del.qualityFeedback}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {del.destinationArrivalTime || "In Transit to destination"}
                    </span>

                    {del.status !== "POD_RECEIVED" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDelivery(del);
                          setReceiverName("");
                          setFeedback("All bags received in sound condition. Zero spillage.");
                        }}
                        className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload POD</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-xs font-bold text-[#047857]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>POD Verified</span>
                      </div>
                    )}
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
                    <th className="py-2.5 px-3">Delivery Ref</th>
                    <th className="py-2.5 px-3">Vehicle Plate</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Destination</th>
                    <th className="py-2.5 px-3 font-mono">Net MT</th>
                    <th className="py-2.5 px-3">Receiver Sign-off</th>
                    <th className="py-2.5 px-3">POD Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300">
                  {filteredDeliveries.map((del) => (
                    <tr key={del.id} className="hover:bg-neutral-200/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{del.id}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{del.vehicleNumber}</td>
                      <td className="py-2.5 px-3 font-semibold text-neutral-900">{del.customerName}</td>
                      <td className="py-2.5 px-3 text-neutral-700">{del.deliveryLocation}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{del.dispatchedQuantityMT} MT</td>
                      <td className="py-2.5 px-3 text-neutral-800">{del.receiverName || "Pending Arrival"}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                          del.status === "POD_RECEIVED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}>
                          {del.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {del.status !== "POD_RECEIVED" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDelivery(del);
                              setReceiverName("");
                              setFeedback("Sound condition.");
                            }}
                            className="h-7 px-2.5 bg-[#18181B] hover:bg-[#059669] text-white text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>POD</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-semibold font-mono">Archived</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Upload POD Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
          <form onSubmit={handleConfirmPod} className="bg-white border-2 border-neutral-900 w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#059669]" />
                <h2 className="text-base font-bold uppercase tracking-tight text-neutral-900">
                  Confirm Proof of Delivery (POD)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDelivery(null)}
                className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">Customer:</span>
                <span className="font-bold text-neutral-900">{selectedDelivery.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Vehicle:</span>
                <span className="font-mono font-bold text-neutral-900">{selectedDelivery.vehicleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Delivered Net:</span>
                <span className="font-mono font-bold text-[#047857]">{selectedDelivery.dispatchedQuantityMT} MT</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                Customer Receiver Name &amp; Designation
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="e.g. Ramesh Kadam (Stores Manager)"
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#059669]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                Customer Quality Acknowledgement &amp; Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g. Goods received in sound condition. Passed boiler intake inspection."
                className="w-full min-h-[48px] p-3 text-xs bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-[#059669] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setSelectedDelivery(null)}
                className="h-10 px-4 bg-white border border-neutral-300 text-xs font-semibold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify &amp; Close Delivery</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
