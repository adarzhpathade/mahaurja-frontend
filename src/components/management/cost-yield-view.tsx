"use client";

import React from "react";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Layers,
  Zap,
  Flame,
  Wrench,
  Users,
  CheckCircle2,
} from "lucide-react";

export function CostYieldView() {
  return (
    <div className="space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Cost Breakdown, Yield &amp; Margin
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Unit Basis: <span className="font-semibold text-neutral-900">1 Metric Ton (MT) Finished 8mm Biomass Pellet</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-neutral-500 uppercase font-bold block">Gross Margin / MT</span>
            <span className="font-mono font-black text-xl text-[#059669]">₹1,750 (25.3%)</span>
          </div>
        </div>
      </div>

      {/* 3 Main Economic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Raw Biomass Cost */}
        <div className="bg-white/40 border border-neutral-300 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
              1. Raw Biomass Inflow
            </h3>
            <span className="font-mono font-black text-lg text-neutral-900">₹3,950 / MT</span>
          </div>
          <div className="space-y-2 text-xs text-neutral-700">
            <div className="flex justify-between">
              <span>Groundnut Shell (50%):</span>
              <span className="font-mono font-bold text-neutral-900">₹1,925</span>
            </div>
            <div className="flex justify-between">
              <span>Cashew Shell (25%):</span>
              <span className="font-mono font-bold text-neutral-900">₹1,100</span>
            </div>
            <div className="flex justify-between">
              <span>Sawdust / Wood (25%):</span>
              <span className="font-mono font-bold text-neutral-900">₹925</span>
            </div>
            <p className="text-[10px] text-neutral-500 pt-2 border-t border-neutral-200">
              Calculated on weighted net accepted weighbridge weight and purchase vouchers.
            </p>
          </div>
        </div>

        {/* Card 2: Conversion Overheads */}
        <div className="bg-white/40 border border-neutral-300 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
              2. Processing Overheads
            </h3>
            <span className="font-mono font-black text-lg text-neutral-900">₹1,200 / MT</span>
          </div>
          <div className="space-y-2 text-xs text-neutral-700">
            <div className="flex justify-between">
              <span>Electric Power (Grid + DG):</span>
              <span className="font-mono font-bold text-neutral-900">₹620</span>
            </div>
            <div className="flex justify-between">
              <span>Drying Furnace Thermal Energy:</span>
              <span className="font-mono font-bold text-neutral-900">₹280</span>
            </div>
            <div className="flex justify-between">
              <span>Die / Roller Shell Wear:</span>
              <span className="font-mono font-bold text-neutral-900">₹180</span>
            </div>
            <div className="flex justify-between">
              <span>Direct Plant Labor:</span>
              <span className="font-mono font-bold text-neutral-900">₹120</span>
            </div>
          </div>
        </div>

        {/* Card 3: Realization & Margin */}
        <div className="bg-white/40 border border-neutral-300 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
              3. Sales Realization
            </h3>
            <span className="font-mono font-black text-lg text-[#059669]">₹6,900 / MT</span>
          </div>
          <div className="space-y-2 text-xs text-neutral-700">
            <div className="flex justify-between">
              <span>Total Landed COGS:</span>
              <span className="font-mono font-bold text-neutral-900">₹5,150</span>
            </div>
            <div className="flex justify-between">
              <span>Gross Margin per MT:</span>
              <span className="font-mono font-black text-[#059669] text-sm">+ ₹1,750</span>
            </div>
            <div className="flex justify-between">
              <span>Operational Margin Ratio:</span>
              <span className="font-mono font-bold text-neutral-900">25.3%</span>
            </div>
            <p className="text-[10px] text-neutral-500 pt-2 border-t border-neutral-200">
              Commercial deliveries pegged against contract benchmarks.
            </p>
          </div>
        </div>
      </div>

      {/* Biomass Mass Balance & Net Yield Telemetry */}
      <section className="mt-6 sm:mt-5 pt-5 sm:pt-4 border-t border-neutral-300 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Raw Biomass Mass Balance &amp; Conversion Efficiency (91.3% Net Yield)
          </h3>
          <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
            Benchmark: &gt; 90% ISO Standard
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-white/40 border border-neutral-300">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Biomass Intake</span>
            <span className="font-mono font-bold text-neutral-900 text-lg">100.0%</span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">As-received feedstock</span>
          </div>
          <div className="p-3 bg-white/40 border border-neutral-300">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Cleaning Waste</span>
            <span className="font-mono font-bold text-red-700 text-lg">- 1.5%</span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">Sand &amp; tramp metal</span>
          </div>
          <div className="p-3 bg-white/40 border border-neutral-300">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Drying Evaporation</span>
            <span className="font-mono font-bold text-amber-700 text-lg">- 3.5%</span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">14% down to 9% moisture</span>
          </div>
          <div className="p-3 bg-white/40 border border-neutral-300">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Cooling Loss</span>
            <span className="font-mono font-bold text-neutral-700 text-lg">- 1.2%</span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">Vapor release</span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-300">
            <span className="text-[10px] uppercase font-bold text-[#047857] block">Commercial Yield</span>
            <span className="font-mono font-black text-[#047857] text-lg">91.3%</span>
            <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">Good 8mm pellets</span>
          </div>
        </div>
      </section>
    </div>
  );
}
