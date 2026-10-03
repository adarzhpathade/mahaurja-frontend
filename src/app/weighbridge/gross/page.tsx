"use client";

import React from "react";
import { Scale, ArrowDownToLine, CheckCircle2, Truck, Plus } from "lucide-react";
import { useWeighbridge } from "@/lib/context/weighbridge-context";
import { ScaleIndicator } from "@/components/weighbridge/scale-indicator";
import { WeighmentCaptureModal } from "@/components/weighbridge/weighment-capture-modal";
import { WeighbridgeSlipModal } from "@/components/weighbridge/weighbridge-slip-modal";
import { INITIAL_GATE_VEHICLES } from "@/lib/data/mock-gate-vehicles";

export default function GrossWeighmentPage() {
  const {
    activePlatformId,
    setActivePlatformId,
    openCaptureModal,
    isCaptureModalOpen,
    captureModalParams,
    closeCaptureModal,
    isSlipModalOpen,
    selectedSlipRecord,
    closeSlipModal,
    loadVehicleOnScale,
  } = useWeighbridge();

  const awaitingGrossQueue = INITIAL_GATE_VEHICLES.filter(
    (v) =>
      v.stage === "WAITING_WEIGHMENT" ||
      (v.direction === "INBOUND_RM" && !v.grossWeightMT)
  );

  const handleQuickWeigh = (v: any) => {
    setActivePlatformId("WB-01");
    loadVehicleOnScale("WB-01", v);
    openCaptureModal({
      vehicle: v,
      weighmentType: "INBOUND_GROSS",
      platformId: "WB-01",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div className="bg-white border border-neutral-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#059669]" />
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-neutral-500">
              Station Desk 01 · Gross Capture
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Gross Weighment Terminal
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Initial inbound gross weighment for loaded raw material tippers and final gross verification for loaded outbound dispatch trailers.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            openCaptureModal({
              weighmentType: "INBOUND_GROSS",
              platformId: "WB-01",
            })
          }
          className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-[#059669] hover:bg-[#047857] text-white border border-[#10B981] flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95"
          style={{ borderRadius: 0 }}
        >
          <ArrowDownToLine className="w-3.5 h-3.5" />
          <span>New Gross Weighment</span>
        </button>
      </div>

      {/* Live Scale Indicator */}
      <ScaleIndicator
        onCaptureClick={() =>
          openCaptureModal({
            weighmentType: "INBOUND_GROSS",
            platformId: activePlatformId,
          })
        }
      />

      {/* Queue for Gross Weighment */}
      <div
        className="bg-white border border-neutral-300 p-4 space-y-3"
        style={{ borderRadius: 0 }}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-neutral-700" />
            <span className="font-bold text-xs uppercase tracking-wider text-neutral-900">
              Vehicles In Queue for Gross Weighment
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#059669]">
            {awaitingGrossQueue.length} Trucks Waiting
          </span>
        </div>

        <div className="overflow-x-auto border border-neutral-300">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] text-neutral-700 font-semibold border-b border-neutral-300">
                <th className="p-3">Gate Entry Pass</th>
                <th className="p-3">Vehicle No</th>
                <th className="p-3">Material Item</th>
                <th className="p-3">Challan Declared (MT)</th>
                <th className="p-3">Driver</th>
                <th className="p-3">Arrival Time</th>
                <th className="p-3 text-right">Scale Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {awaitingGrossQueue.map((v) => (
                <tr key={v.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-neutral-900">
                    {v.gateEntryNo}
                  </td>
                  <td className="p-3 font-mono font-bold text-neutral-900 text-sm">
                    {v.vehicleNo}
                  </td>
                  <td className="p-3 font-semibold text-neutral-800">
                    {v.materialName}
                  </td>
                  <td className="p-3 font-mono font-bold text-neutral-800">
                    {v.declaredWeightMT} MT
                  </td>
                  <td className="p-3 text-neutral-600">
                    {v.driverName} ({v.transporter})
                  </td>
                  <td className="p-3 text-neutral-500 font-mono">
                    {v.arrivalTime}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleQuickWeigh(v)}
                      className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#18181B] hover:bg-neutral-800 text-white flex items-center gap-1.5 ml-auto cursor-pointer"
                      style={{ borderRadius: 0 }}
                    >
                      <Scale className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Capture Gross</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <WeighmentCaptureModal
        isOpen={isCaptureModalOpen}
        onClose={closeCaptureModal}
        initialVehicle={captureModalParams?.vehicle}
        initialType={captureModalParams?.weighmentType}
        initialPlatformId={captureModalParams?.platformId}
      />

      <WeighbridgeSlipModal
        isOpen={isSlipModalOpen}
        onClose={closeSlipModal}
        record={selectedSlipRecord}
      />
    </div>
  );
}
