import type { Metadata } from "next";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { AuthProvider } from "@/lib/context/auth-context";
import { QueryProvider } from "@/lib/providers/query-provider";
import "@/styles/globals.css";

const switzer = localFont({
  src: [
    {
      path: "../fonts/Switzer-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Switzer-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Switzer-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
});

// The CSP (src/proxy.ts) allows only scripts carrying this request's nonce ('strict-dynamic'), and Next.js can
// only stamp the nonce on pages rendered per request. Pre-rendered static pages would ship nonce-less scripts
// that the browser blocks (B31), so every page renders dynamically. Fine for an internal ~50-user app.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MAHAURJA – Plant Operational Management System",
  description:
    "End-to-end plant operational management and bi-directional traceability for Bharat Industrial & Renewables LLP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={switzer.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-emerald-500/20 selection:text-emerald-900">
        <QueryProvider>
          <AuthProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
