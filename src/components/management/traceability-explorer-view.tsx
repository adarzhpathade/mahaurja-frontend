"use client";

import React, { useState } from "react";
import {
  GitFork,
  ArrowRight,
  ArrowDown,
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
} from "lucide-react";

export function TraceabilityExplorerView() {
  const [traceDirection, setTraceDirection] = useState<"REVERSE" | "FORWARD">("REVERSE");
  const [query, setQuery] = useState("DIS-261002-001");

  return (
    <div className="space-y-6 select-none">
      {/* Executive Command Header */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Digital Traceability Explorer
        </h1>

        {/* Direction Switcher */}
        <div className="inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
          <button
            type="button"
            onClick={() => {
              setTraceDirection("REVERSE");
              setQuery("DIS-261002-001");
            }}
            className={`px-3 flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
              traceDirection === "REVERSE"
                ? "bg-[#18181B] text-white font-semibold"
                : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            <span>Reverse: Customer &rarr; Supplier</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTraceDirection("FORWARD");
              setQuery("RMLOT-GS-261004-001");
            }}
            className={`px-3 flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
              traceDirection === "FORWARD"
                ? "bg-[#18181B] text-white font-semibold"
                : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            <span>Forward: Supplier &rarr; Customer</span>
          </button>
        </div>
      </div>

      {/* Query Search Bar */}
      <div className="bg-white border border-neutral-300 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Dispatch No, Batch ID, Lot ID, Customer..."
            className="h-10 w-full pl-9 pr-3 bg-neutral-50 border border-neutral-300 text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <span>Preset Examples:</span>
          <button
            type="button"
            onClick={() => {
              setTraceDirection("REVERSE");
              setQuery("DIS-261002-001");
            }}
            className="px-2 py-1 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 font-mono text-[11px]"
          >
            DIS-261002-001
          </button>
          <button
            type="button"
            onClick={() => {
              setTraceDirection("FORWARD");
              setQuery("RMLOT-GS-261004-001");
            }}
            className="px-2 py-1 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 font-mono text-[11px]"
          >
            RMLOT-GS-261004-001
          </button>
        </div>
      </div>

      {/* Interactive Trace Chain (PDF Sec 34) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            {traceDirection === "REVERSE"
              ? "Reverse Trace Hierarchy (Downstream Delivery to Upstream Harvest)"
              : "Forward Trace Hierarchy (Upstream Raw Biomass to Downstream Customer Boiler)"}
          </h2>
          <span className="text-xs font-mono text-[#059669] font-bold">
            6 Levels of Metrological Verification
          </span>
        </div>

        {traceDirection === "REVERSE" ? (
          /* REVERSE TRACE FLOW */
          <div className="space-y-3">
            {/* Level 1: Customer Delivery */}
            <div className="bg-white border-l-4 border-l-[#18181B] border border-neutral-300 p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-neutral-500 block">Level 1 · Customer Delivery &amp; POD (PDF Sec 32)</span>
                  <h3 className="text-base font-bold text-neutral-900">ABC Industries Pvt. Ltd.</h3>
                </div>
                <span className="border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5">
                  15.0 MT Received
                </span>
              </div>
              <p className="text-xs text-neutral-600">
                Delivered at MIDC Kurkumbh boiler station. POD signed by K. R. Kulkarni. No fines detected.
              </p>
            </div>

            <div className="flex justify-center text-neutral-400">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* Level 2: Dispatch Plan & Vehicle */}
            <div className="bg-white border-l-4 border-l-[#18181B] border border-neutral-300 p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-neutral-500 block">Level 2 · Dispatch Transaction (PDF Sec 26 &amp; 28)</span>
                  <h3 className="font-mono text-base font-bold text-neutral-900">Dispatch DIS-261002-001 · SO-261002-015</h3>
                </div>
                <span className="font-mono text-xs font-bold text-neutral-800">
                  Vehicle: MH 12 RN 4821
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-neutral-700 pt-1">
                <div><span>Gross Weight:</span> <strong className="font-mono text-neutral-900">27,850 kg</strong></div>
                <div><span>Tare Weight:</span> <strong className="font-mono text-neutral-900">12,850 kg</strong></div>
                <div><span>Net Quantity:</span> <strong className="font-mono text-[#059669]">15,000 kg (15 MT)</strong></div>
                <div><span>Weighbridge Slip:</span> <strong className="font-mono text-neutral-900">WB-DIS-261003-001</strong></div>
              </div>
            </div>

            <div className="flex justify-center text-neutral-400">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* Level 3: Finished Goods Batch */}
            <div className="bg-white border-l-4 border-l-[#059669] border border-neutral-300 p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-neutral-500 block">Level 3 · Finished Goods Batch &amp; QC (PDF Sec 21 &amp; 22)</span>
                  <h3 className="font-mono text-base font-bold text-neutral-900">FG Batch: FG-BATCH-261003-009</h3>
                </div>
                <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
                  COA-261003-001 Issued
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-neutral-700 pt-1">
                <div><span>Product:</span> <strong className="text-neutral-900">8mm Biomass Pellet</strong></div>
                <div><span>GCV Tested:</span> <strong className="font-mono text-emerald-700">4,320 kcal/kg</strong></div>
                <div><span>Moisture:</span> <strong className="font-mono text-neutral-900">6.8%</strong></div>
                <div><span>Packaging:</span> <strong className="text-neutral-900">50 kg HDPE Bags (900 bags)</strong></div>
              </div>
            </div>

            <div className="flex justify-center text-neutral-400">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* Level 4: Production Run */}
            <div className="bg-white border-l-4 border-l-[#059669] border border-neutral-300 p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-neutral-500 block">Level 4 · Pelletising Production Run (PDF Sec 18)</span>
                  <h3 className="font-mono text-base font-bold text-neutral-900">Production Batch: PB-261003-009</h3>
                </div>
                <span className="text-xs font-semibold text-neutral-800">
                  Line 1 (CPM 7932 Mill)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-neutral-700 pt-1">
                <div><span>Total Input:</span> <strong className="font-mono text-neutral-900">48.0 MT</strong></div>
                <div><span>Good Pellets:</span> <strong className="font-mono text-neutral-900">45.0 MT</strong></div>
                <div><span>Net Conversion Yield:</span> <strong className="font-mono text-[#059669]">93.75%</strong></div>
              </div>
            </div>

            <div className="flex justify-center text-neutral-400">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* Level 5: Production Formula */}
            <div className="bg-white border-l-4 border-l-blue-600 border border-neutral-300 p-4 space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-500 block">Level 5 · Production Formula &amp; Blending Recipe (PDF Sec 12 &amp; 17)</span>
                <h3 className="text-base font-bold text-neutral-900">Standard High-Caloric Blend (50% GS + 25% CS + 25% WD)</h3>
              </div>
              <p className="text-xs text-neutral-600">
                Mix homogeneity 98.5%. Triple-pass rotary drying reduced moisture from 14.2% to 9.1%.
              </p>
            </div>

            <div className="flex justify-center text-neutral-400">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* Level 6: Source Raw Material Lots & Suppliers */}
            <div className="bg-white border-l-4 border-l-emerald-600 border border-neutral-300 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-neutral-500 block">Level 6 · Source Raw Material Lots &amp; Suppliers (PDF Sec 2, 4, 6 &amp; 9)</span>
                  <h3 className="text-base font-bold text-neutral-900">Consumed Biomass Batches (3 Sources)</h3>
                </div>
                <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
                  Full Supplier Trace Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="font-mono font-bold text-neutral-900 block">RMLOT-GS-261003-001 (Groundnut Shell)</span>
                  <p className="text-neutral-600">Supplier: <strong>Ramesh Agro Biomass Traders</strong></p>
                  <p className="font-mono text-[11px] text-neutral-500">Vehicle: MH 12 RN 4821 · WB: 28,450 kg</p>
                  <p className="font-mono text-[11px] text-emerald-700">QC: QC-261002-001 (M:9.5%, Ash:5.8%)</p>
                </div>

                <div className="p-2.5 bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="font-mono font-bold text-neutral-900 block">RMLOT-CS-261003-002 (Cashew Shell)</span>
                  <p className="text-neutral-600">Supplier: <strong>Sanjay Cashew Processors</strong></p>
                  <p className="font-mono text-[11px] text-neutral-500">Vehicle: MH 04 AB 9021 · WB: 31,200 kg</p>
                  <p className="font-mono text-[11px] text-emerald-700">QC: QC-261002-002 (M:11.2%, GCV:4120)</p>
                </div>

                <div className="p-2.5 bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="font-mono font-bold text-neutral-900 block">RMLOT-WD-261003-018 (Wood Shavings)</span>
                  <p className="text-neutral-600">Supplier: <strong>Kisan Biomass Supply Co.</strong></p>
                  <p className="font-mono text-[11px] text-neutral-500">Vehicle: MH 15 BX 3390 · WB: 26,800 kg</p>
                  <p className="font-mono text-[11px] text-emerald-700">QC: QC-261003-018 (M:9.4%, GCV:4280)</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* FORWARD TRACE FLOW */
          <div className="space-y-3">
            <div className="bg-white border-l-4 border-l-emerald-600 border border-neutral-300 p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Step 1 · Supplier &amp; Raw Material Lot</span>
              <h3 className="font-mono text-base font-bold text-neutral-900">RMLOT-GS-261004-001 (Ramesh Agro Biomass Traders)</h3>
              <p className="text-xs text-neutral-600">18.25 MT Groundnut Shell received via MH 12 RN 4821 on 04 Oct 2026. QC passed.</p>
            </div>
            <div className="flex justify-center text-neutral-400"><ArrowDown className="w-5 h-5" /></div>

            <div className="bg-white border-l-4 border-l-blue-600 border border-neutral-300 p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Step 2 · Plant Issue &amp; Production Batch</span>
              <h3 className="font-mono text-base font-bold text-neutral-900">Production Batch: PB-261004-001</h3>
              <p className="text-xs text-neutral-600">Allocated to Shift 01 Morning Plan. 30.0 MT consumed in blending formula.</p>
            </div>
            <div className="flex justify-center text-neutral-400"><ArrowDown className="w-5 h-5" /></div>

            <div className="bg-white border-l-4 border-l-[#059669] border border-neutral-300 p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Step 3 · Finished Goods Batch</span>
              <h3 className="font-mono text-base font-bold text-neutral-900">FG Batch: FG-BATCH-261004-001 (60 MT 8mm Pellets)</h3>
              <p className="text-xs text-neutral-600">Cooling silo discharge. QC Release pending in Central Lab.</p>
            </div>
            <div className="flex justify-center text-neutral-400"><ArrowDown className="w-5 h-5" /></div>

            <div className="bg-white border-l-4 border-l-[#18181B] border border-neutral-300 p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Step 4 · Sales Fulfillment</span>
              <h3 className="font-mono text-base font-bold text-neutral-900">Sales Order SO-261002-015 &rarr; ABC Industries Pvt. Ltd.</h3>
              <p className="text-xs text-neutral-600">Reserved for 20 MT outbound dispatch scheduled for 04 Oct 02:00 PM.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
