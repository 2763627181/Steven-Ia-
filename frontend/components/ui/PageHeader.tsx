import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon,
  iconColor = "from-brand-600 to-purple-600",
  title,
  subtitle,
  actions,
}: {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-lg`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-black text-white leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
