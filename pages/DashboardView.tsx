import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  GraduationCap, 
  Percent,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useLeadsContext } from '../context/LeadsContext';
import { KpiCard } from '../components/KpiCard';
import { motion } from 'motion/react';

const mockChartData = [
  { name: 'Seg', leads: 12, agendados: 4 },
  { name: 'Ter', leads: 19, agendados: 7 },
  { name: 'Qua', leads: 15, agendados: 5 },
  { name: 'Qui', leads: 22, agendados: 12 },
  { name: 'Sex', leads: 30, agendados: 18 },
  { name: 'Sáb', leads: 10, agendados: 8 },
  { name: 'Dom', leads: 14, agendados: 10 },
];

const demographicData = [
  { name: 'Facebook', value: 45, color: '#3b5998' },
  { name: 'Google', value: 25, color: '#ea4335' },
  { name: 'Instagram', value: 30, color: '#e1306c' },
];

export const DashboardView: React.FC = () => {
  const { metrics } = useLeadsContext();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black dark:text-white">Dashboard de Performance</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Bem-vindo, Douglas. Aqui está o resumo da Maple Bear Petrolina.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <Clock size={16} className="text-primary" />
          <span className="text-sm font-semibold dark:text-slate-300">Atualizado: Agora</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total de Leads" 
          value={metrics.totalLeads} 
          icon={Users} 
          trend="12% vs last week" 
          trendPositive={true}
          delay={0.1}
        />
        <KpiCard 
          title="Agendados" 
          value={metrics.scheduled} 
          icon={CalendarCheck} 
          trend="5% vs last week" 
          trendPositive={true}
          delay={0.2}
          color="blue-500"
        />
        <KpiCard 
          title="Matriculados" 
          value={metrics.enrolled} 
          icon={GraduationCap} 
          trend="2% vs last week" 
          trendPositive={false}
          delay={0.3}
          color="green-500"
        />
        <KpiCard 
          title="Taxa de Conversão" 
          value={`${metrics.conversionRate.toFixed(1)}%`} 
          icon={Percent} 
          trend="8% surge" 
          trendPositive={true}
          delay={0.4}
          color="amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 card-glass p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display font-bold text-lg dark:text-white">Fluxo Semanal de Leads</h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Últimos 7 dias</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs font-semibold text-slate-500">Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-xs font-semibold text-slate-500">Agendados</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAgendados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 500, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#dc2626" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorLeads)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="agendados" 
                  stroke="#60a5fa" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAgendados)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics / Origin */}
        <div className="card-glass p-8">
          <h3 className="font-display font-bold text-lg mb-8 dark:text-white">Origem dos Leads</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black font-display dark:text-white">100%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital</span>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {demographicData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 tracking-tight">{item.name}</span>
                </div>
                <span className="text-sm font-black dark:text-white tabular-nums">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Retention / Conversion Section */}
        <div className="card-glass p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-bold text-lg dark:text-white text-balance">Pipeline de Conversão de IA</h3>
            <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-lg">Real-time</div>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Qualificação por IA</span>
                <span className="text-sm font-black text-primary">88%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '88%' }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
            <div className="relative">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Engajamento Noturno</span>
                <span className="text-sm font-black text-blue-500">65%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="h-full bg-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="mt-10 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-primary/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-slate-950 rounded-xl flex items-center justify-center shadow-sm">
                <TrendingUp className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold dark:text-white">Projeção LTV Facilitada</p>
                <p className="text-xs text-slate-500 font-medium">Baseado em 32 matrículas este mês</p>
              </div>
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-primary transition-colors" />
          </div>
        </div>

        {/* Small Data Grid */}
        <div className="card-glass p-8 overflow-hidden">
          <h3 className="font-display font-bold text-lg mb-6 dark:text-white">Leads de Alta Probabilidade</h3>
          <div className="space-y-4">
            {metrics.totalLeads > 0 && [...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950 text-primary font-bold rounded-lg flex items-center justify-center">
                    {i === 0 ? 'JD' : i === 1 ? 'MA' : i === 2 ? 'LC' : 'PR'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold dark:text-white">Responsável {i + 1}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{i % 2 === 0 ? 'Elementary' : 'Toddler'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200">{(90 - i * 5)}%</span>
                    <TrendingUp size={12} className="text-green-500" />
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase">Chance</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
