"use client";

import React, { useState, useEffect } from "react";
import {
  Scale,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  ArrowRight,
  Truck,
  ShieldCheck,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWeighbridge } from "@/lib/context/weighbridge-context";
import { PlatformId } from "@/lib/types/weighbridge";

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
    setPlatformWeight,
    setPlatformStability,
    zeroScale,
  } = useWeighbridge();

  const [unit, setUnit] = useState<"MT" | "KG">("MT");
  const [isJittering, setIsJittering] = useState(false);

  // Display value calculations
  const weightMT = activePlatform.currentWeightMT;
  const weightKG = Math.round(weightMT * 1000);
  const displayValue =
    unit === "MT"
      ? weightMT.toFixed(2)
      : weightKG.toLocaleString("en-IN");

  const isStable = activePlatform.stability === "STABLE";
  const isOccupied = activePlatform.status === "OCCUPIED" && weightMT > 0.5;

  // Toggle stability simulation
  const toggleStability = () => {
    if (isStable) {
      setPlatformStability(activePlatformId, "IN_MOTION");
      setIsJittering(true);
    } else {
      setPlatformStability(activePlatformId, "STABLE");
      setIsJittering(false);
    }
  };

  // Small realistic live fluctuation when in motion
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activePlatform.stability === "IN_MOTION") {
      interval = setInterval(() => {
        const jitter = (Math.random() - 0.5) * 0.12;
        const newWeight = Math.max(0, Number((weightMT + jitter).toFixed(2)));
        setPlatformWeight(activePlatformId, newWeight);
      }, 400);
    }
    return () => clearInterval(interval);
  }, [activePlatform.stability, activePlatformId, weightMT, setPlatformWeight]);

  return (
    <div
      className={`bg-[#18181B] text-white border border-[#27272A] shadow-xl overflow-hidden select-none ${className}`}
      style={{ borderRadius: 0 }}
    >
      {/* Top Header: Platform Switcher & Telemetry Status Bar */}
      <div className="bg-[#09090B] px-3 sm:px-4 py-2.5 border-b border-[#27272A] flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Platform Tabs */}
        <div className="flex items-center gap-1">
          {platforms.map((p) => {
            const isActive = p.id === activePlatformId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePlatformId(p.id)}
                className={`px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer border flex items-center gap-2 ${
                  isActive
                    ? "bg-[#059669] text-white border-[#059669]"
                    : "bg-[#27272A]/60 text-neutral-400 border-neutral-700 hover:text-white hover:bg-[#27272A]"
                }`}
                style={{ borderRadius: 0 }}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{p.id}</span>
                <span className="text-[10px] opacity-80 hidden sm:inline">
                  {p.id === "WB-01" ? "(INBOUND)" : "(OUTBOUND)"}
                </span>
                {p.status === "OCCUPIED" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Telemetry Diagnostic Flags */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#18181B] border border-[#27272A] text-neutral-300">
            <span className="text-neutral-500">CAP:</span>
            <span className="text-neutral-100 font-bold">60.00 MT</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#18181B] border border-[#27272A] text-neutral-300">
            <span className="text-neutral-500">DIV:</span>
            <span className="text-neutral-100 font-bold">10 KG</span>
          </div>

          <button
            type="button"
            onClick={() => setUnit(unit === "MT" ? "KG" : "MT")}
            className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-600 cursor-pointer font-bold transition-colors"
            style={{ borderRadius: 0 }}
            title="Click to toggle MT / KG"
          >
            {unit} ⇄ {unit === "MT" ? "KG" : "MT"}
          </button>
        </div>
      </div>

      {/* Main Digital Indicator Display Canvas */}
      <div className="p-4 sm:p-6 bg-radial from-[#18181B] to-[#0A0A0C]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Giant Digital Readout (Left 8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Live Indicator Beacons */}
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase border ${
                    isStable
                      ? "bg-emerald-950/80 text-emerald-400 border-emerald-600/80"
                      : "bg-amber-950/80 text-amber-400 border-amber-600/80"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isStable ? "bg-emerald-400" : "bg-amber-400 animate-ping"
                    }`}
                  />
                  {isStable ? "STABLE SCALE" : "IN MOTION / JITTER"}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase border ${
                    isOccupied
                      ? "bg-blue-950/80 text-blue-300 border-blue-600/80"
                      : "bg-neutral-900 text-neutral-400 border-neutral-700"
                  }`}
                >
                  <Truck className="w-3 h-3" />
                  {isOccupied ? "TRUCK DETECTED" : "DECK CLEAR"}
                </span>
              </div>

              <div className="text-neutral-400 text-[11px] hidden sm:block">
                INDICATOR: <strong className="text-neutral-200">AVERY T-9001 PRO</strong>
              </div>
            </div>

            {/* Glowing 7-Segment Digital Readout Box */}
            <div className="bg-[#050507] border-2 border-neutral-800 p-4 sm:p-6 relative overflow-hidden flex items-baseline justify-between shadow-inner">
              {/* Subtle CRT raster effect lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_51%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

              <div className="relative z-10 flex items-baseline gap-3">
                <span
                  className={`font-mono text-5xl sm:text-6xl md:text-7xl font-black tracking-tight ${
                    isStable
                      ? "text-[#10B981] drop-shadow-[0_0_15px_rgba(16,185,129,0.35)]"
                      : "text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.35)]"
                  }`}
                >
                  {displayValue}
                </span>

                <span className="font-mono text-2xl sm:text-3xl font-bold text-neutral-400">
                  {unit}
                </span>
              </div>

              {/* Status Mini Matrix */}
              <div className="relative z-10 text-right font-mono text-[11px] space-y-1">
                <div className="text-neutral-400">
                  PLATFORM: <strong className="text-white">{activePlatform.name}</strong>
                </div>
                <div className="text-neutral-400">
                  GROSS EQUIV:{" "}
                  <strong className="text-emerald-400">
                    {(weightMT * 1000).toLocaleString()} KG
                  </strong>
                </div>
                <div className="text-neutral-500">
                  TOLERANCE: ± 0.01 MT
                </div>
              </div>
            </div>

            {/* Axle Load Distribution Bar Graphic */}
            <div className="mt-3 bg-neutral-900/90 border border-neutral-800 p-2.5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span className="text-neutral-400">AXLE BALANCE:</span>
              <div className="flex-1 mx-3 h-2 bg-neutral-950 border border-neutral-700 relative overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (weightMT / 60) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-neutral-200 font-bold">
                {((weightMT / 60) * 100).toFixed(0)}% LOAD
              </span>
            </div>
          </div>

          {/* Right Action Panel: Operator Controls & Actions (Right 4 cols) */}
          <div className="lg:col-span-4 bg-[#141416] border border-[#27272A] p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                <span>Scale Commands</span>
                <span className="text-emerald-400 font-mono text-[10px]">VERIFIED</span>
              </div>

              {/* Zero & Stability Toggle Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => zeroScale(activePlatformId)}
                  className="px-3 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-600 flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-95"
                  style={{ borderRadius: 0 }}
                  title="Zero the load cells"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ZERO / TARE</span>
                </button>

                <button
                  type="button"
                  onClick={toggleStability}
                  className={`px-3 py-2 text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-95 ${
                    isStable
                      ? "bg-amber-950/40 border-amber-600/60 text-amber-300 hover:bg-amber-900/50"
                      : "bg-emerald-950/40 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/50"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{isStable ? "SIM JITTER" : "LOCK STABLE"}</span>
                </button>
              </div>

              {/* Current Occupied Vehicle Mini Strip */}
              {activePlatform.occupiedVehicle ? (
                <div className="bg-[#18181B] border border-emerald-900/50 p-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      On Deck Vehicle
                    </span>
                    <span className="font-mono text-neutral-400 text-[10px]">
                      {activePlatform.occupiedVehicle.gateEntryNo}
                    </span>
                  </div>
                  <div className="font-mono font-bold text-white text-sm">
                    {activePlatform.occupiedVehicle.vehicleNo}
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate">
                    {activePlatform.occupiedVehicle.materialName} ·{" "}
                    {activePlatform.occupiedVehicle.driverName}
                  </div>
                </div>
              ) : (
                <div className="bg-[#18181B] border border-neutral-800 p-2.5 text-xs text-neutral-500 text-center font-mono">
                  Scale empty. Waiting for vehicle positioning.
                </div>
              )}
            </div>

            {/* Primary Action Button: Capture Weighment */}
            <div className="pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={onCaptureClick}
                disabled={!isStable}
                className={`w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg active:scale-[0.99] ${
                  isStable
                    ? "bg-[#059669] hover:bg-[#047857] text-white border border-[#10B981]"
                    : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed"
                }`}
                style={{ borderRadius: 0 }}
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>
                  {isStable ? "CAPTURE OFFICIAL WEIGHMENT" : "WAIT FOR STABILIZATION"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-[10px] text-neutral-400 text-center mt-1.5">
                Scale locks weight value directly into legal weighment log
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
