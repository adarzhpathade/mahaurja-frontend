"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi, NotificationItem } from "@/lib/api/notifications";
import { usePlantEvents } from "@/lib/api/realtime";

interface ToastItem {
  id: string;
  title: string;
  body: string;
  severity: "info" | "action" | "warning";
  link: string;
}

export function NotificationCenter() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<ToastItem | null>(null);

  // 1. Fetch unread count
  const { data: countData } = useQuery<{ count: number }>({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationsApi.getUnreadCount(),
    staleTime: 5000,
  });

  const unreadCount = countData?.count ?? 0;

  // 2. Fetch recent notifications
  const { data: listData, isLoading } = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => notificationsApi.list({ limit: 20 }),
    enabled: isOpen,
    staleTime: 5000,
  });

  const notifications = listData?.items ?? [];

  // 3. Listen to live notification events via SSE
  usePlantEvents(["notification.*"], (event) => {
    void queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    void queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });

    const payload = event.payload as Record<string, unknown>;
    const severity = (payload.severity as string) || "info";

    // Toast for severity "action" or "warning"
    if (severity === "action" || severity === "warning") {
      const toast: ToastItem = {
        id: String(event.id || Date.now()),
        title: (payload.title as string) || "New Alert",
        body: (payload.body as string) || "",
        severity: severity as "action" | "warning",
        link: (payload.link as string) || "/admin/users",
      };
      setActiveToast(toast);
    }
  });

  // Auto-hide toast after 6 seconds
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeToast]);

  const handleCardClick = async (notif: NotificationItem) => {
    if (!notif.readAt) {
      try {
        await notificationsApi.markAsRead(notif.id);
        void queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
        void queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
      } catch {
        // Continue navigation even if read marking fails
      }
    }
    setIsOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      void queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
    } catch {
      // Ignore
    }
  };

  return (
    <>
      {/* Real-time Toast at Top-Right */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            key={activeToast.id}
            role="status"
            aria-live="polite"
            data-testid="notification-toast"
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-4 right-4 z-50 w-80 sm:w-96 p-4 border shadow-xl bg-white select-none ${
              activeToast.severity === "warning" ? "border-rose-400" : "border-amber-400"
            }`}
            style={{ borderRadius: 0 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border ${
                      activeToast.severity === "warning"
                        ? "bg-rose-50 text-rose-700 border-rose-300"
                        : "bg-amber-50 text-amber-700 border-amber-300"
                    }`}
                  >
                    {activeToast.severity}
                  </span>
                  <div className="text-xs font-bold text-neutral-900 truncate">{activeToast.title}</div>
                </div>
                <div className="text-xs text-neutral-600 mt-1 leading-snug">{activeToast.body}</div>
              </div>
              <button
                type="button"
                onClick={() => setActiveToast(null)}
                className="text-neutral-400 hover:text-neutral-900 p-1 cursor-pointer"
                aria-label="Close Alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {activeToast.link && (
              <button
                type="button"
                onClick={() => {
                  setActiveToast(null);
                  router.push(activeToast.link);
                }}
                className="mt-3 text-[11px] font-semibold text-[#059669] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View details</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bell Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-9 h-9 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 hover:text-black flex items-center justify-center relative cursor-pointer transition-colors shadow-2xs"
          style={{ borderRadius: 0 }}
          aria-label="Notifications"
          data-testid="notification-bell"
          aria-expanded={isOpen}
        >
          <Bell className="w-4 h-4 text-neutral-800" strokeWidth={1.8} />
          {unreadCount > 0 && (
            <span
              data-testid="notification-badge"
              className="absolute -top-1.5 -right-1.5 bg-[#DC2626] text-white font-mono font-bold text-[10px] min-w-4 h-4 px-1 flex items-center justify-center rounded-full ring-2 ring-white"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Drawer Popover */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-300 z-50 p-4 shadow-xl select-none"
              style={{ borderRadius: 0 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 font-mono font-bold text-[10px] bg-neutral-100 text-neutral-700 border border-neutral-300">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notification Items */}
              <div className="pt-3 max-h-80 overflow-y-auto space-y-2 no-scrollbar">
                {isLoading ? (
                  <div className="py-6 text-center text-xs text-neutral-400">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-neutral-500 font-medium">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => void handleCardClick(notif)}
                      className={`p-3 border transition-all cursor-pointer ${
                        notif.readAt
                          ? "bg-white/40 border-neutral-200 text-neutral-600 opacity-75"
                          : "bg-white border-neutral-300 hover:border-neutral-900 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {!notif.readAt && <span className="w-1.5 h-1.5 bg-[#059669] rounded-full shrink-0" />}
                          <span className="text-xs font-bold text-neutral-900 leading-tight">{notif.title}</span>
                        </div>
                        <span
                          className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 border shrink-0 ${
                            notif.severity === "warning"
                              ? "bg-rose-50 text-rose-700 border-rose-300"
                              : notif.severity === "action"
                                ? "bg-amber-50 text-amber-700 border-amber-300"
                                : "bg-neutral-100 text-neutral-600 border-neutral-200"
                          }`}
                        >
                          {notif.severity}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-600 mt-1 leading-snug">{notif.body}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
