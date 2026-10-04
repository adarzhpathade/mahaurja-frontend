"use client";

import React, { useState } from "react";
import {
  PackageMinus,
  CheckCircle2,
  Layers,
  ArrowRight,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  Warehouse,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useProduction } from "@/lib/context/production-context";
import { useInventory } from "@/lib/context/inventory-context";

export function MaterialIssueWorkbench() {
  const { plans, issues, createMaterialIssue } = useProduction();
  const { rmLots } = useInventory();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIssues = issues.filter((iss) => {
    return (
      iss.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.planId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.supervisorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.allocatedLots.some(
        (l) =>
          l.lotId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.materialName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  const plannedPlans = plans.filter((p) => p.status === "PLANNED" || p.status === "MATERIAL_ISSUED");

  // Form State
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    plannedPlans[0]?.id || "PRD-261004-002"
  );
  const [selectedLot1, setSelectedLot1] = useState<string>("RMLOT-GS-261004-001");
  const [qty1, setQty1] = useState<number>(30.0);
  const [selectedLot2, setSelectedLot2] = useState<string>("RMLOT-CS-261004-002");
  const [qty2, setQty2] = useState<number>(15.0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();

    const lot1Obj = rmLots.find((l) => l.lotId === selectedLot1);
    const lot2Obj = rmLots.find((l) => l.lotId === selectedLot2);

    createMaterialIssue({
      planId: selectedPlanId,
      issueDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
        `, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      shift: selectedPlan?.shift || "MORNING",
      supervisorName: "Mahesh Kadam",
      allocatedLots: [
        {
          lotId: selectedLot1,
          materialName: lot1Obj?.materialName || "Groundnut Shell",
          issuedQuantityMT: qty1,
          yardLocation: lot1Obj?.storageLocationName || "Yard A",
        },
        {
          lotId: selectedLot2,
          materialName: lot2Obj?.materialName || "Cashew Shell",
          issuedQuantityMT: qty2,
          yardLocation: lot2Obj?.storageLocationName || "Yard B",
        },
      ],
      totalIssuedMT: qty1 + qty2,
      status: "CONFIRMED",
    });

    setSuccessMsg(`Material issue recorded! ${qty1 + qty2} MT allocated from inventory to plan ${selectedPlanId}.`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Material Issue &amp; Lot Allocation Workbench
        </h1>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Issue Form (< 650px height) */}
      <form onSubmit={handleIssue} className="bg-transparent border-0 p-0 sm:border sm:border-neutral-300 sm:p-5 sm:bg-white space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-[#059669]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Allocate RM Lots to Production Plan
            </h2>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            Inventory stock will automatically decrease
          </span>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target Plan */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Select Production Plan
            </label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-bold font-mono text-neutral-900 focus:outline-none focus:border-[#059669]"
            >
              {plannedPlans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} ({p.targetQuantityMT} MT · {p.shift})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-neutral-500 mt-1">
              {selectedPlan?.formulaName}
            </p>
          </div>

          {/* Allocation Item 1 */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 block">
              Ingredient 1 — Primary Biomass
            </span>
            <div>
              <label className="text-[10px] text-neutral-500 block mb-0.5">Select In-Stock RM Lot</label>
              <select
                value={selectedLot1}
                onChange={(e) => setSelectedLot1(e.target.value)}
                className="h-9 w-full px-2 bg-white border border-neutral-300 text-xs font-mono font-semibold text-neutral-900"
              >
                {rmLots.map((l) => (
                  <option key={l.lotId} value={l.lotId}>
                    {l.lotId} ({l.materialName} · {l.availableQuantityMT} MT available)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 block mb-0.5">Issue Quantity (MT)</label>
              <input
                type="number"
                step="0.5"
                value={qty1}
                onChange={(e) => setQty1(parseFloat(e.target.value) || 0)}
                className="h-9 w-full px-2 bg-white border border-neutral-300 font-mono font-bold text-xs text-neutral-900"
                required
              />
            </div>
          </div>

          {/* Allocation Item 2 */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 block">
              Ingredient 2 — Secondary Biomass
            </span>
            <div>
              <label className="text-[10px] text-neutral-500 block mb-0.5">Select In-Stock RM Lot</label>
              <select
                value={selectedLot2}
                onChange={(e) => setSelectedLot2(e.target.value)}
                className="h-9 w-full px-2 bg-white border border-neutral-300 text-xs font-mono font-semibold text-neutral-900"
              >
                {rmLots.map((l) => (
                  <option key={l.lotId} value={l.lotId}>
                    {l.lotId} ({l.materialName} · {l.availableQuantityMT} MT available)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 block mb-0.5">Issue Quantity (MT)</label>
              <input
                type="number"
                step="0.5"
                value={qty2}
                onChange={(e) => setQty2(parseFloat(e.target.value) || 0)}
                className="h-9 w-full px-2 bg-white border border-neutral-300 font-mono font-bold text-xs text-neutral-900"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-neutral-600">
            Total Material Requested for Issue: <strong className="font-mono text-neutral-900">{qty1 + qty2} MT</strong>
          </div>
          <button
            type="submit"
            className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Material Issue (ISS) &rarr;</span>
          </button>
        </div>
      </form>

      {/* Historical Issues Ledger */}
      <section className="space-y-4 pt-6 border-t border-neutral-300">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-800 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Material Issue Slips
            </h2>
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {filteredIssues.length}
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
            {/* Search Input */}
            <div className="relative w-full flex-1 sm:max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search slip ID, plan ref, lot ID, material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center border border-neutral-300 divide-x divide-neutral-300 text-xs overflow-x-auto no-scrollbar shrink-0 h-10 bg-white">
              <button
                type="button"
                className="h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 bg-[#18181B] text-white font-semibold"
              >
                <span>All Issues</span>
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#059669] text-white">
                  {issues.length}
                </span>
              </button>
            </div>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No material issue slips match your search criteria.
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIssues.map((iss) => (
              <div
                key={iss.id}
                className="border border-neutral-300 bg-white/40 p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500">Plan Ref: {iss.planId}</span>
                      <h3 className="font-mono font-bold text-neutral-900 text-base">{iss.id}</h3>
                    </div>
                    <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
                      {iss.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs text-neutral-700">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Total Issued MT:</span>
                      <span className="font-mono font-bold text-neutral-900">{iss.totalIssuedMT} MT</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-neutral-500 block font-semibold">Allocated RM Lots:</span>
                      {iss.allocatedLots.map((lot) => (
                        <div
                          key={lot.lotId}
                          className="flex justify-between p-1.5 bg-neutral-100 border border-neutral-200 text-[11px] font-mono"
                        >
                          <span>{lot.lotId} ({lot.materialName})</span>
                          <span className="font-bold text-neutral-900">{lot.issuedQuantityMT} MT · {lot.yardLocation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 text-[10px] text-neutral-500 font-mono flex justify-between">
                  <span>Issued: {iss.issueDate}</span>
                  <span>Supervisor: {iss.supervisorName}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-neutral-300 overflow-x-auto bg-transparent">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Issue Slip ID</th>
                  <th className="py-2.5 px-3">Target Plan</th>
                  <th className="py-2.5 px-3">Shift</th>
                  <th className="py-2.5 px-3 font-mono">Total MT</th>
                  <th className="py-2.5 px-3">Deducted RM Lots</th>
                  <th className="py-2.5 px-3">Supervisor</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {filteredIssues.map((iss) => (
                  <tr key={iss.id} className="hover:bg-neutral-200/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{iss.id}</td>
                    <td className="py-2.5 px-3 font-mono text-neutral-800">{iss.planId}</td>
                    <td className="py-2.5 px-3 text-neutral-700">{iss.shift}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{iss.totalIssuedMT} MT</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-neutral-700">
                      {iss.allocatedLots.map((l) => l.lotId).join(", ")}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700">{iss.supervisorName}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5">
                        {iss.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </section>
    </div>
  );
}
