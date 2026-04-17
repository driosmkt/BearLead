import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Bot, 
  User, 
  Baby, 
  Phone,
  MessageSquare,
  Facebook,
  Instagram,
  Globe,
  MapPin,
  Flame,
  Snowflake,
  ThermometerSun,
  Activity,
  UserCheck,
  PhoneCall,
  Mail,
  XCircle,
  FileText,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { Lead } from '../types';

interface LeadDetailViewProps {
  lead: Lead;
  onBack: () => void;
}

export const LeadDetailView: React.FC<LeadDetailViewProps> = ({ lead, onBack }) => {
  
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Facebook Ads': return <Facebook size={16} />;
      case 'Instagram': return <Instagram size={16} />;
      case 'Google Ads': 
      case 'Google Meu Negócio': return <Globe size={16} />;
      default: return <User size={16} />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'Facebook Ads': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'Instagram': return 'text-pink-600 bg-pink-50 dark:bg-pink-900/20';
      case 'Google Ads': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-slate-600 bg-slate-50 dark:bg-slate-800';
    }
  };

  const getScoreColor = (score?: string) => {
    switch (score) {
      case 'Quente': return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'Morno': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      default: return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
    }
  };

  const getScoreIcon = (score?: string) => {
    switch (score) {
      case 'Quente': return <Flame size={20} />;
      case 'Morno': return <ThermometerSun size={20} />;
      default: return <Snowflake size={20} />;
    }
  };

  const pipelineSteps = ['Novo Lead', 'Em atendimento', 'Agendado', 'Visitou', 'Matriculado'];
  const currentStepIndex = pipelineSteps.indexOf(lead.status) === -1 ? 0 : pipelineSteps.indexOf(lead.status);

  return (
    <div className="animate-fade-in pb-12 flex flex-col h-full overflow-hidden">
      
      {/* Header & Journey Timeline */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 py-4 mb-4 lg:mb-6 sticky top-0 z-30 shadow-sm shrink-0">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 lg:gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                {lead.name}
                <span className="text-sm font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 hidden sm:inline-block">#{lead.id}</span>
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${getSourceColor(lead.source)}`}>
                  {getSourceIcon(lead.source)} {lead.source}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="text-xs sm:text-sm">Entrou: {new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* Mini Journey Pipeline */}
          <div className="flex-1 max-w-2xl mx-auto hidden md:block">
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 rounded"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded transition-all duration-500"
                style={{ width: `${(currentStepIndex / (pipelineSteps.length - 1)) * 100}%` }}
              ></div>
              <div className="relative flex justify-between">
                {pipelineSteps.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2 cursor-default group">
                      <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 z-10 ${isActive ? 'bg-emerald-500 border-emerald-500' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600'} ${isCurrent ? 'ring-4 ring-emerald-100 dark:ring-emerald-900/30' : ''}`}></div>
                      <span className={`text-[10px] font-bold uppercase transition-colors duration-300 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="hidden xl:block w-32"></div> {/* Spacer */}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* COLUMN 1: LEAD DNA */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
                <User size={16} /> Dados do Lead
              </h3>
              
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-2xl border-2 border-white dark:border-slate-700 shadow-sm shrink-0">
                   {lead.name.charAt(0)}
                 </div>
                 <div className="min-w-0">
                   <p className="font-bold text-lg text-slate-900 dark:text-white truncate">{lead.name}</p>
                   <a href={`https://wa.me/${lead.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-sm hover:underline mt-0.5">
                     <MessageSquare size={14} /> {lead.whatsapp}
                   </a>
                 </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                 <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600 dark:text-blue-400"><Baby size={18} /></div>
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase font-bold">Criança</p>
                        <p className="font-medium text-slate-700 dark:text-slate-200">{lead.childName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 dark:text-slate-500">{lead.childAge} Anos</span>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{lead.program}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg text-purple-600 dark:text-purple-400"><Clock size={18} /></div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase font-bold">Última Interação</p>
                      <p className="font-medium text-slate-700 dark:text-slate-200">
                        {new Date(lead.lastContactAt).toLocaleDateString('pt-BR')} <span className="text-slate-400 text-xs">às 14:30</span>
                      </p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Smart Indicators */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
                <Activity size={16} /> Indicadores Inteligentes
              </h3>
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                   <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Tempo 1ª Resp</p>
                   <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">2 min</p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                   <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Interações</p>
                   <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{lead.interactionsCount || 8}</p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                   <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Probabilidade</p>
                   <p className="text-lg font-bold text-amber-500 dark:text-amber-400">{lead.probability || 'Alta'}</p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                   <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Engajamento</p>
                   <div className="flex text-amber-400 mt-1"><Flame size={16} fill="currentColor" /><Flame size={16} fill="currentColor" /><Flame size={16} className="text-slate-200 dark:text-slate-600" /></div>
                 </div>
              </div>
            </div>

            {/* Related Leads (Siblings) */}
            {lead.siblings && lead.siblings.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                 <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
                  <UserCheck size={16} /> Relacionamentos
                </h3>
                <div className="space-y-3">
                  {lead.siblings.map((sib, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">{sib.name.charAt(0)}</div>
                         <div>
                           <p className="font-bold text-sm text-slate-700 dark:text-slate-200">{sib.name}</p>
                           <p className="text-xs text-slate-500">{sib.age} anos</p>
                         </div>
                      </div>
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{sib.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMN 2: CONTEXT & TIMELINE */}
          <div className="space-y-6 h-full flex flex-col">
            {/* AI Summary Card */}
            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30 p-6 shadow-sm">
               <div className="flex justify-between items-start mb-3">
                 <h3 className="text-sm font-bold text-purple-800 dark:text-purple-300 uppercase flex items-center gap-2">
                   <Bot size={18} /> Resumo IA
                 </h3>
                 <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full font-bold">Atualizado agora</span>
               </div>
               <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
                 {lead.summary || "Responsável demonstrou alto interesse. Agendamento sugerido, aguardando confirmação do horário pelo pai."}
               </p>
               <button className="w-full py-2 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center justify-center gap-2">
                 <MessageSquare size={16} /> Ver Conversa Completa
               </button>
            </div>

            {/* Visual Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex-1 flex flex-col min-h-[400px]">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-6 flex items-center gap-2">
                <Clock size={16} /> Linha do Tempo
              </h3>
              
              <div className="relative flex-1 pl-4 space-y-8">
                {/* Continuous Vertical Line */}
                <div className="absolute top-2 bottom-0 left-[23px] w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                
                {(lead.history || []).map((event, index) => {
                   let icon = <MessageSquare size={14} />;
                   let colorClass = "bg-blue-500 border-blue-100";
                   let textColor = "text-blue-700";

                   if (event.type === 'ai') {
                      icon = <Bot size={14} />;
                      colorClass = "bg-purple-500 border-purple-100";
                      textColor = "text-purple-700 dark:text-purple-400";
                   } else if (event.type === 'system') {
                      icon = <Settings size={14} />;
                      colorClass = "bg-slate-500 border-slate-100";
                      textColor = "text-slate-700 dark:text-slate-400";
                   } else if (event.type === 'message' && event.user === 'Lead') {
                      icon = <User size={14} />;
                      colorClass = "bg-emerald-500 border-emerald-100";
                      textColor = "text-emerald-700 dark:text-emerald-400";
                   }

                   return (
                    <div key={index} className="relative pl-10 group cursor-pointer">
                      {/* Timestamp bubble */}
                      <div className="absolute -left-2 top-0 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-900 px-1 py-0.5 z-10">
                        {event.date.split(',')[0]}
                      </div>
                      
                      {/* Icon Node */}
                      <div className={`absolute left-[14px] top-6 w-5 h-5 rounded-full ${colorClass} text-white flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm z-10`}>
                        {icon}
                      </div>

                      {/* Card Content */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                         <div className="flex justify-between items-start mb-1">
                            <span className={`text-xs font-bold uppercase ${textColor}`}>{event.user}</span>
                            <span className="text-[10px] text-slate-400">{event.date.split(',')[1]}</span>
                         </div>
                         <p className="font-bold text-slate-800 dark:text-white text-sm mb-1">{event.action}</p>
                         {event.detail && (
                           <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900/50 p-2 rounded-lg mt-2 border border-slate-100 dark:border-slate-700/50 italic">
                             "{event.detail}"
                           </p>
                         )}
                      </div>
                    </div>
                   );
                })}
              </div>
            </div>
          </div>

          {/* COLUMN 3: COMMERCIAL ACTION */}
          <div className="space-y-6">
            
            {/* Status Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">Status Comercial</h3>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-bold text-slate-600 dark:text-slate-300">
                    ID: {lead.id}
                  </span>
               </div>

               <div className="mb-6 text-center">
                 <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-bold shadow-sm mb-4 ${getScoreColor(lead.score)}`}>
                   {getScoreIcon(lead.score)}
                   Score: {lead.score || 'Morno'}
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Responsável</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{lead.owner || 'Não atribuído'}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Melhor Horário</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{lead.bestTime || 'Tarde'}</p>
                    </div>
                 </div>
               </div>

               {/* Next Action Box */}
               <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-2">
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 uppercase font-bold flex items-center gap-1 mb-1">
                    <CheckCircle2 size={12} /> Próxima Ação Recomendada
                  </p>
                  <p className="text-lg font-bold text-amber-900 dark:text-amber-100">
                    {lead.nextAction || 'Ligar para agendar'}
                  </p>
               </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
               <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
                 <Settings size={16} /> Ações Rápidas
               </h3>
               <div className="grid grid-cols-2 gap-3">
                 <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors font-bold text-xs gap-2">
                   <PhoneCall size={20} /> Ligar
                 </button>
                 <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors font-bold text-xs gap-2">
                   <MessageSquare size={20} /> WhatsApp
                 </button>
                 <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-bold text-xs gap-2">
                   <Calendar size={20} /> Agendar
                 </button>
                 <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors font-bold text-xs gap-2">
                   <Mail size={20} /> Email
                 </button>
                 <button className="col-span-2 flex flex-row items-center justify-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-bold text-xs gap-2">
                   <XCircle size={16} /> Desqualificar Lead
                 </button>
               </div>
            </div>

            {/* Internal Notes */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex-1">
               <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
                 <FileText size={16} /> Observações Internas
               </h3>
               <textarea 
                 className="w-full h-32 p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                 placeholder="Escreva uma observação para o time..."
               ></textarea>
               <div className="flex justify-end mt-2">
                 <button className="px-4 py-2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">
                   Salvar Nota
                 </button>
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};