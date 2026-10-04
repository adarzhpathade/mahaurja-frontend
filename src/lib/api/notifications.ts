import { apiRequest } from "./client";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  entity: string;
  entityId: string;
  link: string;
  severity: "info" | "action" | "warning";
  readAt: string | null;
  createdAt: string;
}

export interface ListNotificationsResult {
  items: NotificationItem[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

export const notificationsApi = {
  async list(params: { page?: number; limit?: number; unreadOnly?: boolean } = {}): Promise<ListNotificationsResult> {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.unreadOnly !== undefined) q.set("unreadOnly", String(params.unreadOnly));
    const qs = q.toString();
    return apiRequest<ListNotificationsResult>(`/api/v1/notifications${qs ? `?${qs}` : ""}`);
  },

  async getUnreadCount(): Promise<{ count: number }> {
    return apiRequest<{ count: number }>("/api/v1/notifications/unread-count");
  },

  async markAsRead(id: string): Promise<{ success: boolean; id: string; readAt: string }> {
    return apiRequest<{ success: boolean; id: string; readAt: string }>(`/api/v1/notifications/${id}/read`, {
      method: "POST",
    });
  },

  async markAllAsRead(): Promise<{ success: boolean; updated: number }> {
    return apiRequest<{ success: boolean; updated: number }>("/api/v1/notifications/read-all", {
      method: "POST",
    });
  },
};
