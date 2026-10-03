"use client";

import React, { useState } from "react";
import {
  Home,
  Globe,
  Route,
  Map as MapIcon,
  Truck,
  Search,
  Bell,
  User,
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
  Layers,
  ChevronDown,
  Check,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const selectedTab = activeTabId !== undefined ? activeTabId : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const handleSelectRole = (role: UserRoleProfile) => {
    setRoleMenuOpen(false);
    if (onRoleChange) {
      onRoleChange(role);
    }
    // Set default active tab to second item if available or first
    const defaultTab = role.navItems[1]?.id || role.navItems[0]?.id || "home";
    if (onTabChange) {
      onTabChange(defaultTab);
    } else {
      setInternalActiveTab(defaultTab);
    }
  };

  const activeNavItem = currentRole.navItems.find((item) => item.id === selectedTab);

  return (
    <header className="w-full bg-[#F4F5F7] border-b border-[#E2E8F0] select-none sticky top-0 z-40">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Name */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-[#0F172A] text-sm md:text-base uppercase tracking-wider">
              MAHAURJA
            </span>
          </div>
        </div>

        {/* Center: Exact Tab Group - Sharp Rectangular Segments with clean spacing (rounded-none, shadow-none, 0 depth, no color) */}
        <nav
          aria-label="Plant Navigation"
          className="hidden md:flex items-center overflow-x-auto"
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

        {/* Right: Search + Notification + User Profile Menu + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          {/* Search by ID or location (Dark, crisp opacity) */}
          <div className="hidden sm:flex items-center gap-2">
            <Search className="w-4 h-4 text-neutral-800 shrink-0" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or location"
              className="bg-transparent border-none text-xs md:text-[13px] text-neutral-900 placeholder:text-neutral-500 focus:outline-none w-36 lg:w-48 py-1"
            />
          </div>

          {/* Notification Bell */}
          <button
            type="button"
            className="text-neutral-800 hover:text-black transition-colors p-1 cursor-pointer focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1 text-neutral-800 hover:text-black transition-colors p-1 cursor-pointer focus:outline-none"
              title={`Switch Role (Current: ${currentRole.roleName})`}
            >
              <User className="w-[18px] h-[18px]" strokeWidth={2} />
              <ChevronDown
                className={`w-3.5 h-3.5 text-neutral-700 transition-transform ${
                  roleMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown for role selection (Zero corner rounding, flat industrial border) */}
            {roleMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleMenuOpen(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-72 bg-white border border-[#D1D5DB] z-50 py-1 shadow-lg"
                  style={{ borderRadius: 0 }}
                >
                  <div className="px-3 py-2 border-b border-[#E2E8F0] bg-[#F8F9FA]">
                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                      Switch User Role
                    </p>
                    <p className="text-xs font-medium text-neutral-900 truncate">
                      {currentRole.userName}
                    </p>
                    <p className="text-[11px] text-neutral-600 font-medium">
                      {currentRole.roleName}
                    </p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {USER_ROLES.map((r) => {
                      const isSelected = r.id === currentRole.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => handleSelectRole(r)}
                          type="button"
                          className={`
                            w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer
                            ${
                              isSelected
                                ? "bg-[#18181B] text-white"
                                : "text-neutral-800 hover:bg-neutral-100"
                            }
                          `}
                          style={{ borderRadius: 0 }}
                        >
                          <div>
                            <div className="font-medium">{r.roleName}</div>
                            <div
                              className={`text-[11px] ${
                                isSelected ? "text-neutral-300" : "text-neutral-500"
                              }`}
                            >
                              {r.userName} · {r.department}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-2" />}
                        </button>
                      );
                    })}
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
            {/* Active Guard Info & Role Switch Strip */}
            <div className="p-3 bg-[#F8F9FA] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[#18181B] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {currentRole.userName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-neutral-900 leading-tight truncate">
                    {currentRole.userName}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-medium truncate">
                    {currentRole.roleName}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="px-2.5 py-1 border border-neutral-300 bg-white text-[11px] font-semibold text-neutral-800 hover:bg-neutral-100 flex items-center gap-1 shrink-0 cursor-pointer"
                style={{ borderRadius: 0 }}
              >
                <span>Change Role</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Mobile Search Input */}
            <div className="p-3 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vehicle plate, PO, ID..."
                  className="w-full pl-8 pr-3 py-2 text-xs border border-neutral-300 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900"
                  style={{ borderRadius: 0 }}
                />
              </div>
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
