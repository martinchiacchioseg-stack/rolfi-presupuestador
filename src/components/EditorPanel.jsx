import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Layers, 
  DollarSign, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  TrendingDown
} from 'lucide-react';

export default function EditorPanel({ data, onChange }) {
  const [activeTab, setActiveTab] = useState('items');

  const updateField = (path, value) => {
    const keys = path.split('.');
    const updated = JSON.parse(JSON.stringify(data));
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onChange(updated);
  };

  const updateItem = (index, field, value) => {
    const updated = JSON.parse(JSON.stringify(data));
    updated.items[index][field] = value;
    onChange(updated);
  };

  const addItem = () => {
    const updated = JSON.parse(JSON.stringify(data));
    const nextNumber = String(updated.items.length + 1).padStart(2, '0');
    updated.items.push({
      id: 'item-' + Date.now(),
      number: nextNumber,
      title: 'Nuevo Módulo / Característica',
      category: 'Desarrollo Especial',
      description: 'Detalle de la funcionalidad que se incorpora a la solución.',
      businessBenefit: 'Impacto directo en ventas, productividad o seguridad.',
      marketPrice: 350,
      rolfiPrice: 250,
    });
    onChange(updated);
  };

  const removeItem = (index) => {
    if (data.items.length <= 1) {
      alert('El presupuesto debe tener al menos un módulo cotizado.');
      return;
    }
    const updated = JSON.parse(JSON.stringify(data));
    updated.items.splice(index, 1);
    // Renumber
    updated.items.forEach((item, idx) => {
      item.number = String(idx + 1).padStart(2, '0');
    });
    onChange(updated);
  };

  return (
    <div className="no-print bg-[#0e1420] border-r border-slate-800 text-slate-200 flex flex-col h-[calc(100vh-65px)] overflow-hidden">
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-[#0a0e17] overflow-x-auto p-1 gap-1">
        {[
          { id: 'client', label: '1. Cliente', icon: Building2 },
          { id: 'project', label: '2. Proyecto', icon: FileText },
          { id: 'items', label: '3. Módulos & Precios', icon: Layers, badge: data.items.length },
          { id: 'finances', label: '4. Finanzas', icon: DollarSign },
          { id: 'maintenance', label: '5. Mantenimiento', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-900/60 text-cyan-300 font-bold border border-cyan-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* TAB 1: CLIENTE */}
        {activeTab === 'client' && (
          <div className="space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Datos de Identificación del Presupuesto
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400">N° de Presupuesto</label>
                  <input
                    type="text"
                    value={data.budgetNumber}
                    onChange={(e) => updateField('budgetNumber', e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400">Fecha de Emisión</label>
                  <input
                    type="date"
                    value={data.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400">Validez de la Oferta (días)</label>
                <input
                  type="text"
                  value={data.validityDays}
                  onChange={(e) => updateField('validityDays', e.target.value)}
                  placeholder="ej. 15 días corridos"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Datos del Cliente / Negocio
              </h3>

              <div>
                <label className="text-[11px] font-medium text-slate-400">Nombre del Negocio / Empresa</label>
                <input
                  type="text"
                  value={data.client.name}
                  onChange={(e) => updateField('client.name', e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400">Rubro o Actividad</label>
                  <input
                    type="text"
                    value={data.client.category}
                    onChange={(e) => updateField('client.category', e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400">Persona de Contacto / Cargo</label>
                  <input
                    type="text"
                    value={data.client.contactPerson}
                    onChange={(e) => updateField('client.contactPerson', e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={data.client.phone}
                    onChange={(e) => updateField('client.phone', e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400">Ubicación / Ciudad</label>
                  <input
                    type="text"
                    value={data.client.city}
                    onChange={(e) => updateField('client.city', e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROYECTO */}
        {activeTab === 'project' && (
          <div className="space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Resumen Ejecutivo del Proyecto
              </h3>

              <div>
                <label className="text-[11px] font-medium text-slate-400">Título de la Solución</label>
                <input
                  type="text"
                  value={data.project.title}
                  onChange={(e) => updateField('project.title', e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                  <span>Diagnóstico Inicial (Punto de Partida del Cliente)</span>
                </label>
                <textarea
                  rows={4}
                  value={data.project.initialDiagnosis}
                  onChange={(e) => updateField('project.initialDiagnosis', e.target.value)}
                  placeholder="Detallar qué desafíos o ineficiencias tenía el cliente antes de la solución..."
                  className="w-full mt-1 p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                  <span>Recorrido de Construcción & Enfoque de Ingeniería</span>
                  <span className="text-[10px] text-emerald-400">Sin datos sensibles ni claves</span>
                </label>
                <textarea
                  rows={4}
                  value={data.project.constructionJourney}
                  onChange={(e) => updateField('project.constructionJourney', e.target.value)}
                  placeholder="Explicación profesional de cómo se diseñó y construyó la arquitectura a medida..."
                  className="w-full mt-1 p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MÓDULOS & PRECIOS (PARTE POR PARTE) */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            
            {/* Context Box */}
            <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-3 text-xs text-cyan-200">
              <p className="font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" /> Desglose Ítem por Ítem (Transparencia Comercial)
              </p>
              <p className="text-[11px] text-cyan-300/80 leading-relaxed">
                Cada módulo incluye su <strong>Valor de Referencia de Mercado (USD)</strong> y el <strong>Precio Propuesta Rolfi (USD)</strong> que vos definas. Esto le demuestra al cliente el ahorro tangible que obtiene con Rolfi.
              </p>
            </div>

            {/* Modules List */}
            <div className="space-y-3">
              {data.items.map((item, index) => {
                const diff = (item.marketPrice || 0) - (item.rolfiPrice || 0);
                const discountPct = item.marketPrice ? Math.round((diff / item.marketPrice) * 100) : 0;

                return (
                  <div 
                    key={item.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-3 transition-all hover:border-slate-700"
                  >
                    {/* Header item */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 rounded-md bg-cyan-950 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center border border-cyan-500/30">
                          {item.number}
                        </span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateItem(index, 'title', e.target.value)}
                          placeholder="Nombre del Módulo"
                          className="font-bold text-xs text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 focus:outline-none flex-1 px-1 py-0.5"
                        />
                      </div>

                      <button
                        onClick={() => removeItem(index)}
                        type="button"
                        className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                        title="Eliminar este módulo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Categoría / Área</label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => updateItem(index, 'category', e.target.value)}
                        placeholder="ej. Operatoria, Ventas, Seguridad..."
                        className="w-full mt-0.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        ¿Qué hace el módulo? (Explicación Funcional)
                      </label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Explicación clara para el cliente de cómo funciona..."
                        className="w-full mt-0.5 p-2 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
                      />
                    </div>

                    {/* Benefit */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        ★ Beneficio Directo para el Negocio
                      </label>
                      <textarea
                        rows={2}
                        value={item.businessBenefit}
                        onChange={(e) => updateItem(index, 'businessBenefit', e.target.value)}
                        placeholder="Ahorro de tiempo, aumento de ventas, control de caja..."
                        className="w-full mt-0.5 p-2 rounded-md bg-slate-950 border border-slate-800 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 leading-relaxed"
                      />
                    </div>

                    {/* Pricing Inputs */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Valor Mercado (USD)
                        </label>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-slate-400">$</span>
                          <input
                            type="number"
                            value={item.marketPrice}
                            onChange={(e) => updateItem(index, 'marketPrice', parseFloat(e.target.value) || 0)}
                            className="w-full bg-transparent text-sm font-bold text-slate-300 focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">USD</span>
                        </div>
                      </div>

                      <div className="bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-500/30">
                        <label className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">
                          Precio Rolfi (USD)
                        </label>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-cyan-400">$</span>
                          <input
                            type="number"
                            value={item.rolfiPrice}
                            onChange={(e) => updateItem(index, 'rolfiPrice', parseFloat(e.target.value) || 0)}
                            className="w-full bg-transparent text-sm font-black text-cyan-300 focus:outline-none"
                          />
                          <span className="text-[10px] text-cyan-400 font-mono">USD</span>
                        </div>
                      </div>
                    </div>

                    {/* Savings tag */}
                    {diff > 0 && (
                      <div className="flex items-center justify-between text-[11px] px-2 py-1 rounded bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 font-medium">
                        <span className="flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5" /> Ventaja competitiva Rolfi:
                        </span>
                        <span className="font-bold">
                          -USD {diff} ({discountPct}% ahorro)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Item Button */}
            <button
              onClick={addItem}
              type="button"
              className="w-full py-2.5 border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl text-xs font-bold text-slate-300 hover:text-cyan-300 flex items-center justify-center gap-2 transition-all hover:bg-cyan-950/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Agregar Nuevo Módulo
            </button>
          </div>
        )}

        {/* TAB 4: FINANZAS & DESCUENTOS */}
        {activeTab === 'finances' && (
          <div className="space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Bonificaciones & Descuentos Especiales
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400">Tipo de Descuento</label>
                  <select
                    value={data.discountType}
                    onChange={(e) => updateField('discountType', e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="percentage">Porcentual (%)</option>
                    <option value="fixed">Monto Fijo (USD)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400">
                    {data.discountType === 'percentage' ? 'Porcentaje (%)' : 'Monto de Descuento (USD)'}
                  </label>
                  <input
                    type="number"
                    value={data.discountValue}
                    onChange={(e) => updateField('discountValue', parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Forma de Pago & Cláusula de Cobro
              </h3>

              <div>
                <label className="text-[11px] font-medium text-slate-400">Modalidad de Pago Acordada</label>
                <textarea
                  rows={2}
                  value={data.paymentTerms}
                  onChange={(e) => updateField('paymentTerms', e.target.value)}
                  placeholder="ej. 50% anticipo al iniciar y 50% contra entrega..."
                  className="w-full mt-1 p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              {/* ARS Option */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.showArsEquivalent}
                    onChange={(e) => updateField('showArsEquivalent', e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700 focus:ring-0"
                  />
                  <span className="text-xs font-medium text-slate-300">
                    Mostrar también equivalente en Pesos Argentinos (ARS) al cambio de referencia
                  </span>
                </label>

                {data.showArsEquivalent && (
                  <div className="mt-2 pl-6">
                    <label className="text-[11px] font-medium text-slate-400">
                      Tipo de Cambio Dólar de Referencia (ARS / USD)
                    </label>
                    <input
                      type="number"
                      value={data.arsExchangeRate}
                      onChange={(e) => updateField('arsExchangeRate', parseFloat(e.target.value) || 1)}
                      className="w-48 mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MANTENIMIENTO MENSUAL */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Abono de Mantenimiento Mensual (SLA)
              </h3>

              <div>
                <label className="text-[11px] font-medium text-slate-400">Cuota Mensual del Abono (USD / mes)</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    value={data.monthlyMaintenance.fee}
                    onChange={(e) => updateField('monthlyMaintenance.fee', parseFloat(e.target.value) || 0)}
                    className="w-48 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-xs text-slate-400 font-mono">USD / mes</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-emerald-400">
                  ¿Qué incluye el abono? (Alcance Cubierto)
                </label>
                <textarea
                  rows={3}
                  value={data.monthlyMaintenance.coverage}
                  onChange={(e) => updateField('monthlyMaintenance.coverage', e.target.value)}
                  placeholder="Asistencia técnica, resolución de fallos, backups automáticos..."
                  className="w-full mt-1 p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-amber-400">
                  ⚠️ Cláusula Blindada de Exclusión (No incluye nuevos módulos)
                </label>
                <textarea
                  rows={4}
                  value={data.monthlyMaintenance.exclusions}
                  onChange={(e) => updateField('monthlyMaintenance.exclusions', e.target.value)}
                  placeholder="Aclaración legal de que el abono solo cubre mantenimiento del código existente..."
                  className="w-full mt-1 p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-amber-200 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
