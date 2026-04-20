# 🐻 Bear Lead

**Plataforma de gestão comercial para franquias Maple Bear**

Sistema SaaS B2B desenvolvido para automatizar e centralizar o funil de vendas de unidades Maple Bear — desde a captação do lead via agentes de IA até a matrícula do aluno.

---

## Stack

- **Frontend:** React 19 + Vite + TypeScript + Tailwind v4 + Recharts + Motion
- **Backend/DB:** Supabase (Auth, RLS, Realtime, Edge Functions)
- **Automação:** n8n (Agentes SDR + Closer via WhatsApp)
- **Deploy:** Vercel (frontend) + Supabase (backend)

---

## Funcionalidades

### Dashboard
- KPIs em tempo real: total de leads, agendados, matriculados, taxa de conversão
- Gráfico de fluxo semanal com dados reais do banco
- Calendário de visitas agendadas com tooltip clicável
- Lista de leads de alta probabilidade

### Central de Leads
- Kanban com 6 etapas de funil e drag-and-drop
- Vista em lista compacta
- Filtros por score, programa e origem
- Busca por nome do responsável, criança ou programa
- Modal de cadastro manual de leads

### Detalhe do Lead
- Dados completos do responsável e da criança
- Ações rápidas: Ligar, WhatsApp, E-mail, Agendar — registradas na linha do tempo
- Resumo Inteligente gerado pelo agente IA
- Card de visita confirmada com data, horário e visitantes
- Pipeline visual de 5 etapas
- Modal "Visita Realizada" com próximos passos (Matrícula ou Follow-up)
- Banner de Follow-up com campo de objeção para análise futura via IA
- Linha do tempo completa com actor (quem realizou cada ação)
- Indicadores IA: probabilidade, engajamento, interações, 1ª resposta

### Integração n8n
- Edge Function com POST (Agente SDR cria lead) e PATCH (Agente Closer agenda)
- Cálculo automático de programa por data de nascimento
- Webhook com validação de Bearer token e schema Zod
- Stub para Google Calendar (ativado via secret)

### Equipe
- Convite de membros por e-mail
- Dois níveis de acesso: Administrador e Consultor
- Gerenciamento de papéis em tempo real

### Configurações
- Foto de perfil com upload
- Edição de nome
- Troca de senha

---

## Configuração

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Preencher VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# Rodar localmente
npm run dev
```

### Variáveis de ambiente

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### Edge Function

```bash
supabase link --project-ref SEU_PROJECT_REF
supabase functions deploy webhook-leads --no-verify-jwt
supabase secrets set WEBHOOK_SECRET=seu-token-secreto
```

---

## Integração n8n

**URL do webhook:**
```
https://seu-projeto.supabase.co/functions/v1/webhook-leads
```

**Agente SDR → POST**
```json
{
  "responsible_name": "Nome do responsável",
  "whatsapp": "87999990000",
  "child_name": "Nome da criança",
  "child_birth_date": "YYYY-MM-DD",
  "source": "Facebook Ads",
  "score": "Quente",
  "ai_summary": "Resumo da conversa",
  "agent": "SDR"
}
```

**Agente Closer → PATCH**
```json
{
  "lead_id": "uuid-retornado-pelo-sdr",
  "email": "email@exemplo.com",
  "visit_date": "YYYY-MM-DD",
  "visit_time": "HH:MM",
  "status": "Agendado",
  "agent": "Closer"
}
```

---

## Roadmap

- [x] Auth email/senha + RLS por unidade
- [x] Kanban com drag-and-drop persistente
- [x] Webhook SDR → Closer end-to-end
- [x] Modal de agendamento de visita
- [x] Linha do tempo com actor
- [x] Tela de Equipe + Configurações
- [x] Tela de Relatórios
- [ ] Google Calendar (stub pronto, aguarda credenciais)
- [ ] Análise de objeções via IA (feature Premium)
- [ ] Multi-tenant — onboarding de novas unidades

---

## Unidade Piloto

**Maple Bear Petrolina (PE)**
Av. João Pernambuco, SN – Pedra do Bode, Petrolina – PE

---

*Bear Lead v0.5.0 — Abril 2026*
