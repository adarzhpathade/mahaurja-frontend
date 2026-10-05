import { apiRequest } from "@/lib/api/client";

export type ApprovalType =
  | "PURCHASE_PRICE"
  | "SALES_PRICE_BELOW_MARGIN"
  | "CREDIT_SALE"
  | "STOCK_ADJUSTMENT"
  | "QC_OVERRIDE"
  | "QC_HOLD_RELEASE"
  | "WEIGHT_ADJUSTMENT"
  | "PAYMENT"
  | "EXPENSE_OVER_LIMIT"
  | "DEV_TEST"
  | string;

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface ApprovalRequestItem {
  id: string;
  code: string;
  type: ApprovalType;
  entity: string;
  entityId: string;
  payload: Record<string, unknown>;
  summary: string;
  amountPaise: number | null;
  amountInr: number | null;
  requestedBy: string;
  requesterName: string;
  requesterEmail: string;
  status: ApprovalStatus;
  decidedBy: string | null;
  deciderName: string | null;
  decidedAt: string | null;
  reason: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedApprovals {
  data: ApprovalRequestItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListApprovalsParams {
  status?: "ALL" | ApprovalStatus;
  type?: string;
  mine?: boolean;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface DevApprovalInput {
  type?: string;
  entity?: string;
  entityId?: string;
  summary?: string;
  amountInr?: number;
  amountPaise?: number;
  payload?: Record<string, unknown>;
}

export const approvalsApi = {
  async list(params?: ListApprovalsParams): Promise<ApprovalRequestItem[]> {
    const query: Record<string, string | number | boolean | undefined> = {
      pageSize: 100,
      status: params?.status ?? "PENDING",
      type: params?.type,
      q: params?.q,
    };
    if (params?.mine !== undefined) {
      query.mine = params.mine ? "true" : "false";
    }
    const res = await apiRequest<PaginatedApprovals>("/api/v1/approvals", {
      query,
    });
    return res.data;
  },

  async get(id: string): Promise<ApprovalRequestItem> {
    return await apiRequest<ApprovalRequestItem>(`/api/v1/approvals/${id}`);
  },

  async approve(id: string, reason?: string | null): Promise<ApprovalRequestItem> {
    return await apiRequest<ApprovalRequestItem>(`/api/v1/approvals/${id}/approve`, {
      method: "POST",
      body: { reason: reason?.trim() || null },
    });
  },

  async reject(id: string, reason: string): Promise<ApprovalRequestItem> {
    return await apiRequest<ApprovalRequestItem>(`/api/v1/approvals/${id}/reject`, {
      method: "POST",
      body: { reason: reason.trim() },
    });
  },

  async cancel(id: string): Promise<ApprovalRequestItem> {
    return await apiRequest<ApprovalRequestItem>(`/api/v1/approvals/${id}/cancel`, {
      method: "POST",
    });
  },

  async devRequest(input?: DevApprovalInput): Promise<ApprovalRequestItem> {
    return await apiRequest<ApprovalRequestItem>("/api/v1/approvals/dev-request", {
      method: "POST",
      body: {
        type: input?.type ?? "DEV_TEST",
        entity: input?.entity ?? "dev_test",
        entityId: input?.entityId ?? `test-${Date.now()}`,
        summary: input?.summary ?? "Dev test approval request",
        amountInr: input?.amountInr ?? 48000,
        payload: input?.payload ?? {},
      },
    });
  },
};
