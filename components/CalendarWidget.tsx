import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useLeadsContext } from '../context/LeadsContext';
import { ViewState, Lead } from '../types';

const DAYS   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const ALL_TIMES = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30',
];

function assignTime(leadId: string): string {
  const num = parseInt(leadId.replace(/\D/g, '')) || 0;
  return ALL_TIMES[num % ALL_TIMES.length];
}

function distributeLeadsOnDays(leads: Lead[], month: number, year: number): Record<number, Lead[]> {
  const result: Record<number, Lead[]> = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  leads.forEach(lead => {
    const num = parseInt(lead.id.replace(/\D/g, '')) || 0;
    const day = (num % daysInMonth) + 1;
    if (!result[day]) result[day] = [];
    result[day].push(lead);
  });
  Object.keys(result).forEach(day => {
    result[Number(day)].sort((a, b) =>
      assignTime(a.id).localeCompare(assignTime(b.id))
    );
  });
  return result;
}

export const CalendarWidget: React.FC = () => {
  const today = new Date();
  const [current, setCurrent] = useState({ month: today.getMonth(), year: today.getFullYear() });
  const [tooltip, setTooltip] = useState<{ day: number; leads: Lead[] } | null>(null);
  const leaveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = (day: number, leads: Lead[]) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setTooltip({ day, leads });
  };

  const hideTooltip = () => {
    leaveTimer.current = setTimeout(() => setTooltip(null), 150);
  };

  const { leads, setCurrentView, setSelectedLeadId } = useLeadsContext();
  const scheduledLeads = leads.filter(l => l.status === 'Agendado');
  const leadsByDay     = distributeLeadsOnDays(scheduledLeads, current.month, current.year);

  const firstDay    = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const isToday     = (d: number) =>
    d === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();

  const prev = () => setCurrent(c => c.month === 0  ? { month: 11, year: c.year - 1 } : { month: c.month - 1, year: c.year });
  const next = () => setCurrent(c => c.month === 11 ? { month: 0,  year: c.year + 1 } : { month: c.month + 1, year: c.year });

  const goToLead = (lead: Lead) => {
    setTooltip(null);
    setSelectedLeadId(lead.id);
    setCurrentView(ViewState.LEAD_DETAIL);
  };

  return (
    <div className="card-glass p-6 flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-red-600" />
          <h3 className="font-display font-bold text-sm dark:text-white">Calendário</h3>
        </div>
        <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
          {scheduledLeads.length} agendamentos
        </span>
      </div>

      {/* Navegação mês */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-bold text-slate-800 dark:text-white">
          {MONTHS[current.month]} {current.year}
        </span>
        <button onClick={next} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Grid — células que preenchem o espaço disponível */}
      <div className="flex-1 flex flex-col">
        {/* Cabeçalhos dos dias */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => (
            <div key={d} className="text-[10px] font-bold text-slate-400 dark:text-slate-600 text-center pb-1">{d}</div>
          ))}
        </div>

        {/* Semanas — flex-1 para preencher altura */}
        <div className="grid grid-cols-7 flex-1 gap-1" style={{ gridTemplateRows: 'repeat(6, 1fr)' }}>

          {/* Células vazias antes do dia 1 */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}

          {/* Dias do mês */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
            const dayLeads = leadsByDay[d] || [];
            const hasLeads = dayLeads.length > 0;
            const open     = tooltip?.day === d;

            return (
              <div
                key={d}
                className="relative"
                onMouseEnter={() => hasLeads && showTooltip(d, dayLeads)}
                onMouseLeave={hideTooltip}
              >
                <div className={`w-full h-full min-h-[36px] flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer text-xs font-semibold
                  ${isToday(d)
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : hasLeads
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 ring-1 ring-blue-200 dark:ring-blue-800/50'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{d}</span>
                  {hasLeads && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayLeads.slice(0, Math.min(dayLeads.length, 3)).map((_, i) => (
                        <div key={i} className={`w-1 h-1 rounded-full ${isToday(d) ? 'bg-white/70' : 'bg-blue-400'}`} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Tooltip clicável com agendamentos ordenados */}
                {open && (
                  <div
                    className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-2xl p-3 text-left"
                    style={{ width: '230px', minWidth: '200px' }}
                    onMouseEnter={() => showTooltip(d, dayLeads)}
                    onMouseLeave={hideTooltip}
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                      {d} de {MONTHS[current.month]} · {dayLeads.length} agendamento{dayLeads.length > 1 ? 's' : ''}
                    </p>
                    <div className="space-y-1">
                      {dayLeads.map(lead => {
                        const time      = assignTime(lead.id);
                        const isMorning = parseInt(time.split(':')[0]) < 12;
                        return (
                          <button
                            key={lead.id}
                            onClick={() => goToLead(lead)}
                            className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left group"
                          >
                            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {lead.responsibleName.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-red-600 transition-colors">
                                {lead.responsibleName}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">{lead.childName} · {lead.program}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Clock size={9} className={isMorning ? 'text-amber-500' : 'text-blue-500'} />
                              <span className={`text-[10px] font-bold ${isMorning ? 'text-amber-600' : 'text-blue-600'}`}>{time}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[9px] text-slate-300 dark:text-slate-600 text-center mt-2 pt-1.5 border-t border-slate-50 dark:border-slate-700">
                      Clique no nome para abrir o lead
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
