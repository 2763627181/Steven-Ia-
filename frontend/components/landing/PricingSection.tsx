"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "RD$2,990",
    period: "/mes",
    description: "Para MIPYMES y negocios que están comenzando a digitalizarse.",
    features: [
      "Hasta 200 facturas/mes",
      "Auditoría NCF básica",
      "Nómina hasta 10 empleados",
      "Alertas por correo",
      "Reportes mensuales",
    ],
    notIncluded: ["IA ejecutiva", "Legal AI", "API access"],
    cta: "Comenzar gratis",
    href: "/register?plan=basico",
    featured: false,
  },
  {
    name: "Profesional",
    price: "RD$7,990",
    period: "/mes",
    description:
      "Para empresas medianas con procesos de contabilidad, RRHH y legal activos.",
    features: [
      "Facturas ilimitadas",
      "Auditoría fiscal completa",
      "Retenciones ISR/ITBIS",
      "Nómina ilimitada + TSS",
      "Expedientes de empleados",
      "LexGuard (contratos base)",
      "Executive Brain IA",
      "Panel de riesgo ejecutivo",
      "Soporte prioritario",
    ],
    notIncluded: ["Multi-empresa", "API access"],
    cta: "Comenzar prueba 14 días",
    href: "/register?plan=profesional",
    featured: true,
  },
  {
    name: "Contadores",
    price: "RD$14,990",
    period: "/mes",
    description:
      "Para firmas contables que gestionan múltiples clientes empresariales.",
    features: [
      "Múltiples empresas",
      "Panel por cliente",
      "Todo el plan Profesional",
      "Reportes comparativos",
      "Calendario de obligaciones",
      "Marca personalizada",
      "Soporte dedicado",
    ],
    notIncluded: [],
    cta: "Hablar con ventas",
    href: "/register?plan=contadores",
    featured: false,
  },
];

export default function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="precios" ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-900/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-brand text-sm font-medium text-brand-300 mb-6">
            Precios transparentes
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
            Invierte menos de lo que{" "}
            <span className="text-gradient">una multa costaría</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            14 días gratis en todos los planes. Sin tarjeta de crédito requerida.
            Cancela cuando quieras.
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-7 transition-all duration-300 ${
                plan.featured
                  ? "glass-brand border border-brand-500/40 shadow-[0_0_60px_rgba(99,102,241,0.2)] scale-[1.02]"
                  : "glass border border-white/6 hover:border-white/12"
              }`}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-600 text-xs font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                  <Zap size={12} />
                  Más popular
                </div>
              )}

              {/* Plan name */}
              <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {plan.name}
              </div>

              {/* Price */}
              <div className="flex items-end gap-1 mb-3">
                <span
                  className={`text-4xl font-black ${plan.featured ? "text-gradient" : "text-white"}`}
                >
                  {plan.price}
                </span>
                <span className="text-slate-500 text-sm mb-1">{plan.period}</span>
              </div>

              <p className="text-sm text-slate-400 mb-7 leading-relaxed">
                {plan.description}
              </p>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-300 mb-7 ${
                  plan.featured
                    ? "bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]"
                    : "glass hover:bg-white/5 text-slate-200 border border-white/10 hover:border-white/20"
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={15}
                      className="text-emerald-400 mt-0.5 shrink-0"
                    />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm opacity-40"
                  >
                    <div className="w-[15px] h-[15px] mt-0.5 shrink-0 flex items-center justify-center">
                      <div className="w-3 h-px bg-slate-600" />
                    </div>
                    <span className="text-slate-500 line-through">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Enterprise note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <p className="text-slate-500 text-sm">
            ¿Empresa grande o necesitas integración personalizada?{" "}
            <a
              href="mailto:ventas@steven-ia.do"
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Hablemos del plan Enterprise →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
