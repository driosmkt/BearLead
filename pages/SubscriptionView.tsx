import React, { useState } from 'react';
import {
  CreditCard, CheckCircle2, Clock, FileText,
  ChevronDown, ChevronUp, AlertCircle, ExternalLink, Zap
} from 'lucide-react';

// ─── Dados reais virão da integração Asaas ────────────────────────────────────
// Por enquanto a tela mostra o plano e aguarda integração de pagamento

const PLAN = {
  name:     'Bear Lead Pro',
  status:   'Ativo',
  price:    'R$ 497,00',
  cycle:    'mensal',
  nextDate: '—',   // virá do Asaas
  features: [
    'Kanban ilimitado de leads',
    'Integração n8n (SDR + Closer)',
    'Dashboard em tempo real',
    'Agendamento de visitas',
    'Linha do tempo com IA',
    'Relatórios de performance',
    'Equipe com 2 níveis de acesso',
    'Suporte prioritário',
  ],
};

export const SubscriptionView: React.FC = () => {
  const [showBilling, setShowBilling] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-3xl">

      <div>
        <h2 className="text-3xl font-display font-black dark:text-white">Assinatura</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Seu plano e dados de faturamento.</p>
      </div>

      {/* Plano atual */}
      <div className="card-glass p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center shrink-0">
              <CreditCard size={22} className="text-red-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display font-bold text-lg dark:text-white">{PLAN.name}</p>
                <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  {PLAN.status}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                <span className="font-bold text-slate-700 dark:text-slate-200">{PLAN.price}</span> / {PLAN.cycle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl shrink-0">
            <Clock size={13} />
            <span>Próxima cobrança: <strong className="text-slate-600 dark:text-slate-300">{PLAN.nextDate}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5">
          {PLAN.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
              {f}
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-5 border-t border-slate-50 dark:border-slate-800">
          <button className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all">
            Cancelar plano
          </button>
          <button className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm shadow-red-600/20">
            Fazer upgrade
          </button>
        </div>
      </div>

      {/* Histórico de cobranças — aguarda Asaas */}
      <div className="card-glass overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <h3 className="font-display font-bold text-base dark:text-white flex items-center gap-2">
            <FileText size={16} className="text-slate-400" /> Histórico de Cobranças
          </h3>
          <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-lg uppercase tracking-widest">
            Em breve
          </span>
        </div>
        <div className="px-6 pb-6 border-t border-slate-50 dark:border-slate-800 pt-4">
          <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
            <Zap size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold dark:text-white">Integração com Asaas em andamento</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                O histórico de cobranças, notas fiscais e gestão do plano serão gerenciados via Asaas —
                a plataforma de pagamentos recorrentes líder no Brasil. Em breve disponível aqui.
              </p>
              <a href="https://asaas.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 mt-2 transition-colors">
                Saiba mais sobre o Asaas <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dados de faturamento */}
      <div className="card-glass overflow-hidden">
        <button
          onClick={() => setShowBilling(v => !v)}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <h3 className="font-display font-bold text-base dark:text-white flex items-center gap-2">
            <CreditCard size={16} className="text-slate-400" /> Dados de Faturamento
          </h3>
          {showBilling ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>
        {showBilling && (
          <div className="px-6 pb-6 border-t border-slate-50 dark:border-slate-800 pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Razão Social',  value: '—' },
                { label: 'CNPJ',          value: '—' },
                { label: 'E-mail',        value: '—' },
                { label: 'Endereço',      value: '—' },
              ].map((f, i) => (
                <div key={i}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl">
              <AlertCircle size={13} className="text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Para atualizar os dados de faturamento, entre em contato com o suporte Bear Lead.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Suporte */}
      <div className="card-glass p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0">
          <AlertCircle size={18} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold dark:text-white">Precisa de ajuda com sua assinatura?</p>
          <p className="text-xs text-slate-400 mt-0.5">Entre em contato com o suporte Bear Lead.</p>
        </div>
        <a href="https://wa.me/5587991659981" target="_blank" rel="noopener noreferrer"
          className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all whitespace-nowrap">
          WhatsApp
        </a>
      </div>

    </div>
  );
};
