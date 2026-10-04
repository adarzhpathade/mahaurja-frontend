"use client";

import React from "react";
import {
  RotateCcw,
  Zap,
  ArrowRight,
  XCircle,
  Truck,
} from "lucide-react";
import { useWeighbridge } from "@/lib/context/weighbridge-context";
import { Can } from "@/lib/context/auth-context";

interface ScaleIndicatorProps {
  onCaptureClick?: () => void;
  className?: string;
}

export function ScaleIndicator({ onCaptureClick, className = "" }: ScaleIndicatorProps) {
  const {
    platforms,
    activePlatformId,
    setActivePlatformId,
    activePlatform,
    zeroScale,
    clearPlatform,
  } = useWeighbridge();

  const weightMT = activePlatform.currentWeightMT;
  const isStable = activePlatform.stability === "STABLE";

  return (
    <div
      className={`bg-white border border-neutral-300 overflow-hidden shadow-2xs select-none ${className}`}
      style={{ borderRadius: 0 }}
    >
      {/* Platform Switcher Tabs Bar */}
      <div className="bg-[#F8F9FA] px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-neutral-300 flex items-center justify-between gap-2">
        <div className="inline-flex border border-neutral-300 bg-white p-0.5" style={{ borderRadius: 0 }}>
          {platforms.map((p) => {
            const isActive = p.id === activePlatformId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePlatformId(p.id)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#18181B] text-white shadow-xs"
                    : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
                style={{ borderRadius: 0 }}
              >
                <span className="font-mono">{p.id}</span>
                <span className="text-[11px] font-normal normal-case hidden sm:inline opacity-85">
                  {p.id === "WB-01" ? "Inbound (RM)" : "Outbound (FG)"}
                </span>
                <span className="text-[10px] font-normal normal-case sm:hidden opacity-85">
                  {p.id === "WB-01" ? "RM" : "FG"}
                </span>
                {p.status === "OCCUPIED" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Status + Zero Button */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase border ${
              isStable
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-amber-50 text-amber-800 border-amber-300"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isStable ? "bg-emerald-600" : "bg-amber-500 animate-ping"
              }`}
            />
            <span className="hidden sm:inline">{isStable ? "Scale Stable" : "In Motion"}</span>
            <span className="sm:hidden">{isStable ? "Stable" : "Motion"}</span>
          </span>

          <button
            type="button"
            onClick={() => zeroScale(activePlatformId)}
            className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            style={{ borderRadius: 0 }}
            title="Zero the load cells"
          >
            <RotateCcw className="w-3 h-3 text-neutral-500" />
            <span>Zero</span>
          </button>
        </div>
      </div>

      {/* Main Digital Readout Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200">
        {/* Zone 1: Live Weight Telemetry Readout (4 cols) */}
        <div className="lg:col-span-4 p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Live Scale Telemetry
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-700">
              {activePlatform.id}
            </span>
          </div>

          <div className="flex items-baseline gap-2.5 my-auto">
            <span className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-neutral-900 tabular-nums">
              {weightMT.toFixed(2)}
            </span>
            <span className="font-mono text-2xl font-bold text-neutral-400">
              MT
            </span>
          </div>

          <div className="text-[11px] text-neutral-500 font-medium truncate">
            {activePlatform.name} · {activePlatformId === "WB-01" ? "Inbound Biomass RM" : "Outbound FG Dispatch"}
          </div>
        </div>

        {/* Zone 2: Active Truck on Deck (5 cols) */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-3 bg-[#FAFAFA]/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#059669] flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>Truck on Deck ({activePlatformId})</span>
            </span>
            {activePlatform.occupiedVehicle && (
              <button
                type="button"
                onClick={() => clearPlatform(activePlatformId)}
                className="text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer transition-colors"
                title="Remove truck from scale"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Clear Deck</span>
              </button>
            )}
          </div>

          {activePlatform.occupiedVehicle ? (
            <div className="space-y-1.5 my-auto">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono font-black text-xl sm:text-2xl text-neutral-900">
                  {activePlatform.occupiedVehicle.vehicleNo}
                </span>
                <span className="font-mono text-xs font-bold text-neutral-600 bg-neutral-200/80 px-2 py-0.5 border border-neutral-300">
                  {activePlatform.occupiedVehicle.gateEntryNo}
                </span>
              </div>
              <div className="text-xs font-semibold text-neutral-800 truncate">
                {activePlatform.occupiedVehicle.materialName}
              </div>
              <div className="text-[11px] text-neutral-500 truncate">
                {activePlatform.occupiedVehicle.supplierOrCustomer || "Supplier"} · {activePlatform.occupiedVehicle.driverName}
              </div>
            </div>
          ) : (
            <div className="my-auto py-2">
              <div className="font-mono text-sm font-semibold text-neutral-400">
                Deck is Currently Empty
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Select a waiting vehicle below to position on {activePlatformId}
              </div>
            </div>
          )}

          <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>Deck Status: {activePlatform.occupiedVehicle ? "Occupied · Ready" : "Awaiting Vehicle"}</span>
            <span>Max {activePlatform.maxCapacityMT} MT</span>
          </div>
        </div>

        {/* Zone 3: Primary Action & Official Capture (3 cols) */}
        <div className="lg:col-span-3 p-4 sm:p-5 flex flex-col justify-between space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Official Weighment
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border ${
                isStable
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-amber-50 border-amber-300 text-amber-800"
              }`}
            >
              {isStable ? "READY" : "MOTION"}
            </span>
          </div>

          <div className="my-auto py-1">
            <Can
              perm="weighment:capture"
              fallback={
                <div className="w-full h-12 sm:h-13 px-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center bg-neutral-100 text-neutral-500 border border-neutral-300">
                  Read-Only Metrology (Management)
                </div>
              }
            >
              <button
                type="button"
                onClick={onCaptureClick}
                disabled={!isStable}
                className={`w-full h-12 sm:h-13 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] shadow-xs ${
                  isStable
                    ? "bg-[#059669] hover:bg-[#047857] text-white border border-[#10B981]"
                    : "bg-neutral-200 text-neutral-400 border border-neutral-300 cursor-not-allowed"
                }`}
                style={{ borderRadius: 0 }}
              >
                <Zap className="w-4 h-4 fill-white shrink-0" />
                <span className="truncate">{isStable ? "Capture Official Weight" : "Wait for Scale"}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </Can>
          </div>

          <div className="text-[11px] font-mono text-neutral-400 text-center truncate">
            {isStable ? "● Digital load cell stable & locked" : "○ Scale motion detected"}
          </div>
        </div>
      </div>
    </div>
  );
}
