"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Scale,
  ExternalLink,
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
  const { vehicles, addVehicle, prefillEntryData, setPrefillEntryData } = useGate();

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

  // Live operational counters from context
  const insideVehicles = vehicles.filter((v) => v.stage !== "EXIT_COMPLETED");
  const totalInside = insideVehicles.length;
  const inboundCount = insideVehicles.filter((v) => v.direction === "INBOUND_RM").length;
  const outboundCount = insideVehicles.filter((v) => v.direction === "OUTBOUND_DISPATCH").length;
  const awaitingWB = insideVehicles.filter(
    (v) => v.stage === "WAITING_WEIGHMENT" || v.stage === "GROSS_WEIGHED"
  ).length;

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
    <div className="w-full space-y-8 sm:space-y-10 select-none">
      {/* ========================================================================= */}
      {/* 1. COMPACT COMMAND HEADER                                                 */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Vehicle Gate Entry
        </h1>
      </div>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME OPERATIONAL METRICS (4 CARDS)                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* KPI 1: Inbound RM */}
        <div className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider truncate">
            Inbound Raw Material
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {inboundCount}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Vehicles</span>
          </div>
        </div>

        {/* KPI 2: Outbound FG */}
        <div className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider truncate">
            Outbound Finished Goods
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {outboundCount}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Vehicles</span>
          </div>
        </div>

        {/* KPI 3: At Weighbridge */}
        <div
          onClick={() => router.push("/gate/tracker")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors truncate">
            At Weighbridge
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {awaitingWB}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Queued</span>
          </div>
        </div>

        {/* KPI 4: Next Gate Pass ID */}
        <div className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors bg-white flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider truncate">
            Next Gate Pass ID
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-base font-mono font-bold tracking-tight text-[#059669] truncate">
              {passId}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. QUICK ACTION BUTTONS                                                   */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full">
        <button
          type="button"
          onClick={() => router.push("/gate/tracker")}
          className="h-11 sm:h-10 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
          style={{ borderRadius: 0 }}
        >
          <Truck className="w-4 h-4 text-neutral-600 shrink-0" />
          <span>Vehicle Tracker ({totalInside})</span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/gate")}
          className="h-11 sm:h-10 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
          style={{ borderRadius: 0 }}
        >
          <span>Operations Hub</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      <AnimatePresence>
        {successVehicle && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3.5 bg-emerald-50 border border-emerald-300 flex flex-wrap items-center justify-between gap-3 text-xs"
            style={{ borderRadius: 0 }}
          >
            <div className="flex items-center gap-2.5">
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
      {/* 4. MAIN WORKSPACE: 2-COLUMN INDUSTRIAL CONSOLE                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Gate Entry Form (7 cols on lg, 8 on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900">
              New Entry Registration
            </h2>
            <div className="text-xs font-semibold text-neutral-500">
              Required Fields Marked <span className="text-red-500">*</span>
            </div>
          </div>

          <div className="border border-neutral-300 bg-white p-4 sm:p-6" style={{ borderRadius: 0 }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Banner */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Direction Switcher & Routing Destination */}
              <div className="p-3.5 bg-[#F8F9FA] border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-neutral-700 shrink-0">
                    Direction <span className="text-red-500">*</span>
                  </span>
                  <div className="inline-flex border border-neutral-300 p-0.5 bg-neutral-200/60 gap-1">
                    <button
                      type="button"
                      onClick={() => handleDirectionChange("INBOUND_RM")}
                      className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
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
                      className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
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

                <div className="flex items-center gap-2 text-xs text-neutral-600 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                  <span>Route: <strong className="text-neutral-900 font-semibold">Weighbridge 01 (Gross Scale)</strong></span>
                </div>
              </div>

              {/* Group 1: Vehicle & Transport Details */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 pb-1.5">
                  1. Vehicle & Transport Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Vehicle Reg No */}
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1.5">
                      Vehicle Reg No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                      placeholder="e.g. MH 12 RN 4821"
                      className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                      style={{ borderRadius: 0 }}
                      required
                    />
                  </div>

                  {/* Vehicle Body Type */}
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1.5">
                      Vehicle Body Type
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as GateVehicle["vehicleType"])}
                      className="w-full h-10 px-2.5 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all cursor-pointer"
                      style={{ borderRadius: 0 }}
                    >
                      <option value="10-Wheeler Tipper">10-Wheeler Tipper</option>
                      <option value="12-Wheeler">12-Wheeler Truck</option>
                      <option value="6-Wheeler">6-Wheeler Medium</option>
                      <option value="Trailer 40ft">Trailer 40ft (High Capacity)</option>
                    </select>
                  </div>

                  {/* Transporter Name */}
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1.5">
                      Transporter Name
                    </label>
                    <input
                      type="text"
                      value={transporter}
                      onChange={(e) => setTransporter(e.target.value)}
                      placeholder="e.g. Shree Ganesh Roadways"
                      className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Material & Load Details */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 pb-1.5">
                  2. Material & Load Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Material Name */}
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1.5">
                      Material <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                      className="w-full h-10 px-2.5 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all cursor-pointer"
                      style={{ borderRadius: 0 }}
                    >
                      {(direction === "INBOUND_RM" ? RAW_MATERIALS : FINISHED_GOODS).map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Expected Qty (MT) */}
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1.5">
                      Expected Weight (MT) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={expectedWeightMT}
                      onChange={(e) => setExpectedWeightMT(e.target.value)}
                      placeholder="24.5"
                      className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                      style={{ borderRadius: 0 }}
                      required
                    />
                  </div>

                  {/* PO / Challan Reference */}
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1.5">
                      PO / Challan Reference
                    </label>
                    <input
                      type="text"
                      value={poOrChallanRef}
                      onChange={(e) => setPoOrChallanRef(e.target.value)}
                      placeholder="e.g. PO-2026-0982"
                      className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Party & Driver Information */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 pb-1.5">
                  3. Party & Driver Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Supplier / Customer */}
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1.5">
                      {direction === "INBOUND_RM" ? "Supplier" : "Customer"} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={partyName}
                      onChange={(e) => setPartyName(e.target.value)}
                      className="w-full h-10 px-2.5 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all cursor-pointer"
                      style={{ borderRadius: 0 }}
                    >
                      {(direction === "INBOUND_RM" ? COMMON_SUPPLIERS : COMMON_CUSTOMERS).map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Driver Name */}
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1.5">
                      Driver Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="Driver full name"
                      className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                      style={{ borderRadius: 0 }}
                      required
                    />
                  </div>

                  {/* Driver Mobile */}
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1.5">
                      Driver Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={driverMobile}
                      onChange={(e) => setDriverMobile(e.target.value)}
                      placeholder="+91 98224 81920"
                      className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                </div>
              </div>

              {/* Group 4: Security Inspection & Remarks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    4. Security Inspection & Remarks
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Click preset to add
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_REMARKS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddPresetRemark(preset)}
                      className="px-2.5 py-1 text-[10px] font-semibold border border-neutral-300 bg-[#F8F9FA] hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                      style={{ borderRadius: 0 }}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                <div>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter gate inspection remarks..."
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              {/* Form Action Footer */}
              <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-neutral-500">
                  Pass will route vehicle to <strong className="text-neutral-800">Weighbridge 01</strong>.
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-4 py-2.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors text-center"
                    style={{ borderRadius: 0 }}
                  >
                    Clear Form
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
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

        {/* Right Column: Today's Gate Log (5 cols on lg, 4 on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900">
              Today&apos;s Gate Log
            </h2>
            <div className="text-xs font-semibold text-neutral-500">
              {vehicles.length} Recorded
            </div>
          </div>

          <div
            className="border border-neutral-300 bg-white p-3.5 space-y-3 max-h-[750px] overflow-y-auto"
            style={{ borderRadius: 0 }}
          >
            {vehicles.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 text-xs">
                No gate passes issued today yet.
              </div>
            ) : (
              vehicles.slice(0, 10).map((veh) => {
                const isRM = veh.direction === "INBOUND_RM";
                return (
                  <div
                    key={veh.id}
                    onClick={() => router.push("/gate/tracker")}
                    className="border border-neutral-200 p-3 hover:border-neutral-900 transition-all cursor-pointer group bg-[#F8F9FA] space-y-2"
                    style={{ borderRadius: 0 }}
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-neutral-200 pb-1.5">
                      <div>
                        <div className="font-mono font-bold text-neutral-900 text-xs group-hover:text-[#059669] transition-colors">
                          {veh.vehicleNo}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          {veh.gateEntryNo}
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 border shrink-0 ${
                          isRM
                            ? "border-emerald-300 bg-emerald-50 text-[#047857]"
                            : "border-neutral-300 bg-[#18181B] text-white"
                        }`}
                        style={{ borderRadius: 0 }}
                      >
                        {isRM ? "Inbound RM" : "Outbound FG"}
                      </span>
                    </div>

                    <div className="space-y-0.5 text-[11px]">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-semibold text-neutral-900 truncate">
                          {veh.materialName}
                        </span>
                        <span className="font-mono text-neutral-700 text-[10px] shrink-0">
                          {veh.declaredWeightMT.toFixed(1)} MT
                        </span>
                      </div>
                      <div className="text-neutral-500 truncate text-[10px]">
                        {veh.supplierOrCustomer}
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>{veh.arrivalTime} IST</span>
                      </span>

                      <span className="font-medium text-neutral-700 flex items-center gap-1 group-hover:text-[#059669] transition-colors">
                        <span>{veh.stage.replace(/_/g, " ")}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
