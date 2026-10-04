"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export function PlantReportsView() {
  const [period, setPeriod] = useState<"TODAY" | "WEEK" | "MONTH">("TODAY");

  const handleExport = (reportName: string) => {
    window.print();
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner */}
      <div className="bg-white border border-neutral-300 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-[#059669]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
              Executive Director Operational &amp; Financial Reporting
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
            Plant Operational Audits &amp; Executive Reports
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Audit-ready export suite covering Production, Inventory, Quality, and Sales.
          </p>
        </div>

        {/* Period Selector */}
        <div className="inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
          {(["TODAY", "WEEK", "MONTH"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 font-semibold uppercase tracking-wider transition-colors ${
                period === p
                  ? "bg-[#18181B] text-white"
                  : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {p === "TODAY" ? "Today (Shift 01)" : p === "WEEK" ? "Last 7 Days" : "Month to Date"}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Standard Executive Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Report 1 */}
        <div className="bg-white border border-neutral-300 p-5 space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-neutral-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Report Ref: PRD-REP-01</span>
              <h3 className="font-bold text-base text-neutral-900">Daily Production, Machine Uptime &amp; Mass Yield</h3>
            </div>
            <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
              Production
            </span>
          </div>
          <p className="text-xs text-neutral-600">
            Summary of biomass extruded across Line 1 (CPM) &amp; Line 2 (Buhler), die motor amperage, rotary dryer thermal energy consumption, and total sieve fines recycled.
          </p>
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-900">Output: 72.0 MT / 100 MT Target</span>
            <button
              type="button"
              onClick={() => handleExport("Production")}
              className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>
          </div>
        </div>

        {/* Report 2 */}
        <div className="bg-white border border-neutral-300 p-5 space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-neutral-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Report Ref: INV-VAL-02</span>
              <h3 className="font-bold text-base text-neutral-900">Location-Wise Biomass Stock Valuation Ledger</h3>
            </div>
            <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
              Inventory
            </span>
          </div>
          <p className="text-xs text-neutral-600">
            Comprehensive audit of raw material tonnage across Yard A, Warehouse 1, Shed 2, and Yard B with FIFO purchase rates and total stock valuation (₹15.2 Lakhs).
          </p>
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-900">Total Stock: 385.0 MT</span>
            <button
              type="button"
              onClick={() => handleExport("Inventory")}
              className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>
          </div>
        </div>

        {/* Report 3 */}
        <div className="bg-white border border-neutral-300 p-5 space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-neutral-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Report Ref: SLS-DIS-03</span>
              <h3 className="font-bold text-base text-neutral-900">Commercial Sales Fulfillment &amp; Invoicing</h3>
            </div>
            <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5">
              Sales &amp; Dispatch
            </span>
          </div>
          <p className="text-xs text-neutral-600">
            Customer contract fulfillment tracker, dispatched tonnages, transport vehicles, e-way bills, commercial tax invoice totals, and outstanding collections.
          </p>
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-900">Dispatches: 3 Trucks (65 MT)</span>
            <button
              type="button"
              onClick={() => handleExport("Sales")}
              className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>
          </div>
        </div>

        {/* Report 4 */}
        <div className="bg-white border border-neutral-300 p-5 space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-neutral-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Report Ref: QC-QA-04</span>
              <h3 className="font-bold text-base text-neutral-900">Central Laboratory QC Defect &amp; Variance Audit</h3>
            </div>
            <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
              Quality Assurance
            </span>
          </div>
          <p className="text-xs text-neutral-600">
            Statistical distribution of inbound moisture%, ash%, and GCV values vs supplier reliability rankings; finished pellet mechanical durability and compliance rates.
          </p>
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#059669]">Pass Rate: 94.2% Optimal</span>
            <button
              type="button"
              onClick={() => handleExport("QC")}
              className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
