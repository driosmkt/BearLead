import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search,
  Filter
} from 'lucide-react';
import { Lead, LeadStatus, LeadScore } from '../types';
import { LeadCard } from '../components/LeadCard';

// Updated Dummy Data with 30 leads to simulate volume
const baseLeads: Lead[] = [
  // Novo Lead
  { id: '1', name: 'Douglas Rios', childName: 'Isa', childAge: 2, program: 'Bear Care', status: 'Novo Lead', createdAt: '2023-12-06', lastContactAt: '2023-12-06', source: 'Facebook Ads' },
  { id: '2', name: 'Mariana Silva', childName: 'Pedro', childAge: 4, program: 'Kindergarten', status: 'Novo Lead', createdAt: '2023-12-06', lastContactAt: '2023-12-06', source: 'Instagram' },
  { id: '9', name: 'Amanda Nunes', childName: 'Clara', childAge: 2, program: 'Bear Care', status: 'Novo Lead', createdAt: '2023-12-06', lastContactAt: '2023-12-06', source: 'Facebook Ads' },
  { id: '10', name: 'Bruno Torres', childName: 'Miguel', childAge: 3, program: 'Toddler', status: 'Novo Lead', createdAt: '2023-12-05', lastContactAt: '2023-12-05', source: 'Google Ads' },
  { id: '11', name: 'Carla Dias', childName: 'Alice', childAge: 2, program: 'Bear Care', status: 'Novo Lead', createdAt: '2023-12-05', lastContactAt: '2023-12-05', source: 'Instagram' },
  { id: '12', name: 'Daniel Costa', childName: 'Theo', childAge: 4, program: 'Kindergarten', status: 'Novo Lead', createdAt: '2023-12-05', lastContactAt: '2023-12-05', source: 'Google Meu Negócio' },

  // Em atendimento
  { id: '3', name: 'Carlos Andrade', childName: 'Lucas', childAge: 3, program: 'Toddler', status: 'Em atendimento', createdAt: '2023-11-28', lastContactAt: '2023-12-05', source: 'Google Ads' },
  { id: '4', name: 'Fernanda Costa', childName: 'Sofia', childAge: 2, program: 'Bear Care', status: 'Em atendimento', createdAt: '2023-11-25', lastContactAt: '2023-12-03', source: 'Facebook Ads' },
  { id: '13', name: 'Eduarda Lima', childName: 'Valentina', childAge: 3, program: 'Toddler', status: 'Em atendimento', createdAt: '2023-12-01', lastContactAt: '2023-12-04', source: 'Instagram' },
  { id: '14', name: 'Felipe Santos', childName: 'Gabriel', childAge: 5, program: 'Kindergarten', status: 'Em atendimento', createdAt: '2023-12-02', lastContactAt: '2023-12-04', source: 'Google Ads' },
  { id: '15', name: 'Gabriela Alves', childName: 'Helena', childAge: 2, program: 'Bear Care', status: 'Em atendimento', createdAt: '2023-11-30', lastContactAt: '2023-12-04', source: 'Facebook Ads' },

  // Agendado
  { id: '5', name: 'Roberto Lima', childName: 'João', childAge: 5, program: 'Kindergarten', status: 'Agendado', createdAt: '2023-11-20', lastContactAt: '2023-12-01', source: 'Google Meu Negócio' },
  { id: '16', name: 'Henrique Gomes', childName: 'Matheus', childAge: 4, program: 'Kindergarten', status: 'Agendado', createdAt: '2023-11-22', lastContactAt: '2023-12-02', source: 'Google Ads' },
  { id: '17', name: 'Isabela Martins', childName: 'Laura', childAge: 3, program: 'Toddler', status: 'Agendado', createdAt: '2023-11-25', lastContactAt: '2023-12-03', source: 'Instagram' },
  { id: '18', name: 'Jorge Pereira', childName: 'Davi', childAge: 2, program: 'Bear Care', status: 'Agendado', createdAt: '2023-11-26', lastContactAt: '2023-12-03', source: 'Facebook Ads' },
  { id: '19', name: 'Karen Souza', childName: 'Manuela', childAge: 5, program: 'Kindergarten', status: 'Agendado', createdAt: '2023-11-24', lastContactAt: '2023-12-03', source: 'Google Meu Negócio' },

  // Visitou
  { id: '6', name: 'Patricia Dias', childName: 'Ana', childAge: 2, program: 'Bear Care', status: 'Visitou', createdAt: '2023-11-15', lastContactAt: '2023-11-18', source: 'Facebook Ads' },
  { id: '20', name: 'Lucas Ferreira', childName: 'Samuel', childAge: 3, program: 'Toddler', status: 'Visitou', createdAt: '2023-11-10', lastContactAt: '2023-11-15', source: 'Google Ads' },
  { id: '21', name: 'Marina Ribeiro', childName: 'Julia', childAge: 4, program: 'Kindergarten', status: 'Visitou', createdAt: '2023-11-12', lastContactAt: '2023-11-16', source: 'Instagram' },
  { id: '22', name: 'Nicolas Barbosa', childName: 'Benício', childAge: 2, program: 'Bear Care', status: 'Visitou', createdAt: '2023-11-14', lastContactAt: '2023-11-17', source: 'Google Meu Negócio' },
  
  // Matriculado
  { id: '7', name: 'Camila Rocha', childName: 'Bia', childAge: 3, program: 'Toddler', status: 'Matriculado', createdAt: '2023-11-10', lastContactAt: '2023-11-12', source: 'Instagram' },
  { id: '23', name: 'Olivia Castro', childName: 'Livia', childAge: 5, program: 'Kindergarten', status: 'Matriculado', createdAt: '2023-11-01', lastContactAt: '2023-11-05', source: 'Google Ads' },
  { id: '24', name: 'Paulo Mendes', childName: 'Heitor', childAge: 2, program: 'Bear Care', status: 'Matriculado', createdAt: '2023-11-05', lastContactAt: '2023-11-08', source: 'Facebook Ads' },
  { id: '25', name: 'Quezia Ramos', childName: 'Lorena', childAge: 3, program: 'Toddler', status: 'Matriculado', createdAt: '2023-11-03', lastContactAt: '2023-11-07', source: 'Google Meu Negócio' },
  { id: '26', name: 'Rafael Carvalho', childName: 'Enzo', childAge: 4, program: 'Kindergarten', status: 'Matriculado', createdAt: '2023-11-02', lastContactAt: '2023-11-06', source: 'Instagram' },

  // Follow-up
  { id: '8', name: 'Fernando Souza', childName: 'Leo', childAge: 4, program: 'Kindergarten', status: 'Follow-up Recuperação', createdAt: '2023-11-05', lastContactAt: '2023-12-04', source: 'Facebook Ads' },
  { id: '27', name: 'Sabrina Vieira', childName: 'Cecília', childAge: 2, program: 'Bear Care', status: 'Follow-up Recuperação', createdAt: '2023-10-20', lastContactAt: '2023-12-01', source: 'Google Ads' },
  { id: '28', name: 'Thiago Nogueira', childName: 'Lucca', childAge: 3, program: 'Toddler', status: 'Follow-up Recuperação', createdAt: '2023-10-25', lastContactAt: '2023-12-02', source: 'Instagram' },
  { id: '29', name: 'Ursula Pinto', childName: 'Maitê', childAge: 4, program: 'Kindergarten', status: 'Follow-up Recuperação', createdAt: '2023-10-28', lastContactAt: '2023-12-03', source: 'Google Meu Negócio' },
  { id: '30', name: 'Vinicius Correia', childName: 'Gael', childAge: 2, program: 'Bear Care', status: 'Follow-up Recuperação', createdAt: '2023-10-30', lastContactAt: '2023-12-05', source: 'Facebook Ads' },
];

const scores: LeadScore[] = ['Quente', 'Morno', 'Frio'];
const owners = ['Ana (Comercial)', 'Beatriz (Comercial)', 'Carlos (Coordenação)'];
const bestTimes = ['Manhã (08h-11h)', 'Tarde (14h-17h)', 'Noite (18h-20h)'];
const nextActions = ['Agendar Visita', 'Enviar Apresentação', 'Confirmar Presença', 'Follow-up WhatsApp'];

// Enrich leads with details
const initialLeads: Lead[] = baseLeads.map((lead, index) => ({
  ...lead,
  whatsapp: `(11) 9${Math.floor(Math.random() * 90000 + 10000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
  summary: `Responsável demonstrou interesse no programa ${lead.program}. Questionou sobre valores e horários. O agente IA forneceu as informações iniciais e sugeriu agendamento.`,
  // New premium fields
  score: lead.status === 'Agendado' || lead.status === 'Matriculado' ? 'Quente' : scores[Math.floor(Math.random() * scores.length)],
  owner: owners[Math.floor(Math.random() * owners.length)],
  bestTime: bestTimes[Math.floor(Math.random() * bestTimes.length)],
  nextAction: nextActions[Math.floor(Math.random() * nextActions.length)],
  probability: lead.status === 'Matriculado' ? '100%' : `${Math.floor(Math.random() * 60 + 30)}%`,
  interactionsCount: Math.floor(Math.random() * 15 + 2),
  siblings: Math.random() > 0.8 ? [{ name: 'Lucas', age: 7, status: 'Matriculado' }] : [],
  history: [
    { date: 'Hoje, 14:00', action: 'Lead moveu de status', user: 'Sistema', type: 'system', detail: `Alterado de "Novo Lead" para "${lead.status}"` },
    { date: 'Hoje, 10:30', action: 'IA respondeu dúvidas', user: 'Agente IA', type: 'ai', detail: 'Explicou sobre alimentação e horários estendidos.' },
    { date: 'Ontem, 19:15', action: 'Lead enviou áudio', user: 'Lead', type: 'message', detail: 'Audio (0:45s) perguntando sobre valores.' },
    { date: 'Ontem, 19:00', action: 'Lead iniciou contato', user: 'Lead', type: 'message', detail: 'Olá, gostaria de saber mais sobre a escola.' }
  ]
}));

// New Columns Configuration
const columns: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'Novo Lead', label: 'Novo Lead', color: 'border-t-4 border-t-blue-500' },
  { id: 'Em atendimento', label: 'Em Atendimento', color: 'border-t-4 border-t-amber-500' },
  { id: 'Agendado', label: 'Agendado', color: 'border-t-4 border-t-cyan-500' },
  { id: 'Visitou', label: 'Visitou', color: 'border-t-4 border-t-purple-500' },
  { id: 'Matriculado', label: 'Matriculado', color: 'border-t-4 border-t-emerald-500' },
  { id: 'Follow-up Recuperação', label: 'Follow-up', color: 'border-t-4 border-t-red-500' },
];

interface LeadsViewProps {
  onSelectLead?: (lead: Lead) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({ onSelectLead }) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial counts for delta calculation
  const initialCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialLeads.forEach(l => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return counts;
  }, []);

  const baseMetrics = {
    total: 1250,
    qualified: 620,
    scheduled: 310,
    enrolled: 150
  };

  const getLiveMetrics = () => {
    const currentCounts: Record<string, number> = {};
    leads.forEach(l => {
      currentCounts[l.status] = (currentCounts[l.status] || 0) + 1;
    });

    const getDelta = (status: string) => (currentCounts[status] || 0) - (initialCounts[status] || 0);

    return {
      total: baseMetrics.total + (leads.length - initialLeads.length),
      qualified: baseMetrics.qualified + getDelta('Em atendimento'), // Mapping 'Em atendimento' to Qualified loosely for demo
      scheduled: baseMetrics.scheduled + getDelta('Agendado'),
      enrolled: baseMetrics.enrolled + getDelta('Matriculado')
    };
  };

  const metrics = getLiveMetrics();

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('leadId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, status };
      }
      return lead;
    }));
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.childName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Central de Leads</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Fluxo de matrículas em tempo real</p>
        </div>

        {/* Metrics Row - Compact */}
        <div className="hidden lg:flex gap-4">
           <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Total</span>
              <span className="text-lg font-bold text-slate-800 dark:text-white">{metrics.total}</span>
           </div>
           <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Agendados</span>
              <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{metrics.scheduled}</span>
           </div>
           <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Matriculados</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{metrics.enrolled}</span>
           </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Buscar lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <button className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap">
            <Plus size={16} />
            Novo
          </button>
        </div>
      </div>

      {/* Kanban Board - Responsive */}
      {/* Mobile: Horizontal Scroll (snap to cards) */}
      {/* Desktop: Fixed Grid */}
      <div className="flex-1 min-h-0 bg-slate-100 dark:bg-slate-900/50 rounded-xl p-2 border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-x-auto lg:overflow-visible no-scrollbar pb-2">
           <div className="flex lg:grid lg:grid-cols-6 gap-2 h-full min-w-[max-content] lg:min-w-0">
             {columns.map(column => {
                const columnLeads = filteredLeads.filter(l => l.status === column.id);
                
                return (
                  <div 
                   key={column.id}
                   onDragOver={handleDragOver}
                   onDrop={(e) => handleDrop(e, column.id)}
                   className={`
                     w-[280px] lg:w-auto shrink-0 
                     bg-slate-50 dark:bg-slate-800 rounded-lg flex flex-col h-full 
                     border border-slate-200 dark:border-slate-700 ${column.color}
                   `}
                  >
                    {/* Column Header */}
                    <div className="p-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 rounded-t-lg">
                      <span className="font-bold text-slate-700 dark:text-slate-200 text-xs truncate" title={column.label}>
                        {column.label}
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {columnLeads.length}
                      </span>
                    </div>

                    {/* Drop Zone */}
                    <div className="p-2 flex-1 overflow-y-auto overflow-x-hidden">
                      {columnLeads.map(lead => (
                        <LeadCard 
                           key={lead.id} 
                           lead={lead} 
                           onDragStart={handleDragStart}
                           onViewClick={() => onSelectLead && onSelectLead(lead)}
                        />
                      ))}
                      {columnLeads.length === 0 && (
                        <div className="h-full flex items-center justify-center text-slate-300 dark:text-slate-600 text-xs italic">
                          Vazio
                        </div>
                      )}
                    </div>
                  </div>
                );
             })}
           </div>
        </div>
        {/* Mobile instruction text */}
        <div className="lg:hidden text-center text-[10px] text-slate-400 mt-1">
           Arraste para o lado para ver mais etapas
        </div>
      </div>
    </div>
  );
};