// Typed fetch wrapper for the MAHAURJA backend (Mahaurja-Backend, Fastify /api/v1).
// Access token lives in memory; refresh token in localStorage so a reload keeps the session.

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const REFRESH_TOKEN_KEY = "mahaurja.refreshToken";

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
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}

let accessToken: string | null = null;
let refreshInFlight: Promise<AuthResponse | null> | null = null;
const sessionListeners = new Set<(session: AuthResponse | null) => void>();

function readRefreshToken(): string | null {
  try {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeRefreshToken(token: string | null): void {
  try {
    if (token) window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    else window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Storage unavailable (private mode) — session simply won't survive reload.
  }
}

export function setSession(session: AuthResponse | null): void {
  accessToken = session?.accessToken ?? null;
  writeRefreshToken(session?.refreshToken ?? null);
  sessionListeners.forEach((listener) => listener(session));
}

export function onSessionChange(listener: (session: AuthResponse | null) => void): () => void {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
}

export function hasActiveSession(): boolean {
  return accessToken !== null;
}

export function getRefreshToken(): string | null {
  return readRefreshToken();
}

// Plain-English message for display: validation errors list the backend's field reasons.
export function describeApiError(err: unknown, fallback: string): string {
  if (!(err instanceof ApiError)) return fallback;
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

// Exchanges the stored refresh token for a new session. Concurrent callers share one request
// because the backend rotates refresh tokens and treats reuse as theft.
export function refreshSession(): Promise<AuthResponse | null> {
  if (refreshInFlight) return refreshInFlight;
  const refreshToken = readRefreshToken();
  if (!refreshToken) return Promise.resolve(null);

  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
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

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  auth?: boolean;
  signal?: AbortSignal;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, auth = true, signal } = options;

  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const send = () => {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;
    return fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  };

  let res = await send();

  // Access token expired (15 min) — refresh once and retry.
  if (res.status === 401 && auth && readRefreshToken()) {
    const session = await refreshSession();
    if (session) res = await send();
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
  logout: (refreshToken: string) =>
    apiRequest<void>("/api/v1/auth/logout", { method: "POST", body: { refreshToken } }),
};
