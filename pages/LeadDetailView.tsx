import React, { useState } from 'react';
import { useLeadsContext } from '../context/LeadsContext';
import { ViewState, LeadStatus } from '../types';
import {
  ArrowLeft, Phone, Mail, MessageCircle, Calendar,
  CheckCircle2, AlertCircle, Clock, Send, Trash2,
  FileText, User, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AgendarModal } from '../components/AgendarModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const LeadDetailView: React.FC = () => {
  const { leads, selectedLeadId, setCurrentView, updateLeadStatus, addNote } = useLeadsContext();
  const [noteContent,     setNoteContent]     = useState('');
  const [noteSaved,       setNoteSaved]        = useState(false);
  const [showDeleteModal, setShowDeleteModal]  = useState(false);
  const [showAgendar,     setShowAgendar]      = useState(false);

  const lead = leads.find(l => l.id === selectedLeadId);

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle size={40} className="text-slate-300" />
        <p className="text-slate-500 font-medium">Lead não encontrado.</p>
        <button onClick={() => setCurrentView(ViewState.LEADS)}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold">
          Voltar para os Leads
        </button>
      </div>
    );
  }

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    addNote(lead.id, noteContent);
    setNoteContent('');
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  const handleCall      = () => { const p = (lead.whatsapp || '').replace(/\D/g,''); if (p) window.location.href = `tel:+55${p}`; };
  const handleWhatsApp  = () => { const w = (lead.whatsapp || '').replace(/\D/g,''); if (w) window.open(`https://wa.me/55${w}`,'_blank'); else alert('WhatsApp não cadastrado.'); };
  const handleEmail     = () => { if (lead.email) window.location.href = `mailto:${lead.email}`; else alert('E-mail não cadastrado.'); };

  const STEPS: { label: string; status: LeadStatus }[] = [
    { label: 'Novo',        status: 'Novo Lead'       },
    { label: 'Contato',     status: 'Em Atendimento'  },
    { label: 'Agendado',    status: 'Agendado'         },
    { label: 'Visitou',     status: 'Visitou'          },
    { label: 'Matriculado', status: 'Matriculado'      },
  ];
  const stepIdx = Math.max(0, STEPS.findIndex(s => s.status === lead.status));

  const scoreColor = lead.score === 'Quente' ? 'bg-red-600' : lead.score === 'Morno' ? 'bg-amber-500' : 'bg-blue-500';

  return (
    <div className="space-y-6 animate-fade-in pb-16">

      {/* ── Topo: voltar + nome + ações ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView(ViewState.LEADS)}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 hover:text-red-600 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-display font-black dark:text-white uppercase tracking-tight">{lead.responsibleName}</h2>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black text-white uppercase tracking-widest ${scoreColor}`}>
                {lead.score}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              Lead registrado em {format(new Date(lead.createdAt), "dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowDeleteModal(true)}
            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => { updateLeadStatus(lead.id, 'Matriculado'); setCurrentView(ViewState.LEADS); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all text-sm">
            <CheckCircle2 size={16} /> Matricular Agora
          </button>
        </div>
      </div>

      {/* ── LINHA 1: Dados do Lead + Ações Rápidas + Resumo IA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Dados do Lead — 5 colunas */}
        <div className="lg:col-span-5 card-glass p-6">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-1.5">
            <User size={12} /> Dados do Lead
          </h3>

          {/* Avatar + contatos */}
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-50 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-100 to-rose-200 dark:from-red-900/30 dark:to-rose-800/30 flex items-center justify-center font-display font-black text-2xl text-red-600 shrink-0">
              {lead.responsibleName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-900 dark:text-white truncate text-base">{lead.responsibleName}</p>
              <button onClick={handleWhatsApp} className="text-xs text-emerald-600 hover:underline flex items-center gap-1 mt-0.5">
                <MessageCircle size={11} /> {lead.whatsapp}
              </button>
              {lead.email && (
                <button onClick={handleEmail} className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                  <Mail size={11} /> {lead.email}
                </button>
              )}
            </div>
          </div>

          {/* Grid de dados */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Criança</p>
              <p className="text-sm font-semibold dark:text-slate-200">{lead.childName}</p>
              <p className="text-xs text-slate-400">{lead.childAge} anos</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Programa</p>
              <span className="text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-1 rounded-lg uppercase tracking-wide">
                {lead.program}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Origem</p>
              <p className="text-sm font-semibold dark:text-slate-200">{lead.origin}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                <p className="text-sm font-semibold dark:text-slate-200">{lead.status}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Última Interação</p>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Clock size={12} />
                <p className="text-xs font-medium">
                  {format(new Date(lead.lastInteraction), "dd/MM/yyyy 'às' HH:mm")}
                </p>
              </div>
            </div>
            {lead.nextAction && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Próxima Ação</p>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">{lead.nextAction}</p>
              </div>
            )}
          </div>
        </div>

        {/* Ações Rápidas — 3 colunas */}
        <div className="lg:col-span-3 card-glass p-6 flex flex-col">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-1.5">
            <Zap size={12} /> Ações Rápidas
          </h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <button onClick={handleCall}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all group">
              <Phone size={22} className="group-hover:scale-110 transition-transform" strokeWidth={2} />
              <span className="text-[10px] font-bold uppercase tracking-wide">Ligar</span>
            </button>
            <button onClick={handleWhatsApp}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-green-200 hover:bg-green-50 dark:hover:bg-green-900/10 text-slate-600 dark:text-slate-300 hover:text-green-600 transition-all group">
              <MessageCircle size={22} className="group-hover:scale-110 transition-transform" strokeWidth={2} />
              <span className="text-[10px] font-bold uppercase tracking-wide">WhatsApp</span>
            </button>
            <button onClick={handleEmail}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/10 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all group">
              <Mail size={22} className="group-hover:scale-110 transition-transform" strokeWidth={2} />
              <span className="text-[10px] font-bold uppercase tracking-wide">E-mail</span>
            </button>
            <button onClick={() => setShowAgendar(true)}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/10 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-all group">
              <Calendar size={22} className="group-hover:scale-110 transition-transform" strokeWidth={2} />
              <span className="text-[10px] font-bold uppercase tracking-wide">Agendar</span>
            </button>
          </div>
          {/* Desqualificar */}
          <button onClick={() => setShowDeleteModal(true)}
            className="mt-4 w-full py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50 hover:bg-red-100 transition-colors text-xs font-bold flex items-center justify-center gap-1.5">
            <Trash2 size={13} /> Desqualificar Lead
          </button>
        </div>

        {/* Resumo IA — 4 colunas */}
        <div className="lg:col-span-4 card-glass p-6 border-l-4 border-l-red-600 flex flex-col">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-600/20 shrink-0">
              <Zap size={16} />
            </div>
            <h3 className="font-display font-bold text-base dark:text-white">Resumo Inteligente</h3>
            <span className="ml-auto text-[10px] text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-full font-bold">IA</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
            {lead.aiSummary || 'Nenhum resumo disponível ainda. Será preenchido pelo agente IA quando o lead interagir.'}
          </p>
          <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-50 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alta chance de visita</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IA Ativa</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── LINHA 2: Pipeline ── */}
      <div className="card-glass p-6">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Etapa no Funil</h3>
        <div className="flex justify-between items-center max-w-3xl mx-auto px-2">
          {STEPS.map((step, i) => {
            const active  = i <= stepIdx;
            const current = i === stepIdx;
            return (
              <div key={step.label} className="flex flex-col items-center relative flex-1">
                {i < STEPS.length - 1 && (
                  <div className={`absolute top-5 left-[50%] right-[-50%] h-[2px] z-0 ${i < stepIdx ? 'bg-red-600' : 'bg-slate-100 dark:bg-slate-800'}`} />
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 transition-all duration-500
                  ${active ? 'bg-red-600 text-white border-red-600/20' : 'bg-white dark:bg-slate-900 text-slate-300 border-slate-100 dark:border-slate-800'}
                  ${current ? 'ring-4 ring-red-600/10' : ''}`}>
                  {i < stepIdx ? <CheckCircle2 size={18} /> : <span className="text-sm font-bold">{i + 1}</span>}
                </div>
                <span className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${active ? 'text-slate-700 dark:text-slate-200' : 'text-slate-300'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LINHA 3: Linha do Tempo + Indicadores ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Linha do Tempo — 8 colunas */}
        <div className="lg:col-span-8 card-glass p-6">
          <h3 className="font-display font-bold text-lg dark:text-white mb-5 flex items-center gap-2">
            <Clock size={16} className="text-red-600" /> Linha do Tempo
          </h3>

          {/* Caixa de nota */}
          <div className="card-glass p-4 mb-6 focus-within:ring-2 focus-within:ring-red-600/10 transition-all">
            <textarea
              placeholder="Adicionar nota interna ou observação comercial..."
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-sm dark:text-white resize-none min-h-[80px]"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">
              {noteSaved && (
                <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={12} /> Nota adicionada
                </span>
              )}
              <button onClick={handleSaveNote} disabled={!noteContent.trim()}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition-all">
                <Send size={13} /> Salvar Nota
              </button>
            </div>
          </div>

          {/* Eventos */}
          <div className="relative space-y-5 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
            {lead.history.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8 italic">Nenhum evento registrado ainda.</p>
            )}
            {lead.history.map((event) => {
              const typeColors: Record<string, string> = {
                ai:        'bg-red-600 border-red-600',
                note:      'bg-amber-500 border-amber-500',
                system:    'bg-slate-300 border-slate-300 dark:bg-slate-700 dark:border-slate-700',
                lead:      'bg-blue-500 border-blue-500',
                consultant:'bg-emerald-500 border-emerald-500',
              };
              const cls = typeColors[event.type] ?? typeColors.system;
              return (
                <div key={event.id} className="relative pl-12">
                  <div className={`absolute left-0 top-0 w-10 h-10 rounded-xl flex items-center justify-center z-10 shadow-sm border text-white ${cls}`}>
                    {event.type === 'ai'   ? <Zap size={16} /> :
                     event.type === 'note' ? <FileText size={16} /> :
                     <User size={16} />}
                  </div>
                  <div className="card-glass p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {event.type === 'ai' ? 'Agente IA' : event.type === 'note' ? 'Nota Interna' : event.type === 'system' ? 'Sistema' : 'Consultor'}
                      </span>
                      <span className="text-[10px] text-slate-300">
                        {format(new Date(event.createdAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{event.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicadores IA — 4 colunas */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Zap size={12} className="text-red-600" /> Indicadores IA
              </h3>
              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded uppercase tracking-wide">Demo</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Probabilidade</p>
                <p className="text-xl font-black text-red-600">{lead.probability}%</p>
                <p className="text-[9px] text-slate-400 mt-0.5">via agente IA</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Engajamento</p>
                <div className="flex gap-0.5">
                  {[1,2,3].map(i => (
                    <Zap key={i} size={14} className={i <= lead.engagement ? 'text-red-600 fill-red-600' : 'text-slate-200 dark:text-slate-700'} />
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 mt-1">score: {lead.score}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Interações</p>
                <p className="text-xl font-black text-blue-600">{lead.interactionsCount}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">no histórico</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">1ª Resposta</p>
                <p className="text-xl font-black text-emerald-600">2 min</p>
                <p className="text-[9px] text-slate-400 mt-0.5">via n8n</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Desqualificar */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-950 p-8 rounded-3xl shadow-2xl relative z-10 max-w-sm w-full border border-slate-100 dark:border-slate-900">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-display font-bold text-center mb-2 dark:text-white">Desqualificar Lead?</h3>
              <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">O lead será movido para Perdidos e sairá do funil ativo.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowDeleteModal(false)}
                  className="py-3 px-4 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-200 transition-all">
                  Cancelar
                </button>
                <button onClick={() => { updateLeadStatus(lead.id, 'Perdido'); setShowDeleteModal(false); setCurrentView(ViewState.LEADS); }}
                  className="py-3 px-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all">
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {showAgendar && (
        <AgendarModal
          lead={lead}
          onClose={() => setShowAgendar(false)}
          onSuccess={() => { /* refetch via Realtime */ }}
        />
      )}
    </div>
  );
};
