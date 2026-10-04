"use client";

import React, { useState } from "react";
import {
  Factory,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Gauge,
  Activity,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useProduction } from "@/lib/context/production-context";

export function ProcessingStagesConsole() {
  const { stages, advanceStage } = useProduction();
  const [selectedStageId, setSelectedStageId] = useState<number>(5); // default to active pelletisation

  const activeStage = stages.find((s) => s.stageId === selectedStageId) || stages[4];

  const handleAdvance = (stageId: number) => {
    advanceStage(stageId);
    if (stageId < 7) {
      setSelectedStageId(stageId + 1);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-300">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Factory className="w-4 h-4 text-[#059669]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
              PDF Sections 14–20 · 7-Stage Continuous Pellet Production Line
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
            7-Stage Biomass Processing &amp; Pelletising Console
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
          <span className="text-xs font-mono font-bold text-neutral-800">Line 1 · 8mm Pellets Live</span>
        </div>
      </div>

      {/* 7-Stage Horizontal Pipeline Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 p-1.5 bg-neutral-200/60 border border-neutral-300">
        {stages.map((stage) => {
          const isSelected = stage.stageId === selectedStageId;
          const isCompleted = stage.status === "COMPLETED";
          const isInProgress = stage.status === "IN_PROGRESS";

          return (
            <button
              key={stage.stageId}
              type="button"
              onClick={() => setSelectedStageId(stage.stageId)}
              className={`p-2.5 text-left border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#18181B] text-white border-[#18181B] shadow-sm"
                  : isCompleted
                  ? "bg-emerald-50 text-neutral-800 border-emerald-300 hover:bg-emerald-100"
                  : isInProgress
                  ? "bg-white text-neutral-900 border-[#059669] ring-1 ring-[#059669]"
                  : "bg-white/70 text-neutral-600 border-neutral-300 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span>STAGE 0{stage.stageId}</span>
                <span className={`font-bold ${
                  isCompleted ? "text-[#047857]" : isInProgress ? "text-amber-600 animate-pulse" : "text-neutral-400"
                }`}>
                  {isCompleted ? "DONE" : isInProgress ? "LIVE" : "WAIT"}
                </span>
              </div>
              <div className="font-bold text-xs truncate">
                {stage.stageName.split(" ")[0]}
              </div>
              <div className="text-[10px] opacity-70 truncate mt-0.5">
                {stage.sectionRef}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Cockpit */}
      <div className="bg-white border border-neutral-300 p-5 space-y-6">
        {/* Stage Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-neutral-500">
                STAGE 0{activeStage.stageId} · {activeStage.sectionRef}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                activeStage.status === "COMPLETED"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : activeStage.status === "IN_PROGRESS"
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-neutral-200 text-neutral-700"
              }`}>
                {activeStage.status.replace("_", " ")}
              </span>
            </div>
            <h2 className="text-xl font-black text-neutral-900 mt-0.5">
              {activeStage.stageName}
            </h2>
            <p className="text-xs text-neutral-600">
              Primary Machine: <strong className="text-neutral-900">{activeStage.machineName}</strong> · Assigned Operator:{" "}
              <strong className="text-neutral-900">{activeStage.operatorName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">Start Time</span>
              <span className="font-mono font-bold text-xs text-neutral-900">{activeStage.startTime}</span>
            </div>
            {activeStage.endTime && (
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">End Time</span>
                <span className="font-mono font-bold text-xs text-neutral-900">{activeStage.endTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3-Col Mass Balance & Telemetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-50 border border-neutral-200">
            <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">
              Input Biomass Quantity
            </span>
            <div className="font-mono font-black text-2xl text-neutral-900">
              {activeStage.inputQuantityMT} MT
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Transferred from preceding station</p>
          </div>

          <div className="p-4 bg-neutral-50 border border-neutral-200">
            <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">
              Output Delivered
            </span>
            <div className="font-mono font-black text-2xl text-[#059669]">
              {activeStage.outputQuantityMT} MT
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Net processed throughput</p>
          </div>

          <div className="p-4 bg-neutral-50 border border-neutral-200">
            <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">
              Process Variance / Loss
            </span>
            <div className="font-mono font-black text-2xl text-amber-700">
              {activeStage.lossQuantityMT} MT
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Moisture evaporation, sand or fines</p>
          </div>
        </div>

        {/* Specialized Stage Metrics & Sensor Telemetry */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
            Real-Time Stage Telemetry &amp; Sensor Readings
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(activeStage.specialMetrics).map(([k, v]) => (
              <div key={k} className="p-3 bg-white border border-neutral-300">
                <span className="text-[10px] text-neutral-500 uppercase font-semibold block mb-0.5">{k}</span>
                <span className="font-mono font-bold text-sm text-neutral-900">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Machine Status & Stage Advancement Footer */}
        <div className="pt-4 border-t border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Motor load &amp; vibration sensors within standard green operating thresholds.</span>
          </div>

          {activeStage.status === "IN_PROGRESS" && (
            <button
              type="button"
              onClick={() => handleAdvance(activeStage.stageId)}
              className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Stage &amp; Advance to Stage 0{activeStage.stageId + 1} &rarr;</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
