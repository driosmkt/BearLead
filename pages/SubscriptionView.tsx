import React, { useState } from 'react';
import {
  CreditCard, Zap, TrendingUp, Download, ChevronDown, ChevronUp,
  Shield, CheckCircle2, Plus
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const creditData = [
  { value: 72, color: '#dc2626' },
  { value: 28, color: '#f1f5f9' },
];

const billingHistory = [
  { date: '12 Abr, 2026', id: '#BR-92837', amount: 'R$ 997,00', status: 'Pago' },
  { date: '12 Mar, 2026', id: '#BR-91204', amount: 'R$ 997,00', status: 'Pago' },
  { date: '12 Fev, 2026', id: '#BR-89651', amount: 'R$ 997,00', status: 'Pago' },
];

export const SubscriptionView: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black dark:text-white">Assinatura e Créditos</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gerencie seu plano Essentials e saldo de interações da IA.</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800">
          <CheckCircle2 size={16} />
          <span className="text-sm font-bold">Plano Ativo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">

          {/* Plano atual */}
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Plano Atual</p>
                <h3 className="text-4xl font-display font-black mb-4">Bear Lead Essentials</h3>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Próxima Renovação</p>
                    <p className="font-bold text-lg">12 de Maio, 2026</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Investimento</p>
                    <p className="font-bold text-lg">R$ 997,00/mês</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 min-w-[180px]">
                <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:scale-105 transition-all text-sm flex items-center justify-center gap-2">
                  <TrendingUp size={16} /> Mudar Plano
                </button>
                <button className="px-6 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-all text-sm">
                  Gerenciar Faturamento
                </button>
              </div>
            </div>
          </div>

          {/* ROI */}
          <div className="card-glass p-8">
            <h3 className="font-display font-bold text-lg mb-8 dark:text-white">Resumo Financeiro</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Investimento Anual</p>
                <p className="text-2xl font-black font-financial dark:text-white">R$ 11.964,00</p>
                <div className="h-1.5 bg-red-600 w-12 mt-2 rounded-full" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Receita Facilitada</p>
                <p className="text-2xl font-black font-financial text-emerald-600">R$ 5.412.000</p>
                <p className="text-[10px] text-slate-400 mt-1">Projeção LTV (320 matrículas acumuladas)*</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Relação Receita/Inv.</p>
                <p className="text-2xl font-black font-financial text-red-600">451x</p>
                <p className="text-[10px] text-slate-400 mt-1">Receita gerada por real investido</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              * Projeção baseada em LTV médio de matrículas atribuídas ao funil Bear Lead. Não representa lucro direto.
            </p>
          </div>

          {/* Histórico */}
          <div className="card-glass p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg dark:text-white">Histórico de Cobranças</h3>
              <button className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
                <Download size={16} /> Download CSV
              </button>
            </div>
            <div className="space-y-3">
              {billingHistory.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                      <CreditCard size={16} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white">{item.date}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{item.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold font-financial dark:text-white">{item.amount}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowAll(!showAll)} className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors py-2">
              {showAll ? <><ChevronUp size={16} /> Ver menos</> : <><ChevronDown size={16} /> Ver histórico completo</>}
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Créditos IA */}
          <div className="card-glass p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-bold text-lg dark:text-white">Créditos IA</h3>
              <Zap size={20} className="text-red-600 fill-red-600" />
            </div>

            {/* Donut com label centralizada — posicionamento relativo correto */}
            <div className="relative h-[180px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={creditData}
                    cx="50%" cy="50%"
                    innerRadius={58} outerRadius={78}
                    startAngle={90} endAngle={450}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {creditData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black font-display dark:text-white leading-none">72%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Utilizado</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Uso este mês</span>
                <span className="text-xs font-black dark:text-white tabular-nums">720 / 1.000</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>

            <button className="w-full py-3 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-xl font-bold text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              <Plus size={18} /> Recarregar Créditos
            </button>
          </div>

          {/* LGPD */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Shield size={24} />
              <h3 className="font-display font-bold">Proteção de Dados Garantida</h3>
            </div>
            <p className="text-sm text-blue-100 leading-relaxed mb-4">
              Seus leads e informações comerciais estão protegidos sob protocolos de segurança de nível bancário e conformidade com a LGPD.
            </p>
            <button className="flex items-center gap-2 text-sm font-bold text-white underline underline-offset-2">
              <CheckCircle2 size={16} /> Ver Certificado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
