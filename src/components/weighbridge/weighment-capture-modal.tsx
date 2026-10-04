"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Scale,
  ArrowRight,
  Printer,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWeighbridge } from "@/lib/context/weighbridge-context";
import { WeighmentType, PlatformId } from "@/lib/types/weighbridge";
import { GateVehicle } from "@/lib/types/gate";

interface WeighmentCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicle?: Partial<GateVehicle>;
  initialType?: WeighmentType;
  initialPlatformId?: PlatformId;
}

export function WeighmentCaptureModal({
  isOpen,
  onClose,
  initialVehicle,
  initialType = "INBOUND_GROSS",
  initialPlatformId = "WB-01",
}: WeighmentCaptureModalProps) {
  const {
    activePlatform,
    captureWeighment,
    records,
    openSlipModal,
    activePlatformId,
  } = useWeighbridge();

  const [platformId, setPlatformId] = useState<PlatformId>(
    initialPlatformId || activePlatformId
  );
  const [weighmentType, setWeighmentType] = useState<WeighmentType>(initialType);
  const [vehicleNo, setVehicleNo] = useState("");
  const [gateEntryNo, setGateEntryNo] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [supplierOrCustomer, setSupplierOrCustomer] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverMobile, setDriverMobile] = useState("");
  const [challanOrLrNo, setChallanOrLrNo] = useState("");
  const [declaredWeightMT, setDeclaredWeightMT] = useState<number>(25.0);
  const [recordedWeightMT, setRecordedWeightMT] = useState<number>(38.64);
  const [notes, setNotes] = useState("");

  const isManualEntry = !initialVehicle && !activePlatform.occupiedVehicle;

  // Sync state whenever modal opens or params change
  useEffect(() => {
    if (isOpen) {
      const v = initialVehicle || activePlatform.occupiedVehicle;
      if (v) {
        setVehicleNo(v.vehicleNo || "");
        setGateEntryNo(v.gateEntryNo || "");
        setMaterialName(v.materialName || "Groundnut Shell (GS)");
        setSupplierOrCustomer(
          (v as any).supplierOrCustomer || "Krishi Bio Agro Farmers Co-op"
        );
        setDriverName(v.driverName || "Driver");
        setDriverMobile(v.driverMobile || "+91 98224 81920");
        setChallanOrLrNo(v.challanOrLrNo || "CH-982104");
        setDeclaredWeightMT(v.declaredWeightMT || 24.5);
      } else {
        setVehicleNo("");
        setGateEntryNo("");
        setMaterialName("Groundnut Shell (GS)");
        setSupplierOrCustomer("");
        setDriverName("");
        setDriverMobile("");
        setChallanOrLrNo("");
        setDeclaredWeightMT(25.0);
      }

      setPlatformId(initialPlatformId || activePlatformId);
      setWeighmentType(initialType);

      // Determine realistic live weight from platform or vehicle state
      if (activePlatform.currentWeightMT > 0) {
        setRecordedWeightMT(activePlatform.currentWeightMT);
      } else if (initialType === "INBOUND_TARE") {
        setRecordedWeightMT(14.20);
      } else {
        setRecordedWeightMT(38.64);
      }
    }
  }, [isOpen, initialVehicle, activePlatform, initialPlatformId, activePlatformId, initialType]);

  // Check if there is an existing 1st weighment record for this vehicle
  const existingRecord = records.find(
    (r) =>
      r.vehicleNo === vehicleNo &&
      r.status === "PENDING_SECOND_WEIGHMENT"
  );

  const isSecondWeighment =
    !!existingRecord ||
    weighmentType === "INBOUND_TARE" ||
    weighmentType === "OUTBOUND_GROSS" ||
    !!initialVehicle?.grossWeightMT;

  // STRICT AUTO-CALCULATED NET WEIGHT:
  // Net = |Gross - Tare|
  let calculatedGross = recordedWeightMT;
  let calculatedTare = 0;
  let calculatedNet = 0;

  if (isSecondWeighment) {
    if (weighmentType === "INBOUND_TARE") {
      calculatedGross =
        existingRecord?.grossWeightMT || initialVehicle?.grossWeightMT || 42.80;
      calculatedTare = recordedWeightMT;
    } else if (weighmentType === "OUTBOUND_GROSS") {
      calculatedGross = recordedWeightMT;
      calculatedTare =
        existingRecord?.tareWeightMT || initialVehicle?.tareWeightMT || 14.20;
    }
    calculatedNet = Number(Math.abs(calculatedGross - calculatedTare).toFixed(2));
  } else if (weighmentType === "INBOUND_GROSS") {
    calculatedGross = recordedWeightMT;
  } else if (weighmentType === "OUTBOUND_TARE") {
    calculatedTare = recordedWeightMT;
  }

  const varianceMT =
    isSecondWeighment && declaredWeightMT
      ? Number((calculatedNet - declaredWeightMT).toFixed(2))
      : 0;

  const isToleranceOk = Math.abs(varianceMT) <= 0.5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record = captureWeighment({
      vehicle: {
        vehicleNo,
        gateEntryNo,
        materialName,
        supplierOrCustomer,
        driverName,
        driverMobile,
        challanOrLrNo,
        declaredWeightMT,
      },
      weightMT: recordedWeightMT,
      weighmentType,
      platformId,
      notes,
    });

    onClose();
    // Prompt official slip view immediately
    openSlipModal(record);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          className="relative w-full max-w-lg bg-white border border-neutral-300 shadow-2xl z-10 my-auto overflow-hidden select-none"
          style={{ borderRadius: 0 }}
        >
          {/* Header */}
          <div className="bg-[#18181B] text-white px-4 sm:px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#059669] text-white flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base tracking-wide uppercase">
                  {isSecondWeighment
                    ? "2nd Weight: Empty Tare & Net"
                    : "1st Weight: Loaded Gross"}
                </h3>
                <div className="text-[11px] text-neutral-400 font-mono">
                  Deck: {platformId} ({platformId === "WB-01" ? "Inbound RM" : "Outbound FG"}) · Scale Live
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
            {/* Vehicle Information: Clean Summary Card or Simple Manual Inputs */}
            {isManualEntry ? (
              <div className="bg-[#F8F9FA] border border-neutral-300 p-3 space-y-2.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                  Manual Vehicle Details
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 block mb-0.5">
                      Vehicle Plate *
                    </label>
                    <input
                      type="text"
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                      placeholder="MH 12 RN 4821"
                      required
                      className="w-full h-9 px-2.5 font-mono font-bold text-xs bg-white border border-neutral-300 focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 block mb-0.5">
                      Challan Weight (MT)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={declaredWeightMT}
                      onChange={(e) => setDeclaredWeightMT(parseFloat(e.target.value) || 0)}
                      className="w-full h-9 px-2.5 font-mono text-xs bg-white border border-neutral-300 focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 block mb-0.5">
                      Material Name
                    </label>
                    <input
                      type="text"
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                      placeholder="Groundnut Shell (GS)"
                      className="w-full h-9 px-2.5 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 block mb-0.5">
                      Supplier / Customer
                    </label>
                    <input
                      type="text"
                      value={supplierOrCustomer}
                      onChange={(e) => setSupplierOrCustomer(e.target.value)}
                      placeholder="Supplier Name"
                      className="w-full h-9 px-2.5 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#F8F9FA] border border-neutral-300 p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm sm:text-base text-neutral-900">
                    {vehicleNo}
                  </span>
                  <span className="font-mono text-[11px] text-neutral-500 font-bold bg-neutral-200 px-2 py-0.5">
                    {gateEntryNo || "NO GATE PASS"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2 text-neutral-700">
                  <span className="font-semibold text-neutral-900 truncate">
                    {materialName}
                  </span>
                  <span className="font-mono font-bold text-neutral-900 shrink-0">
                    Challan: {declaredWeightMT.toFixed(2)} MT
                  </span>
                </div>

                <div className="text-[11px] text-neutral-500 truncate flex items-center justify-between">
                  <span>{supplierOrCustomer}</span>
                  <span>{driverName}</span>
                </div>
              </div>
            )}

            {/* Live Scale Weight Telemetry Card */}
            <div className="bg-white border border-neutral-300 p-3.5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-2">
                <span className="font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#059669]" />
                  Live Deck Weight
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300 text-[10px] tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                  Scale Stable
                </span>
              </div>

              {/* Big Readout */}
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 tabular-nums">
                      {recordedWeightMT.toFixed(2)}
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-bold text-neutral-400">
                      MT
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {isSecondWeighment ? "Empty Truck Weight (Tare)" : "Loaded Truck Weight (Gross)"}
                  </span>
                </div>

                {/* Quick Edit if needed */}
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-0.5">
                    Adjust (MT)
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={recordedWeightMT}
                    onChange={(e) => setRecordedWeightMT(parseFloat(e.target.value) || 0)}
                    className="w-24 h-8 px-2 text-right font-mono font-bold text-xs bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Net Calculation Matrix (for 2nd Weighment) */}
              {isSecondWeighment ? (
                <div className="pt-2 border-t border-neutral-200 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-neutral-50 border border-neutral-300 p-2">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                        1st Gross
                      </span>
                      <span className="font-mono font-bold text-sm text-neutral-900 block mt-0.5">
                        {calculatedGross.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-neutral-400 font-mono">MT</span>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-300 p-2">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                        2nd Tare
                      </span>
                      <span className="font-mono font-bold text-sm text-neutral-900 block mt-0.5">
                        {calculatedTare.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-neutral-400 font-mono">MT</span>
                    </div>

                    <div className="bg-[#ECFDF5] border border-[#10B981] p-2">
                      <span className="text-[10px] uppercase font-black text-[#059669] block">
                        Net Weight
                      </span>
                      <span className="font-mono font-black text-sm text-[#059669] block mt-0.5">
                        {calculatedNet.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-[#059669] font-mono font-bold">AUTO</span>
                    </div>
                  </div>

                  {/* Variance Strip */}
                  <div className="bg-neutral-50 border border-neutral-200 p-2 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-neutral-500">Challan Variance:</span>
                      <strong className={isToleranceOk ? "text-[#059669]" : "text-amber-600"}>
                        {varianceMT >= 0 ? `+${varianceMT}` : varianceMT} MT
                      </strong>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold uppercase border ${
                        isToleranceOk
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      {isToleranceOk ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Within Tolerance</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Variance Alert</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
                  <span>Declared: <strong>{declaredWeightMT.toFixed(2)} MT</strong></span>
                  <span className="text-neutral-400 text-[11px]">Est. Net: ~{(recordedWeightMT - 13.8).toFixed(2)} MT</span>
                </div>
              )}
            </div>

            {/* Operator Notes (Compact 1-line) */}
            <div>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Operator notes (optional)..."
                className="w-full h-9 px-3 text-xs bg-white border border-neutral-300 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669]"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-4 text-xs font-bold uppercase tracking-wider text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 h-11 px-5 text-xs font-bold uppercase tracking-wider bg-[#059669] hover:bg-[#047857] text-white border border-[#10B981] flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs active:scale-[0.99]"
              >
                <Printer className="w-4 h-4" />
                <span>
                  {isSecondWeighment
                    ? "Confirm 2nd Weight & Issue Slip"
                    : "Save 1st Gross Weight"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
