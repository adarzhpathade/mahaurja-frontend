"use client";

import React, { useState } from "react";
import { MobileFilterSheet } from "@/components/shared/mobile-filter-sheet";
import {
  Receipt,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  X,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useSales } from "@/lib/context/sales-context";
import { SalesInvoice } from "@/lib/types/sales";

export function PaymentsLedgerView() {
  const { invoices, recordPayment, metrics } = useSales();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState("RTGS / NEFT");
  const [paymentRef, setPaymentRef] = useState("HDFC-CMS-984210");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "PAID"
        ? inv.paymentStatus === "FULLY_PAID"
        : inv.paymentStatus !== "FULLY_PAID";
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.dispatchNumber.toLowerCase().includes(q)
    );
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    recordPayment(selectedInvoice.invoiceNumber, payAmount);
    setSuccessMsg(`Payment of ₹${payAmount.toLocaleString("en-IN")} credited against ${selectedInvoice.invoiceNumber}.`);
    setSelectedInvoice(null);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-300 pb-4 sm:pb-5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Customer Payments
          </h1>
          <span className="text-xs sm:text-sm font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
            {filteredInvoices.length}
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

      {/* Accounts Telemetry Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Total Billed
          </span>
          <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 block">
            ₹{(invoices.reduce((sum, inv) => sum + inv.totalInvoiceAmount, 0) / 1000).toFixed(1)} K
          </span>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Collected
          </span>
          <span className="font-mono font-black text-2xl sm:text-3xl text-[#059669] block">
            ₹{(invoices.reduce((sum, inv) => sum + inv.paidAmount, 0) / 1000).toFixed(1)} K
          </span>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Outstanding
          </span>
          <span className="font-mono font-black text-2xl sm:text-3xl text-amber-700 block">
            ₹{(metrics.outstandingReceivablesINR / 1000).toFixed(1)} K
          </span>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Efficiency
          </span>
          <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 block">
            {Math.round((50000 / 107100) * 100)}%
          </span>
        </div>
      </div>

      {/* Content container - borderless on mobile, bordered on PC */}
      <div className="border-0 p-0 bg-transparent sm:border sm:border-neutral-300 sm:p-6 sm:bg-white/30 space-y-4 sm:space-y-5">
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-neutral-300">
          {/* Search Input & Mobile Filter Button */}
          <div className="flex items-center gap-2 flex-1 sm:max-w-md">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search invoice number, customer, dispatch ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
              />
            </div>

            {/* Mobile Filter Square Button */}
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
              <span>All Invoices</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  statusFilter === "ALL"
                    ? "bg-[#059669] text-white"
                    : "bg-neutral-200 text-neutral-700"
                }`}
              >
                {invoices.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("PENDING")}
              className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === "PENDING"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span>Pending</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  statusFilter === "PENDING"
                    ? "bg-[#059669] text-white"
                    : "bg-neutral-200 text-neutral-700"
                }`}
              >
                {invoices.filter((i) => i.paymentStatus !== "FULLY_PAID").length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("PAID")}
              className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === "PAID"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span>Fully Paid</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  statusFilter === "PAID"
                    ? "bg-[#059669] text-white"
                    : "bg-neutral-200 text-neutral-700"
                }`}
              >
                {invoices.filter((i) => i.paymentStatus === "FULLY_PAID").length}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Filter Sheet */}
        <MobileFilterSheet
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          title="Filter Invoices"
          selectedId={statusFilter}
          onSelect={(id) => setStatusFilter(id as typeof statusFilter)}
          options={[
            {
              id: "ALL",
              label: "All Invoices",
              count: invoices.length,
              dotColor: "bg-neutral-400",
              selectedDotColor: "bg-white ring-2 ring-white/30",
            },
            {
              id: "PENDING",
              label: "Pending",
              count: invoices.filter((i) => i.paymentStatus !== "FULLY_PAID").length,
              dotColor: "bg-amber-500",
              selectedDotColor: "bg-amber-400 ring-2 ring-amber-400/40",
            },
            {
              id: "PAID",
              label: "Fully Paid",
              count: invoices.filter((i) => i.paymentStatus === "FULLY_PAID").length,
              dotColor: "bg-[#059669]",
              selectedDotColor: "bg-[#10B981] ring-2 ring-[#10B981]/40",
            },
          ]}
        />

        {filteredInvoices.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500 font-mono">
            No invoice records match your search criteria.
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInvoices.map((inv) => (
              <div
                key={inv.invoiceNumber}
                className="border border-neutral-300 bg-white/40 p-4 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500">Dispatch: {inv.dispatchNumber}</span>
                      <h3 className="font-mono font-bold text-neutral-900 text-base">{inv.invoiceNumber}</h3>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                      inv.paymentStatus === "FULLY_PAID"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}>
                      {inv.paymentStatus.replace("_", " ")}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-neutral-700">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Customer:</span>
                      <span className="font-bold text-neutral-900">{inv.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Total Billed:</span>
                      <span className="font-mono font-bold text-neutral-900">₹{inv.totalInvoiceAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Paid to Date:</span>
                      <span className="font-mono font-bold text-[#059669]">₹{inv.paidAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Remaining Balance:</span>
                      <span className="font-mono font-bold text-amber-700">₹{inv.outstandingAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Due Date:</span>
                      <span className="font-mono text-neutral-700">{inv.paymentDueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-200 flex justify-end">
                  {inv.outstandingAmount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setPayAmount(inv.outstandingAmount);
                      }}
                      className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Record Payment</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Mobile Cards View (Strict Mobile Fallback) */}
            <div className="grid grid-cols-1 sm:hidden gap-4">
              {filteredInvoices.map((inv) => (
                <div
                  key={inv.invoiceNumber}
                  className="border border-neutral-300 bg-white/40 p-4 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500">Dispatch: {inv.dispatchNumber}</span>
                        <h3 className="font-mono font-bold text-neutral-900 text-base">{inv.invoiceNumber}</h3>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                        inv.paymentStatus === "FULLY_PAID"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}>
                        {inv.paymentStatus.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-neutral-700">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Customer:</span>
                        <span className="font-bold text-neutral-900">{inv.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Total Billed:</span>
                        <span className="font-mono font-bold text-neutral-900">₹{inv.totalInvoiceAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Paid to Date:</span>
                        <span className="font-mono font-bold text-[#059669]">₹{inv.paidAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Remaining Balance:</span>
                        <span className="font-mono font-bold text-amber-700">₹{inv.outstandingAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Due Date:</span>
                        <span className="font-mono text-neutral-700">{inv.paymentDueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex justify-end">
                    {inv.outstandingAmount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setPayAmount(inv.outstandingAmount);
                        }}
                        className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Record Payment</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Transparent Industrial Table */}
            <div className="hidden sm:block border border-neutral-300 overflow-x-auto bg-transparent">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Invoice Number</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Dispatch Ref</th>
                    <th className="py-2.5 px-3 font-mono">Invoice Total</th>
                    <th className="py-2.5 px-3 font-mono">Realized Paid</th>
                    <th className="py-2.5 px-3 font-mono">Balance Due</th>
                    <th className="py-2.5 px-3">Payment Due Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.invoiceNumber} className="hover:bg-neutral-200/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{inv.invoiceNumber}</td>
                      <td className="py-2.5 px-3 font-semibold text-neutral-900">{inv.customerName}</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-700">{inv.dispatchNumber}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">₹{inv.totalInvoiceAmount.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 px-3 font-mono text-[#059669] font-bold">₹{inv.paidAmount.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 px-3 font-mono text-amber-700 font-bold">₹{inv.outstandingAmount.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-600">{inv.paymentDueDate}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                          inv.paymentStatus === "FULLY_PAID"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}>
                          {inv.paymentStatus.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {inv.outstandingAmount > 0 ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setPayAmount(inv.outstandingAmount);
                            }}
                            className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Record Payment</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold font-mono">Paid Full</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Record Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
          <form onSubmit={handleRecordPayment} className="bg-white border-2 border-neutral-900 w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#059669]" />
                <h2 className="text-base font-bold uppercase tracking-tight text-neutral-900">
                  Record Customer Payment
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">Invoice:</span>
                <span className="font-mono font-bold text-neutral-900">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Client:</span>
                <span className="font-bold text-neutral-900">{selectedInvoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Outstanding Balance:</span>
                <span className="font-mono font-bold text-amber-700">₹{selectedInvoice.outstandingAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                Payment Amount (₹)
              </label>
              <input
                type="number"
                step="500"
                max={selectedInvoice.outstandingAmount}
                value={payAmount}
                onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                Payment Method / Channel
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#059669]"
              >
                <option value="RTGS / NEFT">RTGS / NEFT Bank Transfer</option>
                <option value="IMPS">IMPS Immediate Payment</option>
                <option value="Cheque">Banker Cheque / Demand Draft</option>
                <option value="Letter of Credit">Letter of Credit (LC)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                Bank UTR / Transaction Reference Number
              </label>
              <input
                type="text"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-mono font-semibold text-neutral-900 focus:outline-none focus:border-[#059669]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="h-10 px-4 bg-white border border-neutral-300 text-xs font-semibold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Payment Receipt</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
