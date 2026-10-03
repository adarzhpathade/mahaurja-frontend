"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  User,
  ExternalLink,
  QrCode,
  Scan,
  Printer,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Building,
  Calendar,
  Layers,
  Scale,
  RefreshCw,
  BadgeAlert,
  HelpCircle,
  Hash,
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
  consignorGstin: string;
  consignee: string;
  consigneeGstin: string;
  hsnCode: string;
  materialName: string;
  declaredQtyMT: number;
  transporter: string;
  driverName: string;
  driverLicenseNo: string;
  driverMobile: string;
  vehicleFitnessValidUntil: string;
  insuranceValidUntil: string;
  pucValidUntil: string;
  verificationStatus: "PENDING" | "VERIFIED" | "FLAGGED_MISMATCH" | "EXPIRED";
  mismatchReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
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
    consignorGstin: "27AABCG5512L1Z8",
    consignee: "Bharat Industrial & Renewables LLP",
    consigneeGstin: "27AAACB1234D1Z5",
    hsnCode: "14049090 (Paddy Straw Chopped)",
    materialName: "Paddy Straw Chopped (PS)",
    declaredQtyMT: 19.5,
    transporter: "Om Translines Global",
    driverName: "Dnyaneshwar More",
    driverLicenseNo: "MH-20-2015-0088192",
    driverMobile: "+91 93701 99281",
    vehicleFitnessValidUntil: "15-Dec-2026",
    insuranceValidUntil: "28-Feb-2027",
    pucValidUntil: "10-Nov-2026",
    verificationStatus: "PENDING",
    notes: "Vehicle arrived at Barrier 01. Physical challan presented, driver DL physically verified.",
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
    consignorGstin: "27AABCK4819M1Z3",
    consignee: "Bharat Industrial & Renewables LLP",
    consigneeGstin: "27AAACB1234D1Z5",
    hsnCode: "14049090 (Groundnut Shell Raw)",
    materialName: "Groundnut Shell (GS)",
    declaredQtyMT: 24.5,
    transporter: "Shree Ganesh Roadways",
    driverName: "Pandurang Patil",
    driverLicenseNo: "MH-12-2012-0044192",
    driverMobile: "+91 98224 81920",
    vehicleFitnessValidUntil: "30-Nov-2026",
    insuranceValidUntil: "15-Jan-2027",
    pucValidUntil: "22-Oct-2026",
    verificationStatus: "VERIFIED",
    verifiedAt: "14:18 IST",
    verifiedBy: "Ramesh Pawar (Gate 1)",
    notes: "All 4 statutory checks passed. Weight matched against PO quota. Directed to WB-01 Gross scale.",
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
    consignorGstin: "27AABCK3391J1Z2",
    consignee: "Bharat Industrial & Renewables LLP",
    consigneeGstin: "27AAACB1234D1Z5",
    hsnCode: "14049090 (Cotton Stalk Shredded)",
    materialName: "Cotton Stalk Shredded (CS)",
    declaredQtyMT: 22.8,
    transporter: "Balaji Cargo Movers",
    driverName: "Vinod Shinde",
    driverLicenseNo: "MH-15-2018-0099412",
    driverMobile: "+91 97631 00293",
    vehicleFitnessValidUntil: "10-Oct-2026",
    insuranceValidUntil: "04-Dec-2026",
    pucValidUntil: "18-Nov-2026",
    verificationStatus: "VERIFIED",
    verifiedAt: "14:42 IST",
    verifiedBy: "Ramesh Pawar (Gate 1)",
    notes: "e-Way bill active. Driver credentials verified. Clear for Gross weighment.",
  },
  {
    id: "doc-004",
    vehicleNo: "MH 31 CB 7721",
    ewayBillNo: "EWB-9912-3401-8821",
    ewayBillDate: "02-Oct-2026, 14:00",
    validUntil: "03-Oct-2026, 12:00", // Expired
    poOrSoNo: "PO-2026-0985",
    challanOrLrNo: "CH-774012",
    consignor: "Vidarbha Wood Processors LLP",
    consignorGstin: "27AABCV8812K1Z9",
    consignee: "Bharat Industrial & Renewables LLP",
    consigneeGstin: "27AAACB1234D1Z5",
    hsnCode: "44013900 (Sawdust Fine)",
    materialName: "Sawdust Fine (SD)",
    declaredQtyMT: 31.0,
    transporter: "Nagpur Express Fleet",
    driverName: "Prakash Meshram",
    driverLicenseNo: "MH-31-2011-0022198",
    driverMobile: "+91 98231 44109",
    vehicleFitnessValidUntil: "19-Jan-2027",
    insuranceValidUntil: "11-May-2027",
    pucValidUntil: "05-Nov-2026",
    verificationStatus: "EXPIRED",
    mismatchReason: "e-Way bill validity expired at 12:00 PM (Overdue by 3h 15m). Supplier needs to extend validity on GST portal before gate entry.",
    notes: "Driver instructed to halt in holding bay. Contacted consignor dispatch desk to extend validity.",
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
    consignorGstin: "27AABCW1102P1Z4",
    consignee: "Bharat Industrial & Renewables LLP",
    consigneeGstin: "27AAACB1234D1Z5",
    hsnCode: "14049090 (Sawdust Fine)",
    materialName: "Sawdust Fine (SD)",
    declaredQtyMT: 31.2,
    transporter: "Maharashtra Freightways",
    driverName: "Sanjay Thorat",
    driverLicenseNo: "MH-14-2016-0033109",
    driverMobile: "+91 94220 18239",
    vehicleFitnessValidUntil: "25-Jan-2027",
    insuranceValidUntil: "14-Feb-2027",
    pucValidUntil: "30-Nov-2026",
    verificationStatus: "VERIFIED",
    verifiedAt: "13:52 IST",
    verifiedBy: "Ramesh Pawar (Gate 1)",
    notes: "Verified and stamped. Currently unloading at Yard B Bay 04.",
  },
  {
    id: "doc-006",
    vehicleNo: "MH 12 BP 5504",
    gateEntryNo: "RM-GATE-261003-006",
    ewayBillNo: "EWB-5501-9981-2231",
    ewayBillDate: "03-Oct-2026, 11:20",
    validUntil: "04-Oct-2026, 23:59",
    poOrSoNo: "PO-2026-0987",
    challanOrLrNo: "CH-881290",
    consignor: "Pune Agro Farmers Producer Co",
    consignorGstin: "27AABCP9901M1Z1",
    consignee: "Bharat Industrial & Renewables LLP",
    consigneeGstin: "27AAACB1234D1Z5",
    hsnCode: "14049090 (Mustard Husk)",
    materialName: "Mustard Husk Stalk (MH)",
    declaredQtyMT: 21.0,
    transporter: "Shree Ganesh Roadways",
    driverName: "Baburao Kadam",
    driverLicenseNo: "MH-12-2014-0077189",
    driverMobile: "+91 98501 22891",
    vehicleFitnessValidUntil: "14-Dec-2026",
    insuranceValidUntil: "20-Jan-2027",
    pucValidUntil: "08-Nov-2026",
    verificationStatus: "VERIFIED",
    verifiedAt: "13:18 IST",
    verifiedBy: "Ramesh Pawar (Gate 1)",
    notes: "Verified at entry. Tare weighment completed.",
  },
  {
    id: "doc-007",
    vehicleNo: "MH 09 CW 3319",
    ewayBillNo: "EWB-6610-8812-3341",
    ewayBillDate: "03-Oct-2026, 13:00",
    validUntil: "04-Oct-2026, 23:59",
    poOrSoNo: "PO-2026-0982",
    challanOrLrNo: "CH-119420",
    consignor: "Kolhapur Agro Biomass Union",
    consignorGstin: "27AABCK1194H1Z6",
    consignee: "Bharat Industrial & Renewables LLP",
    consigneeGstin: "27AAACB1234D1Z5",
    hsnCode: "14049090 (Groundnut Shell)",
    materialName: "Groundnut Shell (GS)",
    declaredQtyMT: 26.5,
    transporter: "Sahyadri Logistics",
    driverName: "Sanjay Mane",
    driverLicenseNo: "MH-09-2017-0055102",
    driverMobile: "+91 98220 11942",
    vehicleFitnessValidUntil: "12-Jan-2027",
    insuranceValidUntil: "28-Mar-2027",
    pucValidUntil: "15-Dec-2026",
    verificationStatus: "PENDING",
    notes: "Approaching vehicle ETA 8 mins. Pre-verified through advance WhatsApp challan scan.",
  },
];

interface GateDocVerificationProps {
  vehicles: GateVehicle[];
  onUpdateStage: (vehicleId: string, newStage: GateStage) => void;
  onNavigateTab: (tabId: string) => void;
}

export function GateDocVerification({
  vehicles,
  onUpdateStage,
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

  // Filter & Search states
  const [docRecords, setDocRecords] = useState<DocVerificationItem[]>(INITIAL_DOC_RECORDS);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "VERIFIED" | "FLAGGED_MISMATCH" | "EXPIRED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Scanner Simulator State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Active Document for Audit Modal
  const [selectedDoc, setSelectedDoc] = useState<DocVerificationItem | null>(null);

  // 4-Point Document Checklist
  const [docChecklist, setDocChecklist] = useState({
    ewayBillValid: false,
    vehicleNoMatched: false,
    gstinAndPoMatched: false,
    driverDlAndFitnessValid: false,
  });
  const [auditNotes, setAuditNotes] = useState("");

  // Success Verification Stamp Modal
  const [stampedRecord, setStampedRecord] = useState<DocVerificationItem | null>(null);

  // Stats Calculations
  const stats = useMemo(() => {
    const total = docRecords.length;
    const pending = docRecords.filter((d) => d.verificationStatus === "PENDING").length;
    const verified = docRecords.filter((d) => d.verificationStatus === "VERIFIED").length;
    const discrepancies = docRecords.filter(
      (d) => d.verificationStatus === "FLAGGED_MISMATCH" || d.verificationStatus === "EXPIRED"
    ).length;
    return { total, pending, verified, discrepancies };
  }, [docRecords]);

  // Filtered List
  const filteredRecords = useMemo(() => {
    return docRecords.filter((doc) => {
      if (statusFilter !== "ALL" && doc.verificationStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          doc.vehicleNo.toLowerCase().includes(q) ||
          doc.ewayBillNo.toLowerCase().includes(q) ||
          doc.poOrSoNo.toLowerCase().includes(q) ||
          doc.consignor.toLowerCase().includes(q) ||
          doc.driverName.toLowerCase().includes(q) ||
          doc.materialName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [docRecords, statusFilter, searchQuery]);

  // Open Document Audit Modal
  const handleOpenAuditModal = (doc: DocVerificationItem) => {
    setSelectedDoc(doc);
    const isAlreadyVerified = doc.verificationStatus === "VERIFIED";
    setDocChecklist({
      ewayBillValid: isAlreadyVerified || doc.verificationStatus !== "EXPIRED",
      vehicleNoMatched: isAlreadyVerified || doc.verificationStatus !== "FLAGGED_MISMATCH",
      gstinAndPoMatched: isAlreadyVerified,
      driverDlAndFitnessValid: isAlreadyVerified,
    });
    setAuditNotes(
      doc.notes ||
        `Verified e-Way Bill #${doc.ewayBillNo}. Declared ${doc.declaredQtyMT} MT. Transporter: ${doc.transporter}.`
    );
  };

  const handleSelectAllChecks = () => {
    setDocChecklist({
      ewayBillValid: true,
      vehicleNoMatched: true,
      gstinAndPoMatched: true,
      driverDlAndFitnessValid: true,
    });
  };

  const isChecklistComplete =
    docChecklist.ewayBillValid &&
    docChecklist.vehicleNoMatched &&
    docChecklist.gstinAndPoMatched &&
    docChecklist.driverDlAndFitnessValid;

  // Approve & Stamp Document
  const handleApproveDocument = () => {
    if (!selectedDoc) return;

    const verifiedRecord: DocVerificationItem = {
      ...selectedDoc,
      verificationStatus: "VERIFIED",
      verifiedAt: `${currentTime} IST`,
      verifiedBy: "Ramesh Pawar (Gate 1)",
      notes: auditNotes,
    };

    // Update state
    setDocRecords((prev) =>
      prev.map((d) => (d.id === selectedDoc.id ? verifiedRecord : d))
    );

    // If there is a matching vehicle in gate vehicles, update stage if needed
    const matchingVeh = vehicles.find((v) => v.vehicleNo === selectedDoc.vehicleNo);
    if (matchingVeh && matchingVeh.stage === "ARRIVED_AT_GATE") {
      onUpdateStage(matchingVeh.id, "WAITING_WEIGHMENT");
    }

    setSelectedDoc(null);
    setStampedRecord(verifiedRecord);
  };

  // Flag Discrepancy / Reject
  const handleFlagDiscrepancy = (reason: string) => {
    if (!selectedDoc) return;

    const flaggedRecord: DocVerificationItem = {
      ...selectedDoc,
      verificationStatus: "FLAGGED_MISMATCH",
      mismatchReason: reason,
      notes: `FLAGGED: ${reason}. Hold vehicle in verification lane.`,
    };

    setDocRecords((prev) =>
      prev.map((d) => (d.id === selectedDoc.id ? flaggedRecord : d))
    );

    setSelectedDoc(null);
  };

  // Simulate Scanning QR code / Barcode
  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult("Scanned: EWB-3301-8842-9901 · Vehicle: MH 49 TR 8819 · Match 100%");
      // Open the corresponding document
      const item = docRecords.find((d) => d.ewayBillNo === "EWB-3301-8842-9901");
      if (item) {
        handleOpenAuditModal(item);
      }
    }, 1800);
  };

  return (
    <div className="space-y-12 md:space-y-14 select-none">
      {/* 
        ============================================================
        1. COMMAND HEADER & STATUTORY TELEMETRY BAR
        ============================================================
      */}
      <section className="space-y-6">
        {/* Section Header with Large Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs md:text-sm font-medium text-neutral-400 block tracking-normal">
              Statutory Rule 138 CGST · GST Portal Integration
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mt-1">
              Document Verification Desk
            </h1>
          </div>

          {/* Quick Actions & Live Clock (Responsive Grid on Mobile) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            {/* Clock Box */}
            <div
              className="col-span-2 sm:col-span-1 px-3.5 h-10 border border-neutral-300 bg-transparent flex items-center justify-between sm:justify-start gap-2 shrink-0"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase">IST</span>
                  <span className="text-xs font-bold text-neutral-900 tabular-nums">
                    {currentTime || "15:10:00"}
                  </span>
                </div>
              </div>
              <span className="sm:hidden text-[9px] font-bold text-[#059669] px-1.5 py-0.5 border border-emerald-300 bg-emerald-50">
                PORTAL LIVE
              </span>
            </div>

            {/* Quick QR Scanner Simulator */}
            <button
              type="button"
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="col-span-2 sm:col-span-1 h-10 px-3.5 border border-neutral-300 bg-transparent hover:bg-neutral-200/50 text-neutral-800 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0"
              style={{ borderRadius: 0 }}
            >
              <QrCode className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
              <span>{isScanning ? "Scanning Optical Code..." : "Scan e-Way Bill QR"}</span>
            </button>

            {/* Back to Vehicle Tracker */}
            <button
              type="button"
              onClick={() => onNavigateTab("live-tracker")}
              className="h-10 px-2 sm:px-3.5 border border-neutral-300 bg-transparent hover:bg-neutral-200/50 text-neutral-800 text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-colors shrink-0"
              style={{ borderRadius: 0 }}
            >
              <Truck className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <span>Fleet Tracker</span>
            </button>

            {/* Back to Ops Hub */}
            <button
              type="button"
              onClick={() => onNavigateTab("home")}
              className="h-10 px-2 sm:px-3.5 bg-[#18181B] hover:bg-black text-white text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-colors shrink-0"
              style={{ borderRadius: 0 }}
            >
              <span>Ops Hub</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
            </button>
          </div>
        </div>

        {/* Section 1 Card */}
        <div
          className="bg-transparent border border-neutral-300 p-4 sm:p-5 space-y-4"
          style={{ borderRadius: 0 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-emerald-300 bg-emerald-50/70 text-[10px] font-bold uppercase tracking-wider text-[#047857]">
                <span className="w-1.5 h-1.5 bg-[#059669] animate-pulse inline-block shrink-0" />
                <span>GST e-Way Bill API Linked</span>
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-[11px] font-semibold text-neutral-600">Statutory Rule 138 CGST</span>
            </div>
            <p className="text-xs text-neutral-500">
              Statutory e-Way bill audit, Part-B vehicle registration matching, PO validation, and driver KYC clearance.
            </p>
          </div>

          {/* GST e-Way Bill Integration Health Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border border-neutral-200 bg-neutral-50">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <div className="text-xs">
                <span className="font-bold text-neutral-900 uppercase">
                  GST Common Portal EWB API:
                </span>{" "}
                <span className="text-neutral-700 font-semibold">
                  Online · Response: 32ms · NIC Gateway Active
                </span>
                {scanResult && (
                  <span className="ml-3 text-xs font-bold text-[#059669] animate-pulse">
                    ● {scanResult}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span>
                Plant GSTIN: <strong className="text-neutral-800 font-mono">27AAACB1234D1Z5</strong>
              </span>
              <span className="hidden md:inline">|</span>
              <span>
                Security Officer: <strong className="text-neutral-800">Ramesh Pawar (#SEC-014)</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ============================================================
        2. SHIFT 01 STATUTORY VERIFICATION KPIS
        ============================================================
      */}
      <section className="space-y-6">
        {/* Section Header with Large Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs md:text-sm font-medium text-neutral-400 block tracking-normal">
              Shift 01 Compliance Audits
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
              Statutory Audit Telemetry & Metrics
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-neutral-300 text-xs font-medium text-neutral-700">
              <span className="w-2 h-2 bg-[#059669] inline-block" />
              <span>100% Tax Compliant</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Pending Audit Queue */}
        <div
          className="bg-white border border-neutral-300 p-4 flex flex-col justify-between"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Awaiting Audit</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tabular-nums">
              {stats.pending}
            </span>
            <span className="text-xs text-neutral-500">vehicles</span>
          </div>
          <div className="text-[11px] text-neutral-500 border-t border-neutral-200 pt-2 mt-2 flex items-center justify-between">
            <span>Queue at Gate 01 barrier</span>
            <span className="font-semibold text-amber-600">Action needed</span>
          </div>
        </div>

        {/* KPI 2: Verified Today */}
        <div
          className="bg-white border border-neutral-300 p-4 flex flex-col justify-between"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Verified & Cleared</span>
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tabular-nums">
              {stats.verified}
            </span>
            <span className="text-xs text-neutral-500">consignments</span>
          </div>
          <div className="text-[11px] text-neutral-500 border-t border-neutral-200 pt-2 mt-2 flex items-center justify-between">
            <span>Passes stamped & issued</span>
            <span className="font-semibold text-neutral-800">Shift 01</span>
          </div>
        </div>

        {/* KPI 3: Discrepancies / Flagged */}
        <div
          className="bg-white border border-neutral-300 p-4 flex flex-col justify-between"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Flagged / Expired</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tabular-nums text-red-600">
              {stats.discrepancies}
            </span>
            <span className="text-xs text-neutral-500">held</span>
          </div>
          <div className="text-[11px] text-neutral-500 border-t border-neutral-200 pt-2 mt-2 flex items-center justify-between">
            <span>Expired EWB / Mismatch</span>
            <span className="font-semibold text-red-600">Held at lane</span>
          </div>
        </div>

        {/* KPI 4: Turnaround Speed */}
        <div
          className="bg-white border border-neutral-300 p-4 flex flex-col justify-between"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Audit Speed</span>
            <Clock className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tabular-nums">
              3.2
            </span>
            <span className="text-xs text-neutral-500">mins / truck</span>
          </div>
          <div className="text-[11px] text-neutral-500 border-t border-neutral-200 pt-2 mt-2 flex items-center justify-between">
            <span>Target: &lt; 5.0 mins</span>
            <span className="font-semibold text-[#059669]">High Throughput</span>
          </div>
        </div>
      </div>
    </section>

      {/* 
        ============================================================
        3. SEARCH & STATUS FILTER CONTROLS & CONSIGNMENTS
        ============================================================
      */}
      <section className="space-y-6">
        {/* Section Header with Large Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs md:text-sm font-medium text-neutral-400 block tracking-normal">
              Active Consignment Documentation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
              e-Way Bill & PO Verification Registry
            </h2>
          </div>

          <div className="text-xs text-neutral-500">
            Showing <strong className="text-neutral-900">{filteredRecords.length}</strong> of <strong>{docRecords.length}</strong> statutory documents
          </div>
        </div>

        <div
          className="bg-white border border-neutral-300 p-4 space-y-4"
          style={{ borderRadius: 0 }}
        >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          {/* Status Filter Tabs (Scrollable on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full md:flex-wrap">
            {(
              [
                { key: "ALL", label: "All Docs", count: stats.total },
                { key: "PENDING", label: "Pending Verification", count: stats.pending },
                { key: "VERIFIED", label: "Verified & Cleared", count: stats.verified },
                { key: "EXPIRED", label: "Expired EWB", count: docRecords.filter(d => d.verificationStatus === "EXPIRED").length },
                { key: "FLAGGED_MISMATCH", label: "Flagged Mismatch", count: docRecords.filter(d => d.verificationStatus === "FLAGGED_MISMATCH").length },
              ] as const
            ).map((tab) => {
              const isSelected = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap ${
                    isSelected
                      ? "bg-[#18181B] text-white border-[#18181B]"
                      : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-bold ${
                      isSelected
                        ? "bg-[#059669] text-white"
                        : "bg-neutral-200 text-neutral-800"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-neutral-500">
            Showing <strong>{filteredRecords.length}</strong> consignments
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Vehicle Plate (e.g. MH 49), e-Way Bill #, PO #, Consignor Name, Driver, or Material..."
            className="w-full pl-9 pr-4 py-2 border border-neutral-300 bg-neutral-50 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-700 focus:bg-white transition-colors"
            style={{ borderRadius: 0 }}
          />
        </div>
      </div>

      {/* 
        ============================================================
        4. DOCUMENT VERIFICATION CONSIGNMENTS TABLE
        ============================================================
      */}
      <div
        className="bg-white border border-neutral-300 overflow-hidden"
        style={{ borderRadius: 0 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Vehicle No</th>
                <th className="py-2.5 px-3">e-Way Bill # & Validity</th>
                <th className="py-2.5 px-3">PO / Challan #</th>
                <th className="py-2.5 px-3">Consignor (Supplier) & GSTIN</th>
                <th className="py-2.5 px-3">Material & Declared MT</th>
                <th className="py-2.5 px-3">Driver & DL</th>
                <th className="py-2.5 px-3">Statutory Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredRecords.map((record) => {
                const isVerified = record.verificationStatus === "VERIFIED";
                const isExpired = record.verificationStatus === "EXPIRED";
                const isFlagged = record.verificationStatus === "FLAGGED_MISMATCH";

                return (
                  <tr key={record.id} className="hover:bg-neutral-50 transition-colors">
                    {/* Vehicle Plate */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-neutral-900 text-xs px-2 py-0.5 border border-neutral-400 bg-neutral-50 inline-block">
                        {record.vehicleNo}
                      </div>
                      {record.gateEntryNo && (
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          {record.gateEntryNo}
                        </div>
                      )}
                    </td>

                    {/* e-Way Bill & Validity */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-neutral-900 font-mono text-[11px]">
                        {record.ewayBillNo}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        Valid: <span className={isExpired ? "text-red-600 font-bold" : "text-neutral-700"}>{record.validUntil}</span>
                      </div>
                    </td>

                    {/* PO & Challan */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-neutral-800">{record.poOrSoNo}</div>
                      <div className="text-[10px] text-neutral-500">{record.challanOrLrNo}</div>
                    </td>

                    {/* Consignor */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-neutral-900">{record.consignor}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{record.consignorGstin}</div>
                    </td>

                    {/* Material & Declared MT */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-neutral-900">{record.materialName}</div>
                      <div className="text-[11px] font-bold text-[#059669] tabular-nums">
                        {record.declaredQtyMT.toFixed(2)} MT
                      </div>
                    </td>

                    {/* Driver & License */}
                    <td className="py-3 px-3">
                      <div className="text-neutral-800 font-medium">{record.driverName}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{record.driverLicenseNo}</div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 border inline-flex items-center gap-1 ${
                          isVerified
                            ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                            : isExpired
                            ? "bg-red-50 text-red-700 border-red-300"
                            : isFlagged
                            ? "bg-amber-50 text-amber-700 border-amber-300"
                            : "bg-blue-50 text-blue-700 border-blue-300"
                        }`}
                      >
                        {isVerified && <Check className="w-3 h-3" />}
                        {isExpired && <AlertTriangle className="w-3 h-3" />}
                        {isFlagged && <AlertTriangle className="w-3 h-3" />}
                        {record.verificationStatus.replace(/_/g, " ")}
                      </span>
                      {record.verifiedAt && (
                        <div className="text-[9px] text-neutral-500 mt-0.5">
                          {record.verifiedAt} · {record.verifiedBy?.split(" ")[0]}
                        </div>
                      )}
                      {record.mismatchReason && (
                        <div className="text-[10px] text-red-600 mt-0.5 max-w-[200px] leading-tight">
                          {record.mismatchReason}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenAuditModal(record)}
                        className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                          isVerified
                            ? "bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-100"
                            : "bg-[#059669] hover:bg-[#047857] text-white shadow-sm"
                        }`}
                        style={{ borderRadius: 0 }}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{isVerified ? "Review Audit" : "Audit Documents"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-xs text-neutral-500">
                    No documents found matching the selected filter or search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>

      {/* 
        ============================================================
        5. DOCUMENT AUDIT & STATUTORY CHECKLIST MODAL
        ============================================================
      */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.15 }}
              className="bg-white border border-neutral-800 w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
              style={{ borderRadius: 0 }}
            >
              {/* Modal Header */}
              <div className="p-4 bg-[#18181B] text-white flex items-center justify-between border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 bg-[#059669] text-white flex items-center justify-center font-bold text-sm"
                    style={{ borderRadius: 0 }}
                  >
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">
                      Statutory Document Verification · e-Way Bill & PO Audit
                    </h3>
                    <div className="text-[11px] text-neutral-300">
                      Vehicle: <strong className="text-white">{selectedDoc.vehicleNo}</strong> · e-Way Bill:{" "}
                      <span className="font-mono text-[#A7F3D0]">{selectedDoc.ewayBillNo}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-5 text-xs">
                {/* Two-Column Document Inspection Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column: Digital e-Way Bill Manifest Card */}
                  <div className="border border-neutral-300 p-4 space-y-3 bg-neutral-50/50">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <span className="font-bold uppercase tracking-wider text-neutral-900 text-[11px] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-neutral-700" />
                        e-Way Bill Manifest Data (GST Portal)
                      </span>
                      <span className="font-mono text-[10px] text-neutral-500">NIC API v1.03</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block font-semibold">e-Way Bill #</span>
                        <span className="font-bold text-neutral-900 font-mono text-xs">{selectedDoc.ewayBillNo}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Gen Date</span>
                        <span className="text-neutral-800">{selectedDoc.ewayBillDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Valid Until</span>
                        <span className="font-bold text-neutral-900">{selectedDoc.validUntil}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block font-semibold">HSN Code</span>
                        <span className="text-neutral-800 font-mono">{selectedDoc.hsnCode}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Consignor (Supplier)</span>
                        <span className="font-bold text-neutral-900">{selectedDoc.consignor}</span>
                        <span className="font-mono text-[10px] text-neutral-500 block">{selectedDoc.consignorGstin}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Consignee (Plant)</span>
                        <span className="font-bold text-neutral-900">{selectedDoc.consignee}</span>
                        <span className="font-mono text-[10px] text-neutral-500 block">{selectedDoc.consigneeGstin}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Declared Cargo</span>
                        <span className="font-bold text-neutral-900">{selectedDoc.materialName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Declared Weight</span>
                        <span className="font-extrabold text-[#059669] text-xs tabular-nums">
                          {selectedDoc.declaredQtyMT.toFixed(2)} MT
                        </span>
                      </div>
                    </div>

                    {/* Driver & Commercial Vehicle Statutory Validity Strip */}
                    <div className="p-2.5 bg-white border border-neutral-300 space-y-1.5 mt-2">
                      <div className="text-[10px] font-bold uppercase text-neutral-700">
                        Driver & Vehicle Statutory Validity
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="bg-neutral-50 p-1 border border-neutral-200">
                          <span className="text-neutral-500 block">Fitness Valid</span>
                          <strong className="text-neutral-800">{selectedDoc.vehicleFitnessValidUntil}</strong>
                        </div>
                        <div className="bg-neutral-50 p-1 border border-neutral-200">
                          <span className="text-neutral-500 block">Insurance</span>
                          <strong className="text-neutral-800">{selectedDoc.insuranceValidUntil}</strong>
                        </div>
                        <div className="bg-neutral-50 p-1 border border-neutral-200">
                          <span className="text-neutral-500 block">PUCC</span>
                          <strong className="text-neutral-800">{selectedDoc.pucValidUntil}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: 4-Point Mandatory Statutory Audit Checklist */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-neutral-200 pb-2 mb-3">
                        <span className="font-bold uppercase tracking-wider text-neutral-900 text-[11px] flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                          Mandatory Gate Checklist (4 Checks)
                        </span>
                        <button
                          type="button"
                          onClick={handleSelectAllChecks}
                          className="text-[11px] font-semibold text-[#059669] hover:underline cursor-pointer"
                        >
                          Select All Checks
                        </button>
                      </div>

                      <div className="space-y-2">
                        {/* Check 1 */}
                        <label
                          onClick={() =>
                            setDocChecklist((p) => ({ ...p, ewayBillValid: !p.ewayBillValid }))
                          }
                          className={`p-2.5 border cursor-pointer transition-colors flex items-start gap-2.5 ${
                            docChecklist.ewayBillValid
                              ? "bg-[#ECFDF5] border-[#A7F3D0]"
                              : "bg-white border-neutral-300 hover:border-neutral-500"
                          }`}
                          style={{ borderRadius: 0 }}
                        >
                          <div
                            className={`w-4 h-4 mt-0.5 border flex items-center justify-center shrink-0 ${
                              docChecklist.ewayBillValid
                                ? "bg-[#059669] border-[#059669] text-white"
                                : "border-neutral-400 bg-white"
                            }`}
                          >
                            {docChecklist.ewayBillValid && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900">
                              1. e-Way Bill Active & Unexpired
                            </div>
                            <div className="text-[10px] text-neutral-600">
                              Valid until {selectedDoc.validUntil}. Status verified against NIC GST API.
                            </div>
                          </div>
                        </label>

                        {/* Check 2 */}
                        <label
                          onClick={() =>
                            setDocChecklist((p) => ({ ...p, vehicleNoMatched: !p.vehicleNoMatched }))
                          }
                          className={`p-2.5 border cursor-pointer transition-colors flex items-start gap-2.5 ${
                            docChecklist.vehicleNoMatched
                              ? "bg-[#ECFDF5] border-[#A7F3D0]"
                              : "bg-white border-neutral-300 hover:border-neutral-500"
                          }`}
                          style={{ borderRadius: 0 }}
                        >
                          <div
                            className={`w-4 h-4 mt-0.5 border flex items-center justify-center shrink-0 ${
                              docChecklist.vehicleNoMatched
                                ? "bg-[#059669] border-[#059669] text-white"
                                : "border-neutral-400 bg-white"
                            }`}
                          >
                            {docChecklist.vehicleNoMatched && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900">
                              2. Part-B Vehicle Number Matches Plate
                            </div>
                            <div className="text-[10px] text-neutral-600">
                              Physical plate <strong>{selectedDoc.vehicleNo}</strong> exactly matches e-Way bill Part-B conveyance details.
                            </div>
                          </div>
                        </label>

                        {/* Check 3 */}
                        <label
                          onClick={() =>
                            setDocChecklist((p) => ({ ...p, gstinAndPoMatched: !p.gstinAndPoMatched }))
                          }
                          className={`p-2.5 border cursor-pointer transition-colors flex items-start gap-2.5 ${
                            docChecklist.gstinAndPoMatched
                              ? "bg-[#ECFDF5] border-[#A7F3D0]"
                              : "bg-white border-neutral-300 hover:border-neutral-500"
                          }`}
                          style={{ borderRadius: 0 }}
                        >
                          <div
                            className={`w-4 h-4 mt-0.5 border flex items-center justify-center shrink-0 ${
                              docChecklist.gstinAndPoMatched
                                ? "bg-[#059669] border-[#059669] text-white"
                                : "border-neutral-400 bg-white"
                            }`}
                          >
                            {docChecklist.gstinAndPoMatched && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900">
                              3. PO / SO Reference & Plant GSTIN Verified
                            </div>
                            <div className="text-[10px] text-neutral-600">
                              {selectedDoc.poOrSoNo} cross-checked with ERP quota. Consignee GSTIN confirmed.
                            </div>
                          </div>
                        </label>

                        {/* Check 4 */}
                        <label
                          onClick={() =>
                            setDocChecklist((p) => ({
                              ...p,
                              driverDlAndFitnessValid: !p.driverDlAndFitnessValid,
                            }))
                          }
                          className={`p-2.5 border cursor-pointer transition-colors flex items-start gap-2.5 ${
                            docChecklist.driverDlAndFitnessValid
                              ? "bg-[#ECFDF5] border-[#A7F3D0]"
                              : "bg-white border-neutral-300 hover:border-neutral-500"
                          }`}
                          style={{ borderRadius: 0 }}
                        >
                          <div
                            className={`w-4 h-4 mt-0.5 border flex items-center justify-center shrink-0 ${
                              docChecklist.driverDlAndFitnessValid
                                ? "bg-[#059669] border-[#059669] text-white"
                                : "border-neutral-400 bg-white"
                            }`}
                          >
                            {docChecklist.driverDlAndFitnessValid && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900">
                              4. Driver License & Vehicle Statutory Fitness
                            </div>
                            <div className="text-[10px] text-neutral-600">
                              DL #{selectedDoc.driverLicenseNo} verified. Fitness, PUC, and Insurance in date.
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Officer Notes */}
                    <div>
                      <label className="text-[10px] text-neutral-500 uppercase block font-semibold mb-1">
                        Security Verification Remarks
                      </label>
                      <input
                        type="text"
                        value={auditNotes}
                        onChange={(e) => setAuditNotes(e.target.value)}
                        placeholder="Add compliance notes or observation details..."
                        className="w-full px-3 py-2 border border-neutral-300 bg-neutral-50 text-xs focus:outline-none focus:border-neutral-700"
                        style={{ borderRadius: 0 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-neutral-100 border-t border-neutral-300 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleFlagDiscrepancy("Vehicle plate does not match e-Way bill Part-B conveyance.")}
                    className="px-3 py-2 border border-red-300 bg-white hover:bg-red-50 text-red-700 text-xs font-semibold cursor-pointer"
                    style={{ borderRadius: 0 }}
                  >
                    Flag Plate Mismatch
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFlagDiscrepancy("e-Way bill validity expired. Extension required.")}
                    className="px-3 py-2 border border-amber-300 bg-white hover:bg-amber-50 text-amber-700 text-xs font-semibold cursor-pointer"
                    style={{ borderRadius: 0 }}
                  >
                    Flag Expired EWB
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDoc(null)}
                    className="px-4 py-2 border border-neutral-300 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                    style={{ borderRadius: 0 }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={!isChecklistComplete}
                    onClick={handleApproveDocument}
                    className={`px-5 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      isChecklistComplete
                        ? "bg-[#059669] hover:bg-[#047857] text-white shadow-md"
                        : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>APPROVE & STAMP GATE PASS</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
        ============================================================
        6. PRINTABLE DOCUMENT VERIFICATION SLIP MODAL
        ============================================================
      */}
      <AnimatePresence>
        {stampedRecord && (
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
                  <span>Statutory Document Verification Certificate Stamped</span>
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
                    onClick={() => setStampedRecord(null)}
                    className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Certificate Content */}
              <div className="p-6 space-y-4 text-neutral-900 bg-white select-text">
                <div className="border-b-2 border-neutral-900 pb-3 flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight uppercase">
                      Bharat Industrial & Renewables LLP
                    </h2>
                    <p className="text-[11px] text-neutral-600">
                      Plant Security Operations · Inbound / Outbound Gate Checkpoint
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">
                      Statutory GST e-Way Bill & Delivery Verification Clearance
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-bold text-neutral-500 uppercase">Verification Slip</div>
                    <div className="text-sm font-extrabold tabular-nums tracking-wider text-neutral-900">
                      DOC-261003-{stampedRecord.id.replace("doc-", "")}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{stampedRecord.verifiedAt}</div>
                  </div>
                </div>

                {/* Details Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-neutral-200 pb-3">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Vehicle Plate</span>
                    <span className="font-extrabold text-sm text-neutral-900">{stampedRecord.vehicleNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">e-Way Bill #</span>
                    <span className="font-bold font-mono text-neutral-800">{stampedRecord.ewayBillNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">PO Reference</span>
                    <span className="font-semibold text-neutral-800">{stampedRecord.poOrSoNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Declared Weight</span>
                    <span className="font-extrabold text-[#059669]">{stampedRecord.declaredQtyMT.toFixed(2)} MT</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs border-b border-neutral-200 pb-3">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Consignor</span>
                    <span className="font-semibold text-neutral-900">{stampedRecord.consignor}</span>
                    <span className="text-[10px] text-neutral-500 font-mono block">{stampedRecord.consignorGstin}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Transporter & Driver</span>
                    <span className="font-semibold text-neutral-900">{stampedRecord.transporter}</span>
                    <span className="text-[10px] text-neutral-600 block">
                      Driver: {stampedRecord.driverName} ({stampedRecord.driverMobile})
                    </span>
                  </div>
                </div>

                {/* Statutory Stamped Box */}
                <div className="border border-neutral-400 p-3 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#059669] tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#059669]" />
                      <span>STATUTORY CLEARANCE PASSED · GATE ENTRY AUTHORIZED</span>
                    </div>
                    <div className="text-[11px] text-neutral-700 mt-1">
                      Verified & Stamped by: <strong>{stampedRecord.verifiedBy}</strong>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      e-Way Bill, Part-B conveyance, and driver statutory credentials verified. Proceed to Weighbridge Platform 01.
                    </div>
                  </div>
                  <div className="w-16 h-16 border border-neutral-400 bg-white flex flex-col items-center justify-center shrink-0">
                    <QrCode className="w-10 h-10 text-neutral-800" />
                    <span className="text-[8px] font-mono text-neutral-500 mt-0.5">AUTHENTIC</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-3 bg-neutral-100 border-t border-neutral-300 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStampedRecord(null)}
                  className="px-4 py-2 bg-[#18181B] text-white text-xs font-semibold cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  Close & Proceed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
