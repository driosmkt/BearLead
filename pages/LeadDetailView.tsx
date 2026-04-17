import React, { useState } from 'react';
import { useLeadsContext } from '../context/LeadsContext';
import { ViewState, LeadStatus, LeadHistory } from '../types';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MessageCircle, 
  Calendar, 
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Trash2,
  FileText,
  User,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const LeadDetailView: React.FC = () => {
  const { leads, selectedLeadId, setCurrentView, updateLeadStatus, addNote } = useLeadsContext();
  const [noteContent, setNoteContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const lead = leads.find(l => l.id === selectedLeadId);

  if (!lead) return null;

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    addNote(lead.id, noteContent);
    setNoteContent('');
  };

  const getStatusStep = (status: LeadStatus) => {
    const steps: LeadStatus[] = ['Novo Lead', 'Em Atendimento', 'Agendado', 'Visitou', 'Matriculado'];
    return steps.indexOf(status);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentView(ViewState.LEADS)}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 hover:text-primary transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-display font-black dark:text-white uppercase tracking-tight">{lead.responsibleName}</h2>
              <div className={`px-2 py-0.5 rounded-md text-[10px] font-black text-white uppercase tracking-widest ${
                lead.score === 'Quente' ? 'bg-primary' : 
                lead.score === 'Morno' ? 'bg-amber-500' : 'bg-blue-500'
              }`}>
                {lead.score}
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Lead registrado em {format(new Date(lead.createdAt), "dd 'de' MMMM", { locale: ptBR })}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={20} />
          </button>
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <CheckCircle2 size={18} />
            <span>Matricular Agora</span>
          </button>
        </div>
      </div>

      {/* Pipeline Progress */}
      <div className="card-glass p-8">
        <div className="flex justify-between items-center max-w-4xl mx-auto px-4">
          {['Novo', 'Contato', 'Agendado', 'Visitou', 'Matriculado'].map((step, i) => {
            const currentStep = getStatusStep(lead.status);
            const active = i <= currentStep;
            const isCurrent = i === currentStep;
            
            return (
              <div key={step} className="flex flex-col items-center relative flex-1">
                {/* Connector */}
                {i < 4 && (
                  <div className={`absolute top-5 left-[50%] right-[-50%] h-[2px] z-0 ${i < currentStep ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`} />
                )}
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-500 border-4 ${
                  active ? 'bg-primary text-white border-primary/20' : 'bg-white dark:bg-slate-900 text-slate-300 border-slate-100 dark:border-slate-800 shadow-inner'
                } ${isCurrent ? 'ring-4 ring-primary/10' : ''}`}>
                  {i < currentStep ? <CheckCircle2 size={20} /> : <span className="text-sm font-bold">{i + 1}</span>}
                </div>
                <span className={`mt-3 text-[11px] font-bold uppercase tracking-widest ${active ? 'text-slate-700 dark:text-slate-200' : 'text-slate-300'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Info & Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="card-glass p-6">
            <h3 className="font-display font-bold text-sm uppercase tracking-widest text-slate-400 mb-6">Ações Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href={`tel:${lead.whatsapp}`} className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-transparent hover:border-primary/20 transition-all hover:bg-white text-slate-600 dark:text-slate-300 hover:text-primary">
                <Phone size={20} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase">Ligar</span>
              </a>
              <a href={`https://wa.me/${lead.whatsapp}`} target="_blank" className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-transparent hover:border-green-200 transition-all hover:bg-white text-slate-600 dark:text-slate-300 hover:text-green-600">
                <MessageCircle size={20} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase">WhatsApp</span>
              </a>
              <a href={`mailto:${lead.email}`} className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-transparent hover:border-blue-200 transition-all hover:bg-white text-slate-600 dark:text-slate-300 hover:text-blue-600">
                <Mail size={20} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase">E-mail</span>
              </a>
              <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-transparent hover:border-amber-200 transition-all hover:bg-white text-slate-600 dark:text-slate-300 hover:text-amber-500">
                <Calendar size={20} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase">Agendar</span>
              </button>
            </div>
          </div>

          {/* Lead Info Card */}
          <div className="card-glass p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-slate-400">Dados do Lead</h3>
              <div className="p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"><MoreVertical size={16} /></div>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Programa</p>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 text-primary rounded-lg"><Zap size={14} /></div>
                  <p className="text-sm font-bold dark:text-white uppercase tracking-tight">{lead.program}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Criança</p>
                  <p className="text-sm font-semibold dark:text-slate-200">{lead.childName}</p>
                  <p className="text-[10px] text-slate-400">{lead.childAge} anos</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <p className="text-xs font-bold dark:text-white">{lead.status}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Última Interação</p>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Clock size={14} />
                  <p className="text-xs font-medium">{format(new Date(lead.lastInteraction), "dd/MM/yyyy 'às' HH:mm")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-glass p-6 bg-gradient-to-br from-primary/5 to-white dark:to-slate-900 border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 text-primary rounded-xl"><Zap size={18} weight="fill" /></div>
              <h3 className="font-display font-bold text-sm tracking-tight dark:text-white">Indicadores IA</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/50 dark:bg-slate-950/50 rounded-xl border border-white/20">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Conversão</p>
                <p className="text-xl font-black text-primary">{lead.probability}%</p>
              </div>
              <div className="p-3 bg-white/50 dark:bg-slate-950/50 rounded-xl border border-white/20">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Zap 
                      key={i} 
                      size={14} 
                      className={i < lead.engagement ? 'text-primary fill-primary' : 'text-slate-200'}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Summary & Timeline */}
        <div className="lg:col-span-8 space-y-8">
          {/* AI Summary Section */}
          <div className="card-glass p-8 border-l-4 border-l-primary">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Zap size={18} />
              </div>
              <h3 className="font-display font-bold text-lg dark:text-white">Resumo Inteligente</h3>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {lead.aiSummary}
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Altas chances de visita</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IA Atendimento Ativo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Notes */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-xl dark:text-white tracking-tight">Linha do Tempo</h3>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <Filter size={12} />
                <span>Todos os eventos</span>
              </div>
            </div>

            {/* Note Input */}
            <div className="card-glass p-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <textarea 
                placeholder="Adicionar nota interna ou observação comercial..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm p-2 min-h-[100px] dark:text-white resize-none"
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                <div className="flex gap-1 text-slate-400">
                  <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"><Zap size={18} /></button>
                  <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"><FileText size={18} /></button>
                </div>
                <button 
                  onClick={handleSaveNote}
                  disabled={!noteContent.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover disabled:opacity-50 transition-all"
                >
                  <Send size={14} />
                  <span>Salvar Nota</span>
                </button>
              </div>
            </div>

            {/* Events List */}
            <div className="relative space-y-6 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-900">
              {lead.history.map((event) => (
                <div key={event.id} className="relative pl-12">
                  <div className={`absolute left-0 top-0 w-10 h-10 rounded-xl flex items-center justify-center z-10 shadow-sm border ${
                    event.type === 'ai' ? 'bg-primary text-white border-primary' :
                    event.type === 'note' ? 'bg-amber-500 text-white border-amber-500' :
                    event.type === 'system' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                    'bg-blue-500 text-white border-blue-500'
                  }`}>
                    {event.type === 'ai' ? <Zap size={18} /> : 
                     event.type === 'note' ? <FileText size={18} /> : 
                     event.type === 'system' ? <AlertCircle size={18} /> : 
                     <User size={18} />}
                  </div>
                  <div className="card-glass p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {event.type === 'ai' ? 'Agente IA' : 
                         event.type === 'note' ? 'Nota Interna' : 
                         event.type === 'system' ? 'Ação do Sistema' : 'Consultor'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">
                        {format(new Date(event.createdAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                      {event.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-950 p-8 rounded-3xl shadow-2xl relative z-10 max-w-sm w-full border border-slate-100 dark:border-slate-900"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-display font-bold text-center mb-2 dark:text-white">Desqualificar Lead?</h3>
              <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">Isso moverá o lead para a lixeira/perdidos. Esta ação pode ser desfeita posteriormente nos filtros.</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="py-3 px-4 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    updateLeadStatus(lead.id, 'Perdido');
                    setShowDeleteModal(false);
                    setCurrentView(ViewState.LEADS);
                  }}
                  className="py-3 px-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition-all"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
