"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, User, Building2, ArrowRight, CheckCircle, AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

const planLabels: Record<string, string> = {
  basico: "Básico",
  profesional: "Profesional",
  contadores: "Contadores",
};

export default function RegisterForm({ plan }: { plan?: string }) {
  const [step, setStep]             = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState("");

  const [form, setForm] = useState({ name: "", email: "", company: "", password: "" });

  function update(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          company: form.company,
          plan: plan || "basico",
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-10 border border-emerald-500/20 text-center shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={28} className="text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-black text-white mb-3">¡Cuenta creada!</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Revisa tu correo <strong className="text-white">{form.email}</strong> para confirmar tu
            cuenta y comenzar tu período de prueba de 14 días.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all duration-300"
          >
            Ir al inicio de sesión <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="glass rounded-3xl p-8 md:p-10 border border-white/8 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
        <div className="mb-8">
          {plan && planLabels[plan] && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-brand text-xs font-semibold text-brand-300 mb-4">
              Plan {planLabels[plan]}
            </div>
          )}
          <h1 className="text-2xl font-black text-white mb-2">Crear cuenta gratis</h1>
          <p className="text-slate-400 text-sm">14 días sin tarjeta de crédito. Cancela cuando quieras.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`flex items-center gap-2 text-xs font-semibold transition-all duration-300 ${step >= s ? "text-brand-400" : "text-slate-600"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step > s ? "bg-emerald-500 text-white" : step === s ? "bg-brand-600 text-white" : "bg-white/6 text-slate-500"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              {s === 1 ? "Tus datos" : "Contraseña"}
            </div>
          ))}
          <div className={`flex-1 h-px transition-all duration-500 ${step >= 2 ? "bg-brand-500/40" : "bg-white/6"}`} />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleStep1}
            className="space-y-5"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text" required value={form.name} onChange={update("name")}
                  placeholder="Juan Pérez"
                  className="w-full bg-white/4 border border-white/8 hover:border-white/14 focus:border-brand-500/60 text-white placeholder:text-slate-600 text-sm rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Empresa
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text" required value={form.company} onChange={update("company")}
                  placeholder="Mi Empresa SRL"
                  className="w-full bg-white/4 border border-white/8 hover:border-white/14 focus:border-brand-500/60 text-white placeholder:text-slate-600 text-sm rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email" required value={form.email} onChange={update("email")}
                  placeholder="tu@empresa.com"
                  className="w-full bg-white/4 border border-white/8 hover:border-white/14 focus:border-brand-500/60 text-white placeholder:text-slate-600 text-sm rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] mt-2"
            >
              Continuar
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleStep2}
            className="space-y-5"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Crear contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"} required minLength={8}
                  value={form.password} onChange={update("password")}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full bg-white/4 border border-white/8 hover:border-white/14 focus:border-brand-500/60 text-white placeholder:text-slate-600 text-sm rounded-xl pl-11 pr-12 py-3.5 outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        form.password.length >= i * 2 ? (i <= 2 ? "bg-amber-500" : "bg-emerald-500") : "bg-white/8"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Al crear tu cuenta aceptas nuestros{" "}
              <Link href="#" className="text-brand-400 hover:text-brand-300">Términos de uso</Link>{" "}
              y{" "}
              <Link href="#" className="text-brand-400 hover:text-brand-300">Política de privacidad</Link>.
              Tus datos están protegidos bajo la Ley 172-13.
            </p>

            <div className="flex gap-3">
              <button
                type="button" onClick={() => { setStep(1); setError(""); }}
                className="px-4 py-3.5 rounded-xl glass hover:bg-white/5 text-slate-300 font-semibold text-sm transition-all border border-white/8"
              >
                Atrás
              </button>
              <button
                type="submit" disabled={loading}
                className="group flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </span>
                ) : (
                  <>Crear cuenta <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </motion.form>
        )}

        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 h-px bg-white/6" />
          <p className="text-xs text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              Iniciar sesión
            </Link>
          </p>
          <div className="flex-1 h-px bg-white/6" />
        </div>
      </div>
    </motion.div>
  );
}
