"use client";

import React, { useState } from "react";
import { MobileFilterSheet } from "@/components/shared/mobile-filter-sheet";
import {
  FileText,
  Search,
  Printer,
  X,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  Download,
  ShieldCheck,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { useSales } from "@/lib/context/sales-context";
import { SalesInvoice } from "@/lib/types/sales";

export function InvoicesDocsView() {
  const { invoices } = useSales();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "PAID"
        ? inv.paymentStatus === "FULLY_PAID"
        : inv.paymentStatus !== "FULLY_PAID";
    if (!matchesStatus) return false;

    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.dispatchNumber.toLowerCase().includes(q) ||
      inv.eWayBillNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER (with Count & Desktop View Toggle) */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Invoices &amp; Documentation
          </h1>
          <span className="text-[11px] font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
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

      {/* Invoices Section */}
      <section className="space-y-4">
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
                  placeholder="Search invoice, customer, dispatch, e-way bill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              <button
                type="button"
                onClick={() => setStatusFilter("PENDING")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "PENDING"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Outstanding</span>
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
                id: "PAID",
                label: "Fully Paid",
                count: invoices.filter((i) => i.paymentStatus === "FULLY_PAID").length,
                dotColor: "bg-[#059669]",
                selectedDotColor: "bg-[#10B981] ring-2 ring-[#10B981]/40",
              },
              {
                id: "PENDING",
                label: "Outstanding",
                count: invoices.filter((i) => i.paymentStatus !== "FULLY_PAID").length,
                dotColor: "bg-amber-500",
                selectedDotColor: "bg-amber-400 ring-2 ring-amber-400/40",
              },
            ]}
          />

          {filteredInvoices.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No commercial invoices match your search criteria.
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
                {filteredInvoices.map((inv) => (
                  <div
                    key={inv.invoiceNumber}
                    className="border border-neutral-300 hover:border-neutral-900 bg-white/40 p-4 flex flex-col justify-between space-y-4 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                        <div>
                          <span className="text-[10px] font-mono text-neutral-500">{inv.invoiceDate}</span>
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
                          <span className="font-bold text-neutral-900 truncate max-w-[170px]">{inv.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Dispatch:</span>
                          <span className="font-mono text-neutral-900">{inv.dispatchNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">E-Way Bill:</span>
                          <span className="font-mono text-neutral-700">{inv.eWayBillNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Net Quantity:</span>
                          <span className="font-mono font-bold text-neutral-900">{inv.quantityMT} MT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Invoice Amount:</span>
                          <span className="font-mono font-black text-neutral-900">₹{inv.totalInvoiceAmount.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Outstanding:</span>
                          <span className="font-mono font-bold text-amber-700">₹{inv.outstandingAmount.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Due: {inv.paymentDueDate}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(inv)}
                        className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Slip</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table View: PC Only when viewMode === "table" */}
              {viewMode === "table" && (
                <div className="hidden sm:block border border-neutral-300 overflow-x-auto bg-transparent">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Invoice Number</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Dispatch Ref</th>
                        <th className="py-2.5 px-3 font-mono">E-Way Bill</th>
                        <th className="py-2.5 px-3 font-mono">Total Net MT</th>
                        <th className="py-2.5 px-3 font-mono">Invoice Value (₹)</th>
                        <th className="py-2.5 px-3 font-mono">Outstanding</th>
                        <th className="py-2.5 px-3">Payment Status</th>
                        <th className="py-2.5 px-3 text-right">Document</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-300">
                      {filteredInvoices.map((inv) => (
                        <tr key={inv.invoiceNumber} className="hover:bg-neutral-200/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{inv.invoiceNumber}</td>
                          <td className="py-2.5 px-3 font-semibold text-neutral-900">{inv.customerName}</td>
                          <td className="py-2.5 px-3 font-mono text-neutral-700">{inv.dispatchNumber}</td>
                          <td className="py-2.5 px-3 font-mono text-neutral-700">{inv.eWayBillNumber}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{inv.quantityMT} MT</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">₹{inv.totalInvoiceAmount.toLocaleString("en-IN")}</td>
                          <td className="py-2.5 px-3 font-mono text-amber-700 font-semibold">₹{inv.outstandingAmount.toLocaleString("en-IN")}</td>
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
                            <button
                              type="button"
                              onClick={() => setSelectedInvoice(inv)}
                              className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Invoice</span>
                            </button>
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

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none overflow-y-auto">
          <div className="bg-white border-2 border-neutral-900 w-full max-w-3xl my-auto text-neutral-900 shadow-2xl relative">
            <div className="print:hidden p-3 bg-neutral-100 border-b border-neutral-300 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Commercial Tax Invoice &amp; Delivery Suite
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-300 hover:bg-neutral-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 print:p-0">
              <div className="border-b-2 border-neutral-900 pb-4 flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-[#059669] uppercase">
                    BHARAT INDUSTRIAL &amp; RENEWABLES LLP
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 uppercase">
                    TAX INVOICE / DELIVERY CHALLAN
                  </h2>
                  <p className="text-[11px] text-neutral-600 font-mono">
                    GSTIN: 27AABCB9876Q1ZA · Biomass Solid Biofuel Manufacturer
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-neutral-500 block">Invoice Number</span>
                  <span className="font-mono font-black text-sm text-neutral-900">{selectedInvoice.invoiceNumber}</span>
                  <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">Date: {selectedInvoice.invoiceDate}</span>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 text-xs p-3 bg-neutral-50 border border-neutral-300">
                <div>
                  <span className="text-[10px] font-bold uppercase text-neutral-500 block">Billed &amp; Shipped To:</span>
                  <span className="font-bold text-neutral-900 block mt-0.5">{selectedInvoice.customerName}</span>
                  <span className="text-neutral-700 block">{selectedInvoice.deliveryAddress}</span>
                  <span className="text-neutral-600 font-mono block mt-0.5">GSTIN: {selectedInvoice.customerGst}</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">E-Way Bill:</span>
                    <span className="font-bold text-neutral-900">{selectedInvoice.eWayBillNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Dispatch Ref:</span>
                    <span>{selectedInvoice.dispatchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Lorry Receipt (LR):</span>
                    <span>{selectedInvoice.lrNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Quality COA Ref:</span>
                    <span className="text-emerald-700 font-semibold">{selectedInvoice.coaNumber}</span>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <table className="w-full text-left text-xs border border-neutral-300 border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-300 text-[10px] font-bold uppercase text-neutral-700">
                    <th className="p-2 border-r border-neutral-300">Item Description</th>
                    <th className="p-2 border-r border-neutral-300">HSN Code</th>
                    <th className="p-2 border-r border-neutral-300 font-mono">Quantity</th>
                    <th className="p-2 border-r border-neutral-300 font-mono">Rate (₹/MT)</th>
                    <th className="p-2 text-right font-mono">Taxable Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300 font-mono">
                  <tr>
                    <td className="p-2 border-r border-neutral-300 font-sans font-semibold">
                      MAHAURJA 8mm Biomass Pellet (Industrial Grade)
                    </td>
                    <td className="p-2 border-r border-neutral-300 text-neutral-600">4401 31 00</td>
                    <td className="p-2 border-r border-neutral-300 font-bold">{selectedInvoice.quantityMT} MT</td>
                    <td className="p-2 border-r border-neutral-300">₹{selectedInvoice.ratePerMT}</td>
                    <td className="p-2 text-right font-bold">₹{selectedInvoice.taxableValue.toLocaleString("en-IN")}</td>
                  </tr>
                </tbody>
              </table>

              {/* Calculations */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-neutral-600">
                    <span>Taxable Subtotal:</span>
                    <span>₹{selectedInvoice.taxableValue.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>GST (5% Solid Biofuels):</span>
                    <span>₹{selectedInvoice.gstAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-neutral-900 pt-2 border-t border-neutral-900">
                    <span>Total Invoice:</span>
                    <span>₹{selectedInvoice.totalInvoiceAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Bank & Sign */}
              <div className="pt-4 border-t border-neutral-300 flex justify-between items-end text-[11px] text-neutral-600">
                <div>
                  <span className="font-bold text-neutral-900 block mb-0.5">Bank Details:</span>
                  <span>HDFC Bank · A/C: 50200084920192 · IFSC: HDFC0001092</span>
                </div>
                <div className="text-center">
                  <div className="h-10 border-b border-neutral-400 font-mono text-xs flex items-end justify-center pb-1 text-neutral-800">
                    Vikram Malhotra
                  </div>
                  <span className="text-[10px] font-bold uppercase text-neutral-500 mt-1 block">
                    Authorized Signatory
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
