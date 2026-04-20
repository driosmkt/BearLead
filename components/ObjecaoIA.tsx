import React, { useState } from 'react';
import { Zap, Loader2, Copy, CheckCircle2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Lead } from '../types';

interface Props { lead: Lead; }

interface Sugestao {
  canal:      string; // WhatsApp, E-mail, Ligação
  mensagem:   string;
  argumento:  string;
}

export const ObjecaoIA: React.FC<Props> = ({ lead }) => {
  const [loading,    setLoading]    = useState(false);
  const [sugestoes,  setSugestoes]  = useState<Sugestao[]>([]);
  const [expanded,   setExpanded]   = useState(false);
  const [copied,     setCopied]     = useState<number | null>(null);
  const [error,      setError]      = useState('');

  // Extrair objeções registradas do histórico
  const objecoes = lead.history
    .filter(h => h.content?.startsWith('Objeção registrada:'))
    .map(h => h.content.replace('Objeção registrada:', '').trim());

  const ultimaObjecao = objecoes[0] ?? '';

  const handleGenerate = async () => {
    if (!ultimaObjecao) return;
    setLoading(true);
    setError('');
    setSugestoes([]);

    const prompt = `Você é um especialista em vendas de escolas bilíngues premium (Maple Bear).

Lead: ${lead.responsibleName}
Criança: ${lead.childName}, ${lead.childAge} anos, programa ${lead.program}
Score: ${lead.score}
Status: ${lead.status}
Resumo da conversa: ${lead.aiSummary || 'Não disponível'}
Objeção principal registrada: "${ultimaObjecao}"

Gere 3 sugestões de abordagem para quebrar essa objeção e avançar para matrícula.
Cada sugestão deve ser para um canal diferente (WhatsApp, E-mail, Ligação).

Responda APENAS em JSON válido, sem texto antes ou depois, sem markdown:
[
  {
    "canal": "WhatsApp",
    "mensagem": "mensagem curta e direta para enviar no WhatsApp (máx 3 linhas)",
    "argumento": "argumento central que quebra a objeção"
  },
  {
    "canal": "E-mail",
    "mensagem": "mensagem mais elaborada para e-mail (2-3 parágrafos curtos)",
    "argumento": "argumento central que quebra a objeção"
  },
  {
    "canal": "Ligação",
    "mensagem": "roteiro de abertura para ligação (o que falar nos primeiros 30 segundos)",
    "argumento": "argumento central que quebra a objeção"
  }
]`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model:      'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages:   [{ role: 'user', content: prompt }],
        }),
      });

      const data = await res.json();
      const text = data.content?.[0]?.text ?? '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed: Sugestao[] = JSON.parse(clean);
      setSugestoes(parsed);
      setExpanded(true);
    } catch (e) {
      setError('Erro ao gerar sugestões. Tente novamente.');
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

  // Não mostrar se não tiver objeção registrada
  if (!ultimaObjecao) return null;

  return (
    <div className="card-glass border-l-4 border-l-violet-500 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => sugestoes.length > 0 ? setExpanded(v => !v) : handleGenerate()}
        disabled={loading}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="w-9 h-9 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center shrink-0">
          {loading
            ? <Loader2 size={18} className="text-violet-600 animate-spin" />
            : <Sparkles size={18} className="text-violet-600" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold dark:text-white">Quebra de Objeção via IA</p>
            <span className="text-[9px] font-black bg-violet-100 dark:bg-violet-900/30 text-violet-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Premium</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 truncate">
            Objeção: "{ultimaObjecao}"
          </p>
        </div>
        {sugestoes.length > 0 && (
          expanded ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />
        )}
        {sugestoes.length === 0 && !loading && (
          <span className="text-xs font-bold text-violet-600 bg-violet-50 dark:bg-violet-900/20 px-3 py-1.5 rounded-xl shrink-0 flex items-center gap-1">
            <Zap size={12} /> Gerar sugestões
          </span>
        )}
      </button>

      {/* Sugestões */}
      {expanded && sugestoes.length > 0 && (
        <div className="px-5 pb-5 space-y-3 border-t border-slate-50 dark:border-slate-800 pt-4">
          {sugestoes.map((s, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${canalColor[s.canal] ?? 'text-slate-600 bg-slate-100'}`}>
                  {s.canal}
                </span>
                <button
                  onClick={() => handleCopy(s.mensagem, i)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {copied === i ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  {copied === i ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <p className="text-xs font-bold text-violet-700 dark:text-violet-400 italic">"{s.argumento}"</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{s.mensagem}</p>
            </div>
          ))}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2 text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Zap size={12} /> Gerar novas sugestões
          </button>
        </div>
      )}

      {error && (
        <p className="px-5 pb-4 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};
