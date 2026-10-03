"use client";

import React, { useState, useEffect } from "react";
import { X, Truck, Check, AlertCircle, FileText } from "lucide-react";
import { GateVehicle, VehicleDirection } from "@/lib/types/gate";

interface GateEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (vehicle: GateVehicle) => void;
  initialData?: Partial<GateVehicle> | null;
}

export function GateEntryModal({
  isOpen,
  onClose,
  onAddVehicle,
  initialData,
}: GateEntryModalProps) {
  const [direction, setDirection] = useState<VehicleDirection>("INBOUND_RM");
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState<GateVehicle["vehicleType"]>(
    "10-Wheeler Tipper"
  );
  const [materialName, setMaterialName] = useState("Groundnut Shell (GS)");
  const [supplierOrCustomer, setSupplierOrCustomer] = useState("");
  const [transporter, setTransporter] = useState("");
  const [challanOrLrNo, setChallanOrLrNo] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverMobile, setDriverMobile] = useState("");
  const [declaredWeightMT, setDeclaredWeightMT] = useState("");
  const [assignedLocation, setAssignedLocation] = useState("Weighbridge 01 (Gross)");
  const [ewayBillNo, setEwayBillNo] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      if (initialData.direction) setDirection(initialData.direction);
      if (initialData.vehicleNo) setVehicleNo(initialData.vehicleNo);
      if (initialData.materialName) setMaterialName(initialData.materialName);
      if (initialData.supplierOrCustomer) setSupplierOrCustomer(initialData.supplierOrCustomer);
      if (initialData.transporter) setTransporter(initialData.transporter);
      if (initialData.challanOrLrNo) setChallanOrLrNo(initialData.challanOrLrNo);
      if (initialData.driverName) setDriverName(initialData.driverName);
      if (initialData.driverMobile) setDriverMobile(initialData.driverMobile);
      if (initialData.declaredWeightMT) setDeclaredWeightMT(String(initialData.declaredWeightMT));
      if (initialData.assignedLocation) setAssignedLocation(initialData.assignedLocation);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Auto-generate next sequence
  const generatedId = `RM-GATE-261003-${Math.floor(Math.random() * 900 + 100)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNo.trim() || !supplierOrCustomer.trim() || !driverName.trim()) {
      setError("Please fill in Vehicle Reg No, Supplier/Customer, and Driver Name.");
      return;
    }

    const now = new Date();
    const arrivalTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const newVehicle: GateVehicle = {
      id: `veh-${Date.now()}`,
      gateEntryNo: generatedId,
      vehicleNo: vehicleNo.trim().toUpperCase(),
      vehicleType,
      direction,
      materialName,
      materialCode: direction === "INBOUND_RM" ? "RM-BIO" : "FG-PEL",
      supplierOrCustomer: supplierOrCustomer.trim(),
      transporter: transporter.trim() || "Local Transport",
      challanOrLrNo: challanOrLrNo.trim() || `CH-${Math.floor(Math.random() * 900000 + 100000)}`,
      driverName: driverName.trim(),
      driverMobile: driverMobile.trim() || "+91 98000 00000",
      declaredWeightMT: parseFloat(declaredWeightMT) || 22.5,
      assignedLocation,
      stage: "WAITING_WEIGHMENT",
      arrivalTime,
      elapsedMinutes: 1,
      securityOfficer: "Ramesh Pawar (Gate 1)",
      ewayBillNo: ewayBillNo.trim() || `EWB-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      notes: notes.trim() || "Gate entry authorized. Driver verified at boom barrier.",
    };

    onAddVehicle(newVehicle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 select-none">
      <div
        className="w-full max-w-2xl bg-white border border-neutral-300 max-h-[96vh] sm:max-h-[92vh] flex flex-col"
        style={{ borderRadius: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-200 bg-[#F8F9FA]">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="w-2 h-2 bg-[#059669] shrink-0" />
            <div>
              <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-neutral-900 uppercase">
                New Gate Entry Pass · Security Checkpoint
              </h2>
              <p className="text-[10px] sm:text-[11px] text-neutral-500">
                Entry Pass ID: <span className="font-semibold text-neutral-800 tabular-nums">{generatedId}</span> · Gate Station 01
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2" style={{ borderRadius: 0 }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 text-xs">
          {/* Direction Toggle */}
          <div>
            <label className="block font-semibold text-neutral-700 uppercase tracking-wider text-[11px] mb-1.5">
              Operation Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection("INBOUND_RM")}
                className={`py-2 px-3 text-left border cursor-pointer font-medium transition-colors ${
                  direction === "INBOUND_RM"
                    ? "bg-[#18181B] text-white border-[#18181B]"
                    : "bg-transparent text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                }`}
                style={{ borderRadius: 0 }}
              >
                <div className="flex items-center justify-between">
                  <span>Inbound Raw Material (RM)</span>
                  {direction === "INBOUND_RM" && <Check className="w-4 h-4" />}
                </div>
                <div className={`text-[10px] ${direction === "INBOUND_RM" ? "text-neutral-300" : "text-neutral-500"}`}>
                  Biomass truck arrival for unloading & QC
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDirection("OUTBOUND_DISPATCH")}
                className={`py-2 px-3 text-left border cursor-pointer font-medium transition-colors ${
                  direction === "OUTBOUND_DISPATCH"
                    ? "bg-[#18181B] text-white border-[#18181B]"
                    : "bg-transparent text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                }`}
                style={{ borderRadius: 0 }}
              >
                <div className="flex items-center justify-between">
                  <span>Outbound Finished Goods (FG)</span>
                  {direction === "OUTBOUND_DISPATCH" && <Check className="w-4 h-4" />}
                </div>
                <div className={`text-[10px] ${direction === "OUTBOUND_DISPATCH" ? "text-neutral-300" : "text-neutral-500"}`}>
                  Customer truck arrival for pellet loading
                </div>
              </button>
            </div>
          </div>

          {/* Vehicle Number & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Vehicle Registration No. *
              </label>
              <input
                type="text"
                required
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                placeholder="e.g. MH 12 RN 4821"
                className="w-full bg-transparent border border-neutral-300 px-3 py-2 text-neutral-900 font-semibold text-xs uppercase focus:outline-none focus:border-neutral-800"
                style={{ borderRadius: 0 }}
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as GateVehicle["vehicleType"])}
                className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-800 cursor-pointer"
                style={{ borderRadius: 0 }}
              >
                <option value="10-Wheeler Tipper">10-Wheeler Tipper (Standard RM)</option>
                <option value="12-Wheeler">12-Wheeler Heavy Carrier</option>
                <option value="6-Wheeler">6-Wheeler Medium Carrier</option>
                <option value="Trailer 40ft">Trailer 40ft (Export Container)</option>
              </select>
            </div>
          </div>

          {/* Material & Supplier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Material Name *
              </label>
              {direction === "INBOUND_RM" ? (
                <select
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-800 cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  <option value="Groundnut Shell (GS)">Groundnut Shell (GS)</option>
                  <option value="Sawdust Fine (SD)">Sawdust Fine (SD)</option>
                  <option value="Bagasse Dry Bale (BG)">Bagasse Dry Bale (BG)</option>
                  <option value="Cotton Stalk Shredded (CS)">Cotton Stalk Shredded (CS)</option>
                  <option value="Paddy Straw Chopped (PS)">Paddy Straw Chopped (PS)</option>
                  <option value="Mustard Stalk (MS)">Mustard Stalk (MS)</option>
                </select>
              ) : (
                <select
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-800 cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  <option value="Biomass Pellets 8mm (Export Grade)">Biomass Pellets 8mm (Export Grade)</option>
                  <option value="Biomass Pellets 8mm (Standard)">Biomass Pellets 8mm (Standard)</option>
                  <option value="Biomass Briquettes 90mm">Biomass Briquettes 90mm</option>
                </select>
              )}
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                {direction === "INBOUND_RM" ? "Supplier Name *" : "Customer Name *"}
              </label>
              <input
                type="text"
                required
                value={supplierOrCustomer}
                onChange={(e) => setSupplierOrCustomer(e.target.value)}
                placeholder={direction === "INBOUND_RM" ? "e.g. Krishi Bio Agro Farmers" : "e.g. UltraTech Cement Ltd"}
                className="w-full bg-transparent border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-800"
                style={{ borderRadius: 0 }}
              />
            </div>
          </div>

          {/* Transporter & Challan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Transporter Name
              </label>
              <input
                type="text"
                value={transporter}
                onChange={(e) => setTransporter(e.target.value)}
                placeholder="e.g. Shree Ganesh Roadways"
                className="w-full bg-transparent border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-800"
                style={{ borderRadius: 0 }}
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Challan / LR No.
              </label>
              <input
                type="text"
                value={challanOrLrNo}
                onChange={(e) => setChallanOrLrNo(e.target.value)}
                placeholder="e.g. CH-982104"
                className="w-full bg-transparent border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-800"
                style={{ borderRadius: 0 }}
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Declared Weight (MT)
              </label>
              <input
                type="number"
                step="0.01"
                value={declaredWeightMT}
                onChange={(e) => setDeclaredWeightMT(e.target.value)}
                placeholder="e.g. 24.50"
                className="w-full bg-transparent border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-800"
                style={{ borderRadius: 0 }}
              />
            </div>
          </div>

          {/* Driver Name & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Driver Name *
              </label>
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="e.g. Pandurang Patil"
                className="w-full bg-transparent border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-800"
                style={{ borderRadius: 0 }}
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Driver Mobile No.
              </label>
              <input
                type="tel"
                value={driverMobile}
                onChange={(e) => setDriverMobile(e.target.value)}
                placeholder="+91 98000 00000"
                className="w-full bg-transparent border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-800"
                style={{ borderRadius: 0 }}
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Assigned Destination
              </label>
              <select
                value={assignedLocation}
                onChange={(e) => setAssignedLocation(e.target.value)}
                className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-800 cursor-pointer"
                style={{ borderRadius: 0 }}
              >
                <option value="Weighbridge 01 (Gross)">Weighbridge 01 (Gross Station)</option>
                <option value="Weighbridge 02 (Gross)">Weighbridge 02 (Gross Station)</option>
                <option value="Holding Yard 01">Holding Yard 01</option>
              </select>
            </div>
          </div>

          {/* e-Way Bill & Security Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                e-Way Bill Number
              </label>
              <input
                type="text"
                value={ewayBillNo}
                onChange={(e) => setEwayBillNo(e.target.value)}
                placeholder="e.g. EWB-2910-8472-1092"
                className="w-full bg-transparent border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-800"
                style={{ borderRadius: 0 }}
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Gate Inspection Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tarp verified, physical seal checked..."
                className="w-full bg-transparent border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-800"
                style={{ borderRadius: 0 }}
              />
            </div>
          </div>
        </form>

        {/* Footer Actions (Surgical Bio-Emerald Primary Action) */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-neutral-200 bg-[#F8F9FA] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 border border-neutral-300 sm:border-transparent text-center cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-5 py-2.5 sm:py-2 text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            style={{ borderRadius: 0 }}
          >
            <Truck className="w-4 h-4" />
            <span>Generate Pass & Route to WB</span>
          </button>
        </div>
      </div>
    </div>
  );
}
