"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Auth will be wired to Supabase once env vars are set
    await new Promise((r) => setTimeout(r, 1200));
    setError("Credenciales incorrectas. Por favor verifica tu correo y contraseña.");
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Card */}
      <div className="glass rounded-3xl p-8 md:p-10 border border-white/8 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-2">
            Bienvenido de vuelta
          </h1>
          <p className="text-slate-400 text-sm">
            Accede a tu plataforma de cumplimiento empresarial.
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                className="w-full bg-white/4 border border-white/8 hover:border-white/14 focus:border-brand-500/60 text-white placeholder:text-slate-600 text-sm rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Contraseña
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verificando...
              </span>
            ) : (
              <>
                Iniciar sesión
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/6" />
          <span className="text-xs text-slate-600">o</span>
          <div className="flex-1 h-px bg-white/6" />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-slate-500">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
          >
            Crear cuenta gratis
          </Link>
        </p>
      </div>

      {/* Trust note */}
      <p className="text-center text-xs text-slate-600 mt-6">
        Datos protegidos bajo Ley 172-13 de Protección de Datos Personales de RD.
      </p>
    </motion.div>
  );
}
