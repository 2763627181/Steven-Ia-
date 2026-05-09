"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FileSearch,
  Receipt,
  Users,
  FolderOpen,
  Scale,
  Lock,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

const modules = [
  {
    icon: FileSearch,
    name: "FiscalGuard RD",
    tag: "Facturas & NCF",
    description:
      "Valida facturas electrónicas, detecta NCF inválidos, identifica ITBIS mal calculado y duplicados. Clasifica comprobantes fiscales según las normas DGII.",
    color: "from-brand-600 to-purple-600",
    glow: "rgba(99,102,241,0.3)",
    alerts: ["NCF inválido", "Duplicado", "ITBIS error"],
  },
  {
    icon: Receipt,
    name: "RetencioNet",
    tag: "ISR & ITBIS",
    description:
      "Determina si un pago requiere retención, sugiere la tasa correcta y diferencia entre persona física, jurídica, honorarios, alquileres y dividendos.",
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.3)",
    alerts: ["Retención faltante", "Tasa incorrecta", "Sin constancia"],
  },
  {
    icon: Users,
    name: "NóminaGuard RD",
    tag: "Nómina & TSS",
    description:
      "Calcula ISR asalariados con la escala actualizada 2026, aplica topes TSS vigentes, proyecta prestaciones y detecta diferencias contra SUIR.",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.3)",
    alerts: ["Escala ISR vieja", "Tope TSS errado", "Sin contrato"],
  },
  {
    icon: FolderOpen,
    name: "DocVault",
    tag: "Expedientes",
    description:
      "Centraliza cédulas, contratos, evaluaciones, cartas, licencias y más. Muestra el porcentaje de expediente completo de cada empleado.",
    color: "from-sky-500 to-cyan-600",
    glow: "rgba(6,182,212,0.3)",
    alerts: ["Expediente 72%", "Cédula vencida", "Sin contrato firmado"],
  },
  {
    icon: Scale,
    name: "LexGuard RD",
    tag: "Contratos & Legal",
    description:
      "Genera contratos laborales, acuerdos de confidencialidad, cartas de advertencia y políticas internas. Detecta cláusulas faltantes o riesgosas.",
    color: "from-violet-500 to-purple-700",
    glow: "rgba(139,92,246,0.3)",
    alerts: ["Cláusula faltante", "Sin datos", "Requiere revisión"],
  },
  {
    icon: Lock,
    name: "DataShield",
    tag: "Ley 172-13",
    description:
      "Gestiona consentimientos, roles y permisos. Audita accesos, cifra documentos y cumple con la Ley 172-13 de Protección de Datos Personales.",
    color: "from-rose-500 to-red-600",
    glow: "rgba(244,63,94,0.3)",
    alerts: ["Sin consentimiento", "Acceso no autorizado"],
  },
  {
    icon: LayoutDashboard,
    name: "Executive Brain",
    tag: "Panel IA",
    description:
      "Dashboard ejecutivo con RiskScore™ unificado. Combina motor de reglas fiscales con IA generativa para explicar alertas, redactar reportes y recomendar acciones.",
    color: "from-brand-400 to-cyan-500",
    glow: "rgba(34,211,238,0.3)",
    alerts: ["Reporte listo", "3 alertas críticas", "IA recomienda"],
    featured: true,
  },
];

export default function ModulesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="modulos" ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-900/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-brand text-sm font-medium text-brand-300 mb-6">
            7 módulos especializados
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Una plataforma.{" "}
            <span className="text-gradient">Todo el cumplimiento.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Cada módulo está diseñado con reglas oficiales dominicanas. La IA
            explica, el motor calcula. Sin invenciones.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.name}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group relative glass rounded-2xl p-6 border border-white/6 hover:border-white/12 transition-all duration-300 card-hover cursor-default ${
                  mod.featured
                    ? "md:col-span-2 lg:col-span-1 border-brand-500/20 hover:border-brand-500/40"
                    : ""
                }`}
                style={{
                  boxShadow: `0 0 0 0 ${mod.glow}`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    `0 8px 40px ${mod.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 0 0 transparent";
                }}
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} mb-4 shadow-lg`}
                >
                  <Icon size={22} className="text-white" />
                </div>

                {/* Tag */}
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {mod.tag}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-white mb-3">{mod.name}</h3>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-5">
                  {mod.description}
                </p>

                {/* Sample alerts */}
                <div className="flex flex-wrap gap-2">
                  {mod.alerts.map((alert) => (
                    <span
                      key={alert}
                      className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-slate-400"
                    >
                      {alert}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <ArrowRight
                  size={16}
                  className="absolute bottom-5 right-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-200"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
