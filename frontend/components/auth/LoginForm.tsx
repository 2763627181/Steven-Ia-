"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos."
          : authError.message
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[440px]"
    >
      {/* Card */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Gradient border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500/30 via-purple-500/20 to-transparent p-px">
          <div className="absolute inset-px rounded-3xl bg-dark-800" />
        </div>

        <div className="relative px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400 mb-5">
              <Zap size={11} />
              Steven IA
            </div>
            <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
              Bienvenido de vuelta
            </h1>
            <p className="text-sm text-slate-500">
              Accede a tu plataforma de cumplimiento empresarial.
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm mb-6"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Correo electrónico
              </label>
              <div className="relative group">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@empresa.com"
                  className="w-full bg-white/[0.04] border border-white/10 hover:border-white/16 focus:border-brand-500/60 text-white placeholder:text-slate-600 text-sm rounded-2xl pl-11 pr-4 py-3.5 outline-none transition-all duration-200 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Contraseña
                </label>
                <Link href="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  ¿Olvidaste?
                </Link>
              </div>
              <div className="relative group">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/10 hover:border-white/16 focus:border-brand-500/60 text-white placeholder:text-slate-600 text-sm rounded-2xl pl-11 pr-12 py-3.5 outline-none transition-all duration-200 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                />
                <button
                  type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="group w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-300 shadow-[0_4px_24px_rgba(99,102,241,0.35)] hover:shadow-[0_4px_36px_rgba(99,102,241,0.55)] hover:scale-[1.01] mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-white/6" />
            <span className="text-xs text-slate-600 font-medium">¿nuevo por aquí?</span>
            <div className="flex-1 h-px bg-white/6" />
          </div>

          {/* Register link */}
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl glass border border-white/8 hover:border-brand-500/30 text-slate-300 hover:text-white text-sm font-semibold transition-all duration-200"
          >
            Crear cuenta gratis — 14 días
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-slate-600 mt-5">
        Protegido bajo Ley 172-13 · República Dominicana
      </p>
    </motion.div>
  );
}
