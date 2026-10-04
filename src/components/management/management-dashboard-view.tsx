"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  Truck,
  FlaskConical,
  Warehouse,
  Factory,
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
  Send,
  DollarSign,
  TrendingUp,
  GitFork,
  ArrowRight,
} from "lucide-react";

export function ManagementDashboardView() {
  return (
    <div className="space-y-6 select-none">
      {/* Executive Command Header */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Executive Cockpit
        </h1>

        {/* Rapid Launchpad */}
        <div className="flex items-center gap-2">
          <Link
            href="/management/traceability"
            className="h-10 px-4 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
          >
            <GitFork className="w-4 h-4 text-emerald-400" />
            <span>Traceability Explorer</span>
          </Link>
          <Link
            href="/management/reports/cost-yield"
            className="h-10 px-4 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-[#059669]" />
            <span>Cost &amp; Yield</span>
          </Link>
        </div>
      </div>

      {/* 11 CORE OPERATIONAL KPIS DIRECTLY FROM PDF SECTION 37 (Page 23) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#059669]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            PDF Section 37 Core Telemetry Matrix
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* KPI 1 */}
          <div className="bg-white border border-neutral-300 p-4 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              1. Vehicles Inside Plant
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-black text-3xl text-neutral-900">4</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200">
                Gate &amp; Yards
              </span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white border border-neutral-300 p-4 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              2. Raw Material Awaiting QC
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-black text-3xl text-amber-700">2</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200">
                Lots Pending
              </span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white border border-neutral-300 p-4 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              3. Raw Material Available
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-black text-3xl text-neutral-900">385 MT</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-[#047857] border border-emerald-200">
                Usable Stock
              </span>
            </div>
          </div>

          {/* KPI 4 & 5 */}
          <div className="bg-white border border-neutral-300 p-4 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              4 &amp; 5. Production Today vs Target
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-black text-3xl text-[#059669]">72 / 100 MT</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-[#047857] border border-emerald-200">
                72% Output
              </span>
            </div>
          </div>

          {/* KPI 6 */}
          <div className="bg-white border border-neutral-300 p-4 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              6. FG Awaiting QC
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-black text-3xl text-blue-700">18 MT</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200">
                Cooling Bay
              </span>
            </div>
          </div>

          {/* KPI 7 */}
          <div className="bg-white border border-neutral-300 p-4 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              7. Finished Goods Stock
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-black text-3xl text-neutral-900">245 MT</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-200">
                In Shed 01
              </span>
            </div>
          </div>

          {/* KPI 8 */}
          <div className="bg-white border border-neutral-300 p-4 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              8. Orders Pending
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-black text-3xl text-neutral-900">180 MT</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200">
                Commitments
              </span>
            </div>
          </div>

          {/* KPI 9 & 10 */}
          <div className="bg-white border border-neutral-300 p-4 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              9 &amp; 10. Dispatches Today
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-black text-3xl text-[#059669]">3 / 65 MT</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-[#047857] border border-emerald-200">
                Dispatched
              </span>
            </div>
          </div>

          {/* KPI 11 */}
          <div className="bg-white border border-neutral-300 p-4 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              11. Outstanding Receivables
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-black text-3xl text-neutral-900">₹4.85 L</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-200">
                Current Due
              </span>
            </div>
          </div>

          {/* Unit Economics 1 */}
          <div className="bg-white border border-neutral-300 p-4 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Raw Material Average Cost
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-black text-3xl text-neutral-900">₹3,950</span>
              <span className="text-[10px] text-neutral-500 font-mono">per MT</span>
            </div>
          </div>

          {/* Unit Economics 2 */}
          <div className="bg-white border border-neutral-300 p-4 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Production Conversion Cost
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-black text-3xl text-neutral-900">₹1,200</span>
              <span className="text-[10px] text-neutral-500 font-mono">per MT</span>
            </div>
          </div>

          {/* Operational Margin */}
          <div className="bg-white border border-neutral-300 p-4 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Net Plant Operational Margin
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-black text-3xl text-[#059669]">₹1,750</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-[#047857] border border-emerald-200">
                25.3% Gross
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Physical-to-Digital Status Stream */}
      <section className="bg-white border border-neutral-300 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#059669]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Plant Operational Stage Pulse (PDF Sec 38 Rule)
            </h3>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            &ldquo;What happened physically, and what corresponding digital transaction happened?&rdquo;
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase">Inbound Gate &amp; WB</span>
            <p className="font-semibold text-neutral-900">MH 12 RN 4821</p>
            <p className="text-neutral-600">Tare Weighed (10,200 kg) &rarr; Net Accepted 18.25 MT.</p>
            <span className="text-[10px] text-[#047857] font-bold block pt-1">RM Receipt Created</span>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase">Quality Lab (Sec 6)</span>
            <p className="font-semibold text-neutral-900">QC-261004-001</p>
            <p className="text-neutral-600">Moisture 9.5%, Ash 5.8%, GCV 4150 kcal/kg.</p>
            <span className="text-[10px] text-[#047857] font-bold block pt-1">Approved &rarr; Lot Formed</span>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase">Pellet Line 1 (Sec 18)</span>
            <p className="font-semibold text-neutral-900">PB-261004-001</p>
            <p className="text-neutral-600">Extrusion at 320A · 8.05mm diameter · 38.5 MT output.</p>
            <span className="text-[10px] text-amber-700 font-bold block pt-1">Cooling In Progress</span>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase">Outbound Dispatch (Sec 32)</span>
            <p className="font-semibold text-neutral-900">DIS-261002-001</p>
            <p className="text-neutral-600">15.0 MT delivered to ABC Industries Pvt. Ltd.</p>
            <span className="text-[10px] text-[#047857] font-bold block pt-1">POD Signed &amp; Closed</span>
          </div>
        </div>
      </section>
    </div>
  );
}
