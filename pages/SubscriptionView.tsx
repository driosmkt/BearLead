
import React, { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Link,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const creditData = [
  { name: 'Usado', value: 121, color: '#dc2626' }, // red-600
  { name: 'Disponível', value: 79, color: '#d97706' }, // amber-600
];

// Generate 12 months of history + next month
const generatePaymentHistory = () => {
  const history = [
    { date: '05/01/2026', plan: 'Essentials', value: 'R$ 997', status: 'Próxima' },
    { date: '05/12/2025', plan: 'Essentials', value: 'R$ 997', status: 'Pago' },
    { date: '05/11/2025', plan: 'Essentials', value: 'R$ 997', status: 'Pago' },
    { date: '05/10/2025', plan: 'Essentials', value: 'R$ 997', status: 'Pago' },
    { date: '05/09/2025', plan: 'Essentials', value: 'R$ 997', status: 'Pago' },
    { date: '05/08/2025', plan: 'Essentials', value: 'R$ 997', status: 'Pago' },
    { date: '05/07/2025', plan: 'Essentials', value: 'R$ 997', status: 'Pago' },
    { date: '05/06/2025', plan: 'Essentials', value: 'R$ 997', status: 'Pago' },
    { date: '05/05/2025', plan: 'Essentials', value: 'R$ 997', status: 'Pago' },
    { date: '05/04/2025', plan: 'Essentials', value: 'R$ 997', status: 'Pago' },
    { date: '05/03/2025', plan: 'Essentials', value: 'R$ 997', status: 'Pago' },
    { date: '05/02/2025', plan: 'Essentials', value: 'R$ 997', status: 'Pago' },
    { date: '05/01/2025', plan: 'Essentials', value: 'R$ 997', status: 'Pago' },
  ];
  return history;
};

const fullPaymentHistory = generatePaymentHistory();

export const SubscriptionView: React.FC = () => {
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Financial Calculations
  const totalEnrollments = 150;
  
  // Distribution: 30% @ 2500, 40% @ 3000, 30% @ 3500
  const tier1Count = totalEnrollments * 0.30; // 45
  const tier2Count = totalEnrollments * 0.40; // 60
  const tier3Count = totalEnrollments * 0.30; // 45

  const revenueTier1 = tier1Count * 2500;
  const revenueTier2 = tier2Count * 3000;
  const revenueTier3 = tier3Count * 3500;

  const totalMonthlyRevenue = revenueTier1 + revenueTier2 + revenueTier3; // 450.000
  // LTV Calculation: Annual revenue (12 months)
  const totalRevenue = totalMonthlyRevenue * 12; // 5.400.000
  
  const totalInvestment = 997 * 12; // 11.964
  
  const roi = ((totalRevenue - totalInvestment) / totalInvestment) * 100;

  const displayedPayments = showAllHistory ? fullPaymentHistory : fullPaymentHistory.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Gestão de Assinatura e Créditos</h2>
        <p className="text-slate-500 dark:text-slate-400">Gerencie seu plano Bear Lead, acompanhe seus créditos e renovações mensais.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Plano Atual */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-500 font-bold text-lg">
              <CreditCard size={20} />
              <h3>Plano Atual</h3>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">Informações do seu plano de assinatura</p>

            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-medium mb-1">Plano</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">Essentials</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-medium mb-1">Valor Mensal</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-500">R$ 997</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-medium mb-1">Próxima Renovação</p>
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                  <Calendar size={16} className="text-amber-500" />
                  05 de Janeiro de 2026
                </div>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-medium mb-1">Status</p>
                <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                  <CheckCircle size={14} />
                  Ativo
                </span>
              </div>
            </div>
          </div>

          <div>
            <button className="w-full py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Alterar Plano
            </button>
            <p className="text-center text-slate-400 dark:text-slate-600 text-xs mt-3">Em breve: gerenciamento completo de planos</p>
          </div>
        </div>

        {/* Card 2: Resumo Financeiro (Swapped) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-slate-800 dark:text-white font-bold text-lg">
              <TrendingUp size={20} className="text-amber-500" />
              <h3>Resumo Financeiro</h3>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">Estatísticas rápidas do seu investimento</p>

            <div className="grid grid-cols-2 gap-4 mb-auto">
               {/* 1. Total Investido (Assinatura) */}
               <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
                     <DollarSign size={14} className="text-green-500" /> Assinatura
                  </div>
                  <div className="text-xl font-bold text-red-700 dark:text-red-500">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalInvestment)}
                  </div>
               </div>

               {/* 2. Matrículas */}
               <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
                     <CheckCircle size={14} className="text-green-500" /> Alunos
                  </div>
                  <div className="text-xl font-bold text-amber-500">{totalEnrollments}</div>
               </div>

               {/* 3. ROI */}
               <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30 shadow-sm text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-emerald-100/70 text-xs font-medium mb-1">
                     <TrendingUp size={14} className="text-emerald-500" /> ROI
                  </div>
                  <div className="text-xl font-bold text-emerald-500 dark:text-emerald-400">+{roi.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%</div>
               </div>

               {/* 4. Faturamento Estimado (Receita) */}
               <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30 shadow-sm text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-green-100/70 text-xs font-medium mb-1">
                     <span className="text-amber-600 text-xs">💰</span> Receita
                  </div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0, compactDisplay: "short" }).format(totalRevenue)}
                  </div>
               </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4 flex items-start gap-3 mt-6">
               <div className="mt-1 shrink-0">
                  <TrendingUp className="text-blue-500 dark:text-blue-400" size={16} />
               </div>
               <div>
                  <p className="font-bold text-blue-700 dark:text-blue-300 text-sm mb-1">
                    Performance!
                  </p>
                  <p className="text-blue-600/80 dark:text-blue-200/80 text-xs leading-relaxed">
                    Investimento de <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', compactDisplay: 'short' }).format(totalInvestment)}</strong> gerou projeção de <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', compactDisplay: 'short' }).format(totalRevenue)}</strong> (LTV 1 ano).
                  </p>
               </div>
            </div>
        </div>

      </div>

      {/* Section 3: Próximas Cobranças */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
         <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg">
              <Calendar size={20} className="text-red-500" />
              <h3>Próximas Cobranças</h3>
            </div>
         </div>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">Histórico e previsão de pagamentos</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm uppercase">
                  <th className="py-4 px-6 font-semibold rounded-tl-lg rounded-bl-lg">Data</th>
                  <th className="py-4 px-6 font-semibold">Plano</th>
                  <th className="py-4 px-6 font-semibold">Valor</th>
                  <th className="py-4 px-6 font-semibold rounded-tr-lg rounded-br-lg">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 dark:text-slate-300">
                {displayedPayments.map((item, index) => (
                  <tr key={index} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors last:border-0">
                    <td className="py-4 px-6 font-medium">{item.date}</td>
                    <td className="py-4 px-6">{item.plan}</td>
                    <td className="py-4 px-6 font-bold text-red-600 dark:text-red-400">{item.value}</td>
                    <td className="py-4 px-6">
                      {item.status === 'Pago' && (
                        <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                          <CheckCircle size={12} /> Pago
                        </span>
                      )}
                      {item.status === 'Aguardando' && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                          <Clock size={12} /> Aguardando
                        </span>
                      )}
                      {item.status === 'Próxima' && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                          <Clock size={12} /> Próxima
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => setShowAllHistory(!showAllHistory)}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {showAllHistory ? (
                <>Ver menos <ChevronUp size={16} /></>
              ) : (
                <>Ver mais ({fullPaymentHistory.length - 3}) <ChevronDown size={16} /></>
              )}
            </button>
          </div>
      </div>

      {/* Section 4: Créditos Disponíveis (Swapped) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center gap-2 mb-2 text-slate-800 dark:text-white font-bold text-lg">
            <Link size={20} className="text-amber-500" />
            <h3>Créditos Disponíveis</h3>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">Acompanhe o uso dos seus créditos mensais</p>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-slate-600 dark:text-slate-400 font-medium">Créditos usados: <strong className="text-slate-900 dark:text-white">121</strong> / 200</span>
                 <span className="text-red-600 dark:text-red-500 font-bold">61%</span>
               </div>
               
               {/* Progress Bar */}
               <div className="w-full h-4 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden mb-2">
                 <div className="h-full bg-red-600 dark:bg-red-500 rounded-full" style={{ width: '61%' }}></div>
               </div>
               
               <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-6">
                 <Calendar size={12} />
                 Reset mensal em 05/01/2026
               </p>

               <div className="mb-6">
                 <p className="text-slate-500 dark:text-slate-400 text-sm">Créditos Restantes</p>
                 <p className="text-4xl font-bold text-amber-500">79</p>
               </div>

               <button className="w-full py-3 bg-amber-200 dark:bg-amber-700 text-amber-800 dark:text-amber-100 font-bold rounded-xl hover:bg-amber-300 dark:hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
                 <Link size={18} />
                 Adicionar Créditos
               </button>
               <p className="text-center text-slate-400 dark:text-slate-600 text-xs mt-3">Em breve: compra avulsa de créditos</p>
            </div>

            {/* Donut Chart */}
            <div className="w-48 h-48 relative shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={creditData}
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                     stroke="none"
                   >
                     {creditData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                      itemStyle={{ color: '#f8fafc' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
               {/* Legend */}
               <div className="flex justify-center gap-4 mt-2 text-xs font-medium">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div> Usado (121)
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-amber-600"></div> Disponível (79)
                  </div>
               </div>
            </div>
          </div>
        </div>

    </div>
  );
};
