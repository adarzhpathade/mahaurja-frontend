"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LogOut,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Scale,
  Clock,
  Printer,
  ShieldCheck,
  Check,
  X,
  FileText,
  User,
  Phone,
  Camera,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  Lock,
  Unlock,
  Radio,
  Sparkles,
  QrCode,
  Building,
  Calendar,
} from "lucide-react";
import { GateVehicle, ExitClearanceRecord, VehicleDirection, GateStage } from "@/lib/types/gate";
import { INITIAL_DEPARTED_VEHICLES } from "@/lib/data/mock-gate-vehicles";

interface GateExitProps {
  vehicles: GateVehicle[];
  onUpdateStage: (vehicleId: string, newStage: GateStage) => void;
  onNavigateTab: (tabId: string) => void;
}

export function GateExit({ vehicles, onUpdateStage, onNavigateTab }: GateExitProps) {
  // Live IST Clock
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter and Search states
  const [activeTab, setActiveTab] = useState<"QUEUE" | "ALL_INSIDE" | "DEPARTED">("QUEUE");
  const [directionFilter, setDirectionFilter] = useState<"ALL" | VehicleDirection>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Barrier Status State
  const [barrierState, setBarrierState] = useState<"LOWERED" | "RAISED" | "AUTO_CYCLE">("LOWERED");
  const [barrierMessage, setBarrierMessage] = useState<string | null>(null);

  // Departed Log State
  const [departedLog, setDepartedLog] = useState<ExitClearanceRecord[]>(INITIAL_DEPARTED_VEHICLES);

  // Selected Vehicle for Exit Inspection Modal
  const [selectedVehicleForExit, setSelectedVehicleForExit] = useState<GateVehicle | null>(null);

  // Checklist state for active inspection
  const [checklist, setChecklist] = useState({
    weighbridgeSlipVerified: false,
    cargoBedInspected: false,
    breathalyzerZeroBAC: false,
    gatePassDuplicateRetained: false,
  });
  const [guardNotes, setGuardNotes] = useState("");

  // Completed Exit Pass Modal
  const [activeExitPass, setActiveExitPass] = useState<ExitClearanceRecord | null>(null);

  // Manual Barrier Modal
  const [isBarrierOverrideModalOpen, setIsBarrierOverrideModalOpen] = useState(false);

  // Filter vehicles ready for exit: stage is CLEARED_EXIT or TARE_WEIGHED
  const exitQueueVehicles = useMemo(() => {
    return vehicles.filter(
      (v) => v.stage === "CLEARED_EXIT" || v.stage === "TARE_WEIGHED"
    );
  }, [vehicles]);

  // Filtered list based on active tab & query
  const displayedVehicles = useMemo(() => {
    let list: GateVehicle[] = [];
    if (activeTab === "QUEUE") {
      list = exitQueueVehicles;
    } else if (activeTab === "ALL_INSIDE") {
      list = vehicles.filter((v) => v.stage !== "EXIT_COMPLETED");
    }

    return list.filter((v) => {
      if (directionFilter !== "ALL" && v.direction !== directionFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          v.vehicleNo.toLowerCase().includes(q) ||
          v.gateEntryNo.toLowerCase().includes(q) ||
          v.driverName.toLowerCase().includes(q) ||
          v.transporter.toLowerCase().includes(q) ||
          v.materialName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [vehicles, exitQueueVehicles, activeTab, directionFilter, searchQuery]);

  // Filtered departed log
  const filteredDepartedLog = useMemo(() => {
    return departedLog.filter((item) => {
      if (directionFilter !== "ALL" && item.direction !== directionFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.vehicleNo.toLowerCase().includes(q) ||
          item.exitPassNo.toLowerCase().includes(q) ||
          item.gateEntryNo.toLowerCase().includes(q) ||
          item.driverName.toLowerCase().includes(q) ||
          item.materialName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [departedLog, directionFilter, searchQuery]);

  // Check if all checklist items are ticked
  const isInspectionComplete =
    checklist.weighbridgeSlipVerified &&
    checklist.cargoBedInspected &&
    checklist.breathalyzerZeroBAC &&
    checklist.gatePassDuplicateRetained;

  // Open inspection modal
  const handleOpenInspection = (vehicle: GateVehicle) => {
    setSelectedVehicleForExit(vehicle);
    setChecklist({
      weighbridgeSlipVerified: true, // Default to true if tare already recorded
      cargoBedInspected: false,
      breathalyzerZeroBAC: false,
      gatePassDuplicateRetained: false,
    });
    setGuardNotes(
      vehicle.direction === "INBOUND_RM"
        ? "Empty trailer bed inspected clean. No residual biomass. Weighbridge slip verified."
        : `Tarpaulin lashed securely. Security seal #${vehicle.sealNo || "BIR-9821"} intact.`
    );
  };

  const handleSelectAllChecks = () => {
    setChecklist({
      weighbridgeSlipVerified: true,
      cargoBedInspected: true,
      breathalyzerZeroBAC: true,
      gatePassDuplicateRetained: true,
    });
  };

  // Authorize vehicle exit and raise barrier
  const handleAuthorizeExit = () => {
    if (!selectedVehicleForExit) return;

    const vehicle = selectedVehicleForExit;
    const now = new Date();
    const timeOutStr = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const exitPassNo = `EXT-261003-${String(departedLog.length + 1).padStart(3, "0")}`;

    const gross = vehicle.grossWeightMT || (vehicle.declaredWeightMT + 12.0);
    const tare = vehicle.tareWeightMT || 11.5;
    const net = Number(Math.abs(gross - tare).toFixed(2));

    const newRecord: ExitClearanceRecord = {
      id: `ext-${Date.now()}`,
      vehicleId: vehicle.id,
      exitPassNo,
      gateEntryNo: vehicle.gateEntryNo,
      vehicleNo: vehicle.vehicleNo,
      direction: vehicle.direction,
      materialName: vehicle.materialName,
      supplierOrCustomer: vehicle.supplierOrCustomer,
      driverName: vehicle.driverName,
      transporter: vehicle.transporter,
      grossWeightMT: gross,
      tareWeightMT: tare,
      netWeightMT: net,
      weighbridgeSlipNo: vehicle.weighbridgeSlipNo || `WB-261003-${String(Math.floor(Math.random() * 80) + 20)}`,
      timeIn: vehicle.arrivalTime,
      timeOut: timeOutStr,
      turnaroundMinutes: vehicle.elapsedMinutes + 12,
      clearedBy: "Ramesh Pawar (Gate 2)",
      sealNo: vehicle.sealNo || (vehicle.direction === "OUTBOUND_DISPATCH" ? "BIR-9821" : undefined),
      notes: guardNotes,
    };

    // Update vehicle stage to EXIT_COMPLETED
    onUpdateStage(vehicle.id, "EXIT_COMPLETED");

    // Add to departed log
    setDepartedLog((prev) => [newRecord, ...prev]);

    // Simulate barrier raising
    setBarrierState("RAISED");
    setBarrierMessage(`Boom Barrier 02 Raised · ${vehicle.vehicleNo} Cleared for Exit`);

    setTimeout(() => {
      setBarrierState("LOWERED");
      setBarrierMessage(null);
    }, 4500);

    // Close inspection and open official pass modal
    setSelectedVehicleForExit(null);
    setActiveExitPass(newRecord);
  };

  // Manual barrier toggle
  const handleToggleBarrierOverride = (action: "RAISE" | "LOWER") => {
    if (action === "RAISE") {
      setBarrierState("RAISED");
      setBarrierMessage("Manual Override: Boom Barrier 02 RAISED (Safety auto-lower in 20s)");
      setTimeout(() => {
        setBarrierState("LOWERED");
        setBarrierMessage(null);
      }, 20000);
    } else {
      setBarrierState("LOWERED");
      setBarrierMessage("Boom Barrier 02 LOWERED & LOCKED.");
      setTimeout(() => setBarrierMessage(null), 3000);
    }
    setIsBarrierOverrideModalOpen(false);
  };

  return (
    <div className="w-full space-y-8 sm:space-y-10 select-none">
      {/* ========================================================================= */}
      {/* 1. COMPACT COMMAND HEADER                                                 */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Vehicle Exit Station
        </h1>
      </div>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME OPERATIONAL METRICS (4 CLICKABLE CARDS)                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* KPI 1: Ready for Exit */}
        <div
          onClick={() => setActiveTab("QUEUE")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors truncate">
            Ready for Exit
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {exitQueueVehicles.length}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Vehicles</span>
          </div>
        </div>

        {/* KPI 2: Departed Today */}
        <div
          onClick={() => setActiveTab("DEPARTED")}
          className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between"
        >
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors truncate">
            Departed Today
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {departedLog.length}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Completed</span>
          </div>
        </div>

        {/* KPI 3: Avg Turnaround */}
        <div className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors truncate">
            Avg Turnaround
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              36
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-medium">Mins</span>
          </div>
        </div>

        {/* KPI 4: Security Compliance */}
        <div className="border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-900 transition-colors truncate">
            Compliance
          </span>
          <div className="mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              100%
            </span>
            <span className="text-xs sm:text-sm text-[#059669] font-medium">Zero breach</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. QUICK ACTION BUTTONS                                                   */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full">
        <button
          type="button"
          onClick={() => setIsBarrierOverrideModalOpen(true)}
          className="h-11 sm:h-10 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Radio className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Override Barrier</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab("live-tracker")}
          className="h-11 sm:h-10 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Truck className="w-4 h-4 text-neutral-600 shrink-0" />
          <span>Fleet Tracker</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab("home")}
          className="h-11 sm:h-10 px-5 bg-[#18181B] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs w-full sm:w-auto"
        >
          <span>Operations Hub</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. LIVE BOOM BARRIER STATUS                                               */}
      {/* ========================================================================= */}
      <div className="border border-neutral-300 bg-white p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 shrink-0 ${
              barrierState === "RAISED"
                ? "bg-[#10B981] animate-ping"
                : "bg-neutral-900"
            }`}
          />
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-neutral-900 uppercase tracking-wide">
              Boom Barrier 02:
            </span>
            <span
              className={`font-semibold px-2 py-0.5 border text-xs ${
                barrierState === "RAISED"
                  ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                  : "bg-neutral-100 text-neutral-800 border-neutral-300"
              }`}
            >
              {barrierState === "RAISED"
                ? "RAISED · PASSING"
                : "LOWERED · LOCKED"}
            </span>
            {barrierMessage && (
              <span className="text-xs font-bold text-[#059669] animate-pulse">
                ● {barrierMessage}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
            <span>ANPR CAM-04: <strong className="text-neutral-800 font-semibold">ONLINE (99.4%)</strong></span>
          </span>
          <span className="hidden sm:inline text-neutral-300">|</span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
            <span>Officer: <strong className="text-neutral-800 font-semibold">Ramesh Pawar (#SEC-014)</strong></span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. EXIT QUEUE & REGISTRY                                                  */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-3 sm:pt-6">
        {/* Section Heading */}
        <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900">
            Exit Queue & Registry
          </h2>
          <div className="text-xs font-semibold text-neutral-500">
            {activeTab === "DEPARTED"
              ? `${filteredDepartedLog.length} departures logged`
              : `${displayedVehicles.length} in view`}
          </div>
        </div>

        <div
          className="border-0 p-0 bg-transparent space-y-3 sm:bg-white sm:border sm:border-neutral-300 sm:p-4 sm:space-y-4"
          style={{ borderRadius: 0 }}
        >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          {/* Main View Tabs (Scrollable on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full md:flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab("QUEUE")}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap ${
                activeTab === "QUEUE"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
              }`}
              style={{ borderRadius: 0 }}
            >
              <span>Ready for Exit</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  activeTab === "QUEUE"
                    ? "bg-[#059669] text-white"
                    : "bg-neutral-200 text-neutral-800"
                }`}
              >
                {exitQueueVehicles.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ALL_INSIDE")}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap ${
                activeTab === "ALL_INSIDE"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
              }`}
              style={{ borderRadius: 0 }}
            >
              <span>All Active In-Plant</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  activeTab === "ALL_INSIDE"
                    ? "bg-neutral-700 text-white"
                    : "bg-neutral-200 text-neutral-800"
                }`}
              >
                {vehicles.filter((v) => v.stage !== "EXIT_COMPLETED").length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("DEPARTED")}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap ${
                activeTab === "DEPARTED"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
              }`}
              style={{ borderRadius: 0 }}
            >
              <span>Departed Today</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  activeTab === "DEPARTED"
                    ? "bg-neutral-700 text-white"
                    : "bg-neutral-200 text-neutral-800"
                }`}
              >
                {departedLog.length}
              </span>
            </button>
          </div>

          {/* Direction Filter Pills (PC Only) */}
          <div className="hidden sm:flex items-center gap-1 border border-neutral-300 p-0.5 bg-neutral-50 overflow-x-auto shrink-0 self-start md:self-auto">
            {(["ALL", "INBOUND_RM", "OUTBOUND_DISPATCH"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => setDirectionFilter(dir)}
                className={`px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                  directionFilter === dir
                    ? "bg-[#18181B] text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
                style={{ borderRadius: 0 }}
              >
                {dir === "ALL"
                  ? "All Movements"
                  : dir === "INBOUND_RM"
                  ? "RM Inbound"
                  : "FG Outbound"}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar - Full Width on Mobile */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Vehicle Plate (e.g. MH 20), Gate Pass #, Driver Name, Transporter, or Material..."
            className="w-full h-11 sm:h-10 pl-9.5 pr-4 border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
            style={{ borderRadius: 0 }}
          />
        </div>
      </div>
    </div>

      {/* 
        ============================================================
        4. ACTIVE VEHICLES / DEPARTED AUDIT TABLE CONTENT
        ============================================================
      */}
      {activeTab === "DEPARTED" ? (
        /* Departed Vehicles Audit History */
        <section
          className="bg-white border-0 sm:border border-neutral-300 overflow-hidden"
          style={{ borderRadius: 0 }}
        >
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Departed Vehicles Audit Trail (Shift 01)
              </h2>
            </div>
            <div className="text-xs font-semibold text-neutral-600">
              Showing {filteredDepartedLog.length} of {departedLog.length} records
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Exit Pass #</th>
                  <th className="py-2.5 px-3">Vehicle No</th>
                  <th className="py-2.5 px-3">Direction</th>
                  <th className="py-2.5 px-3">Material & Consignor/Consignee</th>
                  <th className="py-2.5 px-3">Driver / Transporter</th>
                  <th className="py-2.5 px-3 text-right">Tare MT</th>
                  <th className="py-2.5 px-3 text-right">Net MT</th>
                  <th className="py-2.5 px-3">Time In / Out</th>
                  <th className="py-2.5 px-3">Turnaround</th>
                  <th className="py-2.5 px-3">Cleared By</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredDepartedLog.map((record) => (
                  <tr key={record.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-neutral-900 tabular-nums">
                      {record.exitPassNo}
                      <div className="text-[10px] text-neutral-500 font-normal">{record.gateEntryNo}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-neutral-900 text-xs px-2 py-0.5 border border-neutral-300 bg-neutral-50">
                        {record.vehicleNo}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                          record.direction === "INBOUND_RM"
                            ? "bg-neutral-50 text-neutral-800 border-neutral-300"
                            : "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                        }`}
                      >
                        {record.direction === "INBOUND_RM" ? "INBOUND RM" : "OUTBOUND FG"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-neutral-900">{record.materialName}</div>
                      <div className="text-[11px] text-neutral-500">{record.supplierOrCustomer}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-neutral-800">{record.driverName}</div>
                      <div className="text-[10px] text-neutral-500">{record.transporter}</div>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-semibold text-neutral-700">
                      {record.tareWeightMT.toFixed(2)} MT
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-[#059669]">
                      {record.netWeightMT.toFixed(2)} MT
                    </td>
                    <td className="py-3 px-3 tabular-nums text-neutral-700">
                      {record.timeIn} → <strong>{record.timeOut}</strong>
                    </td>
                    <td className="py-3 px-3 tabular-nums text-neutral-700">
                      {record.turnaroundMinutes} min
                    </td>
                    <td className="py-3 px-3 text-[11px] text-neutral-600">
                      {record.clearedBy}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveExitPass(record)}
                        className="px-2.5 py-1 text-[11px] font-semibold border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 cursor-pointer transition-colors inline-flex items-center gap-1"
                        style={{ borderRadius: 0 }}
                      >
                        <Printer className="w-3 h-3 text-neutral-600" />
                        <span>View Pass</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredDepartedLog.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-xs text-neutral-500">
                      No departed vehicle records match your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        /* Vehicles Ready for Exit or In-Plant Grid */
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <div>
              {activeTab === "QUEUE" ? (
                <span>
                  Showing <strong>{displayedVehicles.length}</strong> vehicles ready for exit verification
                </span>
              ) : (
                <span>
                  Showing <strong>{displayedVehicles.length}</strong> active vehicles currently inside plant
                </span>
              )}
            </div>
            {activeTab === "QUEUE" && displayedVehicles.length > 0 && (
              <span className="text-[11px] text-[#059669] font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Tare weighment completed · Ready for barrier clearance
              </span>
            )}
          </div>

          {displayedVehicles.length === 0 ? (
            <div
              className="bg-white border border-neutral-300 p-12 text-center space-y-3"
              style={{ borderRadius: 0 }}
            >
              <div className="w-12 h-12 mx-auto bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-500">
                <CheckCircle2 className="w-6 h-6 text-[#059669]" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">
                {activeTab === "QUEUE"
                  ? "Exit Queue is Currently Empty"
                  : "No In-Plant Vehicles Match Search"}
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                {activeTab === "QUEUE"
                  ? "All vehicles that have completed weighment have departed the facility. As newly unloaded or loaded trucks finish Tare weighment at WB-01/WB-02, they will appear here automatically."
                  : "Try clearing your search query or switching filter tabs."}
              </p>
              {activeTab === "QUEUE" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("ALL_INSIDE")}
                  className="px-4 py-2 border border-neutral-300 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  View All Active In-Plant Vehicles
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayedVehicles.map((vehicle) => {
                const isReady =
                  vehicle.stage === "CLEARED_EXIT" || vehicle.stage === "TARE_WEIGHED";
                const isRM = vehicle.direction === "INBOUND_RM";
                const grossWeight = vehicle.grossWeightMT || (vehicle.declaredWeightMT + 12.0);
                const tareWeight = vehicle.tareWeightMT || 11.5;
                const netWeight = Math.abs(grossWeight - tareWeight);

                return (
                  <div
                    key={vehicle.id}
                    className={`bg-white border transition-all flex flex-col justify-between ${
                      isReady
                        ? "border-neutral-400 hover:border-neutral-800"
                        : "border-neutral-300 opacity-90"
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    {/* Card Header */}
                    <div className="p-4 border-b border-neutral-200">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        {/* Vehicle Number Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className="font-bold text-sm tracking-tight text-neutral-900 px-2 py-0.5 border border-neutral-400 bg-neutral-50"
                            style={{ borderRadius: 0 }}
                          >
                            {vehicle.vehicleNo}
                          </span>
                          <span className="text-[10px] text-neutral-600 font-medium">
                            {vehicle.vehicleType}
                          </span>
                        </div>

                        {/* Direction Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 border ${
                            isRM
                              ? "bg-neutral-100 text-neutral-800 border-neutral-300"
                              : "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                          }`}
                          style={{ borderRadius: 0 }}
                        >
                          {isRM ? "INBOUND RM" : "OUTBOUND FG"}
                        </span>
                      </div>

                      {/* Material & Consignor / Consignee */}
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-neutral-900">
                          {vehicle.materialName}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate">
                          {vehicle.supplierOrCustomer}
                        </div>
                      </div>
                    </div>

                    {/* Card Body: Driver & Logistics Data */}
                    <div className="p-4 space-y-3 bg-neutral-50/50 flex-1">
                      {/* Driver & Pass Numbers */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-semibold">
                            Gate Pass ID
                          </span>
                          <span className="font-bold text-neutral-800 tabular-nums">
                            {vehicle.gateEntryNo}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-semibold">
                            Transporter
                          </span>
                          <span className="text-neutral-800 truncate block">
                            {vehicle.transporter}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-semibold">
                            Driver
                          </span>
                          <span className="text-neutral-800">
                            {vehicle.driverName}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-semibold">
                            Time Inside
                          </span>
                          <span className="font-semibold text-neutral-900 tabular-nums flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-500" />
                            {vehicle.elapsedMinutes} mins
                          </span>
                        </div>
                      </div>

                      {/* Weighbridge Tare / Gross Block */}
                      <div className="p-2.5 bg-white border border-neutral-300 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-neutral-500 border-b border-neutral-200 pb-1">
                          <span className="font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1">
                            <Scale className="w-3 h-3 text-neutral-600" />
                            Weighment Reconciliation
                          </span>
                          <span className="tabular-nums font-semibold text-neutral-700">
                            {vehicle.weighbridgeSlipNo || "WB-SLIP-PENDING"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 text-center pt-0.5">
                          <div className="bg-neutral-50 p-1 border border-neutral-200">
                            <div className="text-[9px] uppercase text-neutral-500">Gross</div>
                            <div className="text-xs font-bold text-neutral-800 tabular-nums">
                              {grossWeight.toFixed(2)} MT
                            </div>
                          </div>
                          <div className="bg-neutral-50 p-1 border border-neutral-200">
                            <div className="text-[9px] uppercase text-neutral-500">Tare</div>
                            <div className="text-xs font-bold text-neutral-800 tabular-nums">
                              {tareWeight.toFixed(2)} MT
                            </div>
                          </div>
                          <div className="bg-[#ECFDF5] p-1 border border-[#A7F3D0]">
                            <div className="text-[9px] uppercase text-[#059669] font-bold">Net</div>
                            <div className="text-xs font-extrabold text-[#059669] tabular-nums">
                              {netWeight.toFixed(2)} MT
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Current Stage Indicator */}
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-neutral-500">Plant Status:</span>
                        <span
                          className={`font-semibold px-2 py-0.5 text-[10px] border ${
                            isReady
                              ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                              : "bg-neutral-100 text-neutral-700 border-neutral-300"
                          }`}
                        >
                          {vehicle.stage === "CLEARED_EXIT"
                            ? "CLEARED FOR EXIT"
                            : vehicle.stage === "TARE_WEIGHED"
                            ? "TARE WEIGHED (WB-01)"
                            : vehicle.stage.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>

                    {/* Card Footer: Action Buttons */}
                    <div className="p-3 border-t border-neutral-200 bg-white">
                      {isReady ? (
                        <button
                          type="button"
                          onClick={() => handleOpenInspection(vehicle)}
                          className="w-full py-2.5 px-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                          style={{ borderRadius: 0 }}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify & Authorize Exit</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-neutral-500">
                            Vehicle in processing ({vehicle.assignedLocation})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenInspection(vehicle)}
                            className="px-2.5 py-1.5 border border-neutral-300 hover:bg-neutral-50 text-[11px] font-semibold text-neutral-800 cursor-pointer"
                            style={{ borderRadius: 0 }}
                          >
                            Fast-Track Exit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 
        ============================================================
        5. EXIT SECURITY VERIFICATION & CLEARANCE MODAL
        ============================================================
      */}
      <AnimatePresence>
        {selectedVehicleForExit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.15 }}
              className="bg-white border border-neutral-800 w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
              style={{ borderRadius: 0 }}
            >
              {/* Modal Header */}
              <div className="p-4 bg-[#18181B] text-white flex items-center justify-between border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 bg-[#059669] text-white flex items-center justify-center font-bold text-sm"
                    style={{ borderRadius: 0 }}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">
                      Security Exit Clearance & Barrier Dispatch
                    </h3>
                    <div className="text-[11px] text-neutral-300">
                      Vehicle: <strong className="text-white">{selectedVehicleForExit.vehicleNo}</strong> · Pass: {selectedVehicleForExit.gateEntryNo}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedVehicleForExit(null)}
                  className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-5 text-xs">
                {/* Vehicle & Weighment Overview Strip */}
                <div className="p-3.5 bg-neutral-50 border border-neutral-300 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Direction</span>
                    <span className="font-bold text-neutral-900">
                      {selectedVehicleForExit.direction === "INBOUND_RM" ? "Inbound Raw Material" : "Outbound Finished Goods"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Material</span>
                    <span className="font-bold text-neutral-900 truncate block">
                      {selectedVehicleForExit.materialName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Driver & Phone</span>
                    <span className="font-semibold text-neutral-800 block">
                      {selectedVehicleForExit.driverName}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {selectedVehicleForExit.driverMobile}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Net Cargo Weight</span>
                    <span className="font-extrabold text-[#059669] text-sm tabular-nums">
                      {selectedVehicleForExit.netWeightMT ||
                        Math.abs(
                          (selectedVehicleForExit.grossWeightMT || 42.8) -
                            (selectedVehicleForExit.tareWeightMT || 11.5)
                        ).toFixed(2)}{" "}
                      MT
                    </span>
                  </div>
                </div>

                {/* Mandatory 4-Point Physical Gate Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <span className="font-bold uppercase tracking-wider text-neutral-900 text-[11px] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-neutral-700" />
                      Mandatory Physical Security Checklist (Gate 02)
                    </span>
                    <button
                      type="button"
                      onClick={handleSelectAllChecks}
                      className="text-[11px] font-semibold text-[#059669] hover:underline cursor-pointer"
                    >
                      Select All 4 Checks
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Check 1: Weighbridge Slip */}
                    <label
                      onClick={() =>
                        setChecklist((p) => ({
                          ...p,
                          weighbridgeSlipVerified: !p.weighbridgeSlipVerified,
                        }))
                      }
                      className={`p-3 border cursor-pointer transition-colors flex items-start gap-3 ${
                        checklist.weighbridgeSlipVerified
                          ? "bg-[#ECFDF5] border-[#A7F3D0]"
                          : "bg-white border-neutral-300 hover:border-neutral-500"
                      }`}
                      style={{ borderRadius: 0 }}
                    >
                      <div
                        className={`w-4 h-4 mt-0.5 border flex items-center justify-center shrink-0 ${
                          checklist.weighbridgeSlipVerified
                            ? "bg-[#059669] border-[#059669] text-white"
                            : "border-neutral-400 bg-white"
                        }`}
                      >
                        {checklist.weighbridgeSlipVerified && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900">
                          1. Weighbridge Tare Slip Verified
                        </div>
                        <div className="text-[11px] text-neutral-600 mt-0.5">
                          Tare weight slip #{selectedVehicleForExit.weighbridgeSlipNo || "WB-261003-018"} stamped by scale operator. Net weight verified against declared manifest.
                        </div>
                      </div>
                    </label>

                    {/* Check 2: Cargo Bed / Seals */}
                    <label
                      onClick={() =>
                        setChecklist((p) => ({
                          ...p,
                          cargoBedInspected: !p.cargoBedInspected,
                        }))
                      }
                      className={`p-3 border cursor-pointer transition-colors flex items-start gap-3 ${
                        checklist.cargoBedInspected
                          ? "bg-[#ECFDF5] border-[#A7F3D0]"
                          : "bg-white border-neutral-300 hover:border-neutral-500"
                      }`}
                      style={{ borderRadius: 0 }}
                    >
                      <div
                        className={`w-4 h-4 mt-0.5 border flex items-center justify-center shrink-0 ${
                          checklist.cargoBedInspected
                            ? "bg-[#059669] border-[#059669] text-white"
                            : "border-neutral-400 bg-white"
                        }`}
                      >
                        {checklist.cargoBedInspected && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900">
                          2. Physical Cargo Bed / Seal Checked
                        </div>
                        <div className="text-[11px] text-neutral-600 mt-0.5">
                          {selectedVehicleForExit.direction === "INBOUND_RM"
                            ? "Tipper/bed 100% empty, swept clean, zero residual raw material remaining."
                            : `Tarpaulin lashed securely. Security seal #${selectedVehicleForExit.sealNo || "BIR-9821"} intact.`}
                        </div>
                      </div>
                    </label>

                    {/* Check 3: Breathalyzer Zero BAC */}
                    <label
                      onClick={() =>
                        setChecklist((p) => ({
                          ...p,
                          breathalyzerZeroBAC: !p.breathalyzerZeroBAC,
                        }))
                      }
                      className={`p-3 border cursor-pointer transition-colors flex items-start gap-3 ${
                        checklist.breathalyzerZeroBAC
                          ? "bg-[#ECFDF5] border-[#A7F3D0]"
                          : "bg-white border-neutral-300 hover:border-neutral-500"
                      }`}
                      style={{ borderRadius: 0 }}
                    >
                      <div
                        className={`w-4 h-4 mt-0.5 border flex items-center justify-center shrink-0 ${
                          checklist.breathalyzerZeroBAC
                            ? "bg-[#059669] border-[#059669] text-white"
                            : "border-neutral-400 bg-white"
                        }`}
                      >
                        {checklist.breathalyzerZeroBAC && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900">
                          3. Driver Breathalyzer: 0.00% BAC
                        </div>
                        <div className="text-[11px] text-neutral-600 mt-0.5">
                          Zero blood alcohol confirmed on station breathalyzer. Safety helmet and visitor badge collected back.
                        </div>
                      </div>
                    </label>

                    {/* Check 4: Gate Pass Security Duplicate */}
                    <label
                      onClick={() =>
                        setChecklist((p) => ({
                          ...p,
                          gatePassDuplicateRetained: !p.gatePassDuplicateRetained,
                        }))
                      }
                      className={`p-3 border cursor-pointer transition-colors flex items-start gap-3 ${
                        checklist.gatePassDuplicateRetained
                          ? "bg-[#ECFDF5] border-[#A7F3D0]"
                          : "bg-white border-neutral-300 hover:border-neutral-500"
                      }`}
                      style={{ borderRadius: 0 }}
                    >
                      <div
                        className={`w-4 h-4 mt-0.5 border flex items-center justify-center shrink-0 ${
                          checklist.gatePassDuplicateRetained
                            ? "bg-[#059669] border-[#059669] text-white"
                            : "border-neutral-400 bg-white"
                        }`}
                      >
                        {checklist.gatePassDuplicateRetained && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900">
                          4. Gate Pass Security Copy Retained
                        </div>
                        <div className="text-[11px] text-neutral-600 mt-0.5">
                          Duplicate paper copy archived. Driver signed physical plant outward exit register.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Guard Remarks Input */}
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block font-semibold mb-1">
                    Security Officer Remarks / Dispatch Notes
                  </label>
                  <input
                    type="text"
                    value={guardNotes}
                    onChange={(e) => setGuardNotes(e.target.value)}
                    placeholder="Enter security clearance remarks or inspection findings..."
                    className="w-full px-3 py-2 border border-neutral-300 bg-neutral-50 text-xs focus:outline-none focus:border-neutral-700"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="p-4 bg-neutral-100 border-t border-neutral-300 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedVehicleForExit(null)}
                  className="px-4 py-2 border border-neutral-300 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  {!isInspectionComplete && (
                    <span className="text-[11px] text-neutral-500 hidden sm:inline">
                      Complete all 4 checklist points to unlock barrier
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!isInspectionComplete}
                    onClick={handleAuthorizeExit}
                    className={`px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      isInspectionComplete
                        ? "bg-[#059669] hover:bg-[#047857] text-white shadow-md"
                        : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    <Unlock className="w-4 h-4" />
                    <span>AUTHORIZE & RAISE EXIT BARRIER 02</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
        ============================================================
        6. OFFICIAL VEHICLE OUTWARD CLEARANCE PASS (PRINTABLE)
        ============================================================
      */}
      <AnimatePresence>
        {activeExitPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white border border-neutral-900 w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
              style={{ borderRadius: 0 }}
            >
              {/* Slip Toolbar */}
              <div className="p-3 bg-[#18181B] text-white flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>Outward Gate Pass Issued · Barrier 02 Raised</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    style={{ borderRadius: 0 }}
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveExitPass(null)}
                    className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Clearance Slip Content */}
              <div className="p-6 space-y-5 text-neutral-900 bg-white select-text">
                {/* Company Header */}
                <div className="border-b-2 border-neutral-900 pb-3 flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight uppercase">
                      Bharat Industrial & Renewables LLP
                    </h2>
                    <p className="text-[11px] text-neutral-600">
                      Biomass Pelletisation Plant · Unit 01, MIDC Industrial Area, Maharashtra
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">
                      Security Gate Operations · Outward Vehicle Clearance Pass
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-bold text-neutral-500 uppercase">Exit Pass No</div>
                    <div className="text-sm font-extrabold tabular-nums tracking-wider text-neutral-900">
                      {activeExitPass.exitPassNo}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      Ref: {activeExitPass.gateEntryNo}
                    </div>
                  </div>
                </div>

                {/* Logistics Key Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-neutral-200 pb-3">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Vehicle Number</span>
                    <span className="font-extrabold text-sm text-neutral-900">{activeExitPass.vehicleNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Direction</span>
                    <span className="font-bold text-neutral-800">
                      {activeExitPass.direction === "INBOUND_RM" ? "Inbound Raw Material" : "Outbound FG Dispatch"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Transporter</span>
                    <span className="font-semibold text-neutral-800">{activeExitPass.transporter}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Driver</span>
                    <span className="font-semibold text-neutral-800">{activeExitPass.driverName}</span>
                  </div>
                </div>

                {/* Material & Weighment Reconciliation Table */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    Cargo & Scale Reconciliation
                  </div>
                  <table className="w-full text-xs border border-neutral-300">
                    <thead className="bg-neutral-100 border-b border-neutral-300 text-neutral-700 text-[10px] uppercase">
                      <tr>
                        <th className="p-2 text-left">Material Description</th>
                        <th className="p-2 text-left">Party (Consignor/Consignee)</th>
                        <th className="p-2 text-right">Gross MT</th>
                        <th className="p-2 text-right">Tare MT</th>
                        <th className="p-2 text-right">Net Cargo MT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-200">
                        <td className="p-2 font-bold">{activeExitPass.materialName}</td>
                        <td className="p-2 text-neutral-600">{activeExitPass.supplierOrCustomer}</td>
                        <td className="p-2 text-right tabular-nums">{activeExitPass.grossWeightMT.toFixed(2)}</td>
                        <td className="p-2 text-right tabular-nums">{activeExitPass.tareWeightMT.toFixed(2)}</td>
                        <td className="p-2 text-right tabular-nums font-extrabold text-[#059669]">
                          {activeExitPass.netWeightMT.toFixed(2)} MT
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Timing & Security Stamp */}
                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div className="space-y-1">
                    <div className="text-[11px] text-neutral-600">
                      <strong>Entry Time:</strong> {activeExitPass.timeIn} IST
                    </div>
                    <div className="text-[11px] text-neutral-600">
                      <strong>Exit Time:</strong> {activeExitPass.timeOut} IST
                    </div>
                    <div className="text-[11px] text-neutral-600">
                      <strong>Total Plant Turnaround:</strong> {activeExitPass.turnaroundMinutes} Minutes
                    </div>
                    {activeExitPass.sealNo && (
                      <div className="text-[11px] text-neutral-600">
                        <strong>Security Seal:</strong> #{activeExitPass.sealNo} (Verified Intact)
                      </div>
                    )}
                  </div>

                  {/* Security Clearance Stamp */}
                  <div className="border border-neutral-400 p-2.5 text-center flex flex-col justify-between bg-neutral-50">
                    <div className="text-[10px] uppercase font-bold text-[#059669] tracking-wider">
                      ● OUTWARD PHYSICAL INSPECTION CLEARED
                    </div>
                    <div className="text-[11px] font-semibold text-neutral-800 my-1">
                      Authorized by: {activeExitPass.clearedBy}
                    </div>
                    <div className="text-[9px] text-neutral-500 uppercase">
                      Boom Barrier 02 Verified & Cycled · Pass Archived
                    </div>
                  </div>
                </div>

                {/* Remarks if any */}
                {activeExitPass.notes && (
                  <div className="text-[11px] text-neutral-600 border-t border-neutral-200 pt-2 italic">
                    Note: {activeExitPass.notes}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 bg-neutral-100 border-t border-neutral-300 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveExitPass(null)}
                  className="px-4 py-2 bg-[#18181B] text-white text-xs font-semibold cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  Close & Return to Queue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
        ============================================================
        7. MANUAL BOOM BARRIER 02 OVERRIDE MODAL
        ============================================================
      */}
      <AnimatePresence>
        {isBarrierOverrideModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white border border-neutral-900 w-full max-w-md overflow-hidden shadow-2xl"
              style={{ borderRadius: 0 }}
            >
              <div className="p-4 bg-[#18181B] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold">Manual Barrier 02 Override</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBarrierOverrideModalOpen(false)}
                  className="text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs text-neutral-700">
                <p>
                  Manual override is recorded in the plant security event log. Use only for authorized maintenance, emergency vehicles, or physical system recalibration.
                </p>

                <div className="p-3 bg-neutral-50 border border-neutral-300 space-y-1">
                  <div className="text-[11px] font-bold text-neutral-800">
                    Current Arm Status: <span className="uppercase text-neutral-900">{barrierState}</span>
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    Physical interlock: Solenoid 24V DC · Magnetic limit switch engaged
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleBarrierOverride("RAISE")}
                    className="p-3 bg-[#059669] hover:bg-[#047857] text-white font-bold text-center cursor-pointer transition-colors"
                    style={{ borderRadius: 0 }}
                  >
                    Raise Barrier (20s)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleBarrierOverride("LOWER")}
                    className="p-3 bg-[#18181B] hover:bg-black text-white font-bold text-center cursor-pointer transition-colors"
                    style={{ borderRadius: 0 }}
                  >
                    Lower & Lock Barrier
                  </button>
                </div>
              </div>

              <div className="p-3 bg-neutral-100 border-t border-neutral-300 text-right">
                <button
                  type="button"
                  onClick={() => setIsBarrierOverrideModalOpen(false)}
                  className="px-3 py-1.5 border border-neutral-300 bg-white text-xs font-semibold cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
