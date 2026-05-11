"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Shield, TrendingUp, AlertTriangle,
  CheckCircle, FileText, Users, Zap,
} from "lucide-react";

const riskBars = [
  { label: "Riesgo Fiscal",  pct: 72, color: "from-red-500 to-rose-600",       bg: "bg-red-500/20" },
  { label: "Riesgo Laboral", pct: 45, color: "from-amber-400 to-orange-500",   bg: "bg-amber-500/20" },
  { label: "Riesgo Legal",   pct: 28, color: "from-emerald-400 to-teal-500",   bg: "bg-emerald-500/20" },
];

const modules = [
  { Icon: FileText,   label: "Facturas", count: 18, color: "text-red-400",     bg: "bg-red-500/10" },
  { Icon: TrendingUp, label: "Retenc.",  count: 4,  color: "text-amber-400",   bg: "bg-amber-500/10" },
  { Icon: Users,      label: "Nómina",   count: 3,  color: "text-brand-400",   bg: "bg-brand-500/10" },
  { Icon: Shield,     label: "Legal",    count: 2,  color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

const alerts = [
  {
    icon: AlertTriangle,
    iconColor: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/8",
    title: "Riesgo Fiscal",
    titleColor: "text-amber-400",
    value: "Alto",
    detail: "18 facturas sin NCF validado",
    pos: "top-2 -right-4 lg:-right-10",
    delay: 0.7,
    dur: 5.5,
    dly: "0s",
  },
  {
    icon: CheckCircle,
    iconColor: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/8",
    title: "Nómina",
    titleColor: "text-emerald-400",
    value: "Revisada",
    detail: "ISR calculado correctamente",
    pos: "bottom-8 -left-4 lg:-left-10",
    delay: 0.85,
    dur: 6.5,
    dly: "0.8s",
  },
  {
    icon: Shield,
    iconColor: "text-brand-400",
    border: "border-brand-500/30",
    bg: "bg-brand-500/8",
    title: "Protección 172-13",
    titleColor: "text-brand-400",
    value: "Activa",
    detail: "Ley 172-13 en cumplimiento",
    pos: "top-1/2 -right-4 lg:-right-10 -translate-y-1/2",
    delay: 1.0,
    dur: 7,
    dly: "1.6s",
  },
];

const stats = [
  { value: "94%",   label: "Precisión de detección" },
  { value: "12h",   label: "Ahorradas por cierre" },
  { value: "RD$0",  label: "En multas prevenidas" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* ── Backgrounds ─────────────────────────────────── */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900/60 to-dark-900" />

      {/* Radial orbs */}
      <div className="orb w-[700px] h-[700px] top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600/[0.12]" />
      <div className="orb w-[500px] h-[500px] top-1/4 right-0 bg-purple-600/[0.08]" />
      <div className="orb w-[400px] h-[400px] bottom-0 left-0 bg-cyan-500/[0.07]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: text ───────────────────────────────── */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-brand text-sm font-semibold text-brand-300 mb-8"
            >
              <Zap size={13} className="text-brand-400" />
              Plataforma líder para empresas dominicanas
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-[4.25rem] font-black leading-[1.08] tracking-tight mb-7"
            >
              La inteligencia<br />
              que{" "}
              <span className="text-gradient">audita</span>{" "}
              tu empresa
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg"
            >
              Detecta errores fiscales, laborales y documentales{" "}
              <strong className="text-slate-200 font-semibold">antes de que costen dinero</strong>.
              Facturas, retenciones, nómina y contratos auditados con reglas
              oficiales de la DGII, TSS y Código de Trabajo dominicano.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-14"
            >
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-base transition-all duration-300 shadow-[0_4px_30px_rgba(99,102,241,0.4)] hover:shadow-[0_4px_50px_rgba(99,102,241,0.65)] hover:scale-[1.02] overflow-hidden"
              >
                <span className="relative z-10">Comenzar gratis</span>
                <ArrowRight size={17} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass-medium text-slate-200 font-semibold text-base transition-all duration-300 hover:border-white/20 hover:text-white"
              >
                Ver cómo funciona
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="flex flex-wrap gap-8"
            >
              {stats.map((s, i) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-2xl font-black text-white tracking-tight">{s.value}</span>
                  <span className="text-xs text-slate-500 font-medium">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Dashboard preview ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-600/20 to-purple-600/10 blur-2xl scale-110" />

            {/* Main dashboard card */}
            <div className="relative glass-medium rounded-3xl p-6 border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_32px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(99,102,241,0.12)]">

              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Panel ejecutivo</div>
                  <div className="text-xl font-black text-white">RiskScore™</div>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
              </div>

              {/* Risk bars */}
              <div className="space-y-4 mb-6">
                {riskBars.map((r, i) => (
                  <div key={r.label}>
                    <div className="flex justify-between text-xs font-medium mb-2">
                      <span className="text-slate-400">{r.label}</span>
                      <span className="text-white font-bold">{r.pct}%</span>
                    </div>
                    <div className={`h-2.5 rounded-full ${r.bg}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${r.pct}%` }}
                        transition={{ duration: 1.2, delay: 0.8 + i * 0.15, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${r.color} shadow-[0_0_8px_currentColor]`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/6 mb-4" />

              {/* Module grid */}
              <div className="grid grid-cols-4 gap-2.5">
                {modules.map(({ Icon, label, count, color, bg }) => (
                  <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] transition-colors">
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                      <Icon size={15} className={color} />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{label}</span>
                    <span className="text-base font-black text-white">{count}</span>
                  </div>
                ))}
              </div>

              {/* Status bar */}
              <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                <CheckCircle size={13} className="text-emerald-400 shrink-0" />
                <span className="text-[11px] font-semibold text-emerald-400">Nómina Revisada</span>
                <span className="text-[11px] text-slate-500 ml-auto">ISR calculado correctamente</span>
              </div>
            </div>

            {/* ── Floating alert cards ─────────────────── */}
            {alerts.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: a.delay, ease: "easeOut" }}
                  style={{
                    animation: `float ${a.dur}s ease-in-out infinite`,
                    animationDelay: a.dly,
                    animationFillMode: "both",
                  }}
                  className={`absolute ${a.pos} glass-dark rounded-2xl p-3.5 border ${a.border} shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-w-[160px] z-10`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon size={13} className={a.iconColor} />
                    <span className="text-[11px] font-bold text-white">{a.title}</span>
                  </div>
                  <div className={`text-sm font-black ${a.titleColor} mb-0.5`}>{a.value}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{a.detail}</div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
    </section>
  );
}
