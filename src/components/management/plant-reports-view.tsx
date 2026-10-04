"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Printer,
  Download,
  LayoutGrid,
  Table as TableIcon,
  FileSpreadsheet,
  FileText,
  Calendar,
  CheckCircle2,
  Zap,
  ShieldCheck,
} from "lucide-react";

interface ExecutiveReport {
  id: string;
  ref: string;
  title: string;
  department: string;
  badgeStyle: "emerald" | "charcoal" | "neutral";
  description: string;
  getMetric: (period: "TODAY" | "WEEK" | "MONTH") => string;
  metricHighlight?: boolean;
  frequency: string;
  lastGenerated: string;
}

const EXECUTIVE_REPORTS: ExecutiveReport[] = [
  {
    id: "rep-1",
    ref: "PRD-REP-01",
    title: "Daily Production, Machine Uptime & Mass Yield",
    department: "Production",
    badgeStyle: "emerald",
    description:
      "Summary of biomass extruded across Line 1 (CPM) & Line 2 (Buhler), die motor amperage, rotary dryer thermal energy consumption, and total sieve fines recycled.",
    getMetric: (p) =>
      p === "TODAY"
        ? "72.0 MT / 100 MT Target"
        : p === "WEEK"
        ? "498.5 MT / 600 MT Target"
        : "2,140.0 MT / 2,500 MT Target",
    frequency: "Every Shift",
    lastGenerated: "Today, 12:30 PM",
  },
  {
    id: "rep-2",
    ref: "INV-VAL-02",
    title: "Location-Wise Biomass Stock Valuation Ledger",
    department: "Inventory",
    badgeStyle: "emerald",
    description:
      "Comprehensive audit of raw material tonnage across Yard A, Warehouse 1, Shed 2, and Yard B with FIFO purchase rates and total stock valuation.",
    getMetric: (p) =>
      p === "TODAY"
        ? "385.0 MT (₹15.2 Lakhs)"
        : p === "WEEK"
        ? "385.0 MT (₹15.2 Lakhs)"
        : "410.0 MT (₹16.1 Lakhs)",
    frequency: "Daily Closing",
    lastGenerated: "Today, 06:00 AM",
  },
  {
    id: "rep-3",
    ref: "SLS-DIS-03",
    title: "Commercial Sales Fulfillment & Invoicing",
    department: "Sales & Dispatch",
    badgeStyle: "charcoal",
    description:
      "Customer contract fulfillment tracker, dispatched tonnages, transport vehicles, e-way bills, commercial tax invoice totals, and outstanding collections.",
    getMetric: (p) =>
      p === "TODAY"
        ? "3 Trucks (65.0 MT)"
        : p === "WEEK"
        ? "22 Trucks (475.0 MT)"
        : "94 Trucks (2,050.0 MT)",
    frequency: "Real-Time / Dispatch",
    lastGenerated: "Today, 11:45 AM",
  },
  {
    id: "rep-4",
    ref: "QC-QA-04",
    title: "Central Laboratory QC Defect & Variance Audit",
    department: "Quality Assurance",
    badgeStyle: "emerald",
    description:
      "Statistical distribution of inbound moisture%, ash%, and GCV values vs supplier reliability rankings; finished pellet mechanical durability and compliance rates.",
    getMetric: (p) =>
      p === "TODAY"
        ? "Pass Rate: 94.2% Optimal"
        : p === "WEEK"
        ? "Pass Rate: 96.1% Optimal"
        : "Pass Rate: 95.4% Optimal",
    metricHighlight: true,
    frequency: "Per Batch / Lot",
    lastGenerated: "Today, 10:15 AM",
  },
  {
    id: "rep-5",
    ref: "ENG-PWR-05",
    title: "Electrical Energy & Boiler Biomass Consumption",
    department: "Energy & Utilities",
    badgeStyle: "neutral",
    description:
      "Specific electrical consumption (kWh/MT) across pellet mills, hammer mills, dryer ID fans, and husk boiler solid-fuel steam heat transfer efficiency.",
    getMetric: (p) =>
      p === "TODAY"
        ? "84.5 kWh/MT (Target < 90)"
        : p === "WEEK"
        ? "86.2 kWh/MT (Target < 90)"
        : "85.8 kWh/MT (Target < 90)",
    frequency: "Daily 24H Cycle",
    lastGenerated: "Today, 07:00 AM",
  },
  {
    id: "rep-6",
    ref: "AUD-TRC-06",
    title: "End-to-End Lot Traceability & Compliance Trail",
    department: "Compliance",
    badgeStyle: "emerald",
    description:
      "Bidirectional digital lineage audit linking farmer/supplier weighment slips, production batch formulation recipes, and customer delivery certificates.",
    getMetric: () => "100% Traceable (Zero Gaps)",
    metricHighlight: true,
    frequency: "Continuous Audit",
    lastGenerated: "Today, 12:00 PM",
  },
];

export function PlantReportsView() {
  const [period, setPeriod] = useState<"TODAY" | "WEEK" | "MONTH">("TODAY");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const handleExport = (reportRef: string) => {
    window.print();
  };

  const renderBadge = (dept: string, style: "emerald" | "charcoal" | "neutral") => {
    if (style === "emerald") {
      return (
        <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
          {dept}
        </span>
      );
    }
    if (style === "charcoal") {
      return (
        <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5">
          {dept}
        </span>
      );
    }
    return (
      <span className="border border-neutral-300 bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase px-2 py-0.5">
        {dept}
      </span>
    );
  };

  const renderReportCard = (report: ExecutiveReport) => (
    <div
      key={report.id}
      className="bg-white/40 border border-neutral-300 hover:border-neutral-900 transition-all p-5 space-y-4 flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-neutral-200">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 block">
              {report.ref}
            </span>
            <h3 className="font-bold text-base text-neutral-900 leading-snug mt-0.5">
              {report.title}
            </h3>
          </div>
          {renderBadge(report.department, report.badgeStyle)}
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed">
          {report.description}
        </p>
      </div>

      <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">
            {period === "TODAY" ? "Today" : period === "WEEK" ? "7-Day Total" : "MTD Total"}
          </span>
          <span
            className={`text-xs font-mono font-bold ${
              report.metricHighlight ? "text-[#059669]" : "text-neutral-900"
            }`}
          >
            {report.getMetric(period)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleExport(report.ref)}
          className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print PDF</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER (Directly on Canvas) */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
              Plant Operational Audits &amp; Executive Reports
            </h1>
            <span className="text-xs font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {EXECUTIVE_REPORTS.length}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Audit-ready export suite covering Production, Inventory, Quality, Energy, and Compliance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Selector */}
          <div className="inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
            {(["TODAY", "WEEK", "MONTH"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  period === p
                    ? "bg-[#18181B] text-white"
                    : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {p === "TODAY" ? "Today" : p === "WEEK" ? "7 Days" : "Month"}
              </button>
            ))}
          </div>

          {/* Mandatory Desktop Dual View Switcher */}
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
      </div>

      {/* 2. DUAL VIEW: CARDS vs TABLE */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXECUTIVE_REPORTS.map(renderReportCard)}
        </div>
      ) : (
        <div>
          {/* Desktop Table View */}
          <div className="hidden sm:block border border-neutral-300 overflow-x-auto bg-transparent">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Ref ID</th>
                  <th className="py-2.5 px-3">Report Title &amp; Scope</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">
                    {period === "TODAY" ? "Today Metric" : period === "WEEK" ? "7-Day Metric" : "MTD Metric"}
                  </th>
                  <th className="py-2.5 px-3">Cadence</th>
                  <th className="py-2.5 px-3">Last Generated</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {EXECUTIVE_REPORTS.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-neutral-200/40 transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-neutral-900">
                      {report.ref}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-neutral-900">
                        {report.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 line-clamp-1 max-w-md">
                        {report.description}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {renderBadge(report.department, report.badgeStyle)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      <span
                        className={
                          report.metricHighlight ? "text-[#059669]" : "text-neutral-900"
                        }
                      >
                        {report.getMetric(period)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-neutral-600">
                      {report.frequency}
                    </td>
                    <td className="py-3 px-3 text-neutral-500">
                      {report.lastGenerated}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleExport(report.ref)}
                        className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Fallback: Touch Cards (≤ 640px) */}
          <div className="grid grid-cols-1 sm:hidden gap-3">
            {EXECUTIVE_REPORTS.map(renderReportCard)}
          </div>
        </div>
      )}
    </div>
  );
}

