import Link from "next/link";
import { Zap, ShieldCheck, FileSearch, Users, Scale } from "lucide-react";

const features = [
  { icon: FileSearch, text: "Validación NCF en tiempo real según DGII" },
  { icon: ShieldCheck, text: "TSS 2026 e ISR calculados con topes exactos" },
  { icon: Users, text: "Expedientes laborales y alertas de cumplimiento" },
  { icon: Scale, text: "Contratos y Ley 172-13 gestionados" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-900 flex">

      {/* ── Left panel — visible only lg+ ─────────────── */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[44%] flex-col relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/80 via-dark-900/60 to-dark-900" />

        {/* Orbs */}
        <div className="orb w-[500px] h-[500px] top-1/4 left-1/2 -translate-x-1/2 bg-brand-600/20" />
        <div className="orb w-[300px] h-[300px] bottom-1/4 left-0 bg-purple-600/15" />

        <div className="relative z-10 flex flex-col justify-between h-full px-12 py-12">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.5)]">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-white font-black text-xl tracking-tight">
              Steven <span className="text-gradient">IA</span>
            </span>
          </Link>

          {/* Main copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-brand text-xs font-semibold text-brand-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Plataforma dominicana de cumplimiento
            </div>
            <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] mb-5 tracking-tight">
              Audita tu empresa<br />
              <span className="text-gradient">sin errores</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
              Facturas, retenciones, nómina y contratos validados con las
              reglas oficiales de la DGII, TSS y Código de Trabajo.
            </p>

            {/* Feature list */}
            <ul className="space-y-4">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-brand-400" />
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom badge */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass border border-white/8">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Datos protegidos bajo{" "}
              <span className="text-white font-semibold">Ley 172-13</span> de la República Dominicana
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────── */}
      <div className="flex-1 flex flex-col relative">
        {/* Subtle background for right side */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900" />
        <div className="orb w-[400px] h-[400px] top-0 right-0 bg-brand-600/[0.06]" />

        {/* Mobile logo */}
        <header className="relative z-10 px-8 py-6 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Steven <span className="text-gradient">IA</span>
            </span>
          </Link>
        </header>

        {/* Form */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
          {children}
        </div>
      </div>

    </div>
  );
}
