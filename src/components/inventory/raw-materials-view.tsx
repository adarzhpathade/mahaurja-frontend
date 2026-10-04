"use client";

import React, { useState } from "react";
import {
  Warehouse,
  LayoutGrid,
  Table as TableIcon,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Layers,
  Thermometer,
  Droplets,
  Calendar,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useInventory } from "@/lib/context/inventory-context";

export function RawMaterialsView() {
  const { locations, metrics } = useInventory();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const materials = ["ALL", "Groundnut Shell", "Cashew Shell", "Sawdust / Wood Shavings", "Soybean Straw / Agro Residue"];

  const filteredLocations = locations.filter((loc) => {
    const matchesMat =
      selectedMaterial === "ALL" ||
      loc.primaryMaterial.toLowerCase().includes(selectedMaterial.toLowerCase());
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.primaryMaterial.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMat && matchesSearch;
  });

  return (
    <div className="space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Raw Material Storage Yards &amp; Silo Map
        </h1>
      </div>

      {/* Stock Reconciliation Summary Banner (PDF Sec 10) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Total RM Stock on Ground
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900">
              {metrics.totalRmStockMT} MT
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-[#047857] border border-emerald-200">
              Active Stock
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Storage Yards &amp; Bays
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900">
              {locations.length}
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-200">
              Monitored
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Active Traceable Lots
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900">
              {metrics.activeLotsCount}
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200">
              In Stock
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Storage Utilization
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-black text-2xl sm:text-3xl text-[#059669]">
              {Math.round((metrics.totalRmStockMT / 2650) * 100)}%
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-[#047857] border border-emerald-200">
              Capacity: 2,650 MT
            </span>
          </div>
        </div>
      </div>

      {/* Storage Yards & Silos Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
          <div className="flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-neutral-800 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Storage Yards &amp; Silos
            </h2>
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {filteredLocations.length}
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
                  placeholder="Search yard, bay code, material..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="sm:hidden w-10 h-10 flex items-center justify-center border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 shrink-0 cursor-pointer"
                title="Filter Options"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop Filter Tabs */}
            <div className="hidden sm:flex items-center border border-neutral-300 divide-x divide-neutral-300 text-xs overflow-x-auto no-scrollbar shrink-0 h-10 bg-white">
              {materials.map((mat) => {
                const count =
                  mat === "ALL"
                    ? locations.length
                    : locations.filter((l) =>
                        l.primaryMaterial.toLowerCase().includes(mat.toLowerCase())
                      ).length;
                return (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => setSelectedMaterial(mat)}
                    className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                      selectedMaterial === mat
                        ? "bg-[#18181B] text-white font-semibold"
                        : "bg-white text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <span>{mat === "ALL" ? "All" : mat.split(" / ")[0]}</span>
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-bold ${
                        selectedMaterial === mat
                          ? "bg-[#059669] text-white"
                          : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Filter Sheet Modal */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:hidden">
              <div className="bg-white w-full border-t border-neutral-300 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">Filter Materials</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-xs font-bold text-neutral-500 hover:text-neutral-800"
                  >
                    Close ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {materials.map((mat) => {
                    const count =
                      mat === "ALL"
                        ? locations.length
                        : locations.filter((l) =>
                            l.primaryMaterial.toLowerCase().includes(mat.toLowerCase())
                          ).length;
                    return (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => { setSelectedMaterial(mat); setIsMobileFilterOpen(false); }}
                        className={`p-2.5 text-xs font-medium border text-center ${
                          selectedMaterial === mat ? "border-neutral-900 bg-[#18181B] text-white font-bold" : "border-neutral-300 bg-neutral-50 text-neutral-700"
                        }`}
                      >
                        {mat === "ALL" ? "All" : mat.split(" / ")[0]} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {filteredLocations.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No storage locations match your search criteria.
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((loc) => {
            const pct = Math.round((loc.currentStockMT / loc.capacityMT) * 100);

            return (
              <div
                key={loc.id}
                className="border border-neutral-300 hover:border-neutral-900 bg-white/40 p-4 flex flex-col justify-between space-y-4 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500">{loc.code}</span>
                      <h3 className="font-bold text-neutral-900 text-sm">{loc.name}</h3>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                      loc.status === "AERATION_REQUIRED"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-emerald-50 text-[#047857] border border-emerald-300"
                    }`}>
                      {loc.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Material:</span>
                      <span className="font-semibold text-neutral-900">{loc.primaryMaterial}</span>
                    </div>

                    {/* Capacity Utilization Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-neutral-500">Occupancy:</span>
                        <span className="font-mono font-bold text-neutral-900">
                          {loc.currentStockMT} / {loc.capacityMT} MT ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 h-2">
                        <div
                          className={`h-2 transition-all ${
                            pct > 80 ? "bg-red-500" : pct > 50 ? "bg-amber-500" : "bg-[#059669]"
                          }`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Sensor Telemetry */}
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-neutral-600">
                      <div className="flex items-center gap-1.5 bg-white p-1.5 border border-neutral-200">
                        <Droplets className="w-3.5 h-3.5 text-blue-500" />
                        <span>Moisture: <strong className="text-neutral-900 font-mono">{loc.moistureAvgPercent}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white p-1.5 border border-neutral-200">
                        <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                        <span>Temp: <strong className="text-neutral-900 font-mono">{loc.temperatureCelsius}°C</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                  <span>Last Audit: {loc.lastInspectionDate}</span>
                  <span className="text-neutral-800 font-semibold">{loc.type}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Transparent Industrial Table */
        <div className="border border-neutral-300 overflow-x-auto bg-transparent">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Location Code</th>
                <th className="py-2.5 px-3">Location Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Primary Biomass</th>
                <th className="py-2.5 px-3 font-mono">Current Stock</th>
                <th className="py-2.5 px-3 font-mono">Capacity</th>
                <th className="py-2.5 px-3">Occupancy %</th>
                <th className="py-2.5 px-3">Avg Moisture</th>
                <th className="py-2.5 px-3">Temperature</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300">
              {filteredLocations.map((loc) => {
                const pct = Math.round((loc.currentStockMT / loc.capacityMT) * 100);
                return (
                  <tr key={loc.id} className="hover:bg-neutral-200/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">
                      {loc.code}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-neutral-900">
                      {loc.name}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600">
                      {loc.type}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-800">
                      {loc.primaryMaterial}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">
                      {loc.currentStockMT} MT
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-600">
                      {loc.capacityMT} MT
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold">
                      {pct}%
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-700">
                      {loc.moistureAvgPercent}%
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-700">
                      {loc.temperatureCelsius}°C
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                        loc.status === "AERATION_REQUIRED"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-emerald-50 text-[#047857] border border-emerald-300"
                      }`}>
                        {loc.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
