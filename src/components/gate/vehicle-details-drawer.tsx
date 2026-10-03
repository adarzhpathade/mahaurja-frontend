"use client";

import React from "react";
import {
  X,
  Truck,
  Scale,
  FlaskConical,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { GateVehicle, GateStage } from "@/lib/types/gate";

interface VehicleDetailsDrawerProps {
  vehicle: GateVehicle | null;
  onClose: () => void;
  onUpdateStage?: (vehicleId: string, newStage: GateStage) => void;
}

export function VehicleDetailsDrawer({
  vehicle,
  onClose,
  onUpdateStage,
}: VehicleDetailsDrawerProps) {
  if (!vehicle) return null;

  const STAGES: { key: GateStage; label: string; icon: React.ElementType }[] = [
    { key: "ARRIVED_AT_GATE", label: "Gate In", icon: ShieldCheck },
    { key: "WAITING_WEIGHMENT", label: "Gross Weighment", icon: Scale },
    { key: "UNLOADING", label: "Unload & QC", icon: FlaskConical },
    { key: "TARE_WEIGHED", label: "Tare Weighment", icon: Scale },
    { key: "CLEARED_EXIT", label: "Gate Out", icon: CheckCircle2 },
  ];

  const getStageIndex = (stage: GateStage) => {
    switch (stage) {
      case "ARRIVED_AT_GATE":
        return 0;
      case "WAITING_WEIGHMENT":
      case "GROSS_WEIGHED":
        return 1;
      case "UNLOADING":
      case "QC_PENDING":
        return 2;
      case "TARE_WEIGHED":
        return 3;
      case "CLEARED_EXIT":
      case "EXIT_COMPLETED":
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = getStageIndex(vehicle.stage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 select-none">
      <div
        className="w-full max-w-xl h-full bg-white border-l border-neutral-300 flex flex-col overflow-hidden"
        style={{ borderRadius: 0 }}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-200 bg-[#F8F9FA] flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-2.5 h-2.5 bg-[#18181B] shrink-0" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
                  {vehicle.vehicleNo}
                </h2>
                <span
                  className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 ${
                    vehicle.direction === "INBOUND_RM"
                      ? "bg-neutral-900 text-white"
                      : "bg-[#059669] text-white"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {vehicle.direction === "INBOUND_RM" ? "Inbound RM" : "Outbound FG"}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5">
                Pass: <strong className="text-neutral-800 font-semibold">{vehicle.gateEntryNo}</strong> · {vehicle.vehicleType}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 text-xs">
          {/* Plant Operational Stage Stepper */}
          <div className="border border-neutral-300 p-3.5 sm:p-4 bg-[#F8F9FA]" style={{ borderRadius: 0 }}>
            <div className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2.5">
              Plant Operational Lifecycle
            </div>
            <div className="overflow-x-auto pb-1">
              <div className="grid grid-cols-5 gap-1 min-w-[340px] sm:min-w-0">
                {STAGES.map((step, idx) => {
                  const Icon = step.icon;
                  const isPassed = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center">
                      <div
                        className={`w-7 h-7 flex items-center justify-center text-xs mb-1.5 border transition-colors ${
                          isCurrent
                            ? "bg-[#18181B] text-white border-[#18181B]"
                            : isPassed
                            ? "bg-neutral-200 text-neutral-900 border-neutral-300"
                            : "bg-white text-neutral-400 border-neutral-300"
                        }`}
                        style={{ borderRadius: 0 }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={`text-[9px] sm:text-[10px] leading-tight ${
                          isCurrent
                            ? "font-semibold text-neutral-900"
                            : isPassed
                            ? "text-neutral-700"
                            : "text-neutral-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Core Information Grid */}
          <div className="border border-neutral-300 divide-y divide-neutral-200 bg-white" style={{ borderRadius: 0 }}>
            <div className="p-3 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Material
                </span>
                <span className="font-semibold text-neutral-900 text-xs mt-0.5 block">
                  {vehicle.materialName}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Declared Weight
                </span>
                <span className="font-semibold text-neutral-900 text-xs mt-0.5 block tabular-nums">
                  {vehicle.declaredWeightMT.toFixed(2)} MT
                </span>
              </div>
            </div>

            <div className="p-3 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  {vehicle.direction === "INBOUND_RM" ? "Supplier" : "Customer"}
                </span>
                <span className="font-medium text-neutral-800 text-xs mt-0.5 block">
                  {vehicle.supplierOrCustomer}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Transporter & Challan
                </span>
                <span className="font-medium text-neutral-800 text-xs mt-0.5 block">
                  {vehicle.transporter} · <span className="text-[11px] font-medium">{vehicle.challanOrLrNo}</span>
                </span>
              </div>
            </div>

            <div className="p-3 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Driver Name & Contact
                </span>
                <span className="font-medium text-neutral-800 text-xs mt-0.5 block tabular-nums">
                  {vehicle.driverName} ({vehicle.driverMobile})
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Current Assigned Bay
                </span>
                <span className="font-semibold text-neutral-900 text-xs mt-0.5 block">
                  {vehicle.assignedLocation}
                </span>
              </div>
            </div>

            <div className="p-3 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Time Logged
                </span>
                <span className="font-medium text-neutral-800 text-xs mt-0.5 flex items-center gap-1.5 tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  {vehicle.arrivalTime} ({vehicle.elapsedMinutes}m inside plant)
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  e-Way Bill Number
                </span>
                <span className="text-neutral-800 text-xs mt-0.5 block font-medium">
                  {vehicle.ewayBillNo || "EWB-PENDING"}
                </span>
              </div>
            </div>

            {vehicle.notes && (
              <div className="p-3 bg-[#F8F9FA]">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Gate Security Notes
                </span>
                <p className="text-neutral-700 text-xs mt-1 leading-relaxed">
                  {vehicle.notes}
                </p>
              </div>
            )}
          </div>

          {/* Quick Stage Progression Handlers */}
          <div className="border border-neutral-300 p-4 space-y-3" style={{ borderRadius: 0 }}>
            <div className="text-[11px] font-semibold text-neutral-900 uppercase tracking-wider">
              Gate Security Actions
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onUpdateStage && onUpdateStage(vehicle.id, "WAITING_WEIGHMENT")}
                className="px-3 py-1.5 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-medium cursor-pointer"
                style={{ borderRadius: 0 }}
              >
                Route to Weighbridge 1
              </button>

              <button
                type="button"
                onClick={() => onUpdateStage && onUpdateStage(vehicle.id, "UNLOADING")}
                className="px-3 py-1.5 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-medium cursor-pointer"
                style={{ borderRadius: 0 }}
              >
                Direct to Yard Unloading
              </button>

              <button
                type="button"
                onClick={() => onUpdateStage && onUpdateStage(vehicle.id, "CLEARED_EXIT")}
                className="px-3 py-1.5 border border-[#059669] bg-[#059669] text-white hover:bg-[#047857] text-xs font-medium cursor-pointer"
                style={{ borderRadius: 0 }}
              >
                Clear for Boom Barrier Exit
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-neutral-200 bg-[#F8F9FA] flex items-center justify-between gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-300 bg-white text-neutral-700 hover:text-neutral-900 text-xs font-medium cursor-pointer"
            style={{ borderRadius: 0 }}
            onClick={() => alert(`Printing Gate Slip for ${vehicle.gateEntryNo}...`)}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Gate Slip</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#18181B] text-white hover:bg-black text-xs font-medium cursor-pointer"
            style={{ borderRadius: 0 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
