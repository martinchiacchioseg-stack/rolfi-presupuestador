import React from 'react';
import { 
  Printer, 
  FilePlus, 
  Sparkles, 
  Save, 
  Check, 
  ShieldAlert, 
  Download, 
  Upload 
} from 'lucide-react';

export default function Header({ 
  onLoadAmoreMio, 
  onLoadChascomus,
  onNewBudget, 
  onSave, 
  savedAlert,
  onExportJson,
  onImportJson,
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
                Cotizador Pro
              </span>
            </div>
            <p className="text-[10px] text-cyan-400/80 font-medium tracking-wide">
              Hacemos pequeñas herramientas para grandes soluciones
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={onLoadAmoreMio}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold hover:bg-cyan-950/80 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
              title="Cargar presupuesto modelo de Amore Mío"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Amore Mío
            </button>

            <button
              onClick={onLoadChascomus}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold hover:bg-cyan-950/80 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
              title="Cargar presupuesto de Alarmas Chascomús + Bot WhatsApp"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              Alarmas Chascomús + Bot
            </button>

            <button
              onClick={onNewBudget}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              title="Iniciar un presupuesto en blanco"
            >
              <FilePlus className="w-3.5 h-3.5" />
              Nuevo
            </button>
          </div>

          {/* Sync / Storage Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={onImportJson}
              type="button"
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all cursor-pointer"
              title="Importar presupuesto desde JSON generado por Antigravity"
            >
              <Upload className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Importar</span>
            </button>

            <button
              onClick={onExportJson}
              type="button"
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all cursor-pointer"
              title="Descargar presupuesto como archivo JSON"
            >
              <Download className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            <button
              onClick={onSave}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all cursor-pointer"
              title="Guardar en el navegador"
            >
              {savedAlert ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Guardado</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-slate-400" />
                  <span>Guardar</span>
                </>
              )}
            </button>
          </div>

          {/* Primary Print Button */}
          <button
            onClick={onPrint}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer ml-1"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir PDF</span>
          </button>
        </div>

      </div>
    </header>
  );
}
