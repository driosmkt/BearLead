import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarWidget: React.FC = () => {
  const days = [
    { d: 'Dom', inactive: false },
    { d: 'Seg', inactive: false },
    { d: 'Ter', inactive: false },
    { d: 'Qua', inactive: false },
    { d: 'Qui', inactive: false },
    { d: 'Sex', inactive: false },
    { d: 'Sáb', inactive: false },
  ];

  const dates = [
    { day: '', inactive: true }, // Spacer
    { day: 1, inactive: false },
    { day: 2, inactive: false },
    { day: 3, inactive: false },
    { day: 4, inactive: false },
    { day: 5, inactive: false, active: true }, // The red one
    { day: 6, inactive: false },
    { day: 7, inactive: false },
    { day: 8, inactive: false },
    { day: 9, inactive: false },
    { day: 10, inactive: false },
    { day: 11, inactive: false },
    { day: 12, inactive: false },
    { day: 13, inactive: false },
    { day: 14, inactive: false },
    { day: 15, inactive: false },
    { day: 16, inactive: false },
    { day: 17, inactive: false },
    { day: 18, inactive: false },
    { day: 19, inactive: false },
    { day: 20, inactive: false },
    { day: 21, inactive: false },
    { day: 22, inactive: false },
    { day: 23, inactive: false },
    { day: 24, inactive: false },
    { day: 25, inactive: false },
    { day: 26, inactive: false },
    { day: 27, inactive: false },
    { day: 28, inactive: false },
    { day: 29, inactive: false },
    { day: 30, inactive: false },
    { day: 31, inactive: false },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full transition-colors duration-200">
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span className="text-red-500 text-lg">📅</span> Calendário
        </h3>
        <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          12 agendamentos
        </span>
      </div>

      <div className="mb-6">
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">Agenda de visitas da semana</p>
        <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Agendados (5)
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Realizados (4)
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div> Cancelados (1)
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div> Reagendados (2)
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 px-2">
        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
          <ChevronLeft size={20} />
        </button>
        <span className="font-bold text-slate-800 dark:text-white">Dezembro De 2025</span>
        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day, i) => (
          <div key={i} className="text-xs font-medium text-slate-400 py-2">
            {day.d}
          </div>
        ))}
        {dates.map((date, i) => (
          <div 
            key={i} 
            className={`
              h-10 w-full flex items-center justify-center text-sm rounded-lg
              ${date.day === '' ? 'invisible' : ''}
              ${date.active ? 'bg-red-700 text-white font-bold shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700'}
            `}
          >
            {date.day}
          </div>
        ))}
      </div>
    </div>
  );
};