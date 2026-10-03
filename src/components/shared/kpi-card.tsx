import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";

export interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    period?: string;
  };
  icon?: LucideIcon;
  accentColor?: "emerald" | "sky" | "amber" | "rose" | "purple";
  className?: string;
}

export function KpiCard({
  title,
  value,
  unit,
  trend,
  icon: Icon,
  accentColor = "emerald",
  className,
}: KpiCardProps) {
  const accentBorders = {
    emerald: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    sky: "hover:border-sky-500/40 hover:shadow-sky-500/10",
    amber: "hover:border-amber-500/40 hover:shadow-amber-500/10",
    rose: "hover:border-rose-500/40 hover:shadow-rose-500/10",
    purple: "hover:border-purple-500/40 hover:shadow-purple-500/10",
  };

  const iconColors = {
    emerald: "text-emerald-400 bg-emerald-950/60 border-emerald-800/50",
    sky: "text-sky-400 bg-sky-950/60 border-sky-800/50",
    amber: "text-amber-400 bg-amber-950/60 border-amber-800/50",
    rose: "text-rose-400 bg-rose-950/60 border-rose-800/50",
    purple: "text-purple-400 bg-purple-950/60 border-purple-800/50",
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
        accentBorders[accentColor],
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white tabular-nums">
              {value}
            </span>
            {unit && <span className="text-xs text-slate-400">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl border p-2.5 shadow-inner",
              iconColors[accentColor]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          {trend.isPositive ? (
            <span className="flex items-center gap-0.5 font-medium text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {trend.value}
            </span>
          ) : (
            <span className="flex items-center gap-0.5 font-medium text-rose-400">
              <ArrowDownRight className="h-3.5 w-3.5" />
              {trend.value}
            </span>
          )}
          <span className="text-slate-500">vs {trend.period || "yesterday"}</span>
        </div>
      )}
    </Card>
  );
}
