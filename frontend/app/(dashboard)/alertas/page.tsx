"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, AlertTriangle, CheckCircle, Clock, Eye, Shield,
  Receipt, Scale, FolderOpen, Lock, TrendingUp, X, Filter
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";

type Prioridad = "Crítica" | "Alta" | "Media" | "Baja";
type Categoria = "Fiscal" | "Nómina" | "Legal" | "Documentos" | "Retenciones" | "Privacidad";

type Alerta = {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  prioridad: Prioridad;
  fecha: string;
  modulo: string;
  leida: boolean;
  accion?: string;
};

const alertas: Alerta[] = [
  {
    id: "1",
    titulo: "NDA vencido — Proveedores sin cobertura",
    descripcion: "El Acuerdo de Confidencialidad con múltiples proveedores venció hace 11 meses. Los proveedores con acceso a información sensible no están bajo NDA vigente. Riesgo legal inmediato.",
    categoria: "Legal",
    prioridad: "Crítica",
    fecha: "2026-05-09 08:00",
    modulo: "LexGuard",
    leida: false,
    accion: "Renovar NDA",
  },
  {
    id: "2",
    titulo: "Juan Pérez — Sin retención ISR aplicada",
    descripcion: "Pago a consultor persona física por RD$60,000 sin aplicar retención ISR del 10%. Riesgo de multa DGII por no retener según Ley 11-92 Art. 309.",
    categoria: "Retenciones",
    prioridad: "Crítica",
    fecha: "2026-05-09 07:45",
    modulo: "Retenciones",
    leida: false,
    accion: "Registrar retención",
  },
  {
    id: "3",
    titulo: "Política de protección de datos sin aprobar",
    descripcion: "La Política de Protección de Datos lleva en borrador desde enero 2023. No ha sido aprobada por gerencia ni comunicada a empleados. Posible incumplimiento Ley 172-13.",
    categoria: "Privacidad",
    prioridad: "Alta",
    fecha: "2026-05-09 07:30",
    modulo: "DataShield",
    leida: false,
    accion: "Revisar política",
  },
  {
    id: "4",
    titulo: "Juan Pérez — Contrato sin firma, vence en 30 días",
    descripcion: "Contrato laboral de Juan Pérez Rodríguez activo en nómina sin firma del empleado. Vencimiento: 15 junio 2026. Sin firma no tiene validez jurídica según Código de Trabajo dominicano.",
    categoria: "Legal",
    prioridad: "Alta",
    fecha: "2026-05-08 16:00",
    modulo: "LexGuard",
    leida: false,
    accion: "Obtener firma",
  },
  {
    id: "5",
    titulo: "3 facturas sin NCF válido detectadas",
    descripcion: "FiscalGuard detectó 3 comprobantes con NCF inválido o formato incorrecto. Deben corregirse antes del cierre fiscal de mayo 2026 para evitar rechazo en declaración 606.",
    categoria: "Fiscal",
    prioridad: "Alta",
    fecha: "2026-05-08 14:20",
    modulo: "FiscalGuard",
    leida: true,
    accion: "Corregir NCF",
  },
  {
    id: "6",
    titulo: "Expediente de Juan Pérez — 45% completitud",
    descripcion: "El expediente laboral de Juan Pérez está incompleto: faltan contrato firmado, carta de ingreso, formulario TSS IT-1, autorización de tratamiento de datos y NDA.",
    categoria: "Documentos",
    prioridad: "Alta",
    fecha: "2026-05-08 11:00",
    modulo: "DocVault",
    leida: true,
    accion: "Completar expediente",
  },
  {
    id: "7",
    titulo: "Ing. María López — Pago sin retención ISR",
    descripcion: "Pago de RD$85,000 a persona física por servicios de ingeniería fue liberado sin retención. Retención pendiente: RD$8,500.",
    categoria: "Retenciones",
    prioridad: "Alta",
    fecha: "2026-05-08 09:30",
    modulo: "Retenciones",
    leida: true,
    accion: "Aplicar retención",
  },
  {
    id: "8",
    titulo: "Patricia Herrera — Empleada activa sin contrato firmado",
    descripcion: "Patricia Herrera Nova está registrada en nómina desde febrero 2025 sin contrato laboral firmado. Vencimiento contractual: agosto 2026.",
    categoria: "Legal",
    prioridad: "Alta",
    fecha: "2026-05-07 17:00",
    modulo: "LexGuard",
    leida: true,
  },
  {
    id: "9",
    titulo: "Ana López — Cédula vencida en expediente",
    descripcion: "La cédula de identidad de Ana López Sánchez en el sistema está marcada como vencida. Requiere actualización para cumplimiento documental.",
    categoria: "Documentos",
    prioridad: "Media",
    fecha: "2026-05-07 14:00",
    modulo: "DocVault",
    leida: true,
  },
  {
    id: "10",
    titulo: "Contrato de arrendamiento — Cláusula de reajuste faltante",
    descripcion: "El contrato de arrendamiento de la oficina principal fue renovado sin actualizar la cláusula de reajuste inflacionario. Revisión legal sugerida.",
    categoria: "Legal",
    prioridad: "Media",
    fecha: "2026-05-07 10:30",
    modulo: "LexGuard",
    leida: true,
  },
  {
    id: "11",
    titulo: "Intento de acceso no autorizado detectado",
    descripcion: "Se registró un intento de acceso al panel ejecutivo desde externo@correo.com el 7 de mayo. El acceso fue denegado. Verificar si es actividad sospechosa.",
    categoria: "Privacidad",
    prioridad: "Media",
    fecha: "2026-05-07 14:33",
    modulo: "DataShield",
    leida: true,
  },
  {
    id: "12",
    titulo: "TSS mayo 2026 — Vencimiento en 15 días",
    descripcion: "El pago mensual a la TSS vence el 24 de mayo 2026. Total estimado: RD$47,892 (empleador + empleado). Preparar transferencia.",
    categoria: "Nómina",
    prioridad: "Media",
    fecha: "2026-05-06 09:00",
    modulo: "NóminaGuard",
    leida: true,
    accion: "Ver nómina",
  },
  {
    id: "13",
    titulo: "Roberto Santos — Licencia conducir vencida",
    descripcion: "La licencia de conducir de Roberto Santos (Chofer) registrada en su expediente está vencida. Debe actualizarse para cumplimiento legal.",
    categoria: "Documentos",
    prioridad: "Baja",
    fecha: "2026-05-05 11:00",
    modulo: "DocVault",
    leida: true,
  },
  {
    id: "14",
    titulo: "2 empleados con consentimiento pendiente renovación",
    descripcion: "Ana López y Roberto Santos tienen consentimientos de tratamiento de datos que requieren renovación. Última firma hace más de 5 años.",
    categoria: "Privacidad",
    prioridad: "Baja",
    fecha: "2026-05-04 08:00",
    modulo: "DataShield",
    leida: true,
  },
];

const categoriaConfig: Record<Categoria, { icon: React.ComponentType<{ size?: number; className?: string }>; color: string; bg: string }> = {
  Fiscal:       { icon: TrendingUp, color: "text-brand-400", bg: "bg-brand-500/15" },
  Nómina:       { icon: Receipt,    color: "text-amber-400", bg: "bg-amber-500/15" },
  Legal:        { icon: Scale,      color: "text-violet-400", bg: "bg-violet-500/15" },
  Documentos:   { icon: FolderOpen, color: "text-sky-400",   bg: "bg-sky-500/15" },
  Retenciones:  { icon: Receipt,    color: "text-orange-400", bg: "bg-orange-500/15" },
  Privacidad:   { icon: Lock,       color: "text-rose-400",   bg: "bg-rose-500/15" },
};

const prioridadConfig: Record<Prioridad, { variant: "red" | "amber" | "purple" | "slate"; label: string }> = {
  Crítica: { variant: "red",    label: "Crítica" },
  Alta:    { variant: "amber",  label: "Alta" },
  Media:   { variant: "purple", label: "Media" },
  Baja:    { variant: "slate",  label: "Baja" },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function AlertasPage() {
  const [filterCat, setFilterCat]     = useState<"Todas" | Categoria>("Todas");
  const [filterPrio, setFilterPrio]   = useState<"Todas" | Prioridad>("Todas");
  const [soloNoLeidas, setSoloNoLeidas] = useState(false);
  const [dismissed, setDismissed]     = useState<Set<string>>(new Set());

  const visible = alertas.filter((a) => {
    if (dismissed.has(a.id)) return false;
    if (soloNoLeidas && a.leida) return false;
    if (filterCat !== "Todas" && a.categoria !== filterCat) return false;
    if (filterPrio !== "Todas" && a.prioridad !== filterPrio) return false;
    return true;
  });

  const criticas  = alertas.filter((a) => a.prioridad === "Crítica" && !dismissed.has(a.id)).length;
  const altas     = alertas.filter((a) => a.prioridad === "Alta"    && !dismissed.has(a.id)).length;
  const noLeidas  = alertas.filter((a) => !a.leida                  && !dismissed.has(a.id)).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 max-w-7xl mx-auto">
      <motion.div variants={item}>
        <PageHeader
          icon={Bell}
          iconColor="from-brand-500 to-purple-600"
          title="Centro de Alertas"
          subtitle="Feed unificado de alertas y acciones pendientes de todos los módulos"
          actions={
            <button
              onClick={() => setSoloNoLeidas((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${soloNoLeidas ? "bg-brand-600 border-brand-500 text-white" : "glass border-white/8 text-slate-300 hover:border-white/16"}`}>
              <Eye size={13} /> Solo no leídas
            </button>
          }
        />
      </motion.div>

      {/* Summary */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Alertas críticas",  val: criticas,                                          icon: AlertTriangle, color: "from-red-600 to-rose-600",    alert: criticas > 0 },
          { label: "Prioridad alta",    val: altas,                                             icon: AlertTriangle, color: "from-amber-500 to-orange-600", alert: altas > 0 },
          { label: "Sin leer",          val: noLeidas,                                          icon: Bell,          color: "from-brand-600 to-purple-600",  alert: noLeidas > 0 },
          { label: "Total activas",     val: alertas.filter((a) => !dismissed.has(a.id)).length, icon: Shield,       color: "from-slate-600 to-slate-700",  alert: false },
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

      {/* Filters */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={13} className="text-slate-500" />
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Módulo:</span>
          {(["Todas", "Fiscal", "Nómina", "Legal", "Documentos", "Retenciones", "Privacidad"] as const).map((c) => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${filterCat === c ? "bg-brand-600 text-white" : "glass text-slate-400 hover:text-white border border-white/8"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Prioridad:</span>
          {(["Todas", "Crítica", "Alta", "Media", "Baja"] as const).map((p) => (
            <button key={p} onClick={() => setFilterPrio(p)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${filterPrio === p ? "bg-brand-600 text-white" : "glass text-slate-400 hover:text-white border border-white/8"}`}>
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Alert feed */}
      <motion.div variants={item} className="space-y-3">
        <AnimatePresence mode="popLayout">
          {visible.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="glass rounded-2xl border border-white/6 p-12 flex flex-col items-center gap-3">
              <CheckCircle size={32} className="text-emerald-400" />
              <div className="text-sm font-bold text-white">Sin alertas activas</div>
              <div className="text-xs text-slate-500">Todos los módulos están al día</div>
            </motion.div>
          ) : visible.map((alerta) => {
            const catCfg  = categoriaConfig[alerta.categoria];
            const prioCfg = prioridadConfig[alerta.prioridad];
            const CatIcon = catCfg.icon;
            const isCritical = alerta.prioridad === "Crítica";
            return (
              <motion.div
                key={alerta.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                className={`glass rounded-2xl border transition-all ${isCritical ? "border-red-500/30 bg-red-500/3" : alerta.prioridad === "Alta" ? "border-amber-500/20" : "border-white/6"} ${!alerta.leida ? "ring-1 ring-brand-500/20" : ""}`}>
                <div className="flex items-start gap-4 p-4">
                  <div className={`w-10 h-10 rounded-xl ${catCfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <CatIcon size={18} className={catCfg.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold ${!alerta.leida ? "text-white" : "text-slate-200"}`}>{alerta.titulo}</span>
                        {!alerta.leida && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={prioCfg.variant}>
                          {isCritical ? <AlertTriangle size={10} /> : <Clock size={10} />}
                          {prioCfg.label}
                        </Badge>
                        <button
                          onClick={() => setDismissed((prev) => new Set([...prev, alerta.id]))}
                          className="p-1 rounded-lg hover:bg-white/8 text-slate-600 hover:text-slate-300 transition-all">
                          <X size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{alerta.descripcion}</p>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${catCfg.bg} ${catCfg.color}`}>
                          {alerta.modulo}
                        </span>
                        <span className="text-[10px] text-slate-600">{alerta.fecha}</span>
                      </div>
                      {alerta.accion && (
                        <button className="text-[11px] font-semibold px-3 py-1.5 rounded-lg glass border border-white/8 text-slate-300 hover:text-white hover:border-brand-500/40 transition-all">
                          {alerta.accion}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {dismissed.size > 0 && (
        <motion.div variants={item} className="flex justify-center">
          <button
            onClick={() => setDismissed(new Set())}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5">
            <CheckCircle size={12} /> {dismissed.size} alerta{dismissed.size > 1 ? "s" : ""} descartada{dismissed.size > 1 ? "s" : ""} — Restaurar
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
