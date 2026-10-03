"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Shield,
  Truck,
  Scale,
  FlaskConical,
  Warehouse,
  Factory,
  ShoppingBag,
  BarChart3,
  ChevronDown,
  Layers,
  Sparkles,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  children?: { title: string; href: string }[];
}

const navSections: { section: string; items: NavItem[] }[] = [
  {
    section: "Operations",
    items: [
      {
        title: "Gate & Security",
        href: "/gate/dashboard",
        icon: Truck,
        children: [
          { title: "Live Gate Dashboard", href: "/gate/dashboard" },
          { title: "Gate Entries", href: "/gate/entries" },
          { title: "Vehicle Exits", href: "/gate/exits" },
        ],
      },
      {
        title: "Weighbridge",
        href: "/weighbridge/weighments",
        icon: Scale,
        children: [
          { title: "Weighment Entry", href: "/weighbridge/weighments" },
          { title: "Weighbridge Slips", href: "/weighbridge/slips" },
        ],
      },
      {
        title: "Quality Control",
        href: "/quality/rm-testing",
        icon: FlaskConical,
        children: [
          { title: "Raw Material Testing", href: "/quality/rm-testing" },
          { title: "Finished Goods QC", href: "/quality/fg-testing" },
          { title: "QC & COA Reports", href: "/quality/reports" },
        ],
      },
      {
        title: "Production",
        href: "/production/plans",
        icon: Factory,
        children: [
          { title: "Production Plans", href: "/production/plans" },
          { title: "Material Issue", href: "/production/material-issue" },
          { title: "Stage Processing", href: "/production/processing" },
          { title: "Batches", href: "/production/batches" },
          { title: "Downtime Log", href: "/production/downtime" },
        ],
      },
      {
        title: "Inventory & Lots",
        href: "/inventory/raw-materials",
        icon: Warehouse,
        children: [
          { title: "RM Inventory", href: "/inventory/raw-materials" },
          { title: "Finished Goods", href: "/inventory/finished-goods" },
          { title: "RM Lots & Traceability", href: "/inventory/lots" },
          { title: "Packaging & Bagging", href: "/inventory/packaging" },
        ],
      },
      {
        title: "Sales & Dispatch",
        href: "/sales/orders",
        icon: ShoppingBag,
        children: [
          { title: "Customers", href: "/sales/customers" },
          { title: "Sales Orders", href: "/sales/orders" },
          { title: "Dispatch Planning", href: "/sales/dispatch" },
          { title: "Invoices & Documents", href: "/sales/invoices" },
          { title: "Delivery Tracking", href: "/sales/delivery" },
          { title: "Payments", href: "/sales/payments" },
        ],
      },
    ],
  },
  {
    section: "Intelligence & Admin",
    items: [
      {
        title: "Management",
        href: "/management/dashboard",
        icon: BarChart3,
        children: [
          { title: "Live Plant Dashboard", href: "/management/dashboard" },
          { title: "Bi-directional Traceability", href: "/management/traceability" },
          { title: "Executive Reports", href: "/management/reports" },
        ],
      },
      {
        title: "Admin & Masters",
        href: "/admin/masters/suppliers",
        icon: Shield,
        children: [
          { title: "Suppliers / Farmers", href: "/admin/masters/suppliers" },
          { title: "Raw Materials Master", href: "/admin/masters/materials" },
          { title: "Storage Locations", href: "/admin/masters/storage-locations" },
          { title: "Formulas & Blends", href: "/admin/masters/formulas" },
          { title: "User & Role Settings", href: "/admin/users" },
          { title: "System Config", href: "/admin/settings" },
        ],
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleGroup = (title: string) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

  return (
    <>
      {/* Mobile toggle button */}
      <div className="fixed top-3 left-3 z-50 lg:hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-700/80 text-white shadow-xl"
          aria-label="Toggle Navigation"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand header */}
        <div className="flex h-18 items-center gap-3 px-6 border-b border-slate-800/80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-white">MAHAURJA</span>
              <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
              Bharat Industrial & Renewables
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navSections.map((sec) => (
            <div key={sec.section}>
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {sec.section}
              </p>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    item.children?.some((c) => pathname.startsWith(c.href));
                  const isExpanded = openSection === item.title || isActive;

                  return (
                    <div key={item.title}>
                      <button
                        type="button"
                        onClick={() => toggleGroup(item.title)}
                        className={cn(
                          "group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200",
                          isActive
                            ? "bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_12px_rgba(16,185,129,0.08)]"
                            : "text-slate-300 hover:bg-slate-900 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={cn(
                              "h-4 w-4 transition-colors",
                              isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                            )}
                          />
                          <span>{item.title}</span>
                        </div>
                        {item.children && (
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                              isExpanded ? "rotate-180 text-emerald-400" : ""
                            )}
                          />
                        )}
                      </button>

                      {/* Sub-menu items */}
                      {item.children && isExpanded && (
                        <div className="mt-1 ml-7 space-y-0.5 border-l border-slate-800/80 pl-2">
                          {item.children.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                  "block rounded-lg px-2.5 py-1.5 text-[11px] transition-colors",
                                  isSubActive
                                    ? "bg-slate-800 text-emerald-400 font-medium"
                                    : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                                )}
                              >
                                {sub.title}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800/80 p-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-2.5 border border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                OP
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Super Admin</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Plant Online
                </p>
              </div>
            </div>
            <Link
              href="/"
              title="Switch Role / Home"
              className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
