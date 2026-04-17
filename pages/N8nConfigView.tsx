import React from 'react';
import { 
  Workflow, 
  Copy, 
  Check, 
  ShieldCheck, 
  Link, 
  Code,
  LayoutGrid,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { n8nConfig } from '../lib/n8nConfig';
import { motion } from 'motion/react';

export const N8nConfigView: React.FC = () => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const codeExample = JSON.stringify({
    responsibleName: "Douglas Rios",
    whatsapp: "5587988880000",
    email: "douglas@bearlead.com",
    childName: "Arthur",
    program: "Toddler",
    score: "Quente"
  }, null, 2);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black dark:text-white">Configuração n8n</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Conecte sua automação externa ao dashboard do Bear Lead.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg">
          <Link size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Integração via Webhook</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Config Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-glass p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Workflow size={22} />
              </div>
              <h3 className="font-display font-bold text-xl dark:text-white tracking-tight">Endpoint de Integração</h3>
            </div>

            <div className="space-y-6">
              {/* Webhook URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Webhook URL</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400 truncate flex items-center">
                    {n8nConfig.webhookUrl}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(n8nConfig.webhookUrl, 'url')}
                    className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:text-primary transition-all shadow-sm"
                  >
                    {copied === 'url' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              {/* Bearer Token */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Auth Token (Bearer)</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400 truncate flex items-center">
                    {n8nConfig.bearerToken}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(n8nConfig.bearerToken, 'token')}
                    className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:text-primary transition-all shadow-sm"
                  >
                    {copied === 'token' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              {/* Unit UUID */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">ID da Unidade (Unit UUID)</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400 truncate flex items-center">
                    {n8nConfig.unitId}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(n8nConfig.unitId, 'uuid')}
                    className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:text-primary transition-all shadow-sm"
                  >
                    {copied === 'uuid' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-10 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/50 flex items-start gap-4">
              <ShieldCheck className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Dica de Segurança</p>
                <p className="text-xs text-amber-700 dark:text-amber-400/80 leading-relaxed font-medium mt-1">
                  Certifique-se de enviar o token no cabeçalho <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">Authorization: Bearer [TOKEN]</code> para que o Bear Lead aceite as requisições.
                </p>
              </div>
            </div>
          </div>

          <div className="card-glass p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center">
                <LayoutGrid size={22} />
              </div>
              <h3 className="font-display font-bold text-xl dark:text-white tracking-tight">Mapeamento de Campos</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(n8nConfig.fieldMap).map(([n8nKey, blKey]) => (
                <div key={n8nKey} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex-1 font-mono text-[11px] text-slate-500">{n8nKey}</div>
                  <Zap size={14} className="text-primary" />
                  <div className="flex-1 font-bold text-xs dark:text-white">{blKey}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payload Example */}
        <div className="space-y-6">
          <div className="card-glass p-8 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Code size={22} />
              </div>
              <h3 className="font-display font-bold text-lg dark:text-white tracking-tight">Exemplo de Payload</h3>
            </div>
            
            <div className="relative group">
              <pre className="bg-slate-950 text-slate-400 p-6 rounded-2xl text-[10px] leading-relaxed overflow-x-auto font-mono scrollbar-hide">
                {codeExample}
              </pre>
              <button 
                onClick={() => copyToClipboard(codeExample, 'code')}
                className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied === 'code' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>

            <ul className="mt-8 space-y-4">
              {[
                { label: 'Método', value: 'POST' },
                { label: 'Content-Type', value: 'application/json' },
                { label: 'Status Esperado', value: '201 Created' },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center justify-between border-b border-slate-50 dark:border-slate-900 pb-3 h-10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                  <span className="text-xs font-black dark:text-white tabular-nums">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-glass p-8 bg-primary text-white border-none shadow-xl shadow-primary/20">
            <h4 className="font-display font-black text-lg mb-2">Precisa de Ajuda?</h4>
            <p className="text-white/80 text-xs font-medium leading-relaxed mb-6">Nossa equipe comercial pode ajudar a configurar seu fluxo do n8n para a Maple Bear.</p>
            <button className="w-full py-3 bg-white text-primary rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <CheckCircle2 size={18} />
              <span>Suporte Técnico</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
