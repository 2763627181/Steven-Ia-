"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  TrendingUp,
  FileSearch,
  Users,
  Receipt,
  CheckCircle,
  Clock,
  ArrowRight,
  Zap,
} from "lucide-react";

const riskScores = [
  {
    label: "Riesgo Fiscal",
    value: 72,
    level: "Alto",
    color: "bg-red-500",
    levelColor: "text-red-400",
    detail: "18 facturas sin NCF, 4 pagos sin retención, 2 duplicados",
  },
  {
    label: "Riesgo Laboral",
    value: 45,
    level: "Medio",
    color: "bg-amber-500",
    levelColor: "text-amber-400",
    detail: "3 empleados sin contrato firmado, vacaciones sin control",
  },
  {
    label: "Riesgo Legal",
    value: 68,
    level: "Alto",
    color: "bg-red-500",
    levelColor: "text-red-400",
    detail: "Contratos sin cláusula de datos personales",
  },
  {
    label: "Cumplimiento TSS",
    value: 88,
    level: "Bajo",
    color: "bg-emerald-500",
    levelColor: "text-emerald-400",
    detail: "Topes actualizados a febrero 2026",
  },
];

const recentAlerts = [
  {
    type: "critical",
    icon: AlertTriangle,
    iconColor: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    title: "18 facturas sin validación NCF",
    detail: "Detectadas en el período Abril 2026. Pueden invalidar deducciones de ITBIS e ISR.",
    time: "Hace 2 horas",
    action: "Revisar facturas",
  },
  {
    type: "warning",
    icon: Receipt,
    iconColor: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    title: "4 pagos sin retención sugerida",
    detail: "Pagos a personas físicas por servicios profesionales sin retención ISR aplicada.",
    time: "Hace 4 horas",
    action: "Ver pagos",
  },
  {
    type: "warning",
    icon: Users,
    iconColor: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    title: "3 empleados sin contrato firmado",
    detail: "Empleados activos en nómina pero con expediente incompleto.",
    time: "Hace 1 día",
    action: "Ver empleados",
  },
  {
    type: "info",
    icon: CheckCircle,
    iconColor: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Nómina Mayo 2026 calculada",
    detail: "ISR asalariados con escala 2026 vigente. TSS con topes de febrero 2026.",
    time: "Hace 2 días",
    action: "Ver nómina",
  },
];

const kpis = [
  {
    label: "Facturas analizadas",
    value: "247",
    change: "+12 este mes",
    icon: FileSearch,
    color: "from-brand-600 to-purple-600",
  },
  {
    label: "Errores detectados",
    value: "31",
    change: "vs 48 el mes pasado",
    icon: AlertTriangle,
    color: "from-red-600 to-rose-600",
  },
  {
    label: "Empleados en nómina",
    value: "42",
    change: "3 sin contrato",
    icon: Users,
    color: "from-emerald-600 to-teal-600",
  },
  {
    label: "Retenciones pendientes",
    value: "RD$84K",
    change: "4 sin procesar",
    icon: TrendingUp,
    color: "from-amber-600 to-orange-600",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Page header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Panel ejecutivo</h1>
          <p className="text-sm text-slate-500">
            Mayo 2026 · Empresa: Mi Empresa SRL
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          <Zap size={15} />
          Generar reporte IA
        </button>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="glass rounded-2xl p-5 border border-white/6 hover:border-white/12 transition-all card-hover"
            >
              <div
                className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.color} mb-3`}
              >
                <Icon size={17} className="text-white" />
              </div>
              <div className="text-2xl font-black text-white mb-1">
                {kpi.value}
              </div>
              <div className="text-xs text-slate-500 leading-snug">
                {kpi.label}
              </div>
              <div className="text-[10px] text-slate-600 mt-1">{kpi.change}</div>
            </div>
          );
        })}
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Risk scores */}
        <motion.div
          variants={item}
          className="lg:col-span-2 glass rounded-2xl p-5 border border-white/6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white">RiskScore™</h2>
            <span className="text-[10px] text-slate-500">
              Actualizado hace 2h
            </span>
          </div>
          <div className="space-y-5">
            {riskScores.map((rs) => (
              <div key={rs.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400">{rs.label}</span>
                  <span className={`text-xs font-bold ${rs.levelColor}`}>
                    {rs.level} · {rs.value}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rs.value}%` }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${rs.color}`}
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-1 leading-snug">
                  {rs.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts feed */}
        <motion.div
          variants={item}
          className="lg:col-span-3 glass rounded-2xl p-5 border border-white/6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white">Alertas recientes</h2>
            <button className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
              Ver todas <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert, i) => {
              const Icon = alert.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className={`flex gap-3 p-3.5 rounded-xl border ${alert.bg} group cursor-default`}
                >
                  <Icon size={16} className={`${alert.iconColor} shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-white leading-snug">
                        {alert.title}
                      </p>
                      <span className="text-[10px] text-slate-600 shrink-0 flex items-center gap-1">
                        <Clock size={10} /> {alert.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">
                      {alert.detail}
                    </p>
                    <button className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 mt-2 flex items-center gap-1 transition-colors">
                      {alert.action} <ArrowRight size={11} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* AI insight bar */}
      <motion.div
        variants={item}
        className="glass-brand rounded-2xl p-5 border border-brand-500/20 flex items-start gap-4"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shrink-0">
          <Zap size={17} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-brand-300 uppercase tracking-wider mb-1">
            Executive Brain — Análisis IA
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Este mes tu empresa tiene{" "}
            <strong className="text-white">riesgo fiscal elevado</strong> por 18
            facturas sin validación NCF que pueden representar deducciones
            rechazadas. Adicionalmente, se detectaron 4 pagos a personas físicas
            sin retención ISR. Recomiendo revisar y corregir antes del cierre de
            mayo para evitar posibles sanciones de la DGII.
          </p>
          <button className="text-xs font-semibold text-brand-400 hover:text-brand-300 mt-2 flex items-center gap-1 transition-colors">
            Ver recomendaciones completas <ArrowRight size={12} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
