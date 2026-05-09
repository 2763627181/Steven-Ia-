"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Upload, Cpu, Bell, CheckCircle2 } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Sube tus documentos",
    description:
      "Facturas en PDF, XML o imagen. Nóminas en Excel. Contratos en Word. El sistema acepta cualquier formato y lo organiza automáticamente.",
    color: "from-brand-500 to-purple-600",
  },
  {
    step: "02",
    icon: Cpu,
    title: "El motor analiza todo",
    description:
      "Extrae datos, valida NCF, calcula ISR y TSS con tablas 2026 actualizadas, cruza pagos contra retenciones y detecta inconsistencias.",
    color: "from-purple-500 to-pink-600",
  },
  {
    step: "03",
    icon: Bell,
    title: "Recibes alertas claras",
    description:
      "Cada alerta explica el porqué, el riesgo y la acción recomendada. Clasificadas por nivel: informativa, media, alta o crítica.",
    color: "from-amber-500 to-orange-600",
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Tú apruebas, el sistema registra",
    description:
      "Las decisiones críticas requieren validación humana. Todo queda trazable: quién aprobó, cuándo y qué cambio fue realizado.",
    color: "from-emerald-500 to-teal-600",
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="como-funciona"
      ref={ref}
      className="py-24 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-brand text-sm font-medium text-brand-300 mb-6">
            Proceso simple
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
            Así funciona{" "}
            <span className="text-gradient">Steven IA</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Diseñado para contadores, RRHH y gerentes. Sin curvas de aprendizaje.
            Los resultados aparecen en minutos.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent hidden lg:block pointer-events-none" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative group"
              >
                {/* Step number */}
                <div className="relative mb-5">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 text-xs font-black text-slate-600 bg-dark-800 px-1.5 py-0.5 rounded-full border border-white/5">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-slate-500 text-sm">
            La IA{" "}
            <strong className="text-slate-300">explica y recomienda</strong>.
            El motor de reglas{" "}
            <strong className="text-slate-300">calcula y valida</strong>. Tú{" "}
            <strong className="text-slate-300">decides y apruebas</strong>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
