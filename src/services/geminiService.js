/**
 * Servicio de Generación con Inteligencia Artificial (Gemini) para ROLFI
 */

const SYSTEM_INSTRUCTION = `
Sos el Director de Tecnología y Estrategia Comercial de ROLFI ("Hacemos pequeñas herramientas para grandes soluciones").
Tu misión es recibir una idea o requerimiento de una aplicación o sistema y armar el presupuesto técnico y comercial completo y profesional.

REGLAS ESTRICTAS DE PRESUPUESTACIÓN:
1. Moneda: Siempre en Dólares Estadounidenses (USD).
2. Mercado Argentino:
   - Asignar a cada módulo un "marketPrice" (Valor referencial que cobraría una agencia tradicional en USD).
   - Asignar a cada módulo un "rolfiPrice" (La propuesta competitiva y accesible de Rolfi, habitualmente entre un 20% y 35% más económica que el mercado).
3. Redacción de Alto Valor:
   - Nada de tecnicismos incomprensibles ni datos sensibles/claves.
   - En "businessBenefit", destacar el impacto directo en el negocio (ahorro de horas hombre, aumento de ventas, control de caja, prevención de pérdidas).
4. Cláusula de Mantenimiento Mensual:
   - Establecer una cuota mensual en USD (ej. entre 80 y 150 USD/mes).
   - Incluir soporte técnico, backups y resolución de bugs.
   - Aclarar explícitamente que NO incluye nuevos módulos ni nuevas pantallas, los cuales se cotizan por separado.
5. Formato de Salida:
   - Debes responder ÚNICAMENTE un objeto JSON válido (sin explicaciones antes ni después, sin bloques de código con texto fuera del JSON).
`;

export async function generateBudgetWithGemini(userPrompt, apiKey, clientContext = {}) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Debes ingresar tu API Key de Google Gemini para usar el asistente automático.');
  }

  const prompt = `
Generá un presupuesto comercial completo para ROLFI basado en este requerimiento:
"${userPrompt}"

Datos adicionales del cliente (si los hay):
- Nombre del negocio/cliente: ${clientContext.name || 'A definir'}
- Rubro: ${clientContext.category || 'Comercio / Servicios'}
- Contacto: ${clientContext.contactPerson || 'Titular'}

Estructura requerida en el JSON exacto:
{
  "id": "presupuesto-${Date.now()}",
  "budgetNumber": "RLF-2026-${Math.floor(100 + Math.random() * 900)}",
  "date": "${new Date().toISOString().split('T')[0]}",
  "validityDays": "15",
  "client": {
    "name": "${clientContext.name || 'Nombre del Cliente'}",
    "contactPerson": "${clientContext.contactPerson || 'Dirección Comercial'}",
    "category": "${clientContext.category || 'Rubro del Negocio'}",
    "phone": "${clientContext.phone || '+54 9 11 0000-0000'}",
    "email": "${clientContext.email || 'contacto@cliente.com'}",
    "city": "${clientContext.city || 'Buenos Aires, Argentina'}"
  },
  "project": {
    "title": "Título profesional de la solución",
    "initialDiagnosis": "Explicación del punto de partida y desafíos actuales que tiene el negocio",
    "constructionJourney": "Resumen ejecutivo de cómo Rolfi diseña y construye la arquitectura a medida"
  },
  "currency": "USD",
  "showArsEquivalent": false,
  "arsExchangeRate": 1350,
  "discountType": "percentage",
  "discountValue": 0,
  "paymentTerms": "50% de anticipo a la confirmación de la propuesta y 50% contra entrega de la solución homologada y operativa.",
  "monthlyMaintenance": {
    "fee": 100,
    "coverage": "Asistencia técnica prioritaria, corrección inmediata de anomalías (bug fixing), copias de seguridad periódicas de la base de datos y monitoreo de estabilidad del servidor.",
    "exclusions": "El abono cubre exclusivamente el mantenimiento preventivo y correctivo de los módulos entregados. No incluye nuevos módulos, pantallas adicionales ni ampliaciones funcionales, las cuales se cotizarán por separado."
  },
  "items": [
    {
      "id": "item-1",
      "number": "01",
      "title": "Nombre del Módulo",
      "category": "Área / Categoría",
      "description": "Detalle funcional de qué hace el módulo para el usuario",
      "businessBenefit": "Impacto directo y ahorro/ganancia para el negocio",
      "marketPrice": 450,
      "rolfiPrice": 320
    }
  ]
}
`;

  // Modelos recomendados: gemini-2.5-flash o gemini-1.5-flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_INSTRUCTION + '\n\n' + prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error de Gemini (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawContent) {
    throw new Error('Gemini no devolvió ninguna respuesta.');
  }

  // Limpiar posibles bloques markdown si vinieron con ```json
  const cleaned = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  // Asegurar formato de items numerados
  if (Array.isArray(parsed.items)) {
    parsed.items.forEach((item, index) => {
      item.number = String(index + 1).padStart(2, '0');
      if (!item.id) item.id = 'item-' + (index + 1);
    });
  }

  return parsed;
}
