"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileSearch, Upload, AlertTriangle, CheckCircle,
  XCircle, Filter, Search, Eye, Download, RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, RiskBadge } from "@/components/ui/Badge";

type Factura = {
  id: string;
  ncf: string;
  proveedor: string;
  rnc: string;
  fecha: string;
  monto: number;
  itbis: number;
  tipo: string;
  estado: "Validada" | "Pendiente" | "Error" | "Duplicada";
  riesgo: "Bajo" | "Medio" | "Alto" | "Crítico";
  alerta?: string;
};

const facturas: Factura[] = [
  { id: "1", ncf: "B0100000123", proveedor: "Servicios Digitales SRL", rnc: "101-12345-6", fecha: "2026-04-28", monto: 85000, itbis: 15300, tipo: "Crédito Fiscal", estado: "Validada", riesgo: "Bajo" },
  { id: "2", ncf: "B0200000456", proveedor: "Juan Martínez", rnc: "001-0012345-6", fecha: "2026-04-25", monto: 42000, itbis: 7560, tipo: "Consumo", estado: "Error", riesgo: "Alto", alerta: "B02 no permite crédito fiscal ni deducción de ISR. Revisar clasificación del gasto." },
  { id: "3", ncf: "E3100000789", proveedor: "TechPro Solutions SRL", rnc: "101-98765-4", fecha: "2026-04-20", monto: 120000, itbis: 21600, tipo: "e-CF Crédito Fiscal", estado: "Validada", riesgo: "Bajo" },
  { id: "4", ncf: "B0100000321", proveedor: "Materiales Construcción SA", rnc: "101-11111-2", fecha: "2026-04-18", monto: 65000, itbis: 11700, tipo: "Crédito Fiscal", estado: "Duplicada", riesgo: "Crítico", alerta: "NCF duplicado detectado. Esta factura ya fue registrada el 2026-04-10." },
  { id: "5", ncf: "B0100000654", proveedor: "Consultoría Legal RD", rnc: "101-22222-3", fecha: "2026-04-15", monto: 35000, itbis: 6300, tipo: "Crédito Fiscal", estado: "Pendiente", riesgo: "Medio", alerta: "Proveedor persona física. Verificar si aplica retención ISR sobre el servicio." },
  { id: "6", ncf: "", proveedor: "Suministros del Norte SRL", rnc: "101-33333-4", fecha: "2026-04-12", monto: 18500, itbis: 3330, tipo: "Desconocido", estado: "Error", riesgo: "Crítico", alerta: "Factura sin NCF. No puede ser declarada ni deducida." },
  { id: "7", ncf: "B0100000987", proveedor: "Publicidad & Más SRL", rnc: "101-44444-5", fecha: "2026-04-10", monto: 55000, itbis: 9900, tipo: "Crédito Fiscal", estado: "Validada", riesgo: "Bajo" },
  { id: "8", ncf: "B0200000111", proveedor: "Cafetería El Buen Gusto", rnc: "101-55555-6", fecha: "2026-04-08", monto: 8500, itbis: 0, tipo: "Consumo", estado: "Validada", riesgo: "Bajo" },
  { id: "9", ncf: "B0100000222", proveedor: "Ingeniería Avanzada SRL", rnc: "101-66666-7", fecha: "2026-04-05", monto: 210000, itbis: 37800, tipo: "Crédito Fiscal", estado: "Pendiente", riesgo: "Medio", alerta: "Monto elevado. Se recomienda verificar evidencia del servicio recibido." },
  { id: "10", ncf: "B0100000333", proveedor: "Seguridad Corporativa SA", rnc: "101-77777-8", fecha: "2026-04-01", monto: 48000, itbis: 8640, tipo: "Crédito Fiscal", estado: "Validada", riesgo: "Bajo" },
];

const estadoConfig = {
  Validada: { variant: "emerald" as const, icon: CheckCircle },
  Pendiente: { variant: "amber" as const, icon: AlertTriangle },
  Error: { variant: "red" as const, icon: XCircle },
  Duplicada: { variant: "red" as const, icon: XCircle },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function FiscalGuardPage() {
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterRiesgo, setFilterRiesgo] = useState("Todos");
  const [selected, setSelected] = useState<Factura | null>(null);

  const filtered = facturas.filter((f) => {
    const matchSearch =
      f.proveedor.toLowerCase().includes(search.toLowerCase()) ||
      f.ncf.includes(search) ||
      f.rnc.includes(search);
    const matchEstado = filterEstado === "Todos" || f.estado === filterEstado;
    const matchRiesgo = filterRiesgo === "Todos" || f.riesgo === filterRiesgo;
    return matchSearch && matchEstado && matchRiesgo;
  });

  const errores = facturas.filter((f) => f.estado === "Error" || f.estado === "Duplicada").length;
  const pendientes = facturas.filter((f) => f.estado === "Pendiente").length;
  const montoRiesgo = facturas.filter((f) => f.riesgo === "Alto" || f.riesgo === "Crítico").reduce((a, f) => a + f.monto, 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 max-w-7xl mx-auto">
      <motion.div variants={item}>
        <PageHeader
          icon={FileSearch}
          iconColor="from-brand-600 to-purple-600"
          title="FiscalGuard RD"
          subtitle="Auditoría de facturas, NCF y comprobantes fiscales · Abril 2026"
          actions={
            <>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/8 hover:border-white/16 text-slate-300 text-xs font-medium transition-all">
                <Download size={14} /> Exportar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shadow-[0_0_16px_rgba(99,102,241,0.3)]">
                <Upload size={14} /> Subir facturas
              </button>
            </>
          }
        />
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Facturas este mes" value={String(facturas.length)} sub="Período Abril 2026" icon={FileSearch} iconColor="from-brand-600 to-purple-600" />
        <StatCard label="Con errores / duplicadas" value={String(errores)} sub="Requieren corrección" icon={XCircle} iconColor="from-red-600 to-rose-600" alert />
        <StatCard label="Pendientes de validar" value={String(pendientes)} sub="Revisar antes del cierre" icon={AlertTriangle} iconColor="from-amber-500 to-orange-600" />
        <StatCard label="Monto en riesgo" value={`RD$${(montoRiesgo / 1000).toFixed(0)}K`} sub="Facturas Alto / Crítico" icon={AlertTriangle} iconColor="from-red-600 to-rose-700" alert />
      </motion.div>

      {/* Table card */}
      <motion.div variants={item} className="glass rounded-2xl border border-white/6 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-white/6">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar proveedor, NCF, RNC..."
              className="w-full bg-white/4 border border-white/8 focus:border-brand-500/50 text-white placeholder:text-slate-600 text-xs rounded-xl pl-8 pr-3 py-2 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} className="text-slate-500" />
            {["Todos", "Validada", "Pendiente", "Error", "Duplicada"].map((e) => (
              <button
                key={e}
                onClick={() => setFilterEstado(e)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${filterEstado === e ? "bg-brand-600 text-white" : "glass text-slate-400 hover:text-white border border-white/8"}`}
              >
                {e}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {["Todos", "Alto", "Crítico"].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRiesgo(r)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${filterRiesgo === r ? "bg-red-600 text-white" : "glass text-slate-400 hover:text-white border border-white/8"}`}
              >
                {r === "Todos" ? "Riesgo: Todos" : r}
              </button>
            ))}
          </div>
          <button className="ml-auto text-slate-500 hover:text-white transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["NCF", "Proveedor / RNC", "Fecha", "Monto", "ITBIS", "Tipo", "Estado", "Riesgo", ""].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {filtered.map((f) => {
                const cfg = estadoConfig[f.estado];
                const Icon = cfg.icon;
                return (
                  <tr key={f.id} className="hover:bg-white/3 transition-colors group">
                    <td className="px-4 py-3 font-mono text-xs text-slate-300 whitespace-nowrap">
                      {f.ncf || <span className="text-red-400 italic">Sin NCF</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold text-white whitespace-nowrap">{f.proveedor}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{f.rnc}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{f.fecha}</td>
                    <td className="px-4 py-3 text-xs font-bold text-white whitespace-nowrap">
                      RD${f.monto.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {f.itbis > 0 ? `RD${f.itbis.toLocaleString()}` : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{f.tipo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={cfg.variant}>
                        <Icon size={10} />
                        {f.estado}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <RiskBadge level={f.riesgo} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(f === selected ? null : f)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/8 text-slate-400 hover:text-white transition-all"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">No se encontraron facturas con esos filtros.</div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-600">
          <span>{filtered.length} de {facturas.length} facturas</span>
          <span>Total: RD${filtered.reduce((a, f) => a + f.monto, 0).toLocaleString()}</span>
        </div>
      </motion.div>

      {/* Detail panel */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass rounded-2xl p-5 border ${selected.riesgo === "Crítico" || selected.riesgo === "Alto" ? "border-red-500/25" : "border-amber-500/20"}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Análisis de factura</div>
              <div className="text-base font-bold text-white">{selected.proveedor}</div>
              <div className="font-mono text-xs text-slate-400">{selected.ncf || "Sin NCF"}</div>
            </div>
            <RiskBadge level={selected.riesgo} />
          </div>
          {selected.alerta ? (
            <div className="flex gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-red-300 mb-1">Alerta detectada por el motor fiscal</div>
                <p className="text-xs text-slate-400 leading-relaxed">{selected.alerta}</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300">Factura validada correctamente. Sin observaciones del motor fiscal.</p>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/6">
            <div><div className="text-[10px] text-slate-500 mb-1">Monto</div><div className="text-sm font-bold text-white">RD${selected.monto.toLocaleString()}</div></div>
            <div><div className="text-[10px] text-slate-500 mb-1">ITBIS</div><div className="text-sm font-bold text-white">{selected.itbis > 0 ? `RD$${selected.itbis.toLocaleString()}` : "—"}</div></div>
            <div><div className="text-[10px] text-slate-500 mb-1">Tipo</div><div className="text-sm font-bold text-white">{selected.tipo}</div></div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
