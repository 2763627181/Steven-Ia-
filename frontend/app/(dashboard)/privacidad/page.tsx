"use client";

import { motion } from "framer-motion";
import { Lock, Shield, AlertTriangle, CheckCircle, Eye, Clock, User } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";

const consentimientos = [
  { empleado: "María García Díaz", fecha: "2020-03-15", estado: "Firmado", tipo: "Contratación" },
  { empleado: "Carlos Martínez Pérez", fecha: "2021-06-01", estado: "Firmado", tipo: "Contratación" },
  { empleado: "Ana López Sánchez", fecha: "2019-01-10", estado: "Pendiente renovación", tipo: "Contratación" },
  { empleado: "Juan Pérez Rodríguez", fecha: "—", estado: "Sin consentimiento", tipo: "—" },
  { empleado: "Laura Jiménez Cruz", fecha: "2022-09-05", estado: "Firmado", tipo: "Contratación" },
  { empleado: "Roberto Santos Melo", fecha: "2018-04-20", estado: "Pendiente renovación", tipo: "Contratación" },
];

const auditLog = [
  { accion: "Descarga de expediente", usuario: "admin@empresa.com", recurso: "Expediente Juan Pérez", fecha: "2026-05-09 10:32", nivel: "warning" },
  { accion: "Visualización de salarios", usuario: "rrhh@empresa.com", recurso: "Nómina Mayo 2026", fecha: "2026-05-09 09:18", nivel: "info" },
  { accion: "Actualización de contrato", usuario: "admin@empresa.com", recurso: "Contrato Ana López", fecha: "2026-05-08 16:45", nivel: "info" },
  { accion: "Acceso a cédulas", usuario: "contador@empresa.com", recurso: "Expedientes - Finanzas", fecha: "2026-05-08 11:20", nivel: "info" },
  { accion: "Exportación de nómina", usuario: "gerencia@empresa.com", recurso: "Nómina Abril 2026", fecha: "2026-05-07 17:05", nivel: "warning" },
  { accion: "Intento de acceso denegado", usuario: "externo@correo.com", recurso: "Panel ejecutivo", fecha: "2026-05-07 14:33", nivel: "danger" },
];

const roles = [
  { rol: "Administrador", usuario: "admin@empresa.com", permisos: ["Todo el sistema", "Gestión de usuarios", "Configuración"], activo: true },
  { rol: "Contador", usuario: "contador@empresa.com", permisos: ["FiscalGuard", "Retenciones", "Reportes"], activo: true },
  { rol: "RRHH", usuario: "rrhh@empresa.com", permisos: ["Nómina", "DocVault", "LexGuard"], activo: true },
  { rol: "Gerencia", usuario: "gerencia@empresa.com", permisos: ["Panel ejecutivo", "Reportes", "Alertas"], activo: true },
  { rol: "Auditor externo", usuario: "auditor@firma.com", permisos: ["FiscalGuard (lectura)", "Reportes"], activo: false },
];

const nivelConfig = {
  info: { color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20", icon: Eye },
  warning: { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: AlertTriangle },
  danger: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: AlertTriangle },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function DataShieldPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 max-w-7xl mx-auto">
      <motion.div variants={item}>
        <PageHeader
          icon={Lock}
          iconColor="from-rose-500 to-red-600"
          title="DataShield — Protección de Datos"
          subtitle="Cumplimiento Ley 172-13 · Consentimientos, roles y auditoría de accesos"
        />
      </motion.div>

      {/* Compliance summary */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Con consentimiento", val: String(consentimientos.filter(c => c.estado === "Firmado").length), icon: CheckCircle, color: "from-emerald-500 to-teal-600" },
          { label: "Sin consentimiento", val: String(consentimientos.filter(c => c.estado === "Sin consentimiento").length), icon: AlertTriangle, color: "from-red-600 to-rose-600", alert: true },
          { label: "Pend. renovación", val: String(consentimientos.filter(c => c.estado === "Pendiente renovación").length), icon: Clock, color: "from-amber-500 to-orange-600", alert: true },
          { label: "Eventos auditados (mes)", val: String(auditLog.length), icon: Eye, color: "from-brand-600 to-purple-600" },
        ].map((s) => (
          <div key={s.label} className={`glass rounded-2xl p-5 border transition-all ${s.alert ? "border-red-500/20" : "border-white/6 hover:border-white/12"}`}>
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} mb-3`}>
              <s.icon size={17} className="text-white" />
            </div>
            <div className="text-2xl font-black text-white mb-0.5">{s.val}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Consentimientos */}
        <motion.div variants={item} className="glass rounded-2xl border border-white/6 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/6">
            <h2 className="text-sm font-bold text-white">Consentimientos de tratamiento de datos</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Art. 12 Ley 172-13 — Autorización expresa requerida</p>
          </div>
          <div className="divide-y divide-white/4">
            {consentimientos.map((c) => {
              const variant = c.estado === "Firmado" ? "emerald" : c.estado === "Sin consentimiento" ? "red" : "amber";
              const Icon = c.estado === "Firmado" ? CheckCircle : AlertTriangle;
              return (
                <div key={c.empleado} className="flex items-center justify-between px-5 py-3 hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-rose-500/15 flex items-center justify-center">
                      <User size={12} className="text-rose-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{c.empleado}</div>
                      <div className="text-[10px] text-slate-500">{c.fecha !== "—" ? `Firmado: ${c.fecha}` : "Sin registro"}</div>
                    </div>
                  </div>
                  <Badge variant={variant}><Icon size={10} />{c.estado}</Badge>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Roles */}
        <motion.div variants={item} className="glass rounded-2xl border border-white/6 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/6">
            <h2 className="text-sm font-bold text-white">Control de roles y accesos</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Principio de acceso mínimo necesario</p>
          </div>
          <div className="divide-y divide-white/4">
            {roles.map((r) => (
              <div key={r.usuario} className="px-5 py-3 hover:bg-white/2 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${r.activo ? "bg-emerald-400" : "bg-slate-600"}`} />
                    <span className="text-xs font-bold text-white">{r.rol}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{r.usuario}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.permisos.map((p) => (
                    <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-slate-400">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Audit log */}
      <motion.div variants={item} className="glass rounded-2xl border border-white/6 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6">
          <h2 className="text-sm font-bold text-white">Bitácora de accesos</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Registro inmutable de todas las acciones sobre datos sensibles</p>
        </div>
        <div className="divide-y divide-white/4">
          {auditLog.map((log, i) => {
            const cfg = nivelConfig[log.nivel as keyof typeof nivelConfig];
            const Icon = cfg.icon;
            return (
              <div key={i} className={`flex items-center gap-4 px-5 py-3 hover:bg-white/2 transition-colors`}>
                <div className={`w-8 h-8 rounded-lg ${cfg.bg} border flex items-center justify-center shrink-0`}>
                  <Icon size={13} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-white">{log.accion}</span>
                    <span className="text-[10px] text-slate-500">·</span>
                    <span className="text-[10px] text-slate-500 truncate">{log.recurso}</span>
                  </div>
                  <div className="text-[10px] text-slate-600">{log.usuario}</div>
                </div>
                <div className="text-[10px] text-slate-600 whitespace-nowrap shrink-0">{log.fecha}</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Legal note */}
      <motion.div variants={item} className="flex gap-3 p-4 rounded-2xl bg-rose-500/8 border border-rose-500/20">
        <Shield size={16} className="text-rose-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-rose-300 mb-1">Cumplimiento Ley 172-13 — República Dominicana</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            El sistema almacena y procesa datos personales bajo los principios de la Ley 172-13: <strong className="text-white">finalidad, consentimiento, proporcionalidad y seguridad</strong>. Los datos de empleados están cifrados en reposo. Los accesos quedan registrados. El empleado tiene derecho a conocer, rectificar y cancelar sus datos registrados.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
