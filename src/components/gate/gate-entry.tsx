"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  RotateCcw,
  ArrowRight,
  Clock,
  Sparkles,
  Camera,
  Radio,
  SlidersHorizontal,
  Layers,
  MapPin,
  User,
  Phone,
  Barcode,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Info,
} from "lucide-react";
import { GateVehicle, VehicleDirection } from "@/lib/types/gate";
import { useGate } from "@/lib/context/gate-context";

interface PreAdvisedTruck {
  id: string;
  poNo: string;
  supplierName: string;
  vehicleNo: string;
  transporter: string;
  materialName: string;
  expectedWeightMT: number;
  driverName: string;
  driverMobile: string;
  driverLicense: string;
  originDistrict: string;
  challanNo: string;
  ewayBillNo: string;
  assignedBay: string;
  eta: string;
}

const PRE_ADVISED_TRUCKS: PreAdvisedTruck[] = [
  {
    id: "ADV-01",
    poNo: "PO-2026-0982",
    supplierName: "Kolhapur Agro Biomass Union",
    vehicleNo: "MH 09 CW 3319",
    transporter: "Sahyadri Logistics Fleet",
    materialName: "Groundnut Shell (GS)",
    expectedWeightMT: 26.5,
    driverName: "Sanjay Mane",
    driverMobile: "+91 98220 11942",
    driverLicense: "MH-09-2017-004812",
    originDistrict: "Hatkangale (Kolhapur)",
    challanNo: "CH-982104",
    ewayBillNo: "EWB-2610-8472-1092",
    assignedBay: "Yard A - GS Pit 01",
    eta: "Approaching Gate (2 mins)",
  },
  {
    id: "ADV-02",
    poNo: "PO-2026-0985",
    supplierName: "Vidarbha Wood Processors LLP",
    vehicleNo: "MH 31 CB 7721",
    transporter: "Nagpur Express Logistics",
    materialName: "Sawdust Fine (SD)",
    expectedWeightMT: 31.0,
    driverName: "Raju Gaikwad",
    driverMobile: "+91 94221 88301",
    driverLicense: "MH-31-2015-009941",
    originDistrict: "Nagpur Timber Zone",
    challanNo: "CH-982105",
    ewayBillNo: "EWB-2610-8472-1095",
    assignedBay: "Yard B - Sawdust Shed 02",
    eta: "At Outer Yard (6 mins)",
  },
  {
    id: "ADV-03",
    poNo: "PO-2026-0988",
    supplierName: "Sahyadri Sugar & Biomass Co-op",
    vehicleNo: "MH 11 AT 5504",
    transporter: "Kisan Trans Lines",
    materialName: "Bagasse Dry Bale (BG)",
    expectedWeightMT: 22.0,
    driverName: "Tanaji Jadhav",
    driverMobile: "+91 98812 44901",
    driverLicense: "MH-11-2019-002133",
    originDistrict: "Karad Sugar Belt",
    challanNo: "CH-982108",
    ewayBillNo: "EWB-2610-8472-1100",
    assignedBay: "Yard C - Bagasse Bales",
    eta: "On Route (18 mins)",
  },
  {
    id: "ADV-04",
    poNo: "SO-2026-0412",
    supplierName: "UltraTech Cement Ltd (Dhule Works)",
    vehicleNo: "MH 18 BZ 9012",
    transporter: "Western Bulk Carriers",
    materialName: "Biomass Pellets 8mm (Export Grade)",
    expectedWeightMT: 35.0,
    driverName: "Dnyaneshwar Shinde",
    driverMobile: "+91 97654 33210",
    driverLicense: "MH-18-2016-008129",
    originDistrict: "Dhule Industrial Area",
    challanNo: "CH-FG-449102",
    ewayBillNo: "EWB-2610-9901-4411",
    assignedBay: "Silo Complex 03 - Bulk Chute",
    eta: "At Gate 01 Waiting Bay",
  },
];

export function GateEntry() {
  const router = useRouter();
  const { addVehicle, prefillEntryData, setPrefillEntryData } = useGate();

  // Generated pass serial
  const [passSerial] = useState(
    () => `RM-GATE-261003-${Math.floor(Math.random() * 900 + 100)}`
  );

  // Form states
  const [direction, setDirection] = useState<VehicleDirection>("INBOUND_RM");
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState<GateVehicle["vehicleType"]>("10-Wheeler Tipper");
  const [materialName, setMaterialName] = useState("Groundnut Shell (GS)");
  const [supplierOrCustomer, setSupplierOrCustomer] = useState("");
  const [transporter, setTransporter] = useState("");
  const [challanOrLrNo, setChallanOrLrNo] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverMobile, setDriverMobile] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [declaredWeightMT, setDeclaredWeightMT] = useState("24.50");
  const [declaredMoisture, setDeclaredMoisture] = useState("12.5");
  const [assignedLocation, setAssignedLocation] = useState("Weighbridge 01 (Gross)");
  const [assignedBay, setAssignedBay] = useState("Yard A - GS Pit 01");
  const [ewayBillNo, setEwayBillNo] = useState("");
  const [rfidTag, setRfidTag] = useState("TAG-MH12-9982");
  const [originDistrict, setOriginDistrict] = useState("Kolhapur Agro Belt");
  const [notes, setNotes] = useState("Gate inspection verified. Tarpaulin secured. Driver fit for duty.");

  // Safety checklist states
  const [bacPassed, setBacPassed] = useState(true);
  const [helmetChecked, setHelmetChecked] = useState(true);
  const [shoesVestChecked, setShoesVestChecked] = useState(true);
  const [chocksChecked, setChocksChecked] = useState(true);
  const [tarpChecked, setTarpChecked] = useState(true);

  // Status & error states
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [issuedVehicle, setIssuedVehicle] = useState<GateVehicle | null>(null);

  // If prefillEntryData was passed through context (e.g. from 1-Click Check-In on home page)
  useEffect(() => {
    if (prefillEntryData) {
      if (prefillEntryData.direction) setDirection(prefillEntryData.direction);
      if (prefillEntryData.vehicleNo) setVehicleNo(prefillEntryData.vehicleNo);
      if (prefillEntryData.materialName) setMaterialName(prefillEntryData.materialName);
      if (prefillEntryData.supplierOrCustomer) setSupplierOrCustomer(prefillEntryData.supplierOrCustomer);
      if (prefillEntryData.transporter) setTransporter(prefillEntryData.transporter);
      if (prefillEntryData.challanOrLrNo) setChallanOrLrNo(prefillEntryData.challanOrLrNo);
      if (prefillEntryData.driverName) setDriverName(prefillEntryData.driverName);
      if (prefillEntryData.driverMobile) setDriverMobile(prefillEntryData.driverMobile);
      if (prefillEntryData.declaredWeightMT) setDeclaredWeightMT(String(prefillEntryData.declaredWeightMT));
      if (prefillEntryData.assignedLocation) setAssignedLocation(prefillEntryData.assignedLocation);
      if (prefillEntryData.ewayBillNo) setEwayBillNo(prefillEntryData.ewayBillNo);
      // Clear after consuming
      setPrefillEntryData(null);
    }
  }, [prefillEntryData, setPrefillEntryData]);

  // Load from pre-advised quick list
  const handleLoadPreAdvised = (truck: PreAdvisedTruck) => {
    setVehicleNo(truck.vehicleNo);
    setSupplierOrCustomer(truck.supplierName);
    setTransporter(truck.transporter);
    setMaterialName(truck.materialName);
    setDeclaredWeightMT(String(truck.expectedWeightMT));
    setDriverName(truck.driverName);
    setDriverMobile(truck.driverMobile);
    setDriverLicense(truck.driverLicense);
    setOriginDistrict(truck.originDistrict);
    setChallanOrLrNo(truck.challanNo);
    setEwayBillNo(truck.ewayBillNo);
    setAssignedBay(truck.assignedBay);

    if (truck.materialName.includes("Pellets")) {
      setDirection("OUTBOUND_DISPATCH");
      setVehicleType("Trailer 40ft");
    } else {
      setDirection("INBOUND_RM");
      setVehicleType("10-Wheeler Tipper");
    }
    setError(null);
  };

  const handleResetForm = () => {
    setVehicleNo("");
    setSupplierOrCustomer("");
    setTransporter("");
    setChallanOrLrNo("");
    setDriverName("");
    setDriverMobile("");
    setDriverLicense("");
    setDeclaredWeightMT("24.50");
    setDeclaredMoisture("12.5");
    setEwayBillNo("");
    setNotes("Gate inspection verified. Tarpaulin secured. Driver fit for duty.");
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNo.trim() || !supplierOrCustomer.trim() || !driverName.trim()) {
      setError("Please fill in Vehicle Registration No., Supplier/Customer, and Driver Name.");
      return;
    }

    if (!bacPassed) {
      setError("Safety violation: Driver Breathalyzer BAC 0.00% verification is mandatory before barrier clearance.");
      return;
    }

    const now = new Date();
    const arrivalTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newVehicle: GateVehicle = {
      id: `veh-${Date.now()}`,
      gateEntryNo: passSerial,
      vehicleNo: vehicleNo.trim().toUpperCase(),
      vehicleType,
      direction,
      materialName,
      materialCode: direction === "INBOUND_RM" ? "RM-BIO" : "FG-PEL",
      supplierOrCustomer: supplierOrCustomer.trim(),
      transporter: transporter.trim() || "Fleet Transport Partner",
      challanOrLrNo: challanOrLrNo.trim() || `CH-${Math.floor(Math.random() * 900000 + 100000)}`,
      driverName: driverName.trim(),
      driverMobile: driverMobile.trim() || "+91 98000 00000",
      declaredWeightMT: parseFloat(declaredWeightMT) || 24.5,
      assignedLocation,
      stage: "WAITING_WEIGHMENT",
      arrivalTime,
      elapsedMinutes: 1,
      securityOfficer: "Ramesh Pawar (Gate 1)",
      ewayBillNo: ewayBillNo.trim() || `EWB-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      notes: notes.trim(),
    };

    addVehicle(newVehicle);
    setIssuedVehicle(newVehicle);
    setIsSuccess(true);
  };

  return (
    <div className="space-y-12 md:space-y-14">
      {/* PAGE HEADER & STATION TELEMETRY */}
      <section className="bg-white border border-[#E2E8F0] p-4 sm:p-6 lg:p-8" style={{ borderRadius: 0 }}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-[#18181B] text-white" style={{ borderRadius: 0 }}>
                SECURITY ACCESS CONTROL
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold text-[#047857] border border-emerald-300 bg-emerald-50" style={{ borderRadius: 0 }}>
                BARRIER 01 · ACTIVE DESK
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                Terminal ID: <strong className="text-neutral-800">GATE-STATION-01</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A] uppercase">
              Gate Entry Registration
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-3xl leading-relaxed">
              Main security checkpoint for logging incoming raw material tippers and outgoing finished goods carriers.
              Performs preliminary consignment audit, driver safety verification, and issues automated weighbridge routing slips.
            </p>
          </div>

          {/* Telemetry Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="border border-neutral-300 bg-[#F8F9FA] px-4 py-3 min-w-[200px]" style={{ borderRadius: 0 }}>
              <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                Generated Pass Sequence
              </div>
              <div className="text-base font-extrabold text-neutral-900 tracking-tight font-mono">
                {passSerial}
              </div>
              <div className="text-[11px] text-[#059669] font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-[#059669] inline-block" />
                <span>Interlock Sync · WB-01 Ready</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-3.5 py-2.5 border border-neutral-300 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer transition-colors"
                style={{ borderRadius: 0 }}
                title="Clear current form fields"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/gate/tracker")}
                className="px-4 py-2.5 border border-neutral-800 bg-[#18181B] text-white text-xs font-semibold hover:bg-black flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                style={{ borderRadius: 0 }}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Yard Queue (8)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ERROR BANNER */}
      {error && (
        <div
          className="p-4 bg-red-50 border border-red-300 text-red-800 text-xs sm:text-sm flex items-start gap-3 shadow-sm"
          style={{ borderRadius: 0 }}
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold uppercase tracking-wider text-[11px]">Security Authorization Halted</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION MODAL */}
      <AnimatePresence>
        {isSuccess && issuedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-white border-2 border-[#18181B] p-6 sm:p-8 space-y-6 shadow-2xl"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#059669] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#059669] uppercase tracking-widest">
                      BARRIER 01 RAISED · ENTRY AUTHORIZED
                    </span>
                    <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
                      Gate Pass #{issuedVehicle.gateEntryNo}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Physical Pass Summary Card */}
              <div className="border border-neutral-300 bg-[#F8F9FA] p-4 text-xs space-y-2.5 font-mono" style={{ borderRadius: 0 }}>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">VEHICLE PLATE:</span>
                  <span className="font-bold text-neutral-900 text-sm">{issuedVehicle.vehicleNo}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">MATERIAL:</span>
                  <span className="font-semibold text-neutral-800">{issuedVehicle.materialName}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">SUPPLIER/CUSTOMER:</span>
                  <span className="font-semibold text-neutral-800">{issuedVehicle.supplierOrCustomer}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">DECLARED WEIGHT:</span>
                  <span className="font-semibold text-neutral-800">{issuedVehicle.declaredWeightMT} MT</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">ROUTED STATION:</span>
                  <span className="font-bold text-[#047857]">{issuedVehicle.assignedLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">AUTHORIZED OFFICER:</span>
                  <span className="text-neutral-700">{issuedVehicle.securityOfficer}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/gate/tracker")}
                  className="flex-1 py-3 px-4 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  style={{ borderRadius: 0 }}
                >
                  <Truck className="w-4 h-4" />
                  <span>View in Live Yard Tracker</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setIssuedVehicle(null);
                    handleResetForm();
                  }}
                  className="py-3 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Log Next Vehicle</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* LEFT COLUMN: THE COMPREHENSIVE ENTRY DESK FORM (Col span 8) */}
        <div className="lg:col-span-8 space-y-10 sm:space-y-12">
          <form onSubmit={handleSubmit} className="space-y-10 sm:space-y-12">
            {/* SECTION 01: MOVEMENT CLASSIFICATION & CARRIER PROFILE */}
            <section className="bg-white border border-[#E2E8F0] p-4 sm:p-6 lg:p-7 space-y-6" style={{ borderRadius: 0 }}>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#059669]" />
                  <h2 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900 uppercase">
                    01 / Operation & Movement Classification
                  </h2>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">MANDATORY STEP</span>
              </div>

              {/* Movement Type Radio Cards */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Operation Stream *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDirection("INBOUND_RM");
                      setMaterialName("Groundnut Shell (GS)");
                      setAssignedLocation("Weighbridge 01 (Gross)");
                      setAssignedBay("Yard A - GS Pit 01");
                    }}
                    className={`p-4 text-left border cursor-pointer font-medium transition-colors ${
                      direction === "INBOUND_RM"
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-transparent text-neutral-800 border-neutral-300 hover:bg-neutral-100"
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs uppercase tracking-wider">Inbound Raw Material (RM)</span>
                      {direction === "INBOUND_RM" && <Check className="w-4 h-4 text-[#10B981]" />}
                    </div>
                    <p className={`text-[11px] leading-relaxed ${direction === "INBOUND_RM" ? "text-neutral-300" : "text-neutral-500"}`}>
                      Biomass truck arrival from farms/suppliers for Gross Weighbridge, sampling, & pit unloading.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDirection("OUTBOUND_DISPATCH");
                      setMaterialName("Biomass Pellets 8mm (Export Grade)");
                      setAssignedLocation("Weighbridge 02 (Gross)");
                      setAssignedBay("Silo Complex 03 - Bulk Chute");
                    }}
                    className={`p-4 text-left border cursor-pointer font-medium transition-colors ${
                      direction === "OUTBOUND_DISPATCH"
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-transparent text-neutral-800 border-neutral-300 hover:bg-neutral-100"
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs uppercase tracking-wider">Outbound Dispatch (FG)</span>
                      {direction === "OUTBOUND_DISPATCH" && <Check className="w-4 h-4 text-[#10B981]" />}
                    </div>
                    <p className={`text-[11px] leading-relaxed ${direction === "OUTBOUND_DISPATCH" ? "text-neutral-300" : "text-neutral-500"}`}>
                      Commercial client trailer arrival for tare weighment, pellet silo loading, & final dispatch.
                    </p>
                  </button>
                </div>
              </div>

              {/* Carrier Vehicle Configuration */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Carrier Vehicle Configuration *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "10-Wheeler Tipper", label: "10-Wheeler Tipper", desc: "25–32 MT Bulk" },
                    { id: "12-Wheeler", label: "12-Wheeler Heavy", desc: "35–42 MT Heavy" },
                    { id: "6-Wheeler", label: "6-Wheeler Medium", desc: "12–18 MT Shuttle" },
                    { id: "Trailer 40ft", label: "Trailer 40ft", desc: "Export Container" },
                  ].map((cfg) => {
                    const isSel = vehicleType === cfg.id;
                    return (
                      <button
                        key={cfg.id}
                        type="button"
                        onClick={() => setVehicleType(cfg.id as GateVehicle["vehicleType"])}
                        className={`p-2.5 text-left border cursor-pointer transition-colors ${
                          isSel
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-neutral-50 text-neutral-800 border-neutral-300 hover:bg-neutral-100"
                        }`}
                        style={{ borderRadius: 0 }}
                      >
                        <div className="font-bold text-xs">{cfg.label}</div>
                        <div className={`text-[10px] ${isSel ? "text-neutral-400" : "text-neutral-500"}`}>{cfg.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 02: VEHICLE & TRANSPORTER CREDENTIALS */}
            <section className="bg-white border border-[#E2E8F0] p-4 sm:p-6 lg:p-7 space-y-6" style={{ borderRadius: 0 }}>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#059669]" />
                  <h2 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900 uppercase">
                    02 / Vehicle & Transporter Credentials
                  </h2>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">ANPR VERIFIED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* License Plate Input with Indian Plate Replica Badge */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Vehicle Registration Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                      placeholder="e.g. MH 09 CW 3319"
                      className="w-full bg-white border border-neutral-300 px-3 py-2.5 text-neutral-900 font-bold text-sm tracking-wider uppercase focus:outline-none focus:border-neutral-900"
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                  {/* Live Visual License Plate Preview */}
                  {vehicleNo && (
                    <div className="inline-flex items-center border border-neutral-800 bg-[#FEF08A] text-neutral-900 px-2.5 py-1 text-xs font-mono font-black tracking-widest mt-1 shadow-xs" style={{ borderRadius: 0 }}>
                      <span className="bg-[#1E40AF] text-white px-1 text-[9px] font-sans mr-2">IND</span>
                      <span>{vehicleNo}</span>
                    </div>
                  )}
                </div>

                {/* Transporter / Agency */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Transporter / Logistics Agency *
                  </label>
                  <input
                    type="text"
                    required
                    value={transporter}
                    onChange={(e) => setTransporter(e.target.value)}
                    placeholder="e.g. Sahyadri Logistics Fleet"
                    className="w-full bg-white border border-neutral-300 px-3 py-2.5 text-neutral-900 text-xs focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                  <div className="flex gap-1.5 flex-wrap pt-1">
                    {["Sahyadri Logistics", "Nagpur Express", "Direct Farmer"].map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setTransporter(name)}
                        className="text-[10px] text-neutral-600 hover:text-neutral-900 border border-neutral-300 px-1.5 py-0.5 bg-neutral-50 cursor-pointer"
                        style={{ borderRadius: 0 }}
                      >
                        +{name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Challan & e-Way Bill & RFID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Challan / LR Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={challanOrLrNo}
                    onChange={(e) => setChallanOrLrNo(e.target.value)}
                    placeholder="e.g. CH-982104"
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    e-Way Bill Number (12 Digit)
                  </label>
                  <input
                    type="text"
                    value={ewayBillNo}
                    onChange={(e) => setEwayBillNo(e.target.value)}
                    placeholder="e.g. EWB-2610-8472-1092"
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                  {ewayBillNo && (
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Active GSTIN Verified
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    RFID Windshield Tag ID
                  </label>
                  <input
                    type="text"
                    value={rfidTag}
                    onChange={(e) => setRfidTag(e.target.value)}
                    placeholder="e.g. TAG-MH12-9982"
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>
            </section>

            {/* SECTION 03: CONSIGNMENT & MATERIAL SPECIFICATIONS */}
            <section className="bg-white border border-[#E2E8F0] p-4 sm:p-6 lg:p-7 space-y-6" style={{ borderRadius: 0 }}>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#059669]" />
                  <h2 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900 uppercase">
                    03 / Consignment & Material Specifications
                  </h2>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">QC PRE-ALLOCATION</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Material Selection */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Material / Cargo Selection *
                  </label>
                  {direction === "INBOUND_RM" ? (
                    <select
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-3 py-2.5 text-neutral-900 font-semibold text-xs focus:outline-none focus:border-neutral-900 cursor-pointer"
                      style={{ borderRadius: 0 }}
                    >
                      <option value="Groundnut Shell (GS)">Groundnut Shell (GS) · High Calorific</option>
                      <option value="Sawdust Fine (SD)">Sawdust Fine (SD) · Timber Residue</option>
                      <option value="Bagasse Dry Bale (BG)">Bagasse Dry Bale (BG) · Sugar Mill Bale</option>
                      <option value="Cotton Stalk Shredded (CS)">Cotton Stalk Shredded (CS)</option>
                      <option value="Paddy Straw Chopped (PS)">Paddy Straw Chopped (PS)</option>
                      <option value="Mustard Stalk (MS)">Mustard Stalk (MS)</option>
                    </select>
                  ) : (
                    <select
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-3 py-2.5 text-neutral-900 font-semibold text-xs focus:outline-none focus:border-neutral-900 cursor-pointer"
                      style={{ borderRadius: 0 }}
                    >
                      <option value="Biomass Pellets 8mm (Export Grade)">Biomass Pellets 8mm (Export Grade - GCV 4200+)</option>
                      <option value="Biomass Pellets 8mm (Standard)">Biomass Pellets 8mm (Standard Industrial Grade)</option>
                      <option value="Biomass Briquettes 90mm">Biomass Briquettes 90mm (High Density)</option>
                    </select>
                  )}
                </div>

                {/* Supplier or Customer */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    {direction === "INBOUND_RM" ? "Supplier / Farmer Name *" : "Customer Consignee Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={supplierOrCustomer}
                    onChange={(e) => setSupplierOrCustomer(e.target.value)}
                    placeholder={direction === "INBOUND_RM" ? "e.g. Kolhapur Agro Biomass Union" : "e.g. UltraTech Cement Ltd"}
                    className="w-full bg-white border border-neutral-300 px-3 py-2.5 text-neutral-900 text-xs focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              {/* Weights, Moisture, Origin District, Storage Bay */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Declared Weight (MT) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={declaredWeightMT}
                    onChange={(e) => setDeclaredWeightMT(e.target.value)}
                    placeholder="24.50"
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 font-bold text-xs font-mono focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Estimated Moisture %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={declaredMoisture}
                    onChange={(e) => setDeclaredMoisture(e.target.value)}
                    placeholder="12.5"
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Origin District / Belt
                  </label>
                  <input
                    type="text"
                    value={originDistrict}
                    onChange={(e) => setOriginDistrict(e.target.value)}
                    placeholder="e.g. Kolhapur"
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Target Unloading Bay
                  </label>
                  <select
                    value={assignedBay}
                    onChange={(e) => setAssignedBay(e.target.value)}
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-900 cursor-pointer"
                    style={{ borderRadius: 0 }}
                  >
                    <option value="Yard A - GS Pit 01">Yard A - GS Pit 01</option>
                    <option value="Yard B - Sawdust Shed 02">Yard B - Sawdust Shed 02</option>
                    <option value="Yard C - Bagasse Bales">Yard C - Bagasse Bales</option>
                    <option value="Silo Complex 03 - Bulk Chute">Silo Complex 03 - Bulk Chute</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 04: DRIVER IDENTITY & MANDATORY SAFETY AUDIT */}
            <section className="bg-white border border-[#E2E8F0] p-4 sm:p-6 lg:p-7 space-y-6" style={{ borderRadius: 0 }}>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#059669]" />
                  <h2 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900 uppercase">
                    04 / Driver Identity & Safety Compliance Audit
                  </h2>
                </div>
                <span className="text-[11px] text-[#047857] font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  PLANT SAFETY STANDARD EHS-01
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Driver Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g. Sanjay Mane"
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Driver Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={driverMobile}
                    onChange={(e) => setDriverMobile(e.target.value)}
                    placeholder="+91 98220 11942"
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Driving License (DL) Number
                  </label>
                  <input
                    type="text"
                    value={driverLicense}
                    onChange={(e) => setDriverLicense(e.target.value)}
                    placeholder="MH-09-2017-004812"
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 text-xs font-mono focus:outline-none focus:border-neutral-900"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              {/* Safety Compliance Checkboxes */}
              <div className="border border-neutral-200 bg-[#F8F9FA] p-4 space-y-3" style={{ borderRadius: 0 }}>
                <div className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                  Mandatory Physical Barrier Verification Checkpoints:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bacPassed}
                      onChange={(e) => setBacPassed(e.target.checked)}
                      className="w-4 h-4 accent-[#059669] cursor-pointer"
                    />
                    <span className="text-neutral-800 font-medium">
                      Breathalyzer Test: <strong>0.00% BAC Passed</strong>
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={helmetChecked}
                      onChange={(e) => setHelmetChecked(e.target.checked)}
                      className="w-4 h-4 accent-[#059669] cursor-pointer"
                    />
                    <span className="text-neutral-800 font-medium">
                      Safety Helmet (Hard Hat) Verified
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shoesVestChecked}
                      onChange={(e) => setShoesVestChecked(e.target.checked)}
                      className="w-4 h-4 accent-[#059669] cursor-pointer"
                    />
                    <span className="text-neutral-800 font-medium">
                      Safety Shoes & High-Vis Vest Verified
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tarpChecked}
                      onChange={(e) => setTarpChecked(e.target.checked)}
                      className="w-4 h-4 accent-[#059669] cursor-pointer"
                    />
                    <span className="text-neutral-800 font-medium">
                      Cargo Tarpaulin Tied & Intact
                    </span>
                  </label>
                </div>
              </div>
            </section>

            {/* SECTION 05: WEIGHBRIDGE ROUTING & INSPECTION NOTES */}
            <section className="bg-white border border-[#E2E8F0] p-4 sm:p-6 lg:p-7 space-y-6" style={{ borderRadius: 0 }}>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#059669]" />
                  <h2 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900 uppercase">
                    05 / Gate Interlock & Weighbridge Routing
                  </h2>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">AUTOMATED SCALE ALLOCATION</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Assigned Scale Station *
                  </label>
                  <select
                    value={assignedLocation}
                    onChange={(e) => setAssignedLocation(e.target.value)}
                    className="w-full bg-white border border-neutral-300 px-3 py-2.5 text-neutral-900 font-bold text-xs focus:outline-none focus:border-neutral-900 cursor-pointer"
                    style={{ borderRadius: 0 }}
                  >
                    <option value="Weighbridge 01 (Gross)">Weighbridge 01 (Gross Scale · Primary)</option>
                    <option value="Weighbridge 02 (Gross)">Weighbridge 02 (Gross Scale · High Capacity)</option>
                    <option value="Holding Yard 01">Holding Yard 01 (Queue Overflow)</option>
                  </select>
                  <p className="text-[10px] text-neutral-500">
                    Gross weight slip will auto-link to this pass upon truck axle positioning.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Authorizing Gate Security Officer
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Ramesh Pawar (Gate 01 Post · Shift 1)"
                    className="w-full bg-[#F4F5F7] border border-neutral-300 px-3 py-2.5 text-neutral-700 text-xs font-semibold select-none cursor-not-allowed"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                  Gate Officer Physical Inspection Observations
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Note any physical cargo damage, missing seals, or moisture remarks..."
                  className="w-full bg-white border border-neutral-300 p-3 text-neutral-900 text-xs focus:outline-none focus:border-neutral-900"
                  style={{ borderRadius: 0 }}
                />
              </div>

              {/* ACTION BUTTON BAR (Inside form) */}
              <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-[11px] text-neutral-500">
                  Pressing Authorize will log pass, transmit to WB-01, and raise Barrier 01.
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2.5 border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-100 cursor-pointer transition-colors"
                    style={{ borderRadius: 0 }}
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                    style={{ borderRadius: 0 }}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Authorize Entry & Open Barrier 01</span>
                  </button>
                </div>
              </div>
            </section>
          </form>
        </div>

        {/* RIGHT COLUMN: GATE PASS PREVIEW & PRE-ADVISED ARRIVALS QUEUE (Col span 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* CARD 1: LIVE THERMAL GATE PASS PREVIEW (Zero-radius Industrial Receipt) */}
          <div className="bg-white border-2 border-neutral-900 p-5 space-y-4 shadow-sm" style={{ borderRadius: 0 }}>
            <div className="text-center border-b border-dashed border-neutral-300 pb-3 space-y-1">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
                THERMAL BARCODE PASS REPLICA
              </span>
              <h3 className="text-sm font-extrabold text-neutral-900 tracking-tight uppercase">
                BHARAT INDUSTRIAL & RENEWABLES LLP
              </h3>
              <p className="text-[10px] text-neutral-500 font-mono">
                PLANT GATE 01 · SECURITY ENTRY PASS
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-500">PASS NO:</span>
                <span className="font-bold text-neutral-900">{passSerial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">VEHICLE:</span>
                <span className="font-bold text-neutral-900">
                  {vehicleNo || "MH -- -- ----"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">TYPE:</span>
                <span className="text-neutral-800">{vehicleType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">STREAM:</span>
                <span className="font-semibold text-neutral-900">
                  {direction === "INBOUND_RM" ? "INWARD RM" : "OUTWARD FG"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">MATERIAL:</span>
                <span className="text-neutral-800 truncate max-w-[170px]" title={materialName}>
                  {materialName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">SUPPLIER:</span>
                <span className="text-neutral-800 truncate max-w-[170px]" title={supplierOrCustomer}>
                  {supplierOrCustomer || "---"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">DECLARED MT:</span>
                <span className="font-bold text-neutral-900">{declaredWeightMT} MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">ASSIGNED:</span>
                <span className="font-bold text-[#047857]">{assignedLocation}</span>
              </div>
            </div>

            {/* Simulated Barcode */}
            <div className="pt-3 border-t border-dashed border-neutral-300 text-center space-y-1">
              <div className="h-9 bg-neutral-900 w-full flex items-center justify-around px-2 py-1 select-none">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span
                    key={i}
                    className={`inline-block h-full bg-white ${
                      i % 3 === 0 ? "w-1" : i % 5 === 0 ? "w-1.5" : "w-0.5"
                    }`}
                  />
                ))}
              </div>
              <div className="text-[10px] text-neutral-500 font-mono tracking-widest">
                *{passSerial}*
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2 border border-neutral-300 bg-[#F8F9FA] hover:bg-neutral-200 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                style={{ borderRadius: 0 }}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Test Thermal Print (80mm)</span>
              </button>
            </div>
          </div>

          {/* CARD 2: PRE-ADVISED ARRIVALS QUICK-FILL */}
          <div className="bg-white border border-[#E2E8F0] p-4 sm:p-5 space-y-3" style={{ borderRadius: 0 }}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#059669]" />
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-tight">
                  Pre-Advised Inbound Roster
                </h4>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">4 IN ROSTER</span>
            </div>

            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Trucks scheduled by logistics. Click <strong>Auto-Fill</strong> to populate the desk form instantly.
            </p>

            <div className="space-y-2">
              {PRE_ADVISED_TRUCKS.map((truck) => (
                <div
                  key={truck.id}
                  className="border border-neutral-200 p-3 hover:border-neutral-400 bg-[#F8F9FA] transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-xs text-neutral-900 font-mono block">
                        {truck.vehicleNo}
                      </span>
                      <span className="text-[11px] text-neutral-600 font-medium block truncate max-w-[190px]">
                        {truck.supplierName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLoadPreAdvised(truck)}
                      className="px-2 py-1 bg-[#18181B] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors shrink-0"
                      style={{ borderRadius: 0 }}
                    >
                      Auto-Fill
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-2 pt-2 border-t border-neutral-200">
                    <span>{truck.materialName} ({truck.expectedWeightMT} MT)</span>
                    <span className="font-semibold text-emerald-700">{truck.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 3: HARDWARE & SENSOR INTERLOCKS */}
          <div className="bg-white border border-[#E2E8F0] p-4 sm:p-5 space-y-3" style={{ borderRadius: 0 }}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#059669]" />
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-tight">
                  Gate Hardware Telemetry
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                ALL SYSTEMS READY
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-600">Boom Barrier 01:</span>
                <span className="font-bold text-neutral-900">LOCKED (Manual Keys #04)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-600">ANPR Cam 01 (Plate OCR):</span>
                <span className="font-bold text-emerald-700">ONLINE · 1080P</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-600">Weighbridge 01 Interlock:</span>
                <span className="font-bold text-emerald-700">SYNCED · ZERO ZERO</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-600">RFID Windshield Antennas:</span>
                <span className="font-bold text-neutral-800">ACTIVE CH 01/02</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
