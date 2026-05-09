"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function DashboardHeader() {
  const { user, perfil } = useUser();

  const initials = perfil?.nombre
    ? perfil.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  const displayName = perfil?.nombre || user?.email?.split("@")[0] || "Usuario";
  const displayRole = perfil?.rol
    ? perfil.rol.charAt(0).toUpperCase() + perfil.rol.slice(1)
    : "Administrador";

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/6 glass">
      <div className="relative max-w-xs w-full">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar facturas, empleados..."
          className="w-full bg-white/4 border border-white/6 text-white placeholder:text-slate-600 text-xs rounded-xl pl-9 pr-4 py-2 outline-none focus:border-brand-500/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
            {initials}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-white">{displayName}</div>
            <div className="text-[10px] text-slate-500">{displayRole}</div>
          </div>
          <ChevronDown size={14} className="text-slate-500" />
        </button>
      </div>
    </header>
  );
}
