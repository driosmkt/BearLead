import React from 'react';
import { TrendingUp, Clock, Filter, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { config } from '../config';

const data = [
  {
    name: 'Leads Qualificados',
    Atual: 20,
    Novo: 85,
  },
  {
    name: 'Tempo de Resposta (min)',
    Atual: 180,
    Novo: 1,
  },
];

export const ImpactView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Resultados Esperados</h2>
        <p className="text-2xl text-slate-600 max-w-5xl">
          Transformamos curiosidade em previsibilidade de receita.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-8 rounded-2xl border-l-8 border-emerald-500 shadow-sm flex items-center justify-between">
            <div className="max-w-[70%]">
              <p className="text-slate-500 text-lg font-medium mb-1">Eficiência Comercial</p>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">100% dos leads triados antes de chegar ao consultor</h3>
            </div>
            <div className="bg-emerald-100 p-4 rounded-full">
              <Filter className="text-emerald-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border-l-8 border-blue-500 shadow-sm flex items-center justify-between">
             <div className="max-w-[70%]">
              <p className="text-slate-500 text-lg font-medium mb-1">Velocidade</p>
              <h3 className="text-3xl font-bold text-slate-900">Atendimento 24/7</h3>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <Clock className="text-blue-600" size={32} />
            </div>
          </div>

           <div className="bg-white p-8 rounded-2xl border-l-8 border-purple-500 shadow-sm flex items-center justify-between">
             <div className="max-w-[70%]">
              <p className="text-slate-500 text-lg font-medium mb-1">Foco do Time</p>
              <h3 className="text-3xl font-bold text-slate-900">Mais Visitas Reais</h3>
            </div>
            <div className="bg-purple-100 p-4 rounded-full">
              <Target className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
           <h3 className="text-2xl font-bold text-slate-800 mb-6">Projeção de Melhoria</h3>
           <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 14}} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="Atual" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Hoje" />
                <Bar dataKey="Novo" fill="#10b981" radius={[4, 4, 0, 0]} name="Com Nova Estrutura" />
              </BarChart>
            </ResponsiveContainer>
           </div>
           <p className="mt-4 text-slate-500 text-center italic">
             * Comparativo estimado de eficiência no processamento de leads
           </p>
        </div>
      </div>

      <div className="bg-emerald-900 text-white p-10 rounded-3xl mt-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-3xl font-bold mb-3">Visão de Futuro</h3>
          <p className="text-emerald-200 text-xl max-w-2xl">
            Saberemos exatamente de onde vem cada produtor, quanto gera por safra e qual canal traz mais receita para a {config.company.name}.
          </p>
        </div>
        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
           <TrendingUp size={48} className="text-emerald-400" />
        </div>
      </div>

    </div>
  );
};