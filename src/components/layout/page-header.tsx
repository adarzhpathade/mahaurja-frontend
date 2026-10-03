import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 pb-6 md:flex-row md:items-center md:justify-between border-b border-slate-800/60 mb-6",
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-slate-400 md:text-sm">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2.5">{actions}</div>
      )}
    </div>
  );
}
