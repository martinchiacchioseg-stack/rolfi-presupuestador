import { AMORE_MIO_TEMPLATE, ALARMAS_CHASCOMUS_TEMPLATE } from './defaultTemplates';

export const INITIAL_CLIENTS = [
  {
    id: 'cli-1',
    name: 'Amore Mío',
    contactPerson: 'Dirección Comercial',
    category: 'Boutique & Lencería Fina',
    phone: '+54 9 341 612-3456',
    email: 'contacto@amoremio.com.ar',
    city: 'Santa Fe / Buenos Aires',
    notes: 'Comercio minorista y ventas digitales por WhatsApp. Local físico y catálogo online.',
    createdAt: '2026-10-06',
  },
  {
    id: 'cli-2',
    name: 'Alarmas Chascomús',
    contactPerson: 'Gerencia General / Seguridad Técnica',
    category: 'Seguridad Electrónica & Alarmas',
    phone: '+54 9 2241 62-2787',
    email: 'contacto@alarmaschascomus.com.ar',
    city: 'Chascomús, Buenos Aires',
    notes: 'Líder en seguridad con más de 20 años de trayectoria. Requiere bot de WhatsApp con guardrails estrictos y web oficial.',
    createdAt: '2026-08-31',
  },
];

export const INITIAL_PROJECTS = [
  {
    ...AMORE_MIO_TEMPLATE,
    status: 'Finalizado', // 'Borrador' | 'Enviado' | 'Aprobado (50%)' | 'Finalizado'
    updatedAt: '2026-10-14',
  },
  {
    ...ALARMAS_CHASCOMUS_TEMPLATE,
    status: 'Aprobado (50%)',
    updatedAt: '2026-10-14',
  },
];
