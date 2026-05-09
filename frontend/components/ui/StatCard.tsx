import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor = "from-brand-600 to-purple-600",
  alert,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  iconColor?: string;
  alert?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-5 border transition-all card-hover",
        alert ? "border-red-500/20 hover:border-red-500/35" : "border-white/6 hover:border-white/12"
      )}
    >
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${iconColor} mb-3`}>
        <Icon size={17} className="text-white" />
      </div>
      <div className="text-2xl font-black text-white mb-0.5">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
      {sub && <div className="text-[10px] text-slate-600 mt-1">{sub}</div>}
    </div>
  );
}
