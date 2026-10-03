import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      type = "button",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 hover:shadow-emerald-500/30 active:scale-[0.98]",
      secondary:
        "bg-slate-800 text-slate-100 hover:bg-slate-700/80 border border-slate-700/80 active:scale-[0.98]",
      outline:
        "border border-slate-700 text-slate-200 hover:bg-slate-800/60 hover:border-slate-600 active:scale-[0.98]",
      ghost:
        "text-slate-300 hover:bg-slate-800/60 hover:text-white active:scale-[0.98]",
      danger:
        "bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-lg shadow-rose-600/20 hover:from-rose-500 hover:to-red-600 active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
