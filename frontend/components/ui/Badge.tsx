"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "red" | "amber" | "emerald" | "blue" | "purple" | "slate";

const variants: Record<BadgeVariant, string> = {
  red: "bg-red-500/15 text-red-400 border-red-500/25",
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  blue: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  purple: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  slate: "bg-slate-500/15 text-slate-400 border-slate-500/25",
};

export function Badge({
  children,
  variant = "slate",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function RiskBadge({ level }: { level: "Bajo" | "Medio" | "Alto" | "Crítico" }) {
  const map = {
    Bajo: "emerald",
    Medio: "amber",
    Alto: "red",
    Crítico: "red",
  } as const;
  return (
    <Badge variant={map[level]}>
      <span className={`w-1.5 h-1.5 rounded-full ${level === "Bajo" ? "bg-emerald-400" : level === "Medio" ? "bg-amber-400" : "bg-red-400"}`} />
      {level}
    </Badge>
  );
}
