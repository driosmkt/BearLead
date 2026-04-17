import React from 'react';
import { 
  Megaphone, 
  MousePointerClick, 
  DollarSign, 
  Users, 
  TrendingDown, 
  ArrowUpRight,
  Image as ImageIcon
} from 'lucide-react';
import { KpiCard } from '../components/KpiCard';

const topCreatives = [
  {
    id: 1,
    title: 'Matrículas Abertas 2026 - Vídeo Institucional',
    leads: 145,
    cpl: 'R$ 12,50',
    format: 'Vídeo (Feed)',
    color: 'from-red-500 to-amber-500'
  },
  {
    id: 2,
    title: 'Metodologia Canadense - Carrossel',
    leads: 112,
    cpl: 'R$ 14,20',
    format: 'Imagem (Stories)',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 3,
    title: 'Depoimento Pais - Bear Care',
    leads: 88,
    cpl: 'R$ 16,80',
    format: 'Vídeo (Reels)',
    color: 'from-emerald-500 to-teal-500'
  }
];

export const CampaignsView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Métricas de Campanhas</h2>
        <p className="text-slate-500 dark:text-slate-400">Desempenho consolidado dos últimos 30 dias</p>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <KpiCard
          title="Leads Gerados"
          value="345"
          trendValue="+15%"
          trendDirection="up"
          statusLabel="Meta Batida"
          statusColor="green"
          icon={<Users size={20} />}
          iconBgColor="bg-blue-50 dark:bg-blue-900/30"
          iconColor="text-blue-500 dark:text-blue-400"
        />
        <KpiCard
          title="Custo por Lead"
          value="R$ 15,42"
          trendValue="-5%"
          trendDirection="down" // Good thing for cost
          statusLabel="Otimizado"
          statusColor="green"
          icon={<TrendingDown size={20} />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-900/30"
          iconColor="text-emerald-500 dark:text-emerald-400"
        />
        <KpiCard
          title="Valor Investido"
          value="R$ 5.320"
          trendValue="+10%"
          trendDirection="up" // Spending more
          statusLabel="Dentro do Budget"
          statusColor="yellow"
          icon={<DollarSign size={20} />}
          iconBgColor="bg-amber-50 dark:bg-amber-900/30"
          iconColor="text-amber-500 dark:text-amber-400"
        />
        <KpiCard
          title="Taxa de Clique (CTR)"
          value="2.10%"
          trendValue="+0.4%"
          trendDirection="up"
          statusLabel="Alta Relevância"
          statusColor="green"
          icon={<MousePointerClick size={20} />}
          iconBgColor="bg-purple-50 dark:bg-purple-900/30"
          iconColor="text-purple-500 dark:text-purple-400"
        />
        <KpiCard
          title="Total Campanhas"
          value="4"
          trendValue="Ativas"
          trendDirection="neutral"
          statusLabel="Rodando"
          statusColor="green"
          icon={<Megaphone size={20} />}
          iconBgColor="bg-red-50 dark:bg-red-900/30"
          iconColor="text-red-500 dark:text-red-400"
        />
      </div>

      {/* Top Creatives Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="text-amber-500 text-2xl">🏆</span> Top 3 Melhores Criativos
          </h3>
          <button className="text-sm text-red-600 dark:text-red-400 font-medium hover:underline flex items-center gap-1">
            Ver todos os anúncios <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topCreatives.map((creative, index) => (
            <div key={creative.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
              {/* Creative Thumbnail Simulation */}
              <div className={`h-48 w-full bg-gradient-to-br ${creative.color} relative p-6 flex flex-col justify-end`}>
                 <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded">
                   #{index + 1}
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-500">
                    <ImageIcon size={64} className="text-white" />
                 </div>
                 <div className="relative z-10">
                   <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
                     {creative.format}
                   </span>
                   <h4 className="text-white font-bold text-lg leading-tight shadow-sm drop-shadow-md">
                     {creative.title}
                   </h4>
                 </div>
              </div>

              {/* Stats */}
              <div className="p-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Leads Gerados</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{creative.leads}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Custo/Lead</p>
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{creative.cpl}</p>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};