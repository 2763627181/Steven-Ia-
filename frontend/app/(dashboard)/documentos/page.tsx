"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen, Upload, AlertTriangle, CheckCircle, Search, Eye, FileText, User } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";

type Documento = { nombre: string; estado: "OK" | "Falta" | "Vencido" };
type Expediente = {
  id: string;
  nombre: string;
  cedula: string;
  cargo: string;
  area: string;
  completitud: number;
  documentos: Documento[];
};

const expedientes: Expediente[] = [
  {
    id: "1", nombre: "María García Díaz", cedula: "001-0012345-6", cargo: "Gerente Financiero", area: "Finanzas", completitud: 95,
    documentos: [
      { nombre: "Cédula de identidad", estado: "OK" }, { nombre: "Contrato laboral firmado", estado: "OK" },
      { nombre: "Carta de ingreso", estado: "OK" }, { nombre: "Formulario TSS (IT-1)", estado: "OK" },
      { nombre: "Autorización tratamiento datos", estado: "OK" }, { nombre: "Evaluación de desempeño", estado: "Falta" },
    ],
  },
  {
    id: "2", nombre: "Carlos Martínez Pérez", cedula: "001-0034567-8", cargo: "Desarrollador Senior", area: "Tecnología", completitud: 88,
    documentos: [
      { nombre: "Cédula de identidad", estado: "OK" }, { nombre: "Contrato laboral firmado", estado: "OK" },
      { nombre: "Carta de ingreso", estado: "OK" }, { nombre: "Formulario TSS (IT-1)", estado: "OK" },
      { nombre: "Autorización tratamiento datos", estado: "Falta" }, { nombre: "Acuerdo de confidencialidad", estado: "Falta" },
    ],
  },
  {
    id: "3", nombre: "Ana López Sánchez", cedula: "001-0056789-1", cargo: "Contadora", area: "Contabilidad", completitud: 72,
    documentos: [
      { nombre: "Cédula de identidad", estado: "Vencido" }, { nombre: "Contrato laboral firmado", estado: "OK" },
      { nombre: "Carta de ingreso", estado: "OK" }, { nombre: "Formulario TSS (IT-1)", estado: "Falta" },
      { nombre: "Autorización tratamiento datos", estado: "Falta" }, { nombre: "Acuerdo de confidencialidad", estado: "Falta" },
    ],
  },
  {
    id: "4", nombre: "Juan Pérez Rodríguez", cedula: "001-0078901-2", cargo: "Vendedor", area: "Ventas", completitud: 45,
    documentos: [
      { nombre: "Cédula de identidad", estado: "OK" }, { nombre: "Contrato laboral firmado", estado: "Falta" },
      { nombre: "Carta de ingreso", estado: "Falta" }, { nombre: "Formulario TSS (IT-1)", estado: "Falta" },
      { nombre: "Autorización tratamiento datos", estado: "Falta" }, { nombre: "Acuerdo de confidencialidad", estado: "Falta" },
    ],
  },
  {
    id: "5", nombre: "Laura Jiménez Cruz", cedula: "001-0090123-4", cargo: "RRHH", area: "RRHH", completitud: 90,
    documentos: [
      { nombre: "Cédula de identidad", estado: "OK" }, { nombre: "Contrato laboral firmado", estado: "OK" },
      { nombre: "Carta de ingreso", estado: "OK" }, { nombre: "Formulario TSS (IT-1)", estado: "OK" },
      { nombre: "Autorización tratamiento datos", estado: "OK" }, { nombre: "Acuerdo de confidencialidad", estado: "Falta" },
    ],
  },
  {
    id: "6", nombre: "Roberto Santos Melo", cedula: "001-0112345-5", cargo: "Chofer", area: "Operaciones", completitud: 65,
    documentos: [
      { nombre: "Cédula de identidad", estado: "OK" }, { nombre: "Contrato laboral firmado", estado: "OK" },
      { nombre: "Carta de ingreso", estado: "Falta" }, { nombre: "Formulario TSS (IT-1)", estado: "OK" },
      { nombre: "Autorización tratamiento datos", estado: "Falta" }, { nombre: "Licencia de conducir", estado: "Vencido" },
    ],
  },
];

function ProgressBar({ value }: { value: number }) {
  const color = value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden w-full">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.6, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`} />
    </div>
  );
}

const docEstado = {
  OK: { variant: "emerald" as const, icon: CheckCircle },
  Falta: { variant: "red" as const, icon: AlertTriangle },
  Vencido: { variant: "amber" as const, icon: AlertTriangle },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function DocVaultPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Expediente | null>(null);

  const filtered = expedientes.filter((e) =>
    e.nombre.toLowerCase().includes(search.toLowerCase()) || e.area.toLowerCase().includes(search.toLowerCase())
  );

  const criticos = expedientes.filter((e) => e.completitud < 60).length;
  const completos = expedientes.filter((e) => e.completitud >= 90).length;
  const docsFaltantes = expedientes.flatMap((e) => e.documentos).filter((d) => d.estado !== "OK").length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 max-w-7xl mx-auto">
      <motion.div variants={item}>
        <PageHeader
          icon={FolderOpen}
          iconColor="from-sky-500 to-cyan-600"
          title="DocVault — Expedientes Laborales"
          subtitle="Gestión documental de empleados · Ley 172-13"
          actions={
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all">
              <Upload size={14} /> Subir documento
            </button>
          }
        />
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Empleados totales", value: String(expedientes.length), sub: "Expedientes activos", icon: User, color: "from-sky-500 to-cyan-600" },
          { label: "Documentos faltantes", value: String(docsFaltantes), sub: "Requieren acción", icon: AlertTriangle, color: "from-red-600 to-rose-600", alert: true },
          { label: "Expedientes críticos", value: String(criticos), sub: "Completitud < 60%", icon: FolderOpen, color: "from-amber-500 to-orange-600", alert: criticos > 0 },
          { label: "Expedientes completos", value: String(completos), sub: "≥ 90% completitud", icon: CheckCircle, color: "from-emerald-500 to-teal-600" },
        ].map((s) => (
          <div key={s.label} className={`glass rounded-2xl p-5 border transition-all card-hover ${s.alert ? "border-red-500/20" : "border-white/6 hover:border-white/12"}`}>
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} mb-3`}>
              <s.icon size={17} className="text-white" />
            </div>
            <div className="text-2xl font-black text-white mb-0.5">{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
            {s.sub && <div className="text-[10px] text-slate-600 mt-1">{s.sub}</div>}
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="relative max-w-sm">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar empleado o área..."
          className="w-full bg-white/4 border border-white/8 focus:border-sky-500/50 text-white placeholder:text-slate-600 text-xs rounded-xl pl-8 pr-3 py-2.5 outline-none transition-all" />
      </motion.div>

      {/* Cards grid */}
      <motion.div variants={item} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((exp) => {
          const faltantes = exp.documentos.filter((d) => d.estado !== "OK").length;
          const borderColor = exp.completitud >= 80 ? "border-white/6" : exp.completitud >= 60 ? "border-amber-500/20" : "border-red-500/25";
          return (
            <div key={exp.id}
              className={`glass rounded-2xl p-5 border ${borderColor} hover:border-opacity-60 transition-all cursor-pointer card-hover`}
              onClick={() => setSelected(exp === selected ? null : exp)}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/25 to-cyan-600/25 flex items-center justify-center text-sm font-bold text-sky-300 shrink-0">
                  {exp.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{exp.nombre}</div>
                  <div className="text-[11px] text-slate-500 truncate">{exp.cargo} · {exp.area}</div>
                </div>
                {faltantes > 0 && (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/25 shrink-0">
                    {faltantes} falt.
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-500">Completitud</span>
                <span className={`text-sm font-black ${exp.completitud >= 80 ? "text-emerald-400" : exp.completitud >= 60 ? "text-amber-400" : "text-red-400"}`}>
                  {exp.completitud}%
                </span>
              </div>
              <ProgressBar value={exp.completitud} />

              {selected === exp && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-white/8 space-y-2">
                  {exp.documentos.map((doc) => {
                    const cfg = docEstado[doc.estado];
                    const Icon = cfg.icon;
                    return (
                      <div key={doc.nombre} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <FileText size={12} className="text-slate-500 shrink-0" />
                          {doc.nombre}
                        </div>
                        <Badge variant={cfg.variant}><Icon size={10} />{doc.estado}</Badge>
                      </div>
                    );
                  })}
                  <button className="mt-3 w-full text-[11px] font-semibold py-2 rounded-xl glass border border-white/8 text-slate-300 hover:text-white hover:border-sky-500/40 transition-all flex items-center justify-center gap-1.5">
                    <Upload size={12} /> Subir documentos faltantes
                  </button>
                </motion.div>
              )}
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
