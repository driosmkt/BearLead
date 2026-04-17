import React from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  MousePointer2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { KpiCard } from '../components/KpiCard';

const mockCampaigns = [
  { id: 1, name: 'Maple Bear - Matrículas 2026', leads: 45, cost: 'R$ 8,20', spent: 'R$ 369,00', ctr: '2.4%', platform: 'Facebook' },
  { id: 2, name: 'Bilinguismo - Top Funnel', leads: 32, cost: 'R$ 12,45', spent: 'R$ 398,40', ctr: '1.8%', platform: 'Instagram' },
  { id: 3, name: 'Agendamento WhatsApp - Retargeting', leads: 23, cost: 'R$ 5,90', spent: 'R$ 135,70', ctr: '4.2%', platform: 'Google' },
];

export const CampaignsView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black dark:text-white">Métricas de Campanhas</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Desempenho dos anúncios digitais da Maple Bear Petrolina.</p>
        </div>
        <button className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:bg-slate-50">
          <ExternalLink size={16} className="text-primary" />
          <span className="text-sm font-bold dark:text-slate-300">Gerenciador de Anúncios</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Gasto" value="R$ 903,10" icon={DollarSign} trend="15% vs last month" trendPositive={false} delay={0.1} />
        <KpiCard title="Custo Médio Lead" value="R$ 9,03" icon={TrendingUp} trend="2.5% decrease" trendPositive={true} delay={0.2} color="emerald-500" />
        <KpiCard title="Leads Gerados" value="100" icon={Megaphone} trend="22% growth" trendPositive={true} delay={0.3} color="blue-500" />
        <KpiCard title="CTR Médio" value="2.8%" icon={MousePointer2} trend="stable" trendPositive={true} delay={0.4} color="amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-glass overflow-hidden self-start">
          <div className="p-8 border-b border-slate-50 dark:border-slate-900">
            <h3 className="font-display font-bold text-lg dark:text-white">Melhores Criativos</h3>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-900">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    <img src={`https://picsum.photos/seed/ad${i}/200/200`} alt="Ad thumbnail" className="w-full h-full object-cover mix-blend-overlay opacity-80" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white mb-1">Vídeo: "O Diferencial Maple Bear"</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Feed Instagram • 1080x1350</p>
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Leads</span>
                        <span className="text-sm font-black dark:text-slate-200">{45 - i * 10}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Custo/Lead</span>
                        <span className="text-sm font-black text-primary">R$ {7.50 + i * 2}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        <div className="card-glass p-8">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="text-primary" />
            <h3 className="font-display font-bold text-lg dark:text-white">Métricas Ativas</h3>
          </div>
          <div className="space-y-8">
            {mockCampaigns.map((camp) => (
              <div key={camp.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black dark:text-white uppercase tracking-wider truncate max-w-[150px]">{camp.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    camp.platform === 'Facebook' ? 'bg-blue-100 text-blue-700' :
                    camp.platform === 'Instagram' ? 'bg-pink-100 text-pink-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {camp.platform}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-center border border-slate-100 dark:border-slate-800">
                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Leads</p>
                    <p className="text-xs font-black dark:text-white">{camp.leads}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-center border border-slate-100 dark:border-slate-800">
                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">CTR</p>
                    <p className="text-xs font-black dark:text-white tabular-nums">{camp.ctr}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-center border border-slate-100 dark:border-slate-800">
                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Custo/L</p>
                    <p className="text-xs font-black dark:text-white tabular-nums">{camp.cost}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
