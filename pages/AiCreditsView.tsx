import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Zap, CreditCard, CheckCircle2, Star, Sparkles,
  TrendingUp, Clock, Shield, ChevronRight, AlertCircle
} from 'lucide-react';

interface Credits { balance: number; total_used: number; }
interface UsageLog { feature: string; cost: number; created_at: string; }

const PLANS = [
  {
    id:       'starter',
    name:     'Starter',
    credits:  50,
    price:    'R$ 29,90',
    priceNum: 29.90,
    per:      'pacote único',
    color:    'slate',
    features: ['50 análises de objeção', 'Validade: 6 meses', 'Suporte por e-mail'],
    highlight: false,
  },
  {
    id:       'basico',
    name:     'Básico',
    credits:  200,
    price:    'R$ 79,90',
    priceNum: 79.90,
    per:      'pacote único',
    color:    'blue',
    features: ['200 análises de objeção', 'Validade: 6 meses', 'Suporte prioritário', 'Economize 7% vs Starter'],
    highlight: false,
  },
  {
    id:       'pro',
    name:     'Pro',
    credits:  500,
    price:    'R$ 149,90',
    priceNum: 149.90,
    per:      'pacote único',
    color:    'violet',
    features: ['500 análises de objeção', 'Validade: 12 meses', 'Suporte VIP', 'Economize 10% vs Starter', 'Relatório de objeções'],
    highlight: true,
  },
  {
    id:       'ilimitado',
    name:     'Ilimitado',
    credits:  -1,
    price:    'R$ 249,90',
    priceNum: 249.90,
    per:      'por mês',
    color:    'red',
    features: ['500 análises/mês incluídas', 'Renovação automática', 'Suporte VIP 24h', 'Acesso a novos recursos IA', 'Relatórios avançados'],
    highlight: false,
  },
];

export const AiCreditsView: React.FC = () => {
  const { user } = useAuth();
  const [credits,    setCredits]    = useState<Credits | null>(null);
  const [usage,      setUsage]      = useState<UsageLog[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState<string | null>(null);
  const [showModal,  setShowModal]  = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: uu } = await supabase
      .from('user_units').select('unit_id').eq('user_id', user!.id).single();

    if (!uu) { setLoading(false); return; }

    const [{ data: cr }, { data: ul }] = await Promise.all([
      supabase.from('ai_credits').select('balance, total_used').eq('unit_id', uu.unit_id).single(),
      supabase.from('ai_usage_log').select('feature, cost, created_at')
        .eq('unit_id', uu.unit_id).order('created_at', { ascending: false }).limit(10),
    ]);

    setCredits(cr);
    setUsage(ul ?? []);
    setLoading(false);
  };

  const handleSelectPlan = (planId: string) => {
    setSelected(planId);
    setShowModal(true);
  };

  const plan = PLANS.find(p => p.id === selected);
  const balancePct = credits
    ? Math.min(100, Math.round((credits.balance / Math.max(credits.balance + credits.total_used, 1)) * 100))
    : 0;

  const colorMap: Record<string, string> = {
    slate:  'border-slate-200 dark:border-slate-700',
    blue:   'border-blue-200 dark:border-blue-800',
    violet: 'border-violet-300 dark:border-violet-700 ring-2 ring-violet-500/20',
    red:    'border-red-200 dark:border-red-800',
  };
  const btnMap: Record<string, string> = {
    slate:  'bg-slate-700 hover:bg-slate-800',
    blue:   'bg-blue-600 hover:bg-blue-700',
    violet: 'bg-violet-600 hover:bg-violet-700',
    red:    'bg-red-600 hover:bg-red-700',
  };
  const badgeMap: Record<string, string> = {
    slate:  'bg-slate-100 text-slate-600',
    blue:   'bg-blue-50 text-blue-600',
    violet: 'bg-violet-50 text-violet-600',
    red:    'bg-red-50 text-red-600',
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">

      {/* Header */}
      <div>
        <h2 className="text-3xl font-display font-black dark:text-white">Créditos IA</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Gerencie seus créditos para análises com inteligência artificial.</p>
      </div>


      {/* Banner de orientação — sempre visível */}
      {credits && (
        <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-violet-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-violet-700 dark:text-violet-400 text-sm">Use seus créditos para Quebra de Objeção via IA</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Quando um lead estiver em <strong>Follow-up de Recuperação</strong>, registre a objeção principal na tela do lead
              e clique em <strong>"Gerar sugestões"</strong> — a IA analisa o contexto e entrega 3 estratégias prontas para
              WhatsApp, E-mail e Ligação.
            </p>
          </div>
        </div>
      )}

      {/* Saldo atual */}
      <div className="card-glass p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-violet-50 dark:bg-violet-900/20 rounded-2xl flex items-center justify-center shrink-0">
              <Sparkles size={26} className="text-violet-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Créditos IA disponíveis</p>
              {loading
                ? <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                : <p className="text-4xl font-display font-black dark:text-white">{credits?.balance ?? 0}</p>
              }
              <p className="text-xs text-slate-400 mt-0.5">
                {credits ? `${credits.total_used} utilizados no total` : 'Carregando...'}
              </p>
            </div>
          </div>

          {/* Barra de progresso */}
          {credits && (
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Utilizado</span>
                <span>{credits.total_used} / {credits.balance + credits.total_used}</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full transition-all duration-700"
                  style={{ width: `${100 - balancePct}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{balancePct}% disponível</p>
            </div>
          )}

          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-600/20 text-sm whitespace-nowrap">
            <CreditCard size={16} /> Comprar créditos
          </button>
        </div>
      </div>

      {/* Planos */}
      <div>
        <h3 className="font-display font-bold text-lg dark:text-white mb-4">Pacotes de Créditos IA</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(p => (
            <div key={p.id}
              className={`card-glass p-6 flex flex-col border-2 transition-all relative ${colorMap[p.color]}`}>
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-violet-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                    <Star size={10} /> Mais popular
                  </span>
                </div>
              )}

              <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg self-start mb-3 ${badgeMap[p.color]}`}>
                {p.name}
              </div>

              <div className="mb-4">
                <p className="text-3xl font-display font-black dark:text-white">{p.price}</p>
                <p className="text-xs text-slate-400">{p.per}</p>
                {p.credits > 0 && (
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-1">
                    {p.credits} créditos
                    <span className="text-xs font-normal text-slate-400 ml-1">
                      = R$ {(p.priceNum / p.credits).toFixed(2)}/crédito
                    </span>
                  </p>
                )}
                {p.credits === -1 && (
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-1">500 créditos/mês</p>
                )}
              </div>

              <ul className="space-y-2 flex-1 mb-5">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <CheckCircle2 size={13} className={`mt-0.5 shrink-0 text-${p.color === 'slate' ? 'slate' : p.color}-500`} />
                    {f}
                  </li>
                ))}
              </ul>

              <button onClick={() => handleSelectPlan(p.id)}
                className={`w-full py-2.5 text-white text-sm font-bold rounded-xl transition-all ${btnMap[p.color]}`}>
                Adquirir
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">
          1 crédito = 1 análise de Quebra de Objeção via IA
        </p>
      </div>

      {/* Histórico de uso */}
      {usage.length > 0 && (
        <div className="card-glass p-6">
          <h3 className="font-display font-bold text-base dark:text-white mb-4 flex items-center gap-2">
            <Clock size={16} className="text-slate-400" /> Histórico de Uso
          </h3>
          <div className="space-y-2">
            {usage.map((u, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-violet-50 dark:bg-violet-900/20 rounded-lg flex items-center justify-center">
                    <Zap size={13} className="text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold dark:text-slate-300">Quebra de Objeção</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(u.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-violet-600">-{u.cost} crédito</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* O que são créditos IA */}
      <div className="card-glass p-6 bg-gradient-to-br from-violet-50 to-slate-50 dark:from-violet-900/10 dark:to-slate-900">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center shrink-0">
            <Shield size={18} className="text-violet-600" />
          </div>
          <div>
            <p className="font-bold text-sm dark:text-white mb-1">O que são Créditos IA?</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Cada crédito libera uma análise de <strong>Quebra de Objeção via IA</strong> — onde o sistema analisa
              o contexto do lead e gera 3 estratégias personalizadas (WhatsApp, E-mail e Ligação) para fechar a venda.
              Os créditos não expiram dentro da validade do pacote, são compartilhados entre toda a equipe da unidade e funcionam com qualquer modelo de IA configurado pelo administrador do sistema.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de compra */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 dark:border-slate-900 p-8">
            <div className="w-14 h-14 bg-violet-50 dark:bg-violet-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard size={26} className="text-violet-600" />
            </div>
            <h3 className="font-display font-bold text-lg dark:text-white text-center mb-1">
              {plan ? `Pacote ${plan.name}` : 'Comprar Créditos'}
            </h3>
            {plan && (
              <p className="text-center text-2xl font-black text-violet-600 mb-1">{plan.price}</p>
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
              Para adquirir créditos, entre em contato com o suporte Bear Lead.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span className="dark:text-slate-300">WhatsApp: <strong>(87) 99165-9981</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span className="dark:text-slate-300">E-mail: <strong>suporte@bearlead.com.br</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                <AlertCircle size={12} className="shrink-0" />
                <span>Créditos ativados em até 1 hora útil após confirmação do pagamento.</span>
              </div>
            </div>
            <button onClick={() => setShowModal(false)}
              className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-200 transition-all">
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
