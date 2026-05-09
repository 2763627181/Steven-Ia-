"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, AlertTriangle, CheckCircle, DollarSign, Search, Filter, Lock, Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, RiskBadge } from "@/components/ui/Badge";

type Empleado = {
  id: string;
  nombre: string;
  cedula: string;
  cargo: string;
  area: string;
  tipoContrato: "Indefinido" | "Determinado" | "Por obra";
  fechaIngreso: string;
  salarioBruto: number;
  tssSFS: number;      // 3.04%
  tssVDS: number;      // 2.87%
  tssRL: number;       // 0.5%
  totalTSS: number;
  isrMensual: number;
  salarioNeto: number;
  estado: "Activo" | "Inactivo" | "Suspendido";
  alertas: string[];
  expediente: number;  // % completitud
};

function calcTSS(bruto: number) {
  const sfs = Math.min(bruto, 232230) * 0.0304;
  const vds = Math.min(bruto, 464460) * 0.0287;
  const rl = Math.min(bruto, 92892) * 0.005;
  return { sfs: Math.round(sfs), vds: Math.round(vds), rl: Math.round(rl), total: Math.round(sfs + vds + rl) };
}

const empleados: Empleado[] = [
  { id: "1", nombre: "María García Díaz", cedula: "001-0012345-6", cargo: "Gerente Financiero", area: "Finanzas", tipoContrato: "Indefinido", fechaIngreso: "2020-03-15", salarioBruto: 95000, ...(() => { const t = calcTSS(95000); return { tssSFS: t.sfs, tssVDS: t.vds, tssRL: t.rl, totalTSS: t.total }; })(), isrMensual: 8245, salarioNeto: 81255, estado: "Activo", alertas: [], expediente: 95 },
  { id: "2", nombre: "Carlos Martínez Pérez", cedula: "001-0034567-8", cargo: "Desarrollador Senior", area: "Tecnología", tipoContrato: "Indefinido", fechaIngreso: "2021-06-01", salarioBruto: 75000, ...(() => { const t = calcTSS(75000); return { tssSFS: t.sfs, tssVDS: t.vds, tssRL: t.rl, totalTSS: t.total }; })(), isrMensual: 3102, salarioNeto: 66149, estado: "Activo", alertas: [], expediente: 88 },
  { id: "3", nombre: "Ana López Sánchez", cedula: "001-0056789-1", cargo: "Contadora", area: "Contabilidad", tipoContrato: "Indefinido", fechaIngreso: "2019-01-10", salarioBruto: 55000, ...(() => { const t = calcTSS(55000); return { tssSFS: t.sfs, tssVDS: t.vds, tssRL: t.rl, totalTSS: t.total }; })(), isrMensual: 0, salarioNeto: 52250, estado: "Activo", alertas: ["Salario reportado en TSS difiere del registrado en nómina."], expediente: 72 },
  { id: "4", nombre: "Juan Pérez Rodríguez", cedula: "001-0078901-2", cargo: "Vendedor", area: "Ventas", tipoContrato: "Determinado", fechaIngreso: "2024-01-15", salarioBruto: 28000, ...(() => { const t = calcTSS(28000); return { tssSFS: t.sfs, tssVDS: t.vds, tssRL: t.rl, totalTSS: t.total }; })(), isrMensual: 0, salarioNeto: 26649, estado: "Activo", alertas: ["Sin contrato firmado en expediente.", "Contrato determinado próximo a vencer (30 días)."], expediente: 45 },
  { id: "5", nombre: "Laura Jiménez Cruz", cedula: "001-0090123-4", cargo: "Recursos Humanos", area: "RRHH", tipoContrato: "Indefinido", fechaIngreso: "2022-09-05", salarioBruto: 42000, ...(() => { const t = calcTSS(42000); return { tssSFS: t.sfs, tssVDS: t.vds, tssRL: t.rl, totalTSS: t.total }; })(), isrMensual: 0, salarioNeto: 39999, estado: "Activo", alertas: [], expediente: 90 },
  { id: "6", nombre: "Roberto Santos Melo", cedula: "001-0112345-5", cargo: "Chofer", area: "Operaciones", tipoContrato: "Indefinido", fechaIngreso: "2018-04-20", salarioBruto: 20000, ...(() => { const t = calcTSS(20000); return { tssSFS: t.sfs, tssVDS: t.vds, tssRL: t.rl, totalTSS: t.total }; })(), isrMensual: 0, salarioNeto: 19035, estado: "Activo", alertas: ["Vacaciones acumuladas no registradas: 28 días pendientes."], expediente: 65 },
  { id: "7", nombre: "Patricia Herrera Nova", cedula: "001-0134567-7", cargo: "Diseñadora Gráfica", area: "Marketing", tipoContrato: "Determinado", fechaIngreso: "2025-02-01", salarioBruto: 35000, ...(() => { const t = calcTSS(35000); return { tssSFS: t.sfs, tssVDS: t.vds, tssRL: t.rl, totalTSS: t.total }; })(), isrMensual: 0, salarioNeto: 33332, estado: "Activo", alertas: ["Sin contrato firmado en expediente."], expediente: 50 },
  { id: "8", nombre: "Miguel Ángel Torres", cedula: "001-0156789-9", cargo: "Director de Operaciones", area: "Operaciones", tipoContrato: "Indefinido", fechaIngreso: "2017-11-15", salarioBruto: 140000, ...(() => { const t = calcTSS(140000); return { tssSFS: t.sfs, tssVDS: t.vds, tssRL: t.rl, totalTSS: t.total }; })(), isrMensual: 21841, salarioNeto: 111284, estado: "Activo", alertas: [], expediente: 98 },
];

const estadoConfig = {
  Activo: "emerald" as const,
  Inactivo: "slate" as const,
  Suspendido: "amber" as const,
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function NominaPage() {
  const [search, setSearch] = useState("");
  const [filterArea, setFilterArea] = useState("Todas");
  const [selected, setSelected] = useState<Empleado | null>(null);

  const areas = ["Todas", ...Array.from(new Set(empleados.map((e) => e.area)))];
  const filtered = empleados.filter((e) => {
    const matchSearch = e.nombre.toLowerCase().includes(search.toLowerCase()) || e.cargo.toLowerCase().includes(search.toLowerCase());
    const matchArea = filterArea === "Todas" || e.area === filterArea;
    return matchSearch && matchArea;
  });

  const totalBruto = empleados.reduce((a, e) => a + e.salarioBruto, 0);
  const totalTSS = empleados.reduce((a, e) => a + e.totalTSS, 0);
  const totalISR = empleados.reduce((a, e) => a + e.isrMensual, 0);
  const totalNeto = empleados.reduce((a, e) => a + e.salarioNeto, 0);
  const conAlertas = empleados.filter((e) => e.alertas.length > 0).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 max-w-7xl mx-auto">
      <motion.div variants={item}>
        <PageHeader
          icon={Users}
          iconColor="from-emerald-500 to-teal-600"
          title="NóminaGuard RD"
          subtitle="Nómina Mayo 2026 · ISR escala 2026 · TSS topes feb. 2026"
          actions={
            <>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/8 text-slate-300 text-xs font-medium transition-all hover:border-white/16">
                <Eye size={14} /> Vista previa cierre
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all">
                <Lock size={14} /> Cerrar nómina
              </button>
            </>
          }
        />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total bruto" value={`RD$${(totalBruto / 1000).toFixed(0)}K`} sub={`${empleados.length} empleados activos`} icon={DollarSign} iconColor="from-emerald-500 to-teal-600" />
        <StatCard label="Descuentos TSS" value={`RD$${(totalTSS / 1000).toFixed(0)}K`} sub="SFS + VDS + RL empleado" icon={Users} iconColor="from-sky-500 to-cyan-600" />
        <StatCard label="ISR retenido" value={`RD$${(totalISR / 1000).toFixed(0)}K`} sub="Escala DGII 2026" icon={DollarSign} iconColor="from-brand-600 to-purple-600" />
        <StatCard label="Neto a pagar" value={`RD$${(totalNeto / 1000).toFixed(0)}K`} sub={`${conAlertas} empleados con alertas`} icon={AlertTriangle} iconColor={conAlertas > 0 ? "from-red-600 to-rose-600" : "from-emerald-500 to-teal-600"} alert={conAlertas > 0} />
      </motion.div>

      {/* TSS info strip */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {[
          { label: "Tope SFS (Salud)", value: "RD$232,230", rate: "3.04% empleado" },
          { label: "Tope VDS (Pensión)", value: "RD$464,460", rate: "2.87% empleado" },
          { label: "Tope RL (Riesgos)", value: "RD$92,892", rate: "0.5% empleado" },
        ].map((t) => (
          <div key={t.label} className="glass rounded-xl p-3 border border-white/6 text-center">
            <div className="text-[10px] text-slate-500 mb-1">{t.label}</div>
            <div className="text-sm font-bold text-white">{t.value}</div>
            <div className="text-[10px] text-emerald-400">{t.rate}</div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="glass rounded-2xl border border-white/6 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-white/6">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar empleado o cargo..."
              className="w-full bg-white/4 border border-white/8 focus:border-emerald-500/50 text-white placeholder:text-slate-600 text-xs rounded-xl pl-8 pr-3 py-2 outline-none transition-all" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} className="text-slate-500" />
            {areas.map((a) => (
              <button key={a} onClick={() => setFilterArea(a)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${filterArea === a ? "bg-emerald-600 text-white" : "glass text-slate-400 hover:text-white border border-white/8"}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Empleado", "Cargo / Área", "Contrato", "Bruto", "TSS emp.", "ISR", "Neto", "Estado", ""].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {filtered.map((e) => (
                <tr key={e.id} className={`hover:bg-white/3 transition-colors group ${e.alertas.length > 0 ? "bg-amber-500/3" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500/40 to-purple-600/40 flex items-center justify-center text-[10px] font-bold text-brand-300 shrink-0">
                        {e.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white whitespace-nowrap">{e.nombre}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{e.cedula}</div>
                      </div>
                      {e.alertas.length > 0 && <AlertTriangle size={12} className="text-amber-400 shrink-0" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-slate-300 whitespace-nowrap">{e.cargo}</div>
                    <div className="text-[10px] text-slate-500">{e.area}</div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={e.tipoContrato === "Indefinido" ? "emerald" : "amber"}>{e.tipoContrato}</Badge></td>
                  <td className="px-4 py-3 text-xs font-bold text-white whitespace-nowrap">RD${e.salarioBruto.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">RD${e.totalTSS.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    {e.isrMensual > 0 ? <span className="text-brand-300">RD${e.isrMensual.toLocaleString()}</span> : <span className="text-slate-600">Exento</span>}
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-emerald-400 whitespace-nowrap">RD${e.salarioNeto.toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge variant={estadoConfig[e.estado]}>{e.estado}</Badge></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(e === selected ? null : e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/8 text-slate-400 hover:text-white transition-all">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-600">
          <span>{filtered.length} empleados</span>
          <span className="flex gap-6">
            <span>Bruto: RD${filtered.reduce((a, e) => a + e.salarioBruto, 0).toLocaleString()}</span>
            <span>Neto: RD${filtered.reduce((a, e) => a + e.salarioNeto, 0).toLocaleString()}</span>
          </span>
        </div>
      </motion.div>

      {/* Detail */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`glass rounded-2xl p-5 border ${selected.alertas.length > 0 ? "border-amber-500/25" : "border-emerald-500/20"}`}>
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/30 to-purple-600/30 flex items-center justify-center text-sm font-bold text-brand-300">
                {selected.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <div className="font-bold text-white">{selected.nombre}</div>
                <div className="text-xs text-slate-400">{selected.cargo} · {selected.area}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Expediente</div>
              <div className={`text-sm font-bold ${selected.expediente >= 80 ? "text-emerald-400" : selected.expediente >= 60 ? "text-amber-400" : "text-red-400"}`}>
                {selected.expediente}% completo
              </div>
            </div>
          </div>

          {selected.alertas.length > 0 && (
            <div className="space-y-2 mb-5">
              {selected.alertas.map((a, i) => (
                <div key={i} className="flex gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Salario bruto", val: `RD$${selected.salarioBruto.toLocaleString()}`, color: "text-white" },
              { label: "Descuento TSS", val: `RD$${selected.totalTSS.toLocaleString()}`, color: "text-sky-400" },
              { label: "ISR retenido", val: selected.isrMensual > 0 ? `RD$${selected.isrMensual.toLocaleString()}` : "Exento", color: "text-brand-300" },
              { label: "Salario neto", val: `RD$${selected.salarioNeto.toLocaleString()}`, color: "text-emerald-400" },
            ].map((r) => (
              <div key={r.label} className="glass rounded-xl p-3 border border-white/6">
                <div className="text-[10px] text-slate-500 mb-1">{r.label}</div>
                <div className={`text-sm font-bold ${r.color}`}>{r.val}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3 text-[11px] text-slate-500">
            <span>Ingreso: {selected.fechaIngreso}</span>
            <span>Contrato: {selected.tipoContrato}</span>
            <span>TSS desglose: SFS RD${selected.tssSFS.toLocaleString()} · VDS RD${selected.tssVDS.toLocaleString()} · RL RD${selected.tssRL.toLocaleString()}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
