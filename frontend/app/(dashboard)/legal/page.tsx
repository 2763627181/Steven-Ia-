"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Plus, AlertTriangle, CheckCircle, Clock, Eye, FileText, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge, RiskBadge } from "@/components/ui/Badge";

type Contrato = {
  id: string;
  titulo: string;
  tipo: string;
  partes: string;
  fecha: string;
  vencimiento?: string;
  estado: "Vigente" | "Borrador" | "Pendiente firma" | "Vencido" | "Revisión legal";
  riesgo: "Bajo" | "Medio" | "Alto" | "Crítico";
  clausulasFaltantes: string[];
  observacion?: string;
};

const contratos: Contrato[] = [
  { id: "1", titulo: "Contrato Laboral — María García", tipo: "Laboral Indefinido", partes: "Mi Empresa SRL ↔ María García Díaz", fecha: "2020-03-15", estado: "Vigente", riesgo: "Bajo", clausulasFaltantes: [] },
  { id: "2", titulo: "Contrato de Servicios — Tech Solutions", tipo: "Servicios Profesionales", partes: "Mi Empresa SRL ↔ Tech Solutions SA", fecha: "2026-01-10", vencimiento: "2026-12-31", estado: "Vigente", riesgo: "Medio", clausulasFaltantes: ["Cláusula de protección de datos personales", "Cláusula de confidencialidad"], observacion: "El contrato carece de cláusulas obligatorias bajo la Ley 172-13 para manejo de datos de terceros." },
  { id: "3", titulo: "Contrato Laboral — Juan Pérez", tipo: "Laboral Determinado", partes: "Mi Empresa SRL ↔ Juan Pérez Rodríguez", fecha: "2024-01-15", vencimiento: "2026-06-15", estado: "Pendiente firma", riesgo: "Alto", clausulasFaltantes: ["Firma del empleado", "Anexo de funciones"], observacion: "Contrato laboral vigente sin firma del empleado. Vence en 30 días. Sin firma, no hay validez jurídica." },
  { id: "4", titulo: "Acuerdo de Confidencialidad — Proveedores", tipo: "NDA", partes: "Mi Empresa SRL ↔ Múltiples proveedores", fecha: "2023-06-01", vencimiento: "2025-06-01", estado: "Vencido", riesgo: "Crítico", clausulasFaltantes: ["Renovación del acuerdo"], observacion: "El NDA venció hace 11 meses. Los proveedores con acceso a información sensible no están actualmente bajo acuerdo de confidencialidad vigente." },
  { id: "5", titulo: "Contrato de Arrendamiento — Oficina principal", tipo: "Arrendamiento", partes: "Mi Empresa SRL ↔ Alquileres del Este SRL", fecha: "2024-03-01", vencimiento: "2026-03-01", estado: "Revisión legal", riesgo: "Medio", clausulasFaltantes: ["Cláusula de reajuste de precio"], observacion: "El contrato fue renovado sin actualizar la cláusula de reajuste inflacionario. Revisión sugerida." },
  { id: "6", titulo: "Política de Protección de Datos", tipo: "Política interna", partes: "Mi Empresa SRL — Documento interno", fecha: "2023-01-10", estado: "Borrador", riesgo: "Alto", clausulasFaltantes: ["Aprobación gerencia", "Publicación interna", "Firma empleados"], observacion: "Política de datos en borrador desde 2023. No ha sido aprobada ni comunicada formalmente. Incumplimiento potencial Ley 172-13." },
  { id: "7", titulo: "Contrato Laboral — Patricia Herrera", tipo: "Laboral Determinado", partes: "Mi Empresa SRL ↔ Patricia Herrera Nova", fecha: "2025-02-01", vencimiento: "2026-08-01", estado: "Pendiente firma", riesgo: "Alto", clausulasFaltantes: ["Firma del empleado"], observacion: "Empleada activa en nómina sin contrato firmado." },
];

const estadoConfig = {
  Vigente: { variant: "emerald" as const, icon: CheckCircle },
  Borrador: { variant: "slate" as const, icon: FileText },
  "Pendiente firma": { variant: "amber" as const, icon: Clock },
  Vencido: { variant: "red" as const, icon: AlertTriangle },
  "Revisión legal": { variant: "purple" as const, icon: Eye },
};

const tipoColors: Record<string, string> = {
  "Laboral Indefinido": "from-emerald-500 to-teal-600",
  "Laboral Determinado": "from-amber-500 to-orange-600",
  "Servicios Profesionales": "from-brand-600 to-purple-600",
  "NDA": "from-rose-500 to-red-600",
  "Arrendamiento": "from-sky-500 to-cyan-600",
  "Política interna": "from-violet-500 to-purple-700",
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function LexGuardPage() {
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [selected, setSelected] = useState<Contrato | null>(null);

  const filtered = contratos.filter((c) => {
    const matchSearch = c.titulo.toLowerCase().includes(search.toLowerCase()) || c.partes.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === "Todos" || c.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const criticos = contratos.filter((c) => c.riesgo === "Crítico" || c.estado === "Vencido").length;
  const pendientes = contratos.filter((c) => c.estado === "Pendiente firma" || c.estado === "Borrador").length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 max-w-7xl mx-auto">
      <motion.div variants={item}>
        <PageHeader
          icon={Scale}
          iconColor="from-violet-500 to-purple-700"
          title="LexGuard RD — Contratos y Legal"
          subtitle="Gestión de contratos, políticas y documentos legales"
          actions={
            <>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/8 text-slate-300 text-xs font-medium transition-all hover:border-white/16">
                <Eye size={14} /> Plantillas
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all">
                <Plus size={14} /> Generar contrato IA
              </button>
            </>
          }
        />
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Documentos totales", val: String(contratos.length), sub: "Contratos y políticas", icon: FileText, color: "from-violet-500 to-purple-700" },
          { label: "Críticos / Vencidos", val: String(criticos), sub: "Acción urgente", icon: AlertTriangle, color: "from-red-600 to-rose-600", alert: true },
          { label: "Pendiente firma / borrador", val: String(pendientes), sub: "Sin fuerza jurídica", icon: Clock, color: "from-amber-500 to-orange-600", alert: true },
          { label: "Vigentes", val: String(contratos.filter(c => c.estado === "Vigente").length), sub: "Sin observaciones críticas", icon: CheckCircle, color: "from-emerald-500 to-teal-600" },
        ].map((s) => (
          <div key={s.label} className={`glass rounded-2xl p-5 border transition-all card-hover ${s.alert ? "border-red-500/20" : "border-white/6 hover:border-white/12"}`}>
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} mb-3`}>
              <s.icon size={17} className="text-white" />
            </div>
            <div className="text-2xl font-black text-white mb-0.5">{s.val}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
            <div className="text-[10px] text-slate-600 mt-1">{s.sub}</div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="glass rounded-2xl border border-white/6 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-white/6">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar contrato o partes..."
              className="w-full bg-white/4 border border-white/8 focus:border-violet-500/50 text-white placeholder:text-slate-600 text-xs rounded-xl pl-8 pr-3 py-2 outline-none transition-all" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {["Todos", "Vigente", "Pendiente firma", "Vencido", "Borrador", "Revisión legal"].map((e) => (
              <button key={e} onClick={() => setFilterEstado(e)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${filterEstado === e ? "bg-violet-600 text-white" : "glass text-slate-400 hover:text-white border border-white/8"}`}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-white/4">
          {filtered.map((c) => {
            const cfg = estadoConfig[c.estado];
            const Icon = cfg.icon;
            const gradColor = tipoColors[c.tipo] || "from-slate-600 to-slate-700";
            return (
              <div key={c.id} className="group p-4 hover:bg-white/2 transition-colors cursor-pointer" onClick={() => setSelected(c === selected ? null : c)}>
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradColor} flex items-center justify-center shrink-0`}>
                    <FileText size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-white">{c.titulo}</span>
                      <Badge variant={cfg.variant}><Icon size={10} />{c.estado}</Badge>
                      <RiskBadge level={c.riesgo} />
                    </div>
                    <div className="text-xs text-slate-500">{c.partes}</div>
                    <div className="flex gap-4 mt-1 text-[10px] text-slate-600">
                      <span>Tipo: {c.tipo}</span>
                      <span>Fecha: {c.fecha}</span>
                      {c.vencimiento && <span className={c.estado === "Vencido" ? "text-red-400 font-semibold" : ""}>Vence: {c.vencimiento}</span>}
                    </div>
                  </div>
                  {c.clausulasFaltantes.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25 shrink-0">
                      {c.clausulasFaltantes.length} pendiente{c.clausulasFaltantes.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {selected === c && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-white/8 space-y-3">
                    {c.observacion && (
                      <div className="flex gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-300 leading-relaxed">{c.observacion}</p>
                      </div>
                    )}
                    {c.clausulasFaltantes.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Cláusulas / acciones pendientes</div>
                        <div className="space-y-1.5">
                          {c.clausulasFaltantes.map((cl) => (
                            <div key={cl} className="flex items-center gap-2 text-xs text-slate-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              {cl}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button className="text-[11px] font-semibold px-3 py-2 rounded-lg glass border border-white/8 text-slate-300 hover:text-white hover:border-violet-500/40 transition-all">
                        Editar contrato
                      </button>
                      <button className="text-[11px] font-semibold px-3 py-2 rounded-lg glass border border-white/8 text-slate-300 hover:text-white transition-all">
                        Enviar a revisión legal
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
