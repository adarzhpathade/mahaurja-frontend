// Canonical desk routing and access maps for MAHAURJA roles.
// Shared across Next.js 16 proxy, server layouts, and client auth-context.

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

export const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  "gate-security": ["/gate"],
  weighbridge: ["/weighbridge"],
  "qc-lab": ["/quality"],
  production: ["/production"],
  warehouse: ["/inventory"],
  "sales-dispatch": ["/sales"],
  purchase: ["/admin/masters/suppliers", "/inventory/lots"],
  accounts: ["/sales/payments", "/sales/invoices"],
};

export const DESK_PREFIXES = [
  "/gate",
  "/weighbridge",
  "/quality",
  "/production",
  "/inventory",
  "/sales",
  "/admin",
  "/management",
];

export const PUBLIC_ROUTES = [
  "/login",
  "/request-access",
  "/setup-password",
];

export function isDeskRoute(pathname: string): boolean {
  return DESK_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function canAccessRoute(roleId: string, pathname: string): boolean {
  if (roleId === "admin" || roleId === "management") return true;
  const prefixes = ROLE_ALLOWED_PREFIXES[roleId] ?? [];
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function homeRouteFor(roleId: string | undefined | null): string {
  if (!roleId) return "/login";
  return ROLE_HOME_ROUTE[roleId] ?? "/login";
}
