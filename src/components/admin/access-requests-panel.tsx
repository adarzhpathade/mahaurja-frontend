"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Copy, Inbox, UserPlus, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AccessRequest, accessApi, REQUESTABLE_DESKS } from "@/lib/api/access";
import { describeApiError } from "@/lib/api/client";
import { AdminUserItem } from "@/lib/types/admin";
import { usePlantEvents } from "@/lib/api/realtime";
import { Can } from "@/lib/context/auth-context";

import { PrintButton } from "@/components/ui/print-button";

const inputClass =
  "w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669]";

const DEFAULT_DEPARTMENT: Record<string, string> = {
  "gate-security": "Inbound / Outbound Gate",
  weighbridge: "Weighment Station",
  "qc-lab": "Quality Assurance Lab",
  production: "Pelletising Plant",
  warehouse: "Raw Yards & Finished Sheds",
  "sales-dispatch": "Logistics & Outbound",
  purchase: "Procurement",
  accounts: "Finance & Accounts",
  management: "Executive Directorate",
};

const deskLabel = (roleId: string) => REQUESTABLE_DESKS.find((d) => d.roleId === roleId)?.label ?? roleId;

// One-time setup link shown after approve / password reset. The token is only returned once.
export function SetupLinkNotice({
  name,
  path,
  userId,
  onClose,
}: {
  name: string;
  path: string;
  userId?: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
  const token = path.includes("token=") ? path.split("token=")[1].split("&")[0] : undefined;

  return (
    <div className="border border-emerald-300 bg-emerald-50 p-4 space-y-3" role="status">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs text-[#047857] font-semibold">
          Send this one-time link to {name}. It works once and expires in 24 hours.
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="text-neutral-500 hover:text-neutral-900">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <input readOnly value={url} data-testid="setup-link" className={`${inputClass} font-mono text-[11px] flex-1 min-w-[200px]`} />
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(url);
            setCopied(true);
          }}
          className="h-10 px-3 border border-neutral-300 bg-white hover:bg-neutral-100 text-xs font-medium flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
        {userId && (
          <PrintButton
            docType="user-setup-slip"
            id={userId}
            paper="a4"
            token={token}
            label="Print Slip"
          />
        )}
      </div>
    </div>
  );
}

export function AccessRequestsPanel({ onApproved }: { onApproved: () => void }) {
  const queryClient = useQueryClient();

  const {
    data: requests = [],
    error: queryError,
  } = useQuery<AccessRequest[]>({
    queryKey: ["access-requests"],
    queryFn: () => accessApi.listPending(),
  });

  const loadError = queryError ? describeApiError(queryError, "Could not load access requests.") : null;

  const [selected, setSelected] = useState<AccessRequest | null>(null);
  const [form, setForm] = useState({ roleId: "", department: "", assignedPost: "", employeeCode: "", email: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [issued, setIssued] = useState<{ name: string; path: string; userId?: string } | null>(null);

  // Live: new requests from the login page and decisions by other admins via TanStack Query invalidation
  usePlantEvents(["access_request.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["access-requests"] });
  });

  const openApprove = (req: AccessRequest) => {
    setSelected(req);
    setFormError(null);
    setForm({
      roleId: req.requestedRoleId,
      department: DEFAULT_DEPARTMENT[req.requestedRoleId] ?? "",
      assignedPost: "",
      employeeCode: req.employeeCode ?? "",
      email: req.email ?? "",
    });
  };

  const approve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setBusy(true);
    setFormError(null);
    try {
      const result = await accessApi.approve(selected.id, {
        ...form,
        roleId: form.roleId as AdminUserItem["roleId"],
      });
      setIssued({ name: selected.fullName, path: result.setupUrlPath, userId: result.user?.id ?? result.userId });
      setSelected(null);
      await queryClient.invalidateQueries({ queryKey: ["access-requests"] });
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      onApproved();
    } catch (err) {
      setFormError(describeApiError(err, "Could not approve this request."));
    } finally {
      setBusy(false);
    }
  };

  const reject = async (req: AccessRequest) => {
    const reason = window.prompt(`Reason for rejecting ${req.fullName}?`);
    if (!reason) return;
    try {
      await accessApi.reject(req.id, reason);
      await queryClient.invalidateQueries({ queryKey: ["access-requests"] });
    } catch (err) {
      setFormError(describeApiError(err, "Could not reject this request."));
    }
  };

  if (requests.length === 0 && !issued && !loadError) return null;

  return (
    <section className="space-y-3" aria-label="Access requests">
      <div className="flex items-center gap-2">
        <Inbox className="w-4 h-4 text-[#059669] shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">Access Requests</span>
        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-neutral-200 border border-neutral-300">
          {requests.length}
        </span>
      </div>

      {issued && <SetupLinkNotice name={issued.name} path={issued.path} userId={issued.userId} onClose={() => setIssued(null)} />}
      {loadError && <div role="alert" className="text-xs text-[#DC2626]">{loadError}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {requests.map((req) => (
            <motion.div
              key={req.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white/40 border border-neutral-300 hover:border-neutral-900 transition-all p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-neutral-900 truncate">{req.fullName}</div>
                  <div className="text-[11px] font-mono text-neutral-500">{req.mobile}</div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 border border-amber-300 bg-amber-50 text-amber-700 shrink-0">
                  {deskLabel(req.requestedRoleId)}
                </span>
              </div>
              {req.note && <p className="text-[11px] text-neutral-600 leading-relaxed">{req.note}</p>}
              <Can perm="users:manage">
                <div className="flex gap-2 pt-2 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => openApprove(req)}
                    className="flex-1 h-8 bg-[#059669] hover:bg-[#047857] text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => void reject(req)}
                    className="h-8 px-3 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-[11px] font-semibold cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </Can>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <motion.form
            onSubmit={approve}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white border border-neutral-300 p-5 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider">Approve {selected.fullName}</h2>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-[11px] font-semibold text-neutral-700 block">Desk / Role</span>
                <select value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })} className={inputClass}>
                  {REQUESTABLE_DESKS.map((d) => (
                    <option key={d.roleId} value={d.roleId}>{d.label}</option>
                  ))}
                  <option value="admin">System Admin</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold text-neutral-700 block">EMP code</span>
                <input required value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} placeholder="EMP-011" className={`${inputClass} font-mono`} />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold text-neutral-700 block">Email (sign-in id)</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@mahaurja.local" className={inputClass} />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold text-neutral-700 block">Department</span>
                <input required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputClass} />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-[11px] font-semibold text-neutral-700 block">Assigned post</span>
                <input required value={form.assignedPost} onChange={(e) => setForm({ ...form, assignedPost: e.target.value })} placeholder="e.g. Weighbridge WB-01, Night" className={inputClass} />
              </label>
            </div>
            {formError && <div role="alert" className="border border-red-300 bg-red-50 px-3 py-2.5 text-[#DC2626] font-medium">{formError}</div>}
            <div className="pt-4 border-t border-neutral-200 flex justify-end gap-2">
              <button type="button" onClick={() => setSelected(null)} className="h-9 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 font-semibold cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={busy} className="h-9 px-4 bg-[#18181B] hover:bg-[#059669] disabled:bg-neutral-400 text-white font-bold cursor-pointer">
                {busy ? "Approving…" : "Approve & Create Account"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </section>
  );
}
