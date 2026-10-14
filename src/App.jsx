import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import EditorPanel from './components/EditorPanel';
import PreviewSheet from './components/PreviewSheet';
import ClientsView from './components/ClientsView';
import ProjectsHistoryView from './components/ProjectsHistoryView';
import AiGeneratorModal from './components/AiGeneratorModal';
import { INITIAL_CLIENTS, INITIAL_PROJECTS } from './data/seedDatabase';
import { BLANK_TEMPLATE } from './data/defaultTemplates';

const CLIENTS_STORAGE_KEY = 'rolfi_clients_db';
const PROJECTS_STORAGE_KEY = 'rolfi_projects_db';
const CURRENT_BUDGET_KEY = 'rolfi_budget_current';

export default function App() {
  const [currentView, setCurrentView] = useState('cotizador'); // 'cotizador' | 'clientes' | 'trabajos'
  const [editorSubView, setEditorSubView] = useState('split'); // 'split' | 'editor' | 'preview'
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiSelectedClient, setAiSelectedClient] = useState(null);

  // 1. Clients Database State
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading clients:', e);
    }
    return INITIAL_CLIENTS;
  });

  // 2. Projects / Jobs Database State
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading projects:', e);
    }
    return INITIAL_PROJECTS;
  });

  // 3. Current Active Budget in Editor
  const [budgetData, setBudgetData] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_BUDGET_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading active budget:', e);
    }
    return INITIAL_PROJECTS[0];
  });

  const fileInputRef = useRef(null);

  // Persist databases whenever changed
  useEffect(() => {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(CURRENT_BUDGET_KEY, JSON.stringify(budgetData));
  }, [budgetData]);

  // Clients CRUD
  const handleAddClient = (newClient) => {
    setClients((prev) => [newClient, ...prev]);
  };

  const handleUpdateClient = (updated) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente de la base de datos?')) {
      setClients((prev) => prev.filter((c) => c.id !== clientId));
    }
  };

  const handleSelectClientForBudget = (client) => {
    const newBudget = {
      ...BLANK_TEMPLATE,
      id: 'presupuesto-' + Date.now(),
      budgetNumber: `RLF-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      client: {
        name: client.name || '',
        contactPerson: client.contactPerson || '',
        category: client.category || '',
        phone: client.phone || '',
        email: client.email || '',
        city: client.city || '',
      },
      status: 'Borrador',
    };
    setBudgetData(newBudget);
    // Add to projects list
    setProjects((prev) => [newBudget, ...prev]);
    setCurrentView('cotizador');
  };

  const handleOpenAiForClient = (client) => {
    setAiSelectedClient(client);
    setIsAiModalOpen(true);
  };

  const handleOpenGeneralAi = () => {
    setAiSelectedClient(null);
    setIsAiModalOpen(true);
  };

  // AI Generated Budget Handler
  const handleBudgetGenerated = (generated) => {
    const enriched = {
      ...generated,
      status: 'Borrador',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setBudgetData(enriched);

    // Also check if client exists in client database, if not add it
    if (enriched.client?.name && !clients.some((c) => c.name?.toLowerCase() === enriched.client.name.toLowerCase())) {
      const newCli = {
        id: 'cli-' + Date.now(),
        name: enriched.client.name,
        contactPerson: enriched.client.contactPerson || '',
        category: enriched.client.category || '',
        phone: enriched.client.phone || '',
        email: enriched.client.email || '',
        city: enriched.client.city || '',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setClients((prev) => [newCli, ...prev]);
    }

    // Add to projects list
    setProjects((prev) => [enriched, ...prev]);
    setCurrentView('cotizador');
  };

  // Project History Actions
  const handleOpenProject = (proj) => {
    setBudgetData(proj);
    setCurrentView('cotizador');
  };

  const handlePrintProject = (proj) => {
    setBudgetData(proj);
    setCurrentView('cotizador');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDeleteProject = (projId) => {
    if (window.confirm('¿Seguro que deseas eliminar este presupuesto del historial?')) {
      setProjects((prev) => prev.filter((p) => p.id !== projId));
    }
  };

  const handleDuplicateProject = (proj) => {
    const duplicated = {
      ...proj,
      id: 'presupuesto-' + Date.now(),
      budgetNumber: `RLF-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Borrador',
    };
    setProjects((prev) => [duplicated, ...prev]);
    setBudgetData(duplicated);
    setCurrentView('cotizador');
  };

  const handleUpdateProjectStatus = (projId, newStatus) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projId ? { ...p, status: newStatus } : p))
    );
    if (budgetData.id === projId) {
      setBudgetData((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleNewBudget = () => {
    const newBudget = {
      ...BLANK_TEMPLATE,
      id: 'presupuesto-' + Date.now(),
      budgetNumber: `RLF-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Borrador',
    };
    setBudgetData(newBudget);
    setProjects((prev) => [newBudget, ...prev]);
    setCurrentView('cotizador');
  };

  // Sync budget updates from editor back into projects database
  const handleBudgetChange = (updated) => {
    setBudgetData(updated);
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...updated, status: p.status || 'Borrador' } : p))
    );
  };

  // JSON Import & Export
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
          handleBudgetGenerated(parsed);
          alert('¡Presupuesto importado con éxito!');
        } else {
          alert('El archivo JSON no tiene el formato válido de presupuesto Rolfi.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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

      {/* Main Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenGeminiModal={handleOpenGeneralAi}
        onNewBudget={handleNewBudget}
        onImportJson={handleImportJson}
        onExportJson={handleExportJson}
        onPrint={handlePrint}
      />

      {/* VIEW 1: COTIZADOR */}
      {currentView === 'cotizador' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Sub-header controls */}
          <div className="no-print bg-[#0a0e17] border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Modo de Vista:</span>
              <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                <button
                  onClick={() => setEditorSubView('split')}
                  type="button"
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    editorSubView === 'split' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'hover:text-slate-200'
                  }`}
                >
                  Editor + Vista Previa
                </button>
                <button
                  onClick={() => setEditorSubView('editor')}
                  type="button"
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    editorSubView === 'editor' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'hover:text-slate-200'
                  }`}
                >
                  Solo Editor
                </button>
                <button
                  onClick={() => setEditorSubView('preview')}
                  type="button"
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    editorSubView === 'preview' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'hover:text-slate-200'
                  }`}
                >
                  Solo Hoja A4
                </button>
              </div>
            </div>

            <div className="text-[11px] text-cyan-400/80 hidden sm:block">
              Proyecto activo: <strong className="text-white">{budgetData.client?.name || 'Nuevo'}</strong> ({budgetData.budgetNumber})
            </div>
          </div>

          {/* Workspace */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {(editorSubView === 'split' || editorSubView === 'editor') && (
              <div className={`w-full ${editorSubView === 'split' ? 'md:w-[480px] lg:w-[540px]' : 'w-full'} shrink-0`}>
                <EditorPanel 
                  data={budgetData} 
                  onChange={handleBudgetChange} 
                />
              </div>
            )}

            {(editorSubView === 'split' || editorSubView === 'preview') && (
              <div className="flex-1 overflow-hidden flex flex-col">
                <PreviewSheet data={budgetData} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: CLIENTES (BASE DE DATOS CRM) */}
      {currentView === 'clientes' && (
        <ClientsView
          clients={clients}
          onAddClient={handleAddClient}
          onUpdateClient={handleUpdateClient}
          onDeleteClient={handleDeleteClient}
          onSelectClientForBudget={handleSelectClientForBudget}
          onOpenAiForClient={handleOpenAiForClient}
          projects={projects}
        />
      )}

      {/* VIEW 3: TRABAJOS HECHOS (HISTORIAL DE PRESUPUESTOS) */}
      {currentView === 'trabajos' && (
        <ProjectsHistoryView
          projects={projects}
          onOpenProject={handleOpenProject}
          onPrintProject={handlePrintProject}
          onDeleteProject={handleDeleteProject}
          onDuplicateProject={handleDuplicateProject}
          onUpdateStatus={handleUpdateProjectStatus}
          onNewBudget={handleNewBudget}
        />
      )}

      {/* AI GENERATOR MODAL (GEMINI) */}
      <AiGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onBudgetGenerated={handleBudgetGenerated}
        currentClient={aiSelectedClient}
      />

    </div>
  );
}
