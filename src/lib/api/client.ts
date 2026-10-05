// Typed fetch wrapper for the MAHAURJA backend (Mahaurja-Backend, Fastify /api/v1).
// Access token lives in memory only. Refresh token lives in an HttpOnly cookie (mh_rt).
// No localStorage or sessionStorage tokens are used.

// Empty string = same origin: production routes /api/* through this site to the backend (Next.js rewrite),
// so auth cookies stay first-party. Local dev talks to the backend directly.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === "production" ? "" : "http://localhost:4000");

/** Absolute base for building URLs (same-origin when API_BASE_URL is empty). */
export function apiBase(): string {
  if (API_BASE_URL) return API_BASE_URL;
  return typeof window !== "undefined" ? window.location.origin : "";
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details: unknown[];
    requestId: string;
  };
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details: unknown[] = [],
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  plantId: string;
  department: string;
  assignedPost: string;
  permissions?: string[];
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}

let accessToken: string | null = null;
let refreshInFlight: Promise<AuthResponse | null> | null = null;
const sessionListeners = new Set<(session: AuthResponse | null) => void>();
const lockListeners = new Set<(reason: "idle" | "expired") => void>();

export function setSession(session: AuthResponse | null): void {
  accessToken = session?.accessToken ?? null;
  sessionListeners.forEach((listener) => listener(session));
}

export function onSessionChange(listener: (session: AuthResponse | null) => void): () => void {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
}

export function onStationLocked(listener: (reason: "idle" | "expired") => void): () => void {
  lockListeners.add(listener);
  return () => lockListeners.delete(listener);
}

export function lockStation(reason: "idle" | "expired" = "idle"): void {
  accessToken = null;
  lockListeners.forEach((listener) => listener(reason));
}

export function hasActiveSession(): boolean {
  return accessToken !== null;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// Plain-English message for display: validation errors list the backend's field reasons.
export function describeApiError(err: unknown, fallback: string): string {
  if (!(err instanceof ApiError)) return fallback;
  if (err.code === "VERSION_CONFLICT") {
    return "Someone else changed this — reload to see their change";
  }
  if (err.code === "VALIDATION_ERROR" && err.details.length > 0) {
    const reasons = err.details
      .map((d) => (typeof d === "object" && d !== null && "message" in d ? String(d.message) : ""))
      .filter(Boolean);
    if (reasons.length > 0) return reasons.join(" · ");
  }
  return err.message;
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    const body = (await res.json()) as ApiErrorBody;
    return new ApiError(
      res.status,
      body.error.code,
      body.error.message,
      body.error.details,
      body.error.requestId,
    );
  } catch {
    return new ApiError(res.status, "HTTP_ERROR", res.statusText || "Request failed");
  }
}

// Exchanges the HttpOnly refresh token cookie (mh_rt) for a new session.
// Concurrent callers share one request because the backend rotates refresh tokens.
export function refreshSession(): Promise<AuthResponse | null> {
  if (refreshInFlight) return refreshInFlight;

  const callRefresh = () =>
    fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({}),
    });

  refreshInFlight = (async () => {
    try {
      let res = await callRefresh();
      // Another tab rotated the cookie at the same moment; by now the jar holds the new one.
      if (res.status === 409) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        res = await callRefresh();
      }

      if (!res.ok) {
        if (res.status === 401) {
          try {
            const body = (await res.json()) as ApiErrorBody;
            if (body.error.code === "SESSION_IDLE") {
              lockStation("idle");
              return null;
            }
            if (body.error.code === "SESSION_EXPIRED") {
              lockStation("expired");
              return null;
            }
          } catch {
            // Ignore parse errors on error body
          }
        }
        setSession(null);
        return null;
      }

      const session = (await res.json()) as AuthResponse;
      setSession(session);
      return session;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  auth?: boolean;
  signal?: AbortSignal;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers: customHeaders, body, query, auth = true, signal } = options;

  const url = new URL(`${apiBase()}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const send = () => {
    const headers: Record<string, string> = { ...customHeaders };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;
    return fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include",
      signal,
    });
  };

  let res = await send();

  // Access token expired or missing in memory — try refresh once and retry.
  if (res.status === 401 && auth) {
    // Check if it's already SESSION_IDLE or SESSION_EXPIRED
    try {
      const cloned = res.clone();
      const errBody = (await cloned.json()) as ApiErrorBody;
      if (errBody.error.code === "SESSION_IDLE") {
        lockStation("idle");
        throw await parseError(res);
      }
      if (errBody.error.code === "SESSION_EXPIRED") {
        lockStation("expired");
        throw await parseError(res);
      }
    } catch (e) {
      if (e instanceof ApiError) throw e;
    }

    const session = await refreshSession();
    if (session) {
      res = await send();
    }
  }

  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),
  logout: () =>
    apiRequest<void>("/api/v1/auth/logout", {
      method: "POST",
      body: {},
      auth: true,
    }),
  me: () =>
    apiRequest<AuthUser>("/api/v1/auth/me", {
      method: "GET",
      auth: true,
    }),
};
