"use client";

import React from "react";

interface IndustrialSkeletonProps {
  variant?: "default" | "dashboard" | "form" | "table";
}

export function IndustrialSkeleton({ variant = "default" }: IndustrialSkeletonProps) {
  return (
    <div className="w-full space-y-6 sm:space-y-7 animate-in fade-in duration-150 select-none">
      {/* Top Telemetry Beacon & Command Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200">
        <div className="space-y-2">
          {/* Active Station Beacon */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 bg-[#059669] animate-pulse" />
            <span className="font-mono text-[10px] font-bold text-[#047857] uppercase tracking-wider">
              Loading Workbench Telemetry...
            </span>
          </div>
          {/* Command Page Header */}
          <div className="h-8 sm:h-9 w-60 sm:w-80 bg-neutral-300/80 animate-pulse" />
          <div className="h-3.5 w-40 sm:w-56 bg-neutral-200 animate-pulse" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <div className="h-10 w-24 bg-neutral-200/80 border border-neutral-300 animate-pulse" />
          <div className="h-10 w-36 bg-[#059669]/20 border border-[#059669]/40 animate-pulse" />
        </div>
      </div>

      {/* 4-Column Operational Telemetry / KPI Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-3.5 sm:p-4 bg-white border border-neutral-300 flex flex-col justify-between space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="h-3 w-20 bg-neutral-200 animate-pulse" />
              <div className="h-4 w-14 bg-neutral-100 border border-neutral-200 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="h-7 sm:h-8 w-24 bg-neutral-300/80 animate-pulse" />
              <div className="h-4 w-8 bg-neutral-200 animate-pulse" />
            </div>
            <div className="h-3 w-28 bg-neutral-100 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Primary Operational Workbench Skeleton */}
      <div className="bg-white border border-neutral-300 p-4 sm:p-6 space-y-5 shadow-2xs">
        {/* Section Sub-Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 bg-[#059669]/40 animate-pulse shrink-0" />
            <div className="h-4 w-44 bg-neutral-300/80 animate-pulse" />
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-8 w-20 bg-neutral-200 animate-pulse" />
            <div className="h-8 w-20 bg-neutral-200 animate-pulse" />
          </div>
        </div>

        {/* Balanced 3-Column Field Grid / Table Rows Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-24 bg-neutral-200 animate-pulse" />
              <div className="h-10 w-full bg-neutral-50 border border-neutral-200 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Data Table / List Rows Skeleton */}
        <div className="space-y-2 pt-3 border-t border-neutral-200">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 w-full bg-neutral-50 border border-neutral-200/80 flex items-center justify-between px-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-5 w-24 bg-neutral-200" />
                <div className="h-4 w-32 bg-neutral-200 hidden sm:block" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-16 bg-neutral-200" />
                <div className="h-4 w-4 bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>

        {/* Form Action Footer Skeleton */}
        <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="h-9 w-28 bg-neutral-200 animate-pulse" />
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-24 bg-neutral-200 animate-pulse" />
            <div className="h-10 w-40 bg-[#059669]/30 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
