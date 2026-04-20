import React from 'react';
import { Users, CalendarCheck, GraduationCap, Percent, TrendingUp, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLeadsContext } from '../context/LeadsContext';
import { KpiCard } from '../components/KpiCard';
import { ViewState } from '../types';
import { CalendarWidget }   from '../components/CalendarWidget';
import { DashboardSkeleton } from '../components/KanbanSkeleton';

// chartData calculado a partir dos leads reais (últimos 7 dias)
// definido dentro do componente para ter acesso ao contexto

export const DashboardView: React.FC = () => {
  const { metrics, leads, setCurrentView, setSelectedLeadId, loading } = useLeadsContext();

  // Gráfico: agrupa leads dos últimos 7 dias por dia da semana
  const chartData = React.useMemo(() => {
    const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dayStr = d.toISOString().split('T')[0];
      const dayLeads     = leads.filter(l => l.createdAt.startsWith(dayStr));
      const dayAgendados = leads.filter(l => l.createdAt.startsWith(dayStr) && l.status === 'Agendado');
      return {
        name:      days[d.getDay()],
        leads:     dayLeads.length,
        agendados: dayAgendados.length,
      };
    });
  }, [leads]);

  const topLeads = [...leads]
    .filter(l => l.status !== 'Matriculado' && l.status !== 'Perdido')
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      {loading && <DashboardSkeleton />}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" style={{visibility: loading ? 'hidden' : 'visible', height: loading ? 0 : 'auto', overflow: loading ? 'hidden' : 'visible'}}>
        <div>
          <h2 className="text-3xl font-display font-black dark:text-white">Dashboard de Performance</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Bem-vindo, Douglas. Aqui está o resumo da Maple Bear Petrolina.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <Clock size={16} className="text-red-600" />
          <span className="text-sm font-semibold dark:text-slate-300">Atualizado: Agora</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total de Leads"    value={metrics.totalLeads}                      icon={Users}         trend="↑12% vs semana anterior" trendPositive={true}  delay={0.1} />
        <KpiCard title="Agendados"         value={metrics.scheduled}                       icon={CalendarCheck} trend="↑5% vs semana anterior"  trendPositive={true}  delay={0.2} color="blue-500" />
        <KpiCard title="Matriculados"      value={metrics.enrolled}                        icon={GraduationCap} trend="↓2% vs semana anterior"  trendPositive={false} delay={0.3} color="green-500" />
        <KpiCard title="Taxa de Conversão" value={`${metrics.conversionRate.toFixed(1)}%`} icon={Percent}       trend="↑8% esta semana"         trendPositive={true}  delay={0.4} color="amber-500" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-glass p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display font-bold text-lg dark:text-white">Fluxo Semanal de Leads</h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Últimos 7 dias</p>
            </div>
            <div className="flex gap-4">
              {[{ color: '#dc2626', label: 'Leads' }, { color: '#3b82f6', label: 'Agendados' }].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#dc2626" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAgen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Area type="monotone" dataKey="leads"     stroke="#dc2626" strokeWidth={2.5} fill="url(#gLeads)" dot={false} name="Leads" />
              <Area type="monotone" dataKey="agendados" stroke="#3b82f6" strokeWidth={2}   fill="url(#gAgen)"  dot={false} name="Agendados" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Calendário — coluna direita, mesma altura do gráfico */}
        <CalendarWidget />
      </div>

      {/* Alta Probabilidade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Alta Probabilidade — dados reais */}
        <div className="card-glass p-8 overflow-hidden">
          <h3 className="font-display font-bold text-lg mb-2 dark:text-white">Leads de Alta Probabilidade</h3>
          <p className="text-xs text-slate-400 mb-6">Leads ativos com maior chance de matrícula</p>
          <div className="space-y-3">
            {topLeads.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">Nenhum lead ativo no momento.</p>
            )}
            {topLeads.map((lead) => {
              const initials = lead.responsibleName.split(' ').slice(0, 2).map((n: string) => n[0]).join('');
              return (
                <div
                  key={lead.id}
                  onClick={() => { setSelectedLeadId(lead.id); setCurrentView(ViewState.LEAD_DETAIL); }}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 dark:bg-red-950 text-red-600 font-bold rounded-lg flex items-center justify-center text-xs">
                      {initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold dark:text-white">{lead.responsibleName}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lead.program}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200">{lead.probability}%</span>
                      <TrendingUp size={12} className="text-green-500" />
                    </div>
                    <p className="text-[10px] font-medium text-slate-400 uppercase">Chance</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
