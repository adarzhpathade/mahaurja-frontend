import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-800 text-slate-200 border-slate-700",
    success: "bg-emerald-950/70 text-emerald-400 border-emerald-800/60 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    warning: "bg-amber-950/70 text-amber-300 border-amber-800/60 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    danger: "bg-rose-950/70 text-rose-300 border-rose-800/60 shadow-[0_0_12px_rgba(244,63,94,0.15)]",
    info: "bg-sky-950/70 text-sky-300 border-sky-800/60 shadow-[0_0_12px_rgba(56,189,248,0.15)]",
    outline: "bg-transparent text-slate-300 border-slate-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
