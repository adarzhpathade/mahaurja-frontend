"use client";

import React, { useState } from "react";
import {
  GitFork,
  Search,
  CheckCircle2,
  Users,
  Truck,
  Scale,
  FlaskConical,
  Factory,
  PackageCheck,
  ShoppingBag,
  RotateCcw,
  Layers,
  ArrowRight,
} from "lucide-react";

export function TraceabilityExplorerView() {
  const [traceDirection, setTraceDirection] = useState<"REVERSE" | "FORWARD">("REVERSE");
  const [query, setQuery] = useState("DIS-261002-001");

  return (
    <div className="space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Digital Traceability Explorer
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Bi-directional audit chain linking farm suppliers, production runs, and customer deliveries.
          </p>
        </div>

        {/* Direction Switcher (Desktop) */}
        <div className="hidden sm:inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10 bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setTraceDirection("REVERSE");
              setQuery("DIS-261002-001");
            }}
            className={`px-3.5 flex items-center gap-1.5 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              traceDirection === "REVERSE"
                ? "bg-[#18181B] text-white"
                : "text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reverse Trace</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTraceDirection("FORWARD");
              setQuery("RMLOT-GS-261004-001");
            }}
            className={`px-3.5 flex items-center gap-1.5 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              traceDirection === "FORWARD"
                ? "bg-[#18181B] text-white"
                : "text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Forward Trace</span>
          </button>
        </div>
      </div>

      {/* Direction Switcher (Mobile) */}
      <div className="sm:hidden flex border border-neutral-300 divide-x divide-neutral-300 text-xs w-full h-11 bg-white shadow-2xs">
        <button
          type="button"
          onClick={() => {
            setTraceDirection("REVERSE");
            setQuery("DIS-261002-001");
          }}
          className={`flex-1 px-3 flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            traceDirection === "REVERSE"
              ? "bg-[#18181B] text-white"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reverse Trace</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setTraceDirection("FORWARD");
            setQuery("RMLOT-GS-261004-001");
          }}
          className={`flex-1 px-3 flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            traceDirection === "FORWARD"
              ? "bg-[#18181B] text-white"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>Forward Trace</span>
        </button>
      </div>

      {/* 2. UNIFIED SEARCH & QUICK PRESETS CONSOLE */}
      <div className="bg-white border border-neutral-300 p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Dispatch, Batch, Lot ID, Customer..."
            className="h-10 w-full pl-9 pr-3 bg-neutral-50 border border-neutral-300 text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 shrink-0">
            Presets:
          </span>
          <button
            type="button"
            onClick={() => {
              setTraceDirection("REVERSE");
              setQuery("DIS-261002-001");
            }}
            className={`px-3 py-1.5 text-xs font-mono font-semibold border transition-colors cursor-pointer shrink-0 ${
              query === "DIS-261002-001" && traceDirection === "REVERSE"
                ? "bg-[#18181B] text-white border-[#18181B]"
                : "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            DIS-261002-001 (Dispatch)
          </button>
          <button
            type="button"
            onClick={() => {
              setTraceDirection("FORWARD");
              setQuery("RMLOT-GS-261004-001");
            }}
            className={`px-3 py-1.5 text-xs font-mono font-semibold border transition-colors cursor-pointer shrink-0 ${
              query === "RMLOT-GS-261004-001" && traceDirection === "FORWARD"
                ? "bg-[#18181B] text-white border-[#18181B]"
                : "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            RMLOT-GS-261004-001 (Lot)
          </button>
        </div>
      </div>

      {/* 3. CHAIN STATUS HEADER */}
      <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-[#059669] shrink-0" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            {traceDirection === "REVERSE" ? "Reverse Trace Chain" : "Forward Trace Chain"}
          </h2>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
            {traceDirection === "REVERSE" ? "Customer → Farm" : "Farm → Customer"}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-[#059669] hidden sm:inline">
          {traceDirection === "REVERSE" ? "6 Verified Metrological Stages" : "4 Verified Operational Stages"}
        </span>
      </div>

      {/* 4. CONNECTED TIMELINE PIPELINE */}
      <div className="relative pl-7 sm:pl-9 border-l-2 border-neutral-300 ml-3.5 sm:ml-5 space-y-6 sm:space-y-7">
        {traceDirection === "REVERSE" ? (
          /* ========================================================================= */
          /* REVERSE TRACE CHAIN (Downstream Customer -> Upstream Farm Harvest)         */
          /* ========================================================================= */
          <>
            {/* Step 1: Customer Delivery & POD */}
            <div className="relative">
              <div className="absolute -left-[41px] sm:-left-[49px] top-4 w-7 h-7 sm:w-8 sm:h-8 bg-[#18181B] text-white border-2 border-white flex items-center justify-center font-mono font-black text-xs shadow-xs">
                1
              </div>
              <div className="bg-white border border-neutral-300 hover:border-neutral-900 transition-colors p-4 sm:p-5 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-neutral-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#059669] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Step 1 · Customer Delivery &amp; POD
                    </span>
                  </div>
                  <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5 self-start sm:self-auto">
                    15.0 MT Delivered
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                    ABC Industries Pvt. Ltd.
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Delivered to MIDC Kurkumbh boiler station. Proof of Delivery signed by K. R. Kulkarni. Zero fines or moisture rejection.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Customer</span>
                    <span className="font-semibold text-xs text-neutral-900 block mt-0.5 truncate">ABC Industries</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Destination</span>
                    <span className="font-semibold text-xs text-neutral-900 block mt-0.5 truncate">MIDC Kurkumbh</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Accepted Weight</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#059669] block mt-0.5 tabular-nums">15.0 MT</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">POD Status</span>
                    <span className="font-semibold text-xs text-neutral-900 block mt-0.5">Signed &amp; Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Dispatch Transaction & Weighment */}
            <div className="relative">
              <div className="absolute -left-[41px] sm:-left-[49px] top-4 w-7 h-7 sm:w-8 sm:h-8 bg-[#18181B] text-white border-2 border-white flex items-center justify-center font-mono font-black text-xs shadow-xs">
                2
              </div>
              <div className="bg-white border border-neutral-300 hover:border-neutral-900 transition-colors p-4 sm:p-5 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-neutral-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#059669] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Step 2 · Dispatch Transaction &amp; Weighbridge Metrology
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs text-neutral-800 self-start sm:self-auto">
                    Vehicle: MH 12 RN 4821
                  </span>
                </div>

                <div>
                  <h3 className="font-mono text-sm sm:text-base font-black text-neutral-900 tracking-tight">
                    DIS-261002-001 · SO-261002-015
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Certified weighbridge gross and tare weighing completed on Outbound Scale Platform WB-02.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Gross Weight</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 block mt-0.5 tabular-nums">27,850 kg</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Tare Weight</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 block mt-0.5 tabular-nums">12,850 kg</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Net Quantity</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#059669] block mt-0.5 tabular-nums">15,000 kg (15 MT)</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">WB Slip</span>
                    <span className="font-mono font-semibold text-xs text-neutral-900 block mt-0.5 truncate">WB-DIS-261003-001</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Finished Goods Batch & QC */}
            <div className="relative">
              <div className="absolute -left-[41px] sm:-left-[49px] top-4 w-7 h-7 sm:w-8 sm:h-8 bg-[#059669] text-white border-2 border-white flex items-center justify-center font-mono font-black text-xs shadow-xs">
                3
              </div>
              <div className="bg-white border border-neutral-300 hover:border-neutral-900 transition-colors p-4 sm:p-5 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-neutral-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-[#059669] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Step 3 · Finished Goods Batch &amp; QC Release
                    </span>
                  </div>
                  <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5 self-start sm:self-auto">
                    COA-261003-001 Approved
                  </span>
                </div>

                <div>
                  <h3 className="font-mono text-sm sm:text-base font-black text-neutral-900 tracking-tight">
                    FG-BATCH-261003-009
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Quality inspection verified 8.05mm pellets meeting calorific and moisture export standards.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Product</span>
                    <span className="font-semibold text-xs text-neutral-900 block mt-0.5">8mm Pellet</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">GCV Value</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-emerald-700 block mt-0.5 tabular-nums">4,320 kcal/kg</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Moisture</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 block mt-0.5 tabular-nums">6.8%</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Packaging</span>
                    <span className="font-semibold text-xs text-neutral-900 block mt-0.5 truncate">50 kg HDPE (300 bags)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Pelletising Production Run */}
            <div className="relative">
              <div className="absolute -left-[41px] sm:-left-[49px] top-4 w-7 h-7 sm:w-8 sm:h-8 bg-[#059669] text-white border-2 border-white flex items-center justify-center font-mono font-black text-xs shadow-xs">
                4
              </div>
              <div className="bg-white border border-neutral-300 hover:border-neutral-900 transition-colors p-4 sm:p-5 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-neutral-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-[#059669] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Step 4 · Pelletising Production Run
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-800 self-start sm:self-auto">
                    Line 1 (CPM 7932 Mill)
                  </span>
                </div>

                <div>
                  <h3 className="font-mono text-sm sm:text-base font-black text-neutral-900 tracking-tight">
                    PB-261003-009
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Shift 01 production run with 320A die motor amperage and continuous temperature screening.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Total Input</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 block mt-0.5 tabular-nums">48.0 MT</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Good Output</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 block mt-0.5 tabular-nums">45.0 MT</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Yield</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#059669] block mt-0.5 tabular-nums">93.75% Net</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Recycled Fines</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-700 block mt-0.5 tabular-nums">1.5 MT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Production Formula */}
            <div className="relative">
              <div className="absolute -left-[41px] sm:-left-[49px] top-4 w-7 h-7 sm:w-8 sm:h-8 bg-[#18181B] text-white border-2 border-white flex items-center justify-center font-mono font-black text-xs shadow-xs">
                5
              </div>
              <div className="bg-white border border-neutral-300 hover:border-neutral-900 transition-colors p-4 sm:p-5 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-neutral-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#059669] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Step 5 · Blending Recipe &amp; Thermal Drying
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-neutral-800 self-start sm:self-auto">
                    Homogeneity: 98.5%
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black text-neutral-900 tracking-tight">
                    Standard High-Caloric Blend (50% GS + 25% CS + 25% WD)
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Triple-pass rotary drying reduced moisture from 14.2% down to 9.1% before fine grinding.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Groundnut Shell</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 block mt-0.5">50% Blend</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Cashew Shell</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 block mt-0.5">25% Blend</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Wood Shavings</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 block mt-0.5">25% Blend</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Moisture Drop</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#059669] block mt-0.5">14.2% &rarr; 9.1%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6: Source Raw Material Lots */}
            <div className="relative">
              <div className="absolute -left-[41px] sm:-left-[49px] top-4 w-7 h-7 sm:w-8 sm:h-8 bg-[#059669] text-white border-2 border-white flex items-center justify-center font-mono font-black text-xs shadow-xs">
                6
              </div>
              <div className="bg-white border border-neutral-300 hover:border-neutral-900 transition-colors p-4 sm:p-5 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-neutral-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#059669] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Step 6 · Source Farm &amp; Aggregator Lots
                    </span>
                  </div>
                  <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5 self-start sm:self-auto">
                    100% Trace Verified
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black text-neutral-900 tracking-tight">
                    Consumed Biomass Batches (3 Approved Sources)
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Every kilogram is digitally linked to verified inbound gate passes, weighbridge slips, and lab tests.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-neutral-900">RMLOT-GS-261003-001</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 bg-emerald-100 text-[#047857]">GS Shell</span>
                    </div>
                    <p className="text-xs text-neutral-700 font-medium">Ramesh Agro Biomass Traders</p>
                    <p className="font-mono text-[11px] text-neutral-500">MH 12 RN 4821 · 28,450 kg</p>
                    <p className="font-mono text-[11px] text-emerald-700 font-semibold">QC: M 9.5%, Ash 5.8% (Pass)</p>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-neutral-900">RMLOT-CS-261003-002</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 bg-emerald-100 text-[#047857]">Cashew</span>
                    </div>
                    <p className="text-xs text-neutral-700 font-medium">Sanjay Cashew Processors</p>
                    <p className="font-mono text-[11px] text-neutral-500">MH 04 AB 9021 · 31,200 kg</p>
                    <p className="font-mono text-[11px] text-emerald-700 font-semibold">QC: M 11.2%, GCV 4120 (Pass)</p>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-neutral-900">RMLOT-WD-261003-018</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 bg-emerald-100 text-[#047857]">Wood</span>
                    </div>
                    <p className="text-xs text-neutral-700 font-medium">Kisan Biomass Supply Co.</p>
                    <p className="font-mono text-[11px] text-neutral-500">MH 15 BX 3390 · 26,800 kg</p>
                    <p className="font-mono text-[11px] text-emerald-700 font-semibold">QC: M 9.4%, GCV 4280 (Pass)</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* FORWARD TRACE CHAIN (Upstream Raw Biomass -> Downstream Customer Order)   */
          /* ========================================================================= */
          <>
            {/* Step 1: Supplier & Raw Material Lot */}
            <div className="relative">
              <div className="absolute -left-[41px] sm:-left-[49px] top-4 w-7 h-7 sm:w-8 sm:h-8 bg-[#059669] text-white border-2 border-white flex items-center justify-center font-mono font-black text-xs shadow-xs">
                1
              </div>
              <div className="bg-white border border-neutral-300 hover:border-neutral-900 transition-colors p-4 sm:p-5 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-neutral-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#059669] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Step 1 · Supplier &amp; Raw Material Inbound Lot
                    </span>
                  </div>
                  <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5 self-start sm:self-auto">
                    Approved Inbound
                  </span>
                </div>

                <div>
                  <h3 className="font-mono text-sm sm:text-base font-black text-neutral-900 tracking-tight">
                    RMLOT-GS-261004-001 (Groundnut Shell)
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    18.25 MT received from Ramesh Agro Biomass Traders via MH 12 RN 4821 on 04 Oct 2026.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Supplier</span>
                    <span className="font-semibold text-xs text-neutral-900 block mt-0.5 truncate">Ramesh Agro</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Accepted MT</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#059669] block mt-0.5 tabular-nums">18.25 MT</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Vehicle</span>
                    <span className="font-mono font-semibold text-xs text-neutral-900 block mt-0.5">MH 12 RN 4821</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">QC Decision</span>
                    <span className="font-semibold text-xs text-emerald-700 block mt-0.5">Approved Pass</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Plant Allocation & Production Run */}
            <div className="relative">
              <div className="absolute -left-[41px] sm:-left-[49px] top-4 w-7 h-7 sm:w-8 sm:h-8 bg-[#059669] text-white border-2 border-white flex items-center justify-center font-mono font-black text-xs shadow-xs">
                2
              </div>
              <div className="bg-white border border-neutral-300 hover:border-neutral-900 transition-colors p-4 sm:p-5 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-neutral-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-[#059669] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Step 2 · Plant Issue &amp; Production Batch
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-800 self-start sm:self-auto">
                    Line 1 (CPM Mill)
                  </span>
                </div>

                <div>
                  <h3 className="font-mono text-sm sm:text-base font-black text-neutral-900 tracking-tight">
                    PB-261004-001
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Allocated to Shift 01 Morning Plan. 30.0 MT consumed in standard blending formula.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Lot Share</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 block mt-0.5 tabular-nums">30.0 MT</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Shift Target</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 block mt-0.5 tabular-nums">100 MT Plan</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Die Amps</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#059669] block mt-0.5 tabular-nums">320A Optimal</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Stage</span>
                    <span className="font-semibold text-xs text-amber-700 block mt-0.5">Cooling Bay</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Finished Goods Batch */}
            <div className="relative">
              <div className="absolute -left-[41px] sm:-left-[49px] top-4 w-7 h-7 sm:w-8 sm:h-8 bg-[#059669] text-white border-2 border-white flex items-center justify-center font-mono font-black text-xs shadow-xs">
                3
              </div>
              <div className="bg-white border border-neutral-300 hover:border-neutral-900 transition-colors p-4 sm:p-5 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-neutral-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-[#059669] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Step 3 · Finished Goods Batch &amp; QC Quotas
                    </span>
                  </div>
                  <span className="border border-amber-300 bg-amber-50 text-amber-800 text-[10px] font-bold uppercase px-2 py-0.5 self-start sm:self-auto">
                    QC Pending
                  </span>
                </div>

                <div>
                  <h3 className="font-mono text-sm sm:text-base font-black text-neutral-900 tracking-tight">
                    FG-BATCH-261004-001 (60 MT 8mm Pellets)
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Cooling silo discharge completed. Official Certificate of Analysis sample being processed in Central Lab.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Produced Qty</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 block mt-0.5 tabular-nums">60.0 MT</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Diameter</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 block mt-0.5 tabular-nums">8.05 mm</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Location</span>
                    <span className="font-semibold text-xs text-neutral-900 block mt-0.5 truncate">Silo 01 Discharge</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Status</span>
                    <span className="font-semibold text-xs text-amber-700 block mt-0.5">Lab Testing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Sales Order Fulfillment */}
            <div className="relative">
              <div className="absolute -left-[41px] sm:-left-[49px] top-4 w-7 h-7 sm:w-8 sm:h-8 bg-[#18181B] text-white border-2 border-white flex items-center justify-center font-mono font-black text-xs shadow-xs">
                4
              </div>
              <div className="bg-white border border-neutral-300 hover:border-neutral-900 transition-colors p-4 sm:p-5 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-neutral-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#059669] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Step 4 · Sales Order Commitment
                    </span>
                  </div>
                  <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5 self-start sm:self-auto">
                    Scheduled Dispatch
                  </span>
                </div>

                <div>
                  <h3 className="font-mono text-sm sm:text-base font-black text-neutral-900 tracking-tight">
                    SO-261002-015 &rarr; ABC Industries Pvt. Ltd.
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Allocated for 20 MT outbound delivery scheduled for dispatch today at 02:00 PM.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Customer</span>
                    <span className="font-semibold text-xs text-neutral-900 block mt-0.5 truncate">ABC Industries</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Allocated Qty</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#059669] block mt-0.5 tabular-nums">20.0 MT</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Target GCV</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 block mt-0.5">&gt; 4,200 kcal</span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Dispatch Window</span>
                    <span className="font-semibold text-xs text-neutral-900 block mt-0.5">Today 02:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
