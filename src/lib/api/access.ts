import { apiRequest } from "@/lib/api/client";
import { AdminUserItem } from "@/lib/types/admin";

// Mahaurja-Backend Phase 8.1 — access requests and first-login password setup.

export type AccessRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AccessRequest {
  id: string;
  fullName: string;
  mobile: string;
  email: string | null;
  requestedRoleId: string;
  employeeCode: string | null;
  note: string | null;
  status: AccessRequestStatus;
  createdAt: string;
}

interface Paginated<T> {
  data: T[];
  total: number;
}

export interface NewAccessRequest {
  fullName: string;
  mobile: string;
  email?: string;
  requestedRoleId: string;
  employeeCode?: string;
  note?: string;
}

export interface ApproveInput {
  roleId: AdminUserItem["roleId"];
  department: string;
  assignedPost: string;
  employeeCode: string;
  email: string;
}

export interface ApproveResult {
  setupToken: string;
  setupUrlPath: string;
}

export const accessApi = {
  submit: (input: NewAccessRequest) =>
    apiRequest<{ id: string; status: AccessRequestStatus }>("/api/v1/access-requests", {
      method: "POST",
      body: input,
      auth: false,
    }),

  listPending: async (): Promise<AccessRequest[]> =>
    (
      await apiRequest<Paginated<AccessRequest>>("/api/v1/access-requests", {
        query: { status: "PENDING", pageSize: 100 },
      })
    ).data,

  approve: (id: string, input: ApproveInput) =>
    apiRequest<ApproveResult>(`/api/v1/access-requests/${id}/approve`, {
      method: "POST",
      body: input,
    }),

  reject: (id: string, reason: string) =>
    apiRequest<void>(`/api/v1/access-requests/${id}/reject`, {
      method: "POST",
      body: { reason },
    }),

  resetPassword: (userId: string) =>
    apiRequest<ApproveResult>(`/api/v1/users/${userId}/reset-password`, { method: "POST" }),

  setupPassword: (token: string, newPassword: string) =>
    apiRequest<void>("/api/v1/auth/setup-password", {
      method: "POST",
      body: { token, newPassword },
      auth: false,
    }),
};

// Desk choices shown to someone requesting access (plain English, canonical role ids).
export const REQUESTABLE_DESKS: { roleId: string; label: string }[] = [
  { roleId: "gate-security", label: "Gate / Security" },
  { roleId: "weighbridge", label: "Weighbridge" },
  { roleId: "qc-lab", label: "QC / Lab" },
  { roleId: "production", label: "Production" },
  { roleId: "warehouse", label: "Warehouse / Stores" },
  { roleId: "sales-dispatch", label: "Sales & Dispatch" },
  { roleId: "purchase", label: "Purchase" },
  { roleId: "accounts", label: "Accounts" },
  { roleId: "management", label: "Management" },
];
