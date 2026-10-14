import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingDown,
  Building,
  Calendar,
  FileCheck2,
  DollarSign
} from 'lucide-react';

export default function PreviewSheet({ data }) {
  // Calculations
  const marketTotal = data.items.reduce((sum, item) => sum + (parseFloat(item.marketPrice) || 0), 0);
  const rolfiSubtotal = data.items.reduce((sum, item) => sum + (parseFloat(item.rolfiPrice) || 0), 0);

  let discountAmount = 0;
  if (data.discountType === 'percentage') {
    discountAmount = (rolfiSubtotal * (parseFloat(data.discountValue) || 0)) / 100;
  } else {
    discountAmount = parseFloat(data.discountValue) || 0;
  }

  const finalTotal = Math.max(0, rolfiSubtotal - discountAmount);
  const totalSavings = Math.max(0, marketTotal - finalTotal);
  const totalSavingsPct = marketTotal > 0 ? Math.round((totalSavings / marketTotal) * 100) : 0;

  const advancePayment = Math.round(finalTotal / 2);
  const deliveryPayment = finalTotal - advancePayment;

  const arsFinalTotal = Math.round(finalTotal * (parseFloat(data.arsExchangeRate) || 1));
  const arsMonthlyFee = Math.round((parseFloat(data.monthlyMaintenance?.fee) || 0) * (parseFloat(data.arsExchangeRate) || 1));

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto p-4 md:p-8 flex justify-center">
      
      {/* A4 Sheet Container */}
      <div 
        id="printable-budget"
        className="print-sheet w-full max-w-[850px] bg-white text-slate-900 shadow-2xl rounded-sm p-8 md:p-12 transition-all font-sans relative"
        style={{ minHeight: '1120px' }}
      >
        
        {/* ==================== 1. ENCABEZADO INSTITUCIONAL ==================== */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            {/* Logo y Eslogan */}
            <div className="flex items-start gap-4">
              <img 
                src="/rolfi-logo.jpg" 
                alt="Logo Rolfi" 
                className="w-16 h-16 rounded-xl object-cover border border-slate-900 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-black tracking-wider text-slate-950 uppercase font-mono">
                    ROLFI
                  </h1>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-900 text-white">
                    Desarrollo de Software
                  </span>
                </div>
                <p className="text-xs font-semibold text-cyan-700 tracking-wide mt-1 uppercase">
                  Hacemos pequeñas herramientas para grandes soluciones
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Desarrollos a Medida • Consultoría Tecnológica • Arquitectura Digital
                </p>
              </div>
            </div>

            {/* Número y Fecha */}
            <div className="text-left md:text-right bg-slate-50 border border-slate-200 rounded-lg p-3 min-w-[200px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Presupuesto & Propuesta Técnica
              </span>
              <span className="text-base font-black text-slate-900 font-mono">
                {data.budgetNumber || 'RLF-2026-001'}
              </span>
              <div className="text-[11px] text-slate-600 mt-1 flex flex-col gap-0.5">
                <span><strong>Fecha:</strong> {data.date || '14/10/2026'}</span>
                <span><strong>Validez:</strong> {data.validityDays || 15} días corridos</span>
              </div>
            </div>

          </div>
        </div>

        {/* ==================== 2. FICHA DEL CLIENTE & PROYECTO ==================== */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-800 block mb-1">
                Cliente / Destinatario
              </span>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {data.client.name}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                {data.client.category} • {data.client.contactPerson}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {data.client.phone} • {data.client.city}
              </p>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-800 block mb-1">
                Proyecto Solicitado
              </span>
              <p className="text-xs font-bold text-slate-900 leading-snug">
                {data.project.title}
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                Desarrollo a medida llave en mano, exclusivo y sin costos de licenciamiento mensual por usuario.
              </p>
            </div>

          </div>
        </div>

        {/* ==================== 3. DIAGNÓSTICO & CONSTRUCCIÓN ==================== */}
        {(data.project.initialDiagnosis || data.project.constructionJourney) && (
          <div className="mb-6 space-y-3">
            {data.project.initialDiagnosis && (
              <div className="border-l-2 border-slate-300 pl-3 py-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                  Punto de Partida & Diagnóstico Inicial
                </span>
                <p className="text-xs text-slate-700 leading-relaxed mt-0.5">
                  {data.project.initialDiagnosis}
                </p>
              </div>
            )}

            {data.project.constructionJourney && (
              <div className="border-l-2 border-cyan-600 pl-3 py-1 bg-cyan-50/50 rounded-r-lg">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-800 block">
                  Enfoque de Ingeniería & Construcción de la Solución
                </span>
                <p className="text-xs text-slate-800 leading-relaxed mt-0.5">
                  {data.project.constructionJourney}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==================== 4. DESGLOSE ÍTEM POR ÍTEM (EL NÚCLEO DEL PRESUPUESTO) ==================== */}
        <div className="mb-8">
          <div className="flex items-center justify-between border-b border-slate-300 pb-2 mb-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-600" /> Detalle de Módulos & Cotización Ítem por Ítem
              </h3>
              <p className="text-[11px] text-slate-500">
                Comparativa transparente entre el valor de referencia de mercado y la inversión cotizada por Rolfi.
              </p>
            </div>
            <span className="text-xs font-bold font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-700">
              {data.items.length} Módulos
            </span>
          </div>

          <div className="space-y-3.5">
            {data.items.map((item) => {
              const itemMarket = parseFloat(item.marketPrice) || 0;
              const itemRolfi = parseFloat(item.rolfiPrice) || 0;
              const itemSavings = Math.max(0, itemMarket - itemRolfi);
              const itemSavingsPct = itemMarket > 0 ? Math.round((itemSavings / itemMarket) * 100) : 0;

              return (
                <div 
                  key={item.id} 
                  className="page-break-avoid border border-slate-200 rounded-xl p-3.5 bg-white hover:border-slate-300 transition-all shadow-xs"
                >
                  
                  {/* Top: Número, Título y Categoría */}
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                        {item.number}
                      </span>
                      <h4 className="text-xs font-bold text-slate-950 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                    {item.category && (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Descripción Funcional */}
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-2 pl-8">
                    {item.description}
                  </p>

                  {/* Beneficio Tangible de Negocio */}
                  {item.businessBenefit && (
                    <div className="ml-8 mb-2.5 p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-start gap-1.5 leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold text-emerald-950">Impacto en el Negocio:</strong> {item.businessBenefit}
                      </span>
                    </div>
                  )}

                  {/* Barra de Costos del Ítem */}
                  <div className="ml-8 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/80 p-2 rounded-lg">
                    
                    {/* Referencia de Mercado */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Referencia Mercado:
                      </span>
                      <span className="font-mono text-slate-500 font-semibold line-through text-[11px]">
                        ${itemMarket.toLocaleString()} USD
                      </span>
                    </div>

                    {/* Precio Rolfi & Ahorro */}
                    <div className="flex items-center gap-3">
                      {itemSavings > 0 && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                          Ahorro: -${itemSavings} USD ({itemSavingsPct}%)
                        </span>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] uppercase font-black text-cyan-900">
                          Inversión Rolfi:
                        </span>
                        <span className="font-mono font-black text-slate-950 text-sm">
                          ${itemRolfi.toLocaleString()} USD
                        </span>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ==================== 5. RESUMEN FINANCIERO CONSOLIDADO ==================== */}
        <div className="page-break-avoid border-2 border-slate-900 rounded-xl p-5 mb-6 bg-slate-50/50">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">
              Resumen Económico de la Solución
            </h3>
            <span className="text-[11px] font-bold text-slate-500">
              Valores expresados en Dólares Estadounidenses (USD)
            </span>
          </div>

          <div className="space-y-2 text-xs">
            
            {/* Mercado Benchmark vs Rolfi */}
            <div className="flex items-center justify-between text-slate-600">
              <span>Valor Estándar de Mercado de los {data.items.length} Módulos:</span>
              <span className="font-mono line-through font-semibold">${marketTotal.toLocaleString()} USD</span>
            </div>

            <div className="flex items-center justify-between text-slate-700 font-medium">
              <span>Subtotal Propuesta ROLFI:</span>
              <span className="font-mono font-bold">${rolfiSubtotal.toLocaleString()} USD</span>
            </div>

            {/* Descuento si existe */}
            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-700 font-bold bg-emerald-50 p-1.5 rounded">
                <span>Bonificación Especial de Lanzamiento / Convenio:</span>
                <span className="font-mono">-${discountAmount.toLocaleString()} USD</span>
              </div>
            )}

            {/* Total Final */}
            <div className="pt-3 border-t-2 border-slate-900 flex items-center justify-between">
              <div>
                <span className="text-sm font-black uppercase text-slate-950 block">
                  INVERSIÓN TOTAL DEL DESARROLLO:
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">
                  ★ Beneficio económico total para {data.client.name}: -${totalSavings.toLocaleString()} USD ({totalSavingsPct}% menos que el mercado)
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-950 font-mono tracking-tight">
                  ${finalTotal.toLocaleString()} USD
                </span>
                {data.showArsEquivalent && (
                  <span className="block text-xs font-bold text-slate-600 font-mono">
                    ≈ ${arsFinalTotal.toLocaleString()} ARS (TC ref. ${data.arsExchangeRate})
                  </span>
                )}
              </div>
            </div>

            {/* Condiciones de Pago */}
            <div className="mt-4 pt-3 border-t border-slate-200 bg-white p-3 rounded-lg border text-[11px] text-slate-700">
              <p className="font-bold text-slate-900 mb-1">Condición y Modalidad de Pago:</p>
              <p className="leading-relaxed">
                {data.paymentTerms}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 font-mono text-slate-900 font-semibold">
                <div>• 50% Anticipo de Inicio: <strong>${advancePayment.toLocaleString()} USD</strong></div>
                <div>• 50% Saldo contra Entrega: <strong>${deliveryPayment.toLocaleString()} USD</strong></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 italic">
                * Los importes pueden cancelarse en USD o en Pesos Argentinos (ARS) convertidos al tipo de cambio de referencia convenido (Dólar MEP/Blue del día de pago).
              </p>
            </div>

          </div>
        </div>

        {/* ==================== 6. CLÁUSULA BLINDADA DE MANTENIMIENTO ==================== */}
        <div className="page-break-avoid border border-slate-300 rounded-xl p-4 mb-6 bg-slate-50/70">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-700" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950">
                  Abono Mensual de Mantenimiento, Soporte & Continuidad Operativa
                </h4>
                <p className="text-[10px] text-slate-500">
                  Garantía de funcionamiento continuo, seguridad de datos y respaldo técnico
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base font-black text-slate-950 font-mono">
                ${data.monthlyMaintenance?.fee || 100} USD <span className="text-xs font-normal text-slate-600">/ mes</span>
              </span>
              {data.showArsEquivalent && (
                <span className="block text-[10px] font-bold text-slate-500 font-mono">
                  ≈ ${arsMonthlyFee.toLocaleString()} ARS / mes
                </span>
              )}
            </div>
          </div>

          {/* Cobertura */}
          <div className="text-[11px] text-slate-700 mb-3 space-y-1">
            <p className="font-semibold text-slate-900">Alcance Incluido en el Servicio:</p>
            <p className="leading-relaxed pl-2 border-l-2 border-cyan-500">
              {data.monthlyMaintenance?.coverage}
            </p>
          </div>

          {/* Exclusión Legal */}
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-900 leading-snug">
            <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Delimitación de Alcance y Nuevas Funcionalidades:</span>
            </div>
            <p>
              {data.monthlyMaintenance?.exclusions}
            </p>
          </div>
        </div>

        {/* ==================== 7. FIRMAS DE CONFORMIDAD ==================== */}
        <div className="page-break-avoid pt-6 mt-6 border-t-2 border-slate-900">
          <p className="text-[10px] text-slate-500 text-center mb-10 uppercase tracking-widest font-semibold">
            En conformidad con el alcance, cotización y condiciones de servicio aquí detalladas:
          </p>

          <div className="grid grid-cols-2 gap-12 text-center text-xs">
            <div>
              <div className="border-t border-slate-400 pt-2 mx-6">
                <p className="font-bold text-slate-950">Por ROLFI</p>
                <p className="text-[11px] text-slate-600">Soluciones Digitales a Medida</p>
                <p className="text-[10px] text-cyan-800 font-mono mt-0.5">Firma Autorizada</p>
              </div>
            </div>

            <div>
              <div className="border-t border-slate-400 pt-2 mx-6">
                <p className="font-bold text-slate-950">Por {data.client.name}</p>
                <p className="text-[11px] text-slate-600">{data.client.contactPerson || 'Titular / Dirección'}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Firma de Aceptación</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
          ROLFI • Hacemos pequeñas herramientas para grandes soluciones • {data.budgetNumber}
        </div>

      </div>

    </div>
  );
}
