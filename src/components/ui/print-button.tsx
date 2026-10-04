"use client";

import React, { useState } from "react";
import { ChevronDown, Download, Printer } from "lucide-react";
import { API_BASE_URL, getAccessToken } from "@/lib/api/client";

export interface PrintButtonProps {
  docType: string;
  id: string;
  paper?: "a4" | "thermal80";
  token?: string;
  label?: string;
  className?: string;
}

export function PrintButton({
  docType,
  id,
  paper = "a4",
  token,
  label = "Print Slip",
  className = "",
}: PrintButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getUrl = (format: "html" | "pdf", paperSize: "a4" | "thermal80" = paper) => {
    const q = new URLSearchParams();
    q.set("format", format);
    q.set("paper", paperSize);
    if (token) q.set("token", token);
    const at = getAccessToken();
    if (at) q.set("auth_token", at);
    return `${API_BASE_URL}/api/v1/print/${docType}/${id}?${q.toString()}`;
  };

  const handlePrint = (format: "html" | "pdf", paperSize: "a4" | "thermal80" = paper) => {
    setIsOpen(false);
    window.open(getUrl(format, paperSize), "_blank");
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Primary Action Button: Open HTML Print View in New Tab */}
      <button
        type="button"
        onClick={() => handlePrint("html")}
        data-testid="print-button"
        className="h-10 px-3 border border-neutral-300 bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-800 flex items-center gap-1.5 cursor-pointer shadow-2xs"
        style={{ borderRadius: 0 }}
      >
        <Printer className="w-3.5 h-3.5 text-neutral-700" />
        <span>{label}</span>
      </button>

      {/* Dropdown Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Print Options"
        data-testid="print-options-toggle"
        className="h-10 px-2 border-y border-r border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-600 flex items-center justify-center cursor-pointer shadow-2xs"
        style={{ borderRadius: 0 }}
      >
        <ChevronDown className="w-3 h-3" />
      </button>

      {/* Options Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1 w-44 bg-white border border-neutral-300 z-50 py-1 shadow-lg select-none"
            style={{ borderRadius: 0 }}
          >
            <button
              type="button"
              onClick={() => handlePrint("html", "a4")}
              className="w-full px-3 py-1.5 text-left text-xs font-medium text-neutral-800 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-3 h-3 text-neutral-500" />
              <span>Print A4 Slip</span>
            </button>
            <button
              type="button"
              onClick={() => handlePrint("html", "thermal80")}
              className="w-full px-3 py-1.5 text-left text-xs font-medium text-neutral-800 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-3 h-3 text-neutral-500" />
              <span>Print 80mm Thermal</span>
            </button>
            <div className="border-t border-neutral-200 my-1" />
            <button
              type="button"
              onClick={() => handlePrint("pdf", "a4")}
              data-testid="download-pdf-option"
              className="w-full px-3 py-1.5 text-left text-xs font-medium text-neutral-800 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3 h-3 text-neutral-500" />
              <span>Download PDF</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
