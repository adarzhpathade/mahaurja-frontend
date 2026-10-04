"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MobileFilterSheet } from "@/components/shared/mobile-filter-sheet";
import {
  CalendarRange,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
  Factory,
  PackageMinus,
  Search,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import { useProduction } from "@/lib/context/production-context";
import { ProductionShift } from "@/lib/types/production";

export function ProductionPlansView() {
  const { plans, createPlan, metrics } = useProduction();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PLANNED" | "MATERIAL_ISSUED" | "PROCESSING">("ALL");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredPlans = plans.filter((p) => {
    const matchesFilter = filterStatus === "ALL" || p.status === filterStatus;
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productionLine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supervisorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shift.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Form State
  const [shift, setShift] = useState<ProductionShift>("MORNING");
  const [targetMT, setTargetMT] = useState<number>(60.0);
  const [formula, setFormula] = useState<string>("Standard High-Caloric Blend (50% GS + 25% CS + 25% WD)");
  const [line, setLine] = useState<string>("Line 1 — CPM 7932 Mill");
  const [remarks, setRemarks] = useState<string>("");

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();

    createPlan({
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      shift,
      targetQuantityMT: targetMT,
      productName: "MAHAURJA Biomass Pellet",
      pelletDiameterMm: 8.0,
      formulaId: "FORM-CUSTOM",
      formulaName: formula,
      ingredients: [
        { materialCode: "GS", materialName: "Groundnut Shell", plannedQuantityMT: targetMT * 0.5 },
        { materialCode: "CS", materialName: "Cashew Shell", plannedQuantityMT: targetMT * 0.25 },
        { materialCode: "WD", materialName: "Wood / Sawdust", plannedQuantityMT: targetMT * 0.25 },
      ],
      status: "PLANNED",
      supervisorName: "Mahesh Kadam",
      productionLine: line,
      remarks,
    });

    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-300 pb-4 sm:pb-5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Production Planning
          </h1>
          <span className="text-xs sm:text-sm font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
            {filteredPlans.length}
          </span>
        </div>

        {/* Desktop Controls: Dual View Switcher + Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Desktop Dual View */}
          <div className="inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
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

          <button
            type="button"
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>{isCreateOpen ? "Close Plan Form" : "Create Plan"}</span>
          </button>
        </div>
      </div>

      {/* Production Pulse KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Total Target
          </span>
          <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 block">
            {metrics.todayTargetMT} MT
          </span>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Extruded Today
          </span>
          <span className="font-mono font-black text-2xl sm:text-3xl text-[#059669] block">
            {metrics.todayProducedMT} MT
          </span>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Completion
          </span>
          <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-900 block">
            {Math.round((metrics.todayProducedMT / metrics.todayTargetMT) * 100)}%
          </span>
        </div>

        <div className="bg-white border border-neutral-300 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Plant Efficiency
          </span>
          <span className="font-mono font-black text-2xl sm:text-3xl text-[#059669] block">
            {metrics.plantEfficiencyPercent}%
          </span>
        </div>
      </div>

      {/* 2. MOBILE ACTION STACK (Gate UI Pattern) */}
      <div className="sm:hidden flex flex-col items-stretch gap-2.5 w-full">
        <button
          type="button"
          onClick={() => setIsCreateOpen(!isCreateOpen)}
          className="h-11 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs w-full"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>{isCreateOpen ? "Close Plan Form" : "Create Plan"}</span>
        </button>
      </div>

      {/* Plan Creation Inline Console (< 650px height) */}
      {isCreateOpen && (
        <form onSubmit={handleCreatePlan} className="bg-white border border-neutral-300 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
            <Plus className="w-4 h-4 text-[#059669]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Create New Shift Plan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as ProductionShift)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#059669]"
              >
                <option value="MORNING">Morning (06:00 AM – 02:00 PM)</option>
                <option value="AFTERNOON">Afternoon (02:00 PM – 10:00 PM)</option>
                <option value="NIGHT">Night (10:00 PM – 06:00 AM)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Target Output (MT)</label>
              <input
                type="number"
                step="5"
                value={targetMT}
                onChange={(e) => setTargetMT(parseFloat(e.target.value) || 0)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Production Line / Mill</label>
              <select
                value={line}
                onChange={(e) => setLine(e.target.value)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#059669]"
              >
                <option value="Line 1 — CPM 7932 Mill">Line 1 — CPM 7932 Mill</option>
                <option value="Line 2 — Buhler DPAB Mill">Line 2 — Buhler DPAB Mill</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Biomass Recipe / Blend</label>
              <select
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#059669]"
              >
                <option value="Standard High-Caloric Blend (50% GS + 25% CS + 25% WD)">Standard (50% GS + 25% CS + 25% WD)</option>
                <option value="Agro Mix Blend (60% GS + 40% Agro Residue)">Agro Mix (60% GS + 40% Residue)</option>
                <option value="Pure Wood Pellet (100% Pine Shavings)">Pure Wood (100% Pine)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">Supervisor Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Die pre-heated to 90°C. Target boiler grade pellets with high GCV."
              className="w-full min-h-[48px] p-3 text-xs leading-relaxed bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="h-10 px-4 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm &amp; Issue Plan</span>
            </button>
          </div>
        </form>
      )}

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
                  placeholder="Search plan ID, line, supervisor, shift..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className={`sm:hidden w-10 h-10 flex items-center justify-center border shrink-0 cursor-pointer relative transition-colors ${
                  filterStatus !== "ALL"
                    ? "bg-[#18181B] text-white border-[#18181B]"
                    : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                }`}
                title="Filter Options"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {filterStatus !== "ALL" && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#059669] rounded-full ring-2 ring-white" />
                )}
              </button>
            </div>

            {/* Desktop Filter Tabs */}
            <div className="hidden sm:flex items-center border border-neutral-300 divide-x divide-neutral-300 text-xs overflow-x-auto no-scrollbar shrink-0 h-10 bg-white">
              <button
                type="button"
                onClick={() => setFilterStatus("ALL")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === "ALL"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>All</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    filterStatus === "ALL"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {plans.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("PROCESSING")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === "PROCESSING"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>In Production</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    filterStatus === "PROCESSING"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {plans.filter((p) => p.status === "PROCESSING").length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("MATERIAL_ISSUED")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === "MATERIAL_ISSUED"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Material Issued</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    filterStatus === "MATERIAL_ISSUED"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {plans.filter((p) => p.status === "MATERIAL_ISSUED").length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("PLANNED")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === "PLANNED"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Planned</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    filterStatus === "PLANNED"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {plans.filter((p) => p.status === "PLANNED").length}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Filter Sheet */}
          <MobileFilterSheet
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            title="Filter Plans"
            selectedId={filterStatus}
            onSelect={(id) => setFilterStatus(id as typeof filterStatus)}
            options={[
              {
                id: "ALL",
                label: "All Plans",
                count: plans.length,
                dotColor: "bg-neutral-400",
                selectedDotColor: "bg-white ring-2 ring-white/30",
              },
              {
                id: "PROCESSING",
                label: "In Production",
                count: plans.filter((p) => p.status === "PROCESSING").length,
                dotColor: "bg-[#059669]",
                selectedDotColor: "bg-[#10B981] ring-2 ring-[#10B981]/40",
              },
              {
                id: "MATERIAL_ISSUED",
                label: "Material Issued",
                count: plans.filter((p) => p.status === "MATERIAL_ISSUED").length,
                dotColor: "bg-blue-500",
                selectedDotColor: "bg-sky-400 ring-2 ring-sky-400/40",
              },
              {
                id: "PLANNED",
                label: "Planned",
                count: plans.filter((p) => p.status === "PLANNED").length,
                dotColor: "bg-amber-500",
                selectedDotColor: "bg-amber-400 ring-2 ring-amber-400/40",
              },
            ]}
          />

          {filteredPlans.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No production plans match your search criteria.
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPlans.map((p) => (
                <div
                  key={p.id}
                  className="border border-neutral-300 hover:border-neutral-900 bg-white/40 p-4 flex flex-col justify-between space-y-4 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500">{p.date} · {p.shift}</span>
                        <h3 className="font-mono font-bold text-neutral-900 text-base">{p.id}</h3>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                        p.status === "PROCESSING"
                          ? "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                          : p.status === "MATERIAL_ISSUED"
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-neutral-200 text-neutral-700"
                      }`}>
                        {p.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs text-neutral-700">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Target Output:</span>
                        <span className="font-mono font-bold text-neutral-900">{p.targetQuantityMT} MT ({p.pelletDiameterMm}mm)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Mill / Line:</span>
                        <span className="font-semibold text-neutral-900">{p.productionLine}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[11px] mb-1">Biomass Recipe Blend:</span>
                        <div className="bg-neutral-100 p-2 border border-neutral-200 space-y-1 font-mono text-[11px]">
                          {p.ingredients.map((ing) => (
                            <div key={ing.materialCode} className="flex justify-between">
                              <span className="text-neutral-700">{ing.materialName}:</span>
                              <span className="font-bold text-neutral-900">{ing.plannedQuantityMT} MT</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Supervisor: {p.supervisorName}
                    </span>

                    {p.status === "PLANNED" ? (
                      <Link
                        href="/production/material-issue"
                        className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                      >
                        <PackageMinus className="w-3.5 h-3.5" />
                        <span>Issue Material &rarr;</span>
                      </Link>
                    ) : (
                      <Link
                        href="/production/processing"
                        className="h-8 px-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Factory className="w-3.5 h-3.5" />
                        <span>7-Stage Console &rarr;</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Mobile Cards Fallback */}
              <div className="grid grid-cols-1 sm:hidden gap-4">
                {filteredPlans.map((p) => (
                  <div
                    key={p.id}
                    className="border border-neutral-300 hover:border-neutral-900 bg-white/40 p-4 flex flex-col justify-between space-y-4 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                        <div>
                          <span className="text-[10px] font-mono text-neutral-500">{p.date} · {p.shift}</span>
                          <h3 className="font-mono font-bold text-neutral-900 text-base">{p.id}</h3>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                          p.status === "PROCESSING"
                            ? "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                            : p.status === "MATERIAL_ISSUED"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-neutral-200 text-neutral-700"
                        }`}>
                          {p.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-xs text-neutral-700">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Target Output:</span>
                          <span className="font-mono font-bold text-neutral-900">{p.targetQuantityMT} MT ({p.pelletDiameterMm}mm)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Mill / Line:</span>
                          <span className="font-semibold text-neutral-900">{p.productionLine}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[11px] mb-1">Biomass Recipe Blend:</span>
                          <div className="bg-neutral-100 p-2 border border-neutral-200 space-y-1 font-mono text-[11px]">
                            {p.ingredients.map((ing) => (
                              <div key={ing.materialCode} className="flex justify-between">
                                <span className="text-neutral-700">{ing.materialName}:</span>
                                <span className="font-bold text-neutral-900">{ing.plannedQuantityMT} MT</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Supervisor: {p.supervisorName}
                      </span>

                      {p.status === "PLANNED" ? (
                        <Link
                          href="/production/material-issue"
                          className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                        >
                          <PackageMinus className="w-3.5 h-3.5" />
                          <span>Issue Material &rarr;</span>
                        </Link>
                      ) : (
                        <Link
                          href="/production/processing"
                          className="h-8 px-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Factory className="w-3.5 h-3.5" />
                          <span>7-Stage Console &rarr;</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Transparent Table */}
              <div className="hidden sm:block border border-neutral-300 overflow-x-auto bg-transparent">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Plan ID</th>
                      <th className="py-2.5 px-3">Date / Shift</th>
                      <th className="py-2.5 px-3 font-mono">Target MT</th>
                      <th className="py-2.5 px-3">Product Spec</th>
                      <th className="py-2.5 px-3">Recipe Blend</th>
                      <th className="py-2.5 px-3">Production Line</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-neutral-300">
                    {filteredPlans.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-200/40 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{p.id}</td>
                        <td className="py-2.5 px-3 text-neutral-800">{p.date} · {p.shift}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{p.targetQuantityMT} MT</td>
                        <td className="py-2.5 px-3 text-neutral-700">{p.productName} ({p.pelletDiameterMm}mm)</td>
                        <td className="py-2.5 px-3 text-neutral-700 truncate max-w-[200px]">{p.formulaName}</td>
                        <td className="py-2.5 px-3 text-neutral-700">{p.productionLine}</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                            p.status === "PROCESSING"
                              ? "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                              : p.status === "MATERIAL_ISSUED"
                              ? "bg-blue-100 text-blue-800 border border-blue-300"
                              : "bg-neutral-200 text-neutral-700"
                          }`}>
                            {p.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {p.status === "PLANNED" ? (
                            <Link
                              href="/production/material-issue"
                              className="h-7 px-2.5 bg-[#18181B] hover:bg-[#059669] text-white text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                            >
                              <span>Issue RM</span>
                            </Link>
                          ) : (
                            <Link
                              href="/production/processing"
                              className="h-7 px-2.5 bg-[#059669] hover:bg-[#047857] text-white text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                            >
                              <span>Console</span>
                            </Link>
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
      </div>
    );
  }
