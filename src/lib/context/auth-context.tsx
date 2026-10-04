"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Lock, AlertCircle, ShieldCheck, LogOut } from "lucide-react";
import {
  AuthUser,
  authApi,
  onSessionChange,
  onStationLocked,
  refreshSession,
  setSession,
  lockStation,
} from "@/lib/api/client";
import {
  canAccessRoute,
  homeRouteFor,
  PUBLIC_ROUTES,
  ROLE_HOME_ROUTE,
  ROLE_ALLOWED_PREFIXES,
} from "@/lib/auth/desk-access";

// Re-export shared routing maps so existing imports don't break
export { ROLE_HOME_ROUTE, ROLE_ALLOWED_PREFIXES, canAccessRoute, homeRouteFor };

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthContextType {
  user: AuthUser | null;
  status: AuthStatus;
  permissions: string[];
  hasPermission: (perm: string) => boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  unlock: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useCan(perm: string): boolean {
  const { user } = useAuth();
  if (!user) return false;
  if (user.roleId === "admin") return true;
  return user.permissions?.includes(perm) ?? false;
}

export function Can({
  perm,
  children,
  fallback = null,
}: {
  perm: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const can = useCan(perm);
  return can ? <>{children}</> : <>{fallback}</>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [lockedReason, setLockedReason] = useState<"idle" | "expired" | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [idleWarningSeconds, setIdleWarningSeconds] = useState<number | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const lastActivityRef = useRef<number>(0);

  // Keep React state in sync with the API client's session (refresh, expiry, logout).
  useEffect(() => {
    return onSessionChange((session) => {
      setUser(session?.user ?? null);
      setStatus(session ? "authenticated" : "anonymous");
      if (session) {
        setIsLocked(false);
        setLockedReason(null);
        setIdleWarningSeconds(null);
      }
    });
  }, []);

  const [lockedUser, setLockedUser] = useState<AuthUser | null>(null);

  // Listen for station lock triggered by backend 401 SESSION_IDLE / SESSION_EXPIRED
  useEffect(() => {
    return onStationLocked((reason) => {
      setLockedUser((prev) => prev ?? user);
      setLockedReason(reason);
      setIsLocked(true);
      setIdleWarningSeconds(null);
    });
  }, [user]);

  // Restore the session after a page reload using the HttpOnly refresh token cookie (mh_rt).
  useEffect(() => {
    refreshSession().then((session) => {
      if (!session) {
        setStatus("anonymous");
      }
    });
  }, []);

  // Client-side idle lock with 60 s warning
  useEffect(() => {
    if (status !== "authenticated" || !user || isLocked) return;

    // Timeout limit based on role: gate-security/weighbridge default 15m, others 30m.
    let idleMinutesLimit = 30;
    if (user.roleId === "gate-security" || user.roleId === "weighbridge") {
      idleMinutesLimit = 15;
    }

    lastActivityRef.current = Date.now();

    // Support test override for faster idle tests
    const checkIntervalMs = 1000;
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
      setIdleWarningSeconds(null);
    };

    const events = ["mousemove", "keydown", "pointerdown", "touchstart", "scroll", "click"];
    events.forEach((evt) => window.addEventListener(evt, updateActivity, { passive: true }));

    const timer = setInterval(() => {
      // Allow test override via window global
      const testLimitSec = (window as unknown as { __TEST_IDLE_SECONDS__?: number }).__TEST_IDLE_SECONDS__;
      const totalLimitMs = testLimitSec ? testLimitSec * 1000 : idleMinutesLimit * 60 * 1000;
      const elapsedMs = Date.now() - lastActivityRef.current;
      const remainingMs = totalLimitMs - elapsedMs;

      if (remainingMs <= 0) {
        setIdleWarningSeconds(null);
        lockStation("idle");
      } else if (remainingMs <= 60 * 1000) {
        setIdleWarningSeconds(Math.ceil(remainingMs / 1000));
      } else {
        setIdleWarningSeconds(null);
      }
    }, checkIntervalMs);

    return () => {
      clearInterval(timer);
      events.forEach((evt) => window.removeEventListener(evt, updateActivity));
    };
  }, [status, user, isLocked]);

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
    setIsLocked(false);
    setLockedReason(null);
    return session.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    }
    setSession(null);
    setIsLocked(false);
    setLockedReason(null);
    router.replace("/login");
  }, [router]);

  const unlock = useCallback(
    async (password: string) => {
      const emailToUnlock = lockedUser?.email ?? user?.email;
      if (!emailToUnlock) throw new Error("No active user to unlock");
      setUnlocking(true);
      setUnlockError(null);
      try {
        await login(emailToUnlock, password);
        setIsLocked(false);
        setLockedReason(null);
        setLockedUser(null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Invalid password. Try again.";
        setUnlockError(msg);
        throw err;
      } finally {
        setUnlocking(false);
      }
    },
    [lockedUser, user, login]
  );

  const permissions = useMemo(() => user?.permissions ?? [], [user?.permissions]);
  const hasPermission = useCallback(
    (perm: string) => {
      if (!user) return false;
      if (user.roleId === "admin") return true;
      return permissions.includes(perm);
    },
    [user, permissions]
  );

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const allowed =
    isPublic || (status === "authenticated" && user !== null && canAccessRoute(user.roleId, pathname));

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        permissions,
        hasPermission,
        login,
        logout,
        unlock,
      }}
    >
      {/* 60s Client Idle Warning Banner */}
      {idleWarningSeconds !== null && !isLocked && (
        <div
          role="alert"
          className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-neutral-900 px-4 py-2 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-md animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Station will lock in {idleWarningSeconds} seconds due to inactivity. Move the mouse or press any key to resume.
          </span>
        </div>
      )}

      {/* Station Locked Full-Screen Panel */}
      {isLocked ? (
        <div
          data-testid="station-locked-panel"
          className="fixed inset-0 z-50 bg-[#F4F5F7] flex items-center justify-center p-4 sm:p-6"
        >
          <div className="w-full max-w-md bg-white border border-neutral-300 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
              <div className="w-10 h-10 bg-neutral-100 border border-neutral-300 flex items-center justify-center text-[#18181B]">
                <Lock className="w-5 h-5 text-[#059669]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
                  Station Locked
                </h1>
                <p className="text-xs text-neutral-500 font-medium">
                  {lockedReason === "expired"
                    ? "Maximum session duration reached (12 hours)."
                    : "Session locked due to operator inactivity."}
                </p>
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 p-3 space-y-1 text-xs">
              <div className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold">
                Operator On Duty
              </div>
              <div className="font-bold text-neutral-900">{(lockedUser ?? user)?.name ?? "Plant Operator"}</div>
              <div className="text-neutral-600 font-mono text-[11px]">{(lockedUser ?? user)?.email ?? ""}</div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!unlockPassword) return;
                try {
                  await unlock(unlockPassword);
                  setUnlockPassword("");
                } catch {
                  // Error handled in state
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Enter Password to Resume Work
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="password"
                    data-testid="unlock-password"
                    required
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full h-10 pl-9 pr-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {unlockError && (
                <div
                  role="alert"
                  className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
                >
                  {unlockError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={unlocking || !unlockPassword}
                  className="w-full sm:flex-1 h-10 px-4 bg-[#059669] hover:bg-[#047857] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{unlocking ? "Verifying…" : "Unlock Station"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full sm:w-auto h-10 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : allowed ? (
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
