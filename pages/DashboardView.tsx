import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Calendar, 
  Download,
  Filter,
  Clock,
  Zap,
  Award
} from 'lucide-react';
import { KpiCard } from '../components/KpiCard';
import { CalendarWidget } from '../components/CalendarWidget';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';

// Data for the journey chart - Aligned with Subscription View (150 enrolled)
const journeyData = [
  { name: 'Novo', value: 1250 },
  { name: 'Contatado', value: 890 },
  { name: 'Qualificado', value: 620 },
  { name: 'Agendado', value: 310 },
  { name: 'Matriculado', value: 150 },
];

// 1. Lead Source Data
const sourceData = [
  { name: 'Instagram', value: 35, color: '#E1306C' },
  { name: 'Facebook Ads', value: 30, color: '#4267B2' },
  { name: 'Google Ads', value: 25, color: '#0F9D58' },
  { name: 'Site/Orgânico', value: 10, color: '#F4B400' },
];

// 2. Age Data (Parents)
const ageData = [
  { name: '18-25', value: 5, color: '#94a3b8' },
  { name: '26-35', value: 45, color: '#3b82f6' }, // Main demographic
  { name: '36-45', value: 35, color: '#8b5cf6' }, // Main demographic
  { name: '46-55', value: 10, color: '#10b981' },
  { name: '55+', value: 5, color: '#64748b' },
];

// 3. Gender Data
const genderData = [
  { name: 'Feminino', value: 72, color: '#ec4899' },
  { name: 'Masculino', value: 28, color: '#3b82f6' },
];

// 4. Entry Time Data (Highlighting Night/Evening)
const timeData = [
  { name: '07h - 12h (Manhã)', value: 15, color: '#fbbf24' }, // Amber
  { name: '13h - 17h (Tarde)', value: 20, color: '#f97316' }, // Orange
  { name: '18h - 00h (Noite)', value: 45, color: '#4f46e5' }, // Indigo (High volume)
  { name: '01h - 06h (Madrugada)', value: 20, color: '#1e1b4b' }, // Dark Blue
];

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pt-6 pb-12">
      
      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-200">
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
             <Filter size={20} />
             <span>Filtros:</span>
           </div>
           
           <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
               <Calendar size={16} />
               Este Ano
               <span className="ml-2 text-slate-400">▼</span>
             </button>
             <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
               Todas as Origens
               <span className="ml-2 text-slate-400">▼</span>
             </button>
           </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 w-full md:w-auto justify-center transition-colors">
          <Download size={18} />
          Exportar Dashboard
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Leads Hoje"
          value="12"
          trendValue="+18% vs semana anterior"
          trendDirection="up"
          statusLabel="Acima da média"
          statusColor="red"
          icon={<TrendingUp size={24} />}
          iconBgColor="bg-red-50 dark:bg-red-900/30"
          iconColor="text-red-500 dark:text-red-400"
        />
        <KpiCard 
          title="Últimos 7 dias"
          value="84"
          trendValue="+12% vs semana anterior"
          trendDirection="up"
          statusLabel="Alta demanda"
          statusColor="red"
          icon={<Users size={24} />}
          iconBgColor="bg-red-50 dark:bg-red-900/30"
          iconColor="text-red-500 dark:text-red-400"
        />
        <KpiCard 
          title="Últimos 30 dias"
          value="345"
          trendValue="+15% vs mês anterior"
          trendDirection="up"
          statusLabel="Crescimento constante"
          statusColor="green"
          icon={<Target size={24} />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-900/30"
          iconColor="text-emerald-500 dark:text-emerald-400"
        />
        <KpiCard 
          title="Taxa de Agendamento"
          value="24.8%"
          trendValue="+5% vs mês anterior"
          trendDirection="up"
          statusLabel="Funil saudável"
          statusColor="green"
          icon={<Calendar size={24} />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-900/30"
          iconColor="text-emerald-500 dark:text-emerald-400"
        />
      </div>

      {/* Row 2: Journey Chart + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Jornada do Lead até a Matrícula</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Acompanhe o volume acumulado em cada etapa do funil</p>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={journeyData}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 14, fill: '#64748b' }} 
                  width={100}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar 
                  dataKey="value" 
                  fill="#dc2626" 
                  background={{ fill: 'var(--tw-prose-invert-bg, #f8fafc)' }} 
                  radius={[0, 4, 4, 0]} 
                  barSize={40} 
                  label={{ position: 'right', fill: '#64748b', fontSize: 12 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1">
          <CalendarWidget />
        </div>
      </div>

      {/* Row 3: Velocidade de Conversão */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-2 mb-8">
           <Zap className="text-amber-500" size={24} />
           <h3 className="text-xl font-bold text-slate-800 dark:text-white">Tempo Médio de Conversão</h3>
        </div>

        <div className="relative">
          {/* Connecting Line - Fixed width and position */}
          <div className="absolute top-1/2 left-[10%] w-[80%] h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0 hidden md:block"></div>
          
          {/* Grid Layout - 5 Columns for proper spacing */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10 items-center">
            
            {/* Step 1: Novo Lead */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex flex-col items-center text-center shadow-sm">
               <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-3 font-bold">
                 1
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Entrada do Lead</p>
               <p className="font-bold text-slate-800 dark:text-white">Novo Lead</p>
            </div>

            {/* Time 1: Imediato */}
            <div className="flex flex-col items-center justify-center py-4 md:py-0">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                ⚡ Imediato (&lt; 30s)
              </div>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-medium">Até 1º Contato</p>
            </div>

            {/* Step 2: Agendamento */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex flex-col items-center text-center shadow-sm">
               <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                 <Clock size={24} />
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Qualificação AI</p>
               <p className="font-bold text-slate-800 dark:text-white">Até Agendamento</p>
            </div>

             {/* Time 2: Média 2 Dias */}
            <div className="flex flex-col items-center justify-center py-4 md:py-0">
               <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-200 dark:border-purple-800 whitespace-nowrap">
                 📅 Média 2 Dias
               </div>
               <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-medium">Até Matrícula</p>
            </div>

             {/* Step 3: Sucesso */}
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex flex-col items-center text-center shadow-sm">
               <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                 <Award size={24} />
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Sucesso</p>
               <p className="font-bold text-slate-800 dark:text-white">Matrícula Realizada</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Demographics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Source */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h4 className="font-bold text-slate-800 dark:text-white mb-4 text-center">Origem dos Leads</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#fff'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
             {sourceData.map((entry) => (
               <div key={entry.name} className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                 <div className="w-2 h-2 rounded-full" style={{backgroundColor: entry.color}}></div>
                 {entry.name}
               </div>
             ))}
          </div>
        </div>

        {/* Age */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h4 className="font-bold text-slate-800 dark:text-white mb-4 text-center">Faixa Etária (Pais)</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageData}
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#fff'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
             {ageData.map((entry) => (
               <div key={entry.name} className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                 <div className="w-2 h-2 rounded-full" style={{backgroundColor: entry.color}}></div>
                 {entry.name}
               </div>
             ))}
          </div>
        </div>

        {/* Gender */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h4 className="font-bold text-slate-800 dark:text-white mb-4 text-center">Gênero do Lead</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#fff'}} />
                <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 5: Highlighted Entry Time */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Clock size={200} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-500 p-2 rounded-lg">
                <Clock size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold">Horário de Entrada dos Leads</h3>
            </div>
            
            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
              <strong className="text-indigo-400">65% dos leads</strong> chegam fora do horário comercial (18h às 06h). 
              Isso comprova a necessidade crítica de atendimento automático via IA para não perder oportunidades noturnas.
            </p>

            <div className="space-y-3">
              {timeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium text-sm">{item.name}</span>
                   </div>
                   <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[300px] w-full bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value: number) => [`${value}%`, 'Volume']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};