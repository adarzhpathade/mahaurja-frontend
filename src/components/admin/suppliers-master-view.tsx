"use client";

import React, { useState } from "react";
import { MobileFilterSheet } from "@/components/shared/mobile-filter-sheet";
import {
  Users,
  Search,
  Plus,
  Phone,
  MapPin,
  Building2,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  Table as TableIcon,
  X,
  CreditCard,
  SlidersHorizontal,
} from "lucide-react";
import { useAdmin } from "@/lib/context/admin-context";
import { SupplierItem } from "@/lib/types/admin";

export function SuppliersMasterView() {
  const { suppliers, addSupplier, toggleSupplierStatus } = useAdmin();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState<"Farmer" | "Trader" | "Aggregator" | "Company">("Farmer");
  const [villageOrCity, setVillageOrCity] = useState("");
  const [district, setDistrict] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [materialsSupplied, setMaterialsSupplied] = useState("Cotton Stalk, Soybean Straw");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.villageOrCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || s.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactPerson || !contactNumber) return;

    addSupplier({
      name,
      type,
      villageOrCity: villageOrCity || "Baramati",
      district: district || "Pune",
      contactPerson,
      contactNumber,
      materialsSupplied: materialsSupplied.split(",").map((m) => m.trim()),
      gstin: gstin || undefined,
      pan: pan || undefined,
      bankAccount: bankAccount || undefined,
      bankIfsc: bankIfsc || undefined,
      isActive: true,
    });

    setIsModalOpen(false);
    setName("");
    setContactPerson("");
    setContactNumber("");
  };

  const renderSupplierCard = (supplier: SupplierItem) => (
    <div
      key={supplier.id}
      className="bg-white/40 border border-neutral-300 hover:border-neutral-900 transition-all p-4 space-y-3"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono font-bold text-xs text-neutral-500">
            {supplier.id}
          </span>
          <h3 className="font-bold text-sm text-neutral-900 leading-tight mt-0.5">
            {supplier.name}
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 border border-neutral-300 bg-neutral-100 text-neutral-700">
          {supplier.type}
        </span>
      </div>

      <div className="text-xs space-y-1 text-neutral-600">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>
            {supplier.villageOrCity}, {supplier.district}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>
            {supplier.contactPerson} · {supplier.contactNumber}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 pt-1">
        {supplier.materialsSupplied.map((m) => (
          <span
            key={m}
            className="px-2 py-0.5 text-[10px] font-medium bg-emerald-50 text-[#047857] border border-emerald-200"
          >
            {m}
          </span>
        ))}
      </div>

      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-neutral-500 uppercase block font-semibold">
            Supplied
          </span>
          <span className="font-mono font-bold text-neutral-900">
            {supplier.totalSuppliedMt.toFixed(1)} MT
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-neutral-500 uppercase block font-semibold">
            Payout
          </span>
          <span className="font-mono font-bold text-[#059669]">
            ₹{supplier.totalPayoutInr.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
            supplier.isActive
              ? "bg-emerald-50 text-[#047857] border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {supplier.isActive ? "ACTIVE" : "INACTIVE"}
        </span>

        <button
          type="button"
          onClick={() => toggleSupplierStatus(supplier.id)}
          className="px-2.5 py-1 text-[11px] font-semibold border border-neutral-300 hover:bg-neutral-100 text-neutral-700 cursor-pointer"
        >
          {supplier.isActive ? "Deactivate" : "Activate"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-300 pb-4 sm:pb-5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Suppliers &amp; Farmers Master
          </h1>
          <span className="text-xs font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
            {filteredSuppliers.length}
          </span>
        </div>

        {/* Desktop Controls: Dual View Switcher + Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Mandatory Desktop Dual View Switcher */}
          <div className="inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === "cards"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === "table"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* 2. MOBILE ACTION STACK (Gate UI Pattern) */}
      <div className="sm:hidden flex flex-col items-stretch gap-2.5 w-full">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs w-full"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* Content container - borderless on mobile, bordered on PC */}
      <div className="border-0 p-0 bg-transparent sm:border sm:border-neutral-300 sm:p-6 sm:bg-white/30 space-y-4 sm:space-y-5">
          {/* Subheader & Search / Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-neutral-300">
            {/* Search Input & Mobile Filter Button */}
            <div className="flex items-center gap-2 flex-1 sm:max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by supplier name, ID, village, or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
                />
              </div>

              {/* Mobile Filter Square Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className={`sm:hidden w-10 h-10 flex items-center justify-center border shrink-0 cursor-pointer relative transition-colors ${
                  typeFilter !== "ALL"
                    ? "bg-[#18181B] text-white border-[#18181B]"
                    : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                }`}
                title="Filter Options"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {typeFilter !== "ALL" && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#059669] rounded-full ring-2 ring-white" />
                )}
              </button>
            </div>

            {/* Desktop Filter Tabs */}
            <div className="hidden sm:flex items-center border border-neutral-300 divide-x divide-neutral-300 text-xs overflow-x-auto no-scrollbar shrink-0 h-10 bg-white">
              <button
                type="button"
                onClick={() => setTypeFilter("ALL")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  typeFilter === "ALL"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>All Types</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    typeFilter === "ALL"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {suppliers.length}
                </span>
              </button>
              {(["Farmer", "Aggregator", "Trader", "Company"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    typeFilter === t
                      ? "bg-[#18181B] text-white font-semibold"
                      : "bg-white text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span>{t}</span>
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-bold ${
                      typeFilter === t
                        ? "bg-[#059669] text-white"
                        : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {suppliers.filter((s) => s.type === t).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Filter Sheet */}
          <MobileFilterSheet
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            title="Filter Suppliers"
            selectedId={typeFilter}
            onSelect={(id) => setTypeFilter(id)}
            options={[
              {
                id: "ALL",
                label: "All Types",
                count: suppliers.length,
                dotColor: "bg-neutral-400",
                selectedDotColor: "bg-white ring-2 ring-white/30",
              },
              {
                id: "Farmer",
                label: "Farmer / Smallholder",
                count: suppliers.filter((s) => s.type === "Farmer").length,
                dotColor: "bg-[#059669]",
                selectedDotColor: "bg-[#10B981] ring-2 ring-[#10B981]/40",
              },
              {
                id: "Aggregator",
                label: "Aggregator",
                count: suppliers.filter((s) => s.type === "Aggregator").length,
                dotColor: "bg-blue-500",
                selectedDotColor: "bg-sky-400 ring-2 ring-sky-400/40",
              },
              {
                id: "Trader",
                label: "Commercial Trader",
                count: suppliers.filter((s) => s.type === "Trader").length,
                dotColor: "bg-amber-500",
                selectedDotColor: "bg-amber-400 ring-2 ring-amber-400/40",
              },
              {
                id: "Company",
                label: "Corporate Supplier",
                count: suppliers.filter((s) => s.type === "Company").length,
                dotColor: "bg-purple-500",
                selectedDotColor: "bg-purple-400 ring-2 ring-purple-400/40",
              },
            ]}
          />

        {filteredSuppliers.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500 font-mono">
            No suppliers match your search criteria.
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.map(renderSupplierCard)}
          </div>
        ) : (
          <>
            {/* Mobile responsive cards fallback */}
            <div className="grid grid-cols-1 sm:hidden gap-4">
              {filteredSuppliers.map(renderSupplierCard)}
            </div>

            {/* Desktop Transparent Industrial Table */}
            <div className="hidden sm:block border border-neutral-300 overflow-x-auto bg-transparent">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Supplier ID &amp; Type</th>
                    <th className="py-3 px-4">Supplier Name</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Contact Person</th>
                    <th className="py-3 px-4">Biomass Supplied</th>
                    <th className="py-3 px-4 text-right">Total Supplied</th>
                    <th className="py-3 px-4 text-right">Lifetime Payout</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300 bg-transparent">
                  {filteredSuppliers.map((supplier) => (
                    <tr
                      key={supplier.id}
                      className="hover:bg-neutral-200/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-xs text-neutral-900 block">
                          {supplier.id}
                        </span>
                        <span className="inline-block mt-0.5 text-[9px] font-bold uppercase px-1.5 py-0.5 border border-neutral-300 bg-neutral-100 text-neutral-700">
                          {supplier.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-neutral-900">
                        {supplier.name}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600">
                        {supplier.villageOrCity}, {supplier.district}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-neutral-900">{supplier.contactPerson}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">{supplier.contactNumber}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {supplier.materialsSupplied.map((m) => (
                            <span
                              key={m}
                              className="px-1.5 py-0.5 text-[10px] font-medium bg-emerald-50 text-[#047857] border border-emerald-200"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900">
                        {supplier.totalSuppliedMt.toFixed(1)} MT
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#059669]">
                        ₹{supplier.totalPayoutInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase ${
                            supplier.isActive
                              ? "bg-emerald-50 text-[#047857] border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {supplier.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => toggleSupplierStatus(supplier.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold border border-neutral-300 hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                        >
                          {supplier.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#059669]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Register New Supplier / Farmer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Supplier / Farmer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel (Kisan Agro)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Supplier Category *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="Farmer">Farmer (Direct Producer)</option>
                    <option value="Aggregator">Aggregator (Village FPC)</option>
                    <option value="Trader">Trader (Local Merchant)</option>
                    <option value="Company">Company (Mill / Factory)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contact Name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Village / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Baramati"
                    value={villageOrCity}
                    onChange={(e) => setVillageOrCity(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pune"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Biomass Materials Supplied (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cotton Stalk, Sawdust, Soybean Straw"
                  value={materialsSupplied}
                  onChange={(e) => setMaterialsSupplied(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Bank IFSC Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SBIN0001421"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    GSTIN (if registered)
                  </label>
                  <input
                    type="text"
                    placeholder="27AAXXX0000X1ZX"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    PAN Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 border border-neutral-300 bg-white text-neutral-700 font-semibold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#18181B] hover:bg-[#059669] text-white font-bold transition-colors"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
