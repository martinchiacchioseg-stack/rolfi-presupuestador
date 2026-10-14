import React, { useState } from 'react';
import { Sparkles, X, Key, Loader2, Lightbulb, AlertCircle } from 'lucide-react';
import { generateBudgetWithGemini } from '../services/geminiService';

export default function AiGeneratorModal({ isOpen, onClose, onBudgetGenerated, currentClient }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('rolfi_gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(() => !localStorage.getItem('rolfi_gemini_api_key'));
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSaveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('rolfi_gemini_api_key', key);
  };

  const handleQuickPrompt = (text) => {
    setPrompt(text);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Por favor escribí una breve descripción de lo que necesita el cliente.');
      return;
    }
    if (!apiKey.trim()) {
      setShowKeyInput(true);
      setError('Debes ingresar tu API Key gratuita de Google Gemini para generar con IA.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      handleSaveKey(apiKey);
      const generated = await generateBudgetWithGemini(prompt, apiKey, currentClient);
      onBudgetGenerated(generated);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al comunicarse con Gemini.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0e1420] border border-cyan-500/40 rounded-2xl w-full max-w-xl shadow-[0_0_50px_rgba(6,182,212,0.25)] text-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0a0e17]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Asistente de Presupuestos Rolfi con Gemini
              </h3>
              <p className="text-[11px] text-cyan-400/80">
                Generá un presupuesto profesional completo en segundos con Inteligencia Artificial
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="p-5 space-y-4">
          
          {/* API Key Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" /> Google Gemini API Key
              </span>
              <button
                type="button"
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
              >
                {showKeyInput ? 'Ocultar' : apiKey ? 'Cambiar API Key' : 'Configurar API Key'}
              </button>
            </div>

            {showKeyInput ? (
              <div className="mt-2 space-y-1.5">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Pegá acá tu API Key (AIzaSy...)"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[10px] text-slate-400">
                  Podés obtener tu clave gratis en{' '}
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-cyan-400 underline font-semibold"
                  >
                    Google AI Studio
                  </a>. Se guarda de forma segura en tu propio navegador.
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                ✓ Clave configurada y lista en tu navegador.
              </p>
            )}
          </div>

          {/* Prompt Input */}
          <div>
            <label className="text-xs font-bold text-white block mb-1">
              ¿Qué necesita el cliente? (Describí la idea o el negocio)
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ejemplo: Necesito cotizar una aplicación para una Distribuidora de Bebidas. Quieren que los clientes vean precios mayoristas desde el celular, armen el pedido y lo manden por WhatsApp. Y que el negocio tenga un panel para actualizar precios y ver stock..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          {/* Quick Ideas Chips */}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 mb-1.5">
              <Lightbulb className="w-3 h-3 text-amber-400" /> Ideas rápidas para cotizar:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Distribuidora mayorista con pedidos por WhatsApp y panel de precios',
                'Sistema para turnos y reservas de consultorios o estética con WhatsApp',
                'E-commerce gastronómico con carta digital, control de mesas y comandas',
                'Bot de WhatsApp con IA para atención comercial y preguntas frecuentes 24/7',
                'App de gestión interna para control de stock, clientes y cuentas corrientes'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPrompt(chip)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-colors text-left cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini está cotizando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generar Presupuesto con Gemini</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
