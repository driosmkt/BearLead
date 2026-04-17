import React from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  Plus,
  ArrowUpRight,
  Download,
  Zap,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';

const creditData = [
  { name: 'Consumido', value: 720, color: '#dc2626' },
  { name: 'Disponível', value: 280, color: '#f1f5f9' },
];

export const SubscriptionView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black dark:text-white">Assinatura e Créditos</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gerencie seu plano Essentials e saldo de interações da IA.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg">
          <CheckCircle2 size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Plano Ativo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Subscription Info */}
        <div className="lg:col-span-8 space-y-8">
          <div className="card-glass p-8 bg-gradient-to-br from-slate-900 to-slate-950 text-white border-none shadow-2xl relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 h-full">
              <div className="space-y-6">
                <div>
                  <div className="px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-md w-fit mb-4">Plano Atual</div>
                  <h3 className="text-5xl font-display font-black">Bear Lead Essentials</h3>
                </div>
                
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Próxima Renovação</p>
                    <p className="text-lg font-bold">12 de Maio, 2026</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Investimento</p>
                    <p className="text-lg font-bold font-financial">R$ 997,00/mês</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="px-8 py-3 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                  <ArrowUpRight size={18} />
                  Change Plan
                </button>
                <button className="px-8 py-3 bg-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
                  Gerenciar Faturamento
                </button>
              </div>
            </div>
          </div>

          {/* Investment ROI Summary */}
          <div className="card-glass p-8">
            <h3 className="font-display font-bold text-xl mb-8 dark:text-white">Resumo Financeiro e ROI</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Investimento Anual</p>
                <p className="text-2xl font-black font-financial dark:text-white">R$ 11.964,00</p>
                <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/3" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Receita Facilitada</p>
                <p className="text-2xl font-black font-financial text-green-500">R$ 5.412.000,00</p>
                <p className="text-[10px] font-medium text-slate-400 leading-tight">Projeção LTV (320 matrículas acumuladas)</p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Efficiency Ratio</p>
                <p className="text-2xl font-black font-display text-primary">451x</p>
                <p className="text-[10px] font-medium text-slate-400 leading-tight">Revenue generated per reias invested</p>
              </div>
            </div>
          </div>

          {/* Invoices List */}
          <div className="card-glass overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-900 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg dark:text-white">Histórico de Cobranças</h3>
              <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                <Download size={14} />
                <span>Download CSV</span>
              </button>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-900">
              {[
                { date: '12 Abr, 2026', id: '#BR-92837', value: 'R$ 997,00', status: 'Pago' },
                { date: '12 Mar, 2026', id: '#BR-91204', value: 'R$ 997,00', status: 'Pago' },
                { date: '12 Fev, 2026', id: '#BR-89912', value: 'R$ 997,00', status: 'Pago' },
              ].map((inv, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-400">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white">{inv.date}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{inv.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-sm font-black font-financial dark:text-slate-200">{inv.value}</span>
                    <span className="text-[10px] font-bold px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                      {inv.status}
                    </span>
                    <ChevronRight size={18} className="text-slate-200 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Credits Widget */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-glass p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-bold text-lg dark:text-white">Créditos IA</h3>
              <Zap size={20} className="text-primary fill-primary" />
            </div>
            
            <div className="h-[200px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={creditData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                  >
                    {creditData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                <span className="text-3xl font-black font-display dark:text-white">72%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Utilizado</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Uso este mês</span>
                <span className="text-xs font-black dark:text-white tabular-nums">720 / 1.000</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[72%]" />
              </div>
            </div>

            <button className="w-full py-3 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-xl font-bold text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              <Plus size={18} />
              Recarregar Créditos
            </button>
          </div>

          <div className="p-8 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200 dark:shadow-none space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><ShieldCheck size={80} /></div>
            <h4 className="text-lg font-display font-black leading-tight relative z-10">Proteção de Dados Garantida</h4>
            <p className="text-blue-100 text-xs font-medium leading-relaxed relative z-10">Seus leads e informações comerciais estão protegidos sob protocolos de segurança de nível bancário e conformidade com a LGPD.</p>
            <button className="text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all relative z-10">
              Ver Certificado <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
