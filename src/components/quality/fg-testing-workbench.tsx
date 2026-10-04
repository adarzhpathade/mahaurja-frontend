"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  FileText,
  RotateCcw,
  ArrowRight,
  Sparkles,
  FlaskConical,
} from "lucide-react";
import { useQuality } from "@/lib/context/quality-context";
import { FgTestParameters, QcStatus } from "@/lib/types/quality";

const PRESET_FG_REMARKS = [
  "Export grade quality (ENplus A1)",
  "Optimal surface glaze & hardness",
  "Low ash & high calorific yield",
  "Screening verified, zero fines",
];

export function FgTestingWorkbench() {
  const router = useRouter();
  const { fgSamples, activeFgSampleId, setActiveFgSampleId, submitFgTest, generateCoaDocument } = useQuality();

  const currentBatch =
    fgSamples.find((b) => b.id === activeFgSampleId) ||
    fgSamples.find((b) => b.status === "PENDING" || b.status === "TESTING") ||
    fgSamples[0];

  const [diameter, setDiameter] = useState<number>(
    currentBatch?.parameters?.pelletDiameterMm ?? 8.05
  );
  const [moisture, setMoisture] = useState<number>(
    currentBatch?.parameters?.moisturePercent ?? 6.8
  );
  const [ash, setAsh] = useState<number>(
    currentBatch?.parameters?.ashPercent ?? 4.2
  );
  const [gcv, setGcv] = useState<number>(
    currentBatch?.parameters?.gcvKcal ?? 4320
  );
  const [bulkDensity, setBulkDensity] = useState<number>(
    currentBatch?.parameters?.bulkDensityKgM3 ?? 685
  );
  const [fines, setFines] = useState<number>(
    currentBatch?.parameters?.finesPercent ?? 0.8
  );
  const [remarks, setRemarks] = useState<string>(currentBatch?.remarks ?? "");
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  // Tolerance checks
  const isDiameterOut = diameter < 7.8 || diameter > 8.2;
  const isMoistureOut = moisture > 8.0;
  const isAshOut = ash > 5.0;
  const isGcvLow = gcv < 4200;
  const isDensityLow = bulkDensity < 650;
  const isFinesHigh = fines > 1.5;

  const hasAnyOut = isDiameterOut || isMoistureOut || isAshOut || isGcvLow || isDensityLow || isFinesHigh;

  const handleDecision = (status: QcStatus) => {
    if (!currentBatch) return;

    const params: FgTestParameters = {
      pelletDiameterMm: diameter,
      moisturePercent: moisture,
      ashPercent: ash,
      gcvKcal: gcv,
      bulkDensityKgM3: bulkDensity,
      finesPercent: fines,
    };

    submitFgTest(currentBatch.id, params, status, remarks);

    if (status === "APPROVED") {
      generateCoaDocument(currentBatch.id, "ABC Industries Pvt. Ltd.", "SO-261002-015", remarks);
      setDecisionFeedback("Batch APPROVED! Added to dispatchable inventory and generated COA.");
    } else {
      setDecisionFeedback(`Batch marked as ${status}. Material blocked from dispatch allocation.`);
    }

    setTimeout(() => {
      router.push("/quality/reports");
    }, 1200);
  };

  const handleAddPresetRemark = (preset: string) => {
    if (!remarks.trim()) {
      setRemarks(preset);
    } else if (!remarks.includes(preset)) {
      setRemarks(`${remarks}, ${preset}`);
    }
  };

  if (!currentBatch) {
    return (
      <div className="bg-white border border-neutral-300 p-8 text-center text-neutral-600" style={{ borderRadius: 0 }}>
        No active finished goods batches awaiting testing.
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-50 text-[#047857] border-emerald-300";
      case "HOLD":
        return "bg-orange-50 text-orange-800 border-orange-300";
      case "REJECTED":
        return "bg-red-50 text-red-800 border-red-300";
      default:
        return "bg-amber-50 text-amber-800 border-amber-300";
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 select-none">
      {/* ========================================================================= */}
      {/* 1. COMMAND HEADER (Clean & Bold, Desktop Selector in Header)              */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-300 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Finished Goods Testing
        </h1>

        {/* Batch Selector (Visible on Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 whitespace-nowrap shrink-0">
            Select Batch:
          </label>
          <select
            value={currentBatch.id}
            onChange={(e) => setActiveFgSampleId(e.target.value)}
            className="h-10 px-3 bg-white border border-neutral-300 text-xs font-bold font-mono text-neutral-900 focus:outline-none focus:border-[#059669] w-64 truncate cursor-pointer"
            style={{ borderRadius: 0 }}
          >
            {fgSamples.map((b) => (
              <option key={b.id} value={b.id}>
                {b.batchNumber} ({b.quantityMT} MT)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Batch Selector Bar (Full Width on Mobile) */}
      <div className="sm:hidden flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
          Active FG Batch for Testing:
        </label>
        <select
          value={currentBatch.id}
          onChange={(e) => setActiveFgSampleId(e.target.value)}
          className="w-full h-11 px-3 bg-white border border-neutral-300 text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
          style={{ borderRadius: 0 }}
        >
          {fgSamples.map((b) => (
            <option key={b.id} value={b.id}>
              {b.batchNumber} · {b.quantityMT} MT ({b.status})
            </option>
          ))}
        </select>
      </div>

      {decisionFeedback && (
        <div
          className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in"
          style={{ borderRadius: 0 }}
        >
          <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
          <span>{decisionFeedback}</span>
        </div>
      )}

      {/* Main Testing Console */}
      <div
        className="w-full bg-transparent border-0 sm:border sm:border-neutral-300 p-0 sm:p-5 space-y-5"
        style={{ borderRadius: 0 }}
      >
        {/* Batch Metadata Header (Crisp Telemetry Strip) */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-3 bg-neutral-200/50 border border-neutral-300 text-xs"
          style={{ borderRadius: 0 }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">FG Batch ID</span>
            <span className="font-mono font-bold text-neutral-900">{currentBatch.batchNumber}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Production Run</span>
            <span className="font-mono font-bold text-neutral-900">{currentBatch.productionBatchNumber}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Product Spec</span>
            <span className="font-semibold text-neutral-900 truncate block">{currentBatch.productName}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Line / Machine</span>
            <span className="font-medium text-neutral-800">{currentBatch.productionLine}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Batch Quantity</span>
            <span className="font-mono font-bold text-neutral-900">{currentBatch.quantityMT} MT</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Batch Status</span>
            <span
              className={`font-bold uppercase text-[10px] font-mono px-2 py-0.5 border inline-block mt-0.5 ${getStatusBadge(
                currentBatch.status
              )}`}
              style={{ borderRadius: 0 }}
            >
              {currentBatch.status}
            </span>
          </div>
        </div>

        {/* 6-Parameter Finished Pellet Matrix */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#059669] shrink-0" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Test Parameters (8mm Finished Pellets)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline">
              Tested as per ISO 17831 / ENplus A1
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {/* 1. Pellet Diameter */}
            <div
              className="bg-white border border-neutral-300 p-3 sm:p-3.5 space-y-2 hover:border-neutral-400 focus-within:border-[#059669] transition-all"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Pellet Diameter
                </label>
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 border ${
                    isDiameterOut
                      ? "bg-red-50 text-red-700 border-red-300"
                      : "bg-emerald-50 text-[#047857] border-emerald-300"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {isDiameterOut ? "OUT OF TOLERANCE" : "8mm STANDARD"}
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.05"
                  value={diameter}
                  onChange={(e) => setDiameter(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 pl-3 pr-12 bg-neutral-50/60 border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#059669] transition-all"
                  style={{ borderRadius: 0 }}
                />
                <span className="absolute right-3 text-xs font-mono font-bold text-neutral-400 pointer-events-none">
                  mm
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-0.5">
                <span>Spec: 7.80 – 8.20 mm</span>
                <span className={isDiameterOut ? "text-red-600 font-bold" : "text-[#059669] font-bold"}>
                  {diameter >= 7.8 && diameter <= 8.2 ? "Optimal" : "Variance"}
                </span>
              </div>
            </div>

            {/* 2. Moisture % */}
            <div
              className="bg-white border border-neutral-300 p-3 sm:p-3.5 space-y-2 hover:border-neutral-400 focus-within:border-[#059669] transition-all"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Final Moisture
                </label>
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 border ${
                    isMoistureOut
                      ? "bg-red-50 text-red-700 border-red-300"
                      : "bg-emerald-50 text-[#047857] border-emerald-300"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {isMoistureOut ? "HIGH (>8.0%)" : "COMPLIANT (≤8.0%)"}
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 pl-3 pr-10 bg-neutral-50/60 border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#059669] transition-all"
                  style={{ borderRadius: 0 }}
                />
                <span className="absolute right-3 text-xs font-mono font-bold text-neutral-400 pointer-events-none">
                  %
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-0.5">
                <span>Limit: ≤ 8.0%</span>
                <span className={isMoistureOut ? "text-red-600 font-bold" : "text-[#059669] font-bold"}>
                  {moisture <= 8.0 ? "Compliant" : "High Moisture"}
                </span>
              </div>
            </div>

            {/* 3. Ash % */}
            <div
              className="bg-white border border-neutral-300 p-3 sm:p-3.5 space-y-2 hover:border-neutral-400 focus-within:border-[#059669] transition-all"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Ash Content
                </label>
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 border ${
                    isAshOut
                      ? "bg-red-50 text-red-700 border-red-300"
                      : "bg-emerald-50 text-[#047857] border-emerald-300"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {isAshOut ? "HIGH (>5.0%)" : "COMPLIANT (≤5.0%)"}
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={ash}
                  onChange={(e) => setAsh(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 pl-3 pr-10 bg-neutral-50/60 border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#059669] transition-all"
                  style={{ borderRadius: 0 }}
                />
                <span className="absolute right-3 text-xs font-mono font-bold text-neutral-400 pointer-events-none">
                  %
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-0.5">
                <span>Boiler Spec: ≤ 5.0%</span>
                <span className={isAshOut ? "text-red-600 font-bold" : "text-[#059669] font-bold"}>
                  {ash <= 5.0 ? "Low Ash" : "High Ash"}
                </span>
              </div>
            </div>

            {/* 4. GCV (kcal/kg) */}
            <div
              className="bg-white border border-neutral-300 p-3 sm:p-3.5 space-y-2 hover:border-neutral-400 focus-within:border-[#059669] transition-all"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Gross Calorific Value
                </label>
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 border ${
                    isGcvLow
                      ? "bg-red-50 text-red-700 border-red-300"
                      : "bg-emerald-50 text-[#047857] border-emerald-300"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {isGcvLow ? "LOW (<4200)" : "PREMIUM (≥4200)"}
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="10"
                  value={gcv}
                  onChange={(e) => setGcv(parseInt(e.target.value, 10) || 0)}
                  className="w-full h-10 pl-3 pr-18 bg-neutral-50/60 border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#059669] transition-all"
                  style={{ borderRadius: 0 }}
                />
                <span className="absolute right-3 text-xs font-mono font-bold text-neutral-400 pointer-events-none">
                  kcal/kg
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-0.5">
                <span>Guaranteed: ≥ 4,200 kcal/kg</span>
                <span className={isGcvLow ? "text-red-600 font-bold" : "text-[#059669] font-bold"}>
                  {gcv >= 4200 ? "High Yield" : "Sub-Optimal"}
                </span>
              </div>
            </div>

            {/* 5. Bulk Density */}
            <div
              className="bg-white border border-neutral-300 p-3 sm:p-3.5 space-y-2 hover:border-neutral-400 focus-within:border-[#059669] transition-all"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Bulk Density
                </label>
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 border ${
                    isDensityLow
                      ? "bg-red-50 text-red-700 border-red-300"
                      : "bg-emerald-50 text-[#047857] border-emerald-300"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {isDensityLow ? "LOW (<650)" : "DENSE (≥650)"}
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="5"
                  value={bulkDensity}
                  onChange={(e) => setBulkDensity(parseInt(e.target.value, 10) || 0)}
                  className="w-full h-10 pl-3 pr-18 bg-neutral-50/60 border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#059669] transition-all"
                  style={{ borderRadius: 0 }}
                />
                <span className="absolute right-3 text-xs font-mono font-bold text-neutral-400 pointer-events-none">
                  kg/m³
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-0.5">
                <span>Transport Target: ≥ 650 kg/m³</span>
                <span className={isDensityLow ? "text-red-600 font-bold" : "text-[#059669] font-bold"}>
                  {bulkDensity >= 650 ? "Solid" : "Porous"}
                </span>
              </div>
            </div>

            {/* 6. Fines & Dust */}
            <div
              className="bg-white border border-neutral-300 p-3 sm:p-3.5 space-y-2 hover:border-neutral-400 focus-within:border-[#059669] transition-all"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Fines &amp; Dust
                </label>
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 border ${
                    isFinesHigh
                      ? "bg-red-50 text-red-700 border-red-300"
                      : "bg-emerald-50 text-[#047857] border-emerald-300"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {isFinesHigh ? "EXCESS DUST (>1.5%)" : "DURABLE (≤1.5%)"}
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={fines}
                  onChange={(e) => setFines(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 pl-3 pr-10 bg-neutral-50/60 border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#059669] transition-all"
                  style={{ borderRadius: 0 }}
                />
                <span className="absolute right-3 text-xs font-mono font-bold text-neutral-400 pointer-events-none">
                  %
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-0.5">
                <span>Durability Limit: ≤ 1.5%</span>
                <span className={isFinesHigh ? "text-red-600 font-bold" : "text-[#059669] font-bold"}>
                  {fines <= 1.5 ? "Screened" : "Excess Fines"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Remarks Section with Quick Action Preset Chips */}
        <div className="mt-6 sm:mt-5 pt-5 sm:pt-4 border-t border-neutral-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#059669] shrink-0" />
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Lab Certification Remarks &amp; Customer Concessions
              </label>
            </div>
          </div>

          {/* Quick Preset Action Chips */}
          <div className="flex flex-wrap gap-2 pt-0.5">
            {PRESET_FG_REMARKS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleAddPresetRemark(preset)}
                className="px-2.5 py-1 text-xs font-medium border border-neutral-300 bg-white hover:bg-neutral-100 hover:border-neutral-400 text-neutral-700 transition-colors cursor-pointer shrink-0 shadow-2xs"
                style={{ borderRadius: 0 }}
              >
                + {preset}
              </button>
            ))}
          </div>

          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter lab certification remarks or tap preset chips above..."
            className="w-full min-h-[56px] sm:min-h-[48px] p-3 text-xs leading-relaxed bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all resize-none"
            style={{ borderRadius: 0 }}
          />
        </div>

        {/* Gatekeeper Footer: Section 22 Rule & Decision Actions */}
        <div className="mt-6 sm:mt-5 pt-5 sm:pt-4 border-t border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-neutral-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
            <span>
              <strong className="text-neutral-900">PDF Sec 22:</strong> Only approved FG batches become{" "}
              <strong className="text-[#047857]">dispatchable inventory</strong>.
            </span>
          </div>

          {/* Decision Buttons (Mobile-first Ergonomic Layout) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* Primary Action (Bio-Emerald) */}
            <button
              type="button"
              onClick={() => handleDecision("APPROVED")}
              className="order-1 sm:order-3 h-11 sm:h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer w-full sm:w-auto"
              style={{ borderRadius: 0 }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Authorize Dispatch &rarr;</span>
            </button>

            {/* Cautionary Actions */}
            <div className="order-2 sm:order-1 grid grid-cols-2 gap-2.5 w-full sm:w-auto sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => handleDecision("REJECTED")}
                className="h-10 px-4 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto"
                style={{ borderRadius: 0 }}
              >
                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="truncate">Reject Batch</span>
              </button>

              <button
                type="button"
                onClick={() => handleDecision("HOLD")}
                className="h-10 px-4 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto"
                style={{ borderRadius: 0 }}
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">Quarantine</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
