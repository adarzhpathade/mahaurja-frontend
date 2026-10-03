"use client";

import React, { useState } from "react";
import {
  Scale,
  Activity,
  Truck,
  ArrowRight,
  Printer,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  Zap,
  Filter,
  FileText,
  FileCheck,
  Eye,
  Plus,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWeighbridge } from "@/lib/context/weighbridge-context";
import { ScaleIndicator } from "./scale-indicator";
import { PlatformCard } from "./platform-card";
import { WeighmentCaptureModal } from "./weighment-capture-modal";
import { WeighbridgeSlipModal } from "./weighbridge-slip-modal";
import { WeighbridgeRecord, WeighmentType } from "@/lib/types/weighbridge";
import { INITIAL_GATE_VEHICLES } from "@/lib/data/mock-gate-vehicles";

export function WeighbridgeHome() {
  const {
    platforms,
    activePlatformId,
    setActivePlatformId,
    records,
    stats,
    isCaptureModalOpen,
    captureModalParams,
    openCaptureModal,
    closeCaptureModal,
    isSlipModalOpen,
    selectedSlipRecord,
    openSlipModal,
    closeSlipModal,
    loadVehicleOnScale,
  } = useWeighbridge();

  const [activeQueueTab, setActiveQueueTab] = useState<
    "FIRST_QUEUE" | "SECOND_QUEUE" | "COMPLETED_SLIPS"
  >("FIRST_QUEUE");
  const [searchQuery, setSearchQuery] = useState("");

  // Inbound & Outbound vehicles waiting for 1st weighment
  const firstWeighmentQueue = INITIAL_GATE_VEHICLES.filter(
    (v) =>
      v.stage === "WAITING_WEIGHMENT" ||
      (v.direction === "OUTBOUND_DISPATCH" && !v.grossWeightMT)
  );

  // Inbound vehicles that have Gross and are now ready for Tare
  const secondWeighmentQueue = INITIAL_GATE_VEHICLES.filter(
    (v) => v.stage === "UNLOADING" || v.stage === "TARE_WEIGHED" || v.grossWeightMT
  );

  // Filter completed slips
  const completedRecords = records.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.slipNo.toLowerCase().includes(q) ||
      r.vehicleNo.toLowerCase().includes(q) ||
      r.materialName.toLowerCase().includes(q) ||
      r.supplierOrCustomer.toLowerCase().includes(q)
    );
  });

  const handlePositionOnScale = (vehicle: any, type: WeighmentType) => {
    const targetPlatform = type.startsWith("INBOUND") ? "WB-01" : "WB-02";
    setActivePlatformId(targetPlatform);
    loadVehicleOnScale(targetPlatform, vehicle);
    openCaptureModal({
      vehicle,
      weighmentType: type,
      platformId: targetPlatform,
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 select-none">
      {/* Station Title & Operations Hotbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-neutral-300 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#059669]" />
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-neutral-500">
              Weighment Station 01 & 02 · Operational Post
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Dual-Platform Weighbridge Terminal
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Real-time computerized weight capture, automatic Net computation, and legal metrology slip generation.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() =>
              openCaptureModal({
                weighmentType: "INBOUND_GROSS",
                platformId: activePlatformId,
              })
            }
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-[#059669] hover:bg-[#047857] text-white border border-[#10B981] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors active:scale-95"
            style={{ borderRadius: 0 }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Weight Entry</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (records.length > 0) openSlipModal(records[0]);
            }}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 flex items-center gap-1.5 cursor-pointer transition-colors"
            style={{ borderRadius: 0 }}
          >
            <Printer className="w-3.5 h-3.5 text-neutral-600" />
            <span>Reprint Last Slip</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip (80% grays, 15% white, 5% bio-emerald) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div
          className="bg-white border border-neutral-300 p-4 space-y-1"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Today's Net Tonnage
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-[#059669]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-black text-neutral-900">
              {stats.todayNetTonnageMT.toFixed(1)}
            </span>
            <span className="font-mono text-xs font-bold text-neutral-500">MT</span>
          </div>
          <div className="text-[11px] text-neutral-500">
            Reconciled across {stats.todayTotalSlips} completed dispatches
          </div>
        </div>

        {/* Metric 2 */}
        <div
          className="bg-white border border-neutral-300 p-4 space-y-1"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              1st Weighments Completed
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-black text-neutral-900">
              {stats.inboundGrossWeighed + stats.outboundTareWeighed}
            </span>
            <span className="font-mono text-xs font-bold text-neutral-500">Vehicles</span>
          </div>
          <div className="text-[11px] text-neutral-500">
            {stats.inboundGrossWeighed} Gross RM · {stats.outboundTareWeighed} Tare FG
          </div>
        </div>

        {/* Metric 3 */}
        <div
          className="bg-white border border-neutral-300 p-4 space-y-1"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Pending 2nd Tare Weighment
            </span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-black text-amber-700">
              {stats.pendingSecondWeighment}
            </span>
            <span className="font-mono text-xs font-bold text-neutral-500">Unloading</span>
          </div>
          <div className="text-[11px] text-neutral-500">
            Trucks currently emptying at bays
          </div>
        </div>

        {/* Metric 4 */}
        <div
          className="bg-white border border-neutral-300 p-4 space-y-1"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Scale Calibration Proof
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-black text-[#047857]">
            LEGAL OK
          </div>
          <div className="text-[11px] text-neutral-500">
            Certified to 60.00 MT · Next due 15 Oct
          </div>
        </div>
      </div>

      {/* Main Dual-Deck Operations: Indicator & Platform Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Digital Scale Indicator (Left 8 cols) */}
        <div className="xl:col-span-8">
          <ScaleIndicator
            onCaptureClick={() =>
              openCaptureModal({
                weighmentType:
                  activePlatformId === "WB-01" ? "INBOUND_GROSS" : "OUTBOUND_GROSS",
                platformId: activePlatformId,
              })
            }
          />
        </div>

        {/* Side-by-side Dual Platforms Overview (Right 4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-1 flex items-center justify-between">
            <span>Physical Platforms (60 MT Decks)</span>
            <span className="font-mono text-[10px]">2 ONLINE</span>
          </div>

          {platforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              isActive={platform.id === activePlatformId}
              onSelect={(id) => setActivePlatformId(id)}
            />
          ))}
        </div>
      </div>

      {/* Operations Queues & Slips Registry Section */}
      <div
        className="bg-white border border-neutral-300 p-4 space-y-4"
        style={{ borderRadius: 0 }}
      >
        {/* Navigation Tabs for Queue */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              type="button"
              onClick={() => setActiveQueueTab("FIRST_QUEUE")}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap ${
                activeQueueTab === "FIRST_QUEUE"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
              }`}
              style={{ borderRadius: 0 }}
            >
              <span>1st Weighment Queue</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  activeQueueTab === "FIRST_QUEUE"
                    ? "bg-[#059669] text-white"
                    : "bg-neutral-200 text-neutral-800"
                }`}
              >
                {firstWeighmentQueue.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveQueueTab("SECOND_QUEUE")}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap ${
                activeQueueTab === "SECOND_QUEUE"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
              }`}
              style={{ borderRadius: 0 }}
            >
              <span>2nd Tare Weighment (Exit)</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  activeQueueTab === "SECOND_QUEUE"
                    ? "bg-[#059669] text-white"
                    : "bg-neutral-200 text-neutral-800"
                }`}
              >
                {secondWeighmentQueue.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveQueueTab("COMPLETED_SLIPS")}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap ${
                activeQueueTab === "COMPLETED_SLIPS"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
              }`}
              style={{ borderRadius: 0 }}
            >
              <span>Official Slips Archive</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  activeQueueTab === "COMPLETED_SLIPS"
                    ? "bg-[#059669] text-white"
                    : "bg-neutral-200 text-neutral-800"
                }`}
              >
                {records.length}
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search vehicle, slip, supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 sm:h-10 pl-9.5 pr-3 text-sm bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
              style={{ borderRadius: 0 }}
            />
          </div>
        </div>

        {/* TAB 1: 1st Weighment Queue */}
        {activeQueueTab === "FIRST_QUEUE" && (
          <div className="space-y-3">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto border border-neutral-300">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FA] text-neutral-700 font-semibold border-b border-neutral-300">
                    <th className="p-3">Gate Pass / Entry</th>
                    <th className="p-3">Vehicle Details</th>
                    <th className="p-3">Commodity & Supplier</th>
                    <th className="p-3">Challan MT</th>
                    <th className="p-3">Target Platform</th>
                    <th className="p-3">Stage Status</th>
                    <th className="p-3 text-right">Scale Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {firstWeighmentQueue.map((v) => (
                    <tr key={v.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3 font-mono">
                        <div className="font-bold text-neutral-900">{v.gateEntryNo}</div>
                        <div className="text-[11px] text-neutral-500">In: {v.arrivalTime}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-mono font-bold text-sm text-neutral-900">
                          {v.vehicleNo}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {v.driverName} · {v.transporter}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-neutral-900">{v.materialName}</div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[200px]">
                          {v.supplierOrCustomer}
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-neutral-800">
                        {v.declaredWeightMT ? `${v.declaredWeightMT.toFixed(2)} MT` : "—"}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase bg-neutral-100 border border-neutral-300 text-neutral-800">
                          {v.direction === "INBOUND_RM" ? "WB-01 (IN)" : "WB-02 (OUT)"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                          Awaiting Weighment
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handlePositionOnScale(
                              v,
                              v.direction === "INBOUND_RM"
                                ? "INBOUND_GROSS"
                                : "OUTBOUND_TARE"
                            )
                          }
                          className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#18181B] hover:bg-neutral-800 text-white flex items-center gap-1.5 ml-auto cursor-pointer transition-colors active:scale-95"
                          style={{ borderRadius: 0 }}
                        >
                          <Scale className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Weigh Now</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Touch Cards View */}
            <div className="md:hidden space-y-2.5">
              {firstWeighmentQueue.map((v) => (
                <div
                  key={v.id}
                  className="bg-neutral-50 border border-neutral-300 p-3.5 space-y-2.5"
                  style={{ borderRadius: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-neutral-900">
                      {v.vehicleNo}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase bg-neutral-200 text-neutral-800">
                      {v.direction === "INBOUND_RM" ? "WB-01" : "WB-02"}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-neutral-800">{v.materialName}</div>
                    <div className="text-[11px] text-neutral-600 truncate">
                      {v.supplierOrCustomer} · {v.driverName}
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-neutral-500">
                      <span>Pass: {v.gateEntryNo}</span>
                      <span>Challan: {v.declaredWeightMT} MT</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handlePositionOnScale(
                        v,
                        v.direction === "INBOUND_RM"
                          ? "INBOUND_GROSS"
                          : "OUTBOUND_TARE"
                      )
                    }
                    className="w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-[#18181B] text-white flex items-center justify-center gap-2 cursor-pointer"
                    style={{ borderRadius: 0 }}
                  >
                    <Scale className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Weigh on {v.direction === "INBOUND_RM" ? "WB-01" : "WB-02"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: 2nd Tare Weighment Queue */}
        {activeQueueTab === "SECOND_QUEUE" && (
          <div className="space-y-3">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto border border-neutral-300">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FA] text-neutral-700 font-semibold border-b border-neutral-300">
                    <th className="p-3">Gate Pass</th>
                    <th className="p-3">Vehicle Details</th>
                    <th className="p-3">Material Unloaded</th>
                    <th className="p-3 font-mono">1st Gross (MT)</th>
                    <th className="p-3">Unload Bay</th>
                    <th className="p-3 text-right">Tare Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {secondWeighmentQueue.map((v) => (
                    <tr key={v.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-neutral-900">
                        {v.gateEntryNo}
                      </td>
                      <td className="p-3">
                        <div className="font-mono font-bold text-sm text-neutral-900">
                          {v.vehicleNo}
                        </div>
                        <div className="text-[11px] text-neutral-500">{v.driverName}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-neutral-900">{v.materialName}</div>
                        <div className="text-[11px] text-neutral-500">
                          {v.supplierOrCustomer}
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-700 text-sm">
                        {v.grossWeightMT ? `${v.grossWeightMT.toFixed(2)} MT` : "42.80 MT"}
                      </td>
                      <td className="p-3 text-neutral-600">
                        {v.assignedLocation || "Yard B - Bay 04"}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handlePositionOnScale(v, "INBOUND_TARE")
                          }
                          className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#059669] hover:bg-[#047857] text-white flex items-center gap-1.5 ml-auto cursor-pointer transition-colors active:scale-95"
                          style={{ borderRadius: 0 }}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>Weigh Tare & Compute Net</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Touch Cards View */}
            <div className="md:hidden space-y-2.5">
              {secondWeighmentQueue.map((v) => (
                <div
                  key={v.id}
                  className="bg-neutral-50 border border-neutral-300 p-3.5 space-y-2.5"
                  style={{ borderRadius: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-neutral-900">
                      {v.vehicleNo}
                    </span>
                    <span className="font-mono font-bold text-xs text-emerald-700">
                      Gross: {v.grossWeightMT || 42.8} MT
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-neutral-800">{v.materialName}</div>
                    <div className="text-[11px] text-neutral-600 truncate">
                      {v.supplierOrCustomer} · {v.assignedLocation}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePositionOnScale(v, "INBOUND_TARE")}
                    className="w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-[#059669] text-white flex items-center justify-center gap-2 cursor-pointer"
                    style={{ borderRadius: 0 }}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Record Tare & Auto-Compute Net</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Official Slips Archive */}
        {activeQueueTab === "COMPLETED_SLIPS" && (
          <div className="space-y-3">
            <div className="overflow-x-auto border border-neutral-300">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FA] text-neutral-700 font-semibold border-b border-neutral-300">
                    <th className="p-3">Slip Number</th>
                    <th className="p-3">Vehicle / Gate Pass</th>
                    <th className="p-3">Commodity & Partner</th>
                    <th className="p-3 font-mono text-right">Gross (MT)</th>
                    <th className="p-3 font-mono text-right">Tare (MT)</th>
                    <th className="p-3 font-mono text-right text-emerald-800">Net Weight (MT)</th>
                    <th className="p-3 font-mono text-right">Variance</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">View / Print</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {completedRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-neutral-900">
                        {r.slipNo}
                      </td>
                      <td className="p-3">
                        <div className="font-mono font-bold text-neutral-900">
                          {r.vehicleNo}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          {r.gateEntryNo}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-neutral-900">{r.materialName}</div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[180px]">
                          {r.supplierOrCustomer}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-right text-neutral-800">
                        {r.grossWeightMT.toFixed(2)}
                      </td>
                      <td className="p-3 font-mono text-right text-neutral-800">
                        {r.tareWeightMT !== undefined ? r.tareWeightMT.toFixed(2) : "—"}
                      </td>
                      <td className="p-3 font-mono text-right font-black text-emerald-700 text-sm">
                        {r.netWeightMT !== undefined ? `${r.netWeightMT.toFixed(2)} MT` : "PENDING"}
                      </td>
                      <td className="p-3 font-mono text-right text-neutral-600">
                        {r.varianceMT !== undefined
                          ? `${r.varianceMT >= 0 ? "+" : ""}${r.varianceMT.toFixed(2)}`
                          : "—"}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                            r.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          {r.status === "COMPLETED" ? "SLIP ISSUED" : "WAITING TARE"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => openSlipModal(r)}
                          className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 inline-flex items-center gap-1 cursor-pointer transition-colors"
                          style={{ borderRadius: 0 }}
                        >
                          <Eye className="w-3.5 h-3.5 text-neutral-600" />
                          <span>Slip</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Weighment Capture Modal */}
      <WeighmentCaptureModal
        isOpen={isCaptureModalOpen}
        onClose={closeCaptureModal}
        initialVehicle={captureModalParams?.vehicle}
        initialType={captureModalParams?.weighmentType}
        initialPlatformId={captureModalParams?.platformId}
      />

      {/* Official Printable Weighbridge Slip Modal */}
      <WeighbridgeSlipModal
        isOpen={isSlipModalOpen}
        onClose={closeSlipModal}
        record={selectedSlipRecord}
      />
    </div>
  );
}
