"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FileCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Check,
  X,
  FileText,
  Truck,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { GateVehicle, GateStage } from "@/lib/types/gate";

export interface DocVerificationItem {
  id: string;
  vehicleNo: string;
  gateEntryNo?: string;
  ewayBillNo: string;
  ewayBillDate: string;
  validUntil: string;
  poOrSoNo: string;
  challanOrLrNo: string;
  consignor: string;
  materialName: string;
  declaredQtyMT: number;
  transporter: string;
  driverName: string;
  driverMobile: string;
  verificationStatus: "PENDING" | "VERIFIED" | "FLAGGED_MISMATCH" | "EXPIRED";
  mismatchReason?: string;
  verifiedAt?: string;
  notes?: string;
}

const INITIAL_DOC_RECORDS: DocVerificationItem[] = [
  {
    id: "doc-001",
    vehicleNo: "MH 49 TR 8819",
    gateEntryNo: "RM-GATE-261003-005",
    ewayBillNo: "EWB-3301-8842-9901",
    ewayBillDate: "03-Oct-2026, 09:30",
    validUntil: "04-Oct-2026, 23:59",
    poOrSoNo: "PO-2026-0988",
    challanOrLrNo: "CH-559102",
    consignor: "Godavari Agro Biomass Pvt Ltd",
    materialName: "Paddy Straw Chopped (PS)",
    declaredQtyMT: 19.5,
    transporter: "Om Translines Global",
    driverName: "Dnyaneshwar More",
    driverMobile: "+91 93701 99281",
    verificationStatus: "PENDING",
    notes: "Vehicle arrived at Barrier 01. Physical challan presented.",
  },
  {
    id: "doc-002",
    vehicleNo: "MH 12 RN 4821",
    gateEntryNo: "RM-GATE-261003-001",
    ewayBillNo: "EWB-2910-8472-1092",
    ewayBillDate: "03-Oct-2026, 08:15",
    validUntil: "04-Oct-2026, 23:59",
    poOrSoNo: "PO-2026-0982",
    challanOrLrNo: "CH-982104",
    consignor: "Krishi Bio Agro Farmers Co-op",
    materialName: "Groundnut Shell (GS)",
    declaredQtyMT: 24.5,
    transporter: "Shree Ganesh Roadways",
    driverName: "Pandurang Patil",
    driverMobile: "+91 98224 81920",
    verificationStatus: "VERIFIED",
    verifiedAt: "14:18 IST",
    notes: "All checks passed. Directed to Gross weighbridge.",
  },
  {
    id: "doc-003",
    vehicleNo: "MH 15 JC 4018",
    gateEntryNo: "RM-GATE-261003-003",
    ewayBillNo: "EWB-4419-8802-1200",
    ewayBillDate: "03-Oct-2026, 10:45",
    validUntil: "04-Oct-2026, 23:59",
    poOrSoNo: "PO-2026-0984",
    challanOrLrNo: "CH-338190",
    consignor: "Khandesh Agro Producers",
    materialName: "Cotton Stalk Shredded (CS)",
    declaredQtyMT: 22.8,
    transporter: "Balaji Cargo Movers",
    driverName: "Vinod Shinde",
    driverMobile: "+91 97631 00293",
    verificationStatus: "VERIFIED",
    verifiedAt: "14:42 IST",
    notes: "e-Way bill active. Driver credentials verified.",
  },
  {
    id: "doc-004",
    vehicleNo: "MH 31 CB 7721",
    ewayBillNo: "EWB-9912-3401-8821",
    ewayBillDate: "02-Oct-2026, 14:00",
    validUntil: "03-Oct-2026, 12:00",
    poOrSoNo: "PO-2026-0985",
    challanOrLrNo: "CH-774012",
    consignor: "Vidarbha Wood Processors LLP",
    materialName: "Sawdust Fine (SD)",
    declaredQtyMT: 31.0,
    transporter: "Nagpur Express Fleet",
    driverName: "Prakash Meshram",
    driverMobile: "+91 98231 44109",
    verificationStatus: "EXPIRED",
    mismatchReason: "e-Way bill expired at 12:00 PM (Overdue by 3h). Needs validity extension on GST portal.",
    notes: "Driver in holding bay pending supplier validity renewal.",
  },
  {
    id: "doc-005",
    vehicleNo: "MH 14 EM 2091",
    gateEntryNo: "RM-GATE-261003-002",
    ewayBillNo: "EWB-7712-4401-9921",
    ewayBillDate: "03-Oct-2026, 07:30",
    validUntil: "04-Oct-2026, 23:59",
    poOrSoNo: "PO-2026-0981",
    challanOrLrNo: "CH-774012",
    consignor: "Western Bio Residues Co",
    materialName: "Sawdust Fine (SD)",
    declaredQtyMT: 31.2,
    transporter: "Maharashtra Freightways",
    driverName: "Sanjay Thorat",
    driverMobile: "+91 94220 18239",
    verificationStatus: "VERIFIED",
    verifiedAt: "13:52 IST",
    notes: "Verified and stamped. Currently unloading in yard.",
  },
  {
    id: "doc-006",
    vehicleNo: "MH 09 CW 3319",
    ewayBillNo: "EWB-6610-8812-3341",
    ewayBillDate: "03-Oct-2026, 13:00",
    validUntil: "04-Oct-2026, 23:59",
    poOrSoNo: "PO-2026-0982",
    challanOrLrNo: "CH-119420",
    consignor: "Kolhapur Agro Biomass Union",
    materialName: "Groundnut Shell (GS)",
    declaredQtyMT: 26.5,
    transporter: "Sahyadri Logistics",
    driverName: "Sanjay Mane",
    driverMobile: "+91 98220 11942",
    verificationStatus: "PENDING",
    notes: "Pre-advised consignment. Pre-verified through supplier advance scan.",
  },
];

interface GateDocVerificationProps {
  vehicles: GateVehicle[];
  onUpdateStage: (vehicleId: string, newStage: GateStage) => void;
  onNavigateTab: (tabId: string) => void;
}

export function GateDocVerification({
  onNavigateTab,
}: GateDocVerificationProps) {
  // Live Clock
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

  // Filter & Search
  const [docRecords, setDocRecords] = useState<DocVerificationItem[]>(INITIAL_DOC_RECORDS);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "VERIFIED" | "FLAGGED">("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"CARDS" | "TABLE">("CARDS");
  const [searchQuery, setSearchQuery] = useState("");

  // Active Document for Verification Modal
  const [selectedDoc, setSelectedDoc] = useState<DocVerificationItem | null>(null);

  // Modal Checklist
  const [checkEway, setCheckEway] = useState(true);
  const [checkPO, setCheckPO] = useState(true);
  const [checkVehicle, setCheckVehicle] = useState(true);
  const [guardNotes, setGuardNotes] = useState("");

  // Counts
  const pendingCount = docRecords.filter((d) => d.verificationStatus === "PENDING").length;
  const verifiedCount = docRecords.filter((d) => d.verificationStatus === "VERIFIED").length;
  const flaggedCount = docRecords.filter(
    (d) => d.verificationStatus === "FLAGGED_MISMATCH" || d.verificationStatus === "EXPIRED"
  ).length;

  const filteredDocs = useMemo(() => {
    return docRecords.filter((doc) => {
      if (statusFilter === "PENDING" && doc.verificationStatus !== "PENDING") return false;
      if (statusFilter === "VERIFIED" && doc.verificationStatus !== "VERIFIED") return false;
      if (
        statusFilter === "FLAGGED" &&
        doc.verificationStatus !== "FLAGGED_MISMATCH" &&
        doc.verificationStatus !== "EXPIRED"
      )
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          doc.vehicleNo.toLowerCase().includes(q) ||
          doc.ewayBillNo.toLowerCase().includes(q) ||
          doc.poOrSoNo.toLowerCase().includes(q) ||
          doc.consignor.toLowerCase().includes(q) ||
          doc.materialName.toLowerCase().includes(q) ||
          doc.driverName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [docRecords, statusFilter, searchQuery]);

  const handleOpenModal = (doc: DocVerificationItem) => {
    setSelectedDoc(doc);
    setCheckEway(doc.verificationStatus !== "EXPIRED");
    setCheckPO(true);
    setCheckVehicle(true);
    setGuardNotes(doc.notes || "e-Way bill active. Supplier PO matched.");
  };

  const handleVerifyConfirm = () => {
    if (!selectedDoc) return;
    setDocRecords((prev) =>
      prev.map((d) =>
        d.id === selectedDoc.id
          ? {
              ...d,
              verificationStatus: "VERIFIED",
              verifiedAt: new Date().toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }) + " IST",
              notes: guardNotes,
            }
          : d
      )
    );
    setSelectedDoc(null);
  };

  const handleFlagMismatch = () => {
    if (!selectedDoc) return;
    setDocRecords((prev) =>
      prev.map((d) =>
        d.id === selectedDoc.id
          ? {
              ...d,
              verificationStatus: "FLAGGED_MISMATCH",
              mismatchReason: guardNotes || "Discrepancy in declared weight or PO reference.",
            }
          : d
      )
    );
    setSelectedDoc(null);
  };

  return (
    <div className="w-full space-y-8 sm:space-y-10 select-none">
      {/* ========================================================================= */}
      {/* 1. HEADER                                                                 */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-300 pb-5 sm:pb-6">
        <div className="py-1 sm:py-1.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Document Verification
          </h1>
        </div>

        {/* Pending Checks Counter */}
        <div className="flex items-center gap-2.5 mt-1 sm:mt-0">
          <div className="h-10 px-3.5 border border-neutral-300 bg-neutral-200/50 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold text-neutral-900">{pendingCount} Pending Checks</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN DOCUMENT VERIFICATION TABLE                                       */}
      {/* ========================================================================= */}
      <div className="border-0 sm:border sm:border-neutral-300">
        {/* Controls Bar */}
        <div className="p-0 sm:p-4 pb-3 sm:pb-4 border-b border-neutral-300 space-y-2.5">
          {/* Top Row: Search Input (Full Width on mobile) + Filters Toggle (PC) + View Toggle (PC) */}
          <div className="flex items-center gap-2">
            <div className="relative w-full flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicle no, e-Way bill #, PO, supplier..."
                className="w-full h-11 sm:h-10 pl-9.5 pr-8 bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-[#059669] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer text-sm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filters Toggle Button (PC Only) */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`hidden sm:flex h-10 px-3.5 border text-xs font-bold uppercase tracking-wider items-center gap-2 transition-colors cursor-pointer shrink-0 ${
                showFilters || statusFilter !== "ALL"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {statusFilter !== "ALL" && (
                <span className="text-[10px] bg-[#059669] text-white px-1.5 py-0.2 rounded font-mono font-bold">
                  1
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* View Toggle (PC Only) */}
            <div className="hidden sm:inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
              <button
                type="button"
                onClick={() => setViewMode("CARDS")}
                className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center ${
                  viewMode === "CARDS"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode("TABLE")}
                className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center ${
                  viewMode === "TABLE"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                Table
              </button>
            </div>
          </div>

          {/* Active Filter summary chip (PC Only) */}
          {!showFilters && statusFilter !== "ALL" && (
            <div className="hidden sm:flex items-center gap-2 pt-0.5 text-xs">
              <span className="text-neutral-500 font-medium">Filter:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 text-white font-bold text-[11px] uppercase tracking-wide">
                <span>
                  {
                    [
                      { key: "PENDING", label: "Pending" },
                      { key: "VERIFIED", label: "Verified" },
                      { key: "FLAGGED", label: "Flagged / Expired" },
                    ].find((f) => f.key === statusFilter)?.label
                  }
                </span>
                <button
                  type="button"
                  onClick={() => setStatusFilter("ALL")}
                  className="hover:text-red-400 cursor-pointer ml-1"
                >
                  ✕
                </button>
              </span>
            </div>
          )}

          {/* Expandable Filter Options (PC Only) */}
          {showFilters && (
            <div className="hidden sm:block pt-2 border-t border-neutral-200 space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { key: "ALL", label: "All Documents", count: docRecords.length },
                  { key: "PENDING", label: "Pending", count: pendingCount },
                  { key: "VERIFIED", label: "Verified", count: verifiedCount },
                  { key: "FLAGGED", label: "Flagged / Expired", count: flaggedCount },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key as typeof statusFilter)}
                    className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border whitespace-nowrap flex items-center gap-1.5 ${
                      statusFilter === tab.key
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="opacity-75 font-mono text-[11px]">({tab.count})</span>
                  </button>
                ))}
                {statusFilter !== "ALL" && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter("ALL")}
                    className="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2 ml-2 cursor-pointer font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="text-[11px] text-neutral-500">
                Showing <strong className="text-neutral-900">{filteredDocs.length}</strong> documents
              </div>
            </div>
          )}
        </div>

        {/* Content: Cards Grid or Table */}
        {filteredDocs.length === 0 ? (
          <div className="py-10 text-center text-neutral-500">
            <FileCheck className="w-7 h-7 text-neutral-300 mx-auto mb-1.5" />
            <p className="font-semibold text-neutral-700">No documents match the selected filter</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Try clearing the search or switching tabs</p>
          </div>
        ) : (
          <>
            {/* Cards View: Always on Mobile, respects viewMode on Desktop */}
            <div className={viewMode === "CARDS" ? "px-0 py-3 sm:p-4" : "px-0 py-3 sm:hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredDocs.map((doc) => {
                const isVerified = doc.verificationStatus === "VERIFIED";
                const isPending = doc.verificationStatus === "PENDING";
                const isFlagged =
                  doc.verificationStatus === "FLAGGED_MISMATCH" ||
                  doc.verificationStatus === "EXPIRED";

                return (
                  <div
                    key={doc.id}
                    onClick={() => handleOpenModal(doc)}
                    className="border border-neutral-300 p-3.5 hover:border-neutral-900 transition-all cursor-pointer group bg-transparent flex flex-col justify-between space-y-3"
                  >
                    {/* Top: Plate + Gate Pass + Status Pill */}
                    <div className="flex items-start justify-between gap-2 border-b border-neutral-200 pb-2">
                      <div>
                        <div className="font-mono font-bold text-neutral-900 text-sm group-hover:text-[#059669] transition-colors">
                          {doc.vehicleNo}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          {doc.gateEntryNo || "Scheduled"}
                        </div>
                      </div>

                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#047857] px-2 py-0.5 bg-emerald-50 border border-emerald-300 shrink-0">
                          <Check className="w-3 h-3" strokeWidth={2.5} />
                          <span>Verified</span>
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 px-2 py-0.5 bg-amber-50 border border-amber-300 shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>Pending Check</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 px-2 py-0.5 bg-red-50 border border-red-300 shrink-0">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{doc.verificationStatus === "EXPIRED" ? "e-Way Expired" : "Mismatch"}</span>
                        </span>
                      )}
                    </div>

                    {/* Middle: Cargo, e-Way, PO */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-semibold text-neutral-900 truncate">
                          {doc.materialName}
                        </span>
                        <span className="font-mono font-bold text-neutral-900 tabular-nums text-xs shrink-0">
                          {doc.declaredQtyMT.toFixed(1)} MT
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-600">
                        <span className="font-mono truncate">{doc.ewayBillNo}</span>
                        <span className="text-[10px] text-neutral-400 shrink-0">Exp: {doc.validUntil.split(",")[0]}</span>
                      </div>

                      <div className="text-[11px] text-neutral-600 truncate">
                        {doc.consignor}
                      </div>

                      <div className="text-[10px] text-neutral-400 flex items-center justify-between gap-1">
                        <span className="font-mono">{doc.poOrSoNo}</span>
                        <span className="truncate">{doc.transporter}</span>
                      </div>
                    </div>

                    {/* Bottom: Driver & Action */}
                    <div className="pt-2 border-t border-neutral-200 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-neutral-600 truncate">
                        <span className="font-medium text-neutral-800">{doc.driverName}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(doc);
                        }}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0 ${
                          isPending
                            ? "bg-[#059669] hover:bg-[#047857] text-white shadow-xs"
                            : "border border-neutral-300 hover:bg-neutral-200/60 text-neutral-700 bg-transparent"
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{isPending ? "Verify" : "Inspect"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table View (PC Only) */}
          <div className={viewMode === "TABLE" ? "hidden sm:block overflow-x-auto" : "hidden"}>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-200/50 border-b border-neutral-300 text-[10px] uppercase font-bold text-neutral-600 tracking-wider">
                  <th className="py-2.5 px-3">Vehicle & Pass No</th>
                  <th className="py-2.5 px-3">e-Way Bill & Validity</th>
                  <th className="py-2.5 px-3">PO & Challan Ref</th>
                  <th className="py-2.5 px-3">Supplier</th>
                  <th className="py-2.5 px-3">Material & Weight</th>
                  <th className="py-2.5 px-3">Driver & Contact</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {filteredDocs.map((doc) => {
                  const isVerified = doc.verificationStatus === "VERIFIED";
                  const isPending = doc.verificationStatus === "PENDING";
                  const isFlagged =
                    doc.verificationStatus === "FLAGGED_MISMATCH" ||
                    doc.verificationStatus === "EXPIRED";

                  return (
                    <tr
                      key={doc.id}
                      onClick={() => handleOpenModal(doc)}
                      className="hover:bg-neutral-200/40 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-neutral-900 text-xs">
                          {doc.vehicleNo}
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          {doc.gateEntryNo || "Scheduled Arrival"}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-neutral-900 text-xs">
                          {doc.ewayBillNo}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          Valid: {doc.validUntil.split(",")[0]}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px]">
                        <div className="text-neutral-900 font-semibold">{doc.poOrSoNo}</div>
                        <div className="text-neutral-500">{doc.challanOrLrNo}</div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-neutral-800 truncate max-w-[170px]">
                          {doc.consignor}
                        </div>
                        <div className="text-[10px] text-neutral-500 truncate max-w-[170px]">
                          {doc.transporter}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-medium text-neutral-900 truncate max-w-[150px]">
                          {doc.materialName}
                        </div>
                        <div className="text-[11px] text-neutral-500 tabular-nums font-mono">
                          {doc.declaredQtyMT.toFixed(1)} MT declared
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-medium text-neutral-800">{doc.driverName}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">{doc.driverMobile}</div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#047857] px-2 py-0.5 bg-emerald-50 border border-emerald-300">
                            <Check className="w-3 h-3" strokeWidth={2.5} />
                            <span>Verified</span>
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 px-2 py-0.5 bg-amber-50 border border-amber-300">
                            <Clock className="w-3 h-3" />
                            <span>Pending Check</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 px-2 py-0.5 bg-red-50 border border-red-300">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{doc.verificationStatus === "EXPIRED" ? "e-Way Expired" : "Mismatch"}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(doc);
                          }}
                          className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center gap-1 ${
                            isPending
                              ? "bg-[#059669] hover:bg-[#047857] text-white shadow-xs"
                              : "border border-neutral-300 hover:bg-neutral-200/60 text-neutral-700 bg-transparent"
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{isPending ? "Verify" : "Inspect"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

        {/* Footer */}
        <div className="p-3 border-t border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500">
          <div>
            Vehicle Document Verification · GST e-Way Bill System
          </div>
          <div>
            Showing <strong className="text-neutral-900">{filteredDocs.length}</strong> records
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. VERIFICATION POPUP MODAL                                               */}
      {/* ========================================================================= */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="w-full max-w-lg max-h-[92vh] overflow-y-auto border border-neutral-300 bg-[#F4F5F7] shadow-2xl p-4 sm:p-5 space-y-3.5 sm:space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-neutral-300 pb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCheck className="w-5 h-5 text-[#059669] shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 uppercase tracking-wide truncate">
                    Verify Documents
                  </h3>
                  <div className="font-mono font-bold text-xs text-neutral-800">
                    {selectedDoc.vehicleNo}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 flex items-center justify-center border border-neutral-300 hover:bg-neutral-200/60 text-neutral-600 hover:text-neutral-900 cursor-pointer bg-white transition-colors shrink-0"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Details Card */}
            <div className="p-3.5 bg-white border border-neutral-300 space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-neutral-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">e-Way Bill No</span>
                  <span className="font-mono font-bold text-neutral-900">{selectedDoc.ewayBillNo}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Validity</span>
                  <span className="font-bold text-neutral-800">{selectedDoc.validUntil}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">PO / SO Ref</span>
                  <span className="font-mono font-bold text-neutral-900">{selectedDoc.poOrSoNo}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Challan / LR</span>
                  <span className="font-mono text-neutral-800">{selectedDoc.challanOrLrNo}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2.5 border-t border-neutral-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Supplier</span>
                  <span className="font-semibold text-neutral-800 block text-xs">{selectedDoc.consignor}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Material & Weight</span>
                  <span className="font-semibold text-neutral-900 block text-xs">
                    {selectedDoc.materialName} ({selectedDoc.declaredQtyMT} MT)
                  </span>
                </div>
              </div>

              {selectedDoc.mismatchReason && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs">
                  <strong>Mismatch Reason:</strong> {selectedDoc.mismatchReason}
                </div>
              )}
            </div>

            {/* Verification Checklist */}
            <div className="space-y-2 text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                Required Document Checks
              </span>

              <label className="flex items-start gap-2.5 p-2.5 bg-white border border-neutral-300 hover:border-neutral-400 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={checkEway}
                  onChange={(e) => setCheckEway(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#059669] cursor-pointer shrink-0"
                />
                <div>
                  <span className="font-semibold text-neutral-900 block">
                    e-Way Bill Active & Unexpired
                  </span>
                  <span className="text-[11px] text-neutral-500 leading-relaxed block mt-0.5">
                    Validity verified on government portal. Vehicle number matches.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 bg-white border border-neutral-300 hover:border-neutral-400 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={checkPO}
                  onChange={(e) => setCheckPO(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#059669] cursor-pointer shrink-0"
                />
                <div>
                  <span className="font-semibold text-neutral-900 block">
                    Purchase Order & Challan Match
                  </span>
                  <span className="text-[11px] text-neutral-500 leading-relaxed block mt-0.5">
                    Material and weight match active Purchase Order.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 bg-white border border-neutral-300 hover:border-neutral-400 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={checkVehicle}
                  onChange={(e) => setCheckVehicle(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#059669] cursor-pointer shrink-0"
                />
                <div>
                  <span className="font-semibold text-neutral-900 block">
                    Driver & Vehicle Checked
                  </span>
                  <span className="text-[11px] text-neutral-500 leading-relaxed block mt-0.5">
                    Vehicle number matches driver details and gate pass.
                  </span>
                </div>
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                Guard Notes
              </label>
              <input
                type="text"
                value={guardNotes}
                onChange={(e) => setGuardNotes(e.target.value)}
                placeholder="e.g. All documents verified. Approved for gross scale."
                className="w-full h-9 px-3 bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#059669]"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-neutral-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleFlagMismatch}
                className="order-3 sm:order-1 w-full sm:w-auto px-4 py-2 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold cursor-pointer transition-colors text-center"
              >
                Flag Mismatch
              </button>

              <div className="order-1 sm:order-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="w-full sm:w-auto px-4 py-2 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold cursor-pointer transition-colors text-center"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!checkEway || !checkPO || !checkVehicle}
                  onClick={handleVerifyConfirm}
                  className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-[#059669] hover:bg-[#047857] disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Verified</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
