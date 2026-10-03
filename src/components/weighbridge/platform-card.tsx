"use client";

import React from "react";
import { Scale, Truck, CheckCircle2, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { ScalePlatform, PlatformId } from "@/lib/types/weighbridge";

interface PlatformCardProps {
  platform: ScalePlatform;
  isActive: boolean;
  onSelect: (id: PlatformId) => void;
  onQuickLoad?: (platform: ScalePlatform) => void;
}

export function PlatformCard({ platform, isActive, onSelect, onQuickLoad }: PlatformCardProps) {
  const isOccupied = platform.status === "OCCUPIED" && platform.currentWeightMT > 0;
  const isStable = platform.stability === "STABLE";

  return (
    <div
      onClick={() => onSelect(platform.id)}
      className={`border transition-all cursor-pointer select-none bg-white p-4 relative ${
        isActive
          ? "border-2 border-[#18181B] shadow-md ring-1 ring-[#18181B]/10"
          : "border-neutral-300 hover:border-neutral-400 bg-white"
      }`}
      style={{ borderRadius: 0 }}
    >
      {/* Top Banner: ID & Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 flex items-center justify-center font-bold text-xs ${
              isActive ? "bg-[#18181B] text-white" : "bg-neutral-100 text-neutral-800"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <span>{platform.id}</span>
              {isActive && (
                <span className="text-[10px] font-bold text-[#059669] px-1.5 py-0.2 bg-emerald-50 border border-emerald-200">
                  ACTIVE DECK
                </span>
              )}
            </div>
            <div className="text-[10px] text-neutral-500 font-medium">
              {platform.id === "WB-01" ? "Inbound RM Deck" : "Outbound FG Deck"}
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
              isOccupied
                ? "bg-blue-50 text-blue-800 border-blue-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
          >
            {platform.status}
          </span>
        </div>
      </div>

      {/* Live Weight Highlight */}
      <div className="bg-[#F8F9FA] border border-neutral-200 p-3 mb-3 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">
            Deck Load
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-black text-neutral-900">
              {platform.currentWeightMT.toFixed(2)}
            </span>
            <span className="font-mono text-xs font-bold text-neutral-600">MT</span>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`inline-block px-1.5 py-0.5 text-[9px] font-bold font-mono uppercase border ${
              isStable
                ? "text-emerald-700 bg-emerald-100/60 border-emerald-300"
                : "text-amber-700 bg-amber-100/60 border-amber-300"
            }`}
          >
            {platform.stability}
          </span>
          <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
            Max: {platform.maxCapacityMT} MT
          </div>
        </div>
      </div>

      {/* Vehicle Info or Empty Deck Prompt */}
      {platform.occupiedVehicle ? (
        <div className="space-y-1.5 text-xs border-t border-neutral-100 pt-2.5">
          <div className="flex items-center justify-between text-neutral-600">
            <span className="text-[11px] text-neutral-500">Vehicle on Scale:</span>
            <span className="font-mono font-bold text-neutral-900">
              {platform.occupiedVehicle.vehicleNo}
            </span>
          </div>
          <div className="flex items-center justify-between text-neutral-600">
            <span className="text-[11px] text-neutral-500">Material:</span>
            <span className="font-semibold text-neutral-800 truncate max-w-[160px]">
              {platform.occupiedVehicle.materialName}
            </span>
          </div>
          <div className="flex items-center justify-between text-neutral-600">
            <span className="text-[11px] text-neutral-500">Pass No:</span>
            <span className="font-mono text-[11px] text-neutral-700">
              {platform.occupiedVehicle.gateEntryNo}
            </span>
          </div>
        </div>
      ) : (
        <div className="border-t border-neutral-100 pt-2.5 flex items-center justify-between text-xs text-neutral-500">
          <span className="text-[11px] text-neutral-400">Scale ready for next vehicle</span>
          <span className="text-[10px] text-neutral-400 font-mono">CAL: OK</span>
        </div>
      )}
    </div>
  );
}
