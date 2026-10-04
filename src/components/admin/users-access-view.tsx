"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  Plus,
  UserCheck,
  UserX,
  Mail,
  Clock,
  Building,
  LayoutGrid,
  Table as TableIcon,
  X,
  BadgeCheck,
  SlidersHorizontal,
} from "lucide-react";
import { useAdmin } from "@/lib/context/admin-context";
import { AdminUserItem } from "@/lib/types/admin";

export function UsersAccessView() {
  const { users, addUser, toggleUserStatus } = useAdmin();
  const [viewMode, setViewMode] = useState<"CARDS" | "TABLE">("CARDS");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Inbound / Outbound Gate");
  const [roleId, setRoleId] = useState<AdminUserItem["roleId"]>("gate-security");
  const [assignedPost, setAssignedPost] = useState("Gate Post 01");
  const [shift, setShift] = useState<AdminUserItem["shift"]>("Day Shift A (06:00 - 14:00)");

  const filteredUsers = users.filter((u) => {
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE"
        ? u.isActive
        : !u.isActive;
    if (!matchesStatus) return false;

    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.assignedPost.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !employeeCode) return;

    addUser({
      employeeCode,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@mahaurja.com`,
      department,
      roleId,
      assignedPost,
      shift,
      isActive: true,
    });

    setIsModalOpen(false);
    setName("");
    setEmployeeCode("");
  };

  return (
    <div className="space-y-6 select-none">
      {/* Executive Command Header */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          User Access &amp; Station Profiles
        </h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-4 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Register Operator</span>
          </button>
        </div>
      </div>

      {/* Personnel Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Personnel &amp; Operator Roster
            </h2>
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {filteredUsers.length}
            </span>
          </div>

          {/* Dual View Switcher */}
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
                  placeholder="Search operator name, EMP code, department..."
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
                <span>All Personnel</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "ALL"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {users.length}
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
                <span>On Duty</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "ACTIVE"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {users.filter((u) => u.isActive).length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("INACTIVE")}
                className={`h-full px-3.5 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "INACTIVE"
                    ? "bg-[#18181B] text-white font-semibold"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Suspended</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    statusFilter === "INACTIVE"
                      ? "bg-[#059669] text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {users.filter((u) => !u.isActive).length}
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
                      Filter Personnel
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
                    <span>All Personnel</span>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-neutral-200/40">{users.length}</span>
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
                    <span>On Duty</span>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-neutral-200/40">
                      {users.filter((u) => u.isActive).length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("INACTIVE");
                      setIsMobileFilterOpen(false);
                    }}
                    className={`h-11 px-4 text-xs font-semibold flex items-center justify-between border ${
                      statusFilter === "INACTIVE"
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-white text-neutral-800 border-neutral-200"
                    }`}
                  >
                    <span>Suspended</span>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-neutral-200/40">
                      {users.filter((u) => !u.isActive).length}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No personnel match your search criteria.
            </div>
          ) : viewMode === "TABLE" ? (
        <div className="border border-neutral-300 overflow-x-auto bg-transparent">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">EMP Code &amp; Operator</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Operational Role</th>
                <th className="py-3 px-4">Physical Station / Post</th>
                <th className="py-3 px-4">Shift Schedule</th>
                <th className="py-3 px-4">Last Station Activity</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300 bg-transparent">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-200/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-xs text-neutral-900 block">
                      {user.employeeCode}
                    </span>
                    <span className="font-semibold text-neutral-900 block mt-0.5">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {user.email}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-neutral-800">
                    {user.department}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#18181B] text-white">
                      {user.roleId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-700 font-medium">
                    {user.assignedPost}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 text-[11px]">
                    {user.shift}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500">
                    {user.lastLogin}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase ${
                        user.isActive
                          ? "bg-emerald-50 text-[#047857] border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {user.isActive ? "ON DUTY" : "OFFLINE"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(user.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold border border-neutral-300 hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                    >
                      {user.isActive ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white/40 border border-neutral-300 hover:border-neutral-900 transition-all p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-neutral-500">
                    {user.employeeCode}
                  </span>
                  <h3 className="font-bold text-sm text-neutral-900 leading-tight mt-0.5">
                    {user.name}
                  </h3>
                  <span className="text-[11px] text-neutral-500 block truncate">
                    {user.department}
                  </span>
                </div>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#18181B] text-white">
                  {user.roleId}
                </span>
              </div>

              <div className="text-xs text-neutral-600 space-y-1 pt-1">
                <div>
                  Post: <span className="font-semibold text-neutral-900">{user.assignedPost}</span>
                </div>
                <div className="text-[11px] text-neutral-500">
                  {user.shift}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 ${
                    user.isActive
                      ? "bg-emerald-50 text-[#047857] border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {user.isActive ? "ON DUTY" : "SUSPENDED"}
                </span>

                <button
                  type="button"
                  onClick={() => toggleUserStatus(user.id)}
                  className="px-2 py-0.5 text-[10px] font-semibold border border-neutral-300 hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                >
                  {user.isActive ? "Suspend" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
        </div>
      </section>

      {/* Add Operator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Register Plant Operator
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Employee Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EMP-1009"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Operator Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@mahaurja.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Operational Role *
                  </label>
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value as any)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="gate-security">Gate Security</option>
                    <option value="weighbridge">Weighbridge</option>
                    <option value="qc-lab">QC Lab</option>
                    <option value="production">Production</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="sales-dispatch">Sales &amp; Dispatch</option>
                    <option value="management">Management</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Shift
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="Day Shift A (06:00 - 14:00)">Day Shift A (06:00 - 14:00)</option>
                    <option value="General Shift (09:00 - 18:00)">General Shift (09:00 - 18:00)</option>
                    <option value="Night Shift B (14:00 - 22:00)">Night Shift B (14:00 - 22:00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Assigned Console / Post
                  </label>
                  <input
                    type="text"
                    value={assignedPost}
                    onChange={(e) => setAssignedPost(e.target.value)}
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
                  Save Operator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
