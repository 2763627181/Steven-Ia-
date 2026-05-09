"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  {
    value: "32-23",
    label: "Ley DGII",
    detail: "Facturación electrónica obligatoria desde 2024",
  },
  {
    value: "+50K",
    label: "Empresas afectadas",
    detail: "MIPYMES que deben cumplir antes del vencimiento de prórroga",
  },
  {
    value: "94%",
    label: "Errores evitables",
    detail:
      "De los errores fiscales y laborales ocurren por falta de validación previa",
  },
  {
    value: "RD$0",
    label: "Multas con Steven IA",
    detail: "Detectamos riesgos antes de que se conviertan en sanciones",
  },
];

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-950/30 via-transparent to-brand-950/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/6 text-center group hover:border-brand-500/30 transition-all duration-300 card-hover"
            >
              <div className="text-3xl md:text-4xl font-black text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-white mb-2">
                {stat.label}
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                {stat.detail}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
