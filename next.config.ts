import type { NextConfig } from "next";

// In production the browser calls this site's own /api/* (first-party cookies); Next.js forwards to the backend.
const backendUrl = process.env.BACKEND_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    return backendUrl ? [{ source: "/api/v1/:path*", destination: `${backendUrl}/api/v1/:path*` }] : [];
  },
};

export default nextConfig;
