import React, { useMemo, useState } from 'react';
import { useLeadsContext } from '../context/LeadsContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Users, CalendarCheck, GraduationCap, Target, ChevronDown } from 'lucide-react';

const COLORS = ['#dc2626','#2563eb','#16a34a','#d97706','#7c3aed','#0891b2'];

const PERIODS = [
  { label: 'Últimos 7 dias',  days: 7  },
  { label: 'Últimos 30 dias', days: 30 },
  { label: 'Últimos 90 dias', days: 90 },
  { label: 'Todo o período',  days: 0  },
];

export const ReportsView: React.FC = () => {
  const { leads } = useLeadsContext();
  const [periodDays, setPeriodDays] = useState(30);
  const [periodLabel, setPeriodLabel] = useState('Últimos 30 dias');

  const filtered = useMemo(() => {
    if (periodDays === 0) return leads;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - periodDays);
    return leads.filter(l => new Date(l.createdAt) >= cutoff);
  }, [leads, periodDays]);

  // KPIs
  const total       = filtered.length;
  const agendados   = filtered.filter(l => ['Agendado','Visitou','Matriculado'].includes(l.status)).length;
  const visitaram   = filtered.filter(l => ['Visitou','Matriculado'].includes(l.status)).length;
  const matriculados= filtered.filter(l => l.status === 'Matriculado').length;
  const txAgendamento = total > 0 ? ((agendados / total) * 100).toFixed(1) : '0.0';
  const txVisita      = agendados > 0 ? ((visitaram / agendados) * 100).toFixed(1) : '0.0';
  const txMatricula   = visitaram > 0 ? ((matriculados / visitaram) * 100).toFixed(1) : '0.0';

  // Por origem
  const byOrigin = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(l => { map[l.origin] = (map[l.origin] ?? 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filtered]);

  // Por programa
  const byProgram = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(l => { map[l.program] = (map[l.program] ?? 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filtered]);

  // Por score
  const byScore = useMemo(() => {
    const q = filtered.filter(l => l.score === 'Quente').length;
    const m = filtered.filter(l => l.score === 'Morno').length;
    const f = filtered.filter(l => l.score === 'Frio').length;
    return [
      { name: 'Quente', value: q, color: '#dc2626' },
      { name: 'Morno',  value: m, color: '#d97706' },
      { name: 'Frio',   value: f, color: '#2563eb' },
    ].filter(s => s.value > 0);
  }, [filtered]);

  // Funil de conversão
  const funnelData = [
    { stage: 'Leads',       value: total,        pct: '100%',       color: '#dc2626' },
    { stage: 'Agendados',   value: agendados,     pct: `${txAgendamento}%`, color: '#d97706' },
    { stage: 'Visitaram',   value: visitaram,     pct: `${txVisita}%`,      color: '#2563eb' },
    { stage: 'Matriculados',value: matriculados,  pct: `${txMatricula}%`,   color: '#16a34a' },
  ];

  const KpiCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string }> =
    ({ icon, label, value, sub, color = 'red' }) => (
    <div className="card-glass p-5">
      <div className={`w-10 h-10 rounded-xl bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-display font-black dark:text-white">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black dark:text-white">Relatórios</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Análise de performance comercial da unidade.</p>
        </div>
        {/* Seletor de período */}
        <div className="relative">
          <select
            value={periodDays}
            onChange={e => {
              const d = Number(e.target.value);
              setPeriodDays(d);
              setPeriodLabel(PERIODS.find(p => p.days === d)?.label ?? '');
            }}
            className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600/20 cursor-pointer"
          >
            {PERIODS.map(p => <option key={p.days} value={p.days}>{p.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<Users size={20} className="text-red-600" />}       label="Total de Leads"  value={total}        sub={periodLabel} />
        <KpiCard icon={<CalendarCheck size={20} className="text-amber-500" />} label="Agendamentos" value={agendados}    sub={`${txAgendamento}% dos leads`} color="amber" />
        <KpiCard icon={<Target size={20} className="text-blue-600" />}     label="Visitaram"       value={visitaram}    sub={`${txVisita}% dos agendados`} color="blue" />
        <KpiCard icon={<GraduationCap size={20} className="text-green-600" />} label="Matriculados" value={matriculados} sub={`${txMatricula}% dos que visitaram`} color="green" />
      </div>

      {/* Funil de conversão */}
      <div className="card-glass p-6">
        <h3 className="font-display font-bold text-base dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp size={16} className="text-red-600" /> Funil de Conversão
        </h3>
        <div className="flex items-end gap-3 h-48">
          {funnelData.map((item, i) => {
            const heightPct = total > 0 ? (item.value / total) * 100 : 0;
            return (
              <div key={item.stage} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end" style={{ height: '140px' }}>
                  <div
                    className="w-full rounded-t-xl transition-all duration-700 flex items-end justify-center pb-2"
                    style={{ height: `${Math.max(heightPct, 4)}%`, backgroundColor: item.color }}
                  >
                    {item.value > 0 && (
                      <span className="text-white text-sm font-black">{item.value}</span>
                    )}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">{item.stage}</p>
                <span className="text-xs font-bold" style={{ color: item.color }}>{item.pct}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gráficos lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Por origem */}
        <div className="card-glass p-6">
          <h3 className="font-display font-bold text-base dark:text-white mb-5">Leads por Origem</h3>
          {byOrigin.length === 0
            ? <p className="text-sm text-slate-400 text-center py-10">Sem dados no período</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byOrigin} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} width={80} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="value" name="Leads" radius={[0, 6, 6, 0]}>
                    {byOrigin.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </div>

        {/* Por programa */}
        <div className="card-glass p-6">
          <h3 className="font-display font-bold text-base dark:text-white mb-5">Leads por Programa</h3>
          {byProgram.length === 0
            ? <p className="text-sm text-slate-400 text-center py-10">Sem dados no período</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byProgram} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} width={100} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="value" name="Leads" radius={[0, 6, 6, 0]}>
                    {byProgram.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </div>

        {/* Por score (pizza) */}
        <div className="card-glass p-6">
          <h3 className="font-display font-bold text-base dark:text-white mb-5">Distribuição por Score</h3>
          {byScore.length === 0
            ? <p className="text-sm text-slate-400 text-center py-10">Sem dados no período</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byScore} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                    paddingAngle={3} dataKey="value" nameKey="name">
                    {byScore.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )
          }
        </div>

        {/* Taxa de conversão resumo */}
        <div className="card-glass p-6">
          <h3 className="font-display font-bold text-base dark:text-white mb-5">Taxas de Conversão</h3>
          <div className="space-y-4">
            {[
              { label: 'Lead → Agendamento', value: Number(txAgendamento), color: '#d97706' },
              { label: 'Agendamento → Visita', value: Number(txVisita),     color: '#2563eb' },
              { label: 'Visita → Matrícula',  value: Number(txMatricula),   color: '#16a34a' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{item.label}</p>
                  <p className="text-sm font-black" style={{ color: item.color }}>{item.value.toFixed(1)}%</p>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(item.value, 100)}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800">
              Baseado em {total} lead{total !== 1 ? 's' : ''} no período selecionado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
