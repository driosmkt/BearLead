import React from 'react';
import { Check, Rocket, Calendar, DollarSign, Briefcase } from 'lucide-react';
import { config } from '../config';

export const InvestmentView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Investimento na Nova Estrutura</h2>
        <p className="text-2xl text-slate-600 max-w-5xl">
          Projeto sob medida para o tamanho da {config.company.name}.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scope Section */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Rocket className="text-emerald-600" size={28} />
            Escopo do Projeto
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-lg text-slate-700">
              <Check className="text-emerald-500 mt-1 shrink-0" size={20} />
              <span>Implantação da landing page exclusiva de captação de produtores.</span>
            </li>
            <li className="flex items-start gap-3 text-lg text-slate-700">
              <Check className="text-emerald-500 mt-1 shrink-0" size={20} />
              <span>Criação e treinamento do agente de IA no WhatsApp (voz/estilo do consultor {config.company.name}).</span>
            </li>
            <li className="flex items-start gap-3 text-lg text-slate-700">
              <Check className="text-emerald-500 mt-1 shrink-0" size={20} />
              <span>Integração com CRM e organização das rotas de atendimento para o time comercial.</span>
            </li>
            <li className="flex items-start gap-3 text-lg text-slate-700">
              <Check className="text-emerald-500 mt-1 shrink-0" size={20} />
              <span>Otimização dos principais pontos de entrada: Google Meu Negócio, bio do Instagram e links do site institucional.</span>
            </li>
          </ul>
        </div>

        {/* ROI Section */}
        <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
          <h3 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
            <Briefcase className="text-emerald-600" size={28} />
            Retorno Esperado
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-lg text-emerald-800">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2.5 shrink-0"></div>
              <span>Mais leads qualificados sem aumentar o investimento em mídia.</span>
            </li>
            <li className="flex items-start gap-3 text-lg text-emerald-800">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2.5 shrink-0"></div>
              <span>Redução drástica do tempo de resposta e do volume de leads frios chegando ao consultor.</span>
            </li>
            <li className="flex items-start gap-3 text-lg text-emerald-800">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2.5 shrink-0"></div>
              <span>Previsibilidade: saber de onde vem cada produtor, quanto gera por safra e quais canais trazem mais receita para a {config.company.name}.</span>
            </li>
            <li className="flex items-start gap-3 text-lg text-emerald-800">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2.5 shrink-0"></div>
              <span>Cada visita técnica gerada pela nova estrutura representa potencial de aumento direto de faturamento na safra seguinte.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Pricing Section - Full Width */}
      <div className="mt-8 bg-slate-900 text-white rounded-3xl p-10 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <DollarSign size={200} />
        </div>
        
        <h3 className="text-3xl font-bold mb-8 relative z-10">Valores do Investimento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {/* Implementation */}
          <div className="space-y-6">
            <div className="border-b border-slate-700 pb-4">
              <h4 className="text-xl text-emerald-400 font-semibold mb-2">Implementação da nova estrutura</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">R$ 30.000</span>
                <span className="text-slate-400">projeto completo</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-lg">
                <span className="text-slate-300">Na assinatura do projeto</span>
                <span className="font-semibold">R$ 15.000</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="text-slate-300">Na entrega (até 30 dias)</span>
                <span className="font-semibold">R$ 15.000</span>
              </div>
            </div>
          </div>

          {/* Operation */}
          <div className="md:border-l md:border-slate-700 md:pl-12 space-y-6">
            <div className="border-b border-slate-700 pb-4">
              <h4 className="text-xl text-emerald-400 font-semibold mb-2">Operação e otimização</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">R$ 4.997</span>
                <span className="text-slate-400">/mês</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-lg text-slate-300 bg-slate-800 p-4 rounded-lg">
                <Calendar className="text-emerald-400 shrink-0" />
                <span>Contrato mínimo: 12 meses</span>
              </div>
              
              <p className="text-emerald-400 text-sm italic opacity-90">
                Condição especial: possibilidade de desconto para pagamento antecipado das parcelas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};