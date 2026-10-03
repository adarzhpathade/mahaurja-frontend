"use client";

import React from "react";
import { Bell, Search, Activity, Sparkles, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-6 backdrop-blur-xl">
      {/* Left side: plant status & search */}
      <div className="flex items-center gap-4 lg:gap-6 pl-12 lg:pl-0">
        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="success" className="gap-1.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>PLANT ACTIVE</span>
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Shift 1 (08:00 - 16:00)</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-48 sm:w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Vehicle, Lot, SO, Batch ID..."
            className="h-10 w-full rounded-xl bg-slate-900/90 pl-9.5 pr-3 text-sm text-white placeholder-slate-500 border border-slate-800/80 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right side: alerts & quick actions */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 rounded-xl bg-slate-900/60 px-3 py-1.5 border border-slate-800/80 text-xs">
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-slate-400">Today&apos;s Output:</span>
          <span className="font-bold text-white tabular-nums">84.5 MT</span>
          <span className="text-[10px] text-emerald-400 font-semibold">(70.4%)</span>
        </div>

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800/80 bg-slate-900/80 text-slate-300 hover:text-white transition-colors"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800/80">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xs font-bold text-white shadow-md">
            AD
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-white">Adarsh Z.</p>
            <p className="text-[10px] text-slate-400">Operations Head</p>
          </div>
        </div>
      </div>
    </header>
  );
}
