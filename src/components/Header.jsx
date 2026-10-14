import React from 'react';
import { 
  Printer, 
  Sparkles, 
  Building2, 
  Briefcase, 
  FileText,
  Upload, 
  Download,
  Plus
} from 'lucide-react';

export default function Header({ 
  currentView, 
  onViewChange, 
  onOpenGeminiModal,
  onNewBudget,
  onImportJson,
  onExportJson,
  onPrint 
}) {
  return (
    <header className="no-print bg-[#080c14] border-b border-cyan-950/60 sticky top-0 z-50 px-4 py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img 
            src="/rolfi-logo.jpg" 
            alt="Rolfi Logo" 
            className="w-10 h-10 rounded-lg object-cover border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]" 
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-wider text-white">ROLFI</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                Tech Studio
              </span>
            </div>
            <p className="text-[10px] text-cyan-400/80 font-medium tracking-wide">
              Hacemos pequeñas herramientas para grandes soluciones
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs: Cotizador | Clientes | Trabajos Hechos */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => onViewChange('cotizador')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentView === 'cotizador'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Cotizador</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('clientes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentView === 'clientes'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Clientes</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('trabajos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentView === 'trabajos'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Trabajos Hechos</span>
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          
          {/* Gemini AI Trigger Button */}
          <button
            type="button"
            onClick={onOpenGeminiModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
            title="Crear presupuesto con Inteligencia Artificial Gemini"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Crear con Gemini</span>
          </button>

          {/* Quick New Budget Button */}
          <button
            type="button"
            onClick={onNewBudget}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Nuevo presupuesto en blanco"
          >
            <Plus className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Nuevo</span>
          </button>

          {/* Import / Export JSON */}
          <button
            type="button"
            onClick={onImportJson}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Importar presupuesto JSON"
          >
            <Upload className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onExportJson}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Descargar JSON"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Primary Print Button */}
          {currentView === 'cotizador' && (
            <button
              onClick={onPrint}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer ml-1"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir PDF</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
