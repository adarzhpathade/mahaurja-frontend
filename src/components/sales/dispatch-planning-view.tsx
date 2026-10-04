"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Route,
  CheckCircle2,
  Truck,
  Layers,
  ArrowRight,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  Scale,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useSales } from "@/lib/context/sales-context";
import { useInventory } from "@/lib/context/inventory-context";

export function DispatchPlanningView() {
  const { orders, dispatches, createDispatch } = useSales();
  const { fgStock } = useInventory();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const approvedBatches = fgStock.filter((b) => b.qcStatus === "QC_APPROVED");
  const openOrders = orders.filter((o) => o.status !== "CLOSED" && o.status !== "FULLY_DISPATCHED");

  // Form State
  const [selectedOrderId, setSelectedOrderId] = useState<string>(openOrders[0]?.id || "SO-261002-015");
  const [targetMT, setTargetMT] = useState<number>(20.0);
  const [allocatedBatch, setAllocatedBatch] = useState<string>(approvedBatches[0]?.batchNumber || "FG-BATCH-261003-009");
  const [vehicleNumber, setVehicleNumber] = useState<string>("MH 14 TC 5519");
  const [driverName, setDriverName] = useState<string>("Santosh Mane");
  const [driverMobile, setDriverMobile] = useState<string>("94210 33882");
  const [transporter, setTransporter] = useState<string>("Western Logistics Corp");
  const [destination, setDestination] = useState<string>("MIDC Kurkumbh, Pune");

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const filteredDispatches = dispatches.filter((disp) => {
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "TRANSIT"
        ? disp.status === "DISPATCHED" || disp.status === "IN_TRANSIT"
        : disp.status === statusFilter;
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      disp.id.toLowerCase().includes(q) ||
      disp.salesOrderId.toLowerCase().includes(q) ||
      disp.customerName.toLowerCase().includes(q) ||
      disp.vehicleNumber.toLowerCase().includes(q) ||
      disp.allocatedFgBatch.toLowerCase().includes(q) ||
      disp.destination.toLowerCase().includes(q)
    );
  });

  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();

    createDispatch({
      salesOrderId: selectedOrderId,
      customerName: selectedOrder?.customerName || "Customer",
      targetQuantityMT: targetMT,
      allocatedFgBatch: allocatedBatch,
      vehicleNumber,
      driverName,
      driverMobile,
      transporterName: transporter,
      status: "LOADING",
      plannedDate: "04 Oct 2026",
      destination,
    });

    setIsPlanOpen(false);
  };

  return (
    <div className="space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Dispatch Planning &amp; Allocation
        </h1>
        <button
          type="button"
          onClick={() => setIsPlanOpen(!isPlanOpen)}
          className="h-10 px-4 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isPlanOpen ? "Close Plan Form" : "+ Create Dispatch Plan"}</span>
        </button>
      </div>

      {/* Stock vs Requirement Check Banner (PDF Sec 26) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border border-neutral-300">
        <div className="p-3 bg-neutral-50 border border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
            Total Customer Order Demand
          </span>
          <span className="font-mono font-black text-2xl text-neutral-900">180.0 MT</span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Across 3 open contracts</span>
        </div>

        <div className="p-3 bg-neutral-50 border border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
            Available Approved FG Inventory
          </span>
          <span className="font-mono font-black text-2xl text-[#059669]">45.0 MT</span>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Lab Certified Ready</span>
        </div>

        <div className="p-3 bg-neutral-50 border border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
            Dispatch Capability Check
          </span>
          <span className="font-mono font-black text-2xl text-[#047857]">Approved</span>
          <span className="text-[10px] text-neutral-600 block mt-0.5">Sufficient stock for current vehicles</span>
        </div>
      </div>

      {/* Plan Form Modal/Box (< 650px) */}
      {isPlanOpen && (
        <form onSubmit={handleCreateDispatch} className="bg-white border border-neutral-300 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
            <Plus className="w-4 h-4 text-[#059669]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Allocate Transport Vehicle to Sales Order (PDF Sec 28)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Target Sales Order</label>
              <select
                value={selectedOrderId}
                onChange={(e) => {
                  setSelectedOrderId(e.target.value);
                  const ord = orders.find((o) => o.id === e.target.value);
                  if (ord) setDestination(ord.deliveryLocation);
                }}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#059669]"
              >
                {openOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} ({o.customerName} · {o.quantityMT - o.dispatchedMT} MT remaining)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Allocate Approved FG Batch</label>
              <select
                value={allocatedBatch}
                onChange={(e) => setAllocatedBatch(e.target.value)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-bold font-mono text-neutral-900 focus:outline-none focus:border-[#059669]"
              >
                {approvedBatches.map((b) => (
                  <option key={b.batchNumber} value={b.batchNumber}>
                    {b.batchNumber} ({b.producedQuantityMT} MT available)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Target Dispatch Quantity (MT)</label>
              <input
                type="number"
                step="0.5"
                value={targetMT}
                onChange={(e) => setTargetMT(parseFloat(e.target.value) || 0)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Transport Vehicle Number</label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-mono font-bold text-neutral-900 uppercase focus:outline-none focus:border-[#059669]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Driver Name &amp; Phone</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Driver Name"
                  className="h-10 w-1/2 px-3 bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#059669]"
                  required
                />
                <input
                  type="text"
                  value={driverMobile}
                  onChange={(e) => setDriverMobile(e.target.value)}
                  placeholder="Mobile"
                  className="h-10 w-1/2 px-3 bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#059669]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Transporter / Fleet Agency</label>
              <input
                type="text"
                value={transporter}
                onChange={(e) => setTransporter(e.target.value)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#059669]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => setIsPlanOpen(false)}
              className="h-10 px-4 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Dispatch Allocation</span>
            </button>
          </div>
        </form>
      )}

      {/* Dispatches History Ledger */}
      <section className="space-y-4 pt-4 border-t border-neutral-300">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-neutral-800 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Dispatch Plans &amp; Allocations
            </h2>
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {filteredDispatches.length}
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
                  placeholder="Search dispatch ID, SO, customer, vehicle..."
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
                <span>All</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "ALL"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {dispatches.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("LOADING")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "LOADING"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Loading</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "LOADING"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {dispatches.filter((d) => d.status === "LOADING").length}
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
                  {dispatches.filter((d) => d.status === "DISPATCHED" || d.status === "IN_TRANSIT").length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("DELIVERED")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "DELIVERED"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Delivered</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "DELIVERED"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {dispatches.filter((d) => d.status === "DELIVERED").length}
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
                      Filter Dispatches
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
                    <span>All Dispatches</span>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-neutral-200/40">{dispatches.length}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("LOADING");
                      setIsMobileFilterOpen(false);
                    }}
                    className={`h-11 px-4 text-xs font-semibold flex items-center justify-between border ${
                      statusFilter === "LOADING"
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-white text-neutral-800 border-neutral-200"
                    }`}
                  >
                    <span>Loading</span>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-neutral-200/40">
                      {dispatches.filter((d) => d.status === "LOADING").length}
                    </span>
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
                      {dispatches.filter((d) => d.status === "DISPATCHED" || d.status === "IN_TRANSIT").length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("DELIVERED");
                      setIsMobileFilterOpen(false);
                    }}
                    className={`h-11 px-4 text-xs font-semibold flex items-center justify-between border ${
                      statusFilter === "DELIVERED"
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-white text-neutral-800 border-neutral-200"
                    }`}
                  >
                    <span>Delivered</span>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-neutral-200/40">
                      {dispatches.filter((d) => d.status === "DELIVERED").length}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredDispatches.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No dispatch plans match your search criteria.
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDispatches.map((disp) => (
                <div
                  key={disp.id}
                  className="border border-neutral-300 hover:border-neutral-900 bg-white/40 p-4 flex flex-col justify-between space-y-4 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500">Order: {disp.salesOrderId}</span>
                        <h3 className="font-mono font-bold text-neutral-900 text-base">{disp.id}</h3>
                      </div>
                      <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5">
                        {disp.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs text-neutral-700">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Customer:</span>
                        <span className="font-bold text-neutral-900">{disp.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Vehicle / Driver:</span>
                        <span className="font-mono font-bold text-neutral-900">
                          {disp.vehicleNumber} ({disp.driverName})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Allocated FG Batch:</span>
                        <span className="font-mono text-neutral-800">{disp.allocatedFgBatch}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Dispatched Quantity:</span>
                        <span className="font-mono font-bold text-[#047857]">{disp.targetQuantityMT} MT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Destination:</span>
                        <span className="text-neutral-800 truncate max-w-[200px]">{disp.destination}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {disp.plannedDate}
                    </span>
                    <Link
                      href="/sales/invoices"
                      className="font-bold text-neutral-900 hover:text-[#059669] flex items-center gap-1 transition-colors"
                    >
                      <span>Invoice &amp; Docs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
                    <th className="py-2.5 px-3">Dispatch ID</th>
                    <th className="py-2.5 px-3">Sales Order</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Vehicle Plate</th>
                    <th className="py-2.5 px-3 font-mono">Allocated Batch</th>
                    <th className="py-2.5 px-3 font-mono">Quantity MT</th>
                    <th className="py-2.5 px-3">Destination</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300">
                  {filteredDispatches.map((disp) => (
                    <tr key={disp.id} className="hover:bg-neutral-200/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{disp.id}</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-700">{disp.salesOrderId}</td>
                      <td className="py-2.5 px-3 font-semibold text-neutral-900">{disp.customerName}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{disp.vehicleNumber}</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-800">{disp.allocatedFgBatch}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#047857]">{disp.targetQuantityMT} MT</td>
                      <td className="py-2.5 px-3 text-neutral-700 truncate max-w-[180px]">{disp.destination}</td>
                      <td className="py-2.5 px-3">
                        <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5">
                          {disp.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Link
                          href="/sales/invoices"
                          className="h-7 px-2.5 bg-[#18181B] hover:bg-[#059669] text-white text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Invoices</span>
                        </Link>
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
