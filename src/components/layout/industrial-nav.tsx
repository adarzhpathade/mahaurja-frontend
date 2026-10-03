"use client";

import React, { useState } from "react";
import {
  Home,
  Globe,
  Route,
  Map as MapIcon,
  Truck,
  Scale,
  FlaskConical,
  Factory,
  Warehouse,
  ShieldCheck,
  BarChart3,
  FileCheck,
  LogIn,
  LogOut,
  ArrowDownToLine,
  ArrowUpFromLine,
  Receipt,
  CheckCircle2,
  ShieldAlert,
  FileText,
  CalendarRange,
  PackageMinus,
  AlertTriangle,
  PackageCheck,
  ShoppingBag,
  ArrowLeftRight,
  Activity,
  GitFork,
  LineChart,
  Users,
  User,
  Layers,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export interface UserRoleProfile {
  id: string;
  roleName: string;
  userName: string;
  department: string;
  navItems: NavItem[];
}

export const USER_ROLES: UserRoleProfile[] = [
  {
    id: "sales-dispatch",
    roleName: "Sales / Dispatch Manager",
    userName: "Vikram Malhotra",
    department: "Logistics & Outbound",
    navItems: [
      { id: "home", label: "Home", icon: Home },
      { id: "transportations", label: "Transportations", icon: Globe },
      { id: "delivery", label: "Delivery", icon: Route },
      { id: "load-planning", label: "Load Planning", icon: MapIcon },
      { id: "shipping", label: "Shipping", icon: Truck },
    ],
  },
  {
    id: "gate-security",
    roleName: "Gate / Security Operator",
    userName: "Ramesh Pawar",
    department: "Inbound / Outbound Gate",
    navItems: [
      { id: "home", label: "Home", icon: Home },
      { id: "live-tracker", label: "Vehicle Tracker", icon: Truck },
      { id: "entry", label: "Gate Entry", icon: LogIn },
      { id: "exit", label: "Vehicle Exit", icon: LogOut },
      { id: "docs", label: "Doc Verification", icon: FileCheck },
    ],
  },
  {
    id: "weighbridge",
    roleName: "Weighbridge Operator",
    userName: "Sunil Shinde",
    department: "Weighment Station",
    navItems: [
      { id: "home", label: "Home", icon: Home },
      { id: "weighments", label: "Weighments", icon: Scale },
      { id: "gross-weight", label: "Gross Weighment", icon: ArrowDownToLine },
      { id: "tare-weight", label: "Tare Weighment", icon: ArrowUpFromLine },
      { id: "slips", label: "Print Slips", icon: Receipt },
    ],
  },
  {
    id: "qc-lab",
    roleName: "QC / Lab Technician",
    userName: "Dr. Ananya Deshmukh",
    department: "Quality Assurance Lab",
    navItems: [
      { id: "home", label: "Home", icon: Home },
      { id: "rm-testing", label: "RM Testing", icon: FlaskConical },
      { id: "fg-testing", label: "FG Testing", icon: CheckCircle2 },
      { id: "approvals", label: "Approvals & Hold", icon: ShieldAlert },
      { id: "coa-reports", label: "COA Reports", icon: FileText },
    ],
  },
  {
    id: "production",
    roleName: "Production Supervisor",
    userName: "Mahesh Kadam",
    department: "Pelletising Plant Line 1 & 2",
    navItems: [
      { id: "home", label: "Home", icon: Home },
      { id: "plans", label: "Production Plans", icon: CalendarRange },
      { id: "issue", label: "Material Issue", icon: PackageMinus },
      { id: "processing", label: "7-Stage Processing", icon: Factory },
      { id: "downtime", label: "Downtime Log", icon: AlertTriangle },
    ],
  },
  {
    id: "warehouse",
    roleName: "Warehouse / Inventory Mgr",
    userName: "Nitin Joshi",
    department: "Raw Yards & Finished Sheds",
    navItems: [
      { id: "home", label: "Home", icon: Home },
      { id: "rm-inventory", label: "RM Inventory", icon: Warehouse },
      { id: "fg-stock", label: "FG Stock", icon: PackageCheck },
      { id: "lots", label: "Lot Traceability", icon: Layers },
      { id: "packaging", label: "Bagging & Packaging", icon: ShoppingBag },
    ],
  },
  {
    id: "admin",
    roleName: "Admin / Super Admin",
    userName: "Adarsh Sharma",
    department: "System Operations",
    navItems: [
      { id: "home", label: "Home", icon: Home },
      { id: "suppliers", label: "Suppliers Master", icon: Users },
      { id: "materials", label: "Materials Master", icon: Layers },
      { id: "locations", label: "Storage Locations", icon: Warehouse },
      { id: "users-access", label: "User Access & Roles", icon: ShieldCheck },
    ],
  },
  {
    id: "management",
    roleName: "Management / Plant Director",
    userName: "Pravin Singhania",
    department: "Executive Directorate",
    navItems: [
      { id: "home", label: "Home", icon: Home },
      { id: "live-kpis", label: "Live Plant KPIs", icon: Activity },
      { id: "traceability", label: "Bi-Directional Trace", icon: GitFork },
      { id: "cost-yield", label: "Cost & Yield", icon: LineChart },
      { id: "analytics", label: "Plant Reports", icon: BarChart3 },
    ],
  },
];

interface IndustrialNavProps {
  currentRole?: UserRoleProfile;
  onRoleChange?: (role: UserRoleProfile) => void;
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
}

export function IndustrialNav({
  currentRole = USER_ROLES[0],
  onRoleChange,
  activeTabId,
  onTabChange,
}: IndustrialNavProps) {
  // Default to 2nd item ("transportations" in Sales role) to exactly match user's screenshot
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    currentRole.navItems[1]?.id || currentRole.navItems[0]?.id || "home"
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const selectedTab = activeTabId !== undefined ? activeTabId : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const activeNavItem = currentRole.navItems.find((item) => item.id === selectedTab);

  return (
    <header className="w-full bg-[#F4F5F7] border-b border-[#E2E8F0] select-none sticky top-0 z-40">
      <div className="relative max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Name */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0 z-10 min-w-[120px]">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-[#0F172A] text-sm md:text-base uppercase tracking-wider">
              MAHAURJA
            </span>
          </div>
        </div>

        {/* Center: Truly Center-Aligned Tab Group */}
        <nav
          aria-label="Plant Navigation"
          className="hidden md:flex items-center justify-center flex-1 max-w-fit mx-auto lg:absolute lg:left-1/2 lg:-translate-x-1/2 z-0"
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2">
            {currentRole.navItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  type="button"
                  className={`
                    flex items-center gap-2 px-3.5 py-1.5 text-xs md:text-[13px] font-medium transition-colors whitespace-nowrap
                    focus:outline-none cursor-pointer border
                    ${
                      isActive
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-transparent text-neutral-700 border-neutral-300 hover:bg-neutral-200/50 hover:text-neutral-900"
                    }
                  `}
                  style={{ borderRadius: 0 }}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-white" : "text-neutral-600"
                    }`}
                    strokeWidth={isActive ? 2 : 1.75}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Right: User Profile Icon + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-10 min-w-[120px] justify-end">
          {/* User Profile Icon Button (Clean icon without direct verbose text) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-9 h-9 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 hover:text-black flex items-center justify-center relative cursor-pointer transition-colors shadow-xs"
              style={{ borderRadius: 0 }}
              title={`On Duty: ${currentRole.userName} (Gate 01 Post)`}
              aria-label="User Profile"
              aria-expanded={isUserMenuOpen}
            >
              <User className="w-4 h-4 text-neutral-800" strokeWidth={1.8} />
              <span className="w-1.5 h-1.5 bg-[#059669] absolute top-1.5 right-1.5" />
            </button>

            {/* Compact Industrial Guard Details Popover on Click */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-64 bg-white border border-[#D1D5DB] z-50 p-4 shadow-xl select-none"
                  style={{ borderRadius: 0 }}
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-neutral-200">
                    <div className="w-9 h-9 bg-[#18181B] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {currentRole.userName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-neutral-900 truncate">
                        {currentRole.userName}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium truncate">
                        {currentRole.roleName}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Post Station:</span>
                      <strong className="text-neutral-900">Gate 01 Post</strong>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Security Badge:</span>
                      <strong className="text-neutral-900 font-mono">#SEC-042</strong>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Shift Schedule:</span>
                      <span className="font-medium text-neutral-800">Shift 1 (08:00–16:00)</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                      <span className="text-neutral-600">Duty Status:</span>
                      <span className="text-[10px] font-bold text-[#047857] px-1.5 py-0.5 border border-emerald-300 bg-emerald-50">
                        ON DUTY
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Collapsible Navigation Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 border border-neutral-400 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors active:scale-95"
            style={{ borderRadius: 0 }}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Collapse Navigation" : `Current page: ${activeNavItem?.label || "Navigation"}`}
          >
            {isMobileMenuOpen ? (
              <>
                <X className="w-4 h-4 text-neutral-900 shrink-0" />
                <span className="text-[11px]">CLOSE</span>
              </>
            ) : (
              <>
                <Menu className="w-4 h-4 text-neutral-900 shrink-0" />
                <span className="text-[11px] truncate max-w-[120px]">
                  {activeNavItem ? activeNavItem.label.toUpperCase() : "PAGE"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Drawer Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-neutral-300 bg-white divide-y divide-neutral-200 overflow-hidden shadow-xl"
          >
            {/* Active Guard Info Strip (Pure station identity, no role switcher) */}
            <div className="p-3 bg-[#F8F9FA] flex items-center justify-between gap-2 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[#18181B] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {currentRole.userName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-neutral-900 leading-tight truncate">
                    {currentRole.userName}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-medium truncate">
                    {currentRole.roleName} · Post 01
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#047857] px-2 py-0.5 border border-emerald-300 bg-emerald-50">
                ON POST
              </span>
            </div>

            {/* Role Navigation Items (Full-width Touch-Friendly Buttons) */}
            <div className="p-3 space-y-1.5 bg-white">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-1 mb-1 flex items-center justify-between">
                <span>{currentRole.roleName} Desks</span>
                <span className="text-[9px] text-[#059669] font-bold">● STATION ACTIVE</span>
              </div>

              {currentRole.navItems.map((item) => {
                const Icon = item.icon;
                const isActive = selectedTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleTabClick(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    type="button"
                    className={`
                      w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold border transition-all cursor-pointer active:scale-[0.99]
                      ${
                        isActive
                          ? "bg-[#18181B] text-white border-[#18181B]"
                          : "bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
                      }
                    `}
                    style={{ borderRadius: 0 }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-[#10B981]" : "text-neutral-500"
                        }`}
                        strokeWidth={isActive ? 2 : 1.75}
                      />
                      <span className="text-[13px]">{item.label}</span>
                    </div>

                    {isActive ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#10B981] px-2 py-0.5 border border-[#10B981]/50 bg-black/30">
                        Current View
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-xs font-normal">→</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Operational Telemetry Strip */}
            <div className="p-3 bg-[#F4F5F7] flex items-center justify-between text-[11px] text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#059669]" />
                <span className="font-semibold text-neutral-800">Gate 01 / Gate 02 Live</span>
              </div>
              <span className="text-neutral-500">Day Duty Shift 01</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
