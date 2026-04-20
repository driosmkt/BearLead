import React, { useState } from 'react';
import { Zap, Loader2, Copy, CheckCircle2, ChevronDown, ChevronUp, Sparkles, AlertCircle, CreditCard } from 'lucide-react';
import { Lead } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Props { lead: Lead; }

interface Sugestao {
  canal:     string;
  mensagem:  string;
  argumento: string;
}

export const ObjecaoIA: React.FC<Props> = ({ lead }) => {
  const { user } = useAuth();
  const [loading,   setLoading]   = useState(false);
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);
  const [expanded,  setExpanded]  = useState(false);
  const [copied,    setCopied]    = useState<number | null>(null);
  const [error,     setError]     = useState('');
  const [balance,   setBalance]   = useState<number | null>(null);

  const objecoes = lead.history
    .filter(h => h.content?.startsWith('Objeção registrada:'))
    .map(h => h.content.replace('Objeção registrada:', '').trim());

  const ultimaObjecao = objecoes[0] ?? '';
  if (!ultimaObjecao) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setSugestoes([]);

    // Buscar unit_id do usuário
    const { data: uu } = await supabase
      .from('user_units')
      .select('unit_id')
      .eq('user_id', user!.id)
      .single();

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-objecao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          lead,
          unit_id: uu?.unit_id,
          user_id: user!.id,
        }),
      });

      const data = await res.json();

      if (res.status === 402) {
        setError('credits_insuficientes');
        return;
      }
      if (res.status === 503) {
        setError('servico_indisponivel');
        return;
      }
      if (!res.ok || data.error) throw new Error(data.error ?? 'Erro desconhecido');

      setSugestoes(data.sugestoes);
      setBalance(data.balance_remaining);
      setExpanded(true);
    } catch (e) {
      setError('generico');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const canalColor: Record<string, string> = {
    'WhatsApp': 'text-green-600 bg-green-50 dark:bg-green-900/20',
    'E-mail':   'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    'Ligação':  'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  };

  const ErrorMsg = () => {
    if (error === 'credits_insuficientes') return (
      <div className="flex items-start gap-2 px-5 pb-4 text-sm">
        <CreditCard size={16} className="text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="font-bold text-amber-700 dark:text-amber-400">Créditos IA insuficientes</p>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Contate o administrador para recarregar os créditos da unidade.</p>
        </div>
      </div>
    );
    if (error === 'servico_indisponivel') return (
      <div className="flex items-start gap-2 px-5 pb-4 text-sm">
        <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
        <div>
          <p className="font-bold text-red-700 dark:text-red-400">Serviço temporariamente indisponível</p>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Entre em contato com o suporte do Bear Lead.</p>
        </div>
      </div>
    );
    if (error === 'generico') return (
      <p className="px-5 pb-4 text-xs text-red-500">Erro ao gerar sugestões. Tente novamente.</p>
    );
    return null;
  };

  return (
    <div className="card-glass border-l-4 border-l-violet-500 overflow-hidden">
      <button
        onClick={() => sugestoes.length > 0 ? setExpanded(v => !v) : handleGenerate()}
        disabled={loading}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="w-9 h-9 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center shrink-0">
          {loading ? <Loader2 size={18} className="text-violet-600 animate-spin" /> : <Sparkles size={18} className="text-violet-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold dark:text-white">Quebra de Objeção via IA</p>
            <span className="text-[9px] font-black bg-violet-100 dark:bg-violet-900/30 text-violet-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Premium</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 truncate">Objeção: "{ultimaObjecao}"</p>
        </div>
        {balance !== null && (
          <span className="text-[10px] text-slate-400 shrink-0">{balance} crédito{balance !== 1 ? 's' : ''}</span>
        )}
        {sugestoes.length > 0 && (
          expanded ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />
        )}
        {sugestoes.length === 0 && !loading && (
          <span className="text-xs font-bold text-violet-600 bg-violet-50 dark:bg-violet-900/20 px-3 py-1.5 rounded-xl shrink-0 flex items-center gap-1">
            <Zap size={12} /> Gerar sugestões
          </span>
        )}
      </button>

      {expanded && sugestoes.length > 0 && (
        <div className="px-5 pb-5 space-y-3 border-t border-slate-50 dark:border-slate-800 pt-4">
          {sugestoes.map((s, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${canalColor[s.canal] ?? 'text-slate-600 bg-slate-100'}`}>
                  {s.canal}
                </span>
                <button onClick={() => handleCopy(s.mensagem, i)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  {copied === i ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  {copied === i ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <p className="text-xs font-bold text-violet-700 dark:text-violet-400 italic">"{s.argumento}"</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{s.mensagem}</p>
            </div>
          ))}
          <button onClick={handleGenerate} disabled={loading}
            className="w-full py-2 text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors flex items-center justify-center gap-1.5">
            <Zap size={12} /> Gerar novas sugestões
          </button>
        </div>
      )}

      <ErrorMsg />
    </div>
  );
};
