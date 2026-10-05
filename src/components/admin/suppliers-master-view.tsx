"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Phone,
  MapPin,
  Building2,
  LayoutGrid,
  Table as TableIcon,
  X,
  CreditCard,
  AlertTriangle,
  UserPlus,
  Edit2,
  PowerOff,
  RefreshCw,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateSupplierInput,
  SupplierType,
  UpdateSupplierInput,
  suppliersApi,
} from "@/lib/api/suppliers";
import { describeApiError } from "@/lib/api/client";
import { usePlantEvents } from "@/lib/api/realtime";
import { Can } from "@/lib/context/auth-context";
import { SupplierItem } from "@/lib/types/admin";

export function SuppliersMasterView() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // Modals state
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierItem | null>(null);

  // Quick Registration Form State
  const [quickName, setQuickName] = useState("");
  const [quickMobile, setQuickMobile] = useState("");
  const [quickVillage, setQuickVillage] = useState("");
  const [quickError, setQuickError] = useState<string | null>(null);
  const [isSavingQuick, setIsSavingQuick] = useState(false);

  // Full / Edit Supplier Form State
  const [name, setName] = useState("");
  const [type, setType] = useState<SupplierType>("Farmer");
  const [mobile, setMobile] = useState("");
  const [alternateMobile, setAlternateMobile] = useState("");
  const [village, setVillage] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Madhya Pradesh");
  const [pincode, setPincode] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [materialsSupplied, setMaterialsSupplied] = useState("");
  const [remarks, setRemarks] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSavingFull, setIsSavingFull] = useState(false);

  // Global action error banner
  const [actionError, setActionError] = useState<string | null>(null);

  // Server-side search & filtering query
  const {
    data: suppliers = [],
    isLoading,
    error: queryError,
  } = useQuery<SupplierItem[]>({
    queryKey: ["suppliers", { q: searchQuery, type: typeFilter }],
    queryFn: () =>
      suppliersApi.list({
        q: searchQuery.trim() || undefined,
        type: typeFilter === "ALL" ? undefined : (typeFilter as SupplierType),
      }),
  });

  // Live SSE updates for real-time collaboration
  usePlantEvents(["supplier.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["suppliers"] });
  });

  // Open Quick Register Modal
  const handleOpenQuick = () => {
    setQuickName("");
    setQuickMobile("");
    setQuickVillage("");
    setQuickError(null);
    setIsQuickModalOpen(true);
  };

  // Submit Quick Register
  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickMobile.trim() || !quickVillage.trim()) return;

    setQuickError(null);
    setIsSavingQuick(true);
    try {
      await suppliersApi.quickRegister({
        name: quickName.trim(),
        mobile: quickMobile.trim(),
        village: quickVillage.trim(),
      });
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setIsQuickModalOpen(false);
      setQuickName("");
      setQuickMobile("");
      setQuickVillage("");
    } catch (err: unknown) {
      setQuickError(
        describeApiError(err, "Could not register farmer. Please check details and try again."),
      );
    } finally {
      setIsSavingQuick(false);
    }
  };

  // Open Full Add Modal
  const handleOpenAdd = () => {
    setName("");
    setType("Farmer");
    setMobile("");
    setAlternateMobile("");
    setVillage("");
    setTehsil("");
    setDistrict("");
    setState("Madhya Pradesh");
    setPincode("");
    setContactPerson("");
    setGstin("");
    setPan("");
    setBankAccount("");
    setBankIfsc("");
    setBankName("");
    setBankBranch("");
    setMaterialsSupplied("");
    setRemarks("");
    setFormError(null);
    setIsFullModalOpen(true);
  };

  // Submit Full Add
  const handleFullSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) return;

    setFormError(null);
    setIsSavingFull(true);
    try {
      const input: CreateSupplierInput = {
        name: name.trim(),
        type,
        mobile: mobile.trim(),
        alternateMobile: alternateMobile.trim() || undefined,
        village: village.trim() || undefined,
        tehsil: tehsil.trim() || undefined,
        district: district.trim() || undefined,
        state: state.trim() || undefined,
        pincode: pincode.trim() || undefined,
        contactPerson: contactPerson.trim() || undefined,
        gstin: gstin.trim().toUpperCase() || undefined,
        pan: pan.trim().toUpperCase() || undefined,
        bankAccount: bankAccount.trim() || undefined,
        bankIfsc: bankIfsc.trim().toUpperCase() || undefined,
        bankName: bankName.trim() || undefined,
        bankBranch: bankBranch.trim() || undefined,
        materialsSupplied: materialsSupplied
          ? materialsSupplied.split(",").map((m) => m.trim()).filter(Boolean)
          : undefined,
        remarks: remarks.trim() || undefined,
        isActive: true,
      };

      await suppliersApi.create(input);
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setIsFullModalOpen(false);
    } catch (err: unknown) {
      setFormError(
        describeApiError(err, "Could not save supplier. Please check details and try again."),
      );
    } finally {
      setIsSavingFull(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (sup: SupplierItem) => {
    setEditingSupplier(sup);
    setName(sup.name);
    setType(sup.type);
    setMobile(sup.contactNumber || "");
    setAlternateMobile("");
    setVillage(sup.villageOrCity || "");
    setTehsil("");
    setDistrict(sup.district || "");
    setState("Madhya Pradesh");
    setPincode("");
    setContactPerson(sup.contactPerson || "");
    setGstin(sup.gstin || "");
    setPan(sup.pan || "");
    setBankAccount(sup.bankAccount || "");
    setBankIfsc(sup.bankIfsc || "");
    setBankName(sup.bankName || "");
    setBankBranch(sup.bankBranch || "");
    setMaterialsSupplied(sup.materialsSupplied ? sup.materialsSupplied.join(", ") : "");
    setRemarks(sup.remarks || "");
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier || !name.trim()) return;

    setFormError(null);
    setIsSavingFull(true);
    try {
      const input: UpdateSupplierInput = {
        name: name.trim(),
        type,
        mobile: mobile.trim() || undefined,
        alternateMobile: alternateMobile.trim() || null,
        village: village.trim() || null,
        tehsil: tehsil.trim() || null,
        district: district.trim() || null,
        state: state.trim() || undefined,
        pincode: pincode.trim() || null,
        contactPerson: contactPerson.trim() || null,
        gstin: gstin.trim().toUpperCase() || null,
        pan: pan.trim().toUpperCase() || null,
        bankAccount: bankAccount.trim() || null,
        bankIfsc: bankIfsc.trim().toUpperCase() || null,
        bankName: bankName.trim() || null,
        bankBranch: bankBranch.trim() || null,
        materialsSupplied: materialsSupplied
          ? materialsSupplied.split(",").map((m) => m.trim()).filter(Boolean)
          : undefined,
        remarks: remarks.trim() || null,
      };

      await suppliersApi.update(editingSupplier.id, input, editingSupplier.version);
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setIsEditModalOpen(false);
      setEditingSupplier(null);
    } catch (err: unknown) {
      setFormError(
        describeApiError(err, "Could not update supplier. Please check details and try again."),
      );
    } finally {
      setIsSavingFull(false);
    }
  };

  // Deactivate Supplier
  const handleDeactivate = async (sup: SupplierItem) => {
    if (!confirm(`Are you sure you want to deactivate ${sup.name}?`)) return;
    setActionError(null);
    try {
      await suppliersApi.deactivate(sup.id, sup.version);
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    } catch (err: unknown) {
      setActionError(
        describeApiError(err, "Could not deactivate supplier. Reload and try again."),
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Command Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Suppliers & Farmers Master
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Raw material supplier directory, farm profiles, payment accounts & procurement links.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Can perm="masters:manage">
            {/* Quick Register Farmer (< 60s) */}
            <button
              type="button"
              onClick={handleOpenQuick}
              className="h-10 px-3.5 bg-emerald-50 text-[#047857] hover:bg-emerald-100 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Quick Register Farmer</span>
            </button>

            {/* Full Add Supplier */}
            <button
              type="button"
              onClick={handleOpenAdd}
              className="h-10 px-3.5 bg-[#18181B] text-white hover:bg-neutral-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Supplier</span>
            </button>
          </Can>
        </div>
      </div>

      {/* Global Error Banner */}
      {actionError && (
        <div
          role="alert"
          className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-red-500 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Operational Controls Bar (Search + Filter + View Switcher) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-100/60 p-2.5 border border-neutral-300">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, mobile, village, or code..."
              className="w-full h-10 pl-9 pr-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669]"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
          >
            <option value="ALL">All Supplier Types</option>
            <option value="Farmer">Farmer</option>
            <option value="Trader">Trader</option>
            <option value="Aggregator">Aggregator</option>
            <option value="Company">Company</option>
          </select>
        </div>

        {/* View Switcher: Mandatory Desktop Dual View [ Cards ] [ Table ] */}
        <div className="hidden sm:inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`px-3 flex items-center gap-1.5 transition-colors ${
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
            className={`px-3 flex items-center gap-1.5 transition-colors ${
              viewMode === "table"
                ? "bg-[#18181B] text-white font-semibold"
                : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-neutral-500 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-neutral-400" />
          <span>Loading suppliers...</span>
        </div>
      ) : queryError ? (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-xs">
          {describeApiError(queryError, "Could not load suppliers.")}
        </div>
      ) : suppliers.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-neutral-300 bg-white/40">
          <Users className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-neutral-700">
            {searchQuery || typeFilter !== "ALL"
              ? "No suppliers match your search criteria."
              : "No suppliers registered yet."}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Use &quot;Quick Register Farmer&quot; or &quot;Add Supplier&quot; to onboard farmers and biomass vendors.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile view: Always renders responsive cards */}
          <div className="grid grid-cols-1 sm:hidden gap-3">
            {suppliers.map((sup) => (
              <SupplierCardItem
                key={sup.id}
                supplier={sup}
                onEdit={handleOpenEdit}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>

          {/* Desktop view: Toggled by viewMode */}
          <div className="hidden sm:block">
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((sup) => (
                  <SupplierCardItem
                    key={sup.id}
                    supplier={sup}
                    onEdit={handleOpenEdit}
                    onDeactivate={handleDeactivate}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-neutral-300 overflow-x-auto bg-transparent">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Code / Name</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Contact</th>
                      <th className="py-2.5 px-3">Bank Account</th>
                      <th className="py-2.5 px-3 text-right">Supplied</th>
                      <th className="py-2.5 px-3 text-right">Payout</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-300">
                    {suppliers.map((sup) => (
                      <tr
                        key={sup.id}
                        className="hover:bg-neutral-200/40 transition-colors"
                      >
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-xs text-neutral-500 block">
                            {sup.code || sup.id}
                          </span>
                          <span className="font-bold text-neutral-900 block">
                            {sup.name}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 border border-neutral-300 bg-neutral-100 text-neutral-700">
                            {sup.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-neutral-600">
                          {sup.villageOrCity ? `${sup.villageOrCity}${sup.district ? `, ${sup.district}` : ""}` : "—"}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-600">
                          <span className="font-mono">{sup.contactNumber}</span>
                          {sup.contactPerson && sup.contactPerson !== sup.name && (
                            <span className="text-[11px] text-neutral-500 block">
                              {sup.contactPerson}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {sup.bankAccount ? (
                            <div className="font-mono text-neutral-800">
                              <span>{sup.bankAccount}</span>
                              {sup.bankIfsc && (
                                <span className="text-[10px] text-neutral-500 block">
                                  {sup.bankIfsc}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-neutral-900">
                          {sup.totalSuppliedMt.toFixed(1)} MT
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#059669]">
                          ₹{sup.totalPayoutInr.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                              sup.isActive
                                ? "bg-emerald-50 text-[#047857] border border-emerald-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {sup.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Can perm="masters:manage">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(sup)}
                                className="px-2 py-1 text-xs border border-neutral-300 hover:bg-neutral-100 font-medium text-neutral-700"
                              >
                                Edit
                              </button>
                              {sup.isActive && (
                                <button
                                  type="button"
                                  onClick={() => handleDeactivate(sup)}
                                  className="px-2 py-1 text-xs border border-red-200 text-red-600 hover:bg-red-50 font-medium"
                                >
                                  Deactivate
                                </button>
                              )}
                            </div>
                          </Can>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* QUICK REGISTER FARMER MODAL (3 Fields, < 60s) */}
      {isQuickModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-neutral-300 shadow-xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#059669]" />
                <h2 className="text-base font-black text-neutral-900">Quick Register Farmer</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Fast-track farmer registration for gate weighment. Takes less than 60 seconds.
            </p>

            {quickError && (
              <div
                role="alert"
                className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{quickError}</span>
              </div>
            )}

            <form onSubmit={handleQuickSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Farmer / Supplier Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Mobile Number (10 digits) *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  value={quickMobile}
                  onChange={(e) => setQuickMobile(e.target.value)}
                  placeholder="e.g. 9823411223"
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Village *
                </label>
                <input
                  type="text"
                  name="village"
                  required
                  value={quickVillage}
                  onChange={(e) => setQuickVillage(e.target.value)}
                  placeholder="e.g. Baramati"
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingQuick}
                  className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isSavingQuick ? "Registering..." : "Register Farmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL ADD / EDIT SUPPLIER MODAL */}
      {(isFullModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-neutral-300 shadow-xl w-full max-w-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#059669]" />
                <h2 className="text-base font-black text-neutral-900">
                  {isEditModalOpen ? "Edit Supplier Record" : "Add Full Supplier Record"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsFullModalOpen(false);
                  setIsEditModalOpen(false);
                  setEditingSupplier(null);
                }}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div
                role="alert"
                className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={isEditModalOpen ? handleEditSubmit : handleFullSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Supplier / Entity Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kisan Agro FPC"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Supplier Type *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as SupplierType)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Trader">Trader</option>
                    <option value="Aggregator">Aggregator</option>
                    <option value="Company">Company</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Primary Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Contact person name"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Village / City
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Village or Town"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="District name"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    GSTIN (Optional)
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="e.g. 23AAAAA0000A1Z5"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    PAN (Optional)
                  </label>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="Bank account number"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Bank IFSC Code
                  </label>
                  <input
                    type="text"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                    placeholder="e.g. SBIN0001421"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Materials Supplied (Comma-separated)
                </label>
                <input
                  type="text"
                  value={materialsSupplied}
                  onChange={(e) => setMaterialsSupplied(e.target.value)}
                  placeholder="e.g. Cotton Stalk, Soybean Straw, Mustard Straw"
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Remarks / Notes
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Operational remarks or harvest cycle notes"
                  className="w-full p-2.5 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFullModalOpen(false);
                    setIsEditModalOpen(false);
                    setEditingSupplier(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingFull}
                  className="px-4 py-2 bg-[#18181B] hover:bg-neutral-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isSavingFull
                    ? "Saving..."
                    : isEditModalOpen
                    ? "Update Supplier"
                    : "Save Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Supplier Card sub-component for modularity
function SupplierCardItem({
  supplier,
  onEdit,
  onDeactivate,
}: {
  supplier: SupplierItem;
  onEdit: (sup: SupplierItem) => void;
  onDeactivate: (sup: SupplierItem) => void;
}) {
  return (
    <div className="bg-white/40 border border-neutral-300 hover:border-neutral-900 transition-all p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono font-bold text-xs text-neutral-500">
            {supplier.code || supplier.id}
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
            {supplier.villageOrCity
              ? `${supplier.villageOrCity}${supplier.district ? `, ${supplier.district}` : ""}`
              : "Location not set"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="font-mono">
            {supplier.contactNumber}
            {supplier.contactPerson && supplier.contactPerson !== supplier.name && (
              <span className="text-neutral-500 font-sans ml-1">
                ({supplier.contactPerson})
              </span>
            )}
          </span>
        </div>
        {supplier.bankAccount && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <CreditCard className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="font-mono text-neutral-700">
              A/C: {supplier.bankAccount}
              {supplier.bankIfsc && ` · ${supplier.bankIfsc}`}
            </span>
          </div>
        )}
      </div>

      {supplier.materialsSupplied && supplier.materialsSupplied.length > 0 && (
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
      )}

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

        <Can perm="masters:manage">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(supplier)}
              className="p-1 hover:bg-neutral-200 text-neutral-600 transition-colors"
              title="Edit Supplier"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            {supplier.isActive && (
              <button
                type="button"
                onClick={() => onDeactivate(supplier)}
                className="p-1 hover:bg-red-100 text-red-600 transition-colors"
                title="Deactivate Supplier"
              >
                <PowerOff className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </Can>
      </div>
    </div>
  );
}
