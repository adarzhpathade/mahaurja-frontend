"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Building2,
  LayoutGrid,
  Table as TableIcon,
  X,
  AlertTriangle,
  Edit2,
  PowerOff,
  RefreshCw,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateCustomerInput,
  CustomerStatus,
  UpdateCustomerInput,
  customersApi,
} from "@/lib/api/customers";
import { describeApiError } from "@/lib/api/client";
import { usePlantEvents } from "@/lib/api/realtime";
import { Can } from "@/lib/context/auth-context";
import { CustomerItem } from "@/lib/types/admin";

interface DeliveryAddressFormItem {
  id?: string;
  label: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export function CustomersMasterView() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("30 Days Credit");
  const [creditLimitInr, setCreditLimitInr] = useState("1500000");
  const [preferredProduct, setPreferredProduct] = useState("8mm Biomass Pellet");
  const [status, setStatus] = useState<CustomerStatus>("ACTIVE");
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddressFormItem[]>([
    {
      label: "Main Factory / Site",
      address: "",
      city: "",
      state: "Madhya Pradesh",
      pincode: "",
      isDefault: true,
    },
  ]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Global action error
  const [actionError, setActionError] = useState<string | null>(null);

  // Query customers with server-side q & status filter
  const {
    data: customers = [],
    isLoading,
    error: queryError,
  } = useQuery<CustomerItem[]>({
    queryKey: ["customers", { q: searchQuery, status: statusFilter }],
    queryFn: () =>
      customersApi.list({
        q: searchQuery.trim() || undefined,
        status: statusFilter === "ALL" ? undefined : (statusFilter as CustomerStatus),
      }),
  });

  // Live SSE updates for customer changes
  usePlantEvents(["customer.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["customers"] });
  });

  const handleOpenAdd = () => {
    setCompanyName("");
    setContactPerson("");
    setContactNumber("");
    setEmail("");
    setGstin("");
    setPan("");
    setPaymentTerms("30 Days Credit");
    setCreditLimitInr("1500000");
    setPreferredProduct("8mm Biomass Pellet");
    setStatus("ACTIVE");
    setDeliveryAddresses([
      {
        label: "Main Factory / Site",
        address: "",
        city: "",
        state: "Madhya Pradesh",
        pincode: "",
        isDefault: true,
      },
    ]);
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cust: CustomerItem) => {
    setEditingCustomer(cust);
    setCompanyName(cust.companyName);
    setContactPerson(cust.contactPerson);
    setContactNumber(cust.contactNumber);
    setEmail(cust.email || "");
    setGstin(cust.gstin);
    setPan(cust.pan || "");
    setPaymentTerms(cust.paymentTerms || "30 Days Credit");
    setCreditLimitInr(String(cust.creditLimitInr || 0));
    setPreferredProduct(cust.preferredProduct || "8mm Biomass Pellet");
    setStatus(cust.status || "ACTIVE");

    if (cust.deliveryAddresses && cust.deliveryAddresses.length > 0) {
      setDeliveryAddresses(
        cust.deliveryAddresses.map((a) => ({
          id: a.id,
          label: a.label || "Site",
          address: a.address,
          city: a.city,
          state: a.state || "Madhya Pradesh",
          pincode: a.pincode || "",
          isDefault: a.isDefault ?? false,
        })),
      );
    } else {
      setDeliveryAddresses([
        {
          label: "Primary Site",
          address: cust.deliveryAddress || "",
          city: "",
          state: cust.destinationState || "Madhya Pradesh",
          pincode: "",
          isDefault: true,
        },
      ]);
    }

    setFormError(null);
    setIsEditModalOpen(true);
  };

  const addDeliveryAddressRow = () => {
    setDeliveryAddresses((prev) => [
      ...prev,
      {
        label: `Delivery Site ${prev.length + 1}`,
        address: "",
        city: "",
        state: "Madhya Pradesh",
        pincode: "",
        isDefault: prev.length === 0,
      },
    ]);
  };

  const removeDeliveryAddressRow = (index: number) => {
    setDeliveryAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactPerson.trim() || !contactNumber.trim() || !gstin.trim()) {
      return;
    }

    setFormError(null);
    setIsSaving(true);
    try {
      const validAddresses = deliveryAddresses
        .filter((a) => a.address.trim())
        .map((a) => ({
          label: a.label.trim() || "Delivery Site",
          address: a.address.trim(),
          city: a.city.trim() || "Unknown",
          state: a.state.trim() || "Madhya Pradesh",
          pincode: a.pincode.trim() || undefined,
          isDefault: a.isDefault,
        }));

      const primaryAddr = validAddresses[0]?.address || "Main Factory Site";
      const primaryState = validAddresses[0]?.state || "Madhya Pradesh";

      const input: CreateCustomerInput = {
        companyName: companyName.trim(),
        contactPerson: contactPerson.trim(),
        contactNumber: contactNumber.trim(),
        email: email.trim() || undefined,
        gstin: gstin.trim().toUpperCase(),
        pan: pan.trim().toUpperCase() || undefined,
        paymentTerms: paymentTerms.trim() || "30 Days Credit",
        creditLimitInr: parseFloat(creditLimitInr) || 0,
        preferredProduct: preferredProduct.trim() || undefined,
        deliveryAddress: primaryAddr,
        destinationState: primaryState,
        deliveryAddresses: validAddresses.length > 0 ? validAddresses : undefined,
        status,
        isActive: true,
      };

      await customersApi.create(input);
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsAddModalOpen(false);
    } catch (err: unknown) {
      setFormError(
        describeApiError(err, "Could not create customer. Please check details and try again."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !companyName.trim()) return;

    setFormError(null);
    setIsSaving(true);
    try {
      const validAddresses = deliveryAddresses
        .filter((a) => a.address.trim())
        .map((a) => ({
          label: a.label.trim() || "Delivery Site",
          address: a.address.trim(),
          city: a.city.trim() || "Unknown",
          state: a.state.trim() || "Madhya Pradesh",
          pincode: a.pincode.trim() || undefined,
          isDefault: a.isDefault,
        }));

      const primaryAddr = validAddresses[0]?.address || editingCustomer.deliveryAddress;
      const primaryState = validAddresses[0]?.state || editingCustomer.destinationState;

      const input: UpdateCustomerInput = {
        companyName: companyName.trim(),
        contactPerson: contactPerson.trim() || undefined,
        contactNumber: contactNumber.trim() || undefined,
        email: email.trim() || null,
        gstin: gstin.trim().toUpperCase() || undefined,
        pan: pan.trim().toUpperCase() || null,
        paymentTerms: paymentTerms.trim() || undefined,
        creditLimitInr: parseFloat(creditLimitInr) || 0,
        preferredProduct: preferredProduct.trim() || null,
        deliveryAddress: primaryAddr || null,
        destinationState: primaryState || undefined,
        status,
      };

      await customersApi.update(editingCustomer.id, input, editingCustomer.version);
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsEditModalOpen(false);
      setEditingCustomer(null);
    } catch (err: unknown) {
      setFormError(
        describeApiError(err, "Could not update customer. Please check details and try again."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = async (cust: CustomerItem) => {
    if (!confirm(`Are you sure you want to deactivate ${cust.companyName}?`)) return;
    setActionError(null);
    try {
      await customersApi.deactivate(cust.id, cust.version);
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
    } catch (err: unknown) {
      setActionError(
        describeApiError(err, "Could not deactivate customer. Reload and try again."),
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Customer Master
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Registered industrial buyers, commercial credit limits, GSTIN profiles & delivery sites.
          </p>
        </div>

        <Can perm="masters:manage">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="h-10 px-3.5 bg-[#18181B] text-white hover:bg-neutral-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </Can>
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
              placeholder="Search by company, GSTIN, contact person, or code..."
              className="w-full h-10 pl-9 pr-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="TRIAL">TRIAL</option>
            <option value="PROSPECT">PROSPECT</option>
            <option value="LEAD">LEAD</option>
            <option value="INACTIVE">INACTIVE</option>
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
          <span>Loading customer records...</span>
        </div>
      ) : queryError ? (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-xs">
          {describeApiError(queryError, "Could not load customers.")}
        </div>
      ) : customers.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-neutral-300 bg-white/40">
          <Building2 className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-neutral-700">
            {searchQuery || statusFilter !== "ALL"
              ? "No customers match your search criteria."
              : "No customers registered yet."}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Register buyer organizations, set billing terms, and attach delivery locations.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile view: Always renders responsive cards */}
          <div className="grid grid-cols-1 sm:hidden gap-3">
            {customers.map((cust) => (
              <CustomerCardItem
                key={cust.id}
                customer={cust}
                onEdit={handleOpenEdit}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>

          {/* Desktop view: Toggled by viewMode */}
          <div className="hidden sm:block">
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map((cust) => (
                  <CustomerCardItem
                    key={cust.id}
                    customer={cust}
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
                      <th className="py-2.5 px-3">Code / Company</th>
                      <th className="py-2.5 px-3">GSTIN</th>
                      <th className="py-2.5 px-3">Contact</th>
                      <th className="py-2.5 px-3">Delivery Sites</th>
                      <th className="py-2.5 px-3">Terms</th>
                      <th className="py-2.5 px-3 text-right">Credit Limit</th>
                      <th className="py-2.5 px-3 text-right">Outstanding</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-300">
                    {customers.map((cust) => (
                      <tr
                        key={cust.id}
                        className="hover:bg-neutral-200/40 transition-colors"
                      >
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-xs text-neutral-500 block">
                            {cust.code || cust.id}
                          </span>
                          <span className="font-bold text-neutral-900 block">
                            {cust.companyName}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-neutral-800 font-semibold block">
                            {cust.gstin}
                          </span>
                          {cust.pan && (
                            <span className="font-mono text-[10px] text-neutral-500 block">
                              PAN: {cust.pan}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-600">
                          <span className="font-medium text-neutral-900 block">
                            {cust.contactPerson}
                          </span>
                          <span className="font-mono text-[11px] block">
                            {cust.contactNumber}
                          </span>
                          {cust.email && (
                            <span className="text-[11px] text-neutral-500 block truncate max-w-[150px]">
                              {cust.email}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-600">
                          <span className="block truncate max-w-[200px]">
                            {cust.deliveryAddress || "—"}
                          </span>
                          {cust.destinationState && (
                            <span className="text-[10px] text-neutral-500 font-medium block">
                              State: {cust.destinationState}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-neutral-100 border border-neutral-300 text-neutral-700">
                            {cust.paymentTerms}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900">
                          ₹{cust.creditLimitInr.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-700">
                          ₹{cust.outstandingBalanceInr.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                              cust.isActive && cust.status === "ACTIVE"
                                ? "bg-emerald-50 text-[#047857] border border-emerald-200"
                                : cust.status === "TRIAL"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {cust.isActive ? cust.status || "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Can perm="masters:manage">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(cust)}
                                className="px-2 py-1 text-xs border border-neutral-300 hover:bg-neutral-100 font-medium text-neutral-700"
                              >
                                Edit
                              </button>
                              {cust.isActive && (
                                <button
                                  type="button"
                                  onClick={() => handleDeactivate(cust)}
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

      {/* ADD / EDIT CUSTOMER MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-neutral-300 shadow-xl w-full max-w-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#059669]" />
                <h2 className="text-base font-black text-neutral-900">
                  {isEditModalOpen ? "Edit Customer Record" : "Add New Customer"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setEditingCustomer(null);
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

            <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Company / Customer Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. ABC Industries Pvt. Ltd."
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Rajesh Khanna"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Contact Number (10 digits) *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g. 9820012345"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    GSTIN *
                  </label>
                  <input
                    type="text"
                    name="gstin"
                    required
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="27AAACA1234A1Z5"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Format: 27AAAAA0000A1Z5 (15 characters: 2-digit state code + PAN + 1Z + checksum)
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    PAN (Optional)
                  </label>
                  <input
                    type="text"
                    name="pan"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="AAACA1234A"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="procurement@company.com"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Payment Terms *
                  </label>
                  <input
                    type="text"
                    name="paymentTerms"
                    required
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="e.g. 30 Days Credit"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Credit Limit (₹) *
                  </label>
                  <input
                    type="number"
                    name="creditLimitInr"
                    required
                    min={0}
                    value={creditLimitInr}
                    onChange={(e) => setCreditLimitInr(e.target.value)}
                    placeholder="e.g. 1500000"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-semibold text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Account Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="TRIAL">TRIAL</option>
                    <option value="PROSPECT">PROSPECT</option>
                    <option value="LEAD">LEAD</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              {/* Multiple Delivery Addresses */}
              <div className="pt-3 border-t border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#059669]" />
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                      Delivery Sites & Addresses
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={addDeliveryAddressRow}
                    className="text-xs font-semibold text-[#059669] hover:text-[#047857] flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Delivery Site</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {deliveryAddresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-neutral-50 border border-neutral-300 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-neutral-700">
                          Site #{idx + 1} {addr.isDefault && "(Default)"}
                        </span>
                        {deliveryAddresses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDeliveryAddressRow(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove Site"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-neutral-500 block mb-0.5">
                            Site Label / Plant Name
                          </label>
                          <input
                            type="text"
                            value={addr.label}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDeliveryAddresses((prev) =>
                                prev.map((a, i) => (i === idx ? { ...a, label: val } : a)),
                              );
                            }}
                            placeholder="e.g. Unit 2 Boiler House"
                            className="w-full h-8 px-2.5 bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#059669]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-neutral-500 block mb-0.5">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            required
                            value={addr.address}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDeliveryAddresses((prev) =>
                                prev.map((a, i) => (i === idx ? { ...a, address: val } : a)),
                              );
                            }}
                            placeholder="e.g. Plot No. 45, MIDC Chakan, Phase 2"
                            className="w-full h-8 px-2.5 bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#059669]"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-500 block mb-0.5">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={addr.city}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDeliveryAddresses((prev) =>
                                prev.map((a, i) => (i === idx ? { ...a, city: val } : a)),
                              );
                            }}
                            placeholder="e.g. Pune"
                            className="w-full h-8 px-2.5 bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#059669]"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-500 block mb-0.5">
                            Destination State *
                          </label>
                          <input
                            type="text"
                            required
                            value={addr.state}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDeliveryAddresses((prev) =>
                                prev.map((a, i) => (i === idx ? { ...a, state: val } : a)),
                              );
                            }}
                            placeholder="e.g. Madhya Pradesh"
                            className="w-full h-8 px-2.5 bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#059669]"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-500 block mb-0.5">
                            Pincode
                          </label>
                          <input
                            type="text"
                            value={addr.pincode}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDeliveryAddresses((prev) =>
                                prev.map((a, i) => (i === idx ? { ...a, pincode: val } : a)),
                              );
                            }}
                            placeholder="6 digits"
                            className="w-full h-8 px-2.5 bg-white border border-neutral-300 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#059669]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setEditingCustomer(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#18181B] hover:bg-neutral-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving..."
                    : isEditModalOpen
                    ? "Update Customer"
                    : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomerCardItem({
  customer,
  onEdit,
  onDeactivate,
}: {
  customer: CustomerItem;
  onEdit: (cust: CustomerItem) => void;
  onDeactivate: (cust: CustomerItem) => void;
}) {
  return (
    <div className="bg-white/40 border border-neutral-300 hover:border-neutral-900 transition-all p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono font-bold text-xs text-neutral-500">
            {customer.code || customer.id}
          </span>
          <h3 className="font-bold text-sm text-neutral-900 leading-tight mt-0.5">
            {customer.companyName}
          </h3>
        </div>
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
            customer.isActive && customer.status === "ACTIVE"
              ? "bg-emerald-50 text-[#047857] border-emerald-200"
              : customer.status === "TRIAL"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {customer.status || (customer.isActive ? "ACTIVE" : "INACTIVE")}
        </span>
      </div>

      <div className="text-xs space-y-1 text-neutral-600">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="font-mono font-semibold text-neutral-800">
            GSTIN: {customer.gstin}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>
            {customer.contactPerson} ·{" "}
            <span className="font-mono">{customer.contactNumber}</span>
          </span>
        </div>
        {customer.email && (
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{customer.email}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 pt-0.5">
          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="truncate">
            {customer.deliveryAddress || "Address not specified"}
            {customer.destinationState && ` (${customer.destinationState})`}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-neutral-500 uppercase block font-semibold">
            Credit Limit
          </span>
          <span className="font-mono font-bold text-neutral-900">
            ₹{customer.creditLimitInr.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-neutral-500 uppercase block font-semibold">
            Terms
          </span>
          <span className="text-xs font-semibold text-neutral-700">
            {customer.paymentTerms}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
        <span className="text-[10px] text-neutral-500 font-medium">
          Orders: {customer.totalOrdersMt.toFixed(1)} MT
        </span>

        <Can perm="masters:manage">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(customer)}
              className="p-1 hover:bg-neutral-200 text-neutral-600 transition-colors"
              title="Edit Customer"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            {customer.isActive && (
              <button
                type="button"
                onClick={() => onDeactivate(customer)}
                className="p-1 hover:bg-red-100 text-red-600 transition-colors"
                title="Deactivate Customer"
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
