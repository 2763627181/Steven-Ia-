"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileSearch,
  Receipt,
  Users,
  FolderOpen,
  Scale,
  Lock,
  Settings,
  LogOut,
  Zap,
  ChevronLeft,
  Bell,
} from "lucide-react";
import { useState } from "react";

type NavItem = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  badge?: number;
  badgeColor?: string;
};

const nav: { group: string; items: NavItem[] }[] = [
  {
    group: "Principal",
    items: [
      { icon: LayoutDashboard, label: "Panel ejecutivo", href: "/dashboard" },
      { icon: Bell, label: "Alertas", href: "/dashboard/alertas", badge: 7 },
    ],
  },
  {
    group: "Módulos",
    items: [
      {
        icon: FileSearch,
        label: "FiscalGuard",
        href: "/dashboard/fiscal",
        badge: 18,
        badgeColor: "bg-red-500",
      },
      {
        icon: Receipt,
        label: "Retenciones",
        href: "/dashboard/retenciones",
        badge: 4,
        badgeColor: "bg-amber-500",
      },
      {
        icon: Users,
        label: "Nómina",
        href: "/dashboard/nomina",
      },
      {
        icon: FolderOpen,
        label: "DocVault",
        href: "/dashboard/documentos",
      },
      {
        icon: Scale,
        label: "LexGuard",
        href: "/dashboard/legal",
      },
      {
        icon: Lock,
        label: "DataShield",
        href: "/dashboard/privacidad",
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative flex flex-col glass border-r border-white/6 transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/6">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-white font-bold text-sm tracking-tight">
              Steven <span className="text-gradient">IA</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto">
            <Zap size={14} className="text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={`text-slate-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all ${collapsed ? "hidden" : ""}`}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {nav.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">
                {group.group}
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        active
                          ? "bg-brand-600/20 text-brand-300 border border-brand-500/25"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={17} className="shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge != null && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                item.badgeColor || "bg-brand-600"
                              } text-white`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && item.badge != null && (
                        <span
                          className={`absolute top-1 right-1 w-2 h-2 rounded-full ${item.badgeColor || "bg-brand-500"}`}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/6 p-2 space-y-0.5">
        <Link
          href="/dashboard/configuracion"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings size={17} />
          {!collapsed && <span>Configuración</span>}
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all">
          <LogOut size={17} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </motion.aside>
  );
}
