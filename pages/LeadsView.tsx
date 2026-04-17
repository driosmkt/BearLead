import React, { useState } from 'react';
import { useLeadsContext } from '../context/LeadsContext';
import { LeadCard } from '../components/LeadCard';
import { LeadStatus } from '../types';
import { Search, Plus, Filter, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const columns: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'Novo Lead', label: 'Início', color: 'border-slate-200' },
  { id: 'Em Atendimento', label: 'Em Contato', color: 'border-blue-200' },
  { id: 'Agendado', label: 'Visita Agendada', color: 'border-primary/20' },
  { id: 'Visitou', label: 'Visita Realizada', color: 'border-emerald-200' },
  { id: 'Matriculado', label: 'Matrícula', color: 'border-green-400' },
  { id: 'Follow-up Recuperação', label: 'Recuperação', color: 'border-amber-200' },
];

export const LeadsView: React.FC = () => {
  const { leads, updateLeadStatus } = useLeadsContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);

  const filteredLeads = leads.filter(l => 
    l.responsibleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragOver = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDrop = (e: React.DragEvent, newStatus: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    updateLeadStatus(leadId, newStatus);
    setDragOverColumn(null);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black dark:text-white">Central de Leads</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gerencie seu funil de vendas e qualificação.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all">
            <Filter size={18} />
            <span>Filtros</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Plus size={18} />
            <span>Novo Lead</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome do pai, mãe ou programa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-transparent border-none focus:ring-0 text-sm dark:text-white"
          />
        </div>
        <div className="h-6 w-[1px] bg-slate-100 dark:bg-slate-800" />
        <div className="flex p-1 bg-slate-50 dark:bg-slate-950 rounded-xl">
          <button className="p-2 bg-white dark:bg-slate-800 shadow-sm rounded-lg text-primary">
            <LayoutGrid size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-6 scrollbar-thin">
        <div className="flex gap-6 min-w-[1400px] h-full">
          {columns.map((column) => (
            <div 
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`flex-1 flex flex-col min-w-[240px] rounded-2xl transition-all duration-300
                ${dragOverColumn === column.id ? 'bg-primary/5 ring-2 ring-primary/20 ring-inset' : 'bg-slate-50/50 dark:bg-slate-900/40'}
              `}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-primary`} />
                  <h3 className="font-display font-bold text-sm tracking-tight dark:text-white">{column.label}</h3>
                </div>
                <span className="text-[10px] font-black bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-400">
                  {filteredLeads.filter(l => l.status === column.id).length}
                </span>
              </div>

              <div className="flex-1 p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-320px)] scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {filteredLeads
                    .filter(l => l.status === column.id)
                    .map((lead) => (
                      <motion.div
                        key={lead.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LeadCard lead={lead} />
                      </motion.div>
                    ))}
                </AnimatePresence>
                
                {filteredLeads.filter(l => l.status === column.id).length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center p-4 text-center">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed">
                      Nenhum lead nesta etapa
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
