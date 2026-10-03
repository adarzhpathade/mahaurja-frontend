"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  User,
  Plus,
  Search,
  FileText,
  Phone,
  Radio,
  Zap,
  Check,
  ChevronRight,
  Printer,
  Calendar,
  Layers,
  Camera,
  RotateCcw,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Compass,
  CheckSquare,
  Square,
  Key,
} from "lucide-react";
import { GateVehicle } from "@/lib/types/gate";

interface GateHomeProps {
  onNavigateTab: (tabId: string) => void;
  onOpenEntryModal: (prefillData?: Partial<GateVehicle>) => void;
}

interface ExpectedArrival {
  id: string;
  poNo: string;
  supplierName: string;
  vehicleNo: string;
  transporter: string;
  materialName: string;
  expectedWeightMT: number;
  timeWindow: string;
  etaMinutes: number;
  status: "APPROACHING" | "ON_SCHEDULE" | "DELAYED";
  driverName: string;
  driverPhone: string;
  farmCluster: string;
}

interface ActivityEvent {
  id: string;
  time: string;
  type: "ENTRY" | "EXIT" | "SAFETY" | "ALERT";
  title: string;
  description: string;
  badgeText: string;
  badgeBorder: string;
  badgeTextCol: string;
  dotColor: string;
}

interface SafetyCheckItem {
  id: string;
  label: string;
  desc: string;
  checked: boolean;
  time?: string;
}

const INITIAL_EXPECTED_ARRIVALS: ExpectedArrival[] = [
  {
    id: "EXP-01",
    poNo: "PO-2026-0982",
    supplierName: "Kolhapur Agro Biomass Union",
    vehicleNo: "MH 09 CW 3319",
    transporter: "Sahyadri Logistics",
    materialName: "Groundnut Shell (GS)",
    expectedWeightMT: 26.5,
    timeWindow: "16:45 – 17:15",
    etaMinutes: 8,
    status: "APPROACHING",
    driverName: "Sanjay Mane",
    driverPhone: "+91 98220 11942",
    farmCluster: "Hatkangale Agro Belt (Tier 1)",
  },
  {
    id: "EXP-02",
    poNo: "PO-2026-0985",
    supplierName: "Vidarbha Wood Processors LLP",
    vehicleNo: "MH 31 CB 7721",
    transporter: "Nagpur Express Fleet",
    materialName: "Sawdust Fine (SD)",
    expectedWeightMT: 31.0,
    timeWindow: "17:00 – 17:30",
    etaMinutes: 24,
    status: "ON_SCHEDULE",
    driverName: "Anil Wankhede",
    driverPhone: "+91 94221 88301",
    farmCluster: "Nagpur Timber Zone",
  },
  {
    id: "EXP-03",
    poNo: "PO-2026-0988",
    supplierName: "Solapur Biofuels Cluster",
    vehicleNo: "MH 13 AN 6402",
    transporter: "Siddheshwar Carriers",
    materialName: "Bagasse Dry Bale (BG)",
    expectedWeightMT: 22.8,
    timeWindow: "17:30 – 18:00",
    etaMinutes: 52,
    status: "ON_SCHEDULE",
    driverName: "Raju Gaikwad",
    driverPhone: "+91 98812 44901",
    farmCluster: "Pandharpur Sugar Cluster",
  },
  {
    id: "EXP-04",
    poNo: "PO-2026-0979",
    supplierName: "Marathwada Agro Feedstocks",
    vehicleNo: "MH 20 DV 1890",
    transporter: "Godavari Logistics",
    materialName: "Cotton Stalk Shredded (CS)",
    expectedWeightMT: 24.0,
    timeWindow: "16:00 – 16:30",
    etaMinutes: 65,
    status: "DELAYED",
    driverName: "Baban Shinde",
    driverPhone: "+91 97654 33210",
    farmCluster: "Jalna Cotton Cooperative",
  },
];

const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: "ACT-01",
    time: "16:48",
    type: "EXIT",
    title: "Exit Barrier 02 Raised · Vehicle Departed",
    description: "MH-40-BL-1102 (MahaGenco Dispatch) tare weighment verified (11.20 MT). Exit pass stamped & archived.",
    badgeText: "EXIT COMPLETE",
    badgeBorder: "border-emerald-300",
    badgeTextCol: "text-[#047857]",
    dotColor: "#059669",
  },
  {
    id: "ACT-02",
    time: "16:22",
    type: "ENTRY",
    title: "New Gate Pass Issued · Entry Barrier 01 Opened",
    description: "MH-12-Q-4491 (Groundnut Shell 28.5 MT) logged from Kisan Bio-Agri. Routed to WB-01 Gross Scale.",
    badgeText: "GATE INWARD",
    badgeBorder: "border-sky-300",
    badgeTextCol: "text-sky-700",
    dotColor: "#0284C7",
  },
  {
    id: "ACT-03",
    time: "15:52",
    type: "SAFETY",
    title: "Driver Safety & Breathalyzer Verified",
    description: "Driver Gurpreet Singh (MH 40 BL 9912) tested 0.00% BAC. Safety helmet & high-vis vest verified.",
    badgeText: "SAFETY PASS",
    badgeBorder: "border-neutral-300",
    badgeTextCol: "text-neutral-800",
    dotColor: "#18181B",
  },
  {
    id: "ACT-04",
    time: "15:15",
    type: "ALERT",
    title: "QC Lab Communication Notice",
    description: "Lab Tech requested mandatory foreign matter check for upcoming Sawdust deliveries from Vidarbha.",
    badgeText: "LAB NOTICE",
    badgeBorder: "border-amber-300",
    badgeTextCol: "text-amber-800",
    dotColor: "#D97706",
  },
  {
    id: "ACT-05",
    time: "14:00",
    type: "SAFETY",
    title: "Shift 1 Mid-Shift Hardware Health Check",
    description: "RFID sensors 01/02 and Weighbridge gross interlocks checked and verified fully operational.",
    badgeText: "SYSTEM OK",
    badgeBorder: "border-neutral-300",
    badgeTextCol: "text-neutral-700",
    dotColor: "#64748B",
  },
];

const INITIAL_CHECKLIST: SafetyCheckItem[] = [
  {
    id: "chk-1",
    label: "Driver Sobriety & Zero BAC Protocol",
    desc: "100% digital breathalyzer test on all commercial drivers before boom lift.",
    checked: true,
    time: "08:15",
  },
  {
    id: "chk-2",
    label: "PO & Commodity Authentication",
    desc: "Validate supplier PO number and verify moisture visual on tipper open.",
    checked: true,
    time: "08:20",
  },
  {
    id: "chk-3",
    label: "Dual Weighbridge Interlock Check",
    desc: "Ensure WB-01 Gross and WB-02 Tare barriers respond to optical sensors.",
    checked: true,
    time: "12:00",
  },
  {
    id: "chk-4",
    label: "Perimeter CCTV & Boom Clearance Check",
    desc: "Test manual override keys on Barrier 01 & 02 for emergency fail-open.",
    checked: false,
  },
  {
    id: "chk-5",
    label: "Shift Handover Log Preparation",
    desc: "Reconcile daily pass register count with physical yard head count.",
    checked: false,
  },
];

export function GateHome({ onNavigateTab, onOpenEntryModal }: GateHomeProps) {
  const [expectedList] = useState<ExpectedArrival[]>(INITIAL_EXPECTED_ARRIVALS);
  const [activities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);
  const [checklist, setChecklist] = useState<SafetyCheckItem[]>(INITIAL_CHECKLIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedInIds, setCheckedInIds] = useState<string[]>([]);
  const [showIntercomModal, setShowIntercomModal] = useState(false);
  const [filterType, setFilterType] = useState<"ALL" | "APPROACHING" | "SCHEDULED">("ALL");
  const [activityFilter, setActivityFilter] = useState<"ALL" | "ENTRY" | "EXIT" | "SAFETY">("ALL");

  // Live Digital Master Clock
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              checked: !item.checked,
              time: !item.checked
                ? new Date().toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : undefined,
            }
          : item
      )
    );
  };

  const filteredExpected = expectedList.filter((item) => {
    const matchesSearch =
      item.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === "APPROACHING") {
      return matchesSearch && item.status === "APPROACHING";
    }
    if (filterType === "SCHEDULED") {
      return matchesSearch && item.status === "ON_SCHEDULE";
    }
    return matchesSearch;
  });

  const filteredActivities = activities.filter((act) => {
    if (activityFilter === "ALL") return true;
    return act.type === activityFilter;
  });

  const handleFastCheckIn = (item: ExpectedArrival) => {
    setCheckedInIds((prev) => [...prev, item.id]);
    onOpenEntryModal({
      vehicleNo: item.vehicleNo,
      supplierOrCustomer: item.supplierName,
      materialName: item.materialName,
      transporter: item.transporter,
      declaredWeightMT: item.expectedWeightMT,
      driverName: item.driverName,
      driverMobile: item.driverPhone,
      direction: "INBOUND_RM",
      challanOrLrNo: item.poNo,
    });
  };

  return (
    <div className="space-y-12 md:space-y-14 select-none">
      {/* ========================================================================= */}
      {/* SECTION 1: MASTER COMMAND HEADER WITH LIVE TELEMETRY CLOCK                */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        {/* Section Header with Large Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs md:text-sm font-medium text-neutral-400 block tracking-normal">
              Perimeter Security & Plant Access Control
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mt-1">
              Operations Command Center
            </h1>
          </div>

          {/* Master Live Clock & Top Quick Hotbar */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            {/* High-Precision Digital Master Clock */}
            <div className="col-span-2 sm:col-span-1 h-10 px-3.5 border border-neutral-300 bg-transparent flex items-center justify-between sm:justify-start gap-3 shrink-0 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
                <div className="flex flex-col justify-center leading-none">
                  <div className="text-xs font-bold text-neutral-900 tabular-nums flex items-center gap-1">
                    <span>{currentTime || "16:45:00"}</span>
                    <span className="text-[9px] font-semibold text-neutral-500">IST</span>
                  </div>
                  <div className="text-[9px] text-neutral-500 uppercase font-medium tracking-wide mt-0.5">
                    {currentDate || "Today · 03 Oct 2026"}
                  </div>
                </div>
              </div>
              <span className="sm:hidden text-[9px] font-bold text-[#059669] px-1.5 py-0.5 border border-emerald-300 bg-emerald-50">
                LIVE
              </span>
            </div>

            {/* Emergency / Intercom Button */}
            <button
              type="button"
              onClick={() => setShowIntercomModal(true)}
              className="h-10 px-2 sm:px-3.5 border border-neutral-300 bg-transparent hover:bg-neutral-200/50 text-neutral-800 text-[11px] sm:text-xs font-medium uppercase tracking-wider shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <span>Intercom</span>
            </button>

            {/* Launch Vehicle Tracker */}
            <button
              type="button"
              onClick={() => onNavigateTab("live-tracker")}
              className="h-10 px-2 sm:px-3.5 border border-neutral-300 bg-transparent hover:bg-neutral-200/50 text-neutral-900 text-[11px] sm:text-xs font-medium uppercase tracking-wider shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
              <span>Fleet Tracker</span>
            </button>

            {/* Issue Gate Pass */}
            <button
              type="button"
              onClick={() => onOpenEntryModal()}
              className="col-span-2 sm:col-span-1 h-10 px-4 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold uppercase tracking-wider shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" strokeWidth={2.5} />
              <span>New Gate Pass</span>
            </button>
          </div>
        </div>

        {/* Section 1 Operational Status Card */}
        <div className="bg-transparent border border-neutral-300 p-3.5 sm:p-5 md:p-6 relative space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-emerald-300 bg-emerald-50/70 text-[10px] font-bold uppercase tracking-wider text-[#047857] w-fit shrink-0 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-[#059669] animate-pulse inline-block shrink-0" />
                <span>PLANT PERIMETER · STATION GATE 01 ONLINE</span>
              </span>
              <span className="hidden sm:inline text-xs text-neutral-400">·</span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-wider truncate sm:overflow-visible">
                BHARAT INDUSTRIAL & RENEWABLES LLP
              </span>
            </div>
            <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed">
              Main security access control and physical logistics hub. Monitor inbound biomass consignments, fast-track scheduled farmer deliveries, and manage physical gate barrier authorization.
            </p>
          </div>

          {/* Operational Guard Shift Banner & Telemetry Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {/* Shift Details */}
          <div className="border border-neutral-300 p-3.5 bg-white/80 flex flex-col justify-between min-h-[112px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Shift Schedule
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#047857] border border-emerald-300 px-1.5 py-0.5 bg-emerald-50/50">
                Shift 01
              </span>
            </div>
            <div className="text-xs font-bold text-neutral-900 flex items-center justify-between">
              <span>Day Duty (08:00 – 16:00)</span>
              <span className="text-[10px] text-neutral-500 tabular-nums">82% Elapsed</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 flex">
              <div className="bg-[#059669] h-full w-[82%]" title="82% Elapsed" />
            </div>
            <div className="text-[10px] text-neutral-500 flex items-center justify-between">
              <span>Elapsed: 6h 34m</span>
              <span className="font-semibold text-neutral-700">Relief: 15:45</span>
            </div>
          </div>

          {/* On-Duty Officer */}
          <div className="border border-neutral-300 p-3.5 bg-white/80 flex flex-col justify-between min-h-[112px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Lead Security Guard
              </span>
              <span className="text-[10px] text-[#059669] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#059669] inline-block" />
                <span>On Post</span>
              </span>
            </div>
            <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
              <span>Ramesh Shinde</span>
              <span className="text-[10px] font-medium text-neutral-500">(#SEC-042)</span>
            </div>
            <div className="text-[10px] text-neutral-600">
              Assistant Guard: <strong className="text-neutral-800 font-semibold">V. Jadhav</strong> · Post 01
            </div>
            <div className="text-[10px] text-neutral-500">
              Biometric Check-in: <span className="font-semibold text-neutral-700">07:52 IST</span>
            </div>
          </div>

          {/* Boom Barriers & Hardware Health */}
          <div className="border border-neutral-300 p-3.5 bg-white/80 flex flex-col justify-between min-h-[112px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Gate 01 / Gate 02 Barricade
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#047857] border border-emerald-300 px-1.5 py-0.5 bg-emerald-50/50">
                2/2 ACTIVE
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
              <span className="flex items-center gap-1 text-[#047857]">
                <Radio className="w-3 h-3 text-[#059669] shrink-0" />
                <span>Entry & Exit Boom Ready</span>
              </span>
              <span className="text-[10px] text-neutral-500 tabular-nums">0 Faults</span>
            </div>
            <div className="text-[10px] text-neutral-500 flex items-center justify-between">
              <span>RFID Sensor: Online</span>
              <span className="text-neutral-800 font-semibold">ANPR: 99.4% Accuracy</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              CCTV: <strong className="text-neutral-700 font-semibold">8/8 Streams Synced</strong>
            </div>
          </div>

          {/* Plant Weighbridge Status Link */}
          <div className="border border-neutral-300 p-3.5 bg-white/80 flex flex-col justify-between min-h-[112px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Weighbridge Platforms
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">Auto-Sync</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
              <span>WB-01 Gross (Inbound)</span>
              <span className="text-[9px] text-amber-800 font-bold border border-amber-300 px-1.5 py-0.5 bg-amber-50/50">BUSY (42.8 MT)</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
              <span>WB-02 Tare (Outbound)</span>
              <span className="text-[9px] text-[#047857] font-bold border border-emerald-300 px-1.5 py-0.5 bg-emerald-50/50">CLEAR (READY)</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              Net Tonnage Auto-Formula: <span className="font-semibold text-neutral-700">Gross − Tare</span>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* ========================================================================= */}
      {/* SECTION 2: SHIFT PULSE KPIS (HIGH-DENSITY INDUSTRIAL TELEMETRY DECK)      */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        {/* Section Header with Large Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs md:text-sm font-medium text-neutral-400 block tracking-normal">
              Shift 01 Telemetry & Plant Pulse
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
              Operational Metrics & Plant Throughput
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-neutral-300 text-xs font-medium text-neutral-700">
              <span className="w-2 h-2 bg-[#059669] inline-block" />
              <span>Shift 01 Active (Day Duty)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Movements Handled */}
        <div className="border border-neutral-300 p-5 bg-transparent flex flex-col justify-between hover:border-neutral-400 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                Total Movements Today
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#18181B] text-white">
                LIVE
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-3xl font-bold tracking-tight text-neutral-900 tabular-nums">
                26
              </div>
              <span className="text-xs text-neutral-500 font-medium">Commercial Trucks</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200">
            <div className="flex items-center justify-between text-[11px] text-neutral-600">
              <span>18 Inbound RM (69%)</span>
              <span>8 Outbound Dispatch (31%)</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 mt-2 flex">
              <div className="bg-[#18181B] h-full w-[69%]" title="18 Inbound RM" />
              <div className="bg-[#059669] h-full w-[31%]" title="8 Outbound Dispatch" />
            </div>
            <div className="text-[10px] text-neutral-500 mt-1.5 flex items-center justify-between">
              <span>Shift Pace: Normal</span>
              <span className="font-semibold text-neutral-700">8 Inside Plant Right Now</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Biomass Received */}
        <div className="border border-neutral-300 p-5 bg-transparent flex flex-col justify-between hover:border-neutral-400 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                Biomass Inflow Today
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-emerald-300 text-[#047857]">
                80.4% MET
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-3xl font-bold tracking-tight text-neutral-900 tabular-nums">
                482.50
              </div>
              <span className="text-xs text-neutral-500 font-medium">MT Received</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-600">Daily Target: 600.0 MT</span>
              <span className="text-[#059669] font-bold tabular-nums">117.5 MT Remaining</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 mt-2 flex">
              <div className="bg-[#059669] h-full w-[80.4%]" />
            </div>
            <div className="text-[10px] text-neutral-500 mt-1.5 flex items-center justify-between">
              <span>Top Cargo: Groundnut Shell</span>
              <span className="font-semibold text-neutral-700">4 Incoming Consignments</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Average Gate Dwell Time */}
        <div className="border border-neutral-300 p-5 bg-transparent flex flex-col justify-between hover:border-neutral-400 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                Avg Plant Turnaround
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-sky-300 text-sky-700">
                OPTIMAL
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-3xl font-bold tracking-tight text-neutral-900 tabular-nums">
                34
              </div>
              <span className="text-xs text-neutral-500 font-medium">Mins / Vehicle</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-500">SLA Standard: &lt; 45m</span>
              <span className="text-[#047857] font-bold flex items-center gap-0.5">
                <Check className="w-3.5 h-3.5" />
                <span>11m Under SLA</span>
              </span>
            </div>
            {/* Visual Mini Hourly Dwell Sparkline */}
            <div className="flex items-end gap-1 h-3 mt-2">
              {[42, 38, 36, 32, 35, 34].map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-neutral-300 hover:bg-[#18181B] transition-colors"
                  style={{ height: `${(val / 50) * 100}%` }}
                  title={`Hour ${idx + 8}:00 — ${val} mins`}
                />
              ))}
            </div>
            <div className="text-[10px] text-neutral-500 mt-1 flex items-center justify-between">
              <span>08:00 – 14:00 Trend</span>
              <span className="font-semibold text-neutral-700">Fast Yard Turnaround</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Safety & Verification Record */}
        <div className="border border-neutral-300 p-5 bg-transparent flex flex-col justify-between hover:border-neutral-400 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                Gate Safety Record
              </span>
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-3xl font-bold tracking-tight text-neutral-900 tabular-nums">
                100%
              </div>
              <span className="text-xs text-[#059669] font-bold uppercase tracking-wider">Zero Violations</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200">
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <span className="text-neutral-600">✓ Breathalyzer: 26/26</span>
              <span className="text-neutral-600">✓ PPE Verified</span>
              <span className="text-neutral-600">✓ PO Matched: 100%</span>
              <span className="text-neutral-600">✓ Barrier Fail-Safe</span>
            </div>
            <div className="text-[10px] text-neutral-500 mt-2 pt-1 border-t border-neutral-200 flex items-center justify-between">
              <span>Certified Guard Log</span>
              <span className="font-semibold text-[#047857]">Safety Audit Pass</span>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* ========================================================================= */}
      {/* SECTION 3: TACTICAL GUARD RAPID WORKFLOW LAUNCHPAD                        */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        {/* Section Header with Large Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs md:text-sm font-medium text-neutral-400 block tracking-normal">
              Quick-Action Access & Despatch Controls
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
              Tactical Workflows & Rapid Actions
            </h2>
          </div>

          <div className="text-xs text-neutral-500">
            Click any operational workflow tile to initiate immediate action
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Action 1: Create Gate Pass */}
          <button
            type="button"
            onClick={() => onOpenEntryModal()}
            className="p-4 border border-neutral-300 bg-white hover:border-neutral-900 hover:bg-neutral-50 text-left transition-all group cursor-pointer flex flex-col justify-between min-h-[115px] relative"
          >
            <div className="flex items-center justify-between text-neutral-900 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#059669] inline-block" />
                <span>1. Inbound Entry Pass</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-900">
                [N]
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-snug">
              Register newly arrived biomass carrier, assign Gross Weighbridge, and issue barcode slip.
            </p>
            <div className="flex items-center justify-between text-[10px] text-[#059669] font-bold uppercase tracking-wider mt-3 pt-2 border-t border-neutral-100">
              <span>Launch Entry Modal</span>
              <Plus className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 2: Live Fleet Inspection */}
          <button
            type="button"
            onClick={() => onNavigateTab("live-tracker")}
            className="p-4 border border-neutral-300 bg-white hover:border-neutral-900 hover:bg-neutral-50 text-left transition-all group cursor-pointer flex flex-col justify-between min-h-[115px] relative"
          >
            <div className="flex items-center justify-between text-neutral-900 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-sky-600 inline-block" />
                <span>2. Live Fleet Tracker</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-900">
                [T]
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-snug">
              Monitor 8 vehicles inside plant, control boom barriers, and inspect unloading bay matrix.
            </p>
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase tracking-wider mt-3 pt-2 border-t border-neutral-100">
              <span>Open Vehicle Map & List</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 3: Verify Documents */}
          <button
            type="button"
            onClick={() => onNavigateTab("docs")}
            className="p-4 border border-neutral-300 bg-white hover:border-neutral-900 hover:bg-neutral-50 text-left transition-all group cursor-pointer flex flex-col justify-between min-h-[115px] relative"
          >
            <div className="flex items-center justify-between text-neutral-900 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-600 inline-block" />
                <span>3. Doc Verification</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-900">
                [D]
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-snug">
              Cross-check supplier e-Way bill validity, transporter LR numbers, and active Purchase Orders.
            </p>
            <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold uppercase tracking-wider mt-3 pt-2 border-t border-neutral-100">
              <span>Open Document Desk</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 4: Exit Clearance */}
          <button
            type="button"
            onClick={() => onNavigateTab("exit")}
            className="p-4 border border-neutral-300 bg-white hover:border-neutral-900 hover:bg-neutral-50 text-left transition-all group cursor-pointer flex flex-col justify-between min-h-[115px] relative"
          >
            <div className="flex items-center justify-between text-neutral-900 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#059669] inline-block" />
                <span>4. Outward Exit Desk</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-900">
                [E]
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-snug">
              Inspect tare weight confirmation slip, collect gate duplicate, and raise Exit Barrier 02.
            </p>
            <div className="flex items-center justify-between text-[10px] text-[#059669] font-bold uppercase tracking-wider mt-3 pt-2 border-t border-neutral-100">
              <span>Authorize Vehicle Exit</span>
              <CheckCircle2 className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: EXPECTED INBOUND FLEET (WITH 1-CLICK TACTICAL CHECK-IN)        */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        {/* Section Header with Large Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs md:text-sm font-medium text-neutral-400 block tracking-normal">
              Pre-Advised Biomass Consignments
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
              Expected Inbound Fleet & Arrival Roster
            </h2>
          </div>

          <div className="text-xs text-neutral-500">
            Showing <strong className="text-neutral-900">{filteredExpected.length}</strong> of{" "}
            <strong>{expectedList.length}</strong> pre-advised trucks
          </div>
        </div>

        <div className="bg-transparent border border-neutral-300 p-3.5 sm:p-5 space-y-4">
          {/* Subheader + Search + Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-700" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">
                  Today&apos;s Supplier Consignment Schedule
                </span>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Pre-advised supplier fleet. When the truck arrives at Barrier 01, click &apos;1-Click Check-In&apos; to prefill pass.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Filter plate, supplier, PO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 sm:py-1 text-xs border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-800"
              />
            </div>

            {/* Filter Pills */}
            <div className="grid grid-cols-3 sm:flex items-center border border-neutral-300 divide-x divide-neutral-300 text-[11px] text-center">
              <button
                type="button"
                onClick={() => setFilterType("ALL")}
                className={`px-2 py-1.5 sm:py-1 cursor-pointer transition-colors ${
                  filterType === "ALL"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                All ({expectedList.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("APPROACHING")}
                className={`px-2 py-1.5 sm:py-1 cursor-pointer transition-colors ${
                  filterType === "APPROACHING"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                Near (1)
              </button>
              <button
                type="button"
                onClick={() => setFilterType("SCHEDULED")}
                className={`px-2 py-1.5 sm:py-1 cursor-pointer transition-colors ${
                  filterType === "SCHEDULED"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                Sched (2)
              </button>
            </div>
          </div>
        </div>

        {/* Expected Trucks — Mobile Card View (< md) */}
        <div className="md:hidden space-y-3">
          {filteredExpected.length === 0 ? (
            <div className="p-6 text-center text-xs text-neutral-500 border border-neutral-300 bg-white">
              No matching scheduled arrivals found.
            </div>
          ) : (
            filteredExpected.map((item) => {
              const isCheckedIn = checkedInIds.includes(item.id);

              return (
                <div
                  key={`mobile-${item.id}`}
                  className={`border border-neutral-300 p-3.5 space-y-2.5 transition-colors ${
                    isCheckedIn ? "bg-emerald-50/50 border-emerald-300" : "bg-white"
                  }`}
                >
                  {/* Top Bar: Plate + Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-neutral-900 text-sm tracking-tight">
                        {item.vehicleNo}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-medium">
                        {item.transporter} · Ref: {item.poNo}
                      </div>
                    </div>

                    {item.status === "APPROACHING" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-sky-300 text-sky-700 text-[10px] font-bold uppercase tracking-wider bg-sky-50/50 shrink-0">
                        <span className="w-1.5 h-1.5 bg-sky-600 animate-pulse inline-block" />
                        <span>~{item.etaMinutes}m ETA</span>
                      </span>
                    ) : item.status === "ON_SCHEDULE" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-neutral-300 text-neutral-700 text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 shrink-0">
                        <span>On Schedule</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-amber-300 text-amber-800 text-[10px] font-bold uppercase tracking-wider bg-amber-50/50 shrink-0">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Delayed</span>
                      </span>
                    )}
                  </div>

                  {/* Cargo & Supplier Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-neutral-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                        Cargo
                      </span>
                      <span className="font-semibold text-neutral-900 truncate block">
                        {item.materialName}
                      </span>
                      <span className="text-[10px] text-neutral-500 tabular-nums">
                        {item.expectedWeightMT.toFixed(1)} MT declared
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                        Supplier / Driver
                      </span>
                      <span className="font-semibold text-neutral-900 truncate block">
                        {item.supplierName}
                      </span>
                      <span className="text-[10px] text-neutral-500 truncate block">
                        {item.driverName}
                      </span>
                    </div>
                  </div>

                  {/* Window */}
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 bg-neutral-50 px-2.5 py-1 border border-neutral-200">
                    <span>Window: <strong className="text-neutral-800">{item.timeWindow}</strong></span>
                    <span>Cluster: <strong className="text-neutral-800">{item.farmCluster.split("(")[0]}</strong></span>
                  </div>

                  {/* Action Button */}
                  <div className="pt-1">
                    {isCheckedIn ? (
                      <div className="w-full py-2 bg-emerald-100/60 border border-emerald-300 text-[#047857] text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        <span>Pass Created & Issued</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleFastCheckIn(item)}
                        className="w-full py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>1-Click Fast Check-In</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Expected Trucks — Desktop Table (>= md) */}
        <div className="hidden md:block overflow-x-auto border border-neutral-300">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-200/60 text-neutral-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Expected Window & ETA</th>
                <th className="py-2.5 px-4">Vehicle Plate & Transporter</th>
                <th className="py-2.5 px-4">Supplier / Farmer & Cluster</th>
                <th className="py-2.5 px-4">Cargo & Declared Weight</th>
                <th className="py-2.5 px-4">Gate Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {filteredExpected.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    No matching scheduled arrivals found.
                  </td>
                </tr>
              ) : (
                filteredExpected.map((item) => {
                  const isCheckedIn = checkedInIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-neutral-50 transition-colors ${
                        isCheckedIn ? "bg-emerald-50/50" : ""
                      }`}
                    >
                      {/* Window & ETA */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-neutral-900 tabular-nums">
                          {item.timeWindow}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-medium flex items-center gap-1.5 mt-0.5">
                          <span>Ref: {item.poNo}</span>
                          <span>·</span>
                          <span className="text-neutral-700 font-semibold">ETA ~{item.etaMinutes}m</span>
                        </div>
                      </td>

                      {/* Vehicle & Transporter */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-neutral-900 tracking-tight text-xs sm:text-[13px]">
                          {item.vehicleNo}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {item.transporter}
                        </div>
                      </td>

                      {/* Supplier & Cluster */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-800">
                          {item.supplierName}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {item.farmCluster} · {item.driverName}
                        </div>
                      </td>

                      {/* Cargo */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-neutral-900">
                          {item.materialName}
                        </div>
                        <div className="text-[11px] text-neutral-500 tabular-nums">
                          Declared: <strong className="text-neutral-800 font-semibold">{item.expectedWeightMT.toFixed(1)} MT</strong>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.status === "APPROACHING" ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-sky-300 text-sky-700 text-[10px] font-bold uppercase tracking-wider bg-sky-50/50">
                            <span className="w-1.5 h-1.5 bg-sky-600 animate-pulse inline-block" />
                            <span>Approaching Gate (~8m)</span>
                          </span>
                        ) : item.status === "ON_SCHEDULE" ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-neutral-300 text-neutral-700 text-[10px] font-semibold uppercase tracking-wider bg-neutral-100">
                            <span className="w-1.5 h-1.5 bg-neutral-500 inline-block" />
                            <span>On Schedule</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-amber-300 text-amber-800 text-[10px] font-bold uppercase tracking-wider bg-amber-50/50">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Delayed Traffic</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {isCheckedIn ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#047857] px-2.5 py-1 bg-emerald-100/60 border border-emerald-300">
                            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                            <span>Checked In · Pass Generated</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleFastCheckIn(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>1-Click Check-In</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>

      {/* ========================================================================= */}
      {/* SECTION 5: LIVE SHIFT ACTIVITY STREAM & TACTICAL CHECKLIST DECK           */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        {/* Section Header with Large Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs md:text-sm font-medium text-neutral-400 block tracking-normal">
              Real-Time Event Stream & Station Handover
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
              Gate Audit Log & Safety Checklist
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-neutral-300 text-xs font-medium text-neutral-700">
              <span className="w-2 h-2 bg-[#059669] inline-block" />
              <span>Station 01 Handover Register</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Timeline */}
        <div className="lg:col-span-2 bg-transparent border border-neutral-300 p-3.5 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-700" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Gate Event Stream · Shift 1 Audit Log
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[10px]">
              {(["ALL", "ENTRY", "EXIT", "SAFETY"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActivityFilter(cat)}
                  className={`px-2 py-0.5 border cursor-pointer transition-colors ${
                    activityFilter === cat
                      ? "bg-[#18181B] text-white border-[#18181B] font-semibold"
                      : "bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="relative pl-4 space-y-3.5 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-3 group">
                {/* Timeline Node Dot */}
                <div
                  className="w-2.5 h-2.5 rounded-none shrink-0 mt-1 relative z-10 border border-white"
                  style={{ backgroundColor: act.dotColor }}
                />

                {/* Event Content Box */}
                <div className="flex-1 p-3 border border-neutral-200 bg-white hover:border-neutral-300 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-neutral-900">
                      {act.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-neutral-500 tabular-nums">
                        {act.time} IST
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border ${act.badgeBorder} ${act.badgeTextCol}`}
                      >
                        {act.badgeText}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
            <span className="text-neutral-500 text-[11px]">
              Showing {filteredActivities.length} recent security & movement events
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab("live-tracker")}
              className="font-bold text-neutral-900 hover:text-[#059669] inline-flex items-center gap-1 cursor-pointer uppercase tracking-wider transition-colors"
            >
              <span>Inspect All Vehicles in Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Col: Interactive Guard Security Checklist */}
        <div className="bg-transparent border border-neutral-300 p-3.5 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Guard Shift Checklist
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#047857] border border-emerald-300 px-1.5 py-0.5 bg-emerald-50/50">
                {checklist.filter((c) => c.checked).length} / {checklist.length} DONE
              </span>
            </div>

            <p className="text-[11px] text-neutral-500 mt-2">
              Mandatory safety and verification milestones required for Shift 1 handover:
            </p>

            {/* Checklist Items */}
            <div className="space-y-2.5 mt-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-2.5 border cursor-pointer transition-colors flex items-start gap-2.5 ${
                    item.checked
                      ? "bg-neutral-50 border-neutral-300"
                      : "bg-white border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-neutral-800 shrink-0"
                    aria-label={`Toggle ${item.label}`}
                  >
                    {item.checked ? (
                      <CheckSquare className="w-4 h-4 text-[#059669]" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-400" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold block ${
                          item.checked ? "text-neutral-700 line-through decoration-neutral-400" : "text-neutral-900"
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.time && (
                        <span className="text-[9px] font-semibold text-neutral-500 tabular-nums">
                          {item.time}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500 block leading-tight mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Handover Sign-Off Desk */}
          <div className="pt-3 border-t border-neutral-200 space-y-2">
            <div className="p-3 bg-neutral-200/50 border border-neutral-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 block">
                  Shift 2 Handover Relief
                </span>
                <span className="text-[9px] font-mono text-neutral-500">15:45 ARRIVAL</span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-snug">
                Relief Guard: <strong>S. Ghorpade (#SEC-058)</strong>. Reconcile entry pass count and verify barrier manual keys before station handover.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                alert("Shift 1 Handover Protocol initiated. Headcount verified (8 vehicles inside). Sign-off saved.");
              }}
              className="w-full py-2 bg-[#18181B] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer active:scale-95"
            >
              Sign Off Shift 1 Handover
            </button>
          </div>
        </div>
      </div>
    </section>

      {/* ========================================================================= */}
      {/* INTERCOM MODAL / POPUP                                                    */}
      {/* ========================================================================= */}
      {showIntercomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-neutral-300 max-w-md w-full p-6 space-y-4 shadow-none">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#059669]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Plant Security Intercom Desk
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIntercomModal(false)}
                className="text-neutral-500 hover:text-neutral-900 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Quick dial extension to internal plant departments from Gatehouse 01:
            </p>

            <div className="space-y-2 text-xs">
              {[
                { name: "Weighbridge 01 Operator (Gross)", ext: "EXT-101", status: "Online" },
                { name: "Weighbridge 02 Operator (Tare)", ext: "EXT-102", status: "Online" },
                { name: "Raw Material QC Lab / Sampling", ext: "EXT-204", status: "Online" },
                { name: "Yard A / Shed 2 Supervisor", ext: "EXT-305", status: "Active in Yard" },
                { name: "Plant Director / Control Room", ext: "EXT-001", status: "Direct Desk" },
                { name: "Emergency Fire & First Aid Station", ext: "EXT-911", status: "24/7 Monitored" },
              ].map((contact) => (
                <div
                  key={contact.ext}
                  className="flex items-center justify-between p-2.5 border border-neutral-200 hover:bg-neutral-50 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-neutral-900">{contact.name}</div>
                    <div className="text-[10px] text-neutral-500">{contact.status}</div>
                  </div>
                  <span className="font-bold text-neutral-800 bg-neutral-100 border border-neutral-300 px-2 py-1 text-[11px] tabular-nums">
                    {contact.ext}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowIntercomModal(false)}
              className="w-full py-2 bg-[#18181B] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              Close Intercom
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
