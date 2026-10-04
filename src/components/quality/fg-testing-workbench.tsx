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
} from "lucide-react";
import { useQuality } from "@/lib/context/quality-context";
import { FgTestParameters, QcStatus } from "@/lib/types/quality";

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

  if (!currentBatch) {
    return (
      <div className="bg-white border border-neutral-300 p-8 text-center text-neutral-600">
        No active finished goods batches awaiting testing.
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 sm:space-y-6 select-none">
      {/* ========================================================================= */}
      {/* 1. COMPACT COMMAND HEADER (with Desktop Actions)                          */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-300 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Finished Goods Testing
        </h1>

        {/* Batch Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-neutral-700 whitespace-nowrap shrink-0">
            Select Batch:
          </label>
          <select
            value={currentBatch.id}
            onChange={(e) => setActiveFgSampleId(e.target.value)}
            className="h-10 px-3 bg-white border border-neutral-300 text-xs font-bold font-mono text-neutral-900 focus:outline-none focus:border-[#059669] flex-1 sm:w-64 min-w-0 truncate"
          >
            {fgSamples.map((b) => (
              <option key={b.id} value={b.id}>
                {b.batchNumber} ({b.quantityMT} MT)
              </option>
            ))}
          </select>
        </div>
      </div>

      {decisionFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          <span>{decisionFeedback}</span>
        </div>
      )}

      {/* Batch Metadata Header */}
      <div className="bg-transparent border-0 p-0 sm:border sm:border-neutral-300 sm:p-5 sm:bg-white space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-3 bg-neutral-100/70 border border-neutral-200 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">FG Batch ID</span>
            <span className="font-mono font-bold text-neutral-900">{currentBatch.batchNumber}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Production Run</span>
            <span className="font-mono font-bold text-neutral-900">{currentBatch.productionBatchNumber}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Product Spec</span>
            <span className="font-semibold text-neutral-900">{currentBatch.productName}</span>
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
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Status</span>
            <span className="font-bold text-[#047857] uppercase text-[10px] px-1.5 py-0.5 bg-emerald-100 inline-block mt-0.5">
              {currentBatch.status}
            </span>
          </div>
        </div>

        {/* 6-Parameter Finished Pellet Matrix */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Test Parameters (8mm Industrial)
            </label>
            <span className="text-[10px] sm:text-[11px] text-neutral-500 font-mono">
              Tested as per ISO 17831 / ENplus A1 protocol
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Pellet Diameter */}
            <div className="border border-neutral-300 p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-700">Pellet Diameter (mm)</label>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 ${
                  isDiameterOut ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {isDiameterOut ? "OUT OF TOLERANCE" : "8mm STANDARD"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  value={diameter}
                  onChange={(e) => setDiameter(parseFloat(e.target.value) || 0)}
                  className="h-10 w-full px-3 bg-white border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
                <span className="text-xs text-neutral-500 font-mono">mm</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Calibrated Gauge Spec: 7.80 – 8.20 mm</p>
            </div>

            {/* 2. Moisture % */}
            <div className="border border-neutral-300 p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-700">Final Moisture (%)</label>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 ${
                  isMoistureOut ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {isMoistureOut ? "HIGH (>8.0%)" : "COMPLIANT (≤8.0%)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(parseFloat(e.target.value) || 0)}
                  className="h-10 w-full px-3 bg-white border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
                <span className="text-xs text-neutral-500 font-mono">%</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Guaranteed Delivery Limit: ≤ 8.0%</p>
            </div>

            {/* 3. Ash % */}
            <div className="border border-neutral-300 p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-700">Ash Content (%)</label>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 ${
                  isAshOut ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {isAshOut ? "HIGH (>5.0%)" : "COMPLIANT (≤5.0%)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={ash}
                  onChange={(e) => setAsh(parseFloat(e.target.value) || 0)}
                  className="h-10 w-full px-3 bg-white border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
                <span className="text-xs text-neutral-500 font-mono">%</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Industrial Boiler Spec: ≤ 5.0%</p>
            </div>

            {/* 4. GCV (kcal/kg) */}
            <div className="border border-neutral-300 p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-700">Net/Gross Calorific Value</label>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 ${
                  isGcvLow ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {isGcvLow ? "LOW (<4200)" : "PREMIUM (≥4200)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="10"
                  value={gcv}
                  onChange={(e) => setGcv(parseInt(e.target.value, 10) || 0)}
                  className="h-10 w-full px-3 bg-white border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
                <span className="text-xs text-neutral-500 font-mono whitespace-nowrap">kcal/kg</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Guaranteed GCV: ≥ 4,200 kcal/kg</p>
            </div>

            {/* 5. Bulk Density */}
            <div className="border border-neutral-300 p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-700">Bulk Density (kg/m³)</label>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 ${
                  isDensityLow ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {isDensityLow ? "LOW (<650)" : "DENSE (≥650)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="5"
                  value={bulkDensity}
                  onChange={(e) => setBulkDensity(parseInt(e.target.value, 10) || 0)}
                  className="h-10 w-full px-3 bg-white border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
                <span className="text-xs text-neutral-500 font-mono whitespace-nowrap">kg/m³</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Packing & Transport Target: ≥ 650 kg/m³</p>
            </div>

            {/* 6. Fines % (Durability) */}
            <div className="border border-neutral-300 p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-700">Fines &amp; Dust (%)</label>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 ${
                  isFinesHigh ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {isFinesHigh ? "EXCESS DUST (>1.5%)" : "DURABLE (≤1.5%)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={fines}
                  onChange={(e) => setFines(parseFloat(e.target.value) || 0)}
                  className="h-10 w-full px-3 bg-white border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
                <span className="text-xs text-neutral-500 font-mono">%</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Screening Durability Limit: ≤ 1.5% fines</p>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div className="pt-4 border-t border-neutral-200">
          <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
            Lab Certification Remarks &amp; Customer Concessions
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Excellent mechanical durability, shiny surface glaze, GCV 4320 exceeds client benchmark. Certified for dispatches."
            className="w-full min-h-[56px] sm:min-h-[48px] p-3 text-xs leading-relaxed bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] resize-none"
          />
        </div>

        {/* Gatekeeper Footer: Section 22 Rule */}
        <div className="pt-4 border-t border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-neutral-600">
            <span className="font-semibold text-neutral-900">PDF Sec 22 Core Rule:</span> Only approved finished goods become <strong className="text-emerald-700">dispatchable inventory</strong>.
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleDecision("REJECTED")}
              className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Batch</span>
            </button>

            <button
              type="button"
              onClick={() => handleDecision("HOLD")}
              className="h-10 px-4 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Quarantine</span>
            </button>

            <button
              type="button"
              onClick={() => handleDecision("APPROVED")}
              className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer w-full sm:w-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Authorize Dispatch &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
