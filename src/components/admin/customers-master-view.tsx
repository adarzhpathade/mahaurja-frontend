"use client";

import React, { useState } from "react";
import {
  User,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  Table as TableIcon,
  X,
  CreditCard,
  Building,
  SlidersHorizontal,
} from "lucide-react";
import { useAdmin } from "@/lib/context/admin-context";
import { CustomerItem } from "@/lib/types/admin";

export function CustomersMasterView() {
  const { customers, addCustomer, toggleCustomerStatus } = useAdmin();
  const [viewMode, setViewMode] = useState<"CARDS" | "TABLE">("CARDS");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gstin, setGstin] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [destinationState, setDestinationState] = useState("Maharashtra");
  const [paymentTerms, setPaymentTerms] = useState("30 Days Credit");
  const [creditLimitInr, setCreditLimitInr] = useState("1000000");
  const [preferredProduct, setPreferredProduct] = useState("8mm High-Density Bio-Pellet");

  const filteredCustomers = customers.filter((c) => {
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE"
        ? c.isActive
        : c.outstandingBalanceInr > 0;
    if (!matchesStatus) return false;

    return (
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactPerson || !contactNumber || !gstin) return;

    addCustomer({
      companyName,
      contactPerson,
      contactNumber,
      email: email || `${contactPerson.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      gstin,
      deliveryAddress: deliveryAddress || "MIDC Industrial Area, Pune",
      destinationState,
      paymentTerms,
      creditLimitInr: parseFloat(creditLimitInr) || 1000000,
      preferredProduct,
      isActive: true,
    });

    setIsModalOpen(false);
    setCompanyName("");
    setContactPerson("");
    setContactNumber("");
    setGstin("");
  };

  return (
    <div className="space-y-6 select-none">
      {/* Executive Command Header */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Customer Directory &amp; Credit Master
        </h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-4 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Customer Directory Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-neutral-800 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Customer Accounts &amp; Credit
            </h2>
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {filteredCustomers.length}
            </span>
          </div>

          {/* Mandatory Desktop Dual View Switcher */}
          <div className="hidden sm:inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
            <button
              type="button"
              onClick={() => setViewMode("CARDS")}
              className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === "CARDS"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("TABLE")}
              className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === "TABLE"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
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
                  placeholder="Search by company name, contact, GSTIN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors"
                />
              </div>

              {/* Mobile Filter Square Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="sm:hidden w-10 h-10 flex items-center justify-center border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 shrink-0 cursor-pointer"
                title="Filter Options"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop Filter Tabs */}
            <div className="hidden sm:flex items-center border border-neutral-300 divide-x divide-neutral-300 text-xs overflow-x-auto no-scrollbar shrink-0 h-10 bg-white">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "ALL"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>All Accounts</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "ALL"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {customers.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("ACTIVE")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "ACTIVE"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Active</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "ACTIVE"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {customers.filter((c) => c.isActive).length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("DUE")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "DUE"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Outstanding Due</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "DUE"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {customers.filter((c) => c.outstandingBalanceInr > 0).length}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Filter Modal Popup */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:hidden">
              <div className="w-full bg-white border-t border-neutral-300 p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#059669]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Filter Customers
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("ALL");
                      setIsMobileFilterOpen(false);
                    }}
                    className={`h-11 px-4 text-xs font-semibold flex items-center justify-between border ${
                      statusFilter === "ALL"
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-white text-neutral-800 border-neutral-200"
                    }`}
                  >
                    <span>All Accounts</span>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-neutral-200/40">{customers.length}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("ACTIVE");
                      setIsMobileFilterOpen(false);
                    }}
                    className={`h-11 px-4 text-xs font-semibold flex items-center justify-between border ${
                      statusFilter === "ACTIVE"
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-white text-neutral-800 border-neutral-200"
                    }`}
                  >
                    <span>Active</span>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-neutral-200/40">
                      {customers.filter((c) => c.isActive).length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("DUE");
                      setIsMobileFilterOpen(false);
                    }}
                    className={`h-11 px-4 text-xs font-semibold flex items-center justify-between border ${
                      statusFilter === "DUE"
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-white text-neutral-800 border-neutral-200"
                    }`}
                  >
                    <span>Outstanding Due</span>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-neutral-200/40">
                      {customers.filter((c) => c.outstandingBalanceInr > 0).length}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredCustomers.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No customers match your search criteria.
            </div>
          ) : viewMode === "TABLE" ? (
        <div className="border border-neutral-300 overflow-x-auto bg-transparent">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Company Name &amp; GSTIN</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Delivery Plant Location</th>
                <th className="py-3 px-4">Payment Terms</th>
                <th className="py-3 px-4 text-right">Credit Limit</th>
                <th className="py-3 px-4 text-right">Current Outstanding</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300 bg-transparent">
              {filteredCustomers.map((customer) => {
                const creditRatio =
                  customer.creditLimitInr > 0
                    ? (customer.outstandingBalanceInr / customer.creditLimitInr) * 100
                    : 0;

                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-neutral-200/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-neutral-900">
                      {customer.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-neutral-900 block">
                        {customer.companyName}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono block">
                        GSTIN: {customer.gstin}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-neutral-900">{customer.contactPerson}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{customer.contactNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 max-w-xs truncate">
                      {customer.deliveryAddress}, {customer.destinationState}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-neutral-100 border border-neutral-300 text-neutral-800">
                        {customer.paymentTerms}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900">
                      ₹{customer.creditLimitInr.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-neutral-900">
                        ₹{customer.outstandingBalanceInr.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {creditRatio.toFixed(0)}% used
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase ${
                          customer.isActive
                            ? "bg-emerald-50 text-[#047857] border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {customer.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleCustomerStatus(customer.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold border border-neutral-300 hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                      >
                        {customer.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => {
            const creditRatio =
              customer.creditLimitInr > 0
                ? (customer.outstandingBalanceInr / customer.creditLimitInr) * 100
                : 0;

            return (
              <div
                key={customer.id}
                className="bg-white/40 border border-neutral-300 hover:border-neutral-900 transition-all p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-xs text-neutral-500">
                      {customer.id}
                    </span>
                    <h3 className="font-bold text-sm text-neutral-900 leading-tight mt-0.5">
                      {customer.companyName}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-neutral-800">
                    {customer.paymentTerms}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-neutral-600">
                  <div className="font-mono text-[11px] text-neutral-500">
                    GSTIN: {customer.gstin}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{customer.deliveryAddress}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>
                      {customer.contactPerson} · {customer.contactNumber}
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
                      Current Due
                    </span>
                    <span className="font-mono font-bold text-amber-700">
                      ₹{customer.outstandingBalanceInr.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Progress bar for credit exposure */}
                <div className="w-full bg-neutral-200 h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${
                      creditRatio > 80 ? "bg-red-600" : "bg-[#059669]"
                    }`}
                    style={{ width: `${Math.min(creditRatio, 100)}%` }}
                  />
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                      customer.isActive
                        ? "bg-emerald-50 text-[#047857] border border-emerald-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {customer.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleCustomerStatus(customer.id)}
                    className="px-2.5 py-1 text-[11px] font-semibold border border-neutral-300 hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                  >
                    {customer.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
        </div>
      </section>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#059669]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Register New Industrial Customer
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
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Customer / Corporate Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABC Industries Pvt. Ltd."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Khanna"
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
                    GSTIN Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="27AAACA1234A1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="purchase@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Delivery Plant Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Plot No., Industrial Area, City"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Payment Terms
                  </label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="100% Advance">100% Advance</option>
                    <option value="50% Advance + 50% Delivery">50% Advance + 50% Delivery</option>
                    <option value="15 Days Credit">15 Days Credit</option>
                    <option value="30 Days Credit">30 Days Credit</option>
                    <option value="45 Days Credit">45 Days Credit</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Credit Limit (₹)
                  </label>
                  <input
                    type="number"
                    value={creditLimitInr}
                    onChange={(e) => setCreditLimitInr(e.target.value)}
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
