import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { canAccessRoute, homeRouteFor, isDeskRoute, isPublicRoute } from "@/lib/auth/desk-access";
import { getDeskSecret } from "@/lib/auth/desk-secret";


interface DeskPayload {
  sub: string;
  role: string;
  exp: number;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDev = process.env.NODE_ENV !== "production";
  // Same-origin API in production (rewrite) → 'self' covers it; the live stream may go direct to the backend.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const realtimeUrl = process.env.NEXT_PUBLIC_REALTIME_URL ?? "";

  // 1. Generate nonce and CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ""}`.trim(),
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data:`,
    `font-src 'self' data:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `connect-src 'self' ${apiUrl} ${realtimeUrl} ${isDev ? "ws: http: https:" : ""}`.replace(/\s+/g, " ").trim(),
    !isDev ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ");

  const applySecurityHeaders = (res: NextResponse) => {
    res.headers.set("Content-Security-Policy", cspHeader);
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (!isDev) {
      res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    }
    return res;
  };

  // 2. Verify desk cookie (mh_desk)
  const deskCookie = request.cookies.get("mh_desk")?.value;
  let deskClaims: DeskPayload | null = null;

  if (deskCookie) {
    try {
      const verified = await jwtVerify(deskCookie, getDeskSecret(), { algorithms: ["HS256"] });
      deskClaims = verified.payload as unknown as DeskPayload;
    } catch {
      deskClaims = null;
    }
  }

  // 3. Desk routing & authorization guards
  // Public pages (/login, /request-access, /setup-password)
  if (isPublicRoute(pathname)) {
    // Never bounce away from /login here: a desk cookie can outlive a session revoked on the server
    // (idle, deactivated), which would loop /login <-> desk. The client redirects after a real refresh.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", cspHeader);
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    return applySecurityHeaders(res);
  }

  // Root path /
  if (pathname === "/") {
    const target = deskClaims ? homeRouteFor(deskClaims.role) : "/login";
    return applySecurityHeaders(NextResponse.redirect(new URL(target, request.url), 307));
  }

  // Desk routes (/gate, /weighbridge, /quality, /production, /inventory, /sales, /admin, /management)
  if (isDeskRoute(pathname)) {
    if (!deskClaims) {
      return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url), 307));
    }

    if (!canAccessRoute(deskClaims.role, pathname)) {
      // Role not allowed: 307 redirect to role's home desk
      return applySecurityHeaders(
        NextResponse.redirect(new URL(homeRouteFor(deskClaims.role), request.url), 307)
      );
    }
  }

  // 4. Default: allow request and set nonce in request headers for layout
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return applySecurityHeaders(response);
}

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
