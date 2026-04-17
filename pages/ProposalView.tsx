import React from 'react';
import { ArrowRight, Bot, Target, Database, Phone, Layout, Mic } from 'lucide-react';
import { config } from '../config';

export const ProposalView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
       <header className="mb-10">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">A Nova Estrutura: Funil de Alta Performance</h2>
        <p className="text-2xl text-slate-600 max-w-5xl">
          Mantemos o institucional como vitrine de marca, mas criamos uma via expressa para vendas.
        </p>
      </header>

      {/* The Flow Visual */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-emerald-100 -translate-y-1/2 z-0 hidden lg:block"></div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
          
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-lg text-center flex flex-col items-center h-full">
            <div className="bg-emerald-100 p-4 rounded-full mb-4">
              <Target className="text-emerald-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">1. Tráfego & Bio</h3>
            <p className="text-lg text-slate-600">
              Anúncios segmentados e Link Único na Bio.
            </p>
            <div className="mt-4 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold">
              Origem
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-emerald-600 p-6 rounded-2xl shadow-xl text-center flex flex-col items-center transform lg:-translate-y-4 border-4 border-white h-full">
            <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
              <Layout className="text-emerald-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">2. Landing Page</h3>
            <p className="text-lg text-emerald-100">
              Foco total em conversão. Formulário curto: Cultura, Área e Desafio.
            </p>
            <div className="mt-4 bg-white text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
              Filtro Inicial
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-lg text-center flex flex-col items-center h-full">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
              <Bot className="text-purple-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">3. IA no WhatsApp</h3>
            <p className="text-lg text-slate-600 mb-1">
              Atendimento imediato 24/7. Qualifica potencial e agenda visita.
            </p>
            <p className="text-sm text-purple-600 font-medium">
              (com voz/estilo do consultor {config.company.name})
            </p>
            <div className="mt-4 bg-purple-50 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
              Engajamento
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-lg text-center flex flex-col items-center h-full">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Database className="text-blue-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">4. CRM & Consultor</h3>
            <p className="text-lg text-slate-600">
              Consultor recebe o lead pronto, com contexto e data marcada.
            </p>
            <div className="mt-4 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
              Fechamento
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-white p-8 rounded-2xl border border-slate-200">
          <h3 className="text-3xl font-bold text-slate-800 mb-6">A Nova Landing Page</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-xl text-slate-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Promessa clara: "Aumente sua produtividade".
            </li>
            <li className="flex items-center gap-3 text-xl text-slate-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Seção por cultura (Soja, Milho, Algodão).
            </li>
            <li className="flex items-center gap-3 text-xl text-slate-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Prova social e cases de sucesso.
            </li>
            <li className="flex items-center gap-3 text-xl text-slate-700">
               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
               <strong>CTA Único:</strong> "Falar com Especialista".
            </li>
          </ul>
        </div>

        <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
           <h3 className="text-3xl font-bold text-emerald-900 mb-6">O Papel da IA</h3>
           <ul className="space-y-4">
            <li className="flex items-center gap-3 text-xl text-emerald-800">
               <Bot className="text-emerald-600" />
               Triagem imediata de curiosos vs. compradores.
            </li>
             <li className="flex items-center gap-3 text-xl text-emerald-800">
               <Mic className="text-emerald-600" />
               Envio de áudios personalizados com a voz do consultor/porta‑voz, aumentando proximidade.
            </li>
            <li className="flex items-center gap-3 text-xl text-emerald-800">
               <Database className="text-emerald-600" />
               Enriquecimento de dados (Tamanho da área, região).
            </li>
            <li className="flex items-center gap-3 text-xl text-emerald-800">
               <Phone className="text-emerald-600" />
               Agendamento automático no calendário do consultor.
            </li>
           </ul>
        </div>
      </div>

    </div>
  );
};