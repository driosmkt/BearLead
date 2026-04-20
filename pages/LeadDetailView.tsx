import React, { useState, useMemo } from 'react';
import { useLeadsContext } from '../context/LeadsContext';
import { LeadCard } from '../components/LeadCard';
import { LeadStatus, ViewState } from '../types';
import { Search, Plus, Filter, LayoutGrid, List, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewLeadModal }    from '../components/NewLeadModal';
import { KanbanSkeleton } from '../components/KanbanSkeleton';

const BASE_COLUMNS: { id: LeadStatus; label: string }[] = [
  { id: 'Novo Lead',             label: 'Início'          },
  { id: 'Em Atendimento',        label: 'Em Contato'      },
  { id: 'Agendado',              label: 'Visita Agendada' },
  { id: 'Visitou',               label: 'Visita Realizada'},
  { id: 'Matriculado',           label: 'Matrícula'       },
  { id: 'Follow-up Recuperação', label: 'Recuperação'     },
];
const LOST_COLUMN = { id: 'Perdido' as LeadStatus, label: 'Perdidos' };

const PROGRAMS = ['Bear Care','Toddler','Nursery','Junior Kindergarten','Senior Kindergarten','Elementary'];
const SOURCES  = ['Facebook Ads','Google Ads','Instagram','Indicação','Site','Outros'];
const SCORES   = ['Quente','Morno','Frio'];

// ─── Filtro pill clicável ─────────────────────────────────────────────────────
const Pill: React.FC<{
  label: string; active: boolean; color?: string; onClick: () => void;
}> = ({ label, active, color = 'red', onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap
      ${active
        ? `bg-${color}-600 text-white border-${color}-600 shadow-sm`
        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
      }`}
  >
    {label}
  </button>
);

export const LeadsView: React.FC = () => {
  const { leads, updateLeadStatus, setCurrentView, setSelectedLeadId, loading } = useLeadsContext();

  const [searchTerm,     setSearchTerm]     = useState('');
  const [showFilters,    setShowFilters]     = useState(false);
  const [showNewLead,    setShowNewLead]     = useState(false);
  const [viewMode,       setViewMode]        = useState<'grid'|'list'>('grid');
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);

  // Filtros ativos
  const [activeScores,   setActiveScores]   = useState<string[]>([]);
  const [activeSources,  setActiveSources]  = useState<string[]>([]);
  const [activePrograms, setActivePrograms] = useState<string[]>([]);
  const [showLost,       setShowLost]       = useState(false);
  const columns = showLost ? [...BASE_COLUMNS, LOST_COLUMN] : BASE_COLUMNS;

  const toggleFilter = (list: string[], setList: (v: string[]) => void, val: string) => {
    setList(list.includes(val) ? list.filter(x => x !== val) : [...list, val]);
  };

  const totalActiveFilters = activeScores.length + activeSources.length + activePrograms.length;

  const clearFilters = () => {
    setActiveScores([]);
    setActiveSources([]);
    setActivePrograms([]);
  };

  const filteredLeads = useMemo(() => leads.filter(l => {
    const matchSearch =
      l.responsibleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.program.toLowerCase().includes(searchTerm.toLowerCase());

    const matchScore   = activeScores.length   === 0 || activeScores.includes(l.score);
    const matchSource  = activeSources.length  === 0 || activeSources.includes(l.origin);
    const matchProgram = activePrograms.length === 0 || activePrograms.includes(l.program);
    const matchLost    = showLost ? true : l.status !== 'Perdido';

    return matchSearch && matchScore && matchSource && matchProgram && matchLost;
  }), [leads, searchTerm, activeScores, activeSources, activePrograms]);

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
    <>
    <div className="space-y-6 h-full flex flex-col">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black dark:text-white">Central de Leads</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gerencie seu funil de vendas e qualificação.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border relative
              ${showFilters || totalActiveFilters > 0
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
          >
            <Filter size={16} />
            <span>Filtros</span>
            {totalActiveFilters > 0 && (
              <span className="w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ml-1">
                {totalActiveFilters}
              </span>
            )}
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => setShowNewLead(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>Novo Lead</span>
          </button>
        </div>
      </div>

      {/* Painel de filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filtrar por</span>
              {totalActiveFilters > 0 && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-600 font-semibold hover:text-red-700">
                  <X size={12} /> Limpar filtros
                </button>
              )}
            </div>

            {/* Score */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Score</p>
              <div className="flex flex-wrap gap-2">
                {SCORES.map(s => (
                  <Pill
                    key={s} label={s}
                    active={activeScores.includes(s)}
                    color={s === 'Quente' ? 'red' : s === 'Morno' ? 'amber' : 'blue'}
                    onClick={() => toggleFilter(activeScores, setActiveScores, s)}
                  />
                ))}
              </div>
            </div>

            {/* Programa */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Programa</p>
              <div className="flex flex-wrap gap-2">
                {PROGRAMS.map(p => (
                  <Pill key={p} label={p} active={activePrograms.includes(p)}
                    onClick={() => toggleFilter(activePrograms, setActivePrograms, p)} />
                ))}
              </div>
            </div>

            {/* Origem */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Origem</p>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map(s => (
                  <Pill key={s} label={s} active={activeSources.includes(s)}
                    onClick={() => toggleFilter(activeSources, setActiveSources, s)} />
                ))}
              </div>
            </div>

            {/* Toggle perdidos */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
              <div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Mostrar leads perdidos</p>
                <p className="text-[10px] text-slate-400">Exibe leads desqualificados no Kanban</p>
              </div>
              <button
                onClick={() => setShowLost(v => !v)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${showLost ? 'bg-red-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${showLost ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            {/* Resumo */}
            {totalActiveFilters > 0 && (
              <p className="text-xs text-slate-400 pt-1 border-t border-slate-50 dark:border-slate-800">
                Mostrando <strong className="text-slate-700 dark:text-slate-200">{filteredLeads.length}</strong> de {leads.length} leads
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barra de busca */}
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
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="h-6 w-[1px] bg-slate-100 dark:bg-slate-800" />
        <div className="flex p-1 bg-slate-50 dark:bg-slate-950 rounded-xl">
          <button onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-red-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <LayoutGrid size={18} />
          </button>
          <button onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-red-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex-1 overflow-x-auto pb-6">
          <KanbanSkeleton />
        </div>
      )}

      {/* Vista em Lista */}
      {!loading && viewMode === 'list' && (
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredLeads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <p className="text-sm font-medium">Nenhum lead encontrado</p>
            </div>
          )}
          {filteredLeads.map(lead => {
            const scoreColor = lead.score === 'Quente' ? 'bg-red-600' : lead.score === 'Morno' ? 'bg-amber-500' : 'bg-blue-500';
            const statusLabel = columns.find(c => c.id === lead.status)?.label ?? lead.status;
            return (
              <div key={lead.id}
                onClick={() => { setSelectedLeadId(lead.id); setCurrentView(ViewState.LEAD_DETAIL); }}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-red-200 dark:hover:border-red-800 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 font-bold flex items-center justify-center text-sm shrink-0">
                  {lead.responsibleName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{lead.responsibleName}</p>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded text-white uppercase ${scoreColor}`}>{lead.score}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{lead.childName} · {lead.program}</p>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-xs text-slate-400">
                  <span className="font-medium">{lead.origin}</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">{statusLabel}</span>
                  <span>{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Kanban */}
      {!loading && viewMode === 'grid' && (
      <div className="flex-1 overflow-x-auto pb-6 scrollbar-thin">
        <div className="flex gap-6 min-w-[1400px] h-full">
          {columns.map((column) => (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`flex-1 flex flex-col min-w-[240px] rounded-2xl transition-all duration-300
                ${dragOverColumn === column.id
                  ? 'bg-red-600/5 ring-2 ring-red-600/20 ring-inset'
                  : 'bg-slate-50/50 dark:bg-slate-900/40'
                }`}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                  <h3 className="font-display font-bold text-sm tracking-tight dark:text-white">{column.label}</h3>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {filteredLeads.filter(l => l.status === column.id).length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
                <AnimatePresence>
                  {filteredLeads
                    .filter(l => l.status === column.id)
                    .map((lead) => (
                      <motion.div
                        key={lead.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <LeadCard
                          lead={lead}
                          onDragStart={(e) => e.dataTransfer.setData('leadId', lead.id)}
                          onViewClick={() => {}}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>

                {filteredLeads.filter(l => l.status === column.id).length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center p-4 text-center">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed">
                      {totalActiveFilters > 0 ? 'Sem resultados' : 'Nenhum lead nesta etapa'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

    </div>

    {showNewLead && <NewLeadModal onClose={() => setShowNewLead(false)} />}
    </>
  );
};
