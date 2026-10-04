"use client";

import React from "react";
import { motion } from "motion/react";
import { AlertTriangle, Factory } from "lucide-react";
import { APP_NAME, COMPANY_NAME } from "@/lib/constants";

// Shared frame for the public pages: sign in, request access, set password.
export function AuthShell({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F4F5F7] text-neutral-900 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#18181B] text-white flex items-center justify-center">
            <Factory className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight leading-none">{APP_NAME}</div>
            <div className="text-[11px] text-neutral-500 font-medium mt-1">{COMPANY_NAME}</div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          {title}
        </h1>

        <div className="mt-6 bg-transparent border-0 p-0 sm:border sm:border-neutral-300 sm:p-6 sm:bg-white">
          {children}
        </div>

        {footer && <div className="mt-5 text-[11px] text-neutral-500">{footer}</div>}
      </motion.div>
    </main>
  );
}

export const authInputClass =
  "h-10 w-full px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669]";

export function AuthField({
  id,
  label,
  optional,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[11px] font-semibold text-neutral-700 block mb-1">
        {label}
        {optional && <span className="font-normal text-neutral-400"> (optional)</span>}
      </label>
      {children}
    </div>
  );
}

export function AuthAlert({ tone = "error", children }: { tone?: "error" | "success"; children: React.ReactNode }) {
  const styles =
    tone === "error"
      ? "border-red-300 bg-red-50 text-[#DC2626]"
      : "border-emerald-300 bg-emerald-50 text-[#047857]";
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2 border px-3 py-2.5 text-xs font-medium ${styles}`}
    >
      {tone === "error" && <AlertTriangle className="w-3.5 h-3.5 mt-px shrink-0" />}
      <span>{children}</span>
    </motion.div>
  );
}

export function AuthSubmit({ disabled, busy, children }: { disabled?: boolean; busy?: boolean; children: React.ReactNode }) {
  return (
    <div className="pt-4 border-t border-neutral-300">
      <button
        type="submit"
        disabled={disabled || busy}
        className="w-full h-10 bg-[#18181B] hover:bg-black disabled:bg-neutral-400 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        {busy ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : children}
      </button>
    </div>
  );
}
