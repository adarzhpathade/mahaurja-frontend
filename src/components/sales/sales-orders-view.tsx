"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MobileFilterSheet } from "@/components/shared/mobile-filter-sheet";
import {
  ShoppingBag,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useSales } from "@/lib/context/sales-context";
import { SalesOrderStatus } from "@/lib/types/sales";

export function SalesOrdersView() {
  const { orders, createOrder, metrics } = useSales();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState("Kalyani Steel Forgings Ltd.");
  const [quantityMT, setQuantityMT] = useState<number>(50.0);
  const [ratePerMT, setRatePerMT] = useState<number>(6850);
  const [deliveryLocation, setDeliveryLocation] = useState("MIDC Mundhwa, Pune");
  const [requiredDate, setRequiredDate] = useState("12 Oct 2026");
  const [paymentTerms, setPaymentTerms] = useState("30 Days Net from Delivery");
  const [specs, setSpecs] = useState("8mm Industrial Pellet, GCV >= 4200 kcal/kg, Ash <= 5%");

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "DISPATCHED"
        ? order.status === "PARTIALLY_DISPATCHED" || order.status === "FULLY_DISPATCHED"
        : order.status === statusFilter;
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.deliveryLocation.toLowerCase().includes(q) ||
      order.customerSpecs.toLowerCase().includes(q)
    );
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();

    createOrder({
      orderDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      customerId: "CUST-00219",
      customerName,
      productName: "MAHAURJA Biomass Pellet",
      pelletDiameterMm: 8.0,
      quantityMT,
      dispatchedMT: 0,
      ratePerMT,
      totalAmountINR: quantityMT * ratePerMT,
      deliveryLocation,
      requiredDate,
      paymentTerms,
      customerSpecs: specs,
      status: "CONFIRMED",
    });

    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER (with Count, View Toggle & Primary Action) */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Sales Orders
          </h1>
          <span className="text-[11px] font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
            {filteredOrders.length}
          </span>
        </div>

        {/* Desktop Controls: Dual View Switcher + Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Desktop Dual View */}
          <div className="inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
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

          <button
            type="button"
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>{isCreateOpen ? "Close Form" : "New Sales Order"}</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1 truncate">
            Pending Orders
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 tabular-nums">
              {metrics.ordersPendingMT} MT
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1 truncate">
            Dispatches Today
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-black text-2xl sm:text-3xl text-[#059669] tabular-nums">
              {metrics.dispatchesTodayCount} Trucks
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              {metrics.dispatchQuantityTodayMT} MT
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1 truncate">
            Open Value
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 tabular-nums">
              ₹{(orders.reduce((sum, o) => sum + o.totalAmountINR, 0) / 100000).toFixed(2)} L
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1 truncate">
            Outstanding
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 tabular-nums">
              ₹{(metrics.outstandingReceivablesINR / 1000).toFixed(1)} K
            </span>
          </div>
        </div>
      </div>

      {/* 2. MOBILE ACTION STACK (Gate UI Pattern) */}
      <div className="sm:hidden flex flex-col items-stretch gap-2.5 w-full">
        <button
          type="button"
          onClick={() => setIsCreateOpen(!isCreateOpen)}
          className="h-11 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs w-full"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>{isCreateOpen ? "Close Form" : "New Sales Order"}</span>
        </button>
      </div>

      {/* Inline Create Form (< 650px) */}
      {isCreateOpen && (
        <form onSubmit={handleCreateOrder} className="bg-white border border-neutral-300 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
            <Plus className="w-4 h-4 text-[#059669]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Book Customer Sales Order (PDF Sec 25)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Customer / Client</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#059669]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Contract Quantity (MT)</label>
              <input
                type="number"
                step="5"
                value={quantityMT}
                onChange={(e) => setQuantityMT(parseFloat(e.target.value) || 0)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Agreed Rate (₹ / MT)</label>
              <input
                type="number"
                step="50"
                value={ratePerMT}
                onChange={(e) => setRatePerMT(parseFloat(e.target.value) || 0)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Delivery Destination</label>
              <input
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Required By Date</label>
              <input
                type="text"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Payment Terms</label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Customer Guaranteed Specs</label>
            <textarea
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              className="w-full min-h-[48px] p-3 text-xs leading-relaxed bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="h-10 px-4 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Order Booking</span>
            </button>
          </div>
        </form>
      )}

      {/* Sales Orders History Ledger */}
      <section className="space-y-4 pt-4 border-t border-neutral-300">
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
                  placeholder="Search order ID, customer, destination, terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className={`sm:hidden w-10 h-10 flex items-center justify-center border shrink-0 cursor-pointer relative transition-colors ${
                  statusFilter !== "ALL"
                    ? "bg-[#18181B] text-white border-[#18181B]"
                    : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                }`}
                title="Filter Options"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {statusFilter !== "ALL" && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#059669] rounded-full ring-2 ring-white" />
                )}
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
                  {orders.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("CONFIRMED")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "CONFIRMED"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Confirmed</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "CONFIRMED"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {orders.filter((o) => o.status === "CONFIRMED").length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("DISPATCHED")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "DISPATCHED"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>In Dispatch</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "DISPATCHED"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {orders.filter((o) => o.status === "PARTIALLY_DISPATCHED" || o.status === "FULLY_DISPATCHED").length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("CLOSED")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "CLOSED"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Closed</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "CLOSED"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {orders.filter((o) => o.status === "CLOSED").length}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Filter Sheet */}
          <MobileFilterSheet
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            title="Filter Orders"
            selectedId={statusFilter}
            onSelect={(id) => setStatusFilter(id as typeof statusFilter)}
            options={[
              {
                id: "ALL",
                label: "All Sales Orders",
                count: orders.length,
                dotColor: "bg-neutral-400",
                selectedDotColor: "bg-white ring-2 ring-white/30",
              },
              {
                id: "CONFIRMED",
                label: "Confirmed Orders",
                count: orders.filter((o) => o.status === "CONFIRMED").length,
                dotColor: "bg-blue-500",
                selectedDotColor: "bg-sky-400 ring-2 ring-sky-400/40",
              },
              {
                id: "DISPATCHED",
                label: "In Dispatch / In Transit",
                count: orders.filter((o) => o.status === "PARTIALLY_DISPATCHED" || o.status === "FULLY_DISPATCHED").length,
                dotColor: "bg-[#059669]",
                selectedDotColor: "bg-[#10B981] ring-2 ring-[#10B981]/40",
              },
              {
                id: "CLOSED",
                label: "Fulfilled & Closed",
                count: orders.filter((o) => o.status === "CLOSED").length,
                dotColor: "bg-neutral-500",
                selectedDotColor: "bg-white ring-2 ring-white/30",
              },
            ]}
          />

          {filteredOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No sales orders match your search criteria.
            </div>
          ) : (
            <>
              {/* Cards View: Always on Mobile, respects viewMode on Desktop */}
              <div
                className={
                  viewMode === "cards"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "grid grid-cols-1 sm:hidden gap-4"
                }
              >
                {filteredOrders.map((order) => {
                  const fulfilledPct = Math.round((order.dispatchedMT / order.quantityMT) * 100);

                  return (
                    <div
                      key={order.id}
                      className="border border-neutral-300 hover:border-neutral-900 bg-white/40 p-4 flex flex-col justify-between space-y-4 transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                          <div>
                            <span className="text-[10px] font-mono text-neutral-500">{order.orderDate}</span>
                            <h3 className="font-mono font-bold text-neutral-900 text-base">{order.id}</h3>
                          </div>
                          <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5">
                            {order.status.replace("_", " ")}
                          </span>
                        </div>

                        <div className="mt-3 space-y-1.5 text-xs text-neutral-700">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Customer:</span>
                            <span className="font-bold text-neutral-900 truncate max-w-[180px]">{order.customerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Contract Rate:</span>
                            <span className="font-mono text-neutral-900 font-semibold">₹{order.ratePerMT} / MT</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Total Value:</span>
                            <span className="font-mono font-bold text-neutral-900">₹{order.totalAmountINR.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Destination:</span>
                            <span className="text-neutral-800 truncate max-w-[180px]">{order.deliveryLocation}</span>
                          </div>

                          {/* Fulfillment Progress */}
                          <div className="pt-2">
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-neutral-500">Fulfillment:</span>
                              <span className="font-mono font-bold text-[#047857]">
                                {order.dispatchedMT} / {order.quantityMT} MT ({fulfilledPct}%)
                              </span>
                            </div>
                            <div className="w-full bg-neutral-200 h-1.5">
                              <div
                                className="bg-[#059669] h-1.5"
                                style={{ width: `${fulfilledPct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                        <span className="text-[10px] text-neutral-500 font-mono">
                          Req: {order.requiredDate}
                        </span>
                        <Link
                          href="/sales/dispatch"
                          className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                        >
                          <span>Plan Dispatch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table View: PC Only when viewMode === "table" */}
              {viewMode === "table" && (
                <div className="hidden sm:block border border-neutral-300 overflow-x-auto bg-transparent">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3 font-mono">Contract MT</th>
                        <th className="py-2.5 px-3 font-mono">Dispatched MT</th>
                        <th className="py-2.5 px-3 font-mono">Rate (₹/MT)</th>
                        <th className="py-2.5 px-3 font-mono">Total Value</th>
                        <th className="py-2.5 px-3">Destination</th>
                        <th className="py-2.5 px-3">Required By</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-300">
                      {filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-neutral-200/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{o.id}</td>
                          <td className="py-2.5 px-3 font-semibold text-neutral-900">{o.customerName}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{o.quantityMT} MT</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#047857]">{o.dispatchedMT} MT</td>
                          <td className="py-2.5 px-3 font-mono text-neutral-800">₹{o.ratePerMT}</td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-neutral-900">₹{o.totalAmountINR.toLocaleString("en-IN")}</td>
                          <td className="py-2.5 px-3 text-neutral-700">{o.deliveryLocation}</td>
                          <td className="py-2.5 px-3 font-mono text-neutral-600">{o.requiredDate}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5">
                              {o.status.replace("_", " ")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
