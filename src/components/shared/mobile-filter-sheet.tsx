"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export interface FilterOption<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  dotColor?: string;
  selectedDotColor?: string;
}

interface MobileFilterSheetProps<T extends string = string> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  options: FilterOption<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
}

export function MobileFilterSheet<T extends string = string>({
  isOpen,
  onClose,
  title = "Filter by Status",
  options,
  selectedId,
  onSelect,
}: MobileFilterSheetProps<T>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-999 sm:hidden">
          {/* Backdrop */}
          <motion.div
            key="filter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50"
          />

          {/* Compact Bottom Sheet Drawer - Flush to bottom with zero gap */}
          <motion.div
            key="filter-drawer"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-neutral-300 shadow-2xl flex flex-col"
            style={{
              paddingBottom: "max(1rem, env(safe-area-inset-bottom, 16px))",
            }}
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-neutral-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                {title}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Options List */}
            <div className="p-3 space-y-1.5 max-h-[60vh] overflow-y-auto">
              {options.map((opt) => {
                const isSelected = selectedId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onSelect(opt.id);
                      onClose();
                    }}
                    className={`w-full px-3.5 py-3 border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#18181B] text-white border-[#18181B] font-bold"
                        : "bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${
                          isSelected
                            ? opt.selectedDotColor || "bg-white ring-2 ring-white/30"
                            : opt.dotColor || "bg-neutral-400"
                        }`}
                      />
                      <span>{opt.label}</span>
                    </div>

                    {opt.count !== undefined && (
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`font-mono text-xs px-1.5 py-0.5 border ${
                            isSelected
                              ? "bg-white/10 text-white border-white/20"
                              : "bg-neutral-100 text-neutral-700 border-neutral-200"
                          }`}
                        >
                          {opt.count}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
