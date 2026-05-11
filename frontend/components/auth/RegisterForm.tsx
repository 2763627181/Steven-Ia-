"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, User, Building2,
  ArrowRight, CheckCircle, AlertCircle, Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

const planLabels: Record<string, string> = {
  basico: "Básico",
  profesional: "Profesional",
  contadores: "Contadores",
};

function PasswordStrength({ password }: { password: string }) {
  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasNum   = /[0-9]/.test(password);
  const hasSpec  = /[^A-Za-z0-9]/.test(password);
  const score    = [len >= 8, hasUpper, hasNum, hasSpec].filter(Boolean).length;
  const labels   = ["Muy débil", "Débil", "Regular", "Fuerte"];
  const colors   = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-emerald-500"];

  if (!password) return null;
  return (
    <div className="mt-2.5">
      <div className="flex gap-1 mb-1.5">
        {[0,1,2,3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : "bg-white/8"}`} />
        ))}
      </div>
      <p className="text-[10px] text-slate-500">{labels[score - 1] ?? "Muy débil"}</p>
    </div>
  );
}

export default function RegisterForm({ plan }: { plan?: string }) {
  const [step, setStep]               = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [done, setDone]               = useState(false);
  const [error, setError]             = useState("");
  const [form, setForm]               = useState({ name: "", email: "", company: "", password: "" });

  const update = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

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
      options: { data: { name: form.name, company: form.company, plan: plan || "basico" } },
    });
    if (authError) { setError(authError.message); setLoading(false); return; }
    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px]"
      >
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-transparent p-px">
            <div className="absolute inset-px rounded-3xl bg-dark-800" />
          </div>
          <div className="relative px-8 py-12 text-center">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={36} className="text-emerald-400" />
            </motion.div>
            <h2 className="text-2xl font-black text-white mb-3 tracking-tight">¡Cuenta creada!</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              Revisa tu correo{" "}
              <strong className="text-white">{form.email}</strong>
              {" "}para confirmar y comenzar tu prueba de 14 días gratis.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-sm transition-all hover:shadow-[0_4px_30px_rgba(99,102,241,0.5)] hover:scale-[1.02]">
              Ir al inicio de sesión <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[440px]"
    >
      <div className="relative rounded-3xl overflow-hidden">
        {/* Gradient border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500/30 via-purple-500/20 to-transparent p-px">
          <div className="absolute inset-px rounded-3xl bg-dark-800" />
        </div>

        <div className="relative px-8 py-10">
          {/* Header */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400">
                <Zap size={11} />
                {plan && planLabels[plan] ? `Plan ${planLabels[plan]}` : "Gratis 14 días"}
              </div>
            </div>
            <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Crear cuenta</h1>
            <p className="text-sm text-slate-500">Sin tarjeta de crédito. Cancela cuando quieras.</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-7">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step > s ? "bg-emerald-500 text-white" : step === s ? "bg-brand-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]" : "bg-white/6 text-slate-500"
                }`}>
                  {step > s ? <CheckCircle size={14} /> : s}
                </div>
                {!step || (
                  <span className={`text-xs font-semibold ${step >= s ? "text-slate-300" : "text-slate-600"}`}>
                    {s === 1 ? "Tus datos" : "Contraseña"}
                  </span>
                )}
              </div>
            ))}
            <div className={`flex-1 h-px transition-all duration-500 ${step >= 2 ? "bg-gradient-to-r from-brand-600 to-purple-600" : "bg-white/8"}`} />
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm mb-5"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" /><span>{error}</span>
            </motion.div>
          )}

          {/* Step 1 */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form key="s1"
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }} onSubmit={handleStep1} className="space-y-4"
              >
                {[
                  { key: "name",    label: "Nombre completo",      icon: User,      placeholder: "Juan Pérez",       type: "text" },
                  { key: "company", label: "Empresa",              icon: Building2, placeholder: "Mi Empresa SRL",  type: "text" },
                  { key: "email",   label: "Correo electrónico",   icon: Mail,      placeholder: "tu@empresa.com",  type: "email" },
                ].map(({ key, label, icon: Icon, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
                    <div className="relative group">
                      <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                      <input
                        type={type} required value={form[key as keyof typeof form]}
                        onChange={update(key as keyof typeof form)} placeholder={placeholder}
                        className="w-full bg-white/[0.04] border border-white/10 hover:border-white/16 focus:border-brand-500/60 text-white placeholder:text-slate-600 text-sm rounded-2xl pl-11 pr-4 py-3.5 outline-none transition-all focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                      />
                    </div>
                  </div>
                ))}

                <button type="submit" className="group w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-sm transition-all duration-300 shadow-[0_4px_24px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_36px_rgba(99,102,241,0.5)] hover:scale-[1.01] mt-2">
                  Continuar
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.form key="s2"
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }} onSubmit={handleStep2} className="space-y-5"
              >
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Crear contraseña</label>
                  <div className="relative group">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"} required minLength={8}
                      value={form.password} onChange={update("password")} placeholder="Mínimo 8 caracteres"
                      className="w-full bg-white/[0.04] border border-white/10 hover:border-white/16 focus:border-brand-500/60 text-white placeholder:text-slate-600 text-sm rounded-2xl pl-11 pr-12 py-3.5 outline-none transition-all focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <PasswordStrength password={form.password} />
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Al registrarte aceptas los{" "}
                  <Link href="#" className="text-brand-400 hover:text-brand-300">Términos de uso</Link>
                  {" "}y{" "}
                  <Link href="#" className="text-brand-400 hover:text-brand-300">Política de privacidad</Link>.
                  Datos protegidos bajo Ley 172-13.
                </p>

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setStep(1); setError(""); }}
                    className="px-5 py-4 rounded-2xl glass border border-white/10 hover:border-white/16 text-slate-400 hover:text-white font-semibold text-sm transition-all">
                    Atrás
                  </button>
                  <button type="submit" disabled={loading}
                    className="group flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-300 shadow-[0_4px_24px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_36px_rgba(99,102,241,0.5)]">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creando...
                      </span>
                    ) : (
                      <> Crear cuenta <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Login link */}
          <div className="flex items-center gap-3 mt-7">
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
      </div>
    </motion.div>
  );
}
