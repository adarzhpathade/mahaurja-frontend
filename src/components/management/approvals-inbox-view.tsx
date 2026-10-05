"use client";

import React, { useState, useId } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  LayoutGrid,
  Table as TableIcon,
  X,
  Ban,
  Check,
  Sparkles,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approvalsApi,
  ApprovalRequestItem,
} from "@/lib/api/approvals";
import { usePlantEvents } from "@/lib/api/realtime";
import { useAuth, Can } from "@/lib/context/auth-context";
import { describeApiError } from "@/lib/api/client";

type TabMode = "pending" | "mine" | "history";

export function ApprovalsInboxView() {
  const queryClient = useQueryClient();
  const searchInputId = useId();
  const approveNotesId = useId();
  const rejectReasonId = useId();
  const { user } = useAuth();
  const [tabMode, setTabMode] = useState<TabMode>("pending");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");

  // Invalidate on realtime events
  usePlantEvents(["approval.requested", "approval.decided"], () => {
    void queryClient.invalidateQueries({ queryKey: ["approvals"] });
  });

  // Query approvals based on current tab
  const { data: approvals = [], isLoading } = useQuery({
    queryKey: ["approvals", { tab: tabMode }],
    queryFn: () => {
      if (tabMode === "pending") {
        return approvalsApi.list({ status: "PENDING" });
      }
      if (tabMode === "mine") {
        return approvalsApi.list({ mine: true, status: "ALL" });
      }
      return approvalsApi.list({ status: "ALL" });
    },
  });

  // Modals state
  const [activeItem, setActiveItem] = useState<ApprovalRequestItem | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveReason, setApproveReason] = useState("");
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dev creation modal
  const [isDevCreating, setIsDevCreating] = useState(false);

  // Filter approvals by search
  const filteredApprovals = approvals.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.code.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.requesterName.toLowerCase().includes(q)
    );
  });

  const pendingCount = approvals.filter((a) => a.status === "PENDING").length;

  const handleOpenApprove = (item: ApprovalRequestItem) => {
    setActiveItem(item);
    setApproveReason("");
    setActionError(null);
    setIsApproveOpen(true);
  };

  const handleOpenReject = (item: ApprovalRequestItem) => {
    setActiveItem(item);
    setRejectReason("");
    setActionError(null);
    setIsRejectOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!activeItem) return;
    try {
      setIsProcessing(true);
      setActionError(null);
      await approvalsApi.approve(activeItem.id, approveReason);
      await queryClient.invalidateQueries({ queryKey: ["approvals"] });
      setIsApproveOpen(false);
    } catch (err) {
      const msg = describeApiError(err, "Failed to approve request");
      setActionError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!activeItem) return;
    if (!rejectReason.trim()) {
      setActionError("Reason is required when rejecting an approval request.");
      return;
    }
    try {
      setIsProcessing(true);
      setActionError(null);
      await approvalsApi.reject(activeItem.id, rejectReason.trim());
      await queryClient.invalidateQueries({ queryKey: ["approvals"] });
      setIsRejectOpen(false);
    } catch (err) {
      const msg = describeApiError(err, "Failed to reject request");
      setActionError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelRequest = async (item: ApprovalRequestItem) => {
    if (!confirm(`Are you sure you want to cancel request ${item.code}?`)) return;
    try {
      await approvalsApi.cancel(item.id);
      await queryClient.invalidateQueries({ queryKey: ["approvals"] });
    } catch (err) {
      const msg = describeApiError(err, "Failed to cancel request");
      alert(msg);
    }
  };

  const handleCreateDevTest = async () => {
    try {
      setIsDevCreating(true);
      await approvalsApi.devRequest({
        type: "PURCHASE_PRICE",
        summary: `Raw material purchase rate test (₹${(Math.floor(Math.random() * 20) + 40) * 100}/MT)`,
        amountInr: 48000,
      });
      await queryClient.invalidateQueries({ queryKey: ["approvals"] });
    } catch (err) {
      const msg = describeApiError(err, "Failed to create dev request");
      alert(msg);
    } finally {
      setIsDevCreating(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* 1. COMMAND HEADER */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
              Approvals Inbox
            </h1>
            <span className="text-xs font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {pendingCount} PENDING
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Plant operational governance workbench. Authorized directors review and decide transactions exceeding preset thresholds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Dual View Switcher */}
          <div className="hidden sm:inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`px-3 py-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
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
              className={`px-3 py-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          {/* Dev Test trigger */}
          {process.env.NODE_ENV !== "production" && (
            <button
              type="button"
              onClick={handleCreateDevTest}
              disabled={isDevCreating}
              className="h-10 px-4 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Generate a test approval request (Dev only)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isDevCreating ? "Generating..." : "Dev Request"}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TABS & SEARCH */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-neutral-300 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setTabMode("pending")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all shrink-0 ${
              tabMode === "pending"
                ? "bg-[#18181B] text-white border-[#18181B]"
                : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
            }`}
          >
            Pending Actions ({approvals.filter((a) => a.status === "PENDING").length})
          </button>

          <button
            type="button"
            onClick={() => setTabMode("mine")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all shrink-0 ${
              tabMode === "mine"
                ? "bg-[#18181B] text-white border-[#18181B]"
                : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
            }`}
          >
            My Requests
          </button>

          <button
            type="button"
            onClick={() => setTabMode("history")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all shrink-0 ${
              tabMode === "history"
                ? "bg-[#18181B] text-white border-[#18181B]"
                : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
            }`}
          >
            Decision History
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <label htmlFor={searchInputId} className="sr-only">Search approvals</label>
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id={searchInputId}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code, summary, requester..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-[#059669]"
          />
        </div>
      </div>

      {/* 3. CONTENT AREA */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading approval requests...</div>
      ) : filteredApprovals.length === 0 ? (
        <div className="p-12 text-center space-y-3 border border-neutral-300 bg-white/40">
          <CheckCircle2 className="w-8 h-8 mx-auto text-[#059669]" />
          <div className="text-sm font-bold text-neutral-800">
            {tabMode === "pending"
              ? "All caught up! No pending approvals."
              : tabMode === "mine"
              ? "You have not submitted any approval requests."
              : "No historical approval records found."}
          </div>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Transactions exceeding plant operational limits will automatically appear in this inbox.
          </p>
        </div>
      ) : viewMode === "cards" ? (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApprovals.map((item) => {
            const isSelf = user?.id === item.requestedBy;
            return (
              <div
                key={item.id}
                className="bg-white/40 border border-neutral-300 p-5 space-y-4 hover:border-neutral-900 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-900">
                          {item.code}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-700">
                          {item.type.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span>Submitted {new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 shrink-0 ${
                        item.status === "PENDING"
                          ? "bg-amber-50 text-amber-800 border border-amber-300"
                          : item.status === "APPROVED"
                          ? "bg-emerald-50 text-[#047857] border border-emerald-300"
                          : item.status === "REJECTED"
                          ? "bg-rose-50 text-rose-800 border border-rose-300"
                          : "bg-neutral-200 text-neutral-600 border border-neutral-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Summary */}
                  <h4 className="font-bold text-sm text-neutral-900 leading-snug">
                    {item.summary}
                  </h4>

                  {/* Telemetry / Value Info */}
                  <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
                    {item.amountInr !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Transaction Value:</span>
                        <span className="font-mono font-black text-sm text-neutral-900">
                          ₹{item.amountInr.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Requested By:</span>
                      <span className="font-semibold text-neutral-900">
                        {item.requesterName} {isSelf && "(You)"}
                      </span>
                    </div>
                  </div>

                  {/* Decision info (if decided) */}
                  {item.status !== "PENDING" && (
                    <div className="p-2.5 bg-neutral-100 border border-neutral-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-neutral-600">
                          Decided By:
                        </span>
                        <span className="font-semibold text-neutral-900">
                          {item.deciderName || "Authorized Manager"}
                        </span>
                      </div>
                      {item.reason && (
                        <div className="text-neutral-700 italic">
                          &ldquo;{item.reason}&rdquo;
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-neutral-400">
                    ID: {item.id.slice(0, 8)}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.status === "PENDING" && isSelf && (
                      <button
                        type="button"
                        onClick={() => handleCancelRequest(item)}
                        className="px-2.5 py-1 text-xs font-semibold border border-neutral-300 hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                      >
                        Cancel Request
                      </button>
                    )}

                    {item.status === "PENDING" && !isSelf && (
                      <Can perm="approvals:decide">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenReject(item)}
                            className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-rose-300 text-rose-700 hover:bg-rose-50 cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenApprove(item)}
                            className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#059669] hover:bg-[#047857] text-white cursor-pointer shadow-2xs"
                          >
                            Approve
                          </button>
                        </div>
                      </Can>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW (Transparent Industrial Table) */
        <div className="border border-neutral-300 overflow-x-auto bg-transparent">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Plain-English Summary</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                <th className="py-2.5 px-3">Requested By</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300">
              {filteredApprovals.map((item) => {
                const isSelf = user?.id === item.requestedBy;
                return (
                  <tr key={item.id} className="hover:bg-neutral-200/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">
                      {item.code}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-700">
                        {item.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-neutral-900 max-w-sm">
                      {item.summary}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-right font-bold text-neutral-900">
                      {item.amountInr !== null ? `₹${item.amountInr.toLocaleString()}` : "–"}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700">
                      {item.requesterName} {isSelf && "(You)"}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                          item.status === "PENDING"
                            ? "bg-amber-50 text-amber-800 border border-amber-300"
                            : item.status === "APPROVED"
                            ? "bg-emerald-50 text-[#047857] border border-emerald-300"
                            : item.status === "REJECTED"
                            ? "bg-rose-50 text-rose-800 border border-rose-300"
                            : "bg-neutral-200 text-neutral-600 border border-neutral-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {item.status === "PENDING" && isSelf && (
                        <button
                          type="button"
                          onClick={() => handleCancelRequest(item)}
                          className="px-2 py-1 text-xs border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700"
                        >
                          Cancel
                        </button>
                      )}

                      {item.status === "PENDING" && !isSelf && (
                        <Can perm="approvals:decide">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenReject(item)}
                              className="px-2 py-1 text-xs border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold uppercase"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenApprove(item)}
                              className="px-2.5 py-1 text-xs bg-[#059669] hover:bg-[#047857] text-white font-bold uppercase"
                            >
                              Approve
                            </button>
                          </div>
                        </Can>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. MODAL: APPROVE CONFIRMATION */}
      {isApproveOpen && activeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Approve Transaction: {activeItem.code}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsApproveOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
              <div className="font-semibold text-neutral-900">{activeItem.summary}</div>
              {activeItem.amountInr !== null && (
                <div className="font-mono font-bold text-sm text-neutral-900">
                  Amount: ₹{activeItem.amountInr.toLocaleString()}
                </div>
              )}
              <div className="text-neutral-600">
                Requested By: {activeItem.requesterName} ({activeItem.requesterEmail})
              </div>
            </div>

            <div>
              <label htmlFor={approveNotesId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                Approval Notes / Reason (Optional)
              </label>
              <textarea
                id={approveNotesId}
                rows={2}
                value={approveReason}
                onChange={(e) => setApproveReason(e.target.value)}
                placeholder="Optional confirmation note or authorization reference..."
                className="w-full min-h-[56px] p-3 text-xs leading-relaxed resize-none bg-white border border-neutral-300 focus:outline-none focus:border-[#059669]"
              />
            </div>

            <div className="pt-4 border-t border-neutral-300 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsApproveOpen(false)}
                className="h-10 px-5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmApprove}
                className="h-10 px-6 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isProcessing ? "Approving..." : "Confirm Approval"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: REJECT REQUEST */}
      {isRejectOpen && activeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-300">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Reject Request: {activeItem.code}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRejectOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
              <div className="font-semibold text-neutral-900">{activeItem.summary}</div>
              <div className="text-neutral-600">
                Requested By: {activeItem.requesterName}
              </div>
            </div>

            <div>
              <label htmlFor={rejectReasonId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                Rejection Reason * (Required)
              </label>
              <textarea
                id={rejectReasonId}
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="State clearly why this request cannot be approved..."
                className="w-full min-h-[64px] p-3 text-xs leading-relaxed resize-none bg-white border border-neutral-300 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-4 border-t border-neutral-300 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsRejectOpen(false)}
                className="h-10 px-5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing || !rejectReason.trim()}
                onClick={handleConfirmReject}
                className="h-10 px-6 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Ban className="w-4 h-4" />
                <span>{isProcessing ? "Rejecting..." : "Confirm Rejection"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
