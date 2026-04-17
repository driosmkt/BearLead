import React from 'react';
import { AlertTriangle, MousePointerClick, UserX, DollarSign, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { config } from '../config';

const data = [
  { name: 'Visitantes Site', value: 1000, color: '#10b981' }, // emerald-500
  { name: 'Encontram Contato', value: 300, color: '#f59e0b' }, // amber-500
  { name: 'Iniciam Conversa', value: 50, color: '#ef4444' }, // red-500
];

export const DiagnosisView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Diagnóstico: O Funil Quebrado</h2>
        <p className="text-2xl text-slate-600 max-w-5xl">
          Produtores interessados estão se perdendo na complexidade da navegação. A "vitrine" é bonita, mas a porta de entrada está escondida.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Visual Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-[500px]">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Perda de Oportunidade Atual</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 16, fill: '#475569', fontWeight: 600 }} 
                width={180}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', padding: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={60}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Text Breakdown */}
        <div className="space-y-6">
           <div className="bg-red-50 p-6 rounded-2xl border-l-8 border-red-500 flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-full mt-1">
                <MousePointerClick className="text-red-600" size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-red-900">Excesso de Cliques</h4>
                <p className="text-xl text-red-800 mt-2">
                  O produtor precisa navegar por categorias e páginas "Saiba Mais". Antes de achar um botão de ação, muitos produtores desistem.
                </p>
              </div>
           </div>

           <div className="bg-orange-50 p-6 rounded-2xl border-l-8 border-orange-500 flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-full mt-1">
                <UserX className="text-orange-600" size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-orange-900">Falta de Rastreio</h4>
                <p className="text-xl text-orange-800 mt-2">
                  Visitantes do Google e Instagram se misturam no site institucional. O comercial não sabe quais canais geram mais oportunidades.
                </p>
              </div>
           </div>

           <div className="bg-slate-50 p-6 rounded-2xl border-l-8 border-slate-500 flex items-start gap-4">
              <div className="bg-slate-200 p-3 rounded-full mt-1">
                <DollarSign className="text-slate-600" size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900">Dinheiro na Mesa</h4>
                <p className="text-xl text-slate-700 mt-2">
                  Cada produtor que desiste representa milhares de reais por safra que poderiam estar na carteira da {config.company.name}.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};