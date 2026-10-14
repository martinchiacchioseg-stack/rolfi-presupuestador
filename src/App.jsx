import React, { useState, useRef } from 'react';
import Header from './components/Header';
import EditorPanel from './components/EditorPanel';
import PreviewSheet from './components/PreviewSheet';
import { 
  AMORE_MIO_TEMPLATE, 
  ALARMAS_CHASCOMUS_TEMPLATE,
  BLANK_TEMPLATE 
} from './data/defaultTemplates';

const STORAGE_KEY = 'rolfi_budget_current';

export default function App() {
  const [budgetData, setBudgetData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved budget:', e);
    }
    return AMORE_MIO_TEMPLATE;
  });

  const [savedAlert, setSavedAlert] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'editor' | 'preview'
  const fileInputRef = useRef(null);

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgetData));
      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 2000);
    } catch (e) {
      console.error('Error saving:', e);
    }
  };

  const handleLoadAmoreMio = () => {
    if (window.confirm('¿Deseas cargar la plantilla completa de "Amore Mío"? Se reemplazarán los datos no guardados.')) {
      setBudgetData(AMORE_MIO_TEMPLATE);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(AMORE_MIO_TEMPLATE));
    }
  };

  const handleLoadChascomus = () => {
    if (window.confirm('¿Deseas cargar la propuesta de "Alarmas Chascomús + Bot WhatsApp"? Se reemplazarán los datos no guardados.')) {
      setBudgetData(ALARMAS_CHASCOMUS_TEMPLATE);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ALARMAS_CHASCOMUS_TEMPLATE));
    }
  };

  const handleNewBudget = () => {
    if (window.confirm('¿Deseas iniciar un nuevo presupuesto en blanco?')) {
      const newOne = {
        ...BLANK_TEMPLATE,
        id: 'presupuesto-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
      };
      setBudgetData(newOne);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOne));
    }
  };

  const handleExportJson = () => {
    const filename = `${budgetData.budgetNumber || 'presupuesto'}_${budgetData.client?.name?.replace(/\s+/g, '_') || 'rolfi'}.json`;
    const jsonStr = JSON.stringify(budgetData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (parsed && parsed.items && parsed.client) {
          setBudgetData(parsed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          alert('¡Presupuesto importado con éxito!');
        } else {
          alert('El archivo JSON no tiene el formato válido de presupuesto Rolfi.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17]">
      {/* Hidden file input for import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".json,application/json" 
        className="hidden" 
      />

      {/* Top Bar */}
      <Header 
        onLoadAmoreMio={handleLoadAmoreMio}
        onLoadChascomus={handleLoadChascomus}
        onNewBudget={handleNewBudget}
        onSave={handleSave}
        savedAlert={savedAlert}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onPrint={handlePrint}
      />

      {/* Screen Mode Toggles (For mobile/tablets or convenience) */}
      <div className="no-print bg-[#0a0e17] border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Modo de Visualización:</span>
          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setViewMode('split')}
              type="button"
              className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'split' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'hover:text-slate-200'
              }`}
            >
              Pantalla Dividida (Editor + Vista Previa)
            </button>
            <button
              onClick={() => setViewMode('editor')}
              type="button"
              className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'editor' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'hover:text-slate-200'
              }`}
            >
              Solo Editor
            </button>
            <button
              onClick={() => setViewMode('preview')}
              type="button"
              className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'preview' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'hover:text-slate-200'
              }`}
            >
              Solo Hoja PDF A4
            </button>
          </div>
        </div>

        <div className="text-[11px] text-cyan-400/80 hidden sm:block">
          💡 Para exportar a PDF: hacé clic en <strong>"Imprimir PDF"</strong> y seleccioná <em>"Guardar como PDF"</em>.
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Editor Panel */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className={`w-full ${viewMode === 'split' ? 'md:w-[480px] lg:w-[540px]' : 'w-full'} shrink-0`}>
            <EditorPanel 
              data={budgetData} 
              onChange={setBudgetData} 
            />
          </div>
        )}

        {/* Live Preview Panel */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <PreviewSheet data={budgetData} />
          </div>
        )}

      </div>
    </div>
  );
}
