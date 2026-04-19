import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Lead } from '../types';

interface Props {
  lead: Lead;
  onClose:   () => void;
  onSuccess: () => void;
}

const HORARIOS = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30',
];

export const AgendarModal: React.FC<Props> = ({ lead, onClose, onSuccess }) => {
  const [date,     setDate]     = useState('');
  const [time,     setTime]     = useState('');
  const [visitors, setVisitors] = useState(lead.responsibleName);
  const [notes,    setNotes]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  // Mínimo: hoje
  const today = new Date().toISOString().split('T')[0];

  // Bloquear fins de semana no label
  const isWeekend = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr + 'T12:00:00');
    return d.getDay() === 0 || d.getDay() === 6;
  };

  const handleConfirm = async () => {
    if (!date)     { setError('Selecione a data da visita.');  return; }
    if (!time)     { setError('Selecione o horário.');         return; }
    if (isWeekend(date)) { setError('Visitas apenas em dias úteis (seg-sex).'); return; }
    setError('');
    setLoading(true);

    // 1. Atualizar lead no banco
    const { error: updateErr } = await supabase
      .from('leads')
      .update({
        status:          'Agendado',
        visit_date:      date,
        visit_time:      time,
        owner:           visitors,
        last_contact_at: new Date().toISOString(),
      })
      .eq('id', lead.id);

    if (updateErr) {
      setError('Erro ao salvar agendamento. Tente novamente.');
      setLoading(false);
      return;
    }

    // 2. Registrar na linha do tempo
    const dateFormatted = new Date(date + 'T12:00:00').toLocaleDateString('pt-BR');
    await supabase.from('lead_history').insert({
      lead_id: lead.id,
      type:    'system',
      action:  `Visita agendada para ${dateFormatted} às ${time}`,
      detail:  visitors !== lead.responsibleName
        ? `Visitantes: ${visitors}${notes ? ` · Obs: ${notes}` : ''}`
        : notes || null,
    });

    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1500);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <p className="font-display font-bold text-lg dark:text-white">Visita agendada!</p>
          <p className="text-sm text-slate-400">
            {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR')} às {time}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
              <Calendar size={18} className="text-red-600" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base dark:text-white">Agendar Visita</h2>
              <p className="text-xs text-slate-400">{lead.responsibleName} · {lead.childName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Data */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar size={11} /> Data da Visita *
            </label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={e => { setDate(e.target.value); setError(''); }}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all"
            />
            {date && isWeekend(date) && (
              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                <AlertCircle size={11} /> Fim de semana — selecione um dia útil.
              </p>
            )}
          </div>

          {/* Horário */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock size={11} /> Horário *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {HORARIOS.map(h => (
                <button
                  key={h}
                  onClick={() => setTime(h)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border
                    ${time === h
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-red-200 hover:bg-red-50'
                    }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Visitantes */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users size={11} /> Quem vai na visita
            </label>
            <input
              type="text"
              value={visitors}
              onChange={e => setVisitors(e.target.value)}
              placeholder="Ex: Ana Souza e marido"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all"
            />
          </div>

          {/* Observação */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Observação (opcional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Lead perguntou sobre turno integral..."
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all resize-none"
            />
          </div>

          {/* Erro */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
              <AlertCircle size={14} className="text-red-600 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Resumo */}
          {date && time && !isWeekend(date) && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">Resumo do agendamento</p>
              <p className="text-sm font-semibold dark:text-white">
                {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} às {time}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{visitors}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !date || !time || isWeekend(date)}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Salvando...</> : <><Calendar size={14} /> Confirmar Visita</>}
          </button>
        </div>

      </div>
    </div>
  );
};
