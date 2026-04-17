-- ============================================================
-- BEAR LEAD — Schema do Banco de Dados
-- Execute no SQL Editor do Supabase
-- ============================================================

-- Extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABELA: units (franquias)
-- ============================================================
CREATE TABLE units (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,           -- ex: "Maple Bear Petrolina"
  slug        TEXT UNIQUE NOT NULL,    -- ex: "maple-bear-petrolina"
  city        TEXT,
  state       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: leads
-- ============================================================
CREATE TABLE leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id          UUID REFERENCES units(id) ON DELETE CASCADE,

  -- Dados do responsável
  name             TEXT NOT NULL,
  phone            TEXT,
  whatsapp         TEXT,
  email            TEXT,

  -- Dados da criança
  child_name       TEXT,
  child_age        INT,
  program          TEXT,  -- "Bear Care" | "Toddler" | "Kindergarten"

  -- Funil e qualificação
  status           TEXT NOT NULL DEFAULT 'Novo Lead',
  -- "Novo Lead" | "Em atendimento" | "Agendado" | "Visitou" | "Matriculado" | "Follow-up Recuperação" | "Perdido"

  score            TEXT,   -- "Quente" | "Morno" | "Frio"
  probability      INT,    -- 0-100
  owner            TEXT,   -- responsável comercial

  -- Origem e horário
  source           TEXT,   -- "Facebook Ads" | "Instagram" | "Google Ads" | "Google Meu Negócio" | "Indicação" | "Outros"
  best_time        TEXT,   -- "Manhã (08h-11h)" | "Tarde (14h-17h)" | "Noite (18h-20h)"
  next_action      TEXT,

  -- IA
  summary          TEXT,   -- resumo gerado pela IA

  -- Datas
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  last_contact_at  TIMESTAMPTZ,

  -- Fonte original (raw do n8n para rastreabilidade)
  raw_payload      JSONB
);

-- ============================================================
-- TABELA: lead_history (linha do tempo de ações)
-- ============================================================
CREATE TABLE lead_history (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id   UUID REFERENCES leads(id) ON DELETE CASCADE,
  action    TEXT NOT NULL,
  actor     TEXT,   -- "Sistema" | "Agente IA" | "Consultor" | "Lead"
  type      TEXT,   -- "message" | "call" | "system" | "ai" | "note"
  detail    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: webhook_log (auditoria de entradas do n8n)
-- ============================================================
CREATE TABLE webhook_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id    UUID REFERENCES units(id),
  source     TEXT,           -- origem do webhook (nome do fluxo n8n)
  payload    JSONB,          -- payload raw recebido
  status     TEXT,           -- "processed" | "error" | "duplicate"
  error_msg  TEXT,           -- mensagem de erro se status = "error"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES (performance)
-- ============================================================
CREATE INDEX idx_leads_unit_id    ON leads(unit_id);
CREATE INDEX idx_leads_status     ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_lead_history_lead_id ON lead_history(lead_id);
CREATE INDEX idx_webhook_log_created_at ON webhook_log(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE units        ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads        ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_log  ENABLE ROW LEVEL SECURITY;

-- Policy: cada usuário acessa apenas os dados da sua unidade
-- (unit_id é extraído do JWT via Supabase Auth metadata)
CREATE POLICY "leads_by_unit" ON leads
  FOR ALL USING (
    unit_id = (auth.jwt() -> 'user_metadata' ->> 'unit_id')::UUID
  );

CREATE POLICY "lead_history_by_unit" ON lead_history
  FOR ALL USING (
    lead_id IN (
      SELECT id FROM leads
      WHERE unit_id = (auth.jwt() -> 'user_metadata' ->> 'unit_id')::UUID
    )
  );

CREATE POLICY "webhook_log_by_unit" ON webhook_log
  FOR ALL USING (
    unit_id = (auth.jwt() -> 'user_metadata' ->> 'unit_id')::UUID
  );

-- ============================================================
-- SEED: unidade padrão para desenvolvimento
-- ============================================================
INSERT INTO units (name, slug, city, state)
VALUES ('Maple Bear Petrolina', 'maple-bear-petrolina', 'Petrolina', 'PE');
