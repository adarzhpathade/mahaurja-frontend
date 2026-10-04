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
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useQuality } from "@/lib/context/quality-context";
import { RmTestParameters, QcStatus } from "@/lib/types/quality";

const PRESET_RM_REMARKS = [
  "Clean golden dry biomass, low moisture",
  "Zero soil or stones, optimal quality",
  "Approved for immediate silo intake",
  "Screening pass required prior to grinding",
];

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

  const handleAddPresetRemark = (preset: string) => {
    if (!remarks.trim()) {
      setRemarks(preset);
    } else if (!remarks.includes(preset)) {
      setRemarks(`${remarks}, ${preset}`);
    }
  };

  if (!currentSample) {
    return (
      <div className="bg-white border border-neutral-300 p-8 text-center text-neutral-600" style={{ borderRadius: 0 }}>
        No active raw material samples found in testing queue.
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
          Raw Material Testing
        </h1>

        {/* Quick Sample Selector (Visible on Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 whitespace-nowrap shrink-0">
            Select Sample:
          </label>
          <select
            value={currentSample.id}
            onChange={(e) => setActiveRmSampleId(e.target.value)}
            className="h-10 px-3 bg-white border border-neutral-300 text-xs font-bold font-mono text-neutral-900 focus:outline-none focus:border-[#059669] w-64 truncate cursor-pointer"
            style={{ borderRadius: 0 }}
          >
            {rmSamples.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} · {s.vehicleNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Sample Selector Bar (Full Width on Mobile) */}
      <div className="sm:hidden flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
          Active RM Sample for Testing:
        </label>
        <select
          value={currentSample.id}
          onChange={(e) => setActiveRmSampleId(e.target.value)}
          className="w-full h-11 px-3 bg-white border border-neutral-300 text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
          style={{ borderRadius: 0 }}
        >
          {rmSamples.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} · {s.vehicleNumber} ({s.status})
            </option>
          ))}
        </select>
      </div>

      {decisionFeedback && (
        <div
          className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in"
          style={{ borderRadius: 0 }}
        >
          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          <span>{decisionFeedback}</span>
        </div>
      )}

      {/* Main Testing Console */}
      <div
        className="w-full bg-transparent border-0 sm:border sm:border-neutral-300 p-0 sm:p-5 space-y-5"
        style={{ borderRadius: 0 }}
      >
        {/* Sample Context Strip (Crisp Telemetry Strip) */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-3 bg-neutral-200/50 border border-neutral-300 text-xs"
          style={{ borderRadius: 0 }}
        >
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
            <span className="font-semibold text-neutral-900 truncate block">{currentSample.materialName}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Supplier</span>
            <span className="font-medium text-neutral-800 truncate block">{currentSample.supplierName}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Dump Yard</span>
            <span className="font-medium text-neutral-800 truncate block">{currentSample.unloadingLocation}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-neutral-500 block">Sample Status</span>
            <span
              className={`font-bold uppercase text-[10px] font-mono px-2 py-0.5 border inline-block mt-0.5 ${getStatusBadge(
                currentSample.status
              )}`}
              style={{ borderRadius: 0 }}
            >
              {currentSample.status}
            </span>
          </div>
        </div>

        {/* 6-Parameter Laboratory Test Matrix */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#059669] shrink-0" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Laboratory Test Readings
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline">
              Calibrated: Sartorius &amp; IKA Bomb Calorimeter
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {/* 1. Moisture % */}
            <div
              className="bg-white border border-neutral-300 p-3 sm:p-3.5 space-y-2 hover:border-neutral-400 focus-within:border-[#059669] transition-all"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Moisture Content
                </label>
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 border ${
                    isMoistureFail
                      ? "bg-red-50 text-red-700 border-red-300"
                      : isMoistureWarning
                      ? "bg-amber-50 text-amber-800 border-amber-300"
                      : "bg-emerald-50 text-[#047857] border-emerald-300"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {isMoistureFail ? "OUT OF SPEC (>14%)" : isMoistureWarning ? "WARNING (10-14%)" : "OPTIMAL (≤10%)"}
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
                <span>Standard: ≤ 10.0% (Max: 14%)</span>
                <span className={isMoistureFail ? "text-red-600 font-bold" : isMoistureWarning ? "text-amber-600 font-bold" : "text-[#059669] font-bold"}>
                  {isMoistureFail ? "Excess Moisture" : isMoistureWarning ? "Moderate" : "Dry"}
                </span>
              </div>
            </div>

            {/* 2. Ash % */}
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
                    isAshFail
                      ? "bg-red-50 text-red-700 border-red-300"
                      : isAshWarning
                      ? "bg-amber-50 text-amber-800 border-amber-300"
                      : "bg-emerald-50 text-[#047857] border-emerald-300"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {isAshFail ? "OUT OF SPEC (>12%)" : isAshWarning ? "WARNING (8-12%)" : "OPTIMAL (≤8%)"}
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
                <span>Standard: ≤ 8.0% (Max: 12%)</span>
                <span className={isAshFail ? "text-red-600 font-bold" : isAshWarning ? "text-amber-600 font-bold" : "text-[#059669] font-bold"}>
                  {isAshFail ? "Excess Ash" : isAshWarning ? "Acceptable" : "Clean"}
                </span>
              </div>
            </div>

            {/* 3. GCV (kcal/kg) */}
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
                    isGcvFail
                      ? "bg-red-50 text-red-700 border-red-300"
                      : "bg-emerald-50 text-[#047857] border-emerald-300"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {isGcvFail ? "LOW (<3800)" : "COMPLIANT (≥3800)"}
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
                <span>Contract Target: ≥ 3,800 kcal/kg</span>
                <span className={isGcvFail ? "text-red-600 font-bold" : "text-[#059669] font-bold"}>
                  {gcv >= 3800 ? "High Yield" : "Low Energy"}
                </span>
              </div>
            </div>

            {/* 4. Foreign Matter % */}
            <div
              className="bg-white border border-neutral-300 p-3 sm:p-3.5 space-y-2 hover:border-neutral-400 focus-within:border-[#059669] transition-all"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Foreign Matter &amp; Sand
                </label>
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 border ${
                    isForeignMatterFail
                      ? "bg-red-50 text-red-700 border-red-300"
                      : "bg-emerald-50 text-[#047857] border-emerald-300"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {isForeignMatterFail ? "EXCESS (>2%)" : "ACCEPTABLE (≤2%)"}
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={foreignMatter}
                  onChange={(e) => setForeignMatter(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 pl-3 pr-10 bg-neutral-50/60 border border-neutral-300 text-sm font-mono font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#059669] transition-all"
                  style={{ borderRadius: 0 }}
                />
                <span className="absolute right-3 text-xs font-mono font-bold text-neutral-400 pointer-events-none">
                  %
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-0.5">
                <span>Maximum Allowed: ≤ 2.0%</span>
                <span className={isForeignMatterFail ? "text-red-600 font-bold" : "text-[#059669] font-bold"}>
                  {foreignMatter <= 2.0 ? "Clean Lot" : "Sand/Stone Alert"}
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
                  className="text-[10px] font-bold font-mono px-2 py-0.5 border bg-neutral-100 border-neutral-300 text-neutral-700"
                  style={{ borderRadius: 0 }}
                >
                  STANDARD (≥160)
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
                <span>Target: 160 – 240 kg/m³</span>
                <span className="text-[#059669] font-bold">Standard Density</span>
              </div>
            </div>

            {/* 6. Visual Grade */}
            <div
              className="bg-white border border-neutral-300 p-3 sm:p-3.5 space-y-2 hover:border-neutral-400 focus-within:border-[#059669] transition-all"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Visual Quality Grade
                </label>
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 border ${
                    visualGrade === "OFF_SPEC"
                      ? "bg-red-50 text-red-700 border-red-300"
                      : "bg-emerald-50 text-[#047857] border-emerald-300"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {visualGrade === "OFF_SPEC" ? "OFF SPEC" : "INSPECTED"}
                </span>
              </div>
              <div className="relative">
                <select
                  value={visualGrade}
                  onChange={(e) => setVisualGrade(e.target.value as any)}
                  className="w-full h-10 px-3 bg-neutral-50/60 border border-neutral-300 text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:border-[#059669] transition-all cursor-pointer truncate"
                  style={{ borderRadius: 0 }}
                >
                  <option value="GRADE_A">Grade A — Clean, Dry, Uniform Color</option>
                  <option value="GRADE_B">Grade B — Acceptable Minor Fines</option>
                  <option value="GRADE_C">Grade C — High Moisture / Needs Aeration</option>
                  <option value="OFF_SPEC">Off-Spec — Contaminated / Heavy Mud</option>
                </select>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-0.5">
                <span>Visual texture check</span>
                <span className={visualGrade === "OFF_SPEC" ? "text-red-600 font-bold" : "text-[#059669] font-bold"}>
                  {visualGrade.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Remarks & Quarantine Notes with Quick Action Preset Chips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 sm:mt-5 pt-5 sm:pt-4 border-t border-neutral-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#059669] shrink-0" />
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Chemist Observations &amp; Remarks
              </label>
            </div>

            {/* Quick Preset Action Chips */}
            <div className="flex flex-wrap gap-2 pt-0.5">
              {PRESET_RM_REMARKS.map((preset) => (
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
              placeholder="Enter chemist observations or tap preset chips above..."
              className="w-full min-h-[56px] sm:min-h-[48px] p-3 text-xs leading-relaxed bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all resize-none"
              style={{ borderRadius: 0 }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Quarantine / HOLD Reason (Required for HOLD)
              </label>
            </div>

            <div className="pt-0.5">
              <textarea
                rows={2}
                value={quarantineReason}
                onChange={(e) => setQuarantineReason(e.target.value)}
                placeholder="e.g. Moisture at 15.2% exceeds limits. Consignment moved to Yard A covered shed for 24h aeration..."
                className="w-full min-h-[56px] sm:min-h-[48px] p-3 text-xs leading-relaxed bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                style={{ borderRadius: 0 }}
              />
            </div>
          </div>
        </div>

        {/* Out of spec warning banner if failed */}
        {hasAnyFail && (
          <div
            className="p-3 bg-red-50 border border-red-300 text-red-900 text-xs flex items-center gap-2"
            style={{ borderRadius: 0 }}
          >
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Specification Alert:</strong> One or more parameters exceed permissible threshold limits. System rules recommend HOLD or REJECT.
            </span>
          </div>
        )}

        {/* Action Decision Footer: Section 6 Non-Negotiable Rule & Decision Actions */}
        <div className="mt-6 sm:mt-5 pt-5 sm:pt-4 border-t border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-neutral-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
            <span>
              <strong className="text-neutral-900">PDF Sec 6 Rule:</strong> Rejected raw material will{" "}
              <strong className="text-red-700">NOT</strong> become available production inventory.
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
              <span>Approve for Receiving &rarr;</span>
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
                <span className="truncate">Reject Lot</span>
              </button>

              <button
                type="button"
                onClick={() => handleDecision("HOLD")}
                className="h-10 px-4 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto"
                style={{ borderRadius: 0 }}
              >
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">Put on HOLD</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
