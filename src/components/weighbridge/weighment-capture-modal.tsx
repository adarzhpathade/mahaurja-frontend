"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Camera,
  FileCheck,
  Truck,
  ArrowRight,
  ShieldCheck,
  Clock,
  Printer,
  FileText,
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
  const [recordedWeightMT, setRecordedWeightMT] = useState<number>(
    activePlatform.currentWeightMT || 38.64
  );
  const [notes, setNotes] = useState("");
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(true);

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
      }
      setRecordedWeightMT(
        activePlatform.currentWeightMT > 0 ? activePlatform.currentWeightMT : 38.64
      );
      setPlatformId(initialPlatformId || activePlatformId);
      setWeighmentType(initialType);
    }
  }, [isOpen, initialVehicle, activePlatform, initialPlatformId, activePlatformId, initialType]);

  // Check if there is an existing 1st weighment record for this vehicle
  const existingRecord = records.find(
    (r) =>
      r.vehicleNo === vehicleNo &&
      r.status === "PENDING_SECOND_WEIGHMENT"
  );

  const isSecondWeighment = !!existingRecord;

  // STRICT AUTO-CALCULATED NET WEIGHT:
  // Net = |Gross - Tare|
  let calculatedGross = recordedWeightMT;
  let calculatedTare = 0;
  let calculatedNet = 0;

  if (isSecondWeighment && existingRecord) {
    if (weighmentType === "INBOUND_TARE") {
      calculatedGross = existingRecord.grossWeightMT;
      calculatedTare = recordedWeightMT;
    } else if (weighmentType === "OUTBOUND_GROSS") {
      calculatedGross = recordedWeightMT;
      calculatedTare = existingRecord.tareWeightMT || 0;
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
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
          className="relative w-full max-w-3xl bg-white border-2 border-neutral-900 shadow-2xl z-10 my-auto overflow-hidden select-none"
          style={{ borderRadius: 0 }}
        >
          {/* Header */}
          <div className="bg-[#18181B] text-white px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#059669] text-white flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base tracking-wide uppercase">
                  {isSecondWeighment
                    ? "2nd Weighment & Net Reconciliation"
                    : "1st Initial Weighment Capture"}
                </h3>
                <div className="text-[11px] text-neutral-400 font-mono">
                  PLATFORM: {platformId} · SCALE TIME:{" "}
                  {new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
            {/* Platform & Weighment Type Selector Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Active Platform
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlatformId("WB-01")}
                    className={`px-3 py-2 text-xs font-bold border cursor-pointer uppercase ${
                      platformId === "WB-01"
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    WB-01 (Inbound)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatformId("WB-02")}
                    className={`px-3 py-2 text-xs font-bold border cursor-pointer uppercase ${
                      platformId === "WB-02"
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    WB-02 (Outbound)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Weighment Flow Mode
                </label>
                <select
                  value={weighmentType}
                  onChange={(e) => setWeighmentType(e.target.value as WeighmentType)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  style={{ borderRadius: 0 }}
                >
                  <option value="INBOUND_GROSS">
                    1st Weighment: INBOUND GROSS (Loaded RM)
                  </option>
                  <option value="INBOUND_TARE">
                    2nd Weighment: INBOUND TARE (Empty RM Exit)
                  </option>
                  <option value="OUTBOUND_TARE">
                    1st Weighment: OUTBOUND TARE (Empty FG Entry)
                  </option>
                  <option value="OUTBOUND_GROSS">
                    2nd Weighment: OUTBOUND GROSS (Loaded FG Exit)
                  </option>
                </select>
              </div>
            </div>

            {/* Vehicle & Material Details Summary */}
            <div className="bg-[#F8F9FA] border border-neutral-200 p-3.5 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Vehicle Number
                  </span>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                    placeholder="MH 12 RN 4821"
                    required
                    className="w-full mt-0.5 px-2 py-1 font-mono font-bold text-sm bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Gate Entry Pass
                  </span>
                  <input
                    type="text"
                    value={gateEntryNo}
                    onChange={(e) => setGateEntryNo(e.target.value)}
                    placeholder="RM-GATE-261003-001"
                    className="w-full mt-0.5 px-2 py-1 font-mono text-xs bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Material Item
                  </span>
                  <input
                    type="text"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    placeholder="Groundnut Shell (GS)"
                    className="w-full mt-0.5 px-2 py-1 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Challan Declared (MT)
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={declaredWeightMT}
                    onChange={(e) => setDeclaredWeightMT(parseFloat(e.target.value) || 0)}
                    className="w-full mt-0.5 px-2 py-1 font-mono font-bold text-xs bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-neutral-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Supplier / Customer
                  </span>
                  <input
                    type="text"
                    value={supplierOrCustomer}
                    onChange={(e) => setSupplierOrCustomer(e.target.value)}
                    placeholder="Partner name"
                    className="w-full mt-0.5 px-2 py-1 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Driver & Contact
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="Driver name"
                      className="w-1/2 mt-0.5 px-2 py-1 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
                      style={{ borderRadius: 0 }}
                    />
                    <input
                      type="text"
                      value={driverMobile}
                      onChange={(e) => setDriverMobile(e.target.value)}
                      placeholder="Mobile"
                      className="w-1/2 mt-0.5 px-2 py-1 font-mono text-xs bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* WEIGHT CAPTURE & NET CALCULATION ENGINE BOX */}
            <div className="bg-[#18181B] text-white p-4 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-neutral-800 pb-2">
                <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" />
                  Live Platform Load Cell Feed
                </span>
                <span className="font-mono text-neutral-400 text-[11px]">
                  STATUS: <strong className="text-emerald-400">STABLE SCALE LOCK</strong>
                </span>
              </div>

              {/* 3-Column Weight Matrix: Gross, Tare, Net */}
              <div className="grid grid-cols-3 gap-3 text-center">
                {/* Gross Box */}
                <div className="bg-neutral-900 border border-neutral-800 p-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                    Gross Weight
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-white">
                    {calculatedGross.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">MT</span>
                </div>

                {/* Tare Box */}
                <div className="bg-neutral-900 border border-neutral-800 p-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                    Tare Weight
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-white">
                    {calculatedTare > 0 ? calculatedTare.toFixed(2) : "PENDING"}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {calculatedTare > 0 ? "MT" : "—"}
                  </span>
                </div>

                {/* Net Box (Strict Auto-Calculated) */}
                <div className="bg-[#059669]/20 border-2 border-[#10B981] p-3">
                  <span className="text-[10px] uppercase tracking-wider font-black text-emerald-400 block mb-1">
                    Net Weight (Auto)
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-[#10B981]">
                    {isSecondWeighment ? calculatedNet.toFixed(2) : "PENDING"}
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono">
                    {isSecondWeighment ? "MT (COMPUTED)" : "Post Unload"}
                  </span>
                </div>
              </div>

              {/* Net Variance Bar if 2nd weighment */}
              {isSecondWeighment && (
                <div className="bg-neutral-900 p-2.5 flex items-center justify-between text-xs font-mono border border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">CHALLAN VARIANCE:</span>
                    <strong
                      className={
                        isToleranceOk ? "text-emerald-400" : "text-amber-400"
                      }
                    >
                      {varianceMT >= 0 ? `+${varianceMT}` : varianceMT} MT
                    </strong>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                      isToleranceOk
                        ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                        : "bg-amber-950 text-amber-300 border-amber-700"
                    }`}
                  >
                    {isToleranceOk ? "WITHIN ±0.5 MT TOLERANCE" : "VARIANCE ALERT"}
                  </span>
                </div>
              )}
            </div>

            {/* Operator Notes & OCR Plate Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Operator Remarks & Scale Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Clean axle weighment. Verified tarp intact."
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900 resize-none"
                  style={{ borderRadius: 0 }}
                />
              </div>

              <div className="bg-neutral-100 border border-neutral-300 p-2.5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-neutral-600 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-neutral-700" />
                    ANPR Plate & Deck Snapshot
                  </div>
                  <div className="text-[11px] font-mono text-neutral-700">
                    Front Cam 01: <strong className="text-emerald-700">MATCHED</strong>
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    High-res load cell snapshot recorded
                  </div>
                </div>

                <div className="w-16 h-12 bg-neutral-900 border border-neutral-400 flex items-center justify-center text-[10px] font-mono text-neutral-400">
                  [CAM 01]
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 border border-neutral-300 transition-colors"
                style={{ borderRadius: 0 }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-3 text-xs font-bold uppercase tracking-wider bg-[#059669] hover:bg-[#047857] text-white border border-[#10B981] flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98"
                style={{ borderRadius: 0 }}
              >
                <Printer className="w-4 h-4" />
                <span>
                  {isSecondWeighment
                    ? "Confirm 2nd Weight & Issue Official Slip"
                    : "Save 1st Weighment & Issue Gate Slip"}
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
