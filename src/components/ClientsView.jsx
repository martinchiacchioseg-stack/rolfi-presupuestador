import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Sparkles, 
  Trash2, 
  Edit3,
  Calendar
} from 'lucide-react';

export default function ClientsView({ 
  clients, 
  onAddClient, 
  onUpdateClient, 
  onDeleteClient, 
  onSelectClientForBudget,
  onOpenAiForClient,
  projects
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    category: '',
    phone: '',
    email: '',
    city: '',
    notes: '',
  });

  const filteredClients = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.category?.toLowerCase().includes(term) ||
      c.contactPerson?.toLowerCase().includes(term) ||
      c.city?.toLowerCase().includes(term)
    );
  });

  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      contactPerson: '',
      category: '',
      phone: '',
      email: '',
      city: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setFormData({ ...client });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingClient) {
      onUpdateClient({
        ...editingClient,
        ...formData,
      });
    } else {
      onAddClient({
        id: 'cli-' + Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(false);
  };

  const getClientProjectsCount = (clientName) => {
    return projects.filter(p => p.client?.name?.toLowerCase() === clientName?.toLowerCase()).length;
  };

  return (
    <div className="flex-1 bg-[#0b0f17] text-slate-200 overflow-y-auto p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-wide">
                Cartera de Clientes & Empresas
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Base de datos centralizada de tus clientes para cotizar en un clic o consultar su historial.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cliente por nombre, rubro, contacto o ciudad..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const projectCount = getClientProjectsCount(client.name);

            return (
              <div 
                key={client.id}
                className="bg-[#0e1420] border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">
                        {client.name}
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20 inline-block mt-1">
                        {client.category || 'Comercio / Empresa'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(client)}
                        type="button"
                        className="text-slate-500 hover:text-cyan-400 p-1 rounded transition-colors cursor-pointer"
                        title="Editar cliente"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClient(client.id)}
                        type="button"
                        className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                        title="Eliminar cliente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Client Data */}
                  <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    {client.contactPerson && (
                      <p className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px]">Contacto:</span>
                        <strong className="text-slate-200">{client.contactPerson}</strong>
                      </p>
                    )}
                    {client.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-cyan-500 shrink-0" />
                        <span className="text-slate-300 font-mono text-[11px]">{client.phone}</span>
                      </p>
                    )}
                    {client.city && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="text-slate-400 text-[11px]">{client.city}</span>
                      </p>
                    )}
                    {client.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-2">
                        "{client.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Presupuestos asociados:</span>
                    <span className="font-mono font-bold text-cyan-400">{projectCount}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onSelectClientForBudget(client)}
                      type="button"
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3 h-3 text-cyan-400" />
                      Cotizar
                    </button>

                    <button
                      onClick={() => onOpenAiForClient(client)}
                      type="button"
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      Con Gemini
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12 bg-[#0e1420] border border-slate-800 rounded-2xl">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No se encontraron clientes.</p>
            <p className="text-xs text-slate-500 mt-1">Podés dar de alta un cliente nuevo con el botón superior.</p>
          </div>
        )}

      </div>

      {/* Modal Agregar / Editar Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0e1420] border border-cyan-500/40 rounded-2xl w-full max-w-md p-6 text-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">
              {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nombre del Negocio / Empresa *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej. Distribuidora El Trébol"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Rubro / Categoría</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="ej. Gastronomía, Salud..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Persona de Contacto</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="ej. Martín Pérez"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+54 9 ..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="ej. Chascomús, Bs As"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contacto@empresa.com"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Notas / Observaciones</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Detalles de interés sobre el cliente..."
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
