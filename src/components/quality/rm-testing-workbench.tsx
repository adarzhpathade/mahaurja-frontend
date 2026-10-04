"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { useQuality } from "@/lib/context/quality-context";
import { RmTestParameters, QcStatus } from "@/lib/types/quality";

export function RmTestingWorkbench() {
  const router = useRouter();
  const { rmSamples, activeRmSampleId, setActiveRmSampleId, submitRmTest } = useQuality();

  const currentSample =
    rmSamples.find((s) => s.id === activeRmSampleId) ||
    rmSamples.find((s) => s.status === "PENDING" || s.status === "TESTING") ||
    rmSamples[0];

  const [moisture, setMoisture] = useState<number>(
    currentSample?.parameters?.moisturePercent ?? 9.5
  );
  const [ash, setAsh] = useState<number>(
    currentSample?.parameters?.ashPercent ?? 5.8
  );
  const [gcv, setGcv] = useState<number>(
    currentSample?.parameters?.gcvKcal ?? 4150
  );
  const [foreignMatter, setForeignMatter] = useState<number>(
    currentSample?.parameters?.foreignMatterPercent ?? 1.1
  );
  const [bulkDensity, setBulkDensity] = useState<number>(
    currentSample?.parameters?.bulkDensityKgM3 ?? 190
  );
  const [visualGrade, setVisualGrade] = useState<"GRADE_A" | "GRADE_B" | "GRADE_C" | "OFF_SPEC">(
    currentSample?.parameters?.visualGrade ?? "GRADE_A"
  );
  const [remarks, setRemarks] = useState<string>(currentSample?.remarks ?? "");
  const [quarantineReason, setQuarantineReason] = useState<string>(
    currentSample?.quarantineReason ?? ""
  );
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  // Parameter tolerance logic
  const isMoistureFail = moisture > 14.0;
  const isMoistureWarning = moisture > 10.0 && moisture <= 14.0;

  const isAshFail = ash > 12.0;
  const isAshWarning = ash > 8.0 && ash <= 12.0;

  const isGcvFail = gcv < 3800;
  const isForeignMatterFail = foreignMatter > 2.0;

  const hasAnyFail = isMoistureFail || isAshFail || isGcvFail || isForeignMatterFail;
  const hasAnyWarning = isMoistureWarning || isAshWarning;

  const handleDecision = (status: QcStatus) => {
    if (!currentSample) return;

    if (status === "HOLD" && !quarantineReason.trim()) {
      setDecisionFeedback("Please provide a reason for putting this consignment on HOLD.");
      return;
    }

    const testParams: RmTestParameters = {
      moisturePercent: moisture,
      ashPercent: ash,
      gcvKcal: gcv,
      foreignMatterPercent: foreignMatter,
      bulkDensityKgM3: bulkDensity,
      visualGrade,
    };

    submitRmTest(currentSample.id, testParams, status, remarks, quarantineReason);
    setDecisionFeedback(`Decision recorded: Consignment marked as ${status}.`);

    setTimeout(() => {
      router.push("/quality/reports");
    }, 1200);
  };

  if (!currentSample) {
    return (
      <div className="bg-white border border-neutral-300 p-8 text-center text-neutral-600">
        No active raw material samples found in testing queue.
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
          Raw Material Testing
        </h1>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-neutral-700 whitespace-nowrap shrink-0">
            Select Sample:
          </label>
          <select
            value={currentSample.id}
            onChange={(e) => setActiveRmSampleId(e.target.value)}
            className="h-10 px-3 bg-white border border-neutral-300 text-xs font-bold font-mono text-neutral-900 focus:outline-none focus:border-[#059669] flex-1 sm:w-64 min-w-0 truncate"
          >
            {rmSamples.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} · {s.vehicleNumber}
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

      {/* Main Workbench: 3-Column Zero-Scroll Layout (< 650px) */}
      <div className="bg-transparent border-0 p-0 sm:border sm:border-neutral-300 sm:p-5 sm:bg-white space-y-5">
        {/* Sample Context Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-3 bg-neutral-100/70 border border-neutral-200 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Sample ID</span>
            <span className="font-mono font-bold text-neutral-900">{currentSample.id}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Vehicle Plate</span>
            <span className="font-mono font-bold text-neutral-900">{currentSample.vehicleNumber}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Material</span>
            <span className="font-semibold text-neutral-900">{currentSample.materialName}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Supplier</span>
            <span className="font-medium text-neutral-800 truncate block">{currentSample.supplierName}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Dump Yard</span>
            <span className="font-medium text-neutral-800">{currentSample.unloadingLocation}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Current Status</span>
            <span className="font-bold text-[#047857] uppercase text-[10px] px-1.5 py-0.5 bg-emerald-100 inline-block mt-0.5">
              {currentSample.status}
            </span>
          </div>
        </div>

        {/* 6-Parameter Laboratory Test Matrix */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
              <span>Laboratory Test Readings</span>
            </label>
            <span className="text-[10px] sm:text-[11px] text-neutral-500 font-mono">
              Calibrated: Sartorius &amp; IKA Bomb Calorimeter
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Moisture % */}
            <div className="border border-neutral-300 p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-700">Moisture Content (%)</label>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 ${
                  isMoistureFail
                    ? "bg-red-100 text-red-800"
                    : isMoistureWarning
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}>
                  {isMoistureFail ? "OUT OF SPEC (>14%)" : isMoistureWarning ? "WARNING (10-14%)" : "OPTIMAL (≤10%)"}
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
              <p className="text-[10px] text-neutral-500 mt-1">Standard: ≤ 10.0% · Maximum Tolerable: 14.0%</p>
            </div>

            {/* 2. Ash % */}
            <div className="border border-neutral-300 p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-700">Ash Content (%)</label>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 ${
                  isAshFail
                    ? "bg-red-100 text-red-800"
                    : isAshWarning
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}>
                  {isAshFail ? "OUT OF SPEC (>12%)" : isAshWarning ? "WARNING (8-12%)" : "OPTIMAL (≤8%)"}
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
              <p className="text-[10px] text-neutral-500 mt-1">Standard: ≤ 8.0% · Maximum Tolerable: 12.0%</p>
            </div>

            {/* 3. GCV (kcal/kg) */}
            <div className="border border-neutral-300 p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-700">Gross Calorific Value (GCV)</label>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 ${
                  isGcvFail ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {isGcvFail ? "LOW (<3800)" : "COMPLIANT (≥3800)"}
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
              <p className="text-[10px] text-neutral-500 mt-1">Minimum Contract Spec: ≥ 3,800 kcal/kg</p>
            </div>

            {/* 4. Foreign Matter % */}
            <div className="border border-neutral-300 p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-700">Foreign Matter &amp; Sand (%)</label>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 ${
                  isForeignMatterFail ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {isForeignMatterFail ? "EXCESS (>2%)" : "ACCEPTABLE (≤2%)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={foreignMatter}
                  onChange={(e) => setForeignMatter(parseFloat(e.target.value) || 0)}
                  className="h-10 w-full px-3 bg-white border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
                <span className="text-xs text-neutral-500 font-mono">%</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Maximum Allowed: ≤ 2.0%</p>
            </div>

            {/* 5. Bulk Density */}
            <div className="border border-neutral-300 p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-700">Bulk Density (kg/m³)</label>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-neutral-100 text-neutral-700">
                  STANDARD (≥160)
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
              <p className="text-[10px] text-neutral-500 mt-1">Target: 160 – 240 kg/m³ for raw biomass</p>
            </div>

            {/* 6. Visual Grade */}
            <div className="border border-neutral-300 p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-700">Visual Quality Grade</label>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800">
                  LAB EVAL
                </span>
              </div>
              <select
                value={visualGrade}
                onChange={(e) => setVisualGrade(e.target.value as any)}
                className="h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#059669]"
              >
                <option value="GRADE_A">Grade A — Clean, Dry, Uniform Color</option>
                <option value="GRADE_B">Grade B — Acceptable Minor Fines</option>
                <option value="GRADE_C">Grade C — High Moisture / Needs Aeration</option>
                <option value="OFF_SPEC">Off-Spec — Contaminated / Heavy Mud</option>
              </select>
              <p className="text-[10px] text-neutral-500 mt-1">Visual inspection of physical sample texture</p>
            </div>
          </div>
        </div>

        {/* Remarks & Quarantine Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Chemist Observations &amp; Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Clean golden dry shell, negligible soil particles. Approved for direct silo intake."
              className="w-full min-h-[56px] sm:min-h-[48px] p-3 text-xs leading-relaxed bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Quarantine / HOLD Reason (Required only if placing on HOLD)
            </label>
            <textarea
              value={quarantineReason}
              onChange={(e) => setQuarantineReason(e.target.value)}
              placeholder="e.g. Moisture at 16.8% exceeds limits. Consignment moved to Yard A covered shed for 24h aeration."
              className="w-full min-h-[56px] sm:min-h-[48px] p-3 text-xs leading-relaxed bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>
        </div>

        {/* Out of spec warning banner if failed */}
        {hasAnyFail && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-900 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Specification Alert:</strong> One or more parameters exceed permissible threshold limits. System rules recommend HOLD or REJECT.
            </span>
          </div>
        )}

        {/* Action Decision Footer (PDF Sec 6 Non-Negotiable Rule) */}
        <div className="pt-4 border-t border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-neutral-600">
            <span className="font-semibold text-neutral-900">PDF Sec 6 Rule:</span> Rejected raw material will <strong className="text-red-700">NOT</strong> become available production inventory.
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* REJECT BUTTON */}
            <button
              type="button"
              onClick={() => handleDecision("REJECTED")}
              className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Consignment</span>
            </button>

            {/* HOLD BUTTON */}
            <button
              type="button"
              onClick={() => handleDecision("HOLD")}
              className="h-10 px-4 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Put on HOLD</span>
            </button>

            {/* APPROVE BUTTON (Bio-Emerald) */}
            <button
              type="button"
              onClick={() => handleDecision("APPROVED")}
              className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer w-full sm:w-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve for Receiving &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
