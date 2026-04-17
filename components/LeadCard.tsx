import React from 'react';
import { Calendar, Clock, MoreHorizontal, Bot, Eye } from 'lucide-react';
import { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onViewClick: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onDragStart, onViewClick }) => {
  
  const getSourceStyle = (source: string) => {
    switch (source) {
      case 'Facebook Ads':
        return { backgroundColor: '#0064E0', color: 'white' }; // Facebook Blue
      case 'Google Ads':
        return { backgroundColor: '#0F9D58', color: 'white' }; // Google Green
      case 'Instagram':
        return { background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white' };
      case 'Google Meu Negócio':
        return { backgroundColor: '#64748b', color: 'white' }; // Grayish Green / Slate
      default:
        return { backgroundColor: '#94a3b8', color: 'white' }; // Generic
    }
  };

  return (
    <div 
      draggable 
      onDragStart={(e) => onDragStart(e, lead.id)}
      className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group mb-2 border-l-[3px] border-l-red-600 relative"
    >
      {/* Header: Name and Actions */}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate pr-1 flex-1" title={lead.name}>
          {lead.name}
        </h4>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-slate-300 dark:text-slate-600 font-mono select-none">#{lead.id}</span>
          
          <button 
            onClick={() => onViewClick(lead)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Ver Detalhes"
          >
            <Eye size={14} />
          </button>
          
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
      
      {/* Child Info */}
      <div className="text-xs text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-1.5">
        <span className="font-bold text-slate-800 dark:text-slate-200">{lead.childName}</span>
        <span className="text-slate-300">•</span>
        <span className="font-medium">{lead.childAge} anos</span>
      </div>

      {/* Program */}
      <div className="mb-3">
        <span className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100 dark:border-red-800/50">
          {lead.program}
        </span>
      </div>

      {/* Dates */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400" title="Data de chegada">
          <Calendar size={10} className="text-slate-400 shrink-0" />
          <span>Chegou: {new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400" title="Última mensagem">
          <Clock size={10} className="text-slate-400 shrink-0" />
          <span>Última Msg: {new Date(lead.lastContactAt).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* Footer: Source and Agent */}
      <div className="flex items-center justify-between gap-2 mt-2">
        <div 
          className="text-[8px] font-bold px-1.5 py-0.5 rounded-sm text-center truncate flex-1 uppercase tracking-wider"
          style={getSourceStyle(lead.source)}
        >
          {lead.source}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[9px] font-medium text-slate-600 dark:text-slate-300 shrink-0 border border-slate-200 dark:border-slate-600" title="Atendido por Agente IA">
          <Bot size={10} className="text-purple-600 dark:text-purple-400" />
          <span>Via Agente</span>
        </div>
      </div>
    </div>
  );
};