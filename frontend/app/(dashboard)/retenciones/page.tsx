"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Receipt, AlertTriangle, CheckCircle, Clock, Search, Filter, Plus, Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, RiskBadge } from "@/components/ui/Badge";

type Retencion = {
  id: string;
  proveedor: string;
  rnc: string;
  tipoPersona: "Física" | "Jurídica";
  concepto: string;
  factura: string;
  monto: number;
  tasaSugerida: number;
  montoRetencion: number;
  estado: "Aplicada" | "Pendiente" | "Sin retención" | "Revisión";
  riesgo: "Bajo" | "Medio" | "Alto" | "Crítico";
  alerta?: string;
  fecha: string;
};

const retenciones: Retencion[] = [
  { id: "1", proveedor: "Dr. Carlos Sánchez", rnc: "001-0045678-9", tipoPersona: "Física", concepto: "Honorarios médicos / asesoría", factura: "B0100000201", monto: 45000, tasaSugerida: 10, montoRetencion: 4500, estado: "Aplicada", riesgo: "Bajo", fecha: "2026-04-28" },
  { id: "2", proveedor: "Ing. María López", rnc: "001-0087654-3", tipoPersona: "Física", concepto: "Servicio de ingeniería", factura: "B0100000654", monto: 85000, tasaSugerida: 10, montoRetencion: 8500, estado: "Pendiente", riesgo: "Alto", alerta: "Pago a persona física por servicio profesional. Se detectó que el pago fue liberado completo sin aplicar retención ISR del 10%.", fecha: "2026-04-25" },
  { id: "3", proveedor: "Alquileres del Este SRL", rnc: "101-34567-8", tipoPersona: "Jurídica", concepto: "Alquiler de local comercial", factura: "B0100000789", monto: 35000, tasaSugerida: 10, montoRetencion: 3500, estado: "Aplicada", riesgo: "Bajo", fecha: "2026-04-20" },
  { id: "4", proveedor: "Juan Pérez Consultor", rnc: "001-0011223-4", tipoPersona: "Física", concepto: "Consultoría empresarial", factura: "B0100000321", monto: 60000, tasaSugerida: 10, montoRetencion: 6000, estado: "Sin retención", riesgo: "Crítico", alerta: "Pago realizado sin aplicar ninguna retención. El proveedor es persona física con servicio de consultoría. Riesgo de multa por no retener.", fecha: "2026-04-18" },
  { id: "5", proveedor: "Tech Solutions SA", rnc: "101-99887-6", tipoPersona: "Jurídica", concepto: "Servicios de software", factura: "E3100000456", monto: 120000, tasaSugerida: 0, montoRetencion: 0, estado: "Sin retención", riesgo: "Bajo", fecha: "2026-04-15" },
  { id: "6", proveedor: "Lic. Ana García", rnc: "001-0056789-1", tipoPersona: "Física", concepto: "Servicios legales", factura: "B0100000987", monto: 40000, tasaSugerida: 10, montoRetencion: 4000, estado: "Revisión", riesgo: "Medio", alerta: "El comprobante presentado es de consumo (B02). No es posible confirmar si aplica retención sin validar el tipo de servicio prestado.", fecha: "2026-04-12" },
  { id: "7", proveedor: "Constructora Norte SRL", rnc: "101-44332-1", tipoPersona: "Jurídica", concepto: "Servicios de construcción", factura: "B0100000654", monto: 280000, tasaSugerida: 5, montoRetencion: 14000, estado: "Pendiente", riesgo: "Medio", alerta: "Monto elevado. Confirmar tasa de retención ITBIS aplicable según contrato.", fecha: "2026-04-10" },
  { id: "8", proveedor: "Diseñadora Freelance", rnc: "001-0034512-7", tipoPersona: "Física", concepto: "Diseño gráfico y branding", factura: "B0100000111", monto: 25000, tasaSugerida: 10, montoRetencion: 2500, estado: "Aplicada", riesgo: "Bajo", fecha: "2026-04-08" },
];

const estadoConfig = {
  Aplicada: { variant: "emerald" as const, icon: CheckCircle },
  Pendiente: { variant: "amber" as const, icon: Clock },
  "Sin retención": { variant: "slate" as const, icon: AlertTriangle },
  Revisión: { variant: "purple" as const, icon: Eye },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function RetencionesPage() {
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [selected, setSelected] = useState<Retencion | null>(null);

  const filtered = retenciones.filter((r) => {
    const matchSearch = r.proveedor.toLowerCase().includes(search.toLowerCase()) || r.concepto.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === "Todos" || r.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const pendientes = retenciones.filter((r) => r.estado === "Pendiente" || r.estado === "Sin retención").length;
  const aplicadas = retenciones.filter((r) => r.estado === "Aplicada").length;
  const totalRetenido = retenciones.filter((r) => r.estado === "Aplicada").reduce((a, r) => a + r.montoRetencion, 0);
  const enRiesgo = retenciones.filter((r) => r.riesgo === "Alto" || r.riesgo === "Crítico").length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 max-w-7xl mx-auto">
      <motion.div variants={item}>
        <PageHeader
          icon={Receipt}
          iconColor="from-amber-500 to-orange-600"
          title="Retenciones ISR / ITBIS"
          subtitle="Control de retenciones sobre pagos a proveedores · Abril 2026"
          actions={
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-all">
              <Plus size={14} /> Registrar pago
            </button>
          }
        />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pagos este mes" value={String(retenciones.length)} sub="Total de transacciones" icon={Receipt} iconColor="from-amber-500 to-orange-600" />
        <StatCard label="Sin retención / pendientes" value={String(pendientes)} sub="Requieren acción inmediata" icon={AlertTriangle} iconColor="from-red-600 to-rose-600" alert />
        <StatCard label="Retenciones aplicadas" value={String(aplicadas)} sub="Correctamente procesadas" icon={CheckCircle} iconColor="from-emerald-500 to-teal-600" />
        <StatCard label="Total retenido" value={`RD$${totalRetenido.toLocaleString()}`} sub={`${enRiesgo} pagos en riesgo`} icon={Receipt} iconColor="from-brand-600 to-purple-600" />
      </motion.div>

      {/* Alerta ISR */}
      <motion.div variants={item} className="flex gap-3 p-4 rounded-2xl bg-amber-500/8 border border-amber-500/20">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-300 mb-0.5">Motor de retenciones activo</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Personas físicas por servicios profesionales, honorarios, alquileres y comisiones aplican <strong className="text-white">10% ISR</strong>. Dividendos aplican <strong className="text-white">10%</strong>. Personas jurídicas no aplican retención ISR salvo casos especiales. Tasa ITBIS: <strong className="text-white">18%</strong> según Ley 11-92 y normas DGII vigentes.
          </p>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass rounded-2xl border border-white/6 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-white/6">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar proveedor o concepto..."
              className="w-full bg-white/4 border border-white/8 focus:border-amber-500/50 text-white placeholder:text-slate-600 text-xs rounded-xl pl-8 pr-3 py-2 outline-none transition-all" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} className="text-slate-500" />
            {["Todos", "Pendiente", "Sin retención", "Aplicada", "Revisión"].map((e) => (
              <button key={e} onClick={() => setFilterEstado(e)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${filterEstado === e ? "bg-amber-600 text-white" : "glass text-slate-400 hover:text-white border border-white/8"}`}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Proveedor", "Tipo", "Concepto", "Monto pago", "Tasa ISR", "Retención", "Estado", "Riesgo", ""].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {filtered.map((r) => {
                const cfg = estadoConfig[r.estado];
                const Icon = cfg.icon;
                return (
                  <tr key={r.id} className="hover:bg-white/3 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold text-white whitespace-nowrap">{r.proveedor}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{r.rnc}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={r.tipoPersona === "Física" ? "purple" : "blue"}>{r.tipoPersona}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 max-w-[160px] truncate">{r.concepto}</td>
                    <td className="px-4 py-3 text-xs font-bold text-white whitespace-nowrap">RD${r.monto.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-slate-300 whitespace-nowrap">
                      {r.tasaSugerida > 0 ? `${r.tasaSugerida}%` : <span className="text-slate-600">N/A</span>}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold whitespace-nowrap">
                      {r.montoRetencion > 0
                        ? <span className="text-emerald-400">RD${r.montoRetencion.toLocaleString()}</span>
                        : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={cfg.variant}><Icon size={10} />{r.estado}</Badge>
                    </td>
                    <td className="px-4 py-3"><RiskBadge level={r.riesgo} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(r === selected ? null : r)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/8 text-slate-400 hover:text-white transition-all">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-600">
          <span>{filtered.length} de {retenciones.length} pagos</span>
          <span>Retención pendiente estimada: RD${filtered.filter(r => r.estado === "Pendiente").reduce((a, r) => a + r.montoRetencion, 0).toLocaleString()}</span>
        </div>
      </motion.div>

      {/* Detail */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`glass rounded-2xl p-5 border ${selected.riesgo === "Crítico" || selected.riesgo === "Alto" ? "border-red-500/25" : "border-amber-500/20"}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Análisis de retención</div>
              <div className="text-base font-bold text-white">{selected.proveedor}</div>
              <div className="text-xs text-slate-400">{selected.concepto} · {selected.fecha}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={selected.tipoPersona === "Física" ? "purple" : "blue"}>{selected.tipoPersona}</Badge>
              <RiskBadge level={selected.riesgo} />
            </div>
          </div>
          {selected.alerta ? (
            <div className="flex gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-300 mb-1">Alerta del motor de retenciones</div>
                <p className="text-xs text-slate-400 leading-relaxed">{selected.alerta}</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300">Retención procesada correctamente. No se requiere acción adicional.</p>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/6">
            <div><div className="text-[10px] text-slate-500 mb-1">Monto del pago</div><div className="text-sm font-bold text-white">RD${selected.monto.toLocaleString()}</div></div>
            <div><div className="text-[10px] text-slate-500 mb-1">Tasa ISR</div><div className="text-sm font-bold text-white">{selected.tasaSugerida > 0 ? `${selected.tasaSugerida}%` : "No aplica"}</div></div>
            <div><div className="text-[10px] text-slate-500 mb-1">Retención</div><div className={`text-sm font-bold ${selected.montoRetencion > 0 ? "text-emerald-400" : "text-slate-500"}`}>{selected.montoRetencion > 0 ? `RD$${selected.montoRetencion.toLocaleString()}` : "—"}</div></div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
