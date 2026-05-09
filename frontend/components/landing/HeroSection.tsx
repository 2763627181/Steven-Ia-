"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
} from "lucide-react";

const floatingCards = [
  {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
    title: "Riesgo Fiscal",
    value: "Alto",
    detail: "18 facturas sin NCF validado",
    delay: 0,
  },
  {
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    title: "Nómina",
    value: "Revisada",
    detail: "ISR calculado correctamente",
    delay: 0.15,
  },
  {
    icon: Shield,
    color: "text-brand-400",
    bg: "bg-brand-400/10 border-brand-400/20",
    title: "Protección",
    value: "Activa",
    detail: "Ley 172-13 en cumplimiento",
    delay: 0.3,
  },
];

const stats = [
  { label: "Errores detectados", value: "94%", suffix: "precisión" },
  { label: "Horas ahorradas", value: "12h", suffix: "por cierre" },
  { label: "Multas prevenidas", value: "RD$0", suffix: "en riesgos" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background layers */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-transparent to-dark-900" />

      {/* Radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-purple-600/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/6 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-brand text-sm font-medium text-brand-300 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Plataforma líder para empresas dominicanas
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6"
          >
            La inteligencia que{" "}
            <span className="text-gradient">audita</span> tu empresa
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-xl"
          >
            Detecta errores fiscales, laborales y documentales{" "}
            <strong className="text-slate-200">antes de que costen dinero</strong>.
            Facturas, retenciones, nómina y contratos auditados con reglas
            oficiales de la DGII, TSS y Código de Trabajo dominicano.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-14"
          >
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_50px_rgba(99,102,241,0.55)] overflow-hidden"
            >
              <span className="relative z-10">Comenzar gratis</span>
              <ArrowRight
                size={18}
                className="relative z-10 group-hover:translate-x-1 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl glass hover:bg-white/5 text-slate-200 font-semibold text-base transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              Ver cómo funciona
            </a>
          </motion.div>

          {/* Mini stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-6"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-2xl font-black text-white">{s.value}</span>
                <span className="text-xs text-slate-500">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: animated dashboard preview */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          {/* Main card */}
          <div className="relative glass rounded-3xl p-6 border border-white/8 shadow-[0_0_80px_rgba(99,102,241,0.15)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs text-slate-500 mb-1">Panel ejecutivo</div>
                <div className="text-lg font-bold text-white">RiskScore™</div>
              </div>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
            </div>

            {/* Risk bars */}
            <div className="space-y-4 mb-6">
              {[
                { label: "Riesgo Fiscal", pct: 72, color: "bg-red-500" },
                { label: "Riesgo Laboral", pct: 45, color: "bg-amber-500" },
                { label: "Riesgo Legal", pct: 28, color: "bg-emerald-500" },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>{r.label}</span>
                    <span>{r.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${r.pct}%` }}
                      transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${r.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Module icons */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { Icon: FileText, label: "Facturas", count: 18 },
                { Icon: TrendingUp, label: "Retenc.", count: 4 },
                { Icon: Users, label: "Nómina", count: 3 },
                { Icon: Shield, label: "Legal", count: 2 },
              ].map(({ Icon, label, count }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/3 border border-white/5"
                >
                  <Icon size={16} className="text-brand-400" />
                  <span className="text-[10px] text-slate-500">{label}</span>
                  <span className="text-sm font-bold text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating alert cards */}
          {floatingCards.map((card, i) => {
            const Icon = card.icon;
            const positions = [
              "-top-6 -right-8",
              "-bottom-6 -left-8",
              "top-1/2 -right-14 -translate-y-1/2",
            ];
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + card.delay }}
                style={{
                  animation: `float ${6 + i * 1.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
                className={`absolute ${positions[i]} glass rounded-2xl p-3 border ${card.bg} shadow-card min-w-[170px]`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={14} className={card.color} />
                  <span className="text-xs font-semibold text-white">
                    {card.title}
                  </span>
                </div>
                <div className={`text-sm font-bold ${card.color} mb-0.5`}>
                  {card.value}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {card.detail}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
    </section>
  );
}
