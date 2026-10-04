"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Route,
  Truck,
  Scale,
  FlaskConical,
  Factory,
  Warehouse,
  ShieldCheck,
  BarChart3,
  LogIn,
  LogOut,
  Receipt,
  CheckCircle2,
  FileText,
  CalendarRange,
  PackageMinus,
  PackageCheck,
  ShoppingBag,
  Activity,
  GitFork,
  LineChart,
  Users,
  User,
  Layers,
  Menu,
  X,
  ArrowRight,
  Terminal,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/context/auth-context";
import { useLiveStatus } from "@/lib/api/realtime";
import { NotificationCenter } from "./notification-center";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
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
    id: "gate-security",
    roleName: "Gate / Security Operator",
    userName: "Ramesh Pawar",
    department: "Inbound / Outbound Gate",
    navItems: [
      { id: "home", label: "Gate Dashboard", icon: Home, href: "/gate" },
      { id: "live-tracker", label: "Vehicle Tracker", icon: Truck, href: "/gate/tracker" },
      { id: "entry", label: "Gate Entry", icon: LogIn, href: "/gate/entry" },
      { id: "exit", label: "Vehicle Exit", icon: LogOut, href: "/gate/exit" },
    ],
  },
  {
    id: "weighbridge",
    roleName: "Weighbridge Operator",
    userName: "Sunil Shinde",
    department: "Weighment Station",
    navItems: [
      { id: "home", label: "Scale Terminal", icon: Scale, href: "/weighbridge" },
      { id: "weighments", label: "Weight Records", icon: Receipt, href: "/weighbridge/weighments" },
    ],
  },
  {
    id: "sales-dispatch",
    roleName: "Sales / Dispatch Manager",
    userName: "Vikram Malhotra",
    department: "Logistics & Outbound",
    navItems: [
      { id: "orders", label: "Sales Orders", icon: ShoppingBag, href: "/sales/orders" },
      { id: "dispatch-planning", label: "Dispatch Planning", icon: Route, href: "/sales/dispatch" },
      { id: "invoices", label: "Invoices & Docs", icon: FileText, href: "/sales/invoices" },
      { id: "delivery", label: "Delivery & POD", icon: Truck, href: "/sales/delivery" },
      { id: "payments", label: "Payments", icon: Receipt, href: "/sales/payments" },
    ],
  },
  {
    id: "qc-lab",
    roleName: "QC / Lab Technician",
    userName: "Dr. Ananya Deshmukh",
    department: "Quality Assurance Lab",
    navItems: [
      { id: "home", label: "Lab Overview", icon: Home, href: "/quality" },
      { id: "rm-testing", label: "RM Quality Testing", icon: FlaskConical, href: "/quality/rm-testing" },
      { id: "fg-testing", label: "FG Quality Testing", icon: CheckCircle2, href: "/quality/fg-testing" },
      { id: "coa-reports", label: "COA Reports", icon: FileText, href: "/quality/reports" },
    ],
  },
  {
    id: "production",
    roleName: "Production Supervisor",
    userName: "Mahesh Kadam",
    department: "Pelletising Plant Line 1 & 2",
    navItems: [
      { id: "plans", label: "Production Plans", icon: CalendarRange, href: "/production/plans" },
      { id: "issue", label: "Material Issue", icon: PackageMinus, href: "/production/material-issue" },
      { id: "processing", label: "7-Stage Processing", icon: Factory, href: "/production/processing" },
      { id: "batch-history", label: "Batch History", icon: Layers, href: "/production/batches" },
    ],
  },
  {
    id: "warehouse",
    roleName: "Warehouse / Inventory Mgr",
    userName: "Nitin Joshi",
    department: "Raw Yards & Finished Sheds",
    navItems: [
      { id: "rm-inventory", label: "Raw Material Yards", icon: Warehouse, href: "/inventory/raw-materials" },
      { id: "fg-stock", label: "Finished Goods Stock", icon: PackageCheck, href: "/inventory/finished-goods" },
      { id: "packaging", label: "Packaging & Bagging", icon: ShoppingBag, href: "/inventory/packaging" },
      { id: "lots", label: "Lot Traceability", icon: Layers, href: "/inventory/lots" },
    ],
  },
  {
    id: "admin",
    roleName: "Admin / Super Admin",
    userName: "Adarsh Sharma",
    department: "System Operations",
    navItems: [
      { id: "suppliers", label: "Suppliers Master", icon: Users, href: "/admin/masters/suppliers" },
      { id: "customers", label: "Customer Master", icon: User, href: "/admin/masters/customers" },
      { id: "materials", label: "Materials & Storage", icon: Warehouse, href: "/admin/masters/materials" },
      { id: "formulas", label: "Blend Formulas", icon: Layers, href: "/admin/masters/formulas" },
      { id: "users-access", label: "User Access & Roles", icon: ShieldCheck, href: "/admin/users" },
    ],
  },
  {
    id: "management",
    roleName: "Management / Plant Director",
    userName: "Pravin Singhania",
    department: "Executive Directorate",
    navItems: [
      { id: "live-kpis", label: "Live Plant KPIs", icon: Activity, href: "/management" },
      { id: "traceability", label: "Bi-Directional Trace", icon: GitFork, href: "/management/traceability" },
      { id: "cost-yield", label: "Cost & Yield", icon: LineChart, href: "/management/cost-yield" },
      { id: "analytics", label: "Plant Reports", icon: BarChart3, href: "/management/reports" },
    ],
  },
];

export const ROLE_GATE_SECURITY = USER_ROLES.find((r) => r.id === "gate-security") || USER_ROLES[0];
export const ROLE_WEIGHBRIDGE = USER_ROLES.find((r) => r.id === "weighbridge") || USER_ROLES[1];
export const ROLE_SALES_DISPATCH = USER_ROLES.find((r) => r.id === "sales-dispatch") || USER_ROLES[2];
export const ROLE_QC_LAB = USER_ROLES.find((r) => r.id === "qc-lab") || USER_ROLES[3];
export const ROLE_PRODUCTION = USER_ROLES.find((r) => r.id === "production") || USER_ROLES[4];
export const ROLE_WAREHOUSE = USER_ROLES.find((r) => r.id === "warehouse") || USER_ROLES[5];
export const ROLE_ADMIN = USER_ROLES.find((r) => r.id === "admin") || USER_ROLES[6];
export const ROLE_MANAGEMENT = USER_ROLES.find((r) => r.id === "management") || USER_ROLES[7];

export const ROLE_ROUTES: Record<string, string> = {
  "gate-security": "/gate",
  "weighbridge": "/weighbridge",
  "sales-dispatch": "/sales",
  "qc-lab": "/quality",
  "production": "/production",
  "warehouse": "/inventory",
  "admin": "/admin",
  "management": "/management",
};

export function getRoleById(roleId: string): UserRoleProfile {
  return USER_ROLES.find((r) => r.id === roleId) || USER_ROLES[0];
}

interface IndustrialNavProps {
  currentRole?: UserRoleProfile;
  onRoleChange?: (role: UserRoleProfile) => void;
  activeTabId?: string;
  onTabChange?: (tabId: string, href?: string) => void;
}

export function IndustrialNav({
  currentRole = USER_ROLES[0],
  onRoleChange,
  activeTabId,
  onTabChange,
}: IndustrialNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const liveStatus = useLiveStatus();
  // Signed-in operator from the backend; role profile values are only a fallback.
  const operatorName = user?.name ?? currentRole.userName;
  const operatorDepartment = user?.department ?? currentRole.department;
  const canSwitchDesk = user?.roleId === "admin" || user?.roleId === "management";
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    currentRole.navItems[0]?.id || "home"
  );
  const [optimisticTab, setOptimisticTab] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDevMenuOpen, setIsDevMenuOpen] = useState(false);

  // Sync optimistic tab whenever activeTabId from parent route updates
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOptimisticTab(null);
  }, [activeTabId]);

  // Intelligent Background Route Prefetching:
  // When a user lands on their role's initial page, wait for that first page to load and become idle,
  // then automatically prefetch all other pages/desks for that user's role in the background.
  useEffect(() => {
    const prefetchOtherPages = () => {
      currentRole.navItems.forEach((item) => {
        if (item.href && item.href !== pathname) {
          try {
            router.prefetch(item.href);
          } catch {
            // Silently ignore if already prefetched or in non-browser context
          }
        }
      });
    };

    // Give the primary/current page full priority to finish its initial render & hydration
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const win = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };
      const idleId = win.requestIdleCallback?.(
        () => {
          prefetchOtherPages();
        },
        { timeout: 1500 }
      );
      return () => {
        if (idleId !== undefined && win.cancelIdleCallback) {
          win.cancelIdleCallback(idleId);
        }
      };
    } else {
      const timer = setTimeout(prefetchOtherPages, 400);
      return () => clearTimeout(timer);
    }
  }, [currentRole, pathname, router]);

  const selectedTab = optimisticTab ?? (activeTabId !== undefined ? activeTabId : internalActiveTab);

  const handleTabClick = (item: NavItem) => {
    setOptimisticTab(item.id);
    if (onTabChange) {
      onTabChange(item.id, item.href);
    } else {
      setInternalActiveTab(item.id);
      if (item.href) {
        router.push(item.href);
      }
    }
  };

  const activeNavItem = currentRole.navItems.find((item) => item.id === selectedTab);

  return (
    <header className="w-full bg-[#F4F5F7] border-b border-[#E2E8F0] select-none sticky top-0 z-40">
      <div className="relative max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Left: Current Page / Active Nav Item Name */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0 z-10 min-w-0">
          <span className="font-black tracking-tight text-[#0F172A] text-sm md:text-base uppercase tracking-wider truncate max-w-[190px] sm:max-w-[300px]">
            {activeNavItem ? activeNavItem.label.toUpperCase() : currentRole.roleName.toUpperCase()}
          </span>
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
                  onClick={() => handleTabClick(item)}
                  onMouseEnter={() => item.href && router.prefetch(item.href)}
                  onTouchStart={() => item.href && router.prefetch(item.href)}
                  type="button"
                  className={`
                    h-9 lg:h-10 flex items-center gap-2 px-3.5 lg:px-4 text-xs lg:text-[13px] font-bold tracking-tight transition-colors whitespace-nowrap
                    focus:outline-none cursor-pointer border
                    ${
                      isActive
                        ? "bg-[#18181B] text-white border-[#18181B] shadow-2xs"
                        : "bg-white/80 hover:bg-white text-neutral-700 hover:text-neutral-900 border-neutral-300 hover:border-neutral-400 shadow-2xs"
                    }
                  `}
                  style={{ borderRadius: 0 }}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-[#10B981]" : "text-neutral-600"
                    }`}
                    strokeWidth={isActive ? 2.2 : 1.75}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Right: Actions (Dev Role Switcher + User Profile + Mobile Menu Toggle) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 z-10 justify-end">
          <span
            data-testid="live-status"
            title={liveStatus === "live" ? "Live: updates from other desks appear instantly" : "Reconnecting to plant server…"}
            className={`hidden sm:inline-flex items-center gap-1.5 h-7 px-2 text-[10px] font-bold uppercase tracking-wider border ${
              liveStatus === "live"
                ? "border-emerald-300 bg-emerald-50 text-[#047857]"
                : "border-amber-300 bg-amber-50 text-amber-700"
            }`}
          >
            <span className={`w-1.5 h-1.5 ${liveStatus === "live" ? "bg-[#059669] animate-pulse" : "bg-amber-500"}`} />
            {liveStatus === "live" ? "Live" : "Offline"}
          </span>
          {/* Dev Role Switcher Button */}
          {canSwitchDesk && (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDevMenuOpen(!isDevMenuOpen);
                setIsUserMenuOpen(false);
                setIsMobileMenuOpen(false);
              }}
              className="h-9 px-2 sm:px-2.5 border border-dashed border-amber-600/70 bg-amber-50/80 hover:bg-amber-100 text-amber-950 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              style={{ borderRadius: 0 }}
              title="Developer: Switch Plant Desk / Role (8 Desks)"
              aria-label="Dev Role Switcher"
              aria-expanded={isDevMenuOpen}
            >
              <Terminal className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="text-[11px] font-mono font-bold tracking-tight uppercase hidden sm:inline">
                Dev: Switch Desk
              </span>
              <span className="text-[10px] font-mono font-bold tracking-tight uppercase sm:hidden">
                Dev
              </span>
              <ChevronDown
                className={`w-3 h-3 text-amber-700 transition-transform ${
                  isDevMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dev Role Switcher Popover */}
            {isDevMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDevMenuOpen(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-neutral-300 z-50 p-0 shadow-xl select-none"
                  style={{ borderRadius: 0 }}
                >
                  <div className="px-3.5 py-2.5 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-amber-700" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-800">
                        Dev Desk Switcher
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300">
                      8 Desks
                    </span>
                  </div>

                  <div className="divide-y divide-neutral-200 max-h-[70vh] overflow-y-auto">
                    {USER_ROLES.map((role) => {
                      const isCurrent = role.id === currentRole.id;
                      const route = ROLE_ROUTES[role.id] || "/gate";
                      const RoleIcon = role.navItems[0]?.icon || Factory;

                      return (
                        <button
                          key={role.id}
                          type="button"
                          onMouseEnter={() => router.prefetch(route)}
                          onTouchStart={() => router.prefetch(route)}
                          onClick={() => {
                            setIsDevMenuOpen(false);
                            if (onRoleChange) {
                              onRoleChange(role);
                            }
                            router.push(route);
                          }}
                          className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                            isCurrent
                              ? "bg-neutral-900 text-white"
                              : "bg-white hover:bg-neutral-100 text-neutral-800"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-7 h-7 flex items-center justify-center shrink-0 border ${
                                isCurrent
                                  ? "bg-neutral-800 border-neutral-700 text-[#10B981]"
                                  : "bg-neutral-50 border-neutral-300 text-neutral-600"
                              }`}
                            >
                              <RoleIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate">
                                {role.roleName}
                              </div>
                              <div
                                className={`text-[11px] truncate ${
                                  isCurrent ? "text-neutral-400" : "text-neutral-500"
                                }`}
                              >
                                {role.userName} · {route}
                              </div>
                            </div>
                          </div>

                          {isCurrent ? (
                            <span className="text-[10px] font-mono font-bold text-[#10B981] px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 shrink-0 ml-2">
                              Active
                            </span>
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          )}

          {/* Notification Center Bell and Drawer */}
          <NotificationCenter />

          {/* User Profile Icon Button (Clean icon without direct verbose text) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsDevMenuOpen(false);
                setIsMobileMenuOpen(false);
              }}
              className="w-9 h-9 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 hover:text-black flex items-center justify-center relative cursor-pointer transition-colors shadow-2xs"
              style={{ borderRadius: 0 }}
              title={`On Duty: ${operatorName}`}
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
                  className="absolute right-0 mt-2 w-72 bg-white border border-neutral-300 z-50 p-4 shadow-xl select-none"
                  style={{ borderRadius: 0 }}
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-neutral-200">
                    <div className="w-9 h-9 bg-[#18181B] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {operatorName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-neutral-900 truncate">
                        {operatorName}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium truncate">
                        {currentRole.roleName}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Department:</span>
                      <strong className="text-neutral-900">{operatorDepartment}</strong>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Operator:</span>
                      <strong className="text-neutral-900 font-mono">{operatorName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Duty Shift:</span>
                      <span className="font-medium text-neutral-800">Shift 1 (08:00–16:00)</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                      <span className="text-neutral-600">Station Status:</span>
                      <span className="text-[10px] font-bold text-[#047857] px-1.5 py-0.5 border border-emerald-300 bg-emerald-50">
                        ACTIVE ON DUTY
                      </span>
                    </div>

                    {/* Operational Action */}
                    <div className="pt-3 mt-2 border-t border-neutral-200">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          void logout();
                        }}
                        className="w-full h-8 px-3 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        style={{ borderRadius: 0 }}
                      >
                        <LogOut className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Collapsible Navigation Toggle Button (Square Box) */}
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              setIsDevMenuOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="md:hidden w-9 h-9 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 hover:text-black flex items-center justify-center relative cursor-pointer transition-colors shadow-2xs"
            style={{ borderRadius: 0 }}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Collapse Navigation" : "Open Navigation Menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-neutral-900 shrink-0" strokeWidth={1.8} />
            ) : (
              <Menu className="w-4 h-4 text-neutral-900 shrink-0" strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Drawer Panel (Spacious, Clean, Production-Ready Navigation) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-neutral-300 bg-[#F4F5F7] shadow-xl overflow-hidden select-none"
          >
            {/* Clean Station Subheader */}
            <div className="px-4 sm:px-6 py-3 bg-white border-b border-neutral-300 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 bg-[#059669] shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Active Station
                  </div>
                  <div className="text-xs sm:text-sm font-black tracking-tight text-neutral-900 uppercase">
                    {currentRole.roleName}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-neutral-700 px-2 py-0.5 bg-neutral-100 border border-neutral-300 shrink-0">
                {currentRole.navItems.length} Desks
              </span>
            </div>

            {/* Spacious Desk Navigation Cards */}
            <div className="p-3.5 sm:p-5 space-y-2.5">
              {currentRole.navItems.map((item) => {
                const Icon = item.icon;
                const isActive = selectedTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleTabClick(item);
                      setIsMobileMenuOpen(false);
                    }}
                    onMouseEnter={() => item.href && router.prefetch(item.href)}
                    onTouchStart={() => item.href && router.prefetch(item.href)}
                    type="button"
                    className={`
                      w-full flex items-center justify-between p-3.5 sm:p-4 text-left transition-all cursor-pointer group
                      ${
                        isActive
                          ? "bg-[#18181B] text-white border border-[#18181B] shadow-sm"
                          : "bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 hover:border-neutral-900 shadow-2xs"
                      }
                    `}
                    style={{ borderRadius: 0 }}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 flex items-center justify-center shrink-0 border transition-colors ${
                          isActive
                            ? "bg-neutral-800 border-neutral-700 text-[#10B981]"
                            : "bg-neutral-100 border-neutral-200 text-neutral-600 group-hover:text-neutral-900 group-hover:bg-neutral-200/70"
                        }`}
                      >
                        <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.75} />
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`text-sm font-bold tracking-tight truncate ${
                            isActive ? "text-white" : "text-neutral-900 group-hover:text-black"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div
                          className={`text-[11px] font-medium truncate ${
                            isActive ? "text-neutral-400" : "text-neutral-500"
                          }`}
                        >
                          {isActive ? "Currently viewing desk" : "Switch to desk"}
                        </div>
                      </div>
                    </div>

                    {isActive ? (
                      <span
                        className="text-[10px] font-mono font-bold uppercase tracking-wider text-white px-2.5 py-1 bg-[#059669] shrink-0 ml-2"
                        style={{ borderRadius: 0 }}
                      >
                        Active
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Clean Operational Station Footer (No Dev Elements) */}
            <div className="px-4 sm:px-6 py-3 bg-white border-t border-neutral-300 flex items-center justify-between text-xs text-neutral-600">
              <div className="flex items-center gap-2 min-w-0">
                <User className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span className="font-semibold text-neutral-900 truncate">
                  {operatorName}
                </span>
                <span className="text-neutral-400">·</span>
                <span className="text-neutral-500 truncate text-[11px]">
                  {operatorDepartment}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#047857] px-2 py-0.5 bg-emerald-50 border border-emerald-300 shrink-0 uppercase tracking-wider">
                On Duty
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
