"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Scale,
} from "lucide-react";
import { GateVehicle, VehicleDirection } from "@/lib/types/gate";
import { useGate } from "@/lib/context/gate-context";

const COMMON_SUPPLIERS = [
  "Krishi Bio Agro Farmers Co-op",
  "Vidarbha Wood Processors LLP",
  "Solapur Biofuels Co-Op",
  "Kolhapur Agro Biomass Union",
  "Marathwada Agro Feedstocks",
  "Satara Agri Residue Cluster",
];

const COMMON_CUSTOMERS = [
  "UltraTech Cement Works Ltd",
  "Tata Power Renewables",
  "MahaGenco Thermal Power Station",
  "JSW Energy Pellet Division",
  "Dalmia Bharat Biofuels",
];

const RAW_MATERIALS = [
  "Groundnut Shell (GS)",
  "Sawdust Fine (SD)",
  "Bagasse Dry Bale (BG)",
  "Cotton Stalk Shredded (CS)",
  "Mustard Husk (MH)",
  "Soya Husk (SH)",
];

const FINISHED_GOODS = [
  "Biomass Pellets 8mm (Export Grade)",
  "Biomass Pellets 8mm (Industrial Grade)",
  "Biomass Pellets 6mm (Commercial Grade)",
];

const PRESET_REMARKS = [
  "Tarpaulin seal intact",
  "Physical bed clean & empty",
  "Driver alcohol check passed",
  "Documents matched with PO",
];

export function GateEntry() {
  const router = useRouter();
  const { addVehicle, prefillEntryData, setPrefillEntryData } = useGate();

  // Direction: Inbound Raw Material vs Outbound Finished Goods
  const [direction, setDirection] = useState<VehicleDirection>("INBOUND_RM");

  // Pass Serial ID
  const [passSeq, setPassSeq] = useState(101);
  useEffect(() => {
    setPassSeq(Math.floor(Math.random() * 800 + 100));
  }, []);

  const passId = `${direction === "INBOUND_RM" ? "RM-GATE" : "DIS-GATE"}-261003-${passSeq}`;

  // Form Fields (Required by PDF Sec 3 & 27)
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState<GateVehicle["vehicleType"]>("10-Wheeler Tipper");
  const [partyName, setPartyName] = useState(COMMON_SUPPLIERS[0]);
  const [materialName, setMaterialName] = useState(RAW_MATERIALS[0]);
  const [expectedWeightMT, setExpectedWeightMT] = useState("24.5");
  const [poOrChallanRef, setPoOrChallanRef] = useState("");
  const [transporter, setTransporter] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverMobile, setDriverMobile] = useState("");
  const [remarks, setRemarks] = useState("Tarpaulin seal intact. Physical condition verified.");

  // Feedback & State
  const [error, setError] = useState<string | null>(null);
  const [successVehicle, setSuccessVehicle] = useState<GateVehicle | null>(null);

  // Consume prefill data if present
  useEffect(() => {
    if (prefillEntryData) {
      if (prefillEntryData.direction) setDirection(prefillEntryData.direction);
      if (prefillEntryData.vehicleNo) setVehicleNo(prefillEntryData.vehicleNo);
      if (prefillEntryData.supplierOrCustomer) setPartyName(prefillEntryData.supplierOrCustomer);
      if (prefillEntryData.materialName) setMaterialName(prefillEntryData.materialName);
      if (prefillEntryData.declaredWeightMT) setExpectedWeightMT(String(prefillEntryData.declaredWeightMT));
      if (prefillEntryData.challanOrLrNo) setPoOrChallanRef(prefillEntryData.challanOrLrNo);
      if (prefillEntryData.transporter) setTransporter(prefillEntryData.transporter);
      if (prefillEntryData.driverName) setDriverName(prefillEntryData.driverName);
      if (prefillEntryData.driverMobile) setDriverMobile(prefillEntryData.driverMobile);
      if (prefillEntryData.notes) setRemarks(prefillEntryData.notes);
      setPrefillEntryData(null);
    }
  }, [prefillEntryData, setPrefillEntryData]);

  // Adjust default party & material when direction switches
  const handleDirectionChange = (newDir: VehicleDirection) => {
    setDirection(newDir);
    if (newDir === "INBOUND_RM") {
      setPartyName(COMMON_SUPPLIERS[0]);
      setMaterialName(RAW_MATERIALS[0]);
      setVehicleType("10-Wheeler Tipper");
    } else {
      setPartyName(COMMON_CUSTOMERS[0]);
      setMaterialName(FINISHED_GOODS[0]);
      setVehicleType("Trailer 40ft");
    }
    setError(null);
  };

  const handleReset = () => {
    setVehicleNo("");
    setExpectedWeightMT("24.5");
    setPoOrChallanRef("");
    setTransporter("");
    setDriverName("");
    setDriverMobile("");
    setRemarks("Tarpaulin seal intact. Physical condition verified.");
    setError(null);
  };

  const handleAddPresetRemark = (preset: string) => {
    if (!remarks.trim() || remarks === "Tarpaulin seal intact. Physical condition verified.") {
      setRemarks(preset);
    } else if (!remarks.includes(preset)) {
      setRemarks(`${remarks}, ${preset}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanVehicleNo = vehicleNo.trim().toUpperCase();
    if (!cleanVehicleNo) {
      setError("Please enter the vehicle registration number.");
      return;
    }
    if (!partyName.trim()) {
      setError(direction === "INBOUND_RM" ? "Please select a supplier." : "Please select a customer.");
      return;
    }
    if (!driverName.trim()) {
      setError("Please enter the driver's name.");
      return;
    }

    const weightNum = parseFloat(expectedWeightMT) || 24.0;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newVehicle: GateVehicle = {
      id: `veh-${Date.now()}`,
      gateEntryNo: passId,
      vehicleNo: cleanVehicleNo,
      vehicleType,
      direction,
      materialName,
      materialCode: direction === "INBOUND_RM" ? "RM-BIO" : "FG-PEL",
      supplierOrCustomer: partyName.trim(),
      transporter: transporter.trim() || "Fleet Logistics Partner",
      challanOrLrNo: poOrChallanRef.trim() || `CH-${Math.floor(Math.random() * 900000 + 100000)}`,
      driverName: driverName.trim(),
      driverMobile: driverMobile.trim() || "+91 98224 81920",
      declaredWeightMT: weightNum,
      assignedLocation: "Weighbridge 01 (Gross)",
      stage: "WAITING_WEIGHMENT",
      arrivalTime: timeStr,
      elapsedMinutes: 0,
      securityOfficer: "Gate Security Staff",
      notes: remarks.trim() || "Inbound gate inspection verified.",
    };

    addVehicle(newVehicle);
    setSuccessVehicle(newVehicle);
    setPassSeq((prev) => prev + 1);
  };

  return (
    <div className="w-full space-y-4 select-none">
      {/* ========================================================================= */}
      {/* 1. COMMAND HEADER (CLEAN & BOLD TYPOGRAPHY)                               */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-300 pb-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Vehicle Gate Entry
        </h1>
      </div>

      {/* Success Notification Banner */}
      <AnimatePresence>
        {successVehicle && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="p-3 bg-emerald-50 border border-emerald-300 flex flex-wrap items-center justify-between gap-3 text-xs"
            style={{ borderRadius: 0 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
              <span className="font-bold text-neutral-900">
                Gate Pass Issued: {successVehicle.gateEntryNo}
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-700">
                Vehicle <strong className="font-mono text-neutral-900">{successVehicle.vehicleNo}</strong> ({successVehicle.materialName}) routed to Weighbridge 01.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push("/gate/tracker")}
                className="px-3 py-1 bg-[#059669] hover:bg-[#047857] text-white font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer text-xs"
                style={{ borderRadius: 0 }}
              >
                <span>Track Vehicle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSuccessVehicle(null);
                  handleReset();
                }}
                className="px-3 py-1 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 font-semibold cursor-pointer transition-colors text-xs"
                style={{ borderRadius: 0 }}
              >
                + Register Next
              </button>
              <button
                type="button"
                onClick={() => setSuccessVehicle(null)}
                className="text-neutral-400 hover:text-neutral-700 px-1 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. COMPACT ZERO-SCROLL REGISTRATION CONSOLE                                */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border border-neutral-300 p-4 sm:p-5" style={{ borderRadius: 0 }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Direction Switcher & Telemetry Bar */}
          <div className="p-2.5 bg-[#F8F9FA] border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase text-neutral-700 shrink-0">
                Direction <span className="text-red-500">*</span>:
              </span>
              <div className="inline-flex border border-neutral-300 p-0.5 bg-neutral-200/60 gap-1">
                <button
                  type="button"
                  onClick={() => handleDirectionChange("INBOUND_RM")}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    direction === "INBOUND_RM"
                      ? "bg-[#059669] text-white shadow-xs"
                      : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Inbound Biomass RM</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectionChange("OUTBOUND_DISPATCH")}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    direction === "OUTBOUND_DISPATCH"
                      ? "bg-[#18181B] text-white shadow-xs"
                      : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Outbound Dispatch FG</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600">
              <span className="font-mono">
                Pass ID: <strong className="text-neutral-900 font-bold">{passId}</strong>
              </span>
              <span className="hidden sm:inline text-neutral-300">|</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                <span>Destination: <strong className="text-neutral-900 font-semibold">Weighbridge 01 (Gross Scale)</strong></span>
              </span>
            </div>
          </div>

          {/* 3-Column Balanced Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {/* Column 1: Vehicle & Transport */}
            <div className="space-y-2.5 bg-neutral-50/50 p-3 border border-neutral-200">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200 pb-1">
                1. Vehicle & Transport
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Vehicle Reg No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                  placeholder="e.g. MH 12 RN 4821"
                  className="w-full h-9 px-3 bg-white border border-neutral-300 text-xs font-mono font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                  style={{ borderRadius: 0 }}
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Vehicle Body Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as GateVehicle["vehicleType"])}
                  className="w-full h-9 px-2.5 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669] transition-all cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  <option value="10-Wheeler Tipper">10-Wheeler Tipper</option>
                  <option value="12-Wheeler">12-Wheeler Truck</option>
                  <option value="6-Wheeler">6-Wheeler Medium</option>
                  <option value="Trailer 40ft">Trailer 40ft (High Capacity)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Transporter Name
                </label>
                <input
                  type="text"
                  value={transporter}
                  onChange={(e) => setTransporter(e.target.value)}
                  placeholder="e.g. Shree Ganesh Roadways"
                  className="w-full h-9 px-3 bg-white border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-all"
                  style={{ borderRadius: 0 }}
                />
              </div>
            </div>

            {/* Column 2: Material & Load */}
            <div className="space-y-2.5 bg-neutral-50/50 p-3 border border-neutral-200">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200 pb-1">
                2. Material & Load
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Material <span className="text-red-500">*</span>
                </label>
                <select
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="w-full h-9 px-2.5 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669] transition-all cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  {(direction === "INBOUND_RM" ? RAW_MATERIALS : FINISHED_GOODS).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Expected Weight (MT) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={expectedWeightMT}
                  onChange={(e) => setExpectedWeightMT(e.target.value)}
                  placeholder="24.5"
                  className="w-full h-9 px-3 bg-white border border-neutral-300 text-xs font-mono font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-all"
                  style={{ borderRadius: 0 }}
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  PO / Challan Reference
                </label>
                <input
                  type="text"
                  value={poOrChallanRef}
                  onChange={(e) => setPoOrChallanRef(e.target.value)}
                  placeholder="e.g. PO-2026-0982"
                  className="w-full h-9 px-3 bg-white border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-all"
                  style={{ borderRadius: 0 }}
                />
              </div>
            </div>

            {/* Column 3: Party & Driver */}
            <div className="space-y-2.5 bg-neutral-50/50 p-3 border border-neutral-200">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200 pb-1">
                3. Party & Driver Details
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  {direction === "INBOUND_RM" ? "Supplier" : "Customer"} <span className="text-red-500">*</span>
                </label>
                <select
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  className="w-full h-9 px-2.5 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669] transition-all cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  {(direction === "INBOUND_RM" ? COMMON_SUPPLIERS : COMMON_CUSTOMERS).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Driver Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Driver full name"
                  className="w-full h-9 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-all"
                  style={{ borderRadius: 0 }}
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Driver Mobile Number
                </label>
                <input
                  type="tel"
                  value={driverMobile}
                  onChange={(e) => setDriverMobile(e.target.value)}
                  placeholder="+91 98224 81920"
                  className="w-full h-9 px-3 bg-white border border-neutral-300 text-xs font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-all"
                  style={{ borderRadius: 0 }}
                />
              </div>
            </div>
          </div>

          {/* Security Remarks & Inspection Presets */}
          <div className="space-y-1.5 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <label className="text-[11px] font-semibold text-neutral-700">
                Security Inspection & Remarks
              </label>
              <div className="flex flex-wrap items-center gap-1">
                {PRESET_REMARKS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddPresetRemark(preset)}
                    className="px-2 py-0.5 text-[10px] font-semibold border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                    style={{ borderRadius: 0 }}
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter gate inspection remarks..."
              className="w-full h-9 px-3 bg-white border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-all"
              style={{ borderRadius: 0 }}
            />
          </div>

          {/* Form Actions Footer */}
          <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-neutral-500 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Pass will automatically route vehicle to <strong>Gross Scale (Weighbridge 01)</strong>.</span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors text-center"
                style={{ borderRadius: 0 }}
              >
                Clear Form
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                style={{ borderRadius: 0 }}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Issue Pass & Register</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
