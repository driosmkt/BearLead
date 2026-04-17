# Diagnóstico Técnico — Bear Lead Dashboard

**Versão auditada:** 0.0.0  
**Data da auditoria:** Abril 2026  
**Stack:** React 19 + Vite + TypeScript + Tailwind CSS + Recharts  
**Avaliação geral:** 6.2 / 10 — Sólido como demo, pré-produção como produto

---

## Sumário Executivo

O projeto tem boa estrutura de componentes, design consistente e um fluxo de navegação claro. O problema central é que **toda a lógica de negócio é simulada**: dados hardcoded, sem backend, sem autenticação, sem persistência. Antes de qualquer entrega real para franqueados, os 4 bloqueadores críticos abaixo precisam ser resolvidos.

---

## Erros Críticos — Bloqueadores de Produção

### 1. Todos os dados são hardcoded

Nenhuma fonte de dados real existe no projeto. KPIs, leads, métricas de campanha e histórico de pagamentos são constantes definidas diretamente nos arquivos `.tsx`. O dashboard não reflete nenhuma realidade operacional.

**Arquivos afetados:** `DashboardView.tsx`, `LeadsView.tsx`, `CampaignsView.tsx`, `SubscriptionView.tsx`

**Solução:** Criar camada de dados com hooks React (`useLeads`, `useDashboardMetrics`) que consultam o Supabase. Os dados do n8n devem ser inseridos via webhook → Edge Function → tabelas do banco.

---

### 2. Supabase configurado mas não integrado

O arquivo `.env.local` contém apenas `GEMINI_API_KEY=PLACEHOLDER_API_KEY` — uma chave de quando o projeto era gerado no Google AI Studio, sem uso no código atual. Não há cliente Supabase instalado, nenhuma query, nenhum hook de dados reais.

**Solução:**
```bash
npm install @supabase/supabase-js
```
Criar `lib/supabase.ts` com o client, adicionar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` ao `.env.local`, definir o schema do banco.

---

### 3. Zero autenticação e controle multi-tenant

Qualquer pessoa com a URL acessa todos os dados. Não há login, sessão, nem isolamento por unidade franqueada. Para um SaaS B2B com múltiplas unidades Maple Bear, isso é um bloqueador absoluto de segurança.

**Solução:** Supabase Auth com Row Level Security (RLS) por `unit_id`. Cada usuário pertence a uma unidade, e as queries retornam apenas os dados daquela unidade.

```sql
-- Exemplo de policy RLS
CREATE POLICY "leads_por_unidade" ON leads
  FOR ALL USING (unit_id = auth.jwt() ->> 'unit_id');
```

---

### 4. Sem endpoint para receber webhooks do n8n

O projeto é um React puro (Vite) sem API routes. O plano de alimentar o sistema via n8n não tem onde chegar. Não existe nenhum receptor de webhook no projeto.

**Solução:** Criar uma Supabase Edge Function para receber os POSTs do n8n:

```
n8n → POST https://{project}.supabase.co/functions/v1/webhook-leads
      Header: Authorization: Bearer {WEBHOOK_SECRET}
      Body: { name, phone, source, program, unit_id, ... }
```

A Edge Function valida o token, normaliza o payload e executa o INSERT na tabela `leads`.

---

## Alta Prioridade — Próxima Sprint

### 5. Drag & drop do Kanban não persiste

O arrastar de cards entre colunas funciona visualmente (estado local React), mas ao recarregar a página tudo volta ao estado inicial. A função `handleDrop` em `LeadsView.tsx` apenas chama `setLeads()` sem nenhuma chamada ao banco.

**Solução:** Adicionar chamada Supabase no `handleDrop`:
```typescript
const handleDrop = async (e: React.DragEvent, status: LeadStatus) => {
  e.preventDefault();
  const leadId = e.dataTransfer.getData('leadId');
  // Otimistic UI: atualiza local primeiro
  setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
  // Persiste no banco
  await supabase.from('leads').update({ status }).eq('id', leadId);
};
```

---

### 6. Botão "+ Novo Lead" não faz nada

O botão existe em `LeadsView.tsx` mas não tem handler. Não há modal de criação, nenhum formulário, nenhuma inserção no banco. É uma feature visualmente presente e completamente não funcional.

**Solução:** Modal com formulário de criação (nome do responsável, criança, programa, origem, telefone) + INSERT no Supabase ao confirmar.

---

### 7. Sem atualização em tempo real

O header exibe "Última atualização: há 5 min" mas não há polling, WebSocket ou Supabase Realtime configurado. O número é estático.

**Solução:**
```typescript
// Em LeadsView.tsx ou hook useLeads
supabase
  .channel('leads-changes')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, 
    (payload) => setLeads(prev => [payload.new as Lead, ...prev])
  )
  .subscribe();
```

---

### 8. Filtros do Dashboard não funcionam

Os dropdowns "Este Ano" e "Todas as Origens" existem visualmente em `DashboardView.tsx` mas não têm estado, não filtram os gráficos, não disparam nenhuma query.

**Solução:** Estado global de filtros (`useContext` ou Zustand) com período e origem. Ao mudar o filtro, as queries do Supabase incluem cláusulas `WHERE created_at >= $period AND source = $origin`.

---

### 9. Ações rápidas do lead são decorativas

Os botões Ligar, WhatsApp, Agendar e Email em `LeadDetailView.tsx` existem visualmente mas não têm handlers implementados.

**Solução:**
- **WhatsApp:** `window.open('https://wa.me/' + phone.replace(/\D/g, ''))`
- **Ligar:** `window.location.href = 'tel:' + phone`
- **Email:** `window.location.href = 'mailto:' + email`
- **Agendar:** Modal de agendamento com data/hora + INSERT em tabela `appointments`

Cada ação deve também registrar um evento na `lead_history` para aparecer na linha do tempo.

---

### 10. ROI de 45.035% é matematicamente enganoso

A `SubscriptionView.tsx` calcula ROI comparando `R$ 997/mês` (custo do software) com `R$ 5.400.000` (receita anual de 150 alunos × mensalidade × 12 meses). O cálculo confunde receita do negócio com retorno do software. Vai gerar questionamentos sérios de qualquer franqueado ou investidor.

**Solução:** Reformular como "receita facilitada" com disclaimer claro:
```
Receita facilitada pelo Bear Lead: R$ 5.400.000 / ano
Investimento no Bear Lead: R$ 11.964 / ano
Relação receita/investimento: 451x
* Calculado sobre 150 matrículas atribuídas ao funil Bear Lead
```

---

## Média Prioridade — Melhorias de UX

### 11. Kanban inutilizável em mobile

6 colunas com scroll horizontal não funciona em telas menores que 768px. Em iPhone SE a instrução "arraste para o lado" é insuficiente.

**Solução:** Detectar mobile e renderizar view alternativa em lista com filtro por status (pills clicáveis no topo).

---

### 12. Sem estados de loading, erro e empty state

Nenhum componente tem skeleton, spinner ou mensagem de erro. Quando os dados demorarem (rede lenta, webhook atrasado, banco offline), as telas vão ficar em branco sem feedback.

**Solução:** Adicionar em todos os componentes que buscam dados:
- Skeleton com `animate-pulse` durante carregamento
- Empty state com ícone + mensagem quando não há dados
- Error boundary com botão de retry

---

### 13. Emoji como ícone na tela de Relatórios

A tela vazia usa `🚧` como ícone principal — inconsistente com o restante do sistema que usa Lucide React. 

**Solução:** Substituir por `<Construction size={48} />` do Lucide. Aproveitar a tela para mostrar um roadmap visual das features previstas com datas estimadas.

---

## O Que Não Faz Sentido Manter

| Item | Motivo |
|------|--------|
| `GEMINI_API_KEY` no `.env.local` | Não há uso da Gemini API no código. A IA virá via n8n/webhook. Remover. |
| `ContextView.tsx`, `DiagnosisView.tsx`, `ProposalView.tsx`, `ImpactView.tsx`, `InvestmentView.tsx` | 5 arquivos que não aparecem em nenhuma rota do `App.tsx`. Dead code de versão anterior (sales tool). Confundem quem mantém o projeto. |
| `Math.random()` para enriquecer leads | Score, owner, bestTime e probability mudam a cada render. Em produção isso é confuso e não-determinístico. Esses campos devem vir do banco. |
| `CalendarWidget` sem dados reais | Mostra agendamentos fictícios. Refatorar junto com a integração de dados ou remover temporariamente para não criar expectativa. |

---

## O Que Está Funcionando Bem

| Ponto forte | Detalhe |
|-------------|---------|
| Estrutura de componentes | Separação `pages/` vs `components/` limpa. KpiCard, LeadCard e CalendarWidget bem abstraídos e reutilizáveis. |
| TypeScript com tipos bem definidos | `types.ts` cobre Lead, LeadStatus, LeadScore, LeadHistory, MetricCardProps. Boa base para escalar. |
| LeadDetailView | A tela mais rica do produto. Pipeline steps, Resumo IA, Indicadores Inteligentes, Linha do Tempo e Ações Rápidas — estrutura certa, precisa de dados reais. |
| Dark mode consistente | Toggle funciona, classes `dark:` aplicadas corretamente em todos os componentes. |
| Drag & drop sem biblioteca externa | HTML5 Drag and Drop API nativa é decisão correta. Evita dependência pesada e funciona para o caso de uso. |
| Design system coerente | Tailwind com paleta consistente (red-600 como cor primária, slate para neutros). Recharts bem configurado. |

---

## Arquitetura Recomendada — Integração n8n → Supabase → Frontend

```
Meta Ads / Instagram / Google Ads
         ↓
       n8n (automação do lead)
         ↓ POST /webhook com payload
Supabase Edge Function
  → valida Bearer token
  → normaliza payload
  → INSERT INTO leads
         ↓
Supabase Realtime (broadcast change)
         ↓ supabase.channel('leads').on('INSERT', ...)
React Frontend
  → atualiza estado local
  → Kanban exibe novo lead em tempo real
```

### Schema mínimo sugerido

```sql
-- Unidades franqueadas
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,          -- "Maple Bear Petrolina"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id),
  name TEXT NOT NULL,
  phone TEXT,
  child_name TEXT,
  child_age INT,
  program TEXT,                -- "Bear Care", "Toddler", "Kindergarten"
  status TEXT DEFAULT 'Novo Lead',
  score TEXT,                  -- "Quente", "Morno", "Frio"
  source TEXT,                 -- "Facebook Ads", "Instagram", etc.
  owner TEXT,
  best_time TEXT,
  next_action TEXT,
  probability INT,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_contact_at TIMESTAMPTZ
);

-- Histórico de ações por lead
CREATE TABLE lead_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor TEXT,                  -- "Sistema", "Agente IA", "Consultor", "Lead"
  type TEXT,                   -- "message", "call", "system", "ai", "note"
  detail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log de webhooks recebidos
CREATE TABLE webhook_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT,
  payload JSONB,
  status TEXT,                 -- "processed", "error"
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Roadmap de Execução

| # | Tarefa | Fase | Impacto |
|---|--------|------|---------|
| 1 | Supabase Auth + schema do banco (leads, units, history) | Semana 1 | Crítico |
| 2 | Edge Function: receptor webhook n8n → INSERT leads | Semana 1 | Crítico |
| 3 | Substituir dados hardcoded por queries Supabase + loading states | Semana 2 | Crítico |
| 4 | Kanban: `handleDrop` persiste no banco + Realtime subscribe | Semana 2 | Alto |
| 5 | Modal "+ Novo Lead" com formulário de criação | Semana 3 | Alto |
| 6 | Filtros do Dashboard funcionais + KPIs dinâmicos por período | Semana 3 | Alto |
| 7 | Ações rápidas do lead (WhatsApp, Ligar, Agendar, Email) | Semana 4 | Alto |
| 8 | Remover dead code (5 views órfãs, GEMINI_KEY, Math.random) | Semana 4 | Médio |
| 9 | Relatórios: tela de roadmap com features previstas e datas | Semana 5 | Médio |
| 10 | Mobile Kanban: view em lista como alternativa ao scroll horizontal | Semana 5 | Médio |

---

*Gerado via auditoria automática — Bear Lead v0.0.0 — Abril 2026*
