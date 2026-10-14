import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Printer, 
  FileEdit, 
  Copy, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Send, 
  DollarSign,
  Calendar,
  Layers
} from 'lucide-react';

const STATUS_CONFIG = {
  'Borrador': { color: 'bg-slate-800 text-slate-300 border-slate-700', icon: Clock },
  'Enviado': { color: 'bg-blue-950 text-blue-300 border-blue-700/50', icon: Send },
  'Aprobado (50%)': { color: 'bg-amber-950 text-amber-300 border-amber-700/50', icon: DollarSign },
  'Finalizado': { color: 'bg-emerald-950 text-emerald-300 border-emerald-700/50', icon: CheckCircle },
};

export default function ProjectsHistoryView({ 
  projects, 
  onOpenProject, 
  onPrintProject, 
  onDeleteProject, 
  onDuplicateProject, 
  onUpdateStatus,
  onNewBudget 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filtered = projects.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      p.budgetNumber?.toLowerCase().includes(term) ||
      p.client?.name?.toLowerCase().includes(term) ||
      p.project?.title?.toLowerCase().includes(term);
    
    const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 bg-[#0b0f17] text-slate-200 overflow-y-auto p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-wide">
                Trabajos Hechos & Historial de Presupuestos
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Registro completo de todas las cotizaciones, módulos asignados, cobros y abonos mensuales.
            </p>
          </div>

          <button
            onClick={onNewBudget}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Presupuesto</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por N° de presupuesto, cliente o proyecto..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs shrink-0">
            {['Todos', 'Borrador', 'Enviado', 'Aprobado (50%)', 'Finalizado'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  statusFilter === status 
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-3">
          {filtered.map((proj) => {
            const rolfiTotal = proj.items?.reduce((sum, item) => sum + (parseFloat(item.rolfiPrice) || 0), 0) || 0;
            const discount = proj.discountType === 'percentage' 
              ? (rolfiTotal * (parseFloat(proj.discountValue) || 0)) / 100 
              : (parseFloat(proj.discountValue) || 0);
            const finalTotal = Math.max(0, rolfiTotal - discount);

            const statusInfo = STATUS_CONFIG[proj.status] || STATUS_CONFIG['Borrador'];
            const StatusIcon = statusInfo.icon;

            return (
              <div 
                key={proj.id}
                className="bg-[#0e1420] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Info Left */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                      {proj.budgetNumber || 'RLF-000'}
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      {proj.client?.name || 'Cliente sin nombre'}
                    </h3>
                    <span className="text-[11px] text-slate-500">•</span>
                    <span className="text-[11px] text-slate-400">{proj.client?.category}</span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium line-clamp-1">
                    {proj.project?.title || 'Sin título de proyecto'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {proj.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" /> {proj.items?.length || 0} módulos entregados
                    </span>
                    <span>
                      Abono: <strong className="text-slate-300">${proj.monthlyMaintenance?.fee || 100} USD/mes</strong>
                    </span>
                  </div>
                </div>

                {/* Status & Pricing */}
                <div className="flex flex-wrap items-center gap-4 shrink-0 justify-between md:justify-end">
                  
                  {/* Status Dropdown */}
                  <div>
                    <select
                      value={proj.status || 'Borrador'}
                      onChange={(e) => onUpdateStatus(proj.id, e.target.value)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${statusInfo.color}`}
                    >
                      <option value="Borrador">Borrador</option>
                      <option value="Enviado">Enviado al Cliente</option>
                      <option value="Aprobado (50%)">Aprobado (Seña 50%)</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-[110px]">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Inversión Final</span>
                    <span className="font-mono text-base font-black text-white">
                      ${finalTotal.toLocaleString()} USD
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
                    <button
                      onClick={() => onOpenProject(proj)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 transition-colors cursor-pointer"
                      title="Abrir y editar en el cotizador"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Abrir</span>
                    </button>

                    <button
                      onClick={() => onPrintProject(proj)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Imprimir PDF directo"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDuplicateProject(proj)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Duplicar este presupuesto"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-[#0e1420] border border-slate-800 rounded-2xl">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No se encontraron presupuestos o trabajos.</p>
            <p className="text-xs text-slate-500 mt-1">Podés cotizar un nuevo trabajo con el botón superior o importar un archivo.</p>
          </div>
        )}

      </div>
    </div>
  );
}
