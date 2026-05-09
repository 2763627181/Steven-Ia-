"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";

export default function CtaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative glass rounded-3xl p-12 md:p-16 text-center border border-brand-500/20 overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-purple-900/20 to-transparent pointer-events-none rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-brand-600/20 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            {/* Icon */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 mb-8 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
            >
              <Shield size={28} className="text-white" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Tu empresa merece operar sin{" "}
              <span className="text-gradient">errores ocultos</span>
            </h2>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Únete a las empresas dominicanas que previenen multas, ordenan su
              nómina y controlan su cumplimiento antes de que el problema llegue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)]"
              >
                Comenzar 14 días gratis
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass hover:bg-white/5 text-slate-200 font-semibold text-base transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                Ya tengo cuenta
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-slate-500">
              <span>✓ Sin tarjeta de crédito</span>
              <span>✓ Cancela cuando quieras</span>
              <span>✓ Datos protegidos bajo Ley 172-13</span>
              <span>✓ Soporte en español</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
