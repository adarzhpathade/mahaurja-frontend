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

        {/* Rapid Launchpad: Visible on Desktop/Tablet */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/management/reports/cost-yield"
            className="h-10 px-4 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-[#059669]" />
            <span>Cost &amp; Yield</span>
          </Link>
          <Link
            href="/management/traceability"
            className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <GitFork className="w-4 h-4" />
            <span>Traceability Explorer</span>
          </Link>
        </div>
      </div>

      {/* 2. MOBILE ACTION STACK (Gate UI Pattern) */}
      <div className="sm:hidden flex flex-col items-stretch gap-2.5 w-full">
        <Link
          href="/management/traceability"
          className="h-11 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs w-full"
        >
          <GitFork className="w-4 h-4" />
          <span>Traceability Explorer</span>
        </Link>
        <Link
          href="/management/reports/cost-yield"
          className="h-11 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full"
        >
          <TrendingUp className="w-4 h-4 text-[#059669]" />
          <span>Cost &amp; Yield</span>
        </Link>
      </div>

      {/* 11 CORE OPERATIONAL KPIS */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#059669] shrink-0" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Core Operational Telemetry
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* KPI 1 */}
          <div className="border border-neutral-300 p-3.5 sm:p-4 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
              Vehicles Inside Plant
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight tabular-nums">
                  4
                </span>
                <span className="text-xs sm:text-sm text-neutral-400 font-medium">Vehicles</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto shrink-0">
                Gate &amp; Yards
              </span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="border border-neutral-300 p-3.5 sm:p-4 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
              Raw Material Awaiting QC
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-black text-2xl sm:text-3xl text-amber-700 tracking-tight tabular-nums">
                  2
                </span>
                <span className="text-xs sm:text-sm text-neutral-400 font-medium">Lots</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 self-start sm:self-auto shrink-0">
                Lots Pending
              </span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="border border-neutral-300 p-3.5 sm:p-4 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
              Raw Material Available
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight tabular-nums">
                  385
                </span>
                <span className="text-xs sm:text-sm font-mono text-neutral-400 font-semibold">MT</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 bg-emerald-50 text-[#047857] border border-emerald-200 self-start sm:self-auto shrink-0">
                Usable Stock
              </span>
            </div>
          </div>

          {/* KPI 4 & 5 */}
          <div className="border border-neutral-300 p-3.5 sm:p-4 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
              Production Today vs Target
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-black text-2xl sm:text-3xl text-[#059669] tracking-tight tabular-nums">
                  72
                </span>
                <span className="text-xs sm:text-sm font-mono text-neutral-400 font-semibold">/ 100 MT</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 bg-emerald-50 text-[#047857] border border-emerald-200 self-start sm:self-auto shrink-0">
                72% Output
              </span>
            </div>
          </div>

          {/* KPI 6 */}
          <div className="border border-neutral-300 p-3.5 sm:p-4 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
              FG Awaiting QC
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-black text-2xl sm:text-3xl text-blue-700 tracking-tight tabular-nums">
                  18
                </span>
                <span className="text-xs sm:text-sm font-mono text-neutral-400 font-semibold">MT</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto shrink-0">
                Cooling Bay
              </span>
            </div>
          </div>

          {/* KPI 7 */}
          <div className="border border-neutral-300 p-3.5 sm:p-4 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
              Finished Goods Stock
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight tabular-nums">
                  245
                </span>
                <span className="text-xs sm:text-sm font-mono text-neutral-400 font-semibold">MT</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-200 self-start sm:self-auto shrink-0">
                In Shed 01
              </span>
            </div>
          </div>

          {/* KPI 8 */}
          <div className="border border-neutral-300 p-3.5 sm:p-4 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
              Orders Pending
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight tabular-nums">
                  180
                </span>
                <span className="text-xs sm:text-sm font-mono text-neutral-400 font-semibold">MT</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 self-start sm:self-auto shrink-0">
                Commitments
              </span>
            </div>
          </div>

          {/* KPI 9 & 10 */}
          <div className="border border-neutral-300 p-3.5 sm:p-4 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
              Dispatches Today
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-black text-2xl sm:text-3xl text-[#059669] tracking-tight tabular-nums">
                  3
                </span>
                <span className="text-xs sm:text-sm font-mono text-neutral-400 font-semibold">/ 65 MT</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 bg-emerald-50 text-[#047857] border border-emerald-200 self-start sm:self-auto shrink-0">
                Dispatched
              </span>
            </div>
          </div>

          {/* KPI 11 */}
          <div className="border border-neutral-300 p-3.5 sm:p-4 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
              Outstanding Receivables
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight tabular-nums">
                  ₹4.85
                </span>
                <span className="text-xs sm:text-sm font-mono text-neutral-400 font-semibold">Lakh</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-200 self-start sm:self-auto shrink-0">
                Current Due
              </span>
            </div>
          </div>

          {/* Unit Economics 1 */}
          <div className="border border-neutral-300 p-3.5 sm:p-4 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
              Raw Material Avg Cost
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight tabular-nums">
                ₹3,950
              </span>
              <span className="text-xs sm:text-sm text-neutral-400 font-mono font-semibold">/ MT</span>
            </div>
          </div>

          {/* Unit Economics 2 */}
          <div className="border border-neutral-300 p-3.5 sm:p-4 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
              Conversion Cost
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight tabular-nums">
                ₹1,200
              </span>
              <span className="text-xs sm:text-sm text-neutral-400 font-mono font-semibold">/ MT</span>
            </div>
          </div>

          {/* Operational Margin */}
          <div className="border border-neutral-300 p-3.5 sm:p-4 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
              Plant Net Margin
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-black text-2xl sm:text-3xl text-[#059669] tracking-tight tabular-nums">
                  ₹1,750
                </span>
                <span className="text-xs sm:text-sm font-mono text-neutral-400 font-semibold">/ MT</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 bg-emerald-50 text-[#047857] border border-emerald-200 self-start sm:self-auto shrink-0">
                25.3% Gross
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Physical-to-Digital Status Stream */}
      <section className="mt-6 sm:mt-5 pt-5 sm:pt-4 border-t border-neutral-300 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#059669] shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Plant Operational Stage Pulse
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
            Physical to digital real-time transaction ledger
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-white border border-neutral-300 hover:border-neutral-900 transition-colors space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Inbound Gate &amp; WB</span>
              <span className="text-[10px] text-[#047857] font-bold uppercase px-1.5 py-0.5 bg-emerald-50 border border-emerald-200">RM Receipt</span>
            </div>
            <p className="font-mono font-bold text-neutral-900 text-sm">MH 12 RN 4821</p>
            <p className="text-neutral-600 text-xs">Tare Weighed (10,200 kg) &rarr; Net Accepted 18.25 MT.</p>
          </div>

          <div className="p-3.5 bg-white border border-neutral-300 hover:border-neutral-900 transition-colors space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Quality Lab</span>
              <span className="text-[10px] text-[#047857] font-bold uppercase px-1.5 py-0.5 bg-emerald-50 border border-emerald-200">Approved</span>
            </div>
            <p className="font-mono font-bold text-neutral-900 text-sm">QC-261004-001</p>
            <p className="text-neutral-600 text-xs">Moisture 9.5%, Ash 5.8%, GCV 4,150 kcal/kg.</p>
          </div>

          <div className="p-3.5 bg-white border border-neutral-300 hover:border-neutral-900 transition-colors space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Pellet Line 1</span>
              <span className="text-[10px] text-amber-700 font-bold uppercase px-1.5 py-0.5 bg-amber-50 border border-amber-200">Cooling</span>
            </div>
            <p className="font-mono font-bold text-neutral-900 text-sm">PB-261004-001</p>
            <p className="text-neutral-600 text-xs">Extrusion at 320A · 8.05mm diameter · 38.5 MT output.</p>
          </div>

          <div className="p-3.5 bg-white border border-neutral-300 hover:border-neutral-900 transition-colors space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Outbound Dispatch</span>
              <span className="text-[10px] text-[#047857] font-bold uppercase px-1.5 py-0.5 bg-emerald-50 border border-emerald-200">POD Signed</span>
            </div>
            <p className="font-mono font-bold text-neutral-900 text-sm">DIS-261002-001</p>
            <p className="text-neutral-600 text-xs">15.0 MT delivered to ABC Industries Pvt. Ltd.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
