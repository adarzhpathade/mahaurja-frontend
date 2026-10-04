"use client";

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AuthUser,
  authApi,
  getRefreshToken,
  onSessionChange,
  refreshSession,
  setSession,
} from "@/lib/api/client";

// Home desk for each canonical backend role id (Backend DECISIONS D5).
export const ROLE_HOME_ROUTE: Record<string, string> = {
  "gate-security": "/gate",
  weighbridge: "/weighbridge",
  "qc-lab": "/quality",
  production: "/production/plans",
  warehouse: "/inventory/raw-materials",
  "sales-dispatch": "/sales/orders",
  admin: "/admin/masters/suppliers",
  management: "/management/dashboard",
  purchase: "/admin/masters/suppliers",
  accounts: "/sales/payments",
};

// Desk route prefixes each role may open. Admin and management see every desk.
const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  "gate-security": ["/gate"],
  weighbridge: ["/weighbridge"],
  "qc-lab": ["/quality"],
  production: ["/production"],
  warehouse: ["/inventory"],
  "sales-dispatch": ["/sales"],
  purchase: ["/admin/masters/suppliers", "/inventory/lots"],
  accounts: ["/sales/payments", "/sales/invoices"],
};

export function canAccessRoute(roleId: string, pathname: string): boolean {
  if (roleId === "admin" || roleId === "management") return true;
  const prefixes = ROLE_ALLOWED_PREFIXES[roleId] ?? [];
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function homeRouteFor(roleId: string): string {
  return ROLE_HOME_ROUTE[roleId] ?? "/login";
}

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthContextType {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/login", "/request-access", "/setup-password"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const router = useRouter();
  const pathname = usePathname();

  // Keep React state in sync with the API client's session (refresh, expiry, logout).
  useEffect(
    () =>
      onSessionChange((session) => {
        setUser(session?.user ?? null);
        setStatus(session ? "authenticated" : "anonymous");
      }),
    [],
  );

  // Restore the session after a page reload using the stored refresh token.
  useEffect(() => {
    const restore = getRefreshToken() ? refreshSession() : Promise.resolve(null);
    restore.then((session) => {
      if (!session) setStatus("anonymous");
    });
  }, []);

  // Route guard: anonymous users go to /login; users outside their desk go home.
  useEffect(() => {
    if (status === "loading") return;
    const isPublic = PUBLIC_ROUTES.includes(pathname);
    if (status === "anonymous" && !isPublic) {
      router.replace("/login");
    } else if (status === "authenticated" && user) {
      if (pathname === "/login" || pathname === "/" || (!isPublic && !canAccessRoute(user.roleId, pathname))) {
        router.replace(homeRouteFor(user.roleId));
      }
    }
  }, [status, user, pathname, router]);

  const login = useCallback(async (email: string, password: string) => {
    const session = await authApi.login(email, password);
    setSession(session);
    return session.user;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // Server-side revoke failed (offline / expired) — still clear the local session.
    }
    setSession(null);
    router.replace("/login");
  }, [router]);

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const allowed =
    isPublic || (status === "authenticated" && user !== null && canAccessRoute(user.roleId, pathname));

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {allowed ? (
        children
      ) : (
        <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <span className="w-1.5 h-1.5 bg-[#059669] animate-pulse" />
            Checking access…
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
