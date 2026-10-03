"use client";

import React from "react";
import { Scale, ArrowUpFromLine, CheckCircle2, Truck, Eye } from "lucide-react";
import { useWeighbridge } from "@/lib/context/weighbridge-context";
import { ScaleIndicator } from "@/components/weighbridge/scale-indicator";
import { WeighmentCaptureModal } from "@/components/weighbridge/weighment-capture-modal";
import { WeighbridgeSlipModal } from "@/components/weighbridge/weighbridge-slip-modal";
import { INITIAL_GATE_VEHICLES } from "@/lib/data/mock-gate-vehicles";

export default function TareWeighmentPage() {
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

  // Inbound vehicles that have completed unloading and need tare weighed
  const awaitingTareQueue = INITIAL_GATE_VEHICLES.filter(
    (v) =>
      v.stage === "UNLOADING" ||
      v.stage === "TARE_WEIGHED" ||
      (v.direction === "INBOUND_RM" && v.grossWeightMT && !v.tareWeightMT)
  );

  const handleQuickTare = (v: any) => {
    setActivePlatformId("WB-01");
    // Simulate empty tare weight around 12-14 MT
    const simulatedTare = 13.2;
    loadVehicleOnScale("WB-01", v, simulatedTare);
    openCaptureModal({
      vehicle: v,
      weighmentType: "INBOUND_TARE",
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
              Station Desk 02 · Tare & Net Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Tare Weighment & Net Reconciliation Desk
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Automatic Net Weight calculation (|Gross − Tare|) upon empty tare capture. Generates official weighbridge weight slips.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            openCaptureModal({
              weighmentType: "INBOUND_TARE",
              platformId: "WB-01",
            })
          }
          className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-[#059669] hover:bg-[#047857] text-white border border-[#10B981] flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95"
          style={{ borderRadius: 0 }}
        >
          <ArrowUpFromLine className="w-3.5 h-3.5" />
          <span>New Tare Capture</span>
        </button>
      </div>

      {/* Live Scale Indicator */}
      <ScaleIndicator
        onCaptureClick={() =>
          openCaptureModal({
            weighmentType: "INBOUND_TARE",
            platformId: activePlatformId,
          })
        }
      />

      {/* Queue for Tare Weighment */}
      <div
        className="bg-white border border-neutral-300 p-4 space-y-3"
        style={{ borderRadius: 0 }}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-neutral-700" />
            <span className="font-bold text-xs uppercase tracking-wider text-neutral-900">
              Unloaded Vehicles Waiting for 2nd Tare Weighment
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#059669]">
            {awaitingTareQueue.length} Trucks Ready
          </span>
        </div>

        <div className="overflow-x-auto border border-neutral-300">
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
              {awaitingTareQueue.map((v) => (
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
                    <div className="text-[11px] text-neutral-500">{v.supplierOrCustomer}</div>
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
                      onClick={() => handleQuickTare(v)}
                      className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#059669] hover:bg-[#047857] text-white flex items-center gap-1.5 ml-auto cursor-pointer transition-colors active:scale-95"
                      style={{ borderRadius: 0 }}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Weigh Tare & Net</span>
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
