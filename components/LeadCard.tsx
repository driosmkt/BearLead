import React from 'react';
import { Lead, LeadScore } from '../types';
import { 
  Phone, 
  MessageSquare, 
  Clock, 
  Flame,
  User,
  ArrowRight
} from 'lucide-react';
import { useLeadsContext } from '../context/LeadsContext';
import { ViewState } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const { setSelectedLeadId, setCurrentView } = useLeadsContext();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('leadId', lead.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const getScoreColor = (score: LeadScore) => {
    switch (score) {
      case 'Quente': return 'bg-rose-500';
      case 'Morno': return 'bg-amber-500';
      case 'Frio': return 'bg-cyan-500';
      default: return 'bg-slate-400';
    }
  };

  const getProgramBadge = (program: string) => {
    const p = program.toLowerCase();
    if (p.includes('toddler')) return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300';
    if (p.includes('nursery')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
    if (p.includes('kindergarten')) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onClick={() => {
        setSelectedLeadId(lead.id);
        setCurrentView(ViewState.LEAD_DETAIL);
      }}
      className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider", getScoreColor(lead.score))}>
          {lead.score}
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <Flame 
              key={i} 
              size={12} 
              className={i < lead.engagement ? 'text-primary fill-primary' : 'text-slate-200 dark:text-slate-800'} 
            />
          ))}
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <h4 className="text-sm font-bold dark:text-white group-hover:text-primary transition-colors truncate">{lead.responsibleName}</h4>
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
          <User size={12} />
          <p className="text-[11px] font-medium truncate">{lead.childName}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-tight", getProgramBadge(lead.program))}>
          {lead.program}
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-tight">
          {lead.origin}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800/50">
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
            <Phone size={14} />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
            <MessageSquare size={14} />
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-primary transition-colors">
          <Clock size={12} />
          <span className="text-[10px] font-medium">
            {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
