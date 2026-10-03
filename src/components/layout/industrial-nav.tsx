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
} from "lucide-react";

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

  return (
    <header className="w-full bg-[#F4F5F7] border-b border-[#E2E8F0] select-none">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Name (No logo image per user instruction, exact clean typography, no corner rounding) */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center">
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

        {/* Right: Search + Notification + User Profile Menu */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
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
              className="flex items-center gap-1.5 text-neutral-800 hover:text-black transition-colors p-1 cursor-pointer focus:outline-none"
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
                  className="absolute right-0 mt-2 w-72 bg-white border border-[#D1D5DB] z-50 py-1"
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
        </div>
      </div>

      {/* Mobile Nav Bar for smaller viewports */}
      <div className="md:hidden border-t border-neutral-200 bg-[#F4F5F7] px-3 py-2 overflow-x-auto">
        <div className="inline-flex items-center gap-1.5">
          {currentRole.navItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                type="button"
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer border
                  ${
                    isActive
                      ? "bg-[#18181B] text-white border-[#18181B]"
                      : "bg-transparent text-neutral-700 border-neutral-300 hover:bg-neutral-200/50 hover:text-neutral-900"
                  }
                `}
                style={{ borderRadius: 0 }}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? "text-white" : "text-neutral-600"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
