import React, { useState } from 'react';
import {
  Webhook,
  Link2,
  KeyRound,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
} from 'lucide-react';
import { n8nConfig, LEAD_SOURCES, PROGRAMS } from '../lib/n8nConfig';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface FieldMapRow {
  supabaseField: string;
  label:         string;
  description:   string;
  example:       string;
}

// ─── Campos mapeáveis ─────────────────────────────────────────────────────────

const FIELD_MAP_ROWS: FieldMapRow[] = [
  { supabaseField: 'name',       label: 'Nome do responsável', description: 'Nome completo de quem entrou em contato', example: 'nome_completo' },
  { supabaseField: 'phone',      label: 'Telefone',            description: 'Número de telefone principal',           example: 'telefone' },
  { supabaseField: 'whatsapp',   label: 'WhatsApp',            description: 'Número do WhatsApp (pode ser igual ao telefone)', example: 'whatsapp' },
  { supabaseField: 'email',      label: 'E-mail',              description: 'E-mail do responsável',                 example: 'email' },
  { supabaseField: 'child_name', label: 'Nome da criança',     description: 'Nome da criança a ser matriculada',     example: 'nome_crianca' },
  { supabaseField: 'child_age',  label: 'Idade da criança',    description: 'Idade em anos (número)',                 example: 'idade' },
  { supabaseField: 'program',    label: 'Programa',            description: `Valores aceitos: ${PROGRAMS.join(', ')}`, example: 'programa' },
  { supabaseField: 'source',     label: 'Origem',              description: `Valores aceitos: ${LEAD_SOURCES.join(', ')}`, example: 'origem' },
  { supabaseField: 'summary',    label: 'Resumo IA',           description: 'Resumo gerado pelo agente IA do n8n',   example: 'resumo_ia' },
  { supabaseField: 'unit_id',    label: 'ID da unidade',       description: 'UUID da unidade franqueada no Supabase', example: 'unit_id' },
];

// ─── Helpers UI ───────────────────────────────────────────────────────────────

function StatusBadge({ filled }: { filled: boolean }) {
  return filled
    ? <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full"><CheckCircle2 size={10} /> Preenchido</span>
    : <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full"><AlertCircle size={10} /> Pendente</span>;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      title="Copiar"
    >
      {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );
}

// ─── Seção colapsável ─────────────────────────────────────────────────────────

function Section({
  icon, title, subtitle, children, defaultOpen = true,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-slate-100 dark:border-slate-800 pt-5">{children}</div>}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export const N8nConfigView: React.FC = () => {
  const [webhookUrl,    setWebhookUrl]    = useState(n8nConfig.webhookUrl);
  const [webhookSecret, setWebhookSecret] = useState(n8nConfig.webhookSecret);
  const [unitId,        setUnitId]        = useState(n8nConfig.defaults.unit_id);
  const [fieldMap,      setFieldMap]      = useState<Record<string, string>>({ ...n8nConfig.fieldMap });
  const [saved,         setSaved]         = useState(false);

  const handleFieldChange = (supabaseField: string, value: string) => {
    setFieldMap(prev => ({ ...prev, [supabaseField]: value }));
  };

  const handleSave = () => {
    // Em produção: salvar via Supabase ou variáveis de ambiente
    // Por enquanto atualiza o objeto n8nConfig em memória
    n8nConfig.webhookUrl        = webhookUrl;
    n8nConfig.webhookSecret     = webhookSecret;
    n8nConfig.defaults.unit_id  = unitId;
    Object.assign(n8nConfig.fieldMap, fieldMap);

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    console.info('[N8nConfig] Configuração salva:', { webhookUrl, fieldMap });
  };

  const filledCount = [webhookUrl, webhookSecret, unitId].filter(Boolean).length;
  const totalRequired = 3;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16 pt-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={20} className="text-amber-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Integração n8n</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Configure aqui todos os campos do fluxo n8n. Nada mais precisa ser alterado em outros arquivos.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="text-right shrink-0 ml-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{filledCount}/{totalRequired} campos essenciais</div>
          <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(filledCount / totalRequired) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Banner informativo */}
      <div className="flex gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <Info size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
          Preencha os campos abaixo quando seu sócio finalizar o fluxo no n8n. Enquanto isso, os dados de demonstração continuam aparecendo normalmente no sistema.
        </p>
      </div>

      {/* 1. Endpoint */}
      <Section
        icon={<Webhook size={18} />}
        title="Endpoint do Webhook"
        subtitle="URL gerada pelo Supabase após deploy da Edge Function"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              URL para configurar no n8n (nó "Webhook")
            </label>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
              <code className="text-xs text-slate-600 dark:text-slate-300 flex-1 font-mono truncate">
                https://&lt;seu-projeto&gt;.supabase.co/functions/v1/webhook-leads
              </code>
              <CopyButton value="https://<seu-projeto>.supabase.co/functions/v1/webhook-leads" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Substitua &lt;seu-projeto&gt; pelo ID do projeto Supabase após o deploy.</p>
          </div>
        </div>
      </Section>

      {/* 2. Credenciais */}
      <Section
        icon={<KeyRound size={18} />}
        title="Credenciais"
        subtitle="URL do webhook e token de segurança"
      >
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                URL do Webhook (n8n → Bear Lead)
              </label>
              <StatusBadge filled={!!webhookUrl} />
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                placeholder="https://n8n.seudominio.com/webhook/bear-lead"
                className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:text-white placeholder:text-slate-400"
              />
              <CopyButton value={webhookUrl} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Cole aqui a URL gerada pelo nó "Webhook" no n8n.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Token de Segurança (Bearer)
              </label>
              <StatusBadge filled={!!webhookSecret} />
            </div>
            <input
              type="password"
              value={webhookSecret}
              onChange={e => setWebhookSecret(e.target.value)}
              placeholder="ex: bear_lead_secret_2026"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:text-white placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Crie um token qualquer. Configure o mesmo valor como <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">WEBHOOK_SECRET</code> no Supabase e como Header Auth no n8n.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                UUID da Unidade Padrão
              </label>
              <StatusBadge filled={!!unitId} />
            </div>
            <input
              type="text"
              value={unitId}
              onChange={e => setUnitId(e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:text-white placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Copie da tabela <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">units</code> no Supabase após rodar o schema.sql.
            </p>
          </div>
        </div>
      </Section>

      {/* 3. Mapeamento de campos */}
      <Section
        icon={<ArrowRightLeft size={18} />}
        title="Mapeamento de Campos"
        subtitle="Qual nome cada campo tem no payload enviado pelo n8n"
        defaultOpen={false}
      >
        <div className="mb-4 flex gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
          <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Se o n8n enviar <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">nome_completo</code> e o Bear Lead esperar <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">name</code>, defina o campo da direita como <strong>nome_completo</strong>. Se os nomes já forem iguais, não precisa alterar.
          </p>
        </div>

        <div className="space-y-3">
          {FIELD_MAP_ROWS.map(row => (
            <div key={row.supabaseField} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              {/* Campo Bear Lead */}
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{row.label}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{row.supabaseField}</p>
              </div>

              {/* Seta */}
              <ArrowRightLeft size={14} className="text-slate-300 dark:text-slate-600 shrink-0" />

              {/* Campo n8n */}
              <div>
                <input
                  type="text"
                  value={fieldMap[row.supabaseField] ?? ''}
                  onChange={e => handleFieldChange(row.supabaseField, e.target.value)}
                  placeholder={row.example}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. Referência rápida */}
      <Section
        icon={<Link2 size={18} />}
        title="Estrutura esperada do payload"
        subtitle="Exemplo de JSON que o n8n deve enviar para o Bear Lead"
        defaultOpen={false}
      >
        <pre className="text-[11px] leading-relaxed bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 overflow-x-auto text-slate-600 dark:text-slate-300 font-mono">
{`POST /functions/v1/webhook-leads
Authorization: Bearer <WEBHOOK_SECRET>
Content-Type: application/json

{
  "name":       "Maria da Silva",
  "phone":      "(87) 99123-4567",
  "whatsapp":   "(87) 99123-4567",
  "email":      "maria@email.com",
  "child_name": "João",
  "child_age":  3,
  "program":    "Toddler",
  "source":     "Facebook Ads",
  "summary":    "Mãe interessada no programa Toddler. Perguntou sobre valores.",
  "unit_id":    "<UUID-DA-UNIDADE>"
}`}
        </pre>
        <p className="text-[11px] text-slate-400 mt-3">
          Os nomes dos campos acima podem ser diferentes no n8n — use o mapeamento da seção anterior para ajustar.
        </p>
      </Section>

      {/* Botão salvar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={16} />
            Configuração salva
          </span>
        )}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <CheckCircle2 size={16} />
          Salvar Configuração
        </button>
      </div>

    </div>
  );
};
